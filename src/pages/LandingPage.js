import React from 'react';
import { StrategyLandingPage } from './StrategyLandingPage';
import { useConfig } from '../context/ConfigContext';

export function LandingPage() {
  const { loading } = useConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1823]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <StrategyLandingPage />;
}
