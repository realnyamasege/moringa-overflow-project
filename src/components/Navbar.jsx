// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path/to/logo.png" alt="Moringa Overflow" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/forum">Forum</Link></li>
      </ul>
      <div className="navbar-search">
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>
      <div className="navbar-auth">
        <Link to="/login">Log in</Link>
        <Link to="/register" className="signup-button">Sign up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
