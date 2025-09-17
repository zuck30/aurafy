# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import requests
import urllib.parse
from typing import List, Dict
import base64

app = FastAPI(title="Aurafy Your Playlist API")

# CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify API credentials
SPOTIFY_CLIENT_ID = "85a4b164d555499a84c0d16725bad0fa"
SPOTIFY_CLIENT_SECRET = "449877bbefaa407cae497994af27658b"
SPOTIFY_REDIRECT_URI = "http://127.0.0.1:8000/api/callback"  # Changed from localhost to 127.0.0.1

# Spotify API URLs
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

# Aura definitions
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
    scope = "user-read-private user-read-email user-read-recently-played user-top-read playlist-read-private"
    params = {
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "scope": scope,
        "redirect_uri": SPOTIFY_REDIRECT_URI,  # Use the variable here
        "show_dialog": True
    }
    auth_url = f"{SPOTIFY_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=auth_url)
@app.get("/api/callback")
async def callback(code: str):
    auth_header = base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()).decode()
    token_post_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI  # Use the variable here
    }
    headers = {"Authorization": f"Basic {auth_header}", "Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(SPOTIFY_TOKEN_URL, data=token_post_data, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to retrieve access token: {response.text}")

    token_info = response.json()
    access_token = token_info.get("access_token")
    refresh_token = token_info.get("refresh_token")

    # Redirect to frontend - make sure this matches your frontend URL
    redirect_url = f"http://localhost:3000/#access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(url=redirect_url)

def get_spotify_headers(access_token: str):
    return {"Authorization": f"Bearer {access_token}"}

@app.get("/api/me")
async def get_me(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/api/playlists")
async def get_playlists(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/playlists", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/api/recently-played")
async def get_recently_played(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=50", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/api/playlist/{playlist_id}")
async def get_playlist(playlist_id: str, access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

async def get_track_ids_from_playlist(playlist_id: str, access_token: str):
    playlist_data = await get_playlist(playlist_id, access_token)
    track_ids = [item['track']['id'] for item in playlist_data['tracks']['items'] if item.get('track') and item['track'].get('id')]
    return track_ids

async def get_track_ids_from_recent(access_token: str):
    recent_data = await get_recently_played(access_token)
    track_ids = [item['track']['id'] for item in recent_data['items'] if item.get('track') and item['track'].get('id')]
    return list(dict.fromkeys(track_ids)) # Remove duplicates

async def get_audio_features(track_ids: List[str], access_token: str):
    if not track_ids:
        return []
    headers = get_spotify_headers(access_token)
    # Spotify API has a limit of 100 IDs per request
    audio_features_list = []
    for i in range(0, len(track_ids), 100):
        batch = track_ids[i:i+100]
        params = {"ids": ",".join(batch)}
        response = requests.get(f"{SPOTIFY_API_BASE_URL}/audio-features", headers=headers, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        audio_features_list.extend(response.json().get('audio_features', []))
    return audio_features_list

def calculate_aura(features_list: List[Dict]):
    features_list = [f for f in features_list if f] # Filter out None values
    if not features_list:
        return {
            "aura": {
                "name": "The Mysterious Void",
                "description": "We couldn't find any audio features. Is this playlist just a figment of your imagination?",
                "color": "#9E9E9E"
            },
            "avg_features": {}
        }

    avg_features = {
        "danceability": sum(f["danceability"] for f in features_list) / len(features_list),
        "energy": sum(f["energy"] for f in features_list) / len(features_list),
        "valence": sum(f["valence"] for f in features_list) / len(features_list),
        "acousticness": sum(f["acousticness"] for f in features_list) / len(features_list),
        "tempo": sum(f["tempo"] for f in features_list) / len(features_list),
    }

    matched_aura = None
    for aura in AURAS:
        try:
            if aura["conditions"](avg_features):
                matched_aura = aura
                break
        except:
            continue
    
    if not matched_aura:
        matched_aura = {
            "name": "The Eclectic Mixmaster",
            "description": "Your taste is all over the place! You've got a little bit of everything in there.",
            "color": "#9E9E9E"
        }
    
    return {
        "aura": matched_aura,
        "avg_features": avg_features,
    }

@app.get("/api/analyze/playlist/{playlist_id}")
async def analyze_playlist(playlist_id: str, access_token: str):
    track_ids = await get_track_ids_from_playlist(playlist_id, access_token)
    audio_features = await get_audio_features(track_ids, access_token)
    analysis_result = calculate_aura(audio_features)

    playlist_details = await get_playlist(playlist_id, access_token)

    return {
        "analysis": analysis_result,
        "details": playlist_details
    }

@app.get("/api/analyze/recent")
async def analyze_recent(access_token: str):
    track_ids = await get_track_ids_from_recent(access_token)
    audio_features = await get_audio_features(track_ids, access_token)
    analysis_result = calculate_aura(audio_features)

    recent_tracks = await get_recently_played(access_token)

    return {
        "analysis": analysis_result,
        "details": {"name": "Recently Played", "tracks": recent_tracks}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)