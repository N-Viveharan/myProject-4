'use client';
import { useState } from 'react';
import Link from 'next/link';
import TopBar from '../../_components/TopBar';
import Modal from '../../_components/Modal';
import { useFileManager, formatSize, formatDate } from '../../_context/FileManagerContext';

export default function ManagePage() {
  const { folders, deleteFolder, renameFolder, toggleStarFolder } = useFileManager();

  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('name');
  const [selected, setSelected]       = useState(new Set());
  const [renameModal, setRenameModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); // 'bulk' | folderId
  const [newName, setNewName]         = useState('');
  const [inlineEdit, setInlineEdit]   = useState(null); // folderId being inline-edited
  const [inlineVal, setInlineVal]     = useState('');

  const displayed = folders
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name')    return a.name.localeCompare(b.name);
      if (sort === 'size')    return b.files.reduce((acc, f) => acc + f.size, 0) - a.files.reduce((acc, f) => acc + f.size, 0);
      if (sort === 'files')   return b.files.length - a.files.length;
      if (sort === 'date')    return new Date(b.updatedAt) - new Date(a.updatedAt);
      return 0;
    });

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === displayed.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayed.map(f => f.id)));
    }
  }

  function handleBulkDelete() {
    selected.forEach(id => deleteFolder(id));
    setSelected(new Set());
    setDeleteModal(null);
  }

  function handleRename() {
    if (!renameModal || !newName.trim()) return;
    renameFolder(renameModal.id, newName.trim());
    setRenameModal(null);
    setNewName('');
  }

  function handleInlineSave(id) {
    if (inlineVal.trim()) renameFolder(id, inlineVal.trim());
    setInlineEdit(null);
    setInlineVal('');
  }

  return (
    <>
      <TopBar title="Folder Manager"/>
      <div className="fm-content fm-animate-in">
        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">Folder Management</h1>
            <p className="fm-page-subtitle">Rename, delete, search, and organize all your folders</p>
          </div>
          <Link href="/filemanager/folders/create" className="fm-btn fm-btn-primary" style={{ textDecoration: 'none' }}>
            + New Folder
          </Link>
        </div>

        {/* Toolbar */}
        <div className="fm-toolbar">
          <div className="fm-toolbar-search">
            <svg className="fm-toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="manage-search" type="text" placeholder="Search folders..." value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          <select className="fm-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }} value={sort} onChange={e => setSort(e.target.value)} id="manage-sort">
            <option value="name">Name A–Z</option>
            <option value="date">Recently Updated</option>
            <option value="files">Most Files</option>
            <option value="size">Largest Size</option>
          </select>

          {selected.size > 0 && (
            <>
              <span style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginLeft: 4 }}>{selected.size} selected</span>
              <button className="fm-btn fm-btn-danger fm-btn-sm" onClick={() => setDeleteModal('bulk')} id="btn-bulk-delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete {selected.size}
              </button>
              <button className="fm-btn fm-btn-ghost fm-btn-sm" onClick={() => setSelected(new Set())}>
                Clear
              </button>
            </>
          )}
        </div>

        {/* Table */}
        <div className="fm-card">
          <table className="fm-file-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" className="fm-checkbox" checked={selected.size === displayed.length && displayed.length > 0} onChange={toggleAll} id="select-all"/>
                </th>
                <th>Folder</th>
                <th>Files</th>
                <th>Total Size</th>
                <th>Last Updated</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(folder => {
                const totalSize = folder.files.reduce((acc, f) => acc + f.size, 0);
                const isEditing = inlineEdit === folder.id;
                return (
                  <tr key={folder.id} style={{ background: selected.has(folder.id) ? 'var(--fm-primary-ghost)' : undefined }}>
                    <td>
                      <input type="checkbox" className="fm-checkbox" checked={selected.has(folder.id)} onChange={() => toggleSelect(folder.id)} id={`select-${folder.id}`}/>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 11, background: folder.color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {folder.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {isEditing ? (
                            <input
                              className="fm-input"
                              style={{ padding: '5px 10px', fontSize: 13 }}
                              value={inlineVal}
                              autoFocus
                              onChange={e => setInlineVal(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleInlineSave(folder.id); if (e.key === 'Escape') setInlineEdit(null); }}
                              onBlur={() => handleInlineSave(folder.id)}
                              id={`inline-rename-${folder.id}`}
                            />
                          ) : (
                            <Link href={`/filemanager/folders/${folder.id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text-primary)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {folder.name}
                            </Link>
                          )}
                          {folder.description && (
                            <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {folder.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{folder.files.length}</td>
                    <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{formatSize(totalSize)}</td>
                    <td style={{ color: 'var(--fm-text-secondary)', fontSize: 13 }}>{formatDate(folder.updatedAt)}</td>
                    <td>
                      <span className={`fm-badge ${folder.isPrivate ? 'fm-badge-gray' : 'fm-badge-success'}`} style={{ fontSize: 11 }}>
                        {folder.isPrivate ? '🔒 Private' : '🌐 Public'}
                      </span>
                      {folder.starred && <span className="fm-badge fm-badge-warning" style={{ fontSize: 11, marginLeft: 4 }}>⭐</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button
                          className="fm-btn fm-btn-ghost fm-btn-sm"
                          onClick={() => { setInlineEdit(folder.id); setInlineVal(folder.name); }}
                          title="Inline rename"
                          id={`btn-inline-rename-${folder.id}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          className="fm-btn fm-btn-ghost fm-btn-sm"
                          onClick={() => toggleStarFolder(folder.id)}
                          title={folder.starred ? 'Unstar' : 'Star'}
                          id={`btn-star-${folder.id}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill={folder.starred ? '#F59E0B' : 'none'} stroke={folder.starred ? '#F59E0B' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </button>
                        <Link href={`/filemanager/folders/${folder.id}`} className="fm-btn fm-btn-ghost fm-btn-sm" style={{ textDecoration: 'none', color: 'var(--fm-primary)' }}>
                          Open
                        </Link>
                        <button
                          className="fm-btn fm-btn-ghost fm-btn-sm"
                          style={{ color: 'var(--fm-danger)' }}
                          onClick={() => setDeleteModal(folder.id)}
                          id={`btn-delete-${folder.id}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {displayed.length === 0 && (
            <div className="fm-empty">
              <div className="fm-empty-icon">🔍</div>
              <div className="fm-empty-title">No folders found</div>
              <div className="fm-empty-sub">Try a different search term.</div>
            </div>
          )}
        </div>

        {/* Summary Bar */}
        <div style={{ display: 'flex', gap: 24, marginTop: 16, padding: '14px 20px', background: 'var(--fm-white)', borderRadius: 12, border: '1px solid var(--fm-border)', fontSize: 13, color: 'var(--fm-text-secondary)' }}>
          <span><strong style={{ color: 'var(--fm-text-primary)' }}>{folders.length}</strong> total folders</span>
          <span>·</span>
          <span><strong style={{ color: 'var(--fm-text-primary)' }}>{folders.reduce((a, f) => a + f.files.length, 0)}</strong> total files</span>
          <span>·</span>
          <span><strong style={{ color: 'var(--fm-text-primary)' }}>{formatSize(folders.reduce((a, f) => a + f.files.reduce((b, fi) => b + fi.size, 0), 0))}</strong> storage used</span>
          <span>·</span>
          <span><strong style={{ color: 'var(--fm-warning)' }}>{folders.filter(f => f.starred).length}</strong> starred</span>
        </div>
      </div>

      {/* Rename Modal */}
      <Modal isOpen={!!renameModal} onClose={() => setRenameModal(null)} title="Rename Folder">
        <div className="fm-form-group">
          <label className="fm-label">New folder name</label>
          <input className="fm-input" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()} autoFocus id="manage-rename-input"/>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setRenameModal(null)}>Cancel</button>
          <button className="fm-btn fm-btn-primary" onClick={handleRename} id="btn-manage-rename-confirm">Save</button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title={deleteModal === 'bulk' ? `Delete ${selected.size} Folders` : 'Delete Folder'}>
        <p style={{ fontSize: 14, color: 'var(--fm-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          {deleteModal === 'bulk'
            ? `You are about to permanently delete ${selected.size} folder(s) and all their files. This cannot be undone.`
            : 'Are you sure you want to permanently delete this folder and all its files?'}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button className="fm-btn fm-btn-danger" id="btn-manage-delete-confirm" onClick={() => {
            if (deleteModal === 'bulk') {
              handleBulkDelete();
            } else {
              deleteFolder(deleteModal);
              setDeleteModal(null);
            }
          }}>
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
