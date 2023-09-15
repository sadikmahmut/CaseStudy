import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/home" className="nav-link" activeClassName="active-link">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/configuration" className="nav-link" activeClassName="active-link">
            Configuration
          </NavLink>
        </li>
        <li className="nav-item">
          {user ? (
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="nav-link" activeClassName="active-link">
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
