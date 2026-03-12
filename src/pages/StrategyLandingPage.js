import React, { useEffect, useState, useRef } from 'react';
import {
  AnimateOnScroll,
  StrategyScrollingBanner,
  StrategyTopVideo,
  StrategyHero,
  StrategyWhyScale,
  StrategyFounderTrap,
  StrategyCoach,
  StrategyLearn,
  StrategyModel,
  StrategyWhyDifferent,
  StrategyTestimonials,
  StrategyFeedback,
  StrategyForNotFor,
  StrategyPricing,
  StrategyForm,
  StrategyStickyBar,
  StrategyMoneyBackGuarantee,
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

const POPUP_DELAY_MS = 60 * 1000; // 1 minute

export function StrategyLandingPage() {
  const { config, loading } = useConfig();
  const theme = config.strategyLayout?.theme || defaultTheme;
  const [showPopup, setShowPopup] = useState(false);
  const popupTimerRef = useRef(null);

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

  useEffect(() => {
    if (loading) return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('strategyPopupShown') === '1') return;
    popupTimerRef.current = setTimeout(() => {
      setShowPopup(true);
      try { sessionStorage.setItem('strategyPopupShown', '1'); } catch (_) {}
    }, POPUP_DELAY_MS);
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [loading]);

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
    <div
      className="min-h-screen text-slate-900 dark:text-slate-100 pb-20"
      style={{ backgroundColor: theme.backgroundLight, ...themeVars }}
    >
      <StrategyScrollingBanner />
      <AnimateOnScroll><StrategyTopVideo /></AnimateOnScroll>
      {/* <AnimateOnScroll><StrategyHero /></AnimateOnScroll> */}
      <AnimateOnScroll><StrategyWhyScale /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFounderTrap /></AnimateOnScroll>
      <AnimateOnScroll><StrategyCoach /></AnimateOnScroll>
      <AnimateOnScroll><StrategyLearn /></AnimateOnScroll>
      <AnimateOnScroll><StrategyModel /></AnimateOnScroll>
      <AnimateOnScroll><StrategyWhyDifferent /></AnimateOnScroll>
      <AnimateOnScroll><StrategyTestimonials /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFeedback /></AnimateOnScroll>
      <AnimateOnScroll><StrategyForNotFor /></AnimateOnScroll>
      <AnimateOnScroll><StrategyPricing /></AnimateOnScroll>
      <AnimateOnScroll><StrategyForm /></AnimateOnScroll>
      <AnimateOnScroll><StrategyMoneyBackGuarantee /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFAQ /></AnimateOnScroll>
      <AnimateOnScroll><StrategyFooter /></AnimateOnScroll>
      <StrategyStickyBar />

      {showPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="px-6 pb-6 pt-0">
              <StrategyForm embedded />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
