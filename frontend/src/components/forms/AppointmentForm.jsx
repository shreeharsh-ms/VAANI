import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, Check, Sparkles } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';

export const AppointmentForm = ({ onSuccess, initialService = '', onCancel }) => {
  const { notify } = useNotification();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    service_name: initialService || 'Speech & Language Therapy Session',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    reason: '',
  });

  const [availableSlots, setAvailableSlots] = useState([
    '09:30', '10:15', '11:00', '11:45', '14:00', '14:45', '15:30', '16:15', '17:00'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch slots whenever appointment_date changes
  useEffect(() => {
    if (formData.appointment_date) {
      appointmentService
        .getAvailableSlots(formData.appointment_date)
        .then((slots) => {
          if (slots && slots.length > 0) {
            setAvailableSlots(slots);
            if (!slots.includes(formData.appointment_time)) {
              setFormData((prev) => ({ ...prev, appointment_time: slots[0] }));
            }
          }
        })
        .catch(() => {
          // Fallback slots
        });
    }
  }, [formData.appointment_date]);

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
      await appointmentService.bookAppointment(formData);
      setSuccess(true);
      notify.success('Appointment booking request recorded successfully!');
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
          Reserved slot for <strong className="text-slate-900">{formData.patient_name}</strong> for{' '}
          <strong className="text-slate-900">{formData.service_name}</strong> on{' '}
          <span className="font-mono font-bold text-purple-900">{formData.appointment_date}</span> at{' '}
          <span className="font-mono font-bold text-purple-900">{formData.appointment_time}</span>.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setFormData({
                patient_name: '',
                patient_phone: '',
                patient_email: '',
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Available Time Slot
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, appointment_time: slot }))}
                className={`py-1.5 px-2 text-xs font-semibold rounded-md border transition-all cursor-pointer font-mono ${
                  formData.appointment_time === slot
                    ? 'bg-[#301444] text-white border-[#301444] shadow-xs ring-1 ring-[#301444]'
                    : 'bg-white border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Input
        label="Chief Complaint / Clinical Notes"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Brief description of speech/hearing concern or referring ENT doctor"
        startIcon={FileText}
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
            <span>Confirm &amp; Book Appointment</span>
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

export default AppointmentForm;

