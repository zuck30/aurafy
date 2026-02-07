import requests
import base64
import webbrowser
from urllib.parse import urlencode

# Your credentials
CLIENT_ID = "85a4b164d555499a84c0d16725bad0fa"
CLIENT_SECRET = "449877bbefaa407cae497994af27658b"
REDIRECT_URI = "http://127.0.0.1:8000/api/callback"

# Step 1: Build authorization URL
scope = " ".join([
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative"
])

params = {
    "client_id": CLIENT_ID,
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": scope,
    "show_dialog": True
}

auth_url = f"https://accounts.spotify.com/authorize?{urlencode(params)}"
print(f"Authorization URL:\n{auth_url}\n")

# Open in browser
webbrowser.open(auth_url)

print("After authorizing, you'll be redirected to a URL like:")
print("http://127.0.0.1:8000/api/callback?code=AQB...")
print("\nCopy the ENTIRE code from the URL (everything after 'code=' and before any '&')")

auth_code = input("\nPaste the code here: ").strip()

# Step 2: Exchange code for tokens
token_url = "https://accounts.spotify.com/api/token"
auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()

data = {
    "grant_type": "authorization_code",
    "code": auth_code,
    "redirect_uri": REDIRECT_URI
}

headers = {
    "Authorization": f"Basic {auth_header}",
    "Content-Type": "application/x-www-form-urlencoded"
}

print("\nExchanging code for tokens...")
response = requests.post(token_url, data=data, headers=headers, timeout=30)

if response.status_code == 200:
    token_data = response.json()
    
    print("\n✅ SUCCESS! Tokens obtained:")
    print(f"Access Token: {token_data['access_token'][:50]}...")
    print(f"Token Length: {len(token_data['access_token'])} characters")
    print(f"Token Type: {token_data['token_type']}")
    print(f"Expires In: {token_data['expires_in']} seconds")
    
    if 'refresh_token' in token_data:
        print(f"Refresh Token: {token_data['refresh_token'][:50]}...")
    
    # Test the token
    print("\nTesting token with Spotify API...")
    test_headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    test_response = requests.get("https://api.spotify.com/v1/me", headers=test_headers, timeout=10)
    
    if test_response.status_code == 200:
        user_data = test_response.json()
        print(f"✅ Token works! User: {user_data.get('display_name')}")
        print(f"   User ID: {user_data.get('id')}")
        print(f"   Email: {user_data.get('email')}")
        
        # Now test with our API
        print("\nTesting with Aurafy API...")
        api_response = requests.get(
            f"http://localhost:8000/api/test-token?access_token={token_data['access_token']}",
            timeout=10
        )
        
        if api_response.status_code == 200:
            api_data = api_response.json()
            print(f"✅ Aurafy API test: {api_data}")
        else:
            print(f"❌ Aurafy API test failed: {api_response.status_code}")
            print(api_response.text)
    else:
        print(f"❌ Spotify API test failed: {test_response.status_code}")
        print(test_response.text)
else:
    print(f"❌ Failed to get token: {response.status_code}")
    print(response.text)