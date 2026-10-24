import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Check,
  Phone,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';

const SERVICES_DATA = [
  {
    id: 'svc-001',
    category: 'Audiology & Hearing Sciences',
    shortTitle: 'PTA Audiology',
    titleLine1: 'Pure Tone',
    titleLine2: 'Audiometry',
    headline: 'Pure Tone Audiometry.',
    badgeNumber: 'PTA',
    badgeLabel: 'CLINICAL',
    image: '/services/service-audiology-pta.jpg',
    duration: '45 mins session',
    protocol: 'ISO / RCI Standards',
    description:
      'Gold-standard comprehensive hearing threshold evaluation across 250Hz – 8000Hz (Air & Bone Conduction) in a calibrated sound-treated acoustic booth. Generates instant computerized bilateral SVG audiograms adhering to clinical ENT diagnostic criteria.',
    highlights: [
      'Bilateral Air & Bone Conduction Testing across all octaves',
      'Speech Reception Threshold (SRT) & Word Recognition (WRS)',
      'Immediate RCI-standard bilateral diagnostic printout',
    ],
  },
  {
    id: 'svc-002',
    category: 'Pediatric & Electrophysiology',
    shortTitle: 'OAE & BERA',
    titleLine1: 'Newborn OAE &',
    titleLine2: 'BERA Screening',
    headline: 'Newborn OAE & BERA Screening.',
    badgeNumber: 'OAE',
    badgeLabel: 'PEDIATRIC',
    image: '/services/pediatric-audiology.jpg',
    duration: '40 mins session',
    protocol: 'Automated Diagnostic Protocol',
    description:
      'Painless objective electrophysiological auditory screening for infants, toddlers, and young children. Captures cochlear outer hair cell function and auditory brainstem neural pathways without requiring active patient participation.',
    highlights: [
      'Gentle non-invasive probe testing for neonates & infants',
      'Early detection of sensorineural auditory deficits',
      'Immediate green-pass clinical report for pediatricians',
    ],
  },
  {
    id: 'svc-003',
    category: 'Speech-Language Pathology',
    shortTitle: 'Speech Therapy',
    titleLine1: 'Speech & Language',
    titleLine2: 'Therapy',
    headline: 'Speech & Language Therapy.',
    badgeNumber: '1-ON-1',
    badgeLabel: 'CLINICAL',
    image: '/services/service-speech-therapy.jpg',
    duration: '45 mins session',
    protocol: 'ALD-MM & REELS',
    description:
      'Personalized 1-on-1 clinical intervention for childhood speech delays, pragmatic communication, autism spectrum support, and expressive vocabulary development guided by standardized developmental frameworks.',
    highlights: [
      'Individualized pediatric & adult communication roadmaps',
      'Expressive language stimulation & social interaction protocols',
      'Structured home practice plans & caregiver empowerment',
    ],
  },
  {
    id: 'svc-004',
    category: 'Hearing Technology & Rehabilitation',
    shortTitle: 'Hearing Aids',
    titleLine1: 'Hearing Aid',
    titleLine2: 'Digital Trial',
    headline: 'Hearing Aid Digital Trial.',
    badgeNumber: '100%',
    badgeLabel: 'DIGITAL',
    image: '/services/service-hearing-aid.jpg',
    duration: '60 mins session',
    protocol: 'Real-Ear Verification',
    description:
      'Live in-clinic acoustic evaluation and trial with world-class digital hearing aids (RIC, BTE, CIC, Invisible). Includes computerized multi-channel acoustic programming, real-ear verification, and personalized patient orientation.',
    highlights: [
      'Free multi-brand digital trial in a quiet and noisy room',
      'Computerized real-ear verification & acoustic programming',
      'Full manufacturer warranty & lifetime aftercare in Satara',
    ],
  },
  {
    id: 'svc-005',
    category: 'Voice & Fluency Rehabilitation',
    shortTitle: 'Voice & Fluency',
    titleLine1: 'Voice Care &',
    titleLine2: 'Fluency',
    headline: 'Voice Care & Fluency.',
    badgeNumber: 'GRBAS',
    badgeLabel: 'CLINICAL',
    image: '/services/service-voice-therapy.jpg',
    duration: '45 mins session',
    protocol: 'GRBAS & SSI-4',
    description:
      'Perceptual voice evaluation using GRBAS and CAPE-V scales, Maximum Phonation Time (MPT), and stuttering modification (SSI-4). Specialized rehabilitation for professionals, singers, and individuals facing vocal strain or stuttering.',
    highlights: [
      'Standardized SSI-4 fluency & % syllables stuttered (%SS)',
      'Perceptual & aerodynamic vocal strain profiling',
      'Targeted vocal cord rehabilitation & hygiene routines',
    ],
  },
  {
    id: 'svc-006',
    category: 'Speech Pathology & Motor Control',
    shortTitle: 'Articulation',
    titleLine1: 'Articulation &',
    titleLine2: 'Phonology',
    headline: 'Articulation Therapy.',
    badgeNumber: 'CLEAR',
    badgeLabel: 'PRECISION',
    image: '/pediatric-therapy-session.jpg',
    duration: '45 mins session',
    protocol: 'Phonetic Placement Protocol',
    description:
      'Targeted motor-speech intervention correcting persistent sound substitutions, lisping, tongue thrust, and omissions. Employs tactile-kinesthetic cues, phonetic placement, and auditory discrimination to build effortless, crystal-clear speech.',
    highlights: [
      'Oral-motor assessment & acoustic phonetic placement',
      'Lisp and speech clarity correction across all ages',
      'Generalization strategies into conversational fluency',
    ],
  },
  {
    id: 'svc-007',
    category: 'Neurological Care & Stroke Recovery',
    shortTitle: 'Neuro Rehab',
    titleLine1: 'Neuro Cognitive',
    titleLine2: 'Rehabilitation',
    headline: 'Neuro Rehabilitation.',
    badgeNumber: 'NEURO',
    badgeLabel: 'ADVANCED',
    image: '/clinical-care.jpg',
    duration: '45 mins session',
    protocol: 'Neuro-Linguistic Protocol',
    description:
      'Specialized rehabilitation for post-stroke aphasia, dysarthria, apraxia of speech, and cognitive-communicative deficits. Rebuilds neural pathways, language retrieval, and swallowing safety following neurological trauma or illness.',
    highlights: [
      'Comprehensive standardized aphasia & motor-speech profiling',
      'Targeted melodic intonation & cognitive retrieval therapies',
      'Swallowing and communicative autonomy restoration',
    ],
  },
];

