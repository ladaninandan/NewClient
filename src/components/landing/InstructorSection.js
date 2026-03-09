import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function InstructorSection() {
  const { config } = useConfig();
  const inv = config.instructor || {};

  return (
    <section className="pt-4">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-md-4 text-center">
            {inv.image ? (
              <img
                src={inv.image}
                alt={inv.name}
                className="img-fluid rounded-circle shadow"
                style={{ maxHeight: '280px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center text-white display-4"
                style={{ width: '200px', height: '200px' }}
              >
                {inv.name ? inv.name.charAt(0) : '?'}
              </div>
            )}
          </div>
          <div className="col-md-8 text-center">
            <p className="text-muted mb-1">{inv.greeting}</p>
            <h2 className="h3 fw-bold text-dark mb-2">{inv.name}</h2>
            <p className="h5 mb-2 " style={{ color: 'var(--bs-primary)' }}>{inv.title}</p>
            <p className="fw-semibold text-dark mb-1 ">{inv.tagline}</p>
            <p className="text-muted mb-2 ">{inv.stats}</p>
            <p className="mb-1 bg-white border rounded p-3">
              <span className="badge bg-warning text-dark me-2 ">{inv.rating}</span>
              <span className=''>
              {inv.reviewText}
              </span>
            </p>
            <p className='pt-4 text-muted'>Language-Basic English</p>
          </div>
        </div>
      </div>
    </section>
  );
}
