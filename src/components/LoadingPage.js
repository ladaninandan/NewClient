import React from 'react';

// Rough luminance for hex: light bg => use dark text
function isLightBg(hex) {
  if (!hex || typeof hex !== 'string') return false;
  const h = hex.replace(/^#/, '');
  if (h.length !== 6 && h.length !== 3) return false;
  const r = h.length === 6 ? parseInt(h.slice(0, 2), 16) : parseInt(h[0] + h[0], 16);
  const g = h.length === 6 ? parseInt(h.slice(2, 4), 16) : parseInt(h[1] + h[1], 16);
  const b = h.length === 6 ? parseInt(h.slice(4, 6), 16) : parseInt(h[2] + h[2], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

/**
 * Full-screen loading experience with animated brand, progress bar, and subtle motion.
 * Logo is from admin (strategyLayout.nav.logo). Background is white.
 */
export function LoadingPage({ backgroundColor, primaryColor, logo, fontFamily } = {}) {
  const bg = backgroundColor || '#ffffff';
  const primary = primaryColor || '#1845f7ff';
  const logoUrl = (logo || '').trim();
  const light = isLightBg(bg);
  const textClass = light ? 'text-slate-900' : 'text-white';
  const mutedClass = light ? 'text-slate-500' : 'text-white/60';
  const barTrackClass = light ? 'bg-slate-300/50' : 'bg-white/10';
  const gridColor = light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative bg-white"
      style={{ backgroundColor: bg, fontFamily: fontFamily || undefined }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 40%, ${primary}40, transparent 55%)`,
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Logo from admin (nav.logo) or fallback initial */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-8 loader-logo overflow-hidden bg-white border border-slate-200"
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" />
          ) : (
            <span
              className="text-3xl sm:text-4xl font-black"
              style={{ color: primary }}
            >
              R
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className={`${textClass} text-xl sm:text-2xl font-bold tracking-tight mb-1 text-center`}>
          Business Clarity Session
        </h1>
        <p className={`${mutedClass} text-sm sm:text-base mb-10`}>
          Preparing your experience…
        </p>

        {/* Animated progress bar */}
        <div className={`w-56 sm:w-72 h-1.5 rounded-full ${barTrackClass} overflow-hidden`}>
          <div
            className="loader-progress h-full rounded-full"
            style={{
              backgroundColor: primary,
              boxShadow: `0 0 20px ${primary}80`,
            }}
          />
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-8 loader-dots">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full loader-dot"
              style={{
                backgroundColor: primary,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .loader-logo {
          animation: loader-pulse 2s ease-in-out infinite;
        }
        @keyframes loader-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .loader-progress {
          width: 30%;
          animation: loader-progress 1.8s ease-in-out infinite;
        }
        @keyframes loader-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(220%); }
          100% { transform: translateX(-100%); }
        }
        .loader-dot {
          animation: loader-bounce 0.6s ease-in-out infinite both;
        }
        .loader-dots .loader-dot:nth-child(1) { animation-delay: 0s; }
        .loader-dots .loader-dot:nth-child(2) { animation-delay: 0.1s; }
        .loader-dots .loader-dot:nth-child(3) { animation-delay: 0.2s; }
        @keyframes loader-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-logo, .loader-progress, .loader-dot { animation: none; }
          .loader-progress { width: 60%; transform: none; }
        }
      `}</style>
    </div>
  );
}
