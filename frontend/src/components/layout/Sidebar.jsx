import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  LogOut,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 dark:text-white">VAANI ERP</span>
            <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-medium">Practice Suite</span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Practice Management
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD.OVERVIEW}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
          <NavLink
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </NavLink>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center flex-shrink-0 text-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name || 'Staff User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role || 'Clinician'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
