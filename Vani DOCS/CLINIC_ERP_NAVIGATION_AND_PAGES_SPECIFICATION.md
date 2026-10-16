# VAANI CLINIC ERP — Master Navigation & Page Specifications
**Document Identifier:** `BA-SRS-WEB-ERP-NAV-001`  
**Governing Standard:** Section 2.2, Section 2.3, Section 3, Section 4 (Modules 4.1 – 4.19), & Section 5 Data Schemas  
**Client Practice:** Vaani Speech & Hearing Clinic, Satara, Maharashtra  
**Owner / Lead Clinician:** Dr. Palak Paresh Gandhi (RCI CRR No. A79214)  

---

## 1. Executive Summary & Navigation Philosophy

The **Vaani Clinic ERP** is a private, role-governed clinical practice management system designed for audiologists, speech-language pathologists, and front-desk clinic coordinators.

### Key Navigation Requirements from the SRS:
1. **Snappy & Instant Scrolling**: In contrast to the customer-facing public website which utilizes a slow momentum smooth scroll for emotional pacing, the **Admin/ERP Portal mandates native, instantaneous, zero-delay scrolling** for high-frequency clinical data entry.
2. **Role-Based Access Control (RBAC)**:
   - `OWNER` (Dr. Palak Gandhi): Full clinical, financial, CBT, configuration, and administrative authority.
   - `RECEPTIONIST`: Scheduling, token check-in, registration, invoicing, payment collection, enquiry triage, and doctor referrals. **Zero read access to sensitive clinical notes/audiograms**.
   - `CLINICIAN`: Scheduling for own calendar, patient assessment, clinical notes, report finalization, and speech/audiology testing.
   - `EDITOR`: Access restricted to Website CMS content (Blog, FAQs, Testimonials, Media).
   - `ADMIN` (Black Angler Support): Infrastructure, system diagnostics, and audit logs with **strict break-glass restrictions (zero clinical data read without explicit Owner consent)**.

---

## 2. Master Navigation Bar (Navbar) Specification

To balance rich functionality with the sleek, clean **Santo Pill Navigation design**, the ERP navigation structure is split into **Core Pill Actions**, **Role-Based Dynamic Items**, and a **Right-Side Utility & Profile Menu**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [VAANI LOGO TAB]   [ Overview ] [ Appointments ] [ Patients ] [ Clinical ] [ Billing ] [ Inventory ] [ Settings ]    │
│  (Inverted Curve)       •             •              •            •            •             •             •          │
│                     (Daily Ops)   (Schedule/Q)    (EMR/MPI)   (Audio/Speech) (Invoices)   (Hearing Aids) (Governance) │
│                                                                                                                       │
│                                                [ Search Ctrl+K ]  [ Quick Token Check-In ]  [ Dr. Palak Gandhi (OWNER) ▾ ]│
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Primary Navbar Items & Route Mapping:

| # | Navbar Label | Primary Route | SRS Module Code | Target Audience & Role | Description & Primary Function |
|---|---|---|---|---|---|
| **1** | **Overview** | `/dashboard` | `DSH` (4.15) | All Roles (Adaptive) | Live reception waiting queue, token tracker, clinician daily caseload, pending tasks. |
| **2** | **Appointments** | `/dashboard/appointments` | `APT` (4.7) | `OWNER`, `RECEPTIONIST`, `CLINICIAN` | Calendar (Day/Week/Month), slot booking, triage requests, waitlist, session packs. |
| **3** | **Patients** | `/dashboard/patients` | `PAT` (4.8) | `OWNER`, `RECEPTIONIST`, `CLINICIAN` | Master Patient Index (MPI), UHID lookup (`VN-YY-######`), demographic data, guardian consent. |
| **4** | **Clinical Records** | `/dashboard/reports` / `/dashboard/clinical` | `CLN` (4.9) & `DOC` (4.11) | `OWNER`, `CLINICIAN` | Audiometry charts, Speech evaluations, CBT worksheets, 10 standardized A4 reports. |
| **5** | **Billing & Invoices** | `/dashboard/billing` | `BIL` (4.12) | `OWNER`, `RECEPTIONIST` | Tax invoices, payment receipts, Dynamic UPI QR, packages, refunds, daily cash register. |
| **6** | **Inventory** | `/dashboard/inventory` | `INV` (4.13) | `OWNER`, `RECEPTIONIST` | Hearing aid stock register, serial numbers, battery stock, vendor orders, reorder alerts. |
| **7** | **Settings** | `/dashboard/settings` | `SET` (4.5) & `USR` (4.4) | `OWNER` only | Clinic NAP, RCI CRR `A79214` gate, "Dr." prefix gate, shifts, holidays, DPDP compliance. |

