import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export const CLINIC_SETTINGS_STORAGE_KEY = 'vaani_clinic_settings_v1';
export const CLINIC_SETTINGS_EVENT = 'vaani-clinic-settings-updated';

export const DEFAULT_CLINIC_SETTINGS = {
  identity: {
    legalName: 'Vaani Speech & Hearing Clinic',
    tradeName: 'Vaani Clinic',
    taglineEn: 'Speak • Hear • Connect',
    taglineMr: 'स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा',
    logoUrl: '/vaani-logo.png',
    logoWhiteUrl: '/vaani-logo-white.png',
    letterheadTitle: 'VAANI SPEECH & HEARING REHABILITATION CENTER',
    stampNote: 'RCI Registered Practitioner Seal (CRR No. A79214)',
  },
  contact: {
    primaryPhone: '+91 98220 12345',
    whatsappEnabled: true,
    consultationPhone: '+91 94230 99887',
    officialEmail: 'info@vaaniclinic.com',
    websiteUrl: 'https://vaaniclinic.com',
    addressLine1: 'Shop No. 4, Ground Floor, Sadashiv Arcade',
    addressLine2: 'Opp. Satara Zilla Parishad, Sadashiv Peth',
    locality: 'Sadashiv Peth',
    taluka: 'Satara',
    district: 'Satara',
    state: 'Maharashtra',
    pin: '415002',
    landmarkEn: 'Opposite Zilla Parishad Gate',
    landmarkMr: 'जिल्हा परिषद गेटसमोर',
    mapsUrl: 'https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Satara',
    geoCoordinates: '73.9934, 17.6833',
    parkingNote: 'Dedicated two-wheeler parking in front; four-wheeler street parking on main road.',
    accessibilityNote: 'Ground-floor wheelchair accessible entrance with permanent entrance ramp.',
  },
  credentials: {
    rciNumber: 'A79214',
    rciVerified: true,
    rciValidUntil: '2031-10-15',
    titlePermitted: true,
    cbtQualificationVerified: true,
    cbtDegree: 'Postgraduate Cognitive Behavioural Interventions (SASLP / BVDU)',
    clinicalEstablishmentNo: 'MH-STR-CEA-2024-0081',
    shopActNo: 'STR-SA-2024-0192',
    udyamNo: 'UDYAM-MH-28-0012345',
    gstin: '27AAAAA0000A1Z5',
    panMasked: 'ABCDE****F',
  },
  hours: {
    slotGranularityMin: 15,
    timezone: 'Asia/Kolkata',
    morningStart: '10:00',
    morningEnd: '13:30',
    eveningStart: '15:30',
    eveningEnd: '20:00',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    sundayClosed: true,
  },
  bookingPolicy: {
    minNoticeMin: 120,
    maxAdvanceDays: 30,
    holdHours: 24,
    autoConfirm: false,
    cancelWindowHours: 4,
    rescheduleLimit: 2,
    sameDayAllowed: true,
    graceNoShowMin: 15,
    ptaDailyCap: 5,
    speechTherapyDailyCap: 8,
  },
  billing: {
    uhidPrefix: 'VN-',
    uhidFormat: 'VN-YY-######',
    invoicePrefix: 'INV-2026-',
    receiptPrefix: 'REC-2026-',
    resetFiscalCycle: '04-01',
    serviceTaxPercent: 0,
    productTaxPercent: 18,
    sacCode: '999312',
    hsnCode: '9021',
    showGstOnInvoice: false,
    roundingMode: 'NEAREST_INTEGER',
    upiId: 'vaaniclinic@okaxis',
    upiName: 'Vaani Speech & Hearing Clinic',
    bankAccountName: 'Vaani Speech & Hearing Clinic',
    bankName: 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara',
    bankIfsc: 'HDFC0000123',
    bankAccountMasked: '**** **** **** 4892',
  },
  notifications: {
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    reminderOffset1Hours: 24,
    reminderOffset2Hours: 2,
    senderEmail: 'appointments@vaaniclinic.com',
    senderDisplayName: 'Vaani Speech & Hearing Clinic',
    grievanceOfficerName: 'Ms. Palak Paresh Gandhi',
    grievanceEmail: 'grievance@vaaniclinic.com',
    grievancePhone: '+91 98220 12345',
    adultRetentionYears: 7,
    minorRetentionAge: 21,
    billingRetentionYears: 8,
    auditRetentionYears: 7,
  },
  features: {
    inventory: true,
    expenses: true,
    packages: true,
    cbt: true,
    onlineBooking: true,
    waitlist: true,
    referralInbox: true,
    twoFactorEnforced: true,
    idleTimeoutMin: 15,
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    encryption: 'STARTTLS',
    senderName: 'Vaani Speech & Hearing Clinic',
    senderEmail: 'info.shreeharshshivpuje@gmail.com',
    password: '',
    hasPasswordStored: true,
    enableAutoDispatch: true,
  },
};

