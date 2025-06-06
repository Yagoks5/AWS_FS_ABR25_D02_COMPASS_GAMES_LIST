import { useState, useEffect, useMemo } from 'react';
import './Games.css';
import './Games-styles.css';
import { IoSearchOutline } from 'react-icons/io5';
import { BsEye, BsPencil, BsTrash, BsHeart, BsHeartFill } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import GameModal from '../components/GameModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Game, GameStatus, GameFilters } from '../services/gameService';
import { gameAPI } from '../services/gameService';
import { categoryAPI } from '../services/categoryService';
import { getAllPlatforms } from '../services/api';
import { useInvalidateCache } from '../hooks/useInvalidateCache';
import { FiPlus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IoGameControllerOutline } from 'react-icons/io5';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface Platform {
  id: number;
  title: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Games: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [selectedPlatformId, setSelectedPlatformId] = useState<
    number | undefined
  >(undefined);
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | undefined>(
    undefined,
  );
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Game;
    direction: 'asc' | 'desc';
  } | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { invalidateGames, invalidateDashboard } = useInvalidateCache();  
  const filters: GameFilters = useMemo(() => {
    const result: GameFilters = {};
    if (selectedCategoryId !== undefined)
      result.categoryId = selectedCategoryId;
    if (selectedPlatformId !== undefined)
      result.platformId = selectedPlatformId;
    if (selectedStatus !== undefined) result.status = selectedStatus;
    if (isFavoriteOnly) result.isFavorite = isFavoriteOnly;
    return result;
  }, [
    selectedCategoryId,
    selectedPlatformId,
    selectedStatus,
    isFavoriteOnly,
  ]);

  const { data: gamesData, isLoading: isLoadingGames } = useQuery({
    queryKey: ['games', filters],
    queryFn: async () => {
      try {
        const response = await gameAPI.getAllGames(filters);
        return response.data;
      } catch (err) {
        const error = err as ApiError;
        setError(
          error.response?.data?.message ||
            error.message ||
            'Failed to load games',
        );
        throw error;
      }
    },
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await categoryAPI.getAllCategories();
        return response.data;
      } catch (err) {
        const error = err as ApiError;
        setError(
          error.response?.data?.message ||
            error.message ||
            'Failed to load categories',
        );
        throw error;
      }
    },
  });

  const { data: platformsData, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      try {
        const response = await getAllPlatforms();
        return response.data;
      } catch (err) {
        const error = err as ApiError;
        setError(
          error.response?.data?.message ||
            error.message ||
            'Failed to load platforms',
        );
        throw error;
      }
    },
  }); 
  const allGames = useMemo(() => gamesData || [], [gamesData]);
  const categories = useMemo(() => categoriesData || [], [categoriesData]);
  const platforms: Platform[] = useMemo(
    () => platformsData || [],
    [platformsData],
  );

  const loading = isLoadingGames || isLoadingCategories || isLoadingPlatforms;

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      const shouldFavorite = searchParams.get('favorite') === 'true';

      setSearchParams((params) => {
        params.delete('add');
        params.delete('favorite');
        return params;
      });

      if (shouldFavorite) {
        setSelectedGame({ isFavorite: true } as Game);
        setIsAddModalOpen(true);
      } else {
        setSelectedGame(null);
        setIsAddModalOpen(true);
      }
    }
  }, [searchParams, setSearchParams]);

  const formatDateIso = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    if (dateString.length >= 10) {
      const [year, month, day] = dateString.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleAddGame = () => {
    setSelectedGame(null);
    setIsAddModalOpen(true);
  };

  const handleEditGame = (game: Game) => {
    setSelectedGame(game);
    setIsEditModalOpen(true);
  };

  const handleViewGame = (game: Game) => {
    setSelectedGame(game);
    setIsViewModalOpen(true);
  };

  const handleDeleteGame = (game: Game) => {
    setSelectedGame(game);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedGame) return;

    try {
      await gameAPI.deleteGame(selectedGame.id);
      invalidateGames(); 
      invalidateDashboard(); 
      setIsDeleteModalOpen(false);
      setSelectedGame(null);
      toast.success(`${selectedGame.title} deleted successfully!`);
    } catch (err) {
      const error = err as ApiError;
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };
  const toggleFavorite = async (gameId: number) => {
    try {
      const game = allGames.find((g) => g.id === gameId);
      if (!game) return;

      await gameAPI.toggleFavorite(gameId, !game.isFavorite);
      invalidateGames(); 
      invalidateDashboard(); 
    } catch (err) {
      const error = err as ApiError;
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    }
  };
  const handleGameSaved = () => {
    invalidateGames(); 
    invalidateDashboard(); 
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedGame(null);
  };

  const handleSort = (key: keyof Game) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const sortedGames = useMemo(() => {
    if (!sortConfig) return allGames;    return [...allGames].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'category') {
        aValue = a.category?.name;
        bValue = b.category?.name;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (!bValue) return sortConfig.direction === 'asc' ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allGames, sortConfig]);

  const filteredGames = useMemo(() => {
    if (!searchText) return sortedGames;

    return sortedGames.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (game.description?.toLowerCase() || '').includes(
          searchText.toLowerCase(),
        );
      return matchesSearch;
    });
  }, [sortedGames, searchText]);

  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedCategoryId(undefined);
    setSelectedPlatformId(undefined);
    setSelectedStatus(undefined);
    setIsFavoriteOnly(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    selectedCategoryId,
    selectedPlatformId,
    selectedStatus,
    isFavoriteOnly,
  ]);  return (
    <div
      className={`dashboard-container ${
        isSidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />
      
      {/* Loading overlay with no message */}
      <div className={`loading-overlay ${loading ? 'visible' : ''}`}>
      </div>

      <main className="main-content">        <div className="games-header">
        <div className="games-header-title"> <IoGameControllerOutline /><h1>Games</h1></div>
          <button type="button" className="add-game-btn" onClick={handleAddGame}>
            <FiPlus /> New game
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
            <button type="button" onClick={() => setError(null)}>×</button>
          </div>
        )}
        <div className="games-stats-summary">
          <div className="stats-item">
            <span className="stats-label">Total Games:</span>
            <span className="stats-value">{allGames.length}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Playing:</span>
            <span className="stats-value">
              {allGames.filter((g) => g.status === 'Playing').length}
            </span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Completed:</span>
            <span className="stats-value">
              {allGames.filter((g) => g.status === 'Done').length}
            </span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Abandoned:</span>
            <span className="stats-value">
              {allGames.filter((g) => g.status === 'Abandoned').length}
            </span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Favorites:</span>
            <span className="stats-value">
              {allGames.filter((g) => g.isFavorite).length}
            </span>
          </div>
        </div>
        <div className="games-filters">
          <div className="games-search-box">
            <IoSearchOutline />            <input
              type="text"
              placeholder="Search Game..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />{searchText && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchText('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <select
              value={selectedCategoryId || ''}
              onChange={(e) =>
                setSelectedCategoryId(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedPlatformId || ''}
              onChange={(e) =>
                setSelectedPlatformId(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="platform-select"
            >
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.title}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus || ''}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value ? (e.target.value as GameStatus) : undefined,
                )
              }
              className="status-select"
            >
              <option value="">All Status</option>
              <option value="Playing">Playing</option>
              <option value="Done">Done</option>
              <option value="Abandoned">Abandoned</option>
            </select>

            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={isFavoriteOnly}
                onChange={(e) => setIsFavoriteOnly(e.target.checked)}
              />
              Favorites Only
            </label>
          </div>          <button type="button" className="clear-btn" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
        <div className="games-table">          <div className="games-table-header">
            <div
              className="games-column title"
              onClick={() => handleSort('title')}
            >
              <span className = "games-table-header-title"> Title{' '}
              {sortConfig?.key === 'title' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')} </span>
            </div>
            <div className="games-column description">Description</div>
            <div
              className="games-column category"
              onClick={() => handleSort('category')}
            >
             <span className = "games-table-header-title"> Category{' '}
              {sortConfig?.key === 'category' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')} </span>
            </div>
            <div
              className="games-column release-date"
              onClick={() => handleSort('createdAt')}
            >
              <span className = "games-table-header-title"> Created At{' '}
              {sortConfig?.key === 'createdAt' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')} </span>
            </div>
            <div
              className="games-column modified-date"
              onClick={() => handleSort('updatedAt')}
            >
              <span className = "games-table-header-title"> Modified At{' '}
              {sortConfig?.key === 'updatedAt' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')} </span>
            </div>
            <div
              className="games-column status"
              onClick={() => handleSort('status')}
            >
              <span className = "games-table-header-title"> Status{' '}
              {sortConfig?.key === 'status' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')} </span>
            </div>
            <div className="games-column favorite">Favorite</div>
            <div className="games-column actions"></div>
          </div>

          <div className="table-content">
            {' '}
            {paginatedGames.length === 0 ? (
              <div className="empty-state">
                <p>No games found. Create your first game!</p>
              </div>
            ) : (              paginatedGames.map((game) => (
                <div className="games-table-row" key={game.id}>
                  <div className="games-column title">
                    {game.imageUrl && (
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="game-icon"
                      />
                    )}
                    {game.title}
                  </div>
                  <div className="games-column description">
                    {game.description || '-'}
                  </div>
                  <div className="games-column category">
                    {game.category.name}
                  </div>
                  <div className="games-column release-date">
                    {formatDateTime(game.createdAt)}
                  </div>
                  <div className="games-column modified-date">
                    {formatDateTime(game.updatedAt)}
                  </div>
                  <div className="games-column status">
                    <span
                      className={`status-badge status-${game.status?.toLowerCase()}`}
                    >
                      {game.status || 'Playing'}
                    </span>
                  </div>
                  <div
                    className="games-column favorite"
                    onClick={() => toggleFavorite(game.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {game.isFavorite ? (
                      <BsHeartFill className="favorite-icon active" />
                    ) : (
                      <BsHeart className="favorite-icon" />
                    )}
                  </div>                  <div className="games-column actions">
                    <button
                      type="button"
                      className="games-action-btn view"
                      onClick={() => handleViewGame(game)}
                      title="View"
                    >
                      <BsEye className="action-icon" />
                    </button>
                    <button
                      type="button"
                      className="games-action-btn edit"
                      onClick={() => handleEditGame(game)}
                      title="Edit"
                    >
                      <BsPencil className="action-icon" />
                    </button>
                    <button
                      type="button"
                      className="games-action-btn delete"
                      onClick={() => handleDeleteGame(game)}
                      title="Delete"
                    >
                      <BsTrash className="action-icon" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>        <div className="games-pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="games-pagination-btn-previous"
          >
            Previous
          </button>
          <span className="current-page">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages <= 1}
            className="games-pagination-btn-next"
          >
            Next
          </button>
        </div>
        
        {(isAddModalOpen || isEditModalOpen) && (
          <GameModal
            isOpen={isAddModalOpen || isEditModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedGame(null);
            }}
            onSubmit={async (gameData) => {
              try {
                if (isAddModalOpen) {
                  await gameAPI.createGame(gameData);
                } else if (selectedGame) {
                  await gameAPI.updateGame(selectedGame.id, gameData);
                }
                handleGameSaved();
                toast.success(
                  isAddModalOpen
                    ? 'Game added successfully!'
                    : 'Game updated successfully!',
                );
              } catch (err) {
                const error = err as ApiError;
                const message = error.response?.data?.message || error.message;

                toast.error(message || 'Failed to save game');
              }
            }}
            mode={isAddModalOpen ? 'create' : 'edit'}
            game={selectedGame}
          />
        )}{' '}
          {isViewModalOpen && selectedGame && (
          <div className="modal-overlay">
            <div className="modal-content view-modal-content">
              <div className="view-modal-header">
                <h2>Game Details</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedGame(null);
                  }}
                  className="close-btn"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="game-details">
                {selectedGame.imageUrl && (
                  <div className="game-image-wrapper">
                    <div className="game-image-container">
                      <img
                        src={selectedGame.imageUrl}
                        alt={selectedGame.title}
                        className="game-detail-image"
                      />
                    </div>
                  </div>
                )}
                
                <div className="game-info">
                  <h3 className="game-title">{selectedGame.title}</h3>
                  <div className="game-detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">
                      {selectedGame.description || 'No description'}
                    </span>
                  </div>
                  <div className="game-detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">
                      {selectedGame.category.name}
                    </span>
                  </div>
                  <div className="game-detail-row">
                    <span className="detail-label">Platform:</span>
                    <span className="detail-value">
                      {selectedGame.platform?.title || 'No platform'}
                    </span>
                  </div>
                  <div className="game-detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      {selectedGame.status || 'Playing'}
                    </span>
                  </div>
                  {selectedGame.acquisitionDate && (
                    <div className="game-detail-row">
                      <span className="detail-label">Acquisition Date:</span>
                      <span className="detail-value">
                        {formatDateIso(selectedGame.acquisitionDate)}
                      </span>
                    </div>
                  )}
                  {selectedGame.finishDate && (
                    <div className="game-detail-row">
                      <span className="detail-label">Finish Date:</span>
                      <span className="detail-value">
                        {formatDateIso(selectedGame.finishDate)}
                      </span>
                    </div>
                  )}
                  <div className="game-detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {new Date(selectedGame.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="game-detail-row">
                    <span className="detail-label">Favorite:</span>
                    <span className="detail-value">
                      {selectedGame.isFavorite ? 'Yes ❤️' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="view-modal-footer">
                <button
                  type="button"
                  className="close-view-btn"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedGame(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
       
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete "${selectedGame?.title}"? This action cannot be undone.`}
        />
      </main>
    </div>
  );
};

export default Games;
