// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlaylistAnalysis from './components/PlaylistAnalysis';
import RecentAnalysis from './components/RecentAnalysis';

import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in URL (OAuth callback)
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      setToken(token);
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    
    // Check for token in localStorage
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="App">

        <Routes>
          <Route 
            path="/" 
            element={token ? <Dashboard token={token} /> : <Login />} 
          />
          <Route 
            path="/analyze/recent" 
            element={token ? <RecentAnalysis token={token} /> : <Login />} 
          />
          <Route 
            path="/analyze/playlist/:id" 
            element={token ? <PlaylistAnalysis token={token} /> : <Login />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import PlaylistAnalysis from "./components/PlaylistAnalysis";
// import RecentAnalysis from "./components/RecentAnalysis";
// import Navbar from "./components/Navbar";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/analyze/recent" element={<RecentAnalysis />} />
//           <Route path="/analyze/playlist/:id" element={<PlaylistAnalysis />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;