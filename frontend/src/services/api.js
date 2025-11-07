// API Configuration and Helper Functions
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  
  create: (resourceData) => apiCall('/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData)
  }),
  
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

export default {
  authAPI,
  postsAPI,
  resourcesAPI,
  assignmentsAPI,
  studyGroupsAPI,
  notificationsAPI,
  adminAPI
};
