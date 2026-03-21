import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { AnimatedNumber } from './AnimatedNumber';

export function StrategyPriceJustification() {
  const { config } = useConfig();
  const j = config.strategyLayout?.priceJustification || {};
  const theme = config.strategyLayout?.theme || {};
  const primary = theme.primary || '#f77c18';

  const title = j.title || 'Why This Session Is Only ₹199';
  const explain = j.explain || 'Normally consulting sessions cost thousands. But this session is offered at ₹199 so business owners can experience the process.';
  const ctaText = j.ctaText || 'Reserve My ₹199 Strategy Session';

  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
  const paragraphs = (explain || '').split(/\n\n+/).filter(Boolean);

  return (
    <section className="relative py-5 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <style>{`
        @keyframes priceJustifySlideLeft {
          from { opacity: 0; transform: translateX(-32px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes priceJustifySlideRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-on-scroll.in-view .price-justify-card {
          animation: priceJustifySlideLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-on-scroll.in-view .price-justify-label { animation: priceJustifySlideRight 0.5s ease-out 0.1s forwards; opacity: 0; }
        .animate-on-scroll.in-view .price-justify-title { animation: priceJustifySlideRight 0.5s ease-out 0.2s forwards; opacity: 0; }
        .animate-on-scroll.in-view .price-justify-body { animation: priceJustifySlideRight 0.5s ease-out 0.3s forwards; opacity: 0; }
        .animate-on-scroll.in-view .price-justify-cta { animation: priceJustifySlideRight 0.5s ease-out 0.45s forwards; opacity: 0; }
        .price-justify-card-inner {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .price-justify-card-inner:hover {
          transform: scale(1.05) rotate(-2deg);
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.2);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll.in-view .price-justify-card,
          .animate-on-scroll.in-view .price-justify-label,
          .animate-on-scroll.in-view .price-justify-title,
          .animate-on-scroll.in-view .price-justify-body,
          .animate-on-scroll.in-view .price-justify-cta { animation: none; opacity: 1; }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: price visual */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-end">
            <div className="scroll-reveal relative price-justify-card">
              <div
                className="price-justify-card-inner w-44 h-44 sm:w-52 sm:h-52 rounded-3xl flex flex-col items-center justify-center shadow-xl border-4 border-white dark:border-slate-700"
                style={{
                  backgroundColor: primary,
                  boxShadow: `0 20px 40px -12px ${primary}40, 0 0 0 1px rgba(0,0,0,0.05)`,
                }}
              >
                <span className="text-white/90 text-sm sm:text-base font-bold tracking-widest uppercase">Only</span>
                <AnimatedNumber value="₹199" className="text-white text-4xl sm:text-5xl font-black mt-1" />
                <span className="text-white/80 text-xs sm:text-sm mt-1 font-medium">Session</span>
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl bg-slate-200/50 dark:bg-slate-600/30 -z-10" />
            </div>
          </div>

          {/* Right: copy + CTA */}
          <div className="scroll-reveal lg:col-span-7 order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="price-justify-label text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: primary }}>
              Value without the barrier
            </p>
            <h2 className="price-justify-title text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-5 sm:mb-6 leading-tight text-black">
              {title}
            </h2>
            <div className="price-justify-body space-y-3 text-slate-800 dark:text-slate-700 text-base sm:text-lg leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={scrollToForm}
              className="price-justify-cta mt-7 sm:mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white shadow-lg btn-hover"
              style={{ backgroundColor: primary }}
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
