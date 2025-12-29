# backend/main.py - COMPLETE UPDATED VERSION
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import requests
import urllib.parse
from typing import List, Dict, Optional
import base64
from pydantic import BaseModel
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AudioFeaturesRequest(BaseModel):
    track_ids: List[str]
    access_token: str

class AuraCalculationRequest(BaseModel):
    features_list: List[Dict]

app = FastAPI(title="Aurafy Your Playlist API")

# CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Spotify API credentials
SPOTIFY_CLIENT_ID = "85a4b164d555499a84c0d16725bad0fa"
SPOTIFY_CLIENT_SECRET = "449877bbefaa407cae497994af27658b"
SPOTIFY_REDIRECT_URI = "http://127.0.0.1:8000/api/callback"

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
        "color": "#FF5722"
    },
    {
        "name": "Melancholic introspection",
        "description": "This playlist is perfect for a rainy day, with its mellow and introspective vibe.",
        "conditions": lambda f: f["valence"] < 0.4 and f["energy"] < 0.5,
        "color": "#42A5F5"
    },
    {
        "name": "Upbeat & Happy",
        "description": "This playlist is full of positive vibes and will be sure to put a smile on your face.",
        "conditions": lambda f: f["valence"] > 0.7 and f["energy"] > 0.6,
        "color": "#FFCA28"
    },
    {
        "name": "Acoustic Cafe",
        "description": "This playlist is perfect for a chill afternoon at a coffee shop, with its acoustic and relaxed feel.",
        "conditions": lambda f: f["acousticness"] > 0.6 and f["energy"] < 0.5,
        "color": "#8D6E63"
    },
    {
        "name": "Energetic & Angry",
        "description": "This playlist is full of raw power and aggression, perfect for a workout or when you need to let off some steam.",
        "conditions": lambda f: f["energy"] > 0.8 and f["valence"] < 0.3,
        "color": "#B71C1C"
    },
    {
        "name": "Late Night Drive",
        "description": "This playlist is the perfect soundtrack for a late-night drive, with its atmospheric and electronic sound.",
        "conditions": lambda f: f["energy"] > 0.6 and f["danceability"] > 0.6 and f["instrumentalness"] > 0.5,
        "color": "#7E57C2"
    }
]

@app.get("/")
async def root():
    return {"message": "Welcome to Aura-fy Your Playlist API"}

@app.get("/api/login")
async def login():
    scope = "user-read-private user-read-email user-read-recently-played playlist-read-private playlist-read-collaborative user-library-read user-read-playback-state"
    params = {
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "scope": scope,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "show_dialog": True
    }
    auth_url = f"{SPOTIFY_AUTH_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=auth_url)

