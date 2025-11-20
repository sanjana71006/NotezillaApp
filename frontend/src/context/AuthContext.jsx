import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Backend API URL - use environment variable or fallback based on environment
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Fetch current user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'Student'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      setIsAuthenticated(true);
      setUser(data.user);

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      setIsAuthenticated(true);
      setUser(data.user);

      return { success: true, message: 'Login successful!', user: data.user };
    } catch (error) {
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear session from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const value = {
    isAuthenticated,
    user,
    registeredUsers,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};