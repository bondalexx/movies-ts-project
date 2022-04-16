import { AxiosResponse } from 'axios';
import { Movie } from '../models/movies.interface';
import { API_CONFIG } from '../environment/api';
import { movieService } from '..';
import { Genre } from '../models/genres.interfarce';
import { pagination } from '..';
import { renderer } from '..';
import { moviesType } from '..';

class GetMovie {
	public genresToSend: number[] = [];
	private currentRequestType = 'top_rated';
	private url = '';

	constructor(private searchInput: HTMLInputElement, private genres: Genre[]) {}

	public async getMoviesOnCondition(
		requestType: string,
		page: number,
		action: string
	): Promise<void> {
		this.currentRequestType = requestType;

		const isRequestTypeIncluded: boolean = moviesType.some(
			movieType => movieType.value === requestType
		);

		if (isRequestTypeIncluded) {
			this.url = `${API_CONFIG.apiUrl}/movie/${requestType}?api_key=${API_CONFIG.apiKey}&page=${page}`;
		} else if (requestType === 'search' && !this.searchInput.value) {
			this.url = `${API_CONFIG.apiUrl}/movie/top_rated?api_key=${API_CONFIG.apiKey}&page=${page}`;
		} else if (requestType === 'genresFiltered') {
			this.url = `${API_CONFIG.apiUrl}/discover/movie?api_key=${API_CONFIG.apiKey}&page=${page}&with_genres=${this.genresToSend}`;
		} else {
			this.url = `${API_CONFIG.apiUrl}/search/movie?api_key=${API_CONFIG.apiKey}&query=${this.searchInput.value}&page=${page}`;
		}

		const moviesData: AxiosResponse = await movieService.getRequest(this.url);
		console.log(this.genres);
		console.log(moviesData.data.results);

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
		renderer.renderMovie(movies);
	}

	async getMovieById(movieId: number): Promise<void> {
		const url = `${API_CONFIG.apiUrl}/movie/${movieId}?api_key=${API_CONFIG.apiKey}`;
		const movieByIdData = await movieService.getRequest(url);
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

		renderer.renderDetailsPage(movieObjById);
	}

	async getGenres(): Promise<void> {
		const url = `${API_CONFIG.apiUrl}/genre/movie/list?api_key=${API_CONFIG.apiKey}`;
		const genresResponse = await movieService.getRequest(url);
		this.genres = genresResponse.data.genres;

		renderer.renderGenres(this.genres);
	}
}

export default GetMovie;
