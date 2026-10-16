import React from 'react';
import Card from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'teal',
}) => {
  const colorMap = {
    teal: 'bg-purple-100/70 text-[#301444] border-purple-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  };

  return (
    <Card className="p-5.5 hover:border-purple-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-purple-700/80 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#301444] mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${colorMap[color] || colorMap.teal} shadow-xs`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-purple-50 flex items-center gap-1.5 text-xs">
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            {trend}
          </span>
          <span className="text-gray-500 font-medium">{trendLabel}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