@app.get("/api/callback")
async def callback(code: str):
    logger.info("Received callback from Spotify")
   
    auth_header = base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()).decode()
    token_post_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI
    }
    headers = {"Authorization": f"Basic {auth_header}", "Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(SPOTIFY_TOKEN_URL, data=token_post_data, headers=headers)
    if response.status_code != 200:
        logger.error(f"Failed to retrieve access token: {response.text}")
        raise HTTPException(status_code=400, detail=f"Failed to retrieve access token: {response.text}")
    token_info = response.json()
    access_token = token_info.get("access_token")
    refresh_token = token_info.get("refresh_token")
   
    logger.info(f"Access token obtained: {access_token[:20]}...")
    if refresh_token:
        logger.info("Refresh token obtained")
    redirect_url = f"http://localhost:3000/#access_token={access_token}&refresh_token={refresh_token}"
    logger.info(f"Redirecting to: {redirect_url[:50]}...")
    return RedirectResponse(url=redirect_url)

@app.get("/api/refresh_token")
async def refresh_token(refresh_token: str):
    logger.info(f"Refreshing token with refresh_token: {refresh_token[:20]}...")
   
    auth_header = base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()).decode()
    token_post_data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }
    headers = {"Authorization": f"Basic {auth_header}", "Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(SPOTIFY_TOKEN_URL, data=token_post_data, headers=headers)
    if response.status_code != 200:
        logger.error(f"Failed to refresh access token: {response.text}")
        raise HTTPException(status_code=400, detail=f"Failed to refresh access token: {response.text}")
    token_info = response.json()
    access_token = token_info.get("access_token")
    logger.info(f"New access token: {access_token[:20]}...")
   
    return {"access_token": access_token}

def get_spotify_headers(access_token: str):
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

@app.get("/api/me")
async def get_me(access_token: str):
    logger.info(f"Getting user info with token: {access_token[:20]}...")
   
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
   
    if response.status_code != 200:
        logger.error(f"Failed to get user info: {response.status_code} - {response.text}")
        raise HTTPException(status_code=response.status_code, detail=response.json())
   
    logger.info("Successfully retrieved user info")
    return response.json()

@app.get("/api/playlists")
async def get_playlists(access_token: str):
    logger.info(f"Getting playlists with token: {access_token[:20]}...")
   
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/playlists", headers=headers)
   
    if response.status_code != 200:
        logger.error(f"Failed to get playlists: {response.status_code} - {response.text}")
        raise HTTPException(status_code=response.status_code, detail=response.json())
   
    return response.json()

@app.get("/api/recently-played")
async def get_recently_played(access_token: str):
    logger.info(f"Getting recently played with token: {access_token[:20]}...")
   
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=50", headers=headers)
   
    if response.status_code != 200:
        logger.error(f"Failed to get recently played: {response.status_code} - {response.text}")
        raise HTTPException(
            status_code=response.status_code,
            detail={
                "error": response.json(),
                "message": "Failed to fetch recently played tracks from Spotify"
            }
        )
   
    data = response.json()
    logger.info(f"Retrieved {len(data.get('items', []))} recently played tracks")
    return data

@app.get("/api/playlist/{playlist_id}")
async def get_playlist(playlist_id: str, access_token: str):
    logger.info(f"Getting playlist {playlist_id} with token: {access_token[:20]}...")
   
    headers = get_spotify_headers(access_token)
    response = requests.get(f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}", headers=headers)
   
    if response.status_code != 200:
        logger.error(f"Failed to get playlist: {response.status_code} - {response.text}")
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
        logger.info("No track IDs provided for audio features")
        return []
   
    headers = get_spotify_headers(access_token)
    audio_features_list = []
   
    # Process in batches of 100 (Spotify API limit)
    for i in range(0, len(track_ids), 100):
        batch = track_ids[i:i+100]
       
        # Filter out None or empty IDs
        valid_batch = [tid for tid in batch if tid and isinstance(tid, str) and len(tid) > 10]
       
        if not valid_batch:
            logger.warning(f"Batch {i//100 + 1} has no valid track IDs")
            continue
           
        params = {"ids": ",".join(valid_batch)}
       
        logger.info(f"Requesting audio features for batch {i//100 + 1}, {len(valid_batch)} tracks")
       
        try:
            response = requests.get(
                f"{SPOTIFY_API_BASE_URL}/audio-features",
                headers=headers,
                params=params,
                timeout=30
            )
           
            if response.status_code == 429:
                # Rate limited - check Retry-After header
                retry_after = int(response.headers.get('Retry-After', 1))
                logger.warning(f"Rate limited. Waiting {retry_after} seconds...")
                time.sleep(retry_after)
                # Retry the same batch
                response = requests.get(
                    f"{SPOTIFY_API_BASE_URL}/audio-features",
                    headers=headers,
                    params=params,
                    timeout=30
                )
           
            if response.status_code == 403:
                logger.error(f"403 Forbidden for audio-features. Response: {response.text}")
                # Return empty list instead of crashing
                return []
               
            if response.status_code != 200:
                logger.error(f"Failed to get audio features: {response.status_code} - {response.text}")
                # Return what we have so far instead of crashing
                break
               
            batch_features = response.json().get('audio_features', [])
            audio_features_list.extend(batch_features)
            logger.info(f"Got {len(batch_features)} audio features from batch {i//100 + 1}")
           
            # Small delay to avoid rate limiting
            time.sleep(0.1)
           
        except Exception as e:
            logger.error(f"Exception getting audio features for batch {i//100 + 1}: {str(e)}")
            # Continue with next batch instead of failing completely
   
    logger.info(f"Total audio features retrieved: {len(audio_features_list)}")
    return audio_features_list

def calculate_aura(features_list: List[Dict]):
    # Filter out None values and tracks without features
    valid_features = [f for f in features_list if f and isinstance(f, dict)]
   
    # Explicitly filter out None values from the list of audio features
    features_list = [f for f in features_list if f]

    if not valid_features:
        return {
            "aura": {
                "name": "Silent Symphony",
                "description": "We couldn't analyze the audio features of this playlist. The tracks might not be available for analysis.",
                "color": "#9E9E9E"
            },
            "avg_features": {}
        }
    # Calculate averages only for features that exist
    avg_features = {}
    feature_keys = ["danceability", "energy", "valence", "acousticness", "instrumentalness", "tempo"]
   
    for key in feature_keys:
        values = [f[key] for f in valid_features if f.get(key) is not None]
        if values:
            avg_features[key] = sum(values) / len(values)
   
    # If no features were found
    if not avg_features:
        return {
            "aura": {
                "name": "Memory Lane",
                "description": "Your recent listening history is full of tracks that we couldn't analyze fully.",
                "color": "#9E9E9E"
            },
            "avg_features": {}
        }
    matched_aura = None
    for aura in AURAS:
        try:
            if aura["conditions"](avg_features):
                matched_aura = aura
                break
        except KeyError as e:
            logger.warning(f"Aura condition missing feature: {e}")
            continue
        except Exception as e:
            logger.warning(f"Error checking aura condition: {e}")
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
    logger.info(f"Analyzing playlist {playlist_id} with token: {access_token[:20]}...")
   
    # Validate token first
    headers = get_spotify_headers(access_token)
    test_response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
   
    if test_response.status_code != 200:
        logger.error(f"Token validation failed: {test_response.status_code} - {test_response.text}")
        raise HTTPException(
            status_code=403,
            detail={
                "error": {
                    "status": test_response.status_code,
                    "message": "Invalid or expired access token",
                    "spotify_error": test_response.json()
                }
            }
        )
   
    track_ids = await get_track_ids_from_playlist(playlist_id, access_token)
   
    if not track_ids:
        logger.warning(f"No track IDs found for playlist {playlist_id}")
        return {
            "analysis": {
                "aura": {
                    "name": "Empty Playlist",
                    "description": "This playlist doesn't contain any tracks to analyze.",
                    "color": "#9E9E9E"
                },
                "avg_features": {}
            },
            "details": await get_playlist(playlist_id, access_token)
        }
   
    logger.info(f"Found {len(track_ids)} track IDs")
   
    try:
        audio_features = await get_audio_features(track_ids, access_token)
    except Exception as e:
        logger.error(f"Error getting audio features: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "status": 500,
                    "message": "Failed to get audio features",
                    "details": str(e)
                }
            }
        )
    analysis_result = calculate_aura(audio_features)
    playlist_details = await get_playlist(playlist_id, access_token)
    logger.info(f"Playlist analysis complete. Aura: {analysis_result['aura']['name']}")
   
    return {
        "analysis": analysis_result,
        "details": playlist_details
    }

