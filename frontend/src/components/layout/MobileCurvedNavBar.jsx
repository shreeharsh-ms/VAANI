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
      <div className="relative w-full bg-white rounded-[26px] sm:rounded-[30px] shadow-[0_10px_35px_rgba(48,20,68,0.18)] border border-slate-200/90 pointer-events-auto px-1 pt-1.5 pb-1 transition-all">
        
        {/* ── SMOOTH CURVED CROPPED SCALLOP & NESTLED CIRCLE ── */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col items-center"
            style={{
              left: `${activeIndex * 20}%`,
              width: '20%',
            }}
          >
            {/* Seamless White Arch / Cropped-out Mound connecting with the navbar and crisp outline */}
            <div className="absolute -top-[16px] left-1/2 -translate-x-1/2 w-[76px] h-[18px] filter drop-shadow-[0_-4px_8px_rgba(48,20,68,0.12)]">
              <svg viewBox="0 0 76 18" fill="none" className="w-full h-full block">
                {/* Solid white fill that covers the top border line underneath */}
                <path
                  d="M 0 18 C 16 18 18 1.5 38 1.5 C 58 1.5 60 18 76 18 Z"
                  fill="#FFFFFF"
                />
                {/* Crisp curved outline matching the navbar border */}
                <path
                  d="M 0 18 C 16 18 18 1.5 38 1.5 C 58 1.5 60 18 76 18"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Nestled Floating Circle (Lowered down to nest right inside the cropped notch) */}
            <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#301444] shadow-[0_4px_14px_rgba(48,20,68,0.22)] flex items-center justify-center transition-transform duration-200 active:scale-95">
              <div className="w-8.5 h-8.5 rounded-full bg-purple-100/70 flex items-center justify-center">
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
