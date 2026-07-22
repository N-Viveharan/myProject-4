'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../_components/TopBar';
import { useFileManager, formatSize, formatDate, getFileType } from '../../_context/FileManagerContext';

const RECENT_HISTORY = [
  { id: 'h1', name: 'Brand_Guidelines_2026.pdf', folder: 'Marketing Assets', size: 4200000, downloadedAt: '2026-07-20' },
  { id: 'h2', name: 'Dashboard_v3.fig', folder: 'Product Designs', size: 22000000, downloadedAt: '2026-07-19' },
  { id: 'h3', name: 'Marketing_Assets.zip', folder: 'Marketing Assets', size: 26500000, downloadedAt: '2026-07-18' },
];

function DownloadPageInner() {
  const { folders, getFolderById } = useFileManager();
  const searchParams = useSearchParams();

  const preselectedFolderId = searchParams.get('folder');
  const [mode, setMode] = useState('folder'); // 'folder' | 'file'
  const [selectedFolderId, setSelectedFolderId] = useState(preselectedFolderId || (folders[0]?.id || ''));
  const [selectedFileId, setSelectedFileId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const selectedFolder = getFolderById(selectedFolderId);
  const selectedFile = selectedFolder?.files.find(f => f.id === selectedFileId);

  const totalFolderSize = selectedFolder?.files.reduce((acc, f) => acc + f.size, 0) || 0;

  async function startDownload() {
    setDownloading(true);
    setDone(false);
    setProgress(0);

    for (let p = 0; p <= 100; p += 5) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(p);
    }

    setDownloading(false);
    setDone(true);
  }

  function reset() {
    setDone(false);
    setProgress(0);
  }

  return (
    <>
      <TopBar title="Download"/>
      <div className="fm-content fm-animate-in">
        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">Download Files</h1>
            <p className="fm-page-subtitle">Download individual files or entire folders as ZIP</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' }}>
          <div>
            {/* Mode Tabs */}
            <div className="fm-card fm-card-pad" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 0, background: 'var(--fm-bg)', borderRadius: 10, padding: 4, marginBottom: 20 }}>
                <button
                  className="fm-btn"
                  id="mode-folder"
                  onClick={() => { setMode('folder'); reset(); }}
                  style={{ flex: 1, justifyContent: 'center', borderRadius: 8, background: mode === 'folder' ? 'var(--fm-white)' : 'transparent', color: mode === 'folder' ? 'var(--fm-primary)' : 'var(--fm-text-muted)', boxShadow: mode === 'folder' ? 'var(--fm-shadow-sm)' : 'none', border: 'none' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  Download Folder (ZIP)
                </button>
                <button
                  className="fm-btn"
                  id="mode-file"
                  onClick={() => { setMode('file'); reset(); }}
                  style={{ flex: 1, justifyContent: 'center', borderRadius: 8, background: mode === 'file' ? 'var(--fm-white)' : 'transparent', color: mode === 'file' ? 'var(--fm-primary)' : 'var(--fm-text-muted)', boxShadow: mode === 'file' ? 'var(--fm-shadow-sm)' : 'none', border: 'none' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Download Single File
                </button>
              </div>

              {/* Folder selector */}
              <div className="fm-form-group">
                <label className="fm-label">Select Folder</label>
                <select className="fm-select" value={selectedFolderId} onChange={e => { setSelectedFolderId(e.target.value); setSelectedFileId(''); reset(); }} id="download-folder-select">
                  {folders.map(f => <option key={f.id} value={f.id}>{f.icon} {f.name}</option>)}
                </select>
              </div>

              {/* File selector (only in file mode) */}
              {mode === 'file' && selectedFolder && (
                <div className="fm-form-group" style={{ marginBottom: 0 }}>
                  <label className="fm-label">Select File</label>
                  <select className="fm-select" value={selectedFileId} onChange={e => { setSelectedFileId(e.target.value); reset(); }} id="download-file-select">
                    <option value="">— Choose a file —</option>
                    {selectedFolder.files.map(f => <option key={f.id} value={f.id}>{f.name} ({formatSize(f.size)})</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Preview Card */}
            {selectedFolder && (
              <div className="fm-card fm-card-pad" style={{ marginBottom: 20, borderColor: `${selectedFolder.color.hex}30`, background: `${selectedFolder.color.hex}05` }}>
                {mode === 'folder' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: selectedFolder.color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                        {selectedFolder.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fm-text-primary)' }}>{selectedFolder.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginTop: 3 }}>{selectedFolder.files.length} files · {formatSize(totalFolderSize)}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <span className="fm-badge fm-badge-primary">ZIP archive</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, padding: '14px 0', borderTop: '1px solid var(--fm-divider)' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-text-primary)' }}>{selectedFolder.files.length}</div>
                        <div style={{ fontSize: 12, color: 'var(--fm-text-muted)' }}>Files</div>
                      </div>
                      <div style={{ width: 1, background: 'var(--fm-divider)' }}/>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-text-primary)' }}>{formatSize(totalFolderSize)}</div>
                        <div style={{ fontSize: 12, color: 'var(--fm-text-muted)' }}>Total Size</div>
                      </div>
                      <div style={{ width: 1, background: 'var(--fm-divider)' }}/>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fm-text-primary)' }}>{formatDate(selectedFolder.updatedAt)}</div>
                        <div style={{ fontSize: 12, color: 'var(--fm-text-muted)' }}>Last Modified</div>
                      </div>
                    </div>
                  </div>
                ) : selectedFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: getFileType(selectedFile.name).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                      {getFileType(selectedFile.name).emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fm-text-primary)' }}>{selectedFile.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginTop: 3 }}>
                        {formatSize(selectedFile.size)} · Uploaded {formatDate(selectedFile.uploadedAt)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--fm-text-muted)', fontSize: 14 }}>
                    Select a file above to preview
                  </div>
                )}
              </div>
            )}

            {/* Progress */}
            {(downloading || done) && (
              <div className="fm-card fm-card-pad" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {done ? '✅ Download Complete' : '⟳ Downloading...'}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--fm-text-muted)' }}>{progress}%</span>
                </div>
                <div className="fm-progress" style={{ height: 8 }}>
                  <div className={`fm-progress-fill ${done ? 'success' : ''}`} style={{ width: `${progress}%` }}/>
                </div>
                {done && (
                  <div style={{ marginTop: 14, fontSize: 13.5, color: 'var(--fm-success)', fontWeight: 600 }}>
                    Your file has been downloaded successfully!
                  </div>
                )}
              </div>
            )}

            {/* Download Button */}
            <button
              className="fm-btn fm-btn-primary fm-btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={startDownload}
              disabled={downloading || (mode === 'file' && !selectedFileId)}
              id="btn-start-download"
            >
              {downloading
                ? <><span className="fm-spin">⟳</span> Preparing download...</>
                : done
                  ? '↓ Download Again'
                  : mode === 'folder'
                    ? `↓ Download "${selectedFolder?.name || 'Folder'}" as ZIP`
                    : `↓ Download ${selectedFile?.name || 'File'}`
              }
            </button>
          </div>

          {/* Recent Downloads */}
          <div className="fm-card fm-card-pad">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--fm-text-primary)' }}>
              🕐 Recent Downloads
            </div>
            {RECENT_HISTORY.map((h, i) => {
              const type = getFileType(h.name);
              return (
                <div key={h.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < RECENT_HISTORY.length - 1 ? '1px solid var(--fm-divider)' : 'none', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                    {type.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fm-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)', marginTop: 1 }}>{h.folder} · {formatSize(h.size)}</div>
                    <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', marginTop: 1 }}>{formatDate(h.downloadedAt)}</div>
                  </div>
                  <button className="fm-btn fm-btn-ghost fm-btn-sm fm-btn-icon-only" style={{ color: 'var(--fm-primary)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={null}>
      <DownloadPageInner />
    </Suspense>
  );
}
