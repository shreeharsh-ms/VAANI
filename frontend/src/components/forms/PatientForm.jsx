import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, HeartPulse, FileText } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';

export const PatientForm = ({ onSuccess, onCancel }) => {
  const { notify } = useNotification();
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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        {onCancel && (
          <Button variant="outline" size="md" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" isLoading={loading}>
          Register Patient
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
