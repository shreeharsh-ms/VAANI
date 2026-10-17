import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Tag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Package,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import { isKey, isAlt, isCmdOrCtrl } from '../../utils/keyboard';

// ── INITIAL HEARING AID & INVENTORY DATA SEED ──
const INITIAL_DEVICES = [
  {
    id: 'dev_1',
    serialNo: 'PH-L90-2026-98124',
    brand: 'Phonak',
    model: 'Audeo Lumity L90-R',
    category: 'RIC (Receiver-in-Canal)',
    channels: 24,
    batteryType: 'Rechargeable Li-ion',
    stockStatus: 'DISPENSED',
    patientUhid: 'VN-26-0003',
    patientName: 'Vijay Narayan Kadam',
    ear: 'BILATERAL',
    warrantyExpiry: '2028-10-15',
    unitCost: 72000,
    mrp: 85000,
    vendor: 'Sonova India Pvt Ltd',
  },
  {
    id: 'dev_2',
    serialNo: 'OT-REAL1-88412',
    brand: 'Oticon',
    model: 'Real 1 miniRITE',
    category: 'RIC (Receiver-in-Canal)',
    channels: 64,
    batteryType: 'Rechargeable Li-ion',
    stockStatus: 'ON_TRIAL',
    patientUhid: 'VN-26-0002',
    patientName: 'Sunita Dattatray More',
    ear: 'RIGHT',
    warrantyExpiry: '2028-09-20',
    unitCost: 65000,
    mrp: 78000,
    vendor: 'Demant India Pvt Ltd',
  },
  {
    id: 'dev_3',
    serialNo: 'SIG-IX7-19283',
    brand: 'Signia',
    model: 'Pure Charge&Go 7IX',
    category: 'RIC (Receiver-in-Canal)',
    channels: 48,
    batteryType: 'Rechargeable Li-ion',
    stockStatus: 'IN_STOCK',
    patientUhid: '-',
    patientName: '-',
    ear: 'STOCK',
    warrantyExpiry: '2028-11-30',
    unitCost: 58000,
    mrp: 70000,
    vendor: 'WSAudology India',
  },
  {
    id: 'dev_4',
    serialNo: 'WDX-MOM-440-77',
    brand: 'Widex',
    model: 'Moment Sheer 440 sRIC',
    category: 'RIC (Receiver-in-Canal)',
    channels: 15,
    batteryType: 'Rechargeable Li-ion',
    stockStatus: 'IN_STOCK',
    patientUhid: '-',
    patientName: '-',
    ear: 'STOCK',
    warrantyExpiry: '2028-12-01',
    unitCost: 82000,
    mrp: 95000,
    vendor: 'WSAudology India',
  },
  {
    id: 'dev_5',
    serialNo: 'PH-TERRA-1029',
    brand: 'Phonak',
    model: 'Terra+ BTE-UP',
    category: 'BTE (Behind-the-Ear)',
    channels: 16,
    batteryType: 'Zinc-Air 675',
    stockStatus: 'IN_STOCK',
    patientUhid: '-',
    patientName: '-',
    ear: 'STOCK',
    warrantyExpiry: '2027-08-15',
    unitCost: 22000,
    mrp: 28500,
    vendor: 'Sonova India Pvt Ltd',
  },
  {
    id: 'dev_6',
    serialNo: 'OT-ZIRK-9901',
    brand: 'Oticon',
    model: 'Zircon 2 BTE',
    category: 'BTE (Behind-the-Ear)',
    channels: 48,
    batteryType: 'Zinc-Air 13',
    stockStatus: 'IN_SERVICE',
    patientUhid: 'VN-26-0005',
    patientName: 'Ramesh Balasaheb Deshmukh',
    ear: 'LEFT',
    warrantyExpiry: '2027-04-10',
    unitCost: 28000,
    mrp: 35000,
    vendor: 'Demant India Pvt Ltd',
  },
];

