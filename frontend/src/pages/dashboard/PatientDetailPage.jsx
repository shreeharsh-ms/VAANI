import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Activity,
  HeartPulse,
  IndianRupee,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Check,
  ExternalLink,
  Lock,
  Download,
  Info,
  Sliders,
  History,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  Filter,
  Share2,
  Edit3,
  Plus,
  X,
  Send,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import {
  SEED_PATIENTS,
  PATIENT_DOSSIERS,
  getPatientClinicalDossier,
} from '../../data/patientClinicalProfiles';
import { getReportsForPatient } from '../../data/clinicalReportsData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { isKey, isAlt } from '../../utils/keyboard';

export const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('demographics');

  // Resolve Patient from LocalStorage or SEED_PATIENTS or PATIENT_DOSSIERS
  const patient = useMemo(() => {
    let list = SEED_PATIENTS;
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {
      // Fallback
    }

    const normalizedId = (id || '').trim().toLowerCase();
    const found = list.find(
      (p) =>
        (p.uhid && p.uhid.toLowerCase() === normalizedId) ||
        (p.id && p.id.toLowerCase() === normalizedId)
    );

    if (found) return found;

    // Direct dossier match fallback
    const upperId = (id || '').trim().toUpperCase();
    if (PATIENT_DOSSIERS[upperId]) {
      const dossierDemo = PATIENT_DOSSIERS[upperId].demographics;
      return {
        id: `p_${upperId}`,
        uhid: dossierDemo.uhid,
        full_name: dossierDemo.fullName,
        date_of_birth: dossierDemo.dob,
        gender: dossierDemo.sex,
        phone: dossierDemo.primaryPhone,
        guardian_name: dossierDemo.guardians?.[0]?.name || 'Self',
        guardian_phone: dossierDemo.guardians?.[0]?.phone || dossierDemo.primaryPhone,
        service_line: 'CLINICAL',
        city: dossierDemo.locality,
      };
    }

    return list[0];
  }, [id]);

  const { notify } = useNotification();

  const dossier = useMemo(() => {
    return getPatientClinicalDossier(patient);
  }, [patient]);

  const { demographics, consents, clinical, therapy, hearingAids, financial, recalls, retention } = dossier;

  // Load generated clinical reports for this patient
  const [reportsRefreshTick, setReportsRefreshTick] = useState(0);
  const patientReports = useMemo(() => {
    return getReportsForPatient(demographics.uhid, demographics.fullName);
  }, [demographics.uhid, demographics.fullName, reportsRefreshTick]);

  // Reports Table Search, Filter, Pagination & Expand State
  const [reportSearch, setReportSearch] = useState('');
  const [reportDisciplineFilter, setReportDisciplineFilter] = useState('ALL');
  const [reportCurrentPage, setReportCurrentPage] = useState(1);
  const [reportPageSize, setReportPageSize] = useState(5);
  const [expandedReportIds, setExpandedReportIds] = useState(new Set());

  const toggleExpandReport = (id) => {
    setExpandedReportIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredReports = useMemo(() => {
    return patientReports.filter((rep) => {
      const query = reportSearch.toLowerCase().trim();
      const matchesSearch = !query || (
        (rep.report_number && rep.report_number.toLowerCase().includes(query)) ||
        (rep.title && rep.title.toLowerCase().includes(query)) ||
        (rep.diagnosis && rep.diagnosis.toLowerCase().includes(query)) ||
        (rep.recommendations && rep.recommendations.toLowerCase().includes(query)) ||
        (rep.examiner && rep.examiner.toLowerCase().includes(query)) ||
        (rep.service_code && rep.service_code.toLowerCase().includes(query))
      );

      const disc = (rep.discipline || rep.service_code || '').toUpperCase();
      let matchesDiscipline = true;
      if (reportDisciplineFilter === 'AUDIOLOGY') {
        matchesDiscipline = disc.includes('AUD') || disc.includes('AAE') || disc.includes('OAE') || disc.includes('AUDIO');
      } else if (reportDisciplineFilter === 'SPEECH') {
        matchesDiscipline = disc.includes('SLA') || disc.includes('SPEECH');
      } else if (reportDisciplineFilter === 'VOICE') {
        matchesDiscipline = disc.includes('VOI') || disc.includes('VOICE');
      } else if (reportDisciplineFilter === 'FLUENCY') {
        matchesDiscipline = disc.includes('FLU') || disc.includes('STUTTER');
      } else if (reportDisciplineFilter === 'EDH') {
        matchesDiscipline = disc.includes('EDH') || disc.includes('DEVELOP');
      } else if (reportDisciplineFilter === 'CBT') {
        matchesDiscipline = disc.includes('CBT') || disc.includes('PSYCH');
      }

      return matchesSearch && matchesDiscipline;
    });
  }, [patientReports, reportSearch, reportDisciplineFilter]);

  const totalReportPages = Math.max(1, Math.ceil(filteredReports.length / reportPageSize));
  const paginatedReports = useMemo(() => {
    const start = (reportCurrentPage - 1) * reportPageSize;
    return filteredReports.slice(start, start + reportPageSize);
  }, [filteredReports, reportCurrentPage, reportPageSize]);

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedReportForEmail, setSelectedReportForEmail] = useState(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleOpenEmailModal = (rep) => {
    setSelectedReportForEmail(rep);
    const targetEmail = demographics.email || (demographics.guardians?.[0]?.email) || `${demographics.uhid.toLowerCase()}@vaaniclinic.com`;
    setEmailRecipient(targetEmail);
    setEmailSubject(`Official Clinical Report - ${rep.report_number} - ${demographics.fullName} | Vaani Clinic`);
    setEmailBody(
      `Dear ${demographics.fullName},\n\n` +
      `Please find attached your official diagnostic clinical report (${rep.title} - ${rep.report_number}) evaluated at Vaani Speech and Hearing Clinic, Satara.\n\n` +
      `Summary / Impression: ${rep.diagnosis || 'Clinical evaluation completed.'}\n` +
      (rep.recommendations ? `Recommendations: ${rep.recommendations}\n\n` : '\n') +
      `This report is digitally signed and cryptographically verifiable under RCI CRR No. A79214 and the Digital Personal Data Protection (DPDP) Act 2023.\n\n` +
      `Warm regards,\nDr. Shreeharsh Shivpuje, BASLP, MASLP\nVaani Speech and Hearing Clinic, Satara\nContact: +91 98220 11223`
    );
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailRecipient) {
      notify.error('Please specify a recipient email address.');
      return;
    }

    try {
      const logs = JSON.parse(localStorage.getItem('vaani_clinic_mail_logs_v1') || '[]');
      logs.unshift({
        id: `mail_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        to: emailRecipient,
        patient: demographics.fullName,
        uhid: demographics.uhid,
        reportNumber: selectedReportForEmail?.report_number,
        subject: emailSubject,
        status: 'DISPATCHED',
      });
      localStorage.setItem('vaani_clinic_mail_logs_v1', JSON.stringify(logs));
    } catch {}

    notify.success(`Report ${selectedReportForEmail?.report_number} successfully dispatched to ${emailRecipient}`);
    setIsEmailModalOpen(false);
  };

  const handleSendWhatsApp = (rep) => {
    const rawPhone = demographics.primaryPhone || patient.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = `*VAANI SPEECH AND HEARING CLINIC*\n*Official Clinical Diagnostic Report*\n\n` +
      `*Patient:* ${demographics.fullName || patient.full_name} (${demographics.uhid || patient.uhid})\n` +
      `*Report Ref:* ${rep.report_number}\n` +
      `*Investigation:* ${rep.title}\n` +
      `*Date:* ${rep.date}\n` +
      `*Attending Clinician:* ${rep.examiner || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP (A79214)'}\n\n` +
      `*Diagnosis / Summary:* ${rep.diagnosis || 'Clinical evaluation completed.'}\n\n` +
      (rep.recommendations ? `*Recommendations:* ${rep.recommendations}\n\n` : '') +
      `*Clinic Address:* Sadashiv Peth, Near Powai Naka, Satara - 415002\n` +
      `*Contact:* +91 98220 11223 / +91 2162 234567\n` +
      `*Secure Verification:* https://vaaniclinic.com/verify-doc/${rep.report_number}`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    notify.success(`WhatsApp message draft launched for ${demographics.fullName || patient.full_name}`);
  };

  const handleViewDownloadReport = (rep) => {
    window.open(`/dashboard/reports/view/${rep.report_number || rep.id}`, '_blank');
  };

  const tabs = [
    { id: 'demographics', label: '1. Identity & Demographics', count: '14 fields' },
    { id: 'consents', label: '2. DPDP Consents', count: `${consents.length} rules` },
    { id: 'clinical', label: '3. Clinical Diagnostics & EMR', count: `${patientReports.length} Reports` },
    { id: 'hearingAids', label: '4. Hearing Aids & Devices', count: hearingAids?.dispensed ? 'Bilateral' : 'Screened' },
    { id: 'therapy', label: '5. Therapy Goals & SOAP', count: 'Active Plan' },
    { id: 'billing', label: '6. Billing & Recalls', count: `${financial?.invoices?.length || 0} Invoices` },
    { id: 'retention', label: '7. Retention & Legal Audit', count: 'Statutory' },
  ];

  // Keyboard Shortcuts: Alt+B / Esc to go back, Alt+P to print, 1-7 for tabs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((isAlt(e) && isKey(e, 'b')) || e.key === 'Escape') {
        e.preventDefault();
        navigate('/dashboard/patients');
      }
      if (isAlt(e) && isKey(e, 'p')) {
        e.preventDefault();
        window.print();
      }
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= tabs.length) {
          e.preventDefault();
          setActiveTab(tabs[num - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, tabs]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3 font-sans pb-16">
      {/* ── BREADCRUMB & TOP ACTIONS TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white border border-slate-200/90 rounded-lg p-2.5 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => navigate('/dashboard/patients')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 hover:text-purple-950 bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer border border-slate-200"
            title="Return to Master Patient Index [Alt+B / Esc]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-700" />
            <span>Patients Master Index</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[Alt+B]</span>
          </button>
          
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          
          <span className="font-mono font-bold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {demographics.uhid}
          </span>
          
          <span className="font-bold text-slate-800 truncate">
            {demographics.fullName}
          </span>
          {demographics.displayMr && (
            <span className="text-slate-500 font-medium hidden md:inline">
              ({demographics.displayMr})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RCI CRR No. A79214 Certified</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Print Clinical Dossier Summary [Alt+P]"
          >
            <Printer className="w-3.5 h-3.5 text-purple-700" />
            <span>Print Dossier</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[Alt+P]</span>
          </button>
        </div>
      </div>

      {/* ── PATIENT HERO CLINICAL BANNER (REFINED PROFESSIONAL LAVENDER THEME) ── */}
      <div className="bg-gradient-to-r from-purple-50/90 via-white to-purple-50/60 text-slate-900 rounded-xl p-3.5 sm:p-4 shadow-xs border border-purple-200/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-black bg-purple-900 text-white px-2.5 py-0.5 rounded tracking-wider shadow-2xs">
                {demographics.uhid}
              </span>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {demographics.fullName}
              </h1>
              {demographics.displayMr && (
                <span className="text-xs text-purple-900 font-semibold">
                  ({demographics.displayMr})
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                patient.service_line === 'SPEECH_LANGUAGE'
                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                  : patient.service_line === 'AUDIOLOGY'
                  ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                  : patient.service_line === 'VOICE'
                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-300'
              }`}>
                {patient.service_line || 'CLINICAL EMR'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap font-medium">
              <span className="font-bold text-slate-800">{demographics.sex}</span>
              <span>•</span>
              <span className="text-purple-950 font-bold">{demographics.ageContextual}</span>
              <span>•</span>
              <span>DOB: <strong className="text-slate-800">{demographics.dob}</strong></span>
              <span>•</span>
              <span>Phone: <strong className="font-mono text-purple-950 font-bold">{demographics.primaryPhone}</strong></span>
              <span>•</span>
              <span>{demographics.locality}, {demographics.district}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
            <div className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-center min-w-[90px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Billed</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{formatCurrency(financial?.totalBilled || 0)}</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-md px-3 py-1.5 text-center min-w-[90px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Paid</span>
              <span className="font-mono font-bold text-emerald-900 text-xs">{formatCurrency(financial?.totalPaid || 0)}</span>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-center min-w-[90px] shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Balance Due</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{formatCurrency(financial?.balance || 0)}</span>
            </div>
          </div>
        </div>

        {/* Medical Alerts Row */}
        {demographics.medicalAlerts && demographics.medicalAlerts.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-purple-200/60 flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1 font-bold text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Safety Alerts:</span>
            </div>
            {demographics.medicalAlerts.map((alert, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-950 border border-amber-300"
              >
                {alert.label} • {alert.note}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── EXCEL-STYLE SHEET TABS STRIP ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center gap-1 overflow-x-auto shadow-2xs">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-100 cursor-pointer ${
                isActive
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-purple-950'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-purple-800 text-purple-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
              <span className="text-[9px] opacity-40 font-mono hidden xl:inline">[{idx + 1}]</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT BODY ── */}
      <div className="space-y-3">
        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: DEMOGRAPHICS & IDENTITY DATA (SECTION 4.8 & 5.5.14)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'demographics' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                <span>1.1 Patient Master Identity &amp; Demographic Profile</span>
                <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                  Section 4.8 &amp; 5.5.14
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs">
                <div className="p-3.5 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Full Name</span>
                    <span className="font-bold text-slate-800 text-sm block">{demographics.fullName}</span>
                    {demographics.displayMr && <span className="text-xs text-slate-500 block font-medium">({demographics.displayMr})</span>}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UHID Scheme</span>
                    <span className="font-mono font-bold text-purple-950 text-sm">{demographics.uhid}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Immutable Sequential ID</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biological Sex &amp; Age</span>
                    <span className="font-semibold text-slate-800 block text-xs">{demographics.sex} • {demographics.ageContextual}</span>
                    <span className="text-[11px] text-slate-500 block">DOB: {demographics.dob}</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Contact Phone</span>
                    <span className="font-mono font-bold text-slate-800 text-sm block">{demographics.primaryPhone}</span>
                    <span className="text-[11px] text-emerald-700 block font-medium">
                      ✓ {demographics.preferredChannel} Preferred • {demographics.bestCallingTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alternate Contact &amp; Email</span>
                    <span className="font-mono text-slate-700 block">{demographics.altPhone || 'None'}</span>
                    <span className="text-xs text-slate-600 truncate block">{demographics.email || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linguistic Profile</span>
                    <span className="font-semibold text-slate-800 block">{demographics.preferredLanguages?.join(' > ')}</span>
                    <span className="text-[11px] text-slate-500 block">Home Language: {demographics.homeLanguages?.join(', ')}</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Geographic Residence</span>
                    <span className="font-medium text-slate-800 block">{demographics.addressLine1}</span>
                    <span className="text-xs text-slate-600 block">{demographics.locality}, Tal. {demographics.taluka}, Dist. {demographics.district}</span>
                    <span className="text-xs text-slate-500 font-mono block">PIN: {demographics.pin}, {demographics.state}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Socio-Demographics</span>
                    <span className="font-semibold text-slate-800 block">{demographics.occupation}</span>
                    <span className="text-xs text-slate-500 block">{demographics.education}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardians & Referral */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>1.2 Guardians &amp; Legal Caregivers</span>
                  <span className="text-[10px] text-slate-500 font-normal">Mandatory for Minors</span>
                </div>
                <div className="p-3 space-y-2.5">
                  {demographics.guardians?.map((g, i) => (
                    <div key={i} className="p-2.5 rounded border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{g.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                          {g.relation}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Phone: <strong className="font-mono text-slate-800">{g.phone}</strong></span>
                        <span>{g.occupation}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-800 font-medium">
                        {g.isLegalGuardian && <span>✓ Legal Guardian: Yes</span>}
                        {g.canConsent && <span>• Can Consent: Yes</span>}
                        {g.canPickUp && <span>• Pick-up Auth: Yes</span>}
                      </div>
                    </div>
                  ))}
                  <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Family Link Group ID:</span>
                    <span className="font-mono font-bold text-purple-900">{demographics.familyGroupId}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>1.3 Referral Partner &amp; ABHA Health Account</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    DPDP Compliant
                  </span>
                </div>
                <div className="p-3 space-y-3 text-xs">
                  <div className="p-2.5 rounded border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referring Physician</span>
                    <p className="font-bold text-slate-900">{demographics.referral?.doctorName}</p>
                    <p className="text-[11px] text-slate-600">{demographics.referral?.hospital} • {demographics.referral?.discipline}</p>
                    <p className="text-[11px] text-slate-500 italic">"{demographics.referral?.notes || demographics.referral?.reason || 'Clinical Consultation'}"</p>
                  </div>

                  <div className="p-2.5 rounded border border-purple-200 bg-purple-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                        Ayushman Bharat Health Account (ABHA)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                        Encrypted
                      </span>
                    </div>
                    <p className="font-mono font-bold text-purple-950 text-xs">{demographics.abhaId || demographics.abha?.id || '91-XXXX-XXXX-XXXX'}</p>
                    <p className="text-[10px] text-slate-500">
                      DPDP Act 2023 compliant: Zero Aadhaar data stored.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: DPDP CONSENTS (SECTION 4.8 & 5.5.15)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'consents' && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DPDP Act 2023 Statutory Consent Register &amp; Cryptographic Audit Trail</span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                {consents?.length || 0} Statutory Consents Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2 px-3">Consent Category</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3">Consenting Grantor</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3 font-mono">Cryptographic SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {consents?.map((c) => (
                    <tr key={c.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-2 px-3">
                        <span className="font-bold text-slate-900 block">{c.category || c.type}</span>
                        <span className="text-[10px] text-slate-500 block">{c.legalBasis}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                          c.status === 'GRANTED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-700 font-medium">
                        {c.grantor}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                          {c.method}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                        {c.timestamp}
                      </td>
                      <td className="py-2 px-3 font-mono text-[10px] text-purple-900 max-w-xs truncate" title={c.hash}>
                        {c.hash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: CLINICAL DIAGNOSTICS & EMR (SECTIONS 5.5.20, 5.5.21, 5.5.22)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'clinical' && (
          <div className="space-y-3">
            {/* ── 3.0 EXCEL-STYLE CLINICAL REPORTS & DIAGNOSTIC RECORDS TABLE ── */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              {/* Header Strip with Title, Search, Filter, Refresh & New Report Button */}
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-900" />
                  <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                    3.0 Official Clinical Reports &amp; Diagnostic Records Register
                  </span>
                  <span className="bg-purple-900 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {patientReports.length} {patientReports.length === 1 ? 'Report' : 'Reports'} on File
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setReportsRefreshTick((t) => t + 1);
                      notify.info('Clinical reports re-synchronized from local vault.');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                    title="Reload current reports from master ledger"
                  >
                    <RotateCcw className="w-3 h-3 text-purple-700" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <Link
                    to={`/dashboard/reports/create?patient=${patient.uhid}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Generate New Report</span>
                  </Link>
                </div>
              </div>

              {/* Excel Controls Bar: Search & Service Filters */}
              <div className="px-3 py-2 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => {
                        setReportSearch(e.target.value);
                        setReportCurrentPage(1);
                      }}
                      placeholder="Filter reports by #, test name, clinician, impression..."
                      className="w-full h-7.5 pl-8 pr-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                    <select
                      value={reportDisciplineFilter}
                      onChange={(e) => {
                        setReportDisciplineFilter(e.target.value);
                        setReportCurrentPage(1);
                      }}
                      className="h-7.5 px-2 text-xs bg-white border border-slate-300 rounded font-medium text-slate-700 focus:border-purple-600 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">All Disciplines</option>
                      <option value="AUDIOLOGY">Audiology &amp; Hearing</option>
                      <option value="SPEECH">Speech &amp; Language</option>
                      <option value="VOICE">Voice Rehab</option>
                      <option value="FLUENCY">Fluency &amp; Stuttering</option>
                      <option value="EDH">Early Dev History (EDH)</option>
                      <option value="CBT">Psychology &amp; CBT</option>
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 self-center">
                  Showing <strong className="text-slate-800">{filteredReports.length}</strong> of{' '}
                  <strong className="text-slate-800">{patientReports.length}</strong> recorded records
                </div>
              </div>

              {/* Spreadsheet Table Format */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      <th className="py-2 px-2 text-center w-8">▾</th>
                      <th className="py-2 px-2.5 whitespace-nowrap">Report Ref #</th>
                      <th className="py-2 px-2.5 whitespace-nowrap">Exam Date</th>
                      <th className="py-2 px-3">Clinical Investigation / Proforma</th>
                      <th className="py-2 px-2.5 whitespace-nowrap">Discipline Code</th>
                      <th className="py-2 px-3 whitespace-nowrap">Attending Clinician</th>
                      <th className="py-2 px-2.5 text-center whitespace-nowrap">Status</th>
                      <th className="py-2 px-3 text-right whitespace-nowrap">Clinical Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {paginatedReports.length > 0 ? (
                      paginatedReports.map((rep) => {
                        const repId = rep.id || rep.report_number;
                        const isExpanded = expandedReportIds.has(repId);
                        return (
                          <React.Fragment key={repId}>
                            <tr
                              className={`transition-colors cursor-pointer ${
                                isExpanded ? 'bg-purple-50/40' : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpandReport(repId);
                                  }}
                                  className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-purple-900 hover:bg-purple-100 transition-colors"
                                  title={isExpanded ? 'Collapse report details' : 'Expand report details'}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 text-purple-800 font-bold" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                                  )}
                                </button>
                              </td>

                              <td className="py-2 px-2.5 font-mono font-bold text-purple-950 whitespace-nowrap">
                                <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                  {rep.report_number}
                                </span>
                              </td>

                              <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                                {rep.date}
                              </td>

                              <td className="py-2 px-3" onClick={() => toggleExpandReport(repId)}>
                                <span className="font-bold text-slate-900 hover:text-purple-900 block">
                                  {rep.title}
                                </span>
                                <span className="text-[10px] text-slate-500 line-clamp-1">
                                  {rep.diagnosis || 'Clinical evaluation completed.'}
                                </span>
                              </td>

                              <td className="py-2 px-2.5 whitespace-nowrap">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {rep.service_code || rep.discipline || 'CLINICAL'}
                                </span>
                              </td>

                              <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                                <span className="font-medium text-slate-800 block text-xs">
                                  {rep.examiner || 'Dr. Shreeharsh Shivpuje (A79214)'}
                                </span>
                                <span className="text-[10px] text-slate-400">RCI CRR Verified</span>
                              </td>

                              <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>FINAL • VERIFIED</span>
                                </span>
                              </td>

                              <td className="py-2 px-3 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDownloadReport(rep);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 rounded shadow-2xs transition-colors cursor-pointer"
                                    title="Open and download official printable PDF document"
                                  >
                                    <Download className="w-3 h-3 text-purple-700" />
                                    <span>Download</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEmailModal(rep);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded shadow-2xs transition-colors cursor-pointer"
                                    title="Dispatch cryptographically signed report via email"
                                  >
                                    <Mail className="w-3 h-3 text-purple-700" />
                                    <span>Email</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSendWhatsApp(rep);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-2xs transition-colors cursor-pointer"
                                    title="Send official report summary directly to patient via WhatsApp"
                                  >
                                    <Share2 className="w-3 h-3 text-white" />
                                    <span>WhatsApp</span>
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Dropdown Extra Details Drawer */}
                            {isExpanded && (
                              <tr className="bg-purple-50/25 border-b border-purple-100">
                                <td colSpan={8} className="p-3.5">
                                  <div className="bg-white border border-purple-200 rounded-lg p-3.5 space-y-3 shadow-xs">
                                    <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-purple-950 uppercase tracking-wide">
                                          Clinical Impression &amp; Evaluation Findings:
                                        </span>
                                        <span className="font-mono text-[10px] text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                          {rep.report_number}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-500">
                                        DPDP Compliant Cryptographic Record
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                                          Provisional Clinical Diagnosis / Findings
                                        </span>
                                        <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                                          {rep.diagnosis || 'Clinical evaluation completed and authenticated under RCI CRR No. A79214.'}
                                        </p>
                                      </div>

                                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                                          Clinical Recommendations &amp; Care Pathway
                                        </span>
                                        <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                                          {rep.recommendations || 'Regular follow-up and clinical rehabilitation protocol advised.'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Footer details inside accordion drawer */}
                                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span>Authenticated Clinician: <strong className="text-slate-800">{rep.examiner || 'Dr. Shreeharsh Shivpuje'}</strong></span>
                                        <span>•</span>
                                        <span>Verification Link: <strong className="font-mono text-purple-950">vaaniclinic.com/verify-doc/{rep.report_number}</strong></span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleViewDownloadReport(rep)}
                                          className="text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer"
                                        >
                                          Open Full Official Document ↗
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                          <p className="font-semibold text-slate-700">No matching clinical reports found.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or discipline filter.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Excel Pagination Controls */}
              <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    value={reportPageSize}
                    onChange={(e) => {
                      setReportPageSize(Number(e.target.value));
                      setReportCurrentPage(1);
                    }}
                    className="h-6 px-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-[11px] text-slate-400">|</span>
                  <span className="text-[11px]">
                    Page <strong className="text-slate-900">{reportCurrentPage}</strong> of{' '}
                    <strong className="text-slate-900">{totalReportPages}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={reportCurrentPage <= 1}
                    onClick={() => setReportCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalReportPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReportCurrentPage(num)}
                      className={`h-6 w-6 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                        num === reportCurrentPage
                          ? 'bg-purple-900 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={reportCurrentPage >= totalReportPages}
                    onClick={() => setReportCurrentPage((p) => Math.min(totalReportPages, p + 1))}
                    className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Case History */}
            {clinical?.caseHistory && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>3.1 Structured Clinical Case History (Section 5.5.20)</span>
                  <span className="text-[10px] text-slate-500 font-mono">First Encounter Baseline</span>
                </div>
                <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chief Complaint</span>
                      <p className="font-semibold text-slate-900">{clinical.caseHistory.chiefComplaint}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">History of Presenting Illness (HOPI)</span>
                      <p className="text-slate-700">{clinical.caseHistory.hopi}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Developmental Milestones</span>
                      <p className="text-slate-700">{clinical.caseHistory.milestones}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prenatal &amp; Natal Summary</span>
                      <p className="text-slate-700">{clinical.caseHistory.prenatalNatal || `${clinical.caseHistory.prenatal || ''} ${clinical.caseHistory.natal || ''}`}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medical, Otologic &amp; Systemic History</span>
                      <p className="text-slate-700">{clinical.caseHistory.medicalHistory}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Feeding &amp; Swallowing Function</span>
                      <p className="text-slate-700">{clinical.caseHistory.feedingSwallowing}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audiology Battery */}
            {(clinical?.audiology || clinical?.audiologyScreen) && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>3.2 Audiology &amp; Otological Diagnostic Battery (Section 5.5.22)</span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 text-[10px]">
                    PTA, Speech, Immittance, OAE &amp; ABR
                  </span>
                </div>
                <div className="p-3.5 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Otoscopy Findings</span>
                      <p className="font-semibold text-slate-800">
                        {clinical?.audiology?.otoscopy || clinical?.audiologyScreen?.otoscopy || 'Bilateral normal clear canals'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PTA Pure Tone Audiogram Impression</span>
                      <p className="font-semibold text-purple-950">
                        {clinical?.audiology?.ptaImpression || clinical?.audiologyScreen?.ptaSummary || 'Normal hearing thresholds bilaterally'}
                      </p>
                    </div>
                  </div>

                  {/* Detailed metrics */}
                  {(clinical?.audiology?.ptaMetrics || clinical?.audiologyScreen?.audiogramMetrics) && (
                    <div className="p-2.5 rounded bg-purple-50/40 border border-purple-200 space-y-2">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Calibrated Diagnostic Metrics &amp; Speech Audiometry
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Right Ear 3-Freq Average:</span>
                          <strong className="text-slate-900">
                            {clinical?.audiology?.ptaMetrics?.rightPTA || clinical?.audiologyScreen?.audiogramMetrics?.ptaRight3Freq || 'N/A'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Left Ear 3-Freq Average:</span>
                          <strong className="text-slate-900">
                            {clinical?.audiology?.ptaMetrics?.leftPTA || clinical?.audiologyScreen?.audiogramMetrics?.ptaLeft3Freq || 'N/A'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Air-Bone Gap (ABG):</span>
                          <strong className="text-slate-900">
                            {clinical?.audiology?.ptaMetrics?.abg || clinical?.audiologyScreen?.audiogramMetrics?.airBoneGap || 'N/A'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Infant BERA if present */}
                  {clinical?.audiologyScreen?.beraAbrMetrics && (
                    <div className="p-2.5 rounded bg-indigo-50/50 border border-indigo-200 space-y-1 font-mono text-xs">
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block font-sans">
                        Auditory Brainstem Response (BERA / ABR) Waveform Latencies
                      </span>
                      <p><span className="font-semibold">Stimulus:</span> {clinical.audiologyScreen.beraAbrMetrics.stimulus}</p>
                      <p><span className="font-semibold">Wave Latencies:</span> {clinical.audiologyScreen.beraAbrMetrics.waveLatencies90dB}</p>
                      <p><span className="font-semibold">Wave V Threshold:</span> <strong className="text-purple-900">{clinical.audiologyScreen.beraAbrMetrics.waveVThreshold}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Speech & Language Battery */}
            {clinical?.speechLanguage && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>3.3 Speech-Language, Fluency &amp; Voice Evaluation (Section 5.5.21)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Standardized Protocols</span>
                </div>
                <div className="p-3.5 space-y-3 text-xs">
                  {clinical.speechLanguage.opme && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Oral Peripheral Mechanism Examination (OPME) &amp; DDK Rates
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p className="text-slate-700"><strong>Lips &amp; Tongue:</strong> {clinical.speechLanguage.opme.lipsTongue || `${clinical.speechLanguage.opme.lips || ''} ${clinical.speechLanguage.opme.tongue || ''}`}</p>
                        <p className="text-slate-700"><strong>Palate:</strong> {clinical.speechLanguage.opme.palate}</p>
                      </div>
                      <p className="text-slate-700"><strong>DDK Syllables:</strong> <span className="font-mono text-purple-900 font-bold">{clinical.speechLanguage.opme.ddkRates}</span></p>
                    </div>
                  )}

                  {clinical.speechLanguage.articulation && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Articulation &amp; Phonological Inventory
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">PCC Metric:</span>
                          <strong className="text-purple-950 font-bold">{clinical.speechLanguage.articulation.pcc}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Stimulability:</span>
                          <span className="text-slate-800 font-medium">{clinical.speechLanguage.articulation.stimulability}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Speech Intelligibility:</span>
                          <span className="text-slate-800 font-medium">{clinical.speechLanguage.articulation.intelligibility}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {clinical.speechLanguage.voiceAssessment && (
                    <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                        Voice Diagnostic Battery (GRBAS, MPT, Acoustic Metrics, VHI-10)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-slate-700">
                        <div>
                          <span className="text-slate-500 block">GRBAS Perceptual:</span>
                          <strong className="font-mono text-slate-900">{clinical.speechLanguage.voiceAssessment.perceptualGrbas}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Max Phonation Time:</span>
                          <strong className="font-mono text-slate-900">{clinical.speechLanguage.voiceAssessment.maximumPhonationTime}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">s/z Ratio:</span>
                          <strong className="font-mono text-slate-900">{clinical.speechLanguage.voiceAssessment.szRatio}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">VHI-10 Handicap:</span>
                          <strong className="font-mono text-slate-900">{clinical.speechLanguage.voiceAssessment.vhi10Score}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {clinical.speechLanguage.fluencyBattery && (
                    <div className="p-2.5 rounded bg-purple-50/50 border border-purple-200 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Stuttering Severity Instrument (SSI-4) &amp; Disfluency Metrics
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">% Syllables Stuttered:</span>
                          <strong className="font-mono text-purple-950">{clinical.speechLanguage.fluencyBattery.percentSyllablesStuttered}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">SSI-4 Total Score:</span>
                          <strong className="font-mono text-purple-950">{clinical.speechLanguage.fluencyBattery.ssi4TotalScore}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">OASES Impact Score:</span>
                          <strong className="font-mono text-slate-900">{clinical.speechLanguage.fluencyBattery.oasesScore}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CBT Psychology */}
            {clinical?.cbtPsychology && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>3.4 Cognitive Behavioural Therapy (CBT) Encrypted Record (Section 5.5.29)</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded font-mono font-bold border border-emerald-200">
                    Restricted Access
                  </span>
                </div>
                <div className="p-3.5 space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-purple-50/50 border border-purple-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                      Psychometric Scale Scores
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                      <p><span className="font-semibold text-slate-700">PHQ-9:</span> <strong className="text-slate-900">{clinical.cbtPsychology.psychometrics?.phq9Score}</strong></p>
                      <p><span className="font-semibold text-slate-700">GAD-7:</span> <strong className="text-slate-900">{clinical.cbtPsychology.psychometrics?.gad7Score}</strong></p>
                      <p><span className="font-semibold text-slate-700">THI Progress:</span> <strong className="text-purple-950">{clinical.cbtPsychology.psychometrics?.thiScoreProgress}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: HEARING AIDS & DEVICES (SECTION 5.5.26)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'hearingAids' && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
              <span>Hearing Aid Dispensing &amp; Device Register (Section 5.5.26)</span>
              <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                Serial Tracking &amp; Warranty
              </span>
            </div>

            <div className="p-3.5 space-y-3 text-xs">
              {hearingAids?.dispensed ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hearingAids.instruments ? (
                      hearingAids.instruments.map((inst, i) => (
                        <div key={i} className="p-3 rounded border border-purple-200 bg-purple-50/20 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs">{inst.side}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {inst.status}
                            </span>
                          </div>
                          <p className="font-bold text-purple-950 text-sm">{inst.make}</p>
                          <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                            <p>Style: <span className="font-sans font-medium text-slate-800">{inst.style}</span></p>
                            <p>Serial: <strong className="text-slate-900">{inst.serial}</strong></p>
                            <p>Battery: <span className="font-sans font-medium text-slate-800">{inst.battery}</span></p>
                            <p>Warranty Until: <span className="text-emerald-700 font-bold">{inst.warrantyUntil}</span></p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3 rounded border border-purple-200 bg-purple-50/20 space-y-1.5">
                          <span className="font-bold text-slate-900 text-xs block">Right Ear</span>
                          <p className="font-bold text-purple-950 text-sm">{hearingAids.rightEar?.model}</p>
                          <div className="text-[11px] text-slate-600 font-mono">
                            <p>Serial: <strong>{hearingAids.rightEar?.serial}</strong></p>
                            <p>Warranty: <strong className="text-emerald-700">{hearingAids.rightEar?.warrantyUntil}</strong></p>
                          </div>
                        </div>
                        <div className="p-3 rounded border border-purple-200 bg-purple-50/20 space-y-1.5">
                          <span className="font-bold text-slate-900 text-xs block">Left Ear</span>
                          <p className="font-bold text-purple-950 text-sm">{hearingAids.leftEar?.model}</p>
                          <div className="text-[11px] text-slate-600 font-mono">
                            <p>Serial: <strong>{hearingAids.leftEar?.serial}</strong></p>
                            <p>Warranty: <strong className="text-emerald-700">{hearingAids.leftEar?.warrantyUntil}</strong></p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Real-Ear Measurement (REM) &amp; Fitting Verification Target
                    </span>
                    <p className="text-slate-800 font-medium pt-0.5">
                      Target Prescription: NAL-NL2 Adult Binaural achieved within ±2 dB target across 250 Hz to 4000 Hz. Real-Ear Aided Response (REAR) verified.
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No Hearing Aids Dispensed For This Patient</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{hearingAids?.note || 'Diagnostic thresholds within normal limits or conservative management in progress.'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: THERAPY GOALS & SOAP (SECTION 5.5.27 & 5.5.28)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'therapy' && (
          <div className="space-y-3">
            {/* Active Therapy Plan */}
            {(therapy?.plan || therapy?.activePlan) && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>5.1 Active Clinical Rehabilitation Plan (Section 5.5.27)</span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 font-mono font-bold">
                    {therapy?.plan?.planId || therapy?.activePlan?.planId}
                  </span>
                </div>
                <div className="p-3.5 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {therapy?.plan?.title || therapy?.activePlan?.title}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Assigned: {therapy?.plan?.assignedClinician || therapy?.activePlan?.assignedClinician}
                      </p>
                    </div>
                    <div className="text-left sm:text-right text-[11px] text-slate-500 font-mono">
                      <p>Schedule: <strong className="text-slate-800">{therapy?.plan?.frequency || therapy?.activePlan?.frequency}</strong></p>
                      <p>Review: {therapy?.plan?.reviewDate || therapy?.activePlan?.reviewDate}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Long-Term Goal</span>
                    <p className="font-semibold text-slate-800 pt-0.5">
                      {therapy?.plan?.longTermGoal || therapy?.activePlan?.longTermGoal}
                    </p>
                  </div>

                  {/* SMART Objectives Table */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Short-Term SMART Objectives &amp; Mastery Tracking
                    </span>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3">Objective Description</th>
                            <th className="py-1.5 px-2 text-center w-20">Baseline</th>
                            <th className="py-1.5 px-2 text-center w-20">Target</th>
                            <th className="py-1.5 px-3 text-center w-28">Current Progress</th>
                            <th className="py-1.5 px-2 text-center w-24">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(therapy?.plan?.smartObjectives || therapy?.activePlan?.smartObjectives || []).map((obj) => (
                            <tr key={obj.id} className="hover:bg-purple-50/20">
                              <td className="py-1.5 px-3 text-slate-800 font-medium">{obj.text}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-slate-500">{obj.baseline}</td>
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800">{obj.target}</td>
                              <td className="py-1.5 px-3 text-center font-mono font-bold text-purple-950">{obj.currentProgress}</td>
                              <td className="py-1.5 px-2 text-center">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase ${
                                  obj.status === 'ACHIEVED'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-purple-50 text-purple-800 border-purple-200'
                                }`}>
                                  {obj.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Latest SOAP Note */}
            {therapy?.latestSoap && (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>5.2 Latest Clinical SOAP Session Note (Section 5.5.28)</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Session #{therapy.latestSoap.sessionNo} • {therapy.latestSoap.date}
                  </span>
                </div>
                <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">S (Subjective)</span>
                    <p className="text-slate-800">{therapy.latestSoap.subjective}</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">O (Objective)</span>
                    <p className="text-slate-800">{therapy.latestSoap.objective}</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">A (Assessment)</span>
                    <p className="text-slate-800">{therapy.latestSoap.assessment}</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">P (Plan &amp; Home Practice)</span>
                    <p className="text-slate-800">{therapy.latestSoap.plan}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 6: BILLING & RECALLS (SECTION 5.5.31 & 5.5.33)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'billing' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
                <span className="font-mono text-lg font-bold text-slate-900">{formatCurrency(financial?.totalBilled || 0)}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Paid</span>
                <span className="font-mono text-lg font-bold text-emerald-700">{formatCurrency(financial?.totalPaid || 0)}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Balance Due</span>
                <span className="font-mono text-lg font-bold text-slate-900">{formatCurrency(financial?.balance || 0)}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                <span>Statutory GST Tax Invoices &amp; Receipts</span>
                <span className="text-[10px] text-slate-500 font-mono">Healthcare 0% Exempt</span>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Invoice #</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Service / Product Description</th>
                    <th className="py-2 px-3 text-right">Fee (₹)</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 font-mono">Payment Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financial?.invoices?.map((inv) => (
                    <tr key={inv.invoiceNo} className="hover:bg-purple-50/20">
                      <td className="py-2 px-3 font-mono font-bold text-purple-950">{inv.invoiceNo}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{inv.date}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{inv.description}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(inv.amount)}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{inv.refNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                <span>Clinical Follow-ups &amp; Recall Schedule (Section 5.5.31)</span>
                <span className="text-[10px] text-slate-500 font-mono">Automated Notifications</span>
              </div>
              <div className="p-3 space-y-2">
                {recalls?.map((rec) => (
                  <div key={rec.id} className="p-2.5 rounded border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-purple-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">{rec.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Due Date: {rec.dueDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                      rec.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 7: STATUTORY RECORD RETENTION HORIZONS & AUDIT (BR-061)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'retention' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                <span>Statutory Record Retention Horizons &amp; Legal Mandate (Section 4.5 &amp; BR-061)</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                  Compliant
                </span>
              </div>

              <div className="p-3.5 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded bg-purple-50/50 border border-purple-200 space-y-1">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                      Clinical EMR Retention Horizon
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{retention?.statutoryHorizon}</p>
                    <p className="text-[11px] text-slate-600 font-medium">Classification: {retention?.classification}</p>
                    <p className="text-[10px] text-slate-500">Legal Mandate: {retention?.governingAct}</p>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Financial Tax Invoice Retention
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{retention?.financialHorizon}</p>
                    <p className="text-[11px] text-slate-600 font-medium">CGST Rules 2017 &amp; Income Tax Act</p>
                    <p className="text-[10px] text-slate-500">Immutable sequential numbering required</p>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cryptographic Audit Trail &amp; SHA-256 Hash Chaining
                  </span>
                  <p className="font-mono text-[11px] text-purple-950 font-bold break-all">
                    {retention?.auditHashChain}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Every read, update, amendment and consent change is cryptographically recorded with operator RCI practitioner stamp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY FOOTER NAVIGATION ── */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-500 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-[11px]">RCI CRR A79214 • Vaani Speech &amp; Hearing Rehabilitation Center</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/patients')}
          className="h-7 px-4 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients Index [Alt+B]</span>
        </button>
      </div>

      {/* ── EMAIL REPORT MODAL ── */}
      {isEmailModalOpen && selectedReportForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-gradient-to-r from-purple-100 via-purple-50 to-white border-b border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-900 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-950">Dispatch Clinical Report via Email</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Ref: {selectedReportForEmail.report_number}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Body &amp; Clinical Summary
                </label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  The official PDF report is digitally signed with clinician registration (RCI CRR A79214) and cryptographically linked to the clinic&apos;s master ledger under the DPDP Act 2023.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="h-8 px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetailPage;
