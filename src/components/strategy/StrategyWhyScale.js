import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyWhyScale() {
  const { config } = useConfig();
  const s = config.strategyLayout?.whyScale || {};
  const cards = s.cards || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 text-slate-900 dark:text-white text-black px-2">
          {s.title || 'Why Most Businesses In India Never Scale'}
        </h2>
        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {(cards.length ? cards : [
          { icon: 'person_off', title: 'Owner Reliance', desc: "Everything stops when you take a day off. You've created a job, not a business." },
          { icon: 'account_tree', title: 'Lack of Systems', desc: 'Processes are stored in your head. Scaling is impossible because nobody else knows how to do it.' },
          { icon: 'trending_flat', title: 'Plateaued Growth', desc: "You've hit a ceiling. You're working harder, but your revenue isn't moving proportionately." },
        ]).map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <span
              className="material-symbols-outlined text-3xl sm:text-4xl mb-3 sm:mb-4 block"
              style={{ color: 'var(--theme-primary)' }}
            >
              {card.icon || 'help'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white text-black">{card.title}</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
