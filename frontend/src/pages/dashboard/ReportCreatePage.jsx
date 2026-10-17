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
  ListPlus,
  Edit3,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { SEED_PATIENTS, PATIENT_DOSSIERS } from '../../data/patientClinicalProfiles';
import { DualAudiogramSection } from '../../components/clinical/AudiogramGraph';
import { EarlyDevelopmentalHistoryForm } from '../../components/clinical/EarlyDevelopmentalHistoryForm';
import { FluencyDisordersForm } from '../../components/clinical/FluencyDisordersForm';
import { VoiceDisordersForm } from '../../components/clinical/VoiceDisordersForm';


export const ReportCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotification();

  // Load all patients from localStorage or SEED_PATIENTS (Stateful so edits sync immediately)
  const [allPatients, setAllPatients] = useState(() => {
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
  });

  // Patient Quick Edit Modal state
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [patientEditForm, setPatientEditForm] = useState({
    full_name: '',
    gender: 'MALE',
    date_of_birth: '',
    phone: '',
    guardian_name: '',
    guardian_phone: '',
    city: '',
    service_line: 'AUDIOLOGY',
    referringDoctor: '',
  });

  // Determine initial service from query param (supports type, service, code, id)
  const serviceParam = searchParams.get('type') || searchParams.get('service') || searchParams.get('code') || '';
  const matchedService = CLINICAL_SERVICES.find(
    (s) => s.code.toLowerCase() === serviceParam.toLowerCase() || s.id.toLowerCase() === serviceParam.toLowerCase()
  );
  const initialTypeCode = matchedService ? matchedService.code : 'RP-CLN-AUD';

  const patientParam = searchParams.get('patientId') || searchParams.get('patient') || searchParams.get('uhid') || '';
  const matchedPatient = allPatients.find(
    (p) => p.id === patientParam || p.uhid === patientParam
  );
  const initialPatientId = matchedPatient ? matchedPatient.id : (allPatients[0]?.id || '');

  const [selectedServiceCode, setSelectedServiceCode] = useState(initialTypeCode);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
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

  // Open Patient Quick Edit Modal
  const handleOpenEditPatient = () => {
    if (!selectedPatient) return;
    setPatientEditForm({
      full_name: selectedPatient.full_name || '',
      gender: selectedPatient.gender || 'MALE',
      date_of_birth: selectedPatient.date_of_birth || '',
      phone: selectedPatient.phone || '',
      guardian_name: selectedPatient.guardian_name || '',
      guardian_phone: selectedPatient.guardian_phone || selectedPatient.phone || '',
      city: selectedPatient.city || '',
      service_line: selectedPatient.service_line || 'AUDIOLOGY',
      referringDoctor: patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni (ENT)',
    });
    setIsEditPatientModalOpen(true);
  };

  // Save updated patient information (persists to localStorage & updates active session)
  const handleSavePatientEdit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const updatedPatients = allPatients.map((p) => {
      if (p.id === selectedPatient.id || p.uhid === selectedPatient.uhid) {
        return {
          ...p,
          full_name: patientEditForm.full_name,
          gender: patientEditForm.gender,
          date_of_birth: patientEditForm.date_of_birth,
          phone: patientEditForm.phone,
          guardian_name: patientEditForm.guardian_name,
          guardian_phone: patientEditForm.guardian_phone,
          city: patientEditForm.city,
          service_line: patientEditForm.service_line,
        };
      }
      return p;
    });

    setAllPatients(updatedPatients);
    localStorage.setItem('vaani_patients_v1', JSON.stringify(updatedPatients));

    // Also update PATIENT_DOSSIERS in-memory if matching
    if (selectedPatient.uhid && PATIENT_DOSSIERS[selectedPatient.uhid]) {
      const d = PATIENT_DOSSIERS[selectedPatient.uhid].demographics;
      d.fullName = patientEditForm.full_name;
      d.sex = patientEditForm.gender;
      d.dob = patientEditForm.date_of_birth;
      d.primaryPhone = patientEditForm.phone;
      d.referringDoctor = patientEditForm.referringDoctor;
      d.locality = patientEditForm.city;
      if (d.guardians && d.guardians[0]) {
        d.guardians[0].name = patientEditForm.guardian_name;
        d.guardians[0].phone = patientEditForm.guardian_phone;
      }
    }

    notify.success(`Patient ${selectedPatient.uhid} profile updated across system.`);
    setIsEditPatientModalOpen(false);
  };

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
  // PTA Average calculation: (500 + 1000 + 2000) / 3 and 4-freq PTA 2: (500 + 1000 + 2000 + 4000) / 4
  const computedPTA = useMemo(() => {
    if (!['RP-CLN-AUD', 'RP-CLN-AAE'].includes(activeService.code)) return null;
    const rAC = formData.parameters.rightEarAC || {};
    const lAC = formData.parameters.leftEarAC || {};
    const rAvg = Math.round(((Number(rAC['500'] || 0) + Number(rAC['1000'] || 0) + Number(rAC['2000'] || 0)) / 3) * 10) / 10;
    const lAvg = Math.round(((Number(lAC['500'] || 0) + Number(lAC['1000'] || 0) + Number(lAC['2000'] || 0)) / 3) * 10) / 10;
    const rAvg4 = Math.round(((Number(rAC['500'] || 0) + Number(rAC['1000'] || 0) + Number(rAC['2000'] || 0) + Number(rAC['4000'] || 0)) / 4) * 10) / 10;
    const lAvg4 = Math.round(((Number(lAC['500'] || 0) + Number(lAC['1000'] || 0) + Number(lAC['2000'] || 0) + Number(lAC['4000'] || 0)) / 4) * 10) / 10;

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
      rightAvg4: rAvg4,
      leftAvg4: lAvg4,
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

  // Audiology quick preset applicator
  const applyAudiologyPreset = (type) => {
    if (type === 'sample_case') {
      setFormData((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          audiometer: 'Proton SX5',
          responses: 'Consistent',
          ptaNo: '64/2026',
          transducer: 'TDH-39 Supra-aural Earphones',
          rightEarAC: { '125': 20, '250': 20, '500': 25, '750': 28, '1000': 30, '1500': 35, '2000': 40, '3000': 48, '4000': 55, '6000': 58, '8000': 60 },
          leftEarAC: { '125': 15, '250': 15, '500': 20, '750': 22, '1000': 25, '1500': 28, '2000': 30, '3000': 32, '4000': 35, '6000': 38, '8000': 40 },
          rightEarBC: { '250': 15, '500': 20, '1000': 25, '2000': 35, '4000': 50 },
          leftEarBC: { '250': 10, '500': 15, '1000': 20, '2000': 25, '4000': 30 },
          rightPTA: '31.7 dB',
          leftPTA: '25.0 dB',
          rightPTA2: '41.7 dB',
          leftPTA2: '30.0 dB',
          rightSDT: '30 dB',
          leftSDT: '20 dB',
          rightSRT: '35 dB',
          leftSRT: '25 dB',
          rightWRS: '84% at 70 dB',
          leftWRS: '96% at 65 dB',
          rightMCL: '75 dB',
          leftMCL: '65 dB',
          rightUCL: '95 dB',
          leftUCL: '90 dB',
          rightRinne: '+ve',
          leftRinne: '+ve',
          weber: 'Lateralized to Left',
          provisionalDiagnosis: '• Bilateral mild-to-moderate sensorineural hearing loss, greater in high frequencies.',
          recommendations: '• Bilateral digital hearing aid trial (Receiver-in-Canal, RIC).\n• Annual audiometric monitoring.',
        },
      }));
      notify.info('Applied Clinic Case Preset');
    } else if (type === 'normal') {
      const normalAC = { '125': 15, '250': 15, '500': 15, '750': 15, '1000': 15, '1500': 15, '2000': 15, '3000': 15, '4000': 15, '6000': 15, '8000': 15 };
      const normalBC = { '250': 10, '500': 10, '1000': 10, '2000': 10, '4000': 10 };
      setFormData((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          responses: 'Consistent',
          rightEarAC: { ...normalAC },
          leftEarAC: { ...normalAC },
          rightEarBC: { ...normalBC },
          leftEarBC: { ...normalBC },
          rightPTA: '15 dB',
          leftPTA: '15 dB',
          rightPTA2: '15 dB',
          leftPTA2: '15 dB',
          rightSDT: '15 dB',
          leftSDT: '15 dB',
          rightSRT: '15 dB',
          leftSRT: '15 dB',
          rightWRS: '100% at 50 dB',
          leftWRS: '100% at 50 dB',
          rightMCL: '55 dB',
          leftMCL: '55 dB',
          rightUCL: '90 dB',
          leftUCL: '90 dB',
          rightRinne: '+ve',
          leftRinne: '+ve',
          weber: 'Central',
          provisionalDiagnosis: '• Bilateral hearing sensitivity within normal limits.\n• Symmetrical bilateral air conduction thresholds.',
          recommendations: '• Routine hearing conservation.\n• Repeat evaluation if concern arises.',
        },
      }));
      notify.info('Applied Normal Hearing Preset');
    } else if (type === 'conductive') {
      setFormData((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          responses: 'Consistent',
          rightEarAC: { '125': 45, '250': 50, '500': 50, '750': 45, '1000': 45, '1500': 40, '2000': 35, '3000': 30, '4000': 30, '6000': 25, '8000': 20 },
          leftEarAC: { '125': 15, '250': 15, '500': 15, '750': 15, '1000': 15, '1500': 15, '2000': 15, '3000': 15, '4000': 15, '6000': 15, '8000': 15 },
          rightEarBC: { '250': 10, '500': 10, '1000': 10, '2000': 10, '4000': 10 },
          leftEarBC: { '250': 10, '500': 10, '1000': 10, '2000': 10, '4000': 10 },
          rightPTA: '43.3 dB',
          leftPTA: '15.0 dB',
          rightPTA2: '40.0 dB',
          leftPTA2: '15.0 dB',
          rightSDT: '40 dB',
          leftSDT: '15 dB',
          rightSRT: '45 dB',
          leftSRT: '15 dB',
          rightWRS: '96% at 80 dB',
          leftWRS: '100% at 50 dB',
          rightMCL: '75 dB',
          leftMCL: '55 dB',
          rightUCL: '100 dB',
          leftUCL: '90 dB',
          rightRinne: '-ve',
          leftRinne: '+ve',
          weber: 'Lateralized to Right',
          provisionalDiagnosis: '• Right ear moderate conductive hearing loss with significant air-bone gap (35-40 dB).\n• Left ear within normal limits.',
          recommendations: '• ENT evaluation for middle ear pathology / Otoscopic examination.\n• Repeat audiometry post medical clearance.',
        },
      }));
      notify.info('Applied Conductive Loss Preset');
    }
  };

  // Bullet point helpers for Clinical Impression & Recommendations
  const addBulletPoint = (fieldName) => {
    const currentVal = formData.parameters[fieldName] || '';
    const trimmed = currentVal.trim();
    let newVal = '';
    if (!trimmed) {
      newVal = '• ';
    } else {
      newVal = trimmed + '\n• ';
    }
    handleParamChange(fieldName, newVal);
  };

  const formatAsBullets = (fieldName) => {
    const currentVal = formData.parameters[fieldName] || '';
    if (!currentVal.trim()) return;
    let lines = currentVal.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 1 && lines[0].includes('.')) {
      lines = lines[0].split('.').map((s) => s.trim()).filter(Boolean);
    }
    const bulleted = lines
      .map((line) => {
        const clean = line.replace(/^[•\-\*]\s*|\d+[\.\)]\s*/, '').trim();
        return clean ? `• ${clean}${clean.endsWith('.') ? '' : '.'}` : '';
      })
      .filter(Boolean)
      .join('\n');
    handleParamChange(fieldName, bulleted);
  };

  const handleBulletKeyDown = (e, fieldName) => {
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value } = textarea;
      const currentLine = value.substring(0, selectionStart).split('\n').pop();

      if (currentLine.trim().startsWith('•') || currentLine.trim().startsWith('-')) {
        e.preventDefault();
        // If user hits enter on an empty bullet line, exit bullet mode
        if (currentLine.trim() === '•' || currentLine.trim() === '-') {
          const beforeLine = value.substring(0, selectionStart - currentLine.length);
          const after = value.substring(selectionEnd);
          const newValue = beforeLine + after;
          handleParamChange(fieldName, newValue);
          return;
        }
        const prefix = '\n• ';
        const newValue = value.substring(0, selectionStart) + prefix + value.substring(selectionEnd);
        handleParamChange(fieldName, newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + prefix.length;
        }, 0);
      }
    }
  };

  // Open full-page official preview in new tab
  const handleOpenPreviewInNewTab = (autoPrint = false) => {
    if (!selectedPatient) {
      notify.error('Please select a patient before previewing report.');
      return;
    }

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
    const url = autoPrint === true ? '/dashboard/reports/preview?print=1' : '/dashboard/reports/preview';
    window.open(url, '_blank');
  };

  // Robust print execution - opens dedicated clean document tab with print triggered
  const triggerPrint = () => {
    handleOpenPreviewInNewTab(true);
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

  return (
    <div className="space-y-3.5 pb-10">
      
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenEditPatient}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 transition-all cursor-pointer shadow-2xs"
              title="Edit Patient Information for this report & profile"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-700" />
              <span>Edit Patient Info</span>
            </button>
            <span className="text-[10px] text-slate-500">
              {allPatients.length} Registered Patients in System
            </span>
          </div>
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
          <div className="bg-purple-50/30 border border-purple-200/80 rounded-md p-3 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">UHID</span>
                <span className="font-mono font-black text-purple-800">{selectedPatient.uhid}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Full Name</span>
                <span className="font-bold text-slate-900 truncate block">{selectedPatient.full_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Age / Sex</span>
                <span className="font-semibold text-slate-700">
                  {selectedPatient.gender} • DOB {selectedPatient.date_of_birth}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Contact</span>
                <span className="font-semibold text-slate-700 font-mono">{selectedPatient.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Guardian</span>
                <span className="font-semibold text-slate-700 truncate block">
                  {selectedPatient.guardian_name || 'Self'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">Referring Doctor</span>
                  <span className="font-semibold text-purple-900 truncate block">
                    {patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni (ENT)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEditPatient}
                  className="p-1 rounded text-purple-700 hover:text-purple-950 hover:bg-purple-100 transition-colors cursor-pointer"
                  title="Update Patient Information"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
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

        {/* 1. AUDIOLOGY EVALUATION (PTA & DUAL AUDIOGRAM) ENTRY */}
        {['RP-CLN-AUD', 'RP-CLN-AAE'].includes(activeService.code) && (
          <div className="space-y-4">
            {/* Context & Test Metadata Bar */}
            <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/60 pb-2">
                <span className="text-[11px] font-black text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-700" />
                  Test Context &amp; Patient Responses
                </span>
                
                {/* Clinical Preset Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyAudiologyPreset('sample_case')}
                    className="px-2 py-0.5 text-[10px] font-bold text-purple-800 bg-white hover:bg-purple-100 border border-purple-300 rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    ★ Clinic Sample Case
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAudiologyPreset('normal')}
                    className="px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Normal (15 dB)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAudiologyPreset('conductive')}
                    className="px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-white hover:bg-amber-50 border border-amber-300 rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Conductive Loss (A-B Gap)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Audiometer Model
                  </label>
                  <input
                    type="text"
                    value={formData.parameters.audiometer || 'Proton SX5'}
                    onChange={(e) => handleParamChange('audiometer', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-semibold border border-purple-200 rounded bg-white"
                    placeholder="e.g. Proton SX5 / Interacoustics"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    PTA Record No.
                  </label>
                  <input
                    type="text"
                    value={formData.parameters.ptaNo || '64/2026'}
                    onChange={(e) => handleParamChange('ptaNo', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono font-bold border border-purple-200 rounded bg-white text-purple-950"
                    placeholder="e.g. 64/2026"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Transducer
                  </label>
                  <input
                    type="text"
                    value={formData.parameters.transducer || 'TDH-39 Supra-aural Earphones'}
                    onChange={(e) => handleParamChange('transducer', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-semibold border border-purple-200 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Patient Responses
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {['Consistent', 'Fairly Consistent', 'Inconsistent'].map((resp) => {
                      const isSelected = (formData.parameters.responses || 'Consistent') === resp;
                      return (
                        <button
                          key={resp}
                          type="button"
                          onClick={() => handleParamChange('responses', resp)}
                          className={`flex-1 py-1 text-[9.5px] font-bold rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-purple-700 text-white border-purple-800 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {resp === 'Fairly Consistent' ? 'Fairly' : resp}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE DUAL AUDIOGRAM FORMATION PREVIEW (Forms graph dynamically as clinician types) */}
            <div className="border border-purple-300 rounded-lg p-3 bg-slate-50/60 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-700 animate-pulse"></span>
                  Real-Time Audiogram Formation Visualizer
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Plots Right Ear (Red ○ / &lt;) &amp; Left Ear (Blue ✕ / &gt;) side-by-side with official legend
                </span>
              </div>
              <div className="overflow-x-auto">
                <DualAudiogramSection
                  rightAC={formData.parameters.rightEarAC}
                  rightBC={formData.parameters.rightEarBC}
                  leftAC={formData.parameters.leftEarAC}
                  leftBC={formData.parameters.leftEarBC}
                  className="shadow-inner"
                />
              </div>
            </div>

            {/* Comprehensive Octave & Inter-Octave Threshold Entry Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                  Air Conduction (AC) &amp; Bone Conduction (BC) Pure-Tone Thresholds (dB HL)
                </span>
                <span className="text-[10px] text-purple-700 font-bold">
                  Range: -10 dB to 120 dB HL
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-slate-100 text-[10px] font-black text-slate-700 uppercase tracking-wider border-b border-slate-300">
                    <tr>
                      <th className="px-2.5 py-2 text-left w-36">Ear &amp; Conduction</th>
                      {['125', '250', '500', '750', '1000', '1500', '2000', '3000', '4000', '6000', '8000'].map((freq) => (
                        <th key={freq} className="px-1.5 py-2 font-mono">
                          {freq}<br /><span className="text-[8px] font-normal text-slate-500">Hz</span>
                        </th>
                      ))}
                      <th className="px-2 py-2 bg-purple-100 text-purple-950 font-black">PTA Avg</th>
                      <th className="px-2 py-2 bg-purple-100 text-purple-950 font-black">Degree</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* Right Ear AC (Red) */}
                    <tr className="bg-rose-50/50">
                      <td className="px-2.5 py-1.5 text-left font-black text-rose-700">
                        <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-rose-600 mr-1.5 align-middle"></span>
                        Right Ear (AC)
                      </td>
                      {['125', '250', '500', '750', '1000', '1500', '2000', '3000', '4000', '6000', '8000'].map((freq) => (
                        <td key={freq} className="px-0.5 py-1">
                          <input
                            type="number"
                            min={-10}
                            max={120}
                            step={5}
                            value={formData.parameters.rightEarAC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('rightEarAC', freq, e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-11 text-center py-1 text-xs font-bold text-rose-800 border border-rose-300 rounded bg-white focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1 font-mono font-black text-rose-900 bg-rose-100/70">
                        {computedPTA?.rightAvg !== undefined ? `${computedPTA.rightAvg} dB` : '—'}
                      </td>
                      <td className="px-2 py-1 text-[10.5px] font-bold text-rose-900 bg-rose-100/70">
                        {computedPTA?.rightDegree || '—'}
                      </td>
                    </tr>

                    {/* Right Ear BC (Red) */}
                    <tr className="bg-rose-50/20">
                      <td className="px-2.5 py-1.5 text-left font-semibold text-rose-700">
                        <span className="inline-block font-mono font-black text-rose-600 mr-1.5">&lt;</span>
                        Right Ear (BC)
                      </td>
                      {['125', '250', '500', '750', '1000', '1500', '2000', '3000', '4000', '6000', '8000'].map((freq) => {
                        const isBcSupported = ['250', '500', '1000', '2000', '4000'].includes(freq);
                        return (
                          <td key={freq} className="px-0.5 py-1">
                            {isBcSupported ? (
                              <input
                                type="number"
                                min={-10}
                                max={80}
                                step={5}
                                value={formData.parameters.rightEarBC?.[freq] ?? ''}
                                onChange={(e) => handleNestedParamChange('rightEarBC', freq, e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-11 text-center py-1 text-xs font-semibold text-rose-700 border border-rose-200 rounded bg-white"
                              />
                            ) : (
                              <span className="text-slate-300 font-mono text-[11px]">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td colSpan={2} className="px-2 py-1 text-[9.5px] text-slate-500 bg-slate-50 italic">
                        Unmasked / Masked Bone Conduction
                      </td>
                    </tr>

                    {/* Left Ear AC (Blue) */}
                    <tr className="bg-blue-50/50">
                      <td className="px-2.5 py-1.5 text-left font-black text-blue-700">
                        <span className="inline-block font-mono font-black text-blue-600 mr-1.5">✕</span>
                        Left Ear (AC)
                      </td>
                      {['125', '250', '500', '750', '1000', '1500', '2000', '3000', '4000', '6000', '8000'].map((freq) => (
                        <td key={freq} className="px-0.5 py-1">
                          <input
                            type="number"
                            min={-10}
                            max={120}
                            step={5}
                            value={formData.parameters.leftEarAC?.[freq] ?? ''}
                            onChange={(e) => handleNestedParamChange('leftEarAC', freq, e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-11 text-center py-1 text-xs font-bold text-blue-800 border border-blue-300 rounded bg-white focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1 font-mono font-black text-blue-900 bg-blue-100/70">
                        {computedPTA?.leftAvg !== undefined ? `${computedPTA.leftAvg} dB` : '—'}
                      </td>
                      <td className="px-2 py-1 text-[10.5px] font-bold text-blue-900 bg-blue-100/70">
                        {computedPTA?.leftDegree || '—'}
                      </td>
                    </tr>

                    {/* Left Ear BC (Blue) */}
                    <tr className="bg-blue-50/20">
                      <td className="px-2.5 py-1.5 text-left font-semibold text-blue-700">
                        <span className="inline-block font-mono font-black text-blue-600 mr-1.5">&gt;</span>
                        Left Ear (BC)
                      </td>
                      {['125', '250', '500', '750', '1000', '1500', '2000', '3000', '4000', '6000', '8000'].map((freq) => {
                        const isBcSupported = ['250', '500', '1000', '2000', '4000'].includes(freq);
                        return (
                          <td key={freq} className="px-0.5 py-1">
                            {isBcSupported ? (
                              <input
                                type="number"
                                min={-10}
                                max={80}
                                step={5}
                                value={formData.parameters.leftEarBC?.[freq] ?? ''}
                                onChange={(e) => handleNestedParamChange('leftEarBC', freq, e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-11 text-center py-1 text-xs font-semibold text-blue-700 border border-blue-200 rounded bg-white"
                              />
                            ) : (
                              <span className="text-slate-300 font-mono text-[11px]">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td colSpan={2} className="px-2 py-1 text-[9.5px] text-slate-500 bg-slate-50 italic">
                        Unmasked / Masked Bone Conduction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AUDIOMETRIC SUMMARY & SPEECH AUDIOMETRY TABLE ENTRY */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide block">
                Audiometric Summary &amp; Speech Audiometry Metrics (Report Table)
              </span>

              <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-slate-100 text-[10px] font-black text-slate-700 uppercase tracking-wider border-b border-slate-300">
                    <tr>
                      <th className="px-2 py-1.5 text-left w-24">Ear</th>
                      <th className="px-2 py-1.5">PTA (dB HL)</th>
                      <th className="px-2 py-1.5">PTA 2 (dB HL)</th>
                      <th className="px-2 py-1.5">SDT (dB HL)</th>
                      <th className="px-2 py-1.5">SRT (dB HL)</th>
                      <th className="px-2 py-1.5">WRS % at _ dBHL</th>
                      <th className="px-2 py-1.5">MCL (dB HL)</th>
                      <th className="px-2 py-1.5">UCL (dB HL)</th>
                      <th className="px-2 py-1.5">Rinne</th>
                      <th className="px-2 py-1.5">Weber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* Right Ear */}
                    <tr className="bg-rose-50/30">
                      <td className="px-2.5 py-1.5 text-left font-black text-rose-700">Right Ear</td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightPTA || (computedPTA?.rightAvg ? `${computedPTA.rightAvg} dB` : '31.7 dB')}
                          onChange={(e) => handleParamChange('rightPTA', e.target.value)}
                          className="w-18 text-center py-1 font-bold text-rose-800 border border-rose-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightPTA2 || (computedPTA?.rightAvg4 ? `${computedPTA.rightAvg4} dB` : '41.7 dB')}
                          onChange={(e) => handleParamChange('rightPTA2', e.target.value)}
                          className="w-18 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightSDT || '30 dB'}
                          onChange={(e) => handleParamChange('rightSDT', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightSRT || '35 dB'}
                          onChange={(e) => handleParamChange('rightSRT', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightWRS || '84% at 70 dB'}
                          onChange={(e) => handleParamChange('rightWRS', e.target.value)}
                          className="w-24 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                          placeholder="e.g. 84% at 70 dB"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightMCL || '75 dB'}
                          onChange={(e) => handleParamChange('rightMCL', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightUCL || '95 dB'}
                          onChange={(e) => handleParamChange('rightUCL', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.rightRinne || '+ve'}
                          onChange={(e) => handleParamChange('rightRinne', e.target.value)}
                          className="w-16 text-center py-1 font-bold text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td rowSpan={2} className="px-2 py-1 align-middle bg-slate-50 border-l border-slate-200">
                        <input
                          type="text"
                          value={formData.parameters.weber || 'Lateralized to Left'}
                          onChange={(e) => handleParamChange('weber', e.target.value)}
                          className="w-32 text-center py-1.5 font-bold text-purple-950 border border-purple-300 rounded bg-white text-xs"
                          placeholder="Central / Lat to Left"
                        />
                      </td>
                    </tr>

                    {/* Left Ear */}
                    <tr className="bg-blue-50/30">
                      <td className="px-2.5 py-1.5 text-left font-black text-blue-700">Left Ear</td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftPTA || (computedPTA?.leftAvg ? `${computedPTA.leftAvg} dB` : '25.0 dB')}
                          onChange={(e) => handleParamChange('leftPTA', e.target.value)}
                          className="w-18 text-center py-1 font-bold text-blue-800 border border-blue-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftPTA2 || (computedPTA?.leftAvg4 ? `${computedPTA.leftAvg4} dB` : '30.0 dB')}
                          onChange={(e) => handleParamChange('leftPTA2', e.target.value)}
                          className="w-18 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftSDT || '20 dB'}
                          onChange={(e) => handleParamChange('leftSDT', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftSRT || '25 dB'}
                          onChange={(e) => handleParamChange('leftSRT', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftWRS || '96% at 65 dB'}
                          onChange={(e) => handleParamChange('leftWRS', e.target.value)}
                          className="w-24 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                          placeholder="e.g. 96% at 65 dB"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftMCL || '65 dB'}
                          onChange={(e) => handleParamChange('leftMCL', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftUCL || '90 dB'}
                          onChange={(e) => handleParamChange('leftUCL', e.target.value)}
                          className="w-16 text-center py-1 text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                      <td className="px-1 py-1">
                        <input
                          type="text"
                          value={formData.parameters.leftRinne || '+ve'}
                          onChange={(e) => handleParamChange('leftRinne', e.target.value)}
                          className="w-16 text-center py-1 font-bold text-slate-800 border border-slate-300 rounded bg-white text-xs"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
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

            {/* Quick Outcome Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-purple-50/50 border border-purple-200 rounded-lg">
              {/* Right Ear */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    Right Ear Outcome
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white border border-rose-200 text-rose-700">
                    {formData.parameters.rightOutcome !== 'REFER' ? 'PASS' : 'REFER'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleParamChange('rightOutcome', 'PASS');
                      if (formData.parameters.leftOutcome !== 'REFER') {
                        handleParamChange('provisionalDiagnosis', '• Bilateral Otoacoustic Emissions (OAE) PASS.\n• Outer hair cell function is robust bilaterally within normal limits.');
                        handleParamChange('recommendations', '• Routine developmental auditory and speech-language milestones tracking.\n• Repeat evaluation if parental concern arises.');
                      }
                    }}
                    className={`py-1.5 text-xs font-bold rounded border cursor-pointer transition-all ${
                      formData.parameters.rightOutcome !== 'REFER'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                    }`}
                  >
                    Pass ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleParamChange('rightOutcome', 'REFER');
                      handleParamChange('provisionalDiagnosis', '• OAE Refer in Right Ear.\n• Suggests possible middle ear effusion or cochlear outer hair cell dysfunction.');
                      handleParamChange('recommendations', '• Recommend diagnostic ABR / BERA testing.\n• Repeat OAE evaluation after 2-4 weeks.\n• Pediatric ENT consultation for middle ear evaluation.');
                    }}
                    className={`py-1.5 text-xs font-bold rounded border cursor-pointer transition-all ${
                      formData.parameters.rightOutcome === 'REFER'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                    }`}
                  >
                    Refer ✕
                  </button>
                </div>
              </div>

              {/* Left Ear */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Left Ear Outcome
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-700">
                    {formData.parameters.leftOutcome !== 'REFER' ? 'PASS' : 'REFER'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleParamChange('leftOutcome', 'PASS');
                      if (formData.parameters.rightOutcome !== 'REFER') {
                        handleParamChange('provisionalDiagnosis', '• Bilateral Otoacoustic Emissions (OAE) PASS.\n• Outer hair cell function is robust bilaterally within normal limits.');
                        handleParamChange('recommendations', '• Routine developmental auditory and speech-language milestones tracking.\n• Repeat evaluation if parental concern arises.');
                      }
                    }}
                    className={`py-1.5 text-xs font-bold rounded border cursor-pointer transition-all ${
                      formData.parameters.leftOutcome !== 'REFER'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                    }`}
                  >
                    Pass ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleParamChange('leftOutcome', 'REFER');
                      handleParamChange('provisionalDiagnosis', '• OAE Refer in Left Ear.\n• Suggests possible middle ear effusion or cochlear outer hair cell dysfunction.');
                      handleParamChange('recommendations', '• Recommend diagnostic ABR / BERA testing.\n• Repeat OAE evaluation after 2-4 weeks.\n• Pediatric ENT consultation for middle ear evaluation.');
                    }}
                    className={`py-1.5 text-xs font-bold rounded border cursor-pointer transition-all ${
                      formData.parameters.leftOutcome === 'REFER'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50'
                    }`}
                  >
                    Refer ✕
                  </button>
                </div>
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
          <VoiceDisordersForm
            formData={formData}
            handleParamChange={handleParamChange}
            notify={notify}
          />
        )}

        {/* 4. FLUENCY SSI-4 ENTRY */}
        {activeService.code === 'RP-CLN-FLU' && (
          <FluencyDisordersForm
            formData={formData}
            handleParamChange={handleParamChange}
            notify={notify}
          />
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

        {/* 6. PSYCHOLOGICAL & CBT CLINICAL FORMULATION ENTRY */}
        {activeService.code === 'RP-CLN-CBT' && (
          <div className="space-y-4 text-xs">
            {/* Session & Consent */}
            <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-indigo-900 font-bold block mb-1 uppercase tracking-wide">
                  Assessment Session
                </label>
                <input
                  type="text"
                  value={formData.parameters.assessmentSession || 'Intake & Diagnostic Formulation'}
                  onChange={(e) => handleParamChange('assessmentSession', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-indigo-200 bg-white rounded font-medium text-slate-800"
                  placeholder="e.g. Intake & Diagnostic Formulation"
                />
              </div>
              <div>
                <label className="text-[10px] text-indigo-900 font-bold block mb-1 uppercase tracking-wide">
                  Consent Status
                </label>
                <input
                  type="text"
                  value={formData.parameters.consentStatus || 'Signed CBT Consent Form Verified'}
                  onChange={(e) => handleParamChange('consentStatus', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-indigo-200 bg-white rounded font-medium text-slate-800"
                  placeholder="e.g. Signed CBT Consent Form Verified"
                />
              </div>
            </div>

            {/* 1. Standardized Psychometric Scales (PHQ-9, GAD-7, PSS-10) */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                1. Standardized Psychometric Scales (PHQ-9, GAD-7, PSS-10)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* PHQ-9 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">PHQ-9 (Depression)</span>
                    <span className="text-[10px] font-mono text-slate-500">Max: 27</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Raw Score (/27)</label>
                    <input
                      type="number"
                      min={0}
                      max={27}
                      value={formData.parameters.phq9Score ?? 14}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleParamChange('phq9Score', val);
                        let sev = 'MINIMAL DEPRESSION';
                        if (val >= 20) sev = 'SEVERE DEPRESSION';
                        else if (val >= 15) sev = 'MODERATELY SEVERE DEPRESSION';
                        else if (val >= 10) sev = 'MODERATE DEPRESSION';
                        else if (val >= 5) sev = 'MILD DEPRESSION';
                        handleParamChange('phq9Severity', sev);
                      }}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Clinical Severity</label>
                    <input
                      type="text"
                      value={formData.parameters.phq9Severity || 'MODERATE DEPRESSION'}
                      onChange={(e) => handleParamChange('phq9Severity', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white text-indigo-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Item 9 Note (Suicide Screen)</label>
                    <input
                      type="text"
                      value={formData.parameters.phq9Item9Note || 'Item 9 Score = 1: Passive death thoughts'}
                      onChange={(e) => handleParamChange('phq9Item9Note', e.target.value)}
                      className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white text-slate-700"
                    />
                  </div>
                </div>

                {/* GAD-7 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">GAD-7 (Anxiety)</span>
                    <span className="text-[10px] font-mono text-slate-500">Max: 21</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Raw Score (/21)</label>
                    <input
                      type="number"
                      min={0}
                      max={21}
                      value={formData.parameters.gad7Score ?? 12}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleParamChange('gad7Score', val);
                        let sev = 'MINIMAL ANXIETY';
                        if (val >= 15) sev = 'SEVERE ANXIETY';
                        else if (val >= 10) sev = 'MODERATE ANXIETY';
                        else if (val >= 5) sev = 'MILD ANXIETY';
                        handleParamChange('gad7Severity', sev);
                      }}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Clinical Severity</label>
                    <input
                      type="text"
                      value={formData.parameters.gad7Severity || 'MODERATE ANXIETY'}
                      onChange={(e) => handleParamChange('gad7Severity', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white text-indigo-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Key Symptoms / Notes</label>
                    <input
                      type="text"
                      value={formData.parameters.gad7Note || 'Restlessness, excessive worry'}
                      onChange={(e) => handleParamChange('gad7Note', e.target.value)}
                      className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white text-slate-700"
                    />
                  </div>
                </div>

                {/* PSS-10 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">PSS-10 (Perceived Stress)</span>
                    <span className="text-[10px] font-mono text-slate-500">Max: 40</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Raw Score (/40)</label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={formData.parameters.pss10Score ?? 24}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleParamChange('pss10Score', val);
                        let sev = 'LOW STRESS';
                        if (val >= 27) sev = 'HIGH PERCEIVED STRESS';
                        else if (val >= 14) sev = 'MODERATE-HIGH PERCEIVED STRESS';
                        handleParamChange('pss10Severity', sev);
                      }}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Clinical Severity</label>
                    <input
                      type="text"
                      value={formData.parameters.pss10Severity || 'MODERATE-HIGH PERCEIVED STRESS'}
                      onChange={(e) => handleParamChange('pss10Severity', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white text-indigo-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block">Score Cutoff Benchmark</label>
                    <span className="text-[10px] text-slate-500 block pt-1">
                      0-13 Low | 14-26 Moderate | 27-40 High
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Clinical Risk Assessment & Mandatory Referral Matrix */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                2. Clinical Risk Assessment &amp; Mandatory Referral Matrix
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">
                      Suicidal Ideation / Intent
                    </label>
                    <input
                      type="text"
                      value={formData.parameters.suicidalIdeation || ''}
                      onChange={(e) => handleParamChange('suicidalIdeation', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                      placeholder="e.g. Passive thoughts ('wish I didn't wake up'), NO active plan, NO specific intent."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">
                      Self-Harm History
                    </label>
                    <input
                      type="text"
                      value={formData.parameters.selfHarmHistory || ''}
                      onChange={(e) => handleParamChange('selfHarmHistory', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                      placeholder="e.g. No prior suicide attempt; intermittent non-suicidal self-harm urges under high stress."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">
                      Means Access &amp; Control
                    </label>
                    <input
                      type="text"
                      value={formData.parameters.meansAccess || ''}
                      onChange={(e) => handleParamChange('meansAccess', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                      placeholder="e.g. No firearms; medication access managed by family."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block">
                      Protective Factors
                    </label>
                    <input
                      type="text"
                      value={formData.parameters.protectiveFactors || ''}
                      onChange={(e) => handleParamChange('protectiveFactors', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                      placeholder="e.g. Strong supportive sister, highly motivated for CBT, employed, no substance abuse."
                    />
                  </div>
                </div>

                {/* Right: Risk Level & Triggers */}
                <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg space-y-2.5">
                  <div>
                    <label className="text-[10px] font-black text-rose-900 uppercase block mb-1">
                      Overall Risk Level
                    </label>
                    <select
                      value={formData.parameters.overallRiskLevel || 'MODERATE RISK'}
                      onChange={(e) => handleParamChange('overallRiskLevel', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-black text-rose-900 bg-white border border-rose-300 rounded"
                    >
                      <option value="LOW RISK">LOW RISK</option>
                      <option value="MODERATE RISK">MODERATE RISK</option>
                      <option value="HIGH RISK">HIGH RISK</option>
                      <option value="SEVERE / IMMINENT RISK">SEVERE / IMMINENT RISK</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">
                      System Action / Safety Triggers
                    </label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(formData.parameters.safetyTriggers)
                          ? formData.parameters.safetyTriggers.join('\n')
                          : formData.parameters.safetyTriggers || ''
                      }
                      onChange={(e) => handleParamChange('safetyTriggers', e.target.value.split('\n'))}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      placeholder="• Mandatory Safety Plan Matrix Activated&#10;• System displays clinician warning banner&#10;• Psychiatric Consultation Prompt Enabled"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Patient 5-Step Safety Plan Matrix */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2.5">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                3. Patient 5-Step Safety Plan Matrix
              </span>

              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <span className="text-[11px] font-bold text-slate-700 sm:col-span-1">
                    Step 1: Recognizing Warning Signs
                  </span>
                  <input
                    type="text"
                    value={formData.parameters.safetyStep1 || ''}
                    onChange={(e) => handleParamChange('safetyStep1', e.target.value)}
                    className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                    placeholder="Racing thoughts, isolating in bedroom, skipping meals..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <span className="text-[11px] font-bold text-slate-700 sm:col-span-1">
                    Step 2: Internal Coping Strategies
                  </span>
                  <input
                    type="text"
                    value={formData.parameters.safetyStep2 || ''}
                    onChange={(e) => handleParamChange('safetyStep2', e.target.value)}
                    className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                    placeholder="Box breathing (4-4-4-4), 5-4-3-2-1 sensory grounding..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <span className="text-[11px] font-bold text-slate-700 sm:col-span-1">
                    Step 3: Social Distractions &amp; Support
                  </span>
                  <input
                    type="text"
                    value={formData.parameters.safetyStep3 || ''}
                    onChange={(e) => handleParamChange('safetyStep3', e.target.value)}
                    className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                    placeholder="Calling sister (Pooja: +91-98220-XXXXX), sitting in clinic garden..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <span className="text-[11px] font-bold text-slate-700 sm:col-span-1">
                    Step 4: Family / Crisis Contacts
                  </span>
                  <input
                    type="text"
                    value={formData.parameters.safetyStep4 || ''}
                    onChange={(e) => handleParamChange('safetyStep4', e.target.value)}
                    className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                    placeholder="Primary Contact: Sister (Pooja Kulkarni); Secondary Contact: Vani's Clinic Support."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <span className="text-[11px] font-bold text-slate-700 sm:col-span-1">
                    Step 5: Professional &amp; Emergency Care
                  </span>
                  <input
                    type="text"
                    value={formData.parameters.safetyStep5 || ''}
                    onChange={(e) => handleParamChange('safetyStep5', e.target.value)}
                    className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50 focus:bg-white"
                    placeholder="Vani's Clinic Crisis Line (+91-98220-XXXXX) | Satara District Hospital Helpline..."
                  />
                </div>
              </div>
            </div>

            {/* 4. Formulation & CBT Treatment Plan Details */}
            <div className="border border-teal-200 rounded-lg p-3 bg-teal-50/40 space-y-2.5">
              <span className="text-[11px] font-black text-teal-950 uppercase tracking-wide block">
                4. Formulation &amp; CBT Treatment Plan Specifics
              </span>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block">
                    1. Cognitive Formulation (Automatic Thoughts &amp; Distortions)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.parameters.cognitiveFormulation || ''}
                    onChange={(e) => handleParamChange('cognitiveFormulation', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                    placeholder="Automatic thoughts ('I am a failure if I am not perfect'), cognitive distortions (Catastrophising, All-or-Nothing thinking)."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block">
                    2. CBT Plan &amp; Interventions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.parameters.cbtPlan || ''}
                    onChange={(e) => handleParamChange('cbtPlan', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                    placeholder="12 weekly sessions targeting Cognitive Restructuring, Behavioural Activation (activity scheduling), and MBSR."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block">
                    3. Confidentiality Note
                  </label>
                  <input
                    type="text"
                    value={formData.parameters.confidentialityNote || 'Record encrypted under AES-256 field encryption. Access restricted to authorized CBT clinician.'}
                    onChange={(e) => handleParamChange('confidentialityNote', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. PSYCHOLOGICAL & CBT CLINICAL FORMULATION ENTRY */}
        {activeService.code === 'RP-CLN-EDH' && (
          <EarlyDevelopmentalHistoryForm
            formData={formData}
            handleParamChange={handleParamChange}
            handleNestedParamChange={handleNestedParamChange}
            notify={notify}
          />
        )}

        {/* 7. OTHER CLINICAL SERVICES */}
        {!['RP-CLN-AUD', 'RP-CLN-AAE', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA', 'RP-CLN-CBT', 'RP-CLN-EDH'].includes(activeService.code) && (
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                Clinical Impression &amp; Diagnosis *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => addBulletPoint('provisionalDiagnosis')}
                  className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Add new bullet point"
                >
                  <ListPlus className="w-3 h-3" />
                  + Bullet
                </button>
                <button
                  type="button"
                  onClick={() => formatAsBullets('provisionalDiagnosis')}
                  className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
                  title="Format existing lines into clean bullet points"
                >
                  • Format List
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={formData.parameters.provisionalDiagnosis || ''}
              onChange={(e) => handleParamChange('provisionalDiagnosis', e.target.value)}
              onKeyDown={(e) => handleBulletKeyDown(e, 'provisionalDiagnosis')}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white leading-relaxed font-sans"
              placeholder="• Bilateral Otoacoustic Emissions (OAE) PASS.&#10;• Outer hair cell function is robust bilaterally within normal limits."
            />
            <span className="text-[9.5px] text-slate-400 block mt-0.5">
              Tip: Press <kbd className="px-1 py-0.2 bg-slate-200 text-slate-700 rounded text-[8.5px] font-mono">Enter</kbd> to continue bullet points automatically.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                Clinical Recommendations &amp; Follow-up Protocol *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => addBulletPoint('recommendations')}
                  className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  title="Add new bullet point"
                >
                  <ListPlus className="w-3 h-3" />
                  + Bullet
                </button>
                <button
                  type="button"
                  onClick={() => formatAsBullets('recommendations')}
                  className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors cursor-pointer"
                  title="Format existing lines into clean bullet points"
                >
                  • Format List
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={formData.parameters.recommendations || ''}
              onChange={(e) => handleParamChange('recommendations', e.target.value)}
              onKeyDown={(e) => handleBulletKeyDown(e, 'recommendations')}
              className="w-full text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded p-2 focus:ring-1 focus:ring-purple-700 focus:bg-white leading-relaxed font-sans"
              placeholder="• Routine developmental auditory milestones tracking.&#10;• Repeat evaluation if parental concern arises."
            />
            <span className="text-[9.5px] text-slate-400 block mt-0.5">
              Tip: Press <kbd className="px-1 py-0.2 bg-slate-200 text-slate-700 rounded text-[8.5px] font-mono">Enter</kbd> to continue bullet points automatically.
            </span>
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

      {/* ── MODAL: EDIT PATIENT DETAILS FROM REPORT GENERATOR ── */}
      {isEditPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-purple-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-4 py-3 border-b border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-900" />
                <h3 className="text-sm font-bold text-purple-950">
                  Edit Patient Profile ({selectedPatient?.uhid})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePatientEdit} className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientEditForm.full_name}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Gender / Biological Sex *
                  </label>
                  <select
                    value={patientEditForm.gender}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700 cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={patientEditForm.date_of_birth}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Primary Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientEditForm.phone}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Guardian / Informant Name
                  </label>
                  <input
                    type="text"
                    value={patientEditForm.guardian_name}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, guardian_name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                    placeholder="e.g. Father, Mother, Spouse, Self"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    value={patientEditForm.guardian_phone}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, guardian_phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-mono font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    value={patientEditForm.city}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Primary Service Line
                  </label>
                  <select
                    value={patientEditForm.service_line}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, service_line: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700 cursor-pointer"
                  >
                    <option value="AUDIOLOGY">Audiology &amp; Hearing Aid</option>
                    <option value="SPEECH_LANGUAGE">Speech-Language Pathology</option>
                    <option value="VOICE">Voice Therapy &amp; Diagnostics</option>
                    <option value="CBT_PSYCHOLOGY">CBT &amp; Psychology</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Referring Physician / Doctor
                  </label>
                  <input
                    type="text"
                    value={patientEditForm.referringDoctor}
                    onChange={(e) => setPatientEditForm((prev) => ({ ...prev, referringDoctor: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-purple-700"
                    placeholder="e.g. Dr. A. P. Kulkarni (ENT)"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditPatientModalOpen(false)}
                  className="px-3 py-1.5 rounded-md font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md font-bold text-white bg-purple-900 hover:bg-purple-950 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Update &amp; Sync Master Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportCreatePage;
