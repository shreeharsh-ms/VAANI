import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Clock, Phone, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/feedback/EmptyState';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatTime, formatCurrency } from '../../utils/formatters';

export const AppointmentsPage = () => {
  const { notify } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
    } catch {
      notify.error('Failed to load appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      notify.success(`Status updated to ${newStatus}`);
      fetchAppointments();
    } catch {
      notify.error('Could not update status');
    }
  };

  const filtered =
    statusFilter === 'ALL'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const getStatusVariant = (s) => {
    if (s === 'CONFIRMED') return 'primary';
    if (s === 'COMPLETED') return 'success';
    if (s === 'CANCELLED') return 'danger';
    return 'warning';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointment Scheduling"
        subtitle="Manage calendar slots, therapy session bookings, and patient consults."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Consultation</span>
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-[#301444] text-white shadow-xs'
                : 'bg-white hover:bg-purple-50 text-[#301444] border border-purple-200/90 shadow-2xs'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf6fc] border-b border-purple-100/80 text-[11px] font-bold text-[#301444] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date & Slot</th>
                  <th className="px-5 py-3.5">Patient Details</th>
                  <th className="px-5 py-3.5">Service Requested</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Consultation Fee</th>
                  <th className="px-5 py-3.5 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8">
                      <EmptyState
                        title="No appointments found"
                        description="There are no appointments matching this status filter."
                        actionLabel="Schedule Appointment"
                        onAction={() => setIsModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-purple-50/40 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-[#301444]">
                          <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <div className="text-xs text-purple-700 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-500" />
                          <span>{formatTime(apt.appointment_time)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-[#301444] block">
                          {apt.patient_name}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-purple-400" />
                          {apt.patient_phone}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-xs text-[#301444] block">
                          {apt.service_name}
                        </span>
                        <span className="text-[11px] text-purple-600 font-medium">
                          Clinician: {apt.clinician_name}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(apt.status)}>
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-extrabold text-[#301444]">
                        {formatCurrency(apt.fee_paise, true)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                          className="text-xs font-bold rounded-full border border-purple-200 bg-white px-3 py-1 text-[#301444] focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs cursor-pointer"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="PENDING">PENDING</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Schedule Session */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Clinical Consultation"
        size="md"
      >
        <AppointmentForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchAppointments();
          }}
        />
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
