import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Activity,
  IndianRupee,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  QrCode,
  FileText,
  RotateCcw,
  Box,
  Search,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import PatientForm from '../../components/forms/PatientForm';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_TODAY_APPOINTMENTS = [
  {
    id: 'apt_today_1',
    token: '01',
    time: '10:00 AM',
    uhid: 'VN-26-0001',
    patientName: 'Aarav Sachin Shinde',
    phone: '+91 98220 11223',
    service: 'Pediatric Speech-Language Diagnostic Evaluation',
    status: 'IN_SESSION',
    fee: 1500,
  },
  {
    id: 'apt_today_2',
    token: '02',
    time: '11:00 AM',
    uhid: 'VN-26-0002',
    patientName: 'Sunita Dattatray More',
    phone: '+91 94220 44556',
    service: 'Pure Tone Audiometry (PTA) + Tympanometry',
    status: 'CHECKED_IN',
    fee: 1200,
  },
  {
    id: 'apt_today_3',
    token: '03',
    time: '16:00 PM',
    uhid: 'VN-26-0003',
    patientName: 'Vijay Narayan Kadam',
    phone: '+91 98901 77889',
    service: 'Hearing Aid Trial & Fitting Fine-Tuning',
    status: 'CONFIRMED',
    fee: 800,
  },
  {
    id: 'apt_today_4',
    token: '04',
    time: '17:00 PM',
    uhid: 'VN-26-0006',
    patientName: 'Kavita Suresh Bhosale',
    phone: '+91 98233 44112',
    service: 'Voice Therapy & Acoustic Vocal Warmup',
    status: 'CONFIRMED',
    fee: 1500,
  },
];

export const DashboardOverviewPage = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState(DEFAULT_TODAY_APPOINTMENTS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsPatientModalOpen(true);
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAptModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
    notify.success(`Queue status updated to ${newStatus}`);
  };

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION BAR (COMPACT EXCEL DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Practice Verification & Shift Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RCI CRR No. A79214 • Active Clinical Practice</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Shift:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-mono">
              Morning: 10:00 - 13:30 | Evening: 15:30 - 20:00
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons with Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Register new patient (Alt + N)"
          >
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>New Patient</span>
            <kbd className="text-[10px] text-slate-400 font-mono hidden sm:inline">[Alt+N]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsAptModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Schedule consultation slot (Alt + A)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Slot</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+A]</kbd>
          </button>
        </div>
      </div>

      {/* ── 4-COLUMN COMPACT KPI STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today&apos;s Schedule</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold font-mono text-slate-900">{appointments.length}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded">1 In Session</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-purple-50 text-purple-700">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Waiting Queue</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold font-mono text-indigo-900">
                {appointments.filter(a => a.status === 'CHECKED_IN').length}
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold">Token 02 Calling</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-indigo-50 text-indigo-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Registered MPI</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold font-mono text-slate-900">8</span>
              <span className="text-[10px] text-slate-500 font-medium">UHID Database</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-slate-100 text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today&apos;s Fees</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold font-mono text-emerald-800">₹5,000</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded">100% Settled</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-emerald-50 text-emerald-700">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID: LIVE QUEUE TABLE + QUICK MODULE PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* Left Col (8 cols): Live Queue & Consultations Table */}
        <div className="lg:col-span-8 space-y-2.5">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                  Today&apos;s Live Patient Queue &amp; Consultations
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  Live Queue
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/appointments')}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-12 text-center text-slate-400">Token</th>
                    <th className="py-2 px-2.5 w-24">Slot</th>
                    <th className="py-2 px-3 w-44">Patient &amp; UHID</th>
                    <th className="py-2 px-3">Clinical Assessment</th>
                    <th className="py-2 px-2.5 w-24 text-center">Queue Status</th>
                    <th className="py-2 px-3 w-36 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-2 px-2.5 text-center font-mono font-bold text-purple-900 bg-purple-50/40">
                        {apt.token}
                      </td>
                      <td className="py-2 px-2.5 font-mono font-semibold text-slate-700">
                        {apt.time}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-slate-800 block truncate">{apt.patientName}</span>
                        <span className="text-[10px] font-mono text-purple-900 font-semibold">{apt.uhid}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-700 truncate max-w-xs">
                        {apt.service}
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          apt.status === 'IN_SESSION'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
                            : apt.status === 'CHECKED_IN'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {apt.status === 'IN_SESSION' ? 'In Session' : apt.status === 'CHECKED_IN' ? 'In Waiting Room' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {apt.status === 'CHECKED_IN' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, 'IN_SESSION')}
                            className="h-6 px-2.5 rounded bg-[#301444] text-white hover:bg-[#200b30] text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            Call Patient In
                          </button>
                        ) : apt.status === 'IN_SESSION' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                            className="h-6 px-2.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-bold shadow-2xs cursor-pointer"
                          >
                            Complete Visit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, 'CHECKED_IN')}
                            className="h-6 px-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-semibold border border-slate-300 cursor-pointer"
                          >
                            Mark Arrived
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Quick Module Jump Panels */}
        <div className="lg:col-span-4 space-y-2.5">
          {/* Quick Action Navigator */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Clinical Workflow Shortcuts
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/dashboard/reports?test=pta')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-800 block">PTA Audiogram</span>
                <span className="text-[10px] text-slate-500">Audio Evaluation</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/reports?test=speech')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group"
              >
                <Activity className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-800 block">Speech Proforma</span>
                <span className="text-[10px] text-slate-500">Language Battery</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/billing')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group"
              >
                <IndianRupee className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-800 block">GST Invoicing</span>
                <span className="text-[10px] text-slate-500">Dynamic UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/inventory')}
                className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group"
              >
                <Box className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-800 block">Hearing Aids</span>
                <span className="text-[10px] text-slate-500">Serial Register</span>
              </button>
            </div>
          </div>

          {/* Urgent Clinical Recalls Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Clinical Recalls Due
              </span>
              <button
                type="button"
                onClick={() => navigate('/dashboard/recalls')}
                className="text-[11px] font-bold text-purple-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded border border-rose-100 bg-rose-50/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-rose-900 block">Sunita Dattatray More</span>
                  <span className="text-[10px] text-rose-700">Oticon Trial Follow-up &amp; Tuning</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-800">Due Today</span>
              </div>

              <div className="p-2 rounded border border-amber-100 bg-amber-50/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">Aarav Sachin Shinde</span>
                  <span className="text-[10px] text-amber-700">3-Month Speech Milestone Review</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800">In 4 Days</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Register New Patient (Intake)"
        size="lg"
      >
        <PatientForm
          onSuccess={() => {
            setIsPatientModalOpen(false);
            notify.success('Patient registered successfully!');
          }}
          onCancel={() => setIsPatientModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAptModalOpen}
        onClose={() => setIsAptModalOpen(false)}
        title="Schedule Clinical Consultation"
        size="md"
      >
        <AppointmentForm
          onSuccess={() => {
            setIsAptModalOpen(false);
            notify.success('Appointment scheduled successfully!');
          }}
        />
      </Modal>

    </div>
  );
};

export default DashboardOverviewPage;
