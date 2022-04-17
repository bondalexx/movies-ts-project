import { actionHandler, moviesHandler, renderer } from '..';
import { moviesType } from '../constants/movie.constants';

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
