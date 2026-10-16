import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Toast from '../components/feedback/Toast';

export const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#f8f5fc] text-[#160424] flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* ── BACKGROUND LAYER: FAINT LAVENDER WATERCOLOR (Exact image from Login & Public Website) ── */}
      <div 
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <img
          src="/faint-lavender-bg.jpg"
          alt="Vaani Faint Lavender Background"
          className="w-full h-full object-cover object-top opacity-70 mix-blend-multiply"
        />
        {/* Airy soft translucent gradient wash so all cards and text are crisp and legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/75 backdrop-blur-[0.5px]" />
      </div>

      {/* ── TOP NAVIGATION BAR (The sidebar placed above) ── */}
      <Sidebar />

      {/* ── MAIN CONTENT OUTLET ── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* ── INSTITUTIONAL CLINICAL FOOTER ── */}
      <footer className="relative z-10 w-full py-5 text-center bg-white/60 backdrop-blur-xs border-t border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-purple-900/70 font-medium">
            © {new Date().getFullYear()} Vaani Speech &amp; Hearing Clinic • Clinical Practice Suite (Satara)
          </p>
          <div className="flex items-center gap-3 text-xs text-purple-800/60 font-medium">
            <span>RCI Reg. Practice</span>
            <span>•</span>
            <span>Authorized Clinical Access</span>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  );
};

export default DashboardLayout;
