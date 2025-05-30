import React, { useState } from 'react';
import './Categories.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { Link } from 'react-router-dom';

interface Category {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const Categories: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Logout functionality to be implemented!');
  const handleAddCategory = () => alert('Add new category functionality to be implemented!');

  // Sample data - replace with actual API data later
  const categories: Category[] = [
    {
      name: "Racing",
      description: "Driving games",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "FPS",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "Fighting",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "MMO RPG",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
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
            <li className="active">
              <Link to="/categories"><BiCategory />{!isSidebarCollapsed && <span>Categories</span>}</Link>
            </li>
            <li>
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
        <div className="categories-header">
          <h1>Categories</h1>
          <button className="add-category-btn" onClick={handleAddCategory}>
            add new category
          </button>
        </div>

        <div className="categories-table">
          <div className="table-header">
            <div className="column name">Name ⇅</div>
            <div className="column description">Description ⇅</div>
            <div className="column created">Created at ⇅</div>
            <div className="column updated">Updated at ⇅</div>
            <div className="column actions"></div>
          </div>

          <div className="table-content">
            {categories.map((category, index) => (
              <div className="table-row" key={index}>
                <div className="column name">{category.name}</div>
                <div className="column description">{category.description}</div>
                <div className="column created">{category.createdAt}</div>
                <div className="column updated">{category.updatedAt}</div>
                <div className="column actions">
                  <button className="action-btn edit" title="Edit">✏️</button>
                  <button className="action-btn delete" title="Delete">🗑️</button>
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

export default Categories;