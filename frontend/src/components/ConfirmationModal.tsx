import React from 'react';
import './ConfirmationModal.css';
import { TbAlertTriangleFilled } from "react-icons/tb";

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
          <TbAlertTriangleFilled />
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