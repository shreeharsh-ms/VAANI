# VAANI SPEECH & HEARING CLINIC — ERP SETTINGS PAGE SPECIFICATION
**Document Reference:** Black Angler Executive Documentation `BA-SRS-WEB-ERP-001`  
**Target Module:** 4.5 Clinic Settings and Configuration (`SET`) & Data Model `5.5.6 clinicSettings`  
**Author:** Shreeharsh M. Shivpuje (Founder / Lead Solutions Architect, Black Angler Pvt Ltd)  
**Classification:** Strictly Confidential • Medical Practice ERP Architecture  

---

## 1. Executive Overview & Scope

According to the official **Software Requirements Specification (SRS)** for **Vani's Speech & Hearing Clinic (Satara)**, the **Settings & Configuration Page** is the central governance and administrative engine of the entire platform. It controls:
1. **Public Website Behaviors**: Clinical claims verification, NAP (Name, Address, Phone) single source of truth, booking rules, and announcements.
2. **Clinical Governance**: RCI statutory registration enforcement, title protection ("Dr." prefix rules), CBT mental health credential gates, and document stamps.
3. **Operational Policies**: Provider schedules, appointment slot intervals, booking holds, and Maharashtra state holiday calendars.
4. **Financial & Tax Systems**: Integer-paise billing rules, GST tax treatment, HSN/SAC codes, and UPI/Bank settlement configurations.
5. **Data Protection & Legal Compliance**: Digital Personal Data Protection (DPDP) Act 2023 grievance officer designation, statutory retention timers, and tamper-evident SHA-256 audit logging.

All settings are encapsulated in the MongoDB singleton document `clinicSettings` (`_id: "clinic"`), with strict before-and-after audit logging (`FR-SET-013`) and role-based access restricted exclusively to the `OWNER` role (`FR-USR-001`).

---

## 2. Complete Breakdown of Settings Controlled via Settings Page

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          VAANI ERP — SETTINGS MODULE TAXONOMY                          │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ 1. Identity & Branding   │ 2. NAP & Geo-Location    │ 3. Legal & Statutory IDs         │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ 4. Clinical Gate Flags   │ 5. Provider Schedules    │ 6. Holidays & Calendar Closures  │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ 7. Booking & Hold Policy │ 8. Numbering Sequences   │ 9. GST & Fiscal Tax Engine       │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ 10. Payment & UPI Gate   │ 11. Notifications Outbox │ 12. DPDP & Retention Rules       │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ 13. Feature Toggles      │ 14. Website CMS Controls │ 15. Grievance Officer (DPDP)     │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ 16. Diagnostic Templates │ 17. Master Lookups       │ 18. User RBAC & Session Security │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

---

### Tab 1: Clinic Identity & Brand Configuration
*Governing SRS Requirement:* `FR-SET-001`, `5.5.6 identity`

| Setting Field | Field Type | Data Key | Description & Business Rules |
| :--- | :--- | :--- | :--- |
| **Legal Entity Name** | Text String | `identity.legalName` | Registered corporate/proprietorship name (e.g. *Vaani Speech and Hearing Clinic*). |
| **Trade / Brand Name** | Text String | `identity.tradeName` | Patient-facing brand name used across header titles and SMS. |
| **Bilingual Tagline** | Dual String | `identity.tagline.en`<br>`identity.tagline.mr` | English: *"Speak • Hear • Connect"*<br>Marathi: *"स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा"* |
| **Official White Logo** | Media Upload | `identity.logoMediaId` | High-resolution SVG/PNG used on the Santo top navigation bar and public headers. |
| **Letterhead Asset** | Media Upload | `identity.letterheadMediaId` | 300 DPI A4 header graphic with clinic contact banner for PDF reports. |
| **Official Clinic Stamp** | Media Upload | `identity.stampMediaId` | Transparent PNG stamp containing practitioner's clinical registration seal. |

---

### Tab 2: Contact, Location & NAP Single-Source
*Governing SRS Requirement:* `FR-SET-001`, `5.5.6 contact`, `5.5.6 address`, `FR-WEB-028`

The settings page acts as the **single source of truth** for all Name, Address, and Phone (NAP) citations across the public website, Google Business profile, and invoice footers.

