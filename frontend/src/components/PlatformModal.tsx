import React, { type FC, useState, useEffect } from 'react';
import { type Platform, type PlatformFormData } from '../types/platform';
import './PlatformModal.css';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatformFormData) => void;
  title: string;
  initialData?: Platform;
  error?: string | null;
}

const PlatformModal: FC<PlatformModalProps> = (props) => {
  const getInitialFormData = (): PlatformFormData => ({
    title: '',
    company: '',
    acquisitionYear: new Date().getFullYear(),
    imageUrl: '',
  });

  const [formData, setFormData] =
    useState<PlatformFormData>(getInitialFormData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState({
    title: false,
    company: false,
    acquisitionYear: false,  });

  useEffect(() => {
    if (props.isOpen) {
      if (props.initialData) {
        setFormData({
          title: props.initialData.title,
          company: props.initialData.company,
          acquisitionYear: props.initialData.acquisitionYear,
          imageUrl: props.initialData.imageUrl || '',
        });
      } else {
        setFormData(getInitialFormData());
      }

      setTouched({
        title: false,
        company: false,
        acquisitionYear: false,
      });
      setValidationErrors([]);
    }
  }, [props.isOpen, props.initialData]);
  useEffect(() => {
    if (!props.isOpen) {
      setTimeout(() => {
        setFormData(getInitialFormData());
        setTouched({
          title: false,
          company: false,
          acquisitionYear: false,
        });
        setValidationErrors([]);
      }, 200);
    }
  }, [props.isOpen]);

  if (!props.isOpen) return null;

  const markAsTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (formData.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters');
    }

    if (formData.company.trim().length < 2) {
      errors.push('Company must be at least 2 characters');
    }

    const year = formData.acquisitionYear;
    const currentYear = new Date().getFullYear();
    if (year < 1950 || year > currentYear + 2) {
      errors.push(`Year must be between 1950 and ${currentYear + 2}`);
    }

    setValidationErrors(errors);

    if (errors.length === 0) {
      props.onSubmit(formData);
      // Não resetar aqui - deixar o useEffect com props.isOpen fazer isso
    } else {
            setTouched({
        title: true,
        company: true,
        acquisitionYear: true,
      });
    }
  };

  const handleClose = () => {
    setFormData(getInitialFormData());
    setTouched({
      title: false,
      company: false,
      acquisitionYear: false,
    });
    setValidationErrors([]);
    props.onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{props.title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="close-btn"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {(validationErrors.length > 0 || props.error) && (
            <div className="form-errors">
              {props.error && <p className="error-message">{props.error}</p>}
              {validationErrors.map((error, index) => (
                <p key={index} className="error-message">
                  {error}
                </p>
              ))}
            </div>
          )}

          <div className="validation-rules">
            <p>Please note the following requirements:</p>
            <ul>
              <li>Title and company must be at least 2 characters</li>
              <li>Acquisition year must be between 1950 and 2027</li>
              <li>Image URL is optional but must be a valid URL if provided</li>
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Title<span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              onBlur={() => markAsTouched('title')}
              className={
                touched.title && formData.title.trim().length < 2
                  ? 'invalid'
                  : ''
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              Company<span className="required">*</span>
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
              onBlur={() => markAsTouched('company')}
              className={
                touched.company && formData.company.trim().length < 2
                  ? 'invalid'
                  : ''
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">
              Acquisition Year<span className="required">*</span>
            </label>
            <input
              id="year"
              type="number"
              min="1950"
              max="2027"
              value={formData.acquisitionYear}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  acquisitionYear:
                    parseInt(e.target.value) || new Date().getFullYear(),
                }))
              }
              onBlur={() => markAsTouched('acquisitionYear')}
              className={
                touched.acquisitionYear &&
                (formData.acquisitionYear < 1950 ||
                  formData.acquisitionYear > 2027)
                  ? 'invalid'
                  : ''
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={validationErrors.length > 0}
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
