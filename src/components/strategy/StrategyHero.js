import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyHero() {
  const { config } = useConfig();
  const hero = config.strategyLayout?.hero || {};
  const card = config.strategyLayout?.offerCard || {};
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  const headlineText = hero.headline || 'Is Your Business Running Because Of You…';
  const highlightText = hero.headlineHighlight || 'Or Despite You?';
  const headlineEndsWithHighlight = headlineText.trim().endsWith(highlightText.trim());
  const showHighlightSeparately = highlightText && !headlineEndsWithHighlight;

  const defaultOfferItems = [
    { title: 'Personalized Business Audit', desc: "We'll identify exactly where you are stuck." },
    { title: '90-Minute Strategic Roadmap', desc: 'Step-by-step plan to automate operations.' },
    { title: 'Scale-Up Blueprint', desc: 'Indian-market specific scaling strategies.' },
  ];

  const rawItems = Array.isArray(card.items) ? card.items : [];
  const parsed = rawItems.map((item) => {
    if (item && typeof item === 'object' && (item.title != null || item.desc != null)) {
      return { title: String(item.title ?? ''), desc: String(item.desc ?? '') };
    }
    if (typeof item === 'string') {
      const [title, desc] = item.split('|').map((s) => (s || '').trim());
      return { title: title || '', desc: desc || '' };
    }
    return { title: '', desc: '' };
  }).filter((item) => item.title || item.desc);
  const offerItems = parsed.length > 0 ? parsed : defaultOfferItems;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-4 sm:gap-6 sm:text-center lg:text-left order-2 lg:order-1">
            <span
              className="inline-block self-center lg:self-start px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)', color: 'var(--theme-primary)' }}
            >
              {hero.badge || '1-to-1 Clarity Session'}
            </span>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:self-start lg:text-6xl font-black leading-tight tracking-tight max-w-4xl mx-auto lg:mx-0">
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
            <p className="text-emerald-100 text-base sm:text-lg lg:text-xl font-medium opacity-90 max-w-xl mx-auto lg:mx-0">
              {hero.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToForm}
                className="text-white text-base sm:text-lg font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl btn-hover"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                {hero.ctaText || 'Reserve My ₹199 Strategy Session'}
              </button>
            </div>
            <div className="justify-center lg:justify-start">
              <p className="text-emerald-200/60 text-sm italic">{hero.slotNote || 'Limited slots available for this month'}</p>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xl relative hover-lift">
              <div
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 text-white p-3 sm:p-4 rounded-full font-black text-xl sm:text-2xl shadow-lg border-4 border-emerald-900"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                {card.price || '₹199'}
              </div>
              <div className="space-y-4 sm:space-y-6">
                {offerItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <span
                      className="material-symbols-outlined bg-white rounded-full p-1.5 sm:p-2 flex-shrink-0 text-lg sm:text-[24px]"
                      style={{ color: 'var(--theme-primary, #f77c18)' }}
                    >
                      check_circle
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-sm">{item.title || '—'}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.85)', marginTop: '0.25rem', marginBottom: 0 }}>{item.desc || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