| Setting Field | Data Key | Business Logic & Validations |
| :--- | :--- | :--- |
| **Primary Phone** | `contact.phones[0].number` | 10-digit Indian mobile number (`+91 98220 12345`) matching `VR-PAT-001`. |
| **WhatsApp Direct Line** | `contact.phones[i].whatsapp` | Boolean flag designating which telephone number receives patient WhatsApp triage chats. |
| **Official Email** | `contact.email` | Central clinic email for appointment confirmations and system alerts. |
| **Clinic Physical Address** | `address.line1`, `address.line2`, `locality`, `taluka`, `district`, `state`, `pin` | Structured address: *Sadashiv Peth, Opp. Satara Zilla Parishad, Satara, Maharashtra 415002*. |
| **Bilingual Landmark** | `address.landmark.en`, `address.landmark.mr` | Nearby physical reference for patients in Marathi and English. |
| **Geo-Coordinates (Point)** | `address.geo.coordinates` | GeoJSON `[longitude, latitude]` for Google Maps directions. |
| **Google Maps URL** | `address.mapsUrl` | Direct Google Maps deep-link for patient location cards. |
| **Parking & Accessibility Notes**| `address.parkingNote`, `address.accessibilityNote` | Wheelchair ramp availability, elevator access, and vehicle parking guidance. |

---

### Tab 3: Statutory Registrations & Tax Compliance
*Governing SRS Requirement:* `FR-SET-001`, `FR-SET-007`, `5.5.6 registrations`, `5.5.6 tax`

| Setting Field | Data Key | Storage & Display Constraints |
| :--- | :--- | :--- |
| **GSTIN** | `registrations.gstin` | 15-character Goods & Services Tax Identification Number (optional if under turnover threshold). |
| **PAN Card Number** | `registrations.pan` | **Stored encrypted at rest (AES-256-GCM)** using KMS-wrapped data key. **Masked in UI** (e.g. `ABCDE****F`). |
| **Clinical Establishment Reg No** | `registrations.clinicalEstablishmentNo` | Statutory license under Maharashtra Clinical Establishments Act. |
| **Shop & Establishment Act No** | `registrations.shopActNo` | Local municipal gumasta license registration number. |
| **Udyam MSME Registration** | `registrations.udyamNo` | Government of India MSME registration code. |
| **Default Tax Treatment** | `tax.defaults.service`, `tax.defaults.product` | Configurable tax rates (Exempt, 0%, 5%, 12%, 18%, 28%). Healthcare services are generally GST-exempt. |
| **HSN / SAC Mapping** | Service catalogue mapping | HSN for hearing aid devices / SAC code 9993 for health and therapy services. |
| **Display GST on Invoices** | `tax.showGst` | Toggle flag; when false, invoices suppress GST breakdowns and show pure clinical fees. |
| **Rounding Mode** | `tax.roundingMode` | Rounding policy for cash and invoice settlement (e.g. `NEAREST_RUPEE`). |

---

### Tab 4: Clinical Credentials & Statutory Title Gates
*Governing SRS Requirement:* `FR-SET-002`, `BR-041`, `BR-042`, `5.5.6 credentials`

> [!IMPORTANT]
> **Statutory Truth-in-Advertising Rules (BR-041 & BR-042):**  
> The system strictly prohibits publishing any professional title or claim on the public website or clinical reports unless verified by the Owner and backed by an uploaded statutory certificate.

```
       Credential Verification Pipeline (Settings Gate)
┌───────────────────────────┐     ┌────────────────────────────┐     ┌────────────────────────────┐
│ 1. Upload Proof Document  │ ──> │ 2. Owner Review & Approval │ ──> │ 3. Gate Flags Activated    │
│    (RCI, MASLP, CBT Cert) │     │    (Audit Log Recorded)    │     │    (Public Web & ERP live) │
└───────────────────────────┘     └────────────────────────────┘     └────────────────────────────┘
```

1. **RCI Verification Gate (`credentials.rciVerified`)**:
   - Enforces Rehabilitation Council of India statutory registration number (e.g. `CRR No. A79214`).
   - Gate: When enabled, unlocks RCI badge display on public site and clinical proforma footer seals.
