import { type FC, useState, useEffect, useMemo } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';
import PlatformModal from '../components/PlatformModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Sidebar from '../components/Sidebar';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as platformAPI from '../services/api';
import './Platforms.css';

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
  const [allPlatforms, setAllPlatforms] = useState<Platform[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Platform;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };  // Load all platforms on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      await loadAllPlatforms();
    };
    fetchPlatforms();
  }, []);  // Calculate paginated and sorted platforms
  const { paginatedPlatforms, totalPages } = useMemo(() => {
    // Apply sorting if needed
    const processedPlatforms = [...allPlatforms];
    
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
  }, [allPlatforms, sortConfig, currentPage, itemsPerPage]);

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
          setCurrentPage(Math.max(1, totalPages));
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
          <h1>Platforms</h1>
          <button className="add-platform-btn" onClick={() => setIsAddModalOpen(true)}>
            Add new platform
          </button>
        </div>

        <div className="platforms-table">
          <div className="table-header">
            <div className="column title" onClick={() => handleSort('title')}>
              Title {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column company" onClick={() => handleSort('company')}>
              Company {sortConfig?.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column year" onClick={() => handleSort('acquisitionYear')}>
              Acquisition year {sortConfig?.key === 'acquisitionYear' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column actions">Actions</div>
          </div>

          <div className="table-content">
            {paginatedPlatforms.length === 0 ? (
              <div className="empty-state">
                <p>No platforms found. Create your first platform!</p>
              </div>
            ) : (
              paginatedPlatforms.map((platform) => (
                <div className="table-row" key={platform.id}>
                  <div className="column title">
                    {platform.imageUrl && (
                      <img src={platform.imageUrl} alt={platform.title} className="platform-icon" />
                    )}
                    <span>{platform.title}</span>
                  </div>
                  <div className="column company">{platform.company}</div>
                  <div className="column year">{platform.acquisitionYear}</div>
                  <div className="column actions">
                    <button 
                      type="button"
                      className="action-btn view" 
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
                      className="action-btn edit" 
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
                      className="action-btn delete" 
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FiChevronLeft /> Previous
              </button>
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
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
