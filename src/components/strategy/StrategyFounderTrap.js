import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyFounderTrap() {
  const { config } = useConfig();
  const t = config.strategyLayout?.founderTrap || {};
  // Filter empty strings so the admin "Add new" row doesn't render blank cards
  const warnings = (t.warningItems || []).filter(Boolean);

  return (
    <section className="py-5 sm:py-12 lg:py-20" style={{ backgroundColor: 'var(--theme-background-light, #f8f7f5)' }}>
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
          {/* Ensure t.text or fallback text perfectly matches user copy */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
            {t.text || "Most business owners take pride in doing everything themselves. But this is exactly what stops your business from growing. If you are handling operations, sales, and decisions you are not scaling… you are just staying busy."}
          </p>
          <div className="space-y-3 sm:space-y-4">
            {(warnings.length ? warnings : [
              "You work IN the business, not ON it.",
              "Every important decision depends on you",
              "Your team waits instead of taking ownership",
              "You can’t step away without things slowing down",
              "The truth is your business is not stuck. It is dependent on you."
            ]).map((item, i) => (
              <div
                key={i}
                className="scroll-reveal stagger-children-item flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 min-w-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-default group"
                style={{ borderLeftColor: 'var(--theme-primary)', minHeight: '3.5rem' }}
              >
                <span className="material-symbols-outlined flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-125" style={{ color: 'var(--theme-primary)', fontSize: '1.5rem' }}>
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
