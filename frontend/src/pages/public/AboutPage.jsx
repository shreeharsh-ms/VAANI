import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  MapPin,
  Award,
  Stethoscope,
  X,
} from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import { APP_CONFIG, ROUTES } from '../../constants';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

const CLINICAL_TIMELINE = [
  {
    num: "26",
    step: "01",
    tag: "Academic Degree & RCI Foundation",
    dates: "2022 — 2026",
    institution: "Bharati Vidyapeeth (DU) — SASLP, Pune",
    degree: "Bachelor of Audiology & Speech-Language Pathology (BASLP)",
    category: "4-Year Dual-Discipline Medical University",
    image: "/clinical-care.jpg",
    department: "SASLP Campus • Pune",
    description: "Comprehensive 4-year rigorous dual-discipline training covering both Audiological Sciences (Acoustics, Diagnostic Audiometry, Pediatric Audiology, Hearing Aid Tech, Vestibular Science) and Speech-Language Pathology (Neuroanatomy, Child Language Acquisition, Voice Sciences, Fluency Shaping, Dysphagia, Augmentative Communication).",
    batteries: ["REELS", "3-DLAT", "ALD-MM", "LPT", "PTA", "Tympanometry", "IDDSI", "CRR Statutory Code"],
    highlight: true,
  },
  {
    num: "25",
    step: "02",
    tag: "Clinical Outpatient & Sound Booth Rotations",
    dates: "July — August 2025",
    institution: "School of Audiology & SLP (SASLP), Pune",
    degree: "Comprehensive Outpatient Diagnostics & Speech Therapy",
    category: "Specialized Clinical Training Institute",
    image: "/services/service-speech-therapy.jpg",
    department: "SASLP Clinical Wing • Pune",
    description: "Comprehensive outpatient clinical management, pediatric speech and language assessments, adult fluency shaping, and routine Pure Tone Audiometry (PTA) testing in calibrated double-walled ANSI-standard soundproof booths.",
    batteries: ["Pediatric Assessment", "Fluency Shaping", "ANSI Calibrated PTA", "Sound Booth"],
  },
  {
    num: "25",
    step: "03",
    tag: "Tertiary Hospital • High-Risk Neonatal Screening",
    dates: "September — October 2025",
    institution: "K.E.M. Hospital Research Centre, Pune",
    degree: "High-Risk Neonatal Care & Pediatric Diagnostics",
    category: "Tertiary Research Hospital & NICU Center",
    image: "/patient-pexels.jpg",
    department: "NICU & Pediatric Ward • Pune",
    description: "High-risk neonatal hearing screening (OAE & BERA), pediatric intensive care assessments, early audiological milestone stimulation, and interdisciplinary evaluations collaborating with leading pediatricians, neonatologists, and ENTs.",
    batteries: ["Neonatal OAE", "BERA Screening", "Pediatric ICU", "ENT Interdisciplinary"],
  },
  {
    num: "25",
    step: "04",
    tag: "Advanced Electrophysiology & Cochlear Implants",
    dates: "November — December 2025",
    institution: "Deenanath Mangeshkar Hospital & Research Center",
    degree: "Advanced Diagnostic Audiology & Voice Clinic",
    category: "Premier Multi-Specialty Research Hospital",
    image: "/services/service-audiology-pta.jpg",
    department: "Electrophysiology Lab • Pune",
    description: "Advanced diagnostic audiology: Immittance tympanometry, acoustic reflexometry, auditory evoked potentials (ABR/BERA), computerized voice clinic evaluations, and multi-channel cochlear implant candidacy mapping and telemetry.",
    batteries: ["Immittance Tympanometry", "Acoustic Reflex", "ABR / BERA", "Cochlear Mapping"],
  },
  {
    num: "26",
    step: "05",
    tag: "Government Medical College • Inpatient Rounds",
    dates: "January — February 2026",
    institution: "Sassoon General Hospital & B.J. Medical College",
    degree: "Inpatient Hospital Rounds & Neuro-Rehabilitation",
    category: "Government Tertiary Teaching Hospital",
    image: "/contact-room.png",
    department: "Neurology & Trauma Rounds • Pune",
    description: "Extensive inpatient hospital rounds, acute post-stroke neuro-rehabilitation (Broca’s & Wernicke’s aphasia, dysarthria, apraxia of speech), traumatic brain injury (TBI) therapy, and statutory government medical disability certification.",
    batteries: ["Post-Stroke Aphasia", "Dysarthria Rehab", "TBI Speech Therapy", "Disability Certification"],
  },
  {
    num: "26",
    step: "06",
    tag: "Super-Specialty Quaternary Recovery & REM",
    dates: "March — April 2026",
    institution: "Jupiter Hospital, Pune / Thane",
    degree: "Super-Specialty Neurological Recovery & Swallowing Care",
    category: "Quaternary Super-Specialty Medical Center",
    image: "/contact-consult.png",
    department: "Neuro ICU & Audiology Suite",
    description: "Super-specialty neurological recovery, acute bedside dysphagia (swallowing) clinical evaluations (FOIS and IDDSI mapping), tracheostomy communication weaning, and digital hearing aid fitting with live Real-Ear Measurements (REM).",
    batteries: ["Bedside Dysphagia", "FOIS / IDDSI", "Tracheostomy Weaning", "Real-Ear REM Trials"],
  },
];

