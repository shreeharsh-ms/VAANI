import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title,
  children,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      icon: Info,
      wrapper: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200',
      iconColor: 'text-blue-500',
    },
    success: {
      icon: CheckCircle,
      wrapper: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200',
      iconColor: 'text-emerald-500',
    },
    warning: {
      icon: AlertTriangle,
      wrapper: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200',
      iconColor: 'text-amber-500',
    },
    danger: {
      icon: AlertCircle,
      wrapper: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200',
      iconColor: 'text-red-500',
    },
  };

  const current = configs[variant] || configs.info;
  const IconComponent = current.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${current.wrapper} ${className}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
