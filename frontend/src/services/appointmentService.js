import apiClient from './apiClient';
import { getAllAppointments, SEED_APPOINTMENTS } from '../data/appointmentsData';

export const appointmentService = {
  async getAppointments(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/appointments${query ? `?${query}` : ''}`;
      const res = await apiClient.get(endpoint);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {}

    return getAllAppointments();
  },

  async getAppointmentById(id) {
    try {
      const res = await apiClient.get(`/appointments/${id}`);
      if (res.data) return res.data;
    } catch {}

    const all = getAllAppointments();
    return all.find((a) => a.id === id) || null;
  },

  async bookAppointment(appointmentData) {
    // Attempt remote booking
    try {
      const res = await apiClient.post('/appointments', appointmentData);
      if (res.data) {
        this.saveLocalAppointment(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Backend booking unavail, saving locally:', err.message);
    }

    // Always persist to local vault
    return this.saveLocalAppointment(appointmentData);
  },

  saveLocalAppointment(appointmentData) {
    let saved = [];
    try {
      const existing = localStorage.getItem('vaani_appointments_v1');
      saved = existing ? JSON.parse(existing) : [...SEED_APPOINTMENTS];
    } catch {
      saved = [...SEED_APPOINTMENTS];
    }

    const newApt = {
      id: appointmentData.id || `apt_${Date.now()}`,
      appointment_date: appointmentData.appointment_date || new Date().toISOString().split('T')[0],
      start_time: appointmentData.appointment_time || appointmentData.start_time || '10:00',
      end_time: appointmentData.end_time || '10:45',
      patient_name: appointmentData.patient_name || appointmentData.patientName || 'New Patient',
      patient_phone: appointmentData.patient_phone || appointmentData.phone || '',
      patient_email: appointmentData.patient_email || appointmentData.email || '',
      patient_uhid: appointmentData.patient_uhid || '',
      service_name: appointmentData.service_name || appointmentData.service || 'Clinical Consultation',
      service_line: appointmentData.service_line || 'SPEECH_LANGUAGE',
      status: 'CONFIRMED',
      fee_paise: 150000,
      payment_status: 'PENDING',
      clinician: 'Dr. Palak Paresh Gandhi',
      notes: appointmentData.reason || appointmentData.notes || '',
    };

    saved.unshift(newApt);
    localStorage.setItem('vaani_appointments_v1', JSON.stringify(saved));
    return newApt;
  },

  async updateStatus(id, status) {
    try {
      await apiClient.patch(`/appointments/${id}/status`, { status });
    } catch {}

    try {
      const saved = JSON.parse(localStorage.getItem('vaani_appointments_v1') || '[]');
      const updated = saved.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('vaani_appointments_v1', JSON.stringify(updated));
    } catch {}

    return { success: true, status };
  },

  async getAvailableSlots(date) {
    try {
      const res = await apiClient.get(`/appointments/slots?date=${date}`);
      if (res.data?.available_slots?.length > 0) {
        return res.data.available_slots;
      }
    } catch {}

    return ['09:30', '10:15', '11:00', '11:45', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45'];
  },
};

export default appointmentService;
