import React from 'react';
import './Sidebar.css';
import { AiOutlineHome } from 'react-icons/ai';
import { IoGameControllerOutline } from 'react-icons/io5';
import { HiOutlineCpuChip } from 'react-icons/hi2';
import { BiCategory } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import { IoIosMenu } from 'react-icons/io';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  onLogout,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    toast.success('Goodbye! See you soon', { autoClose: 2500 });

    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {!isCollapsed && <div className="logo"></div>}
        <button onClick={toggleSidebar} className="collapse-btn">
          <IoIosMenu />
        </button>
      </div>{' '}
      <nav className="sidebar-nav">
        <ul>
          <li className={currentPath === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <AiOutlineHome />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li className={currentPath === '/games' ? 'active' : ''}>
            <Link to="/games">
              <IoGameControllerOutline />
              {!isCollapsed && <span>Games</span>}
            </Link>
          </li>
          <li className={currentPath === '/categories' ? 'active' : ''}>
            <Link to="/categories">
              <BiCategory />
              {!isCollapsed && <span>Categories</span>}
            </Link>
          </li>
          <li className={currentPath === '/platforms' ? 'active' : ''}>
            <Link to="/platforms">
              <HiOutlineCpuChip />
              {!isCollapsed && <span>Platforms</span>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <MdLogout />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
