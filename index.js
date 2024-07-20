const apiKey = "f4cc1001";

let searchInput = document.getElementById("Input");

document.querySelector("button").addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

async function searchMovies(filter) {
  let movies = [];

  let loadingElement = document.getElementById("loading");
  let moviesListElement = document.querySelector(".movies__list");

  loadingElement.style.display = "block";

  moviesListElement.innerHTML = "";

  let query = searchInput.value || "all";
  const url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  if (data.Response === "True") {
    movies = await Promise.all(
      data.Search.map(async (movie) => {
        const url = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`;
        const res = await fetch(url);
        const movieData = await res.json();
        return movieData;
      })
    );

    if (filter === "RATING") {
      movies.sort((a, b) => b.imdbRating - a.imdbRating);
    } else if (filter === "RELEASE_DATE") {
      movies.sort((a, b) => a.Year - b.Year);
    } else if (filter === "RUNTIME") {
      movies.sort((a, b) => parseInt(a.Runtime) - parseInt(b.Runtime));
    } else if (filter === "ALPHABETICAL") {
      movies.sort((a, b) => a.Title.localeCompare(b.Title));
    }

    const movieHtml = movies
      .map(
        (movie) => `
      <div class="movie">
      <img src="${movie.Poster}" alt="${movie.Title}" class="movie__poster"/>
      <h1 class="movie__title">${movie.Title}</h1>
      <h3 class="movie__year">${movie.Year}</h3>
        <h3> ${movie.Genre}</h3>
        <h3>Rating: ${movie.imdbRating} / 10</h3>
        <h3>Runtime: ${movie.Runtime}</h3>
        <h3>Director: ${movie.Director}</h3>
        <h3>${movie.Plot}</h3>
      </div>
    `
      )
      .join("");

    document.querySelector(".movies__list").innerHTML = movieHtml;
  } else {
    document.querySelector(
      ".movies__list"
    ).innerHTML = `<h3>${data.Error}</h3>`;
  }
  loadingElement.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  searchMovies();
});

function filterMovies(event) {
  searchMovies(event.target.value);
}
