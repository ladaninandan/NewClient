import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyHero() {
  const { config } = useConfig();
  const hero = config.strategyLayout?.hero || {};
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  const headlineText = hero.headline || 'Is Your Business Running Because Of You…';
  const highlightText = hero.headlineHighlight || 'Or Despite You?';
  const headlineEndsWithHighlight = headlineText.trim().endsWith(highlightText.trim());
  const showHighlightSeparately = highlightText && !headlineEndsWithHighlight;

  return (
    <header className="relative overflow-hidden py-12 sm:py-16 lg:py-24" style={{ backgroundColor: 'var(--theme-background-dark)' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)', color: 'var(--theme-primary)' }}
        >
          {hero.badge || '1-to-1 Clarity Session'}
        </span>
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 sm:mb-6">
          {headlineText}
          {showHighlightSeparately && (
            <>
              {' '}
              <span style={{ color: 'var(--theme-primary, #f77c18)' }}>
                {highlightText}
              </span>
            </>
          )}
        </h1>
        <p className="text-emerald-100 text-base sm:text-lg font-medium opacity-90 mb-6 sm:mb-8">
          {hero.subtext}
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="text-white text-base sm:text-lg font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl btn-hover"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          {hero.ctaText || 'Reserve My ₹199 Strategy Session'}
        </button>
        <p className="text-emerald-200/60 text-sm italic mt-4">{hero.slotNote || 'Limited slots available for this month'}</p>
      </div>
    </header>
  );
}
