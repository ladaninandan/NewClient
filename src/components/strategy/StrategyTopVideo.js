import React from 'react';
import { useConfig } from '../../context/ConfigContext';

function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  return /youtube\.com|youtu\.be/i.test(u);
}

function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim().toLowerCase();
  return /\.(mp4|webm|mov|ogg|ogv)(\?|$)/i.test(u) || /\/video\//i.test(u);
}

function getYouTubeEmbedUrl(url) {
  const u = url.trim();
  const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const id = m ? m[1] : null;
  // autoplay=1, loop=1 + playlist=id so video restarts when it finishes
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&showinfo=0&rel=0&loop=1&playlist=${id}` : null;
}

export function StrategyTopVideo() {
  const { config } = useConfig();
  const t = config.strategyLayout?.topVideo || {};
  const topLine = t.topLine ?? '';
  const badge = t.badge ?? 'Limited Time Strategy Session';
  const headline = t.headline ?? 'Is Your Business Running Because Of You… Or Despite You?';
  const videoUrl = (t.video || '').trim();
  const rawBg = (t.backgroundImage || '').trim();
  // Resolve relative paths: "src/..." or "/..." → served from public folder
  const backgroundImageUrl = rawBg
    ? /^(https?:)?\/\//i.test(rawBg)
      ? rawBg
      : `${typeof window !== 'undefined' ? window.location.origin : ''}${process.env.PUBLIC_URL || ''}/${rawBg.replace(/^\/+/, '').replace(/^src\//, '')}`
    : '';
  const ctaText = t.ctaText ?? 'Reserve My ₹199 Strategy Session';
  const slotNote = t.slotNote ?? 'Limited slots available for this month';
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  const useVideoAsBackground = videoUrl && !isYouTubeUrl(videoUrl);
  const hasBackgroundMedia = backgroundImageUrl.length > 0;
  const backgroundIsVideo = hasBackgroundMedia && isVideoUrl(backgroundImageUrl);

  return (
    <section
      className="relative overflow-hidden py-4 sm:py-7 lg:py-7 min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] flex flex-col justify-center"
      style={{
        backgroundColor: useVideoAsBackground || hasBackgroundMedia ? 'transparent' : 'var(--theme-background-dark)',
      }}
    >
      {/* Back layer: background image or video (from admin — upload or paste URL) */}
      {hasBackgroundMedia && !backgroundIsVideo && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
      )}
      {hasBackgroundMedia && backgroundIsVideo && (
        <video
          key={backgroundImageUrl}
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundImageUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      )}
      {/* Video as full-bleed background (from main "Video" field, direct URL only) */}
      {useVideoAsBackground && (
        <video
          key={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      )}
      {/* Dot pattern when no video background and no background media */}
      {!useVideoAsBackground && !hasBackgroundMedia && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}
      {/* Dark blue overlay — 20% opacity (above video/image, below content) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)' }}
        aria-hidden
      />
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">

        <span
          className="scroll-reveal inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-2 text-white"
          style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 25%, transparent)' }}
        >
          {badge}
        </span>

        <h1 className="scroll-reveal text-1xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight mb-6 sm:mb-8 lg:mb-10 px-2">
          {headline}
        </h1>
        {topLine ? (
          <p className="scroll-reveal text-white/90 text-sm sm:text-base font-medium mb-2 px-2 pb-3">
            {topLine}
          </p>
        ) : null}
        {/* Inline video card — large and responsive */}
        {videoUrl && !useVideoAsBackground && (
          <div className="scroll-reveal rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mx-auto bg-black mb-6 sm:mb-8 lg:mb-10 w-full max-w-[1400px]">
            {isYouTubeUrl(videoUrl) ? (
              <div className="relative w-full aspect-video min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[540px]">
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
                className="w-full aspect-video object-cover min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[540px]"
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
        <div className="scroll-reveal max-w-2xl mx-auto px-2">
          <button
            type="button"
            onClick={scrollToForm}
            className="text-white font-bold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl btn-hover"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {ctaText}
          </button>
          <p className="text-emerald-200/60 text-sm italic mt-4 text-white">{slotNote}</p>
        </div>
      </div>
    </section>
  );
}
