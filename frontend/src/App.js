import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlaylistAnalysis from './components/PlaylistAnalysis';
import RecentAnalysis from './components/RecentAnalysis';
import PlaylistSelection from './components/PlaylistSelection';
import { getMe } from './api';

// 1. Create Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 2. Create Auth Provider
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Initializing authentication...');
      
      // 1. Check URL hash for tokens (from Spotify callback)
      const hash = window.location.hash;
      console.log('URL hash:', hash ? `${hash.substring(0, 50)}...` : 'No hash');
      
      let tokenFromUrl = null;
      let refreshTokenFromUrl = null;
      
      if (hash) {
        try {
          const params = new URLSearchParams(hash.substring(1));
          tokenFromUrl = params.get('access_token');
          refreshTokenFromUrl = params.get('refresh_token');
          
          console.log('Tokens from URL:', {
            accessToken: tokenFromUrl ? `${tokenFromUrl.substring(0, 20)}...` : 'None',
            refreshToken: refreshTokenFromUrl ? 'Yes' : 'None'
          });
          
          if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);
            setToken(tokenFromUrl);
          }
          
          if (refreshTokenFromUrl) {
            localStorage.setItem('refreshToken', refreshTokenFromUrl);
            setRefreshToken(refreshTokenFromUrl);
          }
          
          // Clear the URL hash
          if (tokenFromUrl || refreshTokenFromUrl) {
            window.history.replaceState(null, null, window.location.pathname);
            console.log('✅ URL hash cleared');
          }
        } catch (error) {
          console.error('Error parsing URL hash:', error);
        }
      }
      
      // 2. Use token from URL or localStorage
      const currentToken = tokenFromUrl || localStorage.getItem('token');
      
      if (!currentToken) {
        console.log('❌ No token found');
        setLoading(false);
        return;
      }
      
      console.log('🔑 Token found, validating with Spotify...');
      
      try {
        // Validate token by calling Spotify API
        const response = await getMe(currentToken);
        console.log('✅ Token is valid! User:', response.data.display_name || response.data.id);
        
        setUser(response.data);
        
        // Make sure token state is set correctly
        if (currentToken !== token) {
          setToken(currentToken);
        }
        
      } catch (error) {
        console.error('❌ Token validation failed:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('🔄 Token expired, attempting refresh...');
          
          // Try to refresh the token
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (storedRefreshToken) {
            try {
              console.log('Attempting token refresh...');
              const refreshResponse = await fetch(
                `http://localhost:8000/api/refresh_token?refresh_token=${storedRefreshToken}`
              );
              
              if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                const newToken = data.access_token;
                
                console.log('✅ Token refreshed successfully');
                localStorage.setItem('token', newToken);
                setToken(newToken);
                
                // Retry getting user info
                const userResponse = await getMe(newToken);
                setUser(userResponse.data);
              } else {
                console.log('❌ Token refresh failed, logging out');
                logout();
              }
            } catch (refreshError) {
              console.error('Token refresh error:', refreshError);
              logout();
            }
          } else {
            console.log('❌ No refresh token available, logging out');
            logout();
          }
        } else {
          console.log('❌ Other error, logging out');
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    console.log('🚪 Logging out...');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setRecentTracks([]);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Optional: Clear any other auth-related items
  };

  const authValue = {
    token,
    refreshToken,
    user,
    isLoggedIn: !!token && !!user,
    loading,
    logout,
    recentTracks,
    setRecentTracks,
    setToken,
    setUser
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh" bg="#000">
        <Spinner size="xl" color="#1DB954" thickness="4px" />
      </Center>
    );
  }

  if (!isLoggedIn || !token) {
    console.log('🔒 Redirecting to login, current token:', token ? 'Exists' : 'None');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 4. App Component
function AppContent() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh" bg="#000">
        <Spinner size="xl" color="#1DB954" thickness="4px" />
      </Center>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyze/playlists"
        element={
          <ProtectedRoute>
            <PlaylistSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyze/recent"
        element={
          <ProtectedRoute>
            <RecentAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyze/playlist/:id"
        element={
          <ProtectedRoute>
            <PlaylistAnalysis />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
const App = () => (
  <Router>
    <AuthProvider>
      <Box minH="100vh" bg="#000">
        <AppContent />
      </Box>
    </AuthProvider>
  </Router>
);

export default App;