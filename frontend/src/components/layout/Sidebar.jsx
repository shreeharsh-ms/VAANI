import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  LogOut,
  Activity,
  ArrowLeft,
  Menu,
  X,
  Shield,
  ExternalLink,
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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-[0_2px_12px_rgba(48,20,68,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Live Clinic Badge */}
        <div className="flex items-center gap-3 xl:gap-4 flex-shrink-0">
          <Link
            to={ROUTES.DASHBOARD.OVERVIEW}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#301444] text-white flex items-center justify-center shadow-md shadow-[#301444]/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-purple-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#301444] leading-tight">
                VAANI ERP
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">
                Practice Suite
              </span>
            </div>
          </Link>

          {/* Live Clinic Pill */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinic Live: Satara Center</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar Pills (Public Site Aesthetic) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD.OVERVIEW}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-[13px] font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#301444] text-white shadow-sm'
                      : 'text-[#301444]/80 hover:text-[#301444] hover:bg-white/90'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions, Public Website Link & Clinician Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Back to Public Website Pill */}
          <Link
            to={ROUTES.HOME}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#301444] bg-white hover:bg-purple-50 border border-purple-200/90 shadow-2xs transition-all hover:scale-102"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
            <span>Public Website</span>
          </Link>

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 sm:pl-3 sm:border-l sm:border-purple-100">
            <div className="w-9 h-9 rounded-full bg-[#301444] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0) : 'P'}
            </div>
            <div className="hidden md:block text-left whitespace-nowrap">
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
              className="p-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-purple-50 border border-purple-200 text-[#301444] hover:bg-purple-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation (Slide-down) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100 text-xs text-purple-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Clinic Live: Satara Center
            </span>
            <span className="text-[11px] text-gray-500 font-normal">
              {user?.name || 'Dr. Palak Paresh Gandhi'}
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.DASHBOARD.OVERVIEW}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#301444] text-white'
                      : 'text-[#301444] hover:bg-purple-50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
            <Link
              to={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Sidebar;
