import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyModel() {
  const { config } = useConfig();
  const m = config.strategyLayout?.founderModel || {};
  const steps = m.steps || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 text-slate-900 dark:text-white text-black px-2">
            {m.title || 'The Founder Freedom Model'}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">{m.subtitle || 'The 4 stages of business evolution'}</p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center relative hover-lift stagger-children-item"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-white shadow-lg text-sm sm:text-base"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                {step.num}
              </div>
              <h4 className="font-bold mb-1 sm:mb-2 text-slate-900 dark:text-white text-black text-sm sm:text-base">{step.title}</h4>
              <p className="text-xs text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
