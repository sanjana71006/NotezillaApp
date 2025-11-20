import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import './ProfileSection.css';

const ProfileSection = ({ inDropdown = false, onSignOut = null }) => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB');
        return;
      }
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate passwords if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
      }

      // Upload profile picture if changed
      if (profilePic) {
        const formDataPic = new FormData();
        formDataPic.append('profilePic', profilePic);
        await userAPI.uploadProfilePic(formDataPic);
      }

      // Update other profile info
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const result = await userAPI.updateProfile(updateData);

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setProfilePic(null);
      setPreviewPic(null);
      setIsEditing(false);

      // Update user in context
      if (result.user) {
        updateUser(result.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userAPI.deleteAccount(deletePassword);
      
      setSuccess('Account deleted successfully. Logging out...');
      setTimeout(() => {
        if (onSignOut) {
          onSignOut();
        } else {
          logout();
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className={`profile-section ${inDropdown ? 'profile-dropdown-content' : ''}`}>
      {!inDropdown && (
        <div className="profile-header">
          <h2>👤 Profile Settings</h2>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-container">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-pic-wrapper">
            {previewPic ? (
              <img src={previewPic} alt="Profile Preview" className="profile-pic-preview" />
            ) : user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="profile-pic-preview" />
            ) : (
              <div className="profile-pic-placeholder">
                <span>📷</span>
              </div>
            )}
          </div>
          <div className="profile-pic-info">
            <h3>{user?.username || 'User'}</h3>
            <p className="role-badge">{user?.role || 'Student'}</p>
            <p className="email">{user?.email || 'email@example.com'}</p>
            {isEditing && (
              <label className="upload-pic-btn">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
            {previewPic && (
              <button
                className="cancel-pic-btn"
                onClick={() => {
                  setPreviewPic(null);
                  setProfilePic(null);
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            {/* Basic Info */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="form-section">
              <h3>Change Password</h3>
              <p className="section-note">Leave blank if you don't want to change your password</p>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min 8 chars)"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: user?.username || '',
                    email: user?.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPreviewPic(null);
                  setProfilePic(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role:</span>
              <span className="info-value">{user?.role}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        {!isEditing && (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
        {!inDropdown && (
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                ⚠️ This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="form-group">
                <label>Enter your password to confirm:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === 'Enter' && handleDeleteAccount()}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
