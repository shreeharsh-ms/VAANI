import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', path: ROUTES.DASHBOARD.OVERVIEW, icon: LayoutDashboard },
    { label: 'Patients', path: ROUTES.DASHBOARD.PATIENTS, icon: Users },
    { label: 'Appointments', path: ROUTES.DASHBOARD.APPOINTMENTS, icon: CalendarCheck },
    { label: 'Clinical Reports', path: ROUTES.DASHBOARD.REPORTS, icon: FileText },
    { label: 'Settings', path: ROUTES.DASHBOARD.SETTINGS, icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="relative w-full flex items-center justify-between z-30 flex-shrink-0">
      
      {/* Top-Left: Logo inside Dark Tab with Inverted Fillets (Identical to Home Page Santo Navbar) */}
      <div className="relative bg-[#301444] text-white px-4 sm:px-8 lg:px-10 py-2.5 sm:py-4 lg:py-4.5 rounded-br-[22px] sm:rounded-br-[38px] flex items-center self-start flex-shrink-0">
        <Link to={ROUTES.HOME} className="flex items-center group py-0.5" title="Vaani Speech & Hearing Clinic">
          <img
            src="/vaani-logo-white.png"
            alt="Vaani Speech and Hearing Clinic"
            className="h-9 sm:h-13 lg:h-15 xl:h-[68px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
          />
        </Link>

        {/* Top-Right Inverted Curved Corner */}
        <svg
          className="absolute left-[calc(100%-1px)] top-0 w-6 sm:w-9 lg:w-[38px] h-6 sm:h-9 lg:h-[38px] pointer-events-none"
          viewBox="0 0 38 38"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
        </svg>

        {/* Bottom-Left Inverted Curved Corner */}
        <svg
          className="absolute left-0 top-[calc(100%-1px)] w-6 sm:w-9 lg:w-[38px] h-6 sm:h-9 lg:h-[38px] pointer-events-none"
          viewBox="0 0 38 38"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 0 H 38 A 38 38 0 0 0 0 38 Z" fill="#301444" />
        </svg>
      </div>

      {/* Center: Navigation Pill Buttons ON THE WHITE CANVAS (Desktop only) */}
      <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 py-3 sm:py-4 px-3 sm:px-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === ROUTES.DASHBOARD.OVERVIEW}
            className={({ isActive }) =>
              `px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold whitespace-nowrap transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#301444] text-white shadow-md'
                  : 'bg-white hover:bg-purple-50 text-[#301444] border border-gray-200/90 shadow-sm'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right: Public Website Button (styled like Book an Appointment) + Clinician Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-4 px-3 sm:px-8">
        {/* Public Website Button styled like Book an Appointment */}
        <Link
          to={ROUTES.HOME}
          className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-[14.5px] font-bold bg-[#301444] hover:bg-[#220a32] text-white transition-all shadow-md hover:shadow-purple-950/60 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-purple-200" />
          <span>Public Website</span>
        </Link>

        {/* Staff Profile and Logout Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-purple-200">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#301444] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs">
            {user?.name ? user.name.charAt(0) : 'P'}
          </div>
          <div className="hidden xl:block text-left whitespace-nowrap">
            <p className="text-xs font-bold text-[#301444] leading-tight">
              {user?.name || 'Dr. Palak Gandhi'}
            </p>
            <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
              {user?.role || 'Owner / Clinician'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 sm:p-2.5 rounded-full text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Mobile / Tablet Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 sm:p-2.5 rounded-full border border-purple-200/90 bg-white/95 text-[#301444] hover:bg-purple-50 shadow-xs transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#301444]" /> : <Menu className="w-5 h-5 text-[#301444]" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#faf8fc] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Lavender flower on white background theme */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img
              src="/faint-lavender-bg.jpg"
              alt=""
              className="w-full h-full object-cover object-left-top opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/50 backdrop-blur-[0.3px]" />
          </div>

          {/* Header inside drawer */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-purple-100/80 bg-[#301444] text-white shadow-sm flex-shrink-0">
            <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} className="flex items-center">
              <img src="/vaani-logo-white.png" alt="Vaani Clinic" className="h-9 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links inside drawer */}
          <div className="relative z-10 flex-1 px-5 py-6 overflow-y-auto space-y-3">
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-2">
              Practice Management Navigation
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD.OVERVIEW}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm shadow-xs transition-all ${
                    isActive
                      ? 'bg-[#301444] text-white'
                      : 'bg-white/95 text-[#301444] border border-purple-100 hover:bg-purple-50'
                  }`
                }
              >
                <span>{item.label}</span>
                <span className="text-xs opacity-70">→</span>
              </NavLink>
            ))}

            <div className="pt-4 border-t border-purple-200/80 space-y-3">
              <Link
                to={ROUTES.HOME}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold text-sm bg-purple-100 text-[#301444] border border-purple-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Public Website</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold text-sm bg-rose-50 text-rose-700 border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out ({user?.name || 'Dr. Palak Gandhi'})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Sidebar;
