# backend/debug_main.py - DEBUG VERSION
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import urllib.parse
from typing import List, Dict
import base64
import logging
import time

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPOTIFY_CLIENT_ID = "85a4b164d555499a84c0d16725bad0fa"
SPOTIFY_CLIENT_SECRET = "449877bbefaa407cae497994af27658b"
SPOTIFY_REDIRECT_URI = "http://127.0.0.1:8000/api/callback"
SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1"

def get_spotify_headers(access_token: str):
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

def validate_token(access_token: str):
    """Validate token and return user info for debugging"""
    headers = get_spotify_headers(access_token)
    try:
        response = requests.get(f"{SPOTIFY_API_BASE_URL}/me", headers=headers)
        logger.debug(f"Token validation status: {response.status_code}")
        if response.status_code == 200:
            user_data = response.json()
            logger.debug(f"User: {user_data.get('display_name')}, ID: {user_data.get('id')}")
            return True, user_data
        else:
            logger.error(f"Token validation failed: {response.status_code} - {response.text}")
            return False, response.json()
    except Exception as e:
        logger.error(f"Token validation error: {str(e)}")
        return False, {"error": str(e)}

@app.get("/api/debug/test-token")
async def debug_test_token(access_token: str):
    """Test token and permissions"""
    is_valid, data = validate_token(access_token)
    return {
        "valid": is_valid,
        "data": data,
        "token_preview": access_token[:20] + "..." if access_token else "None"
    }

@app.get("/api/debug/test-playlist/{playlist_id}")
async def debug_test_playlist(playlist_id: str, access_token: str):
    """Debug endpoint to see playlist contents and test audio features"""
    logger.debug(f"DEBUG: Testing playlist {playlist_id}")
    
    # First validate token
    is_valid, user_data = validate_token(access_token)
    if not is_valid:
        return {"error": "Invalid token", "details": user_data}
    
    headers = get_spotify_headers(access_token)
    
    # Get playlist details
    try:
        playlist_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}",
            headers=headers
        )
        logger.debug(f"Playlist response status: {playlist_response.status_code}")
        
        if playlist_response.status_code != 200:
            return {
                "error": "Failed to get playlist",
                "status_code": playlist_response.status_code,
                "response": playlist_response.json()
            }
        
        playlist_data = playlist_response.json()
        playlist_name = playlist_data.get('name', 'Unknown')
        total_tracks = playlist_data.get('tracks', {}).get('total', 0)
        
        logger.debug(f"Playlist: {playlist_name}, Total tracks: {total_tracks}")
        
        # Get all tracks from playlist
        track_ids = []
        track_details = []
        
        # Get tracks with pagination
        url = f"{SPOTIFY_API_BASE_URL}/playlists/{playlist_id}/tracks"
        params = {"limit": 50, "offset": 0}
        
        while url:
            tracks_response = requests.get(url, headers=headers, params=params)
            logger.debug(f"Tracks batch response: {tracks_response.status_code}")
            
            if tracks_response.status_code != 200:
                break
            
            tracks_data = tracks_response.json()
            items = tracks_data.get('items', [])
            
            for item in items:
                track = item.get('track')
                if track and track.get('id'):
                    track_id = track['id']
                    track_name = track.get('name', 'Unknown')
                    artists = ", ".join([a.get('name', '') for a in track.get('artists', [])])
                    is_local = track.get('is_local', False)
                    
                    track_ids.append(track_id)
                    track_details.append({
                        "id": track_id,
                        "name": track_name,
                        "artists": artists,
                        "is_local": is_local,
                        "is_playable": track.get('is_playable', True),
                        "duration_ms": track.get('duration_ms'),
                        "popularity": track.get('popularity')
                    })
            
            # Check for next page
            url = tracks_data.get('next')
            params = None  # Next URL includes params
            
            # Break if we've processed enough tracks for debugging
            if len(track_ids) >= 20:  # Limit for debugging
                break
        
        logger.debug(f"Found {len(track_ids)} tracks, checking validity...")
        
        # Check track ID format
        invalid_track_ids = []
        valid_track_ids = []
        
        for track_id in track_ids:
            if not track_id or not isinstance(track_id, str) or len(track_id) != 22:
                invalid_track_ids.append(track_id)
            else:
                valid_track_ids.append(track_id)
        
        logger.debug(f"Valid track IDs: {len(valid_track_ids)}, Invalid: {len(invalid_track_ids)}")
        
        # Test audio features for first 5 tracks
        test_features = []
        if valid_track_ids:
            # Test first 5 tracks
            test_batch = valid_track_ids[:5]
            params = {"ids": ",".join(test_batch)}
            
            features_response = requests.get(
                f"{SPOTIFY_API_BASE_URL}/audio-features",
                headers=headers,
                params=params
            )
            
            logger.debug(f"Audio features test response: {features_response.status_code}")
            
            if features_response.status_code == 200:
                features_data = features_response.json()
                audio_features = features_data.get('audio_features', [])
                
                for i, feature in enumerate(audio_features):
                    if feature:
                        test_features.append({
                            "track_id": test_batch[i],
                            "track_name": next((t['name'] for t in track_details if t['id'] == test_batch[i]), "Unknown"),
                            "has_features": True,
                            "features": {
                                "danceability": feature.get('danceability'),
                                "energy": feature.get('energy'),
                                "valence": feature.get('valence')
                            }
                        })
                    else:
                        test_features.append({
                            "track_id": test_batch[i],
                            "track_name": next((t['name'] for t in track_details if t['id'] == test_batch[i]), "Unknown"),
                            "has_features": False,
                            "error": "No features returned"
                        })
            else:
                logger.error(f"Audio features error: {features_response.status_code} - {features_response.text}")
        
        return {
            "playlist_info": {
                "name": playlist_name,
                "id": playlist_id,
                "total_tracks": total_tracks,
                "owner": playlist_data.get('owner', {}).get('display_name'),
                "public": playlist_data.get('public')
            },
            "tracks_sample": track_details[:10],  # First 10 tracks
            "track_ids_analysis": {
                "total": len(track_ids),
                "valid_format": len(valid_track_ids),
                "invalid_format": len(invalid_track_ids),
                "invalid_examples": invalid_track_ids[:5] if invalid_track_ids else [],
                "valid_examples": valid_track_ids[:5] if valid_track_ids else []
            },
            "audio_features_test": {
                "tested_tracks": len(test_batch) if valid_track_ids else 0,
                "results": test_features
            },
            "debug_info": {
                "user": user_data.get('display_name'),
                "user_id": user_data.get('id'),
                "token_valid": is_valid
            }
        }
        
    except Exception as e:
        logger.error(f"Debug error: {str(e)}")
        return {"error": str(e), "traceback": str(e.__traceback__)}

