import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Check,
  Search,
  CheckCircle2,
  UserCheck,
  UserPlus,
  X,
  Sparkles,
} from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';
import { SEED_PATIENTS } from '../../data/patientClinicalProfiles';
import { CLINICAL_TIME_SLOTS, normalizeSlotTime, normalizeDate } from '../../utils/formatters';

export const AppointmentForm = ({ onSuccess, initialService = '', onCancel }) => {
  const { notify } = useNotification();
  const formRef = useRef(null);
  const patientDropdownRef = useRef(null);

  // Customer Type: 'EXISTING' | 'NEW'
  const [customerType, setCustomerType] = useState('EXISTING');

  // Existing Patient Search State
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load all registered patients
  const allPatients = useMemo(() => {
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return SEED_PATIENTS;
  }, []);

  // Filter patients by search query
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) {
      return allPatients.slice(0, 8);
    }
    const q = patientSearch.toLowerCase().trim();
    return allPatients.filter((p) => {
      const name = (p.full_name || '').toLowerCase();
      const uhid = (p.uhid || '').toLowerCase();
      const phone = (p.phone || '').toLowerCase();
      const srv = (p.service_line || '').toLowerCase();
      return name.includes(q) || uhid.includes(q) || phone.includes(q) || srv.includes(q);
    });
  }, [allPatients, patientSearch]);

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_uhid: '',
    service_name: initialService || 'Speech & Language Therapy Session',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:15 AM',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Compute live booked slots for selected appointment date
  const bookedSlots = useMemo(() => {
    return appointmentService.getBookedSlotsForDate(normalizeDate(formData.appointment_date));
  }, [formData.appointment_date]);

  // If selected slot is booked, auto-select first available slot
  useEffect(() => {
    const norm = normalizeSlotTime(formData.appointment_time);
    if (bookedSlots.includes(norm)) {
      const firstAvailable = CLINICAL_TIME_SLOTS.find((s) => !bookedSlots.includes(normalizeSlotTime(s)));
      if (firstAvailable) {
        setFormData((prev) => ({ ...prev, appointment_time: firstAvailable }));
      }
    }
  }, [bookedSlots, formData.appointment_date]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(e.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut listener: Ctrl+Enter or Cmd+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Select existing patient from search
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      patient_name: patient.full_name || '',
      patient_phone: patient.phone || '',
      patient_email: patient.email || `${patient.uhid.toLowerCase()}@vaaniclinic.com`,
      patient_uhid: patient.uhid || '',
      reason: patient.diagnosis || prev.reason || '',
      service_name:
        patient.service_line === 'AUDIOLOGY'
          ? 'Pure Tone Audiometry (PTA)'
          : patient.service_line === 'VOICE'
          ? 'Voice Assessment & Vocal Hygiene'
          : patient.service_line === 'CBT_PSYCHOLOGY'
          ? 'Hearing Aid Evaluation & Digital Trial'
          : 'Speech & Language Therapy Session',
    }));
    setShowPatientDropdown(false);
    setPatientSearch('');
    notify.info(`Selected registered patient: ${patient.full_name} (${patient.uhid})`);
  };

  const handleClearSelectedPatient = () => {
    setSelectedPatient(null);
    setFormData((prev) => ({
      ...prev,
      patient_name: '',
      patient_phone: '',
      patient_email: '',
      patient_uhid: '',
      reason: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await appointmentService.bookAppointment(formData);
      setSuccess(true);
      notify.success('Appointment booking recorded successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit appointment request.');
      notify.error('Could not submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 px-4 space-y-3 bg-white">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Appointment Scheduled Successfully!
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Reserved slot for <strong className="text-slate-900">{formData.patient_name}</strong> {formData.patient_uhid ? `(${formData.patient_uhid})` : ''} for{' '}
          <strong className="text-slate-900">{formData.service_name}</strong> on{' '}
          <span className="font-mono font-bold text-purple-900">{formData.appointment_date}</span> at{' '}
          <span className="font-mono font-bold text-purple-900">{formData.appointment_time}</span>.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setSelectedPatient(null);
              setFormData({
                patient_name: '',
                patient_phone: '',
                patient_email: '',
                patient_uhid: '',
                service_name: 'Speech & Language Therapy Session',
                appointment_date: new Date().toISOString().split('T')[0],
                appointment_time: '10:00',
                reason: '',
              });
            }}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5 bg-white text-slate-800 font-sans">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ── CUSTOMER TYPE SELECTOR (EXISTING VS NEW) ── */}
      <div className="p-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setCustomerType('EXISTING');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            customerType === 'EXISTING'
              ? 'bg-[#301444] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Existing Patient</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCustomerType('NEW');
            setSelectedPatient(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            customerType === 'NEW'
              ? 'bg-[#301444] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">New Walk-in</span>
        </button>
      </div>

      {/* ── SEARCH EXISTING PATIENT COMBOBOX ── */}
      {customerType === 'EXISTING' && (
        <div ref={patientDropdownRef} className="p-3 rounded-lg bg-purple-50/70 border border-purple-200/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-950 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-purple-700" />
              <span>Search Master Patient Registry</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {allPatients.length} Registered Patients
            </span>
          </div>

          <div className="relative">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setShowPatientDropdown(true);
                }}
                onFocus={() => setShowPatientDropdown(true)}
                placeholder="Type name, UHID (e.g. VN-26-0001), or phone number..."
                className="w-full h-8 pl-8 pr-7 text-xs bg-white border border-purple-300 rounded-md focus:border-purple-600 focus:outline-hidden"
              />
              {patientSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearch('');
                    setShowPatientDropdown(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {showPatientDropdown && (
              <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white rounded-lg border border-purple-200 shadow-xl divide-y divide-slate-100">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id || p.uhid}
                      onClick={() => handleSelectPatient(p)}
                      className="p-2.5 hover:bg-purple-50/70 transition-colors cursor-pointer flex items-center justify-between text-xs gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold bg-purple-100 text-purple-950 px-1.5 py-0.2 rounded border border-purple-200">
                            {p.uhid}
                          </span>
                          <span className="font-bold text-slate-900">{p.full_name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {p.service_line || p.gender}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{p.phone}</span>
                          {p.city && <span>• {p.city}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded bg-purple-900 text-white hover:bg-purple-950"
                      >
                        Select
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 space-y-1">
                    <p>No patient matching &quot;{patientSearch}&quot;</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerType('NEW');
                        setFormData((prev) => ({ ...prev, patient_name: patientSearch }));
                        setShowPatientDropdown(false);
                      }}
                      className="text-xs font-bold text-purple-800 underline hover:text-purple-950 cursor-pointer"
                    >
                      + Book as New Walk-in Client instead
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Patient Banner */}
          {selectedPatient && (
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-950 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Linked: <strong>{selectedPatient.full_name}</strong> (<strong className="font-mono">{selectedPatient.uhid}</strong>) • {selectedPatient.phone}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearSelectedPatient}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer shrink-0"
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── APPOINTMENT CLIENT DETAILS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Patient Full Name"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          placeholder="e.g. Aarav Deshmukh"
          startIcon={User}
          required
        />

        <Input
          label="Phone Number"
          name="patient_phone"
          value={formData.patient_phone}
          onChange={handleChange}
          placeholder="+91 98220 12345"
          startIcon={Phone}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Email (Optional)"
          name="patient_email"
          type="email"
          value={formData.patient_email}
          onChange={handleChange}
          placeholder="email@example.com"
          startIcon={Mail}
        />

        <Select
          label="Service Required"
          name="service_name"
          value={formData.service_name}
          onChange={handleChange}
          required
          options={[
            { value: 'Pure Tone Audiometry (PTA)', label: 'Pure Tone Audiometry (Hearing Test)' },
            { value: 'Speech & Language Therapy Session', label: 'Speech & Language Therapy' },
            { value: 'Stuttering & Fluency Evaluation', label: 'Fluency / Stuttering Assessment' },
            { value: 'Otoacoustic Emissions (OAE) Screening', label: 'Newborn OAE Hearing Screening' },
            { value: 'Voice Assessment & Vocal Hygiene', label: 'Voice Assessment (GRBAS)' },
            { value: 'Hearing Aid Evaluation & Digital Trial', label: 'Hearing Aid Trial & Fitting' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Preferred Date"
          type="date"
          name="appointment_date"
          value={formData.appointment_date}
          min={new Date().toISOString().split('T')[0]}
          onChange={handleChange}
          startIcon={Calendar}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Available Time Slot
            </label>
            {bookedSlots.length > 0 && (
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} reserved
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 sm:max-h-40 overflow-y-auto pr-0.5">
            {CLINICAL_TIME_SLOTS.map((slot) => {
              const norm = normalizeSlotTime(slot);
              const isBooked = bookedSlots.includes(norm);
              const isSelected = formData.appointment_time === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => !isBooked && setFormData((prev) => ({ ...prev, appointment_time: slot }))}
                  title={isBooked ? 'This slot has already been booked' : `Select ${slot}`}
                  className={`py-1.5 px-2 text-xs font-mono font-medium rounded border transition-all flex items-center justify-between ${
                    isBooked
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                      : isSelected
                      ? 'bg-[#301444] text-white border-[#301444] shadow-xs cursor-pointer'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 cursor-pointer'
                  }`}
                >
                  <span className={isBooked ? 'line-through text-slate-400' : ''}>{slot}</span>
                  {isBooked && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 border border-rose-300 px-1 rounded leading-none">
                      Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Chief Complaint / Clinical Notes
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description of speech/hearing concern or referring doctor"
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:border-purple-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 flex-wrap">
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
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg sm:rounded-md border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none justify-center bg-[#301444] hover:bg-[#200b30] text-white font-bold px-4 py-2 text-xs rounded-lg shadow-xs whitespace-nowrap"
            isLoading={loading}
          >
            <span>Confirm Appointment</span>
            <span className="ml-1.5 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/25">
              <span>Ctrl+↵</span>
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;
