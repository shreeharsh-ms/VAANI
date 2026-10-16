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
          <Button
            variant="primary"
            size="md"
            startIcon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Schedule Consultation
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === status
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-teal-500'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date & Slot</th>
                  <th className="px-5 py-3.5">Patient Details</th>
                  <th className="px-5 py-3.5">Service Requested</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Consultation Fee</th>
                  <th className="px-5 py-3.5 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
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
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                          <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(apt.appointment_time)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {apt.patient_name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {apt.patient_phone}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-xs text-gray-800 dark:text-gray-200 block">
                          {apt.service_name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {apt.reason || 'Routine consultation'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(apt.status)}>
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {formatCurrency(apt.fee_paise, true)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                          className="text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-gray-800 dark:text-gray-200"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="NO_SHOW">NO_SHOW</option>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Appointment Slot"
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
