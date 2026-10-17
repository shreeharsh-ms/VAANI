import apiClient from './apiClient';
import { getAllAppointments, SEED_APPOINTMENTS } from '../data/appointmentsData';
import { normalizeSlotTime, formatTime, normalizeDate, getAppointmentSlotsCovered, CLINICAL_TIME_SLOTS } from '../utils/formatters';

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
   * Returns list of booked slots for a given date string.
   * Uses normalizeDate() to accurately compare dates across formats (ISO, YYYY-MM-DD, DD/MM/YYYY).
   * Any active appointment that is NOT Cancelled or No-Show blocks the slot (and all covered overlapping slots).
   */
  getBookedSlotsForDate(dateStr) {
    if (!dateStr) return [];
    try {
      const raw = localStorage.getItem('vaani_appointments_v1');
      let apts = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) apts = parsed;
        } catch {}
      }
      if (apts.length === 0) {
        apts = getAllAppointments();
      }

      const cleanTargetDate = normalizeDate(dateStr);
      if (!cleanTargetDate) return [];

      const bookedSet = new Set();

      apts.forEach((a) => {
        if (!a.appointment_date) return;
        const aDate = normalizeDate(a.appointment_date);
        if (aDate !== cleanTargetDate) return;

        const s = (a.status || '').toUpperCase();
        // Cancelled, denied or no-show releases the slot
        if (s === 'CANCELLED' || s === 'NO_SHOW' || s === 'DENIED') return;

        // Extract all slots covered by this appointment
        const covered = getAppointmentSlotsCovered(a);
        covered.forEach((slot) => bookedSet.add(slot));
      });

      return Array.from(bookedSet);
    } catch (e) {
      console.warn('Error reading booked slots:', e);
      return [];
    }
  },

  async getAvailableSlots(date) {
    const booked = this.getBookedSlotsForDate(date);
    return CLINICAL_TIME_SLOTS.filter((slot) => !booked.includes(normalizeSlotTime(slot)));
  },
};

export default appointmentService;
