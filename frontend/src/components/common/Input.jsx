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
  compact = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col ${compact ? 'gap-0.5' : 'gap-1'} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={`font-semibold text-slate-700 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {StartIcon && (
          <div className="absolute left-2.5 text-gray-400 pointer-events-none">
            <StartIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`w-full border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 ${
            compact
              ? 'h-8 px-2.5 py-1 text-xs rounded-md border-slate-300'
              : 'h-9 px-3 py-1.5 text-xs sm:text-sm rounded-lg border-purple-200'
          } ${StartIcon ? (compact ? 'pl-8' : 'pl-9') : ''} ${
            EndIcon ? (compact ? 'pr-8' : 'pr-9') : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : ''
          } ${className}`}
          {...props}
        />

        {EndIcon && (
          <div className="absolute right-2.5 text-gray-400">
            <EndIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
        )}
      </div>

      {error ? (
        <span className="text-[11px] text-red-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[10px] text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