const CONSUMABLES_SEED = [
  { item: 'Zinc-Air Batteries (Size 312)', brand: 'PowerOne / Rayovac', currentStock: 48, reorderLevel: 20, status: 'NORMAL' },
  { item: 'Zinc-Air Batteries (Size 10)', brand: 'PowerOne / Rayovac', currentStock: 12, reorderLevel: 15, status: 'LOW_STOCK' },
  { item: 'Zinc-Air Batteries (Size 13)', brand: 'PowerOne / Rayovac', currentStock: 34, reorderLevel: 15, status: 'NORMAL' },
  { item: 'Zinc-Air Batteries (Size 675)', brand: 'PowerOne / Rayovac', currentStock: 22, reorderLevel: 10, status: 'NORMAL' },
  { item: 'CeruStop Wax Guards (Pack of 8)', brand: 'Phonak / Widex', currentStock: 18, reorderLevel: 10, status: 'NORMAL' },
  { item: 'Otosil Earmould Impression Material (Cartridge)', brand: 'Dreve / Egger', currentStock: 4, reorderLevel: 6, status: 'LOW_STOCK' },
  { item: 'Silicone Domes (Sm / Med / Lg)', brand: 'Signia / Oticon', currentStock: 65, reorderLevel: 25, status: 'NORMAL' },
];

