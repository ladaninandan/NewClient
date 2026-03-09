import React from 'react';
import { useConfig } from '../../context/ConfigContext';

export function FooterSection() {
  const { config } = useConfig();
  const footer = config.footer || {};
  const social = footer.socialLinks || {};

  const links = footer.links || [];

  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-3">
          {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-white">Facebook</a>}
          {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-white">Instagram</a>}
          {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white">LinkedIn</a>}
          {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-white">YouTube</a>}
        </div>
        {links.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-2">
            {links.map((link, i) => (
              <a key={i} href={link.url || '#'} className="text-white-50 small">{link.label}</a>
            ))}
          </div>
        )}
        <p className="text-center text-muted small mb-0">{footer.copyright}</p>
      </div>
    </footer>
  );
}
