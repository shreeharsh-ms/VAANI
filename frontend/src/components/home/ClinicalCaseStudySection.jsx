import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Users,
  Activity,
  BarChart2,
  Clock,
  ArrowRight,
  Phone,
  Calendar,
  Check,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';

export const ClinicalCaseStudySection = () => {
  const sectionRef = useRef(null);
  const [bgColor, setBgColor] = useState('rgb(255, 255, 255)');
  const [isDark, setIsDark] = useState(false);

  // Dynamic scroll-driven smooth background transition:
  // Starts at pure white (#ffffff -> rgb(255, 255, 255))
  // Smoothly darkens into #1b0528 (rgb(27, 5, 40)) as the user scrolls
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowH = window.innerHeight;

          // Compute how far user has scrolled into this section
          const scrollDistance = rect.height * 0.45;
          const currentScroll = windowH - rect.top;
          const progress = Math.max(0, Math.min(1, currentScroll / (windowH + scrollDistance)));

          // Smooth interpolation from 255,255,255 to 27,5,40 (#1b0528)
          const r = Math.round(255 - (255 - 27) * progress);
          const g = Math.round(255 - (255 - 5) * progress);
          const b = Math.round(255 - (255 - 40) * progress);

          setBgColor(`rgb(${r}, ${g}, ${b})`);
          setIsDark(progress > 0.38);
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
    <section
      ref={sectionRef}
      id="case-study-section"
      style={{ backgroundColor: bgColor }}
      className="w-full transition-colors duration-300 ease-out py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 select-none"
    >
      <div className="w-full max-w-7xl mx-auto">

        {/* ── 1. CASE STUDY HEADER ── */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4 transition-colors duration-300 bg-purple-600/15 text-purple-700 dark:text-purple-300 border border-purple-400/30">
            <HeartPulse className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>Clinical Case Study • WHO &amp; NIH Epidemiology</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] transition-colors duration-300 mb-6 ${
              isDark ? 'text-white' : 'text-[#180425]'
            }`}
          >
            The Silent Epidemic: Hearing &amp; Speech Disorders by the Numbers
          </h2>

          <p
            className={`text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-purple-200/90' : 'text-gray-700'
            }`}
          >
            A data-driven examination of the global scale, burden, and developmental impact of auditory and speech-language conditions—grounded in official statistics from the{' '}
            <strong className={isDark ? 'text-white' : 'text-gray-900'}>
              World Health Organization (WHO)
            </strong>{' '}
            and the{' '}
            <strong className={isDark ? 'text-white' : 'text-gray-900'}>
              National Institutes of Health (NIH)
            </strong>.
          </p>
        </div>

        {/* ── 2. AUDIOLOGY & HEARING LOSS: BY THE NUMBERS ── */}
        <div className="mb-20 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black text-sm">
              01
            </span>
            <div>
              <h3
                className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-[#1a0528]'
                }`}
              >
                Global Impact: Audiology &amp; Hearing Loss
              </h3>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-purple-300/80' : 'text-gray-500'}`}>
                Scale, demographic reach, and future projections of auditory impairment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            
            {/* Stat 1: 1.5 Billion */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center mb-5">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-blue-500 mb-2">
                1.5B
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                The Global Scale
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Over 1.5 billion people worldwide live with varying degrees of hearing impairment, making it the 3rd leading chronic physical condition globally.
              </p>
            </div>

            {/* Stat 2: 2.5 Billion */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-purple-400 mb-2">
                2.5B
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                By 2050 (WHO Projection)
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Nearly 1 in 4 people will have hearing loss by 2050, with over 700 million individuals requiring active clinical rehabilitation and hearing aids.
              </p>
            </div>

            {/* Stat 3: 1 Billion Youth */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-amber-500 mb-2">
                1.0B
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Youth at Severe Risk
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Approximately 1 billion young adults worldwide face permanent, irreversible noise-induced hearing damage due to unsafe headphone listening practices.
              </p>
            </div>

            {/* Stat 4: 60% Preventable */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-400 mb-2">
                60%
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Preventable in Children
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Of the 34 million children with disabling hearing loss globally, 60% are fully preventable through timely newborn OAE screening and infection care.
              </p>
            </div>

          </div>
        </div>

        {/* ── 3. SPEECH & LANGUAGE CHALLENGES: BY THE NUMBERS ── */}
        <div className="mb-20 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black text-sm">
              02
            </span>
            <div>
              <h3
                className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-[#1a0528]'
                }`}
              >
                Global Impact: Speech &amp; Language Challenges
              </h3>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-purple-300/80' : 'text-gray-500'}`}>
                Developmental milestones, gender trends, and the intervention gap
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            
            {/* Stat 5: 3% to 16% */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-5">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-purple-400 mb-2">
                3%–16%
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Childhood Prevalence
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Between 3% and 16% of children worldwide navigate developmental speech and language delays, impacting fundamental early communication.
              </p>
            </div>

            {/* Stat 6: 10% to 15% */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-teal-400 mb-2">
                10%–15%
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Preschool Speech Sounds
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Roughly 10% to 15% of preschoolers exhibit speech sound disorders (lisping, omissions, substitutions) needing clinical articulation therapy.
              </p>
            </div>

            {/* Stat 7: 9.1% vs 5.2% */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-5">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-indigo-400 mb-2">
                9.1%
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Gender Ratio (Boys vs Girls)
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Statistically, speech and language delays are significantly more frequent in boys (9.1%) compared to girls (5.2%) during early childhood development.
              </p>
            </div>

            {/* Stat 8: 59.7% Gap */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-purple-400/40 shadow-xl'
                  : 'bg-white border-purple-100 shadow-md hover:shadow-xl'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-rose-400 mb-2">
                59.7%
              </div>
              <h4
                className={`text-base font-extrabold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                The Intervention Gap
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Only 59.7% of children with diagnosed speech disorders receive timely intervention—leaving over 40% exposed to avoidable academic and social friction.
              </p>
            </div>

          </div>
        </div>

        {/* ── 4. WHY EARLY ASSESSMENT MATTERS: THE SATARA CLINICAL CASE ── */}
        <div
          className={`p-8 sm:p-10 lg:p-12 rounded-3xl border mb-20 sm:mb-24 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-purple-950/40 via-[#250838] to-purple-950/40 border-purple-500/30 shadow-2xl'
              : 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200 shadow-lg'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clinical Directive</span>
            </div>

            <h3
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-[#180425]'
              }`}
            >
              Why Early Assessment Matters: The Neuroplastic Window
            </h3>

            <p
              className={`text-sm sm:text-base lg:text-lg leading-relaxed mb-6 font-normal ${
                isDark ? 'text-purple-200/90' : 'text-gray-700'
              }`}
            >
              Clinical evidence overwhelmingly proves that the auditory and speech centers of the human brain undergo their most fertile neuroplastic development before age 4. Identifying early flags—such as{' '}
              <strong className={isDark ? 'text-emerald-300' : 'text-purple-900'}>
                fewer than 10–20 words by 18–24 months
              </strong>
              , persistent speech sound substitutions, or straining to comprehend conversations in noisy classrooms—enables targeted therapeutic intervention that prevents lifelong academic barriers, social isolation, and behavioral frustration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-purple-300/20">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  18–24 Mo. Early Screen
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Soundproof Booth Audiometry
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Standardized RCI Protocols
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. SEAMLESS "READY TO SCHEDULE" SECTION ON #1b0528 BACKGROUND ── */}
        <div id="booking-section" className="w-full pt-4">
          <div className="relative w-full rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 text-center bg-[#250838]/90 text-white border border-purple-500/30 backdrop-blur-md">
            
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm font-bold text-purple-200 mb-5 border border-white/15">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RCI Registered Clinical Specialist • Satara, Maharashtra</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-5 leading-tight">
                Ready to Schedule Your Clinical Assessment?
              </h2>

              <p className="text-base sm:text-lg text-purple-200 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
                Take the decisive step toward auditory clarity and confident speech. Book a consultation with ASLP Palak Gandhi at VAANI Clinic, Satara.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                <Link
                  to={ROUTES.BOOKING}
                  className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-[#8cb87c] hover:bg-[#7fae6e] text-[#12220e] font-black text-base sm:text-lg shadow-[0_12px_28px_rgba(140,184,124,0.38)] hover:shadow-[0_16px_34px_rgba(140,184,124,0.48)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-[#12220e] group-hover:rotate-6 transition-transform" />
                  <span>Book Online Appointment</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={`tel:${APP_CONFIG.PHONE}`}
                  className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base border border-white/20 shadow-xs hover:border-purple-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                  <span>Call Clinic Directly</span>
                </a>
              </div>

              <div className="mt-10 pt-6 border-t border-purple-400/20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-purple-200 font-semibold">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Soundproof Acoustic Booth
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Same-day Audiogram Report
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Pediatric-Friendly Environment
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Certified RCI Specialist
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ClinicalCaseStudySection;
