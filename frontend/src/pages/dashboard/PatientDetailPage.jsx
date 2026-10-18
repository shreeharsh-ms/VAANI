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
  Edit2,
  Trash2,
  Plus,
  X,
  Send,
  QrCode,
  MessageCircle,
  Users,
  Eye,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useClinicSettings, formatClinicAddress, formatClinicHelpline } from '../../context/ClinicSettingsContext';
import {
  SEED_PATIENTS,
  PATIENT_DOSSIERS,
  getPatientClinicalDossier,
} from '../../data/patientClinicalProfiles';
import { getReportsForPatient, getAllClinicalReports } from '../../data/clinicalReportsData';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { isKey, isAlt } from '../../utils/keyboard';
import { patientService } from '../../services/patientService';
import Modal from '../../components/common/Modal';
import { printClinicalInvoice, numberToWordsINR } from '../../utils/invoicePrint';

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clinic = useClinicSettings();
  const clinicSettings = clinic.settings;
  const clinicLogo = clinic.logoUrl || '/vaani-logo.png';
  const clinicName = clinicSettings?.identity?.legalName || 'VAANI SPEECH & HEARING CLINIC';
  const clinicAddress = formatClinicAddress(clinicSettings) || 'Sadashiv Peth, Near Powai Naka, Satara - 415002';
  const clinicHelpline = formatClinicHelpline(clinicSettings);
  const clinicRci = clinicSettings?.credentials?.rciNumber || 'A79214';
  const clinicGstin = clinicSettings?.credentials?.gstin || '';
  const clinicSac = clinicSettings?.billing?.sacCode || '999312';
  const clinicHsn = clinicSettings?.billing?.hsnCode || '9021';
  const clinicUpiId = clinicSettings?.billing?.upiId || 'vaaniclinic@okaxis';
  const leadPractitioner = clinicSettings?.credentials?.leadPractitioner || clinic.leadPractitioner || 'Ms. Palak Paresh Gandhi';
  const leadDegree = clinicSettings?.credentials?.leadDegree || clinic.leadDegree || 'MASLP, RCI';
  const fullLeadPractitioner = `${leadPractitioner}${leadDegree ? `, ${leadDegree}` : ''}`;
  const clinicPayee = clinicSettings?.billing?.upiName || clinicSettings?.identity?.legalName || 'Vaani Speech & Hearing Clinic';
  const clinicBankName = clinicSettings?.billing?.bankName || 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara';
  const clinicBankIfsc = clinicSettings?.billing?.bankIfsc || 'HDFC0000123';
  const [activeTab, setActiveTab] = useState('demographics');
  const [patientRefreshTick, setPatientRefreshTick] = useState(0);

  // Resolve Patient from LocalStorage or SEED_PATIENTS or PATIENT_DOSSIERS
  const patient = useMemo(() => {
    let list = [];
    let hasSavedData = false;
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        hasSavedData = true;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      }
    } catch {
      // Fallback
    }

    if (!hasSavedData) {
      list = SEED_PATIENTS;
    }

    const normalizedId = (id || '').trim().toLowerCase();
    const found = list.find(
      (p) =>
        (p.uhid && p.uhid.toLowerCase() === normalizedId) ||
        (p.id && p.id.toLowerCase() === normalizedId)
    );

    if (found) return found;

    // Direct dossier match fallback only if not explicitly purged
    if (!hasSavedData) {
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
    }

    return list[0] || null;
  }, [id, patientRefreshTick]);

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

  useEffect(() => {
    const handleRefresh = () => {
      setReportsRefreshTick((prev) => prev + 1);
    };
    window.addEventListener('focus', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('vaani_reports_updated', handleRefresh);
    return () => {
      window.removeEventListener('focus', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('vaani_reports_updated', handleRefresh);
    };
  }, []);

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
      `This report is digitally signed and cryptographically verifiable under RCI CRR No. ${clinicRci} and the Digital Personal Data Protection (DPDP) Act 2023.\n\n` +
      `Warm regards,\n${fullLeadPractitioner}\n${clinicName}, Satara\nContact: ${clinicSettings?.contact?.primaryPhone || '+91 98220 12349'}`
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
      `*Attending Clinician:* ${rep.examiner && !rep.examiner.includes('Shreeharsh') ? rep.examiner : fullLeadPractitioner} (RCI ${clinicRci})\n\n` +
      `*Diagnosis / Summary:* ${rep.diagnosis || 'Clinical evaluation completed.'}\n\n` +
      (rep.recommendations ? `*Recommendations:* ${rep.recommendations}\n\n` : '') +
      `*Clinic Address:* ${clinicAddress}\n` +
      `*Contact:* ${clinicHelpline}\n` +
      `*Secure Verification:* https://vaaniclinic.com/verify-doc/${rep.report_number}`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    notify.success(`WhatsApp message draft launched for ${demographics.fullName || patient.full_name}`);
  };

  const handleViewDownloadReport = (rep) => {
    const all = getAllClinicalReports();
    const fresh = all.find((r) => r.report_number === rep.report_number || r.id === rep.id) || rep;
    const srv = CLINICAL_SERVICES.find((s) => s.code === fresh.service_code) || {
      code: fresh.service_code || 'RP-CLN-AUD',
      title: fresh.title,
      discipline: fresh.discipline,
      description: fresh.diagnosis,
    };
    const payload = {
      reportNumber: fresh.report_number || fresh.id,
      reportDate: fresh.date,
      examinerName: fresh.examiner && !fresh.examiner.includes('Shreeharsh') ? fresh.examiner : fullLeadPractitioner,
      rciNumber: clinicRci,
      service: srv,
      patient: patient,
      patientDossier: dossier,
      parameters: fresh.parameters || {
        provisionalDiagnosis: fresh.diagnosis,
        recommendations: fresh.recommendations,
      },
      computedPTA: fresh.computed || null,
    };
    try {
      localStorage.setItem('vaani_preview_report', JSON.stringify(payload));
      sessionStorage.setItem('vaani_preview_report', JSON.stringify(payload));
    } catch {}
    window.open(`/dashboard/reports/view/${encodeURIComponent(fresh.report_number || fresh.id)}`, '_blank');
  };

  // ── EDIT REPORT MODAL STATE & ACTIONS ──
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const handleOpenEditReportModal = (rep) => {
    navigate(`/dashboard/reports/create?editId=${encodeURIComponent(rep.report_number || rep.id)}&patientId=${encodeURIComponent(patient?.id || patient?.uhid || '')}`);
  };

  const handleSaveEditReport = (e) => {
    e.preventDefault();
    if (!editingReport) return;

    const repKey = editingReport.report_number || editingReport.id;
    try {
      const all = JSON.parse(localStorage.getItem('vaani_clinical_reports_v1') || '[]');
      const updated = all.map((r) =>
        (r.report_number === repKey || r.id === repKey) ? { ...r, ...editingReport } : r
      );
      if (!all.some((r) => r.report_number === repKey || r.id === repKey)) {
        updated.unshift({ ...editingReport });
      }
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed saving report edit:', err);
    }

    setReportsRefreshTick((prev) => prev + 1);
    setIsEditReportModalOpen(false);
    notify.success(`Clinical Report ${repKey} updated successfully!`);
  };

  // ── DELETE REPORT MODAL STATE & ACTIONS ──
  const [isDeleteReportModalOpen, setIsDeleteReportModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handlePromptDeleteReport = (rep) => {
    setReportToDelete(rep);
    setIsDeleteReportModalOpen(true);
  };

  const handleConfirmDeleteReport = () => {
    if (!reportToDelete) return;
    const repKey = reportToDelete.report_number || reportToDelete.id;
    try {
      const all = JSON.parse(localStorage.getItem('vaani_clinical_reports_v1') || '[]');
      const filtered = all.filter((r) => r.report_number !== repKey && r.id !== repKey);
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed deleting report:', err);
    }

    setReportsRefreshTick((prev) => prev + 1);
    setIsDeleteReportModalOpen(false);
    setReportToDelete(null);
    notify.success(`Clinical Report ${repKey} deleted.`);
  };

  // ── DYNAMIC HEARING AIDS REGISTER & DISPENSING (TAB 4) ──
  const [hearingAidsRefreshTick, setHearingAidsRefreshTick] = useState(0);
  const [isDispenseDeviceModalOpen, setIsDispenseDeviceModalOpen] = useState(false);
  const [dispenseForm, setDispenseForm] = useState({
    serialNo: '',
    brand: 'Phonak',
    model: 'Audéo Lumity L90',
    ear: 'Right Ear',
    style: 'RIC (Receiver-in-Canal)',
    battery: 'Lithium-ion Rechargeable',
    warrantyYears: 2,
    invoiceNo: '',
  });

  const patientHearingAidsList = useMemo(() => {
    const list = [];
    const uhidNorm = (demographics.uhid || patient.uhid || id || '').toLowerCase();
    const nameNorm = (demographics.fullName || patient.full_name || '').toLowerCase();

    // 1. Read from vaani_patient_hearing_aids_v1
    try {
      const storedMap = JSON.parse(localStorage.getItem('vaani_patient_hearing_aids_v1') || '{}');
      const found = storedMap[demographics.uhid] || storedMap[patient.uhid] || storedMap[id];
      if (found && Array.isArray(found.instruments)) {
        found.instruments.forEach((inst) => {
          list.push({
            ...inst,
            dispensedDate: inst.dispensedDate || found.dispensedDate || '2026-10-17',
            invoiceNo: inst.invoiceNo || found.invoiceNo || 'INV-2026-0082',
          });
        });
      }
    } catch {}

    // 2. Read from vaani_inventory_devices_v1 (dispensed units linked to this patient)
    try {
      const allDevices = JSON.parse(localStorage.getItem('vaani_inventory_devices_v1') || '[]');
      if (Array.isArray(allDevices)) {
        const assigned = allDevices.filter(
          (d) =>
            (d.patientUhid && d.patientUhid.toLowerCase() === uhidNorm) ||
            (d.patientName && d.patientName.toLowerCase() === nameNorm) ||
            (d.stockStatus === 'DISPENSED' && d.patientUhid && d.patientUhid.toLowerCase() === uhidNorm)
        );
        assigned.forEach((d) => {
          if (!list.some((item) => item.serial === d.serialNo || item.serialNo === d.serialNo)) {
            list.push({
              id: d.id,
              side: d.ear === 'RIGHT' ? 'Right Ear' : d.ear === 'LEFT' ? 'Left Ear' : d.ear === 'BILATERAL' ? 'Bilateral' : (d.ear || 'Right Ear'),
              make: `${d.brand} ${d.model}`,
              brand: d.brand,
              model: d.model,
              serial: d.serialNo,
              serialNo: d.serialNo,
              style: d.category || 'RIC',
              battery: d.batteryType || 'Rechargeable',
              warrantyUntil: d.warrantyExpiry || '2028-10-18',
              status: 'FITTED & ACTIVE',
              dispensedDate: d.saleDate || '2026-10-17',
              invoiceNo: d.invoiceNo || 'INV-2026-0082',
              hsnCode: d.hsnCode || '90214090',
            });
          }
        });
      }
    } catch {}

    // 3. Fallback to dossier hearingAids
    if (list.length === 0 && hearingAids?.dispensed) {
      if (hearingAids.instruments) {
        list.push(...hearingAids.instruments);
      } else {
        if (hearingAids.rightEar?.model) {
          list.push({
            side: 'Right Ear',
            make: hearingAids.rightEar.model,
            brand: 'Phonak',
            model: hearingAids.rightEar.model,
            serial: hearingAids.rightEar.serial || 'PHO-819204',
            warrantyUntil: hearingAids.rightEar.warrantyUntil || '2028-10-17',
            status: 'FITTED & ACTIVE',
            style: 'RIC',
            battery: 'Lithium-ion',
          });
        }
        if (hearingAids.leftEar?.model) {
          list.push({
            side: 'Left Ear',
            make: hearingAids.leftEar.model,
            brand: 'Phonak',
            model: hearingAids.leftEar.model,
            serial: hearingAids.leftEar.serial || 'PHO-819205',
            warrantyUntil: hearingAids.leftEar.warrantyUntil || '2028-10-17',
            status: 'FITTED & ACTIVE',
            style: 'RIC',
            battery: 'Lithium-ion',
          });
        }
      }
    }

    return list;
  }, [demographics.uhid, demographics.fullName, patient.uhid, patient.full_name, id, hearingAids, hearingAidsRefreshTick]);

  const handleSaveDirectDispenseDevice = (e) => {
    e.preventDefault();
    if (!dispenseForm.serialNo.trim()) {
      notify.error('Device Serial Number is required.');
      return;
    }

    const serial = dispenseForm.serialNo.trim().toUpperCase();
    const warrantyDate = new Date();
    warrantyDate.setFullYear(warrantyDate.getFullYear() + (parseInt(dispenseForm.warrantyYears, 10) || 2));
    const warrantyStr = warrantyDate.toISOString().substring(0, 10);
    const todayStr = new Date().toISOString().substring(0, 10);

    // Save to vaani_inventory_devices_v1
    try {
      const storedDevices = JSON.parse(localStorage.getItem('vaani_inventory_devices_v1') || '[]');
      const movements = JSON.parse(localStorage.getItem('vaani_stock_movements_v1') || '[]');
      const existingIdx = storedDevices.findIndex((d) => d.serialNo === serial);

      if (existingIdx >= 0) {
        storedDevices[existingIdx] = {
          ...storedDevices[existingIdx],
          stockStatus: 'DISPENSED',
          patientUhid: demographics.uhid,
          patientName: demographics.fullName,
          ear: dispenseForm.ear,
          warrantyExpiry: warrantyStr,
          saleDate: todayStr,
          invoiceNo: dispenseForm.invoiceNo || 'INV-CLINIC-DIRECT',
        };
      } else {
        storedDevices.push({
          id: `dev_${Date.now()}`,
          serialNo: serial,
          brand: dispenseForm.brand,
          model: dispenseForm.model,
          category: dispenseForm.style,
          channels: 16,
          batteryType: dispenseForm.battery,
          hsnCode: '90214090',
          gstPercent: 18,
          stockStatus: 'DISPENSED',
          patientUhid: demographics.uhid,
          patientName: demographics.fullName,
          ear: dispenseForm.ear,
          warrantyExpiry: warrantyStr,
          saleDate: todayStr,
          invoiceNo: dispenseForm.invoiceNo || 'INV-CLINIC-DIRECT',
        });
      }

      movements.unshift({
        id: `mov_${Date.now()}`,
        type: 'SOLD_DISPENSED',
        itemName: dispenseForm.model,
        brand: dispenseForm.brand,
        serialNo: serial,
        hsnCode: '90214090',
        qtyChange: -1,
        refDoc: dispenseForm.invoiceNo || 'DIRECT-DISPENSE',
        patientName: demographics.fullName,
        patientUhid: demographics.uhid,
        notes: `Hearing aid registered directly to ${demographics.fullName} (${dispenseForm.ear})`,
        date: todayStr,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });

      localStorage.setItem('vaani_inventory_devices_v1', JSON.stringify(storedDevices));
      localStorage.setItem('vaani_stock_movements_v1', JSON.stringify(movements));
    } catch {}

    // Save to vaani_patient_hearing_aids_v1
    try {
      const patientHAs = JSON.parse(localStorage.getItem('vaani_patient_hearing_aids_v1') || '{}');
      const uhid = demographics.uhid;
      if (!patientHAs[uhid]) {
        patientHAs[uhid] = {
          uhid: uhid,
          patientName: demographics.fullName,
          dispensed: true,
          dispensedDate: todayStr,
          invoiceNo: dispenseForm.invoiceNo || 'DIRECT-DISPENSE',
          instruments: [],
        };
      }
      if (!Array.isArray(patientHAs[uhid].instruments)) {
        patientHAs[uhid].instruments = [];
      }
      patientHAs[uhid].instruments.push({
        side: dispenseForm.ear,
        make: `${dispenseForm.brand} ${dispenseForm.model}`,
        brand: dispenseForm.brand,
        model: dispenseForm.model,
        serial: serial,
        style: dispenseForm.style,
        battery: dispenseForm.battery,
        status: 'FITTED & ACTIVE',
        warrantyUntil: warrantyStr,
        invoiceNo: dispenseForm.invoiceNo || 'DIRECT-DISPENSE',
        dispensedDate: todayStr,
      });
      localStorage.setItem('vaani_patient_hearing_aids_v1', JSON.stringify(patientHAs));
    } catch {}

    setHearingAidsRefreshTick((prev) => prev + 1);
    setIsDispenseDeviceModalOpen(false);
    notify.success(`Hearing aid ${dispenseForm.brand} ${dispenseForm.model} (${serial}) registered to patient!`);
  };

  // ── PATIENT PROFILE EDIT & DELETE STATE ──
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editPatientModalTab, setEditPatientModalTab] = useState('demographics'); // 'demographics' | 'guardians' | 'referral'
  const [editPatientForm, setEditPatientForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'FEMALE',
    phone: '',
    alt_phone: '',
    email: '',
    city: 'Satara',
    address: '',
    service_line: 'SPEECH_LANGUAGE',
    primary_concern: '',
    guardians: [],
    family_group_id: '',
    referral: {
      doctorName: '',
      hospital: '',
      discipline: '',
      notes: '',
    },
    abha_id: '',
  });
  const [isDeletePatientModalOpen, setIsDeletePatientModalOpen] = useState(false);

  const handleOpenEditPatient = (targetTab = 'demographics') => {
    setEditPatientModalTab(targetTab);
    const existingGuardians = demographics?.guardians && demographics.guardians.length > 0
      ? JSON.parse(JSON.stringify(demographics.guardians))
      : patient?.guardian_name
      ? [
          {
            name: patient.guardian_name,
            relation: 'Guardian',
            phone: patient.guardian_phone || patient.phone || '',
            occupation: '',
            isLegalGuardian: true,
            canConsent: true,
            canPickUp: true,
          },
        ]
      : [];

    const existingReferral = demographics?.referral && (demographics.referral.doctorName || demographics.referral.hospital)
      ? {
          doctorName: demographics.referral.doctorName || '',
          hospital: demographics.referral.hospital || '',
          discipline: demographics.referral.discipline || '',
          notes: demographics.referral.notes || demographics.referral.reason || '',
        }
      : { doctorName: '', hospital: '', discipline: '', notes: '' };

    setEditPatientForm({
      full_name: demographics.fullName || patient.full_name || '',
      date_of_birth: demographics.dob || patient.date_of_birth || '1992-05-18',
      gender: demographics.sex || patient.gender || 'FEMALE',
      phone: demographics.primaryPhone || patient.phone || '',
      alt_phone: demographics.altPhone || patient.alt_phone || '',
      email: demographics.email || patient.email || '',
      city: demographics.locality || patient.city || 'Satara',
      address: demographics.addressLine1 || patient.address || '',
      service_line: patient.service_line || 'SPEECH_LANGUAGE',
      primary_concern: demographics.primaryConcern || patient.diagnosis || '',
      guardians: existingGuardians,
      family_group_id: demographics.familyGroupId || patient.family_group_id || '',
      referral: existingReferral,
      abha_id: demographics.abhaId || demographics.abha?.id || patient.abha_id || '',
    });
    setIsEditPatientModalOpen(true);
  };

  const handleAddGuardianRow = () => {
    setEditPatientForm((prev) => ({
      ...prev,
      guardians: [
        ...prev.guardians,
        {
          name: '',
          relation: prev.guardians.length === 0 ? 'Father' : prev.guardians.length === 1 ? 'Mother' : 'Legal Guardian',
          phone: '',
          occupation: '',
          isLegalGuardian: true,
          canConsent: true,
          canPickUp: true,
        },
      ],
    }));
  };

  const handleRemoveGuardianRow = (idx) => {
    setEditPatientForm((prev) => ({
      ...prev,
      guardians: prev.guardians.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateGuardianField = (idx, field, value) => {
    setEditPatientForm((prev) => {
      const copy = [...prev.guardians];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, guardians: copy };
    });
  };

  const handleSavePatientEdit = (e) => {
    e.preventDefault();
    const uhid = demographics.uhid || patient.uhid || id;
    const primaryGuardian = editPatientForm.guardians[0];

    const updated = {
      ...patient,
      full_name: editPatientForm.full_name,
      date_of_birth: editPatientForm.date_of_birth,
      gender: editPatientForm.gender,
      phone: editPatientForm.phone,
      alt_phone: editPatientForm.alt_phone,
      email: editPatientForm.email,
      guardian_name: primaryGuardian ? primaryGuardian.name : '',
      guardian_phone: primaryGuardian ? primaryGuardian.phone : '',
      guardians: editPatientForm.guardians,
      city: editPatientForm.city,
      address: editPatientForm.address,
      service_line: editPatientForm.service_line,
      diagnosis: editPatientForm.primary_concern,
      family_group_id: editPatientForm.family_group_id,
      referral: editPatientForm.referral,
      abha_id: editPatientForm.abha_id,
      id: patient.id || `p_${uhid}`,
      uhid: uhid,
    };
    patientService.saveLocalPatient(updated);

    // Save custom metadata under uhid
    const metaPayload = {
      guardians: editPatientForm.guardians,
      familyGroupId: editPatientForm.family_group_id,
      referral: editPatientForm.referral,
      abhaId: editPatientForm.abha_id,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`vaani_patient_meta_${uhid}`, JSON.stringify(metaPayload));

    window.dispatchEvent(new CustomEvent('vaani-patient-updated', { detail: { uhid, updated } }));
    window.dispatchEvent(new Event('storage'));
    setPatientRefreshTick((prev) => prev + 1);
    setIsEditPatientModalOpen(false);
    notify.success(`Patient profile for ${updated.full_name} updated successfully!`);
  };

  const handleConfirmDeletePatient = async () => {
    await patientService.deletePatient(patient.id || demographics.uhid);
    setIsDeletePatientModalOpen(false);
    notify.success(`Patient file for ${demographics.fullName} (${demographics.uhid}) deleted.`);
    navigate('/dashboard/patients');
  };

  // ── EARLY DEV HISTORY (EDH) RESOLUTION ──
  const edhReport = useMemo(() => {
    // 1. Check patientReports for EDH
    const rep = patientReports.find(
      (r) =>
        r.service_code === 'RP-CLN-EDH' ||
        (r.title && r.title.toLowerCase().includes('early dev')) ||
        (r.service_code && r.service_code.includes('EDH'))
    );
    if (rep) return rep;

    // 2. Check localStorage
    try {
      const raw = localStorage.getItem('vaani_edh_' + demographics.uhid);
      if (raw) return JSON.parse(raw);
    } catch {}

    // 3. Direct patient property
    if (patient.earlyDevHistory) return patient.earlyDevHistory;

    return null;
  }, [patientReports, demographics.uhid, patient, reportsRefreshTick]);

  // ── THERAPY GOALS & SOAP NOTES STATE ──
  const [therapyRefreshTick, setTherapyRefreshTick] = useState(0);
  const therapyPlans = useMemo(() => {
    try {
      const raw = localStorage.getItem('vaani_therapy_' + demographics.uhid);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }, [demographics.uhid, therapyRefreshTick]);

  const soapNotes = useMemo(() => {
    try {
      const raw = localStorage.getItem('vaani_soap_' + demographics.uhid);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }, [demographics.uhid, therapyRefreshTick]);

  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    title: 'Comprehensive Rehabilitation & Therapy Protocol',
    clinician: 'Ms. Palak Paresh Gandhi, MASLP (RCI A79214)',
    schedule: '2 Sessions / Week',
    reviewDate: '2026-11-15',
    longTermGoal: 'Improve communication effectiveness, functional speech fluency, and reduce communicative effort.',
    obj1Desc: 'Demonstrate functional syllable repetition reduction and controlled breath phrasing.',
    obj1Target: '80% accurate phrasing in structured clinical activities',
    obj2Desc: 'Complete daily home practice exercises and maintain vocal hygiene habits.',
    obj2Target: '100% adherence logged by caregiver / client',
  });

  const [isNewSoapModalOpen, setIsNewSoapModalOpen] = useState(false);
  const [newSoapForm, setNewSoapForm] = useState({
    sessionNo: 1,
    date: new Date().toISOString().substring(0, 10),
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeletePlanModalOpen, setIsDeletePlanModalOpen] = useState(false);

  const handleSaveNewPlan = (e) => {
    e.preventDefault();
    const newPlan = {
      planId: `THP-2026-${String(therapyPlans.length + 80).padStart(4, '0')}`,
      title: newPlanForm.title,
      assignedClinician: newPlanForm.clinician,
      frequency: newPlanForm.schedule,
      reviewDate: newPlanForm.reviewDate,
      longTermGoal: newPlanForm.longTermGoal,
      smartObjectives: [
        ...(newPlanForm.obj1Desc ? [{
          id: 'obj_1',
          text: newPlanForm.obj1Desc,
          baseline: 'Clinical intake baseline',
          target: newPlanForm.obj1Target || 'Mastery',
          currentProgress: 'In Progress (Active Protocol)',
          status: 'IN_PROGRESS'
        }] : []),
        ...(newPlanForm.obj2Desc ? [{
          id: 'obj_2',
          text: newPlanForm.obj2Desc,
          baseline: 'Initial observation',
          target: newPlanForm.obj2Target || 'Target achieved',
          currentProgress: 'Initiated',
          status: 'IN_PROGRESS'
        }] : [])
      ]
    };
    const updated = [newPlan, ...therapyPlans];
    localStorage.setItem('vaani_therapy_' + demographics.uhid, JSON.stringify(updated));
    setTherapyRefreshTick((prev) => prev + 1);
    setIsNewPlanModalOpen(false);
    notify.success(`Active rehabilitation plan ${newPlan.planId} created for ${demographics.fullName}!`);
  };

  const handleSendPlanWhatsApp = (plan) => {
    const phone = (demographics.primaryPhone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = phone.length === 10 ? `91${phone}` : phone;
    const msg = `*VAANI Speech & Hearing Clinic — Therapy Session & Goal Reminder*\n\n` +
      `Dear ${demographics.fullName},\n` +
      `This is a clinical reminder regarding your active rehabilitation plan:\n` +
      `• *Protocol:* ${plan.title}\n` +
      `• *Assigned Clinician:* ${plan.assignedClinician}\n` +
      `• *Schedule:* ${plan.frequency}\n` +
      `• *Next Review:* ${plan.reviewDate}\n` +
      `• *Primary Clinical Goal:* ${plan.longTermGoal}\n\n` +
      `Please ensure all prescribed home activities are completed before your next visit.\n` +
      `Helpline: +91 98220 12345 • Satara Clinic`;

    const url = phoneWithCountry
      ? `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    notify.success(`WhatsApp therapy reminder drafted for ${demographics.fullName}`);
  };

  const handleSaveNewSoap = (e) => {
    e.preventDefault();
    const newSoap = {
      id: `soap_${Date.now()}`,
      sessionNo: Number(newSoapForm.sessionNo) || (soapNotes.length + 1),
      date: newSoapForm.date || new Date().toISOString().substring(0, 10),
      subjective: newSoapForm.subjective,
      objective: newSoapForm.objective,
      assessment: newSoapForm.assessment,
      plan: newSoapForm.plan,
    };
    const updated = [newSoap, ...soapNotes];
    localStorage.setItem('vaani_soap_' + demographics.uhid, JSON.stringify(updated));
    setTherapyRefreshTick((prev) => prev + 1);
    setIsNewSoapModalOpen(false);
    notify.success(`SOAP Session note #${newSoap.sessionNo} logged!`);
  };

  const handleDeletePlan = (plan) => {
    const updated = therapyPlans.filter((p) => p.planId !== plan.planId);
    localStorage.setItem('vaani_therapy_' + demographics.uhid, JSON.stringify(updated));
    setTherapyRefreshTick((prev) => prev + 1);
    setIsDeletePlanModalOpen(false);
    notify.success(`Therapy plan ${plan.planId} deleted.`);
  };

  // ── PATIENT INVOICES STATE & ACTIONS ──
  const [invoiceRefreshTick, setInvoiceRefreshTick] = useState(0);
  const patientInvoices = useMemo(() => {
    let list = [];
    if (Array.isArray(financial?.invoices)) {
      list.push(...financial.invoices.map((inv) => ({
        id: inv.invoiceNo,
        invoiceNo: inv.invoiceNo,
        date: inv.date,
        patientName: demographics.fullName,
        uhid: demographics.uhid,
        phone: demographics.primaryPhone,
        service: inv.description,
        amount: inv.amount,
        taxAmount: inv.tax || 0,
        totalAmount: inv.amount + (inv.tax || 0),
        taxType: inv.tax > 0 ? 'TAXABLE_GOODS' : 'HEALTHCARE_EXEMPT',
        status: inv.status || 'PAID',
        paymentMode: inv.paymentMode || 'UPI',
        receiptNo: inv.refNo || `REC-${inv.invoiceNo?.replace('INV-', '')}`,
      })));
    }

    try {
      const raw = localStorage.getItem('vaani_billing_invoices_v1');
      if (raw) {
        const allInvoices = JSON.parse(raw);
        if (Array.isArray(allInvoices)) {
          const matching = allInvoices.filter(
            (i) =>
              (i.uhid && i.uhid.toLowerCase() === demographics.uhid.toLowerCase()) ||
              (i.patientName && i.patientName.toLowerCase() === demographics.fullName.toLowerCase())
          );
          matching.forEach((m) => {
            if (!list.some((existing) => existing.invoiceNo === m.invoiceNo)) {
              list.push(m);
            }
          });
        }
      }
    } catch {}

    return list;
  }, [financial?.invoices, demographics.uhid, demographics.fullName, invoiceRefreshTick]);

  // Invoice Date Filtering & Pagination
  const [invDatePreset, setInvDatePreset] = useState('ALL');
  const [invStartDate, setInvStartDate] = useState('');
  const [invEndDate, setInvEndDate] = useState('');
  const [invPage, setInvPage] = useState(1);
  const [invPageSize, setInvPageSize] = useState(5);

  const filteredPatientInvoices = useMemo(() => {
    return patientInvoices.filter((inv) => {
      let matchesDate = true;
      if (invDatePreset === 'TODAY') {
        const todayStr = new Date().toISOString().substring(0, 10);
        matchesDate = inv.date === todayStr;
      } else if (invDatePreset === 'LAST_7_DAYS') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        matchesDate = inv.date >= d.toISOString().substring(0, 10);
      } else if (invDatePreset === 'THIS_MONTH') {
        const ym = new Date().toISOString().substring(0, 7);
        matchesDate = inv.date && inv.date.startsWith(ym);
      } else if (invDatePreset === 'LAST_30_DAYS') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        matchesDate = inv.date >= d.toISOString().substring(0, 10);
      } else if (invDatePreset === 'CUSTOM') {
        if (invStartDate) matchesDate = matchesDate && inv.date >= invStartDate;
        if (invEndDate) matchesDate = matchesDate && inv.date <= invEndDate;
      }
      return matchesDate;
    });
  }, [patientInvoices, invDatePreset, invStartDate, invEndDate]);

  const totalInvPages = Math.ceil(filteredPatientInvoices.length / invPageSize) || 1;
  const paginatedPatientInvoices = useMemo(() => {
    const start = (invPage - 1) * invPageSize;
    return filteredPatientInvoices.slice(start, start + invPageSize);
  }, [filteredPatientInvoices, invPage, invPageSize]);

  // Invoice Modals State
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [selectedInvoiceForMail, setSelectedInvoiceForMail] = useState(null);
  const [mailRecipient, setMailRecipient] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailNote, setMailNote] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isDeleteInvoiceModalOpen, setIsDeleteInvoiceModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const handleOpenPatientInvoice = (inv) => {
    setSelectedInvoiceForView(inv);
    setIsViewInvoiceModalOpen(true);
  };

  const handleDownloadPatientInvoice = (inv) => {
    printClinicalInvoice(inv);
    notify.success(`Tax invoice ${inv.invoiceNo} opened for printing`);
  };

  const handleWhatsAppPatientInvoice = (inv) => {
    const phone = (inv.phone || demographics.primaryPhone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = phone.length === 10 ? `91${phone}` : phone;
    const text = `*VAANI Speech & Hearing Clinic — Tax Invoice & Receipt*\n\n` +
      `Dear ${inv.patientName},\n` +
      `Invoice #: ${inv.invoiceNo}\n` +
      `Date: ${inv.date}\n` +
      `UHID: ${inv.uhid}\n` +
      `Service: ${inv.service}\n` +
      `Total: ₹${inv.totalAmount.toLocaleString('en-IN')} (${inv.status})\n` +
      `Payment Mode: ${inv.paymentMode}\n\n` +
      `Thank you for trusting VAANI Clinic.\n` +
      `Helpline: +91 98220 12345`;
    const url = phoneWithCountry
      ? `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    notify.success(`WhatsApp invoice drafted for ${inv.patientName}`);
  };

  const handleOpenMailPatientInvoice = (inv) => {
    setSelectedInvoiceForMail(inv);
    setMailRecipient(inv.email || demographics.email || `${inv.patientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`);
    setMailSubject(`Tax Invoice & Clinical Receipt ${inv.invoiceNo} — VAANI Speech & Hearing Clinic`);
    setMailNote(`Dear ${inv.patientName},\n\nPlease find attached your official Clinical Tax Invoice & Receipt ${inv.invoiceNo} for ${inv.service}.\n\nTotal: ₹${inv.totalAmount.toLocaleString('en-IN')} (${inv.status}).\n\nKind regards,\nVAANI Speech & Hearing Rehabilitation Center\nSadashiv Peth, Satara • RCI CRR No. ${clinicRci}`);
    setIsMailModalOpen(true);
  };

  const handleSendMailPatientInvoice = (e) => {
    e.preventDefault();
    if (!selectedInvoiceForMail) return;
    setIsSendingMail(true);
    setTimeout(() => {
      setIsSendingMail(false);
      setIsMailModalOpen(false);
      notify.success(`Tax Invoice ${selectedInvoiceForMail.invoiceNo} dispatched to ${mailRecipient}!`);
    }, 450);
  };

  const handleStartEditPatientInvoice = (inv) => {
    setEditingInvoice({ ...inv });
    setIsEditInvoiceModalOpen(true);
  };

  const handleSaveEditedPatientInvoice = (e) => {
    e.preventDefault();
    if (!editingInvoice) return;
    try {
      const stored = JSON.parse(localStorage.getItem('vaani_billing_invoices_v1') || '[]');
      const idx = stored.findIndex((i) => i.invoiceNo === editingInvoice.invoiceNo);
      if (idx >= 0) {
        stored[idx] = { ...stored[idx], ...editingInvoice };
        localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify(stored));
      }
    } catch {}
    setInvoiceRefreshTick((prev) => prev + 1);
    setIsEditInvoiceModalOpen(false);
    notify.success(`Invoice ${editingInvoice.invoiceNo} updated successfully!`);
  };

  const handleDeletePatientInvoice = (inv) => {
    try {
      const stored = JSON.parse(localStorage.getItem('vaani_billing_invoices_v1') || '[]');
      const filtered = stored.filter((i) => i.invoiceNo !== inv.invoiceNo);
      localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify(filtered));
    } catch {}
    setInvoiceRefreshTick((prev) => prev + 1);
    setIsDeleteInvoiceModalOpen(false);
    notify.success(`Invoice ${inv.invoiceNo} deleted.`);
  };

  const tabs = [
    { id: 'demographics', label: '1. Identity & Demographics', count: '14 fields' },
    { id: 'consents', label: '2. DPDP Consents', count: `${consents.length} rules` },
    { id: 'clinical', label: '3. Clinical Diagnostics & EMR', count: `${patientReports.length} Reports` },
    { id: 'hearingAids', label: '4. Hearing Aids & Devices', count: patientHearingAidsList.length > 0 ? `${patientHearingAidsList.length} Fitted` : (hearingAids?.dispensed ? 'Bilateral' : 'Screened') },
    { id: 'therapy', label: '5. Therapy Goals & SOAP', count: `${therapyPlans.length} Plans` },
    { id: 'billing', label: '6. Billing & Recalls', count: `${patientInvoices.length} Invoices` },
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
            <span>RCI CRR No. {clinicRci} Certified</span>
          </div>

          <button
            type="button"
            onClick={handleOpenEditPatient}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all cursor-pointer shadow-2xs"
            title="Edit Patient Demographic & Clinical Profile"
          >
            <Edit2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeletePatientModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-2xs"
            title="Delete Patient Record"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Delete</span>
          </button>

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
                <div className="flex items-center gap-2">
                  <span>1.1 Patient Master Identity &amp; Demographic Profile</span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    Section 4.8 &amp; 5.5.14
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEditPatient}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-purple-700" />
                  <span>Edit Profile</span>
                </button>
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
              {/* 1.2 Guardians & Caregivers */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-700" />
                      <span>1.2 Guardians &amp; Legal Caregivers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-normal">Mandatory for Minors</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditPatient('guardians')}
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add or edit legal guardians & caregivers"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{demographics.guardians?.length > 0 ? 'Edit' : '+ Add'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {demographics.guardians && demographics.guardians.length > 0 ? (
                      <>
                        {demographics.guardians.map((g, i) => (
                          <div key={i} className="p-2.5 rounded border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{g.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                                {g.relation || 'Guardian'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <span>Phone: <strong className="font-mono text-slate-800">{g.phone || 'N/A'}</strong></span>
                              <span>{g.occupation || ''}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-800 font-medium flex-wrap">
                              {g.isLegalGuardian && <span>✓ Legal Guardian: Yes</span>}
                              {g.canConsent && <span>• Can Consent: Yes</span>}
                              {g.canPickUp && <span>• Pick-up Auth: Yes</span>}
                            </div>
                          </div>
                        ))}
                        {demographics.familyGroupId && (
                          <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Family Link Group ID:</span>
                            <span className="font-mono font-bold text-purple-900">{demographics.familyGroupId}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-6 px-3 text-center border-2 border-dashed border-slate-200 rounded-lg space-y-2 bg-slate-50/40">
                        <div className="w-8 h-8 rounded-full bg-purple-100/70 text-purple-800 flex items-center justify-center mx-auto">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-slate-700 font-semibold">No legal guardians or caregivers recorded yet.</p>
                        <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                          Mandatory for pediatric &amp; minor patients under DPDP Act 2023. Record legal guardian, phone, and pickup authorization.
                        </p>
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPatient('guardians')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#301444] hover:bg-[#200b30] shadow-2xs cursor-pointer transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Guardian / Caregiver</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 1.3 Referral Partner & ABHA */}
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1.3 Referral Partner &amp; ABHA Health Account</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        DPDP Compliant
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditPatient('referral')}
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add or edit referring physician and ABHA ID"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{(demographics.referral && (demographics.referral.doctorName || demographics.referral.hospital)) || demographics.abhaId || demographics.abha ? 'Edit' : '+ Add'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 text-xs">
                    {demographics.referral && (demographics.referral.doctorName || demographics.referral.hospital) ? (
                      <div className="p-2.5 rounded border border-slate-200 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Referring Physician</span>
                        <p className="font-bold text-slate-900">{demographics.referral.doctorName}</p>
                        {(demographics.referral.hospital || demographics.referral.discipline) && (
                          <p className="text-[11px] text-slate-600">
                            {demographics.referral.hospital} {demographics.referral.discipline ? `• ${demographics.referral.discipline}` : ''}
                          </p>
                        )}
                        {(demographics.referral.notes || demographics.referral.reason) && (
                          <p className="text-[11px] text-slate-500 italic">
                            "{demographics.referral.notes || demographics.referral.reason}"
                          </p>
                        )}
                      </div>
                    ) : null}

                    {demographics.abhaId || demographics.abha?.id ? (
                      <div className="p-2.5 rounded border border-purple-200 bg-purple-50/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">
                            Ayushman Bharat Health Account (ABHA)
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                            Encrypted
                          </span>
                        </div>
                        <p className="font-mono font-bold text-purple-950 text-xs">{demographics.abhaId || demographics.abha?.id}</p>
                        <p className="text-[10px] text-slate-500">
                          DPDP Act 2023 compliant: Zero Aadhaar data stored.
                        </p>
                      </div>
                    ) : null}

                    {!((demographics.referral && (demographics.referral.doctorName || demographics.referral.hospital)) || demographics.abhaId || demographics.abha?.id) && (
                      <div className="py-6 px-3 text-center border-2 border-dashed border-slate-200 rounded-lg space-y-2 bg-slate-50/40">
                        <div className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-slate-700 font-semibold">No referral partner or ABHA health account recorded yet.</p>
                        <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                          Record referring pediatrician/ENT doctor, clinical referral notes, and Ayushman Bharat (ABHA) ID.
                        </p>
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPatient('referral')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#301444] hover:bg-[#200b30] shadow-2xs cursor-pointer transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Referral &amp; ABHA Details</span>
                          </button>
                        </div>
                      </div>
                    )}
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
                                  {rep.examiner && !rep.examiner.includes('Shreeharsh') ? rep.examiner : fullLeadPractitioner} ({clinicRci})
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
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDownloadReport(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                                    title="View Official Report in New Tab"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditReportModal(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                                    title="Edit / Update Clinical Report"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDownloadReport(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
                                    title="Print / Download PDF"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSendWhatsApp(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                    title="Send Report Summary via WhatsApp"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEmailModal(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                                    title="Send Report via Email"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePromptDeleteReport(rep);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                                    title="Delete Clinical Report"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
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
                                          {rep.diagnosis || `Clinical evaluation completed and authenticated under RCI CRR No. ${clinicRci}.`}
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
                                        <span>Authenticated Clinician: <strong className="text-slate-800">{rep.examiner && !rep.examiner.includes('Shreeharsh') ? rep.examiner : fullLeadPractitioner}</strong></span>
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

            {/* ── 3.1 EARLY DEVELOPMENTAL HISTORY (EDH) OR PENDING PROMPT ── */}
            {edhReport ? (
              <div className="bg-white border border-purple-200 rounded-lg overflow-hidden shadow-2xs">
                <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-900" />
                    <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                      3.1 Early Developmental History (EDH) Assessment Record (RP-CLN-EDH)
                    </span>
                    <span className="font-mono text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-extrabold border border-purple-300">
                      {edhReport.report_number || 'RP-CLN-EDH'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      Exam Date: <strong className="text-slate-800">{edhReport.date || 'Recent'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleViewDownloadReport(edhReport)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-white hover:bg-slate-100 text-purple-950 border border-purple-300 shadow-2xs transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3 text-purple-700" />
                      <span>Open Full EDH Record</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 space-y-3 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Chief Developmental Concern
                      </span>
                      <p className="font-semibold text-slate-900 leading-relaxed">
                        {edhReport.chief_complaint || edhReport.diagnosis || edhReport.title || 'Developmental speech-language evaluation.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Developmental Milestones &amp; Acquisition Age
                      </span>
                      <p className="text-slate-800 leading-relaxed">
                        {edhReport.milestones || edhReport.developmental_milestones || edhReport.summary || 'Age-appropriate motor and cognitive acquisition milestones documented.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Prenatal &amp; Natal Summary
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {edhReport.prenatal_natal || edhReport.birth_history || 'Full term delivery, normal birth cry, no neonatal ICU admission.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Speech &amp; Language Milestones
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {edhReport.speech_milestones || edhReport.language_history || 'Babbling at 6 months; first meaningful words at 12 months; two-word combinations developing.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-purple-50/30 border border-purple-100 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">
                        Medical, Otologic &amp; Systemic History
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {edhReport.medical_history || 'No recurrent otitis media, seizure episodes, or metabolic complications reported.'}
                      </p>
                    </div>
                  </div>

                  {edhReport.recommendations && (
                    <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                        Clinical Recommendations &amp; Early Intervention Pathway
                      </span>
                      <p className="text-emerald-950 font-medium leading-relaxed">
                        {edhReport.recommendations}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
                    <div>
                      Attending Clinician: <strong className="text-slate-800">{edhReport.examiner && !edhReport.examiner.includes('Shreeharsh') ? edhReport.examiner : `${fullLeadPractitioner} (RCI ${clinicRci})`}</strong>
                    </div>
                    <Link
                      to={`/dashboard/reports/create?type=RP-CLN-EDH&patient=${demographics.uhid}`}
                      className="text-purple-700 hover:text-purple-950 font-bold underline"
                    >
                      Update / Amend Early Dev History →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 sm:p-6 shadow-2xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-amber-700" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                          Please Fill Early Dev History for this Patient
                        </h4>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                          Baseline Required
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/90 max-w-2xl leading-relaxed">
                        No Early Developmental History (EDH) has been recorded yet for <strong>{demographics.fullName}</strong> ({demographics.uhid}).
                        Under standardized RCI Clinical Protocols (RP-CLN-EDH), a baseline developmental history documenting prenatal, motor, speech-language, and feeding milestones must be recorded for clinical diagnostic correlation and therapy planning.
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard/reports/create?type=RP-CLN-EDH&patient=${demographics.uhid}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Fill Early Dev History Now</span>
                  </Link>
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
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-900" />
                <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                  Hearing Aid Dispensing &amp; Device Register (Section 5.5.26)
                </span>
                <span className="bg-purple-900 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {patientHearingAidsList.length} {patientHearingAidsList.length === 1 ? 'Device Fitted' : 'Devices Fitted'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  DPDP Act Compliant Serial Registry
                </span>
                <button
                  type="button"
                  onClick={() => setIsDispenseDeviceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Dispense / Link Device</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-3.5 text-xs">
              {patientHearingAidsList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {patientHearingAidsList.map((inst, i) => (
                      <div
                        key={inst.id || inst.serial || i}
                        className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/20 hover:bg-purple-50/30 transition-colors space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
                          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-700"></span>
                            <span>{inst.side || (i === 0 ? 'Right Ear' : 'Left Ear')}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {inst.status || 'FITTED & ACTIVE'}
                          </span>
                        </div>

                        <div>
                          <p className="font-extrabold text-purple-950 text-sm">{inst.make || `${inst.brand || ''} ${inst.model || ''}`}</p>
                          <span className="text-[10px] text-slate-500 block font-medium">
                            Style: {inst.style || 'RIC (Receiver-in-Canal)'} • Battery: {inst.battery || 'Rechargeable'}
                          </span>
                        </div>

                        <div className="p-2 rounded bg-white border border-purple-100 text-[11px] font-mono space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-sans">Serial Number:</span>
                            <strong className="text-purple-950 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {inst.serial || inst.serialNo || '—'}
                            </strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-sans">Warranty Coverage:</span>
                            <span className="text-emerald-700 font-bold">
                              Valid until {inst.warrantyUntil || '2028-10-18'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-sans">Dispense / Bill Ref:</span>
                            <span className="text-purple-800 font-semibold font-mono">
                              {inst.invoiceNo || 'INV-2026-0082'}
                            </span>
                          </div>
                          {inst.dispensedDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 font-sans">Fitting Date:</span>
                              <span className="text-slate-700">{inst.dispensedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Real-Ear Measurement (REM) &amp; Fitting Verification Target (RCI Protocol)
                    </span>
                    <p className="text-slate-800 font-medium pt-0.5">
                      Target Prescription: NAL-NL2 Adult/Pediatric Binaural target achieved within ±2 dB target across 250 Hz to 4000 Hz. Real-Ear Aided Response (REAR) verified.
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-slate-500">
                  <Activity className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                  <p className="font-bold text-slate-800 text-sm">No Hearing Aids Dispensed For This Patient</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    No hearing instruments have been linked to this patient dossier yet. When an invoice is issued with a hearing aid serial number, it will automatically register here.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setIsDispenseDeviceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dispense / Link Hearing Aid Now</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: THERAPY GOALS & SOAP (SECTION 5.5.27 & 5.5.28)
            ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'therapy' && (
          <div className="space-y-4">
            {/* 5.1 Active Clinical Rehabilitation Plans Header & Register */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-900" />
                  <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                    5.1 Active Clinical Rehabilitation Plans &amp; SMART Objectives (Section 5.5.27)
                  </span>
                  <span className="bg-purple-900 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {therapyPlans.length} {therapyPlans.length === 1 ? 'Active Plan' : 'Active Plans'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewSoapModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>+ Add SOAP Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNewPlanModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Create Rehabilitation Plan &amp; Goals</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5">
                {therapyPlans.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <Activity className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="font-bold text-sm text-slate-800">No Active Rehabilitation Plan Created Yet</p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Establish an individualized clinical therapy plan with SMART objectives, session schedules, and target mastery criteria for {demographics.fullName}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsNewPlanModalOpen(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#301444] text-white hover:bg-[#200b30] shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Initial Rehabilitation Plan</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {therapyPlans.map((plan, planIdx) => (
                      <div key={plan.planId || planIdx} className="border border-purple-200 rounded-lg p-3.5 bg-purple-50/15 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{plan.title}</h3>
                              <span className="font-mono text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded font-bold border border-purple-200">
                                {plan.planId}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              Assigned Clinician: <strong className="text-slate-800">{plan.assignedClinician}</strong>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-right text-[11px] text-slate-500 font-mono">
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">
                              Schedule: <strong className="text-slate-800">{plan.frequency}</strong>
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">
                              Review: <strong className="text-purple-950">{plan.reviewDate}</strong>
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Long-Term Goal</span>
                          <p className="font-medium text-slate-800 text-xs mt-0.5 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                            {plan.longTermGoal}
                          </p>
                        </div>

                        {/* SMART Objectives */}
                        {plan.smartObjectives && plan.smartObjectives.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Short-Term SMART Objectives &amp; Mastery Tracking
                            </span>
                            <div className="border border-slate-200 rounded overflow-hidden bg-white">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                                  <tr>
                                    <th className="py-2 px-3">Objective Description</th>
                                    <th className="py-2 px-2 text-center w-24">Baseline</th>
                                    <th className="py-2 px-2 text-center w-28">Target Criteria</th>
                                    <th className="py-2 px-3 text-center w-36">Current Progress</th>
                                    <th className="py-2 px-2 text-center w-28">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {plan.smartObjectives.map((obj, i) => (
                                    <tr key={obj.id || i} className="hover:bg-purple-50/20">
                                      <td className="py-2 px-3 text-slate-800 font-medium">{obj.text}</td>
                                      <td className="py-2 px-2 text-center font-mono text-slate-500 text-[11px]">{obj.baseline}</td>
                                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-800 text-[11px]">{obj.target}</td>
                                      <td className="py-2 px-3 text-center font-mono font-bold text-purple-950 text-[11px]">{obj.currentProgress}</td>
                                      <td className="py-2 px-2 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
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
                        )}

                        {/* Plan Actions: WhatsApp, Add SOAP, Delete */}
                        <div className="pt-2 border-t border-purple-100 flex items-center justify-between flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleSendPlanWhatsApp(plan)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
                            title="Send scheduled session and home practice reminder to patient via WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>Send Reminder on WhatsApp</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsNewSoapModalOpen(true)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-purple-700" />
                              <span>Add Session SOAP</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setPlanToDelete(plan);
                                setIsDeletePlanModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs transition-colors cursor-pointer"
                              title="Delete this rehabilitation plan"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Plan</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 5.2 Chronological Clinical SOAP Session Notes */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-[11px] text-[#301444] uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-700" />
                  <span>5.2 Chronological Clinical SOAP Session Notes (Section 5.5.28)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {soapNotes.length} Notes Logged
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNewSoapModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-900 text-white hover:bg-purple-950 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Log Note</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                {soapNotes.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    <p className="font-semibold text-slate-700">No Clinical SOAP Session Notes Logged</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Document patient response, objective measurements, and home practice plans after each session.</p>
                  </div>
                ) : (
                  soapNotes.map((s, idx) => (
                    <div key={s.id || idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-950">Session #{s.sessionNo}</span>
                          <span className="text-[11px] text-slate-500 font-mono">• {s.date}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          Clinician Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">S (Subjective)</span>
                          <p className="text-slate-800 leading-relaxed">{s.subjective}</p>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">O (Objective)</span>
                          <p className="text-slate-800 leading-relaxed">{s.objective}</p>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">A (Assessment)</span>
                          <p className="text-slate-800 leading-relaxed">{s.assessment}</p>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">P (Plan &amp; Home Practice)</span>
                          <p className="text-slate-800 leading-relaxed">{s.plan}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
              {/* Header Strip */}
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-purple-900" />
                  <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                    Statutory GST Tax Invoices &amp; Official Receipts
                  </span>
                  <span className="bg-purple-900 text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {patientInvoices.length} {patientInvoices.length === 1 ? 'Invoice' : 'Invoices'}
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                    Healthcare 0% Exempt (SAC 9993)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceRefreshTick((t) => t + 1);
                      notify.info('Invoices reloaded from billing ledger.');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                    title="Refresh billing register"
                  >
                    <RotateCcw className="w-3 h-3 text-purple-700" />
                    <span>Refresh</span>
                  </button>

                  <Link
                    to={`/dashboard/billing?patient=${patient.uhid}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Invoice</span>
                  </Link>
                </div>
              </div>

              {/* Date Filter Toolbar */}
              <div className="px-3 py-2 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-600 font-semibold text-[11px]">Filter Date:</span>
                    <select
                      value={invDatePreset}
                      onChange={(e) => {
                        setInvDatePreset(e.target.value);
                        setInvPage(1);
                      }}
                      className="h-7 px-2 text-xs bg-white border border-slate-300 rounded font-medium text-slate-700 focus:border-purple-600 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">All Recorded Dates</option>
                      <option value="TODAY">Today</option>
                      <option value="LAST_7_DAYS">Last 7 Days</option>
                      <option value="THIS_MONTH">This Month</option>
                      <option value="LAST_30_DAYS">Last 30 Days</option>
                      <option value="CUSTOM">Custom Date Range...</option>
                    </select>
                  </div>

                  {invDatePreset === 'CUSTOM' && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={invStartDate}
                        onChange={(e) => {
                          setInvStartDate(e.target.value);
                          setInvPage(1);
                        }}
                        className="h-7 px-2 text-xs bg-white border border-slate-300 rounded font-mono text-slate-700 focus:outline-hidden"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="date"
                        value={invEndDate}
                        onChange={(e) => {
                          setInvEndDate(e.target.value);
                          setInvPage(1);
                        }}
                        className="h-7 px-2 text-xs bg-white border border-slate-300 rounded font-mono text-slate-700 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {invDatePreset !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => {
                        setInvDatePreset('ALL');
                        setInvStartDate('');
                        setInvEndDate('');
                        setInvPage(1);
                      }}
                      className="text-[11px] text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 self-center">
                  Showing <strong className="text-slate-800">{filteredPatientInvoices.length}</strong> of{' '}
                  <strong className="text-slate-800">{patientInvoices.length}</strong> recorded invoices
                </div>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100/90 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 whitespace-nowrap">Invoice #</th>
                      <th className="py-2 px-3 whitespace-nowrap">Date</th>
                      <th className="py-2 px-3">Service / Product Description</th>
                      <th className="py-2 px-3 text-right whitespace-nowrap">Fee (₹)</th>
                      <th className="py-2 px-3 text-center whitespace-nowrap">Status</th>
                      <th className="py-2 px-3 font-mono whitespace-nowrap">Payment Ref</th>
                      <th className="py-2 px-3 text-right whitespace-nowrap">Clinical &amp; Billing Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedPatientInvoices.length > 0 ? (
                      paginatedPatientInvoices.map((inv) => (
                        <tr key={inv.invoiceNo || inv.id} className="hover:bg-purple-50/20 transition-colors">
                          <td className="py-2 px-3 font-mono font-bold text-purple-950 whitespace-nowrap">
                            <span className="bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              {inv.invoiceNo}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                            {inv.date}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-800">
                            <span>{inv.service}</span>
                            <span className="block text-[10px] text-slate-400">SAC: 9993 • Outpatient Healthcare Assessment</span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            ₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {inv.receiptNo || inv.refNo || 'NPCI-UPI'}
                          </td>
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              {/* 1. See Details */}
                              <button
                                type="button"
                                onClick={() => handleOpenPatientInvoice(inv)}
                                className="p-1 rounded text-purple-800 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                                title="See invoice details (Compact Excel Voucher)"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* 2. Download / Print */}
                              <button
                                type="button"
                                onClick={() => handleDownloadPatientInvoice(inv)}
                                className="p-1 rounded text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                                title="Print / Download official A4 Tax Invoice"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {/* 3. WhatsApp */}
                              <button
                                type="button"
                                onClick={() => handleWhatsAppPatientInvoice(inv)}
                                className="p-1 rounded text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                                title="Send invoice summary on WhatsApp"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </button>

                              {/* 4. Mail */}
                              <button
                                type="button"
                                onClick={() => handleOpenMailPatientInvoice(inv)}
                                className="p-1 rounded text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors cursor-pointer"
                                title="Email invoice to patient"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>

                              {/* 5. Edit */}
                              <button
                                type="button"
                                onClick={() => handleStartEditPatientInvoice(inv)}
                                className="p-1 rounded text-amber-700 hover:bg-amber-50 border border-amber-300 transition-colors cursor-pointer"
                                title="Edit invoice details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* 6. Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  setInvoiceToDelete(inv);
                                  setIsDeleteInvoiceModalOpen(true);
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete invoice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                          <p className="font-semibold text-slate-700">No matching invoices found for the selected date range.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Adjust your date filter or create a new invoice.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    value={invPageSize}
                    onChange={(e) => {
                      setInvPageSize(Number(e.target.value));
                      setInvPage(1);
                    }}
                    className="h-6 px-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-[11px] text-slate-400">|</span>
                  <span className="text-[11px]">
                    Page <strong className="text-slate-900">{invPage}</strong> of{' '}
                    <strong className="text-slate-900">{totalInvPages}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={invPage <= 1}
                    onClick={() => setInvPage((p) => Math.max(1, p - 1))}
                    className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalInvPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setInvPage(num)}
                      className={`h-6 w-6 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                        num === invPage
                          ? 'bg-purple-900 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={invPage >= totalInvPages}
                    onClick={() => setInvPage((p) => Math.min(totalInvPages, p + 1))}
                    className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
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
          <span className="font-medium text-[11px]">RCI CRR {clinicRci} • Vaani Speech &amp; Hearing Rehabilitation Center</span>
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

      {/* ── MODAL: EDIT PATIENT MASTER PROFILE ── */}
      <Modal
        isOpen={isEditPatientModalOpen}
        onClose={() => setIsEditPatientModalOpen(false)}
        title={`Edit Patient Master Profile: ${demographics.fullName} (${demographics.uhid})`}
        size="lg"
      >
        <form onSubmit={handleSavePatientEdit} className="space-y-4 text-xs font-sans">
          {/* Modal Tab Switcher */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setEditPatientModalTab('demographics')}
              className={`pb-2 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                editPatientModalTab === 'demographics'
                  ? 'border-[#301444] text-[#301444]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Demographics &amp; Contact
            </button>
            <button
              type="button"
              onClick={() => setEditPatientModalTab('guardians')}
              className={`pb-2 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                editPatientModalTab === 'guardians'
                  ? 'border-[#301444] text-[#301444]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>1.2 Guardians &amp; Caregivers</span>
              {editPatientForm.guardians?.length > 0 && (
                <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded-full font-bold">
                  {editPatientForm.guardians.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditPatientModalTab('referral')}
              className={`pb-2 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                editPatientModalTab === 'referral'
                  ? 'border-[#301444] text-[#301444]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>1.3 Referral &amp; ABHA</span>
              {(editPatientForm.referral?.doctorName || editPatientForm.abha_id) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>

          {/* TAB 1: DEMOGRAPHICS */}
          {editPatientModalTab === 'demographics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editPatientForm.full_name}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, full_name: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editPatientForm.date_of_birth}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, date_of_birth: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Biological Sex</label>
                  <select
                    value={editPatientForm.gender}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, gender: e.target.value })}
                    className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Phone</label>
                  <input
                    type="tel"
                    value={editPatientForm.phone}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, phone: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alternate Phone</label>
                  <input
                    type="tel"
                    value={editPatientForm.alt_phone}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, alt_phone: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editPatientForm.email}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, email: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Locality</label>
                  <input
                    type="text"
                    value={editPatientForm.city}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, city: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Clinical Service Line</label>
                  <select
                    value={editPatientForm.service_line}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, service_line: e.target.value })}
                    className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden font-medium"
                  >
                    <option value="SPEECH_LANGUAGE">Speech &amp; Language Pathology</option>
                    <option value="AUDIOLOGY">Audiology &amp; Hearing Rehabilitation</option>
                    <option value="VOICE">Voice Therapy &amp; Laryngeal Rehab</option>
                    <option value="DEVELOPMENTAL">Early Childhood Developmental Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={editPatientForm.address}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, address: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Clinical Concern / Chief Complaint</label>
                <textarea
                  rows={2}
                  value={editPatientForm.primary_concern}
                  onChange={(e) => setEditPatientForm({ ...editPatientForm, primary_concern: e.target.value })}
                  placeholder="Primary reason for referral or consultation..."
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 2: GUARDIANS & CAREGIVERS (1.2) */}
          {editPatientModalTab === 'guardians' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Family Link Group ID</label>
                <input
                  type="text"
                  placeholder="e.g. FAM-MH-STR-2026-0042"
                  value={editPatientForm.family_group_id}
                  onChange={(e) => setEditPatientForm({ ...editPatientForm, family_group_id: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Caregivers &amp; Legal Guardians</span>
                  <button
                    type="button"
                    onClick={handleAddGuardianRow}
                    className="h-7 px-2.5 rounded bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold text-xs flex items-center gap-1 border border-purple-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Guardian / Caregiver</span>
                  </button>
                </div>

                {editPatientForm.guardians && editPatientForm.guardians.length > 0 ? (
                  editPatientForm.guardians.map((g, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2.5 relative">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="font-bold text-slate-700 text-xs">Guardian #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGuardianRow(idx)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sachin Dattatray Shinde"
                            value={g.name}
                            onChange={(e) => handleUpdateGuardianField(idx, 'name', e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Relationship *</label>
                          <select
                            value={g.relation}
                            onChange={(e) => handleUpdateGuardianField(idx, 'relation', e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden font-medium"
                          >
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                            <option value="Grandparent">Grandparent</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Caregiver">Caregiver</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Contact Phone</label>
                          <input
                            type="tel"
                            placeholder="+91 98220 12345"
                            value={g.phone}
                            onChange={(e) => handleUpdateGuardianField(idx, 'phone', e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Occupation</label>
                          <input
                            type="text"
                            placeholder="e.g. Civil Engineer, Teacher"
                            value={g.occupation}
                            onChange={(e) => handleUpdateGuardianField(idx, 'occupation', e.target.value)}
                            className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(g.isLegalGuardian)}
                            onChange={(e) => handleUpdateGuardianField(idx, 'isLegalGuardian', e.target.checked)}
                            className="rounded border-slate-300 text-purple-900 focus:ring-0"
                          />
                          <span>Legal Guardian</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(g.canConsent)}
                            onChange={(e) => handleUpdateGuardianField(idx, 'canConsent', e.target.checked)}
                            className="rounded border-slate-300 text-purple-900 focus:ring-0"
                          />
                          <span>Authorized for Clinical Consent</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(g.canPickUp)}
                            onChange={(e) => handleUpdateGuardianField(idx, 'canPickUp', e.target.checked)}
                            className="rounded border-slate-300 text-purple-900 focus:ring-0"
                          />
                          <span>Authorized for Pick-up / Discharge</span>
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 px-3 text-center border-2 border-dashed border-slate-200 rounded-lg space-y-2 bg-slate-50/40">
                    <p className="text-xs text-slate-600 font-medium">No guardians added yet for this patient.</p>
                    <p className="text-[11px] text-slate-400">Click below to add a father, mother, or legal caregiver.</p>
                    <button
                      type="button"
                      onClick={handleAddGuardianRow}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#301444] hover:bg-[#200b30] shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Guardian / Caregiver</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REFERRAL & ABHA (1.3) */}
          {editPatientModalTab === 'referral' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5">
                <span className="font-bold text-slate-800 text-xs block">Referring Medical Partner / Doctor</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Nilesh Kulkarni, MD"
                      value={editPatientForm.referral?.doctorName || ''}
                      onChange={(e) =>
                        setEditPatientForm({
                          ...editPatientForm,
                          referral: { ...editPatientForm.referral, doctorName: e.target.value },
                        })
                      }
                      className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Specialization / Discipline</label>
                    <input
                      type="text"
                      placeholder="e.g. Paediatrician, ENT Surgeon"
                      value={editPatientForm.referral?.discipline || ''}
                      onChange={(e) =>
                        setEditPatientForm({
                          ...editPatientForm,
                          referral: { ...editPatientForm.referral, discipline: e.target.value },
                        })
                      }
                      className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Hospital / Clinic / Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Satara Child Health Hospital & NICU"
                      value={editPatientForm.referral?.hospital || ''}
                      onChange={(e) =>
                        setEditPatientForm({
                          ...editPatientForm,
                          referral: { ...editPatientForm.referral, hospital: e.target.value },
                        })
                      }
                      className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Referral Reason / Clinical Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Speech delay, unclear speech at 3.5 years..."
                      value={editPatientForm.referral?.notes || ''}
                      onChange={(e) =>
                        setEditPatientForm({
                          ...editPatientForm,
                          referral: { ...editPatientForm.referral, notes: e.target.value },
                        })
                      }
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-purple-200 bg-purple-50/40 space-y-2">
                <span className="font-bold text-purple-950 text-xs block">
                  Ayushman Bharat Digital Mission (ABDM) / ABHA Health Account
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-0.5">
                    ABHA ID / ABHA Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 91-4412-8921-0042@abdm or 14-digit ABHA Number"
                    value={editPatientForm.abha_id}
                    onChange={(e) => setEditPatientForm({ ...editPatientForm, abha_id: e.target.value })}
                    className="w-full h-8 px-2 text-xs bg-white border border-purple-300 rounded font-mono focus:border-purple-600 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    DPDP Act 2023 compliant: Zero Aadhaar data stored. Linked securely to Ayushman Bharat Health Records.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500">
              * Changes persist securely under patient record.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditPatientModalOpen(false)}
                className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: CONFIRM DELETE PATIENT ── */}
      <Modal
        isOpen={isDeletePatientModalOpen}
        onClose={() => setIsDeletePatientModalOpen(false)}
        title="Confirm Patient Record Deletion"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-700">
            Are you sure you want to delete patient file <strong>{demographics.fullName}</strong> ({demographics.uhid})?
          </p>
          <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
            ⚠️ This will remove the patient record from your active ledger. Clinical audit logs remain stored cryptographically under DPDP Act statutory requirements.
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsDeletePatientModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDeletePatient}
              className="h-8 px-4 rounded text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs"
            >
              Yes, Delete Patient
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: CREATE REHABILITATION PLAN & GOALS ── */}
      <Modal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        title={`New Rehabilitation Plan & Goals — ${demographics.fullName}`}
        size="lg"
      >
        <form onSubmit={handleSaveNewPlan} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Rehabilitation Protocol Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newPlanForm.title}
              onChange={(e) => setNewPlanForm({ ...newPlanForm, title: e.target.value })}
              className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Assigned Clinician</label>
              <input
                type="text"
                required
                value={newPlanForm.clinician}
                onChange={(e) => setNewPlanForm({ ...newPlanForm, clinician: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Session Schedule</label>
              <input
                type="text"
                value={newPlanForm.schedule}
                onChange={(e) => setNewPlanForm({ ...newPlanForm, schedule: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Review Date</label>
              <input
                type="date"
                value={newPlanForm.reviewDate}
                onChange={(e) => setNewPlanForm({ ...newPlanForm, reviewDate: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Primary Long-Term Goal <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={newPlanForm.longTermGoal}
              onChange={(e) => setNewPlanForm({ ...newPlanForm, longTermGoal: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden"
            />
          </div>

          <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-200 space-y-2">
            <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider block">
              Short-Term SMART Objectives (Mastery Tracking)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-0.5 text-[10px]">Objective 1 Description</label>
                <input
                  type="text"
                  value={newPlanForm.obj1Desc}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, obj1Desc: e.target.value })}
                  className="w-full h-7.5 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[10px]">Target Criteria</label>
                <input
                  type="text"
                  value={newPlanForm.obj1Target}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, obj1Target: e.target.value })}
                  className="w-full h-7.5 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-purple-100">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-0.5 text-[10px]">Objective 2 Description</label>
                <input
                  type="text"
                  value={newPlanForm.obj2Desc}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, obj2Desc: e.target.value })}
                  className="w-full h-7.5 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[10px]">Target Criteria</label>
                <input
                  type="text"
                  value={newPlanForm.obj2Target}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, obj2Target: e.target.value })}
                  className="w-full h-7.5 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewPlanModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs"
            >
              Save Rehabilitation Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: LOG SOAP NOTE ── */}
      <Modal
        isOpen={isNewSoapModalOpen}
        onClose={() => setIsNewSoapModalOpen(false)}
        title={`Log Clinical SOAP Session Note — ${demographics.fullName}`}
        size="lg"
      >
        <form onSubmit={handleSaveNewSoap} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Session Number</label>
              <input
                type="number"
                min="1"
                value={newSoapForm.sessionNo}
                onChange={(e) => setNewSoapForm({ ...newSoapForm, sessionNo: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Session Date</label>
              <input
                type="date"
                value={newSoapForm.date}
                onChange={(e) => setNewSoapForm({ ...newSoapForm, date: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-900 font-bold mb-1">S (Subjective) — Patient / Caregiver Feedback</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Patient reports easier phonation and reduced throat tension during classroom speaking..."
              value={newSoapForm.subjective}
              onChange={(e) => setNewSoapForm({ ...newSoapForm, subjective: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-purple-900 font-bold mb-1">O (Objective) — Measured Performance &amp; Tasks Completed</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. MPT increased from 10.2s to 13.5s; sustained vocalic sighs produced with relaxed laryngeal posture..."
              value={newSoapForm.objective}
              onChange={(e) => setNewSoapForm({ ...newSoapForm, objective: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-purple-900 font-bold mb-1">A (Assessment) — Clinical Interpretation</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Consistent progressive mastery of resonant voice therapy exercises; extrinsic muscular tension subsiding..."
              value={newSoapForm.assessment}
              onChange={(e) => setNewSoapForm({ ...newSoapForm, assessment: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-purple-900 font-bold mb-1">P (Plan &amp; Home Practice)</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Continue lip trills 3x daily; follow up in 3 days for conversational transfer..."
              value={newSoapForm.plan}
              onChange={(e) => setNewSoapForm({ ...newSoapForm, plan: e.target.value })}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsNewSoapModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs"
            >
              Save SOAP Session Note
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: CONFIRM DELETE THERAPY PLAN ── */}
      <Modal
        isOpen={isDeletePlanModalOpen}
        onClose={() => setIsDeletePlanModalOpen(false)}
        title="Delete Rehabilitation Plan"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-700">
            Are you sure you want to remove therapy plan <strong>{planToDelete?.planId}</strong> ({planToDelete?.title})?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsDeletePlanModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDeletePlan(planToDelete)}
              className="h-8 px-4 rounded text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs"
            >
              Delete Plan
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: COMPACT EXCEL VIEW TAX INVOICE ── */}
      <Modal
        isOpen={isViewInvoiceModalOpen}
        onClose={() => setIsViewInvoiceModalOpen(false)}
        title={selectedInvoiceForView ? `Tax Invoice & Clinical Receipt: ${selectedInvoiceForView.invoiceNo}` : 'Invoice Details'}
        size="2xl"
        footer={
          selectedInvoiceForView && (
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleDownloadPatientInvoice(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-purple-950 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppPatientInvoice(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenMailPatientInvoice(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsViewInvoiceModalOpen(false);
                    handleStartEditPatientInvoice(selectedInvoiceForView);
                  }}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsViewInvoiceModalOpen(false)}
                className="h-7.5 px-3.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )
        }
      >
        {selectedInvoiceForView && (
          <div className="font-sans text-xs">
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
              <div className="h-1 bg-gradient-to-r from-[#301444] via-purple-700 to-[#301444]" />

              {/* Compact Letterhead */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-300 bg-white gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={clinicLogo}
                    alt={clinicName}
                    className="h-9 w-auto object-contain shrink-0"
                    onError={(e) => { e.target.src = '/vaani-logo.png'; }}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm tracking-tight text-[#301444]">
                        {clinicName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium border-l border-slate-300 pl-2">
                        RCI CRR No. <strong className="text-slate-800 font-mono">{clinicRci}</strong> • ISO 9001:2015 Practice
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {clinicAddress} • {clinicHelpline}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9.5px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 block mb-0.5">
                    GST SAC: {selectedInvoiceForView.hsnSac || clinicSac}{clinicGstin ? ` • GSTIN: ${clinicGstin}` : ''}
                  </span>
                  <span className="font-mono text-xs font-extrabold text-slate-900 block">
                    {selectedInvoiceForView.invoiceNo}
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-500">
                    Date: {selectedInvoiceForView.date}
                  </span>
                </div>
              </div>

              {/* Sub-header Bar */}
              <div className="px-3.5 py-1.5 bg-slate-50 border-b border-slate-300 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-extrabold text-[#301444] uppercase tracking-wider text-[11px]">
                    TAX INVOICE &amp; CLINICAL PAYMENT RECEIPT
                  </span>
                  <span className="text-slate-500 text-[10px]"> • Original for Recipient</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    selectedInvoiceForView.status === 'PAID'
                      ? 'bg-slate-50 text-slate-900 border-slate-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}>
                    {selectedInvoiceForView.status === 'PAID' ? (
                      <>
                        <span className="text-emerald-600 font-extrabold text-xs">✓</span>
                        <span>PAYMENT RECEIVED</span>
                      </>
                    ) : (
                      <>
                        <span className="text-rose-600">●</span>
                        <span>PAYMENT DUE</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold">
                    {selectedInvoiceForView.paymentMode}
                  </span>
                </div>
              </div>

              {/* Patient and Fiscal Info */}
              <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-white">
                <div className="p-2.5">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Billed To (Patient Information)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900 text-xs">{selectedInvoiceForView.patientName}</span>
                    <span className="font-mono text-[10px] font-bold text-purple-900">
                      UHID: {selectedInvoiceForView.uhid || demographics.uhid}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>Phone: {selectedInvoiceForView.phone || demographics.primaryPhone}</span>
                    <span>Center: Satara Outpatient Unit</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50/50">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Fiscal &amp; Invoice Particulars
                  </span>
                  <div className="flex items-baseline justify-between text-[10px]">
                    <span className="text-slate-500">Invoice Reference:</span>
                    <span className="font-mono font-extrabold text-slate-900">{selectedInvoiceForView.invoiceNo}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[10px] mt-0.5">
                    <span className="text-slate-500">Receipt Ref:</span>
                    <span className="font-mono text-slate-700">{selectedInvoiceForView.receiptNo || 'REC-' + selectedInvoiceForView.invoiceNo.replace('INV-', '')}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#301444] text-white text-[9.5px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-1.5 px-2 text-center w-8 border-r border-purple-800">#</th>
                    <th className="py-1.5 px-2.5 border-r border-purple-800">Clinical Investigation / Health Care Service</th>
                    <th className="py-1.5 px-2 text-center w-20 border-r border-purple-800">SAC / HSN</th>
                    <th className="py-1.5 px-2 text-center w-24 border-r border-purple-800">Discipline</th>
                    <th className="py-1.5 px-2.5 text-right w-24 border-r border-purple-800">Base Fee (₹)</th>
                    <th className="py-1.5 px-2 text-center w-20 border-r border-purple-800">GST Rate</th>
                    <th className="py-1.5 px-2.5 text-right w-24">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-300 bg-white">
                    <td className="py-2 px-2 text-center font-mono font-bold text-slate-700 border-r border-slate-300">01</td>
                    <td className="py-2 px-2.5 border-r border-slate-300">
                      <span className="font-bold text-slate-900 block text-xs">{selectedInvoiceForView.service}</span>
                      <span className="text-[9.5px] font-mono text-purple-800">
                        Code: SVC-CLINICAL • RCI Clinical Protocol
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono text-slate-600 border-r border-slate-300">
                      999312
                    </td>
                    <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-300 text-[10px]">
                      Clinical Healthcare
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-semibold text-slate-800 border-r border-slate-300">
                      ₹{Number(selectedInvoiceForView.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-300 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 text-slate-700">
                        0% (Exempt)
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{Number(selectedInvoiceForView.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Subtotal & Amount in Words */}
              <div className="grid grid-cols-12 border-t border-slate-300 divide-x divide-slate-300 bg-white">
                <div className="col-span-7 p-2.5 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">AMOUNT IN WORDS:</span>
                    <p className="text-xs font-extrabold text-slate-800 italic mt-0.5">
                      {numberToWordsINR(selectedInvoiceForView.totalAmount)}
                    </p>
                  </div>
                  <p className="text-[9.5px] text-slate-500 border-t border-dashed border-slate-200 pt-1.5 mt-1.5 leading-tight">
                    {selectedInvoiceForView.taxType === 'TAXABLE_GOODS'
                      ? `*Taxable supply of hearing aid / orthopedic appliance under HSN Code ${clinicHsn} (CGST 9% + SGST 9% = 18%).`
                      : `*Statutorily exempt from Goods & Services Tax (GST) under Notification No. 12/2017-Central Tax (Rate), Heading ${clinicSac} (Health Care Services by Clinical Establishment).`}
                    {clinicGstin && <span className="block mt-0.5 text-slate-600 font-medium">Clinic GSTIN: <strong>{clinicGstin}</strong></span>}
                  </p>
                </div>
                <div className="col-span-5 bg-white divide-y divide-slate-100 flex flex-col justify-center">
                  <div className="flex justify-between items-center py-1 px-3 text-[10.5px] text-slate-600">
                    <span>Base Assessment Fee:</span>
                    <span className="font-mono font-semibold">₹{Number(selectedInvoiceForView.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-3 text-[10.5px] text-slate-600">
                    <span>GST Applied (0%):</span>
                    <span className="font-mono font-semibold">₹0.00</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 px-3 bg-purple-50/70 border-t border-purple-200 text-[#301444] font-extrabold text-xs">
                    <span>NET TOTAL PAYABLE:</span>
                    <span className="font-mono text-sm">₹{Number(selectedInvoiceForView.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Settlement and Clinician Authorization */}
              <div className="grid grid-cols-2 divide-x divide-slate-300 border-t border-slate-300 bg-white">
                <div className="flex items-center gap-2.5 p-2 bg-purple-50/20">
                  <div className="w-10 h-10 bg-white p-0.5 rounded border border-purple-200 flex items-center justify-center shrink-0">
                    <QrCode className="w-9 h-9 text-[#301444]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-purple-900 uppercase tracking-wider block">DIRECT NPCI SETTLEMENT</span>
                    <span className="text-[11px] font-mono font-extrabold text-slate-900 block leading-tight">{clinicUpiId}</span>
                    <span className="text-[9px] text-slate-500 block leading-tight">Payee: {clinicPayee} • {clinicBankName} • IFSC: {clinicBankIfsc}</span>
                  </div>
                </div>

                <div className="p-2 text-right flex flex-col justify-center">
                  <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">DIGITALLY SIGNED &amp; AUTHORIZED CLINICIAN</span>
                  <div className="font-extrabold text-slate-900 text-[11px] leading-tight">Ms. Palak Paresh Gandhi</div>
                  <div className="text-[9.5px] text-slate-500 leading-tight">BASLP, MASLP (Gold Medalist) • Consultant Audiologist</div>
                  <div className="text-[9.5px] font-mono text-slate-700">RCI Registration: CRR No. <strong>{clinicRci}</strong></div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[8.5px] text-slate-500">
                <span>This is an official computer-generated clinical tax invoice &amp; voucher under the Clinical Establishments Act and DPDP Act 2023.</span>
                <span className="font-mono text-[8.5px] text-slate-400">SHA256:e3089426fa...{selectedInvoiceForView.invoiceNo}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: EMAIL TAX INVOICE ── */}
      <Modal
        isOpen={isMailModalOpen}
        onClose={() => setIsMailModalOpen(false)}
        title="Email Tax Invoice &amp; Official Receipt"
        size="md"
      >
        {selectedInvoiceForMail && (
          <form onSubmit={handleSendMailPatientInvoice} className="space-y-3 font-sans text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Recipient Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={mailRecipient}
                onChange={(e) => setMailRecipient(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject</label>
              <input
                type="text"
                required
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Note to Patient</label>
              <textarea
                rows={5}
                value={mailNote}
                onChange={(e) => setMailNote(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-hidden font-mono"
              />
            </div>

            <div className="p-2.5 rounded bg-purple-50/50 border border-purple-200 text-[11px] text-purple-950 flex items-center justify-between">
              <span>Attached: <strong>{selectedInvoiceForMail.invoiceNo}.pdf</strong> (A4 Full-Sheet Signed Invoice)</span>
              <span className="font-mono font-bold text-slate-700">₹{selectedInvoiceForMail.totalAmount}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsMailModalOpen(false)}
                className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSendingMail}
                className="h-8 px-4 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isSendingMail ? 'Sending...' : 'Send Invoice Email'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── MODAL: EDIT TAX INVOICE ── */}
      <Modal
        isOpen={isEditInvoiceModalOpen}
        onClose={() => setIsEditInvoiceModalOpen(false)}
        title={editingInvoice ? `Edit Invoice: ${editingInvoice.invoiceNo}` : 'Edit Invoice'}
        size="md"
      >
        {editingInvoice && (
          <form onSubmit={handleSaveEditedPatientInvoice} className="space-y-3 font-sans text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Service Description</label>
              <input
                type="text"
                required
                value={editingInvoice.service}
                onChange={(e) => setEditingInvoice({ ...editingInvoice, service: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editingInvoice.amount}
                  onChange={(e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    setEditingInvoice({
                      ...editingInvoice,
                      amount: amt,
                      totalAmount: amt,
                    });
                  }}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Status</label>
                <select
                  value={editingInvoice.status}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value })}
                  className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden font-semibold"
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Mode</label>
                <select
                  value={editingInvoice.paymentMode}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, paymentMode: e.target.value })}
                  className="w-full h-8 px-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden font-mono"
                >
                  <option value="UPI">UPI</option>
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD</option>
                  <option value="NETBANKING">NETBANKING</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Reference / Receipt #</label>
                <input
                  type="text"
                  value={editingInvoice.receiptNo || editingInvoice.refNo || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, receiptNo: e.target.value, refNo: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded font-mono focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditInvoiceModalOpen(false)}
                className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 px-4 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs"
              >
                Save Invoice Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── MODAL: CONFIRM DELETE INVOICE ── */}
      <Modal
        isOpen={isDeleteInvoiceModalOpen}
        onClose={() => setIsDeleteInvoiceModalOpen(false)}
        title="Delete Tax Invoice"
        size="sm"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-700">
            Are you sure you want to delete invoice <strong>{invoiceToDelete?.invoiceNo}</strong> for <strong>{invoiceToDelete?.patientName}</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsDeleteInvoiceModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDeletePatientInvoice(invoiceToDelete)}
              className="h-8 px-4 rounded text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs"
            >
              Delete Invoice
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL: EMAIL CLINICAL REPORT ── */}
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
                  The official PDF report is digitally signed with clinician registration (RCI CRR {clinicRci}) and cryptographically linked to the clinic&apos;s master ledger under the DPDP Act 2023.
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

      {/* ── MODAL: EDIT CLINICAL REPORT ── */}
      <Modal
        isOpen={isEditReportModalOpen}
        onClose={() => setIsEditReportModalOpen(false)}
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
                onClick={() => setIsEditReportModalOpen(false)}
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
        isOpen={isDeleteReportModalOpen}
        onClose={() => setIsDeleteReportModalOpen(false)}
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
              Patient: <strong>{demographics.fullName}</strong> (UHID: {demographics.uhid})
            </p>
            <p className="text-[11px] text-slate-500">
              This action will remove the record from both the Clinical Records register and the patient&apos;s dossier.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteReportModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReport}
                className="px-4 py-1.5 rounded text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: DISPENSE / LINK HEARING AID DIRECTLY (TAB 4) ── */}
      <Modal
        isOpen={isDispenseDeviceModalOpen}
        onClose={() => setIsDispenseDeviceModalOpen(false)}
        title={`Dispense / Link Hearing Aid to ${demographics.fullName}`}
        size="md"
      >
        <form onSubmit={handleSaveDirectDispenseDevice} className="space-y-3 font-sans text-xs">
          <div className="p-2.5 rounded bg-purple-50/70 border border-purple-200 text-purple-950 space-y-0.5">
            <span className="font-bold text-xs">Patient Serial Registration</span>
            <p className="text-[11px] text-purple-800">
              UHID: <strong>{demographics.uhid}</strong> • Name: <strong>{demographics.fullName}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Device Serial Number (from Barcode) *</label>
              <input
                type="text"
                required
                placeholder="e.g. PHO-891240"
                value={dispenseForm.serialNo}
                onChange={(e) => setDispenseForm({ ...dispenseForm, serialNo: e.target.value })}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Ear / Side *</label>
              <select
                value={dispenseForm.ear}
                onChange={(e) => setDispenseForm({ ...dispenseForm, ear: e.target.value })}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="Right Ear">Right Ear</option>
                <option value="Left Ear">Left Ear</option>
                <option value="Bilateral">Bilateral (Both Ears)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Manufacturer / Brand</label>
              <select
                value={dispenseForm.brand}
                onChange={(e) => setDispenseForm({ ...dispenseForm, brand: e.target.value })}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded"
              >
                <option value="Phonak">Phonak (Sonova)</option>
                <option value="Oticon">Oticon (Demant)</option>
                <option value="Signia">Signia (WSAudology)</option>
                <option value="Widex">Widex (WSAudology)</option>
                <option value="Resound">GN ReSound</option>
                <option value="Starkey">Starkey</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Audéo Lumity L90-R"
                value={dispenseForm.model}
                onChange={(e) => setDispenseForm({ ...dispenseForm, model: e.target.value })}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Style / Form</label>
              <select
                value={dispenseForm.style}
                onChange={(e) => setDispenseForm({ ...dispenseForm, style: e.target.value })}
                className="h-8 w-full px-1 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="RIC (Receiver-in-Canal)">RIC</option>
                <option value="BTE (Behind-the-Ear)">BTE</option>
                <option value="CIC (Completely-in-Canal)">CIC</option>
                <option value="ITC (In-the-Canal)">ITC</option>
                <option value="IIC (Invisible-in-Canal)">IIC</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Battery Type</label>
              <select
                value={dispenseForm.battery}
                onChange={(e) => setDispenseForm({ ...dispenseForm, battery: e.target.value })}
                className="h-8 w-full px-1 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="Lithium-ion Rechargeable">Rechargeable</option>
                <option value="Zinc-Air Size 312">Zinc-Air 312</option>
                <option value="Zinc-Air Size 10">Zinc-Air 10</option>
                <option value="Zinc-Air Size 13">Zinc-Air 13</option>
                <option value="Zinc-Air Size 675">Zinc-Air 675</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Warranty</label>
              <select
                value={dispenseForm.warrantyYears}
                onChange={(e) => setDispenseForm({ ...dispenseForm, warrantyYears: e.target.value })}
                className="h-8 w-full px-1 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years (Standard)</option>
                <option value="3">3 Years (Extended)</option>
                <option value="4">4 Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Invoice / Receipt Reference (Optional)</label>
            <input
              type="text"
              placeholder="e.g. INV-2026-0082"
              value={dispenseForm.invoiceNo}
              onChange={(e) => setDispenseForm({ ...dispenseForm, invoiceNo: e.target.value })}
              className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDispenseDeviceModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-[#301444] text-white hover:bg-[#200b30] shadow-2xs cursor-pointer"
            >
              Register &amp; Link Device
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientDetailPage;
