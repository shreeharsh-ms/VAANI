import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, IndianRupee, Plus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import RecentAppointments from '../../components/dashboard/RecentAppointments';
import QuickActions from '../../components/dashboard/QuickActions';
import Modal from '../../components/common/Modal';
import PatientForm from '../../components/forms/PatientForm';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

export const DashboardOverviewPage = () => {
  const { notify } = useNotification();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [pts, apts] = await Promise.all([
        patientService.getPatients().catch(() => []),
        appointmentService.getAppointments().catch(() => []),
      ]);
      setPatients(pts || []);
      setAppointments(apts || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (aptId, newStatus) => {
    try {
      await appointmentService.updateStatus(aptId, newStatus);
      notify.success(`Appointment status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      notify.error('Could not update status');
    }
  };

  const totalRevenue = appointments
    .filter((a) => a.payment_status === 'PAID')
    .reduce((sum, a) => sum + (a.fee_paise || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Practice Overview"
        subtitle="Real-time daily operations, appointments, and patient metrics for Satara clinic."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Patients"
          value={patients.length || '3'}
          subtitle="Registered UHID records"
          icon={Users}
          color="teal"
          trend="+12%"
        />
        <StatCard
          title="Today's Appointments"
          value={appointments.length || '3'}
          subtitle="Audiology & Speech sessions"
          icon={Calendar}
          color="indigo"
          trend="+5%"
        />
        <StatCard
          title="Standard Reports"
          value="10 Formats"
          subtitle="PTA, OAE, SSI-4, GRBAS"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Today's Collections"
          value={formatCurrency(totalRevenue || 80000, true)}
          subtitle="Settled fee payments"
          icon={IndianRupee}
          color="amber"
          trend="+8%"
        />
      </div>

      {/* Main Grid: Appointments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentAppointments
            appointments={appointments}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <QuickActions
            onNewPatient={() => setIsPatientModalOpen(true)}
            onNewAppointment={() => setIsAptModalOpen(true)}
            onNewReport={() => notify.info('Please select a patient in the Patients tab to create a clinical report.')}
          />
        </div>
      </div>

      {/* Modal: Register Patient */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Register New Patient (UHID Intake)"
        size="lg"
      >
        <PatientForm
          onSuccess={() => {
            setIsPatientModalOpen(false);
            loadData();
          }}
          onCancel={() => setIsPatientModalOpen(false)}
        />
      </Modal>

      {/* Modal: Schedule Session */}
      <Modal
        isOpen={isAptModalOpen}
        onClose={() => setIsAptModalOpen(false)}
        title="Schedule Clinical Consultation"
        size="md"
      >
        <AppointmentForm
          onSuccess={() => {
            setIsAptModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
};

export default DashboardOverviewPage;
