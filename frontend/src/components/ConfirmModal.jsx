import React from 'react';

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  destructive = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <h2 id="confirm-modal-title">{title}</h2>
          <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close confirm dialog">
            ×
          </button>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn-primary ${destructive ? 'btn-destructive' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
