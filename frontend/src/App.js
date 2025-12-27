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
  return useContext(AuthContext);
};

// 2. Create Auth Provider
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const hash = window.location.hash;
      let tokenInUrl = null;
      let refreshTokenInUrl = null;

      console.log('🔄 AuthProvider initializing...');
      console.log('URL hash:', hash ? hash.substring(0, 50) + '...' : 'No hash');

      // 1. Extract tokens from URL hash if present
      if (hash) {
        try {
          const params = new URLSearchParams(hash.substring(1));
          tokenInUrl = params.get('access_token');
          refreshTokenInUrl = params.get('refresh_token');

          console.log('✅ Tokens found in URL:', {
            hasAccessToken: !!tokenInUrl,
            hasRefreshToken: !!refreshTokenInUrl
          });

          if (tokenInUrl) {
            console.log('Token from URL length:', tokenInUrl.length);
            localStorage.setItem('token', tokenInUrl);
            setToken(tokenInUrl);
          }
          if (refreshTokenInUrl) {
            localStorage.setItem('refreshToken', refreshTokenInUrl);
            setRefreshToken(refreshTokenInUrl);
          }
          
          if (tokenInUrl || refreshTokenInUrl) {
            // Clean the URL
            window.history.replaceState(null, null, window.location.pathname || '/');
            console.log('✅ URL cleaned');
          }
        } catch (error) {
          console.error('❌ Error parsing URL hash:', error);
        }
      }

      // 2. Use token from URL or localStorage
      const currentToken = tokenInUrl || localStorage.getItem('token');
      
      if (currentToken) {
        console.log('🔑 Current token exists, length:', currentToken.length);
        console.log('Token preview:', currentToken.substring(0, 30) + '...');
        
        try {
          // Test the token with Spotify API
          console.log('🔍 Testing token with Spotify API...');
          const response = await getMe(currentToken);
          console.log('✅ Token is valid! User:', response.data.display_name || response.data.id);
          setUser(response.data);
          
          // Ensure token is set in state
          if (!tokenInUrl && currentToken !== token) {
            setToken(currentToken);
          }
        } catch (error) {
          console.error('❌ Token validation failed:', error);
          console.error('Error response:', error.response?.data);
          
          // Token is invalid or expired
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🔄 Token expired or invalid, clearing...');
            logout();
          }
        }
      } else {
        console.log('❌ No token found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []); // Empty dependency array - run only once on mount

  const logout = () => {
    console.log('🚪 Logging out...');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const authValue = {
    token,
    refreshToken,
    setToken,
    user,
    isLoggedIn: !!token && !!user, // Changed: need both token AND user
    loading,
    logout,
    recentTracks,
    setRecentTracks,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, token, user } = useAuth();
  let location = useLocation();

  console.log('🛡️ ProtectedRoute check:', {
    loading,
    isLoggedIn,
    hasToken: !!token,
    hasUser: !!user,
    path: location.pathname
  });

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
        <Box ml={4}>Loading authentication...</Box>
      </Center>
    );
  }

  if (!isLoggedIn) {
    console.log('🔒 Redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Access granted to:', location.pathname);
  return children;
};

// 4. App Component with updated routing
function AppContent() {
  const { isLoggedIn, loading, token, user } = useAuth();

  console.log('📱 AppContent render:', {
    loading,
    isLoggedIn,
    hasToken: !!token,
    hasUser: !!user
  });

  return (
    <Routes>
      <Route
        path="/login"
        element={!loading && isLoggedIn ? <Navigate to="/" /> : <Login />}
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
      {/* Redirect any other path to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// We need to wrap App with the Router and AuthProvider
const App = () => (
  <Router>
    <AuthProvider>
      <Box>
        <AppContent />
      </Box>
    </AuthProvider>
  </Router>
);

export default App;