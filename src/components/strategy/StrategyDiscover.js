import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyDiscover() {
  const { config } = useConfig();
  const d = config.strategyLayout?.discover || {};
  const items = d.items || [];
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-slate-900 dark:text-white text-3xl md:text-4xl font-black mb-12">
          {d.title || "What You'll Discover"}
        </h2>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-slate-100 dark:bg-[var(--theme-card-dark)] p-6 rounded-xl border border-transparent hover:border-[var(--theme-accent)] transition-all"
            >
              <span className="material-symbols-outlined text-green-500 bg-green-500/10 p-2 rounded-full">
                check_circle
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-lg font-medium">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={scrollToForm}
            className="w-full md:w-auto flex min-w-[280px] mx-auto cursor-pointer items-center justify-center rounded-xl h-14 px-8 text-white text-lg font-black shadow-lg"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          >
            {d.ctaText || 'Book My Strategy Session Now'}
          </button>
        </div>
      </div>
    </section>
  );
}
