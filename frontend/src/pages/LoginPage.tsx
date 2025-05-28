import { useState } from 'react';
import { Link }     from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Logo           from '../components/Logo';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: chamar sua API de login
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
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="form-button">
              Sign in
            </button>
          </form>

          <Link to="/register" className="register-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
};

export default LoginPage;