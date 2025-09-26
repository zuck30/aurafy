# netlify/functions/api/api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import requests
import urllib.parse
from typing import List, Dict
import base64
from pydantic import BaseModel
import os
from mangum import Mangum

class AudioFeaturesRequest(BaseModel):
    track_ids: List[str]
    access_token: str

class AuraCalculationRequest(BaseModel):
    features_list: List[Dict]

app = FastAPI(title="Aurafy Your Playlist API")

# In production, set this to your Netlify app's URL
PRODUCTION_URL = "https://aurafai.netlify.app"

# CORS middleware to allow frontend connection
origins = [
    "https://aurafai.netlify.app",  # this has to be React app URL for production 
]
if PRODUCTION_URL:
    origins.append(PRODUCTION_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify API credentials
SPOTIFY_CLIENT_ID = "85a4b164d555499a84c0d16725bad0fa"
SPOTIFY_CLIENT_SECRET = "449877bbefaa407cae497994af27658b"
SPOTIFY_REDIRECT_URI = "https://aurafai.netlify.app/api/callback"


# Spotify API URLs
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

# Aura definitions
AURAS = [
    {
        "name": "High-Energy Dance Party",
        "description": "This playlist is a non-stop dance party! Perfect for a workout or a night out.",
        "conditions": lambda f: f["danceability"] > 0.7 and f["energy"] > 0.7,
        "color": "#FF5722"  # Deep Orange
    },
    {
        "name": "Melancholic introspection",
        "description": "This playlist is perfect for a rainy day, with its mellow and introspective vibe.",
        "conditions": lambda f: f["valence"] < 0.4 and f["energy"] < 0.5,
        "color": "#42A5F5"  # Blue
    },
    {
        "name": "Upbeat & Happy",
        "description": "This playlist is full of positive vibes and will be sure to put a smile on your face.",
        "conditions": lambda f: f["valence"] > 0.7 and f["energy"] > 0.6,
        "color": "#FFCA28"  # Amber
    },
    {
        "name": "Acoustic Cafe",
        "description": "This playlist is perfect for a chill afternoon at a coffee shop, with its acoustic and relaxed feel.",
        "conditions": lambda f: f["acousticness"] > 0.6 and f["energy"] < 0.5,
        "color": "#8D6E63"  # Brown
    },
    {
        "name": "Energetic & Angry",
        "description": "This playlist is full of raw power and aggression, perfect for a workout or when you need to let off some steam.",
        "conditions": lambda f: f["energy"] > 0.8 and f["valence"] < 0.3,
        "color": "#B71C1C"  # Red
    },
    {
        "name": "Late Night Drive",
        "description": "This playlist is the perfect soundtrack for a late-night drive, with its atmospheric and electronic sound.",
        "conditions": lambda f: f["energy"] > 0.6 and f["danceability"] > 0.6 and f["instrumentalness"] > 0.5,
        "color": "#7E57C2"  # Deep Purple
    }
]

@app.get("/")
async def root():
    return {"message": "Welcome to Aura-fy Your Playlist API"}

@app.get("/login")
async def login():
    scope = "user-read-private user-read-email user-read-recently-played playlist-read-private playlist-read-collaborative user-library-read"
    params = {
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "scope": scope,
        "redirect_uri": SPOTIFY_REDIRECT_URI,  # Use the variable here
        "show_dialog": True
    }
    auth_url = f"{SPOTIFY_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=auth_url)
@app.get("/callback")
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
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    redirect_url = f"{frontend_url}/#access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(url=redirect_url)

@app.get("/refresh_token")
async def refresh_token(refresh_token: str):
    auth_header = base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()).decode()
    token_post_data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }
    headers = {"Authorization": f"Basic {auth_header}", "Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(SPOTIFY_TOKEN_URL, data=token_post_data, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to refresh access token: {response.text}")

    token_info = response.json()
    access_token = token_info.get("access_token")
    return {"access_token": access_token}

def get_spotify_headers(access_token: str):
    return {"Authorization": f"Bearer {access_token}"}

@app.get("/me")
async def get_me(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/playlists")
async def get_playlists(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/playlists", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/recently-played")
async def get_recently_played(access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=50", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

@app.get("/playlist/{playlist_id}")
async def get_playlist(playlist_id: str, access_token: str):
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())
    return response.json()

async def get_track_ids_from_playlist(playlist_id: str, access_token: str):
    playlist_data = await get_playlist(playlist_id, access_token)
    track_ids = []
    for item in playlist_data['tracks']['items']:
        if item and item.get('track') and item.get('track').get('id') and item.get('track').get('type') == 'track':
            track_ids.append(item['track']['id'])
    return track_ids

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
        "instrumentalness": sum(f["instrumentalness"] for f in features_list) / len(features_list),
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

@app.get("/analyze/playlist/{playlist_id}")
async def analyze_playlist(playlist_id: str, access_token: str):
    track_ids = await get_track_ids_from_playlist(playlist_id, access_token)
    try:
        audio_features = await get_audio_features(track_ids, access_token)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail={"original_error": e.detail, "track_ids_sent": track_ids})

    analysis_result = calculate_aura(audio_features)
    playlist_details = await get_playlist(playlist_id, access_token)

    return {
        "analysis": analysis_result,
        "details": playlist_details
    }

@app.get("/analyze/recent")
async def analyze_recent(access_token: str):
    recent_data = await get_recently_played(access_token)
    track_ids = []
    for item in recent_data['items']:
        if item and item.get('track') and item.get('track').get('id') and item.get('track').get('type') == 'track':
            track_ids.append(item['track']['id'])
    unique_track_ids = list(dict.fromkeys(track_ids))

    audio_features = await get_audio_features(unique_track_ids, access_token)
    analysis_result = calculate_aura(audio_features)

    return {
        "analysis": analysis_result,
        "details": {"name": "Recently Played", "tracks": recent_data}
    }

@app.post("/audio_features")
async def get_audio_features_endpoint(request: AudioFeaturesRequest):
    return await get_audio_features(request.track_ids, request.access_token)

@app.post("/calculate_aura")
async def calculate_aura_endpoint(request: AuraCalculationRequest):
    return calculate_aura(request.features_list)

handler = Mangum(app)