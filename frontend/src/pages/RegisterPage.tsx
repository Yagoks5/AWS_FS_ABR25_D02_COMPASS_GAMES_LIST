import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Logo from '../components/Logo';
import { register, login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Register the user
      await register(fullName, email, password, confirmPassword);
      
      // Automatically log in after successful registration
      const loginResponse = await login(email, password);
      
      if (loginResponse.success) {
        authLogin(loginResponse.data.token, loginResponse.data.user);
        navigate('/dashboard');
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'An error occurred during registration',
        );
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <Logo />
            <h2 className="register-title">Sign Up</h2>
            <p className="register-subtitle">
              Register yourself to access the system
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-input"
                required
              />
            </div>            <button type="submit" className="form-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <Link to="/login" className="login-link">
            Already have an account? <u>Login</u>
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
};

export default RegisterPage;
