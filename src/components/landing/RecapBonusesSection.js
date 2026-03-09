import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function RecapBonusesSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.recapBonuses || {};
  const items = block.items || [];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <div className="row g-3 mb-4">
          {items.map((item, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-3 d-flex justify-content-between align-items-center flex-row">
                <span className="small text-dark">{item.title}</span>
                <span className="badge bg-secondary">Priced At: {item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center p-4 rounded-3 bg-light">
          <p className="text-muted small mb-1">Total Value : {block.totalValue}</p>
          <p className="text-muted small mb-1">Regular Price : {block.regularPrice}</p>
          <p className="h4 fw-bold mb-3" style={{ color: 'var(--bs-primary)' }}>Today&apos;s Price : {block.todayPrice}</p>
          <button
            type="button"
            className="btn btn-lg text-white border-0 rounded-3 fw-bold"
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