/**
 * Deep merge utility to guarantee all default sections and fields exist
 */
function deepMerge(target, source) {
  const output = { ...target };
  if (source && typeof source === 'object') {
    Object.keys(source).forEach((key) => {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else if (source[key] !== undefined) {
        output[key] = source[key];
      }
    });
  }
  return output;
}

/**
 * Synchronously retrieves current clinic settings from localStorage,
 * falling back to DEFAULT_CLINIC_SETTINGS.
 */
export function getClinicSettings() {
  if (typeof window === 'undefined') return DEFAULT_CLINIC_SETTINGS;
  try {
    const raw = localStorage.getItem(CLINIC_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_CLINIC_SETTINGS;
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_CLINIC_SETTINGS, parsed);
  } catch (e) {
    console.warn('Failed to parse clinic settings, using defaults:', e);
    return DEFAULT_CLINIC_SETTINGS;
  }
}

/**
 * Persists clinic settings to localStorage and dispatches a custom event.
 */
export function saveClinicSettings(newSettings) {
  if (typeof window === 'undefined') return;
  try {
    const merged = deepMerge(DEFAULT_CLINIC_SETTINGS, newSettings);
    localStorage.setItem(CLINIC_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(CLINIC_SETTINGS_EVENT, { detail: merged }));
    return merged;
  } catch (e) {
    console.error('Failed to save clinic settings:', e);
  }
}

/**
 * Helper to construct the unified clinical address string
 */
