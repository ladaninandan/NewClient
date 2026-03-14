import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { AnimatedNumber } from './AnimatedNumber';

export function StrategyPricing() {
  const { config } = useConfig();
  const p = config.strategyLayout?.pricing || {};
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-12 sm:py-16 lg:py-20 dark:bg-slate-900 px-4 sm:px-6" style={{ backgroundColor: 'var(--theme-background-light)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="scroll-reveal bg-white dark:bg-slate-800 p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[2.5rem] shadow-2xl border-2 sm:border-4 relative overflow-hidden border-slate-200 dark:border-slate-700 hover-lift" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>
          <div
            className="absolute top-0 right-0 text-white py-1.5 px-6 sm:py-2 sm:px-10 rotate-45 translate-x-8 sm:translate-x-10 translate-y-4 sm:translate-y-6 font-bold text-xs sm:text-sm"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {p.ribbonText || 'BEST VALUE'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 text-slate-900 dark:text-white text-black px-2">{p.title || 'Start Your Transformation'}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
            <span className="text-slate-400 line-through text-lg sm:text-2xl">{p.originalPrice || '₹4,999'}</span>
            <AnimatedNumber value={p.price || '₹199'} className="text-4xl sm:text-5xl lg:text-6xl font-black" style={{ color: 'var(--theme-primary)' }} />
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">{p.note}</p>
          <button
            type="button"
            onClick={scrollToForm}
            className="w-full text-white text-base sm:text-xl font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl mb-4 btn-hover"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {p.ctaText || 'Reserve My ₹199 Strategy Session'}
          </button>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            {p.secureText || '100% Secure Checkout'}
          </p>
        </div>
      </div>
    </section>
  );
}
