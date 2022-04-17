import { moviesType } from '../constants/movie.constants';
import ActionHandler from './ActionHandler';
import MoviesHandler from './MoviesHandler';
import Pagination from './Pagination';
import Renderer from './Renderer';

export const actionHandler: ActionHandler = new ActionHandler();
export const moviesHandler: MoviesHandler = new MoviesHandler();
export const pagination: Pagination = new Pagination();
export const renderer: Renderer = new Renderer(
	actionHandler.onMovieClick,
	actionHandler.onChooseGenre
);

class Main {
	private searchBtn: HTMLButtonElement = document.querySelector('.search-btn');
	private selectMoviesType: HTMLSelectElement = document.querySelector(
		'.select-movie-rates'
	);
	private applyFilterBtn: HTMLButtonElement =
		document.querySelector('.apply-genres-btn');
	private detailBackBtn: HTMLButtonElement = document.querySelector(
		'.detail-back-button'
	);

	public init() {
		renderer.renderMoviesTypes(moviesType);
		moviesHandler.getGenres('top_rated', 1, 'getMovies');

		this.searchBtn.addEventListener('click', actionHandler.onSearch, false);
		this.selectMoviesType.addEventListener(
			'change',
			actionHandler.onSelectMoviesType,
			false
		);
		this.applyFilterBtn.addEventListener(
			'click',
			actionHandler.onApplyFilter,
			false
		);
		this.detailBackBtn.addEventListener('click', actionHandler.onBack, false);
	}
}

export default Main;