export function formatClinicAddress(settings) {
  const s = settings || getClinicSettings();
  const c = s?.contact || {};
  const parts = [
    c.addressLine1,
    c.addressLine2,
    c.locality,
    c.district || c.taluka,
    c.pin ? `${c.state ? c.state + ' - ' : ''}${c.pin}` : c.state
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Helper to construct the unified helpline string
 */
export function formatClinicHelpline(settings) {
  const s = settings || getClinicSettings();
  const c = s?.contact || {};
  const phones = [c.primaryPhone, c.consultationPhone].filter(Boolean).join(' / ');
  const email = c.officialEmail || s?.notifications?.senderEmail || 'info@vaaniclinic.com';
  const web = c.websiteUrl || 'vaaniclinic.com';
  return `Helpline: ${phones} • ${email} • ${web.replace(/^https?:\/\//, '')}`;
}

const ClinicSettingsContext = createContext(null);

export const ClinicSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => getClinicSettings());

  const refreshSettings = useCallback(() => {
    setSettings(getClinicSettings());
  }, []);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setSettings(deepMerge(DEFAULT_CLINIC_SETTINGS, e.detail));
      } else {
        refreshSettings();
      }
    };

    const handleStorage = (e) => {
      if (e.key === CLINIC_SETTINGS_STORAGE_KEY) {
        refreshSettings();
      }
    };

    window.addEventListener(CLINIC_SETTINGS_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CLINIC_SETTINGS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshSettings]);

  const updateSettings = useCallback((updater) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : deepMerge(prev, updater);
      saveClinicSettings(next);
      return next;
    });
  }, []);

  const updateLogo = useCallback((logoBase64) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        identity: {
          ...prev.identity,
          logoUrl: logoBase64,
          logoWhiteUrl: logoBase64,
        },
      };
      saveClinicSettings(next);
      return next;
    });
  }, []);

  const resetLogo = useCallback(() => {
    setSettings((prev) => {
      const next = {
        ...prev,
        identity: {
          ...prev.identity,
          logoUrl: DEFAULT_CLINIC_SETTINGS.identity.logoUrl,
          logoWhiteUrl: DEFAULT_CLINIC_SETTINGS.identity.logoWhiteUrl,
        },
      };
      saveClinicSettings(next);
      return next;
    });
  }, []);

  const formattedAddress = useMemo(() => formatClinicAddress(settings), [settings]);
  const helplineText = useMemo(() => formatClinicHelpline(settings), [settings]);

  const value = useMemo(() => ({
    settings,
    updateSettings,
    updateLogo,
    resetLogo,
    refreshSettings,
    formattedAddress,
    helplineText,
    logoUrl: settings.identity.logoUrl || '/vaani-logo.png',
    logoWhiteUrl: settings.identity.logoWhiteUrl || '/vaani-logo-white.png',
    clinicName: settings.identity.legalName || 'Vaani Speech & Hearing Clinic',
    tradeName: settings.identity.tradeName || 'Vaani Clinic',
    rciNumber: settings.credentials.rciNumber || 'A79214',
    gstin: settings.credentials.gstin || '27AAAAA0000A1Z5',
    sacCode: settings.billing.sacCode || '999312',
    hsnCode: settings.billing.hsnCode || '9021',
    bankDetails: {
      upiId: settings.billing.upiId || 'vaaniclinic@okaxis',
      upiName: settings.billing.upiName || settings.identity.legalName || 'Vaani Speech & Hearing Clinic',
      bankName: settings.billing.bankName || 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara',
      bankIfsc: settings.billing.bankIfsc || 'HDFC0000123',
      bankAccountMasked: settings.billing.bankAccountMasked || '**** **** **** 4892',
    },
  }), [settings, updateSettings, updateLogo, resetLogo, refreshSettings, formattedAddress, helplineText]);

  return (
    <ClinicSettingsContext.Provider value={value}>
      {children}
    </ClinicSettingsContext.Provider>
  );
};

export const useClinicSettings = () => {
  const context = useContext(ClinicSettingsContext);
  if (!context) {
    // Graceful fallback for components rendered outside the provider
    const s = getClinicSettings();
    return {
      settings: s,
      updateSettings: saveClinicSettings,
      updateLogo: (logo) => {
        const next = { ...s, identity: { ...s.identity, logoUrl: logo, logoWhiteUrl: logo } };
        saveClinicSettings(next);
      },
      resetLogo: () => {
        const next = { ...s, identity: { ...s.identity, logoUrl: DEFAULT_CLINIC_SETTINGS.identity.logoUrl, logoWhiteUrl: DEFAULT_CLINIC_SETTINGS.identity.logoWhiteUrl } };
        saveClinicSettings(next);
      },
      refreshSettings: () => {},
      formattedAddress: formatClinicAddress(s),
      helplineText: formatClinicHelpline(s),
      logoUrl: s.identity.logoUrl || '/vaani-logo.png',
      logoWhiteUrl: s.identity.logoWhiteUrl || '/vaani-logo-white.png',
      clinicName: s.identity.legalName || 'Vaani Speech & Hearing Clinic',
      tradeName: s.identity.tradeName || 'Vaani Clinic',
      rciNumber: s.credentials.rciNumber || 'A79214',
      gstin: s.credentials.gstin || '27AAAAA0000A1Z5',
      sacCode: s.billing.sacCode || '999312',
      hsnCode: s.billing.hsnCode || '9021',
      bankDetails: {
        upiId: s.billing.upiId || 'vaaniclinic@okaxis',
        upiName: s.billing.upiName || s.identity.legalName || 'Vaani Speech & Hearing Clinic',
        bankName: s.billing.bankName || 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara',
        bankIfsc: s.billing.bankIfsc || 'HDFC0000123',
        bankAccountMasked: s.billing.bankAccountMasked || '**** **** **** 4892',
      },
    };
  }
  return context;
};

export default ClinicSettingsContext;
