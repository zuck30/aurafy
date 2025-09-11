// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Aura-fy Your Playlist
      </Link>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/analyze/recent">Recent Aura</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;