'use client';
import { useState } from 'react';
import TopBar from '../../_components/TopBar';
import { useFileManager } from '../../_context/FileManagerContext';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese'];

export default function ProfilePage() {
  const { user, updateUser } = useFileManager();

  const [tab, setTab]         = useState('profile'); // 'profile' | 'password' | 'settings' | 'danger'
  const [profile, setProfile] = useState({ name: user.name, email: user.email, bio: user.bio || '' });
  const [passwords, setPw]    = useState({ current: '', next: '', confirm: '' });
  const [settings, setSettings] = useState({ ...user.notifications, language: user.language, emailAlerts: true, darkMode: false });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const storagePercent = Math.round((user.storageUsed / user.storageTotal) * 100);

  async function save(section) {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    if (section === 'profile') {
      updateUser({ name: profile.name, email: profile.email, bio: profile.bio, initials: profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() });
    }
    setSaving(false);
    setSaved(section);
    setTimeout(() => setSaved(''), 3000);
  }

  const TABS = [
    { id: 'profile',  label: '👤 Profile',  icon: '👤' },
    { id: 'password', label: '🔑 Password', icon: '🔑' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
    { id: 'danger',   label: '🗑️ Danger Zone', icon: '🗑️' },
  ];

  return (
    <>
      <TopBar title="My Profile"/>
      <div className="fm-content fm-animate-in">
        <div className="fm-page-header">
          <div>
            <h1 className="fm-page-title">Account Settings</h1>
            <p className="fm-page-subtitle">Manage your profile, security, and preferences</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'flex-start' }}>

          {/* Left: Profile Card + Nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Avatar Card */}
            <div className="fm-card fm-card-pad" style={{ textAlign: 'center' }}>
              <div className="fm-profile-avatar-wrap">
                <div className="fm-profile-avatar-placeholder">{user.initials}</div>
                <button className="fm-profile-avatar-edit" title="Change photo" id="btn-change-avatar">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </button>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fm-text-primary)', marginBottom: 3 }}>{user.name}</div>
              <div style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginBottom: 10 }}>{user.email}</div>
              <span className="fm-badge fm-badge-primary">{user.role}</span>

              {/* Storage mini */}
              <div style={{ marginTop: 18, padding: '14px', background: 'var(--fm-bg)', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
                  <span style={{ color: 'var(--fm-text-secondary)', fontWeight: 600 }}>Storage</span>
                  <span style={{ color: 'var(--fm-text-muted)' }}>{storagePercent}%</span>
                </div>
                <div className="fm-progress">
                  <div className={`fm-progress-fill ${storagePercent > 80 ? 'danger' : storagePercent > 60 ? 'warning' : ''}`} style={{ width: `${storagePercent}%` }}/>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--fm-text-muted)', marginTop: 5 }}>
                  {user.storageUsed} GB / {user.storageTotal} GB used
                </div>
              </div>
            </div>

            {/* Tab Nav */}
            <div className="fm-card" style={{ overflow: 'hidden' }}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  className={`fm-nav-item${tab === t.id ? ' active' : ''}`}
                  onClick={() => setTab(t.id)}
                  id={`tab-${t.id}`}
                  style={{ borderRadius: 0, color: t.id === 'danger' && tab !== t.id ? 'var(--fm-danger)' : undefined, borderBottom: i < TABS.length - 1 ? '1px solid var(--fm-divider)' : 'none' }}
                >
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  {t.label.replace(/^../, '')}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Tab Content */}
          <div>
            {/* ── Profile Tab ── */}
            {tab === 'profile' && (
              <div className="fm-card fm-card-pad fm-animate-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, color: 'var(--fm-text-primary)' }}>Profile Information</div>

                {saved === 'profile' && (
                  <div style={{ background: 'var(--fm-success-bg)', border: '1px solid #34D399', color: 'var(--fm-success)', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, marginBottom: 20 }}>
                    ✅ Profile updated successfully!
                  </div>
                )}

                <div className="fm-two-col" style={{ marginBottom: 20 }}>
                  <div className="fm-form-group" style={{ marginBottom: 0 }}>
                    <label className="fm-label" htmlFor="profile-name">Full Name</label>
                    <input id="profile-name" className="fm-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}/>
                  </div>
                  <div className="fm-form-group" style={{ marginBottom: 0 }}>
                    <label className="fm-label" htmlFor="profile-email">Email Address</label>
                    <input id="profile-email" type="email" className="fm-input" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}/>
                  </div>
                </div>

                <div className="fm-form-group">
                  <label className="fm-label" htmlFor="profile-bio">Bio <span className="fm-label-hint">(optional)</span></label>
                  <textarea id="profile-bio" className="fm-textarea" placeholder="Tell us a little about yourself..." value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3}/>
                </div>

                <div className="fm-form-group" style={{ marginBottom: 0 }}>
                  <label className="fm-label">Plan</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--fm-primary-ghost)', borderRadius: 10, border: '1.5px solid var(--fm-primary)' }}>
                    <span style={{ fontSize: 20 }}>⚡</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--fm-primary)', fontSize: 14 }}>Pro Plan</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fm-text-secondary)' }}>100 GB storage · Priority support</div>
                    </div>
                    <button className="fm-btn fm-btn-primary fm-btn-sm" style={{ marginLeft: 'auto' }}>Upgrade</button>
                  </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="fm-btn fm-btn-secondary" onClick={() => setProfile({ name: user.name, email: user.email, bio: user.bio || '' })}>Discard</button>
                  <button className="fm-btn fm-btn-primary" onClick={() => save('profile')} disabled={saving} id="btn-save-profile">
                    {saving ? <><span className="fm-spin">⟳</span> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Password Tab ── */}
            {tab === 'password' && (
              <div className="fm-card fm-card-pad fm-animate-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 22 }}>Change Password</div>

                {saved === 'password' && (
                  <div style={{ background: 'var(--fm-success-bg)', border: '1px solid #34D399', color: 'var(--fm-success)', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, marginBottom: 20 }}>
                    ✅ Password changed successfully!
                  </div>
                )}

                <div className="fm-form-group">
                  <label className="fm-label" htmlFor="pw-current">Current Password</label>
                  <div className="fm-relative">
                    <input id="pw-current" type={showCurrent ? 'text' : 'password'} className="fm-input" value={passwords.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} placeholder="Your current password" style={{ paddingRight: 40 }}/>
                    <button type="button" onClick={() => setShowCurrent(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fm-text-muted)' }}>
                      {showCurrent
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="fm-form-group">
                  <label className="fm-label" htmlFor="pw-new">New Password</label>
                  <div className="fm-relative">
                    <input id="pw-new" type={showNew ? 'text' : 'password'} className="fm-input" value={passwords.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} placeholder="Min 8 characters" style={{ paddingRight: 40 }}/>
                    <button type="button" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fm-text-muted)' }}>
                      {showNew
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="fm-form-group">
                  <label className="fm-label" htmlFor="pw-confirm">Confirm New Password</label>
                  <input id="pw-confirm" type="password" className={`fm-input${passwords.confirm && passwords.next !== passwords.confirm ? ' error' : ''}`} value={passwords.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat your new password"/>
                  {passwords.confirm && passwords.next !== passwords.confirm && <div className="fm-form-error">⚠ Passwords do not match</div>}
                </div>

                {/* Password Requirements */}
                <div style={{ background: 'var(--fm-bg)', borderRadius: 10, padding: '14px 16px', marginBottom: 22 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fm-text-secondary)', marginBottom: 8 }}>Password requirements:</div>
                  {[
                    ['At least 8 characters', passwords.next.length >= 8],
                    ['One uppercase letter', /[A-Z]/.test(passwords.next)],
                    ['One number', /[0-9]/.test(passwords.next)],
                    ['One special character', /[^A-Za-z0-9]/.test(passwords.next)],
                  ].map(([label, met]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: met ? 'var(--fm-success)' : 'var(--fm-text-muted)', marginBottom: 4 }}>
                      <span>{met ? '✓' : '○'}</span> {label}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="fm-btn fm-btn-secondary" onClick={() => setPw({ current: '', next: '', confirm: '' })}>Reset</button>
                  <button className="fm-btn fm-btn-primary" onClick={() => save('password')} disabled={saving || !passwords.current || passwords.next !== passwords.confirm || passwords.next.length < 8} id="btn-save-password">
                    {saving ? <><span className="fm-spin">⟳</span> Saving...</> : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Settings Tab ── */}
            {tab === 'settings' && (
              <div className="fm-card fm-card-pad fm-animate-in">
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 22 }}>Preferences & Notifications</div>

                {saved === 'settings' && (
                  <div style={{ background: 'var(--fm-success-bg)', border: '1px solid #34D399', color: 'var(--fm-success)', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, marginBottom: 20 }}>
                    ✅ Settings saved!
                  </div>
                )}

                {/* Language */}
                <div className="fm-form-group">
                  <label className="fm-label" htmlFor="settings-language">Language</label>
                  <select id="settings-language" className="fm-select" value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                {/* Notification Toggles */}
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text-primary)', marginBottom: 14 }}>Notifications</div>

                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive a weekly summary to your inbox' },
                  { key: 'uploads', label: 'Upload Alerts', desc: 'Notify me when new files are uploaded' },
                  { key: 'shared', label: 'Shared File Alerts', desc: 'When someone shares a file with you' },
                  { key: 'emailAlerts', label: 'Security Alerts', desc: 'Receive alerts for suspicious activity' },
                ].map(n => (
                  <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--fm-divider)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fm-text-primary)' }}>{n.label}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--fm-text-secondary)', marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <label className="fm-switch">
                      <input type="checkbox" id={`toggle-${n.key}`} checked={!!settings[n.key]} onChange={e => setSettings(s => ({ ...s, [n.key]: e.target.checked }))}/>
                      <span className="fm-switch-slider"/>
                    </label>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
                  <button className="fm-btn fm-btn-primary" onClick={() => save('settings')} disabled={saving} id="btn-save-settings">
                    {saving ? <><span className="fm-spin">⟳</span> Saving...</> : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Danger Zone Tab ── */}
            {tab === 'danger' && (
              <div className="fm-animate-in">
                <div className="fm-danger-zone">
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fm-danger)', marginBottom: 6 }}>⚠️ Danger Zone</div>
                  <div style={{ fontSize: 13.5, color: 'var(--fm-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                    These actions are irreversible. Please proceed with caution.
                  </div>

                  {[
                    { title: 'Export All Data', desc: 'Download all your files and folders as a ZIP archive.', btn: 'Export Data', cls: 'fm-btn-secondary' },
                    { title: 'Clear All Files', desc: 'Permanently delete all files but keep your folders.', btn: 'Clear Files', cls: 'fm-btn-danger', light: true },
                    { title: 'Delete All Folders', desc: 'Permanently delete all folders and their files.', btn: 'Delete Folders', cls: 'fm-btn-danger', light: true },
                    { title: 'Delete Account', desc: 'Permanently delete your account and all associated data. This action cannot be reversed.', btn: 'Delete My Account', cls: 'fm-btn-danger' },
                  ].map((action, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 3 ? '1px solid var(--fm-danger-bg)' : 'none', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fm-text-primary)' }}>{action.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--fm-text-secondary)', marginTop: 3, maxWidth: 380, lineHeight: 1.5 }}>{action.desc}</div>
                      </div>
                      <button className={`fm-btn fm-btn-sm ${action.cls}`} style={{ flexShrink: 0, opacity: action.light ? 0.7 : 1 }} id={`btn-danger-${i}`}>
                        {action.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
