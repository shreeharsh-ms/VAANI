import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  IndianRupee,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
  CreditCard,
  Smartphone,
  Eye,
  RefreshCw,
  Printer,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  Edit2,
  Trash2,
  Mail,
  MessageSquare,
  Share2,
  Send,
  AlertTriangle,
  Check,
  ExternalLink,
  Users,
  User,
  Sparkles,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useClinicSettings, formatClinicAddress, formatClinicHelpline } from '../../context/ClinicSettingsContext';
import Modal from '../../components/common/Modal';
import { WhatsAppDispatchModal, EmailDispatchModal } from '../../components/common';
import { isKey, isAlt, isCmdOrCtrl } from '../../utils/keyboard';
import { getServiceRates } from '../../data/serviceRatesData';
import { printClinicalInvoice, numberToWordsINR } from '../../utils/invoicePrint';
import { SEED_PATIENTS } from '../../data/patientClinicalProfiles';
import { useTableKeyboardNav } from '../../hooks';

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

// ── INITIAL BILLING & INVOICE DATA SEED ──
const INITIAL_INVOICES = [
  {
    id: 'inv_101',
    invoiceNo: 'INV-2026-0081',
    date: '2026-10-16',
    uhid: 'VN-26-0001',
    patientName: 'Aarav Sachin Shinde',
    phone: '+91 98220 11223',
    service: 'Comprehensive Pediatric Speech-Language Evaluation',
    serviceCode: 'SVC-SLP-001',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 1500,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 1500,
    paymentMode: 'UPI',
    upiRef: 'UPI/291038472910',
    status: 'PAID',
    receiptNo: 'REC-2026-0081',
  },
  {
    id: 'inv_102',
    invoiceNo: 'INV-2026-0080',
    date: '2026-10-16',
    uhid: 'VN-26-0002',
    patientName: 'Sunita Dattatray More',
    phone: '+91 94220 44556',
    service: 'Pure Tone Audiometry (PTA) + Tympanometry',
    serviceCode: 'SVC-AUD-002',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 1200,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 1200,
    paymentMode: 'CASH',
    upiRef: '-',
    status: 'PAID',
    receiptNo: 'REC-2026-0080',
  },
  {
    id: 'inv_103',
    invoiceNo: 'INV-2026-0079',
    date: '2026-10-15',
    uhid: 'VN-26-0003',
    patientName: 'Vijay Narayan Kadam',
    phone: '+91 98901 77889',
    service: 'Phonak Lumity L90-R Hearing Aid (Bilateral) + Fitting',
    serviceCode: 'SVC-HA-009',
    hsnSac: '9021',
    taxType: 'TAXABLE_GOODS',
    amount: 145000,
    gstPercent: 18,
    taxAmount: 26100,
    totalAmount: 171100,
    paymentMode: 'BANK_TRANSFER',
    upiRef: 'NEFT/HDFC291048',
    status: 'PAID',
    receiptNo: 'REC-2026-0079',
  },
  {
    id: 'inv_104',
    invoiceNo: 'INV-2026-0078',
    date: '2026-10-15',
    uhid: 'VN-26-0004',
    patientName: 'Ananya Rahul Patil',
    phone: '+91 97654 33221',
    service: 'Speech Therapy Package (10-Session Card Block)',
    serviceCode: 'PKG-SP-10',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 7500,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 7500,
    paymentMode: 'UPI',
    upiRef: 'UPI/291039882101',
    status: 'PAID',
    receiptNo: 'REC-2026-0078',
  },
  {
    id: 'inv_105',
    invoiceNo: 'INV-2026-0077',
    date: '2026-10-14',
    uhid: 'VN-26-0005',
    patientName: 'Ramesh Balasaheb Deshmukh',
    phone: '+91 94231 66778',
    service: 'Tinnitus Evaluation & Habituation Consultation (CBT)',
    serviceCode: 'SVC-CBT-001',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 2000,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 2000,
    paymentMode: 'CASH',
    upiRef: '-',
    status: 'PAID',
    receiptNo: 'REC-2026-0077',
  },
  {
    id: 'inv_106',
    invoiceNo: 'INV-2026-0076',
    date: '2026-10-14',
    uhid: 'VN-26-0006',
    patientName: 'Kavita Suresh Bhosale',
    phone: '+91 98233 44112',
    service: 'Hearing Aid Zinc-Air Batteries (Size 312, 10 Packs)',
    serviceCode: 'INV-BAT-312',
    hsnSac: '8506',
    taxType: 'TAXABLE_GOODS',
    amount: 3500,
    gstPercent: 18,
    taxAmount: 630,
    totalAmount: 4130,
    paymentMode: 'UPI',
    upiRef: 'UPI/291039771120',
    status: 'PAID',
    receiptNo: 'REC-2026-0076',
  },
  {
    id: 'inv_107',
    invoiceNo: 'INV-2026-0075',
    date: '2026-10-13',
    uhid: 'VN-26-0007',
    patientName: 'Dhananjay Ramchandra Jadhav',
    phone: '+91 98902 55667',
    service: 'OAE Newborn Hearing Screening (Bilateral)',
    serviceCode: 'SVC-AUD-005',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 800,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 800,
    paymentMode: 'CASH',
    upiRef: '-',
    status: 'PAID',
    receiptNo: 'REC-2026-0075',
  },
  {
    id: 'inv_108',
    invoiceNo: 'INV-2026-0074',
    date: '2026-10-12',
    uhid: 'VN-26-0008',
    patientName: 'Pooja Nitin Kulkarni',
    phone: '+91 97665 88990',
    service: 'Voice Therapy & Acoustic Vocal Analysis (GRBAS)',
    serviceCode: 'SVC-VOC-001',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 1500,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 1500,
    paymentMode: 'UPI',
    upiRef: 'UPI/291039551122',
    status: 'PAID',
    receiptNo: 'REC-2026-0074',
  },
  {
    id: 'inv_109',
    invoiceNo: 'INV-2026-0073',
    date: '2026-10-11',
    uhid: 'VN-26-0009',
    patientName: 'Sanjay Govind Pawar',
    phone: '+91 98224 33221',
    service: 'Pure Tone Audiometry (PTA) Diagnostic',
    serviceCode: 'SVC-AUD-001',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    amount: 800,
    gstPercent: 0,
    taxAmount: 0,
    totalAmount: 800,
    paymentMode: 'PENDING',
    upiRef: '-',
    status: 'DUE',
    receiptNo: '-',
  },
  {
    id: 'inv_110',
    invoiceNo: 'INV-2026-0072',
    date: '2026-10-10',
    uhid: 'VN-26-0010',
    patientName: 'Meena Arvind Sawant',
    phone: '+91 94222 11990',
    service: 'Custom Hard Earmould Impression & Fabrication',
    serviceCode: 'SVC-HA-EM',
    hsnSac: '9021',
    taxType: 'TAXABLE_GOODS',
    amount: 1800,
    gstPercent: 18,
    taxAmount: 324,
    totalAmount: 2124,
    paymentMode: 'CASH',
    upiRef: '-',
    status: 'PAID',
    receiptNo: 'REC-2026-0072',
  },
];

