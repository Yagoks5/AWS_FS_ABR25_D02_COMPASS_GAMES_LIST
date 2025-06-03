import React, { useState } from 'react';
import './Games.css';
import { IoSearchOutline } from "react-icons/io5";
import { BsEye, BsPencil, BsTrash } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Games: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const gamesPerPage = 10;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([
    {
      id: 1,
      title: "Mario Kart",
      description: "Mario 8 que ganhei de aniversário",
      category: "Racing",
      image: "/path/to/mario-kart.jpg",
      createdAt: "2021-12-08",
      updatedAt: "2021-12-08",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Valorant",
      description: "Valorant que jogo com amigos",
      category: "FPS",
      image: "/path/to/valorant.jpg",
      createdAt: "2021-12-08",
      updatedAt: "2021-12-08",
      isFavorite: false,
    }
  ]);

  interface Game {
    id?: number;
    title: string;
    description: string;
    category: string;
    image: string;
    isFavorite: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleAddGame = () => alert('Add new game functionality to be implemented!');

  const toggleFavorite = (id: number) => {
    const updated = games.map(game =>
      game.id === id ? { ...game, isFavorite: !game.isFavorite } : game
    );
    setGames(updated);
  };

  const handleDelete = (game: Game) => {
  setGameToDelete(game);
  setIsDeleteModalOpen(true);
 };

 const confirmDelete = () => {
  if (gameToDelete) {
    setGames(games.filter(game => game.id !== gameToDelete.id));
    setIsDeleteModalOpen(false);
  }
};

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
    const matchesFavorite = isFavoriteOnly ? game.isFavorite : true;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setIsFavoriteOnly(false);
  };

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = (game: Game) => {
  setSelectedGame(game);
  setIsModalOpen(true);
};

const closeModal = () => {
  setSelectedGame(null);
  setIsModalOpen(false);
};

const currentGames = filteredGames.slice(
  currentPage * gamesPerPage,
  (currentPage + 1) * gamesPerPage
);


  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="games-header">
          <h1>Games</h1>
          <button className="add-game-btn" onClick={handleAddGame}>Add new game</button>
        </div>

        <div className="games-filters">
          <div className="search-box">
            <IoSearchOutline />
            <input 
              type="text" 
              placeholder="Search Game..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">Select Category</option>
              <option value="Racing">Racing</option>
              <option value="FPS">FPS</option>
            </select>

            <label className="favorite-filter">
              <input 
                type="checkbox"
                checked={isFavoriteOnly}
                onChange={(e) => setIsFavoriteOnly(e.target.checked)}
              />
              Favorite
            </label>
          </div>

          <button className="clear-btn" onClick={handleClearFilters}>Clear</button>
        </div>

        <div className="games-table">
          <div className="table-header">
            <div className="column title">Title</div>
            <div className="column description">Description</div>
            <div className="column category">Category</div>
            <div className="column release-date">Created</div>
            <div className="column favorite">Favorite</div>
            <div className="column actions">Actions</div>
          </div>

          <div className="table-content">
            {currentGames.map((game) => (
              <div className="table-row" key={game.id}>
                <div className="column title">
                  <img src={game.image} alt={game.title} className="game-icon" />
                  {game.title}
                </div>
                <div className="column description">{game.description}</div>
                <div className="column category">{game.category}</div>
                <div className="column release-date">
                  {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                </div>
                <div 
                  className="column favorite" 
                  onClick={() => toggleFavorite(game.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {game.isFavorite ? "★" : "☆"}
                </div>
                <div className="column actions">
                  <button className="action-btn view" onClick={() => openModal(game)}>
                    <BsEye className="action-icon" />
                  </button>
                  <button className="action-btn edit">
                    <BsPencil className="action-icon" />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(game)}>
                    <BsTrash className="action-icon" />
                  </button>

                </div>
              </div>

              
            ))}

            <div className="pagination" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
  <button 
    onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
    disabled={currentPage === 0}
  >
    Anterior
  </button>
  <span>Página {currentPage + 1}</span>
  <button 
    onClick={() => setCurrentPage(p => p + 1)}
    disabled={(currentPage + 1) * gamesPerPage >= filteredGames.length}
  >
    Próximo
  </button>
</div>


{isDeleteModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-modal" onClick={() => setIsDeleteModalOpen(false)}>✖</button>
      <h2>Confirmar Exclusão</h2>
      <p>Tem certeza que deseja excluir "{gameToDelete?.title}"?</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={confirmDelete} style={{ background: '#ff4d4d' }}>Excluir</button>
        <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>

        {isModalOpen && selectedGame && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={closeModal}>✖</button>
              <h2>{selectedGame.title}</h2>
              <img src={selectedGame.image} alt={selectedGame.title} className="modal-image" />
              <p><strong>Description:</strong> {selectedGame.description}</p>
              <p><strong>Category:</strong> {selectedGame.category}</p>
              <p>
  <strong>Created:</strong>{' '}
  {selectedGame.createdAt
    ? new Date(selectedGame.createdAt).toLocaleDateString("pt-BR")
    : "N/A"}
</p>

              <p><strong>Favorite:</strong> {selectedGame.isFavorite ? "Yes ★" : "No ☆"}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;