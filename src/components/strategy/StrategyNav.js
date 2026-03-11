import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

export function StrategyNav() {
  const { config } = useConfig();
  const c = config.strategyLayout?.nav || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollToForm = () => {
    setMenuOpen(false);
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      style={{ backgroundColor: 'color-mix(in srgb, var(--theme-background-light) 80%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {c.logo ? (
            <img src={c.logo} alt="" className="h-10 sm:h-12 w-auto object-contain flex-shrink-0" />
          ) : (
            <span className="font-black text-lg sm:text-xl tracking-tighter flex-shrink-0" style={{ color: 'var(--theme-primary)' }}>
              {c.brandShort || 'RR.'}
            </span>
          )}
          <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">{c.brandName || 'Rahul Revne'}</span>
        </div>
        {/* Desktop: buttons */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={scrollToForm}
            className="text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg btn-hover"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {c.ctaText || 'Book Now'}
          </button>
          <Link to="/admin" className="text-slate-600 dark:text-slate-400 text-sm hover:opacity-80">
            Admin
          </Link>
        </div>
        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-2xl">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={scrollToForm}
            className="w-full text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg text-center"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {c.ctaText || 'Book Now'}
          </button>
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="block text-center text-slate-600 dark:text-slate-400 text-sm py-2 hover:opacity-80"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