2. **CBT Practice Gate (`credentials.cbtQualificationVerified`)**:
   - Enforces verified psychology/CBT postgraduate training (`BR-042`).
   - Gate: When `false`, the Cognitive Behavioural Therapy module and online booking for psychological services are **completely locked and hidden**.
3. **Medical Title Gate (`credentials.titlePermitted`)**:
   - Regulates whether the practitioner prefix may display as *"Dr."* vs *"Ms./Audiologist"*, preventing ethical violations under Indian medical council norms.

---

### Tab 5: Practice Hours, Shifts & Slot Granularity
*Governing SRS Requirement:* `FR-SET-003`, `5.5.6 hours`, `5.5.10 PROVIDERSCHEDULES`

* **Weekly Operating Schedule**:
  - Days of the week (`0 = Sunday` to `6 = Saturday`).
  - Multi-session support per day (e.g. **Morning Shift:** 10:00 to 13:30; **Afternoon Shift:** 15:30 to 20:00).
  - Dedicated midday lunch/sound-booth sanitization breaks.
* **Slot Granularity Selector (`hours.granularityMin`)**:
  - Configurable dropdown options: **5, 10, 15, 20, or 30 minutes** (System Default: `15 minutes`).
  - Dictates the atomic scheduling units across the calendar grid.
* **Timezone Lock (`hours.timezone`)**:
  - Fixed to `Asia/Kolkata` (IST) to eliminate daylight saving calculation discrepancies.

---

### Tab 6: Holiday Calendar & Clinic Closures
*Governing SRS Requirement:* `FR-SET-004`, `5.5.11 BLOCKEDTIMES`

* **Date Range Blockouts**: Configurable start/end date-times for planned leaves and emergencies.
* **Scope Assignment**: Ability to apply closures to the **Whole Clinic** or to **Specific Clinicians**.
* **Template Import Engine**: One-click import of the **Maharashtra State Gazetted Holidays list** (Ganesh Chaturthi, Diwali, Gudi Padwa, Independence Day, etc.).
* **Public Notice Banner Toggle (`showOnWebsite`)**: Displays temporary clinic closure alerts in English and Marathi on the website banner and online booking engine.

---

### Tab 7: Appointment & Online Booking Governance Policy
*Governing SRS Requirement:* `FR-SET-005`, `5.5.6 bookingPolicy`

| Policy Parameter | Data Key | Default Value | Rule Description |
| :--- | :--- | :--- | :--- |
| **Minimum Notice** | `bookingPolicy.minNoticeMin` | `120 mins` (2 hrs) | Prevents instant walk-ins from colliding with active appointments. |
| **Maximum Advance** | `bookingPolicy.maxAdvanceDays` | `30 days` | Limits booking visibility to 30 days ahead. |
| **Slot Hold Duration** | `bookingPolicy.holdHours` | `24 hours` | Expiration time for unconfirmed web appointment requests. |
| **Auto-Confirm Mode** | `bookingPolicy.autoConfirm` | `OFF` (Manual) | Global toggle: auto-confirms or queues requests for staff review. |
| **Cancellation Window** | `bookingPolicy.cancelWindowHours` | `4 hours` | Minimum time before slot to cancel without penalty. |
| **Reschedule Limit** | `bookingPolicy.rescheduleLimit` | `2 times` | Maximum times a patient may reschedule a single booking reference. |
| **Same-Day Bookings** | `bookingPolicy.sameDay` | `TRUE` | Allows same-day slots if requested before minimum notice window. |
| **Grace Period for No-Show**| `bookingPolicy.graceNoShowMin` | `15 mins` | Leniency before a confirmed patient is marked `NO_SHOW`. |
| **Daily Service Caps** | `bookingPolicy.dailyCapByService` | Configurable | Limits high-fatigue sessions (e.g. max 4 PTA evaluations per day). |

---

### Tab 8: Automated Numbering Sequences
*Governing SRS Requirement:* `FR-SET-006`, `5.5.6 numbering`, `ADR-06`

