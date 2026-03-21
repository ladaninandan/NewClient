import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';

function formatMmSs(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function useCountdown(endIso) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!endIso || !endIso.trim()) return;
    const end = new Date(endIso).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff <= 0) {
        setText('Offer Ends in 00:00 Mins');
        return;
      }
      const totalSecs = Math.floor(diff / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      setText(`Offer Ends in ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Mins`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endIso]);
  return text;
}

function useCountdownDuration(durationMinutes) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  useEffect(() => {
    if (!durationMinutes || durationMinutes < 1) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0) return totalSeconds;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [durationMinutes, totalSeconds]);
  return `Offer Ends in ${formatMmSs(remaining)} Mins`;
}

export function StrategyStickyBar() {
  const { config } = useConfig();
  const bar = config.strategyLayout?.stickyBar || {};
  const hasEndDate = bar.countdownEnd && String(bar.countdownEnd).trim();
  const durationMinutes = hasEndDate ? 0 : (bar.countdownDurationMinutes ?? 14);
  const countdownFromEnd = useCountdown(hasEndDate ? bar.countdownEnd : '');
  const countdownFromDuration = useCountdownDuration(durationMinutes);
  const scrollToForm = () => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });

  if (bar.enabled === false) return null;

  const price = bar.price ?? '₹99';
  const originalPrice = bar.originalPrice ?? '₹999';
  const buttonText = bar.buttonText ?? 'BOOK YOUR SPOT NOW AT ₹99/-';
  const countdownLabel = bar.countdownLabel ?? 'Offer Ends in 14:00 Mins';
  const displayCountdown = hasEndDate ? countdownFromEnd : (durationMinutes > 0 ? countdownFromDuration : countdownLabel);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
      style={{
        backgroundColor: 'var(--theme-background-light, #f8f7f5)',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black" style={{ color: 'var(--theme-primary)' }}>{price}</span>
            <span className="text-sm text-slate-500 line-through">{originalPrice}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate text-black">
            {displayCountdown}
          </p>
        </div>
        <button
          type="button"
          onClick={scrollToForm}
          className="flex-shrink-0 py-3 px-3 sm:px-5 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg btn-hover btn-blink text-center min-w-0 max-w-[55%] sm:max-w-none sm:whitespace-nowrap leading-tight"
          style={{ backgroundColor: 'var(--theme-primary)' }}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
