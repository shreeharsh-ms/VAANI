import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { ROUTES } from '../../constants';

const servicesData = [
  {
    id: 'audiometry',
    number: '01',
    title: 'Diagnostic Audiometry',
    subTags: ['Air & Bone Conduction', 'Speech Discrimination', 'Tympanometry Battery'],
    description:
      'Standardized diagnostic battery in sound-isolated acoustic suites determining precise decibel hearing sensitivity, acoustic reflexes, and middle-ear compliance.',
    image: '/services/hearing-test.jpg',
    category: 'Audiology Diagnostic',
  },
  {
    id: 'newborn-screening',
    number: '02',
    title: 'Newborn OAE & BERA',
    subTags: ['Automated DPOAE', 'Brainstem Evoked Potential', 'Early Intervention Care'],
    description:
      'Objective, non-invasive electrophysiological screening identifying congenital hearing deficits in infants within days of birth, enabling critical early habilitation.',
    image: '/services/pediatric-audiology.jpg',
    category: 'Pediatric Care',
  },
  {
    id: 'speech-therapy',
    number: '03',
    title: 'Speech & Language Therapy',
    subTags: ['Phonology & Articulation', 'Developmental Delay', 'Autism Pragmatic Support'],
    description:
      'Individualized clinical pathology addressing developmental speech delays, childhood apraxia, social pragmatics, and stuttering for children and adults.',
    image: '/services/speech-therapy.jpg',
    category: 'Speech Pathology',
  },
  {
    id: 'hearing-aids',
    number: '04',
    title: 'Digital Hearing Aid Dispensing',
    subTags: ['Real-Ear Measurement', 'Bluetooth & Rechargeable', 'Custom Invisible CIC'],
    description:
      'Precision multi-channel digital programming with live real-ear acoustic verification, dynamic noise reduction, and custom earmold fabrication.',
    image: '/services/hearing-aid.jpg',
    category: 'Hearing Technology',
  },
  {
    id: 'voice-fluency',
    number: '05',
    title: 'Voice & Fluency Therapy',
    subTags: ['Vocal Cord Dysphonia', 'Fluency Shaping Protocol', 'Professional Voice Care'],
    description:
      'Clinical voice therapy optimizing respiratory support, vocal cord closure, and fluency shaping for singers, educators, and individuals navigating dysfluency.',
    image: '/services/voice-therapy.jpg',
    category: 'Clinical Rehabilitation',
  },
  {
    id: 'articulation',
    number: '06',
    title: 'Articulation Therapy',
    subTags: ['Phonological Clarity', 'Motor Speech Precision', 'Sound Production'],
    description:
      'Targeted motor speech intervention correcting sound substitutions, omissions, and lisping for clear, confident articulation across all age groups.',
    image: '/pediatric-therapy-session.jpg',
    category: 'Speech Pathology',
  },
  {
    id: 'neuro-rehab',
    number: '07',
    title: 'Neuro Rehabilitation',
    subTags: ['Post-Stroke Aphasia', 'Cognitive Communication', 'Neurological Recovery'],
    description:
      'Comprehensive neuro-rehabilitative therapy restoring speech fluency, cognitive-linguistic processing, and communicative autonomy following neurological injury.',
    image: '/clinical-care.jpg',
    category: 'Neurological Care',
  },
];

