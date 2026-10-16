import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';

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
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_invoices_v1');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
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

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [activeInvoiceForUpi, setActiveInvoiceForUpi] = useState(null);

  // New Invoice Form State
  const [newUhid, setNewUhid] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newService, setNewService] = useState('Pure Tone Audiometry (PTA)');
  const [newAmount, setNewAmount] = useState(800);
  const [newTaxType, setNewTaxType] = useState('HEALTHCARE_EXEMPT');
  const [newPaymentMode, setNewPaymentMode] = useState('UPI');

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + N -> New Invoice
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setIsInvoiceModalOpen(true);
      }
      // Alt + E -> Export CSV
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleExportCSV();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoices]);

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

      return matchesSearch && matchesStatus && matchesTax;
    });
  }, [invoices, search, statusFilter, taxFilter]);

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

    const isTaxable = newTaxType === 'TAXABLE_GOODS';
    const gstRate = isTaxable ? 18 : 0;
    const base = parseFloat(newAmount) || 0;
    const tax = isTaxable ? Math.round(base * 0.18) : 0;
    const total = base + tax;

    const nextIdNumber = invoices.length + 82;
    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNo: `INV-2026-00${nextIdNumber}`,
      date: new Date().toISOString().substring(0, 10),
      uhid: newUhid.trim() || `VN-26-00${nextIdNumber}`,
      patientName: newPatientName.trim(),
      phone: '+91 98220 00000',
      service: newService,
      serviceCode: isTaxable ? 'INV-HA-GOODS' : 'SVC-HEALTHCARE',
      hsnSac: isTaxable ? '9021' : '999312',
      taxType: newTaxType,
      amount: base,
      gstPercent: gstRate,
      taxAmount: tax,
      totalAmount: total,
      paymentMode: newPaymentMode,
      upiRef: newPaymentMode === 'UPI' ? `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}` : '-',
      status: 'PAID',
      receiptNo: `REC-2026-00${nextIdNumber}`,
    };

    const updated = [newInv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('vaani_invoices_v1', JSON.stringify(updated));
    setIsInvoiceModalOpen(false);
    notify.success(`Invoice ${newInv.invoiceNo} created successfully!`);

    // Reset Form
    setNewPatientName('');
    setNewUhid('');
  };

  // Open Dynamic UPI Modal
  const openUpiForInvoice = (inv) => {
    setActiveInvoiceForUpi(inv);
    setIsUpiModalOpen(true);
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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Export filtered records to CSV (Alt + E)"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
            <kbd className="text-[10px] text-slate-400 font-mono hidden sm:inline">[Alt+E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Create new GST tax invoice (Alt + N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Invoice</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR (EXCEL TOOLBAR DENSITY) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Multi-field search */}
          <div className="relative flex items-center flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by invoice #, UHID, patient name, phone, or service..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-7 w-full pl-7 pr-6 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-800 placeholder-slate-400 font-medium"
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
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
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
          >
            <option value="ALL">All Tax Treatments</option>
            <option value="HEALTHCARE_EXEMPT">0% Healthcare Exempt (Notification 12/2017)</option>
            <option value="TAXABLE_GOODS">18% GST (Hearing Aids &amp; Accessories)</option>
          </select>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="text-[11px] font-medium">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-6 px-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600"
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
          <table className="w-full text-xs text-left border-collapse">
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
                <th className="py-2 px-2.5 w-20 text-center">Quick Action</th>
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
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-purple-50/30 transition-colors">
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
                    <td className="py-1.5 px-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openUpiForInvoice(inv)}
                          className="p-1 rounded text-purple-700 hover:bg-purple-100 transition-colors"
                          title="Generate Dynamic UPI QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => notify.info(`Printing receipt ${inv.receiptNo}`)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-100 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-semibold"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
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
              className="h-6 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-semibold"
            >
              <span>Next</span>
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
        size="md"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-3 font-sans text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Patient UHID (Optional)</label>
              <input
                type="text"
                placeholder="VN-26-0082"
                value={newUhid}
                onChange={(e) => setNewUhid(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Shinde"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Clinical Service / Product Description *</label>
            <select
              value={newService}
              onChange={(e) => {
                setNewService(e.target.value);
                if (e.target.value.includes('Hearing Aid')) {
                  setNewTaxType('TAXABLE_GOODS');
                  setNewAmount(12000);
                } else if (e.target.value.includes('Batteries')) {
                  setNewTaxType('TAXABLE_GOODS');
                  setNewAmount(450);
                } else {
                  setNewTaxType('HEALTHCARE_EXEMPT');
                  setNewAmount(800);
                }
              }}
              className="h-8 w-full px-2 text-xs font-medium bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            >
              <option value="Pure Tone Audiometry (PTA)">Pure Tone Audiometry (PTA) — ₹800</option>
              <option value="Impedance Audiometry & Tympanometry">Impedance Audiometry & Tympanometry — ₹600</option>
              <option value="Speech Therapy Clinical Evaluation">Speech Therapy Clinical Evaluation — ₹1,500</option>
              <option value="Speech Therapy Package (10-Session Card)">Speech Therapy Package (10-Session Card) — ₹7,500</option>
              <option value="OAE Newborn Hearing Screening">OAE Newborn Hearing Screening — ₹800</option>
              <option value="Tinnitus Retraining Counseling (CBT)">Tinnitus Retraining Counseling (CBT) — ₹2,000</option>
              <option value="Digital Programmable Hearing Aid (Single Unit)">Digital Programmable Hearing Aid (Single Unit) — ₹25,000</option>
              <option value="Hearing Aid Zinc-Air Batteries (Pack of 6)">Hearing Aid Zinc-Air Batteries (Pack of 6) — ₹450</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Base Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={newAmount}
                onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Tax Regime</label>
              <select
                value={newTaxType}
                onChange={(e) => setNewTaxType(e.target.value)}
                className="h-8 w-full px-1.5 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="HEALTHCARE_EXEMPT">0% Healthcare Exempt</option>
                <option value="TAXABLE_GOODS">18% GST (Goods)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Payment Mode</label>
              <select
                value={newPaymentMode}
                onChange={(e) => setNewPaymentMode(e.target.value)}
                className="h-8 w-full px-1.5 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="UPI">NPCI UPI</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Debit / Credit Card</option>
              </select>
            </div>
          </div>

          {/* Tax Calculation Preview Box */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span>Base Assessment / Product Fee:</span>
              <span className="font-mono font-semibold">₹{newAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>GST ({newTaxType === 'TAXABLE_GOODS' ? '18%' : '0% Exempt'}):</span>
              <span className="font-mono font-semibold">₹{(newTaxType === 'TAXABLE_GOODS' ? Math.round(newAmount * 0.18) : 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-[#301444] font-bold text-sm pt-1 border-t border-slate-200">
              <span>Total Invoice Payable:</span>
              <span className="font-mono">₹{(newAmount + (newTaxType === 'TAXABLE_GOODS' ? Math.round(newAmount * 0.18) : 0)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="h-8 px-3 rounded text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs cursor-pointer"
            >
              Issue &amp; Save Invoice
            </button>
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

    </div>
  );
};

export default BillingPage;
