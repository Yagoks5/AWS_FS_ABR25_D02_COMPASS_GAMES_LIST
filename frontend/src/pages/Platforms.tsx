import { type FC, useState } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';
import PlatformModal from '../components/PlatformModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Sidebar from '../components/Sidebar';
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import './Platforms.css';

const Platforms: FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Platform;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof Platform) => {
    const direction: 'asc' | 'desc' = 
      sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({ key, direction });
    
    setPlatforms(prev => [...prev].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onLogout={() => {/* Implement logout logic */}}
      />
      
      <main className="main-content">
        <div className="platforms-header">
          <h1>Platforms</h1>
          <button 
            type="button"
            className="add-platform-btn" 
            onClick={() => setIsAddModalOpen(true)}
          >
            add new platform
          </button>
        </div>

        <div className="platforms-table">
          <div className="table-header">
            <div className="column title" onClick={() => handleSort('title')}>
              Title {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column owner" onClick={() => handleSort('owner')}>
              Owner {sortConfig?.key === 'owner' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column year" onClick={() => handleSort('acquisitionYear')}>
              Acquisition year {sortConfig?.key === 'acquisitionYear' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="column actions">Actions</div>
          </div>

          <div className="table-content">
            {platforms.map((platform) => (
              <div className="table-row" key={platform.id}>
                <div className="column title">
                  <img src={platform.imageUrl} alt={platform.title} className="platform-icon" />
                  <span>{platform.title}</span>
                </div>
                <div className="column owner">{platform.owner}</div>
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
            ))}
          </div>
        </div>

        {/* Modals */}
        <PlatformModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data: PlatformFormData) => {
            setPlatforms(prev => [...prev, { id: Date.now().toString(), ...data }]);
            setIsAddModalOpen(false);
          }}
          title="New platform"
        />

        <PlatformModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlatform(null);
          }}
          onSubmit={(data: PlatformFormData) => {
            if (!selectedPlatform) return;
            setPlatforms(prev => prev.map(platform => 
              platform.id === selectedPlatform.id 
                ? { ...platform, ...data }
                : platform
            ));
            setIsEditModalOpen(false);
            setSelectedPlatform(null);
          }}
          title="Edit platform"
          initialData={selectedPlatform ?? undefined}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPlatform(null);
          }}
          onConfirm={() => {
            if (!selectedPlatform) return;
            setPlatforms(prev => prev.filter(p => p.id !== selectedPlatform.id));
            setIsDeleteModalOpen(false);
            setSelectedPlatform(null);
          }}
          message="Deleting this platform will remove permanently from system. This action is not reversible."
        />

        {/* View Modal */}
        {isViewModalOpen && selectedPlatform && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
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
                <img 
                  src={selectedPlatform.imageUrl} 
                  alt={selectedPlatform.title} 
                  className="platform-detail-image" 
                />
                <div className="platform-info">
                  <h3>{selectedPlatform.title}</h3>
                  <p><strong>Owner:</strong> {selectedPlatform.owner}</p>
                  <p><strong>Acquisition Year:</strong> {selectedPlatform.acquisitionYear}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Platforms;