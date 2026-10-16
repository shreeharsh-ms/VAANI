import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  Phone,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatTime, formatCurrency } from '../../utils/formatters';

const SEED_APPOINTMENTS = [
  {
    id: 'apt_1',
    appointment_date: '2026-10-16',
    start_time: '10:00',
    end_time: '10:45',
    patient_name: 'Aarav Sachin Shinde',
    patient_phone: '+91 98220 11223',
    patient_uhid: 'VN-26-0001',
    service_name: 'Pediatric Speech-Language Diagnostic Evaluation',
    service_line: 'SPEECH_LANGUAGE',
    status: 'CONFIRMED',
    fee_paise: 150000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_2',
    appointment_date: '2026-10-16',
    start_time: '11:00',
    end_time: '11:45',
    patient_name: 'Sunita Dattatray More',
    patient_phone: '+91 94220 44556',
    patient_uhid: 'VN-26-0002',
    service_name: 'Pure Tone Audiometry (PTA) + Tympanometry',
    service_line: 'AUDIOLOGY',
    status: 'CHECKED_IN',
    fee_paise: 120000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_3',
    appointment_date: '2026-10-16',
    start_time: '16:00',
    end_time: '16:45',
    patient_name: 'Vijay Narayan Kadam',
    patient_phone: '+91 98901 77889',
    patient_uhid: 'VN-26-0003',
    service_name: 'Hearing Aid Trial & Fitting Fine-Tuning',
    service_line: 'AUDIOLOGY',
    status: 'CONFIRMED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_4',
    appointment_date: '2026-10-17',
    start_time: '10:30',
    end_time: '11:15',
    patient_name: 'Ananya Rahul Patil',
    patient_phone: '+91 97654 33221',
    patient_uhid: 'VN-26-0004',
    service_name: 'Fluency Disorder (Stuttering) Therapy Session 4',
    service_line: 'SPEECH_LANGUAGE',
    status: 'CONFIRMED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_5',
    appointment_date: '2026-10-17',
    start_time: '11:30',
    end_time: '12:15',
    patient_name: 'Ramesh Balasaheb Deshmukh',
    patient_phone: '+91 94231 66778',
    patient_uhid: 'VN-26-0005',
    service_name: 'Tinnitus Cognitive Behavioral Counseling (CBT)',
    service_line: 'CBT_PSYCHOLOGY',
    status: 'PENDING',
    fee_paise: 200000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_6',
    appointment_date: '2026-10-15',
    start_time: '17:00',
    end_time: '17:30',
    patient_name: 'Kavita Suresh Bhosale',
    patient_phone: '+91 98233 44112',
    patient_uhid: 'VN-26-0006',
    service_name: 'Voice Therapy & Acoustic Vocal Warmup',
    service_line: 'VOICE',
    status: 'COMPLETED',
    fee_paise: 150000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_7',
    appointment_date: '2026-10-15',
    start_time: '18:00',
    end_time: '18:30',
    patient_name: 'Dhananjay Ramchandra Jadhav',
    patient_phone: '+91 98902 55667',
    patient_uhid: 'VN-26-0007',
    service_name: 'Newborn Infant OAE Screening Bilateral',
    service_line: 'AUDIOLOGY',
    status: 'COMPLETED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
  {
    id: 'apt_8',
    appointment_date: '2026-10-14',
    start_time: '11:00',
    end_time: '11:30',
    patient_name: 'Sanjay Govind Pawar',
    patient_phone: '+91 98224 33221',
    patient_uhid: 'VN-26-0009',
    service_name: 'Diagnostic Pure Tone Audiometry (PTA)',
    service_line: 'AUDIOLOGY',
    status: 'NO_SHOW',
    fee_paise: 80000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
  },
];

export const AppointmentsPage = () => {
  const { notify } = useNotification();
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_appointments_v1');
      return saved ? JSON.parse(saved) : SEED_APPOINTMENTS;
    } catch {
      return SEED_APPOINTMENTS;
    }
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Sorting
  const [sortField, setSortField] = useState('appointment_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + N -> Schedule Consultation
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      // Alt + E -> Export CSV
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleExportCSV();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appointments]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
    localStorage.setItem('vaani_appointments_v1', JSON.stringify(updated));
    notify.success(`Status updated to ${newStatus}`);
  };

  // Filter Logic
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.patient_name.toLowerCase().includes(q) ||
        a.patient_uhid?.toLowerCase().includes(q) ||
        a.patient_phone.includes(q) ||
        a.service_name.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesService = serviceFilter === 'ALL' || a.service_line === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, search, statusFilter, serviceFilter]);

  // Sort Logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination Slice
  const totalEntries = sorted.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Start Time', 'End Time', 'UHID', 'Patient Name', 'Phone', 'Service Name', 'Service Line', 'Status', 'Fee (₹)', 'Payment Status', 'Clinician'];
    const rows = sorted.map(a => [
      a.appointment_date,
      a.start_time,
      a.end_time,
      a.patient_uhid || '-',
      `"${a.patient_name}"`,
      a.patient_phone,
      `"${a.service_name}"`,
      a.service_line,
      a.status,
      (a.fee_paise || 0) / 100,
      a.payment_status,
      `"${a.clinician || 'Dr. Palak Gandhi'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_Appointments_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Appointments register exported to CSV successfully!');
  };

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION BAR (COMPACT EXCEL DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <CalendarCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Appointment Scheduling &amp; Consultation Roster</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Scheduled:</span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-mono">
              {appointments.length} Slots
            </span>

            <span className="text-xs font-semibold text-slate-500">In Queue:</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
              {appointments.filter(a => a.status === 'CHECKED_IN').length} Arrived
            </span>
          </div>
        </div>

        {/* Right: Actions with Shortcut Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Export appointments to CSV (Alt + E)"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
            <kbd className="text-[10px] text-slate-400 font-mono hidden sm:inline">[Alt+E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Schedule consultation slot (Alt + N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Slot</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Multi-field search */}
          <div className="relative flex items-center flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name, UHID, phone, or service..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-7 w-full pl-7 pr-6 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-800 placeholder-slate-400 font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In (Waiting)</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending Triage</option>
            <option value="NO_SHOW">No Show</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Service Line Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
          >
            <option value="ALL">All Clinical Categories</option>
            <option value="SPEECH_LANGUAGE">Speech-Language</option>
            <option value="AUDIOLOGY">Audiology</option>
            <option value="VOICE">Voice Therapy</option>
            <option value="CBT_PSYCHOLOGY">CBT Counseling</option>
          </select>
        </div>

        {/* Rows selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="text-[11px] font-medium">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-6 px-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* ── EXCEL-STYLE COMPACT DATA GRID TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('appointment_date')}
                  className="py-2 px-3 w-32 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Date &amp; Slot</span>
                    {sortField === 'appointment_date' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patient_name')}
                  className="py-2 px-3 w-48 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Patient Name &amp; UHID</span>
                    {sortField === 'patient_name' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-3">Service Description</th>
                <th className="py-2 px-2.5 w-28 text-center">Category</th>
                <th className="py-2 px-2.5 w-28 text-center">Status</th>
                <th
                  onClick={() => handleSort('fee_paise')}
                  className="py-2 px-3 w-24 text-right cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Fee (₹)</span>
                    {sortField === 'fee_paise' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-3 w-40 text-center">Quick Lifecycle Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                paginated.map((apt) => (
                  <tr key={apt.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3">
                      <span className="font-mono font-bold text-slate-900 block">{apt.appointment_date}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{apt.start_time} - {apt.end_time}</span>
                    </td>
                    <td className="py-1.5 px-3">
                      <span className="font-bold text-slate-800 block truncate">{apt.patient_name}</span>
                      <span className="text-[10px] text-purple-900 font-mono font-semibold">{apt.patient_uhid || 'VN-26-0001'} • {apt.patient_phone}</span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-700 truncate max-w-xs">
                      {apt.service_name}
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        apt.service_line === 'SPEECH_LANGUAGE'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : apt.service_line === 'AUDIOLOGY'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : apt.service_line === 'VOICE'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {apt.service_line === 'SPEECH_LANGUAGE' ? 'Speech' : apt.service_line === 'AUDIOLOGY' ? 'Audiology' : apt.service_line === 'VOICE' ? 'Voice' : 'CBT'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : apt.status === 'CHECKED_IN'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                          : apt.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : apt.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {apt.status === 'CHECKED_IN' ? 'In Queue' : apt.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{((apt.fee_paise || 0) / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-1.5 px-3 text-center">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                        className="h-6 px-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CHECKED_IN">Check In (Token)</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="NO_SHOW">No Show</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION FOOTER ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> appointment entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-semibold"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                  page === pageNum
                    ? 'bg-[#301444] text-white shadow-2xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: SCHEDULE CONSULTATION ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Clinical Consultation Slot"
        size="md"
      >
        <AppointmentForm
          onSuccess={() => {
            setIsModalOpen(false);
            notify.success('Appointment scheduled successfully!');
          }}
        />
      </Modal>

    </div>
  );
};

export default AppointmentsPage;
