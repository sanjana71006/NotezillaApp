import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required, check user role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if user doesn't have required role
    switch(user.role) {
      case 'Admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'Faculty':
        return <Navigate to="/faculty-dashboard" replace />;
      case 'Student':
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;