export const BillingPage = () => {
  const { notify } = useNotification();
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
  const clinicPayee = clinicSettings?.billing?.upiName || clinicSettings?.identity?.legalName || 'Vaani Speech & Hearing Clinic';
  const clinicBankName = clinicSettings?.billing?.bankName || 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara';
  const clinicBankIfsc = clinicSettings?.billing?.bankIfsc || 'HDFC0000123';
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_invoices_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return INITIAL_INVOICES;
    }
    return INITIAL_INVOICES;
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [taxFilter, setTaxFilter] = useState('ALL');

  // Sorting State
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dynamic Clinical Services & Tariff Rates
  const [serviceRates, setServiceRates] = useState(() => getServiceRates());

  useEffect(() => {
    const handleRatesUpdate = (e) => {
      if (e.detail) setServiceRates(e.detail);
      else setServiceRates(getServiceRates());
    };
    window.addEventListener('vaani_rates_updated', handleRatesUpdate);
    return () => window.removeEventListener('vaani_rates_updated', handleRatesUpdate);
  }, []);

  // Modals State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [activeInvoiceForUpi, setActiveInvoiceForUpi] = useState(null);
  const [isViewInvoiceModalOpen, setIsViewInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [selectedInvoiceForMail, setSelectedInvoiceForMail] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedInvoiceForWhatsApp, setSelectedInvoiceForWhatsApp] = useState(null);
  const invoiceFormRef = useRef(null);

  // New Invoice Form State
  const [newUhid, setNewUhid] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPaymentMode, setNewPaymentMode] = useState('UPI');

  // In-stock Hearing Aid Devices for Serial Number Autocomplete
  const [inStockDevices, setInStockDevices] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vaani_inventory_devices_v1') || '[]');
      return Array.isArray(stored) ? stored.filter((d) => d.stockStatus === 'IN_STOCK') : [];
    } catch {
      return [];
    }
  });

  const refreshInStockDevices = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('vaani_inventory_devices_v1') || '[]');
      setInStockDevices(Array.isArray(stored) ? stored.filter((d) => d.stockStatus === 'IN_STOCK') : []);
    } catch {}
  };

  // Helper to determine if a line item is an actual hearing aid device (excludes tests, therapy, batteries & impressions)
  const isHearingAidItem = (item) => {
    if (!item) return false;
    if (item.isCustomHearingAid) return true;
    if (item.category === 'HEARING_AID' || item.type === 'HEARING_AID') return true;

    const name = (item.service || item.name || '').toLowerCase();

    // 1. Diagnostics, tests, consultations & therapy (tests like PTA, BERA, OAE are NOT devices)
    if (
      name.includes('audiometry') ||
      name.includes('pta') ||
      name.includes('tympanometry') ||
      name.includes('impedance') ||
      name.includes('oae') ||
      name.includes('bera') ||
      name.includes('abr') ||
      name.includes('evaluation') ||
      name.includes('assessment') ||
      name.includes('screening') ||
      name.includes('consultation') ||
      name.includes('cbt') ||
      name.includes('speech') ||
      name.includes('voice') ||
      name.includes('swallowing') ||
      name.includes('stuttering') ||
      name.includes('fluency') ||
      name.includes('therapy') ||
      name.includes('trial')
    ) {
      return false;
    }

    // 2. Consumables & accessories (batteries, domes, wax guards, earmould impressions are NOT devices)
    if (
      name.includes('battery') ||
      name.includes('batteries') ||
      name.includes('earmould') ||
      name.includes('impression') ||
      name.includes('dome') ||
      name.includes('wax') ||
      name.includes('dry box') ||
      name.includes('desiccant')
    ) {
      return false;
    }

    // 3. Hearing Aid instruments & models
    if (
      name.includes('hearing aid') ||
      name.includes('lumity') ||
      name.includes('phonak') ||
      name.includes('signia') ||
      name.includes('widex') ||
      name.includes('oticon') ||
      name.includes('resound') ||
      name.includes('starkey') ||
      name.includes('unitron') ||
      name.includes('bte') ||
      name.includes('ric') ||
      name.includes('cic') ||
      name.includes('iic') ||
      name.includes('itc')
    ) {
      return true;
    }

    // 4. If an explicit serial number is populated
    if (item.serialNo && item.serialNo.trim().length > 0) {
      return true;
    }

    return false;
  };

  // Multi-Item Invoice Line Items State (CREATE MODAL)
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: 'item_1',
      service: 'Pure Tone Audiometry (PTA)',
      serviceCode: 'SVC-AUD-001',
      hsnSac: '999312',
      taxType: 'HEALTHCARE_EXEMPT',
      gstPercent: 0,
      baseRate: 800,
      qty: 1,
      taxAmount: 0,
      totalAmount: 800,
      serialNo: '',
      ear: '',
      brand: '',
      model: '',
    }
  ]);

  const handleAddItemRow = () => {
    const defaultSvc = serviceRates[0] || { name: 'Clinical Consultation', code: 'SVC-CLN-001', hsnSac: '999312', baseRate: 500, taxType: 'HEALTHCARE_EXEMPT' };
    setInvoiceItems(prev => [
      ...prev,
      {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        service: defaultSvc.name,
        serviceCode: defaultSvc.code || 'SVC-CLN-001',
        hsnSac: defaultSvc.hsnSac || '999312',
        taxType: defaultSvc.taxType || 'HEALTHCARE_EXEMPT',
        gstPercent: defaultSvc.taxType === 'TAXABLE_GOODS' ? 18 : 0,
        baseRate: defaultSvc.baseRate || 500,
        qty: 1,
        taxAmount: defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 500) * 0.18) : 0,
        totalAmount: (defaultSvc.baseRate || 500) + (defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 500) * 0.18) : 0),
        serialNo: '',
        ear: 'Right Ear',
        brand: '',
        model: '',
      }
    ]);
  };

  const handleRemoveItemRow = (idx) => {
    if (invoiceItems.length <= 1) {
      notify.error('At least one line item is required on the tax invoice.');
      return;
    }
    setInvoiceItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItemRow = (idx, field, value) => {
    setInvoiceItems(prev => {
      const copy = [...prev];
      const item = { ...copy[idx], [field]: value };

      if (field === 'service') {
        const matched = serviceRates.find(s => s.name === value);
        if (matched) {
          item.serviceCode = matched.code;
          item.hsnSac = matched.hsnSac || (matched.taxType === 'TAXABLE_GOODS' ? '90214090' : '999312');
          item.taxType = matched.taxType;
          item.gstPercent = matched.taxType === 'TAXABLE_GOODS' ? 18 : 0;
          item.baseRate = matched.baseRate;
        }
        // If switched to a service that is NOT a hearing aid device, clear serial and ear
        if (!isHearingAidItem({ ...item, isCustomHearingAid: false })) {
          item.serialNo = '';
          item.ear = '';
          item.brand = '';
          item.model = '';
          item.isCustomHearingAid = false;
        } else if (!item.ear) {
          item.ear = 'Right Ear';
        }
      }

      if (field === 'selectedDeviceSerial') {
        const dev = inStockDevices.find(d => d.serialNo === value);
        if (dev) {
          item.serialNo = dev.serialNo;
          item.brand = dev.brand;
          item.model = dev.model;
          item.service = `${dev.brand} ${dev.model} (Hearing Aid)`;
          item.serviceCode = 'RP-CLN-HAF';
          item.hsnSac = dev.hsnCode || '90214090';
          item.taxType = 'TAXABLE_GOODS';
          item.gstPercent = dev.gstPercent || 18;
          item.baseRate = dev.mrp || dev.unitCost || item.baseRate;
          item.ear = dev.ear || item.ear || 'Right Ear';
        }
      }

      if (field === 'taxType') {
        item.gstPercent = value === 'TAXABLE_GOODS' ? 18 : 0;
      }

      const rate = parseFloat(item.baseRate) || 0;
      const qty = parseInt(item.qty, 10) || 1;
      const subtotal = rate * qty;
      const gst = item.taxType === 'TAXABLE_GOODS' || item.gstPercent > 0
        ? Math.round(subtotal * ((parseFloat(item.gstPercent) || 18) / 100))
        : 0;
      item.taxAmount = gst;
      item.totalAmount = subtotal + gst;

      copy[idx] = item;
      return copy;
    });
  };

  const invoiceCalculations = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    invoiceItems.forEach(it => {
      const r = parseFloat(it.baseRate) || 0;
      const q = parseInt(it.qty, 10) || 1;
      const lineBase = r * q;
      const lineGst = it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0
        ? Math.round(lineBase * ((parseFloat(it.gstPercent) || 18) / 100))
        : 0;
      subtotal += lineBase;
      totalTax += lineGst;
    });
    return {
      subtotal,
      totalTax,
      netTotal: subtotal + totalTax,
    };
  }, [invoiceItems]);

  // ── MULTI-ITEM EDIT INVOICE STATE ──
  const [editInvoiceItems, setEditInvoiceItems] = useState([]);

  const handleEditAddItemRow = () => {
    const defaultSvc = serviceRates[0] || { name: 'Clinical Consultation', code: 'SVC-CLN-001', hsnSac: '999312', baseRate: 500, taxType: 'HEALTHCARE_EXEMPT' };
    setEditInvoiceItems(prev => [
      ...prev,
      {
        id: `edit_item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        service: defaultSvc.name,
        serviceCode: defaultSvc.code || 'SVC-CLN-001',
        hsnSac: defaultSvc.hsnSac || '999312',
        taxType: defaultSvc.taxType || 'HEALTHCARE_EXEMPT',
        gstPercent: defaultSvc.taxType === 'TAXABLE_GOODS' ? 18 : 0,
        baseRate: defaultSvc.baseRate || 500,
        qty: 1,
        taxAmount: defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 500) * 0.18) : 0,
        totalAmount: (defaultSvc.baseRate || 500) + (defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 500) * 0.18) : 0),
        serialNo: '',
        ear: 'Right Ear',
        brand: '',
        model: '',
      }
    ]);
  };

  const handleEditRemoveItemRow = (idx) => {
    if (editInvoiceItems.length <= 1) {
      notify.error('At least one line item is required on the tax invoice.');
      return;
    }
    setEditInvoiceItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditUpdateItemRow = (idx, field, value) => {
    setEditInvoiceItems(prev => {
      const copy = [...prev];
      const item = { ...copy[idx], [field]: value };

      if (field === 'service') {
        const matched = serviceRates.find(s => s.name === value);
        if (matched) {
          item.serviceCode = matched.code;
          item.hsnSac = matched.hsnSac || (matched.taxType === 'TAXABLE_GOODS' ? '90214090' : '999312');
          item.taxType = matched.taxType;
          item.gstPercent = matched.taxType === 'TAXABLE_GOODS' ? 18 : 0;
          item.baseRate = matched.baseRate;
        }
        // If switched to a service that is NOT a hearing aid device, clear serial and ear
        if (!isHearingAidItem({ ...item, isCustomHearingAid: false })) {
          item.serialNo = '';
          item.ear = '';
          item.brand = '';
          item.model = '';
          item.isCustomHearingAid = false;
        } else if (!item.ear) {
          item.ear = 'Right Ear';
        }
      }

      if (field === 'selectedDeviceSerial') {
        const dev = inStockDevices.find(d => d.serialNo === value);
        if (dev) {
          item.serialNo = dev.serialNo;
          item.brand = dev.brand;
          item.model = dev.model;
          item.service = `${dev.brand} ${dev.model} (Hearing Aid)`;
          item.serviceCode = 'RP-CLN-HAF';
          item.hsnSac = dev.hsnCode || '90214090';
          item.taxType = 'TAXABLE_GOODS';
          item.gstPercent = dev.gstPercent || 18;
          item.baseRate = dev.mrp || dev.unitCost || item.baseRate;
          item.ear = dev.ear || item.ear || 'Right Ear';
        }
      }

      if (field === 'taxType') {
        item.gstPercent = value === 'TAXABLE_GOODS' ? 18 : 0;
      }

      const rate = parseFloat(item.baseRate) || 0;
      const qty = parseInt(item.qty, 10) || 1;
      const subtotal = rate * qty;
      const gst = item.taxType === 'TAXABLE_GOODS' || item.gstPercent > 0
        ? Math.round(subtotal * ((parseFloat(item.gstPercent) || 18) / 100))
        : 0;
      item.taxAmount = gst;
      item.totalAmount = subtotal + gst;

      copy[idx] = item;
      return copy;
    });
  };

  const editInvoiceCalculations = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    editInvoiceItems.forEach(it => {
      const r = parseFloat(it.baseRate) || 0;
      const q = parseInt(it.qty, 10) || 1;
      const lineBase = r * q;
      const lineGst = it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0
        ? Math.round(lineBase * ((parseFloat(it.gstPercent) || 18) / 100))
        : 0;
      subtotal += lineBase;
      totalTax += lineGst;
    });
    return {
      subtotal,
      totalTax,
      netTotal: subtotal + totalTax,
    };
  }, [editInvoiceItems]);

  // ── HELPER: SYNC DISPENSED HEARING AID DEVICES TO INVENTORY & PATIENT DOSSIER ──
  const syncDispensedHearingAids = (inv, items) => {
    try {
      const haItems = items.filter(
        it => isHearingAidItem(it) && (it.serialNo?.trim() || it.service)
      );
      if (haItems.length === 0) return;

      const storedDevices = JSON.parse(localStorage.getItem('vaani_inventory_devices_v1') || '[]');
      const movements = JSON.parse(localStorage.getItem('vaani_stock_movements_v1') || '[]');
      const patientHAs = JSON.parse(localStorage.getItem('vaani_patient_hearing_aids_v1') || '{}');
      const uhid = inv.uhid || 'MH-STR-2026-0001';

      if (!patientHAs[uhid]) {
        patientHAs[uhid] = {
          uhid: uhid,
          patientName: inv.patientName,
          dispensed: true,
          dispensedDate: inv.date,
          invoiceNo: inv.invoiceNo,
          instruments: [],
        };
      }
      if (!Array.isArray(patientHAs[uhid].instruments)) {
        patientHAs[uhid].instruments = [];
      }

      haItems.forEach((it) => {
        const serial = (it.serialNo || '').trim() || `HA-${Date.now().toString().slice(-6)}`;
        const devIdx = storedDevices.findIndex((d) => d.serialNo === serial);

        if (devIdx >= 0) {
          storedDevices[devIdx] = {
            ...storedDevices[devIdx],
            stockStatus: 'DISPENSED',
            patientUhid: inv.uhid,
            patientName: inv.patientName,
            ear: it.ear || 'Right Ear',
            invoiceNo: inv.invoiceNo,
            saleDate: inv.date,
          };
          movements.unshift({
            id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'SOLD_DISPENSED',
            itemId: storedDevices[devIdx].id,
            itemName: storedDevices[devIdx].model,
            brand: storedDevices[devIdx].brand,
            serialNo: serial,
            hsnCode: storedDevices[devIdx].hsnCode || '90214090',
            qtyChange: -1,
            refDoc: inv.invoiceNo,
            patientName: inv.patientName,
            patientUhid: inv.uhid,
            notes: `Sold & dispensed to ${inv.patientName} on Invoice ${inv.invoiceNo} (${it.ear || 'Right Ear'})`,
            date: inv.date,
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          });
        } else {
          const newDispensedDev = {
            id: `dev_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            serialNo: serial,
            brand: it.brand || 'Phonak',
            model: it.model || it.service || 'Digital Hearing Aid',
            category: 'RIC (Receiver-in-Canal)',
            channels: 16,
            batteryType: 'Rechargeable',
            hsnCode: it.hsnSac || '90214090',
            gstPercent: it.gstPercent || 18,
            stockStatus: 'DISPENSED',
            patientUhid: inv.uhid,
            patientName: inv.patientName,
            ear: it.ear || 'Right Ear',
            warrantyExpiry: new Date(Date.now() + 2 * 365 * 86400000).toISOString().split('T')[0],
            unitCost: it.baseRate || 30000,
            mrp: it.totalAmount || 45000,
            vendor: 'Official Clinic Stock',
            invoiceNo: inv.invoiceNo,
            saleDate: inv.date,
          };
          storedDevices.push(newDispensedDev);
          movements.unshift({
            id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: 'SOLD_DISPENSED',
            itemId: newDispensedDev.id,
            itemName: newDispensedDev.model,
            brand: newDispensedDev.brand,
            serialNo: serial,
            hsnCode: '90214090',
            qtyChange: -1,
            refDoc: inv.invoiceNo,
            patientName: inv.patientName,
            patientUhid: inv.uhid,
            notes: `Dispensed to patient ${inv.patientName} on Invoice ${inv.invoiceNo}`,
            date: inv.date,
            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          });
        }

        // Add / Update patient hearing aid record
        const existingIdx = patientHAs[uhid].instruments.findIndex((inst) => inst.serial === serial);
        const instRecord = {
          side: it.ear || 'Right Ear',
          make: `${it.brand || 'Phonak'} ${it.model || it.service}`,
          brand: it.brand || 'Phonak',
          model: it.model || it.service,
          serial: serial,
          style: 'RIC',
          battery: 'Lithium-ion Rechargeable',
          status: 'FITTED & ACTIVE',
          warrantyUntil: new Date(Date.now() + 2 * 365 * 86400000).toISOString().split('T')[0],
          invoiceNo: inv.invoiceNo,
          dispensedDate: inv.date,
        };
        if (existingIdx >= 0) {
          patientHAs[uhid].instruments[existingIdx] = instRecord;
        } else {
          patientHAs[uhid].instruments.push(instRecord);
        }
      });

      localStorage.setItem('vaani_inventory_devices_v1', JSON.stringify(storedDevices));
      localStorage.setItem('vaani_stock_movements_v1', JSON.stringify(movements));
      localStorage.setItem('vaani_patient_hearing_aids_v1', JSON.stringify(patientHAs));
      refreshInStockDevices();
    } catch (e) {
      console.warn('Failed syncing hearing aids from invoice:', e);
    }
  };

  // Registered Patient Search & Autocomplete State
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(null);
  const patientDropdownRef = useRef(null);

  // Load all registered patients from local storage / seed
  const registeredPatients = useMemo(() => {
    let list = [];
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch {}

    if (list.length === 0) {
      list = SEED_PATIENTS || [];
    }
    return list;
  }, [isInvoiceModalOpen]);

  // Filter matched patients by name, UHID, phone, service line, or city
  const matchedPatients = useMemo(() => {
    const q = patientSearchQuery.trim().toLowerCase();
    if (!q) {
      return registeredPatients.slice(0, 8);
    }
    return registeredPatients.filter((p) => {
      const name = (p.full_name || '').toLowerCase();
      const uhid = (p.uhid || '').toLowerCase();
      const phone = (p.phone || p.guardian_phone || '').toLowerCase();
      const srv = (p.service_line || '').toLowerCase();
      const city = (p.city || '').toLowerCase();
      return name.includes(q) || uhid.includes(q) || phone.includes(q) || srv.includes(q) || city.includes(q);
    }).slice(0, 10);
  }, [registeredPatients, patientSearchQuery]);

  // Handle selecting a patient from the search dropdown
  const handleSelectPatientForInvoice = (p) => {
    setSelectedPatientRecord(p);
    setNewPatientName(p.full_name || '');
    setNewUhid(p.uhid || '');
    setNewPhone(p.phone || p.guardian_phone || '');
    setPatientSearchQuery('');
    setIsPatientDropdownOpen(false);

    // Auto-suggest clinical service based on patient discipline
    if (p.service_line) {
      const srv = p.service_line.toUpperCase();
      let matchedService = null;
      if (srv.includes('AUD')) {
        matchedService = serviceRates.find(s => s.code === 'SVC-AUD-001' || s.name.includes('Pure Tone'));
      } else if (srv.includes('SPEECH') || srv.includes('LANG')) {
        matchedService = serviceRates.find(s => s.code === 'SVC-SLP-001' || s.name.includes('Speech'));
      } else if (srv.includes('VOI')) {
        matchedService = serviceRates.find(s => s.code === 'SVC-VOI-001' || s.name.includes('Voice'));
      } else if (srv.includes('CBT') || srv.includes('PSYCH')) {
        matchedService = serviceRates.find(s => s.code === 'SVC-CBT-001' || s.name.includes('Tinnitus'));
      }

      if (matchedService) {
        setInvoiceItems([
          {
            id: 'item_1',
            service: matchedService.name,
            serviceCode: matchedService.code,
            hsnSac: matchedService.hsnSac || '999312',
            taxType: matchedService.taxType,
            gstPercent: matchedService.taxType === 'TAXABLE_GOODS' ? 18 : 0,
            baseRate: matchedService.baseRate,
            qty: 1,
            taxAmount: matchedService.taxType === 'TAXABLE_GOODS' ? Math.round(matchedService.baseRate * 0.18) : 0,
            totalAmount: matchedService.baseRate + (matchedService.taxType === 'TAXABLE_GOODS' ? Math.round(matchedService.baseRate * 0.18) : 0),
          }
        ]);
      }
    }

    notify.info(`Auto-populated details for ${p.full_name} (${p.uhid})`);
  };

  const handleClearSelectedPatient = () => {
    setSelectedPatientRecord(null);
    setNewPatientName('');
    setNewUhid('');
    setNewPhone('');
    setPatientSearchQuery('');
  };

  const handleOpenNewInvoiceModal = () => {
    setSelectedPatientRecord(null);
    setPatientSearchQuery('');
    setIsPatientDropdownOpen(false);
    setNewPatientName('');
    setNewUhid('');
    setNewPhone('');
    setNewPaymentMode('UPI');
    const defaultSvc = serviceRates.find(s => s.code === 'SVC-AUD-001') || serviceRates[0] || {
      name: 'Pure Tone Audiometry (PTA)',
      code: 'SVC-AUD-001',
      hsnSac: '999312',
      taxType: 'HEALTHCARE_EXEMPT',
      baseRate: 800,
    };
    setInvoiceItems([
      {
        id: 'item_1',
        service: defaultSvc.name,
        serviceCode: defaultSvc.code || 'SVC-AUD-001',
        hsnSac: defaultSvc.hsnSac || '999312',
        taxType: defaultSvc.taxType || 'HEALTHCARE_EXEMPT',
        gstPercent: defaultSvc.taxType === 'TAXABLE_GOODS' ? 18 : 0,
        baseRate: defaultSvc.baseRate || 800,
        qty: 1,
        taxAmount: defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 800) * 0.18) : 0,
        totalAmount: (defaultSvc.baseRate || 800) + (defaultSvc.taxType === 'TAXABLE_GOODS' ? Math.round((defaultSvc.baseRate || 800) * 0.18) : 0),
      }
    ]);
    setIsInvoiceModalOpen(true);
  };

  // Close patient dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(e.target)) {
        setIsPatientDropdownOpen(false);
      }
    };
    if (isPatientDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isPatientDropdownOpen]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Option + N / Alt + N -> New Invoice
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        handleOpenNewInvoiceModal();
      }
      // Option + E / Alt + E -> Export CSV
      if (isAlt(e) && isKey(e, 'e')) {
        e.preventDefault();
        handleExportCSV();
      }
      // Ctrl + Enter or Cmd + Enter -> Submit Invoice Modal
      if (isInvoiceModalOpen && isCmdOrCtrl(e) && isKey(e, 'enter')) {
        e.preventDefault();
        if (invoiceFormRef.current) {
          invoiceFormRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoices, isInvoiceModalOpen]);

  // Date Filter State
  const [dateFilterPreset, setDateFilterPreset] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.patientName.toLowerCase().includes(q) ||
        inv.uhid.toLowerCase().includes(q) ||
        inv.phone.includes(q) ||
        inv.service.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchesTax = taxFilter === 'ALL' || inv.taxType === taxFilter;

      let matchesDate = true;
      if (dateFilterPreset === 'TODAY') {
        const todayStr = new Date().toISOString().substring(0, 10);
        matchesDate = inv.date === todayStr;
      } else if (dateFilterPreset === 'LAST_7_DAYS') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const cutoff = d.toISOString().substring(0, 10);
        matchesDate = inv.date >= cutoff;
      } else if (dateFilterPreset === 'THIS_MONTH') {
        const ym = new Date().toISOString().substring(0, 7);
        matchesDate = inv.date && inv.date.startsWith(ym);
      } else if (dateFilterPreset === 'LAST_30_DAYS') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        const cutoff = d.toISOString().substring(0, 10);
        matchesDate = inv.date >= cutoff;
      } else if (dateFilterPreset === 'CUSTOM') {
        if (startDateFilter) matchesDate = matchesDate && inv.date >= startDateFilter;
        if (endDateFilter) matchesDate = matchesDate && inv.date <= endDateFilter;
      }

      return matchesSearch && matchesStatus && matchesTax && matchesDate;
    });
  }, [invoices, search, statusFilter, taxFilter, dateFilterPreset, startDateFilter, endDateFilter]);

  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    });
  }, [filteredInvoices, sortField, sortOrder]);

  // Pagination Slice
  const totalEntries = sortedInvoices.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedInvoices.slice(start, start + pageSize);
  }, [sortedInvoices, page, pageSize]);

  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: paginatedInvoices,
    page,
    totalPages,
    onPageChange: setPage,
    tableId: 'billing-table',
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Invoice No', 'Date', 'UHID', 'Patient Name', 'Phone', 'Service', 'Tax Type', 'Base Amount', 'GST Amount', 'Total Amount', 'Payment Mode', 'Status', 'Receipt No'];
    const rows = sortedInvoices.map(inv => [
      inv.invoiceNo,
      inv.date,
      inv.uhid,
      `"${inv.patientName}"`,
      inv.phone,
      `"${inv.service}"`,
      inv.taxType,
      inv.amount,
      inv.taxAmount,
      inv.totalAmount,
      inv.paymentMode,
      inv.status,
      inv.receiptNo,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_Invoices_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Invoice register exported to CSV successfully!');
  };

  // Create New Invoice
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newPatientName.trim()) {
      notify.error('Patient name is required');
      return;
    }
    if (!invoiceItems || invoiceItems.length === 0) {
      notify.error('Please add at least one line item to the invoice.');
      return;
    }

    const { subtotal, totalTax, netTotal } = invoiceCalculations;
    const hasTaxable = invoiceItems.some(it => it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0);
    const overallTaxType = hasTaxable ? 'TAXABLE_GOODS' : 'HEALTHCARE_EXEMPT';
    const mainService = invoiceItems.length === 1
      ? invoiceItems[0].service
      : `${invoiceItems[0].service} (+${invoiceItems.length - 1} more items)`;

    const nextIdNumber = invoices.length + 82;

    const normalizedItems = invoiceItems.map(it => ({
      service: it.service,
      serviceCode: it.serviceCode || (it.serialNo ? 'RP-CLN-HAF' : 'SVC-CLINICAL'),
      hsnSac: it.hsnSac || (it.taxType === 'TAXABLE_GOODS' ? '90214090' : '999312'),
      discipline: it.service && (it.service.includes('Audiometry') || it.service.includes('Hearing')) ? 'Audiology' : 'Speech-Language',
      baseRate: parseFloat(it.baseRate) || 0,
      rate: parseFloat(it.baseRate) || 0,
      qty: parseInt(it.qty, 10) || 1,
      amount: (parseFloat(it.baseRate) || 0) * (parseInt(it.qty, 10) || 1),
      taxRate: it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0 ? `${it.gstPercent || 18}.00%` : '0.00% (Exempt)',
      taxAmount: it.taxAmount || 0,
      totalAmount: it.totalAmount || ((parseFloat(it.baseRate) || 0) * (parseInt(it.qty, 10) || 1)),
      serialNo: it.serialNo || '',
      ear: it.ear || 'Right Ear',
      brand: it.brand || '',
      model: it.model || '',
    }));

    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNo: `INV-2026-00${nextIdNumber}`,
      date: new Date().toISOString().substring(0, 10),
      uhid: newUhid.trim() || `VN-26-00${nextIdNumber}`,
      patientName: newPatientName.trim(),
      phone: newPhone.trim() || '+91 98220 00000',
      service: mainService,
      serviceCode: invoiceItems[0]?.serviceCode || (hasTaxable ? 'INV-HA-GOODS' : 'SVC-HEALTHCARE'),
      hsnSac: invoiceItems[0]?.hsnSac || (hasTaxable ? '90214090' : '999312'),
      taxType: overallTaxType,
      amount: subtotal,
      gstPercent: hasTaxable ? 18 : 0,
      taxAmount: totalTax,
      totalAmount: netTotal,
      items: normalizedItems,
      paymentMode: newPaymentMode,
      upiRef: newPaymentMode === 'UPI' ? `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}` : '-',
      status: 'PAID',
      receiptNo: `REC-2026-00${nextIdNumber}`,
    };

    const updated = [newInv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('vaani_invoices_v1', JSON.stringify(updated));
    localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify(updated));

    // Automatically sync hearing aid devices to clinic inventory & patient profile
    syncDispensedHearingAids(newInv, invoiceItems);

    setIsInvoiceModalOpen(false);
    notify.success(`Invoice ${newInv.invoiceNo} with ${invoiceItems.length} line item(s) created successfully!`);

    // Reset Form
    setSelectedPatientRecord(null);
    setPatientSearchQuery('');
    setIsPatientDropdownOpen(false);
    setNewPatientName('');
    setNewUhid('');
    setNewPhone('');
    setInvoiceItems([
      {
        id: 'item_1',
        service: 'Pure Tone Audiometry (PTA)',
        serviceCode: 'SVC-AUD-001',
        hsnSac: '999312',
        taxType: 'HEALTHCARE_EXEMPT',
        gstPercent: 0,
        baseRate: 800,
        qty: 1,
        taxAmount: 0,
        totalAmount: 800,
        serialNo: '',
        ear: 'Right Ear',
        brand: '',
        model: '',
      }
    ]);
  };

  // Open Dynamic UPI Modal
  const openUpiForInvoice = (inv) => {
    setActiveInvoiceForUpi(inv);
    setIsUpiModalOpen(true);
  };

  // 1. See / Open Invoice Details
  const handleOpenInvoice = (inv) => {
    setSelectedInvoiceForView(inv);
    setIsViewInvoiceModalOpen(true);
  };

  // 2. Download / Print Invoice
  const handleDownloadInvoice = (inv) => {
    setSelectedInvoiceForView(inv);
    notify.info(`Generating official A4 Tax Invoice for ${inv.invoiceNo}...`);
    printClinicalInvoice(inv);
  };

  // 3. Edit Invoice (With Full Multi-Item Products Support)
  const handleStartEditInvoice = (inv) => {
    refreshInStockDevices();
    setEditingInvoice({ ...inv });

    const initialItems = Array.isArray(inv.items) && inv.items.length > 0
      ? inv.items.map((it, idx) => ({
          id: it.id || `edit_item_${idx}_${Date.now()}`,
          service: it.service || inv.service || 'Clinical Service',
          serviceCode: it.serviceCode || inv.serviceCode || 'SVC-CLINICAL',
          hsnSac: it.hsnSac || inv.hsnSac || '999312',
          taxType: it.taxType || (it.taxRate?.includes('18') ? 'TAXABLE_GOODS' : inv.taxType || 'HEALTHCARE_EXEMPT'),
          gstPercent: it.gstPercent !== undefined ? it.gstPercent : (it.taxRate?.includes('18') ? 18 : inv.gstPercent || 0),
          baseRate: it.baseRate !== undefined ? it.baseRate : (it.rate !== undefined ? it.rate : (it.amount || 0)),
          qty: parseInt(it.qty, 10) || 1,
          taxAmount: it.taxAmount || 0,
          totalAmount: it.totalAmount || ((parseFloat(it.baseRate || it.rate || it.amount || 0)) * (parseInt(it.qty, 10) || 1) + (it.taxAmount || 0)),
          serialNo: isHearingAidItem(it) ? (it.serialNo || inv.serialNo || '') : '',
          ear: isHearingAidItem(it) ? (it.ear || inv.ear || 'Right Ear') : '',
          brand: it.brand || '',
          model: it.model || '',
        }))
      : [{
          id: `edit_item_${Date.now()}`,
          service: inv.service || 'Pure Tone Audiometry (PTA)',
          serviceCode: inv.serviceCode || 'SVC-AUD-001',
          hsnSac: inv.hsnSac || '999312',
          taxType: inv.taxType || 'HEALTHCARE_EXEMPT',
          gstPercent: inv.gstPercent || 0,
          baseRate: inv.amount || 800,
          qty: 1,
          taxAmount: inv.taxAmount || 0,
          totalAmount: inv.totalAmount || inv.amount || 800,
          serialNo: isHearingAidItem(inv) ? (inv.serialNo || '') : '',
          ear: isHearingAidItem(inv) ? (inv.ear || 'Right Ear') : '',
          brand: '',
          model: '',
        }];

    setEditInvoiceItems(initialItems);
    setIsEditInvoiceModalOpen(true);
  };

  const handleSaveEditedInvoice = (e) => {
    e.preventDefault();
    if (!editingInvoice) return;
    if (!editInvoiceItems || editInvoiceItems.length === 0) {
      notify.error('Please keep at least one line item on the invoice.');
      return;
    }

    const { subtotal, totalTax, netTotal } = editInvoiceCalculations;
    const hasTaxable = editInvoiceItems.some(it => it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0);
    const overallTaxType = hasTaxable ? 'TAXABLE_GOODS' : 'HEALTHCARE_EXEMPT';
    const mainService = editInvoiceItems.length === 1
      ? editInvoiceItems[0].service
      : `${editInvoiceItems[0].service} (+${editInvoiceItems.length - 1} more items)`;

    const normalizedItems = editInvoiceItems.map(it => ({
      service: it.service,
      serviceCode: it.serviceCode || (it.serialNo ? 'RP-CLN-HAF' : 'SVC-CLINICAL'),
      hsnSac: it.hsnSac || (it.taxType === 'TAXABLE_GOODS' ? '90214090' : '999312'),
      discipline: it.service && (it.service.includes('Audiometry') || it.service.includes('Hearing')) ? 'Audiology' : 'Speech-Language',
      baseRate: parseFloat(it.baseRate) || 0,
      rate: parseFloat(it.baseRate) || 0,
      qty: parseInt(it.qty, 10) || 1,
      amount: (parseFloat(it.baseRate) || 0) * (parseInt(it.qty, 10) || 1),
      taxRate: it.taxType === 'TAXABLE_GOODS' || it.gstPercent > 0 ? `${it.gstPercent || 18}.00%` : '0.00% (Exempt)',
      taxAmount: it.taxAmount || 0,
      totalAmount: it.totalAmount || ((parseFloat(it.baseRate) || 0) * (parseInt(it.qty, 10) || 1)),
      serialNo: it.serialNo || '',
      ear: it.ear || 'Right Ear',
      brand: it.brand || '',
      model: it.model || '',
    }));

    const updatedInv = {
      ...editingInvoice,
      service: mainService,
      amount: subtotal,
      gstPercent: hasTaxable ? 18 : 0,
      taxAmount: totalTax,
      totalAmount: netTotal,
      taxType: overallTaxType,
      items: normalizedItems,
    };

    const updated = invoices.map(i => i.id === updatedInv.id ? updatedInv : i);
    setInvoices(updated);
    localStorage.setItem('vaani_invoices_v1', JSON.stringify(updated));
    localStorage.setItem('vaani_billing_invoices_v1', JSON.stringify(updated));

    // Automatically sync hearing aid devices to clinic inventory & patient profile
    syncDispensedHearingAids(updatedInv, editInvoiceItems);

    setIsEditInvoiceModalOpen(false);
    if (selectedInvoiceForView?.id === updatedInv.id) {
      setSelectedInvoiceForView(updatedInv);
    }
    notify.success(`Invoice ${updatedInv.invoiceNo} with ${editInvoiceItems.length} line item(s) updated successfully!`);
  };

  // 4. Delete Invoice
  const handlePromptDelete = (inv) => {
    setInvoiceToDelete(inv);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!invoiceToDelete) return;
    const updated = invoices.filter(i => i.id !== invoiceToDelete.id);
    setInvoices(updated);
    localStorage.setItem('vaani_invoices_v1', JSON.stringify(updated));
    setIsDeleteModalOpen(false);
    if (selectedInvoiceForView?.id === invoiceToDelete.id) {
      setIsViewInvoiceModalOpen(false);
    }
    notify.success(`Invoice ${invoiceToDelete.invoiceNo} deleted from registry`);
    setInvoiceToDelete(null);
  };

  // 5. Share on WhatsApp (Opens Reusable Preview Modal)
  const handleOpenWhatsAppModal = (inv) => {
    setSelectedInvoiceForWhatsApp(inv);
    setIsWhatsAppModalOpen(true);
  };

  const getInvoiceWhatsAppMessage = (inv) => {
    if (!inv) return '';
    return `*VAANI SPEECH & HEARING CLINIC*\n*Official Tax Invoice & Clinical Receipt*\n\n` +
      `*Patient Name:* ${inv.patientName}\n` +
      `*UHID:* ${inv.uhid || 'Outpatient'}\n` +
      `*Invoice No:* ${inv.invoiceNo}\n` +
      `*Date:* ${inv.date}\n` +
      `*Clinical Service:* ${inv.service}\n` +
      `*Tax Regime:* ${inv.taxType === 'HEALTHCARE_EXEMPT' ? '0% GST (Healthcare Exempt, SAC 999312)' : '18% GST (Taxable Goods, HSN 9021)'}\n` +
      `*Total Amount:* ₹${Number(inv.totalAmount || 0).toLocaleString('en-IN')}\n` +
      `*Payment Status:* ${inv.status} (${inv.paymentMode})\n` +
      (inv.status === 'PAID' ? `*Payment Receipt:* ${inv.receiptNo || 'Verified'}\n` : `*Payment VPA / UPI:* vaaniclinic@okaxis\n`) +
      `\n*Clinic Address:* Sadashiv Peth, Near Powai Naka, Satara - 415002\n` +
      `*Helpline / WhatsApp:* +91 98220 12345\n` +
      `*Clinical Consultant:* Dr. Palak Paresh Gandhi, MASLP (RCI CRR No. A79214)\n\n` +
      `Thank you for entrusting VAANI Speech & Hearing Clinic for your healthcare.`;
  };

  // 6. Mail Invoice (Opens Reusable Email Modal)
  const handleOpenMailModal = (inv) => {
    setSelectedInvoiceForMail(inv);
    setIsMailModalOpen(true);
  };

  // Totals calculations
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPending = invoices.filter(i => i.status === 'DUE').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION & STAT BAR (COMPACT EXCEL DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Module Title & Revenue Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <IndianRupee className="w-3.5 h-3.5 text-purple-700" />
            <span>Billing, Invoices &amp; Tax Ledger</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Collected:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>

            {totalPending > 0 && (
              <>
                <span className="text-xs font-semibold text-slate-500">Due:</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                  ₹{totalPending.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions with Keyboard Shortcut Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-8 sm:h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Export filtered records to CSV (Alt + E / ⌥E)"
          >
            <Download className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-slate-500" />
            <span>Export CSV</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+E / ⌥E]</kbd>
          </button>

          <button
            type="button"
            onClick={handleOpenNewInvoiceModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-8 sm:h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Create new GST tax invoice (Alt + N / ⌥N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Invoice</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N / ⌥N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR (EXCEL TOOLBAR DENSITY) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full sm:w-auto">
          {/* Multi-field search */}
          <div className="relative flex items-center w-full sm:max-w-xs md:max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search invoice #, UHID, patient, phone..."
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
                className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid In Full</option>
              <option value="DUE">Outstanding Due</option>
            </select>

            {/* Tax Classification Filter */}
            <select
              value={taxFilter}
              onChange={(e) => {
                setTaxFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="ALL">All Tax Treatments</option>
              <option value="HEALTHCARE_EXEMPT">0% Healthcare Exempt (Notification 12/2017)</option>
              <option value="TAXABLE_GOODS">18% GST (Hearing Aids &amp; Accessories)</option>
            </select>

            {/* Date Filter */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1 sm:flex-initial">
              <select
                value={dateFilterPreset}
                onChange={(e) => {
                  setDateFilterPreset(e.target.value);
                  setPage(1);
                }}
                className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full sm:w-auto"
              >
                <option value="ALL">📅 All Dates</option>
                <option value="TODAY">Today</option>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="CUSTOM">Custom Range...</option>
              </select>

              {dateFilterPreset === 'CUSTOM' && (
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-1.5 h-8 sm:h-7">
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => {
                      setStartDateFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-[11px] text-slate-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">to</span>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => {
                      setEndDateFilter(e.target.value);
                      setPage(1);
                    }}
                    className="text-[11px] text-slate-700 focus:outline-none"
                  />
                  {(startDateFilter || endDateFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDateFilter('');
                        setEndDateFilter('');
                        setPage(1);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-xs px-0.5"
                      title="Clear dates"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 text-xs text-slate-600 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200">
          <span className="text-[11px] font-medium">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-7 sm:h-6 px-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* ── EXCEL-STYLE COMPACT DATA GRID TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse" {...tableContainerProps}>
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('invoiceNo')}
                  className="py-2 px-3 w-32 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Invoice #</span>
                    {sortField === 'invoiceNo' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="py-2 px-2.5 w-24 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Date</span>
                    {sortField === 'date' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('uhid')}
                  className="py-2 px-2.5 w-28 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>UHID</span>
                    {sortField === 'uhid' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patientName')}
                  className="py-2 px-3 w-44 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Patient Name</span>
                    {sortField === 'patientName' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-3">Service / Description</th>
                <th className="py-2 px-2.5 w-32 text-center">Tax Regime</th>
                <th
                  onClick={() => handleSort('totalAmount')}
                  className="py-2 px-3 w-28 text-right cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total (₹)</span>
                    {sortField === 'totalAmount' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-2.5 w-20 text-center">Mode</th>
                <th className="py-2 px-2 w-20 text-center">Status</th>
                <th className="py-2 px-3 w-52 text-center whitespace-nowrap">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                    No matching billing invoices found.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv, idx) => {
                  const rowProps = getRowProps(idx);
                  return (
                    <tr key={inv.id} {...rowProps}>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-slate-600">
                        {inv.date}
                      </td>
                      <td className="py-1.5 px-2.5 font-mono text-purple-900 font-semibold">
                        {inv.uhid}
                      </td>
                      <td className="py-1.5 px-3 font-semibold text-slate-800">
                        {inv.patientName}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700 truncate max-w-xs">
                        {inv.service}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          inv.taxType === 'HEALTHCARE_EXEMPT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {inv.taxType === 'HEALTHCARE_EXEMPT' ? '0% Exempt (Hosp)' : '18% GST (Goods)'}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span className="text-[10px] font-mono font-semibold px-1 py-0.2 rounded bg-slate-100 text-slate-700">
                          {inv.paymentMode}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* 1. See / Open */}
                          <button
                            type="button"
                            onClick={() => handleOpenInvoice(inv)}
                            {...getButtonProps(idx, 0)}
                            className={`p-1 rounded text-[#301444] hover:bg-purple-100 transition-colors cursor-pointer ${getButtonProps(idx, 0).className}`}
                            title="See / Open Tax Invoice & Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Download / Print */}
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(inv)}
                            {...getButtonProps(idx, 1)}
                            className={`p-1 rounded text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${getButtonProps(idx, 1).className}`}
                            title="Download / Print Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Edit */}
                          <button
                            type="button"
                            onClick={() => handleStartEditInvoice(inv)}
                            {...getButtonProps(idx, 2)}
                            className={`p-1 rounded text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer ${getButtonProps(idx, 2).className}`}
                            title="Edit Invoice Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Share on WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsAppModal(inv)}
                            {...getButtonProps(idx, 3)}
                            className={`p-1 rounded text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer ${getButtonProps(idx, 3).className}`}
                            title="Share Invoice on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Mail Invoice */}
                          <button
                            type="button"
                            onClick={() => handleOpenMailModal(inv)}
                            {...getButtonProps(idx, 4)}
                            className={`p-1 rounded text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer ${getButtonProps(idx, 4).className}`}
                            title="Email Invoice to Patient"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {/* UPI QR */}
                          <button
                            type="button"
                            onClick={() => openUpiForInvoice(inv)}
                            {...getButtonProps(idx, 5)}
                            className={`p-1 rounded text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer ${getButtonProps(idx, 5).className}`}
                            title="Generate Dynamic UPI QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {/* 6. Delete */}
                          <button
                            type="button"
                            onClick={() => handlePromptDelete(inv)}
                            {...getButtonProps(idx, 6)}
                            className={`p-1 rounded text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer ${getButtonProps(idx, 6).className}`}
                            title="Delete Invoice"
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

        {/* ── COMPACT SPREADSHEET PAGINATION FOOTER ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> invoice records
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
      </div>

      {/* ── MODAL: CREATE GST TAX INVOICE ── */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Tax Invoice / Clinical Receipt"
        size="xl"
      >
        <form ref={invoiceFormRef} onSubmit={handleCreateInvoice} className="space-y-4 font-sans text-xs">
          {/* ── PATIENT SEARCH & AUTO-POPULATE COMBOBOX ── */}
          <div className="space-y-1.5" ref={patientDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-700" />
                <span>Search &amp; Select Existing Patient (Auto-populate Info)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Search by Name, UHID, or Mobile
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Type patient name, UHID (e.g. VN-26-0001), or phone number..."
                value={patientSearchQuery}
                onChange={(e) => {
                  setPatientSearchQuery(e.target.value);
                  setIsPatientDropdownOpen(true);
                }}
                onFocus={() => setIsPatientDropdownOpen(true)}
                className="h-9 w-full pl-9 pr-9 text-xs font-medium bg-purple-50/50 border border-purple-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 shadow-2xs"
              />
              {patientSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearchQuery('');
                    setIsPatientDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown List */}
              {isPatientDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between sticky top-0 z-10">
                    <span>Registered Patients ({matchedPatients.length} found)</span>
                    <span className="text-[10px] text-purple-800 font-semibold">Click to select &amp; auto-fill</span>
                  </div>
                  {matchedPatients.length > 0 ? (
                    matchedPatients.map((p) => (
                      <div
                        key={p.id || p.uhid}
                        onClick={() => handleSelectPatientForInvoice(p)}
                        className="p-3 hover:bg-purple-50/80 cursor-pointer flex items-center justify-between transition-colors gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">{p.full_name}</span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-900 rounded border border-purple-200">
                              {p.uhid}
                            </span>
                            {p.gender && (
                              <span className="text-[10px] text-slate-500">
                                {p.gender}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-medium text-slate-700">{p.phone}</span>
                            {p.city && <span>• {p.city}</span>}
                            {p.service_line && (
                              <span className="text-purple-800 font-semibold">• {p.service_line}</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 text-[11px] font-bold px-3 py-1 rounded bg-[#301444] text-white hover:bg-purple-950 transition-colors shadow-2xs pointer-events-none"
                        >
                          Select
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 text-center text-xs text-slate-500 space-y-1">
                      <p>No registered patient matching &quot;{patientSearchQuery}&quot;</p>
                      <p className="text-[11px] text-slate-400">
                        You can still manually type the details below for walk-in patients.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Patient Confirmation Banner */}
            {selectedPatientRecord && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Linked Patient: <strong>{selectedPatientRecord.full_name}</strong> (<strong className="font-mono">{selectedPatientRecord.uhid}</strong>) • {selectedPatientRecord.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelectedPatient}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer shrink-0"
                >
                  Clear / Change
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Patient UHID (Optional)</label>
              <input
                type="text"
                placeholder="VN-26-0082"
                value={newUhid}
                onChange={(e) => {
                  setNewUhid(e.target.value);
                  if (selectedPatientRecord && e.target.value !== selectedPatientRecord.uhid) {
                    setSelectedPatientRecord(null);
                  }
                }}
                className="h-8.5 w-full px-2.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Shinde"
                value={newPatientName}
                onChange={(e) => {
                  setNewPatientName(e.target.value);
                  if (selectedPatientRecord && e.target.value !== selectedPatientRecord.full_name) {
                    setSelectedPatientRecord(null);
                  }
                }}
                className="h-8.5 w-full px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone (WhatsApp / SMS)</label>
              <input
                type="text"
                placeholder="+91 98220 11223"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="h-8.5 w-full px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* ── MULTI-ITEM CLINICAL SERVICES & PRODUCTS GRID ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-700" />
                <span>Clinical Services, Investigations &amp; Products ({invoiceItems.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="h-6.5 px-3 rounded-md bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold text-[11px] flex items-center gap-1 border border-purple-200 cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-purple-700" />
                <span>Add Line Item</span>
              </button>
            </div>

            {/* Line Items Table with Generous Professional Widths */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[760px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[280px]">Service / Product Description</th>
                      <th className="py-2.5 px-2.5 w-24 text-center">SAC/HSN</th>
                      <th className="py-2.5 px-2.5 w-24 text-right">Fee (₹)</th>
                      <th className="py-2.5 px-2 w-16 text-center">Qty</th>
                      <th className="py-2.5 px-2.5 w-32 text-left">GST Regime</th>
                      <th className="py-2.5 px-3 w-28 text-right">Total (₹)</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {invoiceItems.map((item, idx) => (
                      <tr key={item.id || idx} className="bg-white hover:bg-purple-50/20 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 align-middle">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 space-y-1.5 align-middle">
                          <select
                            value={item.service}
                            onChange={(e) => handleUpdateItemRow(idx, 'service', e.target.value)}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md font-semibold text-slate-800 focus:border-purple-600 focus:outline-none cursor-pointer shadow-2xs"
                          >
                            {serviceRates.map((s) => (
                              <option key={s.id || s.code} value={s.name}>
                                {s.name} — ₹{s.baseRate} ({s.taxType === 'TAXABLE_GOODS' ? '18% GST' : '0% Exempt'})
                              </option>
                            ))}
                          </select>

                          {/* Hearing Aid Serial & Ear Integration (Only for actual hearing aid instruments) */}
                          {isHearingAidItem(item) ? (
                            <div className="p-2 rounded-md bg-purple-50/70 border border-purple-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-purple-600" />
                                  <span>Hearing Aid Instrument Linking</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateItemRow(idx, 'isCustomHearingAid', false)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer font-bold px-1"
                                  title="Hide device linking"
                                >
                                  ✕
                                </button>
                              </div>
                              {inStockDevices.length > 0 && (
                                <div>
                                  <select
                                    value={item.serialNo || ''}
                                    onChange={(e) => handleUpdateItemRow(idx, 'selectedDeviceSerial', e.target.value)}
                                    className="w-full h-7 px-2 text-xs bg-white border border-purple-300 rounded-md text-purple-950 font-semibold focus:border-purple-600 cursor-pointer shadow-2xs"
                                  >
                                    <option value="">— Link In-Stock Clinic Device (Optional) —</option>
                                    {inStockDevices.map((d) => (
                                      <option key={d.serialNo} value={d.serialNo}>
                                        {d.model} ({d.brand}) • SN: {d.serialNo} • ₹{d.mrp}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Device Serial Number (from Barcode / Box)"
                                  value={item.serialNo || ''}
                                  onChange={(e) => handleUpdateItemRow(idx, 'serialNo', e.target.value)}
                                  className="flex-1 h-7 px-2 text-xs font-mono font-bold bg-white border border-purple-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-2xs"
                                />
                                <select
                                  value={item.ear || 'Right Ear'}
                                  onChange={(e) => handleUpdateItemRow(idx, 'ear', e.target.value)}
                                  className="h-7 px-2 text-xs font-semibold bg-white border border-purple-300 rounded-md text-slate-700 cursor-pointer shadow-2xs"
                                >
                                  <option value="Right Ear">Right Ear</option>
                                  <option value="Left Ear">Left Ear</option>
                                  <option value="Bilateral">Bilateral</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateItemRow(idx, 'isCustomHearingAid', true)}
                                className="text-[10.5px] text-purple-700 hover:text-purple-900 hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                                title="Click to link a hearing aid device serial number & ear side to this line item"
                              >
                                <span>+ Link Hearing Aid Device Serial &amp; Ear</span>
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 text-center align-middle">
                          <input
                            type="text"
                            value={item.hsnSac || ''}
                            placeholder="999312"
                            onChange={(e) => handleUpdateItemRow(idx, 'hsnSac', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-mono font-semibold text-center bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none text-slate-700 shadow-2xs"
                          />
                        </td>
                        <td className="py-2.5 px-2.5 text-right align-middle">
                          <input
                            type="number"
                            min="0"
                            value={item.baseRate}
                            onChange={(e) => handleUpdateItemRow(idx, 'baseRate', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-mono font-bold text-right bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none text-slate-800 shadow-2xs"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-center align-middle">
                          <input
                            type="number"
                            min="1"
                            value={item.qty || 1}
                            onChange={(e) => handleUpdateItemRow(idx, 'qty', e.target.value)}
                            className="w-full h-8 px-1.5 text-xs font-mono font-bold text-center bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none text-slate-800 shadow-2xs"
                          />
                        </td>
                        <td className="py-2.5 px-2.5 align-middle">
                          <select
                            value={item.taxType}
                            onChange={(e) => handleUpdateItemRow(idx, 'taxType', e.target.value)}
                            className="w-full h-8 px-2 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none cursor-pointer shadow-2xs"
                          >
                            <option value="HEALTHCARE_EXEMPT">0% Exempt</option>
                            <option value="TAXABLE_GOODS">18% GST</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-xs align-middle">
                          ₹{item.totalAmount?.toLocaleString('en-IN') || 0}
                        </td>
                        <td className="py-2.5 px-2 text-center align-middle">
                          {invoiceItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">Payment Settlement Mode</label>
              <select
                value={newPaymentMode}
                onChange={(e) => setNewPaymentMode(e.target.value)}
                className="h-8.5 w-full px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="UPI">NPCI UPI</option>
                <option value="CASH">Cash Settlement</option>
                <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                <option value="CARD">Debit / Credit Card</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Direct settlement under NPCI UPI / Statutory Healthcare Accounts.
              </p>
            </div>

            {/* Calculations Summary Card */}
            <div className="p-3.5 rounded-lg bg-purple-50/80 border border-purple-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Base Fee:</span>
                <span className="font-mono font-bold text-slate-900">₹{invoiceCalculations.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST Applied:</span>
                <span className="font-mono font-bold text-slate-900">₹{invoiceCalculations.totalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-purple-950 border-t border-purple-200/80 pt-1.5">
                <span>NET TOTAL PAYABLE:</span>
                <span className="font-mono text-sm font-black text-purple-950">₹{invoiceCalculations.netTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span>Submit:</span>
              <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                Ctrl+↵
              </span>
              <span className="text-slate-400">or</span>
              <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                ⌘↵ (Mac)
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel <span className="opacity-60 text-[10px] font-mono">[Esc]</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-sm transition-all cursor-pointer"
              >
                <span>Issue &amp; Save Invoice</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/25">
                  <span>Ctrl+↵</span>
                  <span className="opacity-60">/</span>
                  <span>⌘↵</span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: DYNAMIC NPCI UPI QR PAYLOAD ── */}
      <Modal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        title="NPCI Dynamic UPI QR Payment"
        size="sm"
      >
        {activeInvoiceForUpi && (
          <div className="flex flex-col items-center text-center space-y-3 font-sans py-2">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <QrCode className="w-36 h-36 text-[#301444]" />
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium">Scan with Google Pay, PhonePe, Paytm, or BHIM</span>
              <h3 className="text-lg font-mono font-extrabold text-[#301444] mt-0.5">
                ₹{activeInvoiceForUpi.totalAmount.toLocaleString('en-IN')}
              </h3>
            </div>

            <div className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Payee VPA:</span>
                <span className="font-mono font-bold text-purple-900">vaaniclinic@okaxis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{activeInvoiceForUpi.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-800">{activeInvoiceForUpi.patientName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                notify.success(`Payment verified for ${activeInvoiceForUpi.invoiceNo}`);
                setIsUpiModalOpen(false);
              }}
              className="w-full h-8 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Payment Settlement</span>
            </button>
          </div>
        )}
      </Modal>

      {/* ── MODAL: VIEW / OPEN TAX INVOICE & RECEIPT ── */}
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
                  onClick={() => handleDownloadInvoice(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-purple-950 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppModal(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenMailModal(selectedInvoiceForView)}
                  className="h-7.5 px-3 rounded text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartEditInvoice(selectedInvoiceForView)}
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
            {/* Compact Master Excel-Style Invoice Container */}
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
              {/* Top Purple Decorative Strip */}
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

              {/* Sub-header Bar: Document Title & Payment Status */}
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

              {/* Two-Column Metadata Box */}
              <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-white">
                <div className="p-2.5">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Billed To (Patient Information)
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900 text-xs">{selectedInvoiceForView.patientName}</span>
                    <span className="font-mono text-[10px] font-bold text-purple-900">
                      UHID: {selectedInvoiceForView.uhid || 'Outpatient'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>Phone: {selectedInvoiceForView.phone || '+91 98220 00000'}</span>
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

              {/* Itemized Charges Master Grid (Excel Table) */}
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
                  {(Array.isArray(selectedInvoiceForView.items) && selectedInvoiceForView.items.length > 0
                    ? selectedInvoiceForView.items
                    : [
                        {
                          service: selectedInvoiceForView.service,
                          serviceCode: selectedInvoiceForView.serviceCode || 'SVC-CLINICAL',
                          hsnSac: selectedInvoiceForView.hsnSac || (selectedInvoiceForView.taxType === 'TAXABLE_GOODS' ? '9021' : '999312'),
                          discipline: selectedInvoiceForView.service?.includes('Audiometry') || selectedInvoiceForView.service?.includes('Hearing') ? 'Audiology' : 'Speech-Language',
                          amount: selectedInvoiceForView.amount,
                          taxRate: selectedInvoiceForView.taxType === 'HEALTHCARE_EXEMPT' ? '0% (Exempt)' : '18% GST',
                          totalAmount: selectedInvoiceForView.totalAmount,
                        }
                      ]
                  ).map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-300 bg-white">
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700 border-r border-slate-300">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-300">
                        <span className="font-bold text-slate-900 block text-xs">{it.service}</span>
                        <span className="text-[9.5px] font-mono text-purple-800">
                          Code: {it.serviceCode || 'SVC-CLINICAL'} {it.qty && it.qty > 1 ? `• Qty: ${it.qty}` : ''} • ANSI / ISO Protocol
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-slate-600 border-r border-slate-300">
                        {it.hsnSac || (selectedInvoiceForView.taxType === 'TAXABLE_GOODS' ? '9021' : '999312')}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-300 text-[10px]">
                        {it.discipline || (it.service?.includes('Audiometry') || it.service?.includes('Hearing') ? 'Audiology' : 'Speech-Language')}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-semibold text-slate-800 border-r border-slate-300">
                        ₹{Number(it.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 text-slate-700">
                          {it.taxRate || (selectedInvoiceForView.taxType === 'HEALTHCARE_EXEMPT' ? '0% (Exempt)' : '18% GST')}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                        ₹{Number(it.totalAmount || it.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Subtotal & Amount in Words Grid Row */}
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
                    <span>GST Applied ({selectedInvoiceForView.taxType === 'HEALTHCARE_EXEMPT' ? '0%' : '18%'}):</span>
                    <span className="font-mono font-semibold">₹{Number(selectedInvoiceForView.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 px-3 bg-purple-50/70 border-t border-purple-200 text-[#301444] font-extrabold text-xs">
                    <span>NET TOTAL PAYABLE:</span>
                    <span className="font-mono text-sm">₹{Number(selectedInvoiceForView.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Settlement & Clinician Authorization Row */}
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

              {/* Bottom Statutory Notice */}
              <div className="px-3 py-1 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[8.5px] text-slate-500">
                <span>This is an official computer-generated clinical tax invoice &amp; voucher under the Clinical Establishments Act and DPDP Act 2023.</span>
                <span className="font-mono text-[8.5px] text-slate-400">SHA256:e3089426fa...{selectedInvoiceForView.invoiceNo}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: EDIT TAX INVOICE ── */}
      <Modal
        isOpen={isEditInvoiceModalOpen}
        onClose={() => setIsEditInvoiceModalOpen(false)}
        title={editingInvoice ? `Edit Invoice: ${editingInvoice.invoiceNo}` : 'Edit Invoice'}
        size="xl"
      >
        {editingInvoice && (
          <form onSubmit={handleSaveEditedInvoice} className="space-y-4 font-sans text-xs">
            {/* Patient & Invoice Header Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Invoice #</label>
                <input
                  type="text"
                  readOnly
                  value={editingInvoice.invoiceNo}
                  className="h-8.5 w-full px-2.5 text-xs font-mono font-bold bg-slate-100 border border-slate-300 rounded-md text-slate-600 shadow-2xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Invoice Date *</label>
                <input
                  type="date"
                  required
                  value={editingInvoice.date}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, date: e.target.value })}
                  className="h-8.5 w-full px-2.5 text-xs font-mono font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient UHID</label>
                <input
                  type="text"
                  value={editingInvoice.uhid}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, uhid: e.target.value })}
                  className="h-8.5 w-full px-2.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingInvoice.patientName}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, patientName: e.target.value })}
                  className="h-8.5 w-full px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingInvoice.phone || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, phone: e.target.value })}
                  className="h-8.5 w-full px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* ── MULTI-ITEM PRODUCTS / SERVICES REGISTER (EDIT MODAL) ── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-700" />
                  <span>Clinical Services, Investigations &amp; Products ({editInvoiceItems.length})</span>
                </label>
                <button
                  type="button"
                  onClick={handleEditAddItemRow}
                  className="h-6.5 px-3 rounded-md bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold text-[11px] flex items-center gap-1 border border-purple-200 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-700" />
                  <span>Add Line Item</span>
                </button>
              </div>

              {/* Line Items Table with Generous Professional Widths */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[280px]">Service / Product Description</th>
                        <th className="py-2.5 px-2.5 w-24 text-center">SAC/HSN</th>
                        <th className="py-2.5 px-2.5 w-24 text-right">Fee (₹)</th>
                        <th className="py-2.5 px-2 w-16 text-center">Qty</th>
                        <th className="py-2.5 px-2.5 w-32 text-left">GST Regime</th>
                        <th className="py-2.5 px-3 w-28 text-right">Total (₹)</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      {editInvoiceItems.map((item, idx) => (
                        <tr key={item.id || idx} className="bg-white hover:bg-purple-50/20 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 align-middle">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 space-y-1.5 align-middle">
                            <select
                              value={item.service}
                              onChange={(e) => handleEditUpdateItemRow(idx, 'service', e.target.value)}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md font-semibold text-slate-800 focus:border-purple-600 focus:outline-none cursor-pointer shadow-2xs"
                            >
                              {serviceRates.map((s) => (
                                <option key={s.id || s.code} value={s.name}>
                                  {s.name} — ₹{s.baseRate} ({s.taxType === 'TAXABLE_GOODS' ? '18% GST' : '0% Exempt'})
                                </option>
                              ))}
                            </select>

                            {/* Hearing Aid Serial & Ear Integration (Only for actual hearing aid instruments) */}
                            {isHearingAidItem(item) ? (
                              <div className="p-2 rounded-md bg-purple-50/70 border border-purple-200 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                    <span>Hearing Aid Instrument Linking</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleEditUpdateItemRow(idx, 'isCustomHearingAid', false)}
                                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer font-bold px-1"
                                    title="Hide device linking"
                                  >
                                    ✕
                                  </button>
                                </div>
                                {inStockDevices.length > 0 && (
                                  <div>
                                    <select
                                      value={item.serialNo || ''}
                                      onChange={(e) => handleEditUpdateItemRow(idx, 'selectedDeviceSerial', e.target.value)}
                                      className="w-full h-7 px-2 text-[11px] bg-white border border-purple-300 rounded-md text-purple-950 font-semibold focus:border-purple-600 cursor-pointer shadow-2xs"
                                    >
                                      <option value="">— Link In-Stock Clinic Device (Optional) —</option>
                                      {inStockDevices.map((d) => (
                                        <option key={d.serialNo} value={d.serialNo}>
                                          {d.model} ({d.brand}) • SN: {d.serialNo} • ₹{d.mrp}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Device Serial Number (from Barcode / Box)"
                                    value={item.serialNo || ''}
                                    onChange={(e) => handleEditUpdateItemRow(idx, 'serialNo', e.target.value)}
                                    className="flex-1 h-7 px-2 text-[11px] font-mono font-bold bg-white border border-purple-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                  <select
                                    value={item.ear || 'Right Ear'}
                                    onChange={(e) => handleEditUpdateItemRow(idx, 'ear', e.target.value)}
                                    className="h-7 px-2 text-[11px] font-semibold bg-white border border-purple-300 rounded-md text-slate-700 cursor-pointer shadow-2xs"
                                  >
                                    <option value="Right Ear">Right Ear</option>
                                    <option value="Left Ear">Left Ear</option>
                                    <option value="Bilateral">Bilateral</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleEditUpdateItemRow(idx, 'isCustomHearingAid', true)}
                                  className="text-[10px] text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                                  title="Click to link a hearing aid device serial number & ear side to this line item"
                                >
                                  <span>+ Link Hearing Aid Device Serial &amp; Ear</span>
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5 text-center align-middle">
                            <input
                              type="text"
                              value={item.hsnSac || ''}
                              placeholder="999312"
                              onChange={(e) => handleEditUpdateItemRow(idx, 'hsnSac', e.target.value)}
                              className="w-full h-8 px-2 text-xs font-mono text-center bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                            />
                          </td>
                          <td className="py-2.5 px-2.5 text-right align-middle">
                            <input
                              type="number"
                              min="0"
                              value={item.baseRate}
                              onChange={(e) => handleEditUpdateItemRow(idx, 'baseRate', e.target.value)}
                              className="w-full h-8 px-2 text-xs text-right font-mono font-bold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-center align-middle">
                            <input
                              type="number"
                              min="1"
                              value={item.qty || 1}
                              onChange={(e) => handleEditUpdateItemRow(idx, 'qty', e.target.value)}
                              className="w-full h-8 px-1.5 text-xs text-center font-mono font-bold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                            />
                          </td>
                          <td className="py-2.5 px-2.5 align-middle">
                            <select
                              value={item.taxType}
                              onChange={(e) => handleEditUpdateItemRow(idx, 'taxType', e.target.value)}
                              className="w-full h-8 px-2 text-[11px] font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none cursor-pointer shadow-2xs"
                            >
                              <option value="HEALTHCARE_EXEMPT">0% Exempt</option>
                              <option value="TAXABLE_GOODS">18% GST</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 align-middle">
                            ₹{item.totalAmount?.toLocaleString('en-IN') || 0}
                          </td>
                          <td className="py-2.5 px-2 text-center align-middle">
                            {editInvoiceItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleEditRemoveItemRow(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
                <select
                  value={editingInvoice.paymentMode}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, paymentMode: e.target.value })}
                  className="h-8.5 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 shadow-2xs cursor-pointer"
                >
                  <option value="UPI">NPCI UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Debit / Credit Card</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Status</label>
                <select
                  value={editingInvoice.status}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value })}
                  className="h-8.5 w-full px-2 text-xs font-bold bg-white border border-slate-300 rounded-md focus:border-purple-600 shadow-2xs cursor-pointer"
                >
                  <option value="PAID">PAID</option>
                  <option value="DUE">DUE</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Receipt #</label>
                <input
                  type="text"
                  value={editingInvoice.receiptNo || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, receiptNo: e.target.value })}
                  className="h-8.5 w-full px-2.5 text-xs font-mono font-semibold bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* Calculations Summary Card */}
            <div className="p-3.5 rounded-lg bg-purple-50/70 border border-purple-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Base Fee:</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{editInvoiceCalculations.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST Applied:</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{editInvoiceCalculations.totalTax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-xs font-black text-purple-950 border-t border-purple-200 pt-1.5">
                <span>NET TOTAL PAYABLE:</span>
                <span className="font-mono text-base font-black text-purple-950">
                  ₹{editInvoiceCalculations.netTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-sm transition-colors cursor-pointer"
              >
                Save Invoice Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── REUSABLE WHATSAPP DISPATCH MODAL ── */}
      {selectedInvoiceForWhatsApp && (
        <WhatsAppDispatchModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => {
            setIsWhatsAppModalOpen(false);
            setSelectedInvoiceForWhatsApp(null);
          }}
          recipientName={selectedInvoiceForWhatsApp.patientName}
          recipientPhone={selectedInvoiceForWhatsApp.phone || ''}
          uhid={selectedInvoiceForWhatsApp.uhid}
          attachedFile={`${selectedInvoiceForWhatsApp.invoiceNo}.pdf`}
          documentTitle={`Official Tax Invoice ${selectedInvoiceForWhatsApp.invoiceNo}`}
          defaultMessage={getInvoiceWhatsAppMessage(selectedInvoiceForWhatsApp)}
          onSuccess={({ phone }) => {
            if (phone && phone !== selectedInvoiceForWhatsApp.phone) {
              setInvoices((prev) =>
                prev.map((i) =>
                  i.id === selectedInvoiceForWhatsApp.id ? { ...i, phone } : i
                )
              );
            }
          }}
        />
      )}

      {/* ── REUSABLE EMAIL DISPATCH MODAL ── */}
      {selectedInvoiceForMail && (
        <EmailDispatchModal
          isOpen={isMailModalOpen}
          onClose={() => {
            setIsMailModalOpen(false);
            setSelectedInvoiceForMail(null);
          }}
          recipientName={selectedInvoiceForMail.patientName}
          recipientEmail={selectedInvoiceForMail.email || ''}
          uhid={selectedInvoiceForMail.uhid}
          attachedFile={`${selectedInvoiceForMail.invoiceNo}.pdf`}
          documentTitle={`Official Tax Invoice ${selectedInvoiceForMail.invoiceNo}`}
          defaultSubject={`Tax Invoice & Clinical Receipt ${selectedInvoiceForMail.invoiceNo} — VAANI Speech & Hearing Clinic`}
          defaultMessage={`Dear ${selectedInvoiceForMail.patientName},\n\nPlease find attached your official Clinical Tax Invoice & Receipt ${selectedInvoiceForMail.invoiceNo} for ${selectedInvoiceForMail.service} performed on ${selectedInvoiceForMail.date}.\n\nTotal Paid/Due: ₹${Number(selectedInvoiceForMail.totalAmount || 0).toLocaleString('en-IN')} (${selectedInvoiceForMail.status}).\n\nKind regards,\nVAANI Speech & Hearing Rehabilitation Center\nSadashiv Peth, Satara • RCI CRR No. A79214`}
          onSuccess={({ email }) => {
            if (email && email !== selectedInvoiceForMail.email) {
              setInvoices((prev) =>
                prev.map((i) =>
                  i.id === selectedInvoiceForMail.id ? { ...i, email } : i
                )
              );
            }
          }}
        />
      )}


      {/* ── MODAL: DELETE INVOICE CONFIRMATION ── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Billing Invoice Record"
        size="sm"
      >
        {invoiceToDelete && (
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Confirm Invoice Deletion</span>
              </div>
              <p className="text-xs text-rose-700">
                Are you sure you want to delete invoice <strong className="font-mono">{invoiceToDelete.invoiceNo}</strong> for <strong>{invoiceToDelete.patientName}</strong>?
              </p>
              <p className="text-[11px] text-rose-600 font-medium">
                Amount: ₹{invoiceToDelete.totalAmount?.toLocaleString('en-IN')} • Date: {invoiceToDelete.date}
              </p>
            </div>

            <p className="text-slate-500 text-[11px]">
              This action cannot be undone. The invoice and its payment records will be permanently removed from the clinical billing register.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Invoice</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default BillingPage;
