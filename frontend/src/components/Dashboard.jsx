// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlaylists: 0,
    totalTracks: 0,
    listeningTime: '0h'
  });

  useEffect(() => {
    // Mock data for demonstration - replace with actual API calls
    const mockPlaylists = [
      {
        id: "1", 
        name: "Chill Vibes", 
        images: [{url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}],
        description: "Your relaxing tunes",
        tracks: { total: 45 }
      },
      {
        id: "2", 
        name: "Workout Mix", 
        images: [{url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}],
        description: "Energy boosters",
        tracks: { total: 32 }
      },
      {
        id: "3", 
        name: "Road Trip", 
        images: [{url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG11c2ljfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"}],
        description: "Windows down, volume up",
        tracks: { total: 28 }
      },
      {
        id: "4", 
        name: "Late Night Coding", 
        images: [{url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"}],
        description: "Focus & flow state",
        tracks: { total: 67 }
      },
      {
        id: "5", 
        name: "Sunday Morning", 
        images: [{url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"}],
        description: "Peaceful weekend vibes",
        tracks: { total: 23 }
      }
    ];

    const mockTracks = [
      {
        id: "1",
        name: "Blinding Lights",
        artists: [{name: "The Weeknd"}],
        album: {images: [{url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"}]},
        played_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "2", 
        name: "Save Your Tears",
        artists: [{name: "The Weeknd"}],
        album: {images: [{url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"}]},
        played_at: "2024-01-15T09:45:00Z"
      },
      {
        id: "3",
        name: "Levitating",
        artists: [{name: "Dua Lipa"}],
        album: {images: [{url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}]},
        played_at: "2024-01-15T08:20:00Z"
      },
      {
        id: "4",
        name: "As It Was",
        artists: [{name: "Harry Styles"}],
        album: {images: [{url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}]},
        played_at: "2024-01-15T07:55:00Z"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setPlaylists(mockPlaylists);
      setRecentTracks(mockTracks);
      setStats({
        totalPlaylists: mockPlaylists.length,
        totalTracks: mockTracks.length,
        listeningTime: '2.5h'
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your musical universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              Welcome back to your <span className="highlight">Aurafy</span> world
            </h1>
            <p className="dashboard-subtitle">
              Discover the hilarious moods and hidden auras in your music
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎵</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalPlaylists}</span>
                <span className="stat-label">Playlists</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎧</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalTracks}</span>
                <span className="stat-label">Recent Tracks</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <span className="stat-number">{stats.listeningTime}</span>
                <span className="stat-label">Today</span>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Quick Analysis</h2>
          <div className="action-cards">
            <Link to="/analyze/recent" className="action-card featured">
              <div className="action-icon">✨</div>
              <div className="action-content">
                <h3>Analyze Recent Aura</h3>
                <p>Discover the mood of your latest listening session</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <div className="action-card">
              <div className="action-icon">🎯</div>
              <div className="action-content">
                <h3>Mood Generator</h3>
                <p>Create a playlist based on your current vibe</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </section>

        {/* Playlists Section */}
        <section className="playlists-section">
          <div className="section-header">
            <h2 className="section-title">Your Playlists</h2>
            <p className="section-subtitle">Click any playlist to reveal its hidden aura</p>
          </div>
          
          <div className="playlist-grid">
            {playlists.map(playlist => (
              <Link 
                to={`/analyze/playlist/${playlist.id}`} 
                key={playlist.id} 
                className="playlist-card"
              >
                <div className="playlist-image">
                  <img 
                    src={playlist.images[0]?.url} 
                    alt={playlist.name}
                    loading="lazy"
                  />
                  <div className="playlist-overlay">
                    <div className="play-button">
                      <span>▶</span>
                    </div>
                  </div>
                </div>
                
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.name}</h3>
                  <p className="playlist-description">{playlist.description}</p>
                  <span className="playlist-tracks">{playlist.tracks.total} tracks</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Tracks Section */}
        <section className="recent-section">
          <div className="section-header">
            <h2 className="section-title">Recently Played</h2>
            <Link to="/analyze/recent" className="section-action">
              Analyze All Recent →
            </Link>
          </div>
          
          <div className="tracks-list">
            {recentTracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">
                  {index + 1}
                </div>
                
                <div className="track-image">
                  <img 
                    src={track.album.images[0]?.url} 
                    alt={track.name}
                    loading="lazy"
                  />
                </div>
                
                <div className="track-info">
                  <h4 className="track-name">{track.name}</h4>
                  <p className="track-artist">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
                
                <div className="track-time">
                  {formatTime(track.played_at)}
                </div>
                
                <button className="track-analyze-btn" title="Quick analyze">
                  <span>✨</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;