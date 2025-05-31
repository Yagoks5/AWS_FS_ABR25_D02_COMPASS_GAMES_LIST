import React, { type FC, useState } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatformFormData) => void;
  title: string;
  initialData?: Platform;
}

const PlatformModal: FC<PlatformModalProps> = props => {
  const [formData, setFormData] = useState<PlatformFormData>({
    title: props.initialData?.title ?? '',
    owner: props.initialData?.owner ?? '',
    acquisitionYear: props.initialData?.acquisitionYear ?? '',
    imageUrl: props.initialData?.imageUrl ?? ''
  });

  if (!props.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{props.title}</h2>
          <button 
            type="button"
            onClick={props.onClose} 
            className="close-btn"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title<span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="owner">
              Owner (Company)<span className="required">*</span>
            </label>
            <input
              id="owner"
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData(prev => ({...prev, owner: e.target.value}))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">
              Acquisition Year<span className="required">*</span>
            </label>
            <input
              id="year"
              type="text"
              value={formData.acquisitionYear}
              onChange={(e) => setFormData(prev => ({...prev, acquisitionYear: e.target.value}))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">
              Image URL<span className="required">*</span>
            </label>
            <input
              id="image"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({...prev, imageUrl: e.target.value}))}
              required
            />
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={props.onClose} 
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlatformModal;