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
import './App.css';

// Simple placeholder components for testing
const AdminDashboard = () => <div>Admin Dashboard - Test</div>;
const AdminUsers = () => <div>Admin Users - Test</div>;
const AdminResources = () => <div>Admin Resources - Test</div>;
const AdminReports = () => <div>Admin Reports - Test</div>;
const AdminAnalytics = () => <div>Admin Analytics - Test</div>;
const AdminSettings = () => <div>Admin Settings - Test</div>;
const FacultyDashboard = () => <div>Faculty Dashboard - Test</div>;
const StudentDashboard = () => <div>Student Dashboard - Test</div>;
const Browse = () => <div>Browse - Test</div>;
const Upload = () => <div>Upload - Test</div>;
const About = () => <div>About - Test</div>;
const Contact = () => <div>Contact - Test</div>;

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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-users" 
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-resources" 
            element={
              <ProtectedRoute>
                <AdminResources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-reports" 
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-analytics" 
            element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-settings" 
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty-dashboard" 
            element={
              <ProtectedRoute>
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
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;