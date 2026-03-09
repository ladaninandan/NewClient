import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';

function parseEndDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function CountdownSection() {
  const { config } = useConfig();
  const countdownEndDateStr = config.countdownEndDate;
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const endDate = parseEndDate(countdownEndDateStr);
    if (!endDate) return;
    const tick = () => {
      const now = new Date();
      let ms = endDate - now;
      if (ms <= 0) {
        setDiff({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days = Math.floor(ms / 86400000);
      ms %= 86400000;
      const hours = Math.floor(ms / 3600000);
      ms %= 3600000;
      const mins = Math.floor(ms / 60000);
      ms %= 60000;
      const secs = Math.floor(ms / 1000);
      setDiff({ days, hours, mins, secs });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [countdownEndDateStr]);

  const scrollToForm = () => {
    const el = document.getElementById('register-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const boxes = [
    { value: mounted ? diff.days : '00', label: 'Days' },
    { value: mounted ? String(diff.hours).padStart(2, '0') : '00', label: 'Hours' },
    { value: mounted ? String(diff.mins).padStart(2, '0') : '00', label: 'Mins' },
    { value: mounted ? String(diff.secs).padStart(2, '0') : '00', label: 'Secs' },
  ];

  return (
    <section className="py-4">
      <div className="container">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <p className="mb-2 fw-bold text-center">
            STARTS ON {config.eventDate} ({config.eventTime})
          </p>
          <button
            type="button"
            className="btn btn-lg px-4 text-white border-0 rounded-3 mb-4 mt-2" 
            style={{ backgroundColor: 'var(--bs-primary)' }}
            onClick={scrollToForm}
          >
            {config.ctaButtonText}
          </button>
          {config.registerInNextLabel && (
            <p className="mb-1 fw-semibold text-center mb-4">{config.registerInNextLabel} 👇</p>
          )}
          {config.toUnlockBonusesLabel && config.bonusesWorth && (
            <p className="text-muted small mb-3 text-center">
              {config.toUnlockBonusesLabel} <strong>{config.bonusesWorth}</strong>
            </p>
          )}
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">
            {boxes.map(({ value, label }) => (
              <div
                key={label}
                className="bg-dark text-white rounded-3 text-center px-4 py-3"
                style={{ minWidth: '80px' }}
              >
                <div className="display-6 fw-bold">{value}</div>
                <div className="small">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
