import React from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp, parseNumberValue } from '../../hooks/useCountUp';

/** Matches price-like tokens in text: ₹199, ₹99/-, 99/-, etc. */
const PRICE_IN_TEXT_REGEX = /(₹[\d,]+(?:\s*\/-)?|[\d,]+(?:\s*\/-))/g;

/**
 * Splits text into segments; price-like segments are returned as { type: 'number', value }.
 */
function splitTextWithNumbers(text) {
  if (!text || typeof text !== 'string') return [{ type: 'text', value: String(text || '') }];
  const parts = [];
  let lastIndex = 0;
  let m;
  PRICE_IN_TEXT_REGEX.lastIndex = 0;
  while ((m = PRICE_IN_TEXT_REGEX.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push({ type: 'text', value: text.slice(lastIndex, m.index) });
    parts.push({ type: 'number', value: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: 'text', value: text.slice(lastIndex) });
  return parts.length ? parts : [{ type: 'text', value: text }];
}

/**
 * Renders text with any price-like numbers (e.g. ₹199, ₹99/-) animating on scroll into view.
 * Use for button/CTA text. Wraps in a span with ref for in-view detection.
 */
export function TextWithAnimatedNumbers({ text, duration = 1500, className, style }) {
  const [ref, isInView] = useInView({ rootMargin: '0px 0px -40px 0px', threshold: 0.2 });
  const parts = React.useMemo(() => splitTextWithNumbers(text), [text]);
  return (
    <span ref={ref} className={className} style={style}>
      {parts.map((part, i) =>
        part.type === 'number' ? (
          <AnimatedNumber key={i} value={part.value} duration={duration} isInView={isInView} />
        ) : (
          <React.Fragment key={i}>{part.value}</React.Fragment>
        )
      )}
    </span>
  );
}

/**
 * Renders a number that counts up from 0 when the element scrolls into view.
 * value can be a number or string like "₹199", "15+", "₹4,999".
 * Pass isInView to control from parent (e.g. so multiple numbers animate together).
 * Respects prefers-reduced-motion (shows final number immediately).
 */
export function AnimatedNumber({ value, duration = 1500, className, style, formatNumber, isInView: isInViewProp }) {
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
