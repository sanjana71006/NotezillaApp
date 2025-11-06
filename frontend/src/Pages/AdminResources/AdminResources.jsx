import React, { useState } from 'react';
import './AdminResources.css';

const AdminResources = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Removed seeded admin resource data. Start empty and fetch resources from backend.
  const resources = {
    pending: [],
    approved: [],
    rejected: []
  };

  const filteredResources = resources[activeTab].filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.uploader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'featured' && resource.featured) ||
                         resource.subject.toLowerCase() === filterBy.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (resourceId) => {
    console.log(`Approving resource with ID: ${resourceId}`);
    alert('Resource has been approved successfully');
  };

  const handleReject = (resourceId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      console.log(`Rejecting resource with ID: ${resourceId}, Reason: ${reason}`);
      alert('Resource has been rejected');
    }
  };

  const handleToggleFeatured = (resourceId) => {
    console.log(`Toggling featured status for resource ID: ${resourceId}`);
    alert('Featured status updated');
  };

  const handleEdit = (resourceId) => {
    console.log(`Editing resource with ID: ${resourceId}`);
    alert('Edit modal would open here');
  };

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      console.log(`Deleting resource with ID: ${resourceId}`);
      alert('Resource has been deleted');
    }
  };

  const handleDownload = (resourceId) => {
    console.log(`Downloading resource with ID: ${resourceId}`);
    alert('Download would start here');
  };

  const renderResourceCard = (resource) => {
    return (
      <div key={resource.id} className={`resource-card ${resource.status}`}>
        <div className="resource-header">
          <div className="resource-title-section">
            <h3 className="resource-title">{resource.title}</h3>
            <div className="resource-meta">
              <span className="uploader">👤 {resource.uploader}</span>
              <span className="subject">📚 {resource.subject}</span>
              <span className="semester">📅 {resource.semester}</span>
            </div>
          </div>
          <div className="resource-status-section">
            <span className={`status-badge ${resource.status}`}>
              {resource.status}
            </span>
            {resource.featured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
          </div>
        </div>

        <div className="resource-details">
          <p className="resource-description">{resource.description}</p>
          
          <div className="resource-info">
            <div className="info-item">
              <strong>File Type:</strong> {resource.fileType}
            </div>
            <div className="info-item">
              <strong>File Size:</strong> {resource.fileSize}
            </div>
            <div className="info-item">
              <strong>Upload Date:</strong> {resource.uploadDate}
            </div>
            {resource.downloads && (
              <div className="info-item">
                <strong>Downloads:</strong> {resource.downloads}
              </div>
            )}
          </div>

          <div className="resource-tags">
            {resource.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>

          {resource.status === 'approved' && (
            <div className="approval-info">
              <small>Approved by {resource.approvedBy} on {resource.approvalDate}</small>
            </div>
          )}

          {resource.status === 'rejected' && (
            <div className="rejection-info">
              <small>Rejected by {resource.rejectedBy} on {resource.rejectionDate}</small>
              <p className="rejection-reason"><strong>Reason:</strong> {resource.rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="resource-actions">
          <button onClick={() => handleDownload(resource.id)} className="btn-download">
            📥 Download
          </button>

          {resource.status === 'pending' && (
            <>
              <button onClick={() => handleApprove(resource.id)} className="btn-approve">
                ✅ Approve
              </button>
              <button onClick={() => handleReject(resource.id)} className="btn-reject">
                ❌ Reject
              </button>
            </>
          )}

          {resource.status === 'approved' && (
            <button 
              onClick={() => handleToggleFeatured(resource.id)} 
              className={`btn-feature ${resource.featured ? 'featured' : ''}`}
            >
              {resource.featured ? '⭐ Unfeature' : '⭐ Feature'}
            </button>
          )}

          <button onClick={() => handleEdit(resource.id)} className="btn-edit">
            ✏️ Edit
          </button>

          <button onClick={() => handleDelete(resource.id)} className="btn-delete">
            🗑️ Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-resources-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 Resource Management</h1>
          <p>Approve, manage, and organize educational resources</p>
        </div>

        {/* Resource Status Tabs */}
        <div className="resource-tabs">
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending ({resources.pending.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            ✅ Approved ({resources.approved.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            ❌ Rejected ({resources.rejected.length})
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title, uploader, or subject..."
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
              <option value="all">All Subjects</option>
              <option value="computer science">Computer Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              {activeTab === 'approved' && <option value="featured">Featured Only</option>}
            </select>

            <button className="bulk-action-btn">
              📋 Bulk Actions
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="resources-grid">
          {filteredResources.length === 0 ? (
            <div className="no-resources">
              <p>No resources found matching your criteria</p>
            </div>
          ) : (
            filteredResources.map(renderResourceCard)
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Resources:</span>
            <span className="stat-value">
              {resources.pending.length + resources.approved.length + resources.rejected.length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Review:</span>
            <span className="stat-value">{resources.pending.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approved:</span>
            <span className="stat-value">{resources.approved.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Featured:</span>
            <span className="stat-value">
              {resources.approved.filter(r => r.featured).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResources;