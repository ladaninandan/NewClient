import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isInView]. Attach ref to the element; isInView becomes true when it enters the viewport.
 * @param {Object} options - { rootMargin?: string, threshold?: number }
 */
export function useInView(options = {}) {
  const { rootMargin = '0px 0px -60px 0px', threshold = 0.1 } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, isInView];
}
