import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function BonusesSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.bonuses || {};
  const images = block.productImages || [];

  return (
    <section className="py-4">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        {images.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Bonus ${i + 1}`}
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: '160px', objectFit: 'cover' }}
              />
            ))}
          </div>
        )}
        <div className="text-center">
          <button
            type="button"
            className="btn btn-lg px-4 text-white border-0 rounded-3"
            style={{ backgroundColor: 'var(--bs-primary)' }}
            onClick={scrollToForm}
          >
            {config.ctaButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}