export const WatchLearnGrowSection = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Auto-scroll the horizontal stepper tabs bar so the active node is always visible and centered
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeIndex];
    const containerEl = tabsContainerRef.current;
    if (activeTabEl && containerEl) {
      const containerWidth = containerEl.offsetWidth;
      const tabLeft = activeTabEl.offsetLeft;
      const tabWidth = activeTabEl.offsetWidth;
      const targetScroll = tabLeft - (containerWidth / 2) + (tabWidth / 2);

      containerEl.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Two-stage smooth fade-out then fade-in transition
  useEffect(() => {
    if (activeIndex !== displayIndex) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayIndex(activeIndex);
        setIsFading(false);
      }, 240); // 240ms fade-out, switch content, then smooth fade-in

      return () => clearTimeout(timer);
    }
  }, [activeIndex, displayIndex]);

  // Smooth scroll sync helper
  const syncScrollToCard = (index) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;

    if (totalScrollable > 0) {
      const targetScroll = containerTop + (index / (SERVICES_DATA.length - 1)) * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Click card or top step tab to select directly
  const handleSelectCard = (index) => {
    if (index === activeIndex) return;
    isTransitioningRef.current = true;
    setActiveIndex(index);
    syncScrollToCard(index);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 650);
  };

  // Discrete Step Scroll Handler ("on scroll it should only take to next service")
  useEffect(() => {
    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    let touchStartY = 0;

    const handleWheel = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      // Check if the sticky container is in active viewport view
      const isStickyActive = rect.top <= 120 && rect.bottom >= window.innerHeight - 80;
      if (!isStickyActive) return;

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      // Scrolling Downwards -> Advance strictly to NEXT service
      if (e.deltaY > 26) {
        if (activeIndexRef.current < SERVICES_DATA.length - 1) {
          e.preventDefault();
          isTransitioningRef.current = true;
          const next = activeIndexRef.current + 1;
          setActiveIndex(next);
          syncScrollToCard(next);
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 650);
        }
        // At the last card, default behavior allows natural scroll down to next section
      }
      // Scrolling Upwards -> Go strictly to PREVIOUS service
      else if (e.deltaY < -26) {
        if (activeIndexRef.current > 0) {
          e.preventDefault();
          isTransitioningRef.current = true;
          const prev = activeIndexRef.current - 1;
          setActiveIndex(prev);
          syncScrollToCard(prev);
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 650);
        }
        // At the first card, default behavior allows natural scroll up to hero
      }
    };

    // Mobile Touch Gesture Support
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 40) {
        if (diffY > 0 && activeIndexRef.current < SERVICES_DATA.length - 1) {
          handleSelectCard(activeIndexRef.current + 1);
        } else if (diffY < 0 && activeIndexRef.current > 0) {
          handleSelectCard(activeIndexRef.current - 1);
        }
      }
    };

    stickyEl.addEventListener('wheel', handleWheel, { passive: false });
    stickyEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    stickyEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      stickyEl.removeEventListener('wheel', handleWheel);
      stickyEl.removeEventListener('touchstart', handleTouchStart);
      stickyEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Window scroll sync for free dragging scrollbar
  useEffect(() => {
    const handleWindowScroll = () => {
      if (isTransitioningRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable > 0 && rect.top <= 120 && rect.bottom >= 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(0.999, scrolled / totalScrollable));
        const index = Math.floor(progress * SERVICES_DATA.length);
        if (index !== activeIndexRef.current) {
          setActiveIndex(index);
        }
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const activeService = SERVICES_DATA[displayIndex] || SERVICES_DATA[0];
  const progressRatio = (activeIndex + 1) / SERVICES_DATA.length;
  const progressPercent = Math.round(progressRatio * 100);
  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference * (1 - progressRatio);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white select-none"
      style={{ height: `${SERVICES_DATA.length * 85 + 50}vh`, minHeight: '340vh' }}
    >
      {/* ── STICKY VIEWPORT CONTAINER ── */}
      <div
        ref={stickyRef}
        className="sticky top-2 sm:top-10 lg:top-16 w-full min-h-[520px] sm:min-h-[640px] max-h-[960px] h-[calc(100dvh-1.5rem)] sm:h-[calc(100vh-3.5rem)] flex flex-col justify-between bg-white z-20 py-2 sm:py-4 overflow-hidden"
      >
        
        {/* ── 1. TOP CIRCULAR PROGRESS & STATUS BAR ── */}
        <div className="w-full pb-2.5 sm:pb-5 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 sm:gap-4 flex-shrink-0 z-30">
          
          {/* Left: Professional Circular Progress Dial + Service Name */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* SVG Circular Ring Indicator */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 -rotate-90 transform" viewBox="0 0 48 48">
                {/* Background Ring */}
                <circle
                  cx="24"
                  cy="24"
                  r={circleRadius}
                  className="text-gray-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="24"
                  cy="24"
                  r={circleRadius}
                  className="text-[#301444] transition-all duration-700 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              {/* Inner Circle Fraction (01/04) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] sm:text-[11px] font-black text-[#301444] tracking-tighter">
                  0{activeIndex + 1}
                </span>
              </div>
            </div>

            {/* Service Counter & Progress Label */}
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-purple-700 bg-purple-50 border border-purple-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                  CLINICAL SUITE
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-gray-500">
                  {progressPercent}% Complete
                </span>
              </div>
              <h4 className="text-xs sm:text-base font-extrabold text-[#301444] leading-tight mt-0.5">
                {SERVICES_DATA[activeIndex]?.shortTitle}
              </h4>
            </div>
          </div>

          {/* Right: Connected Circular Stepper Nodes */}
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-1 md:pb-0 w-full md:w-auto scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {SERVICES_DATA.map((item, idx) => {
              const isCurrent = activeIndex === idx;
              const isPast = activeIndex > idx;
              return (
                <React.Fragment key={item.id}>
                  <button
                    ref={(el) => (tabRefs.current[idx] = el)}
                    onClick={() => handleSelectCard(idx)}
                    className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer flex-shrink-0 ${
                      isCurrent
                        ? 'bg-[#301444] text-white shadow-md ring-2 ring-purple-200'
                        : isPast
                        ? 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    title={`Jump to ${item.shortTitle}`}
                  >
                    {/* Circle Node (Number or Checkmark) */}
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-white text-[#301444] shadow-xs'
                          : isPast
                          ? 'bg-purple-700 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : idx + 1}
                    </span>

                    <span className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                      {item.shortTitle}
                    </span>
                  </button>

                  {/* Horizontal Connector Line */}
                  {idx < SERVICES_DATA.length - 1 && (
                    <div
                      className={`hidden xl:block w-3 sm:w-4 h-0.5 rounded-full transition-colors flex-shrink-0 ${
                        isPast ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

        </div>

        {/* ── 2. MAIN TWO-COLUMN SHOWCASE (Strict CSS Grid: No Overlap, Smooth Fade In/Out) ── */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start lg:items-center py-2 sm:py-4 min-w-0 overflow-hidden">

          {/* ── LEFT COLUMN: STRICT COL-SPAN-5 WITH SMOOTH FADE TRANSITION ── */}
          <div className="w-full lg:col-span-5 flex flex-col justify-between min-w-0 pr-0 lg:pr-2 z-20 h-full pt-1 sm:pt-3 lg:pt-0">
            <div
              className={`flex flex-col justify-between transition-all duration-300 ease-out transform ${
                isFading
                  ? 'opacity-0 -translate-y-2 pointer-events-none'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              <div>
                {/* Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[clamp(10px,1.2vw,13px)] font-extrabold tracking-wider uppercase mb-[clamp(8px,1.2vh,16px)]">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>{activeService.category}</span>
                </div>

                {/* Bold Large Service Headline (Fluid scaling with screen size) */}
                <h2 className="text-[clamp(22px,3.8vw,52px)] font-black text-[#150422] tracking-tight leading-[1.08] mb-[clamp(8px,1.5vh,18px)]">
                  {activeService.headline}
                </h2>
                
                {/* Description (Fluid scaling with screen size) */}
                <p className="text-[clamp(12.5px,1.6vw,17px)] text-gray-700 leading-relaxed font-normal mb-[clamp(10px,1.8vh,22px)]">
                  {activeService.description}
                </p>

                {/* Clinical Highlights with Crisp Spacing (Fluid scaling) */}
                <div className="space-y-[clamp(6px,1.2vh,12px)] mb-[clamp(10px,1.8vh,22px)]">
                  {activeService.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded bg-[#8cb87c]/20 text-[#254619] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-[clamp(11.5px,1.4vw,15px)] font-bold text-gray-900 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metadata Badges (Fluid scaling) */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-[clamp(10px,1.8vh,22px)]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-[clamp(11px,1.3vw,13px)] font-bold shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                    {activeService.protocol}
                  </span>
                </div>
              </div>

              {/* ── ACTION BUTTONS: BOOK APPOINTMENT & CALL ── */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 pt-1">
                <Link
                  to={`${ROUTES.BOOKING}?service=${activeService.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#8cb87c] hover:bg-[#7fae6e] text-[#12220e] font-black text-[clamp(12px,1.5vw,15px)] shadow-md shadow-emerald-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <Calendar className="w-4 h-4 text-[#12220e] group-hover:rotate-6 transition-transform" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={`tel:${APP_CONFIG.PHONE}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-[clamp(12px,1.5vw,14px)] border border-gray-200 shadow-xs hover:border-purple-300 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
                  <span>Call Clinic</span>
                </a>
              </div>
            </div>

            {/* ── MOBILE ONLY: CLINICAL PHOTO FEATURE CARD (Flexes to fill all remaining height) ── */}
            <div className="lg:hidden w-full flex-1 min-h-[140px] max-h-[380px] rounded-2xl overflow-hidden relative shadow-md mt-3 sm:mt-4 flex-shrink-0">
              <img
                src={activeService.image}
                alt={activeService.shortTitle}
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  isFading ? 'scale-105 opacity-70' : 'scale-100 opacity-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
              
              {/* Top Badge */}
              <div className="absolute top-2.5 left-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-xs font-extrabold tracking-wide">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  Certified Protocol
                </span>
              </div>

              {/* Bottom Info & Stats */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-end justify-between text-white pointer-events-none gap-2">
                <div className="min-w-0 flex-1 pr-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-300 block truncate">
                    {activeService.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-black leading-tight text-white drop-shadow-xs">
                    {activeService.shortTitle}
                  </h3>
                </div>

                <div className="flex-shrink-0 text-right bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20">
                  <span className="text-base sm:text-lg font-black block leading-none">
                    {activeService.badgeNumber}
                  </span>
                  <span className="text-[8px] font-bold tracking-wider uppercase text-emerald-300 block mt-0.5">
                    {activeService.badgeLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: STRICT COL-SPAN-7 WITH REDUCED BORDER RADIUS (Desktop Only) ── */}
          <div className="hidden lg:flex w-full lg:col-span-7 items-center justify-end gap-1.5 sm:gap-2 lg:gap-2.5 h-[480px] sm:h-[560px] lg:h-[620px] xl:h-[660px] min-w-0 z-10 overflow-hidden">
            {SERVICES_DATA.map((card, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(idx)}
                  className={`h-full rounded-2xl sm:rounded-[22px] overflow-hidden relative cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group shadow-lg hover:shadow-2xl ${
                    isActive
                      ? 'flex-1 min-w-[240px] sm:min-w-[280px] lg:min-w-[320px] xl:min-w-[380px]'
                      : 'w-[44px] sm:w-[50px] lg:w-[56px] xl:w-[64px] flex-shrink-0'
                  }`}
                >
                  {/* High-Resolution Clinical Photo */}
                  <img
                    src={card.image}
                    alt={card.shortTitle}
                    className={`w-full h-full object-cover object-center transition-all duration-700 ${
                      isActive ? 'scale-100 filter-none' : 'scale-105 filter brightness-90 group-hover:brightness-105'
                    }`}
                  />

                  {/* ── ACTIVE EXPANDED STATE CONTENT ── */}
                  {isActive && (
                    <>
                      {/* High-contrast Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                      {/* Top Category Badge on Card */}
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 pointer-events-none animate-fadeIn">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-extrabold tracking-wide">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                          Certified Protocol
                        </span>
                      </div>

                      {/* Bottom Title & Stats Badge */}
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7 flex items-end justify-between text-white pointer-events-none animate-fadeIn gap-3">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-emerald-300 block mb-1 truncate">
                            {card.category}
                          </span>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight text-white drop-shadow-md">
                            {card.titleLine1}<br />
                            {card.titleLine2}
                          </h3>
                        </div>

                        <div className="flex-shrink-0 text-right bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 shadow-lg">
                          <span className="text-xl sm:text-2xl lg:text-3xl font-black block leading-none tracking-tight text-white">
                            {card.badgeNumber}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-emerald-300 block mt-1">
                            {card.badgeLabel}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── COLLAPSED VERTICAL PILL TAG ── */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-end p-1.5 sm:p-2 pointer-events-none">
                      <div className="w-full bg-[#160424]/95 backdrop-blur-md py-3.5 sm:py-4 px-1 rounded-xl sm:rounded-2xl border border-white/15 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-105">
                        <span
                          className="text-white text-[10px] sm:text-[11px] font-black tracking-wider uppercase whitespace-nowrap select-none"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          {card.shortTitle}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

export default WatchLearnGrowSection;
