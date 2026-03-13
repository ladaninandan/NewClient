import React from 'react';
import { useConfig } from '../../context/ConfigContext';

function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  return /youtube\.com|youtu\.be/i.test(u);
}

function getYouTubeEmbedUrl(url) {
  const u = url.trim();
  const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : null;
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&showinfo=0&rel=0` : null;
}

export function StrategyTopVideo() {
  const { config } = useConfig();
  const t = config.strategyLayout?.topVideo || {};
  const badge = t.badge ?? 'Limited Time Strategy Session';
  const headline = t.headline ?? 'Is Your Business Running Because Of You… Or Despite You?';
  const videoUrl = (t.video || '').trim();
  const subtext = t.subtext ?? 'Transform your business from founder-dependent to data-driven. Get the roadmap to scaling without burnout.';
  const ctaText = t.ctaText ?? 'Reserve My ₹199 Strategy Session';
  const slotNote = t.slotNote ?? 'Limited slots available for this month';
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      className="relative overflow-hidden py-10 sm:py-7 lg:py-7 "
      style={{ backgroundColor: 'var(--theme-background-dark)' }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)', color: 'var(--theme-primary)' }}
        >
          {badge}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight mb-8 sm:mb-10 px-2">
          {headline}
        </h1>
        {videoUrl && (
          <div className="rounded-2xl overflow-hidden shadow-2xl mx-auto bg-black mb-8 sm:mb-10" style={{ maxWidth: '900px' }}>
            {isYouTubeUrl(videoUrl) ? (
              <div className="relative aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(videoUrl)}
                  title="Strategy session video"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                className="w-full aspect-video object-cover"
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                controls
                title="Strategy session video"
              />
            )}
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          <p className="text-emerald-100 text-base sm:text-lg lg:text-xl font-medium opacity-90 mb-6">
            {subtext}
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className="text-white font-bold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl btn-hover"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {ctaText}
          </button>
          <p className="text-emerald-200/60 text-sm italic mt-4">{slotNote}</p>
        </div>
      </div>
    </section>
  );
}
