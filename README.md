# Aura-fy Your Playlist 🎵✨

Aurafy is a web application that analyzes your music listening habits and assigns humorous "auras" based on the audio features of your recently played tracks or playlists.

![Aura-fy Your Playlist](https://img.shields.io/badge/React-18.2.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-green) ![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen)

## 🌟 Features

- **Spotify Integration**: Connect your Spotify account to analyze your music
- **Humorous Auras**: Get funny, non-scientific mood classifications like "The Pogo-Sticking Toddler" or "The Contemplative Emo Poet"
- **Audio Feature Analysis**: Visual breakdown of danceability, energy, positivity, and acousticness
- **Responsive Design**: Works perfectly on mobile devices and laptops
- **Extreme Track Identification**: Discover your most and least danceable/energetic songs

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- Spotify Developer Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zuck/aura-fy.git
   cd aura-fy
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Spotify API**
   - Create a Spotify Developer account at [https://developer.spotify.com/](https://developer.spotify.com/)
   - Register a new application
   - Add `http://localhost:3000/callback` as a redirect URI in your app settings
   - Update `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `backend/main.py`

5. **Run the application**
   - Start the backend:
     ```bash
     cd backend
     python main.py
     ```
   - Start the frontend (in a new terminal):
     ```bash
     cd frontend
     npm start
     ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **Authentication**: Users log in with their Spotify account using OAuth 2.0
2. **Data Retrieval**: The app fetches recently played tracks or specific playlists
3. **Audio Analysis**: The backend analyzes audio features from Spotify:
   - Danceability
   - Energy
   - Valence (positivity)
   - Acousticness
   - Tempo
4. **Aura Assignment**: A custom algorithm maps these features to humorous auras
5. **Visualization**: Results are displayed with color-coded backgrounds and feature breakdowns

## 🎨 Example Auras

- **The Pogo-Sticking Toddler**: High energy + high danceability
- **The Contemplative Emo Poet**: Low valence + high acousticness  
- **The Anxious Hummingbird**: High tempo + low energy
- **The Euphoric Clubber**: High energy + high positivity
- **The Moody Vampire**: Dark and atmospheric
- **The Chill Beach Bum**: Acoustic, positive, and relaxed

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router DOM
- CSS3 with Flexbox/Grid
- Responsive design principles

### Backend
- FastAPI
- Python 3.8+
- Spotify Web API
- Uvicorn server

### APIs
- Spotify Web API for music data and authentication

## 📱 Responsive Design

The application is optimized for all device sizes:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Laptops (1024px and up)
- Large screens (1200px and up)

## 🔧 Configuration

### Environment Variables

For production deployment, set these environment variables:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri
```

### Customizing Auras

Edit the `AURAS` list in `backend/main.py` to add your own humorous aura definitions:

```python
{
    "name": "Your Custom Aura",
    "description": "Funny description of what this aura means",
    "conditions": lambda f: f["feature1"] > threshold and f["feature2"] < threshold,
    "color": "#HEXCODE"
}
```

## 📦 Deployment

### Backend Deployment (Example: Heroku)

1. Create a `Procfile` in the backend directory:
   ```
   web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000}
   ```

2. Deploy to Heroku:
   ```bash
   heroku create aurafy
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment (Example: Netlify)

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` folder to Netlify or similar service

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Spotify for their comprehensive API
- FastAPI for the excellent web framework
- React team for the frontend library

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact us at mwalyangashadrack@gmail.com

## 🎉 Enjoy!

We hope you have fun discovering your musical aura! Share your results with friends and compare your musical personalities.

---
