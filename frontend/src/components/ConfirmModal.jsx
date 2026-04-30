import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', isDanger = false, isLoading = false }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: isDanger ? 'rgba(244,63,94,0.12)' : 'rgba(99,102,241,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <AlertTriangle size={18} color={isDanger ? '#f43f5e' : '#818cf8'} />
            </div>
            <h2 className="modal-title" id="confirm-modal-title">{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-secondary" style={{ lineHeight: '1.7' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={isLoading} id="modal-cancel-btn">
            Cancel
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
            id="modal-confirm-btn"
          >
            {isLoading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
