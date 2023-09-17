import React, { Fragment, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Import the CSS file

function Login({ setUser, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const history = useNavigate();

  const handleUsernameChange = (value) => {
    setUsername(value);
    setUsernameError(""); // Clear the error message when the username changes
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(""); // Clear the error message when the password changes
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setUsernameError("Please fill in all fields."); // Set the username error message
      setPasswordError("Please fill in all fields."); // Set the password error message
      return;
    }

    const data = {
      Username: username,
      Password: password,
    };

    const url = "http://40.114.196.124:5000/api/Auth/Login";

    axios
      .post(url, data)
      .then((response) => {
        const token = response.data.token;
        // Store the token in localStorage
        localStorage.setItem("token", token);
        // Call a function to validate the token and set the user
        validateTokenAndSetUser(token);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
            if(error.response.data.data == "Invalid password"){
                setPasswordError( error.response.data.data);
            }
            else{
                setUsernameError( error.response.data.data);
            }
        } else {
          setUsernameError("Login failed: An error occurred.");
        }
      });
  };

  const validateTokenAndSetUser = (token) => {
    const validateUrl = "http://40.114.196.124:5000/api/Auth/ValidateToken";

    axios
      .post(validateUrl, { token })
      .then((response) => {
        const userData = response.data.user.username;
        const userId_ = response.data.user.id;
        // Set the user data
        setUser(userData);
        setUserId(userId_);
        // Redirect to the home page
        history("/");
      })
      .catch((error) => {
        // Handle token validation errors here (e.g., expired token)
        // You can redirect to the login page or perform any other action here
      });
  };

  return (
    <Fragment>
      <div className="login-container">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="txtUsername">Username</label>
          <input
            type="text"
            id="txtUsername"
            placeholder="Enter Username"
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
          <div className="error-message">{usernameError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            id="Password"
            placeholder="Enter Password"
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          <div className="error-message">{passwordError}</div>
        </div>
        <button className="login-btn" onClick={() => handleLogin()}>
          Login
        </button>
        <p>
          Don't have an account yet? <Link to="/registration">Create one!</Link>
        </p>
      </div>
    </Fragment>
  );
}

export default Login;
