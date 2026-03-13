import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useInView } from '../../hooks/useInView';
import { AnimatedNumber } from './AnimatedNumber';

export function StrategyCoach() {
  const { config } = useConfig();
  const c = config.strategyLayout?.coach || {};
  const stats = c.stats || [];
  const bioParagraphs = (c.bio || '').split('\n\n').filter(Boolean);
  const [statsRef, statsInView] = useInView({ rootMargin: '0px 0px -40px 0px', threshold: 0.2 });

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
          <div ref={statsRef} className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 mb-6 sm:mb-8">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white text-black">
                  <AnimatedNumber value={s.value} isInView={statsInView} />
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="w-full text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg text-center btn-hover"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {c.ctaText || 'Learn More About Rahul'}
          </button>
        </div>
      </div>
    </section>
  );
}
