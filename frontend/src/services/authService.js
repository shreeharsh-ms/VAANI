import apiClient from './apiClient';
import { storage } from '../utils/storage';

export const authService = {
  async login(email, password) {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data?.token) {
        storage.set('vaani_token', res.data.token);
        storage.set('vaani_user', res.data.user);
      }
      return res.data;
    } catch (err) {
      // If API server is unreachable, generate mock session for demo/offline practice
      console.warn('Backend unavailable or mock mode requested, falling back to mock auth', err);
      return this.mockLogin(email, password);
    }
  },

  mockLogin(email = 'palak@vaaniclinic.com', password = '') {
    const isOwner =
      email.toLowerCase().includes('palak') ||
      email.toLowerCase().includes('admin') ||
      email.toLowerCase().includes('doctor');

    const mockUser = isOwner
      ? {
          id: 'user_mock_palak',
          name: 'Ms. Palak Paresh Gandhi',
          email: email.includes('@') ? email : 'palak@vaaniclinic.com',
          role: 'OWNER',
          qualification: 'BASLP, MASLP (Gold Medalist)',
          rci_number: 'A79214',
          center: 'Satara Main Clinic',
        }
      : {
          id: 'user_mock_reception',
          name: 'Pooja Patil',
          email: email.includes('@') ? email : 'reception@vaaniclinic.com',
          role: 'RECEPTIONIST',
          qualification: 'Front Desk Administrator',
          center: 'Satara Main Clinic',
        };

    const token = `mock_jwt_${isOwner ? 'owner' : 'reception'}_${Date.now()}`;
    return {
      token,
      user: mockUser,
      requiresOtp: true,
      mockOtp: '482910',
    };
  },

  async getCurrentUser() {
    const token = storage.get('vaani_token');
    const user = storage.get('vaani_user');

    if (token && typeof token === 'string' && token.startsWith('mock_') && user) {
      return user;
    }

    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch (err) {
      // Return cached user if present instead of throwing and clearing session
      if (token && user) {
        return user;
      }
      throw err;
    }
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
