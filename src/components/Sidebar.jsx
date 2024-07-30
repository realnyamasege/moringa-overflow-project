// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/questions">Questions</Link></li>
        <li><Link to="/tags">Tags</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
      <div className="learn-more">
        <img src="/path/to/learn-more-image.png" alt="Learn More" />
      </div>
    </aside>
  );
}

export default Sidebar;
