import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyMoneyBackGuarantee() {
  const { config } = useConfig();
  const g = config.strategyLayout?.moneyBackGuarantee || {};
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  const title = g.title ?? 'Still Not Sure? We got your Back!';
  const subheading = g.subheading ?? 'Our Guarantee';
  const description = g.description ?? "Get this amazing offer today for just Rs 99, and get a money-back guarantee. Join today, go through our seminar and if you don't like it for any reason, simply send us an email and we'll refund every penny - no questions asked!";
  const ctaText = g.ctaText ?? 'REGISTER NOW AT ₹99/- ONLY';
  const imageUrl = (g.image || '').trim();

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 text-center mb-2 text-black pb-5" >
          {title}
        </h2>
        <div
          className="w-24 h-1 mx-auto rounded-full mb-10 sm:mb-12"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
         
          <div className="order-2 md:order-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 text-black">
              {subheading}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-6">
              {description}
            </p>
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full sm:w-auto block mx-auto md:mx-0 text-white font-bold text-sm sm:text-base py-4 px-6 sm:px-8 rounded-xl shadow-lg btn-hover uppercase tracking-wide"
              style={{
                background: `linear-gradient(135deg, var(--theme-primary) 0%, color-mix(in srgb, var(--theme-primary) 85%, white) 100%)`,
              }}
            >
              {ctaText}
            </button>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="100% Money Back Guaranteed"
                className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain"
              />
            ) : (
              <div
                className="w-64 h-64 rounded-full flex flex-col items-center justify-center text-slate-800 font-black border-4 border-amber-400 bg-amber-50/80"
                style={{ borderColor: 'var(--theme-primary)', backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, white)' }}
              >
                <span className="text-sm uppercase tracking-wider">Money Back</span>
                <span className="text-5xl my-1">100%</span>
                <span className="text-sm uppercase tracking-wider">Guaranteed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
