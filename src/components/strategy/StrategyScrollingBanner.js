import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyScrollingBanner() {
  const { config } = useConfig();
  const items = config.strategyLayout?.scrollingBanner?.items || [
    'Limited Time Strategy Session',
    'Reserve Your Spot at ₹199',
    'Trusted by 500+ Founders',
    '1-to-1 Business Clarity Session',
    'Book Now — Limited Slots',
  ].filter(Boolean);

  if (!items.length) return null;

  const row = items.join('  •  ');
  const duplicated = [row, row, row].join('    ');

  return (
    <div
      className="scroll-reveal relative overflow-hidden py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-700"
      style={{ backgroundColor: 'var(--theme-background-light)' }}
    >
      <div
        className="scrolling-banner-inner flex whitespace-nowrap text-sm sm:text-base font-semibold"
        style={{
          animation: 'scroll-left 40s linear infinite',
          color: 'var(--theme-primary)',
        }}
      >
        <span className="inline-block px-4">{duplicated}</span>
      </div>
      <style>{`
        .scrolling-banner-inner { will-change: transform; }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