### Secondary / Dropdown / Action Items:
- **Follow-ups & Recalls** (`/dashboard/recalls` - `REC` 4.10): Accessed via quick pill on Appointments or Dashboard overview.
- **Expenses** (`/dashboard/expenses` - `EXP` 4.14): Clinic petty cash & utilities, nested under Billing/Financials for `OWNER`.
- **Website CMS** (`/dashboard/cms` - `CMS` 4.2): Manage public pages, blog posts, FAQs, testimonials, visible to `OWNER` & `EDITOR`.
- **Global Search (`Ctrl + K`)**: Universal search across Patients (UHID/Name/Phone), Invoices, and Appointments.

---

## 3. Comprehensive Page-by-Page Specifications

---

### Page 1: Overview & Daily Operations Dashboard (`/dashboard`)
*Governed by SRS Section 4.15 (`DSH`) & Section 5.5.60 (`dailyStats`)*

#### Purpose:
The operational command center for the clinic. Renders role-specific real-time operational feeds within 2 seconds.

#### Core Components & Layout:
1. **Clinical / Legal Identity Ribbon**:
   - RCI CRR No. `A79214` verification pill with active green beacon.
   - Operating shift status (e.g. *Morning Shift: 10:00 AM – 01:30 PM*).
2. **Key Metric Counter Cards (4-Column Grid)**:
   - **Today's Scheduled Appointments**: Total count, breakdown of *Confirmed*, *Arrived / In Queue*, *In Consultation*, *Completed*.
   - **Live Waiting Room Queue**: Average patient wait time, next token calling button.
   - **Daily Financial Collection**: Cash collected, Dynamic UPI collections, balance dues pending.
   - **Critical Clinical Recalls Due**: Hearing aid annual servicing alerts, pediatric 3-month speech reviews.
3. **Interactive Daily Live Queue Table**:
   - `Token No.` | `UHID` | `Patient Name` | `Service Category` | `Scheduled Time` | `Arrival Time` | `Status Pill` | `Quick Action`
   - Actions: `Mark Arrived`, `Call In`, `Start Assessment`, `Create Invoice`.
4. **Pending Triage & Web Booking Requests Box**:
   - Shows public appointment requests submitted from the website requiring reception confirmation.
5. **Doctor Referral Inbox Widget**:
   - Incoming patient referrals from Satara ENTs and pediatricians with attached audiogram requests.

---

### Page 2: Appointments & Multi-Provider Scheduler (`/dashboard/appointments`)
*Governed by SRS Section 4.7 (`APT`) & Section 4.6 (`SVC`)*

#### Purpose:
Comprehensive scheduling matrix supporting single consultations, pediatric speech therapy series, and audiometry slot hold governance.

#### Core Components & Layout:
1. **Schedule Views Toggle**:
   - `Day Timeline View` (15-min granular grid showing morning `10:00-13:30` and evening `15:30-20:00` shifts).
   - `Week Multi-Provider View` (side-by-side clinician availability).
   - `Month Calendar Overview` (displaying closures and Maharashtra gazetted holidays).
2. **Appointment State Machine Lifecycle Controls**:
   - State indicators: `REQUESTED` → `CONFIRMED` → `CHECKED_IN` → `IN_SESSION` → `COMPLETED` / `CANCELLED` / `NO_SHOW`.
3. **New Appointment Drawer / Modal**:
   - Existing UHID search or Instant Quick Patient Registration.
   - Service category selector: Pure Tone Audiometry (PTA), Speech Therapy, Impedance Tympanometry, Hearing Aid Trial, CBT Tinnitus Counseling.
   - Notice window enforcement (prevents booking under 120 minutes without override).
   - Automated fatigue quota check (PTA cap: 5/day; Speech Therapy cap: 8/day).
4. **Therapy Series Package Scheduler**:
   - Multi-session booking assistant for 10-session or 20-session pediatric speech therapy packages.
5. **Smart Waitlist & Cancellation Fill Engine**:
   - Displays waiting patients ready to take vacated slots when a cancellation occurs.

---

### Page 3: Master Patient Index & EMR Profiles (`/dashboard/patients`)
*Governed by SRS Section 4.8 (`PAT`) & Section 4.16 (`PRV`)*

#### Purpose:
Centralized directory of all patients with legal UHID assignment, guardian links, longitudinal history, and DPDP compliance.

