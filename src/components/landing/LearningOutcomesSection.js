import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function LearningOutcomesSection() {
  const { config } = useConfig();
  const block = config.learningOutcomes || {};
  const items = block.items || [];

  return (
    <section className="py-4">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            {items.map((item, i) => (
              <div key={i} className="d-flex align-items-start gap-3 mb-4">
                <span
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                  style={{ width: '40px', height: '40px', backgroundColor: 'var(--bs-primary)', fontSize: '0.85rem' }}
                >
                  {item.number || String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="fw-bold text-dark mb-1">{item.title}</p>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
