import React, { useState, useEffect, useRef } from 'react';

/**
 * ServicesTransitionLoader
 * Plays compressed 2.5s loader video with animated "Our Services" text appearing
 * and disappearing in the center of the lavender wreath when navigating from Home to Services.
 */
export const ServicesTransitionLoader = ({ onComplete }) => {
  const [textStage, setTextStage] = useState('hidden'); // 'hidden' | 'visible' | 'disappearing'
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Attempt immediate video play (must be muted for browser autoplay policies)
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: continue animation regardless
      });
    }

    // Timeline for 2.5s transition:
    // 0.0s - 0.35s: Video starts playing, floral frame reveals center
    // 0.35s - 1.65s: "Our Services" appears smoothly in center
    // 1.65s - 2.25s: "Our Services" disappears smoothly
    // 2.25s - 2.55s: Full overlay fades out, revealing Services page

    const t1 = setTimeout(() => {
      setTextStage('visible');
    }, 350);

    const t2 = setTimeout(() => {
      setTextStage('disappearing');
    }, 1650);

    const t3 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2250);

    const t4 = setTimeout(() => {
      onComplete?.();
    }, 2550);

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
          {/* Professional Clinical Quote */}
          <blockquote
            className="text-xl sm:text-2xl md:text-[27px] font-normal italic text-[#2e0c46] leading-relaxed tracking-normal"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            “To hear is to connect. To speak is to be understood.”
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ServicesTransitionLoader;
