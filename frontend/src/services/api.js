// API Configuration and Helper Functions
// Use relative path for Vercel deployment, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call handler
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getCurrentUser: () => apiCall('/auth/me')
};

// User Profile API calls
export const userAPI = {
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers,
      body: profileData instanceof FormData ? profileData : JSON.stringify(profileData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');
    return data;
  },

  uploadProfilePic: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}/auth/profile-pic`, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    } catch (err) {
      console.error('Profile picture upload error:', err);
      throw err;
    }
  },

  changePassword: (passwordData) => apiCall('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  }),

  deleteAccount: (password) => apiCall('/auth/delete-account', {
    method: 'DELETE',
    body: JSON.stringify({ password })
  })
};

// Posts API calls
export const postsAPI = {
  getAll: () => apiCall('/posts'),
  
  getById: (id) => apiCall(`/posts/${id}`),
  
  create: (postData) => apiCall('/posts', {
    method: 'POST',
    body: JSON.stringify(postData)
  }),
  
  update: (id, postData) => apiCall(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData)
  }),
  
  delete: (id) => apiCall(`/posts/${id}`, {
    method: 'DELETE'
  })
};

// Resources API calls
export const resourcesAPI = {
  getAll: () => apiCall('/resources'),
  
  getById: (id) => apiCall(`/resources/${id}`),
  
  // JSON based create (optional)
  create: (resourceData) => apiCall('/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData)
  }),

  // Multipart/form-data upload for files. Accepts a FormData instance.
  upload: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers,
        body: formData
      });

      // Try to parse JSON when available, otherwise read text for debugging
      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // not JSON (likely HTML error page), read as text
        const text = await response.text();
        throw new Error(text || 'Upload failed: non-JSON response');
      }

      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    } catch (err) {
      console.error('resourcesAPI.upload error:', err);
      throw err;
    }
  },

  download: async (resourceId, title = 'download') => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}/resources/${resourceId}/download`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // Response wasn't JSON
        }
        
        const errorMessage = errorData.message || `Download failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.code = errorData.code;
        throw error;
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error('resourcesAPI.download error:', err);
      throw err;
    }
  },

  delete: (id) => apiCall(`/resources/${id}`, {
    method: 'DELETE'
  })
};

// Assignments API calls
export const assignmentsAPI = {
  getAll: () => apiCall('/assignments'),
  
  getById: (id) => apiCall(`/assignments/${id}`),
  
  create: (assignmentData) => apiCall('/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData)
  }),
  
  update: (id, assignmentData) => apiCall(`/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(assignmentData)
  }),
  
  delete: (id) => apiCall(`/assignments/${id}`, {
    method: 'DELETE'
  })
};

// Study Groups API calls
export const studyGroupsAPI = {
  getAll: () => apiCall('/study-groups'),
  
  getById: (id) => apiCall(`/study-groups/${id}`),
  
  create: (groupData) => apiCall('/study-groups', {
    method: 'POST',
    body: JSON.stringify(groupData)
  }),
  
  join: (id) => apiCall(`/study-groups/${id}/join`, {
    method: 'POST'
  }),
  
  leave: (id) => apiCall(`/study-groups/${id}/leave`, {
    method: 'POST'
  })
};

// Notifications API calls
export const notificationsAPI = {
  getAll: () => apiCall('/notifications'),
  
  markAsRead: (id) => apiCall(`/notifications/${id}/read`, {
    method: 'PUT'
  }),
  
  markAllAsRead: () => apiCall('/notifications/read-all', {
    method: 'PUT'
  })
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () => apiCall('/admin/users'),
  
  blockUser: (userId) => apiCall(`/admin/users/${userId}/block`, {
    method: 'PUT'
  }),
  
  unblockUser: (userId) => apiCall(`/admin/users/${userId}/unblock`, {
    method: 'PUT'
  }),
  
  deleteUser: (userId) => apiCall(`/admin/users/${userId}`, {
    method: 'DELETE'
  }),
  
  getAnalytics: () => apiCall('/admin/analytics'),
  
  getSystemSettings: () => apiCall('/admin/settings'),
  
  updateSystemSettings: (settings) => apiCall('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
};

// Contacts API
export const contactsAPI = {
  create: (contactData) => apiCall('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData)
  })
};

export default {
  authAPI,
  postsAPI,
  resourcesAPI,
  assignmentsAPI,
  studyGroupsAPI,
  notificationsAPI,
  adminAPI
  ,contactsAPI
};
