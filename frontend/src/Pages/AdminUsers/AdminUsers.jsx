import React, { useState } from 'react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Removed seeded user data. Real user lists will be loaded from the API.
  const users = {
    students: [],
    faculty: [],
    admins: []
  };

  const filteredUsers = users[activeTab].filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || user.status === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  const handleBlockUser = (userId) => {
    // Mock block functionality
    console.log(`Blocking user with ID: ${userId}`);
    alert('User has been blocked successfully');
  };

  const handleUnblockUser = (userId) => {
    // Mock unblock functionality
    console.log(`Unblocking user with ID: ${userId}`);
    alert('User has been unblocked successfully');
  };

  const handleViewActivity = (userId) => {
    // Mock view activity functionality
    console.log(`Viewing activity for user ID: ${userId}`);
    alert('Activity logs would be shown here');
  };

  const handleApproveUser = (userId) => {
    // Mock approve functionality
    console.log(`Approving user with ID: ${userId}`);
    alert('User has been approved successfully');
  };

  const renderUserRow = (user) => {
    if (activeTab === 'students') {
      return (
        <tr key={user.id} className={`user-row ${user.status}`}>
          <td>
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </td>
          <td>{user.year}</td>
          <td>{user.semester}</td>
          <td>{user.joinDate}</td>
          <td>
            <span className={`status-badge ${user.status}`}>
              {user.status}
            </span>
          </td>
          <td>{user.uploads}</td>
          <td>{user.downloads}</td>
          <td>{user.lastActive}</td>
          <td>
            <div className="action-buttons">
              <button onClick={() => handleViewActivity(user.id)} className="btn-view">
                👁️ View
              </button>
              {user.status === 'active' ? (
                <button onClick={() => handleBlockUser(user.id)} className="btn-block">
                  🚫 Block
                </button>
              ) : (
                <button onClick={() => handleUnblockUser(user.id)} className="btn-unblock">
                  ✅ Unblock
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    } else if (activeTab === 'faculty') {
      return (
        <tr key={user.id} className={`user-row ${user.status}`}>
          <td>
            <div className="user-info">
              <div className="user-avatar">👨‍🏫</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </td>
          <td>{user.department}</td>
          <td>{user.joinDate}</td>
          <td>
            <span className={`status-badge ${user.status}`}>
              {user.status}
            </span>
          </td>
          <td>{user.uploads}</td>
          <td>{user.courses}</td>
          <td>{user.lastActive}</td>
          <td>
            <div className="action-buttons">
              <button onClick={() => handleViewActivity(user.id)} className="btn-view">
                👁️ View
              </button>
              {user.status === 'pending' ? (
                <button onClick={() => handleApproveUser(user.id)} className="btn-approve">
                  ✅ Approve
                </button>
              ) : user.status === 'active' ? (
                <button onClick={() => handleBlockUser(user.id)} className="btn-block">
                  🚫 Block
                </button>
              ) : (
                <button onClick={() => handleUnblockUser(user.id)} className="btn-unblock">
                  ✅ Unblock
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={user.id} className={`user-row ${user.status}`}>
          <td>
            <div className="user-info">
              <div className="user-avatar">👨‍💼</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          </td>
          <td>{user.role}</td>
          <td>{user.joinDate}</td>
          <td>
            <span className={`status-badge ${user.status}`}>
              {user.status}
            </span>
          </td>
          <td>{user.lastActive}</td>
          <td>
            <div className="action-buttons">
              <button onClick={() => handleViewActivity(user.id)} className="btn-view">
                👁️ View
              </button>
              <button className="btn-edit">
                ✏️ Edit
              </button>
            </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="admin-users-page">
      <div className="container">
        <div className="page-header">
          <h1>👥 User Management</h1>
          <p>Manage students, faculty, and administrators</p>
        </div>

        {/* User Type Tabs */}
        <div className="user-tabs">
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👨‍🎓 Students ({users.students.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            👨‍🏫 Faculty ({users.faculty.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            👨‍💼 Admins ({users.admins.length})
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>

          <div className="filter-controls">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              {activeTab === 'faculty' && <option value="pending">Pending Approval</option>}
            </select>

            <button className="add-user-btn">
              ➕ Add New {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                {activeTab === 'students' && (
                  <>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Uploads</th>
                    <th>Downloads</th>
                    <th>Last Active</th>
                  </>
                )}
                {activeTab === 'faculty' && (
                  <>
                    <th>Department</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Uploads</th>
                    <th>Courses</th>
                    <th>Last Active</th>
                  </>
                )}
                {activeTab === 'admins' && (
                  <>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Last Active</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-users">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map(renderUserRow)
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total {activeTab}:</span>
            <span className="stat-value">{users[activeTab].length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active:</span>
            <span className="stat-value">
              {users[activeTab].filter(u => u.status === 'active').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Blocked:</span>
            <span className="stat-value">
              {users[activeTab].filter(u => u.status === 'blocked').length}
            </span>
          </div>
          {activeTab === 'faculty' && (
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value">
                {users[activeTab].filter(u => u.status === 'pending').length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;