import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const STAT_KEYS = [
  { key: 'yearsExperience', label: 'Years of Experience in Training and Coaching' },
  { key: 'entrepreneursReached', label: 'Entrepreneurs Reached in The last 7 years' },
  { key: 'seminarsConducted', label: 'Seminars And Workshops Conducted' },
  { key: 'socialFollowing', label: 'Social Media Following across platforms' },
  { key: 'paidCustomers', label: 'Paid Customers' },
  { key: 'liveCommunity', label: 'Live entrepreneurs Community' },
  { key: 'coachingClients', label: 'Coaching Clients' },
  { key: 'industriesWorked', label: 'Industries Worked with' },
  { key: 'inhouseCoaches', label: 'In-house Business Coaches' },
  { key: 'countriesTrained', label: 'Trained in more Than 7 Countries' },
];

export function MeetCoachSection() {
  const { config } = useConfig();
  const inv = config.instructor || {};
  const block = config.meetCoach || {};

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="h4 fw-bold text-center mb-4">{block.title}</h2>
        <h3 className="h5 fw-bold text-center mb-2">{inv.name}</h3>
        <p className="text-center mb-4" style={{ color: 'var(--bs-primary)' }}>{inv.tagline}</p>
        <div className="row g-3 mb-5">
          {STAT_KEYS.filter(({ key }) => inv[key]).map(({ key, label }) => (
            <div key={key} className="col-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm text-center p-3 h-100">
                <p className="h4 fw-bold mb-0" style={{ color: 'var(--bs-primary)' }}>{inv[key]}</p>
                <p className="small text-muted mb-0 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
        {block.missionTitle && (
          <>
            <h3 className="h5 fw-bold text-center mb-2">{block.missionTitle}</h3>
            {block.missionSubtitle && (
              <p className="text-center text-muted">{block.missionSubtitle}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
