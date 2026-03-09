import React from 'react';
import {
  Header,
  HeroSection,
  InstructorSection,
  CountdownSection,
  FeaturedInSection,
  BenefitsSection,
  WhatWillChangeSection,
  TargetAudienceSection,
  LearningOutcomesSection,
  BonusesSection,
  TestimonialsSection,
  MeetCoachSection,
  RecapBonusesSection,
  GuaranteeSection,
  FAQSection,
  RegistrationForm,
  FooterSection,
} from '../components/landing';
import { ThemeInjector } from '../components/ThemeInjector';
import { useConfig } from '../context/ConfigContext';

export function LandingPage() {
  const { config, loading } = useConfig();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ThemeInjector />
      <div style={{ backgroundColor: config.theme?.backgroundColor || '#F8F8F8', minHeight: '100vh' }}>

        {config.bannerText && (
          <div
            className="text-center py-2 text-white fw-bold"
            style={{ backgroundColor: 'var(--bs-primary)' }}
          >
            {config.bannerText}
          </div>
        )}
        <Header />
        <HeroSection />
        <InstructorSection />
        <CountdownSection />
        <FeaturedInSection />
        <BenefitsSection />
        <WhatWillChangeSection />
        <TargetAudienceSection />
        <LearningOutcomesSection />
        <BonusesSection />
        <TestimonialsSection />
        <MeetCoachSection />
        <RecapBonusesSection />
        <GuaranteeSection />
        <FAQSection />
        <RegistrationForm />
        <FooterSection />
      </div>
    </>
  );
}
