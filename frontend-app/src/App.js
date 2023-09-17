import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Home from "./Home";
import Navbar from "./Navbar";
import Registration from "./Registration";
import Login from "./Login";
import Configuration from "./Configuration";
import background from "./background.png"; 

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Call a function to validate the token and set the user
      validateTokenAndSetUser(token);
    }
  }, []);

  const validateTokenAndSetUser = (token) => {
    const validateUrl = 'http://40.114.196.124:5000/api/Auth/ValidateToken';
  
    axios.post(validateUrl, { token })
      .then((response) => {
        const userData = response.data.user.username;
        const userId_ = response.data.user.id;
        // Set the user data
        setUser(userData);
        setUserId(userId_);
      })
      .catch((error) => {
        // Handle token validation errors here (e.g., expired token)
        // You can redirect to the login page or perform any other action here
        // For now, we'll clear the token from localStorage and log the user out
        localStorage.removeItem('token');
        setUser(null);
        setUserId(null);
      });
  }
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserId(null);
  };

  const appStyle = {
    backgroundImage: `url(${background})`, // Use the imported image
    backgroundSize: "cover", // Adjust as needed
    backgroundPosition: "center", // Adjust as needed
    minHeight: "100vh", // Ensure it covers the entire viewport height
  };

  return (
    <div className="App" style={appStyle}>
      <Router>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route exact path="/" element={<Home user={user} userId={userId} />} />
          <Route path="/login" element={<Login setUser={setUser} setUserId={setUserId} />} />
          <Route path="/configuration" element={<Configuration userId={userId} />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
