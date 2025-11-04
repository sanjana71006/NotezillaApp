import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user } = useAuth();

  // Get the appropriate home link based on user role
  const getHomeLink = () => {
    if (!user) return '/';
    switch(user.role) {
      case 'Admin': return '/admin-dashboard';
      case 'Faculty': return '/faculty-dashboard';
      case 'Student': return '/student-dashboard';
      default: return '/student-dashboard';
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-about">
          <h3>Notezilla</h3>
          <p>Empowering students with collaborative learning and resource sharing.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to={getHomeLink()}>Home</Link></li>
            <li><Link to="/browse">Browse</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            {/* Show Contact only for Students and Faculty, not Admin */}
            {user?.role !== 'Admin' && (
              <li><Link to="/contact">Contact</Link></li>
            )}
          </ul>
        </div>
        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Past Papers</a></li>
            <li><a href="#">Study Notes</a></li>
            <li><a href="#">Lab Reports</a></li>
            <li><a href="#">Project Ideas</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Guidelines</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Notezilla. All rights reserved. Made with ❤️ for students, by students.</p>
      </div>
    </footer>
  );
};

export default Footer;