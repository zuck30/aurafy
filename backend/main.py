# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import List, Dict, Optional
import random

app = FastAPI(title="Aura-fy Your Playlist API")

# CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify API credentials (should be in environment variables in production)
SPOTIFY_CLIENT_ID = "your_spotify_client_id"
SPOTIFY_CLIENT_SECRET = "your_spotify_client_secret"
SPOTIFY_REDIRECT_URI = "http://localhost:3000/callback"

# Mock data for development (remove when connecting to real Spotify API)
MOCK_TRACKS = [
    {
        "name": "Dancing Queen",
        "artists": [{"name": "ABBA"}],
        "album": {"images": [{"url": "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96"}]},
        "id": "1"
    },
    {
        "name": "Hurt",
        "artists": [{"name": "Johnny Cash"}],
        "album": {"images": [{"url": "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96"}]},
        "id": "2"
    }
]

MOCK_AUDIO_FEATURES = {
    "1": {
        "danceability": 0.85,
        "energy": 0.75,
        "valence": 0.95,
        "acousticness": 0.2,
        "tempo": 120
    },
    "2": {
        "danceability": 0.3,
        "energy": 0.4,
        "valence": 0.2,
        "acousticness": 0.9,
        "tempo": 60
    }
}

# Aura definitions - our humorous mood classifications
AURAS = [
    {
        "name": "The Pogo-Sticking Toddler",
        "description": "Your music is so energetic and danceable, it's like a sugar-fueled toddler on a pogo stick!",
        "conditions": lambda f: f["danceability"] > 0.8 and f["energy"] > 0.7,
        "color": "#FF9E80"
    },
    {
        "name": "The Contemplative Emo Poet",
        "description": "Your playlist is deep, acoustic, and slightly melancholic - perfect for writing poetry in a coffee shop.",
        "conditions": lambda f: f["valence"] < 0.4 and f["acousticness"] > 0.6,
        "color": "#6A0DAD"
    },
    {
        "name": "The Anxious Hummingbird",
        "description": "Fast-paced but low energy - your music is like a hummingbird that's had too much coffee!",
        "conditions": lambda f: f["tempo"] > 120 and f["energy"] < 0.5,
        "color": "#90CAF9"
    },
    {
        "name": "The Euphoric Clubber",
        "description": "High energy, high positivity - you're basically mainlining joy at the club!",
        "conditions": lambda f: f["energy"] > 0.8 and f["valence"] > 0.8,
        "color": "#FFEB3B"
    },
    {
        "name": "The Moody Vampire",
        "description": "Dark, atmospheric, and probably only listens to music at night. Do you sparkle in sunlight?",
        "conditions": lambda f: f["valence"] < 0.3 and f["energy"] < 0.4,
        "color": "#212121"
    },
    {
        "name": "The Chill Beach Bum",
        "description": "Acoustic, positive, and relaxed - your playlist is basically a hammock between two palm trees.",
        "conditions": lambda f: f["acousticness"] > 0.7 and f["valence"] > 0.6 and f["energy"] < 0.5,
        "color": "#81D4FA"
    }
]

@app.get("/")
async def root():
    return {"message": "Welcome to Aura-fy Your Playlist API"}

@app.get("/api/login")
async def login():
    # In a real implementation, this would redirect to Spotify auth
    auth_url = f"https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri={SPOTIFY_REDIRECT_URI}&scope=user-read-recently-played user-top-read playlist-read-private"
    return {"auth_url": auth_url}

@app.get("/api/callback")
async def callback(code: str):
    # In a real implementation, this would exchange code for access token
    return {"access_token": "mock_access_token", "token_type": "bearer"}

@app.get("/api/recently-played")
async def get_recently_played(access_token: str):
    # Mock implementation - replace with actual Spotify API call
    return {"items": MOCK_TRACKS}

@app.get("/api/playlists")
async def get_playlists(access_token: str):
    # Mock implementation
    mock_playlists = [
        {"id": "1", "name": "Chill Vibes", "images": [{"url": "https://misc.scdn.co/liked-songs/liked-songs-640.png"}]},
        {"id": "2", "name": "Workout Mix", "images": [{"url": "https://misc.scdn.co/liked-songs/liked-songs-640.png"}]}
    ]
    return {"items": mock_playlists}

@app.get("/api/playlist/{playlist_id}")
async def get_playlist(playlist_id: str, access_token: str):
    # Mock implementation
    return {"tracks": {"items": [{"track": track} for track in MOCK_TRACKS]}}

@app.get("/api/analyze/playlist/{playlist_id}")
async def analyze_playlist(playlist_id: str, access_token: str):
    # Get playlist tracks
    # In real implementation, we'd fetch actual tracks and their audio features
    # For now, using mock data
    
    # Calculate average audio features
    features_list = [MOCK_AUDIO_FEATURES[track["id"]] for track in MOCK_TRACKS if track["id"] in MOCK_AUDIO_FEATURES]
    
    if not features_list:
        raise HTTPException(status_code=404, detail="No audio features found")
    
    avg_features = {
        "danceability": sum(f["danceability"] for f in features_list) / len(features_list),
        "energy": sum(f["energy"] for f in features_list) / len(features_list),
        "valence": sum(f["valence"] for f in features_list) / len(features_list),
        "acousticness": sum(f["acousticness"] for f in features_list) / len(features_list),
        "tempo": sum(f["tempo"] for f in features_list) / len(features_list),
    }
    
    # Find matching aura
    matched_aura = None
    for aura in AURAS:
        try:
            if aura["conditions"](avg_features):
                matched_aura = aura
                break
        except:
            continue
    
    # If no specific aura matched, assign a default one
    if not matched_aura:
        matched_aura = {
            "name": "The Eclectic Mixmaster",
            "description": "Your taste is all over the place! You've got a little bit of everything in there.",
            "color": "#9E9E9E"
        }
    
    # Find most extreme songs for each feature
    extremes = {
        "most_danceable": max(MOCK_TRACKS, key=lambda t: MOCK_AUDIO_FEATURES.get(t["id"], {}).get("danceability", 0)),
        "least_danceable": min(MOCK_TRACKS, key=lambda t: MOCK_AUDIO_FEATURES.get(t["id"], {}).get("danceability", 1)),
        "most_energetic": max(MOCK_TRACKS, key=lambda t: MOCK_AUDIO_FEATURES.get(t["id"], {}).get("energy", 0)),
        "least_energetic": min(MOCK_TRACKS, key=lambda t: MOCK_AUDIO_FEATURES.get(t["id"], {}).get("energy", 1)),
    }
    
    return {
        "aura": matched_aura,
        "avg_features": avg_features,
        "extremes": extremes
    }

@app.get("/api/analyze/recent")
async def analyze_recent(access_token: str):
    # This would analyze recently played tracks
    # For now, we'll just return the same as playlist analysis
    return await analyze_playlist("mock", access_token)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)