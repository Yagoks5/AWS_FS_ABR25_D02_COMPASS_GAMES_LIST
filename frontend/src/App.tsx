import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // importa a nova página
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/dashboard"  element={<DashboardPage />} /> {/* atualiza aqui */}
      <Route path="*"           element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
