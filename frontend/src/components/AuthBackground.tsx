import type { ReactNode } from 'react';
import './AuthBackground.css';

interface AuthBackgroundProps {
  children: ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => (
  <>
    <div className="auth-background">
      <div
        className="auth-background__image"
        style={{ backgroundImage: 'url("/images/login-bg.svg")' }}
      />
      <div className="auth-background__glow">
        <div className="auth-background__glow-circle" />
      </div>
    </div>

    {children}
  </>
);

export default AuthBackground;