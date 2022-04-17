import './styles.scss';

import Renderer from './components/Renderer';
import MoviesHandler from './components/MoviesHandler';
import Pagination from './components/Pagination';
import ActionHandler from './components/ActionHandler';
import Main from './components/Main';

export const actionHandler = new ActionHandler();
export const moviesHandler = new MoviesHandler();
export const pagination = new Pagination();
export const renderer = new Renderer(
	actionHandler.onMovieClick,
	actionHandler.onChooseGenre
);

const main = new Main();

main.init();
