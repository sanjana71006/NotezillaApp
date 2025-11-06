import React, { useState } from 'react';
import './AdminReports.css';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Removed seeded reports/alerts data. Components will render empty lists until backend provides data.
  const data = {
    reports: [],
    flaggedContent: [],
    systemAlerts: []
  };

  const getFilteredData = () => {
    const currentData = data[activeTab];
    return currentData.filter(item => {
      const searchFields = activeTab === 'reports' 
        ? [item.reportedItem, item.reportedBy, item.reason].join(' ').toLowerCase()
        : activeTab === 'flaggedContent'
        ? [item.title, item.uploader, item.flagReason].join(' ').toLowerCase()
        : [item.title, item.description, item.type].join(' ').toLowerCase();
      
      const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'high' && item.priority === 'high') ||
        (filterBy === 'medium' && item.priority === 'medium') ||
        (filterBy === 'low' && item.priority === 'low') ||
        (filterBy === 'pending' && item.status === 'pending') ||
        (filterBy === 'active' && item.status === 'active') ||
        (filterBy === 'resolved' && item.status === 'resolved');
      
      return matchesSearch && matchesFilter;
    });
  };

  const handleTakeAction = (id, action) => {
    console.log(`${action} for item ${id}`);
    alert(`${action} completed for item ${id}`);
  };

  const handleAssignTo = (id) => {
    const assignee = prompt('Assign to (Admin User, Tech Support, etc.):');
    if (assignee) {
      console.log(`Assigning item ${id} to ${assignee}`);
      alert(`Item assigned to ${assignee}`);
    }
  };

  const renderReportCard = (report) => (
    <div key={report.id} className={`report-card ${report.status} ${report.priority}-priority`}>
      <div className="report-header">
        <div className="report-title-section">
          <h3 className="report-title">{report.type}</h3>
          <p className="reported-item">{report.reportedItem}</p>
        </div>
        <div className="report-status-section">
          <span className={`status-badge ${report.status}`}>{report.status}</span>
          <span className={`priority-badge ${report.priority}`}>{report.priority}</span>
        </div>
      </div>

      <div className="report-details">
        <div className="reporter-info">
          <strong>Reported by:</strong> {report.reportedBy} ({report.reporterEmail})
        </div>
        <div className="report-reason">
          <strong>Reason:</strong> {report.reason}
        </div>
        <div className="report-description">
          <strong>Description:</strong> {report.description}
        </div>
        <div className="report-meta">
          <span><strong>Date:</strong> {report.reportDate}</span>
          {report.assignedTo && <span><strong>Assigned to:</strong> {report.assignedTo}</span>}
          {report.resolvedDate && <span><strong>Resolved:</strong> {report.resolvedDate}</span>}
        </div>
        {report.resolution && (
          <div className="resolution">
            <strong>Resolution:</strong> {report.resolution}
          </div>
        )}
      </div>

      <div className="report-actions">
        {report.status === 'pending' && (
          <>
            <button onClick={() => handleTakeAction(report.id, 'Investigate')} className="btn-investigate">
              🔍 Investigate
            </button>
            <button onClick={() => handleAssignTo(report.id)} className="btn-assign">
              👤 Assign
            </button>
          </>
        )}
        {report.status === 'in-progress' && (
          <button onClick={() => handleTakeAction(report.id, 'Resolve')} className="btn-resolve">
            ✅ Resolve
          </button>
        )}
        <button onClick={() => handleTakeAction(report.id, 'View Details')} className="btn-details">
          📄 Details
        </button>
        <button onClick={() => handleTakeAction(report.id, 'Contact Reporter')} className="btn-contact">
          ✉️ Contact
        </button>
      </div>
    </div>
  );

  const renderFlaggedCard = (content) => (
    <div key={content.id} className={`flagged-card ${content.status}`}>
      <div className="flagged-header">
        <div className="flagged-title-section">
          <h3 className="flagged-title">{content.title}</h3>
          <p className="flagged-uploader">Uploaded by: {content.uploader}</p>
        </div>
        <div className="flagged-confidence">
          <span className="confidence-score">{content.confidence}% confidence</span>
          {content.aiDetection && <span className="ai-badge">🤖 AI Detected</span>}
        </div>
      </div>

      <div className="flagged-details">
        <div className="flag-reason">
          <strong>Flag Reason:</strong> {content.flagReason}
        </div>
        {content.similarityScore && (
          <div className="similarity-info">
            <strong>Similarity:</strong> {content.similarityScore} to {content.originalSource}
          </div>
        )}
        {content.personalDataFound && (
          <div className="personal-data-info">
            <strong>Personal Data Found:</strong> {content.personalDataFound.join(', ')}
          </div>
        )}
        <div className="file-info">
          <span><strong>Type:</strong> {content.fileType}</span>
          <span><strong>Size:</strong> {content.fileSize}</span>
          <span><strong>Flagged:</strong> {content.flagDate}</span>
        </div>
      </div>

      <div className="flagged-actions">
        <button onClick={() => handleTakeAction(content.id, 'Review Content')} className="btn-review">
          👁️ Review
        </button>
        <button onClick={() => handleTakeAction(content.id, 'Approve')} className="btn-approve">
          ✅ Approve
        </button>
        <button onClick={() => handleTakeAction(content.id, 'Remove')} className="btn-remove">
          🗑️ Remove
        </button>
        <button onClick={() => handleTakeAction(content.id, 'Contact Uploader')} className="btn-contact">
          ✉️ Contact
        </button>
      </div>
    </div>
  );

  const renderAlertCard = (alert) => (
    <div key={alert.id} className={`alert-card ${alert.severity} ${alert.status}`}>
      <div className="alert-header">
        <div className="alert-title-section">
          <span className="alert-type">{alert.type}</span>
          <h3 className="alert-title">{alert.title}</h3>
        </div>
        <div className="alert-severity-section">
          <span className={`severity-badge ${alert.severity}`}>{alert.severity}</span>
          <span className={`alert-status-badge ${alert.status}`}>{alert.status}</span>
        </div>
      </div>

      <div className="alert-details">
        <p className="alert-description">{alert.description}</p>
        <div className="alert-meta">
          <span><strong>Time:</strong> {alert.timestamp}</span>
          <span><strong>Source:</strong> {alert.source}</span>
        </div>
        {alert.affectedUsers && <p><strong>Affected Users:</strong> {alert.affectedUsers}</p>}
        {alert.affectedServices && <p><strong>Affected Services:</strong> {alert.affectedServices.join(', ')}</p>}
        {alert.storageUsed && (
          <p><strong>Storage:</strong> {alert.storageUsed} / {alert.storageTotal}</p>
        )}
      </div>

      <div className="alert-actions">
        {alert.status === 'active' && (
          <>
            <button onClick={() => handleTakeAction(alert.id, 'Acknowledge')} className="btn-acknowledge">
              ✓ Acknowledge
            </button>
            <button onClick={() => handleTakeAction(alert.id, 'Investigate')} className="btn-investigate">
              🔍 Investigate
            </button>
          </>
        )}
        <button onClick={() => handleTakeAction(alert.id, 'View Logs')} className="btn-logs">
          📊 View Logs
        </button>
        <button onClick={() => handleTakeAction(alert.id, 'Dismiss')} className="btn-dismiss">
          ❌ Dismiss
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-reports-page">
      <div className="container">
        <div className="page-header">
          <h1>⚠️ Reports & Moderation</h1>
          <p>Monitor reports, flagged content, and system alerts</p>
        </div>

        {/* Report Type Tabs */}
        <div className="report-tabs">
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📋 User Reports ({data.reports.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'flaggedContent' ? 'active' : ''}`}
            onClick={() => setActiveTab('flaggedContent')}
          >
            🚩 Flagged Content ({data.flaggedContent.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'systemAlerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('systemAlerts')}
          >
            🔔 System Alerts ({data.systemAlerts.length})
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search reports, content, or alerts..."
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
              <option value="all">All Items</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <button className="export-btn">
              📊 Export Report
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {getFilteredData().length === 0 ? (
            <div className="no-content">
              <p>No items found matching your criteria</p>
            </div>
          ) : (
            getFilteredData().map(item => {
              if (activeTab === 'reports') return renderReportCard(item);
              if (activeTab === 'flaggedContent') return renderFlaggedCard(item);
              return renderAlertCard(item);
            })
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
            <span className="stat-value">{data[activeTab].length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending/Active:</span>
            <span className="stat-value">
              {data[activeTab].filter(item => ['pending', 'active', 'flagged', 'under-review'].includes(item.status)).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">High Priority:</span>
            <span className="stat-value">
              {data[activeTab].filter(item => item.priority === 'high' || item.severity === 'high').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Resolved:</span>
            <span className="stat-value">
              {data[activeTab].filter(item => ['resolved', 'acknowledged'].includes(item.status)).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;