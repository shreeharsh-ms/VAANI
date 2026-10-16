import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {StartIcon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            <StartIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-xl border bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            StartIcon ? 'pl-9' : ''
          } ${EndIcon ? 'pr-9' : ''} ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-purple-200 dark:border-purple-800 focus:border-purple-500'
          } ${className}`}
          {...props}
        />

        {EndIcon && (
          <div className="absolute right-3 text-gray-400">
            <EndIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500 dark:text-gray-400">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
