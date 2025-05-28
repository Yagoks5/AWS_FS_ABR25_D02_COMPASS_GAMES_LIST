import { useState } from 'react';
import { Link }     from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Logo           from '../components/Logo';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: chamar sua API de login
  };

  return (
    <AuthBackground>
      <div className="bg-red-500 text-white p-4">
  Se isto aparecer em vermelho, o Tailwind está funcionando.
</div>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gray-900 bg-opacity-75 p-8 rounded-2xl border border-teal-400">
          <div className="flex flex-col items-center">
            <Logo />
            <h2 className="mt-4 text-3xl font-bold text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full py-3 bg-teal-400 text-white font-semibold rounded-md 
                         hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
            >
              LOGIN
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default LoginPage;