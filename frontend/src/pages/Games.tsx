import { useState, useEffect, useMemo } from 'react';
import './Games.css';
import { IoSearchOutline } from 'react-icons/io5';
import { BsEye, BsPencil, BsTrash, BsHeart, BsHeartFill } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import GameModal from '../components/GameModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Game, GameStatus } from '../services/gameService';
import type { Category } from '../services/categoryService';
import { gameAPI } from '../services/gameService';
import { categoryAPI } from '../services/categoryService';
import { getAllPlatforms } from '../services/api';
import { useInvalidateCache } from '../hooks/useInvalidateCache';
import { FiPlus } from 'react-icons/fi';

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
  company: string;
  acquisitionYear: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const Games: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Filter states
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Game;
    direction: 'asc' | 'desc';
  } | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Load data on component mount
  useEffect(() => {
    loadData();

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [gamesResponse, categoriesResponse, platformsResponse] =
        await Promise.all([
          gameAPI.getAllGames({}),
          categoryAPI.getAllCategories(),
          getAllPlatforms(),
        ]);

      setAllGames(gamesResponse.data);
      setCategories(categoriesResponse.data);
      setPlatforms(platformsResponse.data);
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message || error.message || 'Failed to load data',
      );
    } finally {
      setLoading(false);
    }
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
      setAllGames((prev) => prev.filter((game) => game.id !== selectedGame.id));
      invalidateGames(); // Invalidate games cache
      invalidateDashboard(); // Update dashboard counters
      setIsDeleteModalOpen(false);
      setSelectedGame(null);
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete game',
      );
    }
  };
  const toggleFavorite = async (gameId: number) => {
    try {
      const game = allGames.find((g) => g.id === gameId);
      if (!game) return;

      await gameAPI.toggleFavorite(gameId, !game.isFavorite);
      setAllGames((prev) =>
        prev.map((game) =>
          game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game,
        ),
      );
      invalidateGames(); // Invalidate games cache
      invalidateDashboard(); // Update dashboard counters for favorites
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to update favorite',
      );
    }
  };
  const { invalidateGames, invalidateDashboard } = useInvalidateCache();

  const handleGameSaved = () => {
    loadData(); // Reload data after save
    invalidateGames(); // Invalidate games cache
    invalidateDashboard(); // Update dashboard counters
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
    if (!sortConfig) return allGames;

    return [...allGames].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (!bValue) return sortConfig.direction === 'asc' ? 1 : -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allGames, sortConfig]);

  const filteredGames = useMemo(() => {
    return sortedGames.filter((game) => {
      const matchesSearch =
        !searchText ||
        game.title.toLowerCase().includes(searchText.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        !selectedCategoryId || game.category.id === selectedCategoryId;
      const matchesPlatform =
        !selectedPlatformId || game.platform?.id === selectedPlatformId;
      const matchesStatus = !selectedStatus || game.status === selectedStatus;
      const matchesFavorite = !isFavoriteOnly || game.isFavorite;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPlatform &&
        matchesStatus &&
        matchesFavorite
      );
    });
  }, [
    sortedGames,
    searchText,
    selectedCategoryId,
    selectedPlatformId,
    selectedStatus,
    isFavoriteOnly,
  ]);

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
    const delayedLoad = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delayedLoad);
  }, [selectedCategoryId, selectedPlatformId, selectedStatus, isFavoriteOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    selectedCategoryId,
    selectedPlatformId,
    selectedStatus,
    isFavoriteOnly,
  ]);

  if (loading) {
    return (
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
        <main className="main-content">
          <div className="loading">Loading games...</div>
        </main>
      </div>
    );
  }

  return (
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

      <main className="main-content">
        {' '}
        <div className="games-header">
          <h1>Games</h1>
          <button className="add-game-btn" onClick={handleAddGame}>
            <FiPlus /> New game
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
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
        </div>        <div className="games-filters">          <div className="games-search-box">
            <IoSearchOutline />
            <input
              type="text"
              placeholder="Search Game..."
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
          </div>

          <button className="clear-btn" onClick={handleClearFilters}>
            Clear
          </button>
        </div>        <div className="games-table">
          <div className="games-table-header">
            <div className="games-column title" onClick={() => handleSort('title')}>
              Title{' '}
              {sortConfig?.key === 'title' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="games-column description">Description</div>
            <div
              className="games-column category"
              onClick={() => handleSort('category')}
            >
              Category{' '}
              {sortConfig?.key === 'category' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="games-column platform">Platform</div>
            <div className="games-column status">Status</div>
            <div
              className="games-column release-date"
              onClick={() => handleSort('createdAt')}
            >
              Created{' '}
              {sortConfig?.key === 'createdAt' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </div>
            <div className="games-column favorite">Favorite</div>
            <div className="games-column actions">Actions</div>
          </div>

          <div className="table-content">            {paginatedGames.length === 0 ? (
              <div className="no-games">No games found</div>
            ) : (
              paginatedGames.map((game) => (
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
                  <div className="games-column category">{game.category.name}</div>
                  <div className="games-column platform">
                    {game.platform?.title || 'N/A'}
                  </div>
                  <div className="games-column status">
                    <span
                      className={`status-badge status-${game.status?.toLowerCase()}`}
                    >
                      {game.status || 'Playing'}
                    </span>
                  </div>
                  <div className="column release-date">
                    {new Date(game.createdAt).toLocaleDateString('pt-BR')}
                  </div>                  <div
                    className="games-column favorite"
                    onClick={() => toggleFavorite(game.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {game.isFavorite ? (
                      <BsHeartFill className="favorite-icon active" />
                    ) : (
                      <BsHeart className="favorite-icon" />
                    )}
                  </div>
                  <div className="games-column actions">
                    <button
                      className="games-action-btn view"
                      onClick={() => handleViewGame(game)}
                      title="View"
                    >
                      <BsEye className="action-icon" />
                    </button>
                    <button
                      className="games-action-btn edit"
                      onClick={() => handleEditGame(game)}
                      title="Edit"
                    >
                      <BsPencil className="action-icon" />
                    </button>
                    <button
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages <= 1}
              className="games-pagination-btn-next"
            >
              Next
            </button>
          </div>
        {/* Add/Edit Modal */}
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
              } catch (err) {
                const error = err as ApiError;
                setError(
                  error.response?.data?.message ||
                    error.message ||
                    'Failed to save game',
                );
              }
            }}
            mode={isAddModalOpen ? 'create' : 'edit'}
            game={selectedGame}
          />
        )}
        {/* View Modal */}
        {isViewModalOpen && selectedGame && (
          <div className="modal-overlay">
            <div className="modal-content view-modal">
              <button
                className="close-modal"
                onClick={() => setIsViewModalOpen(false)}
              >
                ✖
              </button>
              <h2>{selectedGame.title}</h2>
              {selectedGame.imageUrl && (
                <img
                  src={selectedGame.imageUrl}
                  alt={selectedGame.title}
                  className="modal-image"
                />
              )}{' '}
              <div className="game-details">
                <p>
                  <strong>Description:</strong>{' '}
                  {selectedGame.description || 'No description'}
                </p>
                <p>
                  <strong>Category:</strong> {selectedGame.category.name}
                </p>
                <p>
                  <strong>Platform:</strong>{' '}
                  {selectedGame.platform?.title || 'No platform'}
                </p>
                <p>
                  <strong>Status:</strong> {selectedGame.status || 'Playing'}
                </p>
                {selectedGame.acquisitionDate && (
                  <p>
                    <strong>Acquisition Date:</strong>{' '}
                    {new Date(selectedGame.acquisitionDate).toLocaleDateString(
                      'pt-BR',
                    )}
                  </p>
                )}
                {selectedGame.finishDate && (
                  <p>
                    <strong>Finish Date:</strong>{' '}
                    {new Date(selectedGame.finishDate).toLocaleDateString(
                      'pt-BR',
                    )}
                  </p>
                )}
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(selectedGame.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  <strong>Favorite:</strong>{' '}
                  {selectedGame.isFavorite ? 'Yes ❤️' : 'No'}
                </p>
              </div>
            </div>
          </div>
        )}{' '}
        {/* Delete Confirmation Modal */}
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
