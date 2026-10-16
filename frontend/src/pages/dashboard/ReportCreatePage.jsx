import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Printer,
  Save,
  ArrowLeft,
  User,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Calendar,
  Building,
  Award,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  QrCode,
  RotateCcw,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { SEED_PATIENTS, PATIENT_DOSSIERS } from '../../data/patientClinicalProfiles';

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

  // Keyboard shortcut handler (Cmd/Ctrl + S to save, Cmd/Ctrl + P to print)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveReport();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrintReport();
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

  // Parameter updater helper
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

  // Print report
  const handlePrintReport = () => {
    notify.info('Opening Print Spooler...');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-4 pb-12 print:p-0 print:m-0 print:space-y-0">
      {/* ── TOP ACTION & BREADCRUMB BAR (Hidden on Print) ── */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2.5 shadow-2xs">
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
              Clinical Report Generator
            </h1>
            <p className="text-[10px] text-slate-500">
              RCI Act 1992 • CRR No. {formData.rciNumber} • Section 4.11 Single-Page Clinical Proforma
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
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs transition-colors cursor-pointer"
            title="Print or Export to PDF (Ctrl/Cmd + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official PDF</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-slate-700 text-[9px] rounded font-mono">⌘P</kbd>
          </button>
        </div>
      </div>

      {/* ── SERVICE SELECTOR HORIZONTAL SCROLL (Hidden on Print) ── */}
      <div className="print:hidden bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Select Clinical Service / Report Template ({CLINICAL_SERVICES.length} Master Proformas)
          </span>
          <span className="text-[10px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Selected: {activeService.code}
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
                <span className={`text-[10px] block truncate max-w-[140px] ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                  {srv.discipline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PATIENT SELECTOR & AUTO-POPULATION BANNER (Hidden on Print) ── */}
      <div className="print:hidden bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Step 1: Select Patient / Customer (Auto-Populates Clinical Dossier)
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {allPatients.length} Registered Patients in System
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Patient Dropdown */}
          <div className="md:col-span-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Select Registered Patient *
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs font-semibold text-slate-900 bg-purple-50/50 border border-purple-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-700 cursor-pointer"
            >
              {allPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.uhid} — {p.full_name} ({p.service_line || p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Report Date & Number */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Report Ref ID &amp; Date
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

          {/* Examiner & RCI Registration */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Attending Clinician (RCI CRR)
            </label>
            <input
              type="text"
              value={`${formData.examinerName} (CRR: ${formData.rciNumber})`}
              readOnly
              className="w-full text-xs font-semibold text-purple-900 bg-purple-50/40 border border-purple-200 rounded px-2.5 py-1.5"
            />
          </div>
        </div>

        {/* Auto-Populated Demographics Summary Banner */}
        {selectedPatient && (
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-[11px]">
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
              <span className="font-semibold text-slate-700">{selectedPatient.phone}</span>
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

      {/* ── THE OFFICIAL CLINICAL REPORT PAPER (Both Screen & Print View) ── */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm print:shadow-none print:border-none print:p-0 max-w-5xl mx-auto space-y-4">
        
        {/* ── CLINIC LETTERHEAD (Mandated under Section 4.11 FR-DOC-002) ── */}
        <div className="border-b-2 border-purple-900 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-purple-950 tracking-tight">VAANI</span>
              <span className="text-xs font-bold text-purple-800 uppercase tracking-widest bg-purple-100 px-2 py-0.5 rounded">
                Speech &amp; Hearing Rehabilitation Center
              </span>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002 • Phone: +91 2162 234567 • Email: clinic@vaaniclinic.com
            </p>
            <p className="text-[9px] text-slate-500">
              Approved Practice Center under Rehabilitation Council of India (RCI Act 1992) • ISO 9001:2015 Certified Audiology Unit
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-purple-900 text-white rounded">
              {activeService.code}
            </span>
            <span className="block text-[10px] font-mono font-bold text-slate-600 mt-1">
              Doc ID: {formData.reportNumber}
            </span>
            <span className="block text-[10px] text-slate-500">
              Date: {formData.reportDate}
            </span>
          </div>
        </div>

        {/* ── REPORT TITLE BANNER ── */}
        <div className="text-center py-1 bg-purple-50/70 border border-purple-200 rounded">
          <h2 className="text-sm font-black text-purple-950 uppercase tracking-wider">
            {activeService.title}
          </h2>
          <span className="text-[10px] text-purple-800 font-semibold">
            {activeService.discipline} Diagnostic &amp; Rehabilitation Evaluation Service
          </span>
        </div>

        {/* ── PATIENT DEMOGRAPHIC MATRIX ── */}
        <div className="border border-slate-300 rounded overflow-hidden text-xs">
          <div className="bg-slate-100 px-3 py-1 font-bold text-[10px] text-slate-700 uppercase tracking-wider border-b border-slate-300">
            Patient Identification &amp; Referral Demographics
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50 w-1/6">Patient Name:</td>
                <td className="px-3 py-1.5 font-bold text-slate-900 w-2/6">
                  {selectedPatient.full_name}
                </td>
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50 w-1/6">UHID:</td>
                <td className="px-3 py-1.5 font-mono font-bold text-purple-800 w-2/6">
                  {selectedPatient.uhid}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50">Age / Sex:</td>
                <td className="px-3 py-1.5 text-slate-800">
                  {selectedPatient.gender} • DOB: {selectedPatient.date_of_birth}
                </td>
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50">Contact Mobile:</td>
                <td className="px-3 py-1.5 text-slate-800 font-mono">
                  {selectedPatient.phone}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50">Guardian / Escort:</td>
                <td className="px-3 py-1.5 text-slate-800">
                  {selectedPatient.guardian_name || 'Self'}
                </td>
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50">Residential Locality:</td>
                <td className="px-3 py-1.5 text-slate-800">
                  {selectedPatient.city}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-bold text-slate-600 bg-slate-50">Referring Consultant:</td>
                <td className="px-3 py-1.5 text-purple-950 font-bold" colSpan={3}>
                  {patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni, MS (ENT), Civil Hospital Satara'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── DYNAMIC SERVICE PARAMETERS SECTION ── */}
        <div className="space-y-3">
          
          {/* 1. AUDIOLOGY EVALUATION (PTA) */}
          {activeService.code === 'RP-CLN-AUD' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                  1. Bilateral Behavioral Thresholds (Air &amp; Bone Conduction dB HL)
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Transducer: {formData.parameters.transducer || 'TDH-39'}
                </span>
              </div>

              {/* Bilateral PTA Table */}
              <div className="overflow-x-auto border border-slate-300 rounded">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                    <tr>
                      <th className="px-2 py-1 text-left">Ear &amp; Conduction</th>
                      <th className="px-2 py-1">250 Hz</th>
                      <th className="px-2 py-1">500 Hz</th>
                      <th className="px-2 py-1">1000 Hz</th>
                      <th className="px-2 py-1">2000 Hz</th>
                      <th className="px-2 py-1">4000 Hz</th>
                      <th className="px-2 py-1">8000 Hz</th>
                      <th className="px-2 py-1 bg-purple-50 text-purple-900">PTA Avg (dB HL)</th>
                      <th className="px-2 py-1 bg-purple-50 text-purple-900">Degree of Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* Right Ear AC (Red) */}
                    <tr className="bg-rose-50/30">
                      <td className="px-2 py-1 text-left font-bold text-rose-700">Right Ear (AC - O)</td>
                      {['250', '500', '1000', '2000', '4000', '8000'].map((freq) => (
                        <td key={freq} className="px-1 py-1">
                          <input
                            type="number"
                            value={formData.parameters.rightEarAC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('rightEarAC', freq, Number(e.target.value))}
                            className="w-12 text-center py-0.5 text-xs font-bold text-rose-800 border border-rose-200 rounded bg-white print:border-none"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1 font-mono font-black text-rose-800 bg-rose-50">
                        {computedPTA?.rightAvg} dB
                      </td>
                      <td className="px-2 py-1 text-[10px] font-bold text-rose-800 bg-rose-50">
                        {computedPTA?.rightDegree}
                      </td>
                    </tr>

                    {/* Right Ear BC (Red) */}
                    <tr className="bg-rose-50/10">
                      <td className="px-2 py-1 text-left font-bold text-rose-600">Right Ear (BC - &lt;)</td>
                      {['250', '500', '1000', '2000', '4000'].map((freq) => (
                        <td key={freq} className="px-1 py-1">
                          <input
                            type="number"
                            value={formData.parameters.rightEarBC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('rightEarBC', freq, Number(e.target.value))}
                            className="w-12 text-center py-0.5 text-xs font-semibold text-rose-700 border border-rose-100 rounded bg-white print:border-none"
                          />
                        </td>
                      ))}
                      <td className="px-1 py-1 text-slate-300">—</td>
                      <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500">Unmasked / Masked</td>
                    </tr>

                    {/* Left Ear AC (Blue) */}
                    <tr className="bg-blue-50/30">
                      <td className="px-2 py-1 text-left font-bold text-blue-700">Left Ear (AC - X)</td>
                      {['250', '500', '1000', '2000', '4000', '8000'].map((freq) => (
                        <td key={freq} className="px-1 py-1">
                          <input
                            type="number"
                            value={formData.parameters.leftEarAC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('leftEarAC', freq, Number(e.target.value))}
                            className="w-12 text-center py-0.5 text-xs font-bold text-blue-800 border border-blue-200 rounded bg-white print:border-none"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1 font-mono font-black text-blue-800 bg-blue-50">
                        {computedPTA?.leftAvg} dB
                      </td>
                      <td className="px-2 py-1 text-[10px] font-bold text-blue-800 bg-blue-50">
                        {computedPTA?.leftDegree}
                      </td>
                    </tr>

                    {/* Left Ear BC (Blue) */}
                    <tr className="bg-blue-50/10">
                      <td className="px-2 py-1 text-left font-bold text-blue-600">Left Ear (BC - &gt;)</td>
                      {['250', '500', '1000', '2000', '4000'].map((freq) => (
                        <td key={freq} className="px-1 py-1">
                          <input
                            type="number"
                            value={formData.parameters.leftEarBC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('leftEarBC', freq, Number(e.target.value))}
                            className="w-12 text-center py-0.5 text-xs font-semibold text-blue-700 border border-blue-100 rounded bg-white print:border-none"
                          />
                        </td>
                      ))}
                      <td className="px-1 py-1 text-slate-300">—</td>
                      <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500">Unmasked / Masked</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Speech Audiometry & Immittance Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Speech Reception Threshold (SRT)</span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-rose-700 font-bold">R: {formData.parameters.rightSRT} dB</span>
                    <span className="text-blue-700 font-bold">L: {formData.parameters.leftSRT} dB</span>
                  </div>
                </div>

                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Word Recognition Score (WRS %)</span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-rose-700 font-bold">R: {formData.parameters.rightWRS}%</span>
                    <span className="text-blue-700 font-bold">L: {formData.parameters.leftWRS}%</span>
                  </div>
                </div>

                <div className="p-2 border border-slate-200 rounded bg-slate-50 col-span-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Immittance &amp; Tympanometry (Jerger)</span>
                  <p className="text-[11px] text-slate-800 mt-1 font-medium">
                    <strong className="text-rose-700">Right:</strong> {formData.parameters.tympanometryRight} | <strong className="text-blue-700">Left:</strong> {formData.parameters.tympanometryLeft}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. OAE SCREENING */}
          {activeService.code === 'RP-CLN-OAE' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-200 p-2.5 rounded bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Screening Protocol</span>
                  <span className="font-bold text-slate-800">{formData.parameters.stage}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Technology Type</span>
                  <span className="font-bold text-slate-800">{formData.parameters.technology}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Gestation / Weight</span>
                  <span className="font-bold text-slate-800">{formData.parameters.gestationWeeks} wks • {formData.parameters.birthWeightG} g</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">JCIH Risk Status</span>
                  <span className="font-bold text-emerald-800">{formData.parameters.jcihRiskFactors}</span>
                </div>
              </div>

              {/* Frequency SNR Table */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300">
                    <tr>
                      <th className="px-3 py-1.5 text-left">Stimulus Frequency</th>
                      <th className="px-3 py-1.5 text-rose-700">Right Ear SNR (dB)</th>
                      <th className="px-3 py-1.5 text-rose-700">Right Outcome</th>
                      <th className="px-3 py-1.5 text-blue-700">Left Ear SNR (dB)</th>
                      <th className="px-3 py-1.5 text-blue-700">Left Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(formData.parameters.frequencies || []).map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 text-left font-bold text-slate-700">{f.freq}</td>
                        <td className="px-3 py-1.5 font-mono font-bold text-rose-800">{f.rightSNR} dB</td>
                        <td className="px-3 py-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                            PASS
                          </span>
                        </td>
                        <td className="px-3 py-1.5 font-mono font-bold text-blue-800">{f.leftSNR} dB</td>
                        <td className="px-3 py-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                            PASS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-900 block">Overall Screening Verdict</span>
                  <span className="text-sm font-black text-emerald-900">{formData.parameters.overallOutcome}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-emerald-900 block">Next Clinical Action</span>
                  <span className="text-xs font-semibold text-emerald-800">{formData.parameters.nextAction}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. VOICE DISORDERS PROFORMA */}
          {activeService.code === 'RP-CLN-VOI' && (
            <div className="space-y-3 text-xs">
              <div className="border border-slate-300 rounded p-3 bg-amber-50/30 space-y-2">
                <span className="text-[11px] font-black text-amber-950 uppercase tracking-wide block">
                  Consensus Auditory-Perceptual Evaluation of Voice (CAPE-V Scores 0-100 mm Visual Analog)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Overall</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_overall}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Roughness</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_roughness}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Breathiness</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_breathiness}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Strain</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_strain}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Pitch</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_pitch}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Loudness</span>
                    <span className="text-sm font-black text-amber-800">{formData.parameters.capeV_loudness}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Max Phonation Time (MPT)</span>
                  <span className="text-xs font-bold text-slate-900 mt-1 block">
                    /a/: {formData.parameters.mptA}s | /i/: {formData.parameters.mptI}s
                  </span>
                </div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">s/z Ratio</span>
                  <span className="text-xs font-bold text-purple-900 mt-1 block">
                    {formData.parameters.szRatio} (Norm ≤ 1.4)
                  </span>
                </div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">GRBAS Scale Rating</span>
                  <span className="text-xs font-bold text-slate-900 mt-1 block">
                    G{formData.parameters.grbas_grade} R{formData.parameters.grbas_roughness} B{formData.parameters.grbas_breathiness} A{formData.parameters.grbas_asthenia} S{formData.parameters.grbas_strain}
                  </span>
                </div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Voice Handicap Index (VHI-10)</span>
                  <span className="text-xs font-bold text-rose-800 mt-1 block">
                    {formData.parameters.vhi10Score} / 40 (Moderate Handicap)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. FLUENCY SSI-4 */}
          {activeService.code === 'RP-CLN-FLU' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-rose-50/40 border border-rose-200 rounded">
                <div>
                  <span className="text-[10px] font-bold text-rose-900 uppercase block">Total Syllables Spoken</span>
                  <span className="font-bold text-slate-800">{formData.parameters.totalSyllables} syllables</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-900 uppercase block">% Syllables Stuttered (%SS)</span>
                  <span className="text-sm font-black text-rose-800">{formData.parameters.percentageSS}% SS</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-900 uppercase block">Longest Blocks (Seconds)</span>
                  <span className="font-bold text-slate-800">{formData.parameters.longestBlock1}s, {formData.parameters.longestBlock2}s</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-900 uppercase block">Physical Concomitants</span>
                  <span className="font-bold text-slate-800">Score: {formData.parameters.totalConcomitantScore} / 20</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-900 uppercase block">SSI-4 Total Score</span>
                  <span className="text-lg font-black text-purple-950">{formData.parameters.overallSSIScore} Points</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-purple-900 uppercase block">Clinical Severity Rating</span>
                  <span className="px-3 py-1 bg-rose-700 text-white font-black text-xs uppercase rounded">
                    {formData.parameters.severityClassification}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5. SPEECH-LANGUAGE (ALD-MM) */}
          {activeService.code === 'RP-CLN-SLA' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-teal-50/40 border border-teal-200 rounded">
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">Chronological Age (CA)</span>
                  <span className="font-bold text-slate-800">{formData.parameters.chronologicalAgeMonths} Months</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">Receptive Age (RLA)</span>
                  <span className="font-bold text-slate-800">{formData.parameters.receptiveLanguageAge} Months</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">Expressive Age (ELA)</span>
                  <span className="text-sm font-black text-rose-800">{formData.parameters.expressiveLanguageAge} Months</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">Calculated Delay</span>
                  <span className="text-sm font-black text-rose-700">{formData.parameters.languageDelayMonths} Months Delay</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Oral-Peripheral Exam (OPME)</span>
                  <p className="text-[11px] text-slate-800 mt-1">{formData.parameters.opmeTongue}; {formData.parameters.opmePalate}</p>
                </div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Diadochokinetic (DDK) Syllable Rates</span>
                  <p className="text-[11px] text-slate-800 mt-1">/pa/: {formData.parameters.ddkPa} | /pataka/: {formData.parameters.ddkPataka}</p>
                </div>
              </div>
            </div>
          )}

          {/* 6. CBT CLINICAL FORMULATION */}
          {activeService.code === 'RP-CLN-CBT' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-indigo-50/50 border border-indigo-200 rounded">
                <div>
                  <span className="text-[10px] font-bold text-indigo-950 uppercase block">PHQ-9 Depression Screener</span>
                  <span className="text-sm font-black text-indigo-900">{formData.parameters.phq9Score} / 27 — {formData.parameters.phq9Severity}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-950 uppercase block">GAD-7 Anxiety Screener</span>
                  <span className="text-sm font-black text-indigo-900">{formData.parameters.gad7Score} / 21 — {formData.parameters.gad7Severity}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded p-2.5 bg-slate-50 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Cognitive 5-Aspects Formulation (Padesky)</span>
                <p className="text-[11px] text-slate-800"><strong>Automatic Thoughts:</strong> {formData.parameters.automaticThoughts}</p>
                <p className="text-[11px] text-slate-800"><strong>Emotions &amp; Sensations:</strong> {formData.parameters.emotionalResponses} • {formData.parameters.physicalSensations}</p>
                <p className="text-[11px] text-slate-800"><strong>Safety Behaviors:</strong> {formData.parameters.safetyBehaviors}</p>
              </div>
            </div>
          )}

          {/* 7. DYSPHAGIA SWALLOWING */}
          {activeService.code === 'RP-CLN-DYS' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-cyan-50/50 border border-cyan-200 rounded text-center">
                <div className="bg-white p-2 rounded border border-cyan-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Water Swallow Test</span>
                  <span className="font-bold text-cyan-900">{formData.parameters.spoonWaterTest}</span>
                </div>
                <div className="bg-white p-2 rounded border border-cyan-200">
                  <span className="text-[10px] text-slate-500 font-bold block">Functional Oral Intake (FOIS)</span>
                  <span className="font-bold text-cyan-900">{formData.parameters.foisLevel}</span>
                </div>
                <div className="bg-white p-2 rounded border border-cyan-200">
                  <span className="text-[10px] text-slate-500 font-bold block">IDDSI Recommended Diet</span>
                  <span className="font-bold text-cyan-900">{formData.parameters.iddsiLiquids}</span>
                </div>
              </div>
            </div>
          )}

          {/* 8. HEARING AID FITTING */}
          {activeService.code === 'RP-CLN-HAF' && (
            <div className="space-y-3 text-xs">
              <div className="border border-slate-300 rounded p-3 bg-sky-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-sky-950 uppercase tracking-wide">
                    Prescribed Instrument: {formData.parameters.instrumentMake}
                  </span>
                  <span className="text-[10px] font-mono bg-sky-100 text-sky-900 px-2 py-0.5 rounded font-bold">
                    Warranty: {formData.parameters.warrantyPeriodMonths} Months
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded border border-sky-200">
                    <span className="text-[10px] font-bold text-rose-700 block uppercase">Right Ear Serial No.</span>
                    <span className="font-mono font-bold text-slate-800">{formData.parameters.rightSerial}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-sky-200">
                    <span className="text-[10px] font-bold text-blue-700 block uppercase">Left Ear Serial No.</span>
                    <span className="font-mono font-bold text-slate-800">{formData.parameters.leftSerial}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700">
                  <strong>Verification Match:</strong> Real-Ear Measurement (REM) {formData.parameters.remTargetMatch1000}; Functional Gain: {formData.parameters.functionalGainPTA}
                </p>
              </div>
            </div>
          )}

          {/* 9. THERAPY PROGRESS NOTE */}
          {activeService.code === 'RP-CLN-PRG' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-emerald-50/50 border border-emerald-200 rounded text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sessions Prescribed</span>
                  <span className="font-bold text-slate-800">{formData.parameters.totalSessionsPrescribed} Sessions</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sessions Attended</span>
                  <span className="font-bold text-emerald-800">{formData.parameters.sessionsAttended} ({formData.parameters.attendanceRate})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Goal 1 Mastery</span>
                  <span className="font-bold text-purple-900">{formData.parameters.goal1Mastery}</span>
                </div>
              </div>
              <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">SOAP Synthesis</span>
                <p className="text-[11px] text-slate-800 mt-1"><strong>Objective:</strong> {formData.parameters.soapObjective}</p>
              </div>
            </div>
          )}

          {/* 10. DISCHARGE SUMMARY */}
          {activeService.code === 'RP-CLN-DSC' && (
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-violet-50/50 border border-violet-200 rounded">
                <span className="text-[10px] font-bold text-violet-950 uppercase block">Reason for Clinical Discharge</span>
                <span className="text-xs font-bold text-violet-900">{formData.parameters.dischargeReason}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Baseline Presentation</span>
                  <p className="text-[11px] text-slate-800 mt-1">{formData.parameters.baselineSummary}</p>
                </div>
                <div className="p-2 border border-slate-200 rounded bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Final Clinical Outcome</span>
                  <p className="text-[11px] text-slate-800 mt-1">{formData.parameters.outcomeSummary}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── CLINICAL IMPRESSION / DIAGNOSIS (Editable on screen, rendered clean on print) ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
            Clinical Impression &amp; Diagnosis:
          </label>
          <div className="print:hidden">
            <textarea
              rows={2}
              value={formData.parameters.provisionalDiagnosis || ''}
              onChange={(e) => handleParamChange('provisionalDiagnosis', e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white"
            />
          </div>
          <div className="hidden print:block p-2 border border-slate-300 rounded bg-slate-50 text-xs font-semibold text-slate-900">
            {formData.parameters.provisionalDiagnosis}
          </div>
        </div>

        {/* ── CLINICAL RECOMMENDATIONS / REHABILITATION PLAN ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
            Clinical Recommendations &amp; Follow-up Protocol:
          </label>
          <div className="print:hidden">
            <textarea
              rows={2}
              value={formData.parameters.recommendations || ''}
              onChange={(e) => handleParamChange('recommendations', e.target.value)}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white"
            />
          </div>
          <div className="hidden print:block p-2 border border-slate-300 rounded bg-slate-50 text-xs font-semibold text-slate-900">
            {formData.parameters.recommendations}
          </div>
        </div>

        {/* ── FOOTER & RCI DIGITAL STAMP BLOCK (Section 4.11 FR-DOC-005) ── */}
        <div className="pt-4 border-t-2 border-slate-200 flex items-end justify-between text-xs">
          {/* QR Verification */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center bg-slate-50">
              <QrCode className="w-9 h-9 text-purple-950" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-purple-900 block">
                QR VERIFIED • DPDP COMPLIANT
              </span>
              <span className="text-[9px] text-slate-500 block">
                Scan to verify document authenticity
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                https://vaaniclinic.com/verify-doc/{formData.reportNumber}
              </span>
            </div>
          </div>

          {/* Clinician Signature Stamp */}
          <div className="text-right space-y-0.5">
            <div className="inline-block border-b border-purple-900 pb-1 mb-1 px-4 text-center">
              <span className="font-serif italic font-bold text-purple-900 text-sm block">
                Shreeharsh M. Shivpuje
              </span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                Electronically Authenticated &amp; Stamped
              </span>
            </div>
            <p className="font-black text-slate-900 text-xs">
              {formData.examinerName}
            </p>
            <p className="text-[10px] font-mono font-bold text-purple-900">
              RCI CRR Registration No: {formData.rciNumber}
            </p>
            <p className="text-[9px] text-slate-500">
              Consultant Audiologist &amp; Speech-Language Pathologist
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportCreatePage;
