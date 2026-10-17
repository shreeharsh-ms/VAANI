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
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { clinicService } from '../../services/clinicService';
import { useNotification } from '../../context/NotificationContext';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { DEFAULT_ASSESSMENTS } from '../../data/clinicalReportsData';

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
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom stored reports on top of default ones
          const defaultFiltered = DEFAULT_ASSESSMENTS.filter(
            (def) => !parsed.some((p) => p.report_number === def.report_number)
          );
          return [...parsed, ...defaultFiltered];
        }
      }
    } catch (e) {
      console.warn('Error reading vaani_clinical_reports_v1', e);
    }
    return DEFAULT_ASSESSMENTS;
  });

  // Fetch any backend assessments as well
  useEffect(() => {
    clinicService
      .getClinicalAssessments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllReports((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const newOnes = data.filter((d) => !ids.has(d.id));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(() => {});
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

  const disciplines = ['ALL', 'Audiology', 'Speech Therapy', 'Fluency', 'Voice', 'Psychology', 'Rehabilitation'];

  const handleInspectInNewTab = (rep) => {
    const srv = CLINICAL_SERVICES.find((s) => s.code === rep.service_code) || {
      code: rep.service_code || 'RP-CLN-AUD',
      title: rep.title,
      discipline: rep.discipline,
      description: rep.diagnosis,
    };
    const patient = {
      full_name: rep.patient_name,
      uhid: rep.uhid,
      gender: rep.patient_age_sex?.includes('Female') ? 'FEMALE' : 'MALE',
      date_of_birth: rep.patient_age_sex?.split(',')[1]?.trim() || '—',
      phone: rep.phone || '+91 98220 11223',
      guardian_name: rep.guardian || 'Self',
      city: rep.city || 'Satara, Maharashtra',
    };
    const payload = {
      reportNumber: rep.report_number || rep.id,
      reportDate: rep.date,
      examinerName: rep.examiner || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
      rciNumber: rep.rci_number || 'A79214',
      service: srv,
      patient: patient,
      patientDossier: null,
      parameters: rep.parameters || {
        provisionalDiagnosis: rep.diagnosis,
        recommendations: rep.recommendations,
      },
      computedPTA: rep.computed || null,
    };
    try {
      sessionStorage.setItem('vaani_preview_report', JSON.stringify(payload));
    } catch (e) {
      console.warn(e);
    }
    window.open(`/dashboard/reports/view/${rep.report_number || rep.id}`, '_blank');
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
          <table className="w-full text-left text-xs border-collapse">
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
              {filteredReports.map((rep) => (
                <tr key={rep.id || rep.report_number} className="hover:bg-purple-50/30 transition-colors">
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
                  <td className="px-3.5 py-2.5 whitespace-nowrap text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleInspectInNewTab(rep)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                      title="Open full official report in new tab"
                    >
                      <Eye className="w-3 h-3 text-purple-700" />
                      <span>View (New Tab)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInspectInNewTab(rep)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Print official report"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;

