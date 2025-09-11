// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ token }) => {
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    // Fetch user's playlists
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/playlists', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPlaylists(data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    // Fetch recently played tracks
    const fetchRecentTracks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/recently-played', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setRecentTracks(data.items || []);
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
      }
    };

    fetchPlaylists();
    fetchRecentTracks();
  }, [token]);

  return (
    <div className="dashboard">
      <div className="section">
        <h2>Your Playlists</h2>
        <div className="playlist-grid">
          {playlists.map(playlist => (
            <Link to={`/analyze/playlist/${playlist.id}`} key={playlist.id} className="playlist-card">
              <img 
                src={playlist.images[0]?.url || 'https://placehold.co/200x200/333/white?text=No+Image'} 
                alt={playlist.name} 
              />
              <h3>{playlist.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Recently Played Tracks</h2>
        <Link to="/analyze/recent" className="analyze-recent-btn">
          Analyze Your Recent Listening Aura
        </Link>
        <div className="tracks-list">
          {recentTracks.map(track => (
            <div key={track.id} className="track-item">
              <img 
                src={track.album.images[0]?.url || 'https://placehold.co/50x50/333/white?text=No+Image'} 
                alt={track.name} 
              />
              <div className="track-info">
                <h4>{track.name}</h4>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;