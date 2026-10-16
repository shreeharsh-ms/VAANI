import React, { useState, useRef, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Toast from '../components/feedback/Toast';
import PageTransitionLoader from '../components/common/PageTransitionLoader';

export const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isServices = location.pathname === '/services';
  const isContact = location.pathname === '/contact' || location.pathname.startsWith('/contact');
  const isBlogs = location.pathname === '/blogs' || location.pathname.startsWith('/blogs');

  const [showPageLoader, setShowPageLoader] = useState(false);
  const [targetPath, setTargetPath] = useState(location.pathname);
  const prevPathRef = useRef(location.pathname);

  useLayoutEffect(() => {
    // Trigger video transition loader with unique quotes and clinical facts whenever changing routes
    if (prevPathRef.current !== location.pathname) {
      setTargetPath(location.pathname);
      setShowPageLoader(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const handleLoaderComplete = () => {
    setShowPageLoader(false);
    // If navigating with a hash link (e.g., #booking-section), scroll smoothly to target after loader finishes
    if (location.hash) {
      setTimeout(() => {
        const target = document.getElementById(location.hash.replace('#', ''));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col w-full ${
        isHome || isAbout || isServices || isContact || isBlogs
          ? 'bg-white text-[#280644]'
          : 'bg-[#fbf9fe] dark:bg-[#12071f] text-[#280644] dark:text-[#fbf8ff]'
      } transition-colors`}
    >
      {/* Universal Blooming Lavender Video Transition Loader with Dynamic Quotes & Clinical Facts */}
      {showPageLoader && (
        <PageTransitionLoader targetPath={targetPath} onComplete={handleLoaderComplete} />
      )}

      {/* On home and services pages, the framed Hero provides the full-width integrated top navigation matching the reference design */}
      {!isHome && !isServices && <Navbar />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export default MainLayout;
