import React, { useState, useEffect, useRef } from 'react';

/**
 * PageTransitionLoader
 * Universal luxury transition loader that plays the blooming lavender wreath video (/loader.mp4)
 * with ONLY the elegant italic clinical quote centered inside the wreath.
 */

const PAGE_TRANSITION_QUOTES = {
  '/services': [
    '“To hear is to connect. To speak is to be understood.”',
    '“Every acoustic nuance shapes how a child discovers the world.”',
  ],
  '/about': [
    '“Every voice carries a story. Every sound restores a world.”',
    '“Compassionate clinical care grounded in rigorous medical evidence.”',
  ],
  '/blogs': [
    '“Over 1.5 Billion people globally live with hearing loss — 60% in children is preventable.”',
    '“Language is the bridge between human thought and the world.”',
  ],
  '/contact': [
    '“Your journey to clear speech and vibrant hearing begins here.”',
    '“Dedicated soundproof testing and warm, welcoming clinical guidance.”',
  ],
  '/': [
    '“Celebrate sound, speak with confidence.”',
    '“Empowering children and adults across Maharashtra with clear communication.”',
  ],
  '/book-appointment': [
    '“A single step toward timely care transforms a lifetime of communication.”',
  ],
};

export const PageTransitionLoader = ({ targetPath = '/', onComplete }) => {
  const [textStage, setTextStage] = useState('hidden'); // 'hidden' | 'visible' | 'disappearing'
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);

  // Pick quote based on target path (or random from array if multiple)
  const quotes = PAGE_TRANSITION_QUOTES[targetPath] || PAGE_TRANSITION_QUOTES['/'] || [
    '“To hear is to connect. To speak is to be understood.”',
  ];
  const quoteText = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    // Attempt immediate video play (muted for browser autoplay requirements)
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: continues animation regardless
      });
    }

    // Timeline for refined 2.3s transition:
    // 0.0s - 0.28s: Video starts playing, floral frame reveals center
    // 0.28s - 1.55s: Italic quote appears smoothly in center of wreath
    // 1.55s - 2.05s: Italic quote disappears smoothly
    // 2.05s - 2.30s: Full overlay fades out, revealing destination page

    const t1 = setTimeout(() => {
      setTextStage('visible');
    }, 280);

    const t2 = setTimeout(() => {
      setTextStage('disappearing');
    }, 1550);

    const t3 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2050);

    const t4 = setTimeout(() => {
      onComplete?.();
    }, 2320);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#f5f5f7] flex items-center justify-center overflow-hidden transition-opacity duration-300 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* 2.5s Processed Video Background */}
      <video
        ref={videoRef}
        src="/loader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />

      {/* Center Animated Quote in the middle of lavender blossoms */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 sm:px-12">
        <div
          className={`max-w-xl mx-auto transform transition-all duration-700 ease-out flex flex-col items-center text-center ${
            textStage === 'visible'
              ? 'opacity-100 scale-100 translate-y-0 blur-0'
              : textStage === 'disappearing'
              ? 'opacity-0 scale-105 -translate-y-1 blur-xs'
              : 'opacity-0 scale-95 translate-y-2 blur-xs'
          }`}
        >
          {/* Elegant Italic Quote ONLY (No subtitles or badges below) */}
          <blockquote
            className="text-xl sm:text-2xl md:text-[27px] font-normal italic text-[#2e0c46] leading-relaxed tracking-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {quoteText}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;
