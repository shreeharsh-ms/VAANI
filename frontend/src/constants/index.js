/**
 * Application Constants
 */

export const APP_CONFIG = {
  name: 'VAANI',
  tagline: 'Speech & Hearing Clinic',
  fullName: 'VAANI - Audiology & Speech-Language Pathology Clinic',
  practitioner: 'Ms. Palak Paresh Gandhi',
  qualifications: 'MASLP, RCI Registered Audiologist & Speech-Language Pathologist',
  location: 'Sadashiv Peth, Satara, Maharashtra 415002',
  phone: '+91 98765 43210',
  email: 'contact@vaaniclinic.com',
  workingHours: 'Mon - Sat: 09:30 AM - 06:30 PM (Sun Closed)',
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
};

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  ABOUT: '/about',
  BLOGS: '/blogs',
  BOOKING: '/book-appointment',
  CONTACT: '/contact',
  LOGIN: '/login',
  DASHBOARD: {
    HOME: '/dashboard',
    OVERVIEW: '/dashboard/overview',
    APPOINTMENTS: '/dashboard/appointments',
    PATIENTS: '/dashboard/patients',
    REPORTS: '/dashboard/reports',
    BILLING: '/dashboard/billing',
    INVENTORY: '/dashboard/inventory',
    RECALLS: '/dashboard/recalls',
    BLOGS: '/dashboard/blogs',
    SETTINGS: '/dashboard/settings',
  },
};

export const APPOINTMENT_STATUSES = {
  PENDING: { label: 'Pending Confirmation', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  NO_SHOW: { label: 'No Show', variant: 'neutral' },
};

export const SERVICE_LINES = [
  { value: 'SPEECH_LANGUAGE', label: 'Speech & Language Therapy' },
  { value: 'AUDIOLOGY', label: 'Audiology & Hearing Health' },
  { value: 'VOICE', label: 'Voice Therapy & Diagnostics' },
  { value: 'CBT_PSYCHOLOGY', label: 'CBT & Counseling' },
];
