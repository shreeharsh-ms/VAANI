import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, MapPin, HeartPulse, FileText } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';

export const PatientForm = ({ onSuccess, onCancel }) => {
  const { notify } = useNotification();
  const formRef = useRef(null);
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newPatient = await patientService.createPatient(formData);
      notify.success(`Patient registered successfully! UHID: ${newPatient.uhid}`);
      if (onSuccess) onSuccess(newPatient);
    } catch (err) {
      setError(err.message || 'Failed to register patient.');
      notify.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5 bg-white text-slate-800 font-sans">
      {error && <Alert variant="danger">{error}</Alert>}

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
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel <span className="opacity-60 text-[10px] font-mono">[Esc]</span>
            </button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1 sm:flex-none justify-center bg-[#301444] hover:bg-[#200b30] text-white font-semibold px-4 py-2 text-xs rounded-lg shadow-xs"
            isLoading={loading}
          >
            <span>Register Patient</span>
            <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/25">
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
