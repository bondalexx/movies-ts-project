import './styles.scss';

import { MoviesType } from './models/movies.interface';
import Renderer from './components/Renderer';
import Pagination from './components/Pagination';
import MoviesHandler from './components/MoviesHandler';

export const movieWrapper: HTMLDivElement = document.querySelector(
	'.body-movie-content-wrapper'
);
export const paginationContainer: HTMLDivElement = document.querySelector(
	'.pagination-container'
);
export const searchInput: HTMLInputElement = document.querySelector(
	'.header-seacrh-input'
);
const movieContentList: HTMLDivElement = document.querySelector(
	'.movie-content-list'
);
const movieDetails: HTMLDivElement = document.querySelector('.movie-details');
export const detailsContainer: HTMLDivElement =
	document.querySelector('.details-container');
export const selectMoviesTypeContainer: HTMLSelectElement =
	document.querySelector('.select-movie-rates');
export const filterGenreBody: HTMLDivElement =
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

export const moviesType: MoviesType[] = [
	{ value: 'top_rated', title: 'Top Rated' },
	{ value: 'popular', title: 'Popular' },
	{ value: 'upcoming', title: 'Upcoming' },
];

export const onMovieClick = (event: PointerEvent): void => {
	movieContentList.style.display = 'none';
	movieDetails.style.display = 'flex';

	const movieId: number = parseInt(
		(event.target as Element).parentElement.getAttribute('data-movie-id')
	);

	moviesHandler.getMovieById(movieId);
};

export const onChooseGenre = (event: PointerEvent): void => {
	const genreId: number = parseInt(
		(event.target as Element).getAttribute('data-genre-id')
	);

	if (moviesHandler.genresToSend.length === 0) {
		moviesHandler.genresToSend.push(genreId);
	} else {
		const isGenresIdIncluded: boolean = moviesHandler.genresToSend.some(
			(genre: number) => genre === genreId
		);
		const genreIndex: number = moviesHandler.genresToSend.indexOf(genreId);

		if (isGenresIdIncluded) {
			moviesHandler.genresToSend.splice(genreIndex, 1);
		} else {
			moviesHandler.genresToSend.push(genreId);
		}
	}
};

const onBack = (): void => {
	movieDetails.style.display = 'none';
	movieContentList.style.display = 'flex';
};

const onSearch = (): void => {
	pagination.currentPage = 1;
	moviesHandler.getMoviesOnCondition(
		'search',
		pagination.currentPage,
		'searchMovie'
	);
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const onSelectMoviesType = async (event: any): Promise<void> => {
	pagination.currentPage = 1;
	moviesHandler.getMoviesOnCondition(
		event.target.value,
		pagination.currentPage,
		'selectMoviesType'
	);
};

const onApplyFilter = (): void => {
	pagination.currentPage = 1;
	moviesHandler.getMoviesOnCondition(
		'genresFiltered',
		pagination.currentPage,
		'applyGenresFilter'
	);
};

const moviesHandler = new MoviesHandler();
export const pagination = new Pagination();
const renderer = new Renderer(
	movieWrapper,
	detailsContainer,
	filterGenreBody,
	selectMoviesTypeContainer,
	onMovieClick,
	onChooseGenre
);

renderer.renderMoviesTypes(moviesType);
moviesHandler.getGenres('top_rated', pagination.currentPage, 'getMovies');

searchBtn.addEventListener('click', onSearch, false);
selectMoviesType.addEventListener('change', onSelectMoviesType, false);
applyFilterBtn.addEventListener('click', onApplyFilter, false);
detailBackBtn.addEventListener('click', onBack, false);
