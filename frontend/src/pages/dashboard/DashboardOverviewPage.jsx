import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import PatientForm from '../../components/forms/PatientForm';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';
import { isKey, isAlt } from '../../utils/keyboard';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { useTableKeyboardNav } from '../../hooks';

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
  const [patientsCount, setPatientsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [rawAppointments, setRawAppointments] = useState([]);
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);

  // Synchronize dynamic clinic data from LocalStorage
  const loadDashboardData = () => {
    try {
      // 1. Registered Patients MPI Count
      const savedPatients = localStorage.getItem('vaani_patients_v1');
      if (savedPatients !== null) {
        const parsed = JSON.parse(savedPatients);
        setPatientsCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setPatientsCount(0);
      }

      // 2. Appointments & Consultations
      const savedApts = localStorage.getItem('vaani_appointments_v1');
      if (savedApts !== null) {
        const parsed = JSON.parse(savedApts);
        if (Array.isArray(parsed)) {
          setRawAppointments(parsed);
        } else {
          setRawAppointments([]);
        }
      } else {
        setRawAppointments([]);
      }

      // 3. Clinical Recalls Due
      const savedRecalls = localStorage.getItem('vaani_recalls_v1');
      if (savedRecalls !== null) {
        const parsed = JSON.parse(savedRecalls);
        if (Array.isArray(parsed)) {
          const mapped = parsed.map((r) => ({
            id: r.id,
            patientName: r.patientName,
            reason: `${r.deviceModel || r.category || 'Recall'} Follow-up`,
            dueText: r.dueDate || 'Pending',
            urgency: r.priority || 'MEDIUM',
          }));
          setRecalls(mapped);
        } else {
          setRecalls([]);
        }
      } else {
        setRecalls([]);
      }
    } catch (e) {
      console.warn('Dashboard data sync error:', e);
    }
  };

  useEffect(() => {
    loadDashboardData();

    window.addEventListener('vaani-appointments-updated', loadDashboardData);
    window.addEventListener('vaani-clinic-data-purged', loadDashboardData);
    window.addEventListener('storage', loadDashboardData);
    window.addEventListener('focus', loadDashboardData);
    return () => {
      window.removeEventListener('vaani-appointments-updated', loadDashboardData);
      window.removeEventListener('vaani-clinic-data-purged', loadDashboardData);
      window.removeEventListener('storage', loadDashboardData);
      window.removeEventListener('focus', loadDashboardData);
    };
  }, []);

  // Today's appointments (active consultations for today's date)
  const todayAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return rawAppointments
      .filter((a) => {
        const aDate = (a.appointment_date || '').split('T')[0];
        // Match today, or if no date set and not cancelled
        const isToday = aDate === todayStr || (!a.appointment_date && rawAppointments.length <= 4);
        return isToday && a.status !== 'CANCELLED';
      })
      .map((a, idx) => ({
        id: a.id || `apt_${idx}`,
        token: String(idx + 1).padStart(2, '0'),
        time: a.start_time || '10:00 AM',
        uhid: a.patient_uhid || a.uhid || '-',
        patientName: a.patient_name || a.patientName || 'Walk-in Patient',
        phone: a.patient_phone || a.phone || '-',
        service: a.service_name || a.service || 'Consultation',
        status: a.status || 'SCHEDULED',
        fee: a.fee_paise ? a.fee_paise / 100 : a.fee || 1000,
        source: a.source || 'INTERNAL',
      }));
  }, [rawAppointments]);

  // Pending online booking requests needing clinician review / approval
  const pendingAppointments = useMemo(() => {
    return rawAppointments.filter((a) => a.status === 'PENDING');
  }, [rawAppointments]);

  // Compute Today's Revenue dynamically
  const todayFeesTotal = useMemo(() => {
    try {
      const sum = todayAppointments
        .filter((a) => a.status === 'COMPLETED' || a.status === 'IN_SESSION' || a.status === 'CHECKED_IN' || a.status === 'CONFIRMED')
        .reduce((acc, a) => acc + (Number(a.fee) || 0), 0);
      return sum;
    } catch {
      return 0;
    }
  }, [todayAppointments]);

  // Keyboard table navigation for Today's Consultation Queue
  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: todayAppointments,
    page: 1,
    totalPages: 1,
    tableId: 'overview-queue-table',
  });

  // Universal keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        setIsPatientModalOpen(true);
      }
      if (isAlt(e) && isKey(e, 'a')) {
        e.preventDefault();
        setIsAptModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await appointmentService.updateStatus(id, newStatus);
    notify.success(`Queue status updated to ${newStatus}`);
    loadDashboardData();
  };

  const handleApproveAppointment = async (id) => {
    await appointmentService.updateStatus(id, 'CONFIRMED');
    notify.success('Appointment approved! Slot has been locked and confirmed.');
    loadDashboardData();
  };

  const handleDenyAppointment = async (id) => {
    await appointmentService.updateStatus(id, 'CANCELLED');
    notify.info('Appointment request denied. Slot has been released.');
    loadDashboardData();
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
            title="Register new patient (Alt + N / ⌥N)"
          >
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>New Patient</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+N / ⌥N]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsAptModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Schedule consultation slot (Alt + A / ⌥A)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Slot</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+A / ⌥A]</kbd>
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
              <span className="text-lg font-bold font-mono text-slate-900">{todayAppointments.length}</span>
              <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${
                todayAppointments.filter(a => a.status === 'IN_SESSION').length > 0
                  ? 'bg-emerald-50 text-emerald-700 animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {todayAppointments.filter(a => a.status === 'IN_SESSION').length > 0
                  ? `${todayAppointments.filter(a => a.status === 'IN_SESSION').length} In Session`
                  : '0 In Session'}
              </span>
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
                {todayAppointments.filter(a => a.status === 'CHECKED_IN').length}
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold">
                {todayAppointments.filter(a => a.status === 'CHECKED_IN').length > 0
                  ? `Token ${todayAppointments.find(a => a.status === 'CHECKED_IN')?.token || '01'} Calling`
                  : 'Queue Clear'}
              </span>
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
              <span className="text-lg font-bold font-mono text-slate-900">{patientsCount}</span>
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
              <span className="text-lg font-bold font-mono text-emerald-800">
                ₹{todayFeesTotal.toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] font-bold px-1 py-0.2 rounded ${
                todayFeesTotal > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {todayFeesTotal > 0 ? '100% Settled' : 'Zero Balance'}
              </span>
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
          
          {/* ── PENDING ONLINE BOOKING REQUESTS CARD (IF ANY) ── */}
          {pendingAppointments.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                    Online Booking Requests Awaiting Clinical Approval ({pendingAppointments.length})
                  </span>
                </div>
                <span className="text-[10px] font-medium text-amber-700">
                  Approve to lock slot &amp; confirm; Deny to release slot
                </span>
              </div>

              <div className="space-y-2">
                {pendingAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white border border-amber-200 rounded-md p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs font-bold text-slate-900">{apt.patient_name || apt.patientName}</strong>
                        <span className="text-[10px] font-mono text-purple-700 font-semibold">{apt.patient_phone || apt.phone}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {apt.source === 'ONLINE_PORTAL' ? 'Website Booking' : 'Pending Request'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                        <span>🗓 <strong className="font-mono text-slate-800">{apt.appointment_date}</strong></span>
                        <span>⏰ <strong className="font-mono text-purple-900">{apt.start_time}</strong></span>
                        <span>🩺 {apt.service_name || apt.service}</span>
                        <span>💰 ₹{((apt.fee_paise ? apt.fee_paise / 100 : apt.fee) || 0).toLocaleString('en-IN')}</span>
                      </div>
                      {apt.notes && (
                        <p className="text-[10px] text-slate-500 italic">“{apt.notes}”</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <a
                        href={`https://wa.me/${(apt.patient_phone || apt.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste ${apt.patient_name || apt.patientName}, this is Vaani Speech & Hearing Clinic regarding your appointment request for ${apt.appointment_date} at ${apt.start_time}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-6 px-2 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDenyAppointment(apt.id)}
                        className="h-6 px-2 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Decline request and release slot"
                      >
                        <X className="w-3 h-3" />
                        <span>Deny</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveAppointment(apt.id)}
                        className="h-6 px-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Approve booking and lock slot"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve Slot</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <table {...tableContainerProps} className="w-full text-xs text-left border-collapse">
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
                  {todayAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <Calendar className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-xs">No active consultations scheduled for today</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Use &quot;Schedule Slot&quot; to book a new appointment or register a walk-in patient</p>
                      </td>
                    </tr>
                  ) : (
                    todayAppointments.map((apt, idx) => {
                      const rowProps = getRowProps(idx);
                      return (
                        <tr key={apt.id} {...rowProps}>
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
                              apt.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                                : apt.status === 'IN_SESSION'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
                                : apt.status === 'CHECKED_IN'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {apt.status === 'PENDING' ? 'Pending Approval' : apt.status === 'IN_SESSION' ? 'In Session' : apt.status === 'CHECKED_IN' ? 'In Waiting Room' : 'Scheduled'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {apt.status === 'PENDING' ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleApproveAppointment(apt.id)}
                                  {...getButtonProps(idx, 0)}
                                  className={`h-6 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-2xs cursor-pointer ${getButtonProps(idx, 0).className}`}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDenyAppointment(apt.id)}
                                  {...getButtonProps(idx, 1)}
                                  className={`h-6 px-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[10px] font-bold cursor-pointer ${getButtonProps(idx, 1).className}`}
                                >
                                  Deny
                                </button>
                              </div>
                            ) : apt.status === 'CHECKED_IN' ? (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(apt.id, 'IN_SESSION')}
                                {...getButtonProps(idx, 0)}
                                className={`h-6 px-2.5 rounded bg-[#301444] text-white hover:bg-[#200b30] text-[10px] font-bold shadow-2xs cursor-pointer ${getButtonProps(idx, 0).className}`}
                              >
                                Call Patient In
                              </button>
                            ) : apt.status === 'IN_SESSION' ? (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                                {...getButtonProps(idx, 0)}
                                className={`h-6 px-2.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-bold shadow-2xs cursor-pointer ${getButtonProps(idx, 0).className}`}
                              >
                                Complete Visit
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(apt.id, 'CHECKED_IN')}
                                {...getButtonProps(idx, 0)}
                                className={`h-6 px-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-semibold border border-slate-300 cursor-pointer ${getButtonProps(idx, 0).className}`}
                              >
                                Mark Arrived
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Quick Module Jump Panels */}
        <div className="lg:col-span-4 space-y-2.5">
          {/* Quick Action Navigator */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                Clinical Services &amp; Reports
              </span>
              <button
                type="button"
                onClick={() => navigate('/dashboard/reports')}
                className="text-[10px] font-bold text-purple-700 hover:underline"
              >
                All 10 Proformas →
              </button>
            </div>

            {/* List of Master Clinical Services from Specification */}
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {CLINICAL_SERVICES.map((srv) => (
                <div
                  key={srv.code}
                  className="p-2 rounded border border-slate-200 bg-slate-50/70 hover:bg-purple-50/50 hover:border-purple-300 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                        {srv.code}
                      </span>
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {srv.shortName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {srv.discipline} • {srv.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/reports/create?type=${srv.code}`)}
                    className="shrink-0 px-2 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    title={`Create ${srv.shortName} report`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Report</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Operational Shortcuts */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/dashboard/billing')}
                className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group flex items-center gap-2"
              >
                <IndianRupee className="w-3.5 h-3.5 text-purple-700 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-bold text-[11px] text-slate-800 block truncate">GST Invoicing</span>
                  <span className="text-[9px] text-slate-500 block">Dynamic UPI QR</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/inventory')}
                className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-purple-50 text-left transition-colors cursor-pointer group flex items-center gap-2"
              >
                <Box className="w-3.5 h-3.5 text-purple-700 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-bold text-[11px] text-slate-800 block truncate">Hearing Aids</span>
                  <span className="text-[9px] text-slate-500 block">Serial Register</span>
                </div>
              </button>
            </div>
          </div>

          {/* Urgent Clinical Recalls Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Clinical Recalls Due ({recalls.length})
              </span>
              <button
                type="button"
                onClick={() => navigate('/dashboard/recalls')}
                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {recalls.length === 0 ? (
                <div className="p-3 text-center text-slate-400 bg-slate-50/60 rounded border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <p className="font-semibold text-slate-600 text-xs">No pending clinical recalls</p>
                  <p className="text-[10px] text-slate-400">All patient review schedules are up to date</p>
                </div>
              ) : (
                recalls.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-2 rounded border border-rose-100 bg-rose-50/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-rose-900 block">{r.patientName}</span>
                      <span className="text-[10px] text-rose-700">{r.reason}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-800">{r.dueText}</span>
                  </div>
                ))
              )}
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
          onSuccess={(newPatient, nextAction) => {
            setIsPatientModalOpen(false);
            if (nextAction !== 'EDH') {
              notify.success('Patient registered successfully!');
            }
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
          onCancel={() => setIsAptModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default DashboardOverviewPage;
