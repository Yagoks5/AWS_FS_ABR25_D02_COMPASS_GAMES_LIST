import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Logo from '../components/Logo';
import './RegisterPage.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: lógica de registro
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

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="form-button">
              Create Account
            </button>
          </form>

          <Link to="/login" className="login-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
};

export default RegisterPage;