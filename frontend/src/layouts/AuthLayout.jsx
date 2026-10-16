import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '../constants';
import Toast from '../components/feedback/Toast';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-600/30">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {APP_CONFIG.name} ERP
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Clinical Practice Management Portal
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <Outlet />
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Authorized personnel only • Protected by JWT RBAC
        </p>
      </div>

      <Toast />
    </div>
  );
};

export default AuthLayout;
