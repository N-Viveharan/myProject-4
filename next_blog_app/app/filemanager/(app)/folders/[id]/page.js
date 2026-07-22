'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '../../../_components/TopBar';
import FileRow from '../../../_components/FileRow';
import Modal from '../../../_components/Modal';
import UploadZone from '../../../_components/UploadZone';
import { useFileManager, formatSize, formatDate, getFileType } from '../../../_context/FileManagerContext';

export default function FolderDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { getFolderById, uploadFiles, deleteFile, renameFile, deleteFolder } = useFileManager();

  const folder = getFolderById(id);

  const [view, setView]             = useState('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [renameFile_, setRenameFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [deleteCfm, setDeleteCfm]   = useState(null); // 'folder' or fileId
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('date');

  if (!folder) {
    return (
      <>
        <TopBar title="Folder Not Found"/>
        <div className="fm-content">
          <div className="fm-empty">
            <div className="fm-empty-icon">🔍</div>
            <div className="fm-empty-title">Folder not found</div>
            <div className="fm-empty-sub">This folder may have been deleted or moved.</div>
            <Link href="/filemanager/folders" className="fm-btn fm-btn-primary" style={{ textDecoration: 'none' }}>← Back to Folders</Link>
          </div>
        </div>
      </>
    );
  }

  const filteredFiles = folder.files
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'size') return b.size - a.size;
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });

  const totalSize = folder.files.reduce((acc, f) => acc + f.size, 0);

  function handleUpload(files) {
    uploadFiles(folder.id, files);
    setShowUpload(false);
  }

  function handleRenameFile() {
    if (!renameFile_ || !newFileName.trim()) return;
    renameFile(folder.id, renameFile_.id, newFileName.trim());
    setRenameFile(null);
    setNewFileName('');
  }

  function handleDeleteFile(fileId) {
    deleteFile(folder.id, fileId);
  }

  function handleDeleteFolder() {
    deleteFolder(folder.id);
    router.push('/filemanager/folders');
  }

  return (
    <>
      <TopBar title={folder.name}/>
      <div className="fm-content fm-animate-in">
        {/* Breadcrumb */}
        <div className="fm-breadcrumb" style={{ marginBottom: 16 }}>
          <Link href="/filemanager/folders">My Folders</Link>
          <span className="fm-breadcrumb-sep">›</span>
          <span>{folder.name}</span>
        </div>

        {/* Folder Header */}
        <div className="fm-card fm-card-pad" style={{ marginBottom: 24, background: `linear-gradient(135deg, ${folder.color.hex}08, ${folder.color.hex}18)`, borderColor: `${folder.color.hex}25` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: folder.color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, border: `2px solid ${folder.color.hex}25`, flexShrink: 0 }}>
                {folder.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--fm-text-primary)', letterSpacing: '-0.4px' }}>{folder.name}</h1>
                  {folder.starred && <span className="fm-badge fm-badge-warning">⭐ Starred</span>}
                  {folder.isPrivate && <span className="fm-badge fm-badge-gray">🔒 Private</span>}
                </div>
                {folder.description && (
                  <p style={{ fontSize: 14, color: 'var(--fm-text-secondary)', marginBottom: 12 }}>{folder.description}</p>
                )}
                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--fm-text-secondary)' }}>
                  <span><strong style={{ color: 'var(--fm-text-primary)' }}>{folder.files.length}</strong> files</span>
                  <span><strong style={{ color: 'var(--fm-text-primary)' }}>{formatSize(totalSize)}</strong> total</span>
                  <span>Created {formatDate(folder.createdAt)}</span>
                  <span>Updated {formatDate(folder.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="fm-btn fm-btn-primary" onClick={() => setShowUpload(true)} id="btn-upload-to-folder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                Upload
              </button>
              <Link href={`/filemanager/download?folder=${folder.id}`} className="fm-btn fm-btn-secondary" style={{ textDecoration: 'none' }} id="btn-download-folder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
                Download ZIP
              </Link>
              <button className="fm-btn fm-btn-ghost" style={{ color: 'var(--fm-danger)' }} onClick={() => setDeleteCfm('folder')} id="btn-delete-folder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Files Toolbar */}
        <div className="fm-toolbar" style={{ marginBottom: 18 }}>
          <div className="fm-toolbar-search">
            <svg className="fm-toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} id="files-search"/>
          </div>
          <select className="fm-select" style={{ width: 'auto', padding: '7px 12px', fontSize: 13 }} value={sort} onChange={e => setSort(e.target.value)} id="files-sort">
            <option value="date">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="size">Largest First</option>
          </select>
          <div className="fm-view-toggle">
            <button className={`fm-view-toggle-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} title="Grid">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button className={`fm-view-toggle-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} title="List">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--fm-text-muted)' }}>{filteredFiles.length} files</div>
        </div>

        {/* Files */}
        {filteredFiles.length === 0 ? (
          <div className="fm-empty">
            <div className="fm-empty-icon">📂</div>
            <div className="fm-empty-title">{folder.files.length === 0 ? 'This folder is empty' : 'No files match your search'}</div>
            <div className="fm-empty-sub">{folder.files.length === 0 ? 'Upload your first file to get started.' : 'Try a different search term.'}</div>
            {folder.files.length === 0 && (
              <button className="fm-btn fm-btn-primary" onClick={() => setShowUpload(true)}>↑ Upload Files</button>
            )}
          </div>
        ) : view === 'list' ? (
          <div className="fm-card">
            <table className="fm-file-table">
              <thead><tr><th>File</th><th>Size</th><th>Uploaded</th><th></th></tr></thead>
              <tbody>
                {filteredFiles.map(file => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onDelete={handleDeleteFile}
                    onRename={f => { setRenameFile(f); setNewFileName(f.name); }}
                    onDownload={() => {}}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {filteredFiles.map(file => {
              const type = getFileType(file.name);
              return (
                <div key={file.id} className="fm-card" style={{ padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>
                    {type.emoji}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fm-text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)' }}>{formatSize(file.size)}</div>
                  <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', marginTop: 2 }}>{formatDate(file.uploadedAt)}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button className="fm-btn fm-btn-ghost fm-btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => { setRenameFile(file); setNewFileName(file.name); }}>Rename</button>
                    <button className="fm-btn fm-btn-ghost fm-btn-sm fm-btn-icon-only" style={{ color: 'var(--fm-danger)' }} onClick={() => handleDeleteFile(file.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title={`Upload to ${folder.name}`} size="lg">
        <UploadZone onFiles={handleUpload}/>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="fm-btn fm-btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Rename File Modal */}
      <Modal isOpen={!!renameFile_} onClose={() => setRenameFile(null)} title="Rename File">
        <div className="fm-form-group">
          <label className="fm-label">File name</label>
          <input className="fm-input" value={newFileName} onChange={e => setNewFileName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameFile()} autoFocus id="rename-file-input"/>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setRenameFile(null)}>Cancel</button>
          <button className="fm-btn fm-btn-primary" onClick={handleRenameFile} id="btn-rename-file-confirm">Save</button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteCfm} onClose={() => setDeleteCfm(null)} title={deleteCfm === 'folder' ? 'Delete Folder' : 'Delete File'}>
        <p style={{ fontSize: 14, color: 'var(--fm-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          {deleteCfm === 'folder'
            ? `Are you sure you want to delete "${folder.name}" and all its files? This cannot be undone.`
            : 'Are you sure you want to delete this file? This cannot be undone.'}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="fm-btn fm-btn-secondary" onClick={() => setDeleteCfm(null)}>Cancel</button>
          <button className="fm-btn fm-btn-danger" onClick={deleteCfm === 'folder' ? handleDeleteFolder : () => { handleDeleteFile(deleteCfm); setDeleteCfm(null); }} id="btn-delete-confirm">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
