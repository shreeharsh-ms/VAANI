import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import { WhatsAppDispatchModal } from '../../components/common';
import { isKey, isAlt, isCmdOrCtrl } from '../../utils/keyboard';
import { useTableKeyboardNav } from '../../hooks';
import { useClinicSettings, formatClinicAddress } from '../../context/ClinicSettingsContext';

// ── INITIAL RECALL DATA SEED (SRS SECTION 4.10) ──
const INITIAL_RECALLS = [
  {
    id: 'rec_1',
    uhid: 'VN-26-0001',
    patientName: 'Aarav Sachin Shinde',
    phone: '+91 98220 11223',
    recallType: 'PEDIATRIC_SPEECH_MILESTONE',
    category: 'Speech Therapy',
    reason: '3-Month Articulation & Fluency Milestone Re-evaluation',
    dueDate: '2026-10-20',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'PENDING',
    lastContactDate: '2026-07-20',
    preferredChannel: 'WhatsApp',
  },
  {
    id: 'rec_2',
    uhid: 'VN-26-0002',
    patientName: 'Sunita Dattatray More',
    phone: '+91 94220 44556',
    recallType: 'HA_TRIAL_COMPLETION',
    category: 'Hearing Aid',
    reason: 'Trial Follow-up & Fine Tuning for Oticon Real 1 miniRITE',
    dueDate: '2026-10-18',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'DUE',
    lastContactDate: '2026-10-10',
    preferredChannel: 'WhatsApp',
  },
  {
    id: 'rec_3',
    uhid: 'VN-26-0003',
    patientName: 'Vijay Narayan Kadam',
    phone: '+91 98901 77889',
    recallType: 'HA_SERVICE_CLEANING',
    category: 'Hearing Aid',
    reason: '6-Month Acoustic Cleaning & Microphone Wax Check',
    dueDate: '2026-11-05',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'SCHEDULED',
    lastContactDate: '2026-05-05',
    preferredChannel: 'Phone',
  },
  {
    id: 'rec_4',
    uhid: 'VN-26-0005',
    patientName: 'Ramesh Balasaheb Deshmukh',
    phone: '+91 94231 66778',
    recallType: 'ANNUAL_AUDIOMETRY',
    category: 'Audiology',
    reason: 'Annual Diagnostic Pure Tone Audiometry Baseline Check',
    dueDate: '2026-10-25',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'PENDING',
    lastContactDate: '2025-10-24',
    preferredChannel: 'WhatsApp',
  },
  {
    id: 'rec_5',
    uhid: 'VN-26-0007',
    patientName: 'Dhananjay Ramchandra Jadhav',
    phone: '+91 98902 55667',
    recallType: 'NEWBORN_OAE_RECHECK',
    category: 'Audiology',
    reason: 'Newborn OAE Screen "Refer" Follow-up Diagnostic (4 Weeks)',
    dueDate: '2026-10-17',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'DUE',
    lastContactDate: '2026-09-20',
    preferredChannel: 'Phone',
  },
  {
    id: 'rec_6',
    uhid: 'VN-26-0004',
    patientName: 'Ananya Rahul Patil',
    phone: '+91 97654 33221',
    recallType: 'PACKAGE_RENEWAL',
    category: 'Speech Therapy',
    reason: 'Therapy Block Renewal (Session 9/10 Completed)',
    dueDate: '2026-10-22',
    assignedClinician: 'Dr. Palak Paresh Gandhi',
    status: 'PENDING',
    lastContactDate: '2026-10-15',
    preferredChannel: 'WhatsApp',
  },
];

