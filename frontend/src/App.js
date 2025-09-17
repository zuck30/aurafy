import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlaylistAnalysis from './components/PlaylistAnalysis';
import RecentAnalysis from './components/RecentAnalysis';
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    let tokenInUrl = null;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      tokenInUrl = params.get('access_token');

      if (tokenInUrl) {
        localStorage.setItem('token', tokenInUrl);
        setToken(tokenInUrl);
        // Clean the URL
        window.history.replaceState(null, null, ' ');
      }
    }
    
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      if (!token) setToken(storedToken);
      getMe(storedToken)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch user", error);
          // Token might be expired, so log out
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const authValue = {
    token,
    user,
    isLoggedIn: !!user, // We consider logged in if user object is present
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  let location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 4. App Component with updated routing
function AppContent() {
  const { isLoggedIn, loading } = useAuth();

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



