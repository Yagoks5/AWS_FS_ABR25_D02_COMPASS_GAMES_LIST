// filepath: g:\AWS_FS_ABR25_D02_COMPASS_GAMES_LIST\frontend\src\pages\Platforms.tsx
import { type FC, useState, useEffect, useMemo } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';
import PlatformModal from '../components/PlatformModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Sidebar from '../components/Sidebar';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as platformAPI from '../services/api';
import './Platforms.css';

// Extended platform interface with games count
interface ExtendedPlatform extends Platform {
  _count?: {
    games?: number;
  };
}

// Define a type for API error handling
type ApiError = {
  response?: { 
    data?: { 
      message?: string;
    };
  };
  message?: string;
};

const Platforms: FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [allPlatforms, setAllPlatforms] = useState<ExtendedPlatform[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<ExtendedPlatform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [sortConfig, setSortConfig] = useState<{
    key: keyof Platform;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // Check for URL parameter to open add modal
  useEffect(() => {
    if (searchParams.get('add') === 'true' || searchParams.get('addNew') === 'true') {
      setIsAddModalOpen(true);
      // Remove the parameter from URL after opening modal
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);// Load all platforms on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      await loadAllPlatforms();
    };
    fetchPlatforms();
  }, []);

  // Reset page when search text changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Calculate paginated and sorted platforms
  const { paginatedPlatforms, totalPages } = useMemo(() => {
    // Apply search filter first
    let processedPlatforms = [...allPlatforms];
    
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      processedPlatforms = processedPlatforms.filter(platform =>
        platform.title.toLowerCase().includes(searchLower) ||
        platform.company.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting if needed
    if (sortConfig) {
      const { key, direction } = sortConfig;
      
      processedPlatforms.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return direction === 'asc' ? -1 : 1;
        if (bValue == null) return direction === 'asc' ? 1 : -1;
        
        // Compare string values case-insensitive
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Compare numbers and other values
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Calculate total pages
    const total = Math.ceil(processedPlatforms.length / itemsPerPage);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = processedPlatforms.slice(startIndex, endIndex);
    
    return { 
      paginatedPlatforms: paginated, 
      totalPages: total 
    };
  }, [allPlatforms, searchText, sortConfig, currentPage, itemsPerPage]);

  const loadAllPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await platformAPI.getAllPlatforms();
      if (response.success) {
        setAllPlatforms(response.data);
      }
    } catch (err) {
      console.error('Error loading platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlatform = async (data: PlatformFormData) => {
    try {
      const response = await platformAPI.createPlatform(data);
      if (response.success) {
        setIsAddModalOpen(false);
        setError(null);
        // Reload all platforms to include the new one
        loadAllPlatforms();
      } else {
        setError(response.message || 'Failed to create platform');
      }
    } catch (err) {
      console.error('Error creating platform:', err);
      const errorResp = err as ApiError;
      setError(errorResp.response?.data?.message || errorResp.message || 'Failed to create platform');
    }
  };

  const handleUpdatePlatform = async (data: PlatformFormData) => {
    if (!selectedPlatform) return;
    
    try {
      const response = await platformAPI.updatePlatform(selectedPlatform.id, data);
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedPlatform(null);
        setError(null);
        // Reload all platforms to include the update
        loadAllPlatforms();
      } else {
        setError(response.message || 'Failed to update platform');
      }
    } catch (err) {
      console.error('Error updating platform:', err);
      const errorResp = err as ApiError;
      setError(errorResp.response?.data?.message || errorResp.message || 'Failed to update platform');
    }
  };

  const handleDeletePlatform = async () => {
    if (!selectedPlatform) return;
    
    try {
      const response = await platformAPI.deletePlatform(selectedPlatform.id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        setSelectedPlatform(null);
        setError(null);
        
        // Reload all platforms after deletion
        await loadAllPlatforms();
        
        // If current page is now empty (except for the last page), go to previous page
        const totalPages = Math.ceil((allPlatforms.length - 1) / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        setError(response.message || 'Failed to delete platform');
      }
    } catch (err) {
      console.error('Error deleting platform:', err);
      const errorResp = err as ApiError;
      setError(errorResp.response?.data?.message || errorResp.message || 'Failed to delete platform');
    }
  };
  
  const handleSort = (key: keyof Platform) => {
    // Toggle sort direction or set new sort key
    const direction: 'asc' | 'desc' =
      sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };
  
  if (loading) {
    return (
      <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <div className="loading">Loading platforms...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onLogout={handleLogout}
      />
      
      <main className="main-content">        
        <div className="platforms-header">
          <h1>Platforms</h1>          <button className="add-platform-btn" onClick={() => setIsAddModalOpen(true)}>
            <FiPlus /> New platform
          </button>
        </div>
        
        <div className="platforms-stats-summary">
          <div className="stats-item">
            <span className="stats-label">Total Platforms:</span>
            <span className="stats-value">{allPlatforms.length}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Most Popular:</span>            
            <span className="stats-value">
              {allPlatforms.length > 0 ? 
                (() => {
                  const sorted = [...allPlatforms]
                    .sort((a, b) => (b._count?.games || 0) - (a._count?.games || 0));
                  // Only show platforms that have at least one game
                  const mostPopular = sorted.find(platform => (platform._count?.games || 0) > 0);
                  return mostPopular ? mostPopular.title : 'None';
                })() : 'None'}
            </span>
          </div>        
        </div>        <div className="platforms-filters">
          <div className="platforms-search-box">
            <IoSearchOutline />
            <input 
              type="text" 
              placeholder="Search Platform..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>          <button className="clear-btn" onClick={() => {
            setSearchText('');
            setCurrentPage(1);
          }}>Clear</button>
        </div>

        <div className="platforms-table">
          <div className="platforms-table-header">
            <div className="platforms-column title" onClick={() => handleSort('title')}>
              Title {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="platforms-column company" onClick={() => handleSort('company')}>
              Company {sortConfig?.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="platforms-column year" onClick={() => handleSort('acquisitionYear')}>
              Acquisition year {sortConfig?.key === 'acquisitionYear' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="platforms-column actions">Actions</div>
          </div>

          <div className="table-content">
            {paginatedPlatforms.length === 0 ? (
              <div className="empty-state">
                <p>No platforms found. Create your first platform!</p>
              </div>
            ) : (
              paginatedPlatforms.map((platform) => (
                <div className="platforms-table-row" key={platform.id}>
                  <div className="platforms-column title">
                    {platform.imageUrl && (
                      <img src={platform.imageUrl} alt={platform.title} className="platform-icon" />
                    )}
                    <span>{platform.title}</span>
                  </div>
                  <div className="platforms-column company">{platform.company}</div>
                  <div className="platforms-column year">{platform.acquisitionYear}</div>
                  <div className="platforms-column actions">
                    <button 
                      type="button"
                      className="platforms-action-btn view" 
                      title="View"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <BsEye className="action-icon" />
                    </button>
                    <button 
                      type="button"
                      className="platforms-action-btn edit" 
                      title="Edit"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <BsPencil className="action-icon" />
                    </button>
                    <button 
                      type="button"
                      className="platforms-action-btn delete" 
                      title="Delete"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <BsTrash className="action-icon" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
            {/* Pagination Controls */}          <div className="platforms-pagination">
            <button 
              className="platforms-pagination-btn-previous" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="current-page">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              className="platforms-pagination-btn-next" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages <= 1}
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Modals */}
        <PlatformModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreatePlatform}
          title="New platform"
          error={error}
        />
        
        <PlatformModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlatform(null);
          }}
          onSubmit={handleUpdatePlatform}
          title="Edit platform"
          initialData={selectedPlatform ?? undefined}
          error={error}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPlatform(null);
          }}
          onConfirm={handleDeletePlatform}
          message="Deleting this platform will remove it permanently from the system. This action is not reversible."
        />
        
        {/* View Modal */}
        {isViewModalOpen && selectedPlatform && (
          <div className="modal-overlay">
            <div className="modal-content view-modal-content">
              <div className="view-modal-header">
                <h2>Platform Details</h2>
                <button 
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedPlatform(null);
                  }} 
                  className="close-btn"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="platform-details">
                <div className="platform-image-wrapper">
                  <div className="platform-image-container">
                    {selectedPlatform.imageUrl ? (
                      <img 
                        src={selectedPlatform.imageUrl} 
                        alt={selectedPlatform.title} 
                        className="platform-detail-image" 
                      />
                    ) : (
                      <div className="no-image">No image available</div>
                    )}
                  </div>
                </div>
                
                <div className="platform-info">
                  <h3 className="platform-title">{selectedPlatform.title}</h3>
                  <div className="platform-detail-row">
                    <span className="detail-label">Company:</span> 
                    <span className="detail-value">{selectedPlatform.company}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Acquisition Year:</span> 
                    <span className="detail-value">{selectedPlatform.acquisitionYear}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Created:</span> 
                    <span className="detail-value">{new Date(selectedPlatform.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Updated:</span> 
                    <span className="detail-value">{new Date(selectedPlatform.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="view-modal-footer">
                <button 
                  className="close-view-btn"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedPlatform(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Platforms;
