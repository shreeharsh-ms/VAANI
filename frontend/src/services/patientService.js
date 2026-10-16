import apiClient from './apiClient';

export const patientService = {
  async getPatients(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/patients${query ? `?${query}` : ''}`;
    const res = await apiClient.get(endpoint);
    return res.data;
  },

  async getPatientById(id) {
    const res = await apiClient.get(`/patients/${id}`);
    return res.data;
  },

  async createPatient(patientData) {
    const res = await apiClient.post('/patients', patientData);
    return res.data;
  },

  async updatePatient(id, patientData) {
    const res = await apiClient.put(`/patients/${id}`, patientData);
    return res.data;
  },

  async deletePatient(id) {
    const res = await apiClient.delete(`/patients/${id}`);
    return res.data;
  },
};

export default patientService;
