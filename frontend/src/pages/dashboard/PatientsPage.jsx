import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Phone,
  Filter,
  Trash2,
  Plus,
  Download,
  Calendar,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  User,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Modal from '../../components/common/Modal';
import PatientForm from '../../components/forms/PatientForm';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isKey, isAlt } from '../../utils/keyboard';
import { useTableKeyboardNav } from '../../hooks';

// Seed Fallback Patients if none in local database
const SEED_PATIENTS = [
  {
    id: 'p_1',
    uhid: 'VN-26-0001',
    full_name: 'Aarav Sachin Shinde',
    date_of_birth: '2020-04-12',
    gender: 'MALE',
    phone: '+91 98220 11223',
    guardian_name: 'Sachin Shinde (Father)',
    guardian_phone: '+91 98220 11223',
    service_line: 'SPEECH_LANGUAGE',
    diagnosis: 'Expressive Language Delay & Mild Articulation Impairment',
    city: 'Sadashiv Peth, Satara',
    created_at: '2026-01-15T10:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_2',
    uhid: 'VN-26-0002',
    full_name: 'Sunita Dattatray More',
    date_of_birth: '1962-08-25',
    gender: 'FEMALE',
    phone: '+91 94220 44556',
    guardian_name: 'Dattatray More (Husband)',
    guardian_phone: '+91 94220 44556',
    service_line: 'AUDIOLOGY',
    diagnosis: 'Moderate-to-Severe Sensorineural Hearing Loss (Bilateral)',
    city: 'Koregaon, Satara',
    created_at: '2026-02-01T11:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_3',
    uhid: 'VN-26-0003',
    full_name: 'Vijay Narayan Kadam',
    date_of_birth: '1955-12-10',
    gender: 'MALE',
    phone: '+91 98901 77889',
    guardian_name: 'Self',
    guardian_phone: '+91 98901 77889',
    service_line: 'AUDIOLOGY',
    diagnosis: 'Presbycusis with High-Frequency Steep Sloping Loss',
    city: 'Camp, Satara',
    created_at: '2026-02-18T14:15:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_4',
    uhid: 'VN-26-0004',
    full_name: 'Ananya Rahul Patil',
    date_of_birth: '2021-09-05',
    gender: 'FEMALE',
    phone: '+91 97654 33221',
    guardian_name: 'Priyanka Patil (Mother)',
    guardian_phone: '+91 97654 33221',
    service_line: 'SPEECH_LANGUAGE',
    diagnosis: 'Childhood Onset Fluency Disorder (Stuttering)',
    city: 'Khandala, Satara',
    created_at: '2026-03-02T16:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_5',
    uhid: 'VN-26-0005',
    full_name: 'Ramesh Balasaheb Deshmukh',
    date_of_birth: '1970-03-14',
    gender: 'MALE',
    phone: '+91 94231 66778',
    guardian_name: 'Self',
    guardian_phone: '+91 94231 66778',
    service_line: 'CBT_PSYCHOLOGY',
    diagnosis: 'Severe Chronic Subjective Tinnitus with Sleep Disturbance',
    city: 'Sadashiv Peth, Satara',
    created_at: '2026-03-10T09:45:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_6',
    uhid: 'VN-26-0006',
    full_name: 'Kavita Suresh Bhosale',
    date_of_birth: '1984-11-20',
    gender: 'FEMALE',
    phone: '+91 98233 44112',
    guardian_name: 'Suresh Bhosale',
    guardian_phone: '+91 98233 44112',
    service_line: 'VOICE',
    diagnosis: 'Vocal Cord Nodules (Hyperfunctional Dysphonia)',
    city: 'Wai, Satara',
    created_at: '2026-03-22T12:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_7',
    uhid: 'VN-26-0007',
    full_name: 'Dhananjay Ramchandra Jadhav',
    date_of_birth: '2026-09-15',
    gender: 'MALE',
    phone: '+91 98902 55667',
    guardian_name: 'Pooja Jadhav (Mother)',
    guardian_phone: '+91 98902 55667',
    service_line: 'AUDIOLOGY',
    diagnosis: 'Newborn High-Risk Hearing Screening (Bilateral Refer)',
    city: 'Karad, Satara',
    created_at: '2026-09-20T10:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: 'p_8',
    uhid: 'VN-26-0008',
    full_name: 'Pooja Nitin Kulkarni',
    date_of_birth: '1992-05-18',
    gender: 'FEMALE',
    phone: '+91 97665 88990',
    guardian_name: 'Nitin Kulkarni',
    guardian_phone: '+91 97665 88990',
    service_line: 'VOICE',
    diagnosis: 'Muscle Tension Dysphonia (Professional Teacher Voice)',
    city: 'Satara City',
    created_at: '2026-10-01T15:30:00Z',
    status: 'ACTIVE',
  },
];