export const RecallsPage = () => {
  const { notify } = useNotification();
  const { settings: clinicSettings, formattedAddress, primaryPhone } = useClinicSettings();
  const clinicAddress = formattedAddress || formatClinicAddress(clinicSettings);
  const clinicPhone = primaryPhone || clinicSettings?.contact?.primaryPhone || '+91 8857830151';
  const clinicTitle = clinicSettings?.identity?.letterheadTitle || clinicSettings?.identity?.legalName || 'Vaani Speech & Hearing Rehabilitation Clinic';
  const leadPractitioner = clinicSettings?.credentials?.leadPractitioner || 'ASLP Palak Paresh Gandhi';
  const leadDegree = clinicSettings?.credentials?.leadDegree || 'BASLP, RCI';
  const fullLeadPractitioner = `${leadPractitioner}${leadDegree ? ` (${leadDegree})` : ''}`;

  const [recalls, setRecalls] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_recalls_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return INITIAL_RECALLS;
    }
    return INITIAL_RECALLS;
  });

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sorting
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // New Recall Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recallFormRef = useRef(null);
  const [newUhid, setNewUhid] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Speech Therapy');
  const [newReason, setNewReason] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Option + N / Alt + N -> Schedule Recall
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      // Ctrl + Enter or Cmd + Enter -> Submit Recall Modal
      if (isModalOpen && isCmdOrCtrl(e) && isKey(e, 'enter')) {
        e.preventDefault();
        if (recallFormRef.current) {
          recallFormRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recalls, isModalOpen]);

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort
  const filteredRecalls = useMemo(() => {
    return recalls.filter(r => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.uhid.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.reason.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [recalls, search, categoryFilter, statusFilter]);

  const sortedRecalls = useMemo(() => {
    return [...filteredRecalls].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    });
  }, [filteredRecalls, sortField, sortOrder]);

  // Pagination Slice
  const totalEntries = sortedRecalls.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedRecalls = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRecalls.slice(start, start + pageSize);
  }, [sortedRecalls, page, pageSize]);

  // Keyboard table navigation for Recalls directory
  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: paginatedRecalls,
    page,
    totalPages,
    onPageChange: setPage,
    tableId: 'recalls-table',
  });

  // WhatsApp preview modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedRecallForWhatsApp, setSelectedRecallForWhatsApp] = useState(null);

  // Action: Open WhatsApp Preview Modal
  const handleOpenWhatsAppModal = (recall) => {
    setSelectedRecallForWhatsApp(recall);
    setIsWhatsAppModalOpen(true);
  };

  const getRecallWhatsAppMessage = (recall) => {
    if (!recall) return '';
    const clinician = recall.assignedClinician && !recall.assignedClinician.includes('Shreeharsh')
      ? recall.assignedClinician
      : fullLeadPractitioner;

    return `Hello *${recall.patientName}*,\n\n` +
      `This is a clinical follow-up reminder from *${clinicTitle}* (Satara).\n\n` +
      `🩺 *Follow-up Objective:* ${recall.reason}\n` +
      `🗓 *Due Date:* ${recall.dueDate}\n` +
      `👩‍⚕️ *Attending Clinician:* ${clinician}\n` +
      `📍 *Location:* ${clinicAddress}\n` +
      `📞 *Appointment Desk:* ${clinicPhone}\n\n` +
      `Please contact us to confirm your preferred consultation timing.`;
  };

  // Action: Mark Contacted
  const handleMarkContacted = (id) => {
    const updated = recalls.map(r => r.id === id ? { ...r, status: 'CONTACTED' } : r);
    setRecalls(updated);
    localStorage.setItem('vaani_recalls_v1', JSON.stringify(updated));
    notify.success('Recall status updated to Contacted.');
  };

  // Add Recall
  const handleAddRecall = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newDueDate) {
      notify.error('Patient name and Due Date are required.');
      return;
    }

    const newRec = {
      id: `rec_${Date.now()}`,
      uhid: newUhid.trim() || `VN-26-00${recalls.length + 10}`,
      patientName: newName.trim(),
      phone: newPhone.trim() || '+91 98220 00000',
      recallType: 'CUSTOM_FOLLOW_UP',
      category: newCategory,
      reason: newReason.trim() || 'Clinical Review & Progress Check',
      dueDate: newDueDate,
      assignedClinician: 'Dr. Palak Paresh Gandhi',
      status: 'PENDING',
      lastContactDate: new Date().toISOString().substring(0, 10),
      preferredChannel: 'WhatsApp',
    };

    const updated = [newRec, ...recalls];
    setRecalls(updated);
    localStorage.setItem('vaani_recalls_v1', JSON.stringify(updated));
    setIsModalOpen(false);
    notify.success('Clinical recall task scheduled successfully!');

    setNewName('');
    setNewReason('');
  };

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION BAR (COMPACT EXCEL DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2 sm:p-2.5 shadow-2xs backdrop-blur-xs flex items-center justify-between gap-2">
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-1 sm:py-0.5 rounded text-xs sm:text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200 shrink-0">
            <RotateCcw className="w-3.5 h-3.5 text-purple-700" />
            <span className="sm:hidden font-extrabold">Recalls</span>
            <span className="hidden sm:inline">Follow-up &amp; Recall Management Engine</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          {/* Responsive Stat Chips */}
          <div className="hidden sm:flex sm:items-center gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 text-[11px]">Tasks:</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-mono text-[11px]">
                {recalls.length} Total
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 text-[11px]">Due Today / Urgent:</span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono text-[11px]">
                {recalls.filter(r => r.status === 'DUE').length} Due
              </span>
            </div>
          </div>

          {/* Mobile compact count pill */}
          <span className="sm:hidden font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 truncate">
            {recalls.filter(r => r.status === 'DUE').length} Due
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-7 px-2.5 sm:px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
            title="Schedule clinical recall task (Alt + N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schedule Recall</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N / ⌥N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex items-center w-full sm:max-w-xs md:max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search UHID, patient name, phone, reason..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-8 sm:h-7 w-full pl-7 pr-6 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-800 placeholder-slate-400 font-medium"
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full sm:w-auto truncate"
            >
              <option value="ALL">All Categories</option>
              <option value="Speech Therapy">Speech Therapy</option>
              <option value="Hearing Aid">Hearing Aid</option>
              <option value="Audiology">Audiology</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full sm:w-auto truncate"
            >
              <option value="ALL">All Statuses</option>
              <option value="DUE">Urgent Due</option>
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="SCHEDULED">Booked</option>
            </select>
          </div>
        </div>

        {/* Rows selector */}
        <div className="hidden sm:flex items-center justify-end gap-1.5 text-xs text-slate-600 w-auto">
          <span className="text-[11px] font-medium">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-7 sm:h-6 px-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* ── MOBILE RECALL CARDS (Visible on screen < md) ── */}
      <div className="md:hidden space-y-2.5">
        {paginatedRecalls.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 font-medium">
            <RotateCcw className="w-6 h-6 mb-1 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-xs">No matching clinical recall tasks found.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Use &quot;Schedule Recall&quot; to register new patient follow-ups.</p>
          </div>
        ) : (
          paginatedRecalls.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2 hover:border-purple-300 transition-colors"
            >
              {/* Header: Due Date & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" />
                  <span>Due: {rec.dueDate}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                    rec.status === 'DUE'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      : rec.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : rec.status === 'CONTACTED'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {rec.status === 'DUE' ? 'Urgent Due' : rec.status === 'PENDING' ? 'Pending' : rec.status === 'CONTACTED' ? 'Contacted' : 'Booked'}
                </span>
              </div>

              {/* Patient & UHID */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rec.patientName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono font-bold text-purple-800">{rec.uhid}</span>
                    <a href={`tel:${rec.phone}`} className="text-[11px] font-mono text-slate-600 hover:text-purple-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-purple-600" />
                      <span>{rec.phone}</span>
                    </a>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex-shrink-0">
                  {rec.category}
                </span>
              </div>

              {/* Recall Reason Box */}
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Clinical Reason</span>
                <span className="font-medium text-slate-800">{rec.reason}</span>
              </div>

              {/* Actions Row */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppModal(rec)}
                  className="flex-1 h-7.5 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkContacted(rec.id)}
                  className="h-7.5 px-3 rounded text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                >
                  Mark Contacted
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP EXCEL-STYLE COMPACT DATA GRID TABLE (Visible on md: and above) ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table {...tableContainerProps} className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('dueDate')}
                  className="py-2 px-3 w-28 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Due Date</span>
                    {sortField === 'dueDate' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('uhid')}
                  className="py-2 px-2.5 w-28 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>UHID</span>
                    {sortField === 'uhid' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patientName')}
                  className="py-2 px-3 w-44 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Patient Name</span>
                    {sortField === 'patientName' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-2.5 w-28">Category</th>
                <th className="py-2 px-3">Clinical Recall Reason</th>
                <th className="py-2 px-2.5 w-24 text-center">Status</th>
                <th className="py-2 px-3 w-40 text-center">Recall Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedRecalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <div className="sticky left-0 w-full min-w-full flex flex-col items-center justify-center py-8 px-4 text-center text-slate-500 font-medium text-xs">
                      No matching clinical recall tasks found.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecalls.map((rec, idx) => {
                  const rowProps = getRowProps(idx);
                  return (
                    <tr key={rec.id} {...rowProps}>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">
                        {rec.dueDate}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono font-semibold text-purple-900">
                        {rec.uhid}
                      </td>
                      <td className="py-1.5 px-3">
                        <span className="font-semibold text-slate-800 block">{rec.patientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{rec.phone}</span>
                      </td>
                      <td className="py-1.5 px-2.5">
                        <span className="text-[11px] font-semibold text-slate-700">{rec.category}</span>
                      </td>
                      <td className="py-1.5 px-3 text-slate-700">
                        {rec.reason}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          rec.status === 'DUE'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                            : rec.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : rec.status === 'CONTACTED'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {rec.status === 'DUE' ? 'Urgent Due' : rec.status === 'PENDING' ? 'Pending' : rec.status === 'CONTACTED' ? 'Contacted' : 'Booked'}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsAppModal(rec)}
                            {...getButtonProps(idx, 0)}
                            className={`h-6 px-2 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${getButtonProps(idx, 0).className}`}
                            title="Send pre-drafted WhatsApp reminder"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkContacted(rec.id)}
                            {...getButtonProps(idx, 1)}
                            className={`h-6 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-semibold cursor-pointer transition-colors ${getButtonProps(idx, 1).className}`}
                            title="Mark patient as contacted"
                          >
                            <span>Done</span>
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
      </div>

      {/* ── PAGINATION FOOTER ── */}
      <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 shadow-2xs">
        <div className="font-medium">
          Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> recall tasks
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
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
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            title="Next Page (Ctrl+E / ⌘E)"
            className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <span>Next</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] text-slate-400">Ctrl+E</kbd>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── MODAL: SCHEDULE RECALL TASK ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Clinical Follow-up & Recall"
        size="md"
      >
        <form ref={recallFormRef} onSubmit={handleAddRecall} className="space-y-3 font-sans text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Patient UHID</label>
              <input
                type="text"
                placeholder="VN-26-0001"
                value={newUhid}
                onChange={(e) => setNewUhid(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Patient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Shinde"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 98220 12345"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Recall Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="Speech Therapy">Speech Therapy</option>
                <option value="Audiology">Audiology</option>
                <option value="Hearing Aid">Hearing Aid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Scheduled Due Date *</label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Recall Clinical Reason</label>
              <input
                type="text"
                placeholder="e.g. Annual Audiometry Threshold Review"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span>Submit:</span>
              <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                Ctrl+↵
              </span>
              <span className="text-slate-400">or</span>
              <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                ⌘↵ (Mac)
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel <span className="opacity-60 text-[10px] font-mono">[Esc]</span>
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
              >
                <span>Save Recall Task</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/25">
                  <span>Ctrl+↵</span>
                  <span className="opacity-60">/</span>
                  <span>⌘↵</span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── REUSABLE WHATSAPP DISPATCH MODAL ── */}
      {selectedRecallForWhatsApp && (
        <WhatsAppDispatchModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => {
            setIsWhatsAppModalOpen(false);
            setSelectedRecallForWhatsApp(null);
          }}
          recipientName={selectedRecallForWhatsApp.patientName}
          recipientPhone={selectedRecallForWhatsApp.phone || ''}
          uhid={selectedRecallForWhatsApp.uhid}
          attachedFile={null}
          documentTitle={null}
          defaultMessage={getRecallWhatsAppMessage(selectedRecallForWhatsApp)}
          onSuccess={({ phone }) => {
            if (phone && phone !== selectedRecallForWhatsApp.phone) {
              setRecalls((prev) =>
                prev.map((r) =>
                  r.id === selectedRecallForWhatsApp.id ? { ...r, phone } : r
                )
              );
            }
          }}
        />
      )}

    </div>
  );
};

export default RecallsPage;