@app.get("/api/debug/test-recent")
async def debug_test_recent(access_token: str):
    """Debug endpoint for recently played tracks"""
    logger.debug("DEBUG: Testing recent tracks")
    
    # Validate token
    is_valid, user_data = validate_token(access_token)
    if not is_valid:
        return {"error": "Invalid token", "details": user_data}
    
    headers = get_spotify_headers(access_token)
    
    try:
        # Get recently played
        recent_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/me/player/recently-played?limit=20",
            headers=headers
        )
        
        logger.debug(f"Recent tracks response: {recent_response.status_code}")
        
        if recent_response.status_code != 200:
            return {
                "error": "Failed to get recent tracks",
                "status_code": recent_response.status_code,
                "response": recent_response.json()
            }
        
        recent_data = recent_response.json()
        items = recent_data.get('items', [])
        
        track_ids = []
        track_details = []
        
        for item in items:
            track = item.get('track')
            if track and track.get('id'):
                track_id = track['id']
                track_name = track.get('name', 'Unknown')
                artists = ", ".join([a.get('name', '') for a in track.get('artists', [])])
                played_at = item.get('played_at')
                
                track_ids.append(track_id)
                track_details.append({
                    "id": track_id,
                    "name": track_name,
                    "artists": artists,
                    "played_at": played_at,
                    "is_local": track.get('is_local', False),
                    "is_playable": track.get('is_playable', True)
                })
        
        logger.debug(f"Found {len(track_ids)} recent tracks")
        
        # Check track ID format
        invalid_track_ids = []
        valid_track_ids = []
        
        for track_id in track_ids:
            if not track_id or not isinstance(track_id, str) or len(track_id) != 22:
                invalid_track_ids.append(track_id)
            else:
                valid_track_ids.append(track_id)
        
        # Test audio features for first 5 valid tracks
        test_features = []
        if valid_track_ids:
            test_batch = valid_track_ids[:5]
            params = {"ids": ",".join(test_batch)}
            
            features_response = requests.get(
                f"{SPOTIFY_API_BASE_URL}/audio-features",
                headers=headers,
                params=params
            )
            
            logger.debug(f"Recent audio features test: {features_response.status_code}")
            
            if features_response.status_code == 200:
                features_data = features_response.json()
                audio_features = features_data.get('audio_features', [])
                
                for i, feature in enumerate(audio_features):
                    if feature:
                        test_features.append({
                            "track_id": test_batch[i],
                            "track_name": next((t['name'] for t in track_details if t['id'] == test_batch[i]), "Unknown"),
                            "has_features": True,
                            "features": {
                                "danceability": feature.get('danceability'),
                                "energy": feature.get('energy'),
                                "valence": feature.get('valence')
                            }
                        })
                    else:
                        test_features.append({
                            "track_id": test_batch[i],
                            "track_name": next((t['name'] for t in track_details if t['id'] == test_batch[i]), "Unknown"),
                            "has_features": False,
                            "error": "No features returned"
                        })
        
        return {
            "recent_tracks": {
                "total_found": len(track_ids),
                "sample": track_details[:10]
            },
            "track_id_analysis": {
                "valid_format": len(valid_track_ids),
                "invalid_format": len(invalid_track_ids),
                "invalid_examples": invalid_track_ids[:5] if invalid_track_ids else []
            },
            "audio_features_test": {
                "tested_tracks": len(test_batch) if valid_track_ids else 0,
                "results": test_features
            },
            "debug_info": {
                "user": user_data.get('display_name'),
                "user_id": user_data.get('id'),
                "response_items": len(items)
            }
        }
        
    except Exception as e:
        logger.error(f"Debug recent error: {str(e)}")
        return {"error": str(e)}

