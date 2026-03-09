import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/submissions', label: 'Submissions', icon: '📋' },
  { path: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className="bg-dark text-white flex-shrink-0 d-flex flex-column"
        style={{ width: '260px' }}
      >
        <div className="p-4 border-bottom border-secondary">
          <Link to="/" className="text-white text-decoration-none fw-bold d-flex align-items-center gap-2">
            <span>←</span> Landing
          </Link>
          <h5 className="mt-3 mb-0">Admin Panel</h5>
        </div>
        <nav className="flex-grow-1 p-3">
          {navItems.map((item) => {
            const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                className={`btn w-100 text-start d-flex align-items-center gap-2 py-2 px-3 mb-1 rounded ${
                  isActive ? 'btn-primary' : 'text-white border-0 bg-transparent'
                }`}
                style={!isActive ? { color: 'rgba(255,255,255,0.85)' } : {}}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-grow-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
