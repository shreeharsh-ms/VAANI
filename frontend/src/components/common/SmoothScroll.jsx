import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export const SmoothScroll = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis for luxurious buttery smooth scrolling across the entire site
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    let rfId;
    function raf(time) {
      lenis.raf(time);
      rfId = requestAnimationFrame(raf);
    }
    rfId = requestAnimationFrame(raf);

    // Global listener for smooth anchor jumps (e.g., #booking-section)
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href*="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && (href.startsWith('#') || (href.startsWith('/#') && location.pathname === '/'))) {
        const id = href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -20, duration: 1.3 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });

    return () => {
      cancelAnimationFrame(rfId);
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      lenis.destroy();
      window.lenis = null;
    };
  }, [location.pathname]);

  // When route changes, reset scroll smoothly to top or jump to hash
  useEffect(() => {
    if (window.lenis) {
      if (location.hash) {
        const id = location.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const timer = setTimeout(() => {
            window.lenis?.scrollTo(element, { offset: -20, duration: 1.3 });
          }, 100);
          return () => clearTimeout(timer);
        }
      } else {
        window.lenis.scrollTo(0, { immediate: true });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return <>{children}</>;
};

export default SmoothScroll;
