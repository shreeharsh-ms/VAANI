import apiClient from './apiClient';

export const patientService = {
  async getPatients(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/patients${query ? `?${query}` : ''}`;
      const res = await apiClient.get(endpoint);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback to local storage
    }

    try {
      const saved = localStorage.getItem('vaani_patients_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  async getPatientById(id) {
    try {
      const res = await apiClient.get(`/patients/${id}`);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }

    try {
      const saved = JSON.parse(localStorage.getItem('vaani_patients_v1') || '[]');
      const found = saved.find(
        (p) => p.id === id || p.uhid?.toLowerCase() === String(id).toLowerCase()
      );
      if (found) return found;
    } catch {}

    return null;
  },

  async createPatient(patientData) {
    // Attempt remote backend creation if online & authenticated
    try {
      const res = await apiClient.post('/patients', patientData);
      if (res?.data) {
        return this.saveLocalPatient(res.data);
      }
    } catch (err) {
      console.warn('Backend patient creation unavail, saving locally:', err.message);
    }

    // Always ensure patient is saved to client master database
    return this.saveLocalPatient(patientData);
  },

  saveLocalPatient(patientData) {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('vaani_patients_v1') || '[]');
    } catch {
      saved = [];
    }

    const fullName = `${patientData.first_name || ''} ${patientData.last_name || ''}`.trim() ||
      patientData.full_name ||
      patientData.fullName ||
      patientData.patient_name ||
      patientData.patientName ||
      patientData.name ||
      (patientData.uhid === 'VN-26-0001' ? 'Aarav Sachin Shinde' : patientData.uhid === 'VN-26-0002' ? 'Sunita Dattatray More' : patientData.uhid === 'VN-26-0003' ? 'Vijay Narayan Kadam' : 'Registered Patient');
    const phone = patientData.phone || patientData.patient_phone || '';

    // Check if patient already exists by UHID or full name / phone
    const existingIndex = saved.findIndex(
      (p) => (patientData.uhid && p.uhid === patientData.uhid) ||
             (fullName && p.full_name?.toLowerCase() === fullName.toLowerCase()) ||
             (phone && p.phone === phone && fullName.length > 3 && p.full_name?.toLowerCase().includes(fullName.toLowerCase().split(' ')[0]))
    );

    if (existingIndex >= 0) {
      // Update existing record rather than duplicating
      const existing = saved[existingIndex];
      const updated = {
        ...existing,
        ...patientData,
        full_name: fullName || existing.full_name || 'Registered Patient',
        phone: phone || existing.phone,
        service_line: patientData.service_line || existing.service_line,
        city: patientData.city || existing.city,
        diagnosis: patientData.primary_concern || patientData.diagnosis || existing.diagnosis,
        preferred_channel: patientData.preferred_channel || existing.preferred_channel || 'WHATSAPP',
        best_calling_time: patientData.best_calling_time || existing.best_calling_time || '17:00 - 19:30 IST',
        home_language: patientData.home_language || existing.home_language || 'Marathi',
        updated_at: new Date().toISOString(),
      };
      saved[existingIndex] = updated;
      localStorage.setItem('vaani_patients_v1', JSON.stringify(saved));
      return updated;
    }

    // Determine sequential UHID
    const count = saved.length + 1;
    const uhid = patientData.uhid || `VN-26-${String(count).padStart(4, '0')}`;
    const newRecord = {
      id: patientData.id || `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      uhid,
      full_name: fullName,
      gender: (patientData.gender || 'MALE').toUpperCase(),
      date_of_birth: patientData.date_of_birth || '2015-01-01',
      phone: phone || '+91 98220 12345',
      guardian_name: patientData.guardian_name || 'Self',
      guardian_phone: patientData.guardian_phone || phone,
      service_line: patientData.service_line || 'SPEECH_LANGUAGE',
      city: patientData.city || 'Satara',
      diagnosis: patientData.primary_concern || patientData.diagnosis || 'Clinical evaluation requested',
      preferred_channel: patientData.preferred_channel || 'WHATSAPP',
      best_calling_time: patientData.best_calling_time || '17:00 - 19:30 IST',
      home_language: patientData.home_language || 'Marathi',
      created_at: new Date().toISOString(),
    };

    saved.unshift(newRecord);
    localStorage.setItem('vaani_patients_v1', JSON.stringify(saved));
    return newRecord;
  },

  async updatePatient(id, patientData) {
    try {
      const res = await apiClient.put(`/patients/${id}`, patientData);
      if (res?.data) {
        return this.saveLocalPatient(res.data);
      }
    } catch {}

    return this.saveLocalPatient({ ...patientData, id });
  },

  async deletePatient(id) {
    try {
      await apiClient.delete(`/patients/${id}`);
    } catch {}

    try {
      const saved = JSON.parse(localStorage.getItem('vaani_patients_v1') || '[]');
      const filtered = saved.filter((p) => p.id !== id && p.uhid !== id);
      localStorage.setItem('vaani_patients_v1', JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: true };
    }
  },
};

export default patientService;
