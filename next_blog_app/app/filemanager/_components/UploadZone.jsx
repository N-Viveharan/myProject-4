'use client';
import { useState, useRef } from 'react';

export default function UploadZone({ onFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles?.(files);
  }

  function handleChange(e) {
    const files = Array.from(e.target.files);
    if (files.length) onFiles?.(files);
    e.target.value = '';
  }

  return (
    <div
      className={`fm-upload-zone ${isDragging ? 'drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      id="upload-drop-zone"
    >
      <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={handleChange}/>
      <div className="fm-upload-zone-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 16 12 12 8 16"/>
          <line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
      </div>
      <div className="fm-upload-zone-title">
        {isDragging ? 'Drop files here!' : 'Drag & drop files here'}
      </div>
      <div className="fm-upload-zone-sub">
        or <span style={{ color: 'var(--fm-primary)', fontWeight: 600 }}>browse files</span> from your computer
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: 'var(--fm-text-muted)' }}>
        Supports: PDF, DOCX, XLSX, PNG, JPG, MP4, ZIP and more
      </div>
    </div>
  );
}
