import React from 'react';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

export const AdminHomePage = () => {
  const { clinicName } = useClinicSettings();

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="relative group p-4 transition-transform duration-300 hover:scale-[1.02]">
        <img
          src="/vaani-logo.png"
          alt={clinicName || 'Vaani Speech and Hearing Clinic'}
          className="w-full max-w-[420px] sm:max-w-[560px] md:max-w-[700px] lg:max-w-[820px] h-auto object-contain mx-auto drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default AdminHomePage;