export const ServicesEditorialSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e) => {
      // Keep floating card neatly within viewport boundaries
      const x = Math.min(e.clientX + 24, window.innerWidth - 324);
      const y = Math.max(24, Math.min(e.clientY - 110, window.innerHeight - 224));
      setCursorPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="w-full bg-[#301444] text-[#2a0845] p-2 sm:p-3 md:p-4 lg:p-5 select-none relative">
      
      {/* Crisp White Editorial Canvas matching Hero Section dimensions & rounding */}
      <div className="relative w-full bg-white rounded-[24px] sm:rounded-[34px] lg:rounded-[42px] overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-14 xl:p-16">
        
        {/* Top Header Row: Giant Condensed "SERVICES" + Target Crosshair Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea]" />
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#9333ea]">
                Multidisciplinary Clinical Protocols
              </span>
            </div>
            
            {/* Giant Bold Black Condensed Typography matching the reference screenshot */}
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] xl:text-[112px] font-black tracking-tight text-[#1a0628] leading-[0.88] uppercase font-sans">
              SERVICES
            </h2>
          </div>

          {/* Top-Right Editorial Crosshair Target Icon */}
          <div className="self-end sm:self-start pt-2">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-purple-600 hover:text-purple-600 transition-colors"
              title="Targeted Clinical Solutions"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <line x1="12" y1="2" x2="12" y2="7" />
                <line x1="12" y1="17" x2="12" y2="22" />
                <line x1="2" y1="12" x2="7" y2="12" />
                <line x1="17" y1="12" x2="22" y2="12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Services Editorial List Rows */}
        <div className="border-b border-gray-200">
          {servicesData.map((service, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={service.id}
                to={ROUTES.SERVICES}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative block w-full py-3.5 sm:py-4.5 lg:py-5 border-t border-gray-200/90 transition-all duration-300 ${
                  isHovered ? 'bg-purple-50/60' : 'bg-transparent'
                }`}
              >
                {/* Horizontal Flex Grid matching the reference screenshot */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8 px-2 sm:px-4">
                  
                  {/* Left Column: Number Index + Large Editorial Serif Title */}
                  <div className="flex items-baseline gap-4 sm:gap-6 lg:gap-8 flex-1 min-w-[260px]">
                    {/* Index Number */}
                    <span className="font-mono text-xs sm:text-sm font-bold text-gray-400 group-hover:text-purple-800 transition-colors flex-shrink-0">
                      {service.number}
                    </span>

                    {/* Service Name in Editorial Serif */}
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] text-[#220737] font-normal tracking-tight group-hover:text-purple-950 group-hover:italic group-hover:translate-x-2 transition-all duration-300">
                      {service.title}
                    </h3>
                  </div>

                  {/* Middle Column 1: Stacked Coral/Purple Sub-tags (as seen in reference) */}
                  <div className="hidden md:flex flex-col text-[11px] lg:text-xs font-semibold text-[#8b2fc9] leading-snug w-44 lg:w-52 flex-shrink-0 space-y-0.5">
                    {service.subTags.map((tag, tIdx) => (
                      <span key={tIdx} className="tracking-wide">
                        {tag}{tIdx < service.subTags.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Middle Column 2: Clinical Description */}
                  <p className="text-xs sm:text-[13px] lg:text-sm text-gray-600 leading-relaxed max-w-sm xl:max-w-md flex-shrink-0 font-normal">
                    {service.description}
                  </p>

                  {/* Right Column: Thumbnail Preview Card (reveals & expands on hover) */}
                  <div className="relative w-28 sm:w-36 md:w-44 lg:w-48 h-18 sm:h-22 md:h-24 lg:h-26 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl border border-gray-200/80 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover filter brightness-[0.96] group-hover:brightness-105 transition-all duration-500"
                    />
                    
                    {/* Hover Arrow Badge Overlay */}
                    <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 text-[#301444] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#301444]" />
                    </div>

                    {/* Gradient shade on bottom of card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner Row: Call to Action & Diagnostic Standards */}
        <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2a0845]">
                Need diagnostic clarity or a second opinion?
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-500">
                All appointments include comprehensive otoscopic examination and clinical case history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.SERVICES}
              className="px-4.5 py-2 rounded-full text-xs sm:text-[13px] font-semibold bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 transition-all"
            >
              Explore Full Catalog
            </Link>
            <a
              href="#booking-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold bg-[#301444] hover:bg-[#220a32] text-white shadow-md hover:shadow-purple-950/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Appointment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Floating Cursor-Following Image Preview (Desktop High-End Interaction) */}
      {isClient && hoveredIndex !== null && (
        <div
          className="pointer-events-none hidden lg:block fixed z-50 transition-transform duration-75 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <div className="w-[300px] h-[200px] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(20,5,35,0.45)] border-4 border-white bg-[#301444] transform -rotate-2 scale-100 transition-all animate-fadeIn">
            <img
              src={servicesData[hoveredIndex].image}
              alt={servicesData[hoveredIndex].title}
              className="w-full h-full object-cover filter brightness-105"
            />
            {/* Luminous overlay info */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#260938]/90 via-[#260938]/20 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                {servicesData[hoveredIndex].category}
              </span>
              <span className="text-white text-sm font-bold tracking-tight">
                {servicesData[hoveredIndex].title}
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ServicesEditorialSection;