#### Core Components & Layout:
1. **High-Speed Filter & Search Header**:
   - Instant search by UHID (`VN-26-0001`), Patient Name, Guardian Phone, or Locality.
   - Filters: *Pediatric Speech*, *Geriatric Hearing*, *Hearing Aid User*, *Active Package Holder*.
2. **Master Patient Table**:
   - `UHID` | `Full Name` | `Age / Gender` | `Primary Contact` | `Guardian / Caregiver` | `Registered Date` | `Last Visit` | `Actions`
3. **Patient 360° Profile Drawer / Page**:
   - **Demographics & Identification**: Full legal name, date of birth, gender, blood group, preferred language (Marathi / English).
   - **Caregiver & Guardian Module**: Required for minor patients (<18 years), capturing Aadhaar/ID of legal guardian.
   - **Unified Clinical Timeline**: Chronological log of all audiograms, speech assessment sessions, hearing aid dispensing, and doctor referrals.
   - **Billing & Account Ledger**: Outstanding dues, payment receipts, active session balance cards.
   - **DPDP Act 2023 Consent Audit**: Explicit consent records for WhatsApp notifications, clinical photographic records, and medical data retention.

---

### Page 4: Clinical Diagnostic Records & Reports Engine (`/dashboard/reports`)
*Governed by SRS Section 4.9 (`CLN`) & Section 4.11 (`DOC`)*

#### Purpose:
The clinical core of the practice. Enables diagnostic charting and produces 10 standardized, publication-grade A4 clinical assessment PDF reports.

#### Core Components & Layout:
1. **Service Line Switcher**:
   - **Audiology Suite**:
     - *Pure Tone Audiometry (PTA)*: Interactive bilateral SVG audiogram (frequencies 125 Hz to 8 kHz; -10 dB to 120 dB HL). Standard Red Circles (`○`) for Right Ear, Blue Crosses (`×`) for Left Ear; Bone Conduction (`<`, `>`); Masked symbols (`△`, `□`).
     - *Speech Audiometry*: Speech Reception Threshold (SRT) and Speech Discrimination Score (SDS %).
     - *Impedance Audiometry & Tympanometry*: Type A, As, Ad, B, C curves with acoustic reflex thresholds.
     - *OAE Screening*: Distortion Product (DPOAE) and Transient Evoked (TEOAE) pass/refer results for newborn infant screening.
     - *Hearing Aid Fitting Register*: Manufacturer, Model, Serial No., Matrix, Ear (Right/Left/Bilateral), Warranty expiration.
   - **Speech-Language Pathology (SLP) Suite**:
     - *Speech & Language Assessment Battery*: Receptive/Expressive language age, MLU, phonetic inventory.
     - *Voice Disorders Assessment Proforma*: GRBAS scale, Maximum Phonation Time (MPT), s/z ratio, pitch/loudness range.
     - *Fluency / Stuttering Assessment Proforma*: SSI-4 severity score, stuttering percentage, secondary behaviors.
     - *Pediatric Feeding & Dysphagia Evaluation*: Oral motor examination, swallow reflex, aspiration risk.
     - *Therapy Progress Notes & Home Programs*: Objective SOAP notes (Subjective, Objective, Assessment, Plan) with Devanagari Marathi caregiver home exercises.
   - **Cognitive Behavioural Therapy (CBT - BR-042 Gated)**:
     - Tinnitus Handicap Inventory (THI) automated scoring.
     - Cognitive restructuring worksheets, sound habituation schedules (strictly protected per `cbtQualificationVerified`).
2. **Automated 10-Report PDF Generator Bar**:
   - Single-click export of A4 vector PDFs compliant with Maharashtra Clinical Establishment Act format:
     1. OAE Newborn Hearing Screening Certificate
     2. Comprehensive Pure Tone & Speech Audiological Evaluation
     3. Voice Disorders Diagnostic Proforma
     4. Fluency & Stuttering Diagnostic Proforma
     5. Pediatric Speech-Language Evaluation Battery
     6. CBT & Psychological Intervention Summary
     7. Dysphagia & Pediatric Swallowing Assessment
     8. Hearing Aid Dispensation & Warranty Slip
     9. Multi-Session Therapy Progress Summary
     10. Comprehensive Clinical Discharge Summary
   - All reports automatically include the clinic letterhead header, RCI CRR Seal (`CRR No. A79214`), and bilingual Marathi/English clinical impressions.

---

### Page 5: Billing, Invoices & Financial Ledger (`/dashboard/billing`)
*Governed by SRS Section 4.12 (`BIL`), Section 4.14 (`EXP`), & Section 4.5 (`SET`)*

#### Purpose:
Fiscal governance, automated taxation, sequence generation, package redemption, and daily financial closing.

