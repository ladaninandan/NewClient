import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';

export function FAQSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.faq || {};
  const items = block.items || [];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {items.map((faq, i) => (
              <div key={i} className="card border-0 shadow-sm mb-2">
                <button
                  type="button"
                  className="btn btn-link text-start text-dark text-decoration-none w-100 d-flex justify-content-between align-items-center p-3"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="fw-semibold">{faq.q}</span>
                  <span>{openIndex === i ? '−' : '+'}</span>
                </button>
                {openIndex === i && (
                  <div className="px-3 pb-3 pt-0 small text-muted">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
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
