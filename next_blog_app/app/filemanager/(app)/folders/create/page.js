'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopBar from '../../../_components/TopBar';
import { useFileManager, FOLDER_COLORS } from '../../../_context/FileManagerContext';

const ICONS = ['📁', '🎨', '💎', '💼', '⚡', '📷', '🎬', '🎵', '📊', '🔬', '🚀', '🏆'];

export default function CreateFolderPage() {
  const router = useRouter();
  const { createFolder } = useFileManager();

  const [form, setForm] = useState({
    name: '',
    description: '',
    colorName: 'indigo',
    icon: '📁',
    isPrivate: false,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const selectedColor = FOLDER_COLORS.find(c => c.name === form.colorName) || FOLDER_COLORS[0];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Folder name is required';
    if (form.name.trim().length > 60) e.name = 'Name must be 60 characters or fewer';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const folder = createFolder(form);
    router.push(`/filemanager/folders/${folder.id}`);
  }

  return (
    <>
      <TopBar title="Create Folder"/>
      <div className="fm-content fm-animate-in">
        <div className="fm-breadcrumb">
          <Link href="/filemanager/folders">My Folders</Link>
          <span className="fm-breadcrumb-sep">›</span>
          <span>Create New Folder</span>
        </div>

        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">Create New Folder</h1>
            <p className="fm-page-subtitle">Organize your files in a custom folder</p>
          </div>
        </div>

        <div className="fm-two-col-6040" style={{ alignItems: 'flex-start' }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="fm-card fm-card-pad">
              {/* Name */}
              <div className="fm-form-group">
                <label className="fm-label" htmlFor="folder-name">
                  Folder Name <span style={{ color: 'var(--fm-danger)' }}>*</span>
                </label>
                <input
                  id="folder-name"
                  className={`fm-input${errors.name ? ' error' : ''}`}
                  placeholder="e.g. Marketing Assets"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  maxLength={60}
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                  {errors.name && <div className="fm-form-error">⚠ {errors.name}</div>}
                  <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)', marginLeft: 'auto' }}>{form.name.length}/60</div>
                </div>
              </div>

              {/* Description */}
              <div className="fm-form-group">
                <label className="fm-label" htmlFor="folder-desc">
                  Description <span className="fm-label-hint">(optional)</span>
                </label>
                <textarea
                  id="folder-desc"
                  className="fm-textarea"
                  placeholder="What's this folder for? Add a short description..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Color Picker */}
              <div className="fm-form-group">
                <label className="fm-label">Folder Color</label>
                <div className="fm-color-grid">
                  {FOLDER_COLORS.map(c => (
                    <div
                      key={c.name}
                      className={`fm-color-swatch${form.colorName === c.name ? ' selected' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setForm(f => ({ ...f, colorName: c.name }))}
                      title={c.name}
                      role="button"
                      id={`color-${c.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div className="fm-form-group">
                <label className="fm-label">Folder Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      id={`icon-${icon}`}
                      style={{
                        width: 44, height: 44, borderRadius: 12, border: '2px solid',
                        borderColor: form.icon === icon ? selectedColor.hex : 'var(--fm-border)',
                        background: form.icon === icon ? selectedColor.bg : 'var(--fm-white)',
                        fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="fm-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--fm-bg)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text-primary)' }}>Private Folder</div>
                    <div style={{ fontSize: 12.5, color: 'var(--fm-text-secondary)', marginTop: 2 }}>Only you can access this folder</div>
                  </div>
                  <label className="fm-switch">
                    <input type="checkbox" id="folder-private" checked={form.isPrivate} onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))}/>
                    <span className="fm-switch-slider"/>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link href="/filemanager/folders" className="fm-btn fm-btn-secondary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
                Cancel
              </Link>
              <button type="submit" id="btn-create-submit" className="fm-btn fm-btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={saving}>
                {saving ? <><span className="fm-spin">⟳</span> Creating...</> : '+ Create Folder'}
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <div style={{ position: 'sticky', top: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fm-text-muted)', marginBottom: 12 }}>Live Preview</div>
            <div className="fm-card fm-card-pad" style={{ '--folder-color': selectedColor.hex }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: selectedColor.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: `2px solid ${selectedColor.hex}20` }}>
                  {form.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--fm-text-primary)', marginBottom: 3 }}>
                    {form.name || <span style={{ color: 'var(--fm-text-muted)', fontWeight: 400 }}>Folder Name</span>}
                  </div>
                  {form.isPrivate && <span className="fm-badge fm-badge-gray" style={{ fontSize: 10.5 }}>🔒 Private</span>}
                </div>
              </div>

              {form.description && (
                <div style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginBottom: 16, lineHeight: 1.5, padding: '10px 12px', background: 'var(--fm-bg)', borderRadius: 8 }}>
                  {form.description}
                </div>
              )}

              <div style={{ height: 3, borderRadius: 100, background: `${selectedColor.hex}20`, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: selectedColor.hex }}/>
              </div>

              <div style={{ display: 'flex', gap: 12, fontSize: 12.5, color: 'var(--fm-text-muted)' }}>
                <span>0 files</span>
                <span>·</span>
                <span>Just created</span>
              </div>
            </div>

            {/* Color preview label */}
            <div style={{ marginTop: 14, padding: '12px 16px', background: selectedColor.bg, borderRadius: 12, border: `1.5px solid ${selectedColor.hex}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedColor.hex, flexShrink: 0 }}/>
              <span style={{ fontSize: 13, fontWeight: 600, color: selectedColor.hex, textTransform: 'capitalize' }}>
                {form.colorName} theme selected
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
