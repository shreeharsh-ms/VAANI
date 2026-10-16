import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, Check } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { appointmentService } from '../../services/appointmentService';
import { useNotification } from '../../context/NotificationContext';

export const AppointmentForm = ({ onSuccess, initialService = '' }) => {
  const { notify } = useNotification();
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
      notify.success('Appointment booking request received successfully!');
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
      <div className="text-center py-8 px-4 space-y-4">
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Appointment Scheduled!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Thank you, <strong>{formData.patient_name}</strong>. Your session for{' '}
          <strong>{formData.service_name}</strong> is reserved on{' '}
          <strong>{formData.appointment_date}</strong> at{' '}
          <strong>{formData.appointment_time}</strong>. Our front desk will confirm your slot via SMS/Call.
        </p>
        <Button
          variant="outline"
          size="sm"
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
        >
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Available Time Slot
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, appointment_time: slot }))}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                  formData.appointment_time === slot
                    ? 'bg-[#6b21a8] text-white border-[#6b21a8] shadow-sm'
                    : 'border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-[#311444] dark:text-purple-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Input
        label="Chief Complaint / Notes"
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Brief description of speech/hearing concern or referring doctor"
        startIcon={FileText}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          Confirm & Book Appointment
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
