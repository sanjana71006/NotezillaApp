import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Predefined system accounts
const PREDEFINED_ACCOUNTS = [
  {
    id: 'admin-001',
    username: 'Admin',
    email: 'admin@notezilla.com',
    password: 'Admin@123',
    role: 'Admin'
  },
  {
    id: 'faculty-001',
    username: 'Faculty',
    email: 'faculty@notezilla.com',
    password: 'Faculty@123',
    role: 'Faculty'
  },
  {
    id: 'student-001',
    username: 'Student',
    email: 'student@notezilla.com',
    password: 'Student@123',
    role: 'Student'
  }
];

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
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Initialize registered users from localStorage, including predefined accounts
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    const userArray = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Merge with predefined accounts (avoid duplicates)
    const allUsers = [...PREDEFINED_ACCOUNTS];
    userArray.forEach(user => {
      if (!allUsers.find(u => u.email === user.email)) {
        allUsers.push(user);
      }
    });
    
    // Save back to localStorage to ensure predefined accounts are always available
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
    return allUsers;
  });

  const signup = (userData) => {
    // Check if user already exists
    const existingUser = registeredUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Add user to registered users with role
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      username: userData.username,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      role: userData.role || 'Student' // Default to Student if no role specified
    };
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    return { success: true, message: 'Account created successfully!' };
  };

  const login = (credentials) => {
    // Find user with matching email and password
    const user = registeredUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Set authenticated state
    setIsAuthenticated(true);
    setUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Save current user session to localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }));
    localStorage.setItem('isAuthenticated', 'true');
    
    return { success: true, message: 'Login successful!', user: user };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear session from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
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