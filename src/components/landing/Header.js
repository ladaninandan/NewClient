import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

export function Header() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-dark py-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {config.logo ? (
            <img src={config.logo} alt="Logo" style={{ height: '40px' }} />
          ) : (
            <span className="text-white fw-bold">Workshop</span>
          )}
          <div className="d-flex align-items-center gap-3">
            <Link to="/admin" className="text-white-50 small">Admin</Link>
            <button
              type="button"
              className="btn text-white fw-bold px-4"
              style={{ backgroundColor: 'var(--bs-primary)', border: 'none' }}
              onClick={scrollToForm}
            >
              {config.ctaButtonText}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
