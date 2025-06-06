import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!email.trim() || !password.trim()) {
      toast.error('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);

      if (response.success) {
        toast.success(`Welcome back, ${response.data.user.fullName}!`);

        authLogin(response.data.token, response.data.user);

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message.includes('Network Error') ||
          err.message.includes('fetch')
        ) {
          toast.error(
            'Connection error. Please check your internet connection.',
          );
        } else {
          toast.error('Invalid email or password. Please try again.');
        }
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
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
                
                disabled={loading}
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
                
                disabled={loading}
              />

              <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
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
