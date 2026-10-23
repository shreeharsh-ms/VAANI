import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  MessageSquare,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Phone,
  CheckCircle2,
  Download,
  Star,
  Check,
  X,
  Menu,
  MapPin,
  Send,
  Bot,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { handleNavbarNavigation } from '../../utils/scrollUtils';
import WatchLearnGrowSection from '../../components/home/WatchLearnGrowSection';
import ScrollRevealCaseStudy from '../../components/home/ScrollRevealCaseStudy';

const WhatsAppIcon = ({ className = "w-6 h-6 sm:w-7 sm:h-7" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const GoogleMapsIcon = ({ className = "w-6 h-6 sm:w-7 sm:h-7" }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#4885ed" d="M24 4C14.06 4 6 12.06 6 22c0 7.87 5.07 14.56 12.19 16.92L24 44l5.81-5.08C36.93 36.56 42 29.87 42 22c0-9.94-8.06-18-18-18z"/>
    <path fill="#ea4335" d="M24 4c-9.94 0-18 8.06-18 18 0 4.17 1.43 8.01 3.84 11.08L24 22V4z"/>
    <path fill="#fbbc05" d="M24 22l14.16 11.08C40.57 30.01 42 26.17 42 22c0-9.94-8.06-18-18-18v18z"/>
    <path fill="#34a853" d="M24 44l-5.81-5.08A17.92 17.92 0 019.84 33.08L24 22l14.16 11.08a17.92 17.92 0 01-8.35 5.84L24 44z"/>
    <circle fill="#ffffff" cx="24" cy="22" r="7"/>
  </svg>
);

const CuteChatbotIcon = ({ className = "w-6 h-6 sm:w-7 sm:h-7" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 10V4" stroke="#f472b6" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="24" cy="4" r="3.2" fill="#f43f5e" />
    <rect x="7" y="10" width="34" height="28" rx="12" fill="#301444" stroke="#c084fc" strokeWidth="2" />
    <rect x="11" y="14" width="26" height="20" rx="7" fill="#180424" />
    <ellipse cx="18" cy="22.5" rx="3.5" ry="4" fill="#38bdf8" />
    <circle cx="19.2" cy="21" r="1.4" fill="#ffffff" />
    <circle cx="17" cy="24.5" r="0.75" fill="#ffffff" />
    <ellipse cx="30" cy="22.5" rx="3.5" ry="4" fill="#38bdf8" />
    <circle cx="31.2" cy="21" r="1.4" fill="#ffffff" />
    <circle cx="29" cy="24.5" r="0.75" fill="#ffffff" />
    <ellipse cx="14.5" cy="27.5" rx="2" ry="1.2" fill="#fb7185" opacity="0.9" />
    <ellipse cx="33.5" cy="27.5" rx="2" ry="1.2" fill="#fb7185" opacity="0.9" />
    <path d="M21 27C21.8 29.2 26.2 29.2 27 27" stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round" />
    <rect x="3.5" y="17" width="4" height="14" rx="2" fill="#e879f9" />
    <rect x="40.5" y="17" width="4" height="14" rx="2" fill="#e879f9" />
  </svg>
);

export const ServicesPage = () => {
  const { logoUrl, clinicName, settings, primaryPhone, social } = useClinicSettings();
  const contactPhone = primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
  const whatsappNumber = (social?.whatsappPhone || primaryPhone || '8857830151').replace(/\D/g, '');
  const leadPractitioner = settings?.credentials?.leadPractitioner || 'Palak Gandhi';
  const leadDegree = settings?.credentials?.leadDegree || 'MASLP';
  const isCustomLogo = logoUrl && logoUrl !== '/vaani-logo.png' && logoUrl !== '/vaani-logo-white.png';
  const displayWhiteLogo = isCustomLogo ? logoUrl : '/vaani-logo-white.png';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputChatMessage, setInputChatMessage] = useState('');

  const handleChatQuickQuery = (query) => {
    let response = '';
    if (query.includes('Hearing Test')) {
      response = 'We conduct comprehensive Pure Tone Audiometry (PTA) in a soundproof acoustic chamber, plus Tympanometry, BERA, and OAE testing at our Satara center.';
    } else if (query.includes('Speech Delay')) {
      response = 'Our RCI-certified speech therapists specialize in childhood speech delay, stuttering therapy, articulation disorders, and autism communication.';
    } else if (query.includes('Hearing Aid')) {
      response = 'We offer live free digital hearing aid trials with top global brands (Signia, Phonak, Widex) with computerized fitting and lifetime aftercare in Satara.';
    } else {
      response = 'VAANI Clinic is located at Sadashiv Peth, Satara. We are open Monday to Saturday from 9:30 AM to 6:30 PM.';
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'bot', text: response, action: true },
    ]);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!inputChatMessage.trim()) return;
    const userText = inputChatMessage.trim();
    setInputChatMessage('');

    let botReply = 'Thank you for your enquiry. Our clinical specialist in Satara can assist you directly. Would you like to schedule an in-clinic consultation?';
    const lower = userText.toLowerCase();
    if (lower.includes('price') || lower.includes('fee') || lower.includes('cost')) {
      botReply = 'Audiometry tests start at ₹800, and speech consultations start from ₹600. Free digital hearing aid trials are available!';
    } else if (lower.includes('timing') || lower.includes('time') || lower.includes('when')) {
      botReply = 'We are open Monday to Saturday: 9:30 AM – 6:30 PM. Walk-ins and pre-booked appointments are welcome.';
    } else if (lower.includes('where') || lower.includes('location') || lower.includes('address')) {
      botReply = 'We are located at Sadashiv Peth, Satara, Maharashtra 415002 (Opposite Civil Hospital area).';
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'bot', text: botReply, action: true },
    ]);
  };

  const scrollToServices = () => {
    document.getElementById('services-catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#2a0845] select-none box-border flex flex-col">

      {/* ── 1. UPPER DARK PURPLE FRAME CONTAINER (With Outward Rounded Bottom Corners matching reference) ── */}
      <div className="w-full bg-[#301444] p-2 sm:p-3 md:p-4 lg:p-5 pb-6 sm:pb-8 lg:pb-10 rounded-b-[28px] sm:rounded-b-[40px] lg:rounded-b-[52px] shadow-2xl flex flex-col flex-shrink-0">
        
        {/* Exact Santo-style Framed Hero Card - Full Viewport Height */}
        <div className="relative w-full h-[calc(100vh-1rem)] sm:h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] min-h-[580px] sm:min-h-[660px] max-h-[1080px] bg-white rounded-tr-[24px] sm:rounded-tr-[34px] lg:rounded-tr-[42px] rounded-br-[24px] sm:rounded-br-[34px] lg:rounded-br-[42px] rounded-bl-[24px] sm:rounded-bl-[34px] lg:rounded-bl-[42px] rounded-tl-none overflow-hidden shadow-2xl flex flex-col justify-between flex-shrink-0">
        
        {/* ── 1. EXACT HOME PAGE NAVBAR INSIDE CANVAS ── */}
        <header className="relative w-full flex items-center justify-between z-30 flex-shrink-0">
          
          {/* Top-Left: Logo inside Dark Tab with Fillets */}
          <div className="relative bg-[#301444] text-white px-4 sm:px-8 lg:px-10 py-2.5 sm:py-4 lg:py-4.5 rounded-br-[22px] sm:rounded-br-[38px] flex items-center self-start flex-shrink-0">
            <Link
              to={ROUTES.HOME}
              onClick={(e) => handleNavbarNavigation(e, ROUTES.HOME, window.location.pathname)}
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
              className="absolute left-[calc(100%-1px)] top-0 w-6 sm:w-9 lg:w-[38px] h-6 sm:h-9 lg:h-[38px] pointer-events-none"
              viewBox="0 0 38 38"
              fill="none"
              aria-hidden="true"
            >
              <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
            </svg>

            {/* Bottom-Left Inverted Curved Corner */}
            <svg
              className="absolute left-0 top-[calc(100%-1px)] w-6 sm:w-9 lg:w-[38px] h-6 sm:h-9 lg:h-[38px] pointer-events-none"
              viewBox="0 0 38 38"
              fill="none"
              aria-hidden="true"
            >
              <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
            </svg>
          </div>

          {/* Center: Navigation Pill Buttons (Desktop Only) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 py-3 sm:py-4 px-3 sm:px-6">
            {[
              { label: 'About Practitioner', path: ROUTES.ABOUT },
              { label: 'Services', path: ROUTES.SERVICES },
              { label: 'Blogs', path: ROUTES.BLOGS },
              { label: 'Contact Us', path: ROUTES.CONTACT },
            ].map((item) => {
              const isCurrent = item.path === ROUTES.SERVICES;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => handleNavbarNavigation(e, item.path, window.location.pathname)}
                  className={`px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold transition-all duration-150 hover:scale-105 active:scale-95 ${
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

          {/* Right: Book an Appointment Button (Desktop) + Hamburger Button (Mobile) */}
          <div className="flex items-center gap-2 py-2.5 sm:py-4 px-3 sm:px-8">
            <Link
              to="/#booking-section"
              className="hidden lg:inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold bg-[#301444] hover:bg-[#220a32] text-white transition-all shadow-md hover:shadow-purple-950/60 hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-purple-200" />
              <span>Book an Appointment</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-full border border-purple-200/90 bg-white/95 text-[#301444] hover:bg-purple-50 shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#301444]" /> : <Menu className="w-5 h-5 text-[#301444]" />}
            </button>
          </div>
        </header>

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
              <img
                src="/lavender-footer.png"
                alt=""
                className="absolute bottom-28 inset-x-0 w-full h-44 object-cover object-top opacity-70 pointer-events-none"
              />
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

            {/* Middle Nav Links */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
              {[
                { label: 'About Practitioner', path: ROUTES.ABOUT, desc: 'Meet our senior audiology & speech specialist' },
                { label: 'Clinical Services', path: ROUTES.SERVICES, desc: 'Hearing tests, speech therapy & hearing aids' },
                { label: 'Hearing & Speech Blogs', path: ROUTES.BLOGS, desc: 'Doctor insights & patient hearing care guides' },
                { label: 'Contact Clinic', path: ROUTES.CONTACT, desc: 'Sadashiv Peth clinic directions & hours' },
              ].map((item) => {
                const isCurrent = item.path === ROUTES.SERVICES;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavbarNavigation(e, item.path, window.location.pathname);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border shadow-xs transition-all group backdrop-blur-xs ${
                      isCurrent
                        ? 'bg-purple-100/90 border-purple-300 shadow-sm'
                        : 'bg-white/85 hover:bg-white/95 border-purple-100/90'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#301444] group-hover:text-purple-900 flex items-center gap-2">
                        <span>{item.label}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />}
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
            </div>

            {/* Bottom Pinned Action Bar: WhatsApp, Maps, and Book an Appointment */}
            <div className="relative z-10 px-5 pt-3 pb-6 sm:pb-8 border-t border-purple-100/90 bg-white/92 backdrop-blur-md flex flex-col gap-2.5 shadow-[0_-8px_30px_rgba(48,20,68,0.08)] flex-shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/${whatsappNumber.startsWith('91') ? whatsappNumber : '91' + whatsappNumber}?text=Hello%20Vaani%20Clinic%20Satara%2C%20I%20would%20like%20to%20enquire%20about%20hearing%20and%20speech%20services.`}
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

              <Link
                to="/#booking-section"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm text-white bg-[#301444] hover:bg-[#200930] shadow-md shadow-purple-950/30 transition-all active:scale-95 cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* ── 2. HERO BODY (With User Provided Background Image) ── */}
        <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-white">
          
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src="/services-hero-bg.jpg"
              alt="Clinical Otoscopy & Audiology Diagnostics"
              className="w-full h-full object-cover object-[32%_12%] sm:object-[38%_center] lg:object-center"
            />
            {/* Mobile bottom fade effect + desktop left edge gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b0528] via-[#1b0528]/85 via-42% to-transparent sm:bg-gradient-to-r sm:from-black/60 sm:via-black/25 sm:to-transparent pointer-events-none" />
          </div>

          {/* Top-Right Quick Actions: Home page WhatsApp, Google Maps, Cute Chatbot */}
          <div className="relative z-20 flex items-center justify-end p-4 sm:p-6 gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-full border border-purple-100/90 shadow-md">
              {/* WhatsApp Action */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Vaani%20Clinic%20Satara%2C%20I%20would%20like%20to%20enquire%20about%20hearing%20and%20speech%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 shadow-xs hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                title="Chat on WhatsApp (+91 98765 43210)"
              >
                <WhatsAppIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110" />
              </a>

              {/* Google Maps Action */}
              <a
                href="https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Sadashiv+Peth+Satara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200/90 shadow-xs hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                title="Clinic Location on Google Maps"
              >
                <GoogleMapsIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110" />
              </a>

              {/* Cute Chatbot Action */}
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#301444] hover:bg-[#200930] border border-purple-900/80 shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group relative"
                title="Chat with Vaani AI Assistant"
              >
                <CuteChatbotIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
              </button>
            </div>
          </div>

          {/* Floating Top-Right Insights Glassmorphic Card (Enlarged with Sculpted Notch for ↗ 20% Pill) */}
          <div className="hidden lg:block absolute top-24 sm:top-28 xl:top-32 right-6 sm:right-10 xl:right-14 z-20 w-[305px] xl:w-[335px] filter drop-shadow-[0_24px_50px_rgba(0,0,0,0.24)] select-none">
            <div className="relative w-full h-[240px] xl:h-[255px]">
              {/* Sculpted Frosted Glass Background */}
              <svg
                viewBox="0 0 340 260"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.40)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.18)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 28 0 
                     L 215 0 
                     C 230 0, 238 10, 240 22 
                     C 242 34, 250 44, 266 44 
                     L 308 44 
                     Q 340 44, 340 76 
                     L 340 228 
                     Q 340 260, 308 260 
                     L 28 260 
                     Q 0 260, 0 228 
                     L 0 28 
                     Q 0 0, 28 0 
                     Z"
                  fill="url(#glassGrad)"
                  stroke="rgba(255, 255, 255, 0.60)"
                  strokeWidth="1.4"
                />
              </svg>

              {/* Floating ↗ 20% pill seated in the sculpted notch */}
              <div className="absolute top-1.5 right-1.5 px-4 py-1.5 rounded-full bg-white text-[#1a0528] text-xs sm:text-[13px] font-black flex items-center gap-1.5 shadow-md z-20">
                <ArrowUpRight className="w-4 h-4 stroke-[2.8]" />
                <span>20%</span>
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full text-white">
                <div className="text-white/95 text-xs sm:text-sm font-bold tracking-wider uppercase">
                  Insights
                </div>

                <div className="flex items-center gap-3.5 my-1">
                  <img
                    src="/practitioner-headshot.png"
                    alt={leadPractitioner}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                  <div className="leading-tight">
                    <div className="text-base sm:text-lg font-bold text-white drop-shadow-xs">{leadPractitioner}</div>
                    <div className="text-xs sm:text-[13px] text-white/85 font-medium">Lead Audiologist &amp; Speech Pathologist ({leadDegree})</div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-white/90 font-medium">
                    <span>Monthly Report</span>
                    <span className="text-white/80 font-semibold">Oct</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/30 overflow-hidden flex">
                    <div className="w-[68%] h-full bg-[#5b21b6] rounded-full" />
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-4xl sm:text-5xl font-light text-white leading-none">90</span>
                    <span className="text-xs sm:text-sm text-white/85 font-medium">mg/dL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Content Triad (Headline, Eyebrow, CTAs, Notch Badge) */}
          <div className="relative z-20 p-5 sm:p-10 lg:p-14 max-w-2xl mt-auto lg:my-auto pb-6 sm:pb-10 lg:pb-14">
            
            {/* Clinical Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/80 text-[#301444] text-xs sm:text-[13px] font-bold mb-3.5 sm:mb-5 shadow-sm">
              <Star className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span>Advanced Audiology & Speech Care</span>
            </div>

            {/* Main Headline (Emotional & Audiology focused) */}
            <h1 className="text-2xl sm:text-4xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.12] mb-2.5 sm:mb-4 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              Restoring the Sounds of <br className="hidden sm:inline" />
              Love, Family & Life
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-white/90 max-w-lg mb-4 sm:mb-6 leading-relaxed font-normal drop-shadow-sm">
              Dedicated soundproof hearing tests, pediatric speech therapy, and personalized digital hearing aids in Satara.
            </p>

            {/* Pill Action Buttons (Properly stacked on mobile, row on desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-5 sm:mb-8">
              <Link
                to="/#booking-section"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-700 to-[#301444] hover:from-purple-600 hover:to-[#43195f] text-white border border-purple-400/40 shadow-lg shadow-purple-950/60 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap text-center"
              >
                <Calendar className="w-4 h-4 text-purple-200" />
                <span>Book Consultation</span>
              </Link>

              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white/95 hover:bg-white text-[#1a0528] border border-white/80 shadow-md transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md whitespace-nowrap text-center"
              >
                <Headphones className="w-4 h-4 text-purple-700" />
                <span>Explore Clinical Services</span>
              </button>
            </div>

            {/* Floating Doctor Badge with Sculpted Cutout Notch (Zero Overlap & Proper Clearances) */}
            <div className="relative inline-block select-none">
              {/* Sculpted Container with exact organic notch path */}
              <div className="relative w-[180px] h-[90px] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.15)]">
                
                {/* SVG Sculpted White Background */}
                <svg
                  viewBox="0 0 180 90"
                  className="absolute inset-0 w-full h-full text-white fill-current pointer-events-none"
                >
                  <path
                    d="M 18 0 
                       L 88 0 
                       C 96 0, 102 8, 106 20 
                       C 110 34, 116 46, 128 46 
                       L 162 46 
                       Q 180 46, 180 64 
                       L 180 72 
                       Q 180 90, 162 90 
                       L 18 90 
                       Q 0 90, 0 72 
                       L 0 18 
                       Q 0 0, 18 0 
                       Z"
                  />
                </svg>

                {/* Overlapping Doctor Avatars on Top-Left with proper padding */}
                <div className="absolute top-2.5 left-3.5 flex items-center -space-x-1.5 z-10">
                  <img
                    src="/doc-av-1.png"
                    alt="Doctor 1"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                  />
                  <img
                    src="/doc-av-2.png"
                    alt="Doctor 2"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                  />
                  <img
                    src="/doc-av-3.png"
                    alt="Doctor 3"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                  />
                </div>

                {/* Circular Arrow Button (Floating freely in notch alcove with full clearance from shelf) */}
                <button
                  onClick={scrollToServices}
                  className="absolute right-3.5 top-1.5 w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-900 hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                  title="View All Doctors"
                >
                  <ArrowRight className="w-3.5 h-3.5 -rotate-45 stroke-[2.2]" />
                </button>

                {/* Text on the lower shelf underneath the avatars */}
                <div className="absolute bottom-2.5 left-3.5 z-10">
                  <p className="text-[11.5px] font-semibold text-gray-800 leading-[1.24] tracking-tight text-left">
                    Trusted by 5,000+ <br />
                    Families in Satara
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ── 3. LOW HEIGHT ORGANIC SHELF WITH TEXT ON SIDE & SPECIALISTS OVER EMPTY SPACE (Desktop Only) ── */}
          <div className="hidden lg:block relative z-30 w-full mt-auto">
            
            {/* SVG Organic Shape for the Bottom Shelf (Sleek low height matching reference) */}
            <div className="relative w-full overflow-hidden leading-none -mb-[1px]">
              <svg
                className="w-full h-16 sm:h-20 lg:h-22 text-white block pointer-events-none"
                viewBox="0 0 1200 80"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 80 
                     L 0 0 
                     L 480 0 
                     C 525 0, 555 10, 595 40 
                     C 630 66, 655 80, 695 80 
                     L 1100 80 
                     C 1135 80, 1160 66, 1175 40 
                     C 1185 24, 1192 12, 1200 12 
                     L 1200 80 
                     Z"
                  fill="white"
                />
              </svg>

              {/* Text positioned to the side of the raised shelf (right next to downward slope) */}
              <div className="absolute left-6 sm:left-[22%] md:left-[26%] lg:left-[30%] xl:left-[33%] bottom-2.5 sm:bottom-3.5 lg:bottom-4 z-10 pointer-events-auto max-w-xs sm:max-w-sm text-left">
                <p className="text-[11px] sm:text-xs lg:text-[13.5px] font-semibold text-gray-800 leading-snug tracking-tight">
                  We are ready to serve you with <br />
                  pleasure and fast response
                </p>
              </div>

              {/* Specialists badges floating over the empty photo space valley */}
              <div className="absolute right-4 sm:right-8 lg:right-16 xl:right-20 bottom-2 sm:bottom-3 lg:bottom-3.5 z-10 pointer-events-auto flex items-center gap-2 sm:gap-2.5">
                {/* Circular Specialist Badges */}
                <div className="flex items-center -space-x-1.5 sm:-space-x-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-200 text-purple-700 text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md">
                    PG
                  </span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-200 text-purple-700 text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md">
                    OD
                  </span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-200 text-purple-700 text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md">
                    RCI
                  </span>
                </div>

                {/* Ours Specialist Doctors Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-purple-200/90 shadow-[0_4px_16px_rgba(48,20,68,0.12)] text-[#301444]">
                  <Star className="w-3 h-3 text-purple-600 fill-purple-600" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                    Ours Specialist Doctors
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
      </div>

      {/* ── 2. WATCH. LEARN. GROW. SECTION (Pure White Background with Navbar-matched padding) ── */}
      <section id="services-catalog" className="w-full bg-white py-10 sm:py-14 lg:py-18 px-5 sm:px-8 lg:px-10 xl:px-12 scroll-mt-6">
        <WatchLearnGrowSection />
      </section>

      {/* ── 3. SCROLL-REVEAL CLINICAL CASE STUDY & READY TO SCHEDULE SECTION (White to #1b0528) ── */}
      <ScrollRevealCaseStudy />

      {/* Interactive AI Chatbot Drawer / Modal (Home page exact feature) */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <div
            onClick={() => setIsChatbotOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
          />

          {/* Chat Card */}
          <div className="relative w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col pointer-events-auto z-10 max-h-[85vh] sm:max-h-[580px] animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="bg-[#301444] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 text-white flex items-center justify-center relative shadow-xs">
                  <CuteChatbotIcon className="w-6 h-6" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#301444]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Vaani AI Assistant</h3>
                  <p className="text-[11px] text-purple-200 font-medium">Satara Clinic Support • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#faf7fc]/70 text-xs sm:text-[13px] max-h-[380px]">
              {/* Welcome Bot Bubble */}
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-[#301444] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CuteChatbotIcon className="w-4.5 h-4.5" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-purple-100/80 shadow-xs text-[#301444] space-y-1.5 max-w-[85%]">
                  <p className="font-medium">
                    Hello! 👋 Welcome to <strong>VAANI Speech &amp; Hearing Clinic</strong>, Satara.
                  </p>
                  <p className="text-gray-600">
                    How can I assist you with your hearing test, speech therapy, or digital hearing aid trial today?
                  </p>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] font-semibold text-[#6e468e] uppercase tracking-wider px-1">
                  Quick Inquiries:
                </p>
                {[
                  'Diagnostic Hearing Test (PTA) in Satara',
                  'Pediatric Speech Delay & Stuttering Therapy',
                  'Digital Hearing Aid Trial & Fitting',
                  'Clinic Address & Working Hours',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleChatQuickQuery(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-purple-50 text-[#301444] border border-purple-100 hover:border-purple-300 font-medium transition-all shadow-xs flex items-center justify-between group cursor-pointer"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              {/* User / Bot Response History */}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-[#301444] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-purple-200" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#301444] text-white rounded-tr-xs'
                        : 'bg-white text-[#301444] border border-purple-100/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                    {msg.action && (
                      <div className="pt-2">
                        <Link
                          to="/#booking-section"
                          onClick={() => setIsChatbotOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#301444] hover:bg-[#200930] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Calendar className="w-3 h-3 text-purple-300" />
                          <span>Book Appointment Now</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Field */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-purple-100 flex items-center gap-2">
              <input
                type="text"
                value={inputChatMessage}
                onChange={(e) => setInputChatMessage(e.target.value)}
                placeholder="Ask about tests or speech therapy..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf7fc] rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#301444] text-[#301444]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#301444] hover:bg-[#200930] text-white transition-transform active:scale-90 shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesPage;
