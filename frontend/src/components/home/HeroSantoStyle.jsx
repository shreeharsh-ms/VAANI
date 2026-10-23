import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
  Bot,
  X,
  Menu,
  Send,
  User,
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { handleNavbarNavigation } from '../../utils/scrollUtils';

const HERO_SLIDES = [
  {
    image: '/hero-audiologist-consultation.jpg',
    alt: 'Audiologist fitting hearing aid for patient in Satara',
    position: 'object-center lg:object-[center_30%]',
    eyebrow: 'Satara’s Leading Audiology & Hearing Aid Center',
    titleLine1: 'Celebrate sound,',
    titleLine2: 'reconnect with',
    titleLine3: 'every conversation',
  },
  {
    image: '/hero-pediatric-hearing-test.jpg',
    alt: 'Pediatric hearing screening and toddler audiometry test in Satara clinic',
    position: 'object-center lg:object-[center_38%]',
    eyebrow: 'Early Pediatric Audiology & Speech Milestones',
    titleLine1: 'Protect little ears,',
    titleLine2: 'help your child',
    titleLine3: 'speak with confidence',
  },
];

const MARQUEE_ITEMS = [
  { text: 'GET DIAGNOSTIC HEARING TEST IN SATARA', highlight: true },
  { text: 'CERTIFIED SPEECH & LANGUAGE THERAPY', highlight: false },
  { text: 'FREE DIGITAL HEARING AID TRIAL & FITTING', highlight: true },
  { text: 'NEWBORN BERA & OAE SCREENING IN SATARA', highlight: false },
  { text: 'CHILD SPEECH DELAY & STUTTERING CLINIC', highlight: true },
  { text: 'SOUNDPROOF PURE TONE AUDIOMETRY (PTA)', highlight: false },
  { text: 'RCI REGISTERED AUDIOLOGY SPECIALISTS', highlight: true },
  { text: 'BOOK CONSULTATION IN SATARA: +91 98220 12345', highlight: false },
];

