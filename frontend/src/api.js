import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getMe = (token) => {
  return api.get('/me', { params: { access_token: token } });
};

export const getPlaylists = (token) => {
  return api.get('/playlists', { params: { access_token: token } });
};

export const getRecentlyPlayed = (token) => {
  return api.get('/recently-played', { params: { access_token: token } });
};

export const getPlaylist = (token, playlistId) => {
  return api.get(`/playlist/${playlistId}`, { params: { access_token: token } });
};

export const analyzePlaylist = (token, playlistId) => {
  return api.get(`/analyze/playlist/${playlistId}`, { params: { access_token: token } });
};

export const analyzeRecent = (token) => {
  return api.get('/analyze/recent', { params: { access_token: token } });
};

export default api;
