import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const coral = '#F87060';

export function TargetAudienceSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.targetAudience || {};
  const items = block.items || [];
  const hasCustomImage = !!block.image;

  return (
    <section className="py-5 bg-white pt-5">
      <div className="container">
        <h2 className="h4 fw-bold text-center text-dark mb-2" style={{ lineHeight: 1.3 }}>
          Who This Workshop Will
          <br />
          {block.titleLine2 || 'Help The Best?'}
        </h2>
        <div
          className="mx-auto mb-4 mt-4"
          style={{
            width: '48px',
            height: '3px',
            borderRadius: '2px',
            backgroundColor: coral,
          }}
        />

        {hasCustomImage ? (
          <div className="text-center mb-4">
            <img
              src={block.image}
              alt={block.dontJoinLabel || "Don't join if"}
              className="img-fluid rounded-3"
              style={{ maxHeight: '360px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div className="row align-items-center justify-content-center g-4 mb-4">
            <div className="col-auto">
              <p className="fw-bold text-dark text-uppercase mb-0" style={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                {block.dontJoinLabel || "DON'T JOIN IF"}
              </p>
            </div>
            <div className="col-12 col-md-8 col-lg-6">
              <div className="position-relative d-flex align-items-center" style={{ minHeight: '200px' }}>
                {/* Segmented semi-circle (left half, 3 segments) */}
                <svg
                  viewBox="0 0 120 120"
                  className="flex-shrink-0"
                  style={{ width: '180px', height: '180px' }}
                >
                  <path d="M60 60 L60 20 A40 40 0 0 1 40 94.64 Z" fill={coral} />
                  <path d="M60 60 L40 94.64 A40 40 0 0 1 20 60 Z" fill={coral} />
                  <path d="M60 60 L20 60 A40 40 0 0 1 60 100 Z" fill={coral} />
                </svg>
                {/* Leader lines + text */}
                <div className="ms-3 flex-grow-1">
                  {items.slice(0, 3).map((text, i) => (
                    <div key={i} className="d-flex align-items-center mb-2">
                      <svg width="24" height="16" className="flex-shrink-0">
                        <line x1="0" y1="8" x2="20" y2="8" stroke="#ccc" strokeWidth="1" />
                      </svg>
                      <span className="text-dark small ms-1">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-5">
          <button
            type="button"
            className="btn btn-lg border-0 rounded-4 fw-bold text-white text-uppercase px-5 py-3 shadow"
            style={{
              background: 'linear-gradient(90deg, #E85A2E 0%, #F5A623 100%)',
              fontSize: '0.9rem',
            }}
            onClick={scrollToForm}
          >
            {block.ctaText || config.ctaButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}
