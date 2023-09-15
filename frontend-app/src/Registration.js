import React, { Fragment, useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import "./Registration.css"; // Import the CSS file

function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const history = useNavigate();

  const handleUsernameChange = (value) => {
    setUsername(value);
    setUsernameError(""); // Clear the error message when the username changes
  };
  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(""); // Clear the error message when the email changes
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(""); // Clear the error message when the password changes
  };

  const handleSave = () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setUsernameError("Please fill in all fields."); // Set the username error message
      setEmailError("Please fill in all fields."); // Set the email error message
      setPasswordError("Please fill in all fields."); // Set the password error message
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the email matches the pattern
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address."); // Set the email error message
      return;
    }

    const data = {
      Username: username,
      Email: email,
      Password: password,
    };

    const url = "https://localhost:44388/api/Auth/Registration";

    axios
      .post(url, data)
      .then((result) => {
        alert("Registration successful");
        history("/login");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (error.response.data.data === "Username already exists") {
            setUsernameError(error.response.data.data);
          } else {
            setUsernameError("Registration failed: An error occurred.");
          }
        } else {
          setUsernameError("Registration failed: An error occurred.");
        }
      });
  }

  return (
    <Fragment>
      <div className="registration-container">
        <h2>Registration</h2>
        <div className="form-group">
          <label htmlFor="txtUsername">Username</label>
          <input
            type="text"
            id="txtUsername"
            placeholder="Enter Username"
            onChange={(e) => handleUsernameChange(e.target.value)}
            required 
          />
          <div className="error-message">{usernameError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            id="Email"
            placeholder="Enter Email"
            onChange={(e) => handleEmailChange(e.target.value)}
            required 
          />
          <div className="error-message">{emailError}</div>
        </div>
        <div className="form-group">
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            id="Password"
            placeholder="Enter Password"
            onChange={(e) => handlePasswordChange(e.target.value)}
            required 
          />
          <div className="error-message">{passwordError}</div>
        </div>
        <button className="registration-btn" onClick={() => handleSave()}>
          Save
        </button>
      </div>
    </Fragment>
  );
}

export default Registration;
