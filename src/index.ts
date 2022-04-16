import './styles.scss';

import { Genre } from './models/genres.interfarce';
import { MoviesType } from './models/movies.interface';
import Renderer from './components/Renderer';
import Pagination from './components/Pagination';
import MovieService from './components/MovieService';
import GetMovie from './components/GetMovies';

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

let genres: Genre[];

export const moviesType: MoviesType[] = [
	{ value: 'top_rated', title: 'Top Rated' },
	{ value: 'popular', title: 'Popular' },
	{ value: 'upcoming', title: 'Upcoming' },
];

const onMovieClick = (event: PointerEvent): void => {
	movieContentList.style.display = 'none';
	movieDetails.style.display = 'flex';

	const movieId: number = parseInt(
		(event.target as Element).parentElement.getAttribute('data-movie-id')
	);

	getMovie.getMovieById(movieId);
};

const onChooseGenre = (event: PointerEvent): void => {
	const genreId: number = parseInt(
		(event.target as Element).getAttribute('data-genre-id')
	);

	if (getMovie.genresToSend.length === 0) {
		getMovie.genresToSend.push(genreId);
	} else {
		const isGenresIdIncluded: boolean = getMovie.genresToSend.some(
			(genre: number) => genre === genreId
		);
		const genreIndex: number = getMovie.genresToSend.indexOf(genreId);

		if (isGenresIdIncluded) {
			getMovie.genresToSend.splice(genreIndex, 1);
		} else {
			getMovie.genresToSend.push(genreId);
		}
	}
};

const onBack = (): void => {
	movieDetails.style.display = 'none';
	movieContentList.style.display = 'flex';
};

const onSearch = (): void => {
	pagination.currentPage = 1;
	getMovie.getMoviesOnCondition(
		'search',
		pagination.currentPage,
		'searchMovie'
	);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const onSelectMoviesType = async (event: any): Promise<void> => {
	pagination.currentPage = 1;
	getMovie.getMoviesOnCondition(
		event.target.value,
		pagination.currentPage,
		'selectMoviesType'
	);
};

const onApplyFilter = (): void => {
	pagination.currentPage = 1;
	getMovie.getMoviesOnCondition(
		'genresFiltered',
		pagination.currentPage,
		'applyGenresFilter'
	);
};

const getMovie = new GetMovie(searchInput, genres);
export const pagination = new Pagination(
	paginationContainer,
	getMovie.getMoviesOnCondition
);
export const movieService = new MovieService();
export const renderer = new Renderer(
	movieWrapper,
	detailsContainer,
	filterGenreBody,
	selectMoviesTypeContainer,
	onMovieClick,
	onChooseGenre
);

renderer.renderMoviesTypes(moviesType);
getMovie.getGenres();
getMovie.getMoviesOnCondition('top_rated', pagination.currentPage, 'getMovies');

searchBtn.addEventListener('click', onSearch, false);
selectMoviesType.addEventListener('change', onSelectMoviesType, false);
applyFilterBtn.addEventListener('click', onApplyFilter, false);
detailBackBtn.addEventListener('click', onBack, false);
