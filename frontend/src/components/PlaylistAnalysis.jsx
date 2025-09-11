// frontend/src/components/PlaylistAnalysis.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './Analysis.css';

const PlaylistAnalysis = () => {
  const { id } = useParams();
  
  // Mock analysis data
  const mockAnalysis = {
    aura: {
      name: "The Euphoric Clubber",
      description: "High energy, high positivity - you're basically mainlining joy at the club!",
      color: "#FFEB3B"
    },
    avg_features: {
      danceability: 0.85,
      energy: 0.92,
      valence: 0.88,
      acousticness: 0.15
    },
    extremes: {
      most_danceable: { name: "Blinding Lights - The Weeknd" },
      least_danceable: { name: "Save Your Tears - The Weeknd" },
      most_energetic: { name: "Levitating - Dua Lipa" },
      least_energetic: { name: "Blinding Lights - The Weeknd" }
    }
  };

  return (
    <div className="analysis" style={{ backgroundColor: mockAnalysis.aura.color }}>
      <div className="analysis-content">
        <h1>Your Playlist Aura Is:</h1>
        <div className="aura-result">
          <h2>{mockAnalysis.aura.name}</h2>
          <p>{mockAnalysis.aura.description}</p>
        </div>

        <div className="audio-features">
          <h3>Audio Features Breakdown</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-name">Danceability</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${mockAnalysis.avg_features.danceability * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(mockAnalysis.avg_features.danceability * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Energy</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${mockAnalysis.avg_features.energy * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(mockAnalysis.avg_features.energy * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Positivity</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${mockAnalysis.avg_features.valence * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(mockAnalysis.avg_features.valence * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Acousticness</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${mockAnalysis.avg_features.acousticness * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(mockAnalysis.avg_features.acousticness * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="extremes">
          <h3>Notable Extremes</h3>
          <div className="extremes-grid">
            <div className="extreme-item">
              <h4>Most Danceable</h4>
              <p>{mockAnalysis.extremes.most_danceable.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Least Danceable</h4>
              <p>{mockAnalysis.extremes.least_danceable.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Most Energetic</h4>
              <p>{mockAnalysis.extremes.most_energetic.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Least Energetic</h4>
              <p>{mockAnalysis.extremes.least_energetic.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistAnalysis;