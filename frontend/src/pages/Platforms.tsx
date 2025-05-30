import React, { useState } from 'react';
import './Platforms.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';

interface Platform {
  icon: string;
  title: string;
  owner: string;
  acquisitionYear: string;
}

const Platforms: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Logout functionality to be implemented!');
  const handleAddPlatform = () => alert('Add new platform functionality to be implemented!');

  // Sample data - replace with actual API data later
  const platforms: Platform[] = [
    {
      icon: "/images/platforms/nintendo-switch.jpg",
      title: "Nintendo Switch",
      owner: "Nintendo",
      acquisitionYear: "08/12/2021"
    },
    {
      icon: "/images/platforms/epic-games.jpg",
      title: "Epic Games",
      owner: "Epic",
      acquisitionYear: "08/12/2021"
    }
  ];

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {!isSidebarCollapsed && <div className="logo"></div>}
          <button onClick={toggleSidebar} className="collapse-btn"><IoIosMenu /></button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard"><AiOutlineHome />{!isSidebarCollapsed && <span>Home</span>}</Link>
            </li>
            <li>
              <Link to="/games"><IoGameControllerOutline />{!isSidebarCollapsed && <span>Games</span>}</Link>
            </li>
            <li>
              <Link to="/categories"><BiCategory />{!isSidebarCollapsed && <span>Categories</span>}</Link>
            </li>
            <li className="active">
              <Link to="/platforms"><HiOutlineCpuChip />{!isSidebarCollapsed && <span>Platforms</span>}</Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <MdLogout />{!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="platforms-header">
          <h1>Plataforms</h1>
          <button className="add-platform-btn" onClick={handleAddPlatform}>
            add new platform
          </button>
        </div>

        <div className="platforms-table">
          <div className="table-header">
            <div className="column title">Title ⇅</div>
            <div className="column owner">Owner ⇅</div>
            <div className="column year">Acquisition year ⇅</div>
            <div className="column actions"></div>
          </div>

          <div className="table-content">
            {platforms.map((platform, index) => (
              <div className="table-row" key={index}>
                <div className="column title">
                  <img src={platform.icon} alt={platform.title} className="platform-icon" />
                  <span>{platform.title}</span>
                </div>
                <div className="column owner">{platform.owner}</div>
                <div className="column year">{platform.acquisitionYear}</div>
                <div className="column actions">
                  <button className="action-btn view" title="View">
                    <BsEye className="action-icon" />
                  </button>
                  <button className="action-btn edit" title="Edit">
                    <BsPencil className="action-icon" />
                  </button>
                  <button className="action-btn delete" title="Delete">
                    <BsTrash className="action-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>← Previous</button>
          <span className="current-page">1</span>
          <button className="pagination-btn">Next →</button>
        </div>
      </main>
    </div>
  );
};

export default Platforms;