import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  CalendarCheck,
  FileText,
  IndianRupee,
  Box,
  RotateCcw,
  Settings,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Clock,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { ROUTES } from '../../constants';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const quickLinks = [
    { label: 'Practice Overview Dashboard', path: '/dashboard', icon: Clock, category: 'Navigation', hint: 'Alt+1 / ⌥1' },
    { label: 'Appointments & Scheduler', path: '/dashboard/appointments', icon: CalendarCheck, category: 'Navigation', hint: 'Alt+2 / ⌥2' },
    { label: 'Patients Master Index (MPI)', path: '/dashboard/patients', icon: Users, category: 'Navigation', hint: 'Alt+3 / ⌥3' },
    { label: 'Clinical Diagnostic Reports', path: '/dashboard/reports', icon: FileText, category: 'Navigation', hint: 'Alt+4 / ⌥4' },
    { label: 'Billing, Invoices & UPI', path: '/dashboard/billing', icon: IndianRupee, category: 'Navigation', hint: 'Alt+5 / ⌥5' },
    { label: 'Hearing Aid Inventory & Stock', path: '/dashboard/inventory', icon: Box, category: 'Navigation', hint: 'Alt+6 / ⌥6' },
    { label: 'Clinical Follow-ups & Recalls', path: '/dashboard/recalls', icon: RotateCcw, category: 'Navigation', hint: 'Alt+R / ⌥R' },
    { label: 'Clinic Configuration & Governance', path: '/dashboard/settings', icon: Settings, category: 'Navigation', hint: 'Alt+S / ⌥S' },
  ];

  const quickActions = [
    { label: 'Register New Patient (Intake)', path: '/dashboard/patients?action=new', icon: Users, category: 'Quick Action', hint: 'Alt+N / ⌥N' },
    { label: 'Schedule Appointment Slot', path: '/dashboard/appointments?action=new', icon: CalendarCheck, category: 'Quick Action', hint: 'Alt+A / ⌥A' },
    { label: 'Generate GST Tax Invoice', path: '/dashboard/billing?action=new', icon: IndianRupee, category: 'Quick Action', hint: 'Alt+I / ⌥I' },
    { label: 'New Pure Tone Audiogram (PTA)', path: '/dashboard/reports?test=pta', icon: FileText, category: 'Quick Action', hint: 'PTA' },
    { label: 'New Speech Assessment Proforma', path: '/dashboard/reports?test=speech', icon: FileText, category: 'Quick Action', hint: 'SLP' },
    { label: 'Add Hearing Aid Serial to Inventory', path: '/dashboard/inventory?action=new', icon: Box, category: 'Quick Action', hint: 'INV' },
    { label: 'SMTP Server & Email Dispatch Logs', path: '/dashboard/settings?tab=smtp', icon: Mail, category: 'Quick Action', hint: 'SMTP' },
  ];

  const samplePatients = [
    { label: 'Aarav Sachin Shinde (UHID: VN-26-0001)', path: '/dashboard/patients?search=Aarav', icon: Users, category: 'Patient Record', hint: 'Pediatric SLP' },
    { label: 'Sunita Dattatray More (UHID: VN-26-0002)', path: '/dashboard/patients?search=Sunita', icon: Users, category: 'Patient Record', hint: 'Bilateral PTA' },
    { label: 'Vijay Narayan Kadam (UHID: VN-26-0003)', path: '/dashboard/patients?search=Vijay', icon: Users, category: 'Patient Record', hint: 'Phonak Hearing Aid' },
    { label: 'Ananya Rahul Patil (UHID: VN-26-0004)', path: '/dashboard/patients?search=Ananya', icon: Users, category: 'Patient Record', hint: 'Voice Therapy' },
  ];

  const allItems = [...quickLinks, ...quickActions, ...samplePatients];

  const filteredItems = query.trim()
    ? allItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.hint.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-24 px-2.5 sm:px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 sm:left-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, UHID, invoices, reports, pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-7 sm:pl-8 pr-16 py-1 text-xs sm:text-sm bg-transparent border-0 text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          <div className="absolute right-2.5 sm:right-3 flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded border border-slate-300">
              ESC
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">
              No matching clinical records, pages, or commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.category}-${item.label}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'bg-[#301444] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-purple-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#301444]'
                    }`}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block truncate">{item.label}</span>
                      <span className={`text-[10px] font-medium block truncate ${
                        isSelected ? 'text-purple-200' : 'text-slate-400'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isSelected
                        ? 'bg-purple-900/60 text-purple-200 border-purple-400/40'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.hint}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold shadow-2xs">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold shadow-2xs">Enter</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono font-bold shadow-2xs">Esc</kbd> Close
            </span>
          </div>
          <span className="font-semibold text-purple-900 hidden sm:inline">
            Vaani High-Speed Clinical Navigator
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
