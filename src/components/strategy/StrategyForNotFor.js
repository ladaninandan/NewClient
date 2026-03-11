import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyForNotFor() {
  const { config } = useConfig();
  const f = config.strategyLayout?.forNotFor || {};
  const forItems = f.forItems || [];
  const notForItems = f.notForItems || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-emerald-100 dark:border-emerald-800 min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined flex-shrink-0">check_circle</span>
            <span>{f.forTitle || 'Who This Is For'}</span>
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            {forItems.map((item, i) => (
              <li key={i} className="stagger-children-item flex items-start gap-3 text-slate-700 dark:text-slate-300 text-black text-sm sm:text-base min-w-0">
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5 flex-shrink-0">arrow_forward</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-red-100 dark:border-red-800 min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-red-800 dark:text-red-400 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined flex-shrink-0">cancel</span>
            <span>{f.notForTitle || 'Who This Is Not For'}</span>
          </h3>
          <ul className="space-y-3 sm:space-y-4">
            {notForItems.map((item, i) => (
              <li key={i} className="stagger-children-item flex items-start gap-3 text-slate-700 dark:text-slate-300 text-black text-sm sm:text-base min-w-0">
                <span className="material-symbols-outlined text-red-600 text-sm mt-0.5 flex-shrink-0">block</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