const WhatsAppIcon = ({ className = "w-7 h-7 sm:w-8 sm:h-8" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const GoogleMapsIcon = ({ className = "w-7 h-7 sm:w-8 sm:h-8" }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#4885ed" d="M24 4C14.06 4 6 12.06 6 22c0 7.87 5.07 14.56 12.19 16.92L24 44l5.81-5.08C36.93 36.56 42 29.87 42 22c0-9.94-8.06-18-18-18z"/>
    <path fill="#ea4335" d="M24 4c-9.94 0-18 8.06-18 18 0 4.17 1.43 8.01 3.84 11.08L24 22V4z"/>
    <path fill="#fbbc05" d="M24 22l14.16 11.08C40.57 30.01 42 26.17 42 22c0-9.94-8.06-18-18-18v18z"/>
    <path fill="#34a853" d="M24 44l-5.81-5.08A17.92 17.92 0 019.84 33.08L24 22l14.16 11.08a17.92 17.92 0 01-8.35 5.84L24 44z"/>
    <circle fill="#ffffff" cx="24" cy="22" r="7"/>
  </svg>
);

const CuteChatbotIcon = ({ className = "w-7 h-7 sm:w-8 sm:h-8" }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cute Antenna with glowing heart */}
    <path d="M24 10V4" stroke="#f472b6" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="24" cy="4" r="3.2" fill="#f43f5e" />
    
    {/* Soft Rounded Bot Head */}
    <rect x="7" y="10" width="34" height="28" rx="12" fill="#301444" stroke="#c084fc" strokeWidth="2" />
    
    {/* Dark Glossy Screen Face */}
    <rect x="11" y="14" width="26" height="20" rx="7" fill="#180424" />
    
    {/* Cute Big Sparkling Eyes */}
    <ellipse cx="18" cy="22.5" rx="3.5" ry="4" fill="#38bdf8" />
    <circle cx="19.2" cy="21" r="1.4" fill="#ffffff" />
    <circle cx="17" cy="24.5" r="0.75" fill="#ffffff" />

    <ellipse cx="30" cy="22.5" rx="3.5" ry="4" fill="#38bdf8" />
    <circle cx="31.2" cy="21" r="1.4" fill="#ffffff" />
    <circle cx="29" cy="24.5" r="0.75" fill="#ffffff" />

    {/* Rosy Blushing Cheeks */}
    <ellipse cx="14.5" cy="27.5" rx="2" ry="1.2" fill="#fb7185" opacity="0.9" />
    <ellipse cx="33.5" cy="27.5" rx="2" ry="1.2" fill="#fb7185" opacity="0.9" />

    {/* Cute Smiling Mouth */}
    <path d="M21 27C21.8 29.2 26.2 29.2 27 27" stroke="#f472b6" strokeWidth="2.2" strokeLinecap="round" />

    {/* Cute Side Headphones / Ears */}
    <rect x="3.5" y="17" width="4" height="14" rx="2" fill="#e879f9" />
    <rect x="40.5" y="17" width="4" height="14" rx="2" fill="#e879f9" />
  </svg>
);

export const HeroSantoStyle = () => {
  const { logoUrl, clinicName, primaryPhone, settings } = useClinicSettings();
  const contactPhone = primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
  const marqueeItems = [
    { text: 'GET DIAGNOSTIC HEARING TEST IN SATARA', highlight: true },
    { text: 'CERTIFIED SPEECH & LANGUAGE THERAPY', highlight: false },
    { text: 'FREE DIGITAL HEARING AID TRIAL & FITTING', highlight: true },
    { text: 'NEWBORN BERA & OAE SCREENING IN SATARA', highlight: false },
    { text: 'CHILD SPEECH DELAY & STUTTERING CLINIC', highlight: true },
    { text: 'SOUNDPROOF PURE TONE AUDIOMETRY (PTA)', highlight: false },
    { text: 'RCI REGISTERED AUDIOLOGY SPECIALISTS', highlight: true },
    { text: `BOOK CONSULTATION IN SATARA: ${contactPhone}`, highlight: false },
  ];
  const isCustomLogo = logoUrl && logoUrl !== '/vaani-logo.png' && logoUrl !== '/vaani-logo-white.png';
  const displayWhiteLogo = isCustomLogo ? logoUrl : '/vaani-logo-white.png';
  const [lang, setLang] = useState('KZ');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputChatMessage, setInputChatMessage] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Crossfade hero slides every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const scrollToBooking = (e) => {
    e?.preventDefault();
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '#booking-section';
    }
  };

  const scrollToServices = (e) => {
    const el = document.getElementById('services-catalog');
    if (el) {
      e?.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  return (
    /* Full-viewport height & width container */
    <div className="w-full h-[100dvh] min-h-[560px] sm:min-h-[660px] lg:h-screen lg:max-h-[1080px] bg-[#301444] text-[#2a0845] p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col select-none box-border">
      
      {/* Main Inner Card: Expands to full height within the outer dark frame */}
      <div className="relative w-full h-full flex-1 bg-white rounded-tr-[24px] sm:rounded-tr-[34px] lg:rounded-tr-[42px] rounded-br-[24px] sm:rounded-br-[34px] lg:rounded-br-[42px] rounded-bl-[24px] sm:rounded-bl-[34px] lg:rounded-bl-[42px] rounded-tl-none overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Top Navbar: Located INSIDE the white canvas */}
        <header className="relative w-full flex items-center justify-between z-30 flex-shrink-0">
          
          {/* Top-Left: Big Logo inside the Dark Lavender/Purple Tab connected to the top-left with smooth curved fillets */}
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

          {/* Center: Navigation Pill Buttons ON THE WHITE BACKGROUND (Desktop only) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 py-3 sm:py-4 px-3 sm:px-6">
            {[
              { label: 'About Practitioner', path: ROUTES.ABOUT },
              { label: 'Services', path: ROUTES.SERVICES },
              { label: 'Blogs', path: ROUTES.BLOGS },
              { label: 'Contact Us', path: ROUTES.CONTACT },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={(e) => handleNavbarNavigation(e, item.path, window.location.pathname)}
                className="px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold bg-white hover:bg-purple-50 text-[#301444] border border-gray-200/90 shadow-sm transition-all duration-150 hover:scale-105 active:scale-95"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Desktop Book an Appointment Button + Mobile Hamburger Button */}
          <div className="flex items-center gap-2 py-2.5 sm:py-4 px-3 sm:px-8">
            <button
              onClick={scrollToBooking}
              className="hidden lg:inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold bg-[#301444] hover:bg-[#220a32] text-white transition-all shadow-md hover:shadow-purple-950/60 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-purple-200" />
              <span>Book an Appointment</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-full border border-purple-200/90 bg-white/95 text-[#301444] hover:bg-purple-50 shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#301444]" /> : <Menu className="w-5 h-5 text-[#301444]" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer Modal */}
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
              <Link
                to={ROUTES.HOME}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavbarNavigation(e, ROUTES.HOME, window.location.pathname);
                }}
                className="flex items-center"
              >
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
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavbarNavigation(e, item.path, window.location.pathname);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/85 hover:bg-white/95 border border-purple-100/90 shadow-xs hover:shadow-md transition-all group backdrop-blur-xs"
                >
                  <div>
                    <div className="text-sm font-bold text-[#301444] group-hover:text-purple-900">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}

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
              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  scrollToBooking(e);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full font-bold text-sm text-white bg-[#301444] hover:bg-[#200930] shadow-md shadow-purple-950/30 transition-all active:scale-95 cursor-pointer group"
              >
                <Calendar className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Main Body Grid: Expands to fill remaining height */}
        <div className="relative w-full flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column (Headline, Eyebrow, CTA Button & Feature Cards) */}
          <div className="lg:col-span-6 px-4 pt-2 pb-2 sm:px-8 sm:pt-6 sm:pb-4 lg:p-10 xl:p-12 lg:pb-32 flex flex-col justify-start lg:justify-center gap-2.5 sm:gap-4 z-10 flex-shrink-0">
            <div>
              {/* Dynamic Synchronized Eyebrow & Headline Container */}
              <div className="relative min-h-[70px] sm:min-h-[85px] md:min-h-[105px] lg:min-h-[205px] xl:min-h-[225px] 2xl:min-h-[245px] mb-1 sm:mb-2 lg:mb-3">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentHeroSlide;
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-700 ease-in-out ${
                        isActive
                          ? 'opacity-100 translate-y-0 relative z-10'
                          : 'opacity-0 translate-y-2 absolute inset-0 z-0 pointer-events-none'
                      }`}
                    >
                      {/* Eyebrow Label */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm font-semibold text-[#6e468e] tracking-wide mb-1 sm:mb-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6e468e] animate-pulse" />
                        <span className="truncate">{slide.eyebrow}</span>
                      </div>

                      {/* Giant Headline matching slide image */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[44px] xl:text-[50px] 2xl:text-[56px] font-bold text-[#2d0b43] leading-[1.12] lg:leading-[1.08] tracking-tight">
                        <span className="hidden lg:inline">{slide.titleLine1}<br />{slide.titleLine2}<br />{slide.titleLine3}</span>
                        <span className="lg:hidden">{slide.titleLine1} {slide.titleLine2} {slide.titleLine3}</span>
                      </h1>
                    </div>
                  );
                })}
              </div>

              {/* Primary Action Button: "Book an Appointment" redirecting to bottom form */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                <button
                  onClick={scrollToBooking}
                  className="inline-flex items-center gap-2 px-4.5 sm:px-7 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-[#301444] hover:bg-[#200930] text-white shadow-md hover:shadow-purple-950/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to={ROUTES.SERVICES + '#services-catalog'}
                  onClick={scrollToServices}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-purple-50 text-[#301444] border border-purple-200/80 shadow-xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Services</span>
                </Link>
              </div>
            </div>

            {/* Feature Service Cards: Displayed only on large desktop screens to avoid vertical text clutter on mobile */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full pt-1">
              {/* Card 1: Diagnostic Audiology */}
              <Link
                to={ROUTES.SERVICES}
                className="bg-white hover:bg-purple-50/40 transition-all duration-200 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 border border-purple-100/90 shadow-[0_4px_20px_rgba(48,20,68,0.06)] group hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(48,20,68,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#301444] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <Headphones className="w-4.5 h-4.5 text-purple-200" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#301444] leading-tight">
                      Diagnostic Audiology
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#6e468e] uppercase tracking-wider">
                      Hearing Testing
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#4a2864] leading-relaxed">
                  Soundproof Pure Tone Audiometry (PTA) &amp; Tympanometry.<br />
                  Digital hearing aid trial, fitting &amp; expert programming in Satara.
                </p>
              </Link>

              {/* Card 2: Speech & Voice Therapy */}
              <Link
                to={ROUTES.SERVICES}
                className="bg-white hover:bg-purple-50/40 transition-all duration-200 rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 border border-purple-100/90 shadow-[0_4px_20px_rgba(48,20,68,0.06)] group hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(48,20,68,0.12)] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#301444] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4.5 h-4.5 text-purple-200" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#301444] leading-tight">
                      Speech &amp; Voice Therapy
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#6e468e] uppercase tracking-wider">
                      Rehabilitation Care
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-[#4a2864] leading-relaxed">
                  Pediatric speech delay &amp; stuttering therapy.<br />
                  Articulation, voice rehabilitation &amp; communication training.
                </p>
              </Link>
            </div>
          </div>

          {/* Right Column / Mobile Hero Image: Dynamic Cross-Fading Clinical Slideshow */}
          <div className="lg:col-span-6 flex-1 min-h-[220px] sm:min-h-[280px] lg:min-h-0 relative flex flex-col justify-end overflow-hidden mx-3 mb-16 sm:mx-6 sm:mb-20 lg:mx-0 lg:mb-0 rounded-2xl lg:rounded-none lg:pb-24 shadow-sm lg:shadow-none border border-purple-100/60 lg:border-none">
            
            {/* Sliding Hero Photos with Smooth 1000ms Crossfade */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = idx === currentHeroSlide;
                return (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${slide.position} ${
                      isActive
                        ? 'opacity-100 scale-100 z-1'
                        : 'opacity-0 scale-105 z-0'
                    }`}
                  />
                );
              })}
              {/* Subtle soft gradient fade on left edge into the white card (desktop only) */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/30 to-transparent hidden lg:block z-10 pointer-events-none" />
            </div>

          </div>

        </div>

        {/* Quick Action Floating Bar: WhatsApp, Maps, Chatbot */}
        <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 right-3 sm:right-6 lg:right-8 z-30 pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-3 bg-white/95 backdrop-blur-md p-1.5 sm:p-2.5 rounded-full border border-purple-100/90 shadow-[0_8px_30px_rgba(48,20,68,0.16)]">
            
            {/* WhatsApp Action */}
            <a
              href="https://wa.me/919876543210?text=Hello%20Vaani%20Clinic%20Satara%2C%20I%20would%20like%20to%20enquire%20about%20hearing%20and%20speech%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-13.5 sm:h-13.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 shadow-xs hover:shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
              title="Chat on WhatsApp (+91 98765 43210)"
            >
              <WhatsAppIcon className="w-5.5 h-5.5 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
            </a>

            {/* Google Maps Action */}
            <a
              href="https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Sadashiv+Peth+Satara"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-13.5 sm:h-13.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200/90 shadow-xs hover:shadow-rose-500/20 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
              title="Clinic Location on Google Maps"
            >
              <GoogleMapsIcon className="w-5.5 h-5.5 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
            </a>

            {/* Cute Chatbot Action */}
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="w-10 h-10 sm:w-13.5 sm:h-13.5 rounded-full bg-[#301444] hover:bg-[#200930] border border-purple-900/80 shadow-md hover:shadow-purple-950/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group relative"
              title="Chat with Cute Vaani AI Assistant"
            >
              <CuteChatbotIcon className="w-5.5 h-5.5 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </button>

          </div>
        </div>

        {/* Continuous Left-to-Right Full-Width Marquee White Card */}
        <div className="absolute bottom-2 sm:bottom-4 lg:bottom-5 left-2 sm:left-6 lg:left-8 right-2 sm:right-6 lg:right-8 z-30 pointer-events-auto">
          <div className="w-full bg-white/95 backdrop-blur-md text-[#301444] rounded-2xl sm:rounded-3xl py-2.5 sm:py-3.5 px-4 sm:px-6 border border-purple-100/90 shadow-[0_8px_30px_rgba(48,20,68,0.12)] overflow-hidden flex items-center group hover:shadow-[0_12px_40px_rgba(48,20,68,0.18)] transition-all">
            {/* Left & Right subtle transparent gradient edge fades */}
            <div className="pointer-events-none absolute left-0 inset-y-0 w-8 sm:w-14 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 inset-y-0 w-8 sm:w-14 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Infinite Scrolling Track (Complete Left-to-Right: translateX(-50%) -> translateX(0%)) */}
            <div className="overflow-hidden relative w-full flex items-center cursor-pointer">
              <Link to={ROUTES.BOOKING} className="animate-marquee-ltr flex items-center whitespace-nowrap">
                {/* Half 1 */}
                <div className="flex items-center gap-7 sm:gap-9 shrink-0 pr-7 sm:pr-9">
                  {marqueeItems.map((item, idx) => (
                    <div key={`m1-${idx}`} className="flex items-center gap-2.5 text-xs sm:text-[13.5px] font-medium text-[#301444]">
                      {item.highlight ? (
                        <span className="bg-[#301444] text-white font-bold px-3 py-1 rounded-full text-[11px] sm:text-xs tracking-wide shadow-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {item.text}
                        </span>
                      ) : (
                        <span className="font-bold tracking-wide text-[#301444] hover:text-[#6e468e] transition-colors">
                          {item.text}
                        </span>
                      )}
                      <span className="text-[#6e468e]/50 select-none text-xs">✦</span>
                    </div>
                  ))}
                </div>

                {/* Half 2 (Exact duplicate for 100% seamless infinite loop) */}
                <div className="flex items-center gap-7 sm:gap-9 shrink-0 pr-7 sm:pr-9" aria-hidden="true">
                  {marqueeItems.map((item, idx) => (
                    <div key={`m2-${idx}`} className="flex items-center gap-2.5 text-xs sm:text-[13.5px] font-medium text-[#301444]">
                      {item.highlight ? (
                        <span className="bg-[#301444] text-white font-bold px-3 py-1 rounded-full text-[11px] sm:text-xs tracking-wide shadow-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {item.text}
                        </span>
                      ) : (
                        <span className="font-bold tracking-wide text-[#301444] hover:text-[#6e468e] transition-colors">
                          {item.text}
                        </span>
                      )}
                      <span className="text-[#6e468e]/50 select-none text-xs">✦</span>
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive AI Chatbot Drawer / Modal */}
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
                          <button
                            onClick={() => {
                              setIsChatbotOpen(false);
                              scrollToBooking();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#301444] hover:bg-[#200930] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Calendar className="w-3 h-3 text-purple-300" />
                            <span>Book Appointment Now</span>
                          </button>
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
    </div>
  );
};

export default HeroSantoStyle;
