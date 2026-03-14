import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyFounderTrap() {
  const { config } = useConfig();
  const t = config.strategyLayout?.founderTrap || {};
  const warnings = t.warningItems || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: 'var(--theme-background-light, #f8f7f5)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="scroll-reveal relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 bg-gradient-to-tr opacity-20"
            style={{ background: `linear-gradient(to top right, var(--theme-primary), transparent)` }}
          />
          {t.image ? (
            <img className="w-full h-full object-cover" alt="Founder dependency" src={t.image} />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white/50 text-4xl font-black">
              ?
            </div>
          )}
        </div>
        <div className="scroll-reveal min-w-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white text-black">
            {t.title || 'The Founder Dependency Trap'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">{t.text}</p>
          <div className="space-y-3 sm:space-y-4">
            {warnings.map((item, i) => (
              <div
                key={i}
                className="scroll-reveal stagger-children-item flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 min-w-0"
                style={{ borderLeftColor: 'var(--theme-primary)', minHeight: '3.5rem' }}
              >
                <span className="material-symbols-outlined flex-shrink-0 flex items-center justify-center" style={{ color: 'var(--theme-primary)', fontSize: '1.5rem' }}>
                  warning
                </span>
                <p className="font-semibold text-slate-900 dark:text-white mb-0 leading-snug flex items-center text-black text-sm sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
