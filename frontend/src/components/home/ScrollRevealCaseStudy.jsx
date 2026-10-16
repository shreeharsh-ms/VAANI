import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  Check,
  HeartPulse,
  Sparkles,
  ChevronRight,
  Clock,
  Star,
  MapPin,
  X,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';

// The clinical case study tokens
const WORDS = [
  { text: 'Over', highlight: null },
  { text: '1.5', highlight: 'red' },
  { text: 'Billion', highlight: 'red' },
  { text: 'people', highlight: null },
  { text: 'globally', highlight: null },
  { text: 'live', highlight: null },
  { text: 'with', highlight: null },
  { text: 'hearing', highlight: null },
  { text: 'loss.', highlight: null },
  { text: 'By', highlight: null },
  { text: '2050,', highlight: 'red' },
  { text: 'nearly', highlight: null },
  { text: '2.5', highlight: 'red' },
  { text: 'Billion', highlight: 'red' },
  { text: 'people', highlight: null },
  { text: 'will', highlight: null },
  { text: 'be', highlight: null },
  { text: 'affected,', highlight: null },
  { text: 'with', highlight: null },
  { text: 'over', highlight: null },
  { text: '700', highlight: 'red' },
  { text: 'Million', highlight: 'red' },
  { text: 'requiring', highlight: null },
  { text: 'active', highlight: null },
  { text: 'clinical', highlight: null },
  { text: 'rehabilitation.', highlight: null },
  { text: 'Approximately', highlight: null },
  { text: '1', highlight: 'red' },
  { text: 'Billion', highlight: 'red' },
  { text: 'young', highlight: null },
  { text: 'adults', highlight: null },
  { text: 'face', highlight: null },
  { text: 'avoidable', highlight: null },
  { text: 'hearing', highlight: null },
  { text: 'loss', highlight: null },
  { text: 'from', highlight: null },
  { text: 'unsafe', highlight: null },
  { text: 'listening.', highlight: null },
  { text: 'Among', highlight: 'lavender' },
  { text: 'children,', highlight: 'lavender' },
  { text: '60%', highlight: 'red' },
  { text: 'of', highlight: 'lavender' },
  { text: 'disabling', highlight: 'lavender' },
  { text: 'hearing', highlight: 'lavender' },
  { text: 'cases', highlight: 'lavender' },
  { text: 'are', highlight: 'lavender' },
  { text: 'entirely', highlight: 'lavender' },
  { text: 'preventable.', highlight: 'lavender' },
  { text: 'Developmental', highlight: null },
  { text: 'speech', highlight: null },
  { text: 'disorders', highlight: null },
  { text: 'affect', highlight: null },
  { text: 'up', highlight: null },
  { text: 'to', highlight: null },
  { text: '16%', highlight: 'red' },
  { text: 'of', highlight: null },
  { text: 'children,', highlight: null },
  { text: 'yet', highlight: null },
  { text: 'only', highlight: null },
  { text: '59.7%', highlight: 'red' },
  { text: 'receive', highlight: null },
  { text: 'timely', highlight: null },
  { text: 'intervention.', highlight: null },
  { text: 'Early', highlight: null },
  { text: 'detection', highlight: null },
  { text: 'before', highlight: null },
  { text: '24', highlight: 'red' },
  { text: 'Months', highlight: 'red' },
  { text: 'prevents', highlight: null },
  { text: 'lifelong', highlight: null },
  { text: 'developmental', highlight: null },
  { text: 'setbacks.', highlight: null },
];

