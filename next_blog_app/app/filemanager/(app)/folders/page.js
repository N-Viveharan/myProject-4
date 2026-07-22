'use client';
import { useState } from 'react';
import Link from 'next/link';
import TopBar from '../../_components/TopBar';
import FolderCard from '../../_components/FolderCard';
import Modal from '../../_components/Modal';
import { useFileManager } from '../../_context/FileManagerContext';

export default function FoldersPage() {
  const { folders, deleteFolder, renameFolder, toggleStarFolder } = useFileManager();

  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('updatedAt');
  const [filter, setFilter]       = useState('all');
  const [view, setView]           = useState('grid'); // 'grid' | 'list'
  const [renameModal, setRenameModal] = useState(null); // folder object
  const [deleteCfm, setDeleteCfm] = useState(null); // folderId
  const [newName, setNewName]     = useState('');

  // Filter + search + sort
  const displayed = folders
    .filter(f => {
      if (filter === 'starred') return f.starred;
      if (filter === 'private') return f.isPrivate;
      return true;
    })
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name')      return a.name.localeCompare(b.name);
      if (sort === 'files')     return b.files.length - a.files.length;
      if (sort === 'updatedAt') return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  function handleRename() {
    if (!newName.trim() || !renameModal) return;
    renameFolder(renameModal.id, newName.trim());
    setRenameModal(null);
    setNewName('');
  }

  function handleDelete() {
    if (!deleteCfm) return;
    deleteFolder(deleteCfm);
    setDeleteCfm(null);
  }

  return (
    <>
      <TopBar title="My Folders" subtitle={`${folders.length} folders`}/>
      <div className="fm-content fm-animate-in">
        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">My Folders</h1>
            <p className="fm-page-subtitle">Browse and manage all your folders</p>
          </div>
          <Link href="/filemanager/folders/create" className="fm-btn fm-btn-primary" style={{ textDecoration: 'none' }} id="btn-create-folder">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Folder
          </Link>
        </div>

        {/* Toolbar */}
        <div className="fm-toolbar">
          {/* Search */}
          <div className="fm-toolbar-search">
            <svg className="fm-toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="folder-search" type="text" placeholder="Search folders..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'All'], ['starred', '⭐ Starred'], ['private', '🔒 Private']].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)}
                className="fm-btn fm-btn-sm"
                id={`filter-${val}`}
                style={{ background: filter === val ? 'var(--fm-primary)' : 'var(--fm-white)', color: filter === val ? '#fff' : 'var(--fm-text-secondary)', border: '1.5px solid', borderColor: filter === val ? 'var(--fm-primary)' : 'var(--fm-border)', boxShadow: 'none' }}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select className="fm-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }} value={sort} onChange={e => setSort(e.target.value)} id="folder-sort">
            <option value="updatedAt">Recently Updated</option>
            <option value="name">Name A–Z</option>
            <option value="files">Most Files</option>
          </select>

          {/* View Toggle */}
          <div className="fm-view-toggle">
            <button className={`fm-view-toggle-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} id="view-grid" title="Grid view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button className={`fm-view-toggle-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} id="view-list" title="List view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 12.5, color: 'var(--fm-text-muted)', marginBottom: 16 }}>
          Showing {displayed.length} of {folders.length} folders
        </div>

        {/* Grid / List view */}
        {displayed.length === 0 ? (
          <div className="fm-empty">
            <div className="fm-empty-icon">📭</div>
            <div className="fm-empty-title">No folders found</div>
            <div className="fm-empty-sub">Try adjusting your search or create a new folder.</div>
            <Link href="/filemanager/folders/create" className="fm-btn fm-btn-primary" style={{ textDecoration: 'none' }}>+ Create Folder</Link>
          </div>
        ) : view === 'grid' ? (
          <div className="fm-folder-grid">
            {displayed.map(f => (
              <FolderCard
                key={f.id}
                folder={f}
                onRename={folder => { setRenameModal(folder); setNewName(folder.name); }}
                onDelete={id => setDeleteCfm(id)}
                onToggleStar={toggleStarFolder}
              />
            ))}
          </div>
        ) : (
          <div className="fm-card">
            <table className="fm-file-table">
              <thead>
                <tr><th>Folder</th><th>Files</th><th>Last Updated</th><th>Visibility</th><th></th></tr>
              </thead>
              <tbody>
                {displayed.map(f => (
                  <tr key={f.id}>
                    <td>
                      <Link href={`/filemanager/folders/${f.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.color.bg, fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--fm-text-primary)', fontSize: 14 }}>{f.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--fm-text-muted)' }}>{f.description}</div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ color: 'var(--fm-text-secondary)' }}>{f.files.length}</td>
                    <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{f.updatedAt}</td>
                    <td>
                      <span className={`fm-badge ${f.isPrivate ? 'fm-badge-gray' : 'fm-badge-success'}`}>{f.isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="fm-btn fm-btn-ghost fm-btn-sm" onClick={() => { setRenameModal(f); setNewName(f.name); }}>Rename</button>
                        <button className="fm-btn fm-btn-ghost fm-btn-sm" style={{ color: 'var(--fm-danger)' }} onClick={() => setDeleteCfm(f.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <Modal isOpen={!!renameModal} onClose={() => setRenameModal(null)} title="Rename Folder">
        <div className="fm-form-group">
          <label className="fm-label">Folder name</label>
          <input className="fm-input" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} autoFocus id="rename-input"/>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setRenameModal(null)}>Cancel</button>
          <button className="fm-btn fm-btn-primary" onClick={handleRename} id="btn-rename-confirm">Save</button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteCfm} onClose={() => setDeleteCfm(null)} title="Delete Folder">
        <p style={{ fontSize: 14, color: 'var(--fm-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure? This will permanently delete the folder and <strong>all its files</strong>. This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setDeleteCfm(null)}>Cancel</button>
          <button className="fm-btn fm-btn-danger" onClick={handleDelete} id="btn-delete-confirm">Yes, Delete</button>
        </div>
      </Modal>
    </>
  );
}
