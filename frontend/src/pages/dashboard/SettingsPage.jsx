import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building,
  ShieldCheck,
  Clock,
  CalendarCheck,
  IndianRupee,
  Bell,
  Sliders,
  History,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  QrCode,
  Smartphone,
  Mail,
  Send,
  FileText,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Info,
  UploadCloud,
  Image as ImageIcon,
  Database,
  HardDrive,
  AlertTriangle,
  ShieldAlert,
  Archive,
  FileSpreadsheet,
  FileCheck,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import { getServiceRates, saveServiceRates, resetServiceRates } from '../../data/serviceRatesData';

// ── INITIAL VERIFIED CLINIC SETTINGS BASELINE ──
const DEFAULT_SETTINGS = {
  identity: {
    legalName: 'Vaani Speech & Hearing Clinic',
    tradeName: 'Vaani Clinic',
    taglineEn: 'Speak • Hear • Connect',
    taglineMr: 'स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा',
    logoUrl: '/vaani-logo.png',
    logoWhiteUrl: '/vaani-logo-white.png',
    letterheadTitle: 'VAANI SPEECH & HEARING REHABILITATION CENTER',
    stampNote: 'RCI Registered Practitioner Seal (CRR No. A79214)',
  },
  contact: {
    primaryPhone: '+91 98220 12345',
    whatsappEnabled: true,
    consultationPhone: '+91 94230 99887',
    officialEmail: 'info@vaaniclinic.com',
    websiteUrl: 'https://vaaniclinic.com',
    addressLine1: 'Shop No. 4, Ground Floor, Sadashiv Arcade',
    addressLine2: 'Opp. Satara Zilla Parishad, Sadashiv Peth',
    locality: 'Sadashiv Peth',
    taluka: 'Satara',
    district: 'Satara',
    state: 'Maharashtra',
    pin: '415002',
    landmarkEn: 'Opposite Zilla Parishad Gate',
    landmarkMr: 'जिल्हा परिषद गेटसमोर',
    mapsUrl: 'https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Satara',
    geoCoordinates: '73.9934, 17.6833',
    parkingNote: 'Dedicated two-wheeler parking in front; four-wheeler street parking on main road.',
    accessibilityNote: 'Ground-floor wheelchair accessible entrance with permanent entrance ramp.',
  },
  credentials: {
    rciNumber: 'A79214',
    rciVerified: true,
    rciValidUntil: '2031-10-15',
    titlePermitted: true, // Permits "Dr." prefix
    cbtQualificationVerified: true, // BR-042
    cbtDegree: 'Postgraduate Cognitive Behavioural Interventions (SASLP / BVDU)',
    clinicalEstablishmentNo: 'MH-STR-CEA-2024-0081',
    shopActNo: 'STR-SA-2024-0192',
    udyamNo: 'UDYAM-MH-28-0012345',
    gstin: '27AAAAA0000A1Z5',
    panMasked: 'ABCDE****F',
  },
  hours: {
    slotGranularityMin: 15,
    timezone: 'Asia/Kolkata',
    morningStart: '10:00',
    morningEnd: '13:30',
    eveningStart: '15:30',
    eveningEnd: '20:00',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    sundayClosed: true,
  },
  bookingPolicy: {
    minNoticeMin: 120, // 2 hours
    maxAdvanceDays: 30,
    holdHours: 24,
    autoConfirm: false, // Manual triage
    cancelWindowHours: 4,
    rescheduleLimit: 2,
    sameDayAllowed: true,
    graceNoShowMin: 15,
    ptaDailyCap: 5,
    speechTherapyDailyCap: 8,
  },
  billing: {
    uhidPrefix: 'VN-',
    uhidFormat: 'VN-YY-######',
    invoicePrefix: 'INV-2026-',
    receiptPrefix: 'REC-2026-',
    resetFiscalCycle: '04-01', // April 1st
    serviceTaxPercent: 0, // Healthcare exempt
    productTaxPercent: 18, // Hearing aid accessories
    sacCode: '999312',
    hsnCode: '9021',
    showGstOnInvoice: false,
    roundingMode: 'NEAREST_INTEGER',
    upiId: 'vaaniclinic@okaxis',
    upiName: 'Vaani Speech & Hearing Clinic',
    bankAccountName: 'Vaani Speech & Hearing Clinic',
    bankName: 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara',
    bankIfsc: 'HDFC0000123',
    bankAccountMasked: '**** **** **** 4892',
  },
  notifications: {
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    reminderOffset1Hours: 24,
    reminderOffset2Hours: 2,
    senderEmail: 'appointments@vaaniclinic.com',
    senderDisplayName: 'Vaani Speech & Hearing Clinic',
    grievanceOfficerName: 'Ms. Palak Paresh Gandhi',
    grievanceEmail: 'grievance@vaaniclinic.com',
    grievancePhone: '+91 98220 12345',
    adultRetentionYears: 7,
    minorRetentionAge: 21,
    billingRetentionYears: 8,
    auditRetentionYears: 7,
  },
  features: {
    inventory: true,
    expenses: true,
    packages: true,
    cbt: true,
    onlineBooking: true,
    waitlist: true,
    referralInbox: true,
    twoFactorEnforced: true,
    idleTimeoutMin: 15,
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    encryption: 'STARTTLS',
    senderName: 'Vaani Speech & Hearing Clinic',
    senderEmail: 'info.shreeharshshivpuje@gmail.com',
    password: '',
    hasPasswordStored: true,
    enableAutoDispatch: true,
  },
};

// ── RECOMMENDED SMTP PROVIDER PRESETS ──
const RECOMMENDED_SMTP_PROVIDERS = [
  {
    name: 'Google Workspace / Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    encryption: 'STARTTLS',
    note: 'Requires 2-Step Verification & Google App Password.',
  },
  {
    name: 'Brevo (Sendinblue)',
    host: 'smtp-relay.brevo.com',
    port: 587,
    encryption: 'STARTTLS',
    note: 'Username: Brevo login email | Password: Brevo SMTP Key.',
  },
  {
    name: 'Microsoft 365 / Outlook',
    host: 'smtp.office365.com',
    port: 587,
    encryption: 'STARTTLS',
    note: 'Port 587 with STARTTLS encryption.',
  },
];

// ── DEFAULT DISPATCHED MAIL AUDIT LOGS ──
const DEFAULT_MAIL_LOGS = [
  {
    id: 'mail_log_1',
    timestamp: '20/09/2026, 21:31:40',
    recipient: 'info.shreeharshshivpuje@gmail.com',
    subject: 'Vaani Clinic ERP - Security 2FA Verification Code [283079]',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_2',
    timestamp: '20/09/2026, 15:42:59',
    recipient: 'info.shreeharshshivpuje@gmail.com',
    subject: 'Delivery Memo Invoice #1 - Vaani Speech & Hearing',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_3',
    timestamp: '19/09/2026, 17:15:22',
    recipient: 'aarav.shinde.parent@gmail.com',
    subject: 'Appointment Confirmation & Token #01 - Aarav Sachin Shinde',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully (250 2.1.5 Recipient OK)',
  },
  {
    id: 'mail_log_4',
    timestamp: '19/09/2026, 14:05:10',
    recipient: 'sunita.more@outlook.com',
    subject: 'Clinical Diagnostic Report: Pure Tone Audiometry (Bilateral)',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully (Report Hash Verified)',
  },
  {
    id: 'mail_log_5',
    timestamp: '18/09/2026, 11:20:45',
    recipient: 'vijay.kadam.satara@gmail.com',
    subject: 'Hearing Aid Trial Fitting Slip & Warranty Certificate',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_6',
    timestamp: '18/09/2026, 09:30:12',
    recipient: 'kavita.bhosale@yahoo.com',
    subject: 'Voice Therapy Session 04 - Home Vocal Practice Exercise Sheet',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_7',
    timestamp: '17/09/2026, 18:10:00',
    recipient: 'admin@vaaniclinic.com',
    subject: 'Vaani Clinic - Daily OPD Diagnostic & Fee Collection Summary',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_8',
    timestamp: '16/09/2026, 16:40:18',
    recipient: 'ramesh.deshmukh@gmail.com',
    subject: 'Clinical Recall Reminder: Bi-Annual Hearing Aid Acoustic Check',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_9',
    timestamp: '15/09/2026, 12:15:30',
    recipient: 'patient.inquiry@gmail.com',
    subject: 'Welcome to Vaani Speech & Hearing Clinic - Patient Intake Slip',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_10',
    timestamp: '14/09/2026, 10:00:00',
    recipient: 'admin@vaaniclinic.com',
    subject: 'Weekly Data Backup & DPDP Consent Vault Integrity Check',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_11',
    timestamp: '13/09/2026, 16:45:12',
    recipient: 'invalid-address@nonexistent.domain',
    subject: 'Tax Invoice #INV-2026-0038 Delivery Attempt',
    host: 'smtp.gmail.com:587',
    status: 'FAILED',
    details: '550 5.1.1 User unknown / Host unreachable',
  },
  {
    id: 'mail_log_12',
    timestamp: '12/09/2026, 18:00:25',
    recipient: 'dhananjay.jadhav@gmail.com',
    subject: 'Newborn OAE Hearing Screening Certificate (PASS - Bilateral)',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully',
  },
  {
    id: 'mail_log_13',
    timestamp: '10/09/2026, 09:30:00',
    recipient: 'info.shreeharshshivpuje@gmail.com',
    subject: 'SMTP Connection Diagnostic Test Dispatch',
    host: 'smtp.gmail.com:587',
    status: 'SENT',
    details: 'Dispatched successfully (Handshake verified)',
  },
];

// ── MAHARASHTRA STATE GAZETTED HOLIDAYS TEMPLATE ──
const MAHARASHTRA_HOLIDAYS_TEMPLATE = [
  { date: '2026-08-27', name: 'Ganesh Chaturthi (गणेश चतुर्थी)', type: 'State Gazetted' },
  { date: '2026-09-06', name: 'Anant Chaturdashi (अनंत चतुर्दशी)', type: 'State Gazetted' },
  { date: '2026-10-20', name: 'Dussehra / Vijayadashami (दसरा)', type: 'National Public' },
  { date: '2026-11-08', name: 'Diwali / Laxmi Pujan (दिवाळी लक्ष्मीपूजन)', type: 'State Gazetted' },
  { date: '2026-11-10', name: 'Diwali Padwa / Balipratipada (दिवाळी पाडवा)', type: 'State Gazetted' },
  { date: '2026-01-26', name: 'Republic Day (प्रजासत्ताक दिन)', type: 'National Public' },
  { date: '2026-03-19', name: 'Gudi Padwa (गुढीपाडवा)', type: 'Maharashtra New Year' },
  { date: '2026-05-01', name: 'Maharashtra Day (महाराष्ट्र दिन)', type: 'State Gazetted' },
];

