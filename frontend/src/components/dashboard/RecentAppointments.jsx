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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-100/80 bg-purple-50/40 px-6 py-4.5">
        <div>
          <CardTitle className="text-lg font-bold text-[#301444]">
            Today's Clinical Schedule
          </CardTitle>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Real-time daily patient consultations</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#301444] border border-purple-200/90 shadow-2xs self-start sm:self-auto">
          {appointments.length} appointments today
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#faf6fc] border-b border-purple-100/80 text-[11px] font-bold text-[#301444] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Clinical Service</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Fee</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50/80">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-400 font-medium">
                    No appointments scheduled for today.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-purple-50/40 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-[#301444]">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{formatTime(apt.appointment_time)}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {apt.duration_minutes} mins
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#301444]">
                        {apt.patient_name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-purple-500" />
                        <span>{apt.patient_phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[#301444] font-semibold text-xs block">
                        {apt.service_name}
                      </span>
                      <span className="text-[11px] text-purple-700/80 font-medium">
                        Clinician: {apt.clinician_name}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge variant={getBadgeVariant(apt.status)}>
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-extrabold text-[#301444]">
                      {formatCurrency(apt.fee_paise, true)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status !== 'COMPLETED' && (
                          <button
                            onClick={() => onStatusUpdate && onStatusUpdate(apt.id, 'COMPLETED')}
                            title="Mark Completed"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200/80 transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status !== 'CANCELLED' && (
                          <button
                            onClick={() => onStatusUpdate && onStatusUpdate(apt.id, 'CANCELLED')}
                            title="Cancel Appointment"
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
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
