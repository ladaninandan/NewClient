import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { AnimatedNumber } from './AnimatedNumber';

export function StrategyFinalCTA() {
  const { config } = useConfig();
  const c = config.strategyLayout?.finalCta || {};
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--theme-primary)' }}>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
          {c.headline || 'Stop Working IN Your Business. Start Working ON Your Business.'}
        </h2>
        <p className="text-slate-300 text-xl mb-10">{c.subtext || 'Only 12 slots remaining for this week at the discounted price.'}</p>
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 inline-block mb-10">
          <p className="text-white text-sm uppercase tracking-widest mb-2 font-bold">Limited Time Investment</p>
          <div className="flex items-center justify-center gap-4">
            <AnimatedNumber value={c.price || '₹199'} className="text-5xl font-black" style={{ color: 'var(--theme-accent)' }} />
            <span className="text-slate-400 line-through text-2xl">{c.originalPrice || '₹2,999'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={scrollToForm}
          className="w-full md:w-auto flex min-w-[320px] mx-auto cursor-pointer items-center justify-center rounded-xl h-16 px-10 text-white text-xl font-black shadow-2xl hover:scale-105 transition-transform"
          style={{ backgroundColor: 'var(--theme-accent)' }}
        >
          {c.ctaText || 'Book My ₹199 Strategy Session'}
        </button>
        <p className="text-slate-400 mt-6 text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">lock</span>
          {c.secureText || 'Secure Payment via Razorpay'}
        </p>
      </div>
    </section>
  );
}
