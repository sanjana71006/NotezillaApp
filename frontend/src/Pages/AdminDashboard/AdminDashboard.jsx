import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/ProfileSection/ProfileSection';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Removed seeded admin dashboard data; values will be zero/empty until backend supplies real metrics
  const quickStats = {
    totalUsers: { students: 0, faculty: 0, admins: 0, total: 0 },
    totalResources: 0,
    totalDownloads: 0,
    totalComments: 0
  };

  const notifications = [];

  const recentActivity = [];

  return (
    <div className="dashboard admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>
        
        {/* Quick Stats Section */}
        <div className="stats-section">
          <h2>📊 Platform Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{quickStats.totalUsers.total.toLocaleString()}</h3>
                <p>Total Users</p>
                <div className="stat-breakdown">
                  <span>{quickStats.totalUsers.students} Students</span>
                  <span>{quickStats.totalUsers.faculty} Faculty</span>
                  <span>{quickStats.totalUsers.admins} Admins</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{quickStats.totalResources.toLocaleString()}</h3>
                <p>Total Resources</p>
                <div className="stat-meta">Academic materials uploaded</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⬇️</div>
              <div className="stat-content">
                <h3>{quickStats.totalDownloads.toLocaleString()}</h3>
                <p>Total Downloads</p>
                <div className="stat-meta">Files accessed by users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h3>{quickStats.totalComments.toLocaleString()}</h3>
                <p>Total Comments</p>
                <div className="stat-meta">Discussion interactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <h2>⚡ Quick Actions</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card action-card">
              <h3>👥 Manage Users</h3>
              <p>Add, edit, block, or manage user accounts and permissions</p>
              <Link to="/admin/users" className="dashboard-btn">Manage Users</Link>
            </div>
            
            <div className="dashboard-card action-card">
              <h3>� Review Resources</h3>
              <p>Approve, reject, or moderate uploaded academic content</p>
              <Link to="/admin/resources" className="dashboard-btn">Review Resources</Link>
            </div>
            
            <div className="dashboard-card action-card">
              <h3>🚩 Check Reports</h3>
              <p>Review flagged content and user misconduct reports</p>
              <Link to="/admin/reports" className="dashboard-btn">Check Reports</Link>
            </div>
            
            <div className="dashboard-card action-card">
              <h3>� View Analytics</h3>
              <p>Monitor platform growth, usage statistics, and trends</p>
              <Link to="/admin/analytics" className="dashboard-btn">View Analytics</Link>
            </div>
            
            <div className="dashboard-card action-card">
              <h3>⚙️ System Settings</h3>
              <p>Configure platform settings and security options</p>
              <Link to="/admin/settings" className="dashboard-btn">System Settings</Link>
            </div>
            
            <div className="dashboard-card action-card">
              <h3>�️ Security Center</h3>
              <p>Monitor security events and manage access controls</p>
              <Link to="/admin/security" className="dashboard-btn">Security Center</Link>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="notifications-section">
          <h2>🔔 Recent Notifications</h2>
          <div className="notifications-container admin-notifications">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.priority}`}>
                <div className={`notification-icon ${notification.type}`}>
                  {notification.type === 'flag' && '🚩'}
                  {notification.type === 'user' && '👤'}
                  {notification.type === 'upload' && '📤'}
                  {notification.type === 'report' && '⚠️'}
                </div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <div className={`priority-indicator ${notification.priority}`}>
                  {notification.priority}
                </div>
              </div>
            ))}
          </div>
          <div className="notifications-footer">
            <Link to="/admin/notifications" className="view-all-link">View All Notifications</Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <h2>📋 Recent Admin Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-details">
                    {activity.user && <span className="activity-user">User: {activity.user}</span>}
                    {activity.resource && <span className="activity-resource">Resource: {activity.resource}</span>}
                    {activity.uploader && <span className="activity-uploader">by {activity.uploader}</span>}
                    {activity.department && <span className="activity-department">({activity.department})</span>}
                    {activity.reason && <span className="activity-reason">Reason: {activity.reason}</span>}
                  </div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
        <ProfileSection />
      </div>
    </div>
  );
};

export default AdminDashboard;