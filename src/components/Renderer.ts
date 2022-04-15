import { Genre } from '../models/genres.interfarce';
import { Movie, MoviesType } from '../models/movies.interface';

class Renderer {
	constructor(
		public movieWrapper: HTMLDivElement,
		public detailsContainer: HTMLDivElement,
		public filterGenreBody: HTMLDivElement,
		public selectMoviesTypeContainer: HTMLSelectElement,
		public onMovieClick: (event: PointerEvent) => void,
		public onChooseGenre: (event: PointerEvent) => void
	) {}

	public renderMovie(movies: Movie[]): void {
		this.movieWrapper.innerHTML = '';

		movies.forEach((movie: Movie) => {
			this.movieWrapper.innerHTML += `<div data-movie-id="${movie.movieId}" class="movie-card">
        <img src="${movie.image}" class="movie-logo-img" />
        <div class="movie-details-info">
            <p class="movie-title">${movie.title}</p>
            <p class="movie-year">${movie.year}</p>
            <p class="movie-genre">${movie.genre}</p>
        </div>
      </div>`;
		});

		document.querySelectorAll('.movie-card').forEach((mc: HTMLDivElement) => {
			mc.addEventListener('click', this.onMovieClick, false);
		});
	}

	public renderDetailsPage(movieById: Movie): void {
		this.detailsContainer.innerHTML = '';

		this.detailsContainer.innerHTML += `	<div class="movie-vote-average-container">
      <img
        class="movie-img"
        src="${movieById.image}"
      />
      <div class="vote-average-container">
      <p class="vote-average-header">Vote Average:</p>
        <p class="vote-average-sign">${movieById.vote_average}</p>
      </div>
    </div>
    <div class="movie-details-sign-container">
      <div class="title-details">
        <p class="movie-details-sign">Title:</p>
        <p class="detail-info-sign detail-title">${movieById.title}</p>
      </div>
      <div>
        <p class="movie-details-sign">Year:</p>
        <p class="detail-info-sign">${movieById.year}</p>
      </div>
      <div>
        <p class="movie-details-sign">Genre:</p>
        <p class="detail-info-sign">${movieById.genre}</p>
      </div>
      <div>
        <p class="movie-details-sign">Overview:</p>
        <p class="detail-overview">${movieById.overview}</p>
      </div>
    </div>`;
	}

	public renderGenres(genres: Genre[]): void {
		genres.forEach((genre: Genre) => {
			this.filterGenreBody.innerHTML += `<div class="body-filter-body">	
      <input type="checkbox" data-genre-id="${genre.id}" class="filtered-checkboxes" />
      <p class="body-filter-movie-type">${genre.name}</p>
    </div>`;
		});

		document
			.querySelectorAll('.filtered-checkboxes')
			.forEach((fc: HTMLInputElement) => {
				fc.addEventListener('click', this.onChooseGenre, false);
			});
	}

	public renderMoviesTypes(moviesType: MoviesType[]): void {
		moviesType.forEach((movieType: MoviesType) => {
			this.selectMoviesTypeContainer.innerHTML += `<option class="filter-optoin" value="${movieType.value}">
      ${movieType.title}
    </option>`;
		});
	}
}

export default Renderer;
