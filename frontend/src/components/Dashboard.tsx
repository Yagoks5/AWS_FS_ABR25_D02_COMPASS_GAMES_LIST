import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// SVGs para ícones (mantidos da sua versão, ajuste se necessário)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const GamesIcon = () => ( // Ícone do seu arquivo
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12h12M6 12l4-4m-4 4l4 4"></path> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);
const CategoriesIcon = () => ( // Ícone do seu arquivo
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);
const PlatformsIcon = () => ( // Ícone do seu arquivo
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V7"></path><path d="M8 21V7"></path><path d="M12 16.5l-3 -3"></path> <path d="M12 16.5l3 -3"></path>
  </svg>
);
const FavoritesIcon = () => ( // Ícone do seu arquivo
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

interface UserStats {
  name: string;
  gamesCount: number;
  categoriesCount: number;
  platformsCount: number;
  favoritesCount: number;
}

const Dashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUserStats({
        name: 'User', // Mantendo 'User' e os números 0 como solicitado anteriormente
        gamesCount: 0,
        categoriesCount: 0,
        platformsCount: 0,
        favoritesCount: 0,
      });
    }, 1000);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Funcionalidade de Logout a ser implementada!');
  const handleAddNew = (type: string) => alert(`Adicionar novo ${type} - funcionalidade a ser implementada.`);

  if (!userStats) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        {/* Sidebar content (inalterado) */}
        <div className="sidebar-header">
          {!isSidebarCollapsed && <div className="logo">Game List</div>}
          <button onClick={toggleSidebar} className="collapse-btn"><MenuIcon /></button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><a href="#home"><HomeIcon />{!isSidebarCollapsed && <span>Home</span>}</a></li>
            <li><a href="#games"><GamesIcon />{!isSidebarCollapsed && <span>Games</span>}</a></li>
            <li><a href="#categories"><CategoriesIcon />{!isSidebarCollapsed && <span>Categories</span>}</a></li>
            <li><a href="#platforms"><PlatformsIcon />{!isSidebarCollapsed && <span>Platforms</span>}</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn"><LogoutIcon />{!isSidebarCollapsed && <span>Logout</span>}</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Hello, {userStats.name}!</h1>
          <p>Choose one of options below.</p>
        </header>
        <section className="stats-grid">
          {/* Card Games - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-icon-display">
              <GamesIcon />
            </div>
            <h2 className="stat-card-value">{userStats.gamesCount}</h2>
            <p className="stat-card-label">Games</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Game')}>+ Add new</button>
          </div>

          {/* Card Categories - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-icon-display">
              <CategoriesIcon />
            </div>
            <h2 className="stat-card-value">{userStats.categoriesCount}</h2>
            <p className="stat-card-label">Categories</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Category')}>+ Add new</button>
          </div>

          {/* Card Platforms - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-icon-display">
             <PlatformsIcon />
            </div>
            <h2 className="stat-card-value">{userStats.platformsCount}</h2>
            <p className="stat-card-label">Platforms</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Platform')}>+ Add new</button>
          </div>

          {/* Card Favorite Games - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-icon-display">
              <FavoritesIcon />
            </div>
            <h2 className="stat-card-value">{userStats.favoritesCount}</h2>
            <p className="stat-card-label">Favorite Games</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Favorite')}>+ Add new</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;