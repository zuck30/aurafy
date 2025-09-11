# Contributing to Aurafy 🎵✨

Thank you for your interest in contributing to **Aurafy**! We welcome contributions from the community to help improve this Spotify-powered web application that analyzes music listening habits and assigns humorous "auras." Whether you're fixing bugs, adding features, or improving documentation, your contributions are greatly appreciated.

## 📋 How to Contribute

Follow these steps to contribute to the project:

### 1. Fork the Repository
- Navigate to the [Aura-fy repository](https://github.com/zuck30/aura-fy) on GitHub.
- Click the **Fork** button to create a copy of the repository under your GitHub account.

### 2. Clone Your Fork
- Clone your forked repository to your local machine:
  ```bash
  git clone https://github.com/zuck30/aura-fy.git
  cd aura-fy
  ```

### 3. Create a Feature Branch
- Create a new branch for your feature or bug fix:
  ```bash
  git checkout -b feature/YourFeatureName
  ```
  Use a descriptive branch name, such as `feature/add-new-aura` or `bugfix/fix-auth-error`.

### 4. Set Up the Development Environment
- Ensure you have the prerequisites installed:
  - **Python 3.8+**
  - **Node.js 14+**
  - A Spotify Developer Account ([Sign up here](https://developer.spotify.com/))
- Follow the setup instructions in the [README.md](README.md) to configure the backend and frontend:
  - Install backend dependencies: `pip install -r backend/requirements.txt`
  - Install frontend dependencies: `npm install` in the `frontend` directory
  - Configure Spotify API credentials in `backend/main.py`
- Test the application locally by running:
  ```bash
  # Backend
  cd backend
  python main.py
  ```
  ```bash
  # Frontend (in a new terminal)
  cd frontend
  npm start
  ```

### 5. Make Your Changes
- Work on your feature, bug fix, or documentation improvement.
- Ensure your changes align with the project's coding style:
  - Use **PEP 8** for Python code.
  - Follow **ESLint** rules for JavaScript/React (if applicable).
  - Keep code clean and well-documented.
- Test your changes thoroughly to ensure they work as expected.

### 6. Commit Your Changes
- Write clear, concise commit messages:
  ```bash
  git commit -m "Add feature: implement new aura for high tempo tracks"
  ```
- Commit messages should describe *what* was changed and *why*.

### 7. Push to Your Fork
- Push your changes to your forked repository:
  ```bash
  git push origin feature/YourFeatureName
  ```

### 8. Open a Pull Request
- Go to the [Aura-fy repository](https://github.com/zuck30/aura-fy) on GitHub.
- Click **New Pull Request** and select your branch.
- Provide a detailed description of your changes, including:
  - What you changed and why.
  - Any relevant issue numbers (e.g., `Fixes #123`).
  - Screenshots or examples (if applicable, especially for UI changes).
- Submit the pull request for review.

## 🔍 Code Review Process
- Maintainers will review your pull request as soon as possible.
- Be open to feedback and make requested changes if needed.
- Once approved, your changes will be merged into the main branch.

## 🐛 Reporting Bugs
- Check the [Issues](https://github.com/zuck30/aura-fy/issues) page to ensure the bug hasn't already been reported.
- Open a new issue with:
  - A clear title and description.
  - Steps to reproduce the bug.
  - Expected and actual behavior.
  - Screenshots or logs, if applicable.
  - Your environment (e.g., OS, browser, Python/Node.js versions).

## 💡 Suggesting Features
- Open an issue with the label `enhancement`.
- Describe the feature, why it's useful, and how it could be implemented.
- Include examples or mockups if possible.

## 🎨 Coding Guidelines
- **Frontend**:
  - Use React 18 best practices.
  - Maintain responsive design with Tailwind CSS.
  - Avoid inline styles; use CSS classes where possible.
- **Backend**:
  - Follow FastAPI conventions for endpoint design.
  - Ensure Spotify API calls are efficient and handle errors gracefully.
  - Write unit tests for new functionality (place in `backend/tests/`).
- **General**:
  - Keep code modular and reusable.
  - Add comments for complex logic.
  - Update documentation (e.g., README or code comments) for new features.

## 🛠️ Areas for Contribution
- Adding new humorous auras (edit `backend/main.py`).
- Improving UI/UX with better visualizations or animations.
- Enhancing audio feature analysis algorithms.
- Optimizing performance for large playlists.
- Writing tests for backend and frontend.
- Updating documentation or adding tutorials.

## 📞 Getting Help
- If you have questions, open an issue or contact the maintainer at [mwalyangashadrack@gmail.com](mailto:mwalyangashadrack@gmail.com).
- Join the conversation on GitHub Discussions (if available).

## 🙏 Acknowledgments
Thank you for contributing to **Aura-fy**! Your efforts help make this project more fun and engaging for everyone. Let's keep the musical vibes flowing!