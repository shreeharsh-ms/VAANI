import apiClient from './apiClient';

export const clinicService = {
  async getServices(category = null) {
    const endpoint = category ? `/services?category=${category}` : '/services';
    const res = await apiClient.get(endpoint);
    return res.data;
  },

  async getHealth() {
    const res = await apiClient.get('/health');
    return res.data;
  },

  async getClinicalAssessments(patientId = null) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('vaani_token') : null;
      if (!token || token.includes('mock_')) {
        return [];
      }
      const endpoint = patientId ? `/clinical/assessments?patient_id=${patientId}` : '/clinical/assessments';
      const res = await apiClient.get(endpoint);
      return res.data || [];
    } catch {
      return [];
    }
  },
};

export default clinicService;
