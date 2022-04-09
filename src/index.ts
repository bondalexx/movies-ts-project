/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles.scss';
import axios from 'axios';

const movieWrapper: any = document.querySelector('.body-movie-content-wrapper');
const paginationContainer: any = document.querySelector(
	'.pagination-container'
);
const searchInput: any = document.querySelector('.header-seacrh-input');
const movieContentList: any = document.querySelector('.movie-content-list');
const movieDetails: any = document.querySelector('.movie-details');
const detailsContainer: any = document.querySelector('.details-container');
const selectMoviesTypeContainer: any = document.querySelector(
	'.select-movie-rates'
);
const filterGenreBody: any = document.querySelector('.filter-genre-body');
const searchBtn = document.querySelector('.search-btn');
const selectMoviesType = document.querySelector('.select-movie-rates');
const applyFilterBtn = document.querySelector('.apply-genres-btn');
const detailBackBtn = document.querySelector('.detail-back-button');

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'e1036725d4b220e51c48c798d13bcf37';
const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w500';

let currentPage = 1;
let genres: any = [];
let paginationNumberArr: any = [];
let pageIndex = 0;
let currentRequestType = 'top_rated';

const pages: any = [];
const moviesType = [
	{ value: 'top_rated', title: 'Top Rated' },
	{ value: 'popular', title: 'Popular' },
	{ value: 'upcoming', title: 'Upcoming' },
];
const genresToSend: any = [];

const getMoviesOnCondition = async (
	requestType: any,
	page: any,
	action: any
) => {
	let url = '';

	currentRequestType = requestType;

	const isRequestTypeIncluded = moviesType.some(
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
		const moviesData = await axios.get(url);

		const movies = moviesData.data.results.map((movie: any) => {
			const genresName = movie.genre_ids.map((genreId: any) => {
				return genres.filter((genre: any) => genre.id === genreId)[0].name;
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

const getMovieById = async (movieId: any) => {
	try {
		const movieByIdData = await axios.get(
			`${API_URL}/movie/${movieId}?api_key=${API_KEY}`
		);

		const genresName = movieByIdData.data.genres.map(
			(genre: any) => genre.name
		);

		const movieObjById = {
			image: IMAGE_BASE_URL + movieByIdData.data.poster_path,
			title: movieByIdData.data.title,
			year: movieByIdData.data.release_date,
			genre: genresName,
			overview: movieByIdData.data.overview,
			voteAverage: movieByIdData.data.vote_average,
		};

		renderDetailsPage(movieObjById);
	} catch (err) {}
};

const getGenres = async () => {
	try {
		const genresData = await axios.get(
			`${API_URL}/genre/movie/list?api_key=${API_KEY}`
		);
		genres = genresData.data.genres;

		renderGenres();
	} catch (err) {}
};

const pageHanlder = (action: any, event: any) => {
	const page = parseInt(event.target.getAttribute('data-page-i'));

	if (action === 'pageClick') {
		currentPage = page;
	}

	getMoviesOnCondition(currentRequestType, currentPage, action);
};

const onMovieClick = (event: any) => {
	movieContentList.style.display = 'none';
	movieDetails.style.display = 'flex';

	const movieId = event.target.parentElement.getAttribute('data-movie-id');

	getMovieById(movieId);
};

const onBack = () => {
	movieDetails.style.display = 'none';
	movieContentList.style.display = 'flex';
};

const onSearch = () => {
	currentPage = 1;
	getMoviesOnCondition('search', currentPage, 'searchMovie');
};

const onSelectMoviesType = async (event: any) => {
	currentPage = 1;
	getMoviesOnCondition(event.target.value, currentPage, 'selectMoviesType');
};

const onChooseGenre = (event: any) => {
	const genreId = event.target.getAttribute('data-genre-id');

	if (genresToSend.length === 0) {
		genresToSend.push(genreId);
	} else {
		const isGenresIdIncluded = genresToSend.some(
			(genre: any) => genre === genreId
		);
		const genreIndex = genresToSend.indexOf(genreId);

		if (isGenresIdIncluded) {
			genresToSend.splice(genreIndex, 1);
		} else {
			genresToSend.push(genreId);
		}
	}
};

const onApplyFilter = () => {
	currentPage = 1;
	getMoviesOnCondition('genresFiltered', currentPage, 'applyGenresFilter');
};

const renderMovie = (movies: any) => {
	movieWrapper.innerHTML = '';

	movies.forEach((movie: any) => {
		movieWrapper.innerHTML += `<div data-movie-id="${movie.movieId}" class="movie-card">
			<img src="${movie.image}" class="movie-logo-img" />
			<div class="movie-details-info">
					<p class="movie-title">${movie.title}</p>
					<p class="movie-year">${movie.year}</p>
					<p class="movie-genre">${movie.genre}</p>
			</div>
		</div>`;
	});

	document.querySelectorAll('.movie-card').forEach(mc => {
		mc.addEventListener('click', onMovieClick, false);
	});
};

const renderDetailsPage = (movieById: any) => {
	detailsContainer.innerHTML = '';

	detailsContainer.innerHTML += `	<div class="movie-vote-average-container">
    <img
      class="movie-img"
      src="${movieById.image}"
    />
    <div class="vote-average-container">
    <p class="vote-average-header">Vote Average:</p>
      <p class="vote-average-sign">${movieById.voteAverage}</p>
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

const renderGenres = () => {
	genres.forEach((genre: any) => {
		filterGenreBody.innerHTML += `<div class="body-filter-body">	
		<input type="checkbox" data-genre-id="${genre.id}" class="filtered-checkboxes" />
		<p class="body-filter-movie-type">${genre.name}</p>
	</div>`;
	});

	document.querySelectorAll('.filtered-checkboxes').forEach(fc => {
		fc.addEventListener('click', onChooseGenre, false);
	});
};

const renderMoviesTypes = () => {
	moviesType.forEach(movieType => {
		selectMoviesTypeContainer.innerHTML += `<option class="filter-optoin" value="${movieType.value}">
		${movieType.title}
	</option>`;
	});
};

const renderPages = (totalPages: any, action: any) => {
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

	document.querySelectorAll('.pagination').forEach(p => {
		p.addEventListener(
			'click',
			(event: any) => {
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
