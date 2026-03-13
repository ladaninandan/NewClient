import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyCoach() {
  const { config } = useConfig();
  const c = config.strategyLayout?.coach || {};
  const stats = c.stats || [];
  const bioParagraphs = (c.bio || '').split('\n\n').filter(Boolean);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row border border-slate-100 dark:border-slate-700 hover-lift">
        <div className="w-full md:w-2/5 relative h-64 sm:h-80 md:min-h-[560px]">
          {c.image ? (
            <img className="w-full h-full object-cover" alt={c.name} src={c.image} />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-4xl sm:text-5xl font-black">
              {c.name ? c.name.charAt(0) : '?'}
            </div>
          )}
        </div>
        <div className="w-full md:w-3/5 p-5 sm:p-8 lg:p-12 min-w-0">
          <span
            className="font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 block"
            style={{ color: 'var(--theme-primary)' }}
          >
            {c.label || 'The Strategist'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white text-black">{c.heading || 'Meet Rahul Revne'}</h2>
          <div className="space-y-3 sm:space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
            {bioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 mb-6 sm:mb-8">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white text-black">{s.value}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold py-3 rounded-xl transition-colors text-sm sm:text-base"
          >
            {c.ctaText || 'Learn More About Rahul'}
          </button>
        </div>
      </div>
    </section>
  );
}
