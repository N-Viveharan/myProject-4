'use client';
import Link from 'next/link';
import TopBar from '../../_components/TopBar';
import StatCard from '../../_components/StatCard';
import { useFileManager, formatSize, formatDate, getFileType } from '../../_context/FileManagerContext';

export default function DashboardPage() {
  const { user, folders, totalFiles, totalSizeBytes, recentUploads, starredFolders } = useFileManager();

  const storagePercent = Math.round((user.storageUsed / user.storageTotal) * 100);

  return (
    <>
      <TopBar title={`Welcome back, ${user.name.split(' ')[0]} 👋`} subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}/>
      <div className="fm-content fm-animate-in">

        {/* Hero Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1C1847 0%, #3730A3 60%, #4F46E5 100%)', borderRadius: 20, padding: '28px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }}/>
          <div style={{ position: 'absolute', right: 120, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.1)' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.4px' }}>
              {user.name}'s Workspace
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 20, maxWidth: 380 }}>
              You have <strong style={{ color: '#A5B4FC' }}>{folders.length} folders</strong> and <strong style={{ color: '#A5B4FC' }}>{totalFiles} files</strong> stored. Keep up the great work!
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/filemanager/folders/create" className="fm-btn fm-btn-primary" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', boxShadow: 'none', textDecoration: 'none' }}>
                + New Folder
              </Link>
              <Link href="/filemanager/upload" className="fm-btn" style={{ background: 'rgba(255,255,255,0.9)', color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>
                ↑ Upload Files
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 18px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', minWidth: 180 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Storage Used</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{user.storageUsed} <span style={{ fontSize: 13, fontWeight: 500 }}>GB</span></div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 100, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: `${storagePercent}%`, height: '100%', background: 'linear-gradient(90deg, #A5B4FC, #C4B5FD)', borderRadius: 100 }}/>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 5 }}>{storagePercent}% of {user.storageTotal} GB used</div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="fm-stats-grid">
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
            label="Total Folders" value={folders.length} change="+2 this month" changeDir="up"
            color="#4F46E5" bg="rgba(79,70,229,0.08)"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            label="Total Files" value={totalFiles} change="+8 this week" changeDir="up"
            color="#7C3AED" bg="rgba(124,58,237,0.08)"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>}
            label="Storage Used" value={`${user.storageUsed} GB`} change={`${100 - user.storageUsed} GB free`} changeDir="up"
            color="#0EA5E9" bg="rgba(14,165,233,0.08)"
          />
          <StatCard
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            label="Starred Folders" value={starredFolders.length} change="Ready for quick access" changeDir="up"
            color="#F59E0B" bg="rgba(245,158,11,0.08)"
          />
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

          {/* Recent Uploads */}
          <div>
            <div className="fm-section">
              <div className="fm-section-header">
                <div className="fm-section-title">Recent Uploads</div>
                <Link href="/filemanager/folders" style={{ fontSize: 13, color: 'var(--fm-primary)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
              </div>
              <div className="fm-card">
                <table className="fm-file-table" style={{ borderRadius: 'var(--fm-radius-lg)', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Folder</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map(u => {
                      const type = getFileType(u.name);
                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="fm-file-icon-cell">
                              <div className="fm-file-type-icon" style={{ background: type.bg, color: type.color, fontSize: 15 }}>{type.emoji}</div>
                              <div className="fm-file-name" style={{ fontSize: 13 }}>{u.name}</div>
                            </div>
                          </td>
                          <td>
                            <Link href={`/filemanager/folders/${u.folderId}`} style={{ fontSize: 12.5, color: 'var(--fm-primary)', fontWeight: 500, textDecoration: 'none' }}>
                              📁 {u.folderName}
                            </Link>
                          </td>
                          <td style={{ color: 'var(--fm-text-secondary)', fontSize: 12.5 }}>{formatSize(u.size)}</td>
                          <td style={{ color: 'var(--fm-text-secondary)', fontSize: 12.5 }}>{formatDate(u.uploadedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Folders Quick Preview */}
            <div className="fm-section">
              <div className="fm-section-header">
                <div className="fm-section-title">My Folders</div>
                <Link href="/filemanager/folders" style={{ fontSize: 13, color: 'var(--fm-primary)', fontWeight: 600, textDecoration: 'none' }}>See all {folders.length} →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {folders.slice(0, 3).map(f => (
                  <Link key={f.id} href={`/filemanager/folders/${f.id}`} style={{ textDecoration: 'none' }}>
                    <div className="fm-card" style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.color.bg, fontSize: 20 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--fm-text-primary)', marginBottom: 2 }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--fm-text-secondary)' }}>{f.files.length} files</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar panel */}
          <div>
            {/* Quick Actions */}
            <div className="fm-card fm-card-pad fm-mb-4" style={{ marginBottom: 18 }}>
              <div className="fm-section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Upload Files', icon: '↑', href: '/filemanager/upload', color: '#4F46E5' },
                  { label: 'Create Folder', icon: '+', href: '/filemanager/folders/create', color: '#7C3AED' },
                  { label: 'Download Files', icon: '↓', href: '/filemanager/download', color: '#0EA5E9' },
                  { label: 'Manage Folders', icon: '⚙', href: '/filemanager/manage', color: '#10B981' },
                ].map(a => (
                  <Link key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--fm-bg)', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--fm-primary-ghost)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--fm-bg)'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{a.icon}</div>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fm-text-primary)' }}>{a.label}</span>
                    <svg style={{ marginLeft: 'auto', color: 'var(--fm-text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Starred Folders */}
            <div className="fm-card fm-card-pad">
              <div className="fm-section-title" style={{ marginBottom: 16 }}>⭐ Starred Folders</div>
              {starredFolders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--fm-text-muted)', fontSize: 13 }}>
                  No starred folders yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {starredFolders.map(f => (
                    <Link key={f.id} href={`/filemanager/folders/${f.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--fm-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.color.bg, fontSize: 17 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fm-text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)' }}>{f.files.length} files</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
