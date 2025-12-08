# Aurafy.

![Aurafy Banner](https://capsule-render.vercel.app/api?type=venom&height=200&color=0:43cea2,100:185a9d&text=%20Aurafy&textBg=false&desc=(Find+Your+Musical+Personality)&descAlign=79&fontAlign=50&descAlignY=70&fontColor=f7f5f5)

<p align="center">Aurafy is web application that analyzes your music listening habits and assigns humorous "auras" based on audio features.</p>

![Aurafy your playlist](https://img.shields.io/badge/React-18.2.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-green) ![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen)


<h3>Quick Links</h3>

<div align="left">
    <a href="mailto:mwalyangashadrack@gmail.com"><img src="https://img.shields.io/badge/Contact%20Me-30302f?style=flat-square&logo=gmail" alt=""></a>
    <a href="https://github.com/zuck30/aurafy"><img src="https://img.shields.io/badge/Repository-30302f?style=flat-square&logo=github" alt=""></a>
</div>

<br>
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

![My Skills](https://skillicons.dev/icons?i=github,vscode&perline=10)

**API**

![Spotify API](https://img.shields.io/badge/Spotify-API-brightgreen?style=for-the-badge&logo=spotify)

<h2> Quick Start</h2>

### Prerequisites

- Python 3.8+
- Node.js 14+
- A Spotify Developer Account

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/zuck30/aurafy.git
    cd aurafy
    ```

2.  **Configure Spotify Developer App**
    - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new app.
    - Go to your app's settings and add a new "Redirect URI".
    - Add `http://127.0.0.1:8000/api/callback` to the list of Redirect URIs.
    - Take note of your `Client ID` and `Client Secret`.

3.  **Set Up Environment Variables**
    - You'll need to set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` as environment variables. You can do this by creating a `.env` file in the root of the project:
      ```
      SPOTIFY_CLIENT_ID=your_spotify_client_id
      SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
      ```
    - The backend (`main.py`) is set up to read these variables.

4.  **Install Backend Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Install Frontend Dependencies**
    ```bash
    npm install --prefix frontend
    ```

### Running the Application

You'll need to run the backend and frontend in two separate terminals.

1.  **Run the Backend**
    - In the root directory, run:
      ```bash
      uvicorn main:app --reload --port 8000
      ```
    - The backend API will be running at `http://127.0.0.1:8000`.

2.  **Run the Frontend**
    - In a new terminal, from the root directory, run:
      ```bash
      npm start --prefix frontend
      ```
    - The frontend application will open automatically in your browser at `http://localhost:3000`.

3.  **Open Your Browser**
    - Navigate to `http://localhost:3000` to use the application.

### Troubleshooting

If you encounter an `ERR_CONNECTION_REFUSED` error when trying to log in, it likely means your backend server is not running or not accessible. Here's how to debug:

1.  **Check the Backend Terminal:**
    - Look at the terminal where you ran the `uvicorn` command.
    - When you click "Continue with Spotify," you should see a log message like this:
      ```
      INFO:     __main__: Received request for /api/login
      ```
    - If you don't see this message, the frontend is not correctly communicating with the backend.

2.  **Check the Spotify Callback:**
    - After you log in with Spotify, you should be redirected back to the application. In the backend terminal, you should see:
      ```
      INFO:     __main__: Received callback from Spotify with code: <some_code>
      ```
    - If you see an error here, it could be an issue with your Spotify API credentials or the redirect URI setting in your Spotify Developer Dashboard.

3.  **Directly Access the API:**
    - With the backend running, open `http://127.0.0.1:8000/` in your browser. You should see `{"message":"Welcome to aurafy Your Playlist API"}`.
    - If this doesn't load, there is an issue with the backend server itself.

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


## License

This project is licensed under the MIT License. [LICENSE](LICENSE)

## Support

If you have any questions or issues, please open an issue on GitHub or contact us at mwalyangashadrack@gmail.com

## Enjoy!

We hope you have fun discovering your musical aura! Share your results with friends and compare your musical personalities.

**Note**: This app is designed for entertainment purposes only. The "auras" are not scientifically validated assessments of personality or mood.