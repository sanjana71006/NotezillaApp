import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import Browse from './Pages/Browse/Browse';
import Upload from './Pages/Upload/Upload';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import AdminUsers from './Pages/AdminUsers/AdminUsers';
import AdminResources from './Pages/AdminResources/AdminResources';
import AdminReports from './Pages/AdminReports/AdminReports';
import FacultyDashboard from './Pages/FacultyDashboard/FacultyDashboard';
import StudentDashboard from './Pages/StudentDashboard/StudentDashboard';
import './App.css';

import AdminAnalytics from './Pages/AdminAnalytics/AdminAnalytics';
import AdminSettings from './Pages/AdminSettings/AdminSettings';

function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Check if current path is an auth page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Helper function to get default dashboard based on user role
  const getDefaultDashboard = () => {
    if (!user) return '/signup';
    switch(user.role) {
      case 'Admin': return '/admin-dashboard';
      case 'Faculty': return '/faculty-dashboard';
      case 'Student': return '/student-dashboard';
      default: return '/student-dashboard';
    }
  };

  return (
    <>
      <ThemeToggle />
      
      {!isAuthPage && <Header />}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to={getDefaultDashboard()} /> : <Navigate to="/signup" />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to={getDefaultDashboard()} replace /> : <Signup />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to={getDefaultDashboard()} replace /> : <Login />
            } 
          />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-users" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-resources" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminResources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-reports" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-analytics" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-settings" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Faculty', 'Admin']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-dashboard" 
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Student/Faculty shared routes */}
          <Route 
            path="/browse" 
            element={
              <ProtectedRoute>
                <Browse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found - Catch all route */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '60vh',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <a 
                  href={isAuthenticated ? getDefaultDashboard() : '/login'} 
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Go to {isAuthenticated ? 'Dashboard' : 'Login'}
                </a>
              </div>
            } 
          />
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;