import './styles.scss';

import { MoviesType } from './models/movies.interface';
import Renderer from './components/Renderer';
import MoviesHandler from './components/MoviesHandler';
import Pagination from './components/Pagination';
import ActionHandler from './components/ActionHandler';

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

export const actionHandler = new ActionHandler();
export const moviesHandler = new MoviesHandler();
export const pagination = new Pagination();
const renderer = new Renderer(
	actionHandler.onMovieClick,
	actionHandler.onChooseGenre
);

renderer.renderMoviesTypes(moviesType);
moviesHandler.getGenres('top_rated', 1, 'getMovies');

searchBtn.addEventListener('click', actionHandler.onSearch, false);
selectMoviesType.addEventListener(
	'change',
	actionHandler.onSelectMoviesType,
	false
);
applyFilterBtn.addEventListener('click', actionHandler.onApplyFilter, false);
detailBackBtn.addEventListener('click', actionHandler.onBack, false);
