import React, { useEffect } from 'react';
import {
  AnimateOnScroll,
  StrategyNav,
  StrategyHero,
  StrategyWhyScale,
  StrategyFounderTrap,
  StrategyCoach,
  StrategyLearn,
  StrategyModel,
  StrategyWhyDifferent,
  StrategyForNotFor,
  StrategyPricing,
  StrategyForm,
  StrategyFAQ,
  StrategyFooter,
} from '../components/strategy';
import { useConfig } from '../context/ConfigContext';

const defaultTheme = {
  primary: '#f77c18',
  accent: '#f77c18',
  accentHover: '#e66b0a',
  backgroundLight: '#f8f7f5',
  backgroundDark: '#064e3b',
  cardDark: '#1e3a32',
};

export function StrategyLandingPage() {
  const { config, loading } = useConfig();
  const theme = config.strategyLayout?.theme || defaultTheme;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = theme.backgroundLight;
    document.body.style.minHeight = 'max(884px, 100dvh)';
    document.body.style.color = '';
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '';
      document.body.style.minHeight = '';
    };
  }, [theme.backgroundLight]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundLight }}>
        <div className="text-slate-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  const themeVars = {
    '--theme-primary': theme.primary,
    '--theme-accent': theme.accent,
    '--theme-accent-hover': theme.accentHover,
    '--theme-background-light': theme.backgroundLight,
    '--theme-background-dark': theme.backgroundDark,
    '--theme-card-dark': theme.cardDark,
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-display overflow-x-hidden" style={{ backgroundColor: theme.backgroundLight, ...themeVars }}>
      <StrategyNav />
      <AnimateOnScroll><StrategyHero /></AnimateOnScroll>
      <AnimateOnScroll><StrategyWhyScale /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFounderTrap /></AnimateOnScroll>
      <AnimateOnScroll><StrategyCoach /></AnimateOnScroll>
      <AnimateOnScroll><StrategyLearn /></AnimateOnScroll>
      <AnimateOnScroll><StrategyModel /></AnimateOnScroll>
      <AnimateOnScroll><StrategyWhyDifferent /></AnimateOnScroll>
      <AnimateOnScroll><StrategyForNotFor /></AnimateOnScroll>
      <AnimateOnScroll><StrategyPricing /></AnimateOnScroll>
      <AnimateOnScroll><StrategyForm /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFAQ /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFooter /></AnimateOnScroll>
    </div>
  );
}
