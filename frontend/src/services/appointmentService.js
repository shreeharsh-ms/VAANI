import apiClient from './apiClient';

export const appointmentService = {
  async getAppointments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/appointments${query ? `?${query}` : ''}`;
    const res = await apiClient.get(endpoint);
    return res.data;
  },

  async getAppointmentById(id) {
    const res = await apiClient.get(`/appointments/${id}`);
    return res.data;
  },

  async bookAppointment(appointmentData) {
    const res = await apiClient.post('/appointments', appointmentData);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await apiClient.patch(`/appointments/${id}/status`, { status });
    return res.data;
  },

  async getAvailableSlots(date) {
    const res = await apiClient.get(`/appointments/slots?date=${date}`);
    return res.data?.available_slots || [];
  },
};

export default appointmentService;
