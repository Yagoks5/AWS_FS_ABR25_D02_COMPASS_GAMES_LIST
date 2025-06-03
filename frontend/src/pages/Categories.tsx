import React, { useState, useMemo } from 'react';
import './Categories.css';
import { AiOutlineHome } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import { RiAlertFill } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { SlTrash } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";

interface Category {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type SortKey = 'name' | 'description' | 'createdAt' | 'updatedAt';

const Categories: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; category: Category | null }>({
    show: false,
    category: null,
  });

  // MODIFICATION: Convert initialCategories to a state variable
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "Racing",
      description: "Driving games",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "FPS",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "Fighting",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
      name: "MMO RPG",
      description: "",
      createdAt: "08/12/2021",
      updatedAt: "08/12/2021"
    },
    {
        name: "Adventure",
        description: "Explore worlds",
        createdAt: "10/01/2022",
        updatedAt: "15/03/2023"
    },
    {
        name: "Puzzle",
        description: "Mind-bending challenges",
        createdAt: "05/05/2020",
        updatedAt: "05/05/2020"
    },
    {
        name: "Sports",
        description: "Athletic simulations",
        createdAt: "20/07/2023",
        updatedAt: "20/07/2023"
    }
  ]);

  // Estado para a ordenação
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({
    key: null,
    direction: 'ascending',
  });

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Logout functionality to be implemented!');

  // Usar useMemo para memoizar as categorias ordenadas
  const sortedCategories = useMemo(() => {
    let sortableItems = [...categories]; // Use the state variable 'categories'
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as SortKey];
        const bValue = b[sortConfig.key as SortKey];

        // Lidar com datas
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
            const dateA = new Date(aValue.split('/').reverse().join('-'));
            const dateB = new Date(bValue.split('/').reverse().join('-'));
            if (dateA < dateB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (dateA > dateB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        }

        // Lidar com strings (case-insensitive)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [categories, sortConfig]); // Dependências do useMemo should include 'categories'

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Função para exibir o ícone de ordenação
  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    } // Ícone padrão para não ordenado ou para indicar clicável
  };

  const handleAddCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      createdAt: '', // Empty createdAt indicates a new category
      updatedAt: ''
    });
    setOriginalName
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setOriginalName(category.name); // Store the original name for potential updates
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  // MODIFICATION: Update handleSaveCategory to manage state
  const handleSaveCategory = () => {
    if (editingCategory) {
      const now = new Date().toLocaleDateString(); // Simple date string for example
      if (!editingCategory.createdAt) {
        // This is a new category
        const newCategory: Category = {
          ...editingCategory,
          createdAt: now,
          updatedAt: now,
        };
        setCategories((prevCategories) => [...prevCategories, newCategory]);
        console.log('New category added to state:', newCategory);
      } else {
        // This is an existing category being edited
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            // Assuming name is unique for simplicity, ideally use an ID
            cat.name === originalName
              ? { ...editingCategory, updatedAt: now }
              : cat,
          ),
        );
        console.log('Category updated in state:', editingCategory);
      }
    }
    setShowModal(false);
    setEditingCategory(null);
    setOriginalName(null)
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({ show: true, category });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, category: null });
  };

  // MODIFICATION: Update handleConfirmDelete to manage state
  const handleConfirmDelete = () => {
    if (deleteModal.category) {
      // Frontend only deletion:
      setCategories(
        (prevCategories) =>
          prevCategories.filter(
            (cat) => cat.name !== deleteModal.category!.name,
          ), // Again, assuming name is unique
      );
      console.log('Category deleted from state:', deleteModal.category);
    }
    setDeleteModal({ show: false, category: null });
  };

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {!isSidebarCollapsed && <div className="logo"></div>}
          <button onClick={toggleSidebar} className="collapse-btn"><IoIosMenu /></button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard"><AiOutlineHome />{!isSidebarCollapsed && <span>Home</span>}</Link>
            </li>
            <li>
              <Link to="/games"><IoGameControllerOutline />{!isSidebarCollapsed && <span>Games</span>}</Link>
            </li>
            <li className="active">
              <Link to="/categories"><BiCategory />{!isSidebarCollapsed && <span>Categories</span>}</Link>
            </li>
            <li>
              <Link to="/platforms"><HiOutlineCpuChip />{!isSidebarCollapsed && <span>Platforms</span>}</Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <MdLogout />{!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="categories-header">
          <h1><BiCategory /> Categories</h1>
          <button className="add-category-btn" onClick={handleAddCategory}>
            New category
          </button>
        </div>

        <div className="categories-table">
          <div className="table-header">
            <div className="column name" onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</div>
            <div className="column description" onClick={() => requestSort('description')}>Description {getSortIndicator('description')}</div>
            <div className="column created" onClick={() => requestSort('createdAt')}>Created at {getSortIndicator('createdAt')}</div>
            <div className="column updated" onClick={() => requestSort('updatedAt')}>Updated at {getSortIndicator('updatedAt')}</div>
            <div className="column actions"></div>
          </div>

          <div className="table-content">
            {sortedCategories.map((category, index) => (
              <div className="table-row" key={category.name}> {/* Using name as key, ideally use a unique ID */}
                <div className="column name">{category.name}</div>
                <div className="column description">{category.description}</div>
                <div className="column created">{category.createdAt}</div>
                <div className="column updated">{category.updatedAt}</div>
                <div className="column-actions">
                  <button
                    className="action-btn edit"
                    title="Edit"
                    onClick={() => handleEditCategory(category)}
                  ><GoPencil /></button>
                  <button
                    className="action-btn delete"
                    title="Delete"
                    onClick={() => handleDeleteClick(category)}
                  ><SlTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pagination">
          <button className="pagination-btn-previous">← Previous</button>
          <span className="current-page">1</span>
          <button className="pagination-btn-next">Next →</button>
        </div>
      </main>

      {/* Modal de edição/criação */}
      {showModal && editingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}><IoMdClose /></button>
            <h2 className='title-new-edit-category'>{editingCategory.createdAt ? 'Edit category' : 'New category'}</h2>

            <label className="title-category">Title</label>
            <input
              className="title-category-input"
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
            />

            <label className="description-category-card">Description</label>
            <textarea
              className="description-category-textarea"
              value={editingCategory.description}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, description: e.target.value })
              }
            ></textarea>

            <button onClick={handleSaveCategory} className="save-btn">
              {editingCategory.createdAt ? 'Save changes' : 'Save category'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal confirm-delete-modal">
            <button className="close-btn" onClick={handleCancelDelete}><IoMdClose /></button>
            <div className="modal-icon"><RiAlertFill /></div>
            <div className="delete-text">
              <h2>Are you sure?</h2>
              <p>
              Deleting this category will remove all games associated.<br />
              This action is not reversible.
              </p>
            </div>
            <div className="modal-buttons">
              <button onClick={handleCancelDelete} className="cancel-btn">No, cancel action</button>
              <button onClick={handleConfirmDelete} className="delete-btn">Yes, delete this</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;