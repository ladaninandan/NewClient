import React from 'react';
import { StrategyLandingPage } from './StrategyLandingPage';
import { useConfig } from '../context/ConfigContext';
import { LoadingPage } from '../components/LoadingPage';

const CACHE_LOGO_KEY = 'site_config_logo';

function getLoadingLogo(configLogo) {
  if (configLogo && typeof configLogo === 'string' && configLogo.trim()) return configLogo.trim();
  try {
    const cached = typeof localStorage !== 'undefined' && localStorage.getItem(CACHE_LOGO_KEY);
    return cached || '';
  } catch {
    return '';
  }
}

export function LandingPage() {
  const { config, loading } = useConfig();
  const logo = getLoadingLogo(config?.strategyLayout?.nav?.logo);

  if (loading) {
    return <LoadingPage logo={logo} />;
  }

  return <StrategyLandingPage />;
}
