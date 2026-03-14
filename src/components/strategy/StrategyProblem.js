import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyProblem() {
  const { config } = useConfig();
  const p = config.strategyLayout?.problem || {};
  const theme = config.strategyLayout?.theme || {};
  const primary = theme.primary || '#f77c18';

  const title =
    p.title ||
    'Are You Facing These Problems In Your Business?';

  const items = (p.items || [
    'Business cannot run without you',
    'Team lacks ownership',
    'Processes are unclear',
    'Revenue leaks happening silently',
    'Founder stuck in daily operations',
    'No clear systems for scaling',
  ]).filter(Boolean);

  const endLine =
    p.endLine ||
    'If this sounds familiar, you are not alone.';

  return (
    <section className="relative pt-4 sm:pt-14 px-4 sm:px-6 overflow-hidden">
      <style>{`
        @keyframes problemCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-on-scroll.in-view .problem-card {
          animation: problemCardIn 0.55s ease-out forwards;
          opacity: 0;
        }
        .animate-on-scroll.in-view .problem-card:nth-child(1) { animation-delay: 0.06s; }
        .animate-on-scroll.in-view .problem-card:nth-child(2) { animation-delay: 0.12s; }
        .animate-on-scroll.in-view .problem-card:nth-child(3) { animation-delay: 0.18s; }
        .animate-on-scroll.in-view .problem-card:nth-child(4) { animation-delay: 0.24s; }
        .animate-on-scroll.in-view .problem-card:nth-child(5) { animation-delay: 0.30s; }
        .animate-on-scroll.in-view .problem-card:nth-child(6) { animation-delay: 0.36s; }
        .animate-on-scroll.in-view .problem-card:nth-child(n+7) { animation-delay: 0.42s; }
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll.in-view .problem-card { animation: none; opacity: 1; }
        }
      `}</style>
      {/* Ambient background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${primary}, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--theme-background-light)_40%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Title block */}
        <div className="scroll-reveal text-center mb-12 sm:mb-16">
          <p
            className="inline-block text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 opacity-80"
            style={{ color: primary }}
          >
            Real challenges
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto text-black">
            {title}
          </h2>
        </div>

        {/* Bento grid of problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((text, i) => (
            <div
              key={i}
              className="scroll-reveal problem-card group relative rounded-2xl sm:rounded-[1.25rem] p-4 sm:p-5 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-600/60 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-500/80 transition-all duration-300 ease-out hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <div
                className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm opacity-90 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: primary }}
              >
                {i + 1}
              </div>
              <p className="text-slate-700 dark:text-slate-900 text-sm sm:text-base font-medium pl-10 sm:pl-11 leading-snug pt-0.5">
                {text}
              </p>
              <span
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 material-symbols-outlined text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: primary }}
              >
                arrow_forward
              </span>
            </div>
          ))}
        </div>

        {/* Closing line — pill / banner */}
        {endLine && (
          <div
            className="mt-10 sm:mt-12 flex justify-center"
            role="presentation"
          >
            <div
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-full border-2 shadow-md text-center"
              style={{
                borderColor: primary,
                backgroundColor: 'color-mix(in srgb, var(--theme-primary) 0.08%, transparent)',
              }}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl flex-shrink-0" style={{ color: primary }}>
                sentiment_satisfied
              </span>
              <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base font-semibold m-0 text-center text-black">
                {endLine}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
