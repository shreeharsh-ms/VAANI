import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Calendar, User, LogOut, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { ROUTES } from '../../constants';
import { handleNavbarNavigation } from '../../utils/scrollUtils';

const WhatsAppIcon = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const GoogleMapsIcon = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#4885ed" d="M24 4C14.06 4 6 12.06 6 22c0 7.87 5.07 14.56 12.19 16.92L24 44l5.81-5.08C36.93 36.56 42 29.87 42 22c0-9.94-8.06-18-18-18z"/>
    <path fill="#ea4335" d="M24 4c-9.94 0-18 8.06-18 18 0 4.17 1.43 8.01 3.84 11.08L24 22V4z"/>
    <path fill="#fbbc05" d="M24 22l14.16 11.08C40.57 30.01 42 26.17 42 22c0-9.94-8.06-18-18-18v18z"/>
    <path fill="#34a853" d="M24 44l-5.81-5.08A17.92 17.92 0 019.84 33.08L24 22l14.16 11.08a17.92 17.92 0 01-8.35 5.84L24 44z"/>
    <circle fill="#ffffff" cx="24" cy="22" r="7"/>
  </svg>
);

export const Navbar = () => {
  const { logoUrl, clinicName, primaryPhone, settings } = useClinicSettings();
  const contactPhone = primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
  const isCustomLogo = logoUrl && logoUrl !== '/vaani-logo.png' && logoUrl !== '/vaani-logo-white.png';
  const displayWhiteLogo = isCustomLogo ? logoUrl : '/vaani-logo-white.png';
  const displayDarkLogo = isCustomLogo ? logoUrl : '/vaani-logo.png';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About Practitioner', path: ROUTES.ABOUT },
    { label: 'Services', path: ROUTES.SERVICES },
    { label: 'Blogs', path: ROUTES.BLOGS },
    { label: 'Contact Us', path: ROUTES.CONTACT },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isAbout = location.pathname === ROUTES.ABOUT;
  const isContact = location.pathname === ROUTES.CONTACT || location.pathname.startsWith('/contact');
  const isBlogs = location.pathname === ROUTES.BLOGS || location.pathname.startsWith('/blogs');
  const isVerify = location.pathname.startsWith('/verify');
  const isSantoNavbar = isContact || isBlogs || isVerify;
  const santoBg = isVerify ? 'bg-transparent' : isContact ? 'bg-white' : 'bg-[#f7f6f4]';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isSantoNavbar
          ? `${santoBg} border-none shadow-none`
          : isAbout
          ? 'border-none shadow-none text-white'
          : 'border-b border-purple-100/80 dark:border-purple-900/50 bg-white/95 dark:bg-[#18092a]/95 backdrop-blur-md shadow-xs'
      }`}
    >
      {/* ── SANTO-STYLE NAVBAR FOR CONTACT & BLOGS PAGES: MATCHES HOME HERO ── */}
      {isSantoNavbar ? (
        <div className={`w-full ${santoBg} select-none border-none shadow-none`}>
          <div className="w-full flex items-center justify-between">
            {/* Top-Left: Logo inside Dark Tab with Fillets */}
            <div className="relative bg-[#301444] text-white px-4 sm:px-8 lg:px-10 py-2.5 sm:py-4 lg:py-4.5 rounded-br-[24px] sm:rounded-br-[38px] flex items-center self-start shrink-0">
              <Link
                to={ROUTES.HOME}
                onClick={(e) => handleNavbarNavigation(e, ROUTES.HOME, location.pathname)}
                className="flex items-center group py-0.5"
                title={clinicName}
              >
                <img
                  src={displayWhiteLogo}
                  alt={clinicName}
                  className="h-9 sm:h-13 lg:h-15 xl:h-[68px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
                />
              </Link>

              {/* Top-Right Inverted Curved Corner */}
              <svg
                className="absolute left-[calc(100%-1px)] top-0 w-7 sm:w-9 lg:w-[38px] h-7 sm:h-9 lg:h-[38px] pointer-events-none"
                viewBox="0 0 38 38"
                fill="none"
                aria-hidden="true"
              >
                <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
              </svg>

              {/* Bottom-Left Inverted Curved Corner */}
              <svg
                className="absolute left-0 top-[calc(100%-1px)] w-7 sm:w-9 lg:w-[38px] h-7 sm:h-9 lg:h-[38px] pointer-events-none"
                viewBox="0 0 38 38"
                fill="none"
                aria-hidden="true"
              >
                <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
              </svg>
            </div>

            {/* Center: Navigation Pill Buttons */}
            <nav className="hidden lg:flex flex-nowrap items-center justify-center gap-2 xl:gap-3 py-3 sm:py-4 px-2 xl:px-4">
              {[
                { label: 'About Practitioner', path: ROUTES.ABOUT },
                { label: 'Services', path: ROUTES.SERVICES },
                { label: 'Blogs', path: ROUTES.BLOGS },
                { label: 'Contact Us', path: ROUTES.CONTACT },
              ].map((item) => {
                const isCurrent = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={(e) => handleNavbarNavigation(e, item.path, location.pathname)}
                    className={`px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] xl:text-[14px] font-bold whitespace-nowrap transition-all duration-150 hover:scale-105 active:scale-95 ${
                      isCurrent
                        ? 'bg-[#301444] text-white shadow-md'
                        : 'bg-white hover:bg-purple-50 text-[#301444] border border-gray-200/90 shadow-sm'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Prominent Book an Appointment Button + Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-4 pr-3.5 sm:px-8 lg:px-10 xl:px-12 self-center shrink-0">
              <Link
                to="/#booking-section"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    if (window.lenis) {
                      window.lenis.scrollTo('#booking-section', { offset: -20, duration: 1.3 });
                    } else {
                      const el = document.getElementById('booking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }}
                className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold bg-[#301444] hover:bg-[#220a32] text-white transition-all shadow-md hover:shadow-purple-950/60 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-purple-200" />
                <span>Book an Appointment</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-[#301444] bg-white hover:bg-purple-50 border border-purple-200/90 shadow-2xs transition-all cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#301444]" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── ABOUT PAGE FADING LAVENDER SHADE OVERLAY (Luminous, Airy Lavender Mist blending smoothly into transparent) ── */}
          {isAbout && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-44 lg:h-48"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(110, 50, 130, 0.65) 0%, rgba(125, 62, 145, 0.45) 35%, rgba(145, 82, 165, 0.22) 62%, rgba(165, 110, 185, 0.07) 84%, rgba(165, 110, 185, 0) 100%)',
                backdropFilter: 'blur(8px)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              }}
            />
          )}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center justify-between h-[76px] sm:h-[88px] lg:h-[96px] xl:h-[104px]">
          {/* Brand Logo (Matching Home Page Scale) */}
          <Link
            to={ROUTES.HOME}
            onClick={(e) => handleNavbarNavigation(e, ROUTES.HOME, location.pathname)}
            className="flex items-center group py-1 flex-shrink-0"
            title={clinicName}
          >
            <img
              src={displayDarkLogo}
              alt={clinicName}
              className={`h-11 sm:h-13 lg:h-15 xl:h-[68px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] ${
                isAbout ? 'hidden' : 'dark:hidden'
              } drop-shadow-xs`}
            />
            <img
              src={displayWhiteLogo}
              alt={clinicName}
              className={`h-11 sm:h-13 lg:h-15 xl:h-[68px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] ${
                isAbout ? 'block' : 'hidden dark:block'
              } drop-shadow-md`}
            />
          </Link>

          {/* Desktop Navigation Links (Matching Home Page Text Size and Font Weight) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleNavbarNavigation(e, link.path, location.pathname)}
                  className={`transition-all duration-200 ${
                    isAbout
                      ? active
                        ? 'px-3.5 xl:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[14.5px] font-bold text-white border-b-2 border-purple-300 drop-shadow-xs'
                        : 'px-3.5 xl:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[14.5px] font-bold text-white/90 hover:text-white hover:bg-white/10 rounded-full'
                      : active
                        ? 'px-3.5 xl:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold text-white bg-gradient-to-r from-purple-700 to-[#301444] dark:from-purple-600 dark:to-indigo-600 shadow-md shadow-purple-900/20 scale-[1.02]'
                        : 'px-3.5 xl:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold text-gray-700 dark:text-purple-100/85 hover:text-[#301444] dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-purple-900/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Matching Home Page Button Scale and Dimensions) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            {isAbout ? (
              <Link
                to="/#booking-section"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    if (window.lenis) {
                      window.lenis.scrollTo('#booking-section', { offset: -20, duration: 1.3 });
                    } else {
                      const el = document.getElementById('booking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 xl:gap-2 px-4 xl:px-7 py-2 xl:py-3 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold text-[#301444] bg-white hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-purple-950/20 hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-purple-700" />
                <span>Book an Appointment</span>
              </Link>
            ) : (
              <>
                {/* Theme Toggle Pill */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full transition-all duration-200 border border-purple-200 dark:border-purple-800/80 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-amber-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 shadow-xs hover:scale-105 active:scale-95"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200 hover:rotate-45" />
                  ) : (
                    <Moon className="w-4 h-4 text-purple-200 transition-transform duration-200 hover:-rotate-12" />
                  )}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to={ROUTES.DASHBOARD.HOME}
                      className="inline-flex items-center gap-2 px-4 xl:px-4.5 py-2 xl:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-[#301444] hover:from-purple-800 hover:to-[#200b30] shadow-md shadow-purple-900/25 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Calendar className="w-4 h-4 text-purple-200" />
                      <span>ERP Dashboard</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 transition-all duration-150 hover:scale-105 active:scale-95"
                      title="Logout of Staff ERP"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to={ROUTES.LOGIN}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/80 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Staff Portal</span>
                    </Link>

                    <Link
                      to="/#booking-section"
                      className="inline-flex items-center gap-2 px-4.5 xl:px-5 py-2 xl:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-[#301444] hover:from-purple-800 hover:to-[#200b30] shadow-md shadow-purple-900/25 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Calendar className="w-4 h-4 text-purple-200" />
                      <span>Book Appointment</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl cursor-pointer ${
                isAbout
                  ? 'text-white border border-white/30 hover:bg-white/10'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/80'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      </>
    )}

      {/* Unified Mobile Navigation Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#faf8fc] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Lavender flower on white background theme */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img
              src="/faint-lavender-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-left-top opacity-95"
            />
            {/* Blooming lavender flowers in the lower canvas */}
            <img
              src="/lavender-footer.png"
              alt=""
              className="absolute bottom-28 inset-x-0 w-full h-44 object-cover object-top opacity-70 pointer-events-none"
            />
            {/* Soft airy translucent tint for crisp card contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/50 backdrop-blur-[0.3px]" />
          </div>

          {/* Header inside drawer */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-purple-100/80 bg-[#301444] text-white shadow-sm flex-shrink-0">
            <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} className="flex items-center">
              <img src={displayWhiteLogo} alt={clinicName} className="h-9 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Middle Nav Links (Scrollable if needed) */}
          <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
            {[
              { label: 'About Practitioner', path: ROUTES.ABOUT, desc: 'Meet our senior audiology & speech specialist' },
              { label: 'Clinical Services', path: ROUTES.SERVICES, desc: 'Hearing tests, speech therapy & hearing aids' },
              { label: 'Hearing & Speech Blogs', path: ROUTES.BLOGS, desc: 'Doctor insights & patient hearing care guides' },
              { label: 'Contact Clinic', path: ROUTES.CONTACT, desc: 'Sadashiv Peth clinic directions & hours' },
            ].map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavbarNavigation(e, item.path, location.pathname);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border shadow-xs transition-all group backdrop-blur-xs ${
                    active
                      ? 'bg-purple-100/90 border-purple-300 shadow-sm'
                      : 'bg-white/85 hover:bg-white/95 border-purple-100/90'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-[#301444] group-hover:text-purple-900 flex items-center gap-2">
                      <span>{item.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />}
                    </div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              );
            })}

            {/* Clinic Location & Hours Info Card */}
            <div className="pt-2">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100/80 backdrop-blur-xs space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2 font-bold text-[#301444]">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Sadashiv Peth, Satara • Mon-Sat 9:30 AM – 6:30 PM</span>
                </div>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 font-bold text-[#301444] hover:text-purple-700 transition-colors"
                >
                  <span>📞 Direct Consultation: {contactPhone}</span>
                </a>
              </div>
            </div>

            {/* Staff ERP Login (Clean discrete card) */}
            <div className="pt-1">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/70 border border-purple-100 text-xs">
                  <Link
                    to={ROUTES.DASHBOARD.HOME}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-[#301444] hover:underline flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>ERP Staff Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="font-semibold text-rose-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold text-purple-700/80 hover:text-purple-900 bg-white/60 hover:bg-white border border-purple-100/60 transition-colors"
                >
                  <User className="w-3 h-3 text-purple-500" />
                  <span>Staff Portal Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Pinned Action Bar: WhatsApp, Maps, and Book an Appointment */}
          <div className="relative z-10 px-5 pt-3 pb-6 sm:pb-8 border-t border-purple-100/90 bg-white/92 backdrop-blur-md flex flex-col gap-2.5 shadow-[0_-8px_30px_rgba(48,20,68,0.08)] flex-shrink-0">
            
            {/* Direct Quick Action Buttons: WhatsApp & Google Maps */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/919876543210?text=Hello%20Vaani%20Clinic%20Satara%2C%20I%20would%20like%20to%20enquire%20about%20hearing%20and%20speech%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                title="WhatsApp Us"
              >
                <WhatsAppIcon className="w-4.5 h-4.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href="https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Sadashiv+Peth+Satara"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/90 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Google Maps Location"
              >
                <GoogleMapsIcon className="w-4.5 h-4.5" />
                <span>Google Maps</span>
              </a>
            </div>

            {/* Main Book an Appointment Button Pinned at Bottom */}
            <Link
              to="/#booking-section"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (location.pathname === '/') {
                  e.preventDefault();
                  if (window.lenis) {
                    window.lenis.scrollTo('#booking-section', { offset: -20, duration: 1.3 });
                  } else {
                    const el = document.getElementById('booking-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm text-white bg-[#301444] hover:bg-[#200930] shadow-md shadow-purple-950/30 transition-all active:scale-95 cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
              <span>Book an Appointment</span>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
