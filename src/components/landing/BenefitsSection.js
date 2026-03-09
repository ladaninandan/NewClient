import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const iconColor = 'var(--bs-primary)';
const iconBg = '#FFEDE8';

const BenefitIcons = {
  person: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M12 11v4" />
      <path d="M10 14h4" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17l4-4 4 2 8-8" />
      <path d="M20 9v8h-8" />
    </svg>
  ),
  bars3: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18V9" />
      <path d="M12 18V5" />
      <path d="M17 18v-7" />
      <path d="M6 21h12" />
    </svg>
  ),
  bars4: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 18V12" />
      <path d="M10 18V8" />
      <path d="M15 18v-5" />
      <path d="M20 18V6" />
      <path d="M4 21h16" />
    </svg>
  ),
};

function renderTextWithBold(str) {
  if (!str || typeof str !== 'string') return str;
  const parts = str.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : p));
}

export function BenefitsSection() {
  const { config } = useConfig();
  const benefits = config.benefits || [];
  const languageNote = config.languageNote;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="h4 fw-bold text-center text-dark mb-2">What Happens When You Join?</h2>
        <div
          className="mx-auto mb-4"
          style={{
            width: '48px',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--bs-primary)',
          }}
        />
        <div className="row g-3 ">
          {benefits.map((b, i) => (
            <div key={i} className="col-6 col-md-6 col-lg-3  ">
              <div
                className="p-4 rounded-4  bg-secondary bg-opacity-25 "
                style={{ backgroundColor: '#F9F9F9',minHeight:"300px" }}
              >
                <div
                  className="flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: iconBg,
                  }}
                >
                  {BenefitIcons[b.icon] || BenefitIcons.bars3}
                </div>
                <p className="mb-0 text-dark small lh-base pt-3 ">
                  {renderTextWithBold(b.text)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {languageNote && (
          <p className="text-muted small mt-3 mb-0 text-center">{languageNote}</p>
        )}
      </div>
    </section>
  );
}
