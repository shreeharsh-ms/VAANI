import React from 'react';

/**
 * OfficialReportTitle
 * Standardized elegant and professional clinical document title heading.
 * Features:
 * - Subtle gradient horizontal accent rules
 * - Dignified serif typography in deep royal purple
 * - Letter-spacing and clean uppercase styling
 * - Optional subtitle for multi-section/multi-page protocols
 */
export const OfficialReportTitle = ({
  title,
  subtitle = '',
  className = '',
}) => {
  return (
    <div className={`official-report-title text-center my-1 shrink-0 ${className}`}>
      <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3.5 max-w-full">
        <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-transparent via-purple-300 to-purple-800 rounded-full shrink-0" />
        <h2 className="font-serif font-black text-xs sm:text-[13px] tracking-[0.2em] sm:tracking-[0.22em] text-purple-950 uppercase leading-snug">
          {title}
        </h2>
        <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-l from-transparent via-purple-300 to-purple-800 rounded-full shrink-0" />
      </div>
      {subtitle && (
        <p className="text-[8.5px] print:text-[8px] font-bold text-purple-900 tracking-wider uppercase mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default OfficialReportTitle;
