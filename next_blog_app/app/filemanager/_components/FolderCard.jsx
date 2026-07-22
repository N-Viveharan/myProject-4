'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatDate, formatSize } from '../_context/FileManagerContext';

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
    </svg>
  );
}

export default function FolderCard({ folder, onRename, onDelete, onToggleStar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileCount = folder.files.length;
  const totalSize = folder.files.reduce((a, f) => a + f.size, 0);

  return (
    <div
      className="fm-folder-card"
      style={{ '--folder-color': folder.color.hex, '--folder-bg': folder.color.bg }}
    >
      <div className="fm-folder-card-top">
        <div className="fm-folder-icon">{folder.icon}</div>
        <div className="fm-relative">
          <button
            className="fm-folder-menu-btn"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
            id={`folder-menu-${folder.id}`}
          >
            <ThreeDotsIcon/>
          </button>
          {menuOpen && (
            <div className="fm-dropdown" onClick={e => e.stopPropagation()}>
              <Link href={`/filemanager/folders/${folder.id}`} className="fm-dropdown-item" onClick={() => setMenuOpen(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Open
              </Link>
              <button className="fm-dropdown-item" onClick={() => { onToggleStar?.(folder.id); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={folder.starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {folder.starred ? 'Unstar' : 'Star'}
              </button>
              <button className="fm-dropdown-item" onClick={() => { onRename?.(folder); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Rename
              </button>
              <Link href={`/filemanager/download?folder=${folder.id}`} className="fm-dropdown-item" onClick={() => setMenuOpen(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
                Download ZIP
              </Link>
              <div className="fm-dropdown-divider"/>
              <button className="fm-dropdown-item danger" onClick={() => { onDelete?.(folder.id); setMenuOpen(false); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Link href={`/filemanager/folders/${folder.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="fm-folder-name">{folder.name}</div>
        <div className="fm-folder-meta">
          <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
          <span className="fm-folder-meta-dot"/>
          <span>{formatSize(totalSize)}</span>
          <span className="fm-folder-meta-dot"/>
          <span>{formatDate(folder.updatedAt)}</span>
        </div>
        {folder.starred && (
          <div style={{ marginTop: 10 }}>
            <span className="fm-badge fm-badge-warning" style={{ fontSize: 10.5 }}>
              ⭐ Starred
            </span>
          </div>
        )}
        {folder.isPrivate && (
          <div style={{ marginTop: folder.starred ? 4 : 10 }}>
            <span className="fm-badge fm-badge-gray" style={{ fontSize: 10.5 }}>
              🔒 Private
            </span>
          </div>
        )}
      </Link>
    </div>
  );
}