export const ScrollRevealCaseStudy = () => {
  const containerRef = useRef(null);
  const revealTrackRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      setIsExiting(false);
    }, 450);
  };

  const isDoctorVisible = isSectionInView && !isDismissed && !isExiting;

  // Calculate video opacity based on scroll progress:
  // Appears when scrolling, stays visible during case study, disappears when reaching the end
  let videoOpacity = 0;
  if (isSectionInView) {
    if (progress <= 0.02) {
      videoOpacity = Math.max(0, progress / 0.02);
    } else if (progress < 0.82) {
      videoOpacity = 1;
    } else if (progress <= 0.98) {
      videoOpacity = Math.max(0, 1 - (progress - 0.82) / 0.16);
    } else {
      videoOpacity = 0;
    }
  }

  // Ensure background video plays smoothly in a continuous muted loop across all mobile devices
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser initially restricts background autoplay, unlock on first touch or scroll
          const startPlayback = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', startPlayback);
            window.removeEventListener('scroll', startPlayback);
          };
          window.addEventListener('touchstart', startPlayback, { once: true, passive: true });
          window.addEventListener('scroll', startPlayback, { once: true, passive: true });
        });
      }
    }
  }, []);

  // Synchronize scroll progress strictly on the sticky reveal track:
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!revealTrackRef.current) return;
          const rect = revealTrackRef.current.getBoundingClientRect();
          const windowH = window.innerHeight;
          const totalScrollable = rect.height - windowH;

          // Check if user has reached this section
          const inView = rect.top <= windowH * 0.85 && rect.bottom >= windowH * 0.15;
          setIsSectionInView(inView);

          if (totalScrollable > 0) {
            const scrolled = -rect.top;
            // Map progress so all words reach 100% lit at 85% of the scrollable track
            // leaving a comfortable pause for the user to read before the next section unpins and scrolls up
            const p = Math.max(0, Math.min(1, scrolled / (totalScrollable * 0.85)));
            setProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white select-none"
    >
      
      {/* ── 1. STICKY WORD-BY-WORD CASE STUDY REVEAL (MATCHING EXACT NAVBAR PADDING) ── */}
      <div ref={revealTrackRef} className="relative w-full" style={{ height: '280vh' }}>
        <div className="sticky top-2 sm:top-6 lg:top-20 w-full h-[calc(100dvh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-5.5rem)] max-h-[1080px] flex flex-col justify-between items-start px-4 sm:px-8 lg:px-10 xl:px-12 py-3 sm:py-6 overflow-hidden bg-white relative">

          {/* ── BACKGROUND STUDY VIDEO (Appears on Scroll, Disappears at the End) ── */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out z-0"
            style={{ opacity: videoOpacity }}
            aria-hidden="true"
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              webkit-playsinline="true"
              x5-playsinline="true"
              className="w-full h-full object-cover object-center"
            >
              <source src="/BackgroundStudty.mp4" type="video/mp4" />
              <source src="/BackgroundStudty.webm" type="video/webm" />
            </video>
            {/* Top white fade gradient to ensure headline & doctor remain 100% crisp */}
            <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-white via-white/85 to-transparent pointer-events-none" />

            {/* Bottom Lavender Fade: seamless blend with NO borders or boxes */}
            <div
              className="absolute inset-x-0 bottom-0 h-[72%] sm:h-[65%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(234, 220, 248, 0.98) 0%, rgba(238, 226, 250, 0.94) 45%, rgba(244, 236, 252, 0.82) 70%, rgba(250, 246, 255, 0.38) 90%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
          </div>

          {/* Full-width container perfectly aligned to navbar grid */}
          <div className="w-full flex-1 flex flex-col justify-between items-start text-left min-h-0 relative z-10">

            {/* Headline with Complete Left-to-Right Underline and Doctor Resting Above the Line */}
            <div className="w-full flex items-end justify-between gap-3 pb-1 sm:pb-2 mb-2 sm:mb-4 lg:mb-6 border-b-2 sm:border-b-[3px] border-black relative flex-shrink-0">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black tracking-tight leading-[1.04] text-black">
                The Silent Crisis.
              </h2>

              {/* ── TOP RIGHT DOCTOR (Remains 100% Above the Line, Appears When Reached This Section) ── */}
              {!isDismissed && (
                <div
                  className={`shrink-0 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isDoctorVisible
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
                  }`}
                  role="dialog"
                  aria-label="Clinical Knowledge Assistant"
                >
                  <div className="relative flex flex-col items-end">
                    {/* Dismiss Close Button */}
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="absolute -top-2 -right-1 sm:-top-3 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white/95 hover:bg-white text-gray-400 hover:text-gray-800 rounded-full shadow-sm border border-gray-200 flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer z-20"
                      title="Close"
                      aria-label="Close"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>

                    {/* Doctor Avatar with Gentle Floating Breathing Animation */}
                    <div className="relative animate-doctor-float cursor-pointer group">
                      <a
                        href="#booking-section"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById('booking-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="block focus:outline-none"
                        title="Click to Book Consultation"
                      >
                        <img
                          src="/doctor-doyouknow.png"
                          alt="Doctor - Do you know?"
                          className="w-[85px] sm:w-[130px] md:w-[160px] lg:w-[195px] h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform group-hover:scale-105 duration-300"
                          draggable={false}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom-Anchored Case Study Text (Seamless blend with background, NO borders or boxes, enlarged typography) */}
            <div className="w-full mt-auto mb-2 sm:mb-4 relative z-10">
              <p className="w-full text-[clamp(18px,2.6vw,42px)] font-black leading-[1.36] sm:leading-[1.4] tracking-tight text-left">
                {WORDS.map((item, idx) => {
                  const wordThreshold = idx / WORDS.length;
                  const isLit = progress >= wordThreshold;

                  let litColor = 'text-black font-black';
                  if (item.highlight === 'red') {
                    litColor = 'text-red-600 font-black';
                  } else if (item.highlight === 'lavender') {
                    litColor = 'text-[#581c87] font-black';
                  }

                  return (
                    <span
                      key={idx}
                      className={`inline-block mr-[0.22em] mb-0.5 sm:mb-1 transition-colors duration-150 ease-out ${
                        isLit
                          ? litColor
                          : 'text-purple-900/35 font-bold'
                      }`}
                    >
                      {item.text}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Professional Clinical Evidence Meter */}
            <div className="w-full mt-1 sm:mt-2 pt-2.5 sm:pt-3 border-t border-purple-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3.5 flex-shrink-0 relative z-10">
              {/* Left: Source metadata */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black">
                  Clinical Evidence Progress
                </span>
                <span className="hidden md:inline-block text-xs text-gray-600 font-semibold">
                  • WHO &amp; NIH Epidemiology
                </span>
              </div>

              {/* Right: Sleek progress bar and percentage */}
              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <span className="text-[11px] sm:text-xs font-bold text-gray-600 whitespace-nowrap">
                  Scroll to reveal:
                </span>
                <div className="flex-1 sm:w-36 md:w-44 h-2 rounded-full bg-purple-200/80 overflow-hidden relative border border-purple-300/50">
                  <div
                    className="h-full rounded-full bg-[#301444] transition-all duration-150 ease-out"
                    style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-black text-[#301444] min-w-[38px] text-right">
                  {Math.min(100, Math.round(progress * 100))}%
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── 2. "READY TO SCHEDULE" FULL-WIDTH FULL-HEIGHT SECTION WITH INVERTED CONCAVE OUTWARD RADIUS ── */}
      <section
        id="booking-section"
        className="w-full min-h-[90vh] lg:min-h-screen bg-gradient-to-b from-[#1b0528] via-[#240838] to-[#140220] text-white shadow-2xl relative flex items-center justify-center py-16 sm:py-20 lg:py-28 px-5 sm:px-8 lg:px-12 xl:px-16"
      >
        {/* Top-Left Inverted Fillet (Concave Outward Radius) */}
        <svg
          className="absolute bottom-[calc(100%-1px)] left-0 w-10 sm:w-14 lg:w-16 xl:w-20 h-10 sm:h-14 lg:h-16 xl:h-20 pointer-events-none z-30 text-[#1b0528]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 0 A 60 60 0 0 0 60 60 L 0 60 Z" fill="currentColor" />
        </svg>

        {/* Top-Right Inverted Fillet (Concave Outward Radius) */}
        <svg
          className="absolute bottom-[calc(100%-1px)] right-0 w-10 sm:w-14 lg:w-16 xl:w-20 h-10 sm:h-14 lg:h-16 xl:h-20 pointer-events-none z-30 text-[#1b0528]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 60 0 A 60 60 0 0 1 0 60 L 60 60 Z" fill="currentColor" />
        </svg>

        {/* Bottom-Left Inverted Fillet (Concave Outward Radius) */}
        <svg
          className="absolute top-[calc(100%-1px)] left-0 w-10 sm:w-14 lg:w-16 xl:w-20 h-10 sm:h-14 lg:h-16 xl:h-20 pointer-events-none z-30 text-[#140220]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 60 A 60 60 0 0 1 60 0 L 0 0 Z" fill="currentColor" />
        </svg>

        {/* Bottom-Right Inverted Fillet (Concave Outward Radius) */}
        <svg
          className="absolute top-[calc(100%-1px)] right-0 w-10 sm:w-14 lg:w-16 xl:w-20 h-10 sm:h-14 lg:h-16 xl:h-20 pointer-events-none z-30 text-[#140220]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 60 60 A 60 60 0 0 0 0 0 L 60 0 Z" fill="currentColor" />
        </svg>

        {/* Contained Subtle Ambient Radial Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left 6 Columns: Refined Vintage Lavender Consultation Setting (Calibrated Scale) */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] xl:h-[540px] flex items-center justify-center bg-transparent group">
            <img
              src="/services/vintage-phone-pots.png"
              alt="VAANI Clinic Vintage Consultation Telephone and Lavender"
              className="max-h-full max-w-[85%] sm:max-w-[80%] lg:max-w-[88%] object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Right 6 Columns: Action & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 xl:space-y-8">
            
            {/* Specialist Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>RCI Registered Clinical Specialist • Satara, Maharashtra</span>
            </div>

            {/* Authoritative Headline Connected to Top Paragraph (The Silent Crisis) */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Don’t Let Hearing Loss Stay a Silent Crisis.
            </h2>

            {/* Clear Informative Subtitle Connected to 60% Preventable / Timely Intervention */}
            <p className="text-sm sm:text-base lg:text-lg text-purple-200/90 leading-relaxed max-w-xl">
              60% of disabling hearing cases and developmental speech delays are preventable with timely intervention. Take the decisive step before setbacks become permanent — consult with <strong>Ms. Palak Gandhi</strong> in Satara.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                to={ROUTES.BOOKING}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#8cb87c] hover:bg-[#7fae6e] text-[#12220e] font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 text-[#12220e] group-hover:rotate-6 transition-transform" />
                <span>Book Online Appointment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`tel:${APP_CONFIG.phone}`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 text-purple-300" />
                <span>Call Clinic Directly</span>
              </a>
            </div>

            {/* 2x2 Structured Trust Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-purple-400/20 w-full text-xs sm:text-sm text-purple-200/90 font-semibold">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span>Soundproof Acoustic Testing Booth</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span>Same-Day Computerized Audiogram</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span>Certified RCI Clinical Specialist</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                </div>
                <span>Pediatric-Friendly Environment</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ScrollRevealCaseStudy;

