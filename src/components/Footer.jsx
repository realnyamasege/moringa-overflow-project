// src/components/Footer.jsx
import React from 'react';
import '../Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/downloads">Downloads</a></li>
            <li><a href="/jobs">Jobs</a></li>
          </ul>
        </div>
        <div>
          <h3>Privacy & Safety</h3>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/user-agreement">User Agreement</a></li>
            <li><a href="/transparency">Transparency Report</a></li>
            <li><a href="/terms">Other Terms and Policies</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-social">
        <h3>Follow us on:</h3>
        <a href="https://facebook.com"><img src="/path/to/facebook-icon.png" alt="Facebook" /></a>
        <a href="https://instagram.com"><img src="/path/to/instagram-icon.png" alt="Instagram" /></a>
        <a href="https://linkedin.com"><img src="/path/to/linkedin-icon.png" alt="LinkedIn" /></a>
      </div>
    </footer>
  );
}

export default Footer;
