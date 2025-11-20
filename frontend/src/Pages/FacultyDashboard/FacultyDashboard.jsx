import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/ProfileSection/ProfileSection';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>👩‍🏫 Faculty Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>📤 Upload Notes</h3>
              <p>Upload lecture notes, assignments, and study materials</p>
              <button className="dashboard-btn">Upload Content</button>
            </div>
            
            <div className="dashboard-card">
              <h3>📈 Track Student Progress</h3>
              <p>Monitor student engagement and performance</p>
              <button className="dashboard-btn">View Progress</button>
            </div>
            
            <div className="dashboard-card">
              <h3>💬 Community Posts</h3>
              <p>Share updates and interact with students</p>
              <button className="dashboard-btn">Manage Posts</button>
            </div>
            
            <div className="dashboard-card">
              <h3>📝 Assignments</h3>
              <p>Create and manage student assignments</p>
              <button className="dashboard-btn">Manage Assignments</button>
            </div>
            
            <div className="dashboard-card">
              <h3>💡 Discussion Forums</h3>
              <p>Moderate discussions and answer questions</p>
              <button className="dashboard-btn">Forum Management</button>
            </div>
            
            <div className="dashboard-card">
              <h3>📊 Class Analytics</h3>
              <p>View class performance and engagement metrics</p>
              <button className="dashboard-btn">View Analytics</button>
            </div>
          </div>
        </div>
        <ProfileSection />
      </div>
    </div>
  );
};

export default FacultyDashboard;