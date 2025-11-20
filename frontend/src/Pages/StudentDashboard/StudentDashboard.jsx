import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { resourcesAPI } from '../../services/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = useState([]);
  const [topNotes, setTopNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notifications = [];

  // Fetch recently uploaded and most downloaded notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const result = await resourcesAPI.getAll();
        const resources = result.resources || [];

        // Get recently uploaded (sorted by createdAt, newest first)
        const recent = resources
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        // Get most downloaded (sorted by downloads count, highest first)
        const mostDownloaded = resources
          .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 3);

        setRecentNotes(recent);
        setTopNotes(mostDownloaded);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes');
        setRecentNotes([]);
        setTopNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>🎓 Student Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>
        
        {/* Quick Access Cards */}
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>📥 Download Notes</h3>
              <p>Access lecture notes and study materials</p>
              <Link to="/download-notes" className="dashboard-btn">Browse Notes</Link>
            </div>
            
            <div className="dashboard-card">
              <h3>💬 Discussion Forums</h3>
              <p>Participate in class discussions and Q&A</p>
              <Link to="/discussion-forums" className="dashboard-btn">Join Discussions</Link>
            </div>
            
            <div className="dashboard-card">
              <h3>❓ Ask Doubts</h3>
              <p>Get help with your questions and clarifications</p>
              <Link to="/ask-doubts" className="dashboard-btn">Ask Questions</Link>
            </div>
            
            <div className="dashboard-card">
              <h3>📋 Assignments</h3>
              <p>View and submit your assignments</p>
              <Link to="/assignments" className="dashboard-btn">View Assignments</Link>
            </div>
            
            <div className="dashboard-card">
              <h3>📚 Study Groups</h3>
              <p>Join or create study groups with classmates</p>
              <Link to="/study-groups" className="dashboard-btn">Study Groups</Link>
            </div>
            
            <div className="dashboard-card">
              <h3>📊 My Progress</h3>
              <p>Track your academic progress and achievements</p>
              <Link to="/my-progress" className="dashboard-btn">View Progress</Link>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="dashboard-section">
          <h2>🔔 Notifications</h2>
          <div className="notifications-container">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className={`notification-icon ${notification.type}`}>
                  {notification.type === 'upload' && '📤'}
                  {notification.type === 'comment' && '💬'}
                  {notification.type === 'assignment' && '📋'}
                </div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Uploaded Notes */}
        <div className="dashboard-section">
          <h2>📚 Recently Uploaded Notes</h2>
          {loading ? (
            <div className="loading-message">Loading notes...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : recentNotes.length === 0 ? (
            <div className="empty-message">
              <p>No notes available yet.</p>
              <Link to="/browse" className="browse-link">Browse all resources →</Link>
            </div>
          ) : (
            <div className="notes-grid">
              {recentNotes.map(note => (
                <div key={note._id} className="note-card">
                  <h4>{note.title}</h4>
                  <p className="note-subject">{note.subject || 'N/A'}</p>
                  <p className="note-description">{note.description}</p>
                  <div className="note-meta">
                    <span>📤 {note.uploadedByName || 'Anonymous'}</span>
                    <span>📥 {note.downloads || 0} downloads</span>
                  </div>
                  <div className="note-date">{new Date(note.createdAt).toLocaleDateString()}</div>
                  <Link to={`/browse#${note._id}`} className="note-download-btn">View & Download</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Downloaded Notes */}
        <div className="dashboard-section">
          <h2>🔥 Most Downloaded Notes</h2>
          {loading ? (
            <div className="loading-message">Loading notes...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : topNotes.length === 0 ? (
            <div className="empty-message">
              <p>No popular notes yet.</p>
              <Link to="/browse" className="browse-link">Browse all resources →</Link>
            </div>
          ) : (
            <div className="notes-grid">
              {topNotes.map(note => (
                <div key={note._id} className="note-card featured">
                  <div className="featured-badge">🔥 Popular</div>
                  <h4>{note.title}</h4>
                  <p className="note-subject">{note.subject || 'N/A'}</p>
                  <p className="note-description">{note.description}</p>
                  <div className="note-meta">
                    <span>⭐ {note.downloads || 0} downloads</span>
                    <span>📊 {note.category || 'Resource'}</span>
                  </div>
                  <Link to={`/browse#${note._id}`} className="note-download-btn">View & Download</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;