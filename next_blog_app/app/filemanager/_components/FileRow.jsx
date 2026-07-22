'use client';
import { useState } from 'react';
import { getFileType, formatSize, formatDate } from '../_context/FileManagerContext';

export default function FileRow({ file, onDelete, onRename, onDownload }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const type = getFileType(file.name);

  return (
    <tr>
      <td>
        <div className="fm-file-icon-cell">
          <div className="fm-file-type-icon" style={{ background: type.bg, color: type.color }}>
            {type.emoji}
          </div>
          <div>
            <div className="fm-file-name">{file.name}</div>
            <div className="fm-file-ext">.{file.name.split('.').pop().toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{formatSize(file.size)}</td>
      <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{formatDate(file.uploadedAt)}</td>
      <td>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="fm-btn fm-btn-ghost fm-btn-sm fm-btn-icon-only"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
            id={`file-menu-${file.id}`}
            style={{ color: 'var(--fm-text-muted)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="fm-dropdown" style={{ right: 0, top: '100%' }} onClick={e => e.stopPropagation()}>
              <button className="fm-dropdown-item" onClick={() => { onDownload?.(file); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
                Download
              </button>
              <button className="fm-dropdown-item" onClick={() => { onRename?.(file); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Rename
              </button>
              <div className="fm-dropdown-divider"/>
              <button className="fm-dropdown-item danger" onClick={() => { onDelete?.(file.id); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
