import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function TestimonialsSection() {
  const { config } = useConfig();
  const block = config.testimonials || {};
  const items = block.items || [];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-2">{block.title}</h2>
        {block.subtitle && (
          <p className="text-center text-muted mb-4">{block.subtitle}</p>
        )}
        <div className="row g-4">
          {items.map((t, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 p-3">
                <p className="small text-dark mb-3">&ldquo;{t.quote}&rdquo;</p>
                <p className="fw-bold mb-0 small">{t.name}</p>
                {t.company && <p className="text-muted small mb-0">{t.company}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
