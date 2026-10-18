import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  IndianRupee,
  Box,
  RotateCcw,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Search,
  Command,
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import GlobalSearchModal from '../common/GlobalSearchModal';
import { isKey, isAlt, isCmdOrCtrl } from '../../utils/keyboard';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { logoUrl, clinicName } = useClinicSettings();
  const isCustomLogo = logoUrl && logoUrl !== '/vaani-logo.png' && logoUrl !== '/vaani-logo-white.png';
  const displayLogo = isCustomLogo ? logoUrl : '/vaani-logo-white.png';
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcuts Listener (supports macOS Command ⌘ and Windows Ctrl combinations)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing text in an input, textarea, or contentEditable
      const tag = e.target?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable;
      if (isInput) return;

      // Ctrl + 1..9 or Cmd + 1..9 -> Fast Directory Navigation
      if (isCmdOrCtrl(e) && !e.shiftKey) {
        const keyMap = {
          '1': ROUTES.DASHBOARD.HOME,
          '2': ROUTES.DASHBOARD.OVERVIEW,
          '3': ROUTES.DASHBOARD.APPOINTMENTS,
          '4': ROUTES.DASHBOARD.PATIENTS,
          '5': ROUTES.DASHBOARD.REPORTS,
          '6': ROUTES.DASHBOARD.BILLING,
          '7': ROUTES.DASHBOARD.INVENTORY,
          '8': ROUTES.DASHBOARD.RECALLS,
          '9': ROUTES.DASHBOARD.SETTINGS,
        };

        if (keyMap[e.key]) {
          e.preventDefault();
          navigate(keyMap[e.key]);
          return;
        }

        // Ctrl + B or Cmd + B -> Admin Home Screen
        if (isKey(e, 'b')) {
          e.preventDefault();
          navigate(ROUTES.DASHBOARD.HOME);
          return;
        }

        // Ctrl + K or Cmd + K -> Open Global Search
        if (isKey(e, 'k')) {
          e.preventDefault();
          setIsSearchOpen((prev) => !prev);
          return;
        }
      }

      // Alt + 1..9 -> Fast Directory Navigation (Fallback)
      if (isAlt(e)) {
        const altMap = {
          '1': ROUTES.DASHBOARD.HOME,
          '2': ROUTES.DASHBOARD.OVERVIEW,
          '3': ROUTES.DASHBOARD.APPOINTMENTS,
          '4': ROUTES.DASHBOARD.PATIENTS,
          '5': ROUTES.DASHBOARD.REPORTS,
          '6': ROUTES.DASHBOARD.BILLING,
          '7': ROUTES.DASHBOARD.INVENTORY,
          '8': ROUTES.DASHBOARD.RECALLS,
          '9': ROUTES.DASHBOARD.SETTINGS,
          'r': ROUTES.DASHBOARD.RECALLS,
          's': ROUTES.DASHBOARD.SETTINGS,
        };
        if (altMap[e.key.toLowerCase()]) {
          e.preventDefault();
          navigate(altMap[e.key.toLowerCase()]);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Primary ERP Navigation Items matching the SRS with numbered Ctrl shortcuts
  const menuItems = [
    { label: 'Home', path: ROUTES.DASHBOARD.HOME, icon: Home, num: 1, shortcut: 'Ctrl+1 / ⌘1' },
    { label: 'Overview', path: ROUTES.DASHBOARD.OVERVIEW, icon: LayoutDashboard, num: 2, shortcut: 'Ctrl+2 / ⌘2' },
    { label: 'Appointments', path: ROUTES.DASHBOARD.APPOINTMENTS, icon: CalendarCheck, num: 3, shortcut: 'Ctrl+3 / ⌘3' },
    { label: 'Patients', path: ROUTES.DASHBOARD.PATIENTS, icon: Users, num: 4, shortcut: 'Ctrl+4 / ⌘4' },
    { label: 'Clinical Records', path: ROUTES.DASHBOARD.REPORTS, icon: FileText, num: 5, shortcut: 'Ctrl+5 / ⌘5' },
    { label: 'Billing', path: ROUTES.DASHBOARD.BILLING, icon: IndianRupee, num: 6, shortcut: 'Ctrl+6 / ⌘6' },
    { label: 'Inventory', path: ROUTES.DASHBOARD.INVENTORY, icon: Box, num: 7, shortcut: 'Ctrl+7 / ⌘7' },
    { label: 'Recalls', path: ROUTES.DASHBOARD.RECALLS, icon: RotateCcw, num: 8, shortcut: 'Ctrl+8 / ⌘8' },
    { label: 'Settings', path: ROUTES.DASHBOARD.SETTINGS, icon: Settings, num: 9, shortcut: 'Ctrl+9 / ⌘9' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <header className="relative w-full flex items-center justify-between z-30 flex-shrink-0 font-sans">
        
        {/* Top-Left: Logo inside Dark Tab with Inverted Fillets (Santo Home Page Style) */}
        <div className="relative bg-[#301444] text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-br-[18px] sm:rounded-br-[28px] flex items-center self-start flex-shrink-0">
          <Link to={ROUTES.DASHBOARD.HOME} className="flex items-center group py-0.5" title="Admin Home (Ctrl + 1 / Ctrl + B)">
            <img
              src={displayLogo}
              alt={clinicName}
              className="h-8 sm:h-10 lg:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
            />
          </Link>

          {/* Top-Right Inverted Curved Corner */}
          <svg
            className="absolute left-[calc(100%-1px)] top-0 w-5 sm:w-7 h-5 sm:h-7 pointer-events-none"
            viewBox="0 0 38 38"
            fill="none"
            aria-hidden="true"
          >
            <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
          </svg>

          {/* Bottom-Left Inverted Curved Corner */}
          <svg
            className="absolute left-0 top-[calc(100%-1px)] w-5 sm:w-7 h-5 sm:h-7 pointer-events-none"
            viewBox="0 0 38 38"
            fill="none"
            aria-hidden="true"
          >
            <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
          </svg>
        </div>

        {/* Center: Navigation Pill Buttons ON THE WHITE CANVAS (Compact High-Density Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 py-2 px-2 overflow-x-auto scrollbar-none">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD.HOME || item.path === ROUTES.DASHBOARD.OVERVIEW}
              title={`${item.label} (${item.shortcut})`}
              className={({ isActive }) =>
                `group px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-100 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#301444] text-white shadow-xs'
                    : 'bg-white hover:bg-purple-50 text-slate-800 border border-slate-200 shadow-2xs'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-purple-50 text-purple-900 border border-purple-200/90 group-hover:bg-purple-100'
                    }`}
                  >
                    <span className="hidden xl:inline">Ctrl+</span>{item.num}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Spotlight Search + Public Website + Staff Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 py-2 px-2 sm:px-4">
          
          {/* Spotlight Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer"
            title="Spotlight Search (Ctrl + K / ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Search</span>
            <kbd className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">
              Ctrl+K / ⌘K
            </kbd>
          </button>

          {/* Public Website Button */}
          <Link
            to={ROUTES.HOME}
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-200" />
            <span>Public Site</span>
          </Link>

          {/* Staff Profile and Logout Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#301444] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {user?.name ? user.name.charAt(0) : 'P'}
            </div>
            <div className="hidden 2xl:block text-left whitespace-nowrap">
              <p className="text-xs font-bold text-[#301444] leading-tight">
                {user?.name || 'Dr. Palak Gandhi'}
              </p>
              <p className="text-[9px] font-semibold text-purple-600 uppercase tracking-wider">
                {user?.role || 'Owner'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full border border-purple-200 bg-white text-[#301444] hover:bg-purple-50 shadow-2xs transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#faf8fc] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Header inside drawer */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-purple-100 bg-[#301444] text-white shadow-sm flex-shrink-0">
              <Link to={ROUTES.DASHBOARD.HOME} onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img src={displayLogo} alt={clinicName} className="h-8 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links inside drawer */}
            <div className="relative z-10 flex-1 px-4 py-4 overflow-y-auto space-y-2 font-sans">
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2">
                Clinical ERP Navigation
              </div>

              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === ROUTES.DASHBOARD.HOME || item.path === ROUTES.DASHBOARD.OVERVIEW}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs shadow-2xs transition-all ${
                      isActive
                        ? 'bg-[#301444] text-white'
                        : 'bg-white text-slate-800 border border-slate-200 hover:bg-purple-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                    Ctrl+{item.num}
                  </span>
                </NavLink>
              ))}

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <Link
                  to={ROUTES.HOME}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs bg-purple-100 text-[#301444] border border-purple-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Public Website</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user?.name || 'Dr. Palak Gandhi'})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── GLOBAL SPOTLIGHT SEARCH MODAL ── */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Sidebar;
