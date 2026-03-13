import { useEffect, useState, useRef } from 'react';

/**
 * Parses a value like "₹199", "15+", "₹4,999" into { prefix, number, suffix }.
 * @param {string|number} value
 * @returns {{ prefix: string, number: number, suffix: string }}
 */
export function parseNumberValue(value) {
  if (value == null) return { prefix: '', number: 0, suffix: '' };
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return { prefix: '', number: Math.max(0, Math.floor(value)), suffix: '' };
  }
  const str = String(value).trim();
  const match = str.match(/^([^0-9]*)([\d,]+)(.*)$/);
  if (!match) return { prefix: str, number: 0, suffix: '' };
  const num = parseInt(match[2].replace(/,/g, ''), 10);
  return {
    prefix: match[1],
    number: Number.isNaN(num) ? 0 : Math.max(0, num),
    suffix: match[3] || '',
  };
}

/**
 * Animates from 0 to end when isInView is true. Respects prefers-reduced-motion.
 * @param {boolean} isInView
 * @param {number} end
 * @param {number} durationMs
 * @returns {number} current value to display
 */
export function useCountUp(isInView, end, durationMs = 700) {
  const [current, setCurrent] = useState(0);
  const started = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    if (!isInView || end <= 0) {
      setCurrent(end);
      return;
    }

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrent(end);
      return;
    }

    if (started.current) return;
    started.current = true;

    const startTime = performance.now();
    const easeOut = (t) => 1 - (1 - t) ** 2; // ease-out quad: fast start, smooth end

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeOut(t);
      const next = Math.round(eased * end);
      setCurrent(next);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setCurrent(end);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isInView, end, durationMs]);

  return current;
}
