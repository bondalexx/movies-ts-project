import axios, { AxiosResponse } from 'axios';

import './styles.scss';

import { Genre } from './models/genres.interfarce';
import { Movie, MoviesType } from './models/movies.interface';

const movieWrapper: HTMLDivElement = document.querySelector(
	'.body-movie-content-wrapper'
);
const paginationContainer: HTMLDivElement = document.querySelector(
	'.pagination-container'
);
const searchInput: HTMLInputElement = document.querySelector(
	'.header-seacrh-input'
);
const movieContentList: HTMLDivElement = document.querySelector(
	'.movie-content-list'
);
const movieDetails: HTMLDivElement = document.querySelector('.movie-details');
const detailsContainer: HTMLDivElement =
	document.querySelector('.details-container');
const selectMoviesTypeContainer: HTMLSelectElement = document.querySelector(
	'.select-movie-rates'
);
const filterGenreBody: HTMLDivElement =
	document.querySelector('.filter-genre-body');
const searchBtn: HTMLButtonElement = document.querySelector('.search-btn');
const selectMoviesType: HTMLSelectElement = document.querySelector(
	'.select-movie-rates'
);
const applyFilterBtn: HTMLButtonElement =
	document.querySelector('.apply-genres-btn');
const detailBackBtn: HTMLButtonElement = document.querySelector(
	'.detail-back-button'
);

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'e1036725d4b220e51c48c798d13bcf37';
const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w500';

let currentPage = 1;
let genres: Genre[];
let paginationNumberArr: number[] = [];
let pageIndex = 0;
let currentRequestType = 'top_rated';

const pages: number[] = [];
const moviesType: MoviesType[] = [
	{ value: 'top_rated', title: 'Top Rated' },
	{ value: 'popular', title: 'Popular' },
	{ value: 'upcoming', title: 'Upcoming' },
];
const genresToSend: number[] = [];

