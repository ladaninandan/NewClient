import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const coral = '#F7705B';
const boxBg = '#FFEDE8';

export function WhatWillChangeSection() {
  const { config } = useConfig();
  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const block = config.whatWillChange || {};
  const items = block.items || [];
  const hasCustomImage = !!block.diagramImage;

  return (
    <section className="py-5" style={{ backgroundColor: 'lightgray' }}>
      <div className="container">
        <h2 className="h4 fw-bold text-center text-dark mb-2" style={{ lineHeight: 1.3 }}>
          What Will Change In Your
          <br />
          Business?
        </h2>
        <div
          className="mx-auto mb-4"
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
              src={block.diagramImage}
              alt={block.title}
              className="img-fluid rounded-3"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div
            className="position-relative mx-auto mb-4"
            style={{
              width: 'min(100%, 380px)',
              height: '340px',
            }}
          >
            {/* Dashed lines from center to boxes */}
            <svg
              className="position-absolute top-50 start-50 translate-middle"
              width="380"
              height="340"
              style={{ marginLeft: '-190px', marginTop: '-170px', pointerEvents: 'none' }}
            >
              <line x1="190" y1="170" x2="190" y2="50" stroke={coral} strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="190" y1="170" x2="70" y2="120" stroke={coral} strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="190" y1="170" x2="310" y2="120" stroke={coral} strokeWidth="1.5" strokeDasharray="6 4" />
            </svg>

            {/* Center circle */}
            <div
              className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center text-white fw-bold text-center rounded-circle border border-2 border-white shadow-sm"
              style={{
                width: '140px',
                height: '140px',
                marginLeft: '-70px',
                marginTop: '-70px',
                backgroundColor: coral,
                fontSize: '0.9rem',
                lineHeight: 1.2,
              }}
            >
              {block.centerLabel || 'Business Breakthrough'}
            </div>

            {/* Top box */}
            {items.find((i) => i.position === 'top') && (
              <div
                className="position-absolute start-50 translate-middle-x d-flex align-items-center justify-content-center text-center rounded-3 border border-2 px-3 py-2"
                style={{
                  top: '0',
                  width: '200px',
                  minHeight: '56px',
                  backgroundColor: boxBg,
                  borderColor: coral,
                  borderStyle: 'dashed',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#333',
                  lineHeight: 1.25,
                }}
              >
                {items.find((i) => i.position === 'top').text}
              </div>
            )}

            {/* Left box */}
            {items.find((i) => i.position === 'left') && (
              <div
                className="position-absolute top-50 translate-middle-y d-flex align-items-center justify-content-center text-center rounded-3 border border-2 px-3 py-2"
                style={{
                  left: '0',
                  width: '110px',
                  minHeight: '52px',
                  backgroundColor: boxBg,
                  borderColor: coral,
                  borderStyle: 'dashed',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  lineHeight: 1.25,
                }}
              >
                {items.find((i) => i.position === 'left').text}
              </div>
            )}

            {/* Right box */}
            {items.find((i) => i.position === 'right') && (
              <div
                className="position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center text-center rounded-3 border border-2 px-3 py-2"
                style={{
                  width: '110px',
                  minHeight: '52px',
                  backgroundColor: boxBg,
                  borderColor: coral,
                  borderStyle: 'dashed',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  lineHeight: 1.25,
                }}
              >
                {items.find((i) => i.position === 'right').text}
              </div>
            )}
          </div>
        )}

        {/* CTA button - gradient orange to yellow-orange */}
        <div className="text-center pt-4">
          <button
            type="button"
            className="btn btn-lg border-0 rounded-4 fw-bold text-white px-5 py-3 shadow"
            style={{
              background: 'linear-gradient(90deg, #E85A2E 0%, #F5A623 100%)',
              fontSize: '0.95rem',
              lineHeight: 1.3,
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
