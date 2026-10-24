import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Heart,
  Volume2,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '../../constants';
import { useClinicSettings, formatClinicAddress } from '../../context/ClinicSettingsContext';

export const Footer = () => {
  const {
    logoUrl,
    clinicName,
    settings,
    rciNumber,
    leadPractitioner,
    leadDegree,
    workingHours,
    sundayHours,
    social,
    primaryPhone,
  } = useClinicSettings();
  const clinicAddress = formatClinicAddress(settings) || 'Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002';
  const clinicPhone = primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
  const clinicEmail = settings?.contact?.officialEmail || 'info@vaaniclinic.com';
  const displayLogo = logoUrl || '/vaani-logo.png';
  const [flowerHovered, setFlowerHovered] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const whatsappDigits = (social?.whatsappPhone || clinicPhone || '919822012345').replace(/[^0-9]/g, '');

  return (
    /* Outer wrapper sharing the exact same padding and responsive border frame as the Hero, Services, and Booking sections */
    <footer
      className="w-full bg-white px-2 sm:px-3 md:px-4 lg:px-5 pb-3 sm:pb-5 pt-10 sm:pt-12 lg:pt-14 select-none relative overflow-visible box-border"
    >
      {/* ── TOP-CENTER ARCH BADGE (Positioned on footer with overflow-visible so it is NEVER cropped) ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <Link
          to={ROUTES.HOME}
          className="group relative block"
          title="Vaani Speech and Hearing Clinic - Home"
        >
          {/* Complete architectural circular medallion bridging the top boundary */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#301444] border-4 border-white shadow-xl flex items-center justify-center p-2.5 sm:p-3 lg:p-3.5 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_12px_36px_rgba(48,20,68,0.5)] group-hover:border-purple-200">
            <img
              src="/vaani-mark-arch-dark.png"
              alt="Vaani Clinic Line-Art Mark"
              className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
      </div>

      {/* ── CARD CANVAS MATCHING BOOKING SECTION (SEAMLESS PURE WHITE BG) ── */}
      <div className="relative w-full bg-white text-[#301444] rounded-[24px] sm:rounded-[34px] lg:rounded-[42px] overflow-hidden">

        {/* ── BOTANICAL LAVENDER FLOWERS BASE (User request: 'give the footer this background') ── */}
        <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden pointer-events-none select-none z-0">
          <img
            src="/lavender-footer-wide.png"
            alt="Lavender Botanical Base"
            className="w-full h-40 sm:h-52 md:h-60 lg:h-72 object-cover object-bottom opacity-90 transition-opacity duration-700"
          />
          {/* Subtle gradient wash over bottom to blend seamlessly into copyright text */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/95 via-white/50 to-transparent" />
        </div>

        {/* ── MAIN CONTENT CONTAINER (Full-width with card padding matching other sections, no artificial max-w-7xl restriction) ── */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12">
          
          {/* TOP ROW: GET IN TOUCH (Left) + CLINIC LOGO & PRACTITIONER (Right) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-14">
            
            {/* Top Left: Subtitle & Display Serif Headline */}
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea] animate-pulse" />
                <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#462064]/80">
                  Got clinical questions? Need expert audiology & speech care?
                </p>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-extrabold tracking-tight text-[#301444] leading-none select-text">
                <span className="inline-flex items-center flex-wrap">
                  GET IN T
                  {/* Botanical Lavender Flower Bloom in place of the letter 'O' */}
                  <span
                    onMouseEnter={() => setFlowerHovered(true)}
                    onMouseLeave={() => setFlowerHovered(false)}
                    className="inline-flex items-center justify-center align-middle mx-1 sm:mx-1.5 transition-transform duration-700 hover:rotate-180 cursor-pointer"
                    title="Vaani Lavender Bloom"
                  >
                    <svg
                      viewBox="0 0 40 40"
                      className="w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 drop-shadow-md transition-transform duration-500 hover:scale-110"
                      fill="none"
                    >
                      {/* Deep Purple Center */}
                      <circle cx="20" cy="20" r="6" fill="#301444" />
                      {/* Golden Pistil Core */}
                      <circle cx="20" cy="20" r="3" fill="#fbbf24" />
                      {/* Radiating Lavender Petals */}
                      <ellipse cx="20" cy="8" rx="3.8" ry="7" fill="#9333ea" />
                      <ellipse cx="20" cy="32" rx="3.8" ry="7" fill="#9333ea" />
                      <ellipse cx="8" cy="20" rx="7" ry="3.8" fill="#9333ea" />
                      <ellipse cx="32" cy="20" rx="7" ry="3.8" fill="#9333ea" />
                      <ellipse cx="11.5" cy="11.5" rx="3.8" ry="7" transform="rotate(-45 11.5 11.5)" fill="#a855f7" />
                      <ellipse cx="28.5" cy="11.5" rx="3.8" ry="7" transform="rotate(45 28.5 11.5)" fill="#a855f7" />
                      <ellipse cx="11.5" cy="28.5" rx="3.8" ry="7" transform="rotate(45 11.5 28.5)" fill="#a855f7" />
                      <ellipse cx="28.5" cy="28.5" rx="3.8" ry="7" transform="rotate(-45 28.5 28.5)" fill="#a855f7" />
                      <circle cx="20" cy="20" r="4.5" fill="#301444" />
                      <circle cx="20" cy="20" r="2.2" fill="#facc15" />
                    </svg>
                  </span>
                  UCH
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-[#462064]/80 font-normal leading-relaxed max-w-2xl pt-1">
                Satara’s premier center for advanced audiometric diagnostics, pediatric speech therapy, and personalized digital hearing aid solutions.
              </p>
            </div>

            {/* Top Right: Clinic Logo + Practitioner Credentials (User request: 'in right side keep logo') */}
            <div className="flex flex-col items-start lg:items-end space-y-3 lg:text-right flex-shrink-0">
              <Link to={ROUTES.HOME} className="block group" title={clinicName}>
                <img
                  src={displayLogo}
                  alt={clinicName}
                  className="h-14 sm:h-16 lg:h-20 xl:h-22 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <div className="space-y-1">
                <p className="text-sm sm:text-base lg:text-lg font-serif font-bold text-[#301444] tracking-wide">
                  Lead Audiologist &amp; Speech-Language Pathologist
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#7c3aed]">
                  {leadPractitioner || 'ASLP Palak Paresh Gandhi'}{' '}
                  <span className="text-[#301444]/70 font-normal">({leadDegree || 'BASLP, RCI'})</span>
                </p>
              </div>

              {/* RCI Accreditation Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#301444]/15 shadow-sm text-xs font-semibold text-[#301444]">
                <ShieldCheck className="w-4 h-4 text-[#9333ea]" />
                <span>RCI Registered Clinic • Reg. No. {rciNumber}</span>
              </div>
            </div>

          </div>

          {/* ── HAIRLINE HORIZONTAL DIVIDER ── */}
          <div className="w-full h-px bg-gradient-to-r from-[#462064]/25 via-[#462064]/15 to-transparent my-8 sm:my-12" />

          {/* ── MIDDLE ROW: 4 BALANCED COLUMNS SPANNING FULL WIDTH ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 items-start pb-20 sm:pb-24 lg:pb-28">
            
            {/* Col 1: NAVIGATION */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#462064]/90">
                Navigation
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base font-medium text-[#462064]">
                <li>
                  <Link
                    to={ROUTES.HOME}
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.SERVICES}
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Clinical Services</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.ABOUT}
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">About Practitioner</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.BOOKING}
                    className="text-[#9333ea] font-semibold hover:text-[#7c3aed] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Book Consultation</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.CONTACT}
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Contact & Clinic Hours</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: CLINICAL SPECIALTIES */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#462064]/90">
                Specialties & Care
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base font-medium text-[#462064]">
                <li>
                  <Link
                    to="/services#pta"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Pure Tone Audiometry (PTA)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#newborn"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Newborn OAE & BERA Screening</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#speech"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Speech-Language Therapy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#hearing-aids"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Digital Hearing Aid Trial & Fitting</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#stuttering"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Fluency, Voice & Stuttering</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#articulation"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Articulation Therapy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services#neuro"
                    className="hover:text-[#9333ea] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Neuro Rehabilitation</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: CLINIC LOCATION & HOURS */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#462064]/90">
                Clinic & Timings
              </h3>
              <ul className="space-y-3 text-sm sm:text-base font-medium text-[#462064]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#9333ea] flex-shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm">{clinicAddress}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#9333ea] flex-shrink-0" />
                  <a
                    href={`tel:${clinicPhone.replace(/\s+/g, '')}`}
                    className="hover:text-[#9333ea] transition-colors font-semibold text-xs sm:text-sm"
                  >
                    {clinicPhone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#9333ea] flex-shrink-0" />
                  <a
                    href={`mailto:${clinicEmail}`}
                    className="hover:text-[#9333ea] transition-colors text-xs sm:text-sm"
                  >
                    {clinicEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#9333ea] flex-shrink-0 mt-1" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-[#301444]">{workingHours || 'Mon – Sat: 9:30 AM – 7:30 PM'}</p>
                    <p className="text-[#462064]/75">{sundayHours || 'Sundays: By Prior Appointment'}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Col 4: SOCIAL CHANNELS & CIRCULAR BUTTONS (Matching reference design) */}
            <div className="space-y-4 lg:text-right flex flex-col lg:items-end">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#462064]/90 mb-1">
                  Official Channels
                </h3>
                <p className="text-xs text-[#462064]/75">
                  Connect for clinical insights, hearing health & patient care
                </p>
              </div>

              {/* Circular Social Pill Icons with White Background & Shadow */}
              <div className="flex items-center gap-3 sm:gap-4 pt-1">
                
                {/* Instagram */}
                <a
                  href={social?.instagramUrl || 'https://instagram.com/palakgandhi_maslp'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow Vaani Clinic on Instagram"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-[#301444] shadow-md hover:shadow-xl hover:scale-110 hover:bg-[#301444] hover:text-white transition-all duration-300 flex items-center justify-center border border-[#e2d0f5]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={social?.youtubeUrl || 'https://youtube.com/@vaaniclinic'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Subscribe to Vaani Clinic YouTube"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-[#301444] shadow-md hover:shadow-xl hover:scale-110 hover:bg-[#301444] hover:text-white transition-all duration-300 flex items-center justify-center border border-[#e2d0f5]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={social?.facebookUrl || 'https://facebook.com/vaaniclinic'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Follow Vaani Clinic on Facebook"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-[#301444] shadow-md hover:shadow-xl hover:scale-110 hover:bg-[#301444] hover:text-white transition-all duration-300 flex items-center justify-center border border-[#e2d0f5]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* WhatsApp Quick Chat */}
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-[#301444] shadow-md hover:shadow-xl hover:scale-110 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 flex items-center justify-center border border-[#e2d0f5]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 sm:w-5.5 sm:h-5.5"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>

              </div>
            </div>

          </div>

          {/* ── BOTTOM LEGAL & STANDARDS BAR ── */}
          <div className="pt-6 border-t border-[#301444]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#462064]/80 gap-3">
            <p>© {new Date().getFullYear()} {APP_CONFIG.fullName}. All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>Satara, Maharashtra</span>
              <span>•</span>
              <span>RCI Reg. Practice No. A-78942</span>
              <span>•</span>
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-[#7c3aed] hover:text-[#301444] transition-colors underline-offset-2 hover:underline"
              >
                Staff ERP Access
              </Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
