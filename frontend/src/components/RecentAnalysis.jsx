// frontend/src/components/RecentAnalysis.js
import React, { useState, useEffect } from 'react';
import './Analysis.css';

const RecentAnalysis = ({ token }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/analyze/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAnalysis(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [token]);

  if (loading) {
    return <div className="loading">Analyzing your recent listening aura...</div>;
  }

  if (!analysis) {
    return <div className="error">Failed to analyze your recent listening</div>;
  }

  return (
    <div className="analysis" style={{ backgroundColor: analysis.aura.color }}>
      <div className="analysis-content">
        <h1>Your Recent Listening Aura Is:</h1>
        <div className="aura-result">
          <h2>{analysis.aura.name}</h2>
          <p>{analysis.aura.description}</p>
        </div>

        <div className="audio-features">
          <h3>Audio Features Breakdown</h3>
          <div className="features-grid">
            <div className="feature">
              <span className="feature-name">Danceability</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${analysis.avg_features.danceability * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(analysis.avg_features.danceability * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Energy</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${analysis.avg_features.energy * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(analysis.avg_features.energy * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Positivity</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${analysis.avg_features.valence * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(analysis.avg_features.valence * 100)}%</span>
            </div>
            <div className="feature">
              <span className="feature-name">Acousticness</span>
              <div className="feature-bar">
                <div 
                  className="feature-value" 
                  style={{ width: `${analysis.avg_features.acousticness * 100}%` }}
                ></div>
              </div>
              <span className="feature-percent">{Math.round(analysis.avg_features.acousticness * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="extremes">
          <h3>Notable Extremes</h3>
          <div className="extremes-grid">
            <div className="extreme-item">
              <h4>Most Danceable</h4>
              <p>{analysis.extremes.most_danceable.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Least Danceable</h4>
              <p>{analysis.extremes.least_danceable.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Most Energetic</h4>
              <p>{analysis.extremes.most_energetic.name}</p>
            </div>
            <div className="extreme-item">
              <h4>Least Energetic</h4>
              <p>{analysis.extremes.least_energetic.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentAnalysis;