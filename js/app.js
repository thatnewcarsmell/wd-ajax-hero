(function () {
  'use strict';

  const movies = [];

  const renderMovies = function () {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({
        delay: 50
      }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  var inputField = document.getElementById('search');
  var searchButton = document.querySelector('button');

  searchButton.addEventListener('click', callMyAPI);

  function callMyAPI() {
    let results = [];
    event.preventDefault();
    let APICall = formatURL(checkMyInput());
    if (APICall === undefined) {
      return console.log('Enter some damn text!');
    }
    movies.length = 0;
    fetch(APICall)
      .then((response) => response.json())
      .then((data) => {
        let results = data.Search;
        results.reduce((tally, movie) => {
          movies.push({
            id: movie.imdbID,
            poster: movie.Poster,
            title: movie.Title,
            year: movie.Year,
          })
          return tally;
        }, []);
        renderMovies();
      })
  };

  function checkMyInput() {
    event.preventDefault();
    let keywords = "";
    if (inputField.value !== "") {
      keywords = inputField.value;
      inputField.value = "";
      inputField.setAttribute('placeholder', 'Enter movie title e.g. Jumanji');
      return keywords;
    } else {
      inputField.setAttribute('placeholder', 'Please enter keywords to search for a movie...');
      return;
    }
  }

  function formatURL(stringToFormat) {
    let APICall = 'https://omdb-api.now.sh/?s='
    if (stringToFormat === undefined) {
      return;
    }
    for (let i = 0; i < stringToFormat.length; i++) {
      if (stringToFormat[i] !== " ") {
        APICall += stringToFormat[i];
      } else if (stringToFormat[i] === " ") {
        APICall += "+";
      }
    }
    return APICall;
  }

})();