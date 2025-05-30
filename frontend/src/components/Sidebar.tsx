import React from 'react';
import './Sidebar.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import './Sidebar.css';
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {!isCollapsed && <div className="logo"></div>}
        <button onClick={toggleSidebar} className="collapse-btn"><IoIosMenu /></button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active"><a href="/dashboard"><AiOutlineHome />{!isCollapsed && <span>Home</span>}</a></li>
          <li><a href="/games"><IoGameControllerOutline />{!isCollapsed && <span>Games</span>}</a></li>
          <li><a href="/categories"><BiCategory />{!isCollapsed && <span>Categories</span>}</a></li>
          <li><a href="/platforms"><HiOutlineCpuChip />{!isCollapsed && <span>Platforms</span>}</a></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn"><MdLogout />{!isCollapsed && <span>Logout</span>}</button>
      </div>
    </aside>
  );
};

export default Sidebar;