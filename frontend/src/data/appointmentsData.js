/**
 * Appointments Master Data & Synchronization Module
 * Unifies appointments across Scheduler, Overview, and Patient Intake Auto-fill.
 */

export const SEED_APPOINTMENTS = [
  {
    id: 'apt_1',
    appointment_date: '2026-10-16',
    start_time: '10:00',
    end_time: '10:45',
    patient_name: 'Aarav Sachin Shinde',
    patient_phone: '+91 98220 11223',
    patient_uhid: 'VN-26-0001',
    service_name: 'Pediatric Speech-Language Diagnostic Evaluation',
    service_line: 'SPEECH_LANGUAGE',
    status: 'CONFIRMED',
    fee_paise: 150000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Sadashiv Peth, Satara',
    guardian_name: 'Sachin Shinde (Father)',
  },
  {
    id: 'apt_2',
    appointment_date: '2026-10-16',
    start_time: '11:00',
    end_time: '11:45',
    patient_name: 'Sunita Dattatray More',
    patient_phone: '+91 94220 44556',
    patient_uhid: 'VN-26-0002',
    service_name: 'Pure Tone Audiometry (PTA) + Tympanometry',
    service_line: 'AUDIOLOGY',
    status: 'CHECKED_IN',
    fee_paise: 120000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Powai Naka, Satara',
  },
  {
    id: 'apt_3',
    appointment_date: '2026-10-16',
    start_time: '16:00',
    end_time: '16:45',
    patient_name: 'Vijay Narayan Kadam',
    patient_phone: '+91 98901 77889',
    patient_uhid: 'VN-26-0003',
    service_name: 'Hearing Aid Trial & Fitting Fine-Tuning',
    service_line: 'AUDIOLOGY',
    status: 'CONFIRMED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Karanje Peth, Satara',
  },
  {
    id: 'apt_4',
    appointment_date: '2026-10-17',
    start_time: '10:30',
    end_time: '11:15',
    patient_name: 'Ananya Rahul Patil',
    patient_phone: '+91 97654 33221',
    patient_uhid: 'VN-26-0004',
    service_name: 'Fluency Disorder (Stuttering) Therapy Session 4',
    service_line: 'SPEECH_LANGUAGE',
    status: 'CONFIRMED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Shahupuri, Satara',
    guardian_name: 'Rahul Patil (Father)',
  },
  {
    id: 'apt_5',
    appointment_date: '2026-10-17',
    start_time: '11:30',
    end_time: '12:15',
    patient_name: 'Ramesh Balasaheb Deshmukh',
    patient_phone: '+91 94231 66778',
    patient_uhid: 'VN-26-0005',
    service_name: 'Tinnitus Cognitive Behavioral Counseling (CBT)',
    service_line: 'CBT_PSYCHOLOGY',
    status: 'PENDING',
    fee_paise: 200000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Wai, Satara',
  },
  {
    id: 'apt_6',
    appointment_date: '2026-10-15',
    start_time: '17:00',
    end_time: '17:30',
    patient_name: 'Kavita Suresh Bhosale',
    patient_phone: '+91 98233 44112',
    patient_uhid: 'VN-26-0006',
    service_name: 'Voice Therapy & Acoustic Vocal Warmup',
    service_line: 'VOICE',
    status: 'COMPLETED',
    fee_paise: 150000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Karad, Satara',
  },
  {
    id: 'apt_7',
    appointment_date: '2026-10-15',
    start_time: '18:00',
    end_time: '18:30',
    patient_name: 'Dhananjay Ramchandra Jadhav',
    patient_phone: '+91 98902 55667',
    patient_uhid: 'VN-26-0007',
    service_name: 'Newborn Infant OAE Screening Bilateral',
    service_line: 'AUDIOLOGY',
    status: 'COMPLETED',
    fee_paise: 80000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Koregaon, Satara',
  },
  {
    id: 'apt_8',
    appointment_date: '2026-10-14',
    start_time: '11:00',
    end_time: '11:30',
    patient_name: 'Sanjay Govind Pawar',
    patient_phone: '+91 98224 33221',
    patient_uhid: 'VN-26-0009',
    service_name: 'Diagnostic Pure Tone Audiometry (PTA)',
    service_line: 'AUDIOLOGY',
    status: 'NO_SHOW',
    fee_paise: 80000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Satara City',
  },
  // Newly arrived walk-in clients / unlinked appointments who need patient registration:
  {
    id: 'apt_walkin_01',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '12:00',
    end_time: '12:45',
    patient_name: 'Sneha Rahul Ghorpade',
    patient_phone: '+91 98229 55443',
    patient_uhid: '', // Not registered yet
    service_name: 'Early Developmental Language & Speech Delay Evaluation',
    service_line: 'SPEECH_LANGUAGE',
    status: 'CHECKED_IN',
    fee_paise: 150000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Powai Naka, Satara',
    guardian_name: 'Rahul Ghorpade (Husband)',
    primary_concern: 'Speech delay, difficulties in two-word combinations',
  },
  {
    id: 'apt_walkin_02',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '14:30',
    end_time: '15:15',
    patient_name: 'Vedant Shrikant Kulkarni',
    patient_phone: '+91 97664 11223',
    patient_uhid: '', // Not registered yet
    service_name: 'Newborn & Infant Otoacoustic Emissions (OAE) Screening',
    service_line: 'AUDIOLOGY',
    status: 'CHECKED_IN',
    fee_paise: 120000,
    payment_status: 'PAID',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Karanje Peth, Satara',
    guardian_name: 'Shrikant Kulkarni (Father)',
    primary_concern: 'Infant hearing screening post high jaundice history',
  },
  {
    id: 'apt_walkin_03',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '16:15',
    end_time: '17:00',
    patient_name: 'Dilip Ganpatrao Chavan',
    patient_phone: '+91 98230 77665',
    patient_uhid: '', // Not registered yet
    service_name: 'Pure Tone Audiometry (PTA) & Bilateral Tinnitus Assessment',
    service_line: 'AUDIOLOGY',
    status: 'CONFIRMED',
    fee_paise: 150000,
    payment_status: 'PENDING',
    clinician: 'Dr. Palak Paresh Gandhi',
    city: 'Sadashiv Peth, Satara',
    primary_concern: 'Bilateral high-pitched ringing and progressive hearing loss',
  },
];

/**
 * Retrieve all appointments combining localStorage and default seed data.
 */
export const getAllAppointments = () => {
  try {
    const saved = localStorage.getItem('vaani_appointments_v1');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    localStorage.setItem('vaani_appointments_v1', JSON.stringify(SEED_APPOINTMENTS));
    return SEED_APPOINTMENTS;
  } catch (e) {
    console.warn('Failed to load appointments from localStorage:', e);
    return SEED_APPOINTMENTS;
  }
};
