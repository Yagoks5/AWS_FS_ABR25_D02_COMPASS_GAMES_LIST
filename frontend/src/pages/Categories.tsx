import React, { useState } from 'react';
import './Categories.css';
import { BiCategory } from "react-icons/bi";
import { RiAlertFill } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import { SlTrash } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import Sidebar from '../components/Sidebar';

interface Category {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const Categories: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; category: Category | null }>({
    show: false,
    category: null,
  });

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleLogout = () => alert('Logout functionality to be implemented!');

  const categories: Category[] = [
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
    }
  ];

  const handleAddCategory = () => {
    setEditingCategory({
      name: '',
      description: '',
      createdAt: '',
      updatedAt: ''
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      console.log('Categoria salva:', editingCategory);
      // Aqui você pode enviar para API ou atualizar o estado de categories
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({ show: true, category });
  };

  const handleCancelDelete = () => {
    setDeleteModal({ show: false, category: null });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.category) {
      console.log('Categoria deletada:', deleteModal.category);
      // Aqui você pode fazer a chamada para excluir na API ou remover do estado
    }
    setDeleteModal({ show: false, category: null });
  };
  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="categories-header">
          <h1><BiCategory /> Categories</h1>
          <button className="add-category-btn" onClick={handleAddCategory}>
            New category
          </button>
        </div>

        <div className="categories-table">
          <div className="table-header">
            <div className="column name">Name ⇅</div>
            <div className="column description">Description ⇅</div>
            <div className="column created">Created at ⇅</div>
            <div className="column updated">Updated at ⇅</div>
            <div className="column actions"></div>
          </div>

          <div className="table-content">
            {categories.map((category, index) => (
              <div className="table-row" key={index}>
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

