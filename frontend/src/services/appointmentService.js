import apiClient from './apiClient';
import { getAllAppointments, SEED_APPOINTMENTS } from '../data/appointmentsData';
import { normalizeSlotTime, formatTime } from '../utils/formatters';

const getServiceLineFromName = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('audio') || n.includes('pta') || n.includes('oae') || n.includes('bera') || n.includes('hearing aid') || n.includes('tympan')) {
    return 'AUDIOLOGY';
  }
  if (n.includes('voice') || n.includes('vocal')) {
    return 'VOICE';
  }
  if (n.includes('cbt') || n.includes('counsel') || n.includes('psych')) {
    return 'CBT_PSYCHOLOGY';
  }
  return 'SPEECH_LANGUAGE';
};

const getServiceFee = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('pediatric') || n.includes('newborn') || n.includes('oae') || n.includes('bera')) return 150000;
  if (n.includes('trial') || n.includes('hearing aid')) return 120000;
  if (n.includes('voice') || n.includes('speech')) return 90000;
  if (n.includes('pta')) return 80000;
  return 100000;
};

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
    // Attempt remote booking if server available
    try {
      const res = await apiClient.post('/appointments', appointmentData);
      if (res.data) {
        this.saveLocalAppointment(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Backend booking unavailable, saving locally to clinical store:', err.message);
    }

    // Always persist to local vault
    return this.saveLocalAppointment(appointmentData);
  },

  saveLocalAppointment(appointmentData) {
    let saved = [];
    try {
      const existing = localStorage.getItem('vaani_appointments_v1');
      saved = existing !== null ? JSON.parse(existing) : [...SEED_APPOINTMENTS];
      if (!Array.isArray(saved)) saved = [];
    } catch {
      saved = [...SEED_APPOINTMENTS];
    }

    // Format times
    const startTimeRaw = appointmentData.appointment_time || appointmentData.start_time || '10:15 AM';
    const normalizedStart = normalizeSlotTime(startTimeRaw);

    const srvName = appointmentData.service_name || appointmentData.service || 'Clinical Consultation';
    const srvLine = appointmentData.service_line || getServiceLineFromName(srvName);
    const feePaise = appointmentData.fee_paise || getServiceFee(srvName);

    const nextIdNum = saved.length + 1;
    const uhid = appointmentData.patient_uhid || `VN-26-${String(nextIdNum).padStart(4, '0')}`;

    const newApt = {
      id: appointmentData.id || `apt_${Date.now()}`,
      appointment_date: appointmentData.appointment_date || new Date().toISOString().split('T')[0],
      start_time: normalizedStart,
      end_time: appointmentData.end_time || `${normalizedStart.split(' ')[0]} - 45m`,
      patient_name: appointmentData.patient_name || appointmentData.patientName || 'New Patient',
      patient_phone: appointmentData.patient_phone || appointmentData.phone || '',
      patient_email: appointmentData.patient_email || appointmentData.email || '',
      patient_uhid: uhid,
      patient_age_group: appointmentData.patient_age_group || 'Adult',
      service_name: srvName,
      service_line: srvLine,
      status: appointmentData.status || 'PENDING', // Public bookings start as PENDING for clinician approval
      fee_paise: feePaise,
      payment_status: appointmentData.payment_status || 'PENDING',
      clinician: appointmentData.clinician || 'Dr. Palak Paresh Gandhi',
      notes: appointmentData.reason || appointmentData.notes || '',
      source: appointmentData.source || 'ONLINE_PORTAL',
      created_at: new Date().toISOString(),
    };

    saved.unshift(newApt);
    localStorage.setItem('vaani_appointments_v1', JSON.stringify(saved));

    // Dispatch system events
    window.dispatchEvent(new CustomEvent('vaani-appointments-updated', { detail: { action: 'create', appointment: newApt } }));
    window.dispatchEvent(new Event('storage'));

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
      window.dispatchEvent(new CustomEvent('vaani-appointments-updated', { detail: { action: 'status', id, status } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    return { success: true, status };
  },

  async updateAppointment(id, updatedFields) {
    try {
      await apiClient.patch(`/appointments/${id}`, updatedFields);
    } catch {}

    try {
      const saved = JSON.parse(localStorage.getItem('vaani_appointments_v1') || '[]');
      const updated = saved.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      localStorage.setItem('vaani_appointments_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vaani-appointments-updated', { detail: { action: 'update', id, updatedFields } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    return { success: true };
  },

  async deleteAppointment(id) {
    try {
      await apiClient.delete(`/appointments/${id}`);
    } catch {}

    try {
      const saved = JSON.parse(localStorage.getItem('vaani_appointments_v1') || '[]');
      const updated = saved.filter((a) => a.id !== id);
      localStorage.setItem('vaani_appointments_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vaani-appointments-updated', { detail: { action: 'delete', id } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    return { success: true };
  },

  /**
   * Returns list of booked slots for a given date string (YYYY-MM-DD).
   * A slot is considered booked if an appointment is APPROVED, CONFIRMED, CHECKED_IN, or IN_SESSION.
   */
  getBookedSlotsForDate(dateStr) {
    if (!dateStr) return [];
    try {
      const raw = localStorage.getItem('vaani_appointments_v1');
      if (!raw) return [];
      const apts = JSON.parse(raw);
      if (!Array.isArray(apts)) return [];

      const cleanTargetDate = String(dateStr).split('T')[0];

      return apts
        .filter((a) => {
          if (!a.appointment_date) return false;
          const aDate = String(a.appointment_date).split('T')[0];
          if (aDate !== cleanTargetDate) return false;

          const s = (a.status || '').toUpperCase();
          // Approved or active consultation locks the slot
          return s === 'CONFIRMED' || s === 'APPROVED' || s === 'CHECKED_IN' || s === 'IN_SESSION' || s === 'COMPLETED';
        })
        .map((a) => normalizeSlotTime(a.start_time));
    } catch (e) {
      console.warn('Error reading booked slots:', e);
      return [];
    }
  },

  async getAvailableSlots(date) {
    const defaultSlots = ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM', '05:00 PM', '05:45 PM'];
    const booked = this.getBookedSlotsForDate(date);
    return defaultSlots.filter((slot) => !booked.includes(normalizeSlotTime(slot)));
  },
};

export default appointmentService;
