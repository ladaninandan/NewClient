import React from 'react';
import { StrategyLandingPage } from './StrategyLandingPage';
import { useConfig } from '../context/ConfigContext';
import { LoadingPage } from '../components/LoadingPage';

export function LandingPage() {
  const { loading } = useConfig();

  if (loading) {
    return <LoadingPage />;
  }

  return <StrategyLandingPage />;
}
