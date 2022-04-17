import { AxiosResponse } from 'axios';

import { Movie } from '../models/movies.interface';
import { API_CONFIG } from '../environment/api';
import { Genre } from '../models/genres.interfarce';
import {
	detailsContainer,
	filterGenreBody,
	movieWrapper,
	onChooseGenre,
	onMovieClick,
	pagination,
	searchInput,
	selectMoviesTypeContainer,
} from '..';
import { moviesType } from '..';
import MovieService from './MovieService';
import Renderer from './Renderer';

class MoviesHandler {
	public _genresToSend: number[] = [];

	private currentRequestType = 'top_rated';
	private _genres: Genre[] = [];
	private movieService: MovieService = new MovieService();
	private renderer: Renderer = new Renderer(
		movieWrapper,
		detailsContainer,
		filterGenreBody,
		selectMoviesTypeContainer,
		onMovieClick,
		onChooseGenre
	);

	public get genresToSend(): number[] {
		return this._genresToSend;
	}

	public set genresToSend(v: number[]) {
		this._genresToSend = v;
	}

	public get genres(): Genre[] {
		return this._genres;
	}

	public set genres(v: Genre[]) {
		this._genres = v;
	}

	public async getMoviesOnCondition(
		requestType: string,
		page: number,
		action: string
	): Promise<void> {
		let url = '';
		this.currentRequestType = requestType;

		const isRequestTypeIncluded: boolean = moviesType.some(
			movieType => movieType.value === requestType
		);

		if (isRequestTypeIncluded) {
			url = `${API_CONFIG.apiUrl}/movie/${requestType}?api_key=${API_CONFIG.apiKey}&page=${page}`;
		} else if (requestType === 'search' && !searchInput.value) {
			url = `${API_CONFIG.apiUrl}/movie/top_rated?api_key=${API_CONFIG.apiKey}&page=${page}`;
		} else if (requestType === 'genresFiltered') {
			url = `${API_CONFIG.apiUrl}/discover/movie?api_key=${API_CONFIG.apiKey}&page=${page}&with_genres=${this.genresToSend}`;
		} else {
			url = `${API_CONFIG.apiUrl}/search/movie?api_key=${API_CONFIG.apiKey}&query=${searchInput.value}&page=${page}`;
		}

		try {
			const moviesData: AxiosResponse = await this.movieService.getRequest(url);

			const movies = moviesData.data.results.map((movie: Movie) => {
				const genresName: string[] = movie.genre_ids.map((genreId: number) => {
					return this.genres.filter(genre => genre.id === genreId)[0].name;
				});

				return {
					image: API_CONFIG.imageBaseUrl + movie.poster_path,
					title: movie.title,
					year: movie.release_date,
					genre: genresName,
					movieId: movie.id,
				};
			});

			pagination.renderPages(
				moviesData.data.total_pages,
				action,
				this.currentRequestType
			);
			this.renderer.renderMovie(movies);
		} catch (error) {}
	}

	public async getMovieById(movieId: number): Promise<void> {
		try {
			const url = `${API_CONFIG.apiUrl}/movie/${movieId}?api_key=${API_CONFIG.apiKey}`;
			const movieByIdData = await this.movieService.getRequest(url);
			const genresName: string[] = movieByIdData.data.genres.map(
				(genre: Genre) => genre.name
			);
			const movieObjById: Movie = {
				image: API_CONFIG.imageBaseUrl + movieByIdData.data.poster_path,
				title: movieByIdData.data.title,
				year: movieByIdData.data.release_date,
				genre: genresName,
				overview: movieByIdData.data.overview,
				vote_average: movieByIdData.data.vote_average,
			};

			this.renderer.renderDetailsPage(movieObjById);
		} catch (error) {}
	}

	public async getGenres(
		requestType: string,
		page: number,
		action: string
	): Promise<void> {
		try {
			const url = `${API_CONFIG.apiUrl}/genre/movie/list?api_key=${API_CONFIG.apiKey}`;
			const genresResponse = await this.movieService.getRequest(url);

			this.genres = genresResponse.data.genres;
			this.renderer.renderGenres(this.genres);
			this.getMoviesOnCondition(requestType, page, action);
		} catch (error) {}
	}
}

export default MoviesHandler;
