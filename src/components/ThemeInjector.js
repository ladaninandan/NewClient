import { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

/**
 * Applies theme from config to CSS variables on document root.
 */
export function ThemeInjector() {
  const { config } = useConfig();

  useEffect(() => {
    const root = document.documentElement;
    const t = config.theme || {};
    if (t.primaryColor) root.style.setProperty('--bs-primary', t.primaryColor);
    if (t.primaryHover) root.style.setProperty('--bs-primary-hover', t.primaryHover);
    if (t.secondaryColor) root.style.setProperty('--bs-secondary', t.secondaryColor);
    if (t.backgroundColor) root.style.setProperty('--bs-body-bg', t.backgroundColor);
    if (t.textColor) root.style.setProperty('--bs-body-color', t.textColor);
    if (t.textMuted) root.style.setProperty('--bs-secondary-color', t.textMuted);
  }, [config.theme]);

  return null;
}
