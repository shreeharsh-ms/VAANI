import React from 'react';

export const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
