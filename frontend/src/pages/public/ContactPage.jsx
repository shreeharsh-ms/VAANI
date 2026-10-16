import React from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';

export const ContactPage = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'VAANI Speech and Hearing Clinic Sadashiv Peth Satara Maharashtra 415002'
  )}`;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-white text-[#160424] pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24 lg:pb-28 px-4 sm:px-6 lg:px-8 xl:px-10 select-none">
      <div className="w-full max-w-[1600px] mx-auto space-y-16 sm:space-y-20 lg:space-y-28">
        
        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1: FIND & VISIT OUR HOSPITAL LOCATIONS (2-ROW ASYMMETRIC GRID)
            ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-16">
          
          {/* ── ROW 1: Heading & Info (Left) + Exterior Building Image (Right) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Top Left: Main Headline & Conveniently Located text */}
            <div className="lg:col-span-5 flex flex-col justify-center pr-0 lg:pr-4 xl:pr-8">
              {/* Eyebrow Label matching other pages */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6e468e] tracking-wide mb-2 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#6e468e] animate-pulse" />
                <span>CLINICAL LOCATION &amp; ACCESSIBILITY</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] text-[#160424] tracking-tight mb-5 sm:mb-7">
                Find and Visit Our<br />
                Hospital Locations
              </h1>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#160424] tracking-tight">
                  Conveniently Located:
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-normal max-w-md">
                  Our hospitals are strategically located to ensure easy access for all patients. Find the nearest hospital to you using our location search tool.
                </p>
              </div>
            </div>

            {/* Top Right: Modern Hospital Building Exterior with left fade & bottom-right chamfer notch */}
            <div className="lg:col-span-7 flex justify-end w-full">
              <div
                className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] lg:h-[380px] xl:h-[420px] overflow-hidden rounded-2xl shadow-sm"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)',
                }}
              >
                <img
                  src="/contact-building-clean.png"
                  alt="Modern Hospital Building Architecture"
                  className="w-full h-full object-cover object-right"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 14%, black 32%)',
                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 14%, black 32%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── ROW 2: Clinical Room Interior (Left) + Facilities & Google Maps Button (Right) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Bottom Left: Modern Clinical Suite Interior with top-left chamfer notch */}
            <div className="lg:col-span-7 flex justify-start w-full order-2 lg:order-1">
              <div
                className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] lg:h-[380px] xl:h-[420px] overflow-hidden rounded-2xl shadow-sm"
                style={{
                  clipPath: 'polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px)',
                }}
              >
                <img
                  src="/contact-room-clean.png"
                  alt="State-of-the-Art Medical & Diagnostic Suite"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Bottom Right: State-of-the-Art Facilities text & "See on Google Map" button */}
            <div className="lg:col-span-5 flex flex-col justify-center pl-0 lg:pl-6 xl:pl-10 order-1 lg:order-2">
              <div className="space-y-2 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-[#160424] tracking-tight">
                  State-of-the-Art Facilities
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-normal max-w-md">
                  Each location is equipped with modern medical technology and comfortable amenities to provide the best care possible.
                </p>
              </div>

              {/* Action Button: "See on Google Map" with Vaani Pill Button typography */}
              <div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border border-purple-200/90 hover:border-purple-300 bg-white hover:bg-purple-50/50 text-[#301444] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all group"
                >
                  <MapPin className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span>See on Google Map</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2: EXPERIENCE EXCEPTIONAL HEALTHCARE SERVICES WITH US
            ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left: Heading, Description & Schedule Button */}
          <div className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-6 xl:pr-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6e468e] tracking-wide mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-[#6e468e] animate-pulse" />
              <span>COMPREHENSIVE CLINICAL CARE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold leading-[1.1] text-[#160424] tracking-tight mb-5 sm:mb-6">
              Experience Exceptional{' '}
              <br className="hidden sm:inline" />
              Healthcare Services with Us
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-normal mb-8 sm:mb-10 max-w-xl">
              We understand that each individual's path to wellness is unique. That's why we've gathered a wealth of resources, expert insights, and practical advice to support you in every step of your healthcare journey.
            </p>

            <div>
              <Link
                to="/#booking-section"
                className="inline-flex items-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#301444] hover:bg-[#200930] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 group shadow-md hover:shadow-purple-950/40 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-purple-200" />
                <span>Schedule Your Appointment</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Consultation Photo with Top-Left Notch and Floating Expand Badge */}
          <div className="lg:col-span-6 flex justify-end w-full">
            <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] lg:h-[400px] xl:h-[440px]">
              {/* Image Frame with Top-Left Notch */}
              <div
                className="w-full h-full overflow-hidden rounded-2xl shadow-sm"
                style={{
                  clipPath: 'polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px)',
                }}
              >
                <img
                  src="/contact-consult-clean.png"
                  alt="Specialist doctor consulting with patient"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating Bottom-Right Circular Icon Badge */}
              <div
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-purple-100 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
              >
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#301444]">
                  {/* Top-Right Arrow */}
                  <svg
                    className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                  {/* Bottom-Left Arrow */}
                  <svg
                    className="absolute bottom-0 left-0 w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="17" y1="7" x2="7" y2="17" />
                    <polyline points="17 17 7 17 7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3: FULL-WIDTH GOOGLE MAPS (ALIGNED WITH NAVBAR WIDTH)
            ══════════════════════════════════════════════════════════════════ */}
        <div className="w-full space-y-4">
          {/* Header row above map */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6e468e] mb-1">
                <MapPin className="w-4 h-4 text-[#301444]" />
                <span>Locate Us in Satara</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#160424] tracking-tight">
                VAANI Speech &amp; Hearing Clinic
              </h3>
            </div>
            
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#301444] hover:text-purple-700 transition-colors"
            >
              <span>Open Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Google Map Embed (Full Navbar Width) */}
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] overflow-hidden rounded-[20px] sm:rounded-[28px] border border-gray-200/90 shadow-lg bg-gray-100">
            <iframe
              title="VAANI Speech and Hearing Clinic Location"
              src="https://maps.google.com/maps?q=Sadashiv+Peth,+Satara,+Maharashtra+415002&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter saturate-[1.08] contrast-[1.02]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Quick-Info Card over Map */}
            <div className="hidden sm:flex absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-gray-200/80 items-center gap-4 max-w-md">
              <div className="w-10 h-10 rounded-xl bg-[#301444] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <MapPin className="w-5 h-5 text-purple-200" />
              </div>
              <div className="text-xs sm:text-[13px] leading-tight">
                <strong className="block text-gray-900 font-bold mb-0.5">VAANI Clinic</strong>
                <span className="text-gray-600">Sadashiv Peth, Satara, Maharashtra 415002</span>
                <span className="block text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mon – Sat: 9:30 AM – 6:30 PM
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
