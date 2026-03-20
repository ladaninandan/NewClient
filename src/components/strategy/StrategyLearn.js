import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyLearn() {
  const { config } = useConfig();
  const l = config.strategyLayout?.learn || {};
  const items = l.items || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 text-white" style={{ backgroundColor: 'var(--theme-background-dark)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="scroll-reveal text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 px-2">{l.title || 'What You Will Learn In The 1-to-1 Session'}</h2>
          <p className="text-emerald-100/70 text-sm sm:text-base">{l.subtitle || 'A deep dive into your business operations and scaling potential.'}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <div key={i} className="scroll-reveal stagger-children-item flex gap-3 sm:gap-4 min-w-0">
              <span className="material-symbols-outlined flex-shrink-0 text-2xl sm:text-3xl" style={{ color: 'white' }}>
                {item.icon || 'check_circle'}
              </span>
              <p className="font-medium text-emerald-50 text-sm sm:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
