import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Function to refresh the access token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  console.log('🔄 Refreshing token...');
  
  // Use a direct axios call to avoid interceptor loop
  const response = await axios.get(`http://localhost:8000/api/refresh_token?refresh_token=${refreshToken}`);
  const { access_token } = response.data;
  
  console.log('✅ Token refreshed');
  localStorage.setItem('token', access_token);
  return access_token;
};

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ API Error: ${error.response?.status || 'No status'} ${error.config?.url || 'No URL'}`);
    
    const originalRequest = error.config;
    
    // If the error is 401/403 and we haven't already retried the request
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log('🔄 Token expired, attempting refresh...');
      originalRequest._retry = true;
      
      try {
        const newAccessToken = await refreshToken();
        
        // Update the token in the original request's params
        if (originalRequest.params) {
          originalRequest.params.access_token = newAccessToken;
        } else {
          originalRequest.params = { access_token: newAccessToken };
        }
        
        console.log('🔄 Retrying original request with new token...');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed', refreshError);
        // Don't redirect, just pass the error along
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const getMe = (token) => {
  console.log('📞 getMe called with token:', token ? `${token.substring(0, 20)}...` : 'No token');
  return api.get('/me', { 
    params: { access_token: token },
    timeout: 10000
  });
};

export const getPlaylists = (token) => {
  console.log('📞 getPlaylists called');
  return api.get('/playlists', { 
    params: { access_token: token },
    timeout: 10000
  });
};

export const getRecentlyPlayed = (token) => {
  console.log('📞 getRecentlyPlayed called');
  return api.get('/recently-played', { 
    params: { access_token: token },
    timeout: 10000
  });
};

export const getPlaylist = (token, playlistId) => {
  console.log('📞 getPlaylist called for:', playlistId);
  return api.get(`/playlist/${playlistId}`, { 
    params: { access_token: token },
    timeout: 10000
  });
};

export const analyzePlaylist = (token, playlistId) => {
  console.log('📞 analyzePlaylist called for:', playlistId);
  return api.get(`/analyze/playlist/${playlistId}`, { 
    params: { access_token: token },
    timeout: 15000
  });
};

export const analyzeRecent = (token) => {
  console.log('📞 analyzeRecent called');
  console.log('Token length:', token?.length || 0);
  
  if (!token) {
    return Promise.reject(new Error('No token provided'));
  }

  return api.get('/analyze/recent', { 
    params: { 
      access_token: token 
    },
    timeout: 20000,
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    }
  })
  .then(response => {
    console.log('✅ analyzeRecent response status:', response.status);
    if (response.status >= 400) {
      throw {
        response: {
          status: response.status,
          data: response.data,
          headers: response.headers
        }
      };
    }
    return response;
  })
  .catch(error => {
    console.error('❌ analyzeRecent error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  });
};

export default api;