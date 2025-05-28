import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Logo from '../components/Logo';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: lógica de registro
  };

  return (
    <AuthBackground>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gray-900 bg-opacity-75 p-8 rounded-lg border border-teal-400">
          <div className="flex flex-col items-center">
            <Logo />
            <h2 className="mt-4 text-3xl font-bold text-white">Sign Up</h2>
            <p className="mt-2 text-sm text-gray-400">
              Register yourself to access the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                className="mt-1 w-full px-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 
                           rounded-md text-white placeholder-gray-400 focus:outline-none 
                           focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

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
                placeholder="email@example.com"
                className="mt-1 w-full px-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 
                           rounded-md text-white placeholder-gray-400 focus:outline-none 
                           focus:ring-2 focus:ring-teal-400"
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
                className="mt-1 w-full px-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 
                           rounded-md text-white placeholder-gray-400 focus:outline-none 
                           focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 
                           rounded-md text-white placeholder-gray-400 focus:outline-none 
                           focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-teal-400 text-white font-semibold rounded-md 
                         hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 
                         transition-colors"
            >
              SIGN UP
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
              Login now
            </Link>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default RegisterPage;