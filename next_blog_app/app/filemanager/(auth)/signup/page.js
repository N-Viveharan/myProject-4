'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFileManager } from '../../_context/FileManagerContext';

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#EF4444', '#F59E0B', '#10B981', '#4F46E5'];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useFileManager();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strength = getStrength(form.password);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must accept the terms';
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
      await signup(form.name, form.email, form.password);
      router.push('/filemanager/dashboard');
    } catch (err) {
      setApiError(err.message || 'Signup failed. Please try again.');
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
            Start for free,<br/>
            <span>scale without limits</span>
          </h1>

          <p className="fm-auth-tagline">
            Join thousands of teams who trust StitchCloud to keep their files organized, secure, and accessible.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Active Users', value: '120K+' },
              { label: 'Files Stored', value: '4.2M+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Storage Free', value: '100 GB' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="fm-auth-features">
            <div className="fm-auth-feature">
              <div className="fm-auth-feature-icon" style={{ background: 'rgba(99,102,241,0.25)' }}>✨</div>
              <div className="fm-auth-feature-text">
                <strong>No credit card required</strong>
                <span>Free forever for personal use</span>
              </div>
            </div>
            <div className="fm-auth-feature">
              <div className="fm-auth-feature-icon" style={{ background: 'rgba(16,185,129,0.25)' }}>🔒</div>
              <div className="fm-auth-feature-text">
                <strong>Private by default</strong>
                <span>Your files are yours alone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="fm-auth-right">
        <div className="fm-auth-form-card">
          <h2 className="fm-auth-form-title">Create your account</h2>
          <p className="fm-auth-form-sub">Start managing files beautifully, for free</p>

          {/* API Error */}
          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid #EF4444', color: '#EF4444', borderRadius: 10, padding: '12px 16px', fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>
              ⚠ {apiError}
            </div>
          )}

          <button className="fm-btn fm-btn-secondary fm-w-full" style={{ justifyContent: 'center', width: '100%', marginBottom: 8 }} id="btn-google-signup">
            <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </button>

          <div className="fm-auth-divider">
            <div className="fm-auth-divider-line"/>
            <span className="fm-auth-divider-text">or with email</span>
            <div className="fm-auth-divider-line"/>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="fm-form-group">
              <label className="fm-label" htmlFor="signup-name">Full name</label>
              <div className="fm-input-icon-wrap">
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input id="signup-name" type="text" className={`fm-input${errors.name ? ' error' : ''}`} placeholder="Sarah Johnson" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoComplete="name"/>
              </div>
              {errors.name && <div className="fm-form-error">⚠ {errors.name}</div>}
            </div>

            {/* Email */}
            <div className="fm-form-group">
              <label className="fm-label" htmlFor="signup-email">Email address</label>
              <div className="fm-input-icon-wrap">
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input id="signup-email" type="email" className={`fm-input${errors.email ? ' error' : ''}`} placeholder="sarah@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="email"/>
              </div>
              {errors.email && <div className="fm-form-error">⚠ {errors.email}</div>}
            </div>

            {/* Password */}
            <div className="fm-form-group">
              <label className="fm-label" htmlFor="signup-password">Password</label>
              <div className="fm-input-icon-wrap" style={{ position: 'relative' }}>
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="signup-password" type={showPass ? 'text' : 'password'} className={`fm-input${errors.password ? ' error' : ''}`} placeholder="Min 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingRight: 40 }} autoComplete="new-password"/>
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fm-text-muted)' }}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength Bars */}
              {form.password && (
                <div>
                  <div className="fm-strength-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="fm-strength-bar" style={{ background: i <= strength ? STRENGTH_COLORS[strength] : undefined }}/>
                    ))}
                  </div>
                  <div style={{ fontSize: 11.5, marginTop: 5, color: STRENGTH_COLORS[strength], fontWeight: 600 }}>
                    {STRENGTH_LABELS[strength]}
                  </div>
                </div>
              )}
              {errors.password && <div className="fm-form-error">⚠ {errors.password}</div>}
            </div>

            {/* Confirm Password */}
            <div className="fm-form-group">
              <label className="fm-label" htmlFor="signup-confirm">Confirm password</label>
              <div className="fm-input-icon-wrap">
                <svg className="fm-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <input id="signup-confirm" type="password" className={`fm-input${errors.confirm ? ' error' : ''}`} placeholder="Repeat your password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} autoComplete="new-password"/>
              </div>
              {errors.confirm && <div className="fm-form-error">⚠ {errors.confirm}</div>}
            </div>

            {/* Terms */}
            <div className="fm-form-group">
              <label className="fm-checkbox-label">
                <input type="checkbox" className="fm-checkbox" id="signup-agree" checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}/>
                I agree to the <Link href="#" style={{ color: 'var(--fm-primary)', fontWeight: 600 }}>Terms of Service</Link> and <Link href="#" style={{ color: 'var(--fm-primary)', fontWeight: 600 }}>Privacy Policy</Link>
              </label>
              {errors.agree && <div className="fm-form-error" style={{ marginTop: 5 }}>⚠ {errors.agree}</div>}
            </div>

            <button type="submit" id="btn-signup-submit" className="fm-btn fm-btn-primary fm-btn-lg" style={{ justifyContent: 'center', width: '100%' }} disabled={loading}>
              {loading ? <><span className="fm-spin">⟳</span> Creating account...</> : 'Create Free Account →'}
            </button>
          </form>

          <div className="fm-auth-footer">
            Already have an account?{' '}
            <Link href="/filemanager/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
