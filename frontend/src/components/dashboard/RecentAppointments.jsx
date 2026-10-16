import React from 'react';
import { Clock, Calendar, Check, X, Phone } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../common/Card';
import Badge from '../common/Badge';
import { formatTime, formatCurrency } from '../../utils/formatters';

export const RecentAppointments = ({ appointments = [], onStatusUpdate }) => {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      case 'PENDING':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Today's Clinical Schedule</CardTitle>
        <span className="text-xs text-gray-400">
          {appointments.length} appointments today
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Clinical Service</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Fee</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">
                    No appointments scheduled for today.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{formatTime(apt.appointment_time)}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {apt.duration_minutes} mins
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {apt.patient_name}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{apt.patient_phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs block">
                        {apt.service_name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Clinician: {apt.clinician_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge variant={getBadgeVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {formatCurrency(apt.fee_paise, true)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onStatusUpdate && onStatusUpdate(apt.id, 'COMPLETED')}
                            title="Mark Completed"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status !== 'CANCELLED' && (
                          <button
                            onClick={() => onStatusUpdate && onStatusUpdate(apt.id, 'CANCELLED')}
                            title="Cancel Appointment"
                            className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
