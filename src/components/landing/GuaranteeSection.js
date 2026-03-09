import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function GuaranteeSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.guarantee || {};

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <p className="text-center text-dark mb-4">{block.text}</p>
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-lg text-white border-0 rounded-3 fw-bold"
            style={{ backgroundColor: 'var(--bs-primary)' }}
            onClick={scrollToForm}
          >
            {config.ctaButtonText}
          </button>
        </div>
        {block.promiseTitle && (
          <div className="card border-0 shadow-sm p-4">
            <h3 className="h6 fw-bold">{block.promiseTitle}</h3>
            <p className="small text-muted">{block.promiseSubtitle}</p>
            <p className="small text-dark mb-0" style={{ whiteSpace: 'pre-line' }}>{block.promiseLetter}</p>
          </div>
        )}
      </div>
    </section>
  );
}
