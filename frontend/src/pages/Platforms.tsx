// filepath: g:\AWS_FS_ABR25_D02_COMPASS_GAMES_LIST\frontend\src\pages\Platforms.tsx
import { type FC, useState, useEffect, useMemo } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';
import PlatformModal from '../components/PlatformModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Sidebar from '../components/Sidebar';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { IoSearchOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as platformAPI from '../services/api';
import './Platforms.css';
import { toast } from 'react-toastify';
import { HiOutlineCpuChip } from 'react-icons/hi2';

interface ExtendedPlatform extends Platform {
  _count?: {
    games?: number;
  };
}

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);  const [selectedPlatform, setSelectedPlatform] =
    useState<ExtendedPlatform | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Platform;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });

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

  useEffect(() => {
    if (
      searchParams.get('add') === 'true' ||
      searchParams.get('addNew') === 'true'
    ) {
      setIsAddModalOpen(true);

      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  useEffect(() => {
    const fetchPlatforms = async () => {
      await loadAllPlatforms();
    };
    fetchPlatforms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const { paginatedPlatforms, totalPages } = useMemo(() => {
    let processedPlatforms = [...allPlatforms];

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      processedPlatforms = processedPlatforms.filter(
        (platform) =>
          platform.title.toLowerCase().includes(searchLower) ||
          platform.company.toLowerCase().includes(searchLower),
      );
    }

    if (sortConfig) {
      const { key, direction } = sortConfig;

      processedPlatforms.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return direction === 'asc' ? -1 : 1;
        if (bValue == null) return direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = Math.ceil(processedPlatforms.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = processedPlatforms.slice(startIndex, endIndex);

    return {
      paginatedPlatforms: paginated,
      totalPages: total,
    };
  }, [allPlatforms, searchText, sortConfig, currentPage, itemsPerPage]);
  const loadAllPlatforms = async () => {
    try {
      const response = await platformAPI.getAllPlatforms();
      if (response.success) {
        setAllPlatforms(response.data);
      }
    } catch (err) {
      console.error('Error loading platforms:', err);
    }
  };

  const handleCreatePlatform = async (data: PlatformFormData) => {
    try {
      const response = await platformAPI.createPlatform(data);
      if (response.success) {
        setIsAddModalOpen(false);

        toast.success('Platform created successfully', { autoClose: 2000 });

        loadAllPlatforms();
      } else {
        toast.error(response.message || 'Failed to create platform', {
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Error creating platform:', err);
      const errorResp = err as ApiError;
      const errorMessage =
        errorResp.response?.data?.message ||
        errorResp.message ||
        'Failed to create platform';
      toast.error(errorMessage, { autoClose: 2000 });
    }
  };

  const handleUpdatePlatform = async (data: PlatformFormData) => {
    if (!selectedPlatform) return;

    try {
      const response = await platformAPI.updatePlatform(
        selectedPlatform.id,
        data,
      );
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedPlatform(null);

        toast.success('Platform updated successfully!', { autoClose: 2000 });
        loadAllPlatforms();
      } else {        toast.error(response.message || 'Failed to update platform', {
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Error updating platform:', err);
      const errorResp = err as ApiError;
      const errorMessage =
        errorResp.response?.data?.message ||
        errorResp.message ||
        'Failed to update platform';
      toast.error(errorMessage, { autoClose: 2000 });
    }
  };

  const handleDeletePlatform = async () => {
    if (!selectedPlatform) return;

    try {
      const response = await platformAPI.deletePlatform(selectedPlatform.id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        setSelectedPlatform(null);
        toast.success('Platform deleted successfully!', { autoClose: 2000 });

        await loadAllPlatforms();

        const totalPages = Math.ceil((allPlatforms.length - 1) / itemsPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(response.message || 'Failed to delete platform', {
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Error deleting platform:', err);
      const errorResp = err as ApiError;
      const errorMessage =
        errorResp.response?.data?.message ||
        errorResp.message ||
        'Failed to delete platform';
      toast.error(errorMessage, { autoClose: 2000 });
    }
  };

  const handleSort = (key: keyof Platform) => {
    const direction: 'asc' | 'desc' =
      sortConfig?.key === key && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    setSortConfig({ key, direction });
    setCurrentPage(1);  };

  return (
    <div
      className={`dashboard-container ${
        isSidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="platforms-header">
         <div className="platforms-header-title"><HiOutlineCpuChip /><h1>Platforms</h1>{' '}</div>
          <button
            className="add-platform-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
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
              {allPlatforms.length > 0
                ? (() => {
                    const sorted = [...allPlatforms].sort(
                      (a, b) => (b._count?.games || 0) - (a._count?.games || 0),
                    );

                    const mostPopular = sorted.find(
                      (platform) => (platform._count?.games || 0) > 0,
                    );
                    return mostPopular ? mostPopular.title : 'None';
                  })()
                : 'None'}
            </span>
          </div>
        </div>{' '}
        <div className="platforms-filters">
          <div className="platforms-search-box">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Search Platform..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>{' '}
          <button
            className="clear-btn"
            onClick={() => {
              setSearchText('');
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        </div>
        <div className="platforms-table">          <div className="platforms-table-header">
            <div
              className="platforms-column title"
              onClick={() => handleSort('title')}
            >
              <span className="platforms-table-header-title">
                Title{' '}
                {sortConfig?.key === 'title' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </span>
            </div>
            <div
              className="platforms-column company"
              onClick={() => handleSort('company')}
            >
              <span className="platforms-table-header-title">
                Company{' '}
                {sortConfig?.key === 'company' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </span>
            </div>
            <div
              className="platforms-column year"
              onClick={() => handleSort('acquisitionYear')}
            >
              <span className="platforms-table-header-title">
                Acquisition year{' '}
                {sortConfig?.key === 'acquisitionYear' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </span>
            </div>
            <div
              className="platforms-column created-date"
              onClick={() => handleSort('createdAt')}
            >
              <span className="platforms-table-header-title">
                Created At{' '}
                {sortConfig?.key === 'createdAt' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </span>
            </div>
            <div
              className="platforms-column updated-date"
              onClick={() => handleSort('updatedAt')}
            >
              <span className="platforms-table-header-title">
                Updated At{' '}
                {sortConfig?.key === 'updatedAt' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </span>
            </div>
            <div className="platforms-column actions"></div>
          </div>

          <div className="table-content">
            {paginatedPlatforms.length === 0 ? (
              <div className="empty-state">
                <p>No platforms found. Create your first platform!</p>
              </div>
            ) : (
              paginatedPlatforms.map((platform) => (                <div className="platforms-table-row" key={platform.id}>
                  <div className="platforms-column title">
                    {platform.imageUrl && (
                      <img
                        src={platform.imageUrl}
                        alt={platform.title}
                        className="platform-icon"
                      />
                    )}
                    <span>{platform.title}</span>
                  </div>
                  <div className="platforms-column company">
                    {platform.company}
                  </div>
                  <div className="platforms-column year">
                    {platform.acquisitionYear}
                  </div>
                  <div className="platforms-column created-date">
                    {formatDateTime(platform.createdAt)}
                  </div>
                  <div className="platforms-column updated-date">
                    {formatDateTime(platform.updatedAt)}
                  </div>
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
          <div className="platforms-pagination">
            <button
              className="platforms-pagination-btn-previous"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="current-page">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              className="platforms-pagination-btn-next"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages <= 1}
            >
              Next
            </button>
          </div>

        </div>
        <PlatformModal
          isOpen={isAddModalOpen}          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreatePlatform}
          title="New platform"
        />
        <PlatformModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlatform(null);
          }}          onSubmit={handleUpdatePlatform}
          title="Edit platform"
          initialData={selectedPlatform ?? undefined}
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
                    <span className="detail-value">
                      {selectedPlatform.company}
                    </span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Acquisition Year:</span>
                    <span className="detail-value">
                      {selectedPlatform.acquisitionYear}
                    </span>
                  </div>                  <div className="platform-detail-row">
                    <span className="detail-label">Created At:</span>
                    <span className="detail-value">
                      {formatDateTime(selectedPlatform.createdAt)}
                    </span>
                  </div>
                  <div className="platform-detail-row">
                    <span className="detail-label">Updated At:</span>
                    <span className="detail-value">
                      {formatDateTime(selectedPlatform.updatedAt)}
                    </span>
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
