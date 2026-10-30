import { Icon } from './Icons.jsx'

export default function FileViewer({ open, src, name, onClose }) {
  if (!open || !src) return null

  return (
    <div className="pa-modal-bg" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pa-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pa-modal-head">
          <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            {name || 'Attachment Preview'}
          </strong>
          <button
            type="button"
            className="pa-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="pa-modal-body">
          <img src={src} alt={name || 'Attachment'} />
        </div>

        <div className="pa-modal-foot">
          <a
            className="btn secondary sm"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="eye" size={15} />
            <span>Open in tab</span>
          </a>
          <button type="button" className="btn primary sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