#### Core Components & Layout:
1. **Financial Overview Stats**:
   - Daily Total Billing, Daily Cash Collected, Daily Digital UPI Collected, Accounts Receivable (Unpaid Invoices).
2. **Invoice Generation Form**:
   - Patient UHID selector (auto-populates patient details).
   - Itemized service picker (linked to Service Catalogue price list).
   - Automated Tax Breakdown:
     - Clinical Consultations: **0% GST (Exempt under Notification 12/2017-CT(R), Heading 9993)**.
     - Hearing Aid Accessories & Batteries: **18% GST (HSN 9021)**.
   - Payment method: Dynamic UPI QR (`vaaniclinic@okaxis`), Cash, Card, Bank Transfer.
3. **Interactive NPCI Dynamic UPI QR Modal**:
   - Generates instantaneous NPCI-compliant UPI payment QR with exact invoice amount pre-encoded into the payload.
4. **Multi-Session Therapy Packages Ledger**:
   - Tracks 10-session speech therapy package cards (`PKG-SP-10`), displaying sessions remaining, expiry date, and session deduction history.
5. **Tax Invoices & Receipts Master Table**:
   - `Invoice No.` | `Date` | `UHID` | `Patient Name` | `Total Amount` | `Tax (GST)` | `Paid Amount` | `Mode` | `Actions (PDF / Print / Receipt)`

---

### Page 6: Hearing Aid Inventory & Accessories Stock (`/dashboard/inventory`)
*Governed by SRS Section 4.13 (`INV`)*

#### Purpose:
Tracks high-value hearing aid devices, serial numbers, warranty timelines, and clinic consumable stocks.

#### Core Components & Layout:
1. **Stock Overview Cards**:
   - In-Stock Hearing Aids, Units on Patient Trial, Consumable Batteries (Size 10, 312, 13, 675), Low-Stock Alerts.
2. **Hearing Aid Device Serial Register Table**:
   - `Serial Number` | `Brand / Make` (Phonak, Oticon, Signia, Widex) | `Model` | `Type` (BTE, RIC, CIC, IIC) | `Status` (In Stock, On Trial, Dispensed, Sent for Service) | `Patient UHID` | `Warranty Expiry`
3. **Consumables & Accessories Inventory Table**:
   - Batteries, ear tips, wax guards, impression material, tubing.
   - Automated reorder point indicators with supplier contact details.
4. **Vendor & Manufacturer Directory**:
   - Authorized distributor contacts, RMA service request generation.

---

### Page 7: Follow-Ups, Recalls & Patient CRM (`/dashboard/recalls`)
*Governed by SRS Section 4.10 (`REC`) & Section 4.17 (`NTF`)*

#### Purpose:
Proactive clinical retention and longitudinal patient care management.

#### Core Components & Layout:
1. **Automated Recall Trigger Categories**:
   - **Annual Audiometric Review**: Patients with sensorineural hearing loss due for annual threshold re-check.
   - **Pediatric Speech Milestone Check**: 3-month and 6-month developmental language re-evaluations.
   - **Hearing Aid Servicing & Calibration**: Scheduled 6-month cleaning, acoustic check, and firmware update.
   - **Newborn OAE Re-Screen**: Infants flagged as *Refer* in initial maternity screening scheduled for 4-week diagnostic follow-up.
2. **Actionable Recall Management Table**:
   - `UHID` | `Patient Name` | `Recall Reason` | `Due Date` | `Status` | `Contact Channel (WhatsApp/Call)` | `Action`
   - Actions: `Send WhatsApp Recall Alert`, `Mark Contacted`, `Book Follow-up Slot`, `Dismiss`.

---

### Page 8: Website CMS & Public Content Manager (`/dashboard/cms`)
*Governed by SRS Section 4.2 (`CMS`)*

#### Purpose:
Allows clinic staff to update public website content without requiring developer code changes.

#### Core Components & Layout:
1. **Clinical Service Pages Editor**:
   - Manage text, bilingual Marathi descriptions, FAQs, and pricing for all 15 clinical service offerings.
2. **Blog & Hearing Health Articles Editor**:
   - Markdown / rich text editor with image upload for patient educational content.
3. **Patient Testimonials & Reviews Manager**:
   - Moderate and feature verified patient feedback and video testimonials.
4. **FAQ Knowledgebase Editor**:
   - Grouped by Speech Therapy, Hearing Aids, Audiology Tests, and Insurance/Payment.
5. **Doctor Referral Submissions Review**:
   - Review and triage incoming doctor referral forms submitted by external ENT specialists.

---

