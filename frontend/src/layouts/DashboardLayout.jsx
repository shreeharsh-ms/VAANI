import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Toast from '../components/feedback/Toast';

export const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#301444] print:bg-white p-2 sm:p-3 lg:p-4 print:p-0 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* ── MAIN INNER CARD: Exact Home Page Santo Frame with Rounded Corners ── */}
      <div className="relative w-full flex-1 bg-white rounded-tr-[20px] sm:rounded-tr-[28px] lg:rounded-tr-[32px] rounded-br-[20px] sm:rounded-br-[28px] lg:rounded-br-[32px] rounded-bl-[20px] sm:rounded-bl-[28px] lg:rounded-bl-[32px] rounded-tl-none overflow-hidden shadow-2xl print:shadow-none print:rounded-none flex flex-col justify-between">
        
        {/* ── BACKGROUND LAYER: FAINT LAVENDER WATERCOLOR ── */}
        <div 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 print:hidden"
          aria-hidden="true"
        >
          <img
            src="/faint-lavender-bg.jpg"
            alt="Vaani Faint Lavender Background"
            className="w-full h-full object-cover object-top opacity-70 mix-blend-multiply"
          />
          {/* Airy soft translucent gradient wash so all cards and text remain crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/75 backdrop-blur-[0.5px]" />
        </div>

        {/* ── TOP NAVBAR: Exact Home Page Santo Navbar with Logo Tab & Fillets ── */}
        <div className="print:hidden">
          <Sidebar />
        </div>

        {/* ── MAIN CONTENT OUTLET (High density, no wasted padding) ── */}
        <main className="relative z-10 flex-1 w-full p-2.5 sm:p-3.5 lg:p-4 print:p-0">
          <div className="w-full mx-auto space-y-3 print:space-y-0">
            <Outlet />
          </div>
        </main>

        {/* ── CLINICAL INSTITUTIONAL FOOTER ── */}
        <footer className="relative z-10 w-full py-4.5 text-center bg-white/60 backdrop-blur-xs border-t border-purple-100/80 px-4 sm:px-8 print:hidden">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
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

      </div>

      <Toast />
    </div>
  );
};

export default DashboardLayout;
