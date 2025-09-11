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
      <div className="background-pattern"></div>
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-placeholder">
            {/* Replace this div with <img src="your-logo.png" alt="Aura-fy" className="logo" /> */}
            <div className="logo-icon">
              <span className="music-note">♪</span>
              <span className="aura-glow"></span>
            </div>
          </div>
          <h1 className="app-title">Aura-fy</h1>
        </div>
        
        <div className="content-section">
          <h2 className="welcome-text">Welcome to Aura-fy</h2>
          <p className="description">
            Discover the <span className="highlight">hilarious mood</span> of your Spotify music
          </p>
          <p className="sub-description">
            Connect your Spotify account and let AI analyze the aura of your playlists
          </p>
        </div>

        <div className="login-section">
          <button className="spotify-login-btn" onClick={handleLogin}>
            <div className="spotify-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            Continue with Spotify
          </button>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <button className="demo-btn">
            Try Demo Playlist
          </button>
        </div>

        <div className="footer-section">
          <p className="footer-text">
            By continuing, you agree to our <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;