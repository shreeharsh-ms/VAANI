import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileText,
  IndianRupee,
  Settings,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

export const AdminHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clinicName, clinicPhone, clinicCity } = useClinicSettings();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.name || user?.full_name || 'Ms. Palak Paresh Gandhi';
  const userRole = user?.role || 'Clinic Owner & Chief Audiologist';

  const quickNav = [
    { label: 'Overview', path: ROUTES.DASHBOARD.OVERVIEW, icon: LayoutDashboard, shortcut: 'Alt+1' },
    { label: 'Appointments', path: ROUTES.DASHBOARD.APPOINTMENTS, icon: CalendarCheck, shortcut: 'Alt+2' },
    { label: 'Patients', path: ROUTES.DASHBOARD.PATIENTS, icon: Users, shortcut: 'Alt+3' },
    { label: 'Clinical Records', path: ROUTES.DASHBOARD.REPORTS, icon: FileText, shortcut: 'Alt+4' },
    { label: 'Billing', path: ROUTES.DASHBOARD.BILLING, icon: IndianRupee, shortcut: 'Alt+5' },
    { label: 'Settings', path: ROUTES.DASHBOARD.SETTINGS, icon: Settings, shortcut: 'Alt+S' },
  ];

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center px-4 py-8 select-none">
      
      {/* Ambient background glow behind logo */}
      <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6">
        
        {/* Soft radial glow halo */}
        <div 
          className="absolute -top-12 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
          aria-hidden="true" 
        />

        {/* ── BIG VAANI LOGO IN THE MIDDLE ── */}
        <div className="relative group p-4 transition-transform duration-300 hover:scale-[1.02]">
          <img
            src="/vaani-logo.png"
            alt={clinicName || 'Vaani Speech and Hearing Clinic'}
            className="w-full max-w-[340px] sm:max-w-[440px] md:max-w-[540px] lg:max-w-[620px] h-auto object-contain mx-auto drop-shadow-md"
          />
        </div>

        {/* Staff Greeting & Station Details */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Authorized Clinical Practice Suite</span>
            <span className="text-purple-400">•</span>
            <span className="font-mono text-[11px] text-purple-800">{currentTime}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#301444] tracking-tight">
            Welcome, <span className="text-purple-700">{userName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
            {clinicName || 'Vaani Speech & Hearing Clinic'} • {clinicCity || 'Satara, Maharashtra'}
          </p>
        </div>

        {/* Global Shortcut Guidance Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/90 border border-slate-200 shadow-xs text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Return to Home:</span>
            <kbd className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs">
              Ctrl + B
            </kbd>
            <span className="text-slate-400 text-[10px]">or ⌘B</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Spotlight Search:</span>
            <kbd className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Quick Directory Jump Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-purple-50 hover:text-purple-900 border border-slate-200 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-purple-700" />
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">({item.shortcut})</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default AdminHomePage;
