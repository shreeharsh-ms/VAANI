import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 z-[9999] flex flex-col gap-2 max-w-full sm:max-w-md pointer-events-none items-center sm:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full flex items-start sm:items-center justify-between gap-2.5 px-3.5 py-3 sm:p-4 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl text-xs sm:text-sm animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <div className="mt-0.5 sm:mt-0 flex-shrink-0">
              {icons[toast.type] || icons.info}
            </div>
            <span className="text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-sm leading-snug break-words flex-1">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 -mr-1 -mt-0.5 sm:mt-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