Centralized sequence configuration using MongoDB atomic `$inc` counters to guarantee gap-free numbering:
1. **Patient UHID Sequence**:
   - `uhidPrefix`: Default `VN-` (e.g. `VN-26-000104`).
   - Format includes clinic code, 2-digit financial year, and 6-digit zero-padded integer.
2. **Clinical Invoice Sequence**:
   - `invoicePrefix`: Default `INV-`.
   - **Annual Fiscal Year Reset**: Sequences automatically cycle every **April 1st** to align with the Indian financial year (`2026-27`).
3. **Payment Receipt Sequence**:
   - `receiptPrefix`: Default `REC-` with fiscal cycle tag.
4. **Public Booking Reference**:
   - `bookingRefLength`: Default 6-character high-entropy alphanumeric string (e.g. `BK-7K3QH2`) preventing enumeration attacks.

---

### Tab 9: Payment Gateway & Banking Configuration
*Governing SRS Requirement:* `FR-SET-008`, `5.5.6 payment`

* **Accepted Payment Modes**: Checkbox selector for `CASH`, `UPI`, `DEBIT_CARD`, `CREDIT_CARD`, `NET_BANKING`, `NEFT_RTGS`.
* **UPI Configuration**:
  - `upiId`: Clinic Virtual Payment Address (e.g. `vaaniclinic@okaxis` or `9822012345@upi`).
  - `upiName`: Payee display name (*Vaani Speech & Hearing Clinic*).
  - **Dynamic UPI QR Generation**: Generates standard NPCI UPI QR payloads on printed invoices and checkout screens.
* **Bank Account Details (Encrypted)**:
  - Account Name, Bank Name, IFSC Code, and Bank Account Number.
  - **Account number is encrypted at rest** using AES-256 and only the last 4 digits appear on invoice payment slips.

---

### Tab 10: Notification Outbox & Messaging Policies
*Governing SRS Requirement:* `FR-SET-009`, `4.17 (NTF)`, `5.5.6 notifications`

* **Quiet Hours Enforcement (`notifications.quietHours`)**:
  - Default: **21:00 (9:00 PM) to 08:00 (8:00 AM)** IST.
  - System suppresses non-urgent transactional SMS and WhatsApp notifications during sleep hours.
* **Automated Appointment Reminders (`notifications.reminderOffsetsMin`)**:
  - Offset 1: `1440 minutes` (24 hours prior to appointment).
  - Offset 2: `120 minutes` (2 hours prior to slot).
* **Email Sender Identity (`notifications.senderEmail`, `senderName`)**:
  - Amazon SES / SMTP verified sender identity: *Vaani Clinic <appointments@vaaniclinic.com>*.
* **Communication Channel Toggles**:
  - Active adapters: `IN_APP`, `EMAIL`.
  - Future module hooks: `WHATSAPP_BUSINESS`, `SMS_DLT`.

---

### Tab 11: Medico-Legal Data Retention & DPDP Act Compliance
*Governing SRS Requirement:* `FR-SET-010`, `FR-PRV-003`, `FR-PRV-004`, `5.5.6 retention`, `5.5.6 grievanceOfficer`

* **Statutory Medical Record Retention Rules (`retention`)**:
  - **Adult Clinical Records**: `7 years` from the date of the last outpatient visit.
  - **Pediatric Patient Records**: Retained **until the child reaches age 21**, or 7 years from the last consultation (whichever is greater).
  - **Billing & Accounting Records**: `8 years` as mandated by Indian Income Tax Act.
  - **Audit Logs**: `7 years` immutable tamper-evident retention.
* **DPDP Act 2023 Statutory Grievance Officer (`grievanceOfficer`)**:
  - Mandatory legal publication of the designated officer:
    - **Name**: Ms. Palak Paresh Gandhi
    - **Email**: `grievance@vaaniclinic.com`
    - **Phone**: Clinic landline/mobile
  - Directly feeds the website Privacy Policy and patient consent intake proformas.

---

### Tab 12: Modular Feature Toggles (License & Activation)
*Governing SRS Requirement:* `FR-SET-012`, `5.5.6 features`

Allows the clinic owner to enable or disable functional modules dynamically without redeploying code:

