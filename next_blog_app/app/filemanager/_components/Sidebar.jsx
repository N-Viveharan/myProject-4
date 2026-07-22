'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFileManager } from '../_context/FileManagerContext';

function NavItem({ href, icon, label, badge, onClick }) {
  const pathname = usePathname();
  const isActive = href ? pathname === href || pathname.startsWith(href + '/') : false;

  const content = (
    <>
      <span className="fm-nav-item-icon">{icon}</span>
      {label}
      {badge !== undefined && <span className="fm-nav-badge">{badge}</span>}
    </>
  );

  if (onClick) {
    return (
      <button className={`fm-nav-item${isActive ? ' active' : ''}`} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={`fm-nav-item${isActive ? ' active' : ''}`}>
      {content}
    </Link>
  );
}

export default function Sidebar() {
  const { user, folders, totalFiles, logout, loading } = useFileManager();

  // Don't render while bootstrapping auth
  if (loading || !user) return null;

  const storagePercent = Math.min(100, Math.round((user.storageUsed / user.storageTotal) * 100));
  const initials = user.initials ||
    user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <aside className="fm-sidebar">
      {/* Logo */}
      <div className="fm-sidebar-logo">
        <div className="fm-sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="white" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        <span className="fm-sidebar-logo-text">Stitch<span>Cloud</span></span>
      </div>

      {/* Navigation */}
      <nav className="fm-sidebar-nav">
        <span className="fm-sidebar-section-label">Main</span>

        <NavItem href="/filemanager/dashboard" label="Dashboard" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        }/>

        <NavItem href="/filemanager/folders" label="My Folders" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        } badge={folders.length}/>

        <NavItem href="/filemanager/upload" label="Upload Files" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        }/>

        <NavItem href="/filemanager/download" label="Downloads" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
          </svg>
        }/>

        <span className="fm-sidebar-section-label">Manage</span>

        <NavItem href="/filemanager/manage" label="Folder Manager" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        }/>

        <NavItem href="/filemanager/profile" label="Profile" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        }/>

        <span className="fm-sidebar-section-label">Quick Access</span>

        <NavItem href="/filemanager/folders/create" label="New Folder" icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        }/>
      </nav>

      {/* Footer */}
      <div className="fm-sidebar-footer">
        <div className="fm-storage-block">
          <div className="fm-storage-label">
            <span>Storage</span>
            <span>{user.storageUsed} GB / {user.storageTotal} GB</span>
          </div>
          <div className="fm-storage-bar">
            <div className="fm-storage-fill" style={{ width: `${storagePercent}%` }}/>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {100 - user.storageUsed} GB available
          </div>
        </div>

        <div className="fm-sidebar-user">
          <div className="fm-sidebar-avatar">{initials}</div>
          <div className="fm-sidebar-user-info">
            <div className="fm-sidebar-user-name">{user.name}</div>
            <div className="fm-sidebar-user-email">{user.role}</div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px', marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
