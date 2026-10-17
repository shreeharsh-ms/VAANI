import React from 'react';

/**
 * ClinicalReportBackground
 * Subtle botanical lavender watercolor wash and floral sprigs matching
 * the clinic overview page dashboard aesthetic.
 */
export const ClinicalReportBackground = ({ opacity = 'opacity-55', className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <img
        src="/faint-lavender-bg.jpg"
        alt="Lavender Flower Background"
        className={`w-full h-full object-cover object-left-top ${opacity} mix-blend-multiply`}
      />
      {/* Soft airy wash to ensure all clinical graphs, tables & text remain 100% crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
    </div>
  );
};

export default ClinicalReportBackground;
