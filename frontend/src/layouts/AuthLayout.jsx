import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { ROUTES } from '../constants';
import Toast from '../components/feedback/Toast';

export const AuthLayout = () => {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <div className="relative min-h-screen w-full bg-[#f8f7f5] text-[#160424] flex flex-col justify-between selection:bg-purple-200 selection:text-purple-900">
      
      {/* ── SUBTLE AMBIENT CLINICAL BACKDROP (Clean, calm, zero AI artifacts) ── */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl" />
      </div>

      {/* ── TOP HEADER BAR (With Phone Safe-Area Top Head Padding) ── */}
      <header className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-[max(env(safe-area-inset-top),2.5rem)] pb-2 sm:py-6 flex items-center justify-between">
        {isNativeApp ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-purple-200/80 shadow-2xs text-[#301444] text-xs font-bold tracking-tight">
            <Shield className="w-3.5 h-3.5 text-purple-700" />
            <span>VAANI Clinic • Admin Portal</span>
          </div>
        ) : (
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 text-xs font-semibold text-[#301444] border border-gray-200/80 shadow-xs transition-all hover:border-gray-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-500 transition-transform group-hover:-translate-x-1" />
            <span>Return to Clinic Website</span>
          </Link>
        )}
      </header>

      {/* ── MAIN CONTENT OUTLET (Center Auth Card) ── */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-[480px]">
          <Outlet />
        </div>
      </main>

      {/* ── MINIMAL CLINICAL INSTITUTIONAL FOOTER ── */}
      <footer className="relative z-10 w-full py-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-200/60 pt-4">
          <p className="text-xs text-gray-500 font-normal">
            © {new Date().getFullYear()} Vaani Speech & Hearing Clinic • Sadashiv Peth, Satara, Maharashtra
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-normal">
            <span>RCI Registered Practice</span>
            <span>•</span>
            <span>Authorized Personnel Access Only</span>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  );
};

export default AuthLayout;
