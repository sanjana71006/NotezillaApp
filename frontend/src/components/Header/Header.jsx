import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import Button from '../Button/Button';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/signup');
  };

  // Get the appropriate home link based on user role
  const getHomeLink = () => {
    if (!user) return '/signup';
    switch(user.role) {
      case 'Admin': return '/admin-dashboard';
      case 'Faculty': return '/faculty-dashboard';
      case 'Student': return '/student-dashboard';
      default: return '/student-dashboard';
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to={isAuthenticated ? getHomeLink() : "/"} className="logo-link">
          <h1 className="logo">Notezilla</h1>
        </Link>
        <nav className="nav-links">
          {user?.role === 'Admin' ? (
            // Admin Navigation
            <>
              <Link to="/admin-dashboard">Home</Link>
              <Link to="/admin-users">Users</Link>
              <Link to="/admin-resources">Resources</Link>
              <Link to="/admin-reports">Reports</Link>
              <Link to="/admin-analytics">Analytics</Link>
              <Link to="/admin-settings">Settings</Link>
            </>
          ) : (
            // Student/Faculty Navigation
            <>
              <Link to={getHomeLink()}>Home</Link>
              <Link to="/browse">Browse</Link>
              <Link to="/upload">Upload</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}
        </nav>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <Button onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// Add this to Header.css to style the logo link
// .logo-link { text-decoration: none; }

export default Header;