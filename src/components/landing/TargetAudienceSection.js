import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function TargetAudienceSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.targetAudience || {};

  return (
    <section className="py-4">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <div className="text-center">
          <button
            type="button"
            className="btn btn-lg px-4 text-white border-0 rounded-3 fw-bold"
            style={{ backgroundColor: 'var(--bs-primary)' }}
            onClick={scrollToForm}
          >
            {block.ctaText || config.ctaButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}
