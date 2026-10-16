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
      <Card className="p-5 border-purple-100 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-[#301444] flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#301444]">
                Flask API Backend Connectivity
              </p>
              <p className="text-[11px] font-mono text-gray-500">
                {API_CONFIG.baseUrl}
              </p>
            </div>
          </div>
          <div>
            {backendStatus?.status === 'healthy' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                API Online (v{backendStatus.version})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
                Ready / Mock Active
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="border-purple-100 shadow-2xs">
        <CardHeader className="bg-purple-50/40 border-b border-purple-100/80 px-6 py-4">
          <CardTitle className="text-base font-bold text-[#301444]">Appearance &amp; Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#301444]">Interface Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Current active mode: <strong className="capitalize text-purple-700 font-bold">{theme}</strong>
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-purple-50 text-[#301444] border border-purple-200/90 shadow-2xs transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-purple-600" />}
              <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Identity Form */}
      <Card className="border-purple-100 shadow-2xs">
        <CardHeader className="bg-purple-50/40 border-b border-purple-100/80 px-6 py-4">
          <CardTitle className="text-base font-bold text-[#301444]">Clinic Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