@app.get("/api/analyze/recent")
async def analyze_recent(access_token: str):
    logger.info(f"Analyzing recent tracks with token: {access_token[:20]}...")
   
    if not access_token:
        logger.error("No access token provided")
        raise HTTPException(
            status_code=401,
            detail={
                "error": {
                    "status": 401,
                    "message": "No access token provided"
                }
            }
        )
   
    # Validate token first
    headers = get_spotify_headers(access_token)
    test_response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
   
    if test_response.status_code != 200:
        logger.error(f"Token validation failed: {test_response.status_code} - {test_response.text}")
       
        error_detail = test_response.json() if test_response.text else {"error": "No response from Spotify"}
       
        raise HTTPException(
            status_code=403,
            detail={
                "error": {
                    "status": test_response.status_code,
                    "message": error_detail.get("error", {}).get("message", "Invalid or expired token"),
                    "spotify_response": error_detail
                }
            }
        )
   
    # Get recently played tracks
    try:
        recent_data = await get_recently_played(access_token)
    except HTTPException as e:
        logger.error(f"Failed to get recently played: {e.detail}")
        raise HTTPException(
            status_code=403,
            detail={
                "error": {
                    "status": 403,
                    "message": "Failed to get recently played tracks from Spotify",
                    "original_error": e.detail
                }
            }
        )
   
    # Extract track IDs
    track_ids = []
    for item in recent_data.get('items', []):
        if item and item.get('track') and item.get('track').get('id'):
            track_id = item['track']['id']
            # Only add valid track IDs
            if track_id and isinstance(track_id, str) and len(track_id) > 10:
                track_ids.append(track_id)
   
    # Remove duplicates while preserving order
    unique_track_ids = list(dict.fromkeys(track_ids))
    logger.info(f"Found {len(track_ids)} tracks, {len(unique_track_ids)} unique")
   
    if not unique_track_ids:
        logger.warning("No valid track IDs found in recently played")
        return {
            "analysis": {
                "aura": {
                    "name": "Silent Night",
                    "description": "You haven't listened to any tracks recently or we couldn't process them!",
                    "color": "#9E9E9E"
                },
                "avg_features": {}
            },
            "details": {"name": "Recently Played", "tracks": recent_data}
        }
   
    # Get audio features
    try:
        audio_features = await get_audio_features(unique_track_ids, access_token)
    except Exception as e:
        logger.error(f"Failed to get audio features: {str(e)}")
        # Return partial results instead of failing completely
        return {
            "analysis": {
                "aura": {
                    "name": "Partial Analysis",
                    "description": "We could only partially analyze your recent tracks due to technical limitations.",
                    "color": "#FF9800"
                },
                "avg_features": {}
            },
            "details": {"name": "Recently Played", "tracks": recent_data}
        }
   
    logger.info(f"Got {len(audio_features)} audio features")
   
    # Calculate aura
    analysis_result = calculate_aura(audio_features)
    logger.info(f"Recent analysis complete. Aura: {analysis_result['aura']['name']}")
    return {
        "analysis": analysis_result,
        "details": {"name": "Recently Played", "tracks": recent_data}
    }