export const AboutPage = () => {
  const { rciNumber, social, settings } = useClinicSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const stickyWrapperRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const lastComputedIndexRef = useRef(0);

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      setIsExiting(false);
    }, 450);
  };

  const isDoctorVisible = isSectionInView && activeIndex >= 2 && !isDismissed && !isExiting;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!stickyWrapperRef.current) {
            ticking = false;
            return;
          }

          const rect = stickyWrapperRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const inView = rect.top <= windowHeight * 0.85 && rect.bottom >= windowHeight * 0.15;
          setIsSectionInView(inView);

          if (isNavigatingRef.current) {
            ticking = false;
            return;
          }

          const navbarOffset = window.innerWidth >= 1024 ? 96 : (window.innerWidth >= 640 ? 88 : 76);
          const totalScrollable = stickyWrapperRef.current.offsetHeight - (windowHeight - navbarOffset);
          if (totalScrollable <= 0) {
            ticking = false;
            return;
          }

          const scrolled = -(rect.top - navbarOffset);
          const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

          // Determine active milestone index (0 to 5) for sticky scroll
          const count = CLINICAL_TIMELINE.length;
          const computedIndex = Math.min(Math.floor(progress * count), count - 1);

          if (computedIndex !== lastComputedIndexRef.current) {
            lastComputedIndexRef.current = computedIndex;
            setActiveIndex(computedIndex);

            // Smoothly glide horizontal track on desktop
            if (scrollContainerRef.current && window.innerWidth >= 1024) {
              const container = scrollContainerRef.current;
              const inactiveWidth = 260;
              const targetLeft = Math.max(0, computedIndex * inactiveWidth - (container.clientWidth - 520) / 2);

              container.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: 'smooth',
              });
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const goToMilestone = (idx) => {
    lastComputedIndexRef.current = idx;
    setActiveIndex(idx);
    if (stickyWrapperRef.current) {
      isNavigatingRef.current = true;
      const navbarOffset = window.innerWidth >= 1024 ? 96 : (window.innerWidth >= 640 ? 88 : 76);
      const windowHeight = window.innerHeight;
      const totalScrollable = stickyWrapperRef.current.offsetHeight - (windowHeight - navbarOffset);
      const wrapperTop = stickyWrapperRef.current.getBoundingClientRect().top + window.scrollY;
      const targetScroll = wrapperTop - navbarOffset + (idx / (CLINICAL_TIMELINE.length - 1)) * totalScrollable;
      window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 700);
    }
    if (scrollContainerRef.current && window.innerWidth >= 1024) {
      const container = scrollContainerRef.current;
      const inactiveWidth = 260;
      const targetLeft = Math.max(0, idx * inactiveWidth - (container.clientWidth - 520) / 2);

      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      });
    }
  };

  const scrollTimeline = (direction) => {
    const nextIdx = direction === 'left' ? Math.max(0, activeIndex - 1) : Math.min(CLINICAL_TIMELINE.length - 1, activeIndex + 1);
    goToMilestone(nextIdx);
  };
  return (
    <div className="relative w-full min-h-screen bg-white text-[#160424] overflow-x-clip select-none">
      
      {/* ── BACKGROUND LAYER: FAINT LAVENDER WATERCOLOR IMAGE ── */}
      <div className="absolute top-0 inset-x-0 w-full h-[950px] lg:h-[1050px] pointer-events-none select-none overflow-hidden z-0">
        <img
          src="/faint-lavender-bg.jpg"
          alt="Faint Lavender Watercolor Background"
          className="w-full h-full object-cover object-top opacity-75 mix-blend-multiply transition-opacity duration-700"
        />
        {/* Soft gradient wash to melt background cleanly into the lower sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white" />
      </div>

      {/* ── EDITORIAL ARCHITECTURAL GRID OVERLAY (Echoing the reference poster's delicate cutting-mat lines) ── */}
      <div className="absolute top-0 inset-x-0 w-full h-[950px] lg:h-[1050px] pointer-events-none select-none z-0">
        <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="w-full h-full grid grid-cols-6 sm:grid-cols-12 border-x border-purple-200/40">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="border-r border-purple-200/35 h-full hidden sm:block"
              />
            ))}
          </div>
        </div>
        {/* Horizontal grid guide lines */}
        <div className="absolute top-16 inset-x-0 border-b border-purple-200/35" />
        <div className="absolute top-44 inset-x-0 border-b border-purple-200/35" />
        <div className="absolute top-[420px] inset-x-0 border-b border-purple-200/35" />
        <div className="absolute top-[680px] inset-x-0 border-b border-purple-200/35" />
      </div>

      {/* ── MAIN EDITORIAL POSTER HERO SECTION (Padding exactly aligned with Navbar) ── */}
      <section className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-2 sm:pt-4 pb-12 sm:pb-16 lg:pb-20">
        
        {/* 1. TOP MINIMAL KEYWORDS BAR (Matching "STRATEGY • CREATIVITY • IDENTITY" in the poster) */}
        <div className="w-full flex items-center justify-between py-2.5 sm:py-6 border-b border-purple-200/60 text-[10px] sm:text-xs md:text-[13px] font-extrabold tracking-wider sm:tracking-[0.28em] text-[#301444]/75 uppercase px-1">
          <span className="hover:text-purple-700 transition-colors">
            AUDIOLOGY SCIENCE
          </span>
          <span className="hover:text-purple-700 transition-colors">
            SPEECH PATHOLOGY
          </span>
          <span className="hover:text-purple-700 transition-colors hidden sm:inline">
            HUMAN REHABILITATION
          </span>
        </div>

        {/* 2. THE EDITORIAL POSTER TRIAD (Left Headline + Middle Portrait + Right Editorial Question) */}
        <div className="relative mt-2 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row items-start justify-between gap-0 lg:gap-6 min-h-[580px] sm:min-h-[700px] lg:min-h-[760px]">

          {/* ── CENTER: PRACTITIONER PORTRAIT (Moderate Height on Mobile with Deep Bottom Fade) ── */}
          <div className="relative w-full flex-1 flex flex-col items-center justify-start order-1 lg:order-2 z-10 my-0 lg:my-0 -mt-2 sm:-mt-4 lg:-mt-6">
            
            {/* Architectural Frame Outline behind the person (Desktop only) */}
            <div className="hidden lg:block absolute top-4 sm:top-6 w-[280px] sm:w-[380px] lg:w-[420px] xl:w-[520px] h-[520px] sm:h-[620px] lg:h-[720px] xl:h-[780px] border border-purple-300/80 rounded-xs pointer-events-none z-0" />

            {/* Practitioner Portrait Image */}
            <div className="relative w-full max-w-[310px] sm:max-w-[380px] lg:max-w-[520px] xl:max-w-[640px] mx-auto overflow-hidden lg:overflow-visible z-10 group">
              <img
                src="/practitioner-palak-real.png"
                alt="Ms. Palak Paresh Gandhi - Lead Audiologist & Speech Pathologist"
                className="w-full h-auto max-h-[440px] sm:max-h-[560px] lg:max-h-[880px] xl:max-h-[940px] object-contain mx-auto drop-shadow-xl transition-transform duration-500 scale-100 sm:scale-105 lg:scale-[1.06] origin-top"
              />

              {/* Bottom Fade Gradient Layer for Mobile / Android Screens */}
              <div
                className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 h-56 sm:h-64 bg-gradient-to-t from-white via-white/85 to-transparent z-15"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ── LEFT FLANK: Headline + Practitioner Handle + Action Buttons (Pulled up on Mobile onto Photo so text is visible without scrolling) ── */}
          <div className="w-full lg:w-[350px] xl:w-[380px] flex-shrink-0 flex flex-col justify-start order-2 lg:order-1 z-25 -mt-48 sm:-mt-56 lg:mt-0 pt-0 sm:pt-0 lg:pt-6 px-1 sm:px-4 lg:px-0">
            <div className="w-full space-y-3.5 sm:space-y-6 text-left p-2 sm:p-5 lg:p-0">
              
              {/* Social / Practitioner Tag Badge */}
              <a
                href={social?.instagramUrl || 'https://instagram.com/palakgandhi_maslp'}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Instagram"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-purple-200/90 shadow-sm self-start hover:scale-105 transition-transform"
              >
                <img
                  src="/practitioner-headshot.png"
                  alt="Palak Gandhi"
                  className="w-6 h-6 rounded-full object-cover object-top border border-purple-300"
                />
                <span className="text-xs sm:text-sm font-bold text-[#301444] tracking-tight">
                  {social?.instagramHandle || '@palakgandhi_maslp'}
                </span>
              </a>

              {/* Unified Bold Sans Headline across both lines (Same Font Family & Weight on Mobile & Laptop) */}
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] 2xl:text-[50px] font-black tracking-tight text-[#160424] leading-[1.05] drop-shadow-xs">
                  If your voice <br />
                  doesn’t tell <br />
                  a story, <br />
                  <span className="text-[#301444] lg:hidden">
                    who will listen?
                  </span>
                </h2>
              </div>

              {/* Subtitle / Philosophy */}
              <p className="text-[14.5px] sm:text-base text-gray-800 leading-relaxed font-normal">
                Every milestone matters. When a child struggles to speak or hearing clarity fades with age, clinical precision meets patient empathy to rebuild communication.
              </p>

              {/* Credential Badge */}
              <div className="pt-1 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#301444]">
                <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>RCI Certified • Registration No. {rciNumber || 'A79214'}</span>
              </div>

              {/* Action Buttons: Stacked big one below one on Android / Mobile screens */}
              <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <Link to="/#booking-section" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full shadow-lg shadow-purple-900/25 py-3.5 px-7 text-sm sm:text-base font-bold bg-[#301444] hover:bg-[#451963] text-white active:scale-98 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="w-4.5 h-4.5 text-purple-200" />
                    <span>Book Consultation</span>
                  </button>
                </Link>

                <a
                  href={`tel:${(settings?.contact?.primaryPhone || APP_CONFIG.phone).replace(/\s+/g, '')}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border border-purple-200 dark:border-purple-800 text-sm sm:text-base font-bold text-[#301444] dark:text-purple-200 bg-white/95 hover:bg-purple-50 shadow-sm active:scale-98 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Phone className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                  <span>Call Clinic</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT FLANK: Editorial Question (Matching Same Font on Laptop) + Philosophy + Hallmark ── */}
          <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 flex flex-col justify-between order-3 z-20 pt-6 lg:pt-6">
            <div className="w-full space-y-4 sm:space-y-6 text-left">
              
              {/* Desktop Headline Climax (Using Same Font as Left Flank) */}
              <div className="hidden lg:block">
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] 2xl:text-[84px] font-black tracking-tight text-[#160424] leading-[0.94]">
                  who <br />
                  will <br />
                  listen?
                </h1>
              </div>

              {/* Clinical Answer / Reassurance */}
              <p className="text-[14.5px] sm:text-base text-gray-700 leading-relaxed font-normal">
                At VAANI, we listen with scientific acoustic precision and genuine empathy — diagnosing the subtle nuances of speech, acoustic thresholds, and sensory perception.
              </p>
            </div>

            {/* Hallmark Bottom Tag */}
            <div className="pt-4 sm:pt-6 mt-4 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[#301444]/80 dark:text-purple-300 uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block animate-pulse" />
                <span>VAANI CLINIC • SATARA</span>
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                EST. SATARA
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ── CLINICAL CHRONICLE (Mobile: Sticky Big Readable Cards; Desktop: Sticky Interactive Norgram Timeline) ── */}
      <section 
        id="clinical-chronicle"
        ref={stickyWrapperRef} 
        className="relative w-full h-[240vh] sm:h-[260vh] lg:h-[320vh] bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-purple-100/70"
      >
        {/* ── MOBILE & TABLET LAYOUT (< lg): Sticky Pinning, Big Readable Card with Smooth Step to Next Section ── */}
        <div className="flex lg:hidden sticky top-[76px] sm:top-[88px] w-full h-[calc(100dvh-76px)] sm:h-[calc(100dvh-88px)] flex-col justify-between py-2 sm:py-3 px-3 sm:px-6 overflow-hidden z-20">
          
          {/* Mobile Header: Compact Title & Navigation Controls */}
          <div className="w-full shrink-0 pb-1.5 border-b border-gray-200/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 inline-block animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.18em] text-purple-700 uppercase">
                  Curriculum Vitae • Clinical Residency
                </span>
              </div>
              <span className="text-[10.5px] font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Milestone {activeIndex + 1} of {CLINICAL_TIMELINE.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <h2 className="text-base sm:text-xl font-extrabold text-[#160424] tracking-tight truncate">
                Academic Foundation & Residency
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => goToMilestone(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  aria-label="Previous milestone"
                  className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToMilestone(Math.min(CLINICAL_TIMELINE.length - 1, activeIndex + 1))}
                  disabled={activeIndex === CLINICAL_TIMELINE.length - 1}
                  aria-label="Next milestone"
                  className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stage Quick-Select Pills */}
            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {CLINICAL_TIMELINE.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToMilestone(idx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    idx === activeIndex
                      ? 'bg-[#301444] text-white shadow-xs scale-105'
                      : 'bg-white border border-purple-200/80 text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  Stage {item.step}
                </button>
              ))}
            </div>
          </div>

          {/* Active Milestone Card - Big, Clean, Spacious, Highly Readable on Mobile */}
          {(() => {
            const currentItem = CLINICAL_TIMELINE[activeIndex];
            return (
              <div 
                key={activeIndex}
                className="flex-1 my-2 bg-white border border-purple-200/90 rounded-2xl p-3.5 sm:p-5 shadow-[0_12px_32px_-10px_rgba(48,20,68,0.12)] flex flex-col justify-between overflow-hidden animate-fadeIn"
              >
                {/* Top Row: Year, Stage */}
                <div className="shrink-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1 leading-none">
                      <span className="text-xs font-bold text-purple-600/90">20</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#160424] tracking-tight">{currentItem.num}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wider bg-purple-100 text-purple-900 border border-purple-200 uppercase">
                      STAGE {currentItem.step} OF 06
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-700">
                      <Calendar className="w-3 h-3" />
                      <span>{currentItem.dates}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#160424] leading-snug truncate">
                      {currentItem.institution}
                    </h3>
                    <p className="text-[10px] font-bold text-purple-900/80 uppercase tracking-wide truncate">
                      {currentItem.tag}
                    </p>
                  </div>
                </div>

                {/* Big Hospital / Clinic Photo */}
                <div className="relative w-full h-[145px] sm:h-[180px] rounded-xl overflow-hidden bg-gray-100 border border-purple-200/80 shadow-xs shrink-0 my-1">
                  <img
                    src={currentItem.image}
                    alt={currentItem.institution}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-purple-300 shrink-0" />
                    <span className="truncate max-w-[220px]">{currentItem.department}</span>
                  </div>
                </div>

                {/* Full, High-Readability Description */}
                <p className="text-[12.5px] sm:text-[13.5px] text-gray-800 leading-relaxed font-normal line-clamp-3 shrink-0">
                  {currentItem.description}
                </p>

                {/* Clinical Test Batteries */}
                <div className="pt-1.5 border-t border-purple-100/70 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {currentItem.batteries.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[10px] sm:text-[10.5px] font-semibold text-purple-900 bg-purple-100/80 border border-purple-200/90 px-2 py-0.5 rounded-md"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Under-Card Statutory Assurance on Mobile */}
          <div className="shrink-0 flex items-center justify-between gap-2 text-[10.5px] text-gray-500 bg-purple-50/60 border border-purple-100 rounded-xl px-2.5 py-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Adheres to Rehabilitation Council of India (RCI) codes</span>
            </div>
            <span className="font-mono text-[9px] text-gray-400 shrink-0">CRR VERIFIED</span>
          </div>

        </div>

        {/* ── DESKTOP LAYOUT (lg:flex): Interactive Sticky Transforming Norgram Timeline ── */}
        <div className="hidden lg:flex sticky top-[96px] w-full h-[calc(100vh-96px)] max-h-[1050px] flex-col justify-between py-6 px-8 xl:px-12 overflow-hidden z-20">
          
          {/* 1. Header: Editorial Title, Residency Tag & Controls */}
          <div className="w-full flex items-end justify-between gap-4 pb-6 border-b border-gray-200/80 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block animate-pulse" />
                <span className="text-xs font-bold tracking-[0.22em] text-purple-700 uppercase">
                  Curriculum Vitae • Clinical Residency & Rotations
                </span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold text-[#160424] tracking-tight">
                Academic Foundation & Multi-Hospital Clinical Residency
              </h2>
              <p className="mt-1.5 text-sm text-gray-600 max-w-3xl font-normal leading-relaxed">
                4-year rigorous dual-discipline training at Bharati Vidyapeeth followed by intensive clinical rotations across 5 premier tertiary medical research centers in Pune, compliant with Rehabilitation Council of India (RCI) statutory codes.
              </p>
            </div>

            {/* Nav Controls & Milestone Progress */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Milestone {activeIndex + 1} of {CLINICAL_TIMELINE.length}
              </span>
              <button
                onClick={() => scrollTimeline('left')}
                disabled={activeIndex === 0}
                aria-label="Previous milestone"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-purple-50 hover:border-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-purple-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                disabled={activeIndex === CLINICAL_TIMELINE.length - 1}
                aria-label="Next milestone"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-purple-50 hover:border-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-purple-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Middle Chronicle Container (Sticky Norgram Spine + Horizontal Transforming Track) */}
          <div className="relative flex-1 min-h-0 border border-gray-200/90 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-row my-4">
            
            {/* Left Vertical Spine */}
            <div className="w-16 bg-slate-50/80 border-r border-gray-200/90 flex flex-col items-center justify-between py-6 select-none shrink-0">
              <div className="flex gap-1">
                <div className="w-[3px] h-6 bg-[#301444] rounded-full" />
                <div className="w-[3px] h-6 bg-purple-500 rounded-full" />
              </div>

              <div className="[writing-mode:vertical-lr] rotate-180 flex items-center gap-4 py-4">
                <span className="text-[11px] font-black tracking-[0.28em] text-[#160424] uppercase">
                  VAANI® CLINICAL CHRONICLE
                </span>
                <span className="w-8 h-[1px] bg-purple-300 inline-block" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  RCI STATUTORY RESIDENCY
                </span>
              </div>

              <div className="text-[9px] font-black text-purple-900/70 uppercase tracking-widest text-center leading-tight">
                EST.<br />2022
              </div>
            </div>

            {/* Horizontal Track with Transforming Cards */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 flex overflow-x-auto divide-x divide-gray-200/90 scrollbar-none"
            >
              {CLINICAL_TIMELINE.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => goToMilestone(idx)}
                    className={`shrink-0 flex flex-col justify-between cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                      isActive 
                        ? 'w-[520px] xl:w-[580px] bg-gradient-to-b from-purple-50/50 via-white to-purple-50/20 ring-1 ring-purple-200/90 shadow-[0_16px_40px_-10px_rgba(48,20,68,0.14)] p-6' 
                        : 'w-[260px] bg-white hover:bg-purple-50/20 p-5'
                    }`}
                  >
                    {/* Top Section: Number + Stage */}
                    <div>
                      <div className="flex items-baseline justify-between select-none">
                        <div className="flex items-baseline gap-0.5 select-none leading-none">
                          <span className={`leading-none select-none font-bold transition-all duration-500 tracking-tight ${
                            isActive 
                              ? 'text-base text-purple-600/80' 
                              : 'text-xs text-gray-300 group-hover:text-purple-300'
                          }`}>
                            20
                          </span>
                          <span className={`leading-none select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] font-black ${
                            isActive 
                              ? 'text-4xl lg:text-5xl tracking-tight text-[#160424]' 
                              : 'text-3xl lg:text-4xl tracking-tight text-gray-200/90 group-hover:text-purple-300'
                          }`}>
                            {item.num}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold tracking-widest uppercase transition-all duration-500 ${
                          isActive 
                            ? 'text-purple-900 bg-purple-100/80 border border-purple-200/80 px-2.5 py-0.5 rounded-full shadow-2xs' 
                            : 'text-gray-400 group-hover:text-purple-600'
                        }`}>
                          STAGE {item.step}
                        </span>
                      </div>

                      {/* Under-Number Area */}
                      <div className="min-h-[64px] mt-2 flex items-start">
                        {isActive ? (
                          <p className="text-[13.5px] text-gray-700 leading-relaxed font-normal animate-fadeIn transition-opacity duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            {item.description}
                          </p>
                        ) : (
                          <div className="w-full h-full" aria-hidden="true" />
                        )}
                      </div>

                      {/* Horizontally Aligned Metadata Row: Date, Title, Tag */}
                      <div className="pt-2.5 pb-1.5 border-t border-gray-100/90">
                        <div className={`text-xs font-semibold tracking-wide mb-0.5 flex items-center gap-1.5 transition-colors duration-500 ${
                          isActive ? 'text-purple-900 font-bold' : 'text-gray-400'
                        }`}>
                          <Calendar className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-gray-300'}`} />
                          <span>{item.dates}</span>
                        </div>

                        <h3 className={`font-bold leading-snug mb-0.5 transition-colors duration-500 ${
                          isActive ? 'text-lg lg:text-xl text-[#160424]' : 'text-base text-gray-700 group-hover:text-[#160424] line-clamp-1'
                        }`}>
                          {item.institution}
                        </h3>

                        <div className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 ${
                          isActive ? 'text-purple-700' : 'text-gray-400'
                        }`}>
                          {item.tag}
                        </div>
                      </div>
                    </div>

                    {/* Lower Section: Image & Batteries */}
                    <div className="flex flex-col justify-end">
                      {isActive ? (
                        <>
                          <div className="relative w-full h-[235px] xl:h-[250px] rounded-2xl overflow-hidden bg-gray-100 border border-purple-200/80 shadow-[0_12px_28px_-6px_rgba(48,20,68,0.14)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_16px_36px_-6px_rgba(48,20,68,0.18)]">
                            <img
                              src={item.image}
                              alt={item.institution}
                              className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2.5 left-2.5 bg-black/65 backdrop-blur-md border border-white/20 text-white text-[10.5px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 shadow-md">
                              <MapPin className="w-3 h-3 text-purple-300 shrink-0" />
                              <span>{item.department}</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-1.5 border-t border-purple-100/70 flex flex-wrap gap-1">
                            {item.batteries.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="text-[10px] font-semibold text-purple-900 bg-purple-100/70 hover:bg-purple-200/80 border border-purple-200/80 px-2 py-0.5 rounded-md transition-colors shadow-2xs"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative w-full h-[90px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            <img
                              src={item.image}
                              alt={item.institution}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                              loading="lazy"
                            />
                            <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                              {item.department}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 leading-relaxed font-normal mt-2.5 line-clamp-3">
                            {item.description}
                          </p>

                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {item.batteries.slice(0, 3).map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="text-[9px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* 3. Under-Timeline Statutory Regulatory Assurance Note */}
          <div className="w-full flex items-center justify-between gap-2 px-2 text-xs text-gray-500 shrink-0 pt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All clinical assessments and therapy protocols adhere to statutory codes set forth by the <strong>Rehabilitation Council of India (RCI)</strong>.
              </span>
            </div>
            <div className="text-gray-400 font-mono text-[11px]">
              CRR REGISTRATION VERIFIED • SATARA PRACTICE
            </div>
          </div>

        </div>
      </section>

      {/* ── ETHICAL COMMITMENT BANNER ── */}
      <section className="relative z-10 w-full py-12 sm:py-14 bg-gradient-to-r from-[#301444] via-[#3e1b59] to-[#250d36] text-white">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white tracking-tight">
                Schedule a Clinical Assessment with Ms. Palak Gandhi
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl font-normal">
                Dedicated soundproof testing, compassionate speech sessions, and transparent clinical guidance in Satara.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/#booking-section"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#301444] hover:bg-purple-50 font-bold px-7 py-3 shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <Calendar className="w-4 h-4 text-[#301444]" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCTOR POPUP (Triggered when reached K.E.M. Hospital, activeIndex >= 2 - Desktop only) ── */}
      {!isDismissed && (
        <div 
          className={`hidden lg:block fixed bottom-4 left-4 xl:bottom-6 xl:left-6 z-50 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDoctorVisible
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
          }`}
          role="dialog"
          aria-label="Book Consultation Assistant"
        >
          <div className="relative flex flex-col items-center max-w-[125px] sm:max-w-[160px] md:max-w-[240px] lg:max-w-[310px]">
            {/* Dismiss Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute -top-1 -right-1 sm:top-1 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-white/95 hover:bg-white text-gray-500 hover:text-gray-900 rounded-full shadow-lg border border-purple-200 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer z-30"
              title="Close popup"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Doctor Avatar with Gentle Floating Animation */}
            <div className="relative animate-doctor-float cursor-pointer group">
              <Link to="/#booking-section" className="block focus:outline-none">
                <img
                  src="/doctor-popup.png"
                  alt="Liked our experience? Book us for appointment!"
                  className="w-[115px] sm:w-[150px] md:w-[230px] lg:w-[290px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(48,20,68,0.25)] transition-transform group-hover:scale-105 duration-300"
                  draggable={false}
                />
              </Link>
            </div>

            {/* Book Appointment CTA Button */}
            <div className="w-full -mt-1 sm:-mt-2 z-20 px-1 sm:px-2">
              <Link
                to="/#booking-section"
                className="group flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 px-3 sm:px-5 rounded-full bg-gradient-to-r from-[#301444] via-[#4e1c70] to-[#7c3aed] text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all border border-purple-300/40 tracking-tight whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;
