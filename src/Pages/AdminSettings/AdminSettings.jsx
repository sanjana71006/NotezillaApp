import React, { useState } from 'react';
import './AdminSettings.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    adminName: 'Admin User',
    adminEmail: 'admin@notezilla.com',
    adminPhone: '+1 (555) 123-4567',
    adminRole: 'Super Admin',
    
    // System settings
    maxFileSize: '10',
    allowedFileTypes: ['PDF', 'DOCX', 'PPTX', 'TXT'],
    autoApproval: false,
    requireFacultyApproval: true,
    enableComments: true,
    enableRatings: true,
    
    // Security settings
    enableTwoFA: false,
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    systemAlerts: true,
    
    // Platform settings
    platformName: 'Notezilla',
    platformDescription: 'Academic Resource Sharing Platform',
    maintenanceMode: false,
    registrationOpen: true
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setSettings(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (section) => {
    console.log(`Saving ${section} settings:`, settings);
    alert(`${section} settings saved successfully!`);
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    console.log('Updating password');
    alert('Password updated successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'notezilla-settings.json';
    link.click();
  };

  const renderProfileSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>👤 Admin Profile</h3>
        <p>Manage your personal information and account details</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={settings.adminName}
            onChange={(e) => handleInputChange('adminName', null, e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', null, e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={settings.adminPhone}
            onChange={(e) => handleInputChange('adminPhone', null, e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Role</label>
          <select
            value={settings.adminRole}
            onChange={(e) => handleInputChange('adminRole', null, e.target.value)}
            className="form-select"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Content Admin">Content Admin</option>
            <option value="User Admin">User Admin</option>
          </select>
        </div>
        
        <div className="password-section">
          <h4>🔐 Change Password</h4>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <button onClick={handlePasswordUpdate} className="btn-primary">
            Update Password
          </button>
        </div>
        
        <div className="form-actions">
          <button onClick={() => handleSaveSettings('Profile')} className="btn-save">
            💾 Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>⚙️ System Configuration</h3>
        <p>Configure platform behavior and content management</p>
      </div>
      
      <div className="settings-form">
        <div className="setting-group">
          <h4>📁 File Management</h4>
          <div className="form-group">
            <label>Maximum File Size (MB)</label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleInputChange('maxFileSize', null, e.target.value)}
              className="form-input"
              min="1"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label>Allowed File Types</label>
            <div className="checkbox-group">
              {['PDF', 'DOCX', 'PPTX', 'TXT', 'XLSX', 'JPG', 'PNG'].map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.allowedFileTypes.includes(type)}
                    onChange={(e) => handleArrayChange('allowedFileTypes', type, e.target.checked)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="setting-group">
          <h4>✅ Content Approval</h4>
          <div className="toggle-group">
            <div className="toggle-item">
              <label>Auto-approve student uploads</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoApproval}
                  onChange={(e) => handleInputChange('autoApproval', null, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <label>Require faculty approval for resources</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.requireFacultyApproval}
                  onChange={(e) => handleInputChange('requireFacultyApproval', null, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="setting-group">
          <h4>💬 User Interactions</h4>
          <div className="toggle-group">
            <div className="toggle-item">
              <label>Enable comments on resources</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.enableComments}
                  onChange={(e) => handleInputChange('enableComments', null, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <label>Enable resource ratings</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.enableRatings}
                  onChange={(e) => handleInputChange('enableRatings', null, e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button onClick={() => handleSaveSettings('System')} className="btn-save">
            💾 Save System Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>🔒 Security & Authentication</h3>
        <p>Configure security policies and access controls</p>
      </div>
      
      <div className="settings-form">
        <div className="setting-group">
          <h4>🔐 Authentication</h4>
          <div className="toggle-item">
            <label>Enable Two-Factor Authentication</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enableTwoFA}
                onChange={(e) => handleInputChange('enableTwoFA', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', null, e.target.value)}
              className="form-select"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Maximum Login Attempts</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleInputChange('maxLoginAttempts', null, e.target.value)}
              className="form-input"
              min="3"
              max="10"
            />
          </div>
        </div>
        
        <div className="setting-group">
          <h4>🔑 Password Policy</h4>
          <div className="form-group">
            <label>Minimum Password Length</label>
            <input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => handleInputChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="form-input"
              min="6"
              max="20"
            />
          </div>
          
          <div className="toggle-group">
            <div className="toggle-item">
              <label>Require uppercase letters</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => handleInputChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <label>Require numbers</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => handleInputChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="toggle-item">
              <label>Require special characters</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => handleInputChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button onClick={() => handleSaveSettings('Security')} className="btn-save">
            💾 Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>🔔 Notifications</h3>
        <p>Configure notification preferences and alerts</p>
      </div>
      
      <div className="settings-form">
        <div className="toggle-group">
          <div className="toggle-item">
            <label>Email Notifications</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-item">
            <label>Push Notifications</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleInputChange('pushNotifications', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-item">
            <label>Weekly Reports</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => handleInputChange('weeklyReports', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-item">
            <label>System Alerts</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.systemAlerts}
                onChange={(e) => handleInputChange('systemAlerts', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button onClick={() => handleSaveSettings('Notifications')} className="btn-save">
            💾 Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlatformSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>🌐 Platform Configuration</h3>
        <p>Global platform settings and maintenance options</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Platform Name</label>
          <input
            type="text"
            value={settings.platformName}
            onChange={(e) => handleInputChange('platformName', null, e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Platform Description</label>
          <textarea
            value={settings.platformDescription}
            onChange={(e) => handleInputChange('platformDescription', null, e.target.value)}
            className="form-textarea"
            rows="3"
          />
        </div>
        
        <div className="toggle-group">
          <div className="toggle-item">
            <label>Maintenance Mode</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-item">
            <label>Open Registration</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.registrationOpen}
                onChange={(e) => handleInputChange('registrationOpen', null, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button onClick={() => handleSaveSettings('Platform')} className="btn-save">
            💾 Save Platform Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-settings-page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Settings</h1>
          <p>Configure system settings, security, and platform preferences</p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            ⚙️ System
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'platform' ? 'active' : ''}`}
            onClick={() => setActiveTab('platform')}
          >
            🌐 Platform
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'platform' && renderPlatformSettings()}
        </div>

        {/* Global Actions */}
        <div className="global-actions">
          <button onClick={handleExportSettings} className="btn-export">
            📤 Export Settings
          </button>
          <button className="btn-import">
            📥 Import Settings
          </button>
          <button className="btn-reset">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;