const getMoviesOnCondition = async (
	requestType: string,
	page: number,
	action: string
): Promise<void> => {
	let url = '';

	currentRequestType = requestType;

	const isRequestTypeIncluded: boolean = moviesType.some(
		movieType => movieType.value === requestType
	);

	if (isRequestTypeIncluded) {
		url = `${API_URL}/movie/${requestType}?api_key=${API_KEY}&page=${page}`;
	} else if (requestType === 'search' && !searchInput.value) {
		url = `${API_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`;
	} else if (requestType === 'genresFiltered') {
		url = `${API_URL}/discover/movie?api_key=${API_KEY}&page=${page}&with_genres=${genresToSend}`;
	} else {
		url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${searchInput.value}&page=${page}`;
	}

	try {
		const moviesData: AxiosResponse = await axios.get(url);

		const movies: Movie[] = moviesData.data.results.map((movie: Movie) => {
			const genresName: string[] = movie.genre_ids.map((genreId: number) => {
				return genres.filter((genre: Genre) => genre.id === genreId)[0].name;
			});

			return {
				image: IMAGE_BASE_URL + movie.poster_path,
				title: movie.title,
				year: movie.release_date,
				genre: genresName,
				movieId: movie.id,
			};
		});

		renderPages(moviesData.data.total_pages, action);
		renderMovie(movies);
	} catch (err) {}
};

const getMovieById = async (movieId: number): Promise<void> => {
	try {
		const movieByIdData: AxiosResponse = await axios.get(
			`${API_URL}/movie/${movieId}?api_key=${API_KEY}`
		);

		const genresName: string[] = movieByIdData.data.genres.map(
			(genre: Genre) => genre.name
		);

		const movieObjById: Movie = {
			image: IMAGE_BASE_URL + movieByIdData.data.poster_path,
			title: movieByIdData.data.title,
			year: movieByIdData.data.release_date,
			genre: genresName,
			overview: movieByIdData.data.overview,
			vote_average: movieByIdData.data.vote_average,
		};

		renderDetailsPage(movieObjById);
	} catch (err) {}
};

const getGenres = async (): Promise<void> => {
	try {
		const genresData: AxiosResponse = await axios.get(
			`${API_URL}/genre/movie/list?api_key=${API_KEY}`
		);
		genres = genresData.data.genres;

		renderGenres();
	} catch (err) {}
};

const pageHanlder = (action: string, event: PointerEvent): void => {
	const page: number = parseInt(
		(event.target as Element).getAttribute('data-page-i')
	);

	if (action === 'pageClick') {
		currentPage = page;
	}

	getMoviesOnCondition(currentRequestType, currentPage, action);
};

const onMovieClick = (event: PointerEvent): void => {
	movieContentList.style.display = 'none';
	movieDetails.style.display = 'flex';

	const movieId: number = parseInt(
		(event.target as Element).parentElement.getAttribute('data-movie-id')
	);

	getMovieById(movieId);
};

const onBack = (): void => {
	movieDetails.style.display = 'none';
	movieContentList.style.display = 'flex';
};

const onSearch = (): void => {
	currentPage = 1;
	getMoviesOnCondition('search', currentPage, 'searchMovie');
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const onSelectMoviesType = async (event: any): Promise<void> => {
	currentPage = 1;
	getMoviesOnCondition(event.target.value, currentPage, 'selectMoviesType');
};

const onChooseGenre = (event: PointerEvent): void => {
	const genreId: number = parseInt(
		(event.target as Element).getAttribute('data-genre-id')
	);

	if (genresToSend.length === 0) {
		genresToSend.push(genreId);
	} else {
		const isGenresIdIncluded: boolean = genresToSend.some(
			(genre: number) => genre === genreId
		);
		const genreIndex: number = genresToSend.indexOf(genreId);

		if (isGenresIdIncluded) {
			genresToSend.splice(genreIndex, 1);
		} else {
			genresToSend.push(genreId);
		}
	}
};

const onApplyFilter = (): void => {
	currentPage = 1;
	getMoviesOnCondition('genresFiltered', currentPage, 'applyGenresFilter');
};

const renderMovie = (movies: Movie[]): void => {
	movieWrapper.innerHTML = '';

	movies.forEach((movie: Movie) => {
		movieWrapper.innerHTML += `<div data-movie-id="${movie.movieId}" class="movie-card">
			<img src="${movie.image}" class="movie-logo-img" />
			<div class="movie-details-info">
					<p class="movie-title">${movie.title}</p>
					<p class="movie-year">${movie.year}</p>
					<p class="movie-genre">${movie.genre}</p>
			</div>
		</div>`;
	});

	document.querySelectorAll('.movie-card').forEach((mc: HTMLDivElement) => {
		mc.addEventListener('click', onMovieClick, false);
	});
};

const renderDetailsPage = (movieById: Movie): void => {
	detailsContainer.innerHTML = '';

	detailsContainer.innerHTML += `	<div class="movie-vote-average-container">
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
};

const renderGenres = (): void => {
	genres.forEach((genre: Genre) => {
		filterGenreBody.innerHTML += `<div class="body-filter-body">	
		<input type="checkbox" data-genre-id="${genre.id}" class="filtered-checkboxes" />
		<p class="body-filter-movie-type">${genre.name}</p>
	</div>`;
	});

	document
		.querySelectorAll('.filtered-checkboxes')
		.forEach((fc: HTMLInputElement) => {
			fc.addEventListener('click', onChooseGenre, false);
		});
};

const renderMoviesTypes = (): void => {
	moviesType.forEach((movieType: MoviesType) => {
		selectMoviesTypeContainer.innerHTML += `<option class="filter-optoin" value="${movieType.value}">
		${movieType.title}
	</option>`;
	});
};

const renderPages = (totalPages: number, action: string): void => {
	paginationContainer.innerHTML = '';

	for (let i = 1; i <= totalPages; i++) {
		pages.push(i);
	}

	if (action === 'searchMovie' || action === 'selectMoviesType') {
		pageIndex = 0;
	}

	if (currentPage === paginationNumberArr[paginationNumberArr.length - 1]) {
		pageIndex = currentPage - 1;
	}

	if (
		paginationNumberArr[0] === currentPage &&
		currentPage !== 1 &&
		action === 'pageClick'
	) {
		if (currentPage === 4) {
			pageIndex = 0;
		} else {
			pageIndex = currentPage - 5;
		}
	}

	paginationNumberArr = pages.slice(pageIndex, pageIndex + 5);

	for (let i = 0; i < paginationNumberArr.length; i++) {
		const markup = `<button data-page-i="${
			paginationNumberArr[i]
		}" class="pagination ${
			currentPage === paginationNumberArr[i] ? 'active' : ''
		}">${paginationNumberArr[i]}</button>`;

		paginationContainer.innerHTML += markup;
	}

	document.querySelectorAll('.pagination').forEach((p: HTMLButtonElement) => {
		p.addEventListener(
			'click',
			(event: PointerEvent) => {
				pageHanlder('pageClick', event);
			},
			false
		);
	});
};

renderMoviesTypes();
getGenres();
getMoviesOnCondition('top_rated', currentPage, 'getMovies');

searchBtn.addEventListener('click', onSearch, false);
selectMoviesType.addEventListener('change', onSelectMoviesType, false);
applyFilterBtn.addEventListener('click', onApplyFilter, false);
detailBackBtn.addEventListener('click', onBack, false);
