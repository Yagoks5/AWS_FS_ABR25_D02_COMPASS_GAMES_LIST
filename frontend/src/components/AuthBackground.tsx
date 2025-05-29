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
      style={{ backgroundImage: 'url("/images/login-bg.svg")' }}>
      </div>
        
      <div className="auth-background__glow" >
        <div className="auth-background__glow-circle"></div>
      </div>
      
      
      <div 
        className="decor-icons decor-icon_bottom-left"
        style={{ backgroundImage: 'url("/images/icons_1-bg.png")'}}>
      </div>

      <div 
        className="decor-icons decor-icon_bottom-right"
        style={{ backgroundImage: 'url("/images/icons_2-bg.png")'}}>
      </div>

      <div 
        className="decor-icons decor-icon_top-left"
        style={{ backgroundImage: 'url("/images/icons_2-bg.png")'}}>
      </div>

      <div 
        className="decor-icons decor-icon_top-right"
        style={{ backgroundImage: 'url("/images/icons_3-bg.png")'}}>
      </div>
          

    </div>
    

    {children}
  </>
);

export default AuthBackground;