| Feature Toggle Key | Default | Impact When Disabled |
| :--- | :--- | :--- |
| `features.onlineBooking` | `TRUE` | Hides public appointment stepper; displays "Call clinic to schedule" modal. |
| `features.cbt` | `FALSE` | Restricts CBT clinical records tab and psychometric tests unless credentialed. |
| `features.inventory` | `TRUE` | Hides hearing aid serialized inventory management and stock alert engine. |
| `features.expenses` | `TRUE` | Disables internal operating expense voucher capture and financial reporting. |
| `features.packages` | `TRUE` | Disables pre-paid multi-session bundle billing (e.g. 10 speech therapy sessions). |
| `features.waitlist` | `TRUE` | Hides slot cancellation auto-reallocation queue. |
| `features.referralInbox` | `TRUE` | Hides the dedicated medical practitioner referral portal inbox. |

---

### Tab 13: Standardized Diagnostic Proformas & Document Templates
*Governing SRS Requirement:* `FR-SET-011`, `4.11 (DOC)`, `Section 14`

Governs visual layout and clinical stamps across the **10 Automated Clinical Assessment Reports**:
1. *Otoacoustic Emissions (OAE) Newborn Hearing Screening Report*
2. *Pure Tone & Speech Audiological Diagnostic Evaluation Report*
3. *Voice Disorders Assessment Proforma (GRBAS / MPT)*
4. *Fluency Disorders Assessment & Stuttering Proforma (SSI-4)*
5. *Comprehensive Speech & Language Assessment Battery (ALD-MM / LPT)*
6. *Psychological & CBT Screening Report (PHQ-9 / GAD-7 / PSS-10)*
7. *Swallowing & Dysphagia Clinical Evaluation Report (IDDSI / FOIS)*
8. *Hearing Aid Fitting & Real-Ear Verification Slip*
9. *Periodic Speech/Hearing Therapy Progress Summary*
10. *Clinical Discharge Summary & Home Stimulation Protocol*

* **Header & Letterhead Controls**: Clinic name, address, phone, email, and accreditation logo placement.
* **Statutory Sign-Off Text**: Bilingual disclaimer regarding the medico-legal validity of diagnostic findings.
* **RCI Practitioner Stamp Positioning**: Coordinates for embedding the digital signature and CRR number.

---

### Tab 14: Master Lookups Management
*Governing SRS Requirement:* `FR-SET-014`, `5.5.7 lookups`

Allows the `OWNER` to manage system dropdown menus with bilingual labels (`{en, mr}`):
* **`REFERRAL_SOURCE`**: Pediatrician, ENT Surgeon, School Teacher, Relative, Social Media, Camp.
* **`CANCEL_REASON`**: Patient Health Issue, Urgent Travel, Traffic / Weather Delay, Clinic Overrun.
* **`EXPENSE_CATEGORY`**: Clinic Rent, Power & Water, Equipment Calibration, Therapy Toys, Salaries.
* **`DOC_TYPE`**: Audiogram, ENT Discharge Sheet, IEP School Plan, Brain MRI/CT Scan.
* **`RELATION`**: Mother, Father, Guardian, Grandparent, Spouse, Self.
* **`LANGUAGE`**: Marathi, English, Hindi, Gujarati, Kannada.
* **`TAG`**: High Fall Risk, Non-Verbal, Cochlear Implant Candidate, Hearing Aid User.
* **`DISCOUNT_REASON`**: Financial Hardship, Camp Concession, Staff Family, Director Courtesy.

---

### Tab 15: Staff Accounts, RBAC & Security Settings
*Governing SRS Requirement:* `4.3 (AUTH)`, `4.4 (USR)`, `5.5.1 users`

* **Staff User Roster**: Creation, role assignment, and suspension of accounts (`OWNER`, `RECEPTIONIST`, `CLINICIAN`, `ADMIN`).
* **Practitioner Clinical Profiles**: RCI Registration Number, academic degrees, signature upload, working hours shift template, calendar highlight color.
* **Two-Factor Authentication (TOTP)**: Mandatory 2FA enforcement policy for `OWNER` and `ADMIN` accounts.
* **Idle Session Timeout**: Configurable inactivity duration before locking the screen (Default: `15 minutes`).
* **Active Session Manager**: List of active logins with browser, operating system, truncated IP, and one-click remote session revocation.
* **Emergency Break-Glass Support**: Time-boxed 60-minute emergency access grant for Black Angler technical support, fully audited.

