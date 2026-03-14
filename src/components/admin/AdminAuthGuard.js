import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLogin, getAdminAuthenticated } from '../../pages/admin/AdminLogin';

export function AdminAuthGuard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthenticated(getAdminAuthenticated());
    setChecked(true);
  }, []);

  useEffect(() => {
    const onLogin = () => setAuthenticated(true);
    const onLogout = () => setAuthenticated(false);
    window.addEventListener('adminLoggedIn', onLogin);
    window.addEventListener('adminLoggedOut', onLogout);
    return () => {
      window.removeEventListener('adminLoggedIn', onLogin);
      window.removeEventListener('adminLoggedOut', onLogout);
    };
  }, []);

  if (!checked) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin />;
  }

  return <Outlet />;
}
