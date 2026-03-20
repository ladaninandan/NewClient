import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyWhyScale() {
  const { config } = useConfig();
  const s = config.strategyLayout?.whyScale || {};
  const cards = s.cards || [];

  return (
    <section className="py-0 sm:py-16 lg:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="scroll-reveal text-center mb-10 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 text-slate-900 dark:text-white text-black px-2">
          {s.title || 'Why Most Businesses In India Never Scale'}
        </h2>
        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {(cards.length ? cards : [
          { icon: 'person_off', title: 'Everything depends on you', desc: "If you step away, things slow down or stop. You've created a job for yourself not a scalable business." },
          { icon: 'account_tree', title: 'Lack of Systems', desc: "Work happens because you manage it. Not because there's a clear system in place." },
          { icon: 'trending_flat', title: 'Growth has stopped', desc: "You're working more than before… but revenue is not increasing the same way." },
          { icon: 'group_off', title: 'No Delegation', desc: "You can't fully trust your team. Every important task comes back to you. You're the decision-maker for everything." },
          { icon: 'psychology', title: 'Mindset Trap', desc: "You're stuck in \"doing\" mode. Instead of building systems, you're constantly executing tasks." },
          { icon: 'schedule', title: 'Time Poverty', desc: "No time to think or plan. Your day is full… but there's no time to build the future." },
        ]).map((card, i) => (
          <div
            key={i}
            className="scroll-reveal bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group cursor-default"
          >
            <span
              className="material-symbols-outlined text-3xl sm:text-4xl mb-3 sm:mb-4 block transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
              style={{ color: 'var(--theme-primary)' }}
            >
              {card.icon || 'help'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900 dark:text-white text-black transition-colors duration-300">{card.title}</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
