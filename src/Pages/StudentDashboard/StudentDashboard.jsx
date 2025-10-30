import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const recentNotes = [
    { id: 1, title: "Data Structures - Arrays & Linked Lists", subject: "Computer Science", uploadedBy: "Dr. Smith", uploadDate: "2025-09-19", downloads: 45 },
    { id: 2, title: "Calculus II - Integration Techniques", subject: "Mathematics", uploadedBy: "Prof. Johnson", uploadDate: "2025-09-18", downloads: 67 },
    { id: 3, title: "Organic Chemistry - Reaction Mechanisms", subject: "Chemistry", uploadedBy: "Sarah Wilson", uploadDate: "2025-09-17", downloads: 32 }
  ];

  const topNotes = [
    { id: 1, title: "Physics - Quantum Mechanics Basics", subject: "Physics", downloads: 234, rating: 4.8 },
    { id: 2, title: "Database Management - SQL Queries", subject: "Computer Science", downloads: 189, rating: 4.7 },
    { id: 3, title: "Statistics - Probability Distributions", subject: "Mathematics", downloads: 156, rating: 4.6 }
  ];

  const notifications = [
    { id: 1, type: "upload", message: "New notes uploaded in Data Structures", time: "2 hours ago" },
    { id: 2, type: "comment", message: "Someone replied to your question in Physics forum", time: "4 hours ago" },
    { id: 3, type: "assignment", message: "New assignment posted in Calculus II", time: "1 day ago" }
  ];

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
          <div className="notes-grid">
            {recentNotes.map(note => (
              <div key={note.id} className="note-card">
                <h4>{note.title}</h4>
                <p className="note-subject">{note.subject}</p>
                <div className="note-meta">
                  <span>By: {note.uploadedBy}</span>
                  <span>{note.downloads} downloads</span>
                </div>
                <div className="note-date">{note.uploadDate}</div>
                <button className="note-download-btn">Download</button>
              </div>
            ))}
          </div>
        </div>

        {/* Most Downloaded Notes */}
        <div className="dashboard-section">
          <h2>🔥 Most Downloaded Notes</h2>
          <div className="notes-grid">
            {topNotes.map(note => (
              <div key={note.id} className="note-card featured">
                <h4>{note.title}</h4>
                <p className="note-subject">{note.subject}</p>
                <div className="note-meta">
                  <span>⭐ {note.rating}</span>
                  <span>{note.downloads} downloads</span>
                </div>
                <button className="note-download-btn">Download</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;