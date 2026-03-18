import React, { useRef } from 'react';
import { useConfig } from '../../context/ConfigContext';

function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /youtube\.com|youtu\.be/i.test(url.trim());
}

function getYouTubeEmbedUrl(url) {
  const u = (url || '').trim();
  const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : null;
  return id ? `https://www.youtube.com/embed/${id}?autoplay=0&loop=1&playlist=${id}` : null;
}

export function StrategyTestimonials() {
  const { config } = useConfig();
  const scrollRef = useRef(null);
  const t = config.strategyLayout?.testimonials || {};
  const title = t.title ?? 'What Founders Say';
  const rawItems = t.items || [];
  const videoItems = rawItems.filter((it) => it != null && typeof it === 'object' && (it.video || '').trim());

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (!videoItems.length) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6" style={{ backgroundColor: 'var(--theme-background-light)' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="scroll-reveal text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white text-center mb-8 sm:mb-10 text-black">
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
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-scroll overflow-y-hidden snap-x snap-mandatory sm:overflow-visible sm:snap-none pb-2 sm:pb-0 px-4 sm:px-0 scrollbar-none overscroll-x-contain min-w-0"
            style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
          >
            {videoItems.map((item, i) => {
              const videoUrl = (item.video || '').trim();
              const isYt = isYouTubeUrl(videoUrl);
              const embedUrl = isYt ? getYouTubeEmbedUrl(videoUrl) : null;
              return (
                <div
                  key={i}
                  className="scroll-reveal flex-shrink-0 w-[85vw] max-w-[320px] sm:w-auto sm:min-w-0 sm:max-w-none snap-start bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  <div className="aspect-video bg-black relative">
                    {isYt && embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={item.name ? `Testimonial from ${item.name}` : 'Founder testimonial'}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : videoUrl ? (
                      <video
                        className="w-full h-full object-cover"
                        src={videoUrl}
                        controls
                        playsInline
                        title={item.name ? `Testimonial from ${item.name}` : 'Founder testimonial'}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                        No video
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {(item.details || item.text) && (
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
                        {item.details || item.text}
                      </p>
                    )}
                    {item.name && (
                      <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base" style={{ color: 'var(--theme-primary)' }}>
                        {item.name}
                      </p>
                    )}
                    {item.role && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.role}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
