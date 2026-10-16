import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'
  size = 'md',          // 'sm' | 'md'
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-bold',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/90 font-bold',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/90 font-bold',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/90 font-bold',
    primary: 'bg-purple-100 text-[#301444] border border-purple-200 font-bold',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
