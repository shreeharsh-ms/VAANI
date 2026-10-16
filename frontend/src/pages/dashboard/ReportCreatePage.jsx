import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Printer,
  Save,
  ArrowLeft,
  User,
  Sparkles,
  CheckCircle2,
  Phone,
  Calendar,
  Building,
  Award,
  ShieldCheck,
  Stethoscope,
  QrCode,
  Eye,
  Sliders,
  Activity,
  X,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { SEED_PATIENTS, PATIENT_DOSSIERS } from '../../data/patientClinicalProfiles';
import Modal from '../../components/common/Modal';
import OfficialClinicalDocument from '../../components/clinical/OfficialClinicalDocument';

export const ReportCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotification();

  // Load all patients from localStorage or SEED_PATIENTS
  const allPatients = useMemo(() => {
    try {
      const stored = localStorage.getItem('vaani_patients_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse vaani_patients_v1', e);
    }
    return SEED_PATIENTS;
  }, []);

  // Determine initial service from query param
  const initialTypeCode = searchParams.get('type') || 'RP-CLN-AUD';
  const initialPatientId = searchParams.get('patientId') || '';

  const [selectedServiceCode, setSelectedServiceCode] = useState(initialTypeCode);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || allPatients[0]?.id || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active Service definition
  const activeService = useMemo(() => {
    return CLINICAL_SERVICES.find((s) => s.code === selectedServiceCode) || CLINICAL_SERVICES[0];
  }, [selectedServiceCode]);

  // Active Patient details + Dossier
  const selectedPatient = useMemo(() => {
    return allPatients.find((p) => p.id === selectedPatientId || p.uhid === selectedPatientId) || allPatients[0];
  }, [allPatients, selectedPatientId]);

  const patientDossier = useMemo(() => {
    if (!selectedPatient?.uhid) return null;
    return PATIENT_DOSSIERS[selectedPatient.uhid] || null;
  }, [selectedPatient]);

  // Form Parameters state for the active report
  const [formData, setFormData] = useState({
    reportNumber: `REP-26-${Math.floor(1000 + Math.random() * 9000)}`,
    reportDate: new Date().toISOString().split('T')[0],
    examinerName: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rciNumber: 'A79214',
    parameters: { ...activeService.defaultParameters },
  });

  // When active service changes, load its default parameters
  useEffect(() => {
    const s = CLINICAL_SERVICES.find((srv) => srv.code === selectedServiceCode);
    if (s) {
      setFormData((prev) => ({
        ...prev,
        parameters: { ...s.defaultParameters },
      }));
    }
  }, [selectedServiceCode]);

  // Keyboard shortcut handler (Cmd/Ctrl + S to save, Cmd/Ctrl + P to preview/print)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveReport();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        triggerPrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, selectedPatient, activeService]);

  // Auto-calculated clinical metrics
  // PTA Average calculation: (500 + 1000 + 2000) / 3
  const computedPTA = useMemo(() => {
    if (activeService.code !== 'RP-CLN-AUD') return null;
    const rAC = formData.parameters.rightEarAC || {};
    const lAC = formData.parameters.leftEarAC || {};
    const rAvg = Math.round(((Number(rAC['500'] || 0) + Number(rAC['1000'] || 0) + Number(rAC['2000'] || 0)) / 3) * 10) / 10;
    const lAvg = Math.round(((Number(lAC['500'] || 0) + Number(lAC['1000'] || 0) + Number(lAC['2000'] || 0)) / 3) * 10) / 10;

    const classify = (avg) => {
      if (avg <= 25) return 'Normal Hearing Sensitivity';
      if (avg <= 40) return 'Mild Hearing Loss';
      if (avg <= 55) return 'Moderate Hearing Loss';
      if (avg <= 70) return 'Moderately Severe Hearing Loss';
      if (avg <= 90) return 'Severe Hearing Loss';
      return 'Profound Hearing Loss';
    };

    return {
      rightAvg: rAvg,
      leftAvg: lAvg,
      rightDegree: classify(rAvg),
      leftDegree: classify(lAvg),
    };
  }, [activeService.code, formData.parameters]);

  // Parameter updater helpers
  const handleParamChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [field]: value,
      },
    }));
  };

  const handleNestedParamChange = (parentField, key, value) => {
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parentField]: {
          ...prev.parameters[parentField],
          [key]: value,
        },
      },
    }));
  };

  // Open full-page official preview in new tab
  const handleOpenPreviewInNewTab = () => {
    const previewPayload = {
      reportNumber: formData.reportNumber,
      reportDate: formData.reportDate,
      examinerName: formData.examinerName,
      rciNumber: formData.rciNumber,
      service: activeService,
      patient: selectedPatient,
      patientDossier: patientDossier,
      parameters: formData.parameters,
      computedPTA: computedPTA,
    };
    try {
      sessionStorage.setItem('vaani_preview_report', JSON.stringify(previewPayload));
    } catch (e) {
      console.warn(e);
    }
    window.open('/dashboard/reports/preview', '_blank');
  };

  // Save report into localStorage
  const handleSaveReport = () => {
    try {
      const existingReports = JSON.parse(localStorage.getItem('vaani_clinical_reports_v1') || '[]');
      const newReportRecord = {
        id: `asmt_${Date.now()}`,
        report_number: formData.reportNumber,
        title: `${activeService.title}`,
        service_code: activeService.code,
        discipline: activeService.discipline,
        patient_id: selectedPatient.id,
        uhid: selectedPatient.uhid,
        patient_name: selectedPatient.full_name,
        patient_age_sex: `${selectedPatient.gender === 'MALE' ? 'Male' : selectedPatient.gender === 'FEMALE' ? 'Female' : 'Other'}, ${selectedPatient.date_of_birth}`,
        guardian: selectedPatient.guardian_name,
        phone: selectedPatient.phone,
        city: selectedPatient.city,
        referring_doctor: patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni (ENT)',
        date: formData.reportDate,
        examiner: formData.examinerName,
        rci_number: formData.rciNumber,
        diagnosis: formData.parameters.provisionalDiagnosis || activeService.description,
        recommendations: formData.parameters.recommendations || 'Follow up as clinically indicated.',
        parameters: formData.parameters,
        computed: computedPTA,
        status: 'FINAL',
        created_at: new Date().toISOString(),
      };

      const updated = [newReportRecord, ...existingReports];
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(updated));

      notify.success(`Report ${formData.reportNumber} saved successfully for ${selectedPatient.full_name}!`);
    } catch (e) {
      console.error(e);
      notify.error('Failed to save report. Please try again.');
    }
  };

  // Robust print execution
  const triggerPrint = () => {
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-3.5 pb-10">
      
      {/* ── EXCLUSIVE DEDICATED PRINT CONTAINER ── */}
      {/* Only visible during window.print(), rendered clean on A4 paper with zero modal or chrome artifacts */}
      <div id="clinical-printable-report" aria-hidden="true">
        <OfficialClinicalDocument
          service={activeService}
          patient={selectedPatient}
          patientDossier={patientDossier}
          formData={formData}
          computedPTA={computedPTA}
        />
      </div>

      {/* ── TOP ACTION BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Reports</span>
          </button>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-700" />
              Clinical Report Intake &amp; Data Entry
            </h1>
            <p className="text-[10px] text-slate-500">
              Input patient findings • Computes diagnostic metrics • Prints official letterhead with clinic logo &amp; RCI CRR No. {formData.rciNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded shadow-2xs transition-colors cursor-pointer"
            title="Save report to clinical records (Ctrl/Cmd + S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Report</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-purple-800/80 text-[9px] rounded font-mono">⌘S</kbd>
          </button>

          <button
            type="button"
            onClick={handleOpenPreviewInNewTab}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded shadow-2xs transition-colors cursor-pointer"
            title="Open official report preview in new tab"
          >
            <Eye className="w-3.5 h-3.5 text-purple-700" />
            <span>Preview in New Tab</span>
          </button>

          <button
            type="button"
            onClick={triggerPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs transition-colors cursor-pointer"
            title="Print Official Document (Ctrl/Cmd + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official PDF</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-slate-700 text-[9px] rounded font-mono">⌘P</kbd>
          </button>
        </div>
      </div>

      {/* ── STEP 1: SERVICE / PROFORMA TEMPLATE SELECTOR ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            1. Select Clinical Service / Proforma Template ({CLINICAL_SERVICES.length} Master Options)
          </span>
          <span className="text-[10px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Active: {activeService.code} — {activeService.shortName}
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CLINICAL_SERVICES.map((srv) => {
            const isSelected = srv.code === selectedServiceCode;
            return (
              <button
                key={srv.code}
                type="button"
                onClick={() => setSelectedServiceCode(srv.code)}
                className={`shrink-0 px-2.5 py-1.5 rounded border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-900 text-white border-purple-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-mono font-bold px-1 rounded ${isSelected ? 'bg-purple-800 text-purple-200' : 'bg-slate-200 text-slate-700'}`}>
                    {srv.code}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap">{srv.shortName}</span>
                </div>
                <span className={`text-[10px] block truncate max-w-[130px] ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                  {srv.discipline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 2: SELECT PATIENT & DEMOGRAPHICS SUMMARY ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              2. Patient Selection &amp; Consultation Context
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {allPatients.length} Registered Patients in System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Patient Dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Select Patient *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-purple-50/60 border border-purple-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-700 cursor-pointer"
            >
              {allPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.uhid} — {p.full_name} ({p.service_line || p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Doc ID & Date */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Report Reference &amp; Date
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={formData.reportNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, reportNumber: e.target.value }))}
                className="w-full text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1.5"
              />
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, reportDate: e.target.value }))}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1.5"
              />
            </div>
          </div>

          {/* Clinician */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Attending Clinician (RCI CRR)
            </label>
            <input
              type="text"
              value={`${formData.examinerName} • CRR: ${formData.rciNumber}`}
              readOnly
              className="w-full text-xs font-semibold text-purple-900 bg-purple-50/40 border border-purple-200 rounded px-2.5 py-1.5"
            />
          </div>
        </div>

        {/* Auto-Populated Demographics Summary Card */}
        {selectedPatient && (
          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">UHID</span>
              <span className="font-mono font-black text-purple-800">{selectedPatient.uhid}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Full Name</span>
              <span className="font-bold text-slate-900 truncate block">{selectedPatient.full_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Age / Sex</span>
              <span className="font-semibold text-slate-700">
                {selectedPatient.gender} • DOB {selectedPatient.date_of_birth}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Contact</span>
              <span className="font-semibold text-slate-700 font-mono">{selectedPatient.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Guardian</span>
              <span className="font-semibold text-slate-700 truncate block">
                {selectedPatient.guardian_name || 'Self'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Referring Doctor</span>
              <span className="font-semibold text-purple-900 truncate block">
                {patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni (ENT)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── STEP 3: CLINICAL PARAMETERS ENTRY FORM ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-700" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              3. Clinical Parameters Entry: {activeService.title} ({activeService.code})
            </h2>
          </div>
          <span className="text-[10px] text-purple-800 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            {activeService.discipline} Module
          </span>
        </div>

        {/* 1. AUDIOLOGY EVALUATION (PTA) ENTRY */}
        {activeService.code === 'RP-CLN-AUD' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Air Conduction (AC) &amp; Bone Conduction (BC) Thresholds (dB HL)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500">Transducer:</span>
                <input
                  type="text"
                  value={formData.parameters.transducer || 'TDH-39 Supra-aural'}
                  onChange={(e) => handleParamChange('transducer', e.target.value)}
                  className="px-2 py-0.5 text-xs border border-slate-200 rounded bg-slate-50 w-44"
                />
              </div>
            </div>

            {/* PTA Input Grid */}
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left">Ear &amp; Conduction</th>
                    <th className="px-2 py-2">250 Hz</th>
                    <th className="px-2 py-2">500 Hz</th>
                    <th className="px-2 py-2">1000 Hz</th>
                    <th className="px-2 py-2">2000 Hz</th>
                    <th className="px-2 py-2">4000 Hz</th>
                    <th className="px-2 py-2">8000 Hz</th>
                    <th className="px-2 py-2 bg-purple-50 text-purple-900">Computed PTA Avg</th>
                    <th className="px-2 py-2 bg-purple-50 text-purple-900">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Right Ear AC (Red) */}
                  <tr className="bg-rose-50/40">
                    <td className="px-3 py-1.5 text-left font-bold text-rose-700">Right Ear (AC)</td>
                    {['250', '500', '1000', '2000', '4000', '8000'].map((freq) => (
                      <td key={freq} className="px-1 py-1">
                        <input
                          type="number"
                          value={formData.parameters.rightEarAC?.[freq] ?? ''}
                          onChange={(e) => handleNestedParamChange('rightEarAC', freq, Number(e.target.value))}
                          className="w-14 text-center py-1 text-xs font-bold text-rose-800 border border-rose-300 rounded bg-white focus:ring-1 focus:ring-rose-500"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 font-mono font-black text-rose-800 bg-rose-50">
                      {computedPTA?.rightAvg} dB HL
                    </td>
                    <td className="px-2 py-1 text-[11px] font-bold text-rose-800 bg-rose-50">
                      {computedPTA?.rightDegree}
                    </td>
                  </tr>

                  {/* Right Ear BC (Red) */}
                  <tr className="bg-rose-50/10">
                    <td className="px-3 py-1.5 text-left font-semibold text-rose-600">Right Ear (BC)</td>
                    {['250', '500', '1000', '2000', '4000'].map((freq) => (
                      <td key={freq} className="px-1 py-1">
                        <input
                          type="number"
                          value={formData.parameters.rightEarBC?.[freq] ?? ''}
                          onChange={(e) => handleNestedParamChange('rightEarBC', freq, Number(e.target.value))}
                          className="w-14 text-center py-1 text-xs font-semibold text-rose-700 border border-rose-200 rounded bg-white"
                        />
                      </td>
                    ))}
                    <td className="text-slate-300">—</td>
                    <td colSpan={2} className="text-[10px] text-slate-400">Bone Conduction Unmasked/Masked</td>
                  </tr>

                  {/* Left Ear AC (Blue) */}
                  <tr className="bg-blue-50/40">
                    <td className="px-3 py-1.5 text-left font-bold text-blue-700">Left Ear (AC)</td>
                    {['250', '500', '1000', '2000', '4000', '8000'].map((freq) => (
                      <td key={freq} className="px-1 py-1">
                        <input
                          type="number"
                          value={formData.parameters.leftEarAC?.[freq] ?? ''}
                          onChange={(e) => handleNestedParamChange('leftEarAC', freq, Number(e.target.value))}
                          className="w-14 text-center py-1 text-xs font-bold text-blue-800 border border-blue-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 font-mono font-black text-blue-800 bg-blue-50">
                      {computedPTA?.leftAvg} dB HL
                    </td>
                    <td className="px-2 py-1 text-[11px] font-bold text-blue-800 bg-blue-50">
                      {computedPTA?.leftDegree}
                    </td>
                  </tr>

                  {/* Left Ear BC (Blue) */}
                  <tr className="bg-blue-50/10">
                    <td className="px-3 py-1.5 text-left font-semibold text-blue-600">Left Ear (BC)</td>
                    {['250', '500', '1000', '2000', '4000'].map((freq) => (
                      <td key={freq} className="px-1 py-1">
                        <input
                          type="number"
                          value={formData.parameters.leftEarBC?.[freq] ?? ''}
                          onChange={(e) => handleNestedParamChange('leftEarBC', freq, Number(e.target.value))}
                          className="w-14 text-center py-1 text-xs font-semibold text-blue-700 border border-blue-100 rounded bg-white"
                        />
                      </td>
                    ))}
                    <td className="text-slate-300">—</td>
                    <td colSpan={2} className="text-[10px] text-slate-400">Bone Conduction Unmasked/Masked</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Speech Audiometry & Immittance Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Speech Audiometry</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-rose-700 font-bold block">Right SRT (dB)</label>
                    <input
                      type="number"
                      value={formData.parameters.rightSRT ?? 35}
                      onChange={(e) => handleParamChange('rightSRT', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-700 font-bold block">Left SRT (dB)</label>
                    <input
                      type="number"
                      value={formData.parameters.leftSRT ?? 25}
                      onChange={(e) => handleParamChange('leftSRT', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-rose-700 font-bold block">Right WRS (%)</label>
                    <input
                      type="number"
                      value={formData.parameters.rightWRS ?? 84}
                      onChange={(e) => handleParamChange('rightWRS', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-700 font-bold block">Left WRS (%)</label>
                    <input
                      type="number"
                      value={formData.parameters.leftWRS ?? 96}
                      onChange={(e) => handleParamChange('leftWRS', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 md:col-span-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Tympanometry &amp; Acoustic Reflexes</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-rose-700 font-bold block">Right Ear Tympanogram</label>
                    <input
                      type="text"
                      value={formData.parameters.tympanometryRight || ''}
                      onChange={(e) => handleParamChange('tympanometryRight', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-blue-700 font-bold block">Left Ear Tympanogram</label>
                    <input
                      type="text"
                      value={formData.parameters.tympanometryLeft || ''}
                      onChange={(e) => handleParamChange('tympanometryLeft', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. OAE SCREENING ENTRY */}
        {activeService.code === 'RP-CLN-OAE' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Stage</label>
                <select
                  value={formData.parameters.stage}
                  onChange={(e) => handleParamChange('stage', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50"
                >
                  <option value="SCREEN_1 (Newborn 0-48h)">SCREEN_1 (Newborn 0-48h)</option>
                  <option value="SCREEN_2 (Rescreen 2-4 wks)">SCREEN_2 (Rescreen 2-4 wks)</option>
                  <option value="DIAGNOSTIC (Confirmatory)">DIAGNOSTIC (Confirmatory)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Technology</label>
                <select
                  value={formData.parameters.technology}
                  onChange={(e) => handleParamChange('technology', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50"
                >
                  <option value="TEOAE (Transient Evoked)">TEOAE (Transient Evoked)</option>
                  <option value="DPOAE (Distortion Product)">DPOAE (Distortion Product)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gestation (Weeks)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.parameters.gestationWeeks}
                  onChange={(e) => handleParamChange('gestationWeeks', Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Birth Weight (g)</label>
                <input
                  type="number"
                  value={formData.parameters.birthWeightG}
                  onChange={(e) => handleParamChange('birthWeightG', Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="px-3 py-1.5 text-left">Frequency</th>
                    <th className="px-3 py-1.5 text-rose-700">Right SNR (dB)</th>
                    <th className="px-3 py-1.5 text-blue-700">Left SNR (dB)</th>
                    <th className="px-3 py-1.5">Right Result</th>
                    <th className="px-3 py-1.5">Left Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(formData.parameters.frequencies || []).map((f, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-1.5 text-left font-bold">{f.freq}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          step="0.1"
                          value={f.rightSNR}
                          onChange={(e) => {
                            const updated = [...formData.parameters.frequencies];
                            updated[idx].rightSNR = Number(e.target.value);
                            handleParamChange('frequencies', updated);
                          }}
                          className="w-16 text-center py-0.5 border border-slate-300 rounded font-mono font-bold text-rose-800"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          step="0.1"
                          value={f.leftSNR}
                          onChange={(e) => {
                            const updated = [...formData.parameters.frequencies];
                            updated[idx].leftSNR = Number(e.target.value);
                            handleParamChange('frequencies', updated);
                          }}
                          className="w-16 text-center py-0.5 border border-slate-300 rounded font-mono font-bold text-blue-800"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${f.rightSNR >= 6 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {f.rightSNR >= 6 ? 'PASS' : 'REFER'}
                        </span>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${f.leftSNR >= 6 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {f.leftSNR >= 6 ? 'PASS' : 'REFER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. VOICE DISORDERS ENTRY */}
        {activeService.code === 'RP-CLN-VOI' && (
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase text-amber-900 block">CAPE-V Scores (0-100 Visual Analog)</span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {['capeV_overall', 'capeV_roughness', 'capeV_breathiness', 'capeV_strain', 'capeV_pitch', 'capeV_loudness'].map((k) => (
                <div key={k} className="p-2 border border-slate-200 rounded bg-slate-50 text-center">
                  <label className="text-[10px] text-slate-500 font-bold block uppercase">{k.replace('capeV_', '')}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.parameters[k] ?? 40}
                    onChange={(e) => handleParamChange(k, Number(e.target.value))}
                    className="w-16 text-center py-1 mt-1 border border-slate-300 rounded font-black text-amber-800 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">MPT /a/ (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.parameters.mptA ?? 9.2}
                  onChange={(e) => handleParamChange('mptA', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">s/z Ratio</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.parameters.szRatio ?? 1.58}
                  onChange={(e) => handleParamChange('szRatio', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">GRBAS Grade (0-3)</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={formData.parameters.grbas_grade ?? 2}
                  onChange={(e) => handleParamChange('grbas_grade', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">VHI-10 Score (/40)</label>
                <input
                  type="number"
                  value={formData.parameters.vhi10Score ?? 24}
                  onChange={(e) => handleParamChange('vhi10Score', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. FLUENCY SSI-4 ENTRY */}
        {activeService.code === 'RP-CLN-FLU' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Total Syllables Spoken</label>
                <input
                  type="number"
                  value={formData.parameters.totalSyllables ?? 450}
                  onChange={(e) => handleParamChange('totalSyllables', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">% Syllables Stuttered (%SS)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.parameters.percentageSS ?? 9.3}
                  onChange={(e) => handleParamChange('percentageSS', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-rose-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Longest Block (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.parameters.longestBlock1 ?? 2.8}
                  onChange={(e) => handleParamChange('longestBlock1', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Overall Severity</label>
                <select
                  value={formData.parameters.severityClassification ?? 'MODERATE'}
                  onChange={(e) => handleParamChange('severityClassification', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-rose-800 bg-rose-50"
                >
                  <option value="VERY MILD">VERY MILD</option>
                  <option value="MILD">MILD</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="SEVERE">SEVERE</option>
                  <option value="VERY SEVERE">VERY SEVERE</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 5. SPEECH-LANGUAGE (ALD-MM) ENTRY */}
        {activeService.code === 'RP-CLN-SLA' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Chronological Age (CA mo)</label>
                <input
                  type="number"
                  value={formData.parameters.chronologicalAgeMonths ?? 34}
                  onChange={(e) => handleParamChange('chronologicalAgeMonths', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Receptive Age (RLA mo)</label>
                <input
                  type="number"
                  value={formData.parameters.receptiveLanguageAge ?? 28}
                  onChange={(e) => handleParamChange('receptiveLanguageAge', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Expressive Age (ELA mo)</label>
                <input
                  type="number"
                  value={formData.parameters.expressiveLanguageAge ?? 20}
                  onChange={(e) => handleParamChange('expressiveLanguageAge', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-rose-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Calculated Delay (mo)</label>
                <input
                  type="number"
                  value={formData.parameters.languageDelayMonths ?? 14}
                  onChange={(e) => handleParamChange('languageDelayMonths', Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-rose-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. OTHER CLINICAL SERVICES */}
        {!['RP-CLN-AUD', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA'].includes(activeService.code) && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Proforma Parameters &amp; Clinical Notes</span>
            <p className="text-slate-600 leading-relaxed">
              Standard clinical parameters for {activeService.title} are pre-loaded with baseline norms. Edit diagnosis and recommendations below.
            </p>
          </div>
        )}

        {/* Clinical Impression & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Clinical Impression &amp; Diagnosis *
            </label>
            <textarea
              rows={3}
              value={formData.parameters.provisionalDiagnosis || ''}
              onChange={(e) => handleParamChange('provisionalDiagnosis', e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white"
              placeholder="Enter clinical impression and diagnosis..."
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Clinical Recommendations &amp; Follow-up Protocol *
            </label>
            <textarea
              rows={3}
              value={formData.parameters.recommendations || ''}
              onChange={(e) => handleParamChange('recommendations', e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white"
              placeholder="Enter management plan, therapy frequency, and follow-up..."
            />
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital stamp linked to RCI CRR No. {formData.rciNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Clinical Report</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPreviewInNewTab}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded shadow-2xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-purple-700" />
              <span>Preview in New Tab</span>
            </button>

            <button
              type="button"
              onClick={triggerPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportCreatePage;