---

## 3. Database Schema Implementation (`clinicSettings`)

```javascript
// MongoDB Collection: clinicSettings (Singleton: _id: "clinic")
{
  "_id": "clinic",
  "identity": {
    "legalName": "Vaani Speech & Hearing Clinic",
    "tradeName": "Vaani Clinic",
    "tagline": {
      "en": "Speak • Hear • Connect",
      "mr": "स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा"
    },
    "logoMediaId": ObjectId("670ca1234567890abcdef01"),
    "letterheadMediaId": ObjectId("670ca1234567890abcdef02"),
    "stampMediaId": ObjectId("670ca1234567890abcdef03")
  },
  "contact": {
    "phones": [
      { "label": "Appointments Desk", "number": "+919822012345", "isPrimary": true, "whatsapp": true },
      { "label": "Doctor Consultation", "number": "+919423099887", "isPrimary": false, "whatsapp": false }
    ],
    "email": "info@vaaniclinic.com",
    "website": "https://vaaniclinic.com"
  },
  "address": {
    "line1": "Shop No. 4, Ground Floor, Sadashiv Arcade",
    "line2": "Opp. Satara Zilla Parishad, Sadashiv Peth",
    "locality": "Sadashiv Peth",
    "taluka": "Satara",
    "district": "Satara",
    "state": "Maharashtra",
    "pin": "415002",
    "country": "IN",
    "landmark": {
      "en": "Opposite Zilla Parishad Gate",
      "mr": "जिल्हा परिषद गेटसमोर"
    },
    "geo": {
      "type": "Point",
      "coordinates": [73.9934, 17.6833] // [lng, lat]
    },
    "mapsUrl": "https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Satara",
    "parkingNote": "Dedicated two-wheeler parking in front; four-wheeler street parking on road.",
    "accessibilityNote": "Ground-floor wheelchair accessible entrance with ramp access."
  },
  "registrations": {
    "gstin": "27AAAAA0000A1Z5",
    "pan": "ENC:AES256GCM:a7b8c9d0...", // Encrypted at rest
    "clinicalEstablishmentNo": "MH-STR-CEA-2024-0081",
    "shopActNo": "STR-SA-2024-0192",
    "udyamNo": "UDYAM-MH-28-0012345"
  },
  "credentials": {
    "rciVerified": true,
    "cbtQualificationVerified": true,
    "titlePermitted": true, // Permits "Dr." prefix
    "proofDocumentIds": [ObjectId("670ca1234567890abcdef04")],
    "verifiedBy": "user_mock_palak",
    "verifiedAt": ISODate("2026-10-01T10:00:00Z")
  },
  "hours": {
    "weekly": [
      {
        "day": 1, // Monday
        "sessions": [
          { "start": "10:00", "end": "13:30" },
          { "start": "15:30", "end": "20:00" }
        ]
      },
      // ... Days 2 through 6
      { "day": 0, "sessions": [] } // Sunday Closed
    ],
    "granularityMin": 15,
    "timezone": "Asia/Kolkata"
  },
  "bookingPolicy": {
    "minNoticeMin": 120,
    "maxAdvanceDays": 30,
    "holdHours": 24,
    "autoConfirm": false,
    "cancelWindowHours": 4,
    "rescheduleLimit": 2,
    "sameDay": true,
    "graceNoShowMin": 15,
    "dailyCapByService": {
      "AU_PTA": 5,
      "SL_THERAPY": 8
    }
  },
  "numbering": {
    "uhidPrefix": "VN-",
    "uhidFormat": "PREFIX-YY-SEQ6",
    "invoicePrefix": "INV-",
    "receiptPrefix": "REC-",
    "bookingRefLength": 6
  },
  "tax": {
    "defaults": {
      "service": 0,    // Exempt for clinical therapy
      "product": 18    // 18% for hearing aid accessories
    },
    "showGst": false,
    "roundingMode": "ROUND_NEAREST_INTEGER"
  },
  "payment": {
    "modes": ["CASH", "UPI", "DEBIT_CARD", "CREDIT_CARD", "BANK_TRANSFER"],
    "upiId": "vaaniclinic@okaxis",
    "upiName": "Vaani Speech & Hearing Clinic",
    "bankDetails": {
      "accountName": "Vaani Speech & Hearing Clinic",
      "number": "ENC:AES256GCM:b8c9d0...", // Encrypted
      "ifsc": "HDFC0000123",
      "bank": "HDFC Bank, Satara Main Branch"
    }
  },
  "notifications": {
    "quietHours": {
      "start": "21:00",
      "end": "08:00"
    },
    "reminderOffsetsMin": [1440, 120],
    "senderEmail": "appointments@vaaniclinic.com",
    "senderName": "Vaani Speech & Hearing Clinic"
  },
  "retention": {
    "clinicalYears": 7,
    "minorUntilAge": 21,
    "billingYears": 8,
    "auditYears": 7
  },
  "features": {
    "inventory": true,
    "expenses": true,
    "packages": true,
    "cbt": true,
    "onlineBooking": true,
    "waitlist": true,
    "referralInbox": true
  },
  "website": {
    "openingSoon": false,
    "openingDate": "2026-11-01",
    "banner": {
      "active": false,
      "text": {
        "en": "Free Hearing Screening Camp on Sunday, Nov 15th",
        "mr": "रविवार १५ नोव्हेंबर रोजी मोफत श्रवण तपासणी शिबीर"
      }
    },
    "footerCredit": true,
    "social": {
      "instagram": "https://instagram.com/vaaniclinic",
      "facebook": "https://facebook.com/vaaniclinic"
    },
    "analytics": {
      "googleTagId": "G-XXXXXXXXXX"
    }
  },
  "grievanceOfficer": {
    "name": "Ms. Palak Paresh Gandhi",
    "email": "grievance@vaaniclinic.com",
    "phone": "+919822012345"
  }
}
```

