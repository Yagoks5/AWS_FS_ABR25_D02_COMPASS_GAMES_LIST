import React, { useState } from 'react';
import './Games.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

const Games: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Logout functionality to be implemented!');
  const handleAddGame = () => alert('Add new game functionality to be implemented!');

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {!isSidebarCollapsed && <div className="logo"></div>}
          <button onClick={toggleSidebar} className="collapse-btn"><IoIosMenu /></button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/dashboard"><AiOutlineHome />{!isSidebarCollapsed && <span>Home</span>}</a></li>
            <li className="active"><a href="/games"><IoGameControllerOutline />{!isSidebarCollapsed && <span>Games</span>}</a></li>
            <li><a href="/categories"><BiCategory />{!isSidebarCollapsed && <span>Categories</span>}</a></li>
            <li><a href="/platforms"><HiOutlineCpuChip />{!isSidebarCollapsed && <span>Platforms</span>}</a></li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <MdLogout />{!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="games-header">
          <h1>Games</h1>
          <button className="add-game-btn" onClick={handleAddGame}>Add new game</button>
        </div>

        <div className="games-filters">
          <div className="search-box">
            <IoSearchOutline />
            <input type="text" placeholder="Search Game..." />
          </div>

          <div className="filter-group">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">Select Category</option>
              <option value="racing">Racing</option>
              <option value="fps">FPS</option>
            </select>

            <label className="favorite-filter">
              <input 
                type="checkbox"
                checked={isFavoriteOnly}
                onChange={(e) => setIsFavoriteOnly(e.target.checked)}
              />
              Favorite
            </label>
          </div>

          <button className="clear-btn">Clear</button>
        </div>

        <div className="games-table">
          <div className="table-header">
            <div className="column title">Title</div>
            <div className="column description">Description</div>
            <div className="column category">Category</div>
            <div className="column release-date">Release date</div>
            <div className="column favorite">Favorite</div>
            <div className="column actions">Actions</div>
          </div>

          <div className="table-content">
            <div className="table-row">
              <div className="column title">
                <img src="/path/to/mario-kart.jpg" alt="Mario Kart" className="game-icon" />
                Mario Kart
              </div>
              <div className="column description">Mario 8 que ganhei de aniversário</div>
              <div className="column category">Racing</div>
              <div className="column release-date">08/12/2021</div>
              <div className="column favorite">★</div>
              <div className="column actions">
                <button className="action-btn view">👁️</button>
                <button className="action-btn edit">✏️</button>
                <button className="action-btn delete">🗑️</button>
              </div>
            </div>

            <div className="table-row">
              <div className="column title">
                <img src="/path/to/valorant.jpg" alt="Valorant" className="game-icon" />
                Valorant
              </div>
              <div className="column description">Valorant que jogo com amigos</div>
              <div className="column category">FPS</div>
              <div className="column release-date">08/12/2021</div>
              <div className="column favorite">☆</div>
              <div className="column actions">
                <button className="action-btn view">👁️</button>
                <button className="action-btn edit">✏️</button>
                <button className="action-btn delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;