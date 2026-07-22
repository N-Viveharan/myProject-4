'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFileManager } from '../_context/FileManagerContext';

export default function TopBar({ title, subtitle }) {
  const { user } = useFileManager();
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fm-topbar">
      {/* Page Title */}
      <div>
        {title && <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--fm-text-primary)', letterSpacing: '-0.3px' }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--fm-text-secondary)', marginTop: 1 }}>{subtitle}</div>}
      </div>

      {/* Search */}
      <div className="fm-topbar-search" style={{ marginLeft: 24 }}>
        <svg className="fm-topbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search files, folders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="topbar-search"
        />
      </div>

      {/* Actions */}
      <div className="fm-topbar-actions">
        {/* Upload Quick Button */}
        <Link href="/filemanager/upload" className="fm-btn fm-btn-primary fm-btn-sm" style={{ textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          Upload
        </Link>

        {/* Notification Bell */}
        <button className="fm-topbar-icon-btn" id="topbar-notifications" aria-label="Notifications">
          <div className="fm-notif-dot"/>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Settings */}
        <Link href="/filemanager/profile" className="fm-topbar-icon-btn" style={{ textDecoration: 'none' }} id="topbar-settings">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        </Link>

        {/* User Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            className="fm-topbar-avatar"
            onClick={() => setShowUserMenu(v => !v)}
            id="topbar-avatar"
            role="button"
            tabIndex={0}
          >
            {user.initials}
          </div>
          {showUserMenu && (
            <div className="fm-dropdown" style={{ right: 0, top: 'calc(100% + 8px)' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--fm-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginTop: 2 }}>{user.email}</div>
              </div>
              <Link href="/filemanager/profile" className="fm-dropdown-item" onClick={() => setShowUserMenu(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </Link>
              <Link href="/filemanager/folders/create" className="fm-dropdown-item" onClick={() => setShowUserMenu(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                New Folder
              </Link>
              <div className="fm-dropdown-divider"/>
              <Link href="/filemanager/login" className="fm-dropdown-item danger" onClick={() => setShowUserMenu(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
