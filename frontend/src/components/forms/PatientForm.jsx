import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  FileText,
  CalendarCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';
import { getAllAppointments } from '../../data/appointmentsData';
import { SEED_PATIENTS } from '../../data/patientClinicalProfiles';

export const PatientForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const formRef = useRef(null);
  const appointmentDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'Male',
    date_of_birth: '2015-01-01',
    phone: '',
    email: '',
    city: 'Satara',
    address: '',
    guardian_name: '',
    guardian_relationship: 'Parent',
    service_line: 'SPEECH_LANGUAGE',
    primary_concern: '',
    medical_history: '',
    preferred_channel: 'WHATSAPP',
    best_calling_time: '17:00 - 19:30 IST',
    home_language: 'Marathi',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Appointment Search & Auto-fill State
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Load all appointments from database/localStorage
  const availableAppointments = useMemo(() => {
    return getAllAppointments();
  }, []);

  // Load registered patients to detect if customer already exists (e.g. Aarav Sachin Shinde)
  const allRegisteredPatients = useMemo(() => {
    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return SEED_PATIENTS;
  }, []);

  // Detect existing patient match
  const existingPatientMatch = useMemo(() => {
    // 1. By appointment uhid if set
    if (selectedAppointment?.patient_uhid) {
      const byUhid = allRegisteredPatients.find(
        (p) => p.uhid?.toLowerCase() === selectedAppointment.patient_uhid.toLowerCase()
      );
      if (byUhid) return byUhid;
    }

    // 2. By Name or Phone match in current form
    const currentFullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim().toLowerCase();
    const currentPhone = (formData.phone || '').trim().replace(/\D/g, '');

    if (currentFullName.length < 3 && currentPhone.length < 10) return null;

    return (
      allRegisteredPatients.find((p) => {
        const pName = (p.full_name || '').trim().toLowerCase();
        const pPhone = (p.phone || '').trim().replace(/\D/g, '');

        const exactName = currentFullName.length > 3 && pName === currentFullName;
        const nameContains = currentFullName.length > 5 && (pName.includes(currentFullName) || currentFullName.includes(pName));
        const phoneMatch = currentPhone.length >= 10 && pPhone.length >= 10 && pPhone.slice(-10) === currentPhone.slice(-10);

        return exactName || (nameContains && phoneMatch) || phoneMatch;
      }) || null
    );
  }, [selectedAppointment, formData.first_name, formData.last_name, formData.phone, allRegisteredPatients]);

  // Filter appointments for auto-complete lookup
  const filteredAppointments = useMemo(() => {
    if (!appointmentSearch.trim()) {
      return availableAppointments.slice(0, 10);
    }
    const q = appointmentSearch.toLowerCase().trim();
    return availableAppointments.filter((apt) => {
      const name = (apt.patient_name || apt.patientName || '').toLowerCase();
      const phone = (apt.patient_phone || apt.phone || '').toLowerCase();
      const srv = (apt.service_name || apt.service || '').toLowerCase();
      const uhid = (apt.patient_uhid || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || srv.includes(q) || uhid.includes(q);
    });
  }, [availableAppointments, appointmentSearch]);

  // Click outside listener for appointment dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (appointmentDropdownRef.current && !appointmentDropdownRef.current.contains(e.target)) {
        setShowAppointmentDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Auto-fill form from selected appointment
  const handleSelectAppointment = (aptId) => {
    const apt = availableAppointments.find((a) => a.id === aptId);
    if (!apt) return;

    const fullName = (apt.patient_name || apt.patientName || '').trim();
    const parts = fullName.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || (parts.length > 1 ? parts[parts.length - 1] : '');

    let detectedServiceLine = 'SPEECH_LANGUAGE';
    const srvCombined = `${apt.service_name || ''} ${apt.service || ''} ${apt.service_line || ''}`.toUpperCase();
    if (srvCombined.includes('AUD') || srvCombined.includes('HEARING') || srvCombined.includes('PTA') || srvCombined.includes('OAE') || srvCombined.includes('TYMP')) {
      detectedServiceLine = 'AUDIOLOGY';
    } else if (srvCombined.includes('VOI') || srvCombined.includes('STROBOSCOPY') || srvCombined.includes('LARYNX')) {
      detectedServiceLine = 'VOICE';
    } else if (srvCombined.includes('CBT') || srvCombined.includes('COUNSEL') || srvCombined.includes('PSYCH')) {
      detectedServiceLine = 'CBT_PSYCHOLOGY';
    }

    setFormData((prev) => ({
      ...prev,
      first_name: firstName || prev.first_name,
      last_name: lastName || prev.last_name,
      phone: apt.patient_phone || apt.phone || prev.phone,
      service_line: apt.service_line || detectedServiceLine,
      city: apt.city || prev.city || 'Satara',
      guardian_name: apt.guardian_name || prev.guardian_name || '',
      primary_concern: apt.primary_concern || apt.service_name || apt.service || prev.primary_concern || '',
      preferred_channel: apt.preferred_channel || prev.preferred_channel || 'WHATSAPP',
      best_calling_time: apt.best_calling_time || prev.best_calling_time || '17:00 - 19:30 IST',
      home_language: apt.home_language || prev.home_language || 'Marathi',
    }));

    setSelectedAppointment(apt);
    setShowAppointmentDropdown(false);
    setAppointmentSearch('');

    if (apt.patient_uhid) {
      notify.info(`Loaded appointment for registered patient ${fullName} (${apt.patient_uhid})`);
    } else {
      notify.info(`Auto-filled new client details for "${fullName}" from appointment schedule.`);
    }
  };

  const handleClearAutofill = () => {
    setSelectedAppointment(null);
  };

  const handleSubmit = async (e, nextAction = 'DEFAULT') => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        ...(existingPatientMatch
          ? {
              id: existingPatientMatch.id,
              uhid: existingPatientMatch.uhid,
              date_of_birth: existingPatientMatch.date_of_birth || formData.date_of_birth,
            }
          : {}),
      };

      const resultPatient = await patientService.createPatient(payload);

      if (existingPatientMatch) {
        notify.success(`Patient profile for ${resultPatient.full_name} (${resultPatient.uhid}) updated!`);
      } else {
        notify.success(`Patient registered successfully! UHID: ${resultPatient.uhid}`);
      }

      if (onSuccess) {
        onSuccess(resultPatient, nextAction);
      }

      if (nextAction === 'EDH') {
        const targetUhid = resultPatient.uhid || existingPatientMatch?.uhid || resultPatient.id;
        navigate(`/dashboard/reports/create?type=RP-CLN-EDH&patient=${targetUhid}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save patient profile.');
      notify.error('Could not save patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={(e) => handleSubmit(e, 'DEFAULT')} className="space-y-3.5 bg-white text-slate-800 font-sans">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ── ALREADY REGISTERED PATIENT NOTICE (e.g. Aarav Sachin Shinde) ── */}
      {existingPatientMatch && (
        <div className="p-2.5 sm:p-3 rounded-lg bg-amber-50/90 border border-amber-300 text-amber-950 space-y-1.5 sm:space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-xs hidden sm:inline">
                Patient Already Exists in Registry:
              </span>
              <span className="font-bold text-xs sm:hidden">
                Already Registered:
              </span>
              <strong className="text-xs text-slate-900">{existingPatientMatch.full_name}</strong>
              <span className="font-mono text-[10px] font-black bg-purple-900 text-white px-1.5 py-0.5 rounded shadow-2xs">
                {existingPatientMatch.uhid}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-amber-900 leading-snug sm:hidden">
            Already registered. Submitting updates existing file.
          </p>
          <p className="hidden sm:block text-[11px] text-amber-900 leading-relaxed">
            <strong>{existingPatientMatch.full_name}</strong> is already registered under <strong>{existingPatientMatch.uhid}</strong>. Submitting will update their existing clinical file without generating duplicates. You can also jump straight to Early Dev History or view their complete dossier.
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-1 border-t border-amber-200">
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                navigate(`/dashboard/reports/create?type=RP-CLN-EDH&patient=${existingPatientMatch.uhid || existingPatientMatch.id}`);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded text-xs font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-purple-200 shrink-0" />
              <span className="hidden sm:inline">Proceed to Early Dev History (EDH)</span>
              <span className="sm:hidden">Proceed to EDH</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                navigate(`/dashboard/patients/${existingPatientMatch.uhid || existingPatientMatch.id}`);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 rounded text-xs font-bold bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-purple-800 shrink-0" />
              <span className="hidden sm:inline">Open Patient Dossier [{existingPatientMatch.uhid}]</span>
              <span className="sm:hidden">Open Dossier</span>
              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* ── QUICK IMPORT FROM APPOINTMENTS & NEW ARRIVED VISITORS ── */}
      <div ref={appointmentDropdownRef} className="p-3 rounded-lg bg-gradient-to-r from-purple-50/90 via-purple-50/50 to-indigo-50/60 border border-purple-200/90 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
            <CalendarCheck className="w-4 h-4 text-purple-700" />
            <span>Search &amp; Auto-fill from Appointments (New Arrived Clients)</span>
          </div>
          <span className="text-[10px] text-purple-800 font-mono font-semibold bg-white/80 px-2 py-0.5 rounded border border-purple-200">
            {availableAppointments.length} Active Slots
          </span>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appointmentSearch}
                onChange={(e) => {
                  setAppointmentSearch(e.target.value);
                  setShowAppointmentDropdown(true);
                }}
                onFocus={() => setShowAppointmentDropdown(true)}
                placeholder="Search appointments by customer name, phone, or test reason..."
                className="w-full h-8 pl-8 pr-7 text-xs bg-white border border-purple-300 rounded-md focus:border-purple-600 focus:outline-hidden"
              />
              {appointmentSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setAppointmentSearch('');
                    setShowAppointmentDropdown(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectAppointment(e.target.value);
                }
              }}
              value=""
              className="h-8 px-2 text-xs bg-white border border-purple-300 rounded-md font-medium text-slate-700 focus:border-purple-600 focus:outline-hidden cursor-pointer max-w-[200px] truncate"
            >
              <option value="">Choose Appointment...</option>
              <optgroup label="★ New Walk-in Clients (Need Registration)">
                {availableAppointments
                  .filter((a) => !a.patient_uhid)
                  .map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.patient_name || apt.patientName} ({apt.start_time || apt.time || 'Apt'}) [New Walk-in]
                    </option>
                  ))}
              </optgroup>
              <optgroup label="📁 Registered Patients (On Schedule)">
                {availableAppointments
                  .filter((a) => Boolean(a.patient_uhid))
                  .map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.patient_name || apt.patientName} ({apt.start_time || apt.time || 'Apt'}) [{apt.patient_uhid}]
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Search Dropdown Results */}
          {showAppointmentDropdown && filteredAppointments.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white rounded-lg border border-purple-200 shadow-xl divide-y divide-slate-100">
              <div className="p-1.5 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Select an appointment to pre-fill form fields:</span>
                <span className="text-purple-700 font-mono">{filteredAppointments.length} Found</span>
              </div>
              {filteredAppointments.map((apt) => {
                const isNew = !apt.patient_uhid;
                return (
                  <div
                    key={apt.id}
                    onClick={() => handleSelectAppointment(apt.id)}
                    className="p-2.5 hover:bg-purple-50/70 transition-colors cursor-pointer flex items-center justify-between text-xs gap-2"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{apt.patient_name || apt.patientName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                          isNew ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isNew ? 'New Client / Walk-in' : apt.patient_uhid}
                        </span>
                        <span className="text-[10px] text-purple-700 font-semibold font-mono">
                          {apt.start_time || apt.time} • {apt.appointment_date || 'Today'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap truncate">
                        <span>{apt.patient_phone || apt.phone}</span>
                        <span>•</span>
                        <span className="truncate max-w-sm text-slate-700">{apt.service_name || apt.service}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded bg-purple-900 text-white hover:bg-purple-950 transition-colors"
                    >
                      Fill Form
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedAppointment && (
          <div className="p-2 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Form auto-filled from appointment: <strong>{selectedAppointment.patient_name || selectedAppointment.patientName}</strong> ({selectedAppointment.start_time || selectedAppointment.time}) — {selectedAppointment.service_name || selectedAppointment.service}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearAutofill}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer shrink-0"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First name"
          startIcon={User}
          required
        />
        <Input
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last name"
          startIcon={User}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          required
        />
        <Input
          label="Date of Birth"
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <Select
          label="Primary Service Line"
          name="service_line"
          value={formData.service_line}
          onChange={handleChange}
          options={[
            { value: 'SPEECH_LANGUAGE', label: 'Speech & Language' },
            { value: 'AUDIOLOGY', label: 'Audiology / Hearing' },
            { value: 'VOICE', label: 'Voice Rehab' },
            { value: 'CBT_PSYCHOLOGY', label: 'Psychology / CBT' },
          ]}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98220 12345"
          startIcon={Phone}
          required
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          startIcon={Mail}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Guardian Name (if pediatric/elderly)"
          name="guardian_name"
          value={formData.guardian_name}
          onChange={handleChange}
          placeholder="e.g. Mother / Father name"
          startIcon={User}
        />
        <Input
          label="City / Locality"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Satara"
          startIcon={MapPin}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Preferred Communication"
          name="preferred_channel"
          value={formData.preferred_channel}
          onChange={handleChange}
          options={[
            { value: 'WHATSAPP', label: 'WhatsApp (Preferred)' },
            { value: 'CALL', label: 'Direct Phone Call' },
            { value: 'SMS', label: 'SMS Text' },
            { value: 'EMAIL', label: 'Email' },
          ]}
        />
        <Input
          label="Preferred Calling Hours"
          name="best_calling_time"
          value={formData.best_calling_time}
          onChange={handleChange}
          placeholder="e.g. 17:00 - 19:30 IST"
        />
        <Select
          label="Home / Primary Language"
          name="home_language"
          value={formData.home_language}
          onChange={handleChange}
          options={[
            { value: 'Marathi', label: 'Marathi' },
            { value: 'Hindi', label: 'Hindi' },
            { value: 'English', label: 'English' },
            { value: 'Kannada', label: 'Kannada' },
            { value: 'Gujarati', label: 'Gujarati' },
          ]}
        />
      </div>

      <Input
        label="Primary Clinical Concern"
        name="primary_concern"
        value={formData.primary_concern}
        onChange={handleChange}
        placeholder="e.g. Speech delay, stuttering, difficulty hearing in noise"
        startIcon={HeartPulse}
        required
      />

      {/* Action Footer with Mac & Windows Shortcuts */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="hidden sm:flex text-[11px] text-slate-500 items-center gap-1.5 flex-wrap">
          <span>Submit:</span>
          <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
            Ctrl+↵
          </span>
          <span className="text-slate-400">or</span>
          <span className="font-mono font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
            ⌘↵ (Mac)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Cancel <span className="hidden sm:inline opacity-60 text-[10px] font-mono">[Esc]</span>
            </button>
          )}

          {/* Action 1: Save & Fill Early Dev History (EDH) */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'EDH')}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 shadow-2xs transition-colors cursor-pointer text-center"
            title="Save patient profile and proceed to Early Developmental History questionnaire"
          >
            <FileText className="w-3.5 h-3.5 text-purple-800 flex-shrink-0" />
            <span>Save &amp; Add History (EDH)</span>
          </button>

          {/* Action 2: Save / Update Patient */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="justify-center bg-[#301444] hover:bg-[#200b30] text-white font-semibold px-4 py-2 text-xs rounded-lg shadow-xs text-center"
            isLoading={loading}
          >
            <span>{existingPatientMatch ? 'Update Patient Record' : 'Register Patient'}</span>
            <span className="hidden sm:inline-flex ml-2 items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/25">
              <span>Ctrl+↵</span>
              <span className="opacity-60">/</span>
              <span>⌘↵</span>
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PatientForm;
