import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#6b21a8] hover:bg-[#581c87] text-white shadow-sm focus:ring-purple-500 border border-transparent',
    secondary: 'bg-[#4a1d6e] hover:bg-[#3b1559] text-white shadow-sm focus:ring-purple-500 border border-transparent',
    outline: 'border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-[#311444] dark:text-purple-200 focus:ring-purple-500',
    ghost: 'hover:bg-purple-50 dark:hover:bg-purple-950/50 text-[#311444] dark:text-purple-200 focus:ring-purple-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        StartIcon && <StartIcon className="w-4 h-4" />
      )}
      <span>{children}</span>
      {!isLoading && EndIcon && <EndIcon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
