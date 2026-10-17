export { AuthProvider, useAuth } from './AuthContext';
export { NotificationProvider, useNotification } from './NotificationContext';
export { ThemeProvider, useTheme } from '../theme/ThemeContext';
export {
  ClinicSettingsProvider,
  useClinicSettings,
  getClinicSettings,
  saveClinicSettings,
  DEFAULT_CLINIC_SETTINGS,
  formatClinicAddress,
  formatClinicHelpline,
} from './ClinicSettingsContext';
