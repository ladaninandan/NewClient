import React from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp, parseNumberValue } from '../../hooks/useCountUp';

/**
 * Renders a number that counts up from 0 when the element scrolls into view.
 * value can be a number or string like "₹199", "15+", "₹4,999".
 * Pass isInView to control from parent (e.g. so multiple numbers animate together).
 * Respects prefers-reduced-motion (shows final number immediately).
 */
export function AnimatedNumber({ value, duration = 700, className, style, formatNumber, isInView: isInViewProp }) {
  const [ref, isInViewFromHook] = useInView({ rootMargin: '0px 0px -40px 0px', threshold: 0.2 });
  const isInView = typeof isInViewProp === 'boolean' ? isInViewProp : isInViewFromHook;
  const { prefix, number: end, suffix } = parseNumberValue(value);
  const current = useCountUp(isInView, end, duration);

  const display =
    typeof formatNumber === 'function'
      ? formatNumber(current)
      : current >= 1000
        ? current.toLocaleString('en-IN')
        : String(current);

  return (
    <span ref={typeof isInViewProp === 'boolean' ? undefined : ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  );
}
