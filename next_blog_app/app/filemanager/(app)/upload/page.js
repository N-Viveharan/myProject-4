'use client';
import { useState } from 'react';
import TopBar from '../../_components/TopBar';
import UploadZone from '../../_components/UploadZone';
import { useFileManager, formatSize, getFileType } from '../../_context/FileManagerContext';

const UPLOAD_STATES = { pending: 'pending', uploading: 'uploading', done: 'done', error: 'error' };

export default function UploadPage() {
  const { folders, uploadFiles } = useFileManager();

  const [selectedFolder, setSelectedFolder] = useState(folders[0]?.id || '');
  const [fileQueue, setFileQueue] = useState([]);

  function addFiles(rawFiles) {
    const newItems = rawFiles.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: f.size,
      state: UPLOAD_STATES.pending,
      progress: 0,
    }));
    setFileQueue(q => [...q, ...newItems]);
  }

  function removeFile(id) {
    setFileQueue(q => q.filter(f => f.id !== id));
  }

  async function uploadAll() {
    if (!selectedFolder || fileQueue.length === 0) return;

    const pending = fileQueue.filter((f) => f.state === UPLOAD_STATES.pending);

    // Mark all pending as uploading
    setFileQueue((q) =>
      q.map((f) =>
        f.state === UPLOAD_STATES.pending ? { ...f, state: UPLOAD_STATES.uploading, progress: 0 } : f
      )
    );

    try {
      // Animate progress while upload runs
      const progressInterval = setInterval(() => {
        setFileQueue((q) =>
          q.map((f) =>
            f.state === UPLOAD_STATES.uploading && f.progress < 85
              ? { ...f, progress: f.progress + 15 }
              : f
          )
        );
      }, 200);

      const rawFiles = pending.map((item) => item.file);
      await uploadFiles(selectedFolder, rawFiles);

      clearInterval(progressInterval);

      setFileQueue((q) =>
        q.map((f) =>
          f.state === UPLOAD_STATES.uploading
            ? { ...f, state: UPLOAD_STATES.done, progress: 100 }
            : f
        )
      );
    } catch (err) {
      console.error('Upload failed:', err);
      setFileQueue((q) =>
        q.map((f) =>
          f.state === UPLOAD_STATES.uploading
            ? { ...f, state: UPLOAD_STATES.error, progress: 0 }
            : f
        )
      );
    }
  }

  function clearDone() {
    setFileQueue(q => q.filter(f => f.state !== UPLOAD_STATES.done));
  }

  const pendingCount = fileQueue.filter(f => f.state === UPLOAD_STATES.pending).length;
  const doneCount    = fileQueue.filter(f => f.state === UPLOAD_STATES.done).length;
  const isUploading  = fileQueue.some(f => f.state === UPLOAD_STATES.uploading);

  return (
    <>
      <TopBar title="Upload Files"/>
      <div className="fm-content fm-animate-in">
        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">Upload Files</h1>
            <p className="fm-page-subtitle">Drag and drop or browse to upload files to a folder</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' }}>
          <div>
            {/* Folder Selector */}
            <div className="fm-card fm-card-pad" style={{ marginBottom: 20 }}>
              <label className="fm-label" htmlFor="upload-folder-select">Upload to folder</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--fm-text-muted)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <select
                  id="upload-folder-select"
                  className="fm-select"
                  style={{ paddingLeft: 40 }}
                  value={selectedFolder}
                  onChange={e => setSelectedFolder(e.target.value)}
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drop Zone */}
            <UploadZone onFiles={addFiles}/>

            {/* File Queue */}
            {fileQueue.length > 0 && (
              <div className="fm-card" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--fm-border)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text-primary)' }}>
                    {fileQueue.length} file{fileQueue.length !== 1 ? 's' : ''} queued
                    {doneCount > 0 && <span className="fm-badge fm-badge-success" style={{ marginLeft: 10 }}>{doneCount} done</span>}
                  </div>
                  {doneCount > 0 && (
                    <button className="fm-btn fm-btn-ghost fm-btn-sm" onClick={clearDone} style={{ color: 'var(--fm-text-muted)' }}>Clear done</button>
                  )}
                </div>

                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {fileQueue.map(item => {
                    const type = getFileType(item.name);
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--fm-divider)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {type.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fm-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--fm-text-muted)', marginBottom: item.state === UPLOAD_STATES.uploading ? 6 : 0 }}>{formatSize(item.size)}</div>
                          {item.state === UPLOAD_STATES.uploading && (
                            <div>
                              <div className="fm-progress">
                                <div className="fm-progress-fill" style={{ width: `${item.progress}%` }}/>
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--fm-text-muted)', marginTop: 3 }}>{item.progress}%</div>
                            </div>
                          )}
                        </div>
                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {item.state === UPLOAD_STATES.pending && (
                            <span className="fm-badge fm-badge-gray">Queued</span>
                          )}
                          {item.state === UPLOAD_STATES.uploading && (
                            <span className="fm-badge fm-badge-primary">Uploading</span>
                          )}
                          {item.state === UPLOAD_STATES.done && (
                            <span className="fm-badge fm-badge-success">✓ Done</span>
                          )}
                          {item.state === UPLOAD_STATES.error && (
                            <span className="fm-badge fm-badge-danger">Failed</span>
                          )}
                          {item.state === UPLOAD_STATES.pending && (
                            <button onClick={() => removeFile(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fm-text-muted)', padding: 4 }} title="Remove">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upload Button */}
                <div style={{ padding: '16px 20px', display: 'flex', gap: 10 }}>
                  <button
                    className="fm-btn fm-btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={uploadAll}
                    disabled={isUploading || pendingCount === 0}
                    id="btn-upload-all"
                  >
                    {isUploading
                      ? <><span className="fm-spin">⟳</span> Uploading...</>
                      : `↑ Upload ${pendingCount} File${pendingCount !== 1 ? 's' : ''}`
                    }
                  </button>
                  <button className="fm-btn fm-btn-secondary" onClick={() => setFileQueue([])} disabled={isUploading}>
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="fm-card fm-card-pad">
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--fm-text-primary)' }}>📋 Upload Tips</div>
              {[
                { icon: '📦', text: 'Multiple files can be uploaded at once' },
                { icon: '⚡', text: 'Files are encrypted automatically' },
                { icon: '🗂', text: 'Choose the right folder before uploading' },
                { icon: '🔄', text: 'Failed uploads can be retried individually' },
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < 3 ? '1px solid var(--fm-divider)' : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16 }}>{tip.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--fm-text-secondary)', lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>

            <div className="fm-card fm-card-pad">
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--fm-text-primary)' }}>✅ Supported Formats</div>
              {[
                { types: 'PDF, DOC, DOCX', icon: '📄', label: 'Documents' },
                { types: 'XLS, XLSX, CSV', icon: '📊', label: 'Spreadsheets' },
                { types: 'PNG, JPG, GIF', icon: '🖼️', label: 'Images' },
                { types: 'MP4, MOV, AVI', icon: '🎬', label: 'Videos' },
                { types: 'ZIP, RAR, TAR', icon: '🗜️', label: 'Archives' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--fm-divider)' }}>
                  <span style={{ fontSize: 16 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fm-text-primary)' }}>{row.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)' }}>{row.types}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
