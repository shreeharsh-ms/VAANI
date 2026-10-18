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
  MessageSquare,
  Mail,
  Edit,
  RotateCcw,
  Trash2,
  Check,
  X,
  Share2,
  AlertTriangle,
  Send,
  CalendarDays,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import { WhatsAppDispatchModal, EmailDispatchModal } from '../../components/common';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { formatTime, formatCurrency, normalizeSlotTime, normalizeDate, getAppointmentSlotsCovered, CLINICAL_TIME_SLOTS } from '../../utils/formatters';
import { isKey, isAlt } from '../../utils/keyboard';
import { getAllAppointments, SEED_APPOINTMENTS } from '../../data/appointmentsData';
import { useTableKeyboardNav } from '../../hooks';

const ALL_SLOTS = CLINICAL_TIME_SLOTS;

export const AppointmentsPage = () => {
  const { notify } = useNotification();
  const [appointments, setAppointments] = useState(() => getAllAppointments());

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'CUSTOM'
  const [customDate, setCustomDate] = useState('');

  // Sorting
  const [sortField, setSortField] = useState('appointment_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);

  // Reschedule Form State
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newSlot: '',
    reason: '',
    notifyWhatsApp: true,
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_uhid: '',
    service_name: '',
    service_line: 'SPEECH_LANGUAGE',
    appointment_date: '',
    start_time: '',
    fee_inr: 1500,
    status: 'CONFIRMED',
    notes: '',
  });

  // Reload appointments from local storage
  const loadAppointments = () => {
    try {
      const saved = localStorage.getItem('vaani_appointments_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
          return;
        }
      }
      setAppointments(getAllAppointments());
    } catch {
      setAppointments(getAllAppointments());
    }
  };

  useEffect(() => {
    loadAppointments();

    window.addEventListener('vaani-appointments-updated', loadAppointments);
    window.addEventListener('vaani-clinic-data-purged', loadAppointments);
    window.addEventListener('storage', loadAppointments);
    window.addEventListener('focus', loadAppointments);
    return () => {
      window.removeEventListener('vaani-appointments-updated', loadAppointments);
      window.removeEventListener('vaani-clinic-data-purged', loadAppointments);
      window.removeEventListener('storage', loadAppointments);
      window.removeEventListener('focus', loadAppointments);
    };
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        setIsScheduleModalOpen(true);
      }
      if (isAlt(e) && isKey(e, 'e')) {
        e.preventDefault();
        handleExportCSV();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appointments]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Status Update Handler
  const handleStatusUpdate = async (id, newStatus) => {
    await appointmentService.updateStatus(id, newStatus);
    notify.success(`Status updated to ${newStatus}`);
    loadAppointments();
  };

  // Approve / Deny Handlers
  const handleApprove = async (id) => {
    await appointmentService.updateStatus(id, 'CONFIRMED');
    notify.success('Appointment approved! Slot has been locked and confirmed.');
    loadAppointments();
  };

  const handleDeny = async (id) => {
    await appointmentService.updateStatus(id, 'CANCELLED');
    notify.info('Appointment request denied. Slot has been released.');
    loadAppointments();
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the appointment for ${name}?`)) {
      await appointmentService.deleteAppointment(id);
      notify.success('Appointment deleted from roster.');
      loadAppointments();
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (apt) => {
    setEditingAppointment(apt);
    setEditFormData({
      patient_name: apt.patient_name || '',
      patient_phone: apt.patient_phone || '',
      patient_email: apt.patient_email || '',
      patient_uhid: apt.patient_uhid || '',
      service_name: apt.service_name || '',
      service_line: apt.service_line || 'SPEECH_LANGUAGE',
      appointment_date: (apt.appointment_date || '').split('T')[0],
      start_time: apt.start_time || '10:15 AM',
      fee_inr: (apt.fee_paise ? apt.fee_paise / 100 : apt.fee) || 1500,
      status: apt.status || 'CONFIRMED',
      notes: apt.notes || '',
    });
  };

  // Save Edit Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAppointment) return;

    await appointmentService.updateAppointment(editingAppointment.id, {
      patient_name: editFormData.patient_name.trim(),
      patient_phone: editFormData.patient_phone.trim(),
      patient_email: editFormData.patient_email.trim(),
      patient_uhid: editFormData.patient_uhid.trim(),
      service_name: editFormData.service_name.trim(),
      service_line: editFormData.service_line,
      appointment_date: editFormData.appointment_date,
      start_time: editFormData.start_time,
      fee_paise: Number(editFormData.fee_inr) * 100,
      status: editFormData.status,
      notes: editFormData.notes.trim(),
    });

    notify.success('Appointment details updated successfully!');
    setEditingAppointment(null);
    loadAppointments();
  };

  // Open Reschedule Modal
  const handleOpenReschedule = (apt) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const initialDate = apt.appointment_date || todayStr;
    setReschedulingAppointment(apt);
    setRescheduleData({
      newDate: initialDate,
      newSlot: apt.start_time || '10:15 AM',
      reason: 'Patient requested rescheduling',
      notifyWhatsApp: true,
    });
  };

  // Compute Booked Slots for the selected reschedule date
  const rescheduleBookedSlots = useMemo(() => {
    if (!rescheduleData.newDate) return [];
    const cleanNewDate = normalizeDate(rescheduleData.newDate);
    const booked = appointmentService.getBookedSlotsForDate(cleanNewDate);
    // Exclude currently rescheduling appointment's own slots if on the same date
    if (reschedulingAppointment && normalizeDate(reschedulingAppointment.appointment_date) === cleanNewDate) {
      const ownSlots = getAppointmentSlotsCovered(reschedulingAppointment);
      return booked.filter((s) => !ownSlots.includes(s));
    }
    return booked;
  }, [rescheduleData.newDate, reschedulingAppointment]);

  // Save Reschedule
  const handleConfirmReschedule = async (e) => {
    e.preventDefault();
    if (!reschedulingAppointment) return;

    if (!rescheduleData.newSlot) {
      notify.warning('Please select an available time slot.');
      return;
    }

    await appointmentService.updateAppointment(reschedulingAppointment.id, {
      appointment_date: rescheduleData.newDate,
      start_time: rescheduleData.newSlot,
      status: 'CONFIRMED',
      notes: reschedulingAppointment.notes
        ? `${reschedulingAppointment.notes} [Rescheduled to ${rescheduleData.newDate} ${rescheduleData.newSlot}: ${rescheduleData.reason}]`
        : `Rescheduled to ${rescheduleData.newDate} ${rescheduleData.newSlot}: ${rescheduleData.reason}`,
    });

    if (rescheduleData.notifyWhatsApp && reschedulingAppointment.patient_phone) {
      const phone = reschedulingAppointment.patient_phone.replace(/[^0-9]/g, '');
      const msg = `Namaste *${reschedulingAppointment.patient_name}*,
Your appointment at *Vaani Speech & Hearing Clinic* has been successfully rescheduled.

🗓 *New Date:* ${rescheduleData.newDate}
⏰ *New Time Slot:* ${rescheduleData.newSlot}
🩺 *Service:* ${reschedulingAppointment.service_name}
👩‍⚕️ *Clinician:* Ms. Palak Paresh Gandhi (MASLP, RCI CRR No. A79214)
📍 *Address:* Sadashiv Peth, Satara (Opp. Civil Hospital)
📞 *Contact:* +91 98220 12345

Kindly reply *CONFIRM* to acknowledge.`;

      navigator.clipboard?.writeText(msg).catch(() => {});
      if (phone) {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      }
      notify.success('Reschedule confirmed! WhatsApp update launched & copied.');
    } else {
      notify.success('Appointment rescheduled successfully!');
    }

    setReschedulingAppointment(null);
    loadAppointments();
  };

  // Communication preview modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedAptForWhatsApp, setSelectedAptForWhatsApp] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [selectedAptForMail, setSelectedAptForMail] = useState(null);

  // WhatsApp Reminder (Opens Reusable Preview Modal)
  const handleSendWhatsAppReminder = (apt) => {
    setSelectedAptForWhatsApp(apt);
    setIsWhatsAppModalOpen(true);
  };

  // Email Reminder (Opens Reusable Preview Modal)
  const handleSendEmailReminder = (apt) => {
    setSelectedAptForMail(apt);
    setIsMailModalOpen(true);
  };

  const getAppointmentWhatsAppMessage = (apt) => {
    if (!apt) return '';
    return `Namaste *${apt.patient_name}*,\n` +
      `This is a gentle clinical reminder for your upcoming appointment at *Vaani Speech & Hearing Clinic*.\n\n` +
      `🗓 *Date:* ${apt.appointment_date}\n` +
      `⏰ *Time Slot:* ${apt.start_time}\n` +
      `🩺 *Service:* ${apt.service_name}\n` +
      `👩‍⚕️ *Clinician:* ${apt.clinician || 'Ms. Palak Paresh Gandhi (MASLP, RCI CRR No. A79214)'}\n` +
      `📍 *Address:* Sadashiv Peth, Satara (Opp. Civil Hospital)\n` +
      `📞 *Helpdesk:* +91 98220 12345\n\n` +
      `Please arrive 10 minutes prior to your scheduled slot. Kindly reply *CONFIRM* to acknowledge.`;
  };

  // Filter Logic (Search, Status, Service, Date)
  const filtered = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return appointments.filter((a) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (a.patient_name || '').toLowerCase().includes(q) ||
        (a.patient_uhid || '').toLowerCase().includes(q) ||
        (a.patient_phone || '').includes(q) ||
        (a.service_name || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesService = serviceFilter === 'ALL' || a.service_line === serviceFilter;

      let matchesDate = true;
      const aDate = normalizeDate(a.appointment_date);

      if (dateFilter === 'TODAY') {
        matchesDate = aDate === todayStr;
      } else if (dateFilter === 'TOMORROW') {
        matchesDate = aDate === tomorrowStr;
      } else if (dateFilter === 'THIS_WEEK') {
        const aptTime = new Date(aDate).getTime();
        const nowTime = new Date().getTime();
        const diffDays = (aptTime - nowTime) / (1000 * 3600 * 24);
        matchesDate = diffDays >= -1 && diffDays <= 7;
      } else if (dateFilter === 'CUSTOM' && customDate) {
        matchesDate = aDate === normalizeDate(customDate);
      }

      return matchesSearch && matchesStatus && matchesService && matchesDate;
    });
  }, [appointments, search, statusFilter, serviceFilter, dateFilter, customDate]);

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

  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: paginated,
    page,
    totalPages,
    onPageChange: setPage,
    tableId: 'appointments-table',
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Start Time',
      'End Time',
      'UHID',
      'Patient Name',
      'Phone',
      'Service Name',
      'Service Line',
      'Status',
      'Fee (₹)',
      'Payment Status',
      'Clinician',
    ];
    const rows = sorted.map((a) => [
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

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_Appointments_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Appointments register exported to CSV successfully!');
  };

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const checkedInCount = appointments.filter((a) => a.status === 'CHECKED_IN').length;

  return (
    <div className="w-full space-y-2.5 font-sans">
      {/* ── TOP ACTION BAR ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <CalendarCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Appointment Scheduling &amp; Consultation Roster</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Scheduled:</span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-mono">
              {appointments.length} Slots
            </span>

            {pendingCount > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                {pendingCount} Pending Approval
              </span>
            )}

            <span className="text-xs font-semibold text-slate-500">In Queue:</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
              {checkedInCount} Arrived
            </span>
          </div>
        </div>

        {/* Right: Actions with Shortcut Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Export appointments to CSV (Alt + E / ⌥E)"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+E / ⌥E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Schedule consultation slot (Alt + N / ⌥N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Slot</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N / ⌥N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR WITH COMPREHENSIVE DATE FILTERS ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Multi-field search */}
          <div className="relative flex items-center flex-1 min-w-[240px] max-w-sm">
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

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <CalendarDays className="w-3 h-3 text-purple-700" /> Date:
            </span>
            <button
              type="button"
              onClick={() => {
                setDateFilter('ALL');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                dateFilter === 'ALL'
                  ? 'bg-[#301444] text-white border-[#301444]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => {
                setDateFilter('TODAY');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                dateFilter === 'TODAY'
                  ? 'bg-[#301444] text-white border-[#301444]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setDateFilter('TOMORROW');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                dateFilter === 'TOMORROW'
                  ? 'bg-[#301444] text-white border-[#301444]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                setDateFilter('THIS_WEEK');
                setPage(1);
              }}
              className={`px-2 py-0.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                dateFilter === 'THIS_WEEK'
                  ? 'bg-[#301444] text-white border-[#301444]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Next 7 Days
            </button>

            {/* Custom Date Input */}
            <div className="flex items-center gap-1 pl-1">
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDateFilter('CUSTOM');
                  setPage(1);
                }}
                className={`h-7 px-2 text-xs font-mono font-medium rounded border transition-colors ${
                  dateFilter === 'CUSTOM'
                    ? 'border-purple-600 bg-purple-50/50 text-purple-950 ring-1 ring-purple-600'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
                title="Select specific date to filter"
              />
              {dateFilter === 'CUSTOM' && customDate && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomDate('');
                    setDateFilter('ALL');
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs px-1"
                  title="Clear custom date"
                >
                  ×
                </button>
              )}
            </div>
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

        {/* Secondary Filter Row: Status & Clinical Category */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-6 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In (Waiting)</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
              <option value="CANCELLED">Cancelled / Denied</option>
            </select>
          </div>

          {/* Service Line Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Category:</span>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="h-6 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            >
              <option value="ALL">All Clinical Categories</option>
              <option value="SPEECH_LANGUAGE">Speech-Language</option>
              <option value="AUDIOLOGY">Audiology</option>
              <option value="VOICE">Voice Therapy</option>
              <option value="CBT_PSYCHOLOGY">CBT Counseling</option>
            </select>
          </div>

          {/* Quick Shortcut: Pending Approval Chip */}
          {pendingCount > 0 && statusFilter !== 'PENDING' && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('PENDING');
                setPage(1);
              }}
              className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3 text-amber-700" />
              <span>Show {pendingCount} Pending Approvals</span>
            </button>
          )}

          {/* Clear Filters Reset */}
          {(search || statusFilter !== 'ALL' || serviceFilter !== 'ALL' || dateFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setServiceFilter('ALL');
                setDateFilter('ALL');
                setCustomDate('');
                setPage(1);
              }}
              className="ml-auto text-xs text-purple-700 hover:text-purple-900 font-semibold underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── EXCEL-STYLE COMPACT DATA GRID TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" {...tableContainerProps}>
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('appointment_date')}
                  className="py-2 px-3 w-32 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Date &amp; Slot</span>
                    {sortField === 'appointment_date' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patient_name')}
                  className="py-2 px-3 w-48 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Patient Name &amp; UHID</span>
                    {sortField === 'patient_name' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-2 px-3">Service Description</th>
                <th className="py-2 px-2.5 w-24 text-center">Category</th>
                <th className="py-2 px-2.5 w-24 text-center">Status</th>
                <th
                  onClick={() => handleSort('fee')}
                  className="py-2 px-3 w-24 text-right cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Fee (₹)</span>
                    {sortField === 'fee' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-2 px-3 w-36 text-center">Approval &amp; Status</th>
                <th className="py-2 px-3 w-36 text-center">Actions &amp; Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No matching appointments found.
                  </td>
                </tr>
              ) : (
                paginated.map((apt, idx) => {
                  const rowProps = getRowProps(idx);
                  return (
                    <tr key={apt.id} {...rowProps}>
                      {/* Date & Slot */}
                      <td className="py-1.5 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{apt.appointment_date}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {apt.start_time} {apt.end_time ? `- ${apt.end_time}` : ''}
                        </span>
                      </td>

                      {/* Patient Name & UHID */}
                      <td className="py-1.5 px-3">
                        <span className="font-bold text-slate-800 block truncate">{apt.patient_name}</span>
                        <span className="text-[10px] text-purple-900 font-mono font-semibold">
                          {apt.patient_uhid || 'VN-26-0001'} • {apt.patient_phone}
                        </span>
                      </td>

                      {/* Service Description */}
                      <td className="py-1.5 px-3 text-slate-700">
                        <div className="truncate max-w-xs font-medium">{apt.service_name}</div>
                        {apt.notes && (
                          <div className="text-[10px] text-slate-400 italic truncate max-w-xs">
                            {apt.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-1.5 px-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            apt.service_line === 'SPEECH_LANGUAGE'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : apt.service_line === 'AUDIOLOGY'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : apt.service_line === 'VOICE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {apt.service_line === 'SPEECH_LANGUAGE'
                            ? 'Speech'
                            : apt.service_line === 'AUDIOLOGY'
                            ? 'Audiology'
                            : apt.service_line === 'VOICE'
                            ? 'Voice'
                            : 'CBT'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-1.5 px-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1 ${
                            apt.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                              : apt.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : apt.status === 'CHECKED_IN'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : apt.status === 'COMPLETED'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {apt.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {apt.status === 'PENDING'
                            ? 'Pending'
                            : apt.status === 'CHECKED_IN'
                            ? 'In Queue'
                            : apt.status === 'CONFIRMED'
                            ? 'Confirmed'
                            : apt.status}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{(((apt.fee_paise ? apt.fee_paise / 100 : apt.fee) || 0)).toLocaleString('en-IN')}
                      </td>

                      {/* Approval & Lifecycle Status Dropdown */}
                      <td className="py-1.5 px-3 text-center">
                        {apt.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleApprove(apt.id)}
                              {...getButtonProps(idx, 0)}
                              className={`h-6 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-2xs flex items-center gap-0.5 cursor-pointer ${getButtonProps(idx, 0).className}`}
                              title="Approve booking and lock slot"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeny(apt.id)}
                              {...getButtonProps(idx, 1)}
                              className={`h-6 px-1.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer ${getButtonProps(idx, 1).className}`}
                              title="Deny request and release slot"
                            >
                              <X className="w-3 h-3" />
                              <span>Deny</span>
                            </button>
                          </div>
                        ) : (
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusUpdate(apt.id, e.target.value)}
                            className="h-6 px-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CHECKED_IN">Check In (Token)</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="NO_SHOW">No Show</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        )}
                      </td>

                      {/* Actions & Reminders Column */}
                      <td className="py-1.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* WhatsApp Reminder */}
                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppReminder(apt)}
                            {...getButtonProps(idx, 0)}
                            className={`w-6 h-6 rounded flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer ${getButtonProps(idx, 0).className}`}
                            title="Send WhatsApp appointment reminder to patient"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </button>

                          {/* Email Reminder */}
                          <button
                            type="button"
                            onClick={() => handleSendEmailReminder(apt)}
                            {...getButtonProps(idx, 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer ${getButtonProps(idx, 1).className}`}
                            title="Send Email appointment reminder"
                          >
                            <Mail className="w-3 h-3" />
                          </button>

                          {/* Reschedule Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenReschedule(apt)}
                            {...getButtonProps(idx, 2)}
                            className={`w-6 h-6 rounded flex items-center justify-center bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 cursor-pointer ${getButtonProps(idx, 2).className}`}
                            title="Reschedule appointment to another date/slot"
                          >
                            <CalendarIcon className="w-3 h-3" />
                          </button>

                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(apt)}
                            {...getButtonProps(idx, 3)}
                            className={`w-6 h-6 rounded flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer ${getButtonProps(idx, 3).className}`}
                            title="Edit patient details or consultation fee"
                          >
                            <Edit className="w-3 h-3" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(apt.id, apt.patient_name)}
                            {...getButtonProps(idx, 4)}
                            className={`w-6 h-6 rounded flex items-center justify-center bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer ${getButtonProps(idx, 4).className}`}
                            title="Delete appointment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION FOOTER ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of{' '}
            <span className="font-bold text-slate-900">{totalEntries}</span> appointment entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              title="Previous Page (Ctrl+Q / ⌘Q)"
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] text-slate-400">Ctrl+Q</kbd>
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
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              title="Next Page (Ctrl+E / ⌘E)"
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <span>Next</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] text-slate-400">Ctrl+E</kbd>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: SCHEDULE CONSULTATION SLOT ── */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Clinical Consultation Slot"
        size="lg"
      >
        <AppointmentForm
          onSuccess={() => {
            setIsScheduleModalOpen(false);
            notify.success('Appointment scheduled successfully!');
            loadAppointments();
          }}
          onCancel={() => setIsScheduleModalOpen(false)}
        />
      </Modal>

      {/* ── MODAL 2: EDIT APPOINTMENT DETAILS ── */}
      <Modal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        title="Edit Consultation Appointment Details"
        size="md"
      >
        {editingAppointment && (
          <form onSubmit={handleSaveEdit} className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.patient_name}
                  onChange={(e) => setEditFormData({ ...editFormData, patient_name: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Contact Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={editFormData.patient_phone}
                  onChange={(e) => setEditFormData({ ...editFormData, patient_phone: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Patient UHID</label>
                <input
                  type="text"
                  value={editFormData.patient_uhid}
                  onChange={(e) => setEditFormData({ ...editFormData, patient_uhid: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Email Address</label>
                <input
                  type="email"
                  value={editFormData.patient_email}
                  onChange={(e) => setEditFormData({ ...editFormData, patient_email: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Clinical Service *</label>
                <input
                  type="text"
                  required
                  value={editFormData.service_name}
                  onChange={(e) => setEditFormData({ ...editFormData, service_name: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Clinical Category</label>
                <select
                  value={editFormData.service_line}
                  onChange={(e) => setEditFormData({ ...editFormData, service_line: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none bg-white"
                >
                  <option value="SPEECH_LANGUAGE">Speech-Language Pathology</option>
                  <option value="AUDIOLOGY">Audiology Diagnostics</option>
                  <option value="VOICE">Voice Rehabilitation</option>
                  <option value="CBT_PSYCHOLOGY">CBT &amp; Counseling</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={editFormData.fee_inr}
                  onChange={(e) => setEditFormData({ ...editFormData, fee_inr: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Date</label>
                <input
                  type="date"
                  value={editFormData.appointment_date}
                  onChange={(e) => setEditFormData({ ...editFormData, appointment_date: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Time Slot</label>
                <input
                  type="text"
                  value={editFormData.start_time}
                  onChange={(e) => setEditFormData({ ...editFormData, start_time: e.target.value })}
                  placeholder="e.g. 10:15 AM"
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none bg-white font-semibold"
                >
                  <option value="PENDING">Pending Triage / Approval</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CHECKED_IN">Checked In (In Queue)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="NO_SHOW">No Show</option>
                  <option value="CANCELLED">Cancelled / Denied</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Clinical Notes / Reason</label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Chief complaint or referral note..."
                  className="w-full p-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingAppointment(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#301444] hover:bg-[#200b30] shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── MODAL 3: RESCHEDULE APPOINTMENT ── */}
      <Modal
        isOpen={!!reschedulingAppointment}
        onClose={() => setReschedulingAppointment(null)}
        title="Reschedule Appointment Slot"
        size="md"
      >
        {reschedulingAppointment && (
          <form onSubmit={handleConfirmReschedule} className="space-y-3 font-sans text-xs">
            {/* Current details callout */}
            <div className="p-2.5 rounded bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
              <div className="font-bold">
                Patient: <span className="text-[#301444] font-black">{reschedulingAppointment.patient_name}</span> ({reschedulingAppointment.patient_uhid || 'VN-26-0001'})
              </div>
              <div className="text-[11px] text-purple-800">
                Current Booking: <strong className="font-mono">{reschedulingAppointment.appointment_date}</strong> at <strong className="font-mono">{reschedulingAppointment.start_time}</strong> ({reschedulingAppointment.service_name})
              </div>
            </div>

            {/* Select New Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select New Consultation Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={rescheduleData.newDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none font-mono"
              />
            </div>

            {/* Select New Slot from live available slots */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Select New Time Slot *
                </label>
                {rescheduleBookedSlots.length > 0 && (
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                    {rescheduleBookedSlots.length} slot{rescheduleBookedSlots.length > 1 ? 's' : ''} already booked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {ALL_SLOTS.map((slot) => {
                  const norm = normalizeSlotTime(slot);
                  const isBooked = rescheduleBookedSlots.includes(norm);
                  const isSelected = rescheduleData.newSlot === slot;

                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setRescheduleData({ ...rescheduleData, newSlot: slot })}
                      className={`py-1.5 px-2 rounded text-xs font-semibold border transition-all flex items-center justify-between ${
                        isBooked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                          : isSelected
                          ? 'bg-[#301444] text-white border-[#301444] shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-purple-400 hover:bg-purple-50 cursor-pointer'
                      }`}
                    >
                      <span className={isBooked ? 'line-through text-slate-400' : ''}>{slot}</span>
                      {isBooked && (
                        <span className="text-[9px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-1 py-0.2 rounded">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Reason for Rescheduling
              </label>
              <input
                type="text"
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                placeholder="e.g. Patient requested morning shift instead"
                className="w-full h-8 px-2 text-xs border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>

            {/* Send WhatsApp Toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={rescheduleData.notifyWhatsApp}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, notifyWhatsApp: e.target.checked })}
                  className="rounded border-slate-300 text-purple-700 focus:ring-purple-600 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">Dispatch WhatsApp &amp; Clipboard Reschedule Confirmation to Patient</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-xs cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reschedule</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── REUSABLE WHATSAPP DISPATCH MODAL ── */}
      {selectedAptForWhatsApp && (
        <WhatsAppDispatchModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => {
            setIsWhatsAppModalOpen(false);
            setSelectedAptForWhatsApp(null);
          }}
          recipientName={selectedAptForWhatsApp.patient_name}
          recipientPhone={selectedAptForWhatsApp.patient_phone || ''}
          uhid={selectedAptForWhatsApp.patient_uhid || selectedAptForWhatsApp.uhid}
          attachedFile={`Appointment_Slot_${selectedAptForWhatsApp.appointment_date}_${selectedAptForWhatsApp.start_time.replace(/[^a-zA-Z0-9]/g, '')}.pdf`}
          documentTitle={`Consultation Slip: ${selectedAptForWhatsApp.service_name}`}
          defaultMessage={getAppointmentWhatsAppMessage(selectedAptForWhatsApp)}
          onSuccess={({ phone }) => {
            if (phone && phone !== selectedAptForWhatsApp.patient_phone) {
              setAppointments((prev) =>
                prev.map((a) =>
                  a.id === selectedAptForWhatsApp.id ? { ...a, patient_phone: phone } : a
                )
              );
            }
          }}
        />
      )}

      {/* ── REUSABLE EMAIL DISPATCH MODAL ── */}
      {selectedAptForMail && (
        <EmailDispatchModal
          isOpen={isMailModalOpen}
          onClose={() => {
            setIsMailModalOpen(false);
            setSelectedAptForMail(null);
          }}
          recipientName={selectedAptForMail.patient_name}
          recipientEmail={selectedAptForMail.patient_email || ''}
          uhid={selectedAptForMail.patient_uhid || selectedAptForMail.uhid}
          attachedFile={`Appointment_Slot_${selectedAptForMail.appointment_date}.pdf`}
          documentTitle={`Consultation Slip: ${selectedAptForMail.service_name}`}
          defaultSubject={`Clinical Appointment Reminder: ${selectedAptForMail.appointment_date} at ${selectedAptForMail.start_time} - Vaani Clinic`}
          defaultMessage={`Dear ${selectedAptForMail.patient_name},\n\nThis is an official reminder for your scheduled clinical consultation at Vaani Speech & Hearing Rehabilitation Clinic.\n\nAppointment Particulars:\n- Date: ${selectedAptForMail.appointment_date}\n- Time Slot: ${selectedAptForMail.start_time}\n- Clinical Service: ${selectedAptForMail.service_name}\n- Consultant: ${selectedAptForMail.clinician || 'Ms. Palak Paresh Gandhi, MASLP (Gold Medalist), RCI CRR No. A79214'}\n- Clinic Address: Sadashiv Peth, Satara, Maharashtra (Opp. Civil Hospital)\n- Direct Phone: +91 98220 12345\n\nPlease arrive 10 minutes prior to your allocated time. Kindly bring any prior medical or audiological records.\n\nWarm regards,\nVaani Speech & Hearing Clinic`}
          onSuccess={({ email }) => {
            if (email && email !== selectedAptForMail.patient_email) {
              setAppointments((prev) =>
                prev.map((a) =>
                  a.id === selectedAptForMail.id ? { ...a, patient_email: email } : a
                )
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
