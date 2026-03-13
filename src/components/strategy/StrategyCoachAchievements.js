import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useInView } from '../../hooks/useInView';
import { AnimatedNumber } from './AnimatedNumber';

const DEFAULT_ICONS = ['groups', 'trending_up', 'schedule', 'handshake'];

export function StrategyCoachAchievements() {
  const { config } = useConfig();
  const section = config.strategyLayout?.coachAchievements || {};
  const achievements = section.achievements ?? config.strategyLayout?.coach?.achievements ?? [];
  const theme = section;
  const [ref, isInView] = useInView({ rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

  const heading = section.heading?.trim();
  const sectionBg = section.sectionBg?.trim();
  const sectionPadding = section.sectionPadding?.trim();
  const sectionMargin = section.sectionMargin?.trim();
  const iconBg = theme.iconBg?.trim() || 'var(--theme-primary)';
  const iconColor = theme.iconColor?.trim() || '#ffffff';
  const cardBg = theme.cardBg?.trim();
  const numberColor = theme.numberColor?.trim();
  const descriptionColor = theme.descriptionColor?.trim();

  if (!Array.isArray(achievements) || achievements.length === 0) return null;

  const sectionStyle = {};
  if (sectionBg) sectionStyle.backgroundColor = sectionBg;
  if (sectionPadding) sectionStyle.padding = sectionPadding;
  if (sectionMargin) sectionStyle.margin = sectionMargin;

  return (
    <section
      className={`overflow-hidden ${!sectionPadding ? 'py-10 sm:py-14 lg:py-20 px-4 sm:px-6' : ''}`}
      style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
    >
      <style>{`
        @keyframes coachAchieveSlide {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .coach-achieve-card { opacity: 0; }
        .coach-achieve-inview .coach-achieve-card {
          animation: coachAchieveSlide 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .coach-achieve-inview .coach-achieve-card:nth-child(1) { animation-delay: 0.06s; }
        .coach-achieve-inview .coach-achieve-card:nth-child(2) { animation-delay: 0.14s; }
        .coach-achieve-inview .coach-achieve-card:nth-child(3) { animation-delay: 0.22s; }
        .coach-achieve-inview .coach-achieve-card:nth-child(4) { animation-delay: 0.3s; }
        @media (prefers-reduced-motion: reduce) {
          .coach-achieve-card { opacity: 1; animation: none !important; }
        }
      `}</style>
      <div ref={ref} className="max-w-6xl mx-auto">
        {heading && (
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white text-center mb-8 sm:mb-10">
            {heading}
          </h2>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 ${isInView ? 'coach-achieve-inview' : ''}`}>
        {achievements.map((a, i) => {
          const icon = a.icon || DEFAULT_ICONS[i] || 'star';
          const cardStyle = cardBg ? { backgroundColor: cardBg } : undefined;
          const numberStyle = numberColor ? { color: numberColor } : undefined;
          const descStyle = descriptionColor ? { color: descriptionColor } : undefined;
          return (
            <div
              key={i}
              className={`coach-achieve-card group rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-center sm:text-left items-center sm:items-start ${!cardBg ? 'bg-white dark:bg-slate-800' : ''}`}
              style={cardStyle}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: iconBg, color: iconColor }}
              >
                <span className="material-symbols-outlined text-3xl sm:text-4xl" aria-hidden>
                  {icon}
                </span>
              </div>
              <p
                className={`text-3xl sm:text-3xl lg:text-3xl font-black tabular-nums mb-2 ${!numberColor ? 'text-black dark:text-white' : ''}`}
                style={numberStyle}
              >
                <AnimatedNumber value={a.value} isInView={isInView} />
              </p>
              <p
                className={`text-sm sm:text-base leading-relaxed font-medium ${!descriptionColor ? 'text-black/80 dark:text-slate-300' : ''}`}
                style={descStyle}
              >
                {a.description}
              </p>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