---

## 4. Audit Logging Requirement (`FR-SET-013`)

Every setting change made in the Settings Page **must write an immutable audit log entry** to the `auditLogs` collection before the update commits:

```javascript
{
  "ts": ISODate("2026-10-16T15:45:00Z"),
  "actor": {
    "userId": "user_mock_palak",
    "role": "OWNER",
    "name": "Dr. Palak Paresh Gandhi"
  },
  "action": "SETTINGS_UPDATE",
  "resource": "clinicSettings",
  "resourceId": "clinic",
  "changes": {
    "bookingPolicy.holdHours": {
      "before": 24,
      "after": 12
    },
    "notifications.quietHours.start": {
      "before": "22:00",
      "after": "21:00"
    }
  },
  "ip": "103.21.124.50",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  "prevHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "hash": "4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123"
}
```

---

## 5. UI Architecture: Recommended ERP Settings Layout

To ensure a seamless user experience matching the **Home Page Santo aesthetic**, the Settings Page (`/dashboard/settings`) should be structured into **7 clean tabs** with card groups:

1. **Clinic Profile & Branding**: Legal Name, Brand Name, Bilingual Taglines, Phone, Email, Address, Maps Link, Logo & Letterhead upload.
2. **Clinical Gates & Licenses**: RCI verification status, CBT gate toggle, "Dr." Title approval, Establishment & Shop Act licenses, PAN & GSTIN.
3. **Practice Hours & Calendar**: Weekly operational shifts, lunch breaks, slot granularity (15 mins), Maharashtra holiday importer, custom leave blockouts.
4. **Booking Engine & Policies**: Notice periods, hold durations, auto-confirm toggle, cancellation windows, reschedule limits, daily service caps.
5. **Billing, GST & UPI**: Fiscal year sequencing, UPI ID, payee name, QR generator, tax exemptions, bank account setup.
6. **Communications & DPDP**: Quiet hours, automated reminder offsets (24h/2h), sender email, DPDP Grievance Officer contacts, retention rules.
7. **System Features & Users**: Modular feature toggles (Inventory, CBT, Packages), staff roster, 2FA enforcement, idle lock duration, audit trail viewer.

---
*Ratified as per Black Angler Executive Specification `BA-SRS-WEB-ERP-001`.*
