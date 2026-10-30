import { Icon } from './Icons.jsx'

export default function FileViewer({ open, src, name, onClose }) {
  if (!open || !src) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{name || 'Attachment Preview'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="modal-body">
          <img src={src} alt={name || 'Attachment'} />
        </div>

        <div className="modal-foot">
          <a className="btn secondary sm" href={src} target="_blank" rel="noopener noreferrer">
            <Icon name="eye" size={15} />
            <span>Open in new tab</span>
          </a>
          <button type="button" className="btn primary sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
