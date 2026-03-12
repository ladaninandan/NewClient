import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyFAQ() {
  const { config } = useConfig();
  const faq = config.strategyLayout?.faq || {};
  const items = faq.items || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl sm:text-3xl font-black mb-8 sm:mb-12 text-slate-900 dark:text-white text-black">
        {faq.title || 'Frequently Asked Questions'}
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700"
            open={i === 0}
          >
            <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-base sm:text-lg text-slate-900 dark:text-white">
              
              <span className='text-black'>{item.q}</span>

              {/* + / - Icon */}
              <span className="text-xl font-bold transition-transform duration-300 group-open:rotate-45 text-black">
                +
              </span>

            </summary>

            <p className="mt-3 sm:mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {item.a}
            </p>

          </details>
        ))}
      </div>
    </section>
  );
}