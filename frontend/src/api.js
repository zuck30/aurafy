import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Function to refresh the access token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  // Use a direct axios call to avoid interceptor loop
  const response = await axios.get(`http://127.0.0.1:8000/api/refresh_token?refresh_token=${refreshToken}`);
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
  return access_token;
};

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error is 401 and we haven't already retried the request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        // Update the token in the original request's params
        originalRequest.params.access_token = newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        // Don't redirect, just pass the error along
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

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
