import { useEffect } from 'react';

const TEXT_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, li, label';

/**
 * Observes all .scroll-reveal elements inside .strategy-landing and adds .in-view when they enter the viewport.
 * Also adds .scroll-reveal to all text elements (headings, p, li) so every text gets the scroll animation.
 */
export function ScrollRevealObserver({ dependency } = {}) {
  useEffect(() => {
    let observer = null;
    const id = requestAnimationFrame(() => {
      const root = document.querySelector('.strategy-landing');
      if (!root) return;

      // Apply scroll-reveal to all text: standalone text gets .scroll-reveal; text inside cards gets .scroll-reveal-text (transform-only)
      const textEls = root.querySelectorAll(TEXT_SELECTOR);
      textEls.forEach((el) => {
        if (el.classList.contains('scroll-reveal') || el.classList.contains('scroll-reveal-text')) return;
        const revealParent = el.closest('.scroll-reveal');
        if (revealParent && revealParent !== el) {
          el.classList.add('scroll-reveal-text');
        } else {
          el.classList.add('scroll-reveal');
        }
      });

      const nodes = root.querySelectorAll('.scroll-reveal, .scroll-reveal-text');
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.06 }
      );

      nodes.forEach((el) => observer.observe(el));
    });
    return () => {
      cancelAnimationFrame(id);
      if (observer) observer.disconnect();
    };
  }, [dependency]);

  return null;
}
