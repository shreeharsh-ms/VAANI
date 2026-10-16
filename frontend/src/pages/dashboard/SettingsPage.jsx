import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Moon, Sun, Server, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { APP_CONFIG, API_CONFIG } from '../../constants';
import { useTheme } from '../../theme/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { clinicService } from '../../services/clinicService';

export const SettingsPage = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { notify } = useNotification();
  const [clinicName, setClinicName] = useState(APP_CONFIG.fullName);
  const [phone, setPhone] = useState(APP_CONFIG.phone);
  const [email, setEmail] = useState(APP_CONFIG.email);
  const [address, setAddress] = useState(APP_CONFIG.location);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    clinicService
      .getHealth()
      .then(setBackendStatus)
      .catch(() => setBackendStatus({ status: 'offline' }));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    notify.success('Clinic configuration settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Clinic Configuration & Preferences"
        subtitle="Manage clinic identity, hours, system theme, and backend connectivity."
      />

      {/* Backend API Health Status */}
      <Card className="p-4 bg-gray-50/70 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Flask API Backend Connectivity
              </p>
              <p className="text-[11px] font-mono text-gray-500">
                {API_CONFIG.baseUrl}
              </p>
            </div>
          </div>
          <div>
            {backendStatus?.status === 'healthy' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                API Online (v{backendStatus.version})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800">
                Ready / Mock Active
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Interface Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current active mode: <strong className="capitalize">{theme}</strong>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              startIcon={isDark ? Sun : Moon}
            >
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Identity Form */}
      <Card>
        <CardHeader>
          <CardTitle>Clinic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Clinic Facility Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Public Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Physical Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" startIcon={Save}>
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
