/**
 * VAANI Clinical Services Tariff & Fee Master
 * Centralized registry for clinical investigations, assessments, therapy packages, and devices.
 * Compliant with GST Heading 9993 (Health Care Services - Exempt) and HSN 9021 / 8506 (Goods - 18%).
 */

export const DEFAULT_SERVICE_RATES = [
  {
    id: 'svc_001',
    code: 'SVC-AUD-001',
    name: 'Pure Tone Audiometry (PTA)',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 800,
    unit: 'Per Evaluation',
    description: 'Bilateral air and bone conduction audiometry in calibrated acoustic booth (ANSI S3.1)',
    status: 'ACTIVE',
  },
  {
    id: 'svc_002',
    code: 'SVC-AUD-002',
    name: 'Pure Tone Audiometry (PTA) + Tympanometry',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1200,
    unit: 'Per Evaluation',
    description: 'Bilateral PTA combined with middle ear impedance compliance curve and acoustic reflexes',
    status: 'ACTIVE',
  },
  {
    id: 'svc_003',
    code: 'SVC-AUD-003',
    name: 'Impedance Audiometry & Tympanometry',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 600,
    unit: 'Per Evaluation',
    description: 'Middle ear pressure, tympanogram classification (Jerger A/B/C), and ipsi/contra reflex decay',
    status: 'ACTIVE',
  },
  {
    id: 'svc_004',
    code: 'SVC-AUD-004',
    name: 'OAE Newborn Hearing Screening (Bilateral)',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 800,
    unit: 'Per Screening',
    description: 'Transient Evoked (TEOAE) or Distortion Product (DPOAE) outer hair cell cochlear screening',
    status: 'ACTIVE',
  },
  {
    id: 'svc_005',
    code: 'SVC-AUD-005',
    name: 'Brainstem Evoked Response Audiometry (BERA / ABR)',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 3500,
    unit: 'Per Diagnostic',
    description: 'Electrophysiological auditory pathway latency analysis (Waves I-V) under sedation/natural sleep',
    status: 'ACTIVE',
  },
  {
    id: 'svc_006',
    code: 'SVC-AUD-006',
    name: 'Tinnitus Evaluation & Habituation Consultation (CBT)',
    discipline: 'Audiology',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 2000,
    unit: 'Per Consultation',
    description: 'Tinnitus pitch/loudness matching, minimum masking level (MML), residual inhibition, TRT counseling',
    status: 'ACTIVE',
  },
  {
    id: 'svc_007',
    code: 'SVC-SLP-001',
    name: 'Comprehensive Pediatric Speech-Language Evaluation',
    discipline: 'Speech Therapy',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1500,
    unit: 'Per Diagnostic',
    description: 'Validated psychometric developmental assessment (REELS, 3-DLAT, Early Dev History)',
    status: 'ACTIVE',
  },
  {
    id: 'svc_008',
    code: 'SVC-SLP-002',
    name: 'Speech & Language Therapy Session (Single 45-min)',
    discipline: 'Speech Therapy',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 900,
    unit: 'Per 45-min Session',
    description: 'Individualized clinician-led articulatory, receptive-expressive, or pragmatic intervention',
    status: 'ACTIVE',
  },
  {
    id: 'svc_009',
    code: 'SVC-SLP-003',
    name: 'Speech Therapy Package (10-Session Card Block)',
    discipline: 'Speech Therapy',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 7500,
    unit: '10-Session Block',
    description: 'Prepaid clinical rehabilitation block card with weekly parental milestone tracking',
    status: 'ACTIVE',
  },
  {
    id: 'svc_010',
    code: 'SVC-VOI-001',
    name: 'Voice Therapy & Acoustic Vocal Analysis (GRBAS)',
    discipline: 'Voice & Swallowing',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1500,
    unit: 'Per Evaluation',
    description: 'Perceptual GRBAS & CAPE-V evaluation, jitter/shimmer/HNR acoustic analysis via PRAAT, hygiene protocol',
    status: 'ACTIVE',
  },
  {
    id: 'svc_011',
    code: 'SVC-SWL-001',
    name: 'Dysphagia / Clinical Swallowing Examination',
    discipline: 'Voice & Swallowing',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1800,
    unit: 'Per Evaluation',
    description: 'Bedside oral motor exam, cranial nerve assessment, safe bolus trials, and posture recommendations',
    status: 'ACTIVE',
  },
  {
    id: 'svc_012',
    code: 'SVC-HA-001',
    name: 'Hearing Aid Trial, Verification & REM Fitting',
    discipline: 'Hearing Aids & Devices',
    hsnSac: '999312',
    taxType: 'HEALTHCARE_EXEMPT',
    gstPercent: 0,
    baseRate: 1500,
    unit: 'Per Fitting Session',
    description: 'Binaural electroacoustic programming, real-ear measurement (REM), speech-in-noise verification',
    status: 'ACTIVE',
  },
  {
    id: 'svc_013',
    code: 'SVC-HA-002',
    name: 'Custom Hard / Soft Earmould Impression & Fabrication',
    discipline: 'Hearing Aids & Devices',
    hsnSac: '9021',
    taxType: 'TAXABLE_GOODS',
    gstPercent: 18,
    baseRate: 1800,
    unit: 'Per Ear Impression',
    description: 'Silicone ear canal impression, acrylic/silicone UV fabrication, vent adjustment',
    status: 'ACTIVE',
  },
  {
    id: 'svc_014',
    code: 'SVC-HA-003',
    name: 'Hearing Aid Zinc-Air Batteries (Pack of 6)',
    discipline: 'Hearing Aids & Devices',
    hsnSac: '8506',
    taxType: 'TAXABLE_GOODS',
    gstPercent: 18,
    baseRate: 450,
    unit: 'Per Blister Pack',
    description: 'High-density mercury-free zinc-air button cells (Sizes 10, 312, 13, or 675)',
    status: 'ACTIVE',
  },
  {
    id: 'svc_015',
    code: 'SVC-HA-004',
    name: 'Digital Programmable Hearing Aid (Single Unit)',
    discipline: 'Hearing Aids & Devices',
    hsnSac: '9021',
    taxType: 'TAXABLE_GOODS',
    gstPercent: 18,
    baseRate: 25000,
    unit: 'Single Device',
    description: 'Multi-channel digital BTE/RIC hearing instrument with adaptive directional microphones',
    status: 'ACTIVE',
  },
  {
    id: 'svc_016',
    code: 'SVC-HA-005',
    name: 'Phonak Lumity L90-R Hearing Aid (Bilateral) + Fitting',
    discipline: 'Hearing Aids & Devices',
    hsnSac: '9021',
    taxType: 'TAXABLE_GOODS',
    gstPercent: 18,
    baseRate: 145000,
    unit: 'Bilateral Set',
    description: 'Premium AI-driven AutoSense OS 5.0 rechargeable hearing instruments with wireless streamer',
    status: 'ACTIVE',
  },
];

const STORAGE_KEY = 'vaani_service_rates_v1';

/**
 * Retrieve current service rates with localStorage fallback
 */
export function getServiceRates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICE_RATES));
      return DEFAULT_SERVICE_RATES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICE_RATES));
      return DEFAULT_SERVICE_RATES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse service rates:', err);
    return DEFAULT_SERVICE_RATES;
  }
}

/**
 * Save updated service rates to localStorage and notify listeners
 */
export function saveServiceRates(rates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
    window.dispatchEvent(new CustomEvent('vaani_rates_updated', { detail: rates }));
    return true;
  } catch (err) {
    console.error('Failed to save service rates:', err);
    return false;
  }
}

/**
 * Reset service rates to clinic baseline default schedule
 */
export function resetServiceRates() {
  return saveServiceRates(DEFAULT_SERVICE_RATES);
}
