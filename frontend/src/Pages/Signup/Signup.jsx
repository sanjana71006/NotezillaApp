import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import './Signup.css'; // You can reuse Login.css or create a new one

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student' // Default role
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { signup } = useAuth();
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
      // Create account and auto-login
      const result = await signup(formData);
      setMessage(result.message);
      setIsError(false);
      
      // Clear form
      setFormData({ username: '', email: '', password: '', role: 'Student' });
      
      // Navigate to appropriate dashboard based on role after successful signup
      setTimeout(() => {
        switch(formData.role) {
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
            navigate('/home');
        }
      }, 1500);
      
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Join Notezilla</h2>
        <p>Create an account to start sharing and discovering notes.</p>
        
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            value={formData.username}
            onChange={handleChange}
            required 
          />
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
          <select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
            required
          >
            <option value="Student">🎓 Student</option>
            <option value="Faculty">👩‍🏫 Faculty</option>
            <option value="Admin">👨‍💼 Admin</option>
          </select>
          <Button isPrimary={true} type="submit">Create Account</Button>
        </form>
        
        <p className="auth-link-text">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;