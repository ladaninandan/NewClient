import React from 'react';
import { useInView } from '../../hooks/useInView';

/**
 * Wraps children and fades them in + slides up when they scroll into view.
 * @param {string} [className] - Extra classes for the wrapper
 * @param {string} [stagger] - Optional '1'..'5' for delay
 * @param {string} [as='div'] - Wrapper element
 */
export function AnimateOnScroll({ children, className = '', stagger, as: Tag = 'div' }) {
  const [ref, isInView] = useInView({ rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
  const staggerClass = stagger ? ` stagger-${stagger}` : '';
  return (
    <Tag
      ref={ref}
      className={`animate-on-scroll${isInView ? ' in-view' : ''}${staggerClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
