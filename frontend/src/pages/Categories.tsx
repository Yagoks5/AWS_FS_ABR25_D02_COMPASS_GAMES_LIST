import React, { useState, useEffect, useMemo } from 'react';
import './Categories.css';
import { IoSearchOutline } from "react-icons/io5";
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import CategoryModal from '../components/CategoryModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Category } from '../services/categoryService';
import { categoryAPI } from '../services/categoryService';
import { useInvalidateCache } from '../hooks/useInvalidateCache';
import { BiCategory } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const Categories: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalError, setDeleteModalError] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  
  const [searchText, setSearchText] = useState('');
  
    const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Category;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  
  useEffect(() => {
    loadData();
    
    
    if (searchParams.get('add') === 'true') {
      setIsAddModalOpen(true);
      setSearchParams(params => {
        params.delete('add');
        return params;
      });    }
  }, [searchParams, setSearchParams]);
  const loadData = async () => {
    try {
      setError(null);
      
      const response = await categoryAPI.getAllCategories();
      setAllCategories(response.data);
    } catch (err) {
      const error = err as ApiError;
      setError(error.response?.data?.message || error.message || 'Failed to load categories');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
    
    setDeleteModalError(null);
  };
  
  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    
    if (selectedCategory._count?.games && selectedCategory._count.games > 0) {
      const errorMsg = `Cannot delete this category because it is being used by ${selectedCategory._count.games} game${selectedCategory._count.games > 1 ? 's' : ''}.`;
      setDeleteModalError(errorMsg);
      
      return;
    }
    
    try {
      await categoryAPI.deleteCategory(selectedCategory.id);
      setAllCategories(prev => prev.filter(category => category.id !== selectedCategory.id));
      invalidateCategories(); 
      invalidateDashboard(); 
      setIsDeleteModalOpen(false);
      setDeleteModalError(null);
      setSelectedCategory(null);
    } catch (err) {
      const error = err as ApiError;
      setDeleteModalError(error.response?.data?.message || error.message || 'Failed to delete category');
    }
  };
  const { invalidateCategories, invalidateDashboard } = useInvalidateCache();

  const handleCategorySaved = () => {
    loadData(); 
    invalidateCategories(); 
    invalidateDashboard(); 
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSort = (key: keyof Category) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = useMemo(() => {
    if (!sortConfig) return allCategories;
    
    return [...allCategories].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (!bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allCategories, sortConfig]);

  const filteredCategories = useMemo(() => {
    return sortedCategories.filter(category => {
      const matchesSearch = !searchText || 
        category.name.toLowerCase().includes(searchText.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchText.toLowerCase());
      
      return matchesSearch;
    });
  }, [sortedCategories, searchText]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchText('');
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="categories-header">
          <div className="categories-header-title"><BiCategory /> <h1>Categories</h1></div>
          <button className="add-category-btn" onClick={handleAddCategory}><FiPlus /> New category</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        <div className="categories-stats-summary">
          <div className="stats-item">
            <span className="stats-label">Total Categories:</span>
            <span className="stats-value">{allCategories.length}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Most Popular:</span>            <span className="stats-value">
              {allCategories.length > 0 ? 
                (() => {
                  const sorted = [...allCategories].sort((a, b) => 
                    (b._count?.games || 0) - (a._count?.games || 0)
                  );
                  
                  const mostPopular = sorted.find(cat => (cat._count?.games || 0) > 0);
                  return mostPopular ? mostPopular.name : 'None';
                })() : 'None'}
            </span>
          </div>
        </div>        <div className="categories-filters">          <div className="categories-search-box">
            <IoSearchOutline />
            <input 
              type="text" 
              placeholder="Search Category..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button 
                className="clear-search" 
                onClick={() => setSearchText('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>          <button className="clear-btn" onClick={handleClearFilters}>Clear</button>
        </div><div className="categories-table">          <div className="categories-table-header">
            <div className="categories-column name" onClick={() => handleSort('name')}>
              <span className="categories-table-header-title">Name  {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
            </div>
            <div className="categories-column description">Description</div>
            <div className="categories-column games-count">Games</div>
            <div className="categories-column created-date" onClick={() => handleSort('createdAt')}>
              <span className="categories-table-header-title">Created At {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
            </div>
            <div className="categories-column updated-date" onClick={() => handleSort('updatedAt')}>
              <span className="categories-table-header-title">Modified At {sortConfig?.key === 'updatedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
            </div>
            <div className="categories-column actions"></div>
          </div><div className="categories-table-content">            {paginatedCategories.length === 0 ? (
              <div className="empty-state">
                <p>No categories found. Create your first category!</p>
              </div>
            ) : (
              paginatedCategories.map((category) => (                <div className="categories-table-row" key={category.id}>
                  <div className="categories-column name">{category.name}</div>
                  <div className="categories-column description">{category.description || '-'}</div>
                  <div className="categories-column games-count">{category._count?.games || 0}</div>
                  <div className="categories-column created-date">
                    {formatDateTime(category.createdAt)}
                  </div>
                  <div className="categories-column updated-date">
                    {formatDateTime(category.updatedAt)}
                  </div>
                  <div className="categories-column actions">
                    <button type="button" className="categories-action-btn view" onClick={() => handleViewCategory(category)} title="View">
                      <BsEye className="action-icon" />
                    </button>
                    <button type="button" className="categories-action-btn edit" onClick={() => handleEditCategory(category)} title="Edit">
                      <BsPencil className="action-icon" />
                    </button>
                    <button type="button" className="categories-action-btn delete" onClick={() => handleDeleteCategory(category)} title="Delete">
                      <BsTrash className="action-icon" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>        <div className="categories-pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1} 
            className='categories-pagination-btn-previous'
          >
            Previous
          </button>
          <span className="current-page">Page {currentPage} of {totalPages || 1}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages <= 1} 
            className='categories-pagination-btn-next'
          >
            Next
          </button>
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <CategoryModal
            isOpen={isAddModalOpen || isEditModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }}
            onSubmit={() => handleCategorySaved()}
            mode={isAddModalOpen ? 'create' : 'edit'}
            category={selectedCategory}
          />
        )}        {/* View Modal */}
        {isViewModalOpen && selectedCategory && (
          <div className="modal-overlay">
            <div className="modal-content view-modal-content">
              <div className="view-modal-header">
                <h2>Category Details</h2>
                <button 
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedCategory(null);
                  }} 
                  className="close-btn"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="platform-details">
                <div className="platform-info">
                  <h3 className="platform-title">{selectedCategory.name}</h3>
                  
                  <div className="platform-detail-row">
                    <span className="detail-label">Description:</span> 
                    <span className="detail-value">{selectedCategory.description || 'No description'}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Games Count:</span> 
                    <span className="detail-value">{selectedCategory._count?.games || 0}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Created At:</span> 
                    <span className="detail-value">{formatDateTime(selectedCategory.createdAt)}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Modified At:</span> 
                    <span className="detail-value">{formatDateTime(selectedCategory.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="view-modal-footer">
                <button 
                  className="close-view-btn"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedCategory(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
          errorMessage={deleteModalError}
        />
      </main>
    </div>
  );
};

export default Categories;