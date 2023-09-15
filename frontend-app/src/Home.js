import React from "react";
import "./Home.css"; // Import the CSS file

function Home({ user, userId }) {
  return (
    <div className="home-container">
      <h2>Home Page</h2>
      {user ? (
        <p>Welcome, {user}</p>
      ) : (
        <p>Welcome to the Home Page</p>
      )}
    </div>
  );
}

export default Home;
