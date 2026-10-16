import React from 'react';
import { UserPlus, CalendarPlus, FilePlus, Headphones, Mic } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card';

export const QuickActions = ({ onNewPatient, onNewAppointment, onNewReport }) => {
  const actions = [
    {
      title: 'Register Patient',
      desc: 'Create new UHID & clinical profile',
      icon: UserPlus,
      color: 'bg-teal-500 text-white',
      onClick: onNewPatient,
    },
    {
      title: 'Schedule Session',
      desc: 'Book slot for speech or hearing therapy',
      icon: CalendarPlus,
      color: 'bg-indigo-500 text-white',
      onClick: onNewAppointment,
    },
    {
      title: 'Generate Assessment',
      desc: 'PTA audiogram or speech report',
      icon: FilePlus,
      color: 'bg-emerald-500 text-white',
      onClick: onNewReport,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Clinical Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={act.onClick}
              className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-teal-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${act.color} shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {act.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
