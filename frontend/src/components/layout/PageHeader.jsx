import React from 'react';

export const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs && (
          <div className="text-xs text-purple-700 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#301444]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
