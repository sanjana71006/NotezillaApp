import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    try {
      // Attempt to login with credentials
      const result = await login(formData);
      setMessage(result.message);
      setIsError(false);
      
      // Navigate to appropriate dashboard based on role
      const userRole = result.user.role;
      switch(userRole) {
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'Faculty':
          navigate('/faculty-dashboard');
          break;
        case 'Student':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/home'); // Fallback
      }
      
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Welcome Back!</h2>
        <p>Log in to continue to Notezilla</p>
        
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <Button isPrimary={true} type="submit">Login</Button>
        </form>
        
        <p className="auth-link-text">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;