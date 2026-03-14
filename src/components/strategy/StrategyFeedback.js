import React, { useRef } from 'react';
import { useConfig } from '../../context/ConfigContext';

export function StrategyFeedback() {
  const { config } = useConfig();
  const scrollRef = useRef(null);
  const t = config.strategyLayout?.testimonials || {};
  const f = config.strategyLayout?.feedback || {};
  const label = f.label ?? 'Feedbacks';
  const title = f.title ?? 'Here are some Real Screenshots & Feedbacks';

  // Show feedback cards only for the same people who have videos (4 videos uploaded in admin)
  const videoItems = (t.items || []).filter((it) => it != null && (it.video || '').trim());
  const feedbackItems = (f.items || []).filter((it) => it != null && typeof it === 'object');

  const items = videoItems.map((video, i) => {
    const fb = feedbackItems[i] || {};
    return {
      name: (video.name ?? fb.name ?? '').trim(),
      role: (video.role ?? fb.role ?? fb.company ?? '').trim(),
      text: (fb.text ?? fb.quote ?? '').trim(),
      image: (fb.image ?? fb.avatar ?? '').trim() || undefined,
    };
  }).filter((it) => it.name || it.role || it.text);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ backgroundColor: 'var(--theme-background-light)' }}>
      <div className="max-w-7xl mx-auto ">
        {label && (
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {label}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white text-center mb-8 sm:mb-10 text-black">
          {title}
        </h2>
        <div className="relative -mx-4 sm:mx-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:hidden btn-blink"
            style={{ color: 'var(--theme-primary)' }}
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 sm:hidden btn-blink"
            style={{ color: 'var(--theme-primary)' }}
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
          <div
            ref={scrollRef}
            className="flex sm:grid sm:grid-cols-2 gap-5 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory sm:overflow-visible sm:snap-none pb-2 sm:pb-0 px-4 sm:px-0 scrollbar-none"
          >
            {items.map((it, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85vw] sm:w-auto sm:min-w-0 snap-center bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 pt-14 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col border-0"
              >
                <div className="flex justify-center -mt-16 mb-4 pt-5">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md flex-shrink-0 bg-slate-200 dark:bg-slate-600">
                    {it.image ? (
                      <img src={it.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span
                        className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: 'var(--theme-primary)' }}
                      >
                        {(it.name || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {it.text ? (
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-5 flex-1 text-center px-1">
                    {it.text}
                  </p>
                ) : null}
                {it.name ? (
                  <p className="font-bold text-center text-base sm:text-lg mb-1" style={{ color: 'var(--theme-primary)' }}>
                    {it.name}
                  </p>
                ) : null}
                {it.role ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    {it.role}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
