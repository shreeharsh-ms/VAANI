import React from 'react';
import { Award, Volume2, ShieldCheck, Activity } from 'lucide-react';
import AudiologyMedicalIllustration from './AudiologyMedicalIllustration';

export const ClinicalPreventionSection = () => {
  return (
    <section className="w-full bg-[#301444] text-white py-12 sm:py-16 lg:py-20 px-6 sm:px-11 md:px-12 lg:px-14 xl:px-[76px] relative overflow-hidden select-none border-t border-purple-900/40">
      
      {/* Background Flowing Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Full-Width Content Container matching the exact padding & alignment of Hero Section above */}
      <div className="w-full relative z-10 space-y-10 sm:space-y-12 lg:space-y-14">
        
        {/* Top Row: Heading, Eyebrow & Professional Paragraph (Left) + Stylized Medical Diagnostic Graphic (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Proportionate Professional Paragraph */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Clinical Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold tracking-wide">
              <Activity className="w-3.5 h-3.5 text-purple-300" />
              <span>Clinical Diagnostic & Therapeutic Protocols</span>
            </div>

            {/* Headline - Clean, properly sized, not oversized */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] font-bold text-white leading-[1.15] tracking-tight">
              Long-term prevention &<br />
              early rehabilitation of speech<br />
              and hearing disorders!
            </h2>

            {/* Tastefully sized professional paragraph */}
            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-normal max-w-xl">
              Early diagnostic intervention and evidence-based clinical therapy form the cornerstone of speech-language rehabilitation and auditory preservation. Standardized pure-tone audiometry, automated otoacoustic emissions (OAE), and targeted neuro-linguistic therapy safeguard cognitive communication, eliminate developmental delay, and restore long-term sensory wellness.
            </p>

            {/* Specialized Clinical Focus Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                'Pure Tone Audiometry (PTA)',
                'Otoacoustic Emissions (OAE)',
                'Speech-Language Pathology',
                'Auditory Brainstem Response',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#462064]/90 border border-purple-400/20 text-purple-200 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Right Column: Stylized Anatomical Ear + Diagnostic Gauge Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <AudiologyMedicalIllustration />
          </div>

        </div>

        {/* Bottom Row: Two Balanced Feature Cards matching the reference layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-1">
          
          {/* Card 1: RCI Quality Certificate */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4d226e]/95 via-[#3f195c]/90 to-[#2c0e44]/95 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 lg:p-8 border border-purple-400/25 shadow-xl flex items-center justify-between gap-5 group hover:border-purple-300/50 hover:shadow-[0_20px_50px_rgba(147,51,234,0.25)] transition-all duration-300 min-h-[160px] sm:min-h-[180px]">
            {/* Ambient internal card glow */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

            <div className="space-y-2 flex-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Accredited Clinical Protocol</span>
              </div>

              <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-white tracking-tight leading-snug group-hover:text-purple-100 transition-colors">
                RCI quality & clinical certificate
              </h3>

              <p className="text-xs sm:text-[13px] text-purple-200/75 leading-relaxed font-normal max-w-lg">
                Standardized audiological diagnostic evaluations and pediatric speech therapy executed in strict accordance with statutory Rehabilitation Council of India guidelines.
              </p>
            </div>

            {/* Stamp/Badge Emblem */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-purple-500/20 to-fuchsia-500/25 border border-purple-300/40 flex flex-col items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 group-hover:border-purple-200/70 transition-all duration-300 z-10">
              <Award className="w-8 h-8 sm:w-9 sm:h-9 text-purple-200 drop-shadow-[0_4px_10px_rgba(217,70,239,0.5)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-200/90 mt-0.5">Certified</span>
            </div>
          </div>

          {/* Card 2: Objective Screening & Diagnostic Mechanism */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4d226e]/95 via-[#3f195c]/90 to-[#2c0e44]/95 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 lg:p-8 border border-purple-400/25 shadow-xl flex items-center justify-between gap-5 group hover:border-purple-300/50 hover:shadow-[0_20px_50px_rgba(147,51,234,0.25)] transition-all duration-300 min-h-[160px] sm:min-h-[180px]">
            {/* Ambient internal card glow */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all pointer-events-none" />

            <div className="space-y-2 flex-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-400/30 text-fuchsia-300 text-[11px] font-semibold tracking-wide">
                <Volume2 className="w-3.5 h-3.5 text-fuchsia-300" />
                <span>Zero Subjective Bias</span>
              </div>

              <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-white tracking-tight leading-snug group-hover:text-purple-100 transition-colors">
                Objective screening evaluates cochlea, bypassing subjective error
              </h3>

              <p className="text-xs sm:text-[13px] text-purple-200/75 leading-relaxed font-normal max-w-lg">
                Automated DPOAE emissions and high-frequency tympanometry deliver precise inner-ear cochlear thresholds without requiring patient verbal response.
              </p>
            </div>

            {/* Sensor/Acoustic Wave Emblem */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-purple-500/20 to-pink-500/25 border border-purple-300/40 flex flex-col items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 group-hover:border-purple-200/70 transition-all duration-300 z-10">
              <Volume2 className="w-8 h-8 sm:w-9 sm:h-9 text-purple-200 drop-shadow-[0_4px_10px_rgba(168,85,247,0.5)]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-200/90 mt-0.5">Precision</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ClinicalPreventionSection;
