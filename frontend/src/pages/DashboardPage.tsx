import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import Sidebar from '../components/Sidebar';
import { IoGameControllerOutline } from 'react-icons/io5';
import { HiOutlineCpuChip } from 'react-icons/hi2';
import { BiCategory } from 'react-icons/bi';
import { MdStarOutline } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { useDashboardStats } from '../hooks/useDashboard';

interface UserStats {
  name: string;
  gamesCount: number;
  categoriesCount: number;
  platformsCount: number;
  favoritesCount: number;
}

const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();

  useEffect(() => {
    setUserStats({
      name: 'User',
      gamesCount: 0,
      categoriesCount: 0,
      platformsCount: 0,
      favoritesCount: 0,
    });
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };  const handleAddNew = (type: string) => {
    if (type === 'Platform') {
      navigate('/platforms?add=true');
    } else if (type === 'Game') {
      navigate('/games?add=true');
    } else if (type === 'Category') {
      navigate('/categories?add=true');
    } else if (type === 'Favorite') {
      
      navigate('/games?add=true&favorite=true');
    } else {
      alert(`Add new ${type} - functionality to be implemented.`);
    }
  };

  if (!userStats) return <div>Carregando...</div>;

  return (
    <div
      className={`dashboard-container ${
        isSidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <main className="main-content">        <header className="main-header">
          <h1>
            Welcome,{' '}
            <span className="User-style">{user?.fullName?.split(' ')[0] || 'User'}</span>
          </h1>
          <p>Choose one of options below.</p>
        </header>
        <section className="stats-grid">
          
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-games">
                <IoGameControllerOutline />
              </div>
              <h2 className="stat-card-value">{stats?.totalGames}</h2>
            </div>
            <p className="stat-card-label">Games</p>
            <button
              className="add-new-btn"
              onClick={() => handleAddNew('Game')}
            >
              + Add new
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-categories">
                <BiCategory />
              </div>
              <h2 className="stat-card-value">{stats?.totalCategories}</h2>
            </div>
            <p className="stat-card-label">Categories</p>
            <button
              className="add-new-btn"
              onClick={() => handleAddNew('Category')}
            >
              + Add new
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-platforms">
                <HiOutlineCpuChip />
              </div>
              <h2 className="stat-card-value">{stats?.totalPlatforms}</h2>
            </div>
            <p className="stat-card-label">Platforms</p>
            <button
              className="add-new-btn"
              onClick={() => handleAddNew('Platform')}
            >
              + Add new
            </button>
          </div>

          <div className="stat-card star">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-favorites">
                <MdStarOutline />
              </div>
              <h2 className="stat-card-value">
                <span className="fav-num">{stats?.totalFavorites}</span>
              </h2>
            </div>
            <p className="stat-card-label">Favorite Games</p>
            <button
              className="add-new-btn favorite"
              onClick={() => handleAddNew('Favorite')}
            >
              + Add new
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
