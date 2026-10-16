import React from 'react';
import { UserPlus, CalendarPlus, FilePlus, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card';

export const QuickActions = ({ onNewPatient, onNewAppointment, onNewReport }) => {
  const actions = [
    {
      title: 'Register Patient',
      desc: 'Create new UHID & clinical profile',
      icon: UserPlus,
      color: 'bg-[#301444] text-white',
      onClick: onNewPatient,
    },
    {
      title: 'Schedule Session',
      desc: 'Book slot for speech or hearing therapy',
      icon: CalendarPlus,
      color: 'bg-purple-700 text-white',
      onClick: onNewAppointment,
    },
    {
      title: 'Generate Assessment',
      desc: 'PTA audiogram or speech report',
      icon: FilePlus,
      color: 'bg-emerald-700 text-white',
      onClick: onNewReport,
    },
  ];

  return (
    <Card className="p-5.5">
      <CardHeader className="p-0 pb-4 border-b border-purple-100/80">
        <CardTitle className="text-lg font-bold text-[#301444]">
          Quick Clinical Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-4 space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={act.onClick}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white hover:bg-purple-50/80 border border-purple-100/90 hover:border-purple-300 shadow-2xs hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color} shadow-xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#301444] group-hover:text-purple-950 transition-colors">
                  {act.title}
                </p>
                <p className="text-xs text-gray-500 font-medium truncate">{act.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
