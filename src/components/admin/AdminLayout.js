import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setAdminAuthenticated } from '../../pages/admin/AdminLogin';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/submissions', label: 'Submissions', icon: '📋' },
  { path: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) =>
    item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setSidebarOpen(false);
    window.dispatchEvent(new CustomEvent('adminLoggedOut'));
    navigate('/admin', { replace: true });
  };

  const SidebarContent = () => (
    <>
      <div className="p-3 p-lg-4 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="text-white text-decoration-none fw-bold d-flex align-items-center gap-2 small">
            <span>←</span> Landing
          </Link>
          <button
            type="button"
            className="btn btn-link text-white d-lg-none p-0 ms-2"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <h5 className="mt-3 mb-0 small">Admin Panel</h5>
      </div>
      <nav className="flex-grow-1 p-3 overflow-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`btn w-100 text-start d-flex align-items-center gap-2 py-2 px-3 mb-1 rounded ${
              isActive(item) ? 'btn-primary' : 'text-white border-0 bg-transparent'
            }`}
            style={!isActive(item) ? { color: 'rgba(255,255,255,0.85)' } : {}}
            onClick={() => handleNav(item.path)}
          >
            <span>{item.icon}</span>
            <span className="small">{item.label}</span>
          </button>
        ))}
        <div className="mt-3 pt-3 border-top border-secondary">
          <button
            type="button"
            className="btn w-100 text-start d-flex align-items-center gap-2 py-2 px-3 rounded text-white border-0 bg-transparent"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span className="small">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100 bg-light">
      {/* Mobile: hamburger */}
      <div className="d-flex d-lg-none align-items-center justify-content-between bg-dark text-white px-3 py-2 sticky-top">
        <button
          type="button"
          className="btn btn-link text-white p-0"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span style={{ fontSize: '1.5rem' }}>☰</span>
        </button>
        <span className="fw-bold small">Admin</span>
        <span style={{ width: '28px' }} />
      </div>

      {/* Sidebar: overlay on mobile/tablet, fixed on desktop */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 bottom-0 z-3 bg-dark overflow-auto"
          style={{ width: 'min(280px, 85vw)' }}
        >
          <SidebarContent />
        </div>
      )}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 bottom-0 end-0 z-2 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      <aside
        className="bg-dark text-white flex-shrink-0 d-none d-lg-flex flex-column"
        style={{ width: '260px' }}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 overflow-auto p-3 p-md-4 w-100" style={{ minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
