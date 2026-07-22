'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFileManager } from '../../_context/FileManagerContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useFileManager();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function validate() {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/filemanager/dashboard');
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fm-auth-shell">
      {/* Left panel */}
      <div className="fm-auth-left">
        <div className="fm-auth-left-content">
          <div className="fm-auth-logo">
            <div className="fm-auth-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="fm-auth-logo-text">StitchCloud</span>
          </div>

          <h1 className="fm-auth-headline">
            Your files,<br/>
            <span>beautifully organized</span>
          </h1>

          <p className="fm-auth-tagline">
            Upload, manage, and share your files and folders from anywhere in the world with complete security.
          </p>

          <div className="fm-auth-features">
            <div className="fm-auth-feature">
              <div className="fm-auth-feature-icon" style={{ background: 'rgba(99,102,241,0.25)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div className="fm-auth-feature-text">
                <strong>Smart Organization</strong>
                <span>Folders, tags, and instant search</span>
              </div>
            </div>
            <div className="fm-auth-feature">
              <div className="fm-auth-feature-icon" style={{ background: 'rgba(124,58,237,0.25)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="fm-auth-feature-text">
                <strong>End-to-End Encryption</strong>
                <span>Your data stays private, always</span>
              </div>
            </div>
            <div className="fm-auth-feature">
              <div className="fm-auth-feature-icon" style={{ background: 'rgba(6,182,212,0.25)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div className="fm-auth-feature-text">
                <strong>100 GB Free Storage</strong>
                <span>Scale as you grow, no credit card needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="fm-auth-right">
        <div className="fm-auth-form-card">
          <h2 className="fm-auth-form-title">Welcome back 👋</h2>
          <p className="fm-auth-form-sub">Sign in to your StitchCloud account</p>

          {/* API Error */}
          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid #EF4444', color: '#EF4444', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>
              ⚠ {apiError}
            </div>
          )}

          {/* Social Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <button className="fm-btn fm-btn-secondary fm-w-full" style={{ flex: 1, justifyContent: 'center' }} id="btn-google-login">
              <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>

          <div className="fm-auth-divider">
            <div className="fm-auth-divider-line"/>
            <span className="fm-auth-divider-text">or sign in with email</span>
            <div className="fm-auth-divider-line"/>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="fm-form-group">
              <label className="fm-label" htmlFor="login-email">Email address</label>
              <div className="fm-input-icon-wrap">
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  id="login-email"
                  type="email"
                  className={`fm-input${errors.email ? ' error' : ''}`}
                  placeholder="sarah@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="fm-form-error">⚠ {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="fm-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label className="fm-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <Link href="#" style={{ fontSize: 12.5, color: 'var(--fm-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="fm-input-icon-wrap" style={{ position: 'relative' }}>
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className={`fm-input${errors.password ? ' error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fm-text-muted)', padding: 0 }}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <div className="fm-form-error">⚠ {errors.password}</div>}
            </div>

            {/* Remember me */}
            <div className="fm-form-group" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <input
                type="checkbox"
                id="login-remember"
                className="fm-checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              />
              <label htmlFor="login-remember" style={{ fontSize: 13.5, color: 'var(--fm-text-secondary)', cursor: 'pointer' }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-login-submit"
              className="fm-btn fm-btn-primary fm-btn-lg fm-w-full"
              style={{ justifyContent: 'center', width: '100%' }}
              disabled={loading}
            >
              {loading
                ? <><span className="fm-spin">⟳</span> Signing in...</>
                : 'Sign In →'
              }
            </button>
          </form>

          <div className="fm-auth-footer">
            Don't have an account?{' '}
            <Link href="/filemanager/signup">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
