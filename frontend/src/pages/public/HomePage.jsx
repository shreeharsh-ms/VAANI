import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSantoStyle from '../../components/home/HeroSantoStyle';
import ClinicalPreventionSection from '../../components/home/ClinicalPreventionSection';
import ServicesEditorialSection from '../../components/home/ServicesEditorialSection';
import ProfessionalBookingSection from '../../components/home/ProfessionalBookingSection';

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#booking-section' || window.location.hash.includes('booking')) {
      const timer = setTimeout(() => {
        const el = document.getElementById('booking-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="w-full flex flex-col bg-white">
      {/* ── UPPER DARK PURPLE FRAME SECTION: HERO, PREVENTION & SERVICES ── */}
      <div className="w-full bg-[#301444] pb-6 sm:pb-10 lg:pb-12 rounded-b-[28px] sm:rounded-b-[40px] lg:rounded-b-[52px] shadow-2xl flex flex-col">
        {/* Exact Santo-style Framed Hero Section - Full Viewport Height */}
        <HeroSantoStyle />

        {/* Clinical Prevention & Early Rehabilitation Section matching reference design */}
        <ClinicalPreventionSection />

        {/* Services Editorial Section with bit of gap at the bottom */}
        <ServicesEditorialSection />
      </div>

      {/* ── LOWER CLEAN WHITE FLOW: BOOKING SECTION SITS ON WHITE BACKGROUND ── */}
      <div className="w-full bg-white pt-4 sm:pt-6">
        {/* Professional Booking Section (Schedule Appointment & Clinical Services) */}
        <ProfessionalBookingSection />
      </div>
    </div>
  );
};

export default HomePage;