export const PatientsPage = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return SEED_PATIENTS;
    }
    return SEED_PATIENTS;
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchParams, setSearchParams] = useSearchParams();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick Action triggers from Bottom Bar (URL param or CustomEvent)
  useEffect(() => {
    const handleOpenEvent = () => setIsModalOpen(true);
    window.addEventListener('vaani_open_new_patient', handleOpenEvent);

    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('action');
        return next;
      }, { replace: true });
    }

    return () => {
      window.removeEventListener('vaani_open_new_patient', handleOpenEvent);
    };
  }, [searchParams, setSearchParams]);

  // Sync with patientService if available
  const fetchPatients = async () => {
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
          return;
        }
      }
      const data = await patientService.getPatients().catch(() => null);
      if (data && data.length > 0) {
        setPatients(data);
        localStorage.setItem('vaani_patients_v1', JSON.stringify(data));
      }
    } catch {
      // Keep state
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Option + N / Alt + N -> Register Patient
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      // Option + E / Alt + E -> Export CSV
      if (isAlt(e) && isKey(e, 'e')) {
        e.preventDefault();
        handleExportCSV();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patients]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Delete Patient
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      const updated = patients.filter(p => p.id !== id);
      setPatients(updated);
      localStorage.setItem('vaani_patients_v1', JSON.stringify(updated));
      notify.success('Patient record removed successfully.');
    }
  };

  // Filter Logic
  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.full_name?.toLowerCase().includes(q) ||
        p.uhid?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.diagnosis?.toLowerCase().includes(q);

      const matchesService = selectedService === 'ALL' || p.service_line === selectedService;

      return matchesSearch && matchesService;
    });
  }, [patients, search, selectedService]);

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
    tableId: 'patients-table',
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['UHID', 'Patient Full Name', 'Gender', 'DOB', 'Phone', 'Guardian Name', 'Guardian Phone', 'Service Line', 'Clinical Diagnosis', 'City', 'Intake Date'];
    const rows = sorted.map(p => [
      p.uhid,
      `"${p.full_name}"`,
      p.gender,
      p.date_of_birth,
      p.phone,
      `"${p.guardian_name || '-'}"`,
      p.guardian_phone || '-',
      p.service_line,
      `"${p.diagnosis || '-'}"`,
      `"${p.city || '-'}"`,
      p.created_at ? p.created_at.substring(0, 10) : '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_Patient_Directory_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Patient directory exported to CSV successfully!');
  };

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION BAR (COMPACT DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2 sm:p-2.5 shadow-2xs backdrop-blur-xs flex items-center justify-between gap-2">
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <User className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Patients</span>
          </h1>
          <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-mono shrink-0">
            {patients.length} <span className="hidden sm:inline">Registered</span>
          </span>
        </div>

        {/* Right: Actions (Compact icon buttons on mobile in corner) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 sm:h-7 px-2 sm:px-2.5 rounded-lg sm:rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation flex items-center justify-center gap-1.5"
            title="Export patient records to CSV (Alt + E / ⌥E)"
          >
            <Download className="w-4 h-4 sm:w-3 sm:h-3 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-8 sm:h-7 px-2.5 sm:px-3 rounded-lg sm:rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-1.5"
            title="Register new patient (Alt + N / ⌥N)"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">New Patient</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR (Collapsible on mobile like shopping apps) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Multi-field search */}
          <div className="relative flex items-center flex-1 sm:max-w-xs md:max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search UHID, name, phone, diagnosis..."
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
                className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className={`sm:hidden inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer touch-manipulation active:scale-95 ${
              selectedService !== 'ALL' || showMobileFilters
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-purple-700" />
            <span>Filters</span>
            {selectedService !== 'ALL' && (
              <span className="w-2 h-2 rounded-full bg-purple-700" />
            )}
          </button>

          {/* Desktop Service Line Filter & Rows */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-between">
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setPage(1);
              }}
              className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            >
              <option value="ALL">All Clinical Service Lines</option>
              <option value="SPEECH_LANGUAGE">Speech-Language Pathology</option>
              <option value="AUDIOLOGY">Audiology &amp; Hearing Health</option>
              <option value="VOICE">Voice Therapy &amp; Diagnostics</option>
              <option value="CBT_PSYCHOLOGY">CBT &amp; Psychological Counseling</option>
            </select>

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
        </div>

        {/* Collapsible Mobile Filter Details */}
        {showMobileFilters && (
          <div className="sm:hidden pt-2 border-t border-slate-200 flex flex-col gap-2 text-xs animate-in fade-in duration-150">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Clinical Service Line:
              </span>
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setPage(1);
                }}
                className="h-8 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full"
              >
                <option value="ALL">All Clinical Service Lines</option>
                <option value="SPEECH_LANGUAGE">Speech-Language Pathology</option>
                <option value="AUDIOLOGY">Audiology &amp; Hearing Health</option>
                <option value="VOICE">Voice Therapy &amp; Diagnostics</option>
                <option value="CBT_PSYCHOLOGY">CBT &amp; Psychological Counseling</option>
              </select>
            </div>
            {selectedService !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedService('ALL');
                  setPage(1);
                }}
                className="text-left text-[11px] font-bold text-rose-600 hover:text-rose-700 py-1"
              >
                Clear Service Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── MOBILE TOUCH-OPTIMIZED CARD VIEW (Visible on mobile/tablet < md:) ── */}
      <div className="md:hidden space-y-2.5">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 font-medium">
            No matching patient records found in Master Patient Index.
          </div>
        ) : (
          paginated.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2 hover:border-purple-300 transition-colors"
            >
              {/* Header: UHID & Service Line */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-950 border border-purple-200 whitespace-nowrap">
                  {p.uhid || 'VN-26-0001'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 whitespace-nowrap ${
                    p.service_line === 'SPEECH_LANGUAGE'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : p.service_line === 'AUDIOLOGY'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : p.service_line === 'VOICE'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {p.service_line === 'SPEECH_LANGUAGE'
                    ? 'Speech'
                    : p.service_line === 'AUDIOLOGY'
                    ? 'Audiology'
                    : p.service_line === 'VOICE'
                    ? 'Voice'
                    : 'CBT'}
                </span>
              </div>

              {/* Patient Name & Demographics */}
              <div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/patients/${p.uhid || p.id}`)}
                  className="text-left font-bold text-sm text-slate-900 hover:text-purple-700 transition-colors block w-full truncate"
                >
                  {p.full_name}
                </button>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {p.gender ? (p.gender === 'MALE' ? 'Male' : p.gender === 'FEMALE' ? 'Female' : p.gender) : 'Patient'}
                  {p.date_of_birth ? ` • ${new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()} yrs` : ''}
                  {p.city ? ` • ${p.city}` : ''}
                </div>
              </div>

              {/* Contact & Caregiver */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                <a
                  href={`tel:${p.phone}`}
                  className="inline-flex items-center gap-1 text-slate-700 hover:text-purple-700 font-mono text-xs font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>{p.phone}</span>
                </a>
                {p.guardian_name && p.guardian_name !== 'Self' && (
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]" title={p.guardian_name}>
                    {p.guardian_name}
                  </span>
                )}
              </div>

              {/* Clinical Diagnosis Box */}
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Diagnosis</span>
                <span className="font-medium text-slate-800 line-clamp-2">{p.diagnosis || 'Clinical evaluation in progress'}</span>
              </div>

              {/* Direct Actions Row */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/patients/${p.uhid || p.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-200" />
                  <span>View Dossier &amp; EMR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Delete patient record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP EXCEL-STYLE COMPACT DATA GRID TABLE (Visible on md: and above) ── */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" {...tableContainerProps}>
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('uhid')}
                  className="py-2 px-3 w-32 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>UHID</span>
                    {sortField === 'uhid' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('full_name')}
                  className="py-2 px-3 w-48 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Patient Name</span>
                    {sortField === 'full_name' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-2.5 w-24">Gender / Age</th>
                <th className="py-2 px-3 w-36">Contact Phone</th>
                <th className="py-2 px-3 w-48">Guardian / Caregiver</th>
                <th className="py-2 px-3">Primary Diagnosis / Complaint</th>
                <th className="py-2 px-2.5 w-32 text-center">Service Line</th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="py-2 px-2.5 w-24 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Registered</span>
                    {sortField === 'created_at' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-2.5 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                    No matching patient records found in Master Patient Index.
                  </td>
                </tr>
              ) : (
                paginated.map((p, idx) => {
                  const rowProps = getRowProps(idx);
                  return (
                    <tr
                      key={p.id}
                      {...rowProps}
                      className={`${rowProps.className} cursor-pointer group select-none`}
                      title="Navigate via Arrow Keys, Enter to open Dossier"
                    >
                      <td
                        onClick={() => navigate(`/dashboard/patients/${p.uhid || p.id}`)}
                        className="py-1.5 px-3 font-mono font-bold text-purple-950 group-hover:text-purple-700 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="hover:underline">{p.uhid}</span>
                        </div>
                      </td>
                      <td
                        onClick={() => navigate(`/dashboard/patients/${p.uhid || p.id}`)}
                        className="py-1.5 px-3"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-purple-900 block truncate">{p.full_name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{p.city}</span>
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-600 font-mono whitespace-nowrap">
                        {p.gender ? p.gender.substring(0, 1) : '-'} • {p.date_of_birth ? `${new Date().getFullYear() - new Date(p.date_of_birth).getFullYear()}y` : '-'}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-slate-700 font-medium whitespace-nowrap">
                        {p.phone}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700">
                        <span className="font-semibold block truncate">{p.guardian_name || 'Self'}</span>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{p.guardian_phone || p.phone}</span>
                      </td>
                      <td className="py-1.5 px-3 text-slate-700 truncate max-w-xs">
                        {p.diagnosis || 'Clinical evaluation in progress'}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                          p.service_line === 'SPEECH_LANGUAGE'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : p.service_line === 'AUDIOLOGY'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : p.service_line === 'VOICE'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {p.service_line === 'SPEECH_LANGUAGE' ? 'Speech' : p.service_line === 'AUDIOLOGY' ? 'Audiology' : p.service_line === 'VOICE' ? 'Voice' : 'CBT'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-500 text-xs whitespace-nowrap">
                        {p.created_at ? p.created_at.substring(0, 10) : '-'}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/patients/${p.uhid || p.id}`);
                            }}
                            {...getButtonProps(idx, 0)}
                            className={`p-1 rounded text-slate-500 hover:text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer ${getButtonProps(idx, 0).className}`}
                            title="Open Clinical Dossier & EMR Record Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
                            {...getButtonProps(idx, 1)}
                            className={`p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${getButtonProps(idx, 1).className}`}
                            title="Delete patient record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> registered patient records
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

      {/* ── MODAL: REGISTER PATIENT ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient (Intake)"
        size="lg"
      >
        <PatientForm
          onSuccess={(newPatient, nextAction) => {
            setIsModalOpen(false);
            fetchPatients();
            if (nextAction !== 'EDH') {
              notify.success('New patient registered successfully!');
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default PatientsPage;
