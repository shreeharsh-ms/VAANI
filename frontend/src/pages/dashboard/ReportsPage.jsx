import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  Search,
  Eye,
  Plus,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  QrCode,
  Tag,
  Edit,
  Trash2,
  Share2,
  Mail,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { clinicService } from '../../services/clinicService';
import { useNotification } from '../../context/NotificationContext';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { DEFAULT_ASSESSMENTS, getAllClinicalReports } from '../../data/clinicalReportsData';
import { useTableKeyboardNav } from '../../hooks';
import { WhatsAppDispatchModal, EmailDispatchModal } from '../../components/common';

export const ReportsPage = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [activeReport, setActiveReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');

  // Load reports from localStorage combined with defaults
  const [allReports, setAllReports] = useState(() => {
    try {
      const stored = localStorage.getItem('vaani_clinical_reports_v1');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading vaani_clinical_reports_v1', e);
    }
    return DEFAULT_ASSESSMENTS;
  });

  // Fetch any backend assessments as well
  // Sync and reload reports from localStorage on mount, focus, or update event
  useEffect(() => {
    const reload = () => {
      setAllReports(getAllClinicalReports());
    };
    window.addEventListener('focus', reload);
    window.addEventListener('storage', reload);
    window.addEventListener('vaani_reports_updated', reload);

    clinicService
      .getClinicalAssessments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllReports((prev) => {
            const ids = new Set(prev.map((r) => r.id || r.report_number));
            const newOnes = data.filter((d) => !ids.has(d.id || d.report_number));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('focus', reload);
      window.removeEventListener('storage', reload);
      window.removeEventListener('vaani_reports_updated', reload);
    };
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return allReports.filter((rep) => {
      const matchesSearch =
        !searchTerm ||
        rep.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.report_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDiscipline =
        selectedDiscipline === 'ALL' || rep.discipline === selectedDiscipline;

      return matchesSearch && matchesDiscipline;
    });
  }, [allReports, searchTerm, selectedDiscipline]);

  // Pagination for Clinical Reports
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalEntries = filteredReports.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedReports = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, page, pageSize]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedDiscipline]);

  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: paginatedReports,
    page,
    totalPages,
    onPageChange: setPage,
    tableId: 'reports-table',
  });

  const disciplines = ['ALL', 'Audiology', 'Speech Therapy', 'Fluency', 'Voice', 'Psychology', 'Rehabilitation'];

  const handleInspectInNewTab = (rep) => {
    const all = getAllClinicalReports();
    const fresh = all.find((r) => r.report_number === rep.report_number || r.id === rep.id) || rep;

    const srv = CLINICAL_SERVICES.find((s) => s.code === fresh.service_code) || {
      code: fresh.service_code || 'RP-CLN-AUD',
      title: fresh.title,
      discipline: fresh.discipline,
      description: fresh.diagnosis,
    };
    const patient = {
      full_name: fresh.patient_name,
      uhid: fresh.uhid,
      gender: fresh.patient_age_sex?.includes('Female') ? 'FEMALE' : 'MALE',
      date_of_birth: fresh.patient_age_sex?.split(',')[1]?.trim() || '—',
      phone: fresh.phone || '+91 98220 11223',
      guardian_name: fresh.guardian || 'Self',
      city: fresh.city || 'Satara, Maharashtra',
    };
    const payload = {
      reportNumber: fresh.report_number || fresh.id,
      reportDate: fresh.date,
      examinerName: fresh.examiner || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
      rciNumber: fresh.rci_number || 'A79214',
      service: srv,
      patient: patient,
      patientDossier: null,
      parameters: fresh.parameters || {
        provisionalDiagnosis: fresh.diagnosis,
        recommendations: fresh.recommendations,
      },
      computedPTA: fresh.computed || null,
    };
    try {
      localStorage.setItem('vaani_preview_report', JSON.stringify(payload));
      sessionStorage.setItem('vaani_preview_report', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }
    window.open(`/dashboard/reports/view/${encodeURIComponent(fresh.report_number || fresh.id)}`, '_blank');
  };

  // ── EDIT REPORT STATE & HANDLERS ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const handleOpenEditModal = (rep) => {
    navigate(`/dashboard/reports/create?editId=${encodeURIComponent(rep.report_number || rep.id)}`);
  };

  const handleSaveEditReport = (e) => {
    e.preventDefault();
    if (!editingReport) return;

    const repKey = editingReport.report_number || editingReport.id;
    const updated = allReports.map((r) =>
      (r.report_number === repKey || r.id === repKey) ? { ...r, ...editingReport } : r
    );

    setAllReports(updated);
    try {
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed saving report:', err);
    }

    setIsEditModalOpen(false);
    notify.success(`Clinical Report ${repKey} updated successfully!`);
  };

  // ── DELETE REPORT STATE & HANDLERS ──
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handlePromptDelete = (rep) => {
    setReportToDelete(rep);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    const repKey = reportToDelete.report_number || reportToDelete.id;
    const filtered = allReports.filter((r) => r.report_number !== repKey && r.id !== repKey);

    setAllReports(filtered);
    try {
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed removing report:', err);
    }

    setIsDeleteModalOpen(false);
    setReportToDelete(null);
    notify.success(`Clinical Report ${repKey} deleted.`);
  };

  // Communication preview modal state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedReportForWhatsApp, setSelectedReportForWhatsApp] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [selectedReportForMail, setSelectedReportForMail] = useState(null);

  // ── WHATSAPP & EMAIL SHARING HANDLERS (Opens Preview Modal) ──
  const handleShareWhatsApp = (rep) => {
    setSelectedReportForWhatsApp(rep);
    setIsWhatsAppModalOpen(true);
  };

  const handleShareEmail = (rep) => {
    setSelectedReportForMail(rep);
    setIsMailModalOpen(true);
  };

  const getReportWhatsAppMessage = (rep) => {
    if (!rep) return '';
    return `*Vaani Speech & Hearing Rehabilitation Clinic*\n\n` +
      `Clinical Report: *${rep.title}*\n` +
      `Report ID: *${rep.report_number || rep.id}*\n` +
      `Patient: *${rep.patient_name}* (UHID: ${rep.uhid || 'Registered'})\n` +
      `Date: *${rep.date}*\n` +
      `Provisional Findings: ${rep.diagnosis || 'Evaluation completed'}\n` +
      `Status: *${rep.status || 'FINAL'} - RCI CRR No. A79214*\n\n` +
      `Your official digitally signed clinical assessment has been recorded. For queries or appointments, call +91 98220 11223.`;
  };

  return (
    <div className="space-y-4">
      {/* ── PAGE HEADER & PRIMARY CREATE ACTION ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div>
          <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-700" />
            Clinical Assessment Reports &amp; Diagnostic Proformas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-page RCI CRR No. A79214 proformas with tamper-evident QR verification and DPDP Act compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/reports/create')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-md shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Clinical Report</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-purple-800 text-[10px] rounded font-mono">
            ⌥R
          </kbd>
        </button>
      </div>

      {/* ── CLINICAL SERVICES & PROFORMA CATALOG (10 Services from Specification) ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Clinical Service Suite ({CLINICAL_SERVICES.length} Master Proformas)
            </h2>
          </div>
          <span className="text-[10px] text-slate-500">
            Click &quot;Create Report&quot; on any service to auto-fill patient parameters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {CLINICAL_SERVICES.map((srv) => (
            <div
              key={srv.code}
              className="p-2.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-purple-50/40 hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                    {srv.code}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500">{srv.discipline}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1" title={srv.title}>
                  {srv.shortName}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/reports/create?type=${srv.code}`)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-2 py-1 text-[11px] font-bold text-purple-700 hover:text-white bg-purple-50 hover:bg-purple-700 border border-purple-200 rounded transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT PATIENT CLINICAL RECORDS TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Clinical Reports ({filteredReports.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, UHID, or report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-700 w-52"
              />
            </div>

            {/* Discipline Filter */}
            <div className="flex items-center gap-1">
              {disciplines.slice(0, 5).map((disc) => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => setSelectedDiscipline(disc)}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                    selectedDiscipline === disc
                      ? 'bg-purple-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" {...tableContainerProps}>
            <thead className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-3.5 py-2.5">Doc ID &amp; Date</th>
                <th className="px-3.5 py-2.5">Report Title</th>
                <th className="px-3.5 py-2.5">Patient &amp; UHID</th>
                <th className="px-3.5 py-2.5">Discipline</th>
                <th className="px-3.5 py-2.5">Clinical Impression</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3.5 py-8 text-center text-slate-500 font-medium">
                    No clinical reports found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedReports.map((rep, idx) => {
                  const rowProps = getRowProps(idx);
                  return (
                    <tr key={rep.id || rep.report_number} {...rowProps}>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{rep.report_number}</span>
                        <span className="text-[10px] text-slate-400">{rep.date}</span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span className="truncate max-w-xs">{rep.title}</span>
                        </div>
                        <span className="text-[10px] text-purple-800 font-semibold">{rep.service_code}</span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{rep.patient_name}</span>
                        <span className="text-[10px] font-mono font-semibold text-purple-700">{rep.uhid}</span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {rep.discipline}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate" title={rep.diagnosis}>
                        {rep.diagnosis}
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {rep.status || 'FINAL'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleInspectInNewTab(rep)}
                            {...getButtonProps(idx, 0)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 cursor-pointer ${getButtonProps(idx, 0).className}`}
                            title="View Official Report in New Tab"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(rep)}
                            {...getButtonProps(idx, 1)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer ${getButtonProps(idx, 1).className}`}
                            title="Edit / Update Clinical Report"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInspectInNewTab(rep)}
                            {...getButtonProps(idx, 2)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer ${getButtonProps(idx, 2).className}`}
                            title="Print Official Report"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(rep)}
                            {...getButtonProps(idx, 3)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer ${getButtonProps(idx, 3).className}`}
                            title="Send Report Summary via WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareEmail(rep)}
                            {...getButtonProps(idx, 4)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 cursor-pointer ${getButtonProps(idx, 4).className}`}
                            title="Send Report via Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromptDelete(rep)}
                            {...getButtonProps(idx, 5)}
                            className={`w-7 h-7 flex items-center justify-center rounded text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer ${getButtonProps(idx, 5).className}`}
                            title="Delete Clinical Report"
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

        {/* ── PAGINATION FOOTER ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of{' '}
            <span className="font-bold text-slate-900">{totalEntries}</span> diagnostic reports
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

      {/* ── MODAL: EDIT CLINICAL REPORT ── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingReport ? `Edit Clinical Report: ${editingReport.report_number || editingReport.id}` : 'Edit Report'}
        size="md"
      >
        {editingReport && (
          <form onSubmit={handleSaveEditReport} className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Report Ref #</label>
                <input
                  type="text"
                  readOnly
                  value={editingReport.report_number || editingReport.id}
                  className="h-8 w-full px-2 text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded text-slate-600"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Examination Date *</label>
                <input
                  type="date"
                  required
                  value={editingReport.date}
                  onChange={(e) => setEditingReport({ ...editingReport, date: e.target.value })}
                  className="h-8 w-full px-2 text-xs font-mono font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Patient Name</label>
                <input
                  type="text"
                  value={editingReport.patient_name}
                  onChange={(e) => setEditingReport({ ...editingReport, patient_name: e.target.value })}
                  className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Patient UHID</label>
                <input
                  type="text"
                  value={editingReport.uhid}
                  onChange={(e) => setEditingReport({ ...editingReport, uhid: e.target.value })}
                  className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Report Title / Investigation Type *</label>
              <input
                type="text"
                required
                value={editingReport.title}
                onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Clinical Findings / Impression / Diagnosis *</label>
              <textarea
                rows={3}
                required
                value={editingReport.diagnosis}
                onChange={(e) => setEditingReport({ ...editingReport, diagnosis: e.target.value })}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none leading-relaxed"
                placeholder="Enter clinical impression and diagnostic interpretation..."
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Clinical Recommendations / Follow-up</label>
              <textarea
                rows={2}
                value={editingReport.recommendations || ''}
                onChange={(e) => setEditingReport({ ...editingReport, recommendations: e.target.value })}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none leading-relaxed"
                placeholder="e.g. Bilateral digital hearing aid trial, speech therapy bi-weekly..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Attending Clinician (RCI CRR)</label>
                <input
                  type="text"
                  value={editingReport.examiner}
                  onChange={(e) => setEditingReport({ ...editingReport, examiner: e.target.value })}
                  className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Report Status</label>
                <select
                  value={editingReport.status || 'FINAL'}
                  onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
                  className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
                >
                  <option value="FINAL">FINAL • VERIFIED</option>
                  <option value="AMENDED">AMENDED / REVISED</option>
                  <option value="PROVISIONAL">PROVISIONAL</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded text-xs font-bold bg-[#301444] text-white hover:bg-[#200b30] shadow-2xs cursor-pointer"
              >
                Save Report Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── MODAL: DELETE CLINICAL REPORT ── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Clinical Report"
        size="sm"
      >
        {reportToDelete && (
          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to delete this report?</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Report: <strong>{reportToDelete.report_number || reportToDelete.id}</strong> ({reportToDelete.title})
                </p>
              </div>
            </div>
            <p className="text-slate-600">
              Patient: <strong>{reportToDelete.patient_name}</strong> (UHID: {reportToDelete.uhid})
            </p>
            <p className="text-[11px] text-slate-500">
              This action will remove the record from both the Clinical Records register and the patient&apos;s dossier.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── REUSABLE WHATSAPP DISPATCH MODAL ── */}
      {selectedReportForWhatsApp && (
        <WhatsAppDispatchModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => {
            setIsWhatsAppModalOpen(false);
            setSelectedReportForWhatsApp(null);
          }}
          recipientName={selectedReportForWhatsApp.patient_name}
          recipientPhone={selectedReportForWhatsApp.phone || ''}
          uhid={selectedReportForWhatsApp.uhid}
          attachedFile={`${selectedReportForWhatsApp.report_number || selectedReportForWhatsApp.id}.pdf`}
          documentTitle={`Clinical Report: ${selectedReportForWhatsApp.title}`}
          defaultMessage={getReportWhatsAppMessage(selectedReportForWhatsApp)}
          onSuccess={({ phone }) => {
            if (phone && phone !== selectedReportForWhatsApp.phone) {
              setAllReports((prev) =>
                prev.map((r) =>
                  r.id === selectedReportForWhatsApp.id ? { ...r, phone } : r
                )
              );
            }
          }}
        />
      )}

      {/* ── REUSABLE EMAIL DISPATCH MODAL ── */}
      {selectedReportForMail && (
        <EmailDispatchModal
          isOpen={isMailModalOpen}
          onClose={() => {
            setIsMailModalOpen(false);
            setSelectedReportForMail(null);
          }}
          recipientName={selectedReportForMail.patient_name}
          recipientEmail={selectedReportForMail.email || ''}
          uhid={selectedReportForMail.uhid}
          attachedFile={`${selectedReportForMail.report_number || selectedReportForMail.id}.pdf`}
          documentTitle={`Clinical Report: ${selectedReportForMail.title}`}
          defaultSubject={`Clinical Report ${selectedReportForMail.report_number || selectedReportForMail.id} — ${selectedReportForMail.patient_name} [Vaani Clinic]`}
          defaultMessage={`Dear ${selectedReportForMail.patient_name || 'Patient'},\n\nPlease find attached the official summary of your clinical assessment recorded at Vaani Speech & Hearing Rehabilitation Clinic (Satara):\n\n• Report ID: ${selectedReportForMail.report_number || selectedReportForMail.id}\n• Assessment: ${selectedReportForMail.title}\n• Examination Date: ${selectedReportForMail.date}\n• Clinical Findings: ${selectedReportForMail.diagnosis || 'Clinical evaluation verified'}\n• Attending Clinician: ${selectedReportForMail.examiner || 'Ms. Palak Paresh Gandhi, MASLP (RCI No. A79214)'}\n\nThis record is compliant with RCI Standards & the Digital Personal Data Protection (DPDP) Act 2023.\n\nWarm regards,\nVaani Speech & Hearing Clinic\nPhone: +91 98220 11223 | Satara, Maharashtra`}
          onSuccess={({ email }) => {
            if (email && email !== selectedReportForMail.email) {
              setAllReports((prev) =>
                prev.map((r) =>
                  r.id === selectedReportForMail.id ? { ...r, email } : r
                )
              );
            }
          }}
        />
      )}

    </div>
  );
};

export default ReportsPage;

