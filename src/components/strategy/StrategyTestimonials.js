import React, { useRef } from 'react';
import { useConfig } from '../../context/ConfigContext';

function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /youtube\.com|youtu\.be/i.test(url.trim());
}

function getYouTubeEmbedUrl(url) {
  const u = (url || '').trim();
  const m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : null;
  return id ? `https://www.youtube.com/embed/${id}?autoplay=0&loop=1&playlist=${id}` : null;
}

function getCardAspectRatio(item, sectionRatio) {
  const ratio = (item?.aspectRatio && item.aspectRatio !== 'default' && item.aspectRatio !== 'auto')
    ? item.aspectRatio
    : (sectionRatio && sectionRatio !== 'auto' ? sectionRatio : null);

  if (ratio === '9:16' || ratio === '9/16') {
    return { style: { aspectRatio: '9 / 16' }, className: 'aspect-[9/16]' };
  }
  if (ratio === '4:5' || ratio === '4/5') {
    return { style: { aspectRatio: '4 / 5' }, className: 'aspect-[4/5]' };
  }
  if (ratio === '1:1' || ratio === '1/1') {
    return { style: { aspectRatio: '1 / 1' }, className: 'aspect-square' };
  }
  if (ratio === '16:9' || ratio === '16/9') {
    return { style: { aspectRatio: '16 / 9' }, className: 'aspect-video' };
  }

  // Auto default:
  // Both images and videos default to 9:16 so images have the exact same height as videos
  if (item?.video && item.video.trim()) {
    const isYt = /youtube\.com|youtu\.be/i.test(item.video);
    const isYtShort = /youtube\.com\/shorts/i.test(item.video);
    if (isYt && !isYtShort) {
      return { style: { aspectRatio: '16 / 9' }, className: 'aspect-video' };
    }
    return { style: { aspectRatio: '9 / 16' }, className: 'aspect-[9/16]' };
  }

  // Default image to 9:16 matching video height
  return { style: { aspectRatio: '9 / 16' }, className: 'aspect-[9/16]' };
}

export function StrategyTestimonials() {
  const { config } = useConfig();
  const scrollRef = useRef(null);
  const t = config.strategyLayout?.testimonials || {};
  const title = t.title ?? 'What Founders Say';
  const sectionRatio = t.aspectRatio || 'auto';
  const rawItems = t.items || [];
  const displayItems = rawItems.filter(
    (it) => it != null && typeof it === 'object' && ((it.video || '').trim() || (it.image || '').trim() || (it.details || it.text || '').trim())
  );

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (!displayItems.length) return null;

  return (
    <section className="py-5 sm:py-10 lg:py-12 px-4 sm:px-6" style={{ backgroundColor: 'var(--theme-background-light)' }}>
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
            {displayItems.map((item, i) => {
              const videoUrl = (item.video || '').trim();
              const imageUrl = (item.image || '').trim();
              const isYt = isYouTubeUrl(videoUrl);
              const embedUrl = isYt ? getYouTubeEmbedUrl(videoUrl) : null;
              const aspect = getCardAspectRatio(item, sectionRatio);

              return (
                <div
                  key={i}
                  className="scroll-reveal flex-shrink-0 w-[85vw] max-w-[320px] sm:w-auto sm:min-w-0 sm:max-w-none snap-start bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div
                    className={`w-full bg-black relative overflow-hidden flex-shrink-0 ${aspect.className}`}
                    style={aspect.style}
                  >
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
                        poster={imageUrl || undefined}
                        controls
                        playsInline
                        title={item.name ? `Testimonial from ${item.name}` : 'Founder testimonial'}
                      />
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name ? `Testimonial from ${item.name}` : 'Founder testimonial'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                        No media
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                    {(item.details || item.text) && (
                      <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium mb-3">
                        {item.details || item.text}
                      </p>
                    )}
                    {((item.name && item.name.trim()) || (item.role && item.role.trim()) || (item.buttonText && item.buttonText.trim())) && (
                      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/80">
                        {((item.name && item.name.trim()) || (item.role && item.role.trim())) && (
                          <div className="flex items-center gap-3">
                            {imageUrl && videoUrl && (
                              <img
                                src={imageUrl}
                                alt={item.name || ''}
                                className="w-10 h-10 rounded-full object-cover border-2 flex-shrink-0"
                                style={{ borderColor: 'var(--theme-primary)' }}
                              />
                            )}
                            <div>
                              {item.name && item.name.trim() && (
                                <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                                  {item.name}
                                </p>
                              )}
                              {item.role && item.role.trim() && (
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                                  {item.role}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {(item.buttonText || item.ctaText) && (
                          <a
                            href={(item.buttonUrl || item.ctaUrl || '#pricing').trim()}
                            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow hover:opacity-95 text-center"
                            style={{ backgroundColor: 'var(--theme-primary)' }}
                          >
                            {item.buttonIcon && (
                              <span className="material-symbols-outlined text-sm sm:text-base">{item.buttonIcon}</span>
                            )}
                            <span>{item.buttonText || item.ctaText}</span>
                          </a>
                        )}
                      </div>
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
