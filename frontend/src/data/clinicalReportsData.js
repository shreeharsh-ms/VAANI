/**
 * Clinical Reports Master Data & Persistence Helpers
 * Synchronizes reports across ReportsPage, PatientDetailPage, ReportCreatePage, and ReportViewPage
 * Document Reference: VAANI-DOC-SPEC-2026-001
 * Clinical Governance: RCI CRR No. A79214
 */

export const DEFAULT_ASSESSMENTS = [
  {
    id: 'asmt_01',
    report_number: 'REP-26-0010',
    title: 'Comprehensive Audiological Evaluation (PTA)',
    service_code: 'RP-CLN-AUD',
    discipline: 'Audiology',
    uhid: 'VN-26-0002',
    patient_name: 'Sunita Dattatray More',
    patient_age_sex: 'Female, 63 Yrs',
    date: '2026-03-28',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Bilateral moderate-to-severe sensorineural hearing loss, sloping contour.',
    recommendations: 'Bilateral Receiver-in-Canal (RIC) digital hearing aid fitting with annual audiometry.',
    status: 'FINAL',
  },
  {
    id: 'asmt_02',
    report_number: 'REP-26-0011',
    title: 'Comprehensive Speech-Language Battery (ALD-MM)',
    service_code: 'RP-CLN-SLA',
    discipline: 'Speech Therapy',
    uhid: 'VN-26-0001',
    patient_name: 'Aarav Sachin Shinde',
    patient_age_sex: 'Male, 34 Months',
    date: '2026-03-25',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Expressive language delay (14-month delay) with mild phonological articulation substitutions.',
    recommendations: 'Bi-weekly speech-language stimulation therapy focusing on multi-word lexical expansion.',
    status: 'FINAL',
  },
  {
    id: 'asmt_03',
    report_number: 'REP-26-0012',
    title: 'Newborn & Infant OAE Screening Report',
    service_code: 'RP-CLN-OAE',
    discipline: 'Audiology',
    uhid: 'VN-26-0007',
    patient_name: 'Dhananjay Ramchandra Jadhav',
    patient_age_sex: 'Male, 6 Months',
    date: '2026-03-22',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'TEOAE screening completed: Bilateral PASS across 1000 Hz to 4000 Hz with SNR > 6 dB.',
    recommendations: 'Cochlear outer hair cell function intact. Monitor auditory developmental milestones.',
    status: 'FINAL',
  },
  {
    id: 'asmt_04',
    report_number: 'REP-26-0013',
    title: 'Voice Disorders Proforma (CAPE-V / GRBAS)',
    service_code: 'RP-CLN-VOI',
    discipline: 'Voice',
    uhid: 'VN-26-0006',
    patient_name: 'Kavita Suresh Bhosale',
    patient_age_sex: 'Female, 41 Yrs',
    date: '2026-03-18',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Hyperfunctional dysphonia with bilateral vocal cord nodules. CAPE-V Overall: 48/100.',
    recommendations: 'Resonant Voice Therapy (RVT), vocal hygiene protocol, hydration ≥ 2.5L/day.',
    status: 'FINAL',
  },
  {
    id: 'asmt_05',
    report_number: 'REP-26-0014',
    title: 'Fluency / Stuttering Assessment (SSI-4)',
    service_code: 'RP-CLN-FLU',
    discipline: 'Fluency',
    uhid: 'VN-26-0004',
    patient_name: 'Ananya Rahul Patil',
    patient_age_sex: 'Female, 4.5 Yrs',
    date: '2026-03-15',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Childhood-onset fluency disorder: 9.3% syllables stuttered (%SS), moderate severity.',
    recommendations: 'Lidcombe Program direct behavioral intervention, parental fluency modification counseling.',
    status: 'FINAL',
  },
  {
    id: 'asmt_06',
    report_number: 'REP-26-0015',
    title: 'Hearing Aid Fitting & Verification Certificate',
    service_code: 'RP-CLN-HAF',
    discipline: 'Audiology',
    uhid: 'VN-26-0003',
    patient_name: 'Vijay Narayan Kadam',
    patient_age_sex: 'Male, 70 Yrs',
    date: '2026-03-10',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Successfully verified and fitted with Oticon Real 3 miniRITE instruments.',
    recommendations: 'NAL-NL2 target match verified within ±2 dB. Acclimatization 4 hrs/day initial wear.',
    status: 'FINAL',
  },
  {
    id: 'asmt_07',
    report_number: 'REP-26-0016',
    title: 'Psychological & Cognitive Behavioural Therapy (CBT) Report',
    service_code: 'RP-CLN-CBT',
    discipline: 'Psychology',
    uhid: 'VN-26-0005',
    patient_name: 'Ramesh Balasaheb Deshmukh',
    patient_age_sex: 'Male, 56 Yrs',
    date: '2026-03-12',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Severe Chronic Subjective Tinnitus with High Perceived Stress (PSS-10: 24/40, THI: 68/100).',
    recommendations: '12 weekly CBT sessions targeting cognitive restructuring, sleep hygiene, and sound enrichment.',
    status: 'FINAL',
  },
  {
    id: 'asmt_08',
    report_number: 'REP-26-0018',
    title: 'Voice Disorders Clinical Dossier & Stroboscopy (CAPE-V / GRBAS)',
    service_code: 'RP-CLN-VOI',
    discipline: 'Voice',
    uhid: 'VN-26-0008',
    patient_name: 'Pooja Nitin Kulkarni',
    patient_age_sex: 'Female, 34 Yrs',
    date: '2026-10-02',
    examiner: 'Dr. Shreeharsh Shivpuje, BASLP, MASLP',
    rci_number: 'A79214',
    diagnosis: 'Muscle Tension Dysphonia (MTD Type 1) with visible supraglottic laryngeal constriction.',
    recommendations: 'Manual Laryngeal Musculoskeletal Therapy, Resonant Voice Therapy (RVT), and hydration protocol.',
    status: 'FINAL',
  },
];

/**
 * Get all clinical reports combined from localStorage and default seed assessments
 */
export const getAllClinicalReports = () => {
  try {
    const stored = localStorage.getItem('vaani_clinical_reports_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultFiltered = DEFAULT_ASSESSMENTS.filter(
          (def) => !parsed.some((p) => p.report_number === def.report_number)
        );
        return [...parsed, ...defaultFiltered];
      }
    }
  } catch (e) {
    console.warn('Error reading vaani_clinical_reports_v1', e);
  }
  return DEFAULT_ASSESSMENTS;
};

/**
 * Get reports specifically matching a patient's UHID or full name
 */
export const getReportsForPatient = (uhid, patientName) => {
  const all = getAllClinicalReports();
  const normalizedUhid = (uhid || '').trim().toLowerCase();
  const normalizedName = (patientName || '').trim().toLowerCase();

  return all.filter((rep) => {
    const repUhid = (rep.uhid || '').trim().toLowerCase();
    const repName = (rep.patient_name || '').trim().toLowerCase();
    return (
      (normalizedUhid && repUhid === normalizedUhid) ||
      (normalizedName && repName.includes(normalizedName)) ||
      (normalizedName && normalizedName.includes(repName))
    );
  });
};
