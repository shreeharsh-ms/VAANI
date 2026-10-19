import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  CalendarPlus,
  Users,
  UserPlus,
  FileText,
  FilePlus,
  IndianRupee,
  PlusCircle,
  Sparkles,
  Clock,
  X,
} from 'lucide-react';
import { ROUTES } from '../../constants';

export const MobileCurvedNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeQuickMenu, setActiveQuickMenu] = useState(null);

  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  // Close quick action menu on route change
  useEffect(() => {
    setActiveQuickMenu(null);
  }, [location.pathname]);

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

  const tabQuickActions = {
    schedule: {
      title: 'Schedule & Booking',
      actions: [
        {
          id: 'new-booking',
          label: 'Schedule New Slot',
          sublabel: 'Book consultation appointment',
          icon: CalendarPlus,
          color: 'text-purple-900 bg-purple-50 hover:bg-purple-100 border-purple-200',
          onClick: () => {
            if (location.pathname.startsWith(ROUTES.DASHBOARD.APPOINTMENTS)) {
              window.dispatchEvent(new CustomEvent('vaani_open_new_appointment'));
            } else {
              navigate(`${ROUTES.DASHBOARD.APPOINTMENTS}?action=new`);
            }
          },
        },
        {
          id: 'view-schedule',
          label: 'View Appointments Roster',
          sublabel: 'Today & upcoming scheduled slots',
          icon: CalendarCheck,
          color: 'text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200',
          onClick: () => navigate(ROUTES.DASHBOARD.APPOINTMENTS),
        },
      ],
    },
    patients: {
      title: 'Patient Management',
      actions: [
        {
          id: 'new-patient',
          label: 'Register New Patient',
          sublabel: 'Intake registration with auto UHID',
          icon: UserPlus,
          color: 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
          onClick: () => {
            if (location.pathname.startsWith(ROUTES.DASHBOARD.PATIENTS)) {
              window.dispatchEvent(new CustomEvent('vaani_open_new_patient'));
            } else {
              navigate(`${ROUTES.DASHBOARD.PATIENTS}?action=new`);
            }
          },
        },
        {
          id: 'view-patients',
          label: 'All Patients Directory',
          sublabel: 'Browse patient clinical records',
          icon: Users,
          color: 'text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200',
          onClick: () => navigate(ROUTES.DASHBOARD.PATIENTS),
        },
      ],
    },
    records: {
      title: 'Clinical Reports',
      actions: [
        {
          id: 'new-report',
          label: 'Create Clinical Report',
          sublabel: 'Audiological, speech, voice or CBT',
          icon: FilePlus,
          color: 'text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
          onClick: () => navigate('/dashboard/reports/create'),
        },
        {
          id: 'view-reports',
          label: 'All Clinical Reports',
          sublabel: 'Browse verified proformas & records',
          icon: FileText,
          color: 'text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200',
          onClick: () => navigate(ROUTES.DASHBOARD.REPORTS),
        },
      ],
    },
    billing: {
      title: 'Billing & POS',
      actions: [
        {
          id: 'new-invoice',
          label: 'Create New Invoice',
          sublabel: 'Clinical consultations & therapy billing',
          icon: PlusCircle,
          color: 'text-purple-900 bg-purple-50 hover:bg-purple-100 border-purple-200',
          onClick: () => {
            if (location.pathname.startsWith(ROUTES.DASHBOARD.BILLING)) {
              window.dispatchEvent(new CustomEvent('vaani_open_new_invoice'));
            } else {
              navigate(`${ROUTES.DASHBOARD.BILLING}?action=new`);
            }
          },
        },
        {
          id: 'add-instrument',
          label: 'Add Instrument / Hearing Aid',
          sublabel: 'Dispense digital RIC/BTE with serial #',
          icon: Sparkles,
          color: 'text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-200',
          onClick: () => {
            if (location.pathname.startsWith(ROUTES.DASHBOARD.BILLING)) {
              window.dispatchEvent(new CustomEvent('vaani_open_new_instrument'));
            } else {
              navigate(`${ROUTES.DASHBOARD.BILLING}?action=instrument`);
            }
          },
        },
        {
          id: 'view-billing',
          label: 'Invoices & Receipts Ledger',
          sublabel: 'Review settlements & payment receipts',
          icon: IndianRupee,
          color: 'text-slate-800 bg-slate-50 hover:bg-slate-100 border-slate-200',
          onClick: () => navigate(ROUTES.DASHBOARD.BILLING),
        },
      ],
    },
    home: {
      title: 'Clinic Overview',
      actions: [
        {
          id: 'dashboard',
          label: 'Clinical Home Dashboard',
          sublabel: 'Operational KPIs & daily roster',
          icon: Home,
          color: 'text-purple-900 bg-purple-50 hover:bg-purple-100 border-purple-200',
          onClick: () => navigate(ROUTES.DASHBOARD.HOME),
        },
        {
          id: 'live-queue',
          label: 'Today’s Consultation Roster',
          sublabel: 'Manage arrived and scheduled patients',
          icon: Clock,
          color: 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
          onClick: () => navigate(ROUTES.DASHBOARD.APPOINTMENTS),
        },
      ],
    },
  };

  const activeIndex = navItems.findIndex((item) => item.isActive(location.pathname));
  const currentActiveItem = activeIndex >= 0 ? navItems[activeIndex] : null;
  const ActiveIcon = currentActiveItem ? currentActiveItem.icon : null;

  // Long-press handlers
  const handleTouchStart = (item) => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (navigator.vibrate) navigator.vibrate(40);
      setActiveQuickMenu(item.id);
    }, 380); // 380ms hold
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTabClick = (item, isCurrentlyActive) => {
    // If long-press fired, prevent default navigation
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    // If tapping the already active tab, toggle quick action menu
    if (isCurrentlyActive) {
      setActiveQuickMenu((prev) => (prev === item.id ? null : item.id));
      return;
    }

    // Otherwise standard navigation
    setActiveQuickMenu(null);
    navigate(item.path);
  };

  return (
    <>
      {/* ── BACKDROP TO CLOSE POPUP ── */}
      {activeQuickMenu && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-2xs transition-opacity"
          onClick={() => setActiveQuickMenu(null)}
        />
      )}

      <nav
        aria-label="Clinical Mobile Navigation"
        className="lg:hidden fixed bottom-2 left-2 right-2 max-w-md mx-auto z-40 print:hidden pointer-events-none"
      >
        {/* ── QUICK ACTION POPUP CARD (Rendered directly above the tapped/held tab) ── */}
        {activeQuickMenu && tabQuickActions[activeQuickMenu] && (
          <div
            className="absolute bottom-[72px] z-50 pointer-events-auto transition-all duration-200 ease-out"
            style={{
              left:
                activeQuickMenu === 'home'
                  ? '6px'
                  : activeQuickMenu === 'billing'
                  ? 'auto'
                  : `${(navItems.findIndex((n) => n.id === activeQuickMenu) * 20) + 10}%`,
              right: activeQuickMenu === 'billing' ? '6px' : 'auto',
              transform:
                activeQuickMenu === 'home' || activeQuickMenu === 'billing'
                  ? 'none'
                  : 'translateX(-50%)',
              maxWidth: 'calc(100vw - 28px)',
            }}
          >
            <div className="w-[280px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_14px_45px_rgba(48,20,68,0.24)] border border-purple-200/90 p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-150 relative">
              {/* Header */}
              <div className="flex items-center justify-between px-1.5 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-700 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-800 tracking-wide">
                    {tabQuickActions[activeQuickMenu].title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveQuickMenu(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Actions List */}
              <div className="space-y-1">
                {tabQuickActions[activeQuickMenu].actions.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => {
                        setActiveQuickMenu(null);
                        act.onClick();
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all cursor-pointer active:scale-98 ${act.color}`}
                    >
                      <div className="p-1.5 rounded-lg bg-white/90 shadow-2xs shrink-0">
                        <ActIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-tight truncate">
                          {act.label}
                        </div>
                        <div className="text-[10px] opacity-75 truncate mt-0.5">
                          {act.sublabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Downward Pointer Triangle */}
              <div
                className="absolute -bottom-1.5 w-3 h-3 bg-white border-b border-r border-purple-200/90 rotate-45"
                style={{
                  left:
                    activeQuickMenu === 'home'
                      ? '32px'
                      : activeQuickMenu === 'billing'
                      ? 'calc(100% - 36px)'
                      : 'calc(50% - 6px)',
                }}
              />
            </div>
          </div>
        )}

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
                  <path
                    d="M 0 18 C 16 18 18 1.5 38 1.5 C 58 1.5 60 18 76 18 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M 0 18 C 16 18 18 1.5 38 1.5 C 58 1.5 60 18 76 18"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Nestled Floating Circle - Tapping toggles quick action menu for active item */}
              <button
                type="button"
                onClick={() => {
                  if (currentActiveItem) {
                    setActiveQuickMenu((prev) => (prev === currentActiveItem.id ? null : currentActiveItem.id));
                  }
                }}
                className="pointer-events-auto absolute -top-[14px] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#301444] shadow-[0_4px_14px_rgba(48,20,68,0.22)] flex items-center justify-center transition-transform duration-200 active:scale-95 cursor-pointer"
                title="Tap for Quick Actions"
              >
                <div className="w-8.5 h-8.5 rounded-full bg-purple-100/70 flex items-center justify-center">
                  {ActiveIcon && <ActiveIcon className="w-5 h-5 text-[#301444] stroke-[2.2px]" />}
                </div>
              </button>
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
                  onTouchStart={() => handleTouchStart(item)}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={() => handleTouchStart(item)}
                  onMouseUp={handleTouchEnd}
                  onMouseLeave={handleTouchEnd}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setActiveQuickMenu(item.id);
                  }}
                  onClick={() => handleTabClick(item, isActive)}
                  className="w-1/5 h-full flex flex-col items-center justify-end pb-1.5 pt-1 rounded-2xl cursor-pointer select-none transition-colors active:opacity-75 focus:outline-none"
                  title={`${item.label} (Hold for Quick Actions)`}
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

          {/* ── NATIVE HOME INDICATOR BAR ── */}
          <div className="w-28 h-1 bg-slate-300/80 rounded-full mx-auto my-1 pointer-events-none" />

        </div>
      </nav>
    </>
  );
};

export default MobileCurvedNavBar;
