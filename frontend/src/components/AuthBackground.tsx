import type { ReactNode } from 'react';

interface AuthBackgroundProps {
  children: ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div 
      className="absolute inset-0 bg-center bg-cover brightness-[0.2]"
      style={{ backgroundImage: 'url("/images/login-bg.jpg")' }}
    />
    <div className="absolute inset-0">
      <div
        className="absolute top-1/2 left-1/2 
                   -translate-x-1/2 -translate-y-1/2 
                   w-[800px] h-[800px] 
                   bg-teal-500/20 rounded-full blur-[100px]" 
      />
    </div>
    {children}
  </div>
);

export default AuthBackground;