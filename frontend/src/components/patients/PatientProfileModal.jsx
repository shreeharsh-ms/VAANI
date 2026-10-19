import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
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
} from 'lucide-react';
import { getPatientClinicalDossier } from '../../data/patientClinicalProfiles';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PatientProfileModal = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('demographics');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  const dossier = getPatientClinicalDossier(patient);
  const { demographics, consents, clinical, therapy, hearingAids, financial, recalls, retention } = dossier;

  const edhReport = useMemo(() => {
    if (!patient) return null;
    try {
      const savedReports = JSON.parse(localStorage.getItem('vaani_clinical_reports_v1') || '[]');
      const rep = savedReports.find(
        (r) =>
          (r.uhid === demographics.uhid || r.uhid === patient.id || r.uhid === patient.uhid) &&
          (r.service_code === 'RP-CLN-EDH' || (r.title && r.title.toLowerCase().includes('early dev')))
      );
      if (rep) return rep;
    } catch {}

    try {
      const raw = localStorage.getItem('vaani_edh_' + demographics.uhid);
      if (raw) return JSON.parse(raw);
    } catch {}

    if (patient.earlyDevHistory) return patient.earlyDevHistory;
    return null;
  }, [patient, demographics.uhid]);

  const tabs = [
    { id: 'demographics', label: '1. Identity & Demographics', count: '14 fields' },
    { id: 'consents', label: '2. DPDP Consents', count: `${consents.length} rules` },
    { id: 'clinical', label: '3. Clinical Diagnostics & EMR', count: 'Diagnostic Battery' },
    { id: 'hearingAids', label: '4. Hearing Aids & Devices', count: hearingAids.dispensed ? 'Bilateral' : 'Screened' },
    { id: 'therapy', label: '5. Therapy Goals & SOAP', count: 'Active Plan' },
    { id: 'billing', label: '6. Billing & Recalls', count: `${financial.invoices.length} Invoices` },
    { id: 'retention', label: '7. Retention & Legal Audit', count: 'Statutory' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div
        className="bg-white border border-slate-200/90 rounded-xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* ── TOP CLINICAL BANNER (COMPACT DENSITY) ── */}
        <div className="bg-gradient-to-r from-[#301444] to-[#4a2366] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 shadow-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-extrabold bg-white/15 px-2 py-0.5 rounded border border-white/20 tracking-wider">
              {demographics.uhid}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight">
                  {demographics.fullName}
                </h1>
                {demographics.displayMr && (
                  <span className="text-xs text-purple-200 font-medium hidden md:inline">
                    ({demographics.displayMr})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-purple-200 font-medium">
                <span>{demographics.sex}</span>
                <span>•</span>
                <span>{demographics.ageContextual}</span>
                <span>•</span>
                <span>DOB: {demographics.dob}</span>
                <span>•</span>
                <span className="bg-purple-900/60 text-purple-100 px-1.5 py-0.2 rounded font-mono">
                  {patient.service_line || 'Clinical EMR'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>RCI CRR No. A79214 Certified</span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Print clinical dossier summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
              title="Close dossier (Esc)"
            >
              <span className="hidden sm:inline text-[10px] text-purple-200 font-mono">[Esc]</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── EXCEL-STYLE SHEET TABS STRIP ── */}
        <div className="bg-slate-100/90 border-b border-slate-200 p-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold whitespace-nowrap transition-all duration-100 cursor-pointer ${
                  isActive
                    ? 'bg-[#301444] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-white hover:text-[#301444]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-purple-900/60 text-purple-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT SCROLLABLE BODY (EXCEL COMPACT HIGH-DENSITY GRID) ── */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 font-sans text-xs">
          
          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: DEMOGRAPHICS & IDENTITY DATA (SECTION 4.8 & 5.5.14)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'demographics' && (
            <div className="space-y-3">
              {/* Medical Alerts Bar */}
              {demographics.medicalAlerts && demographics.medicalAlerts.length > 0 && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Active Clinical Alerts:</span>
                  </div>
                  {demographics.medicalAlerts.map((alert, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300"
                    >
                      {alert.label} • {alert.note}
                    </span>
                  ))}
                </div>
              )}

              {/* Grid 1: Primary Identity & Demographics */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>1.1 Patient Master Identity &amp; Demographic Profile</span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    Section 4.8 &amp; 5.5.14
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs">
                  <div className="p-3 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Full Name</span>
                      <span className="font-bold text-slate-800 text-xs">{demographics.fullName}</span>
                      {demographics.displayMr && <span className="text-[11px] text-slate-500 block font-medium">({demographics.displayMr})</span>}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UHID Scheme</span>
                      <span className="font-mono font-bold text-purple-950">{demographics.uhid}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Immutable Sequential ID</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biological Sex &amp; Age</span>
                      <span className="font-semibold text-slate-800">{demographics.sex} • {demographics.ageContextual}</span>
                      <span className="text-[10px] text-slate-400 block">DOB: {demographics.dob}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Contact Phone</span>
                      <span className="font-mono font-bold text-slate-800">{demographics.primaryPhone}</span>
                      <span className="text-[10px] text-emerald-700 block font-medium">
                        ✓ {demographics.preferredChannel} Preferred • {demographics.bestCallingTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alternate Contact &amp; Email</span>
                      <span className="font-mono text-slate-700 block">{demographics.altPhone || 'None'}</span>
                      <span className="text-[11px] text-slate-600 truncate block">{demographics.email || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linguistic Profile</span>
                      <span className="font-semibold text-slate-800 block">{demographics.preferredLanguages.join(' > ')}</span>
                      <span className="text-[10px] text-slate-500 block">Home Language: {demographics.homeLanguages.join(', ')}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Geographic Residence</span>
                      <span className="font-medium text-slate-800 block">{demographics.addressLine1}</span>
                      <span className="text-[11px] text-slate-600 block">{demographics.locality}, Tal. {demographics.taluka}, Dist. {demographics.district}</span>
                      <span className="text-[11px] text-slate-500 font-mono block">PIN: {demographics.pin}, {demographics.state}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Socio-Demographics</span>
                      <span className="font-medium text-slate-800 block">{demographics.occupation}</span>
                      <span className="text-[11px] text-slate-500 block">{demographics.education}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Guardians, Referral & ABHA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Guardians & Caregivers */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                    <span>1.2 Guardians &amp; Legal Caregivers</span>
                    <span className="text-[10px] text-slate-500 font-medium">Mandatory for Minors</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {demographics.guardians.map((g, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">{g.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 border border-purple-200">
                            {g.relation}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                          <span>Phone: {g.phone}</span>
                          <span>{g.occupation}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold text-emerald-800 flex-wrap">
                          <span>✓ Legal Guardian: {g.isLegalGuardian ? 'Yes' : 'No'}</span>
                          <span>•</span>
                          <span>Can Consent: {g.canConsent ? 'Yes' : 'No'}</span>
                          <span>•</span>
                          <span>Pick-up Auth: {g.canPickUp ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>Family Link Group ID:</span>
                      <span className="font-mono font-bold text-slate-800">{demographics.familyGroupId}</span>
                    </div>
                  </div>
                </div>

                {/* Referral Tracking & ABHA Vault */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                    <span>1.3 Referral Partner &amp; ABHA Health Account</span>
                    <span className="text-[10px] text-slate-500 font-medium">DPDP Compliant</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referring Physician</span>
                      <span className="font-bold text-slate-800 text-xs block">{demographics.referral.doctorName}</span>
                      <span className="text-[11px] text-slate-600 block">{demographics.referral.hospital} • {demographics.referral.discipline}</span>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        "{demographics.referral.reason}"
                      </p>
                    </div>

                    <div className="p-2 rounded bg-purple-50/60 border border-purple-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">Ayushman Bharat Health Account (ABHA)</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Encrypted
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-purple-950 block">{demographics.abha.id}</span>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {demographics.abha.statutoryNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: STATUTORY PATIENT CONSENTS (DPDP ACT 2023 & 5.5.15)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'consents' && (
            <div className="space-y-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-emerald-950">
                    DPDP Act 2023 Consent Register &amp; Cryptographic Audit Trail
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  7 Consents Registered
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        <th className="py-2 px-3 w-52">Consent Category</th>
                        <th className="py-2 px-2.5 w-24 text-center">Status</th>
                        <th className="py-2 px-3 w-48">Consenting Grantor</th>
                        <th className="py-2 px-2.5 w-28 text-center">Method</th>
                        <th className="py-2 px-3 w-36 whitespace-nowrap">Timestamp</th>
                        <th className="py-2 px-3 font-mono">Cryptographic SHA-256 Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      {consents.map((c) => (
                        <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-2 px-3">
                            <span className="font-bold text-slate-800 block">{c.type}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{c.legalBasis}</span>
                          </td>
                          <td className="py-2 px-2.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                c.status === 'GRANTED'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-medium">
                            {c.grantor}
                          </td>
                          <td className="py-2 px-2.5 text-center whitespace-nowrap">
                            <span className="text-[10px] font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                              {c.method}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                            {c.timestamp}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-purple-900 truncate max-w-xs">
                            {c.hash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: CLINICAL DIAGNOSTICS & EMR (SECTION 4.9 & 5.5.20 - 5.5.22)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'clinical' && (
            <div className="space-y-3">
              {edhReport ? (
                <div className="bg-white border border-purple-200 rounded-lg overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-2 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-purple-900" />
                      <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                        3.1 Early Developmental History (EDH) Assessment Record
                      </span>
                      <span className="font-mono text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-extrabold border border-purple-300">
                        {edhReport.report_number || 'RP-CLN-EDH'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Exam Date: <strong className="text-slate-800">{edhReport.date || 'Recent'}</strong>
                    </span>
                  </div>

                  <div className="p-3.5 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Chief Developmental Concern
                        </span>
                        <p className="font-semibold text-slate-900 leading-relaxed">
                          {edhReport.chief_complaint || edhReport.diagnosis || edhReport.title || 'Developmental speech-language evaluation.'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Developmental Milestones
                        </span>
                        <p className="text-slate-800 leading-relaxed">
                          {edhReport.milestones || edhReport.developmental_milestones || edhReport.summary || 'Age-appropriate developmental milestones documented.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-2 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                          Prenatal & Natal Summary
                        </span>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {edhReport.prenatal_natal || edhReport.birth_history || 'Full term delivery, normal birth cry.'}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                          Speech & Language Milestones
                        </span>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {edhReport.speech_milestones || edhReport.language_history || 'Babbling at 6m; first words at 12m.'}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                          Medical & Systemic History
                        </span>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {edhReport.medical_history || 'No recurrent otitis media or seizures.'}
                        </p>
                      </div>
                    </div>

                    {edhReport.recommendations && (
                      <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                          Clinical Recommendations
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed">
                          {edhReport.recommendations}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-amber-950">
                            Please Fill Early Dev History for this Patient
                          </h4>
                          <span className="bg-amber-200 text-amber-900 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-amber-900/90 max-w-xl leading-relaxed">
                          No Early Developmental History (EDH) baseline is recorded for <strong>{demographics.fullName}</strong> ({demographics.uhid}).
                          Standardized RCI protocol requires documenting early milestones prior to clinical intervention.
                        </p>
                      </div>
                    </div>

                    <Link
                      to={}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Fill Early Dev History Now</span>
                    </Link>
                  </div>
                </div>
              )}
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: HEARING AIDS & ASSISTIVE DEVICES (SECTION 5.5.26)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'hearingAids' && (
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>Hearing Aid Dispensing &amp; Device Register (Section 5.5.26)</span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-mono font-semibold border border-purple-200">
                    Serial Tracking &amp; Warranty
                  </span>
                </div>

                <div className="p-3">
                  {!hearingAids.dispensed ? (
                    <div className="py-8 text-center text-slate-500 space-y-1">
                      <Info className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-xs text-slate-700">No Hearing Instruments Dispensed to this Patient</p>
                      <p className="text-[11px] text-slate-400">{hearingAids.note}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hearingAids.instruments.map((inst, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#301444]">{inst.side}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {inst.status}
                              </span>
                            </div>
                            <p className="font-bold text-sm text-slate-800">{inst.make}</p>
                            <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                              <p>Style: <span className="font-semibold text-slate-800">{inst.style}</span></p>
                              <p>Serial: <span className="font-bold text-purple-950">{inst.serial}</span></p>
                              <p>Battery: <span className="text-slate-800">{inst.battery}</span></p>
                              <p>Warranty Until: <span className="font-semibold text-emerald-700">{inst.warrantyUntil}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 rounded bg-purple-50/50 border border-purple-200 text-xs text-slate-700 space-y-1">
                        <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                          Real-Ear Measurement (REM) &amp; Fitting Verification Target
                        </span>
                        <p className="text-[11px]">
                          Target Prescription: <span className="font-bold text-slate-900">NAL-NL2 Adult Binaural</span> achieved within ±2 dB target across 250 Hz to 4000 Hz. Real-Ear Aided Response (REAR) verified in sound booth.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: THERAPY PLANS, SMART GOALS & DAILY SOAP NOTES (5.5.27 - 28)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'therapy' && (
            <div className="space-y-3">
              {/* Active Therapy Plan Card */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between flex-wrap gap-1">
                  <span>5.1 Active Clinical Rehabilitation Plan (Section 5.5.27)</span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    {therapy.activePlan.planId}
                  </span>
                </div>

                <div className="p-3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{therapy.activePlan.title}</h4>
                      <p className="text-[11px] text-slate-500">Assigned: {therapy.activePlan.assignedClinician}</p>
                    </div>
                    <div className="text-right text-[11px] font-mono text-slate-600">
                      <span>Schedule: {therapy.activePlan.frequency}</span>
                      <span className="block text-[10px] text-slate-400">Review: {therapy.activePlan.reviewDate}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Long-Term Goal</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5 leading-snug">{therapy.activePlan.longTermGoal}</p>
                  </div>

                  {/* SMART Objectives Table */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Short-Term SMART Objectives &amp; Mastery Tracking
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                            <th className="py-1.5 px-2">Objective Description</th>
                            <th className="py-1.5 px-2 w-20 text-center">Baseline</th>
                            <th className="py-1.5 px-2 w-20 text-center">Target</th>
                            <th className="py-1.5 px-2 w-32 text-center">Current Progress</th>
                            <th className="py-1.5 px-2 w-24 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {therapy.activePlan.smartObjectives.map((obj) => (
                            <tr key={obj.id} className="hover:bg-purple-50/20">
                              <td className="py-1.5 px-2 text-slate-800 font-medium">{obj.text}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-slate-500">{obj.baseline}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-slate-800 font-bold">{obj.target}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-purple-950 font-semibold">{obj.currentProgress}</td>
                              <td className="py-1.5 px-2 text-center">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
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

              {/* Latest SOAP Note (5.5.28) */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>5.2 Latest Clinical SOAP Session Note (Section 5.5.28)</span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    Session #{therapy.latestSoap.sessionNo} • {therapy.latestSoap.date}
                  </span>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">S (Subjective)</span>
                    <p className="text-slate-700 leading-snug">{therapy.latestSoap.subjective}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">O (Objective)</span>
                    <p className="text-slate-700 leading-snug">{therapy.latestSoap.objective}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">A (Assessment)</span>
                    <p className="text-slate-700 leading-snug">{therapy.latestSoap.assessment}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">P (Plan &amp; Home Practice)</span>
                    <p className="text-slate-700 leading-snug">{therapy.latestSoap.plan}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 6: BILLING, GST INVOICES & RECALLS (SECTION 5.5.31 - 34)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              {/* Financial KPI Summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
                  <span className="text-sm font-extrabold text-[#301444] font-mono">{formatCurrency(financial.totalBilled)}</span>
                </div>
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Paid</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">{formatCurrency(financial.totalPaid)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Balance Due</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{formatCurrency(financial.balance)}</span>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>GST Tax Invoices &amp; Receipts</span>
                  <span className="text-[10px] text-slate-500 font-medium">Healthcare 0% Exempt</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                        <th className="py-2 px-3 w-32 font-mono">Invoice #</th>
                        <th className="py-2 px-2.5 w-24">Date</th>
                        <th className="py-2 px-3">Service / Product Description</th>
                        <th className="py-2 px-2.5 w-24 text-right">Fee (₹)</th>
                        <th className="py-2 px-2.5 w-20 text-center">Status</th>
                        <th className="py-2 px-3 w-40 font-mono">Payment Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {financial.invoices.map((inv) => (
                        <tr key={inv.invoiceNo} className="hover:bg-purple-50/20">
                          <td className="py-2 px-3 font-mono font-bold text-purple-950">{inv.invoiceNo}</td>
                          <td className="py-2 px-2.5 text-slate-600 font-mono">{inv.date}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">{inv.description}</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">{formatCurrency(inv.amount)}</td>
                          <td className="py-2 px-2.5 text-center">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[11px] text-slate-500 font-mono truncate max-w-xs">{inv.refNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scheduled Recalls Table */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>Clinical Follow-ups &amp; Recall Schedule (Section 5.5.31)</span>
                  <span className="text-[10px] text-slate-500 font-medium">Automated Notifications</span>
                </div>
                <div className="p-2 space-y-1.5">
                  {recalls.map((rec) => (
                    <div key={rec.id} className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 text-purple-700" />
                        <div>
                          <span className="font-bold text-slate-800 block">{rec.type}</span>
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
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                  <span>Record Retention Horizons &amp; Legal Mandate</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">
                    Compliant
                  </span>
                </div>

                <div className="p-3 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-purple-50/50 border border-purple-200 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Clinical EMR Retention Horizon
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{retention.statutoryHorizon}</p>
                      <p className="text-[11px] text-slate-600 font-medium">Classification: {retention.classification}</p>
                      <p className="text-[10px] text-slate-500">Legal Mandate: {retention.governingAct}</p>
                    </div>

                    <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Financial Tax Invoice Retention
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{retention.financialHorizon}</p>
                      <p className="text-[11px] text-slate-600 font-medium">CGST Rules 2017 &amp; Income Tax Act</p>
                      <p className="text-[10px] text-slate-500">Immutable sequential numbering required</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cryptographic Audit Trail &amp; SHA-256 Hash Chaining
                    </span>
                    <p className="font-mono text-[11px] text-purple-950 font-bold break-all">
                      {retention.auditHashChain}
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

        {/* ── FOOTER BAR ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-[11px]">RCI CRR A79214 • Vaani Speech &amp; Hearing Rehabilitation Center</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 px-4 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white transition-all cursor-pointer shadow-2xs"
          >
            Close Dossier [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
