build_file = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/build_srs_suite.py"

with open(build_file, "r", encoding="utf-8") as f:
    code = f.read()

# Define the new expanded sections_7_to_19_md
new_sections_7_to_19 = r"""
# 7. API Specification

## 7.1 Overview & Architectural Principles
The ERP and Website communicate with the backend via a RESTful API operating over HTTPS/TLS 1.3.
- **Base URL**: `https://api.vanisclinic.in/v1`
- **Content Type**: `application/json; charset=utf-8`
- **Authentication**: JWT Bearer token passed in the `Authorization` header (`Authorization: Bearer <token>`).
- **Response Wrapper Standard**:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "page": 1, "limit": 25, "total": 142, "timestamp": "2026-10-07T14:30:00.000Z" }
}
```

## 7.2 Key Endpoint Registry

| Module | Endpoint | Method | Role Required | Description |
|---|---|---|---|---|
| **AUTH** | `/v1/auth/login` | POST | Public | Authenticates user, returns JWT and sets httpOnly refresh cookie |
| **AUTH** | `/v1/auth/refresh` | POST | Public | Rotates refresh token and issues new short-lived access JWT |
| **AUTH** | `/v1/auth/logout` | POST | Authenticated | Revokes current session refresh token |
| **APT** | `/v1/appointments/slots` | GET | Public / User | Calculates available slots for provider, service and date range |
| **APT** | `/v1/appointments` | POST | Public / User | Creates requested or confirmed appointment |
| **APT** | `/v1/appointments/:id/status` | PATCH | Practitioner / Reception | Updates appointment lifecycle state |
| **PAT** | `/v1/patients` | GET | ERP Roles | Searches patient master list with filters (UHID, mobile, name) |
| **PAT** | `/v1/patients` | POST | Reception / Practitioner | Registers new patient master record |
| **PAT** | `/v1/patients/:id` | GET | ERP Roles | Fetches complete 360-degree patient file |
| **CLN** | `/v1/clinical/visits` | POST | Practitioner | Finalises session visit and attaches SOAP note |
| **CLN** | `/v1/clinical/audiology` | POST | Practitioner (BASLP) | Saves OAE screening & Pure Tone Audiometry evaluation |
| **CLN** | `/v1/clinical/speech-assessment` | POST | Practitioner (BASLP) | Saves standardized test batteries (ALD-MM, LPT, CAPC-M, DALI) |
| **CLN** | `/v1/clinical/session-report` | POST | Practitioner (BASLP) | Saves therapy session report with target goals, activities & consistency % |
| **CLN** | `/v1/clinical/cbt` | POST | Practitioner (CBT) | Saves encrypted CBT session note |
| **DOC-OAE** | `/v1/reports/clinical/oae/:evalId` | GET / POST | Practitioner (BASLP) | Generates official OAE Screening PDF (`RP-CLN-OAE`) with ear visuals |
| **DOC-AUD** | `/v1/reports/clinical/audiology/:evalId` | GET / POST | Practitioner (BASLP) | Generates Audiological Evaluation PDF (`RP-CLN-AUD`) with dual audiograms |
| **DOC-VOI** | `/v1/reports/clinical/voice/:evalId` | GET / POST | Practitioner (BASLP) | Generates Voice Disorders Proforma & Report (`RP-CLN-VOI`) |
| **DOC-FLU** | `/v1/reports/clinical/fluency/:evalId` | GET / POST | Practitioner (BASLP) | Generates Fluency / Stuttering Evaluation PDF (`RP-CLN-FLU`) |
| **DOC-SLA** | `/v1/reports/clinical/speech-language/:evalId` | GET / POST | Practitioner (BASLP) | Generates Comprehensive Speech & Language Report (`RP-CLN-SLA`) |
| **DOC-CBT** | `/v1/reports/clinical/cbt/:evalId` | GET / POST | Practitioner (CBT) | Generates Encrypted CBT & Risk Assessment PDF (`RP-CLN-CBT`) |
| **DOC-DYS** | `/v1/reports/clinical/dysphagia/:evalId` | GET / POST | Practitioner (BASLP) | Generates Dysphagia & Swallowing Evaluation PDF (`RP-CLN-DYS`) |
| **DOC-HAF** | `/v1/reports/clinical/hearing-aid-fitting/:haId` | GET / POST | Practitioner (BASLP) | Generates Hearing Aid Fitting & Warranty Certificate (`RP-CLN-HAF`) |
| **DOC-PRG** | `/v1/reports/clinical/therapy-progress/:planId` | GET / POST | Practitioner (BASLP) | Generates Periodic Therapy Progress Summary Report (`RP-CLN-PRG`) |
| **DOC-DSC** | `/v1/reports/clinical/discharge-summary/:planId` | GET / POST | Practitioner (BASLP) | Generates Clinical Discharge Summary & Home Plan (`RP-CLN-DSC`) |
| **BIL** | `/v1/invoices` | POST | Reception / Practitioner | Generates final tax/clinical invoice |
| **BIL** | `/v1/payments` | POST | Reception | Records offline/UPI payment transaction |
| **INV** | `/v1/inventory/items` | GET | ERP Roles | Queries stock items and serial numbers |
| **DSH** | `/v1/dashboards/summary` | GET | ERP Roles | Returns daily revenue, appointments, and recall statistics |

---

# 8. External Interface Requirements

## 8.1 User Interfaces
- **Public Website UI**: Responsive layout supporting Desktop (1920x1080 to 1280x720), Tablet (768px), and Mobile (375px+). English and Marathi localization.
- **ERP Clinical Dashboard UI**: Single-Page Application (SPA) / Progressive Web App (PWA) optimized for Google Chrome, Apple Safari, and MS Edge. Clean, high-contrast typography, keyboard shortcuts for clinical entry (`Alt+N` for new visit, `Alt+P` for patient lookup).

## 8.2 Hardware Interfaces
- **Receipt & Invoice Printers**: Standard POS thermal printers (80mm) and A4 laser/inkjet printers via standard browser print dialog.
- **Barcode & Serial Scanners**: USB/Bluetooth barcode scanners operating in keyboard-wedge mode for reading serial numbers on hearing aid packages and consumable stock.

## 8.3 Software & Cloud Interfaces
- **MongoDB Atlas**: Connection over TLS 1.3 using Mongoose connection pooling (Mumbai `ap-south-1` region).
- **Email Gateway (SMTP/API)**: Transactional email delivery (SendGrid / AWS SES) for appointment confirmations, invoices, and password resets.
- **WhatsApp Notification Outbox**: Provider-neutral outbox queuing system ready to interface with WhatsApp Business API.

---

# 9. Non-Functional Requirements (NFR)

## 9.1 Performance & Response Times
- **NFR-PRF-001**: Public website Page Load Time (LCP) shall not exceed **1.8 seconds** on standard 4G mobile connections.
- **NFR-PRF-002**: ERP API P95 latency for search and retrieve endpoints shall be **< 200 ms**.
- **NFR-PRF-003**: Clinical record write operations shall complete within **< 350 ms**.
- **NFR-PRF-004**: Automated Clinical PDF report rendering shall complete in **< 1.5 seconds** per report.

## 9.2 Reliability & Availability
- **NFR-REL-001**: System operational availability shall be **99.9%** (excluding scheduled maintenance).
- **NFR-REL-002**: Database Recovery Point Objective (RPO) shall be **< 5 minutes** via continuous point-in-time recovery (PITR).
- **NFR-REL-003**: Database Recovery Time Objective (RTO) shall be **< 1 hour**.

## 9.3 Security & Compliance
- **NFR-SEC-001**: All data in transit shall be encrypted using **TLS 1.3 / HTTPS**.
- **NFR-SEC-002**: Sensitive patient clinical data (specifically CBT session notes and risk safety matrices) shall be encrypted at rest using **AES-256 field-level encryption**.
- **NFR-SEC-003**: System shall strictly comply with the **Digital Personal Data Protection (DPDP) Act, 2023 (India)**, maintaining verifiable audit logs for all patient data access.

---

# 10. Security Architecture

<div class="diagram-card" style="border: 1.5px solid #0F172A; background-color: #FAFAFA; padding: 10pt; margin: 10pt 0; border-radius: 4px;">
    <div style="font-weight: bold; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #0F172A; padding-bottom: 4pt; margin-bottom: 8pt; color: #0F172A;">
        <i class="fa-solid fa-shield-halved" style="margin-right: 4px;"></i> FIGURE 10.1: SECURITY & PRIVACY ARCHITECTURE LAYERS
    </div>
    <div style="display: flex; flex-direction: column; gap: 4pt; font-size: 7.8pt;">
        <div style="background: #F8FAFC; border: 1px solid #94A3B8; padding: 5pt 8pt; border-radius: 3px;">
            <strong>Layer 1: Network & Edge Security</strong> — HTTPS / TLS 1.3 Encryption, Cloudflare WAF, Rate Limiting, Strict CORS Origin Validation
        </div>
        <div style="background: #F0FDF4; border: 1px solid #16A34A; padding: 5pt 8pt; border-radius: 3px;">
            <strong>Layer 2: Identity & Session Management</strong> — JWT Access Tokens (15 min), httpOnly SameSite Refresh Cookies (7 days), Argon2id Hashing
        </div>
        <div style="background: #EFF6FF; border: 1px solid #2563EB; padding: 5pt 8pt; border-radius: 3px;">
            <strong>Layer 3: Authorization (RBAC)</strong> — Enforced Role Hierarchy (Owner, Clinician, Reception, Accountant) with granular action permissions
        </div>
        <div style="background: #FEF3C7; border: 1px solid #D97706; padding: 5pt 8pt; border-radius: 3px;">
            <strong>Layer 4: Data Protection & Field Encryption</strong> — AES-256 Field-Level Encryption for restricted CBT session notes
        </div>
        <div style="background: #FAF5FF; border: 1px solid #9333EA; padding: 5pt 8pt; border-radius: 3px;">
            <strong>Layer 5: DPDP Act 2023 Compliance & Audit</strong> — Immutable append-only audit logs recording every clinical file access
        </div>
    </div>
</div>

---

# 11. User Interface Requirements & Design System
- **Color System**: Primary Deep Slate (`#1E293B`), Medical Teal (`#0D9488`), Neutral Gray (`#F8FAFC`), Accent Amber (`#D97706`).
- **Typography**: Primary Body: `Calibri` / `Segoe UI` / `Arial`; Headings: `Georgia` serif font for legal/formal views and `Segoe UI` for ERP web views.
- **Accessibility**: Compliance with **WCAG 2.1 Level AA** standards for color contrast, screen reader compatibility, and focus management.

---

# 12. Business Rules Catalogue

| Rule ID | Name | Description |
|---|---|---|
| **BR-APT-001** | Double-Booking Prevention | The database shall prevent two active overlapping appointments for the same provider via unique partial indexes (`uniq_provider_slot_active`). |
| **BR-PAT-002** | UHID Generation Standard | Every patient shall be assigned a unique immutable identifier in format `PGC-YY-XXXXXX` (e.g. `PGC-26-000104`). |
| **BR-BIL-003** | Invoice Immutability | Once an invoice status transitions to `ISSUED` or `PAID`, its line items and prices cannot be modified; amendments require a Credit Note. |
| **BR-INV-004** | Serialized Stock Tracking | Hearing aids and major equipment must have unique serial numbers recorded upon purchase and verified upon billing. |
| **BR-DOC-005** | Diagnostic Report Finalization | Once an assessment report transitions to `FINAL`, clinical parameters become immutable; corrections create an explicit `AMENDED` version with reason. |
| **BR-DOC-006** | Practitioner Stamped Signature | All generated diagnostic reports must embed the RCI Registration Number and official stamped digital signature of the authoring practitioner. |

---

# 13. Validation Rules Catalogue

| Rule ID | Target Field | Validation Criteria | Error Message / Action |
|---|---|---|---|
| **VR-PAT-001** | Mobile Number | 10-digit numeric string matching Indian mobile numbers (`^[6-9]\d{9}$`) | "Please enter a valid 10-digit Indian mobile number." |
| **VR-APT-002** | Duration | Integer between 5 and 480 minutes | "Appointment duration must be between 5 and 480 minutes." |
| **VR-BIL-003** | Line Item Amount | Non-negative numerical value (amount >= 0) | "Item total cannot be negative." |
| **VR-CLN-004** | Audiometry dB Range | Multiples of 5 within range -10 dB HL to 120 dB HL | "Threshold must be in 5 dB steps between -10 and 120 dB HL." |
| **VR-CLN-005** | OAE SNR Threshold | Numeric value between -20.0 dB and +35.0 dB | "SNR must be a valid numeric measurement in dB." |
| **VR-CLN-006** | SSI-4 %SS Field | Percentage between 0.0% and 100.0% | "Percentage of syllables stuttered must be between 0 and 100%." |

---

# 14. Reports Catalogue

## 14.1 Master Clinical Assessment & Diagnostic Reports Matrix
The software features a built-in automated clinical reporting engine that generates **10 specialized clinical assessment and diagnostic reports**, each rendered as a standardized, print-ready A4 PDF document with clinic branding, bilingual metadata, auto-computed formulas, and official RCI clinician sign-off:

| Report ID | Report Name | Clinical Assessment Battery | Target Audience | Key Parameters & Auto-Calculations | Visual Layout Standard | Frequency |
|---|---|---|---|---|---|---|
| **RP-CLN-OAE** | **Otoacoustic Emission (OAE) Screening Report** | TEOAE & DPOAE Screening | Pediatricians, ENT Doctors, Parents | Frequencies 1k to 4k Hz, SNR (dB), Reproducibility %, Pass/Refer logic (SNR ≥ 6 dB across ≥ 3 bands) | Single-page A4, prominent Red Right & Blue Left ear graphics with binary checkboxes, impression & recommendations | Per screening encounter |
| **RP-CLN-AUD** | **Audiological Evaluation Report** | Pure Tone & Speech Audiometry, Tympanometry, Tuning Fork | ENT Specialists, Neurologists, Audiologists | AC/BC thresholds 125-8000 Hz, PTA1, PTA2, SDT, SRT, WRS %, MCL, UCL, Rinne, Weber, Tympanogram Type, Compliance, ECV | Single-page A4, dual side-by-side audiogram graphs (Red Right circles / Blue Left crosses), full-width parameters & immittance tables | Per evaluation |
| **RP-CLN-VOI** | **Voice Disorders Assessment Proforma & Report** | Perceptual Voice (CAPE-V, GRBAS), Acoustic & Aerodynamics, VHI | ENT / Laryngologists, Voice Therapists, Patients | CAPE-V VAS (0-100 mm), GRBAS (0-3), MPT (sec for /a/, /i/, /u/), s/z ratio (cutoff > 1.4), HNR (dB), VHI-30/10 severity | Multi-page structured proforma, visual severity meters, acoustic benchmark comparison grid | Baseline & re-evaluation |
| **RP-CLN-FLU** | **Fluency Disorders Assessment Report** | SSI-4 (Stuttering Severity Instrument 4th Ed), Speech Rate, OASES | Speech-Language Pathologists, Schools, Parents | %SS (reading & conversation), 3 longest block durations (sec), physical concomitants (0-20), total SSI-4, percentile, SPM/WPM | Standardized proforma, disfluency pie chart, severity band thermometer, avoidance checklist | Intake & periodic review |
| **RP-CLN-SLA** | **Comprehensive Speech & Language Assessment Report** | ALD-MM, LPT, CAPC-M, DALI, PCC, AAC, AVT | Developmental Paediatricians, Schools, Parents | Receptive/Expressive Language Age (RLA/ELA), Developmental Quotient (DQ %), PCC %, Pragmatics rating, Erber hierarchy | Comprehensive multi-page report, developmental age gap charts, phonological error breakdown, SMART goal tables | Comprehensive evaluation |
| **RP-CLN-CBT** | **Psychological & CBT Clinical Assessment Report** | PHQ-9, GAD-7, PSS-10, Suicide Risk Matrix, Beck's ABC Model | Psychiatrists, Clinical Psychologists, Therapist | PHQ-9 (0-27; Item #9 suicidal ideation alert), GAD-7 (0-21), PSS-10 (0-40), Risk stratification (Low/Mod/High), 5-Step Safety Plan | Secure encrypted report, psychometric trend gauges, ABC cognitive formulation matrix, crisis plan banner | Intake & review sessions |
| **RP-CLN-DYS** | **Swallowing & Dysphagia Evaluation Report** | Bedside Clinical Swallow Exam, FOIS, IDDSI Framework | Neurologists, Gastroenterologists, Caregivers | FOIS Level (1-7), IDDSI Liquid (0-4) & Food (3-7) levels, water swallow test trials (3ml/90ml), cough/wet-voice signs | Bedside proforma, IDDSI color-coded diet pyramid, compensatory posture diagrams, aspiration precautions | Post-stroke / dysphagia visit |
| **RP-CLN-HAF** | **Hearing Aid Fitting & Verification Certificate** | Amplification Dispensing, REM Target Matching, Sound Field | Patients, Hearing Aid Manufacturers, ENT | Device Make/Model/Serial, REM/Coupler target curve fit, Aided vs Unaided sound field thresholds, functional gain | Formal stamped certificate, serial barcode/QR, warranty dates, trial agreement terms | Dispensing / fitting visit |
| **RP-CLN-PRG** | **Periodic Therapy Progress Summary Report** | Longitudinal SOAP Synthesis, Goal Mastery Tracking | Parents, Sponsoring Bodies, School Counsellors | Baseline vs Current Goal Accuracy %, Ling 6-sound detection distance, session attendance rate %, parent coaching score | Multi-page progress report, longitudinal goal mastery progress bars, attendance summary | Every 12 sessions / quarterly |
| **RP-CLN-DSC** | **Clinical Discharge Summary & Home Plan** | Episode-of-Care Discharge Protocol | Referring Doctors, Parents, Patient File | Treatment duration, total sessions attended, mastered SMART goals summary, discharge criteria validation | Formal clinical discharge certificate, home maintenance regimen, annual review recall schedule | Discharge from therapy |

---

## 14.2 Detailed Specifications for Core Diagnostic Reports

### 14.2.1 RP-CLN-OAE: Otoacoustic Emission (OAE) Screening Report
- **Clinical Scope**: TEOAE (Transient Evoked) & DPOAE (Distortion Product) infant and pediatric hearing screening.
- **Reference Standard**: Joint Committee on Infant Hearing (JCIH) & Rehabilitation Council of India (RCI) newborn screening protocol.
- **Header Elements**: Clinic identity (*Vani's Speech & Hearing Clinic, Satara*), Consultant Audiologist credentials (*Ms. Palak Paresh Gandhi, BASLP, RCI Reg. No.*), contact numbers, and official logo.
- **Patient Demographics**: Patient Name, Date of Examination, Age / Gender, OAE No., Date of Birth (DOB), UHID / Reg. No., Referring Pediatrician / Hospital.
- **Visual Ear Containers**:
  - **Right Ear Section**: Prominent Red ear outline graphic with binary checkboxes: `Pass [ ]` / `Refer [ ]`.
  - **Left Ear Section**: Prominent Blue ear outline graphic with binary checkboxes: `Pass [ ]` / `Refer [ ]`.
- **Measurement Data Table**: Frequencies tested (1000 Hz, 1500 Hz, 2000 Hz, 3000 Hz, 4000 Hz), Signal-to-Noise Ratio (`SNR in dB`), Noise Floor (dB SPL), and Reproducibility (%).
- **Automated Pass Criteria**:
  - Frequency band PASS: `SNR ≥ 6 dB` AND `Reproducibility > 70%`.
  - Overall Ear PASS: Minimum 3 out of 5 frequencies pass.
- **Clinical Impression & Recommendations**:
  - `IMPRESSION`: Formatted clinical conclusion (e.g. *"Bilateral Pass - Normal Outer Hair Cell Function"* or *"Right Ear Refer, Left Ear Pass - Outer Hair Cell Dysfunction Noted"*).
  - `RECOMMENDATION`: Clear next steps (e.g. *"Diagnostic BERA / AABR within 4 weeks"*, *"ENT review for middle ear effusion"*, *"Behavioral hearing review at 6 months"*).
- **Authentication**: Official RCI-registered Audiologist signature block and clinic seal.

### 14.2.2 RP-CLN-AUD: Comprehensive Audiological Evaluation Report
- **Clinical Scope**: Diagnostic Pure Tone Audiometry (Air & Bone Conduction), Masking, Speech Audiometry, Tympanometry, and Tuning Fork tests.
- **Patient Metadata**: Date, Registration Number / UHID, PTA Number, Patient Name, Age / Gender, Audiometer Make/Model (e.g. *Proton SX5 / Interacoustics*), Reliability / Response Consistency (`Consistent` / `Fairly Consistent` / `Inconsistent`).
- **Dual Visual Audiogram Graphs (Side-by-Side)**:
  - **Right Ear Audiogram (Red)**: Frequency axis (125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000 Hz) vs Sound Pressure Level (-10 dB HL to 120 dB HL). Standard Red Circles `O` for unmasked AC, triangles `Δ` for masked AC, `<` for unmasked BC, `[` for masked BC, down arrows for No Response.
  - **Left Ear Audiogram (Blue)**: Matching frequency/intensity grid with Blue Crosses `X` for unmasked AC, squares `□` for masked AC, `>` for unmasked BC, `]` for masked BC, down arrows for No Response.
- **Standard Symbol Legend**: Complete visual key illustrating Right vs Left ear symbols.
- **Full-Width Audiometric Parameters Table**:
  - `Ear` | `PTA1 (500, 1k, 2k Hz)` | `PTA2 (500, 1k, 2k, 4k Hz)` | `SDT (dB HL)` | `SRT (dB HL)` | `WRS % at dB HL` | `MCL (dB HL)` | `UCL (dB HL)` | `Rinne (512 Hz)` | `Weber (512 Hz)`
  - Direct automated formula computation:
    $$\text{PTA1} = \frac{\text{Threshold}_{500} + \text{Threshold}_{1000} + \text{Threshold}_{2000}}{3}$$
    $$\text{PTA2} = \frac{\text{Threshold}_{500} + \text{Threshold}_{1000} + \text{Threshold}_{2000} + \text{Threshold}_{4000}}{4}$$
- **Tympanograms & Middle Ear Immittance Grid**:
  - Parameters: Tympanogram Type (Type A, As, Ad, B, C), Peak Pressure (daPa), Static Compliance (ml), Ear Canal Volume (ml), and Clinical Normative ranges.
- **Clinical Interpretation & Recommendations**: Structured diagnostic finding (Degree, Type, Configuration of hearing loss) and actionable management recommendations.
- **Footer**: Official RCI Audiologist stamp, registration number, and clinic address.

### 14.2.3 RP-CLN-VOI: Clinical Proforma & Evaluation Report for Voice Disorders
- **Clinical Scope**: Multidimensional voice evaluation for dysphonia, vocal nodules, muscle tension dysphonia, and professional voice users.
- **Intake & Demographics**: Vocal loading history (hours/day), vocal abuse/misuse habits (throat clearing, shouting, hard attacks), hydration, reflux symptoms, ENT laryngoscopy findings.
- **Perceptual Voice Evaluation**:
  - **CAPE-V**: Visual-analogue ratings (0-100 mm scale) across Overall Severity, Roughness, Breathiness, Strain, Pitch deviation, Loudness deviation; flagged as Consistent (`C`) or Intermittent (`I`).
  - **GRBAS Scale**: Grade (`G`), Roughness (`R`), Breathiness (`B`), Asthenia (`A`), Strain (`S`), each rated from 0 (Normal) to 3 (Severe). Auto-computed `GRBAS Total`.
- **Acoustic & Aerodynamic Measures**:
  - Maximum Phonation Time (**MPT** in seconds): Sustained /a/, /i/, /u/ across 3 trials; best trial recorded and compared against normative benchmark (15-20 sec).
  - **s/z Ratio**: Ratio of sustained /s/ to /z/; ratio > 1.4 automatically flagged as indicative of laryngeal pathology / glottic insufficiency.
  - Fundamental Frequency ($F_0$ in Hz), Jitter (%), Shimmer (%), and Harmonics-to-Noise Ratio (**HNR** in dB).
- **Patient-Reported Outcome**: **VHI-30 / VHI-10** (Voice Handicap Index) with Functional, Physical, Emotional subscale scores, total score (0-120), and severity classification (Mild, Moderate, Severe).
- **Therapy Plan**: Prescribed vocal hygiene protocols, resonant voice therapy (RVT), vocal function exercises (VFE), and follow-up timeline.

### 14.2.4 RP-CLN-FLU: Fluency Disorders Assessment Report & Stuttering Proforma
- **Clinical Scope**: Diagnostic evaluation of stuttering and cluttering in children and adults.
- **Standardized Diagnostic Battery — SSI-4**:
  - **%SS Calculation**: Real-time computation of percentage of syllables stuttered across conversational speech and oral reading samples:
    $$\% \text{SS} = \left( \frac{\text{Stuttered Syllables}}{\text{Total Syllables}} \right) \times 100$$
  - Disfluency Typology Breakdown: Part-word repetitions, whole-word repetitions, prolongations, silent postural fixations (blocks), interjections, revisions.
  - **Duration Measure**: Average duration of the 3 longest stuttering blocks in seconds, converted to scaled SSI-4 duration points.
  - **Physical Concomitants**: Scaled evaluation (0-20 points) across secondary behaviors (facial grimaces, head turns, limb tension, distracting noises).
  - **Total SSI-4 Score & Severity**: Summed total score, mapped percentile rank, and severity classification (Very Mild: 10-17, Mild: 18-24, Moderate: 25-31, Severe: 32-36, Very Severe: 37+).
- **Speech Rate Metrics**: Syllables Per Minute (SPM) and Words Per Minute (WPM) compared against developmental norms.
- **Covert & Emotional Factors**: Avoidance behaviors, situational anxiety rating, and OASES (Overall Assessment of Speaker's Experience of Stuttering) score.
- **Recommendations**: Fluency shaping vs stuttering modification goals, parent guidance, and session frequency.

### 14.2.5 RP-CLN-SLA: Comprehensive Speech & Language Assessment Report
- **Clinical Scope**: Evaluation of delayed speech and language, developmental language disorder (DLD), speech sound disorders (SSD), and neurodevelopmental communication profiles.
- **Oral Peripheral Mechanism Examination (OPME)**: Structural and functional examination of lips, tongue, jaw, hard/soft palate, dentition, and Diadochokinetic (DDK) rates (/pa/, /ta/, /ka/, /pataka/).
- **Standardized Assessment Batteries**:
  - **ALD-MM** (Assessment of Language Development - Mukesh Mohan): Receptive Language Age (**RLA**), Expressive Language Age (**ELA**), and Developmental Quotient:
    $$\text{DQ} = \left( \frac{\text{Language Age}}{\text{Chronological Age}} \right) \times 100$$
  - **LPT** (Linguistic Profile Test): Mastery percentages across phonology, semantics, syntax, morphology, and pragmatics.
  - **CAPC-M** (Clinical Assessment of Pragmatics & Communication): Eye contact, joint attention, communicative intent (requesting, commenting, protesting), turn-taking, topic maintenance.
  - **DALI** (Dyslexia Assessment for Indian Children): Phonological awareness, rapid automatized naming (RAN), decoding, reading comprehension.
  - **PCC** (Percentage of Consonants Correct): Phonology error analysis (Substitutions, Omissions, Distortions, Additions); computed as:
    $$\text{PCC} = \left( \frac{\text{Number of Correct Consonants}}{\text{Total Consonants}} \right) \times 100$$
    Severity rating: Mild (>85%), Mild-Moderate (65-85%), Moderate-Severe (50-65%), Severe (<50%).
  - **AAC Evaluation**: Candidacy, motor access, symbol recognition, and communication board / PECS phase.
  - **AVT Tracking**: Erber's listening hierarchy (Detection, Discrimination, Identification, Comprehension), Ling 6-Sound test results.
- **Roadmap**: Prioritized SMART therapy goals, prognostic statement, and home stimulation plan.

### 14.2.6 RP-CLN-CBT: Psychological & Cognitive Behavioural Therapy (CBT) Report
- **Security & Privacy Architecture**: Encrypted at rest using **AES-256 field-level encryption**; accessible only when `cbtQualificationVerified = true` with `cbt.read` permission; excluded from general search and public exports.
- **Standardized Psychometric Scales (Item-Level & Auto-Summed)**:
  - **PHQ-9** (Patient Health Questionnaire - 9): Total Score (0-27) with severity bands (Minimal: 0-4, Mild: 5-9, Moderate: 10-14, Moderately Severe: 15-19, Severe: 20-27). **Clinical Red Flag**: Any positive response on Item #9 ("Thoughts that you would be better off dead") triggers an automated high-priority clinical risk alert banner.
  - **GAD-7** (Generalized Anxiety Disorder - 7): Total Score (0-21) with severity bands (Minimal: 0-4, Mild: 5-9, Moderate: 10-14, Severe: 15-21).
  - **PSS-10** (Perceived Stress Scale): Total Score (0-40) with stress appraisal categories (Low: 0-13, Moderate: 14-26, High: 27-40).
- **Clinical Risk Assessment & Safety Plan Matrix**:
  - Evaluation of suicidal ideation, intent, plan, accessibility of lethal means, historical attempts, and protective factors.
  - Clinical Risk Level assignment: `LOW`, `MODERATE`, `HIGH`.
  - 5-Step Stanley-Brown Safety Plan: Warning signs, internal coping strategies, social contacts for distraction, trusted family contacts, crisis hotlines & psychiatric referral contacts.
- **Cognitive Case Formulation (Beck's Model)**:
  - Core beliefs, intermediate rules/assumptions, automatic thoughts.
  - The ABC Model: `A` (Activating Event), `B` (Cognitive Beliefs / Automatic Thoughts), `C` (Emotional & Behavioral Consequences).
  - Cognitive distortion tagging (Catastrophizing, All-or-Nothing, Mind Reading, Emotional Reasoning, Overgeneralization).
- **CBT Treatment Plan**: Behavioral activation, cognitive restructuring targets, exposure hierarchies, psychoeducation.

### 14.2.7 RP-CLN-DYS: Swallowing & Dysphagia Clinical Evaluation Report
- **Clinical Bedside Swallowing Exam (CSE)**: Cranial nerve examination, oral hygiene, lip seal, mastication, bolus propulsion, residue.
- **Water Swallow Trials**: 3 ml, 5 ml, and 90 ml continuous swallow testing with pre/post SpO2 monitoring, cough reflex, throat clearing, and post-swallow wet vocal quality.
- **Standardized Staging & Diet Mapping**:
  - **FOIS** (Functional Oral Intake Scale): Levels 1 to 7 (Level 1: No oral intake / tube fed; Level 7: Total oral intake with no restrictions).
  - **IDDSI Framework**: Color-coded diet and fluid levels: Drinks (Level 0 Thin to Level 4 Extremely Thick) and Foods (Level 3 Liquidised to Level 7 Regular).
- **Compensatory Maneuvers & Guidelines**: Postural adjustments (chin tuck, head turn), swallowing maneuvers (Mendelsohn, effortful swallow, supraglottic swallow), pacing, aspiration precautions.

### 14.2.8 RP-CLN-HAF: Hearing Aid Fitting, Trial & Verification Certificate
- **Device Details**: Ear (Right, Left, Bilateral), Manufacturer, Model, Style (RIC, BTE, CIC, ITE), Serial Numbers, Earmould / Dome type, Acoustic Matrix.
- **Fitting Verification & REM**: Real-Ear Measurement (REM) / Coupler Gain target matching (NAL-NL2 / DSL v5), Aided Sound Field thresholds vs Unaided thresholds, Functional Gain.
- **Dispensing & Warranty Terms**: Fitting date, trial period outcome, warranty duration (years), loss-and-damage terms, battery care instructions, cleaning guidance, and service recall schedule.

### 14.2.9 RP-CLN-PRG: Periodic Clinical Therapy Progress Summary Report
- **Therapy Review Synthesis**: Synthesized from longitudinal SOAP session notes and goal tracking data over a specified review block (e.g. 12 sessions / 3 months).
- **Core Progression Metrics**: Baseline vs Current Goal Accuracy (%), Ling 6-sound detection distance, MLU increase, %SS reduction.
- **Compliance Metrics**: Attendance rate (% sessions attended vs scheduled), home practice adherence score, parent coaching milestones, and updated SMART objectives for the next treatment phase.

### 14.2.10 RP-CLN-DSC: Clinical Discharge Summary & Home Maintenance Plan
- **Discharge Evaluation**: Initial baseline vs discharge performance benchmarks, total therapy sessions attended, criteria met for formal discharge.
- **Home Maintenance & Annual Recall**: Structured home maintenance plan, speech/auditory stimulation exercises, scheduled annual audiological / speech re-evaluation recall date.

---

## 14.3 Operational & Administrative Reports Catalogue

| Report ID | Name | Frequency | Target Audience | Key Metrics Included |
|---|---|---|---|---|
| **RP-DSH-001** | Daily Practice Summary | Daily | Practitioner / Admin | Appointments total, completed vs no-show, daily cash collected, pending recalls |
| **RP-BIL-002** | Monthly Revenue & GST Register | Monthly | Accountant / Admin | Gross revenue, tax collected breakdown, payment mode breakdown (Cash, UPI, Card) |
| **RP-CLN-003** | Speech & Audiology Outcome Report | Quarterly | Practitioner | Pre/post treatment score trends, hearing aid fitting success rates |

---

# 15. Testing and Acceptance

- **Unit & Integration Testing**: Automated test coverage exceeding **80%** using Jest / Vitest for backend services and React Testing Library for UI components.
- **Clinical Report Verification Testing**: Automated regression testing verifying that all 10 clinical assessment PDF reports compile with valid geometry, zero text-wrapping, crisp SVG graphics, and exact mathematical accuracy on all formulas (PTA1, PTA2, WRS, SNR, %SS, SSI-4, CAPE-V, GRBAS, MPT, s/z, ALD-MM DQ, PHQ-9, GAD-7, FOIS, IDDSI).
- **User Acceptance Testing (UAT)**: Execution of formal UAT scripts by Ms. Palak Paresh Gandhi covering booking, patient registration, clinical recording, billing, and report generation.

---

# 16. DevOps, Deployment and Operations

- **CI/CD Pipeline**: GitHub Actions automated pipeline performing linting, type-checking, automated unit testing, container build, and deployment.
- **Hosting Architecture**: Frontend hosted on Vercel CDN; Node.js API hosted on containerized App Service (Render / AWS ECS); Database on MongoDB Atlas Replica Set (Mumbai).

---

# 17. Data Migration and Seeding

- **CSV Seeding Pipeline**: Automated migration script for importing legacy patient Excel files into `patients` and `caseHistories` collections.
- **System Seeding**: Pre-populating default lookup lists (audiometry frequencies, speech therapy goal banks, ICD-10 speech/hearing diagnosis codes, default clinic roles).

---

# 18. Assumptions, Dependencies and Risk Register

| Risk ID | Risk Description | Impact | Probability | Mitigation Strategy |
|---|---|---|---|---|
| **RSK-001** | Internet connectivity disruption at clinic | High | Medium | PWA offline capability for draft note entry and local caching of active daily schedule |
| **RSK-002** | Third-party WhatsApp API service outage | Medium | Low | Outbox queue holds messages and automatically retries with fallback SMS/Email notification |
| **RSK-003** | Complex SVG rendering latency in PDF generation | Medium | Low | Server-side pre-compiled headless Chromium rendering with in-memory caching |

---

# 19. Requirements Traceability Matrix

| Scope Baseline ID | Requirement ID | MongoDB Collection | Report ID | Test Case ID |
|---|---|---|---|---|
| **WS-01** (Website) | FR-WEB-001 | `pages`, `posts` | — | TC-WEB-001 |
| **DR-01** (Appointments) | FR-APT-012 | `appointments`, `providerSchedules` | — | TC-APT-012 |
| **CB-01** (Clinical Records)| FR-CLN-004 | `visits`, `slAssessments`, `audiologyEvaluations` | — | TC-CLN-004 |
| **CB-01** (Clinical Records)| FR-DOC-002A | `audiologyEvaluations.oae` | **RP-CLN-OAE** | TC-DOC-002A |
| **CB-01** (Clinical Records)| FR-DOC-002B | `audiologyEvaluations.pta`, `immittance` | **RP-CLN-AUD** | TC-DOC-002B |
| **CB-01** (Clinical Records)| FR-DOC-002C | `slAssessments.VOICE` | **RP-CLN-VOI** | TC-DOC-002C |
| **CB-01** (Clinical Records)| FR-DOC-002D | `slAssessments.FLUENCY` | **RP-CLN-FLU** | TC-DOC-002D |
| **CB-01** (Clinical Records)| FR-DOC-002E | `slAssessments.LANGUAGE`, `ARTICULATION` | **RP-CLN-SLA** | TC-DOC-002E |
| **CB-01** (Clinical Records)| FR-DOC-002F | `cbtRecords` (encrypted) | **RP-CLN-CBT** | TC-DOC-002F |
| **CB-01** (Clinical Records)| FR-DOC-002G | `slAssessments.DYSPHAGIA` | **RP-CLN-DYS** | TC-DOC-002G |
| **CB-01** (Clinical Records)| FR-DOC-002H | `hearingAids` | **RP-CLN-HAF** | TC-DOC-002H |
| **CB-01** (Clinical Records)| FR-DOC-002I | `therapyPlans`, `sessionNotes` | **RP-CLN-PRG** | TC-DOC-002I |
| **CB-01** (Clinical Records)| FR-DOC-002J | `therapyPlans.dischargeSummary` | **RP-CLN-DSC** | TC-DOC-002J |
| **CB-02** (Billing & Stock) | FR-BIL-008 | `invoices`, `payments`, `stockItems` | **RP-BIL-002** | TC-BIL-008 |
"""

start_marker = 'sections_7_to_19_md = """'
end_marker = '"""\n\n# Combine raw markdown body'

start_pos = code.find(start_marker)
end_pos = code.find(end_marker)

if start_pos != -1 and end_pos != -1:
    code = code[:start_pos] + 'sections_7_to_19_md = """' + new_sections_7_to_19 + code[end_pos:]
    print("Direct string slice replacement of sections_7_to_19_md succeeded!")
else:
    print(f"Could not find markers: start_pos={start_pos}, end_pos={end_pos}")

with open(build_file, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved updated build_srs_suite.py!")
