import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export const SmoothScroll = ({ children }) => {
  const location = useLocation();

  const isDashboardOrAdmin = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login');

  useEffect(() => {
    // If on dashboard/admin, completely disable Lenis for instant snappy native scrolling
    if (isDashboardOrAdmin) {
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
      document.documentElement.classList.remove('lenis');
      return;
    }

    // Initialize Lenis for luxurious buttery smooth scrolling ONLY on customer end website
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
  }, [location.pathname, isDashboardOrAdmin]);

  // When route changes, guarantee scroll resets to the hero section (top) or jumps to hash
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (isDashboardOrAdmin) {
      window.scrollTo(0, 0);
      return;
    }

    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(element, { offset: -20, duration: 1.2 });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }

    // Always reset to top (hero section) on route transition
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    // Secondary tick to ensure dynamic layout/fonts don't shift scroll
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash, isDashboardOrAdmin]);

  return <>{children}</>;
};

export default SmoothScroll;
