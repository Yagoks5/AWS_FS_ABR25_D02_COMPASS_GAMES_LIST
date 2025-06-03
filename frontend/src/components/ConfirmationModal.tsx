import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal-content">
        <div className="confirmation-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 5.33334L59.3333 53.3333H4.66667L32 5.33334Z" fill="#FF4B55" />
            <path d="M32 40V24" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <circle cx="32" cy="48" r="3" fill="white" />
          </svg>
        </div>
        <h2 className="confirmation-title">Are you sure?</h2>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button onClick={onClose} className="cancel-btn">No, cancel action</button>
          <button onClick={onConfirm} className="delete-btn">Yes, delete this</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;