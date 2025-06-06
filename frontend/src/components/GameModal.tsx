import React, { useState, useEffect } from 'react';
import type { Game, GameFormData } from '../services/gameService';
import { GameStatus } from '../services/gameService';
import type { Category } from '../services/categoryService';
import { categoryAPI } from '../services/categoryService';
import { getAllPlatforms } from '../services/api';
import './GameModal.css';
import { IoClose } from 'react-icons/io5';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GameFormData) => void;
  mode: 'create' | 'edit' | 'view';
  game?: Game | null;
  loading?: boolean;
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

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  game,
  loading = false,
}) => {
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    imageUrl: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    finishDate: '',
    status: GameStatus.PLAYING,
    categoryId: 0,
    platformId: null,
    isFavorite: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, platformsResponse] = await Promise.all([
          categoryAPI.getAllCategories(),
          getAllPlatforms(),
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
        if (platformsResponse.success) {
          setPlatforms(platformsResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (game && mode !== 'create') {
      
      if (game.title) {
        setFormData({
          title: game.title,
          description: game.description || '',
          imageUrl: game.imageUrl || '',
          acquisitionDate: game.acquisitionDate.split('T')[0],
          finishDate: game.finishDate ? game.finishDate.split('T')[0] : '',
          status: game.status,
          categoryId: game.category.id,
          platformId: game.platform?.id || null,
          isFavorite: game.isFavorite,
        });
      }
     
      else if (game.isFavorite !== undefined) {
        setFormData((current) => ({
          ...current,
          isFavorite: game.isFavorite,
        }));
      }
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        acquisitionDate: new Date().toISOString().split('T')[0],
        finishDate: '',
        status: GameStatus.PLAYING,
        categoryId: 0,
        platformId: null,
        isFavorite: game?.isFavorite || false, 
      });
    }
    setErrors({});
  }, [game, mode]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.acquisitionDate) {
      newErrors.acquisitionDate = 'Acquisition date is required';
    } else if (formData.acquisitionDate > todayStr) {
      newErrors.acquisitionDate = 'Acquisition date cannot be in the future';
    }

    if (
      (formData.status === GameStatus.DONE ||
        formData.status === GameStatus.ABANDONED) &&
      !formData.finishDate
    ) {
      newErrors.finishDate =
        'Finish date is required for Done or Abandoned status';
    }

    if (formData.finishDate && formData.acquisitionDate) {
      const acquisitionDate = new Date(formData.acquisitionDate);
      const finishDate = new Date(formData.finishDate);

      if (finishDate < acquisitionDate) {
        newErrors.finishDate =
          'Finish date cannot be earlier than acquisition date';
      }
      if (formData.finishDate > todayStr) {
        newErrors.finishDate = 'Finish date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'view') return;

    if (validateForm()) {
      const submitData: GameFormData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        finishDate:
          formData.status === GameStatus.PLAYING
            ? undefined
            : formData.finishDate || undefined,
      };
      onSubmit(submitData);
    }
  };

  const handleChange = (
    field: keyof GameFormData,
    value: string | number | boolean | null,
  ) => {
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

    
    if (field === 'status' && value === GameStatus.PLAYING) {
      setFormData((prev) => ({
        ...prev,
        status: value,
        finishDate: '',
      }));
    }
  };

  if (!isOpen) return null;

  const isReadonly = mode === 'view';
  const title =
    mode === 'create'
      ? 'Add New Game'
      : mode === 'edit'
      ? 'Edit Game'
      : 'Game Details';

  return (
    <div className="modal-overlay">
      <div className="modal-content game-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose} type="button">
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={errors.title ? 'error' : ''}
                disabled={isReadonly}
                placeholder="Enter game title"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as GameStatus)
                }
                disabled={isReadonly}
              >
                <option value={GameStatus.PLAYING}>Playing</option>
                <option value={GameStatus.DONE}>Done</option>
                <option value={GameStatus.ABANDONED}>Abandoned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isReadonly}
              placeholder="Enter game description"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  handleChange('categoryId', parseInt(e.target.value, 10))
                }
                className={errors.categoryId ? 'error' : ''}
                disabled={isReadonly}
              >
                <option value={0}>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="error-message">{errors.categoryId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="platformId">Platform</label>
              <select
                id="platformId"
                value={formData.platformId || ''}
                onChange={(e) =>
                  handleChange(
                    'platformId',
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                disabled={isReadonly}
              >
                <option value="">Select a platform (optional)</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              disabled={isReadonly}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="acquisitionDate">Acquisition Date *</label>
              <input
                id="acquisitionDate"
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) =>
                  handleChange('acquisitionDate', e.target.value)
                }
                className={errors.acquisitionDate ? 'error' : ''}
                disabled={isReadonly}
              />
              {errors.acquisitionDate && (
                <span className="error-message">{errors.acquisitionDate}</span>
              )}
            </div>

            {formData.status !== GameStatus.PLAYING && (
              <div className="form-group">
                <label htmlFor="finishDate">
                  Finish Date{' '}
                  {formData.status === GameStatus.DONE ||
                  formData.status === GameStatus.ABANDONED
                    ? '*'
                    : ''}
                </label>
                <input
                  id="finishDate"
                  type="date"
                  value={formData.finishDate}
                  onChange={(e) => handleChange('finishDate', e.target.value)}
                  className={errors.finishDate ? 'error' : ''}
                  disabled={isReadonly}
                />
                {errors.finishDate && (
                  <span className="error-message">{errors.finishDate}</span>
                )}
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => handleChange('isFavorite', e.target.checked)}
                disabled={isReadonly}
              />
              Mark as favorite
            </label>
          </div>

          {!isReadonly && (
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : mode === 'create'
                  ? 'Create Game'
                  : 'Update Game'}
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

export default GameModal;
