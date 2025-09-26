# Aurafy.

![Aurafy Banner](https://capsule-render.vercel.app/api?type=venom&height=200&color=0:43cea2,100:185a9d&text=%20Aurafy&textBg=false&desc=(Find+Your+Musical+Personality)&descAlign=79&fontAlign=50&descAlignY=70&fontColor=f7f5f5)

<p align="center">Aurafy is web application that analyzes your music listening habits and assigns humorous "auras" based on audio features.</p>

![Aurafy your playlist](https://img.shields.io/badge/React-18.2.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-green) ![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen)


<h3>Quick Links</h3>

<div align="left">
    <a href="mailto:mwalyangashadrack@gmail.com"><img src="https://img.shields.io/badge/Contact%20Me-30302f?style=flat-square&logo=gmail" alt=""></a>
    <a href="https://github.com/zuck30/aura-fy"><img src="https://img.shields.io/badge/Repository-30302f?style=flat-square&logo=github" alt=""></a>
</div>

<br>
<a href="https://github.com/zuck30/aura-fy"> <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmU3dzFubm5zN3U4ZWtsaXN5cG1sZGd6ZXhqeW1yMDh1MnkzYjlseSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EFGXDUBXcUd131C0CR/giphy.gif" width="40%" align="right" style="border-radius:10px; animation: float 6s ease-in-out infinite;" alt="Coding GIF">
</a>

<ul>
    <li>🔭 Currently analyzing musical patterns with <a href="https://developer.spotify.com/documentation/web-api">Spotify API</a></li>
    <li>👨‍💻 Built with React, FastAPI, and Python</li>
    <li>🎵 Transforms audio features into humorous personality insights</li>
</ul>

<h2 id=lang>Tech Stack</h2>

**Frontend**

![My Skills](https://skillicons.dev/icons?i=react,js,html,css,tailwind&perline=10)

**Backend**

![My Skills](https://skillicons.dev/icons?i=python,fastapi&perline=10)

**Tools & Platforms**

![My Skills](https://skillicons.dev/icons?i=github,vscode,netlify,heroku&perline=10)

**API**

![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen?style=for-the-badge&logo=spotify)

<h2> Quick Start</h2>

### Prerequisites

- Python 3.8+
- Node.js 14+
- Spotify Developer Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zuck30/aurafy.git
   cd aurafy
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
   npm install @chakra-ui/react@2.4.9
   ```

4. **Configure Spotify API for Local Development**
   - Create a Spotify Developer account at [https://developer.spotify.com/](https://developer.spotify.com/)
   - Register a new application.
   - In the app settings, add `http://127.0.0.1:8000/api/callback` as a redirect URI.
   - For local development, you can leave the default `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `backend/main.py` or replace them with your own.

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

## Deploying to Vercel

This project is configured for easy deployment to Vercel.

1.  **Fork this repository.**

2.  **Create a new project on Vercel** and connect it to your forked repository.

3.  **Configure Environment Variables:** In your Vercel project settings, add the following environment variables:

    *   `PRODUCTION_URL`: The full URL of your Vercel deployment (e.g., `https://your-app-name.vercel.app`).
    *   `FRONTEND_URL`: The same URL as `PRODUCTION_URL`.
    *   `SPOTIFY_CLIENT_ID`: Your Spotify application's client ID.
    *   `SPOTIFY_CLIENT_SECRET`: Your Spotify application's client secret.

4.  **Update Spotify Redirect URI:** In your Spotify application settings, add the following redirect URI:

    ```
    <YOUR_PRODUCTION_URL>/api/callback
    ```

    Replace `<YOUR_PRODUCTION_URL>` with your Vercel deployment URL.

5.  **Deploy!** Vercel will automatically build and deploy your application.

 ### Aurafy overview
<h2>The Login page</h2>

![Screenshot](./screenshots/login.png)
<h2>The spotify authentication page.</h2>

![Screenshot](./screenshots/auth.png)

<h2>Main dashboard</h2>

![Screenshot](./screenshots/dashboard.png)

<h2>Recently played.</h2>

![Screenshot](./screenshots/recently-played.png)

<h2> TODO: </h2>
<h3>Write better algorithm for the auras.</h3>

- **The Pogo Sticking Toddler**: High energy + high danceability
- **The Contemplative Emo Poet**: Low valence + high acousticness  
- **The Anxious Hummingbird**: High tempo + low energy
- **The Euphoric Clubber**: High energy + high positivity
- **The Moody Vampire**: Dark and atmospheric
- **The Chill Beach Bum**: Acoustic, positive, and relaxed

<h2> Responsive Design</h2>

The application is optimized for all device sizes:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Laptops (1024px and up)
- Large screens (1200px and up)

<h2> Support the Project</h2>
<p>
    <a href="https://www.buymeacoffee.com/zuck30" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" height="30px" ></a>
</p>

<div align="center">
<blockquote>
<p><em>"Music is the shorthand of emotion."</em></p>
<p><strong>Leo Tolstoy</strong></p>
</blockquote>
</div>

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License, see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Spotify for their comprehensive API
- FastAPI for the excellent web framework
- React team for the frontend library

## Support

If you have any questions or issues, please open an issue on GitHub or contact us at mwalyangashadrack@gmail.com

## Enjoy!

We hope you have fun discovering your musical aura! Share your results with friends and compare your musical personalities.

---

**Note**: This app is designed for entertainment purposes only. The "auras" are not scientifically validated assessments of personality or mood.