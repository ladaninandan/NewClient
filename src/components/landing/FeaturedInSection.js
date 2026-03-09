import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useConfig } from '../../context/ConfigContext';

const ITEM_WIDTH = 150;
const GAP = 12;
const AUTO_SCROLL_DELAY_MS = 3000;

export function FeaturedInSection() {
  const { config } = useConfig();
  const logos = config.featuredLogos || [];
  const scrollRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const updateCenterIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || logos.length === 0) return;
    const scrollLeft = el.scrollLeft;
    const containerCenter = el.clientWidth / 2;
    const itemTotalWidth = ITEM_WIDTH + GAP;
    const index = Math.round((scrollLeft + containerCenter - itemTotalWidth / 2) / itemTotalWidth);
    const clamped = Math.max(0, Math.min(index, logos.length - 1));
    setCenterIndex(clamped);
  }, [logos.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || logos.length === 0) return;
    const onScroll = () => updateCenterIndex();
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [logos.length, updateCenterIndex]);

  useEffect(() => {
    if (logos.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const next = (centerIndex + 1) % logos.length;
      setCenterIndex(next);
      const itemTotalWidth = ITEM_WIDTH + GAP;
      const scrollTo = next * itemTotalWidth - el.clientWidth / 2 + ITEM_WIDTH / 2;
      el.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
    }, AUTO_SCROLL_DELAY_MS);
    return () => clearInterval(id);
  }, [centerIndex, logos.length]);

  if (logos.length === 0) {
    return (
      <section className="py-4">
        <div className="container text-center">
          <h3 className="h5 text-muted mb-4">Featured in</h3>
          <p className="text-muted small mb-0">Add logos in Admin → Site settings → Featured logos</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-secondary bg-gradient bg-opacity-25">
      <div className="container">
        <h3 className="h5 text-muted text-center mb-4">Featured in</h3>
        <div
          ref={scrollRef}
          className="d-flex align-items-center overflow-auto hide-scrollbar py-3"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingLeft: 'max(1rem, calc(50% - 1.5rem - 90px))',
            paddingRight: 'max(1rem, calc(50% - 1.5rem - 90px))',
          }}
          onScroll={updateCenterIndex}
        >
          {logos.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 d-flex align-items-center justify-content-center transition-transform"
              style={{
                width: ITEM_WIDTH,
                minWidth: ITEM_WIDTH,
                marginRight: i < logos.length - 1 ? GAP : 0,
                scrollSnapAlign: 'center',
                transform: i === centerIndex ? 'scale(1.35)' : 'scale(0.82)',
                transition: 'transform 0.35s ease-out',
              }}
            >
              <img
                src={src}
                alt={`Featured ${i + 1}`}
                className="img-fluid"
                style={{
                  maxHeight: i === centerIndex ? '52px' : '36px',
                  opacity: i === centerIndex ? 1 : 0.85,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
