const API_BASE_URL = 'http://localhost:5001/api';
const ML_API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
  },
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    updateProfile: `${API_BASE_URL}/users/profile`,
  },
  content: {
    movies: `${API_BASE_URL}/movies`,
    songs: `${API_BASE_URL}/songs`,
    books: `${API_BASE_URL}/books`,
    series: `${API_BASE_URL}/series`,
  },
  contentMap: {
    movies: 'movies',
    songs: 'songs',
    books: 'books',
    series: 'series',
  },
  ratings: {
    create: `${API_BASE_URL}/ratings`,
    getUserRatings: `${API_BASE_URL}/ratings/user`,
    getRating: `${API_BASE_URL}/ratings`,
  },
  search: `${API_BASE_URL}/search`,
  ml: {
    recommendations: `${ML_API_BASE_URL}/recommendations`,
    trending: `${ML_API_BASE_URL}/trending`,
    similar: `${ML_API_BASE_URL}/similar`,
  },
  powerbi: `${API_BASE_URL}/powerbi`,
};

export default api;