@app.get("/api/debug/test-single-track/{track_id}")
async def debug_test_single_track(track_id: str, access_token: str):
    """Debug single track analysis"""
    logger.debug(f"DEBUG: Testing single track {track_id}")
    
    # Validate token
    is_valid, user_data = validate_token(access_token)
    if not is_valid:
        return {"error": "Invalid token", "details": user_data}
    
    headers = get_spotify_headers(access_token)
    
    try:
        # Get track details
        track_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/tracks/{track_id}",
            headers=headers
        )
        
        logger.debug(f"Track response: {track_response.status_code}")
        
        if track_response.status_code != 200:
            return {
                "error": "Track not found",
                "status_code": track_response.status_code,
                "response": track_response.json()
            }
        
        track_data = track_response.json()
        
        # Get audio features
        features_response = requests.get(
            f"{SPOTIFY_API_BASE_URL}/audio-features/{track_id}",
            headers=headers
        )
        
        logger.debug(f"Audio features response: {features_response.status_code}")
        
        features_data = {}
        if features_response.status_code == 200:
            features_data = features_response.json()
        
        return {
            "track_info": {
                "id": track_data.get('id'),
                "name": track_data.get('name'),
                "artists": [a.get('name') for a in track_data.get('artists', [])],
                "album": track_data.get('album', {}).get('name'),
                "duration_ms": track_data.get('duration_ms'),
                "popularity": track_data.get('popularity'),
                "is_local": track_data.get('is_local', False),
                "is_playable": track_data.get('is_playable', True),
                "explicit": track_data.get('explicit', False)
            },
            "audio_features": {
                "status_code": features_response.status_code,
                "has_features": features_response.status_code == 200 and features_data,
                "data": features_data if features_response.status_code == 200 else features_response.json(),
                "available_features": list(features_data.keys()) if features_data else []
            },
            "track_id_analysis": {
                "length": len(track_id),
                "format_valid": len(track_id) == 22 and isinstance(track_id, str),
                "characters": track_id
            }
        }
        
    except Exception as e:
        logger.error(f"Debug single track error: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting DEBUG server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")