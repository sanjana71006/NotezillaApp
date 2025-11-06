import React, { useState } from 'react';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeInsight, setActiveInsight] = useState('overview');

  // Removed seeded analytics data. Use empty/default structure until real API data is available.
  const analyticsData = {
    overview: {
      totalUsers: 0,
      totalResources: 0,
      totalDownloads: 0,
      totalComments: 0,
      growthRate: 0,
      activeUsersToday: 0,
      newUsersThisWeek: 0,
      pendingApprovals: 0
    },
    monthly: {
      uploads: Array(12).fill(0),
      downloads: Array(12).fill(0),
      users: Array(12).fill(0)
    },
    subjects: [],
    topContributors: [],
    recentActivity: [],
    systemMetrics: {
      serverUptime: '0%',
      avgResponseTime: '-',
      storageUsed: '0%',
      bandwidth: '-',
      errorRate: '0%',
      apiCalls: '0'
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderChart = (data, label, color) => {
    const maxValue = Math.max(...data);
    return (
      <div className="chart-container">
        <h4>{label}</h4>
        <div className="bar-chart">
          {data.map((value, index) => (
            <div key={index} className="bar-item">
              <div 
                className="bar" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              ></div>
              <span className="bar-label">{months[index]}</span>
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInsightCard = (insight) => {
    return (
      <div className="insight-card" key={insight.name}>
        <div className="insight-header">
          <h4>{insight.name}</h4>
          <span className="insight-percentage">{insight.percentage}%</span>
        </div>
        <div className="insight-stats">
          <div className="stat">
            <span className="stat-label">Uploads:</span>
            <span className="stat-value">{insight.uploads}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Downloads:</span>
            <span className="stat-value">{insight.downloads.toLocaleString()}</span>
          </div>
        </div>
        <div className="insight-bar">
          <div 
            className="insight-progress" 
            style={{ width: `${insight.percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-analytics-page">
      <div className="container">
        <div className="page-header">
          <h1>📊 Analytics & Insights</h1>
          <p>Platform growth, usage statistics, and performance metrics</p>
        </div>

        {/* Time Range Selector */}
        <div className="controls-section">
          <div className="timeframe-selector">
            <label>Time Range:</label>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-select"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div className="insight-tabs">
            <button 
              className={`tab-btn ${activeInsight === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveInsight('overview')}
            >
              📈 Overview
            </button>
            <button 
              className={`tab-btn ${activeInsight === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveInsight('subjects')}
            >
              📚 Subjects
            </button>
            <button 
              className={`tab-btn ${activeInsight === 'users' ? 'active' : ''}`}
              onClick={() => setActiveInsight('users')}
            >
              👥 Users
            </button>
            <button 
              className={`tab-btn ${activeInsight === 'system' ? 'active' : ''}`}
              onClick={() => setActiveInsight('system')}
            >
              ⚙️ System
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>{analyticsData.overview.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="metric-change positive">+{analyticsData.overview.growthRate}%</span>
            </div>
          </div>
          
          <div className="metric-card secondary">
            <div className="metric-icon">📚</div>
            <div className="metric-content">
              <h3>{analyticsData.overview.totalResources.toLocaleString()}</h3>
              <p>Total Resources</p>
              <span className="metric-change positive">+15.2%</span>
            </div>
          </div>
          
          <div className="metric-card tertiary">
            <div className="metric-icon">📥</div>
            <div className="metric-content">
              <h3>{analyticsData.overview.totalDownloads.toLocaleString()}</h3>
              <p>Total Downloads</p>
              <span className="metric-change positive">+22.8%</span>
            </div>
          </div>
          
          <div className="metric-card quaternary">
            <div className="metric-icon">💬</div>
            <div className="metric-content">
              <h3>{analyticsData.overview.totalComments.toLocaleString()}</h3>
              <p>Comments</p>
              <span className="metric-change positive">+8.4%</span>
            </div>
          </div>
        </div>

        {/* Content based on active insight */}
        {activeInsight === 'overview' && (
          <div className="overview-section">
            <div className="charts-row">
              <div className="chart-card">
                {renderChart(analyticsData.monthly.uploads, 'Monthly Uploads', '#667eea')}
              </div>
              <div className="chart-card">
                {renderChart(analyticsData.monthly.downloads, 'Monthly Downloads', '#764ba2')}
              </div>
            </div>
            
            <div className="insights-row">
              <div className="activity-panel">
                <h3>🕒 Recent Activity</h3>
                <div className="activity-list">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div key={index} className={`activity-item ${activity.type}`}>
                      <div className="activity-icon">
                        {activity.type === 'upload' && '📤'}
                        {activity.type === 'alert' && '⚠️'}
                        {activity.type === 'user' && '👤'}
                        {activity.type === 'flag' && '🚩'}
                        {activity.type === 'comment' && '💬'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-action">{activity.action}</div>
                        <div className="activity-details">
                          <span className="activity-user">{activity.user}</span>
                          <span className="activity-item">{activity.item}</span>
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-stats-panel">
                <h3>⚡ Quick Stats</h3>
                <div className="quick-stats-grid">
                  <div className="quick-stat">
                    <span className="quick-stat-label">Active Today:</span>
                    <span className="quick-stat-value">{analyticsData.overview.activeUsersToday}</span>
                  </div>
                  <div className="quick-stat">
                    <span className="quick-stat-label">New This Week:</span>
                    <span className="quick-stat-value">{analyticsData.overview.newUsersThisWeek}</span>
                  </div>
                  <div className="quick-stat">
                    <span className="quick-stat-label">Pending Approvals:</span>
                    <span className="quick-stat-value warning">{analyticsData.overview.pendingApprovals}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeInsight === 'subjects' && (
          <div className="subjects-section">
            <div className="section-header">
              <h3>📚 Subject-wise Analytics</h3>
              <p>Resource distribution and popularity by subject</p>
            </div>
            <div className="subjects-grid">
              {analyticsData.subjects.map(renderInsightCard)}
            </div>
          </div>
        )}

        {activeInsight === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h3>👥 Top Contributors</h3>
              <p>Most active users and their contributions</p>
            </div>
            <div className="contributors-list">
              {analyticsData.topContributors.map((contributor, index) => (
                <div key={index} className="contributor-card">
                  <div className="contributor-rank">#{index + 1}</div>
                  <div className="contributor-info">
                    <div className="contributor-name">{contributor.name}</div>
                    <div className="contributor-role">{contributor.role}</div>
                  </div>
                  <div className="contributor-stats">
                    <div className="contributor-stat">
                      <span className="stat-label">Uploads:</span>
                      <span className="stat-value">{contributor.uploads}</span>
                    </div>
                    <div className="contributor-stat">
                      <span className="stat-label">Downloads:</span>
                      <span className="stat-value">{contributor.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="contributor-score">
                    <span className="score-label">Score:</span>
                    <span className="score-value">{contributor.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeInsight === 'system' && (
          <div className="system-section">
            <div className="section-header">
              <h3>⚙️ System Performance</h3>
              <p>Server metrics and system health</p>
            </div>
            <div className="system-metrics-grid">
              <div className="system-metric">
                <div className="system-metric-icon">🔄</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">Server Uptime</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.serverUptime}</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="system-metric-icon">⚡</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">Avg Response Time</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.avgResponseTime}</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="system-metric-icon">💾</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">Storage Used</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.storageUsed}</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="system-metric-icon">📡</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">Bandwidth Used</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.bandwidth}</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="system-metric-icon">⚠️</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">Error Rate</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.errorRate}</div>
                </div>
              </div>
              <div className="system-metric">
                <div className="system-metric-icon">🔗</div>
                <div className="system-metric-content">
                  <div className="system-metric-label">API Calls Today</div>
                  <div className="system-metric-value">{analyticsData.systemMetrics.apiCalls}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="export-section">
          <button className="export-btn">📊 Export Report</button>
          <button className="export-btn">📋 Generate Summary</button>
          <button className="export-btn">📧 Email Report</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;