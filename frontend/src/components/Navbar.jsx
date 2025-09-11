// frontend/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, setToken }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
          <div className="brand-logo">
            {/* Replace with actual logo */}
            <div className="logo-icon">
              <span className="music-note">♪</span>
              <span className="aura-pulse"></span>
            </div>
          </div>
          <div className="brand-text">
            <span className="brand-name">Aurafy</span>
            <span className="brand-tagline">Your Playlist</span>
          </div>
        </Link>

        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-items">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon"></span>
              Dashboard
            </Link>
            <Link 
              to="/analyze/recent" 
              className={`nav-link ${isActiveLink('/analyze/recent') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon"></span>
              Recent Aura
            </Link>
          </div>
          
          <div className="user-section">
            
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon"></span>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="navbar-glow"></div>
    </nav>
  );
};

export default Navbar;