# NEW ENDPOINT: Analyze a single track
@app.get("/api/analyze/track/{track_id}")
async def analyze_track(track_id: str, access_token: str):
    logger.info(f"Analyzing single track {track_id} with token: {access_token[:20]}...")
   
    headers = get_spotify_headers(access_token)
   
    # Validate token
    test_response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
    if test_response.status_code != 200:
        logger.error(f"Token validation failed: {test_response.status_code} - {test_response.text}")
        raise HTTPException(
            status_code=403,
            detail={
                "error": {
                    "status": test_response.status_code,
                    "message": "Invalid or expired access token",
                    "spotify_error": test_response.json()
                }
            }
        )
   
    # Get audio features for the track
    features = None
    try:
        response = requests.get(f"{SPOTIFY_API_BASE_URL}/audio-features/{track_id}", headers=headers, timeout=10)
        if response.status_code == 200 and response.text:
            # If the request is successful and there's content, parse it
            features = response.json()
        elif response.status_code != 200:
            # Log a warning for non-200 responses, but don't crash
            logger.warning(
                f"Spotify API returned status {response.status_code} for audio features of track {track_id}"
            )
    except requests.exceptions.RequestException as e:
        # If the request itself fails, log the error but don't crash
        logger.error(f"Request failed for audio features of track {track_id}: {str(e)}")
   
    # Calculate aura based on single track
    analysis_result = calculate_aura([features])
   
    # Get track details, but don't fail if the request doesn't work
    track_details = None
    try:
        track_response = requests.get(f"{SPOTIFY_API_BASE_URL}/tracks/{track_id}", headers=headers, timeout=10)
        if track_response.status_code == 200 and track_response.text:
            track_details = track_response.json()
        else:
            logger.warning(
                f"Spotify API returned status {track_response.status_code} for track details of {track_id}"
            )
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed for track details of {track_id}: {str(e)}")
   
    logger.info(f"Single track analysis complete. Aura: {analysis_result['aura']['name']}")
   
    return {
        "analysis": analysis_result,
        "track": track_details
    }

@app.post("/api/audio_features")
async def get_audio_features_endpoint(request: AudioFeaturesRequest):
    return await get_audio_features(request.track_ids, request.access_token)

@app.post("/api/calculate_aura")
async def calculate_aura_endpoint(request: AuraCalculationRequest):
    return calculate_aura(request.features_list)

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Aurafy API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")