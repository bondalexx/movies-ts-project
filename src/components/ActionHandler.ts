import { moviesHandler, pagination } from './Main';

class ActionHandler {
	private movieContentList: HTMLDivElement = document.querySelector(
		'.movie-content-list'
	);
	private movieDetails: HTMLDivElement =
		document.querySelector('.movie-details');

	public onMovieClick(event: PointerEvent): void {
		this.movieContentList.style.display = 'none';
		this.movieDetails.style.display = 'flex';

		const movieId: number = parseInt(
			(event.target as Element).parentElement.getAttribute('data-movie-id')
		);

		moviesHandler.getMovieById(movieId);
	}

	public onChooseGenre(event: PointerEvent): void {
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
	}

	public onBack(): void {
		this.movieDetails.style.display = 'none';
		this.movieContentList.style.display = 'flex';
	}

	public onSearch(): void {
		pagination.currentPage = 1;
		moviesHandler.getGenres('search', pagination.currentPage, 'searchMovie');
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	public async onSelectMoviesType(event: any): Promise<void> {
		pagination.currentPage = 1;
		moviesHandler.getGenres(
			event.target.value,
			pagination.currentPage,
			'selectMoviesType'
		);
	}

	public onApplyFilter(): void {
		pagination.currentPage = 1;
		moviesHandler.getGenres(
			'genresFiltered',
			pagination.currentPage,
			'applyGenresFilter'
		);
	}
}

export default ActionHandler;
