import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="*"           element={<Navigate to="/login" replace />} />
      <Route path="/dashboard"  element={<Dashboard />} />
    </Routes>
  );
}

export default App;
