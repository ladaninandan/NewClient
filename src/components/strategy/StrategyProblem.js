import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyProblem() {
  const { config } = useConfig();
  const p = config.strategyLayout?.problem || {};
  const items = p.checkItems || [];

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <h2 className="text-center text-slate-900 dark:text-white text-black text-3xl md:text-4xl font-black mb-12">
        {p.title  || 'Why Most Businesses In India Never Scale'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[var(--theme-card-dark)] p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-4">
            {items.map((text, i) => (
              <label key={i} className="flex gap-x-3 items-center py-2 cursor-default">
                <input
                  checked
                  readOnly
                  className="h-6 w-6 rounded border-slate-300 dark:border-slate-700 bg-transparent focus:ring-0"
                  style={{ accentColor: 'var(--theme-primary)' }}
                  type="checkbox"
                />
                <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">{text}</p>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <h3 className="text-2xl font-bold dark:text-[var(--theme-accent)]" style={{ color: 'var(--theme-primary)' }}>{p.trapTitle || 'The Founder Trap'}</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{p.trapText}</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-bold">{p.trapHighlight}</p>
        </div>
      </div>
    </section>
  );
}