### Page 9: Clinic Governance, Credentials & Settings (`/dashboard/settings`)
*Governed by SRS Section 4.5 (`SET`), Section 4.4 (`USR`), & Section 4.16 (`PRV`)*

#### Purpose:
Central administrative configuration engine operating in an ultra-dense, spreadsheet-style data sheet layout.

#### Core Modules (The 8 Settings Tabs):
1. **Clinic Profile & NAP**: Legal name, trade name, bilingual English/Marathi taglines, official logo, clinical stamp, verified NAP address, GPS coordinates, wheelchair accessibility.
2. **Clinical Gates & Licenses**: RCI CRR `A79214` registration gate, "Dr." prefix title gate, CBT practice authorization (`BR-042`), Maharashtra Clinical Establishment Act license, Gumasta Shop Act, Udyam MSME, GSTIN, and AES-256 encrypted PAN.
3. **Hours & Calendar**: Operating shifts (`10:00-13:30` & `15:30-20:00`), slot granularity (`15 min`), standard timezone (`Asia/Kolkata`), Maharashtra gazetted holidays template importer.
4. **Booking Policy**: Minimum notice window (`120 min`), advance booking horizon (`30 days`), slot hold expiration (`24 hrs`), cancellation cutoff (`4 hrs`), reschedule limit (`2 times`), PTA quota cap (`5/day`), Speech therapy quota cap (`8/day`), Auto-confirm toggle.
5. **Billing, GST & UPI**: UHID prefix (`VN-`), invoice prefix (`INV-2026-`), receipt prefix (`REC-2026-`), healthcare GST exemption (0%), product tax (18%), Dynamic UPI VPA (`vaaniclinic@okaxis`), settlement bank details.
6. **Notifications & DPDP**: Quiet hours (`21:00-08:00 IST`), reminder offsets (24h & 2h), DPDP Act 2023 Statutory Grievance Officer (Ms. Palak Paresh Gandhi), medico-legal data retention schedules (Adults 7 yrs; Minors age 21; Invoices 8 yrs).
7. **Features & Security**: Practice module activation switches (Inventory, Expenses, Therapy Packages, CBT, Online Booking, Waitlist, Referral Inbox), TOTP 2FA status, idle session timeout.
8. **Tamper-Evident Audit Trail**: Chronological SHA-256 hash-chained revision history logging every parameter alteration.

---

## 4. Role-Based Navigation Matrix

| Navbar Module | `OWNER` (Dr. Palak) | `RECEPTIONIST` | `CLINICIAN` | `EDITOR` | `ADMIN` (IT Support) |
|---|:---:|:---:|:---:|:---:|:---:|
| **Overview Dashboard** | Full Access | Reception Queue View | Clinical Caseload View | Hidden | System Health View |
| **Appointments** | Full Access | Full Scheduling & Triage | Own Calendar Schedule | Hidden | Read-Only Config |
| **Patients** | Full Access | Demographics & Billing | Assigned Patient EMR | Hidden | Zero Patient Data |
| **Clinical Records** | Full Diagnostic Suite | Hidden | Assigned Patient Forms | Hidden | Zero Clinical Data |
| **Billing & Payments** | Full Financials | Invoicing & Collections | View Own Session Balance | Hidden | System Accounting |
| **Inventory** | Full Stock & Valuation | Check-in / Dispense | Device Serial Lookup | Hidden | Hidden |
| **Settings** | Full Governance Control | Hidden | Hidden | Hidden | Infrastructure Config |
| **Website CMS** | Full CMS | Hidden | Hidden | Full Editor | Hidden |

---

## 5. Summary of Recommended Navbar Adjustments

To align the current dashboard navbar with this complete SRS architecture:

1. **Keep Core Desktop Navigation Ultra-Clean**:
   - `Overview` (`/dashboard`)
   - `Appointments` (`/dashboard/appointments`)
   - `Patients` (`/dashboard/patients`)
   - `Clinical Reports` (`/dashboard/reports`)
   - `Billing` (`/dashboard/billing`)
   - `Settings` (`/dashboard/settings`)
2. **Add "More / Operations" Quick Dropdown** for supplementary modules:
   - `Inventory & Devices` (`/dashboard/inventory`)
   - `Follow-ups & Recalls` (`/dashboard/recalls`)
   - `Website CMS` (`/dashboard/cms`)
3. **Maintain User & Clinic Quick Badges on Right**:
   - `RCI CRR No. A79214` Status Pill
   - Search Dialog Trigger (`Ctrl + K`)
   - Return to Public Website Button (`Public Website`)
   - Clinician Profile Avatar & Logout Action
