import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { login } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login: authLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if (response.success) {
        authLogin(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <AuthBackground>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Logo />
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">
              Enter your credentials to access your account
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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
              />

              <button type="submit" className="form-button">
                LOGIN
              </button>
            </div>
          </form>

          <Link to="/register" className="register-link">
            Don't have an account? <u>Sign up</u>
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
};

export default LoginPage;
