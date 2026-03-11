import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyWhyDifferent() {
  const { config } = useConfig();
  const w = config.strategyLayout?.whyDifferent || {};

  return (
    <section
      className="py-10 sm:py-14 lg:py-16 border-y px-4 sm:px-6"
      style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white text-black">{w.title || 'Why This Session Is Different?'}</h2>
        <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-500 leading-relaxed italic">{w.quote}</p>
      </div>
    </section>
  );
}
