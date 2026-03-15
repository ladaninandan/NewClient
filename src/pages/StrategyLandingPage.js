import React, { useEffect, useState, useRef } from 'react';
import {
  AnimateOnScroll,
  ScrollRevealObserver,
  StrategyScrollingBanner,
  StrategyTopVideo,
  StrategyProblem,
  StrategyWhyScale,
  StrategyFounderTrap,
  StrategyCoach,
  StrategyCoachAchievements,
  StrategyLearn,
  StrategyModel,
  StrategyWhyDifferent,
  StrategyTestimonials,
  StrategyFeedback,
  StrategyForNotFor,
  StrategyPriceJustification,
  StrategyPricing,
  StrategyForm,
  StrategyStickyBar,
  StrategyMoneyBackGuarantee,
  StrategyFAQ,
  StrategyFooter,
} from '../components/strategy';
import { LoadingPage } from '../components/LoadingPage';
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

const DEFAULT_SECTION_ORDER = [
  'topVideo', 'whyScale', 'problem', 'founderTrap', 'coach', 'coachAchievements', 'learn', 'founderModel',
  'whyDifferent', 'testimonials', 'feedback', 'forNotFor', 'pricing', 'priceJustification',
  'form', 'moneyBackGuarantee', 'faq', 'footer',
];

const SECTION_COMPONENTS = {
  topVideo: StrategyTopVideo,
  whyScale: StrategyWhyScale,
  problem: StrategyProblem,
  founderTrap: StrategyFounderTrap,
  coach: StrategyCoach,
  coachAchievements: StrategyCoachAchievements,
  learn: StrategyLearn,
  founderModel: StrategyModel,
  whyDifferent: StrategyWhyDifferent,
  testimonials: StrategyTestimonials,
  feedback: StrategyFeedback,
  forNotFor: StrategyForNotFor,
  pricing: StrategyPricing,
  priceJustification: StrategyPriceJustification,
  form: StrategyForm,
  moneyBackGuarantee: StrategyMoneyBackGuarantee,
  faq: StrategyFAQ,
  footer: StrategyFooter,
};

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
    const navLogo = (config.strategyLayout?.nav?.logo || '').trim();
    let logo = navLogo;
    if (!logo && typeof localStorage !== 'undefined') {
      try { logo = localStorage.getItem('site_config_logo') || ''; } catch (_) {}
    }
    return (
      <LoadingPage
        backgroundColor="#ffffff"
        primaryColor={theme.primary}
        logo={logo}
      />
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

  const order = config.strategyLayout?.sectionOrder;
  const sectionOrder = Array.isArray(order) && order.length > 0
    ? [...order].filter((id) => SECTION_COMPONENTS[id])
    : DEFAULT_SECTION_ORDER;
  const missing = DEFAULT_SECTION_ORDER.filter((id) => !sectionOrder.includes(id));
  const orderedIds = [...sectionOrder, ...missing];
  const visibility = config.strategyLayout?.sectionVisibility || {};
  const visibleIds = orderedIds.filter((id) => visibility[id] !== false);

  return (
    <div
      className="strategy-landing min-h-screen text-slate-900 dark:text-slate-100 pb-20"
      style={{ backgroundColor: theme.backgroundLight, ...themeVars }}
    >
      <ScrollRevealObserver dependency={visibleIds.join(',')} />
      <AnimateOnScroll key="scrolling-banner"><StrategyScrollingBanner /></AnimateOnScroll>
      {visibleIds.map((id) => {
        const Comp = SECTION_COMPONENTS[id];
        return Comp ? <AnimateOnScroll key={id}><Comp /></AnimateOnScroll> : null;
      })}
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

      {/* Header */}
      <div className="flex items-center justify-between pt-4 px-4 border-slate-200 dark:border-slate-700">
        
        {/* Empty div for perfect center alignment */}
        <div className="w-6"></div>

        <h2
          id="popup-title"
          className="text-xl font-semibold text-black dark:text-white text-center flex-1"
        >
          Book your 1:1 business consultation
        </h2>

        <button
          type="button"
          onClick={() => setShowPopup(false)}
          className="btn-no-animate p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

      </div>

      {/* Body */}
      <div className="px-6 pb-6 pt-4">
        <StrategyForm embedded />
      </div>

    </div>
  </div>
)}

    </div>
  );
}
