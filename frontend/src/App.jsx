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
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected dashboard routes */}
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
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;