import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { MdStarOutline} from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";

// SVGs para ícones (mantidos da sua versão, ajuste se necessário)

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
          {!isSidebarCollapsed && <div className="logo"></div>}
          <button onClick={toggleSidebar} className="collapse-btn"><IoIosMenu /></button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active"><a href="#home"><AiOutlineHome />{!isSidebarCollapsed && <span>Home</span>}</a></li>
            <li><a href="#games"><IoGameControllerOutline />{!isSidebarCollapsed && <span>Games</span>}</a></li>
            <li><a href="#categories"><BiCategory />{!isSidebarCollapsed && <span>Categories</span>}</a></li>
            <li><a href="#platforms"><HiOutlineCpuChip />{!isSidebarCollapsed && <span>Platforms</span>}</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn"><MdLogout />{!isSidebarCollapsed && <span>Logout</span>}</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Welcome, <span className='User-style'>{userStats.name}</span></h1>
          <p>Choose one of options below.</p>
        </header>
        <section className="stats-grid">
          {/* Card Games - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-header">
            <div className="stat-card-icon-display-games">
              <IoGameControllerOutline />
            </div>
            <h2 className="stat-card-value">{userStats.gamesCount}</h2>
            </div>

            <p className="stat-card-label">Games</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Game')}>+ Add new</button>
          </div>

          {/* Card Categories - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-categories">
                <BiCategory />
              </div>
              <h2 className="stat-card-value">{userStats.categoriesCount}</h2>
            </div>

              <p className="stat-card-label">Categories</p>
              <button className="add-new-btn" onClick={() => handleAddNew('Category')}>+ Add new</button>
            </div>

          {/* Card Platforms - Nova Estrutura Interna */}
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-icon-display-platforms">
                <HiOutlineCpuChip />
              </div>
               <h2 className="stat-card-value">{userStats.platformsCount}</h2>
            </div>

            <p className="stat-card-label">Platforms</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Platform')}>+ Add new</button>
          </div>

          {/* Card Favorite Games - Nova Estrutura Interna */}
          <div className="stat-card star">
            <div className="stat-card-header">
             <div className="stat-card-icon-display-favorites">
                <MdStarOutline />
              </div>
              <h2 className="stat-card-value"><span className="fav-num">{userStats.favoritesCount}</span></h2>
            </div>

            <p className="stat-card-label">Favorite Games</p>
            <button className="add-new-btn" onClick={() => handleAddNew('Favorite')}>+ Add new</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;