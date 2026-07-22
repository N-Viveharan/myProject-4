'use client';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = '' }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fm-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`fm-modal ${size === 'lg' ? 'fm-modal-lg' : ''}`} role="dialog" aria-modal="true">
        <div className="fm-modal-header">
          <h2 className="fm-modal-title">{title}</h2>
          <button className="fm-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