export const InventoryPage = () => {
  const { notify } = useNotification();
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_inventory_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return INITIAL_DEVICES;
    }
    return INITIAL_DEVICES;
  });

  const [consumables, setConsumables] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_inventory_consumables_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return CONSUMABLES_SEED;
    }
    return CONSUMABLES_SEED;
  });

  // Sync state if purged in Settings or modified elsewhere
  useEffect(() => {
    const handleSync = () => {
      try {
        const devSaved = localStorage.getItem('vaani_inventory_v1');
        if (devSaved !== null) {
          const parsed = JSON.parse(devSaved);
          if (Array.isArray(parsed)) setDevices(parsed);
        }
        const conSaved = localStorage.getItem('vaani_inventory_consumables_v1');
        if (conSaved !== null) {
          const parsed = JSON.parse(conSaved);
          if (Array.isArray(parsed)) setConsumables(parsed);
        }
      } catch {}
    };

    window.addEventListener('vaani-clinic-data-purged', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('vaani-clinic-data-purged', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sorting State
  const [sortField, setSortField] = useState('serialNo');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // New Device Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceFormRef = useRef(null);
  const [newBrand, setNewBrand] = useState('Phonak');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newCategory, setNewCategory] = useState('RIC (Receiver-in-Canal)');
  const [newBattery, setNewBattery] = useState('Rechargeable Li-ion');
  const [newCost, setNewCost] = useState(45000);
  const [newMrp, setNewMrp] = useState(55000);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Option + N / Alt + N -> New Device
      if (isAlt(e) && isKey(e, 'n')) {
        e.preventDefault();
        setIsModalOpen(true);
      }
      // Option + E / Alt + E -> Export CSV
      if (isAlt(e) && isKey(e, 'e')) {
        e.preventDefault();
        handleExportCSV();
      }
      // Ctrl + Enter or Cmd + Enter -> Submit Device Modal
      if (isModalOpen && isCmdOrCtrl(e) && isKey(e, 'enter')) {
        e.preventDefault();
        if (deviceFormRef.current) {
          deviceFormRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [devices, isModalOpen]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Devices
  const filteredDevices = useMemo(() => {
    return devices.filter(dev => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        dev.serialNo.toLowerCase().includes(q) ||
        dev.brand.toLowerCase().includes(q) ||
        dev.model.toLowerCase().includes(q) ||
        dev.patientName.toLowerCase().includes(q) ||
        dev.patientUhid.toLowerCase().includes(q);

      const matchesBrand = brandFilter === 'ALL' || dev.brand === brandFilter;
      const matchesStatus = statusFilter === 'ALL' || dev.stockStatus === statusFilter;

      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [devices, search, brandFilter, statusFilter]);

  const sortedDevices = useMemo(() => {
    return [...filteredDevices].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    });
  }, [filteredDevices, sortField, sortOrder]);

  // Pagination Slice
  const totalEntries = sortedDevices.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedDevices.slice(start, start + pageSize);
  }, [sortedDevices, page, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Serial Number', 'Brand', 'Model', 'Category', 'Battery', 'Stock Status', 'Patient UHID', 'Patient Name', 'Ear', 'Warranty Expiry', 'Cost', 'MRP', 'Vendor'];
    const rows = sortedDevices.map(d => [
      d.serialNo,
      d.brand,
      `"${d.model}"`,
      d.category,
      d.batteryType,
      d.stockStatus,
      d.patientUhid,
      `"${d.patientName}"`,
      d.ear,
      d.warrantyExpiry,
      d.unitCost,
      d.mrp,
      `"${d.vendor}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_HearingAid_Inventory_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Hearing aid serial register exported successfully!');
  };

  // Add Device
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newModel.trim() || !newSerial.trim()) {
      notify.error('Model and Serial number are required.');
      return;
    }

    const newDev = {
      id: `dev_${Date.now()}`,
      serialNo: newSerial.trim().toUpperCase(),
      brand: newBrand,
      model: newModel.trim(),
      category: newCategory,
      channels: 16,
      batteryType: newBattery,
      stockStatus: 'IN_STOCK',
      patientUhid: '-',
      patientName: '-',
      ear: 'STOCK',
      warrantyExpiry: new Date(Date.now() + 2 * 365 * 86400000).toISOString().substring(0, 10),
      unitCost: parseFloat(newCost) || 0,
      mrp: parseFloat(newMrp) || 0,
      vendor: `${newBrand} Authorized Distributor`,
    };

    const updated = [newDev, ...devices];
    setDevices(updated);
    localStorage.setItem('vaani_inventory_v1', JSON.stringify(updated));
    setIsModalOpen(false);
    notify.success(`Device ${newDev.serialNo} added to clinic stock!`);

    setNewModel('');
    setNewSerial('');
  };

  const inStockCount = devices.filter(d => d.stockStatus === 'IN_STOCK').length;
  const onTrialCount = devices.filter(d => d.stockStatus === 'ON_TRIAL').length;
  const dispensedCount = devices.filter(d => d.stockStatus === 'DISPENSED').length;

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* ── TOP ACTION BAR (COMPACT EXCEL DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2.5 shadow-2xs backdrop-blur-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <Box className="w-3.5 h-3.5 text-purple-700" />
            <span>Hearing Aid Serial Register &amp; Consumables</span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">In Stock:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              {inStockCount} Units
            </span>

            <span className="text-xs font-semibold text-slate-500">On Trial:</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
              {onTrialCount} Units
            </span>

            <span className="text-xs font-semibold text-slate-500">Dispensed:</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-mono">
              {dispensedCount} Units
            </span>
          </div>
        </div>

        {/* Right: Actions with Shortcut Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs"
            title="Export serial inventory to CSV (Alt + E / ⌥E)"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+E / ⌥E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
            title="Register new hearing aid serial in stock (Alt + N / ⌥N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Device</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N / ⌥N]</kbd>
          </button>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Multi-field search */}
          <div className="relative flex items-center flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by serial #, brand, model, UHID, or patient..."
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

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
          >
            <option value="ALL">All Manufacturers</option>
            <option value="Phonak">Phonak</option>
            <option value="Oticon">Oticon</option>
            <option value="Signia">Signia</option>
            <option value="Widex">Widex</option>
          </select>

          {/* Stock Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">In Stock (Clinic)</option>
            <option value="ON_TRIAL">On Patient Trial</option>
            <option value="DISPENSED">Dispensed &amp; Fitted</option>
            <option value="IN_SERVICE">Sent for Service / RMA</option>
          </select>
        </div>

        {/* Rows selector */}
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
                  onClick={() => handleSort('serialNo')}
                  className="py-2 px-3 w-40 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Serial Number</span>
                    {sortField === 'serialNo' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('brand')}
                  className="py-2 px-2.5 w-24 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Brand</span>
                    {sortField === 'brand' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th className="py-2 px-3">Model &amp; Acoustics</th>
                <th className="py-2 px-2.5 w-28">Category</th>
                <th className="py-2 px-2.5 w-24 text-center">Status</th>
                <th className="py-2 px-3 w-40">Assigned Patient</th>
                <th
                  onClick={() => handleSort('warrantyExpiry')}
                  className="py-2 px-2.5 w-28 cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Warranty</span>
                    {sortField === 'warrantyExpiry' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('mrp')}
                  className="py-2 px-3 w-24 text-right cursor-pointer hover:bg-slate-200/80 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>MRP (₹)</span>
                    {sortField === 'mrp' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No matching hearing aid devices found in inventory.
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-900">
                      {dev.serialNo}
                    </td>
                    <td className="py-1.5 px-2.5 font-bold text-purple-900">
                      {dev.brand}
                    </td>
                    <td className="py-1.5 px-3">
                      <span className="font-semibold text-slate-800">{dev.model}</span>
                      <span className="text-[10px] text-slate-400 block">{dev.batteryType}</span>
                    </td>
                    <td className="py-1.5 px-2.5 text-slate-600">
                      {dev.category}
                    </td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        dev.stockStatus === 'IN_STOCK'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : dev.stockStatus === 'ON_TRIAL'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : dev.stockStatus === 'DISPENSED'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {dev.stockStatus === 'IN_STOCK' ? 'In Stock' : dev.stockStatus === 'ON_TRIAL' ? 'On Trial' : dev.stockStatus === 'DISPENSED' ? 'Dispensed' : 'In Service'}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-slate-700">
                      {dev.patientName !== '-' ? (
                        <div>
                          <span className="font-semibold text-slate-800 block truncate">{dev.patientName}</span>
                          <span className="text-[10px] font-mono text-purple-700">{dev.patientUhid} ({dev.ear})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-1.5 px-2.5 font-mono text-slate-600 text-xs">
                      {dev.warrantyExpiry}
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{dev.mrp.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION FOOTER ── */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> serial items
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

      {/* ── SECOND SUBTABLE: CONSUMABLES & BATTERIES STOCK ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
            Consumable Batteries, Domes &amp; Impression Material ({consumables.length})
          </span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            Automated Reorder Thresholds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-1.5 px-3 w-64">Item Description</th>
                <th className="py-1.5 px-3 w-48">Approved Brand</th>
                <th className="py-1.5 px-3 w-28 text-center">Current Stock</th>
                <th className="py-1.5 px-3 w-28 text-center">Reorder Level</th>
                <th className="py-1.5 px-2.5 w-28 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {consumables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    <Box className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    <p className="font-semibold text-slate-600">No consumable items in stock</p>
                    <p className="text-[11px] text-slate-400">All consumable inventory items have been purged or reset.</p>
                  </td>
                </tr>
              ) : (
                consumables.map((c, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-1.5 px-3 font-semibold text-slate-800">{c.item}</td>
                    <td className="py-1.5 px-3 text-slate-600">{c.brand}</td>
                    <td className="py-1.5 px-3 text-center font-mono font-bold text-slate-900">{c.currentStock} Units</td>
                    <td className="py-1.5 px-3 text-center font-mono text-slate-500">{c.reorderLevel} Units</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        c.status === 'LOW_STOCK'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {c.status === 'LOW_STOCK' ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: ADD HEARING AID DEVICE TO STOCK ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Hearing Aid Serial Unit to Clinic Inventory"
        size="md"
      >
        <form ref={deviceFormRef} onSubmit={handleAddDevice} className="space-y-3 font-sans text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Manufacturer *</label>
              <select
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="h-8 w-full px-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              >
                <option value="Phonak">Phonak (Sonova)</option>
                <option value="Oticon">Oticon (Demant)</option>
                <option value="Signia">Signia (WSAudology)</option>
                <option value="Widex">Widex (WSAudology)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Audeo Lumity L70-R"
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Device Serial Number (from Barcode) *</label>
              <input
                type="text"
                required
                placeholder="e.g. PH-26-89104"
                value={newSerial}
                onChange={(e) => setNewSerial(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Style / Form Factor</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600"
              >
                <option value="RIC (Receiver-in-Canal)">RIC (Receiver-in-Canal)</option>
                <option value="BTE (Behind-the-Ear)">BTE (Behind-the-Ear)</option>
                <option value="CIC (Completely-in-Canal)">CIC (Completely-in-Canal)</option>
                <option value="IIC (Invisible-in-Canal)">IIC (Invisible-in-Canal)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Battery Type</label>
              <select
                value={newBattery}
                onChange={(e) => setNewBattery(e.target.value)}
                className="h-8 w-full px-1 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="Rechargeable Li-ion">Rechargeable Li-ion</option>
                <option value="Zinc-Air 312">Zinc-Air 312</option>
                <option value="Zinc-Air 13">Zinc-Air 13</option>
                <option value="Zinc-Air 10">Zinc-Air 10</option>
                <option value="Zinc-Air 675">Zinc-Air 675</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Clinic Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={newCost}
                onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
                className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">MRP / Sell Price (₹)</label>
              <input
                type="number"
                min="0"
                value={newMrp}
                onChange={(e) => setNewMrp(parseFloat(e.target.value) || 0)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
              <span>Submit:</span>
              <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                Ctrl+↵
              </span>
              <span className="text-slate-400">or</span>
              <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                ⌘↵ (Mac)
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel <span className="opacity-60 text-[10px] font-mono">[Esc]</span>
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
              >
                <span>Add Device to Inventory</span>
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

    </div>
  );
};

export default InventoryPage;
