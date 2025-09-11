// frontend/src/components/Login.js
import React from 'react';
import './Login.css';

const Login = () => {
  const handleLogin = () => {
    // In a real implementation, this would redirect to the backend login endpoint
    // For now, we'll simulate a successful login
    window.location.href = 'http://localhost:8000/api/login';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Aura-fy Your Playlist</h1>
        <p>Discover the hilarious mood of your Spotify music</p>
        <button className="spotify-login-btn" onClick={handleLogin}>
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;