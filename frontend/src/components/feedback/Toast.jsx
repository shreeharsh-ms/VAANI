import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />,
    danger: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />,
  };

  // Keep max 3 latest toasts on screen to prevent screen flooding on mobile
  const visibleToasts = toasts.slice(-3);

  return (
    <div className="fixed top-3 left-3 right-3 sm:top-auto sm:bottom-5 sm:left-auto sm:right-5 z-[9999] flex flex-col gap-1.5 max-w-[calc(100vw-24px)] sm:max-w-md pointer-events-none items-center sm:items-end">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full flex items-center justify-between gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg text-xs leading-tight animate-in fade-in slide-in-from-top-2 sm:slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {icons[toast.type] || icons.info}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs leading-snug break-words line-clamp-3 flex-1">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
