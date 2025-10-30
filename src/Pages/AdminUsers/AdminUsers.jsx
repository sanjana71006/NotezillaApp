import React, { useState } from 'react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Mock data for users
  const users = {
    students: [
      { id: 1, name: 'Alice Johnson', email: 'alice.johnson@university.edu', year: '2nd Year', semester: '4th Semester', joinDate: '2024-09-01', status: 'active', uploads: 15, downloads: 89, lastActive: '2 hours ago' },
      { id: 2, name: 'Bob Smith', email: 'bob.smith@university.edu', year: '3rd Year', semester: '5th Semester', joinDate: '2023-08-15', status: 'active', uploads: 23, downloads: 156, lastActive: '1 day ago' },
      { id: 3, name: 'Charlie Brown', email: 'charlie.brown@university.edu', year: '1st Year', semester: '2nd Semester', joinDate: '2025-01-10', status: 'blocked', uploads: 2, downloads: 12, lastActive: '1 week ago' },
      { id: 4, name: 'Diana Prince', email: 'diana.prince@university.edu', year: '4th Year', semester: '7th Semester', joinDate: '2022-09-01', status: 'active', uploads: 45, downloads: 234, lastActive: '30 minutes ago' }
    ],
    faculty: [
      { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', department: 'Computer Science', joinDate: '2020-06-15', status: 'active', uploads: 67, courses: 5, lastActive: '3 hours ago' },
      { id: 2, name: 'Prof. Michael Chen', email: 'michael.chen@university.edu', department: 'Mathematics', joinDate: '2018-08-20', status: 'pending', uploads: 34, courses: 3, lastActive: '2 days ago' },
      { id: 3, name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@university.edu', department: 'Physics', joinDate: '2021-01-10', status: 'active', uploads: 89, courses: 7, lastActive: '1 hour ago' }
    ],
    admins: [
      { id: 1, name: 'Admin User', email: 'admin@notezilla.com', role: 'Super Admin', joinDate: '2023-01-01', status: 'active', lastActive: 'Current session' },
      { id: 2, name: 'John Administrator', email: 'john.admin@notezilla.com', role: 'Content Admin', joinDate: '2023-06-15', status: 'active', lastActive: '2 hours ago' }
    ]
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