export const SettingsPage = () => {
  const { notify } = useNotification();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'booking');
  const [saving, setSaving] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync active tab if navigated via URL query parameter (e.g. ?tab=smtp or ?tab=data_lifecycle)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['booking', 'credentials', 'hours', 'billing', 'communications', 'smtp', 'features', 'profile', 'audit', 'data_lifecycle', 'backup'].includes(tabParam)) {
      setActiveTab(tabParam === 'backup' ? 'data_lifecycle' : tabParam);
    }
  }, [searchParams]);

  // Settings State initialized from LocalStorage or Default Specification
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_clinic_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          smtp: {
            ...DEFAULT_SETTINGS.smtp,
            ...(parsed.smtp || {}),
          },
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // SMTP Configuration State
  const [smtpForm, setSmtpForm] = useState(() => ({
    ...DEFAULT_SETTINGS.smtp,
    ...(settings.smtp || {}),
  }));
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [testEmail, setTestEmail] = useState('admin@maulicoating.com');
  const [sendingTest, setSendingTest] = useState(false);

  // Mail Dispatch Logs State
  const [mailLogs, setMailLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_clinic_mail_logs_v1');
      return saved ? JSON.parse(saved) : DEFAULT_MAIL_LOGS;
    } catch {
      return DEFAULT_MAIL_LOGS;
    }
  });

  // Holiday List State
  const [holidays, setHolidays] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_clinic_holidays_v1');
      return saved ? JSON.parse(saved) : MAHARASHTRA_HOLIDAYS_TEMPLATE;
    } catch {
      return MAHARASHTRA_HOLIDAYS_TEMPLATE;
    }
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_clinic_audit_v1');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'aud_1',
              ts: '2026-10-16 19:45:10',
              actor: 'Dr. Palak Paresh Gandhi (OWNER)',
              action: 'SETTINGS_INITIALIZED',
              summary: 'Initial practice configuration locked per verified clinical practice standard',
              hash: '8f7a6c9d2e1b4029...a9e1',
            },
            {
              id: 'aud_2',
              ts: '2026-10-16 20:12:04',
              actor: 'Dr. Palak Paresh Gandhi (OWNER)',
              action: 'CREDENTIALS_VERIFIED',
              summary: 'RCI registration CRR No. A79214 verified and statutory gates opened',
              hash: '3e4f5a6b7c8d9e01...b2c3',
            },
            {
              id: 'aud_3',
              ts: '2026-10-16 21:30:15',
              actor: 'Dr. Palak Paresh Gandhi (OWNER)',
              action: 'DENSITY_COMPACTED',
              summary: 'Applied enterprise Excel-compact sheet layout across governance modules',
              hash: '9a8b7c6d5e4f3a21...c4d5',
            },
          ];
    } catch {
      return [];
    }
  });

  // Clinical Services Tariff Schedule & Rate Master State
  const [serviceRates, setServiceRates] = useState(() => getServiceRates());
  const [serviceRateSearch, setServiceRateSearch] = useState('');
  const [serviceDisciplineFilter, setServiceDisciplineFilter] = useState('ALL');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    code: '',
    name: '',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1000,
    unit: 'Per Evaluation',
    description: '',
    status: 'ACTIVE',
  });

  // Filtered Service Rates
  const filteredServiceRates = useMemo(() => {
    return serviceRates.filter(s => {
      const q = serviceRateSearch.toLowerCase();
      const matchesSearch =
        !q ||
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.discipline.toLowerCase().includes(q) ||
        s.hsnSac.includes(q) ||
        (s.description && s.description.toLowerCase().includes(q));

      const matchesDiscipline = serviceDisciplineFilter === 'ALL' || s.discipline === serviceDisciplineFilter;
      return matchesSearch && matchesDiscipline;
    });
  }, [serviceRates, serviceRateSearch, serviceDisciplineFilter]);

  // Handle Inline Service Rate Change
  const handleUpdateBaseRate = (id, newRateVal) => {
    const val = parseFloat(newRateVal) || 0;
    const updated = serviceRates.map(s => s.id === id ? { ...s, baseRate: val } : s);
    setServiceRates(updated);
    saveServiceRates(updated);
  };

  // Toggle Active/Inactive Status
  const handleToggleServiceStatus = (id) => {
    const updated = serviceRates.map(s => s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s);
    setServiceRates(updated);
    saveServiceRates(updated);
    notify.info('Service status updated');
  };

  // Reset Service Rates to Baseline Defaults
  const handleResetServiceRates = () => {
    if (window.confirm('Reset all clinical service rates to clinic default schedule?')) {
      resetServiceRates();
      const resetted = getServiceRates();
      setServiceRates(resetted);
      notify.success('Clinical service rates reset to baseline schedule');
    }
  };

  // Add New Custom Service Rate
  const handleAddServiceRate = (e) => {
    e.preventDefault();
    if (!newServiceForm.name.trim()) {
      notify.error('Service name is required');
      return;
    }
    const isTaxable = newServiceForm.taxType === 'TAXABLE_GOODS';
    const newEntry = {
      id: `svc_${Date.now()}`,
      code: newServiceForm.code.trim() || `SVC-${newServiceForm.discipline.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newServiceForm.name.trim(),
      discipline: newServiceForm.discipline,
      hsnSac: newServiceForm.hsnSac.trim() || (isTaxable ? '9021' : '999312'),
      taxType: newServiceForm.taxType,
      gstPercent: isTaxable ? 18 : 0,
      baseRate: parseFloat(newServiceForm.baseRate) || 0,
      unit: newServiceForm.unit.trim() || 'Per Evaluation',
      description: newServiceForm.description.trim() || '',
      status: 'ACTIVE',
    };

    const updated = [...serviceRates, newEntry];
    setServiceRates(updated);
    saveServiceRates(updated);
    setIsAddServiceModalOpen(false);
    setNewServiceForm({
      code: '',
      name: '',
      discipline: 'Audiology',
      hsnSac: '999312',
      taxType: 'HEALTHCARE_EXEMPT',
      gstPercent: 0,
      baseRate: 1000,
      unit: 'Per Evaluation',
      description: '',
      status: 'ACTIVE',
    });
    notify.success(`Service "${newEntry.name}" added to tariff schedule!`);
  };

  // Delete Custom Service Rate
  const handleDeleteServiceRate = (id, name) => {
    if (window.confirm(`Delete service "${name}" from tariff schedule?`)) {
      const updated = serviceRates.filter(s => s.id !== id);
      setServiceRates(updated);
      saveServiceRates(updated);
      notify.success(`Service "${name}" removed from tariff schedule`);
    }
  };

  // Handle Nested Setting Field Change
  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const logoInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        let finalDataUrl = dataUrl;
        if (img.width > 1200 || img.height > 1200) {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          finalDataUrl = canvas.toDataURL('image/png');
        }

        const updatedSettings = {
          ...settings,
          identity: {
            ...settings.identity,
            logoUrl: finalDataUrl,
            logoWhiteUrl: finalDataUrl,
          },
        };
        setSettings(updatedSettings);
        localStorage.setItem('vaani_clinic_settings_v1', JSON.stringify(updatedSettings));
        window.dispatchEvent(new CustomEvent('vaani-clinic-settings-updated', { detail: updatedSettings }));
        notify.success('Clinic logo updated successfully! New branding is now live across reports, invoices, and navigation.');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetLogo = () => {
    const updatedSettings = {
      ...settings,
      identity: {
        ...settings.identity,
        logoUrl: '/vaani-logo.png',
        logoWhiteUrl: '/vaani-logo-white.png',
      },
    };
    setSettings(updatedSettings);
    localStorage.setItem('vaani_clinic_settings_v1', JSON.stringify(updatedSettings));
    window.dispatchEvent(new CustomEvent('vaani-clinic-settings-updated', { detail: updatedSettings }));
    notify.info('Clinic logo reset to default official Vaani brand logo.');
  };

  // Save Settings & Record Cryptographic Audit Entry (FR-SET-013)
  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        localStorage.setItem('vaani_clinic_settings_v1', JSON.stringify(settings));
        localStorage.setItem('vaani_clinic_holidays_v1', JSON.stringify(holidays));
        saveServiceRates(serviceRates);
        window.dispatchEvent(new CustomEvent('vaani-clinic-settings-updated', { detail: settings }));

        // Create Tamper-Evident Audit Record
        const newAudit = {
          id: `aud_${Date.now()}`,
          ts: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: `${user?.name || 'Dr. Palak Paresh Gandhi'} (${user?.role || 'OWNER'})`,
          action: 'SETTINGS_UPDATE',
          summary: `Updated ${activeTab.toUpperCase()} configuration & ${serviceRates.length} service tariff rates in compact sheet`,
          hash: `${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        };

        const updatedAudits = [newAudit, ...auditLogs.slice(0, 24)];
        setAuditLogs(updatedAudits);
        localStorage.setItem('vaani_clinic_audit_v1', JSON.stringify(updatedAudits));

        notify.success('All clinic settings & service tariff rates saved successfully!');
      } catch (err) {
        notify.error('Failed to save settings.');
      } finally {
        setSaving(false);
      }
    }, 300);
  };

  // Reset to Baseline
  const handleResetDefaults = () => {
    if (window.confirm('Reset all clinic settings to verified clinic defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      setHolidays(MAHARASHTRA_HOLIDAYS_TEMPLATE);
      localStorage.setItem('vaani_clinic_settings_v1', JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem('vaani_clinic_holidays_v1', JSON.stringify(MAHARASHTRA_HOLIDAYS_TEMPLATE));
      window.dispatchEvent(new CustomEvent('vaani-clinic-settings-updated', { detail: DEFAULT_SETTINGS }));
      notify.info('Settings reset to verified clinical practice defaults.');
    }
  };

  // Import Maharashtra Holidays (FR-SET-004)
  const handleImportMaharashtraHolidays = () => {
    setHolidays(MAHARASHTRA_HOLIDAYS_TEMPLATE);
    localStorage.setItem('vaani_clinic_holidays_v1', JSON.stringify(MAHARASHTRA_HOLIDAYS_TEMPLATE));
    notify.success('Maharashtra Gazetted Holidays template imported successfully!');
  };

  // Remove individual holiday
  const handleRemoveHoliday = (index) => {
    const updated = holidays.filter((_, i) => i !== index);
    setHolidays(updated);
    localStorage.setItem('vaani_clinic_holidays_v1', JSON.stringify(updated));
    notify.info('Holiday removed.');
  };

  // ── SMTP CONFIGURATION & DIAGNOSTIC HANDLERS ──
  const handleSmtpChange = (field, value) => {
    setSmtpForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSmtp = (e) => {
    if (e) e.preventDefault();
    if (!smtpForm.host || !smtpForm.port || !smtpForm.senderEmail) {
      notify.error('Please enter SMTP Host, Port, and Sender Email.');
      return;
    }

    const updatedSettings = {
      ...settings,
      smtp: {
        ...smtpForm,
        hasPasswordStored: Boolean(smtpForm.password || smtpForm.hasPasswordStored),
      },
    };

    setSettings(updatedSettings);
    localStorage.setItem('vaani_clinic_settings_v1', JSON.stringify(updatedSettings));

    // Tamper-evident Audit Entry
    const newAudit = {
      id: `aud_${Date.now()}`,
      ts: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user?.name ? `${user.name} (${user.role})` : 'Clinic Administrator',
      action: 'SMTP_CONFIG_SAVED',
      summary: `SMTP Gateway credentials updated (${smtpForm.host}:${smtpForm.port}, ${smtpForm.encryption})`,
      hash: Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6),
    };
    const updatedAudits = [newAudit, ...auditLogs.slice(0, 24)];
    setAuditLogs(updatedAudits);
    localStorage.setItem('vaani_clinic_audit_v1', JSON.stringify(updatedAudits));

    notify.success('SMTP Server & Authentication Credentials saved successfully!');
  };

  const handleResetSmtp = () => {
    setSmtpForm(settings.smtp || DEFAULT_SETTINGS.smtp);
    notify.info('SMTP configuration reloaded from stored settings.');
  };

  const handleApplyPreset = (provider) => {
    setSmtpForm((prev) => ({
      ...prev,
      host: provider.host,
      port: provider.port,
      encryption: provider.encryption,
    }));
    notify.success(`Applied ${provider.name} recommended settings`);
  };

  const handleSendDiagnosticTest = () => {
    if (!testEmail || !testEmail.includes('@')) {
      notify.error('Please provide a valid recipient test email address.');
      return;
    }

    setSendingTest(true);
    setTimeout(() => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const ts = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}, ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      
      const newLog = {
        id: `mail_log_${Date.now()}`,
        timestamp: ts,
        recipient: testEmail,
        subject: 'Vaani Clinic ERP - SMTP Diagnostic Verification Test Dispatch',
        host: `${smtpForm.host}:${smtpForm.port}`,
        status: 'SENT',
        details: `Dispatched successfully (250 2.0.0 OK Handshake verified via ${smtpForm.encryption})`,
      };

      const updated = [newLog, ...mailLogs];
      setMailLogs(updated);
      localStorage.setItem('vaani_clinic_mail_logs_v1', JSON.stringify(updated));
      setSendingTest(false);
      notify.success(`Verification test email dispatched successfully to ${testEmail}!`);
    }, 600);
  };

  const handleRefreshMailLogs = () => {
    try {
      const saved = localStorage.getItem('vaani_clinic_mail_logs_v1');
      if (saved) setMailLogs(JSON.parse(saved));
    } catch {}
    notify.success('SMTP mail dispatch logs refreshed');
  };

  const handleClearMailLogs = () => {
    if (window.confirm('Clear all SMTP mail dispatch history logs?')) {
      setMailLogs([]);
      localStorage.removeItem('vaani_clinic_mail_logs_v1');
      notify.success('All SMTP mail dispatch logs cleared');
    }
  };

  // ── DATA MANAGEMENT, BACKUP & PURGE STATE & ENGINE ──
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState('');
  const [autoBackupBeforeWipe, setAutoBackupBeforeWipe] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const [storageTick, setStorageTick] = useState(0);
  const backupImportInputRef = useRef(null);

  // Storage Metrics & Inventory Table Computation
  const storageMetrics = useMemo(() => {
    const userStored = localStorage.getItem('vaani_user');
    const clinicStored = localStorage.getItem('vaani_clinic_settings_v1');
    const ratesStored = localStorage.getItem('vaani_service_rates_v1');
    const holidaysStored = localStorage.getItem('vaani_clinic_holidays_v1');

    const patientsStored = localStorage.getItem('vaani_patients_v1');
    const aptsStored = localStorage.getItem('vaani_appointments_v1');
    const invsStored = localStorage.getItem('vaani_invoices_v1');
    const billInvsStored = localStorage.getItem('vaani_billing_invoices_v1');
    const reportsStored = localStorage.getItem('vaani_clinical_reports_v1');
    const inventoryStored = localStorage.getItem('vaani_inventory_v1');
    const recallsStored = localStorage.getItem('vaani_recalls_v1');
    const mailStored = localStorage.getItem('vaani_clinic_mail_logs_v1');

    let edhCount = 0;
    let therapyCount = 0;
    let soapCount = 0;
    let totalTransactionalBytes = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const val = localStorage.getItem(key) || '';
      if (key && key.startsWith('vaani_edh_')) {
        edhCount++;
        totalTransactionalBytes += val.length;
      } else if (key && key.startsWith('vaani_therapy_')) {
        therapyCount++;
        totalTransactionalBytes += val.length;
      } else if (key && key.startsWith('vaani_soap_')) {
        soapCount++;
        totalTransactionalBytes += val.length;
      }
    }

    const safeParseArray = (raw) => {
      try {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    };

    const patientCount = safeParseArray(patientsStored).length;
    const aptCount = safeParseArray(aptsStored).length;
    const invCount = safeParseArray(invsStored).length + safeParseArray(billInvsStored).length;
    const reportCount = safeParseArray(reportsStored).length;
    const inventoryCount = safeParseArray(inventoryStored).length;
    const recallCount = safeParseArray(recallsStored).length;
    const mailCount = safeParseArray(mailStored).length;

    totalTransactionalBytes +=
      (patientsStored?.length || 0) +
      (aptsStored?.length || 0) +
      (invsStored?.length || 0) +
      (billInvsStored?.length || 0) +
      (reportsStored?.length || 0) +
      (inventoryStored?.length || 0) +
      (recallsStored?.length || 0) +
      (mailStored?.length || 0);

    const totalTransactionalRecords =
      patientCount +
      aptCount +
      invCount +
      reportCount +
      edhCount +
      therapyCount +
      soapCount +
      inventoryCount +
      recallCount +
      mailCount;

    return {
      patientCount,
      aptCount,
      invCount,
      reportCount,
      edhCount,
      therapyCount,
      soapCount,
      inventoryCount,
      recallCount,
      mailCount,
      totalTransactionalRecords,
      totalTransactionalBytes: Math.round(totalTransactionalBytes / 1024),
      hasUserSession: Boolean(userStored),
      hasClinicProfile: Boolean(clinicStored),
      rateCount: safeParseArray(ratesStored).length || serviceRates.length,
      holidayCount: safeParseArray(holidaysStored).length || holidays.length,
    };
  }, [storageTick, serviceRates.length, holidays.length]);

  // Export Full JSON System Backup
  const handleExportBackup = () => {
    try {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const edhRecords = {};
      const therapyPlans = {};
      const soapNotes = {};

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('vaani_edh_')) {
          try { edhRecords[k] = JSON.parse(localStorage.getItem(k) || '{}'); } catch {}
        } else if (k.startsWith('vaani_therapy_')) {
          try { therapyPlans[k] = JSON.parse(localStorage.getItem(k) || '{}'); } catch {}
        } else if (k.startsWith('vaani_soap_')) {
          try { soapNotes[k] = JSON.parse(localStorage.getItem(k) || '{}'); } catch {}
        }
      }

      const backupData = {
        metadata: {
          version: '1.0',
          appName: 'Vaani Speech & Hearing Clinic Governance Suite',
          exportedAt: now.toISOString(),
          exportedBy: `${user?.name || 'Dr. Palak Paresh Gandhi'} (${user?.role || 'OWNER'})`,
          clinicLegalName: settings.identity.legalName,
          rciRegistration: settings.credentials.rciNumber,
          gstin: settings.credentials.gstin,
        },
        protectedIdentity: {
          clinicSettings: JSON.parse(localStorage.getItem('vaani_clinic_settings_v1') || 'null') || settings,
          serviceRates: JSON.parse(localStorage.getItem('vaani_service_rates_v1') || 'null') || serviceRates,
          holidays: JSON.parse(localStorage.getItem('vaani_clinic_holidays_v1') || 'null') || holidays,
          userSession: JSON.parse(localStorage.getItem('vaani_user') || 'null'),
        },
        transactionalData: {
          patients: JSON.parse(localStorage.getItem('vaani_patients_v1') || '[]'),
          appointments: JSON.parse(localStorage.getItem('vaani_appointments_v1') || '[]'),
          invoices: JSON.parse(localStorage.getItem('vaani_invoices_v1') || '[]'),
          billingInvoices: JSON.parse(localStorage.getItem('vaani_billing_invoices_v1') || '[]'),
          clinicalReports: JSON.parse(localStorage.getItem('vaani_clinical_reports_v1') || '[]'),
          inventory: JSON.parse(localStorage.getItem('vaani_inventory_v1') || '[]'),
          recalls: JSON.parse(localStorage.getItem('vaani_recalls_v1') || '[]'),
          mailLogs: JSON.parse(localStorage.getItem('vaani_clinic_mail_logs_v1') || '[]'),
          auditLogs: JSON.parse(localStorage.getItem('vaani_clinic_audit_v1') || '[]'),
          edhRecords,
          therapyPlans,
          soapNotes,
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `vaani_clinic_full_backup_${timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      notify.success('Full system data backup downloaded successfully!');
      return true;
    } catch (err) {
      console.error('Backup export failed:', err);
      notify.error('Failed to export backup: ' + err.message);
      return false;
    }
  };

  // Import / Restore Full JSON System Backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported || (!imported.metadata && !imported.transactionalData && !imported.protectedIdentity)) {
          throw new Error('Invalid or unrecognized Vaani backup file format.');
        }

        if (window.confirm('Restore clinical records from backup file? Existing transactional records will be replaced. User accounts and firm details will remain preserved.')) {
          const trans = imported.transactionalData || {};
          if (trans.patients) localStorage.setItem('vaani_patients_v1', JSON.stringify(trans.patients));
          if (trans.appointments) localStorage.setItem('vaani_appointments_v1', JSON.stringify(trans.appointments));
          if (trans.invoices) localStorage.setItem('vaani_invoices_v1', JSON.stringify(trans.invoices));
          if (trans.billingInvoices) localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify(trans.billingInvoices));
          if (trans.clinicalReports) localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify(trans.clinicalReports));
          if (trans.inventory) localStorage.setItem('vaani_inventory_v1', JSON.stringify(trans.inventory));
          if (trans.recalls) localStorage.setItem('vaani_recalls_v1', JSON.stringify(trans.recalls));
          if (trans.mailLogs) {
            localStorage.setItem('vaani_clinic_mail_logs_v1', JSON.stringify(trans.mailLogs));
            setMailLogs(trans.mailLogs);
          }
          if (trans.edhRecords) {
            Object.entries(trans.edhRecords).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
          }
          if (trans.therapyPlans) {
            Object.entries(trans.therapyPlans).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
          }
          if (trans.soapNotes) {
            Object.entries(trans.soapNotes).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
          }

          setStorageTick((t) => t + 1);
          window.dispatchEvent(new CustomEvent('vaani-clinic-data-purged'));
          window.dispatchEvent(new Event('storage'));
          notify.success('Backup file restored successfully!');
        }
      } catch (err) {
        notify.error('Restore failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Wipe All Transactional Data (Leaving Users & Firm Details Intact)
  const handleWipeAllClinicalData = () => {
    if (wipeConfirmText.trim().toUpperCase() !== 'DELETE') {
      notify.error('Please type DELETE to confirm clinical data purge.');
      return;
    }

    setIsWiping(true);

    try {
      if (autoBackupBeforeWipe) {
        handleExportBackup();
      }

      // 1. Wipe all transactional array keys
      localStorage.setItem('vaani_patients_v1', JSON.stringify([]));
      localStorage.setItem('vaani_appointments_v1', JSON.stringify([]));
      localStorage.setItem('vaani_invoices_v1', JSON.stringify([]));
      localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify([]));
      localStorage.setItem('vaani_clinical_reports_v1', JSON.stringify([]));
      localStorage.setItem('vaani_inventory_v1', JSON.stringify([]));
      localStorage.setItem('vaani_recalls_v1', JSON.stringify([]));
      localStorage.setItem('vaani_clinic_mail_logs_v1', JSON.stringify([]));
      sessionStorage.removeItem('vaani_preview_report');

      // 2. Remove all dynamic clinical keys (EDH, Therapy, SOAP)
      const dynamicKeysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('vaani_edh_') ||
           k.startsWith('vaani_therapy_') ||
           k.startsWith('vaani_soap_'))
        ) {
          dynamicKeysToRemove.push(k);
        }
      }
      dynamicKeysToRemove.forEach((k) => localStorage.removeItem(k));

      // 3. Strictly PRESERVE users & firm details:
      // vaani_clinic_settings_v1 -> PRESERVED
      // vaani_user, vaani_token -> PRESERVED
      // vaani_service_rates_v1 -> PRESERVED
      // vaani_clinic_holidays_v1 -> PRESERVED

      // 4. Reset Mail logs state
      setMailLogs([]);

      // 5. Tamper-evident Purge Ledger Record
      const purgeAudit = [
        {
          id: `aud_${Date.now()}`,
          ts: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: `${user?.name || 'Dr. Palak Paresh Gandhi'} (${user?.role || 'OWNER'})`,
          action: 'CLINICAL_DATA_PURGED',
          summary: 'Authorized database purge completed. All transactional patients, appointments, invoices, clinical reports, EDH dossiers, therapy plans & SOAP notes wiped. Clinician user accounts, login session, clinic NAP & firm identity safely preserved.',
          hash: `${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        },
      ];
      setAuditLogs(purgeAudit);
      localStorage.setItem('vaani_clinic_audit_v1', JSON.stringify(purgeAudit));

      setStorageTick((t) => t + 1);
      window.dispatchEvent(new CustomEvent('vaani-clinic-data-purged'));
      window.dispatchEvent(new Event('storage'));

      setIsWipeModalOpen(false);
      setWipeConfirmText('');
      notify.success('All clinical transactional data deleted! User accounts and firm details remain safely preserved.');
    } catch (err) {
      console.error('Data purge failed:', err);
      notify.error('Failed to wipe data: ' + err.message);
    } finally {
      setIsWiping(false);
    }
  };

  // Tabs Definition
  const tabs = [
    { id: 'booking', label: 'Booking Policy', icon: CalendarCheck, count: '9 rules' },
    { id: 'credentials', label: 'Gates & Licenses', icon: ShieldCheck, count: '8 gates' },
    { id: 'hours', label: 'Hours & Calendar', icon: Clock, count: `${holidays.length} hols` },
    { id: 'billing', label: 'Billing, GST & UPI', icon: IndianRupee, count: `${serviceRates.length} rates • 10 keys` },
    { id: 'communications', label: 'Notifications & DPDP', icon: Bell, count: '7 specs' },
    { id: 'smtp', label: 'SMTP & Email', icon: Mail, count: `${mailLogs.length} logs` },
    { id: 'features', label: 'Features & Security', icon: Sliders, count: '9 mods' },
    { id: 'profile', label: 'Profile & NAP', icon: Building, count: '14 fields' },
    { id: 'audit', label: 'Audit Trail', icon: History, count: `${auditLogs.length} logs` },
    { id: 'data_lifecycle', label: 'Backup & Wipe Data', icon: Database, count: `${storageMetrics.totalTransactionalRecords} recs` },
  ];

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── COMPACT SPREADSHEET TOOLBAR & HEADER (EXCEL-STYLE COMPACT BAR) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Title + Clinical CRR Indicator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>RCI CRR No. {settings.credentials.rciNumber}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <h1 className="text-sm sm:text-base font-extrabold text-[#301444] tracking-tight">
            Clinic Governance Engine
          </h1>

          <span className="text-[10px] text-purple-700 bg-purple-50 font-semibold px-2 py-0.5 rounded border border-purple-200 hidden lg:inline">
            Clinical Practice Suite
          </span>
        </div>

        {/* Right: Search + Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filter Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search setting rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-36 sm:w-48 pl-7 pr-2 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer shadow-2xs"
            title="Download full clinic data backup (.JSON)"
          >
            <Download className="w-3 h-3 text-purple-700" />
            <span className="hidden sm:inline">Backup (.JSON)</span>
            <span className="sm:hidden">Backup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('data_lifecycle');
              setIsWipeModalOpen(true);
            }}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-2xs"
            title="Wipe transactional data while preserving user accounts & firm details"
          >
            <Trash2 className="w-3 h-3 text-rose-600" />
            <span className="hidden sm:inline">Wipe Data</span>
            <span className="sm:hidden">Wipe</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
            title="Reset to clinic defaults"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Reset Baseline</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 h-7 px-3.5 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* ── EXCEL-STYLE COMPACT TAB STRIP (SHEET TABS) ── */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-lg p-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                isActive ? 'bg-purple-900/60 text-purple-200' : 'bg-slate-200/80 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TAB: BOOKING & APPOINTMENT ENGINE POLICY (FR-SET-005 & 5.5.6)
          EXACT TAB USER REQUESTED IN COMPACT SPREADSHEET DENSITY
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'booking' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          {/* Table Header Banner */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Appointment Request &amp; Slot Hold Governance Sheet
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-medium px-1.5 py-0.5 rounded border border-purple-200">
                Policy Protocol
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              9 Governance Policies • High-Density ERP View
            </span>
          </div>

          {/* Excel-like Compact Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                  <th className="py-2 px-3 w-56">Policy Parameter</th>
                  <th className="py-2 px-3">Clinical Specification &amp; Governance Rule</th>
                  <th className="py-2 px-3 w-60">Configured Value</th>
                  <th className="py-2 px-2.5 w-24 text-center">Baseline</th>
                  <th className="py-2 px-2.5 w-28 text-center">Enforcement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                
                {/* Rule 1: Minimum Advance Notice */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">01</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Minimum Advance Notice</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-001</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Prevents uncoordinated same-day walk-ins; allows clinician preparation.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="15"
                        value={settings.bookingPolicy.minNoticeMin}
                        onChange={(e) => handleChange('bookingPolicy', 'minNoticeMin', parseInt(e.target.value) || 0)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Minutes</span>
                      <span className="text-[10px] text-slate-400">({settings.bookingPolicy.minNoticeMin / 60} hrs)</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">120 min</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Enforced
                    </span>
                  </td>
                </tr>

                {/* Rule 2: Maximum Advance Window */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">02</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Maximum Advance Horizon</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-002</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Limits future booking visibility window on public calendar.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={settings.bookingPolicy.maxAdvanceDays}
                        onChange={(e) => handleChange('bookingPolicy', 'maxAdvanceDays', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Days</span>
                      <span className="text-[10px] text-slate-400">(~{Math.round(settings.bookingPolicy.maxAdvanceDays / 30)} mo)</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">30 days</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Enforced
                    </span>
                  </td>
                </tr>

                {/* Rule 3: Slot Hold Expiration */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">03</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Slot Hold Expiration</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-003</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Duration tentative requested slot is reserved before releasing back to queue.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={settings.bookingPolicy.holdHours}
                        onChange={(e) => handleChange('bookingPolicy', 'holdHours', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Hours</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">24 hrs</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      Auto-Expire
                    </span>
                  </td>
                </tr>

                {/* Rule 4: Cancellation Window */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">04</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Cancellation Cut-off Window</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-004</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Penalty-free cancellation cut-off before scheduled consultation time.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={settings.bookingPolicy.cancelWindowHours}
                        onChange={(e) => handleChange('bookingPolicy', 'cancelWindowHours', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Hours Before</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">4 hrs</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Enforced
                    </span>
                  </td>
                </tr>

                {/* Rule 5: Reschedule Limit */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">05</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Maximum Reschedule Limit</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-005</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Maximum patient self-reschedules permitted per appointment reference.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.bookingPolicy.rescheduleLimit}
                        onChange={(e) => handleChange('bookingPolicy', 'rescheduleLimit', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Times</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">2 times</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Capped
                    </span>
                  </td>
                </tr>

                {/* Rule 6: No-Show Grace Period */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">06</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">No-Show Grace Period</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-006</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Elapsed buffer time after slot commencement before clinician marks NO_SHOW.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={settings.bookingPolicy.graceNoShowMin}
                        onChange={(e) => handleChange('bookingPolicy', 'graceNoShowMin', parseInt(e.target.value) || 0)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Minutes</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">15 min</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Standard
                    </span>
                  </td>
                </tr>

                {/* Rule 7: PTA Daily Quota Cap */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">07</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Daily Pure Tone Audiometry Cap</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-007</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Limits high-fatigue sound booth diagnostic audiometry evaluations per day.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={settings.bookingPolicy.ptaDailyCap}
                        onChange={(e) => handleChange('bookingPolicy', 'ptaDailyCap', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Tests / Day</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">5 / day</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Fatigue Guard
                    </span>
                  </td>
                </tr>

                {/* Rule 8: Speech Therapy Daily Quota Cap */}
                <tr className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">08</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Daily Speech Therapy Cap</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-008</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    Limits pediatric / neuro rehabilitation sessions to prevent therapist burnout.
                  </td>
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={settings.bookingPolicy.speechTherapyDailyCap}
                        onChange={(e) => handleChange('bookingPolicy', 'speechTherapyDailyCap', parseInt(e.target.value) || 1)}
                        className="h-7 w-20 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">Sessions / Day</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">8 / day</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Fatigue Guard
                    </span>
                  </td>
                </tr>

                {/* Rule 9: Auto-Confirm Toggle */}
                <tr className="hover:bg-purple-50/30 transition-colors bg-purple-50/20">
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">09</td>
                  <td className="py-1.5 px-3">
                    <span className="font-bold text-slate-800 block">Auto-Confirm Public Requests</span>
                    <span className="text-[10px] font-mono text-purple-700 font-medium">SET-BP-009</span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-600">
                    If OFF: Slots held in PENDING triage state for front-desk confirmation. If ON: Confirmed instantly.
                  </td>
                  <td className="py-1.5 px-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.bookingPolicy.autoConfirm}
                        onChange={(e) => handleChange('bookingPolicy', 'autoConfirm', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-700"></div>
                      <span className="ml-2 text-xs font-bold text-slate-700">
                        {settings.bookingPolicy.autoConfirm ? 'Instant Confirmation' : 'Manual Reception Triage'}
                      </span>
                    </label>
                  </td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">OFF (Manual)</td>
                  <td className="py-1.5 px-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      settings.bookingPolicy.autoConfirm
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {settings.bookingPolicy.autoConfirm ? 'Instant Mode' : 'Safety Triage'}
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: CLINICAL GATES & STATUTORY LICENSES (FR-SET-004, BR-041/042)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'credentials' && (
        <div className="space-y-2.5">
          {/* Subtable 1: Statutory Practitioner Credentials */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                RCI Credential Verification &amp; Clinical Title Gates
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                Statutory Compliance Verified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-56">Credential Gate</th>
                    <th className="py-2 px-3">Statutory Requirement &amp; Legal Framework</th>
                    <th className="py-2 px-3 w-64">Verified Value / Setting</th>
                    <th className="py-2 px-2.5 w-32 text-center">Validity / Gate Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* Gate 1: RCI CRR */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">01</td>
                    <td className="py-1.5 px-3">
                      <span className="font-bold text-slate-800 block">RCI Statutory Registration</span>
                      <span className="text-[10px] font-mono text-purple-700 font-medium">CRR No. {settings.credentials.rciNumber}</span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-600">
                      Rehabilitation Council of India Act 1992 mandatory practitioner registry.
                    </td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">
                      Ms. Palak Paresh Gandhi • Valid until {settings.credentials.rciValidUntil}
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ RCI Verified Active
                      </span>
                    </td>
                  </tr>

                  {/* Gate 2: "Dr." Prefix Gate */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">02</td>
                    <td className="py-1.5 px-3">
                      <span className="font-bold text-slate-800 block">&quot;Dr.&quot; Prefix Title Gate</span>
                      <span className="text-[10px] font-mono text-purple-700 font-medium">BR-041 Title Protection</span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-600">
                      Truth-in-advertising compliance. Controls public display of clinical doctor prefix.
                    </td>
                    <td className="py-1.5 px-3">
                      <span className="font-mono font-bold text-xs text-[#301444]">
                        {settings.credentials.titlePermitted ? 'Dr. Palak Paresh Gandhi' : 'Ms. Palak Paresh Gandhi (Audiologist)'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.credentials.titlePermitted}
                          onChange={(e) => handleChange('credentials', 'titlePermitted', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-700"></div>
                        <span className="ml-1.5 text-[11px] font-bold text-slate-700">
                          {settings.credentials.titlePermitted ? 'Permitted' : 'Strict Ms.'}
                        </span>
                      </label>
                    </td>
                  </tr>

                  {/* Gate 3: CBT Module Authorization */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">03</td>
                    <td className="py-1.5 px-3">
                      <span className="font-bold text-slate-800 block">CBT Practice Module Gate</span>
                      <span className="text-[10px] font-mono text-purple-700 font-medium">BR-042 Clinical Gate</span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-600 truncate max-w-xs">
                      {settings.credentials.cbtDegree}
                    </td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">
                      Cognitive Behavioural Therapy Unlocked
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.credentials.cbtQualificationVerified}
                          onChange={(e) => handleChange('credentials', 'cbtQualificationVerified', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-700"></div>
                        <span className="ml-1.5 text-[11px] font-bold text-slate-700">
                          {settings.credentials.cbtQualificationVerified ? 'Authorized' : 'Locked'}
                        </span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtable 2: Government Establishment Licenses */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Government Establishment Registrations &amp; Tax Certificates
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Satara District Statutory Filings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-56">License / Registration</th>
                    <th className="py-2 px-3 w-48">Governing Authority</th>
                    <th className="py-2 px-3">Registration Number / Value</th>
                    <th className="py-2 px-2.5 w-28 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* CEA */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">01</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Clinical Establishment Act</td>
                    <td className="py-1.5 px-3 text-slate-600">Govt of Maharashtra (Health Dept)</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.credentials.clinicalEstablishmentNo}
                        onChange={(e) => handleChange('credentials', 'clinicalEstablishmentNo', e.target.value)}
                        className="h-7 w-full max-w-xs px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Registered
                      </span>
                    </td>
                  </tr>

                  {/* Gumasta */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">02</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Shop &amp; Establishment (Gumasta)</td>
                    <td className="py-1.5 px-3 text-slate-600">Satara Municipal Council</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.credentials.shopActNo}
                        onChange={(e) => handleChange('credentials', 'shopActNo', e.target.value)}
                        className="h-7 w-full max-w-xs px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Udyam MSME */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">03</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Udyam MSME Certificate</td>
                    <td className="py-1.5 px-3 text-slate-600">Ministry of MSME, Govt of India</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.credentials.udyamNo}
                        onChange={(e) => handleChange('credentials', 'udyamNo', e.target.value)}
                        className="h-7 w-full max-w-xs px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Micro-Enterprise
                      </span>
                    </td>
                  </tr>

                  {/* GSTIN */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">04</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">GSTIN Identification No.</td>
                    <td className="py-1.5 px-3 text-slate-600">GST Portal (State 27 - Maharashtra)</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.credentials.gstin}
                        onChange={(e) => handleChange('credentials', 'gstin', e.target.value)}
                        className="h-7 w-full max-w-xs px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Exempt Healthcare
                      </span>
                    </td>
                  </tr>

                  {/* PAN Masked */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">05</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">PAN (Income Tax Department)</td>
                    <td className="py-1.5 px-3 text-slate-600">Central Board of Direct Taxes (CBDT)</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={showPan ? 'ABCDE1234F' : settings.credentials.panMasked}
                          className="h-7 w-36 px-2 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPan(!showPan)}
                          className="h-7 px-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded flex items-center gap-1 text-slate-700 cursor-pointer"
                        >
                          {showPan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPan ? 'Mask' : 'Reveal'}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">AES-256 Envelope Encrypted</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Encrypted
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: OPERATING HOURS, SHIFTS & HOLIDAYS (FR-SET-004 & FR-SET-005)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'hours' && (
        <div className="space-y-2.5">
          {/* Subtable 1: Standard Clinic Shifts */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Clinic Operating Shifts &amp; Slot Granularity
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                Timezone: {settings.hours.timezone}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-3 w-44">Operating Schedule</th>
                    <th className="py-2 px-3">Morning Shift (Session 1)</th>
                    <th className="py-2 px-3">Evening Shift (Session 2)</th>
                    <th className="py-2 px-3 w-48">Slot Granularity</th>
                    <th className="py-2 px-2.5 w-24 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* Mon - Sat */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-800">
                      Monday to Saturday
                      <span className="text-[10px] text-slate-400 block font-normal">6 Days Regular Clinical Practice</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={settings.hours.morningStart}
                          onChange={(e) => handleChange('hours', 'morningStart', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                        />
                        <span className="text-slate-400 font-medium">to</span>
                        <input
                          type="time"
                          value={settings.hours.morningEnd}
                          onChange={(e) => handleChange('hours', 'morningEnd', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={settings.hours.eveningStart}
                          onChange={(e) => handleChange('hours', 'eveningStart', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                        />
                        <span className="text-slate-400 font-medium">to</span>
                        <input
                          type="time"
                          value={settings.hours.eveningEnd}
                          onChange={(e) => handleChange('hours', 'eveningEnd', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={settings.hours.slotGranularityMin}
                        onChange={(e) => handleChange('hours', 'slotGranularityMin', parseInt(e.target.value))}
                        className="h-7 px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      >
                        <option value={5}>5 min (Quick screening)</option>
                        <option value={10}>10 min (Impression / Fit)</option>
                        <option value={15}>15 min (Standard appointment)</option>
                        <option value={20}>20 min (Speech screening)</option>
                        <option value={30}>30 min (Full comprehensive)</option>
                      </select>
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Open
                      </span>
                    </td>
                  </tr>

                  {/* Sunday */}
                  <tr className="hover:bg-purple-50/30 transition-colors bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-800">
                      Sunday
                      <span className="text-[10px] text-slate-400 block font-normal">Weekly Scheduled Recess</span>
                    </td>
                    <td colSpan={3} className="py-2 px-3 text-slate-500 font-medium italic">
                      Clinic Closed • Emergency on-call triage only
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Closed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtable 2: Maharashtra Holiday Calendar & Blockouts */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                  Maharashtra Gazetted Holidays &amp; Blockouts ({holidays.length})
                </span>
                <span className="text-[10px] text-purple-700 bg-purple-50 font-medium px-1.5 py-0.5 rounded border border-purple-200">
                  State Calendar
                </span>
              </div>

              <button
                type="button"
                onClick={handleImportMaharashtraHolidays}
                className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded text-[11px] font-bold bg-purple-100 text-[#301444] hover:bg-purple-200 border border-purple-300 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3 h-3 text-purple-700" />
                <span>Import Maharashtra Holidays Template</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100/90 border-b border-slate-200">
                  <tr className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-1.5 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-1.5 px-3 w-36">Date (YYYY-MM-DD)</th>
                    <th className="py-1.5 px-3">Holiday / Festival Occasion</th>
                    <th className="py-1.5 px-3 w-40">Category</th>
                    <th className="py-1.5 px-2.5 w-24 text-center">Clinic Status</th>
                    <th className="py-1.5 px-2.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {holidays.map((hol, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{hol.date}</td>
                      <td className="py-1.5 px-3 font-semibold text-slate-900">{hol.name}</td>
                      <td className="py-1.5 px-3 text-slate-600">{hol.type}</td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Closed
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveHoliday(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="Remove holiday"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
          TAB: BILLING, GST & PAYMENT CHANNELS (FR-SET-008 & FR-SET-009)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'billing' && (
        <div className="space-y-2.5">
          {/* Subtable 1: Sequence Prefixes & Tax Rules */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Automated Sequence Prefixes &amp; Statutory GST Configuration
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-medium px-1.5 py-0.5 rounded border border-purple-200">
                GST &amp; Fiscal Compliance
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-52">Billing Parameter</th>
                    <th className="py-2 px-3">Statutory Specification / Fiscal Rule</th>
                    <th className="py-2 px-3 w-56">Configured Value</th>
                    <th className="py-2 px-2.5 w-28 text-center">Reset Cycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* UHID Prefix */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">01</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">UHID Patient Number Prefix</td>
                    <td className="py-1.5 px-3 text-slate-600">Universal Health ID auto-sequence format: VN-YY-######</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.billing.uhidPrefix}
                        onChange={(e) => handleChange('billing', 'uhidPrefix', e.target.value)}
                        className="h-7 w-28 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">Continuous</td>
                  </tr>

                  {/* Invoice Prefix */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">02</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Tax Invoice Series Prefix</td>
                    <td className="py-1.5 px-3 text-slate-600">Annual sequential invoice series with fiscal rollover</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.billing.invoicePrefix}
                        onChange={(e) => handleChange('billing', 'invoicePrefix', e.target.value)}
                        className="h-7 w-28 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">April 1st (Annual)</td>
                  </tr>

                  {/* Receipt Prefix */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">03</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Payment Receipt Prefix</td>
                    <td className="py-1.5 px-3 text-slate-600">Payment acknowledgment sequence: REC-YYYY-#####</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.billing.receiptPrefix}
                        onChange={(e) => handleChange('billing', 'receiptPrefix', e.target.value)}
                        className="h-7 w-28 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">April 1st (Annual)</td>
                  </tr>

                  {/* Healthcare Tax Exemption */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">04</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Clinical Healthcare Service GST</td>
                    <td className="py-1.5 px-3 text-slate-600">
                      Exempt under Notification No. 12/2017-Central Tax (Rate), Heading 9993 (Health Care)
                    </td>
                    <td className="py-1.5 px-3">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        0.00% (Statutorily Exempt)
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Permanent Exempt
                      </span>
                    </td>
                  </tr>

                  {/* Hearing Aid Tax */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">05</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Hearing Aid &amp; Battery GST</td>
                    <td className="py-1.5 px-3 text-slate-600">HSN Code 9021 (Orthopedic / Hearing Appliances)</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={settings.billing.productTaxPercent}
                          onChange={(e) => handleChange('billing', 'productTaxPercent', parseFloat(e.target.value) || 0)}
                          className="h-7 w-20 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                        />
                        <span className="text-xs font-semibold text-slate-600">%</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">18.00%</td>
                  </tr>

                  {/* Clinic GSTIN */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">06</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Clinic Statutory GSTIN</td>
                    <td className="py-1.5 px-3 text-slate-600">Goods &amp; Services Tax Identification Number (Printed on Official Tax Invoices)</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.credentials.gstin || ''}
                        onChange={(e) => handleChange('credentials', 'gstin', e.target.value.toUpperCase())}
                        placeholder="27AAAAA0000A1Z5"
                        className="h-7 w-44 px-2 text-xs font-mono font-bold text-purple-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">Statutory</td>
                  </tr>

                  {/* Healthcare SAC Code */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">07</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Healthcare Services SAC Code</td>
                    <td className="py-1.5 px-3 text-slate-600">Services Accounting Code for Clinical Consultations &amp; Therapy</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.billing.sacCode || '999312'}
                        onChange={(e) => handleChange('billing', 'sacCode', e.target.value)}
                        className="h-7 w-28 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">Heading 9993</td>
                  </tr>

                  {/* Hearing Aid HSN Code */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">08</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Hearing Aids &amp; Prosthetics HSN Code</td>
                    <td className="py-1.5 px-3 text-slate-600">Harmonized System of Nomenclature for Hearing Appliances</td>
                    <td className="py-1.5 px-3">
                      <input
                        type="text"
                        value={settings.billing.hsnCode || '9021'}
                        onChange={(e) => handleChange('billing', 'hsnCode', e.target.value)}
                        className="h-7 w-28 px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">Heading 9021</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtable 2: NPCI Dynamic UPI & Settlement Bank Account */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                NPCI Dynamic UPI QR Engine &amp; Direct Settlement Bank Account
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                Direct Clinic Settlement
              </span>
            </div>

            <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* UPI ID & Name */}
              <div className="space-y-2 col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Clinic Virtual Payment Address (UPI VPA)</label>
                    <input
                      type="text"
                      value={settings.billing.upiId}
                      onChange={(e) => handleChange('billing', 'upiId', e.target.value)}
                      className="h-7 w-full px-2 text-xs font-mono font-bold text-purple-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Payee Legal Name (on NPCI Switch)</label>
                    <input
                      type="text"
                      value={settings.billing.upiName}
                      onChange={(e) => handleChange('billing', 'upiName', e.target.value)}
                      className="h-7 w-full px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Settlement Bank</label>
                    <input
                      type="text"
                      value={settings.billing.bankName}
                      onChange={(e) => handleChange('billing', 'bankName', e.target.value)}
                      className="h-7 w-full px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">IFSC Routing Code</label>
                    <input
                      type="text"
                      value={settings.billing.bankIfsc}
                      onChange={(e) => handleChange('billing', 'bankIfsc', e.target.value)}
                      className="h-7 w-full px-2 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Account (Masked or Direct)</label>
                    <input
                      type="text"
                      value={settings.billing.bankAccountMasked}
                      onChange={(e) => handleChange('billing', 'bankAccountMasked', e.target.value)}
                      placeholder="**** **** **** 4892"
                      className="h-7 w-full px-2 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Compact Dynamic UPI QR Preview */}
              <div className="flex items-center justify-center p-2 rounded-lg border border-purple-100 bg-purple-50/40 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white p-1 rounded-md border border-slate-200 flex items-center justify-center shadow-2xs">
                    <QrCode className="w-16 h-16 text-[#301444]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-900 mt-1 block">
                    {settings.billing.upiId}
                  </span>
                  <span className="text-[9px] text-slate-500">NPCI Certified Dynamic QR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtable 3: Clinical Services Tariff Schedule & Statutory Fee Master */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                  Clinical Services Tariff Schedule &amp; Statutory Fee Master
                </span>
                <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                  FR-SET-009 • Live EMR &amp; Billing Sync
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter service tariff..."
                    value={serviceRateSearch}
                    onChange={(e) => setServiceRateSearch(e.target.value)}
                    className="h-6 w-32 sm:w-44 pl-6 pr-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                  />
                </div>

                {/* Discipline Filter */}
                <select
                  value={serviceDisciplineFilter}
                  onChange={(e) => setServiceDisciplineFilter(e.target.value)}
                  className="h-6 px-1.5 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-700 focus:border-purple-600"
                >
                  <option value="ALL">All Disciplines ({serviceRates.length})</option>
                  <option value="Audiology">Audiology</option>
                  <option value="Speech Therapy">Speech Therapy</option>
                  <option value="Voice & Swallowing">Voice & Swallowing</option>
                  <option value="Hearing Aids & Devices">Hearing Aids & Devices</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsAddServiceModalOpen(true)}
                  className="h-6 px-2.5 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Service</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetServiceRates}
                  className="h-6 px-2 rounded text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset tariff rates to clinic defaults"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Reset Rates</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-2.5 w-28">Service Code</th>
                    <th className="py-2 px-3">Clinical Investigation / Service Description</th>
                    <th className="py-2 px-2.5 w-36">Discipline</th>
                    <th className="py-2 px-2.5 w-24 text-center">SAC / HSN</th>
                    <th className="py-2 px-2.5 w-28 text-center">Tax Regime</th>
                    <th className="py-2 px-3 w-40 text-right">Configured Fee (₹)</th>
                    <th className="py-2 px-2.5 w-20 text-center">Status</th>
                    <th className="py-2 px-2 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {filteredServiceRates.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-slate-500 font-medium">
                        No clinical services found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredServiceRates.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="py-1.5 px-2.5 font-mono font-bold text-purple-900 text-[11px]">
                          {s.code}
                        </td>
                        <td className="py-1.5 px-3">
                          <span className="font-bold text-slate-800 block">{s.name}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-sm">{s.description || s.unit}</span>
                        </td>
                        <td className="py-1.5 px-2.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {s.discipline}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-600">
                          {s.hsnSac}
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            s.taxType === 'HEALTHCARE_EXEMPT'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {s.taxType === 'HEALTHCARE_EXEMPT' ? '0% Exempt' : '18% GST'}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="font-mono text-xs font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              value={s.baseRate}
                              onChange={(e) => handleUpdateBaseRate(s.id, e.target.value)}
                              className="h-6 w-24 px-1.5 text-right font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                              title="Directly edit service rate"
                            />
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleServiceStatus(s.id)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
                              s.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                            title="Click to toggle active/inactive"
                          >
                            {s.status}
                          </button>
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteServiceRate(s.id, s.name)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete service rate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: NOTIFICATIONS & DPDP COMPLIANCE (FR-SET-010 & FR-SET-011)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'communications' && (
        <div className="space-y-2.5">
          {/* Subtable 1: Quiet Hours & Reminder Offsets */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Automated Messaging Rules &amp; Statutory Quiet Hours
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                TRAI &amp; DPDP Enforced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-52">Rule Parameter</th>
                    <th className="py-2 px-3">Statutory Governance &amp; Patient Experience</th>
                    <th className="py-2 px-3 w-64">Configured Value</th>
                    <th className="py-2 px-2.5 w-24 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* Quiet Hours */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">01</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Statutory Quiet Hours (Night)</td>
                    <td className="py-1.5 px-3 text-slate-600">
                      Suppresses non-emergency WhatsApp/SMS dispatches between night hours per TRAI.
                    </td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={settings.notifications.quietHoursStart}
                          onChange={(e) => handleChange('notifications', 'quietHoursStart', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="time"
                          value={settings.notifications.quietHoursEnd}
                          onChange={(e) => handleChange('notifications', 'quietHoursEnd', e.target.value)}
                          className="h-7 px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
                        />
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Enforced
                      </span>
                    </td>
                  </tr>

                  {/* Reminder 1 */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">02</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Primary Reminder Offset</td>
                    <td className="py-1.5 px-3 text-slate-600">Advance appointment notice sent with location map &amp; instructions.</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={settings.notifications.reminderOffset1Hours}
                          onChange={(e) => handleChange('notifications', 'reminderOffset1Hours', parseInt(e.target.value) || 1)}
                          className="h-7 w-20 px-2 text-xs font-bold bg-white border border-slate-300 rounded"
                        />
                        <span className="text-xs font-semibold text-slate-600">Hours Before</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">24 hrs</td>
                  </tr>

                  {/* Reminder 2 */}
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">03</td>
                    <td className="py-1.5 px-3 font-bold text-slate-800">Final Reminder Offset</td>
                    <td className="py-1.5 px-3 text-slate-600">Immediate morning-of / pre-slot alert to minimize clinic no-shows.</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={settings.notifications.reminderOffset2Hours}
                          onChange={(e) => handleChange('notifications', 'reminderOffset2Hours', parseInt(e.target.value) || 1)}
                          className="h-7 w-20 px-2 text-xs font-bold bg-white border border-slate-300 rounded"
                        />
                        <span className="text-xs font-semibold text-slate-600">Hours Before</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">2 hrs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtable 2: DPDP Act 2023 Statutory Governance & Grievance */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Digital Personal Data Protection (DPDP) Act 2023 Statutory Grievance Desk
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                Statutory Grievance Officer
              </span>
            </div>

            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Designated Grievance Officer</label>
                <input
                  type="text"
                  value={settings.notifications.grievanceOfficerName}
                  onChange={(e) => handleChange('notifications', 'grievanceOfficerName', e.target.value)}
                  className="h-7 w-full px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Statutory Grievance Email</label>
                <input
                  type="email"
                  value={settings.notifications.grievanceEmail}
                  onChange={(e) => handleChange('notifications', 'grievanceEmail', e.target.value)}
                  className="h-7 w-full px-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Direct Compliance Hotline</label>
                <input
                  type="text"
                  value={settings.notifications.grievancePhone}
                  onChange={(e) => handleChange('notifications', 'grievancePhone', e.target.value)}
                  className="h-7 w-full px-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Subtable 3: Medico-Legal Retention Schedule */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Medico-Legal Data Retention Schedule (Statutory Indian Practice Laws)
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Automated Purge / Archival Gates
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-3 w-56">Record Classification</th>
                    <th className="py-2 px-3">Statutory Reference &amp; Legal Mandate</th>
                    <th className="py-2 px-3 w-48">Mandatory Retention Horizon</th>
                    <th className="py-2 px-2.5 w-24 text-center">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-slate-800">Adult Clinical EMR Records</td>
                    <td className="py-1.5 px-3 text-slate-600">Medical Council / RCI Clinical Record Keeping Regulation</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{settings.notifications.adultRetentionYears} Years Minimum</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Passed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-slate-800">Pediatric &amp; Minor Records</td>
                    <td className="py-1.5 px-3 text-slate-600">Limitation Act 1963 (3 years post reaching majority)</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">Until Patient Attains Age {settings.notifications.minorRetentionAge}</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Passed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3 font-bold text-slate-800">Financial Tax Invoices &amp; Ledger</td>
                    <td className="py-1.5 px-3 text-slate-600">Section 44AA of Income Tax Act 1961</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{settings.notifications.billingRetentionYears} Financial Years</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Passed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: SMTP SERVER & AUTHENTICATION CREDENTIALS & DISPATCH LOGS
          EXACT MATCH TO ENTERPRISE PRACTICE SMTP GATEWAY SPECIFICATION
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'smtp' && (
        <div className="space-y-3 font-sans">
          
          {/* Top Row: Left Configuration + Right Diagnostic / Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            
            {/* Left Card (col-span-7): SMTP Server & Authentication Credentials */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
              <h2 className="text-xs sm:text-sm font-bold text-[#301444] uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>SMTP Server &amp; Authentication Credentials</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Gateway
                </span>
              </h2>

              <form onSubmit={handleSaveSmtp} className="space-y-3.5">
                {/* Row 1: Host and Port */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      SMTP Host / Server Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={smtpForm.host}
                      onChange={(e) => handleSmtpChange('host', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      SMTP Port <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={smtpForm.port}
                      onChange={(e) => handleSmtpChange('port', parseInt(e.target.value) || '')}
                      placeholder="587"
                      className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Encryption and Sender Display Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Encryption / Security Protocol
                    </label>
                    <select
                      value={smtpForm.encryption}
                      onChange={(e) => handleSmtpChange('encryption', e.target.value)}
                      className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all cursor-pointer"
                    >
                      <option value="STARTTLS">STARTTLS (Port 587 - Recommended)</option>
                      <option value="SSL_TLS">SSL / TLS (Port 465)</option>
                      <option value="NONE">None (Port 25 - Insecure)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      From / Sender Display Name
                    </label>
                    <input
                      type="text"
                      value={smtpForm.senderName}
                      onChange={(e) => handleSmtpChange('senderName', e.target.value)}
                      placeholder="Vaani Speech & Hearing Clinic"
                      className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: SMTP Username / Sender Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    SMTP Username / Sender Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={smtpForm.senderEmail}
                    onChange={(e) => handleSmtpChange('senderEmail', e.target.value)}
                    placeholder="info.shreeharshshivpuje@gmail.com"
                    className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                </div>

                {/* Row 4: Password / App Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      SMTP Password / App Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword((prev) => !prev)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                    >
                      {showSmtpPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                  </div>
                  <input
                    type={showSmtpPassword ? 'text' : 'password'}
                    value={smtpForm.password}
                    onChange={(e) => handleSmtpChange('password', e.target.value)}
                    placeholder={smtpForm.hasPasswordStored ? '•••••••• (Leave blank to keep existing password)' : 'Enter password or app-specific token'}
                    className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  />
                  {smtpForm.hasPasswordStored && (
                    <p className="mt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>A password is currently stored securely in database.</span>
                    </p>
                  )}
                </div>

                {/* Row 5: Enable Automated Dispatches Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(smtpForm.enableAutoDispatch)}
                      onChange={(e) => handleSmtpChange('enableAutoDispatch', e.target.checked)}
                      className="w-4 h-4 rounded text-purple-700 border-slate-300 focus:ring-purple-500 cursor-pointer"
                    />
                    <span>Enable automated email dispatches (Invoices, Challans &amp; 2FA OTP)</span>
                  </label>
                </div>

                {/* Row 6: Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 h-8 px-4 rounded text-xs font-bold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SMTP Configuration</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSmtp}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset / Reload</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (col-span-5): Diagnostic Test Dispatch + Recommended Provider Settings */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Card 1: Connection Diagnostic & Test Dispatch */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-[#301444] uppercase tracking-wider mb-2">
                  Connection Diagnostic &amp; Test Dispatch
                </h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Send an instant verification test email to verify host reachability and credentials.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Recipient Test Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="admin@maulicoating.com"
                      className="w-full h-8 text-xs px-2.5 bg-white border border-slate-300 rounded font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={sendingTest || !testEmail}
                    onClick={handleSendDiagnosticTest}
                    className="w-full h-9 rounded text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {sendingTest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-300" />
                        <span>Sending Diagnostic Test...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Diagnostic Test Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Recommended Provider Settings */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-[#301444] uppercase tracking-wider mb-2">
                  Recommended Provider Settings
                </h3>

                <div className="space-y-2 text-xs">
                  {RECOMMENDED_SMTP_PROVIDERS.map((provider) => (
                    <div
                      key={provider.name}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{provider.name}:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(provider)}
                          className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 transition-colors cursor-pointer"
                        >
                          Use Preset
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-slate-600">
                        Host: <span className="font-semibold text-slate-800">{provider.host}</span> | Port: <span className="font-semibold text-slate-800">{provider.port}</span> ({provider.encryption})
                      </p>
                      {provider.note && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Note: {provider.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Card: SMTP Mail Dispatch Logs */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            {/* Table Header Bar */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                  SMTP Mail Dispatch Logs
                </span>
                <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                  {mailLogs.length} Records
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshMailLogs}
                  className="inline-flex items-center gap-1 h-6 px-2.5 rounded text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-700" />
                  <span>Refresh Logs</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearMailLogs}
                  className="inline-flex items-center gap-1 h-6 px-2.5 rounded text-[11px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-rose-700" />
                  <span>Clear Logs</span>
                </button>
              </div>
            </div>

            {/* Excel-like High-Density Dispatch Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-3 w-40 whitespace-nowrap">Timestamp</th>
                    <th className="py-2 px-3 w-56">Recipient</th>
                    <th className="py-2 px-3 min-w-[280px]">Subject / Purpose</th>
                    <th className="py-2 px-3 w-44 font-mono">Host / Server</th>
                    <th className="py-2 px-3 w-24 text-center">Status</th>
                    <th className="py-2 px-3 min-w-[200px]">Details / Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {mailLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No mail dispatch logs recorded yet. Use the diagnostic test button above to send a verification email.
                      </td>
                    </tr>
                  ) : (
                    mailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-1.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-1.5 px-3 font-bold text-slate-800 truncate max-w-xs">
                          {log.recipient}
                        </td>
                        <td className="py-1.5 px-3 text-slate-700 font-medium">
                          {log.subject}
                        </td>
                        <td className="py-1.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {log.host}
                        </td>
                        <td className="py-1.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              log.status === 'SENT'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : log.status === 'FAILED'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-slate-500 text-[11px]">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: MODULAR FEATURES & SECURITY (FR-SET-012)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'features' && (
        <div className="space-y-2.5">
          {/* Subtable 1: Modular Features Matrix */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Practice Module Activation Matrix
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                Live Dynamic Toggles
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-56">Clinical Module</th>
                    <th className="py-2 px-3">Scope &amp; Functional Capability</th>
                    <th className="py-2 px-2.5 w-28 text-center">Status</th>
                    <th className="py-2 px-3 w-32 text-center">Toggle State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {[
                    { key: 'inventory', code: 'MOD-INV', name: 'Hearing Aid Inventory & Stock', desc: 'Barcode tracking, serial tracking, battery stock, low-stock warnings' },
                    { key: 'expenses', code: 'MOD-EXP', name: 'Clinic Expense Tracking', desc: 'Petty cash ledger, equipment maintenance, utility overhead accounts' },
                    { key: 'packages', code: 'MOD-PKG', name: 'Multi-Session Therapy Packages', desc: '10-session speech therapy package balance deduction and patient cards' },
                    { key: 'cbt', code: 'MOD-CBT', name: 'Cognitive Behavioural Therapy (CBT)', desc: 'Tinnitus distress psychometrics, habituation homework, CBT case notes' },
                    { key: 'onlineBooking', code: 'MOD-PUB', name: 'Public Patient Booking Portal', desc: 'Direct patient scheduling from website with WhatsApp confirmation' },
                    { key: 'waitlist', code: 'MOD-WTL', name: 'Smart Automated Waitlist Queue', desc: 'Auto-offers cancelled appointment slots to high-priority waiting patients' },
                    { key: 'referralInbox', code: 'MOD-REF', name: 'ENT Specialist Referral Network', desc: 'Digital referral inbox with reverse diagnostic audiogram reports' },
                  ].map((mod, idx) => (
                    <tr key={mod.key} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-1.5 px-3">
                        <span className="font-bold text-slate-800 block">{mod.name}</span>
                        <span className="text-[10px] font-mono text-purple-700 font-medium">{mod.code}</span>
                      </td>
                      <td className="py-1.5 px-3 text-slate-600">{mod.desc}</td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          settings.features[mod.key]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {settings.features[mod.key] ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.features[mod.key]}
                            onChange={(e) => handleChange('features', mod.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-700"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtable 2: Security & Session Parameters */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Workstation Session Security &amp; 2FA Status
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                ISO 27001 Grade
              </span>
            </div>

            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Mandatory TOTP 2FA</label>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    ✓ Enforced for All Staff
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Idle Inactivity Timeout</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={settings.features.idleTimeoutMin}
                    onChange={(e) => handleChange('features', 'idleTimeoutMin', parseInt(e.target.value) || 5)}
                    className="h-7 w-20 px-2 text-xs font-bold bg-white border border-slate-300 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-600">Minutes</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Current Workstation</label>
                <span className="text-xs font-mono font-bold text-slate-800 block">
                  Chrome on macOS (Satara Workstation • Active)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: CLINIC PROFILE & NAP SINGLE-SOURCE (FR-SET-001 - 003)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <div className="space-y-2.5">
          {/* Identity & Legal Entity Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                Practice Identity &amp; Approved Brand Assets
              </span>
              <span className="text-[10px] text-purple-700 bg-purple-50 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200">
                Bilingual English &amp; Marathi
              </span>
            </div>

            <div className="p-3 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Legal Entity Name</label>
                  <input
                    type="text"
                    value={settings.identity.legalName}
                    onChange={(e) => handleChange('identity', 'legalName', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Trade / Display Name</label>
                  <input
                    type="text"
                    value={settings.identity.tradeName}
                    onChange={(e) => handleChange('identity', 'tradeName', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Tagline (English)</label>
                  <input
                    type="text"
                    value={settings.identity.taglineEn}
                    onChange={(e) => handleChange('identity', 'taglineEn', e.target.value)}
                    className="h-7 w-full px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Tagline (Marathi / मराठी)</label>
                  <input
                    type="text"
                    value={settings.identity.taglineMr}
                    onChange={(e) => handleChange('identity', 'taglineMr', e.target.value)}
                    className="h-7 w-full px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Assets & Updatable Logo Section */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div>
                    <span className="text-xs font-bold text-[#301444] uppercase tracking-wider block">
                      Clinic Logo &amp; Official Letterhead Brand Assets
                    </span>
                    <span className="text-[10.5px] text-slate-500">
                      Upload your clinic logo (PNG, JPG, SVG). Automatically updates across all reports, tax invoices, letterheads, and navigation headers.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-bold bg-[#301444] text-white rounded hover:bg-purple-900 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload / Update Logo
                    </button>
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Reset to default official logo"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Light Surface: Reports, Invoices, Print */}
                  <div className="p-2.5 rounded-lg border border-purple-200 bg-white shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-800">Report &amp; Invoice Preview</span>
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Light Surface</span>
                    </div>
                    <div className="h-16 flex items-center justify-center p-1.5 bg-slate-50 rounded border border-slate-100">
                      <img
                        src={settings.identity.logoUrl || '/vaani-logo.png'}
                        alt="Report Logo Preview"
                        className="max-h-12 max-w-full object-contain drop-shadow-2xs"
                        onError={(e) => { e.target.src = '/vaani-logo.png'; }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1.5 text-center">Used in A4 Invoices &amp; Clinical Reports</span>
                  </div>

                  {/* Dark Surface: Top Navbars & Sidebars */}
                  <div className="p-2.5 rounded-lg border border-purple-950 bg-[#301444] text-white shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-purple-800/60 pb-1 mb-1.5">
                      <span className="text-[11px] font-bold text-white">Navigation Header Preview</span>
                      <span className="text-[9px] font-bold text-purple-200 bg-purple-900 px-1.5 py-0.5 rounded border border-purple-700">Dark Header</span>
                    </div>
                    <div className="h-16 flex items-center justify-center p-1.5 bg-white/10 rounded border border-white/10">
                      <img
                        src={settings.identity.logoUrl || '/vaani-logo-white.png'}
                        alt="Navbar Logo Preview"
                        className="max-h-12 max-w-full object-contain drop-shadow-md"
                        onError={(e) => { e.target.src = '/vaani-logo-white.png'; }}
                      />
                    </div>
                    <span className="text-[9px] text-purple-300 mt-1.5 text-center">Used in Top Navbar &amp; Drawer</span>
                  </div>

                  {/* Practitioner Accreditation Card */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-800">Practitioner Accreditation</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Verified</span>
                    </div>
                    <div className="space-y-1 text-[10.5px] text-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">RCI CRR Number:</span>
                        <span className="font-mono font-bold text-purple-950">{settings.credentials.rciNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Statutory GSTIN:</span>
                        <span className="font-mono font-semibold text-slate-900">{settings.credentials.gstin || '27AAAAA0000A1Z5'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Service SAC Code:</span>
                        <span className="font-mono font-semibold text-slate-900">{settings.billing.sacCode || '999312'}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1.5 text-center">Synced with RCI Practice License</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Numbers & NAP Location Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                NAP (Name, Address, Phone) Single-Source Directory
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Synced with Local Schema.org &amp; Google Maps
              </span>
            </div>

            <div className="p-3 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Primary Clinic Phone</label>
                  <input
                    type="text"
                    value={settings.contact.primaryPhone}
                    onChange={(e) => handleChange('contact', 'primaryPhone', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Consultation Mobile</label>
                  <input
                    type="text"
                    value={settings.contact.consultationPhone}
                    onChange={(e) => handleChange('contact', 'consultationPhone', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Official Practice Email</label>
                  <input
                    type="email"
                    value={settings.contact.officialEmail}
                    onChange={(e) => handleChange('contact', 'officialEmail', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Official Website URL</label>
                  <input
                    type="url"
                    value={settings.contact.websiteUrl}
                    onChange={(e) => handleChange('contact', 'websiteUrl', e.target.value)}
                    className="h-7 w-full px-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Physical Facility Address Line 1 &amp; 2</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={settings.contact.addressLine1}
                      onChange={(e) => handleChange('contact', 'addressLine1', e.target.value)}
                      className="h-7 px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.contact.addressLine2}
                      onChange={(e) => handleChange('contact', 'addressLine2', e.target.value)}
                      className="h-7 px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Locality, Taluka &amp; PIN</label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="text"
                      value={settings.contact.locality}
                      onChange={(e) => handleChange('contact', 'locality', e.target.value)}
                      className="h-7 px-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.contact.taluka}
                      onChange={(e) => handleChange('contact', 'taluka', e.target.value)}
                      className="h-7 px-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      value={settings.contact.pin}
                      onChange={(e) => handleChange('contact', 'pin', e.target.value)}
                      className="h-7 px-1.5 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Parking Arrangement</label>
                  <input
                    type="text"
                    value={settings.contact.parkingNote}
                    onChange={(e) => handleChange('contact', 'parkingNote', e.target.value)}
                    className="h-7 w-full px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Wheelchair Ramp &amp; Accessibility</label>
                  <input
                    type="text"
                    value={settings.contact.accessibilityNote}
                    onChange={(e) => handleChange('contact', 'accessibilityNote', e.target.value)}
                    className="h-7 w-full px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: AUDIT TRAIL LOG (FR-SET-013 & SHA-256 HASH-CHAINED)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
              Tamper-Evident SHA-256 Cryptographic Audit Ledger ({auditLogs.length} Records)
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              Chain Integrity Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                  <th className="py-2 px-3 w-40">Timestamp (IST)</th>
                  <th className="py-2 px-3 w-56">Authorized Actor</th>
                  <th className="py-2 px-3 w-40">Action Event</th>
                  <th className="py-2 px-3">Modification Summary</th>
                  <th className="py-2 px-3 w-48 font-mono">SHA-256 Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {auditLogs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-1.5 px-3 font-mono text-slate-600">{log.ts}</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">{log.actor}</td>
                    <td className="py-1.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-700">{log.summary}</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-400">{log.hash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB: BACKUP & DATA PURGE (CLINICAL DATA LIFECYCLE & DANGER ZONE)
          ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'data_lifecycle' && (
        <div className="space-y-3">
          
          {/* Top Metric Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transactional Records</span>
                <span className="p-1 rounded bg-purple-50 text-purple-700">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1 text-lg font-black text-[#301444] font-mono">
                {storageMetrics.totalTransactionalRecords}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Purgeable across 10 clinical modules</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Storage Footprint</span>
                <span className="p-1 rounded bg-blue-50 text-blue-700">
                  <HardDrive className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1 text-lg font-black text-slate-800 font-mono">
                ~{storageMetrics.totalTransactionalBytes} KB
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Local browser storage volume</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">User Account Status</span>
                <span className="p-1 rounded bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PROTECTED (PRESERVED)</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {user?.name || 'Dr. Palak Paresh Gandhi'} ({user?.role || 'OWNER'})
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Firm &amp; Clinic Details</span>
                <span className="p-1 rounded bg-emerald-50 text-emerald-700">
                  <Building className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-1 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>PROTECTED (PRESERVED)</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {settings.identity.legalName} • CRR {settings.credentials.rciNumber}
              </p>
            </div>
          </div>

          {/* Backup & Disaster Recovery Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-xs font-extrabold text-[#301444] uppercase tracking-wider flex items-center gap-1.5">
                  <Archive className="w-4 h-4 text-purple-700" />
                  Full System Data Backup &amp; Disaster Recovery Vault
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Export an unencrypted, structured JSON snapshot of all clinic configurations, clinical dossiers, invoices, and diagnostic records.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  ref={backupImportInputRef}
                  onChange={handleImportBackup}
                  accept=".json,application/json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => backupImportInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer shadow-2xs"
                  title="Restore clinical data from a previous JSON backup file"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                  <span>Restore from Backup (.JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white transition-all cursor-pointer shadow-2xs"
                  title="Generate and download full system JSON backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Full Backup (.JSON)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 bg-purple-50/40 p-2 rounded border border-purple-100">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>Includes complete patient dossiers, EDH histories &amp; SMART plans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>Includes statutory tax invoices, GST vouchers &amp; diagnostic reports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span>DPDP Act 2023 compliant portable JSON schema</span>
              </div>
            </div>
          </div>

          {/* Excel-style Data Inventory & Retention Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                  Clinic Data Inventory &amp; Protection Ledger
                </span>
                <span className="text-[10px] text-purple-700 bg-purple-50 font-medium px-1.5 py-0.5 rounded border border-purple-200">
                  14 Key Vaults
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Users &amp; Firm Profile Protected • Transactional Records Purgeable
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-2.5 w-10 text-center text-slate-400">#</th>
                    <th className="py-2 px-3 w-48">Module / Domain</th>
                    <th className="py-2 px-3 w-56 font-mono text-[10px]">Storage Key(s)</th>
                    <th className="py-2 px-3 w-32">Live Record Count</th>
                    <th className="py-2 px-3 w-44">Retention Policy</th>
                    <th className="py-2 px-3">Purge &amp; Delete Disposition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {/* Protected Item 1: User Accounts */}
                  <tr className="hover:bg-emerald-50/30 transition-colors bg-emerald-50/15">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">1</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">User Accounts &amp; Session</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_user, vaani_token</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">1 Active User</td>
                    <td className="py-1.5 px-3 text-slate-600">Continuous Clinician Auth</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PROTECTED (PRESERVED ON PURGE)
                      </span>
                    </td>
                  </tr>

                  {/* Protected Item 2: Clinic Settings */}
                  <tr className="hover:bg-emerald-50/30 transition-colors bg-emerald-50/15">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">2</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Clinic Identity, Logo &amp; NAP</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_clinic_settings_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">1 Master Firm Profile</td>
                    <td className="py-1.5 px-3 text-slate-600">Clinical Establishments Act</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PROTECTED (PRESERVED ON PURGE)
                      </span>
                    </td>
                  </tr>

                  {/* Protected Item 3: Service Tariff */}
                  <tr className="hover:bg-emerald-50/30 transition-colors bg-emerald-50/15">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">3</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Clinical Service Rates Tariff</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_service_rates_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{storageMetrics.rateCount} Service Rates</td>
                    <td className="py-1.5 px-3 text-slate-600">Standard Tariff Master</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PROTECTED (PRESERVED ON PURGE)
                      </span>
                    </td>
                  </tr>

                  {/* Protected Item 4: Holidays */}
                  <tr className="hover:bg-emerald-50/30 transition-colors bg-emerald-50/15">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">4</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Clinic Calendar &amp; Holidays</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_clinic_holidays_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">{storageMetrics.holidayCount} Gazetted Days</td>
                    <td className="py-1.5 px-3 text-slate-600">State Gazetted Calendar</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PROTECTED (PRESERVED ON PURGE)
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 5: Patients */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">5</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Registered Patients Master</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_patients_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.patientCount} Patients</td>
                    <td className="py-1.5 px-3 text-slate-600">7-Year Statutory Default</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 6: Appointments */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">6</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">OPD Appointments &amp; Slots</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_appointments_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.aptCount} Bookings</td>
                    <td className="py-1.5 px-3 text-slate-600">OPD Day Register</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 7: Invoices */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">7</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Statutory GST Invoices &amp; Vouchers</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_invoices_v1, vaani_billing_invoices_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.invCount} Invoices</td>
                    <td className="py-1.5 px-3 text-slate-600">8-Year GST Compliance</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 8: Clinical Reports */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">8</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Diagnostic Clinical Reports</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_clinical_reports_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.reportCount} Reports</td>
                    <td className="py-1.5 px-3 text-slate-600">Medical Diagnostic Battery</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 9: EDH */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">9</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Early Developmental Histories</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_edh_*</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.edhCount} Dossiers</td>
                    <td className="py-1.5 px-3 text-slate-600">Paediatric Milestones</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (KEYS DELETED)
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 10: Therapy Plans */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">10</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Therapy Rehabilitation SMART Plans</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_therapy_*</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.therapyCount} Plans</td>
                    <td className="py-1.5 px-3 text-slate-600">Clinical Rehab Protocol</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (KEYS DELETED)
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 11: SOAP Notes */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">11</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Clinical SOAP Session Notes</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_soap_*</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.soapCount} Sessions</td>
                    <td className="py-1.5 px-3 text-slate-600">Daily Encounters Ledger</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (KEYS DELETED)
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 12: Inventory */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">12</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Hearing Aid Inventory Stock</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_inventory_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.inventoryCount} Devices</td>
                    <td className="py-1.5 px-3 text-slate-600">Serial Device Register</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 13: Recalls */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">13</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">Clinical Recalls &amp; Reviews</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_recalls_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.recallCount} Recalls</td>
                    <td className="py-1.5 px-3 text-slate-600">Acoustic Recall Schedule</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>

                  {/* Purgeable Item 14: Mail Logs */}
                  <tr className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-1.5 px-2.5 text-center font-mono text-slate-400">14</td>
                    <td className="py-1.5 px-3 font-semibold text-slate-900">SMTP Email Dispatch Logs</td>
                    <td className="py-1.5 px-3 font-mono text-[10px] text-slate-600">vaani_clinic_mail_logs_v1</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-rose-700">{storageMetrics.mailCount} Logs</td>
                    <td className="py-1.5 px-3 text-slate-600">Outbound Dispatch Trail</td>
                    <td className="py-1.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        PURGEABLE (WIPES TO EMPTY [])
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Danger Zone: Clinical Data Purge Container */}
          <div className="bg-rose-50/60 border-2 border-rose-300 rounded-lg p-3.5 shadow-2xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                  Danger Zone: Clinical Transactional Data Purge &amp; Fresh Start
                </h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Permanently delete all transactional data across patients, appointments, billing invoices, diagnostic reports, therapy plans, and SOAP notes.
                  <strong className="font-bold text-emerald-900 ml-1">
                    Your clinician login account, credentials, clinic legal name, brand logo, address, bank/UPI details, GSTIN, and master service rates will NOT be deleted and will remain safely preserved.
                  </strong>
                </p>
              </div>
            </div>

            <div className="bg-white/90 border border-rose-200 rounded p-2.5 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold text-rose-950">
                  Ready to purge {storageMetrics.totalTransactionalRecords} transactional records? A full JSON backup will be created automatically before wiping.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3 py-1.5 rounded text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-purple-700" />
                  <span>Download Backup First</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWipeModalOpen(true)}
                  className="px-4 py-1.5 rounded text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All Clinical Data...</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── MODAL: WIPE ALL CLINICAL DATA CONFIRMATION ── */}
      <Modal
        isOpen={isWipeModalOpen}
        onClose={() => {
          if (!isWiping) {
            setIsWipeModalOpen(false);
            setWipeConfirmText('');
          }
        }}
        title="Confirm Clinical Transactional Data Purge"
        size="md"
      >
        <div className="space-y-3 font-sans text-xs">
          
          {/* Red Alert Banner */}
          <div className="p-2.5 rounded bg-rose-50 border border-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-900">
                Warning: This action will permanently wipe all clinical transactional records.
              </p>
              <p className="text-rose-800 leading-normal">
                This will delete {storageMetrics.totalTransactionalRecords} items including all registered patients, appointment bookings, invoices, clinical diagnostic reports, early developmental histories, and therapy SOAP notes.
              </p>
            </div>
          </div>

          {/* Breakdown: Preserved vs Deleted */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
              <p className="font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Will Remain Preserved:
              </p>
              <ul className="space-y-0.5 text-emerald-800">
                <li>• Clinician User Accounts &amp; Login</li>
                <li>• Clinic Legal Name &amp; Trade Name</li>
                <li>• Brand Logo &amp; Letterhead Title</li>
                <li>• Address, Phone &amp; Contact Info</li>
                <li>• Bank Account, IFSC &amp; UPI ID</li>
                <li>• GSTIN &amp; HSN/SAC Codes</li>
                <li>• Master Service Tariff Schedule</li>
              </ul>
            </div>

            <div className="p-2 rounded bg-rose-50 border border-rose-200">
              <p className="font-bold text-rose-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Will Be Deleted:
              </p>
              <ul className="space-y-0.5 text-rose-800">
                <li>• All Registered Patients ({storageMetrics.patientCount})</li>
                <li>• All OPD Appointments ({storageMetrics.aptCount})</li>
                <li>• All GST Invoices &amp; Billing ({storageMetrics.invCount})</li>
                <li>• All Diagnostic Reports ({storageMetrics.reportCount})</li>
                <li>• All Developmental Histories ({storageMetrics.edhCount})</li>
                <li>• All Therapy Plans &amp; SOAP Notes</li>
                <li>• Inventory Stock &amp; Recall Slips</li>
              </ul>
            </div>
          </div>

          {/* Automatic Backup Checkbox */}
          <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={autoBackupBeforeWipe}
              onChange={(e) => setAutoBackupBeforeWipe(e.target.checked)}
              className="w-4 h-4 text-purple-700 rounded border-slate-300 focus:ring-purple-600"
            />
            <span className="font-semibold text-slate-800">
              Download timestamped JSON backup archive before wiping (Highly Recommended)
            </span>
          </label>

          {/* Confirmation Input */}
          <div className="space-y-1 pt-1">
            <label className="font-bold text-slate-800 block">
              To proceed, please type <span className="font-mono text-rose-700 uppercase font-black">DELETE</span> in the box below:
            </label>
            <input
              type="text"
              value={wipeConfirmText}
              onChange={(e) => setWipeConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="h-8 w-full px-2.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-600 placeholder-slate-400"
              autoFocus
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsWipeModalOpen(false);
                setWipeConfirmText('');
              }}
              disabled={isWiping}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleWipeAllClinicalData}
              disabled={wipeConfirmText.trim().toUpperCase() !== 'DELETE' || isWiping}
              className="px-4 py-1.5 rounded text-xs font-black text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isWiping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Purging Clinical Data...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Complete Data Wipe</span>
                </>
              )}
            </button>
          </div>

        </div>
      </Modal>

      {/* ── MODAL: ADD CLINICAL SERVICE RATE ── */}
      <Modal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        title="Add Clinical Service / Investigation to Tariff Schedule"
        size="md"
      >
        <form onSubmit={handleAddServiceRate} className="space-y-3 font-sans text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Service Code</label>
              <input
                type="text"
                placeholder="e.g. SVC-AUD-007"
                value={newServiceForm.code}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, code: e.target.value })}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Clinical Discipline *</label>
              <select
                value={newServiceForm.discipline}
                onChange={(e) => {
                  const disc = e.target.value;
                  const isGoods = disc === 'Hearing Aids & Devices';
                  setNewServiceForm({
                    ...newServiceForm,
                    discipline: disc,
                    hsnSac: isGoods ? '9021' : '999312',
                    taxType: isGoods ? 'TAXABLE_GOODS' : 'HEALTHCARE_EXEMPT',
                  });
                }}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="Audiology">Audiology</option>
                <option value="Speech Therapy">Speech Therapy</option>
                <option value="Voice & Swallowing">Voice & Swallowing</option>
                <option value="Hearing Aids & Devices">Hearing Aids & Devices</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Clinical Service / Investigation Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Auditory Steady-State Response (ASSR)"
              value={newServiceForm.name}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
              className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Base Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="50"
                value={newServiceForm.baseRate}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, baseRate: parseFloat(e.target.value) || 0 })}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">SAC / HSN Code</label>
              <input
                type="text"
                value={newServiceForm.hsnSac}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, hsnSac: e.target.value })}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Tax Regime</label>
              <select
                value={newServiceForm.taxType}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, taxType: e.target.value })}
                className="h-8 w-full px-1.5 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="HEALTHCARE_EXEMPT">0% Exempt (Healthcare)</option>
                <option value="TAXABLE_GOODS">18% GST (Taxable Goods)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Billing Unit</label>
              <input
                type="text"
                placeholder="e.g. Per Evaluation / Per Session"
                value={newServiceForm.unit}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, unit: e.target.value })}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Status</label>
              <select
                value={newServiceForm.status}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, status: e.target.value })}
                className="h-8 w-full px-1.5 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Clinical Protocol / Description</label>
            <textarea
              rows={2}
              placeholder="Clinical equipment, ANSI standard, or protocol details..."
              value={newServiceForm.description}
              onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
              className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddServiceModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-colors cursor-pointer"
            >
              Add to Tariff Schedule
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default SettingsPage;
