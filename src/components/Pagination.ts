import { paginationContainer } from '..';
import MoviesHandler from './MoviesHandler';

class Pagination {
	private pages: number[] = [];
	private paginationNumberArr: number[] = [];
	private pageIndex = 0;
	private _currentPage = 1;

	private movieHandler: MoviesHandler = new MoviesHandler();

	public get currentPage(): number {
		return this._currentPage;
	}

	public set currentPage(value: number) {
		this._currentPage = value;
	}

	public pageHanlder(
		action: string,
		event: PointerEvent,
		currentRequestType: string
	): void {
		const page: number = parseInt(
			(event.target as Element).getAttribute('data-page-i')
		);

		if (action === 'pageClick') {
			this.currentPage = page;
		}

		this.movieHandler.getMoviesOnCondition(
			currentRequestType,
			this.currentPage,
			action
		);
	}

	public renderPages(
		totalPages: number,
		action: string,
		currentRequestType: string
	): void {
		paginationContainer.innerHTML = '';

		for (let i = 1; i <= totalPages; i++) {
			this.pages.push(i);
		}

		if (action === 'searchMovie' || action === 'selectMoviesType') {
			this.pageIndex = 0;
		}

		if (
			this.currentPage ===
			this.paginationNumberArr[this.paginationNumberArr.length - 1]
		) {
			this.pageIndex = this.currentPage - 1;
		}

		if (
			this.paginationNumberArr[0] === this.currentPage &&
			this.currentPage !== 1 &&
			action === 'pageClick'
		) {
			if (this.currentPage === 4) {
				this.pageIndex = 0;
			} else {
				this.pageIndex = this.currentPage - 5;
			}
		}

		this.paginationNumberArr = this.pages.slice(
			this.pageIndex,
			this.pageIndex + 5
		);

		for (let i = 0; i < this.paginationNumberArr.length; i++) {
			const markup = `<button data-page-i="${
				this.paginationNumberArr[i]
			}" class="pagination ${
				this.currentPage === this.paginationNumberArr[i] ? 'active' : ''
			}">${this.paginationNumberArr[i]}</button>`;

			paginationContainer.innerHTML += markup;
		}

		document.querySelectorAll('.pagination').forEach((p: HTMLButtonElement) => {
			p.addEventListener(
				'click',
				(event: PointerEvent) => {
					this.pageHanlder('pageClick', event, currentRequestType);
				},
				false
			);
		});
	}
}

export default Pagination;
