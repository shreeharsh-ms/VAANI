import apiClient from './apiClient';
import { storage } from '../utils/storage';

export const authService = {
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.token) {
      storage.set('vaani_token', res.data.token);
      storage.set('vaani_user', res.data.user);
    }
    return res.data;
  },

  async getCurrentUser() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      storage.remove('vaani_token');
      storage.remove('vaani_user');
    }
  },

  getStoredUser() {
    return storage.get('vaani_user');
  },

  getStoredToken() {
    return storage.get('vaani_token');
  },

  isAuthenticated() {
    return Boolean(storage.get('vaani_token'));
  },
};

export default authService;
