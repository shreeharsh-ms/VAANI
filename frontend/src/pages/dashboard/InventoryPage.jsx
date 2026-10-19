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
  History,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit3,
  Activity,
  RefreshCw,
  FileText,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/common/Modal';
import { isKey, isAlt, isCmdOrCtrl } from '../../utils/keyboard';
import { useTableKeyboardNav } from '../../hooks';

export const InventoryPage = () => {
  const { notify } = useNotification();

  // Tab State: 'DEVICES' | 'CONSUMABLES' | 'MOVEMENTS'
  const [activeTab, setActiveTab] = useState('DEVICES');

  // ── 1. HEARING AID INVENTORY (Zero fake seed by default) ──
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_inventory_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // ── 2. CONSUMABLES INVENTORY (Zero fake seed by default) ──
  const [consumables, setConsumables] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_inventory_consumables_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If previous old mock seed exists with hardcoded 7 items, clean it up
          const isOldMockSeed = parsed.length === 7 && parsed.some(c => c.brand === 'PowerOne / Rayovac' && c.item.includes('Size 312'));
          if (!isOldMockSeed) {
            return parsed;
          }
        }
      }
    } catch {}
    return [];
  });

  // ── 3. STOCK MOVEMENTS AUDIT TRAIL ──
  const [stockMovements, setStockMovements] = useState(() => {
    try {
      const saved = localStorage.getItem('vaani_stock_movements_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Sync state if purged in Settings or updated elsewhere
  useEffect(() => {
    const handleSync = () => {
      try {
        const devSaved = localStorage.getItem('vaani_inventory_v1');
        setDevices(devSaved !== null ? JSON.parse(devSaved) : []);

        const conSaved = localStorage.getItem('vaani_inventory_consumables_v1');
        setConsumables(conSaved !== null ? JSON.parse(conSaved) : []);

        const movSaved = localStorage.getItem('vaani_stock_movements_v1');
        setStockMovements(movSaved !== null ? JSON.parse(movSaved) : []);
      } catch {}
    };

    window.addEventListener('vaani-clinic-data-purged', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('vaani-clinic-data-purged', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Helper to record a stock movement entry
  const logMovement = (type, itemData, qtyChange = 1, reference = '', notes = '') => {
    const entry = {
      id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      type, // 'RESTOCK_INWARD' | 'SOLD_DISPENSED' | 'CLINICAL_TRIAL' | 'CUSTOMER_RETURN' | 'VENDOR_RETURN'
      itemName: itemData.model || itemData.item || itemData.name || 'Medical Supply',
      serialNo: itemData.serialNo || '-',
      brand: itemData.brand || '-',
      hsnCode: itemData.hsnCode || '90214090',
      qtyChange,
      reference: reference || '-',
      notes: notes || '-',
    };

    setStockMovements((prev) => {
      const updated = [entry, ...prev];
      localStorage.setItem('vaani_stock_movements_v1', JSON.stringify(updated));
      return updated;
    });
  };

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

  // ── MODAL 1: ADD PRODUCT / DEVICE ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceFormRef = useRef(null);
  const [newBrand, setNewBrand] = useState('Phonak');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newCategory, setNewCategory] = useState('RIC (Receiver-in-Canal)');
  const [newBattery, setNewBattery] = useState('Rechargeable Li-ion');
  const [newHsn, setNewHsn] = useState('90214090');
  const [newGstPercent, setNewGstPercent] = useState('18');
  const [newCost, setNewCost] = useState(45000);
  const [newMrp, setNewMrp] = useState(55000);

  // ── MODAL 2: ADD CONSUMABLE ITEM ──
  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [newConsumableItem, setNewConsumableItem] = useState('');
  const [newConsumableBrand, setNewConsumableBrand] = useState('');
  const [newConsumableStock, setNewConsumableStock] = useState(20);
  const [newConsumableReorder, setNewConsumableReorder] = useState(10);
  const [newConsumableHsn, setNewConsumableHsn] = useState('8506');
  const [newConsumableGst, setNewConsumableGst] = useState('18');
  const [newConsumablePrice, setNewConsumablePrice] = useState(350);

  // ── MODAL 3: QUICK RESTOCK ──
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedRestockItem, setSelectedRestockItem] = useState(null);
  const [restockQty, setRestockQty] = useState(1);
  const [restockSupplier, setRestockSupplier] = useState('');
  const [restockInvoiceRef, setRestockInvoiceRef] = useState('');
  const [restockNotes, setRestockNotes] = useState('');

  // ── MODAL 4: RETURN / VENDOR RMA ──
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [returnType, setReturnType] = useState('VENDOR_RETURN');
  const [returnReason, setReturnReason] = useState('Defective / Warranty RMA');
  const [returnNotes, setReturnNotes] = useState('');

  // ── MODAL 5: DISPENSE / MARK SOLD ──
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [selectedDispenseItem, setSelectedDispenseItem] = useState(null);
  const [dispensePatientName, setDispensePatientName] = useState('');
  const [dispensePatientUhid, setDispensePatientUhid] = useState('');
  const [dispenseEar, setDispenseEar] = useState('RIGHT');
  const [dispenseInvoiceRef, setDispenseInvoiceRef] = useState('');

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
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Devices
  const filteredDevices = useMemo(() => {
    return devices.filter((dev) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (dev.serialNo && dev.serialNo.toLowerCase().includes(q)) ||
        (dev.brand && dev.brand.toLowerCase().includes(q)) ||
        (dev.model && dev.model.toLowerCase().includes(q)) ||
        (dev.patientName && dev.patientName.toLowerCase().includes(q)) ||
        (dev.patientUhid && dev.patientUhid.toLowerCase().includes(q)) ||
        (dev.hsnCode && dev.hsnCode.toLowerCase().includes(q));

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

  const { getRowProps, getButtonProps, tableContainerProps } = useTableKeyboardNav({
    items: paginatedDevices,
    page,
    totalPages,
    onPageChange: setPage,
    isEnabled: activeTab === 'DEVICES',
    tableId: 'inventory-devices-table',
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Serial Number', 'Brand', 'Model', 'Category', 'HSN Code', 'GST %', 'Battery', 'Stock Status', 'Patient UHID', 'Patient Name', 'Ear', 'Warranty Expiry', 'Cost', 'MRP', 'Vendor'];
    const rows = sortedDevices.map((d) => [
      d.serialNo,
      d.brand,
      `"${d.model}"`,
      d.category,
      d.hsnCode || '90214090',
      d.gstPercent || 18,
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vaani_HearingAid_Inventory_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success('Hearing aid inventory exported to CSV successfully!');
  };

  // ── HANDLER: ADD HEARING AID DEVICE / PRODUCT ──
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (!newModel.trim()) {
      notify.error('Model name is required.');
      return;
    }

    // Auto-generate serial if left blank by clinician
    const finalSerial = newSerial.trim()
      ? newSerial.trim().toUpperCase()
      : `${newBrand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const newDev = {
      id: `dev_${Date.now()}`,
      serialNo: finalSerial,
      brand: newBrand,
      model: newModel.trim(),
      category: newCategory,
      channels: 16,
      batteryType: newBattery,
      hsnCode: newHsn.trim() || '90214090',
      gstPercent: Number(newGstPercent) || 18,
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
    logMovement('RESTOCK_INWARD', newDev, 1, 'Initial Inventory Entry', 'Added to clinic active stock');

    setIsModalOpen(false);
    notify.success(`Product ${newDev.model} (${newDev.serialNo}) added to inventory!`);

    setNewModel('');
    setNewSerial('');
  };

  // ── HANDLER: ADD CONSUMABLE ITEM ──
  const handleAddConsumable = (e) => {
    e.preventDefault();
    if (!newConsumableItem.trim()) {
      notify.error('Item description is required.');
      return;
    }

    const currentUnits = parseInt(newConsumableStock, 10) || 0;
    const reorderUnits = parseInt(newConsumableReorder, 10) || 10;

    const newCons = {
      id: `con_${Date.now()}`,
      item: newConsumableItem.trim(),
      brand: newConsumableBrand.trim() || 'Approved Clinical Brand',
      currentStock: currentUnits,
      reorderLevel: reorderUnits,
      hsnCode: newConsumableHsn.trim() || '8506',
      gstPercent: Number(newConsumableGst) || 18,
      unitPrice: parseFloat(newConsumablePrice) || 0,
      status: currentUnits <= reorderUnits ? 'LOW_STOCK' : 'NORMAL',
    };

    const updated = [newCons, ...consumables];
    setConsumables(updated);
    localStorage.setItem('vaani_inventory_consumables_v1', JSON.stringify(updated));
    logMovement('RESTOCK_INWARD', newCons, currentUnits, 'Initial Consumable Stock', 'Inwarded to accessories stock');

    setIsConsumableModalOpen(false);
    notify.success(`Consumable item ${newCons.item} added successfully!`);

    setNewConsumableItem('');
    setNewConsumableBrand('');
    setNewConsumableStock(20);
    setNewConsumableReorder(10);
  };

  // ── HANDLER: RESTOCK ITEM (INCREASE QTY) ──
  const handleOpenRestockModal = (item) => {
    setSelectedRestockItem(item);
    setRestockQty(item.currentStock !== undefined ? 10 : 1);
    setRestockSupplier(item.vendor || item.brand || '');
    setRestockInvoiceRef('');
    setRestockNotes('');
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = (e) => {
    e.preventDefault();
    if (!selectedRestockItem) return;

    const qtyToAdd = parseInt(restockQty, 10) || 1;

    // Check if consumable or device
    if (selectedRestockItem.currentStock !== undefined) {
      // Consumable restock
      const updated = consumables.map((c) => {
        if (c.id === selectedRestockItem.id || c.item === selectedRestockItem.item) {
          const newQty = c.currentStock + qtyToAdd;
          return {
            ...c,
            currentStock: newQty,
            status: newQty <= c.reorderLevel ? 'LOW_STOCK' : 'NORMAL',
          };
        }
        return c;
      });
      setConsumables(updated);
      localStorage.setItem('vaani_inventory_consumables_v1', JSON.stringify(updated));
      logMovement('RESTOCK_INWARD', selectedRestockItem, qtyToAdd, restockInvoiceRef || 'Restock Voucher', restockNotes || `Restocked +${qtyToAdd} units`);
      notify.success(`Restocked +${qtyToAdd} units of ${selectedRestockItem.item}!`);
    } else {
      // Hearing aid device restock
      const updated = devices.map((d) => {
        if (d.id === selectedRestockItem.id) {
          return {
            ...d,
            stockStatus: 'IN_STOCK',
            patientName: '-',
            patientUhid: '-',
          };
        }
        return d;
      });
      setDevices(updated);
      localStorage.setItem('vaani_inventory_v1', JSON.stringify(updated));
      logMovement('RESTOCK_INWARD', selectedRestockItem, 1, restockInvoiceRef || 'Restock Voucher', restockNotes || 'Re-inwarded to clinic available stock');
      notify.success(`Device ${selectedRestockItem.serialNo} re-inwarded to available stock!`);
    }

    setIsRestockModalOpen(false);
  };

  // ── HANDLER: RETURN / VENDOR RMA ──
  const handleOpenReturnModal = (item) => {
    setSelectedReturnItem(item);
    setReturnType('VENDOR_RETURN');
    setReturnReason('Defective / Warranty RMA');
    setReturnNotes('');
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (!selectedReturnItem) return;

    if (selectedReturnItem.currentStock !== undefined) {
      // Consumable return
      const qtyToRemove = Math.min(selectedReturnItem.currentStock, 1);
      const updated = consumables.map((c) => {
        if (c.id === selectedReturnItem.id || c.item === selectedReturnItem.item) {
          const newQty = Math.max(0, c.currentStock - qtyToRemove);
          return {
            ...c,
            currentStock: newQty,
            status: newQty <= c.reorderLevel ? 'LOW_STOCK' : 'NORMAL',
          };
        }
        return c;
      });
      setConsumables(updated);
      localStorage.setItem('vaani_inventory_consumables_v1', JSON.stringify(updated));
      logMovement(returnType, selectedReturnItem, -qtyToRemove, returnReason, returnNotes || 'Consumable returned/written off');
      notify.success(`Return recorded for ${selectedReturnItem.item}`);
    } else {
      // Hearing aid device return
      const updated = devices.map((d) => {
        if (d.id === selectedReturnItem.id) {
          return {
            ...d,
            stockStatus: 'RETURNED',
          };
        }
        return d;
      });
      setDevices(updated);
      localStorage.setItem('vaani_inventory_v1', JSON.stringify(updated));
      logMovement(returnType, selectedReturnItem, -1, returnReason, returnNotes || 'Device returned / RMA recorded');
      notify.success(`Device ${selectedReturnItem.serialNo} marked as RETURNED`);
    }

    setIsReturnModalOpen(false);
  };

  // ── HANDLER: DISPENSE / MARK SOLD ──
  const handleOpenDispenseModal = (item) => {
    setSelectedDispenseItem(item);
    setDispensePatientName('');
    setDispensePatientUhid('');
    setDispenseEar('RIGHT');
    setDispenseInvoiceRef('');
    setIsDispenseModalOpen(true);
  };

  const handleConfirmDispense = (e) => {
    e.preventDefault();
    if (!selectedDispenseItem) return;
    if (!dispensePatientName.trim()) {
      notify.error('Patient name is required to dispense');
      return;
    }

    const updated = devices.map((d) => {
      if (d.id === selectedDispenseItem.id) {
        return {
          ...d,
          stockStatus: 'DISPENSED',
          patientName: dispensePatientName.trim(),
          patientUhid: dispensePatientUhid.trim() || 'Outpatient',
          ear: dispenseEar,
        };
      }
      return d;
    });

    setDevices(updated);
    localStorage.setItem('vaani_inventory_v1', JSON.stringify(updated));
    logMovement(
      'SOLD_DISPENSED',
      selectedDispenseItem,
      -1,
      dispenseInvoiceRef || `Patient ${dispensePatientUhid || dispensePatientName}`,
      `Fitted to ${dispensePatientName} (${dispenseEar})`
    );

    notify.success(`Device ${selectedDispenseItem.serialNo} dispensed to ${dispensePatientName}!`);
    setIsDispenseModalOpen(false);
  };

  // ── HANDLER: DELETE CONSUMABLE OR DEVICE ──
  const handleDeleteConsumable = (idx) => {
    const itemToDelete = consumables[idx];
    const updated = consumables.filter((_, i) => i !== idx);
    setConsumables(updated);
    localStorage.setItem('vaani_inventory_consumables_v1', JSON.stringify(updated));
    if (itemToDelete) {
      logMovement('VENDOR_RETURN', itemToDelete, -itemToDelete.currentStock, 'Item Purged', 'Deleted from inventory');
      notify.info(`Removed ${itemToDelete.item} from consumables.`);
    }
  };

  const handleDeleteDevice = (id) => {
    const devToDelete = devices.find((d) => d.id === id);
    const updated = devices.filter((d) => d.id !== id);
    setDevices(updated);
    localStorage.setItem('vaani_inventory_v1', JSON.stringify(updated));
    if (devToDelete) {
      logMovement('VENDOR_RETURN', devToDelete, -1, 'Item Purged', 'Deleted from inventory');
      notify.info(`Removed ${devToDelete.serialNo} from inventory.`);
    }
  };

  // Stats Counters
  const inStockCount = devices.filter((d) => d.stockStatus === 'IN_STOCK').length;
  const onTrialCount = devices.filter((d) => d.stockStatus === 'ON_TRIAL').length;
  const dispensedCount = devices.filter((d) => d.stockStatus === 'DISPENSED').length;
  const returnedCount = devices.filter((d) => d.stockStatus === 'RETURNED' || d.stockStatus === 'IN_SERVICE').length;
  const totalConsumablesUnits = consumables.reduce((acc, c) => acc + (c.currentStock || 0), 0);

  return (
    <div className="w-full space-y-2.5 font-sans">
      {/* ── TOP ACTION BAR (COMPACT DENSITY) ── */}
      <div className="bg-white/95 border border-slate-200/90 rounded-lg p-2 sm:p-2.5 shadow-2xs backdrop-blur-xs flex items-center justify-between gap-2">
        {/* Left: Title & Quick Counts */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
            <Box className="w-3.5 h-3.5 text-purple-700" />
            <span>Clinic Inventory &amp; Stock Movement</span>
          </div>

          <h1 className="sm:hidden text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <Box className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Inventory</span>
          </h1>

          <div className="h-3.5 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Stat Pill */}
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono shrink-0">
            {inStockCount} <span className="hidden sm:inline">Units</span> In Stock
          </span>

          {/* Desktop Only Extra Stats */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-mono">
              {dispensedCount} Sold
            </span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
              {onTrialCount} Trial
            </span>
          </div>
        </div>

        {/* Right: Actions (Compact icon buttons on mobile in corner) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 sm:h-7 px-2 sm:px-2.5 rounded-lg sm:rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation flex items-center justify-center gap-1.5"
            title="Export serial inventory to CSV (Alt + E / ⌥E)"
          >
            <Download className="w-4 h-4 sm:w-3 sm:h-3 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
            <kbd className="text-[10px] text-slate-500 font-mono hidden sm:inline">[Alt+E]</kbd>
          </button>

          <button
            type="button"
            onClick={() => setIsConsumableModalOpen(true)}
            className="h-8 sm:h-7 px-2 sm:px-2.5 rounded-lg sm:rounded text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation flex items-center justify-center gap-1.5"
            title="Add consumable battery or accessory stock"
          >
            <Plus className="w-4 h-4 sm:w-3 sm:h-3 text-purple-800" />
            <span className="hidden sm:inline">Add Consumable</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-8 sm:h-7 px-2.5 sm:px-3 rounded-lg sm:rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-1.5"
            title="Register new hearing aid product in stock (Alt + N / ⌥N)"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Add Product</span>
            <kbd className="text-[10px] text-purple-200 font-mono hidden sm:inline">[Alt+N]</kbd>
          </button>
        </div>
      </div>

      {/* ── SECTION NAVIGATION TABS (Smooth horizontal scroll on mobile) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none whitespace-nowrap -mx-1 px-1 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab('DEVICES')}
          className={`flex-shrink-0 pb-2 px-3 flex items-center gap-1.5 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'DEVICES'
              ? 'border-[#301444] text-[#301444]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Hearing Aid Units &amp; Products ({devices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CONSUMABLES')}
          className={`flex-shrink-0 pb-2 px-3 flex items-center gap-1.5 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'CONSUMABLES'
              ? 'border-[#301444] text-[#301444]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Consumables, Batteries &amp; Domes ({consumables.length} Items • {totalConsumablesUnits} Units)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MOVEMENTS')}
          className={`flex-shrink-0 pb-2 px-3 flex items-center gap-1.5 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'MOVEMENTS'
              ? 'border-[#301444] text-[#301444]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Stock Movement Audit Log ({stockMovements.length})</span>
        </button>
      </div>

      {/* ── TAB 1: HEARING AID DEVICES & PRODUCTS ── */}
      {activeTab === 'DEVICES' && (
        <div className="space-y-2.5">
          {/* Filter & Search Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 sm:p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full sm:w-auto">
              <div className="relative flex items-center w-full sm:max-w-xs md:max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search serial #, brand, model, patient..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-8 sm:h-7 w-full pl-7 pr-6 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
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

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                {/* Brand Filter */}
                <select
                  value={brandFilter}
                  onChange={(e) => {
                    setBrandFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full sm:w-auto truncate"
                >
                  <option value="ALL">All Brands</option>
                  <option value="Phonak">Phonak</option>
                  <option value="Oticon">Oticon</option>
                  <option value="Signia">Signia</option>
                  <option value="Widex">Widex</option>
                  <option value="Other">Other Brands</option>
                </select>

                {/* Stock Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="h-8 sm:h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none w-full sm:w-auto truncate"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="IN_STOCK">In Stock</option>
                  <option value="DISPENSED">Sold / Dispensed</option>
                  <option value="ON_TRIAL">On Trial</option>
                  <option value="RETURNED">Returned</option>
                  <option value="IN_SERVICE">In Service / RMA</option>
                </select>
              </div>
            </div>

            {/* Rows selector */}
            <div className="hidden sm:flex items-center justify-end gap-1.5 text-xs text-slate-600 w-auto">
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

          {/* ── MOBILE DEVICE CARDS (Visible on screen < md) ── */}
          <div className="md:hidden space-y-2.5">
            {paginatedDevices.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-xs text-slate-500 font-medium">
                <Box className="w-6 h-6 mb-1 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-xs">No hearing aid devices in clinic inventory.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Add Product&quot; to register new units.</p>
              </div>
            ) : (
              paginatedDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2 hover:border-purple-300 transition-colors"
                >
                  {/* Top: Serial # & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-950 border border-purple-200 whitespace-nowrap">
                      {dev.serialNo}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                        dev.stockStatus === 'IN_STOCK'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : dev.stockStatus === 'ON_TRIAL'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : dev.stockStatus === 'DISPENSED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {dev.stockStatus === 'IN_STOCK'
                        ? 'In Stock'
                        : dev.stockStatus === 'ON_TRIAL'
                        ? 'On Trial'
                        : dev.stockStatus === 'DISPENSED'
                        ? 'Sold / Dispensed'
                        : 'Returned / RMA'}
                    </span>
                  </div>

                  {/* Brand & Model */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{dev.brand} {dev.model}</h4>
                      <p className="text-[11px] text-slate-500">{dev.category} • {dev.batteryType}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-slate-900 block">
                        ₹{dev.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        HSN {dev.hsnCode || '90214090'}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Patient if any */}
                  {dev.patientName && dev.patientName !== '-' && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Patient</span>
                      <span className="font-semibold text-slate-800">{dev.patientName}</span>
                      <span className="text-[10px] font-mono text-purple-700 ml-1.5 font-bold">({dev.patientUhid} • {dev.ear})</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                    {dev.stockStatus === 'IN_STOCK' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenDispenseModal(dev)}
                          className="flex-1 h-7.5 px-2.5 rounded text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Sell / Dispense</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReturnModal(dev)}
                          className="h-7.5 px-2.5 rounded text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                        >
                          Return / RMA
                        </button>
                      </>
                    )}
                    {dev.stockStatus === 'DISPENSED' && (
                      <button
                        type="button"
                        onClick={() => handleOpenRestockModal(dev)}
                        className="flex-1 h-7.5 px-2.5 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs cursor-pointer"
                      >
                        Re-inward / Restock
                      </button>
                    )}
                    {dev.stockStatus === 'RETURNED' && (
                      <button
                        type="button"
                        onClick={() => handleOpenRestockModal(dev)}
                        className="flex-1 h-7.5 px-2.5 rounded text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-2xs cursor-pointer"
                      >
                        Re-inward Stock
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteDevice(dev.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 rounded cursor-pointer ml-auto"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── DESKTOP EXCEL-STYLE COMPACT DATA GRID TABLE (Visible on md: and above) ── */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse" {...tableContainerProps}>
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                    <th onClick={() => handleSort('serialNo')} className="py-2 px-3 w-36 cursor-pointer hover:bg-slate-200/80">
                      <div className="flex items-center justify-between">
                        <span>Serial Number</span>
                        {sortField === 'serialNo' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                      </div>
                    </th>
                    <th onClick={() => handleSort('brand')} className="py-2 px-2.5 w-24 cursor-pointer hover:bg-slate-200/80">
                      <div className="flex items-center justify-between">
                        <span>Brand</span>
                        {sortField === 'brand' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                      </div>
                    </th>
                    <th className="py-2 px-3">Model &amp; Acoustics</th>
                    <th className="py-2 px-2.5 w-24 text-center">HSN / GST</th>
                    <th className="py-2 px-2.5 w-24 text-center">Status</th>
                    <th className="py-2 px-3 w-40">Assigned Patient</th>
                    <th onClick={() => handleSort('mrp')} className="py-2 px-3 w-24 text-right cursor-pointer hover:bg-slate-200/80">
                      <div className="flex items-center justify-end gap-1">
                        <span>MRP (₹)</span>
                        {sortField === 'mrp' ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-purple-700" /> : <ArrowDown className="w-3 h-3 text-purple-700" />) : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                      </div>
                    </th>
                    <th className="py-2 px-3 w-40 text-center">Stock Movement Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {paginatedDevices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="sticky left-0 w-full min-w-full flex flex-col items-center justify-center py-8 px-4 text-center text-slate-500 font-medium">
                          <Box className="w-6 h-6 mb-1 text-slate-300" />
                          <p className="font-semibold text-slate-700 text-xs">No hearing aid devices in clinic inventory.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                            Click &quot;Add Product&quot; to register new devices with HSN code, GST %, and serial tracking.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedDevices.map((dev, idx) => {
                      const rowProps = getRowProps(idx);
                      let btnIdx = 0;
                      return (
                        <tr key={dev.id} {...rowProps}>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">
                            {dev.serialNo}
                          </td>
                          <td className="py-2 px-2.5 font-bold text-purple-900">
                            {dev.brand}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-semibold text-slate-800">{dev.model}</span>
                            <span className="text-[10px] text-slate-400 block">{dev.category} • {dev.batteryType}</span>
                          </td>
                          <td className="py-2 px-2.5 text-center font-mono text-[11px] text-slate-600">
                            <span className="font-bold">{dev.hsnCode || '90214090'}</span>
                            <span className="text-[10px] text-purple-800 block">({dev.gstPercent ?? 18}%)</span>
                          </td>
                          <td className="py-2 px-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                dev.stockStatus === 'IN_STOCK'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : dev.stockStatus === 'ON_TRIAL'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : dev.stockStatus === 'DISPENSED'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {dev.stockStatus === 'IN_STOCK'
                                ? 'In Stock'
                                : dev.stockStatus === 'ON_TRIAL'
                                ? 'On Trial'
                                : dev.stockStatus === 'DISPENSED'
                                ? 'Sold / Dispensed'
                                : 'Returned / RMA'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-700">
                            {dev.patientName && dev.patientName !== '-' ? (
                              <div>
                                <span className="font-semibold text-slate-800 block truncate">{dev.patientName}</span>
                                <span className="text-[10px] font-mono text-purple-700">{dev.patientUhid} ({dev.ear})</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Available in Clinic</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{dev.mrp.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {dev.stockStatus === 'IN_STOCK' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDispenseModal(dev)}
                                    {...getButtonProps(idx, btnIdx++)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 hover:bg-purple-200 cursor-pointer ${getButtonProps(idx, btnIdx - 1).className}`}
                                    title="Mark as Sold & Dispense to Patient"
                                  >
                                    Sell / Dispense
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReturnModal(dev)}
                                    {...getButtonProps(idx, btnIdx++)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer ${getButtonProps(idx, btnIdx - 1).className}`}
                                    title="Return to Manufacturer / RMA"
                                  >
                                    Return
                                  </button>
                                </>
                              )}
                              {dev.stockStatus === 'DISPENSED' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRestockModal(dev)}
                                  {...getButtonProps(idx, btnIdx++)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 cursor-pointer ${getButtonProps(idx, btnIdx - 1).className}`}
                                  title="Patient Return to Stock"
                                >
                                  Re-inward / Restock
                                </button>
                              )}
                              {dev.stockStatus === 'RETURNED' && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRestockModal(dev)}
                                  {...getButtonProps(idx, btnIdx++)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer ${getButtonProps(idx, btnIdx - 1).className}`}
                                  title="Re-inward after vendor repair"
                                >
                                  Re-inward Stock
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteDevice(dev.id)}
                                {...getButtonProps(idx, btnIdx++)}
                                className={`text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer ${getButtonProps(idx, btnIdx - 1).className}`}
                                title="Delete record"
                              >
                                <Trash2 className="w-3 h-3" />
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
          </div>

          {/* Pagination Footer */}
          <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 shadow-2xs">
            <div className="font-medium">
              Showing <span className="font-bold text-slate-900">{totalEntries === 0 ? 0 : (page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * pageSize, totalEntries)}</span> of <span className="font-bold text-slate-900">{totalEntries}</span> serial items
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
      )}

      {/* ── TAB 2: CONSUMABLES & BATTERIES ── */}
      {activeTab === 'CONSUMABLES' && (
        <div className="space-y-2.5">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider block">
                  Consumable Batteries, Domes &amp; Impression Material ({consumables.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  Track stock counts, reorder thresholds, HSN codes and restock movements
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsConsumableModalOpen(true)}
                className="h-7 px-3 rounded text-xs font-bold bg-[#301444] hover:bg-purple-950 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Consumable Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 w-40">Approved Brand</th>
                    <th className="py-2 px-2.5 w-24 text-center">HSN &amp; GST</th>
                    <th className="py-2 px-3 w-28 text-center">Current Stock</th>
                    <th className="py-2 px-3 w-28 text-center">Reorder Threshold</th>
                    <th className="py-2 px-2.5 w-24 text-center">Status</th>
                    <th className="py-2 px-3 w-36 text-center">Stock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {consumables.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="sticky left-0 w-full min-w-full flex flex-col items-center justify-center py-8 px-4 text-center text-slate-500 font-medium">
                          <Box className="w-6 h-6 mb-1 text-slate-300" />
                          <p className="font-semibold text-slate-700 text-xs">No consumable inventory recorded yet.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                            Click &quot;+ Add Consumable Item&quot; to record batteries, wax guards, or impression materials.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    consumables.map((c, idx) => (
                      <tr key={c.id || idx} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {c.item}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {c.brand}
                        </td>
                        <td className="py-2 px-2.5 text-center font-mono text-[11px] text-slate-600">
                          <span className="font-bold">{c.hsnCode || '8506'}</span>
                          <span className="text-[10px] text-purple-800 block">({c.gstPercent ?? 18}%)</span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                          {c.currentStock} Units
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">
                          {c.reorderLevel} Units
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              c.status === 'LOW_STOCK' || c.currentStock <= c.reorderLevel
                                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {c.status === 'LOW_STOCK' || c.currentStock <= c.reorderLevel ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenRestockModal(c)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                              title="Restock Units"
                            >
                              + Restock
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReturnModal(c)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                              title="Return / Write-off"
                            >
                              Return
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteConsumable(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
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

      {/* ── TAB 3: STOCK MOVEMENTS AUDIT TRAIL ── */}
      {activeTab === 'MOVEMENTS' && (
        <div className="space-y-2.5">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#301444] uppercase tracking-wider block">
                  Stock Movement Ledger &amp; Audit Trail ({stockMovements.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  Real-time cryptographic audit log of available, sold, restocked, and returned inventory
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStockMovements([]);
                  localStorage.setItem('vaani_stock_movements_v1', JSON.stringify([]));
                  notify.info('Stock movement log cleared.');
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2 px-3 w-32">Timestamp</th>
                    <th className="py-2 px-3 w-36 text-center">Movement Type</th>
                    <th className="py-2 px-3">Item Description &amp; Serial</th>
                    <th className="py-2 px-3 w-28 text-center">Qty Change</th>
                    <th className="py-2 px-3 w-44">Reference / Patient</th>
                    <th className="py-2 px-3">Movement Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {stockMovements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="sticky left-0 w-full min-w-full flex flex-col items-center justify-center py-8 px-4 text-center text-slate-500 font-medium">
                          <History className="w-6 h-6 mb-1 text-slate-300" />
                          <p className="font-semibold text-slate-700 text-xs">No stock movement logs recorded yet.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                            Movements will automatically record whenever devices are added, sold, restocked, or returned.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stockMovements.map((m) => (
                      <tr key={m.id} className="hover:bg-purple-50/20 transition-colors">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {m.date} {m.time}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              m.type === 'RESTOCK_INWARD'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : m.type === 'SOLD_DISPENSED'
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : m.type === 'CLINICAL_TRIAL'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {m.type === 'RESTOCK_INWARD'
                              ? 'Inward / Restock'
                              : m.type === 'SOLD_DISPENSED'
                              ? 'Sold / Dispensed'
                              : m.type === 'CLINICAL_TRIAL'
                              ? 'On Trial'
                              : 'Return / RMA'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-900 block">{m.itemName}</span>
                          <span className="text-[10px] font-mono text-purple-700">
                            SN: {m.serialNo} • {m.brand} • HSN {m.hsnCode}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          <span
                            className={
                              m.qtyChange > 0
                                ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'
                                : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded'
                            }
                          >
                            {m.qtyChange > 0 ? `+${m.qtyChange}` : m.qtyChange} Units
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {m.reference}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">
                          {m.notes}
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

      {/* ── MODAL 1: ADD PRODUCT / DEVICE ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Hearing Aid Product / Device to Inventory"
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
                <option value="Resound">GN ReSound</option>
                <option value="Starkey">Starkey Laboratories</option>
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
              <label className="font-semibold text-slate-700 block mb-0.5">
                Device Serial Number (Optional / Auto-generated)
              </label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate"
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
                <option value="ITC (In-the-Canal)">ITC (In-the-Canal)</option>
                <option value="IIC (Invisible-in-Canal)">IIC (Invisible-in-Canal)</option>
              </select>
            </div>
          </div>

          {/* HSN Code & GST % Fields */}
          <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-200">
            <div>
              <label className="font-semibold text-purple-950 block mb-0.5">HSN Code</label>
              <input
                type="text"
                value={newHsn}
                onChange={(e) => setNewHsn(e.target.value)}
                placeholder="e.g. 90214090"
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-purple-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-purple-950 block mb-0.5">GST Rate (%)</label>
              <select
                value={newGstPercent}
                onChange={(e) => setNewGstPercent(e.target.value)}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-purple-300 rounded focus:border-purple-600"
              >
                <option value="0">0% (Statutorily Exempt)</option>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST (Medical Appliances)</option>
                <option value="28">28% GST</option>
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

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2.5">
            <span className="text-[11px] text-slate-500">
              * Creates barcode entry &amp; logs stock movement.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-2xs transition-all cursor-pointer"
              >
                <span>Add Product to Inventory</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 2: ADD CONSUMABLE ITEM ── */}
      <Modal
        isOpen={isConsumableModalOpen}
        onClose={() => setIsConsumableModalOpen(false)}
        title="Add Consumable Accessory to Clinic Stock"
        size="md"
      >
        <form onSubmit={handleAddConsumable} className="space-y-3 font-sans text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Item Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Zinc-Air Batteries (Size 312) or CeruStop Wax Guards"
              value={newConsumableItem}
              onChange={(e) => setNewConsumableItem(e.target.value)}
              className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Approved Brand / Supplier</label>
              <input
                type="text"
                placeholder="e.g. PowerOne, Rayovac, Phonak, Dreve"
                value={newConsumableBrand}
                onChange={(e) => setNewConsumableBrand(e.target.value)}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Unit Retail Price (₹)</label>
              <input
                type="number"
                min="0"
                value={newConsumablePrice}
                onChange={(e) => setNewConsumablePrice(parseFloat(e.target.value) || 0)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Initial Stock (Units) *</label>
              <input
                type="number"
                min="0"
                required
                value={newConsumableStock}
                onChange={(e) => setNewConsumableStock(parseInt(e.target.value, 10) || 0)}
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Reorder Threshold Level *</label>
              <input
                type="number"
                min="0"
                required
                value={newConsumableReorder}
                onChange={(e) => setNewConsumableReorder(parseInt(e.target.value, 10) || 0)}
                className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-purple-50/50 border border-purple-200">
            <div>
              <label className="font-semibold text-purple-950 block mb-0.5">HSN Code</label>
              <input
                type="text"
                value={newConsumableHsn}
                onChange={(e) => setNewConsumableHsn(e.target.value)}
                placeholder="8506"
                className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-purple-300 rounded focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-purple-950 block mb-0.5">GST Rate (%)</label>
              <select
                value={newConsumableGst}
                onChange={(e) => setNewConsumableGst(e.target.value)}
                className="h-8 w-full px-2 text-xs font-semibold bg-white border border-purple-300 rounded focus:border-purple-600"
              >
                <option value="0">0% Exempt</option>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConsumableModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs cursor-pointer"
            >
              Save Consumable
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 3: RESTOCK (+QTY) ── */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="Restock Inventory (Stock Inward)"
        size="sm"
      >
        <form onSubmit={handleConfirmRestock} className="space-y-3 font-sans text-xs">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Selected Item</span>
            <p className="font-bold text-slate-900 text-sm">
              {selectedRestockItem?.model || selectedRestockItem?.item}
            </p>
            <p className="text-[11px] text-purple-800 font-mono">
              {selectedRestockItem?.serialNo ? `SN: ${selectedRestockItem.serialNo}` : `Brand: ${selectedRestockItem?.brand}`}
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Quantity to Add (+Units) *</label>
            <input
              type="number"
              min="1"
              required
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              className="h-8 w-full px-2 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Supplier / Invoice Ref</label>
            <input
              type="text"
              placeholder="e.g. Sonova Inv #98124"
              value={restockInvoiceRef}
              onChange={(e) => setRestockInvoiceRef(e.target.value)}
              className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Notes</label>
            <input
              type="text"
              placeholder="Restock notes..."
              value={restockNotes}
              onChange={(e) => setRestockNotes(e.target.value)}
              className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRestockModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs cursor-pointer"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 4: RETURN / VENDOR RMA ── */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Record Return / Vendor RMA"
        size="sm"
      >
        <form onSubmit={handleConfirmReturn} className="space-y-3 font-sans text-xs">
          <div className="p-2.5 rounded bg-rose-50/60 border border-rose-200">
            <span className="text-[10px] text-rose-700 font-bold uppercase block">Item to Return</span>
            <p className="font-bold text-slate-900">
              {selectedReturnItem?.model || selectedReturnItem?.item}
            </p>
            <p className="text-[11px] text-slate-600 font-mono">
              {selectedReturnItem?.serialNo ? `Serial: ${selectedReturnItem.serialNo}` : `Brand: ${selectedReturnItem?.brand}`}
            </p>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Return Classification</label>
            <select
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
              className="h-8 w-full px-2 text-xs font-semibold bg-white border border-slate-300 rounded focus:border-purple-600"
            >
              <option value="VENDOR_RETURN">Return to Manufacturer / Vendor RMA</option>
              <option value="CUSTOMER_RETURN">Patient Return / Discontinued</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Reason for Return</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600"
            >
              <option value="Defective / Warranty RMA">Defective / Warranty RMA</option>
              <option value="Patient Fitting Discontinued">Patient Fitting Discontinued</option>
              <option value="Vendor Credit / Exchange">Vendor Credit / Exchange</option>
              <option value="Transit / Physical Damage">Transit / Physical Damage</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Remarks / RMA Number</label>
            <input
              type="text"
              placeholder="e.g. RMA-2026-98124 or warranty repair..."
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-rose-700 text-white hover:bg-rose-800 shadow-2xs cursor-pointer"
            >
              Confirm Return
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 5: DISPENSE / MARK SOLD ── */}
      <Modal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        title="Dispense &amp; Mark as Sold"
        size="sm"
      >
        <form onSubmit={handleConfirmDispense} className="space-y-3 font-sans text-xs">
          <div className="p-2.5 rounded bg-purple-50/70 border border-purple-200">
            <span className="text-[10px] text-purple-700 font-bold uppercase block">Device Unit</span>
            <p className="font-bold text-slate-900">{selectedDispenseItem?.model}</p>
            <p className="text-[11px] text-purple-800 font-mono">Serial: {selectedDispenseItem?.serialNo} • MRP: ₹{selectedDispenseItem?.mrp?.toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Patient Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sachin Shinde"
              value={dispensePatientName}
              onChange={(e) => setDispensePatientName(e.target.value)}
              className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Patient UHID</label>
              <input
                type="text"
                placeholder="VN-26-0001"
                value={dispensePatientUhid}
                onChange={(e) => setDispensePatientUhid(e.target.value)}
                className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Fitted Ear</label>
              <select
                value={dispenseEar}
                onChange={(e) => setDispenseEar(e.target.value)}
                className="h-8 w-full px-2 text-xs bg-white border border-slate-300 rounded"
              >
                <option value="RIGHT">Right Ear</option>
                <option value="LEFT">Left Ear</option>
                <option value="BILATERAL">Bilateral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Invoice / Receipt Ref (Optional)</label>
            <input
              type="text"
              placeholder="e.g. INV-2026-0092"
              value={dispenseInvoiceRef}
              onChange={(e) => setDispenseInvoiceRef(e.target.value)}
              className="h-8 w-full px-2 text-xs font-mono bg-white border border-slate-300 rounded"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDispenseModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-bold bg-[#301444] text-white hover:bg-purple-950 shadow-2xs cursor-pointer"
            >
              Confirm Dispense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
