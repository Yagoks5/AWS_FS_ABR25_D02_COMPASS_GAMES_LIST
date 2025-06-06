import React, { useState, useEffect } from 'react';
import type { Category, CategoryFormData } from '../services/categoryService';
import { categoryAPI } from '../services/categoryService';
import './CategoryModal.css';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; 
  mode: 'create' | 'edit' | 'view';
  category?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  category,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (category && mode !== 'create') {
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [category, mode]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'view') return;

    if (validateForm()) {
      setLoading(true);
      try {
        const submitData: CategoryFormData = {
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined,
        };

        if (mode === 'create') {
          await categoryAPI.createCategory(submitData);
          toast.success('Category created successfully', { autoClose: 2500 });
        } else if (mode === 'edit' && category) {
          await categoryAPI.updateCategory(category.id, submitData);
          toast.success('Category updated successfully', { autoClose: 3000 });
        }
        onSubmit(); 
      } catch (error: any) {
        const responseData = error.response?.data;
        toast.error(
          responseData?.message ||
            'An error occurred while saving the category',
          { autoClose: 3000 },
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (!isOpen) return null;

  const isReadonly = mode === 'view';
  const title =
    mode === 'create'
      ? 'New Category'
      : mode === 'edit'
      ? 'Edit Category'
      : 'Category Details';

  return (
    <div className="modal-overlay">
      <div className="modal-content category-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-modal" onClick={onClose} type="button">
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'error' : ''}
              disabled={isReadonly}
              placeholder="Enter category name"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>{' '}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isReadonly}
              placeholder="Enter category description"
              rows={4}
            />
          </div>
          
          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}
          
          {isReadonly && category?._count && (
            <div className="form-group">
              <label>Games in this category</label>
              <input
                type="text"
                value={`${category._count.games} game(s)`}
                disabled
                className="info-field"
              />
            </div>
          )}
          
          {isReadonly && category && (
            <div className="form-row">
              <div className="form-group">
                <label>Created</label>
                <input
                  type="text"
                  value={new Date(category.createdAt).toLocaleDateString()}
                  disabled
                  className="info-field"
                />
              </div>
              <div className="form-group">
                <label>Last Updated</label>
                <input
                  type="text"
                  value={new Date(category.updatedAt).toLocaleDateString()}
                  disabled
                  className="info-field"
                />
              </div>
            </div>
          )}
          {!isReadonly && (
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : mode === 'create'
                  ? 'Create Category'
                  : 'Update Category'}
              </button>
            </div>
          )}
          {isReadonly && (
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
