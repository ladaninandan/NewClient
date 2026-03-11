import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyFooter() {
  const { config } = useConfig();
  const f = config.strategyLayout?.footer || {};
  const links = f.links || [];
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="py-12 sm:py-16 text-white text-center" style={{ backgroundColor: 'var(--theme-background-dark)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8 px-2">{f.headline || 'Ready to exit the grind?'}</h2>
        <button
          type="button"
          onClick={scrollToForm}
          className="py-4 px-8 sm:py-5 sm:px-12 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold shadow-2xl btn-hover w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          {f.ctaText || 'Book My Strategy Session Now'}
        </button>
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-emerald-100/50">
          <p className="order-2 md:order-1">{f.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 order-1 md:order-2">
            {links.map((link, i) => (
              <a key={i} href={link.url || '#'} className="hover:opacity-80 transition-colors" style={{ color: 'var(--theme-primary)' }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
