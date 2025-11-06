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
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value)
      });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      validatePassword(formData.password);
      // Create account (but don't auto-login)
      await signup(formData);
      setMessage('Account created successfully! Redirecting to login...');
      setIsError(false);
      
      // Clear form
      setFormData({ username: '', email: '', password: '', role: 'Student' });
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
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
          <div className="password-input-container">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            {formData.password && (
              <div className="password-requirements">
                <p className={passwordValidation.length ? 'valid' : 'invalid'}>
                  ✓ At least 8 characters
                </p>
                <p className={passwordValidation.uppercase ? 'valid' : 'invalid'}>
                  ✓ At least one uppercase letter
                </p>
                <p className={passwordValidation.lowercase ? 'valid' : 'invalid'}>
                  ✓ At least one lowercase letter
                </p>
                <p className={passwordValidation.number ? 'valid' : 'invalid'}>
                  ✓ At least one number
                </p>
              </div>
            )}
          </div>
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
          <Button isPrimary={true} type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <p className="auth-link-text">
          Already have an account? <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;