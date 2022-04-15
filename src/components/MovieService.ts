import axios, { AxiosResponse } from 'axios';

class MovieService {
	public async getRequest(url: string): Promise<AxiosResponse> {
		return await axios.get(url);
	}
}

export default MovieService;
