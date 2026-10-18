import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  Users,
  FileText,
  IndianRupee,
} from 'lucide-react';
import { ROUTES } from '../../constants';

export const MobileCurvedNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: ROUTES.DASHBOARD.HOME,
      icon: Home,
      isActive: (pathname) =>
        pathname === ROUTES.DASHBOARD.HOME ||
        pathname === ROUTES.DASHBOARD.OVERVIEW ||
        pathname === '/dashboard' ||
        pathname === '/dashboard/',
    },
    {
      id: 'schedule',
      label: 'Schedule',
      path: ROUTES.DASHBOARD.APPOINTMENTS,
      icon: CalendarCheck,
      isActive: (pathname) => pathname.startsWith(ROUTES.DASHBOARD.APPOINTMENTS),
    },
    {
      id: 'patients',
      label: 'Patients',
      path: ROUTES.DASHBOARD.PATIENTS,
      icon: Users,
      isActive: (pathname) => pathname.startsWith(ROUTES.DASHBOARD.PATIENTS),
    },
    {
      id: 'records',
      label: 'Records',
      path: ROUTES.DASHBOARD.REPORTS,
      icon: FileText,
      isActive: (pathname) => pathname.startsWith(ROUTES.DASHBOARD.REPORTS),
    },
    {
      id: 'billing',
      label: 'Billing',
      path: ROUTES.DASHBOARD.BILLING,
      icon: IndianRupee,
      isActive: (pathname) => pathname.startsWith(ROUTES.DASHBOARD.BILLING),
    },
  ];

  const activeIndex = navItems.findIndex((item) => item.isActive(location.pathname));
  const currentActiveItem = activeIndex >= 0 ? navItems[activeIndex] : null;
  const ActiveIcon = currentActiveItem ? currentActiveItem.icon : null;

  return (
    <nav
      aria-label="Clinical Mobile Navigation"
      className="lg:hidden fixed bottom-2 left-2 right-2 max-w-md mx-auto z-40 print:hidden pointer-events-none"
    >
      {/* Floating White Navigation Container */}
      <div className="relative w-full bg-white rounded-[26px] sm:rounded-[30px] shadow-[0_10px_35px_rgba(48,20,68,0.18)] border border-purple-100/90 pointer-events-auto px-1 pt-1.5 pb-1 transition-all">
        
        {/* ── SMOOTH CURVED SCALLOP / DOME & ELEVATED FLOATING CIRCLE ── */}
        {activeIndex >= 0 && (
          <div
            className="absolute -top-[18px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-center"
            style={{
              left: `${activeIndex * 20}%`,
              width: '20%',
            }}
          >
            {/* Seamless White Arch connecting to top border */}
            <div className="absolute top-0 w-[74px] h-[20px] filter drop-shadow-[0_-3px_5px_rgba(48,20,68,0.06)]">
              <svg viewBox="0 0 74 20" fill="none" className="w-full h-full block">
                <path
                  d="M 0 20 C 15 20 18 2 37 2 C 56 2 59 20 74 20 Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M 0 20 C 15 20 18 2 37 2 C 56 2 59 20 74 20"
                  stroke="rgba(241, 245, 249, 0.9)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>

            {/* Elevated Floating Circle with Purple Stroke */}
            <div className="relative -top-[16px] w-12 h-12 rounded-full bg-white border-[2.5px] border-[#301444] shadow-[0_6px_16px_rgba(48,20,68,0.20)] flex items-center justify-center transition-transform duration-200 active:scale-95">
              <div className="w-8.5 h-8.5 rounded-full bg-purple-50/80 flex items-center justify-center">
                {ActiveIcon && <ActiveIcon className="w-5 h-5 text-[#301444] stroke-[2.2px]" />}
              </div>
            </div>
          </div>
        )}

        {/* ── 5 NAVIGATION TABS ── */}
        <div className="flex items-center justify-between w-full h-[58px] relative z-10">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                className="w-1/5 h-full flex flex-col items-center justify-end pb-1.5 pt-1 rounded-2xl cursor-pointer select-none transition-colors active:opacity-75 focus:outline-none"
                title={item.label}
              >
                {/* Regular icon shown when tab is inactive */}
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    isActive ? 'opacity-0 scale-50 h-0 mb-0 pointer-events-none' : 'opacity-100 scale-100 mb-1'
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400 stroke-[1.8px] hover:text-[#301444] transition-colors" />
                </div>

                {/* Tab Label */}
                <span
                  className={`tracking-tight transition-all text-center leading-none ${
                    isActive
                      ? 'text-[11px] font-bold text-slate-900 pb-0.5'
                      : 'text-[10px] font-medium text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── NATIVE HOME INDICATOR BAR (Matching Reference Image) ── */}
        <div className="w-28 h-1 bg-slate-300/80 rounded-full mx-auto my-1 pointer-events-none" />

      </div>
    </nav>
  );
};

export default MobileCurvedNavBar;
