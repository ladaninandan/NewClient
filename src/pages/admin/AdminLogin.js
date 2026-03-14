import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_STORAGE_KEY = 'adminLoggedIn';

// Static credentials (override via env in production)
const STATIC_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'admin@example.com';
const STATIC_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

export function getAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

export function setAdminAuthenticated(value) {
  if (value) sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  else sessionStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const emailTrim = (email || '').trim();
    const pass = password || '';
    if (emailTrim === STATIC_EMAIL && pass === STATIC_PASSWORD) {
      setAdminAuthenticated(true);
      window.dispatchEvent(new CustomEvent('adminLoggedIn'));
      navigate('/admin', { replace: true });
      return;
    }
    setError('Invalid email or password.');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-sm border-0 rounded-3" style={{ width: '100%', maxWidth: '380px' }}>
        <div className="card-body p-4 p-md-5">
          <h4 className="card-title fw-bold mb-1">Admin Login</h4>
          <p className="text-muted small mb-4">Sign in to access the admin panel.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="admin-email" className="form-label small fw-semibold">Email</label>
              <input
                id="admin-email"
                type="email"
                className="form-control form-control-sm"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="admin-password" className="form-label small fw-semibold">Password</label>
              <input
                id="admin-password"
                type="password"
                className="form-control form-control-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Sign in
            </button>
          </form>
          <div className="mt-4 pt-3 border-top">
            <a href="/" className="text-muted small text-decoration-none">← Back to site</a>
          </div>
        </div>
      </div>
    </div>
  );
}
