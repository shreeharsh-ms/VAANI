# 🩺 Vaani Hearing & Speech Clinic — Enterprise ERP Integration Guide

> [!IMPORTANT]
> **Engineering Reference Document**  
> This specification defines the enterprise integration standards for connecting the **Vaani Hearing and Speech Clinic** Electronic Health Record (EHR) / Clinic ERP system to the **Black Angler WhatsApp Business Platform**. It details bidirectional appointment booking, patient synchronization, clinical notification templates (audiograms, confirmations, reminders), automated post-visit Google review solicitation, and signed outbound webhooks.

---

## 📑 Table of Contents

1. [Executive Architecture & Integration Overview](#1-executive-architecture--integration-overview)
2. [Authentication, Authorization & Network Security](#2-authentication-authorization--network-security)
3. [Patient Demographics & Clinical Profile Synchronization](#3-patient-demographics--clinical-profile-synchronization)
4. [Concurrency-Guarded Appointment Booking Engine](#4-concurrency-guarded-appointment-booking-engine)
5. [Clinical Communications & Template Dispatch APIs](#5-clinical-communications--template-dispatch-apis)
6. [Post-Visit Google Review Solicitation Loop](#6-post-visit-google-review-solicitation-loop)
7. [Outbound Event Webhooks & StandardWebhooks HMAC Verification](#7-outbound-event-webhooks--standardwebhooks-hmac-verification)
8. [Sandbox Testing, Diagnostics & Self-Healing Webhooks](#8-sandbox-testing-diagnostics--self-healing-webhooks)
9. [Error Handling, HTTP Status Codes & Troubleshooting Matrix](#9-error-handling-http-status-codes--troubleshooting-matrix)
10. [Developer Go-Live Checklist](#10-developer-go-live-checklist)

---

## 1. Executive Architecture & Integration Overview

The integration establishes a robust, low-latency, bidirectional bridge between **Vaani Clinic ERP** and the **Black Angler WhatsApp Business Gateway**. 

### 1.1 Architectural Topology

```mermaid
flowchart TD
    subgraph Vaani_Infrastructure["🏥 Vaani Hearing & Speech Clinic Infrastructure"]
        ERP["Clinic ERP / EHR System\n(Patient Records, Doctor Rosters, Billing)"]
        Listener["Webhook Receiver Service\n(Node.js / Python / PHP)"]
    end

    subgraph Platform_Gateway["⚡ Black Angler Enterprise Gateway (/api/v1)"]
        AuthMid["API Key Auth & CIDR Filter\n(wa_live_ / wa_test_)"]
        RateLimiter["Sliding-Window Rate Limiter\n(Plan-Based RPS Enforcement)"]
        
        subgraph Core_Engines["Core Service Engines"]
            SlotEngine["Slot Concurrency Engine\n(Atomic Occupancy Grid)"]
            DocSync["Patient & Customer CRM\n(UHID & Clinical Tags)"]
            OrderSync["Visit & Review Engine\n(Magic QR & 24h Cooldown)"]
            MsgDispatcher["Template & 24h Text Gateway\n(Live Inbox Mirroring)"]
        end
        
        Outbox["Reliable Outbox Scheduler\n(StandardWebhooks HMAC-SHA256)"]
    end

    subgraph Meta_Cloud["💬 Meta WhatsApp Cloud API"]
        GraphAPI["Graph API v20.0\n(Cloud Hosted)"]
    end

    subgraph Patients["👥 Patients & Caregivers"]
        WhatsAppUser["Patient WhatsApp Client\n(+91 E.164 Recipient)"]
    end

    ERP -->|REST HTTPS Requests| AuthMid
    AuthMid --> RateLimiter
    RateLimiter --> Core_Engines
    MsgDispatcher -->|Dispatch Messages & PDFs| GraphAPI
    GraphAPI -->|Encrypted Delivery| WhatsAppUser
    WhatsAppUser -->|Replies / Bot Booking| GraphAPI
    GraphAPI -->|Inbound Webhook| Platform_Gateway
    Core_Engines --> Outbox
    Outbox -->|HMAC-Signed POST Events| Listener
```

### 1.2 End-to-End Clinical Scheduling & Notification Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient as 👤 Patient
    participant WA as 💬 WhatsApp Cloud API
    participant Platform as ⚡ Black Angler Gateway (/api/v1)
    participant SlotEng as ⏱️ Slot Engine & Occupancy Grid
    participant ERP as 🏥 Vaani Clinic ERP
    participant Listener as 👂 Vaani Webhook Listener

    %% Step 1: Booking via ERP or Bot
    rect rgb(240, 248, 255)
    Note over Patient,ERP: Phase 1: Concurrency-Guarded Appointment Booking
    ERP->>Platform: GET /api/v1/appointments/slots?service_code=AUD-PTA&date=2026-10-24
    Platform-->>ERP: 200 OK (Returns 15-min discrete availability slots)
    ERP->>Platform: POST /api/v1/appointments/hold (Atomic 5-min lock)
    Platform->>SlotEng: Acquire Hold Token
    Platform-->>ERP: 201 Created (holdToken: "hld_9f2a...")
    ERP->>Platform: POST /api/v1/appointments/book (holdToken, UHID, Patient Name)
    Platform->>SlotEng: Claim discrete occupancy grid cells (Rollback on collision)
    Platform-->>ERP: 201 Created (bookingRef: "APT-2026-89A1")
    end

    %% Step 2: Instant Confirmation
    rect rgb(245, 255, 250)
    Note over Platform,Patient: Phase 2: Clinical Notification & Template Dispatch
    Platform->>WA: POST /messages (Template: vaani_appointment_confirmation)
    WA->>Patient: WhatsApp: "Your PTA appointment with Ms. Palak is confirmed for 10:30 AM"
    Platform->>Listener: POST Webhook (event: "appointment.created", HMAC Signed)
    Listener-->>Platform: 200 OK
    end

    %% Step 3: Diagnostic Report Delivery
    rect rgb(255, 250, 240)
    Note over ERP,Patient: Phase 3: Diagnostic Report Delivery (Audiogram PDF)
    ERP->>Platform: POST /api/v1/messages/template (headerMediaUrl: "https://.../PTA_9021.pdf")
    Platform->>WA: Send Template with Header PDF Attachment
    WA->>Patient: Delivers PDF Test Report + Interactive Quick Replies
    end

    %% Step 4: Post-Visit Review Solicitation
    rect rgb(255, 245, 245)
    Note over ERP,Patient: Phase 4: Automated Post-Visit Google Review Loop
    ERP->>Platform: POST /api/v1/orders/sync (orderId: "VISIT-9021", status: "COMPLETED")
    Platform->>Platform: Validate 24-hr Idempotency Cooldown & Resolve Magic QR (/r/vaani-blr)
    Platform->>WA: Send Google Review Invitation with Direct Shortlink
    WA->>Patient: WhatsApp: "How was your visit to Vaani? Please share your review."
    end
```

### 1.3 Base URLs & Protocol Standards

| Environment | Base URL | Description |
| :--- | :--- | :--- |
| **Production** | `https://<your-domain>/api/v1` | Live production gateway connecting to live Meta WhatsApp API numbers. |
| **Sandbox / Staging** | `https://<your-domain>/api/v1` | Identical routes running in test mode using `wa_test_...` API keys. Meta calls are mocked with zero billing impact. |
| **Interactive Docs** | `https://<your-domain>/docs` | Live OpenAPI / Swagger UI test playground. |

- **Protocol**: HTTPS only (TLS 1.3 recommended, TLS 1.2 minimum).
- **Data Serialization**: UTF-8 encoded `application/json`.
- **Time Standard**: All timestamps must be exchanged in **ISO 8601 UTC** (e.g. `2026-10-24T05:00:00Z`).
- **Phone Standard**: Universal **E.164 format** including country code without spaces or dashes (e.g. `+919822012345` or `919822012345`).

---

## 2. Authentication, Authorization & Network Security

All endpoints under `/api/v1` require authentication via a scoped **Tenant API Key**.

### 2.1 API Key Structure

API keys are generated in the administrative console under **Settings > Developer Settings** (`/settings/developer`):

* **Live / Production Keys**: Prefix `wa_live_` followed by a 48-character cryptographic token:
  ```text
  wa_live_7a9f8b2c4d6e8f1032547698badcfe0123456789abcdef01
  ```
* **Sandbox / Test Keys**: Prefix `wa_test_` followed by a 48-character cryptographic token:
  ```text
  wa_test_3c1d5e7f9a2b4c6e801234567890abcdef1234567890abcd
  ```

> [!CAUTION]
> The plaintext API key is displayed **only once** upon generation. Store it securely in your ERP environment vault (e.g. AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault). Never commit plain keys to source code repositories.

### 2.2 Request Headers

Pass the API key in the `Authorization` header using the `Bearer` scheme (recommended) or via `X-API-Key`:

```http
POST /api/v1/messages/template HTTP/1.1
Host: api.yourclinicdomain.com
Authorization: Bearer wa_live_7a9f8b2c4d6e8f1032547698badcfe0123456789abcdef01
Content-Type: application/json
```
*or*
```http
POST /api/v1/messages/template HTTP/1.1
Host: api.yourclinicdomain.com
X-API-Key: wa_live_7a9f8b2c4d6e8f1032547698badcfe0123456789abcdef01
Content-Type: application/json
```

### 2.3 Enterprise CIDR IP Allowlisting

To prevent credential abuse if an API key is ever intercepted, configure static outbound IPs or CIDR subnets in the Developer Settings console:
* **Single IP**: `103.21.58.42/32`
* **Subnet Range**: `198.51.100.0/24`

If a request arrives from an IP not registered in your tenant's allowlist, the gateway immediately returns `HTTP 403 Forbidden`:

```json
{
  "detail": "Client IP '203.0.113.88' is not authorized for this API key. Update allowed IPs in Developer Settings."
}
```

> [!NOTE]
> For development and staging environments, keys can optionally be configured with empty allowlists (`allowAll: true`).

### 2.4 Sliding-Window Rate Limits & Quotas

Plan-based rate limits protect the gateway against burst overloads:

| Subscription Tier | Rate Limit (Requests / Sec) | Typical Use Case |
| :--- | :--- | :--- |
| **Starter Plan** | `5 req/s` | Single clinic branch testing |
| **Growth Plan** | `15 req/s` | Multi-branch standard operations |
| **Pro / Enterprise** | `30+ req/s` | High-volume hospital networks & broadcast reminders |

#### Ingress Rate Limit Headers
Every response from `/api/v1` returns real-time quota telemetry:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 15
X-RateLimit-Remaining: 14
X-RateLimit-Reset: 1771452001
```

If your ERP exceeds the threshold, the gateway responds with `HTTP 429 Too Many Requests`:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1
Content-Type: application/json

{
  "detail": "Rate limit exceeded. Maximum 15 requests per second allowed for your plan.",
  "retryAfter": 1
}
```

---

## 3. Patient Demographics & Clinical Profile Synchronization

Synchronize patient demographic records, Unique Health Identifiers (UHID), and audiology tags from Vaani Clinic ERP into the WhatsApp contact registry before dispatching messages.

* **Endpoint**: `POST /api/v1/customers/sync`
* **Permission Scope**: `customers:write`
* **Idempotency**: Upserts matching phone number for the calling tenant.

### 3.1 Request Payload Schema

```json
{
  "name": "Rajesh Kumar",
  "phone": "+919822012345",
  "tags": [
    "Audiology",
    "Hearing Aid Trial",
    "Tinnitus Evaluation",
    "Indiranagar Clinic"
  ],
  "notes": "Patient reports bilateral progressive high-frequency hearing loss. Prescribed Signia Pure Charge&Go trial.",
  "source": "vaani_erp",
  "customAttributes": {
    "patientId": "P-80912",
    "uhid": "UHID-BLR-2026-0921",
    "doctorAssigned": "Ms. Palak Paresh Gandhi",
    "clinicBranch": "Indiranagar, Bangalore",
    "hearingLossType": "Sensorineural",
    "preferredLanguage": "en"
  }
}
```

### 3.2 Data Dictionary

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Patient full legal name (1 to 120 chars). |
| `phone` | string | **Yes** | Patient phone number (E.164 formatted or local 10-digit). |
| `tags` | string[] | No | Clinical category tags. Existing tags are merged without duplication. |
| `notes` | string | No | Internal case notes visible to audiologists in the Live Inbox. |
| `source` | string | No | Source identifier. Set to `"vaani_erp"`. |
| `customAttributes` | object | No | Arbitrary JSON object containing clinical EHR metadata (UHID, assigned doctor, branch). |

### 3.3 Response Payload (`200 OK`)

```json
{
  "success": true,
  "customerId": "66b1a2b3c4d5e6f7a8b9c0d1",
  "phone": "+919822012345",
  "name": "Rajesh Kumar"
}
```

---

## 4. Concurrency-Guarded Appointment Booking Engine

The appointment booking module provides an atomic, race-condition-safe scheduling mechanism. It guarantees **zero double-booking** between patients interacting with the WhatsApp bot and clinic receptionists booking via the ERP.

### 4.1 Service Catalog Reference

Vaani Clinic provides standard audiology and speech therapy services:

| Service Code | Service Name | Duration | Description |
| :--- | :--- | :--- | :--- |
| `AUD-PTA` | Pure Tone Audiometry (PTA) | 30 mins | Diagnostic hearing threshold test in soundproof booth. |
| `AUD-TYMP` | Tympanometry & Reflexometry | 15 mins | Middle ear acoustic impedance evaluation. |
| `AUD-BERA` | Brainstem Evoked Response Audiometry | 60 mins | Electrophysiological hearing assessment for infants/adults. |
| `HA-TRIAL` | Hearing Aid Evaluation & Trial | 45 mins | Digital hearing aid fitting, programming & trial. |
| `SPH-THERAPY` | Speech-Language Therapy Session | 45 mins | Pediatric and adult speech articulation therapy. |

---

### 4.2 Step 1: Discover Available Slots

Queries the slot engine for available appointment times on a given calendar date, accounting for clinician shifts, lunch breaks, existing bookings, and active holds.

* **Endpoint**: `GET /api/v1/appointments/slots`
* **Permission Scope**: `appointments:read`

#### Query Parameters:
| Parameter | Type | Required | Example | Description |
| :--- | :--- | :--- | :--- | :--- |
| `service_code` | string | **Yes** | `AUD-PTA` | Service catalog code. |
| `date` | string | **Yes** | `2026-10-24` | Target date in `YYYY-MM-DD` format. |
| `resource_id` | string | No | `66f2a1b3...` | Optional practitioner or soundproof booth ID filter. |

#### Response (`200 OK`):
```json
{
  "serviceCode": "AUD-PTA",
  "targetDate": "2026-10-24",
  "availableSlots": [
    {
      "startUtc": "2026-10-24T05:00:00Z",
      "endUtc": "2026-10-24T05:30:00Z",
      "localTime": "10:30 AM",
      "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
      "resourceName": "Ms. Palak Paresh Gandhi (Audiologist)"
    },
    {
      "startUtc": "2026-10-24T05:30:00Z",
      "endUtc": "2026-10-24T06:00:00Z",
      "localTime": "11:00 AM",
      "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
      "resourceName": "Ms. Palak Paresh Gandhi (Audiologist)"
    }
  ]
}
```

---

### 4.3 Step 2: Atomic 5-Minute Slot Hold

Before completing patient intake or payment in your ERP, acquire an atomic **5-minute hold**. This prevents race conditions while the patient confirms details.

* **Endpoint**: `POST /api/v1/appointments/hold`
* **Permission Scope**: `appointments:write`

#### Request Payload:
```json
{
  "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
  "serviceCode": "AUD-PTA",
  "startUtc": "2026-10-24T05:00:00Z",
  "contactPhoneE164": "+919822012345"
}
```

#### Response (`201 Created`):
```json
{
  "holdToken": "hld_4a9e2f8c1b7d309a",
  "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
  "serviceCode": "AUD-PTA",
  "startUtc": "2026-10-24T05:00:00Z",
  "expiresAt": "2026-10-24T04:55:00Z",
  "message": "Slot held for 5 minutes."
}
```

> [!WARNING]
> If another user or the WhatsApp bot holds or books this slot first, this endpoint immediately returns `HTTP 409 Conflict`:
> ```json
> {
>   "detail": "This slot is currently held by another patient. Please choose another time or wait 5 minutes."
> }
> ```

---

### 4.4 Step 3: Atomic Booking Confirmation

Commits the booking, converts temporary hold cells into permanent discrete grid occupancy records, and triggers outbound confirmation alerts.

* **Endpoint**: `POST /api/v1/appointments/book`
* **Permission Scope**: `appointments:write`

#### Request Payload:
```json
{
  "holdToken": "hld_4a9e2f8c1b7d309a",
  "serviceCode": "AUD-PTA",
  "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
  "startUtc": "2026-10-24T05:00:00Z",
  "contactPhoneE164": "+919822012345",
  "contactName": "Rajesh Kumar",
  "subjectName": "Aarav Kumar (Child)",
  "subjectExternalId": "UHID-BLR-2026-0921",
  "isMinor": true,
  "guardianName": "Rajesh Kumar",
  "sourceOfTruth": "erp",
  "externalRef": "VN-ERP-9921",
  "intakeResponses": {
    "chiefComplaint": "Speech delay and lack of response to loud sounds",
    "priorHearingAidUse": false,
    "referringDoctor": "Dr. Ramesh (Pediatrician)"
  }
}
```

#### Response (`201 Created`):
```json
{
  "_id": "6718d45e9021a8f309b11042",
  "tenantId": "66b1a2b3c4d5e6f7a8b9c0d1",
  "bookingRef": "APT-2026-89A1",
  "resourceId": "66f2a1b3c4d5e6f7a8b9c101",
  "resourceName": "Ms. Palak Paresh Gandhi (Audiologist)",
  "serviceCode": "AUD-PTA",
  "serviceName": "Pure Tone Audiometry (PTA)",
  "subjectName": "Aarav Kumar (Child)",
  "contactPhoneE164": "+919822012345",
  "startUtc": "2026-10-24T05:00:00Z",
  "endUtc": "2026-10-24T05:30:00Z",
  "localDate": "2026-10-24",
  "localTime": "10:30 AM",
  "timezone": "Asia/Kolkata",
  "durationMinutes": 30,
  "status": "CONFIRMED",
  "sourceOfTruth": "erp",
  "externalRef": "VN-ERP-9921",
  "rescheduleCount": 0
}
```

---

### 4.5 Step 4: Reschedule an Appointment

Reschedules an existing booking to a new slot. The engine atomically releases previous discrete cells and claims new ones.

* **Endpoint**: `POST /api/v1/appointments/{bookingRef}/reschedule`
* **Permission Scope**: `appointments:write`

#### Request Payload:
```json
{
  "newStartUtc": "2026-10-25T06:00:00Z",
  "holdToken": null,
  "reason": "Patient requested evening slot due to school timings"
}
```

#### Response (`200 OK`):
```json
{
  "bookingRef": "APT-2026-89A1",
  "startUtc": "2026-10-25T06:00:00Z",
  "localDate": "2026-10-25",
  "localTime": "11:30 AM",
  "rescheduleCount": 1,
  "status": "CONFIRMED"
}
```

---

### 4.6 Step 5: Cancel an Appointment

Cancels a booking and immediately releases all grid occupancy cells for re-allocation.

* **Endpoint**: `POST /api/v1/appointments/{bookingRef}/cancel`
* **Permission Scope**: `appointments:write`

#### Request Payload:
```json
{
  "reason": "Patient resolved symptoms / Relocating"
}
```

#### Response (`200 OK`):
```json
{
  "bookingRef": "APT-2026-89A1",
  "status": "CANCELLED",
  "cancellationReason": "Patient resolved symptoms / Relocating",
  "cancelledAt": "2026-10-23T15:45:00Z"
}
```

---

## 5. Clinical Communications & Template Dispatch APIs

WhatsApp mandates using **Meta-approved templates** for all business-initiated messages outside the 24-hour service window. Once a patient responds, free-form text messaging is enabled for 24 hours.

### 5.1 Send Meta-Approved Template

Dispatches approved clinical notifications, test reports, and appointment confirmations.

* **Endpoint**: `POST /api/v1/messages/template`
* **Permission Scope**: `messages:send`

---

#### Clinical Example A: Appointment Confirmation
* **Template Name**: `vaani_appointment_confirmation`
* **Language**: `en`

```json
{
  "to": "+919822012345",
  "templateName": "vaani_appointment_confirmation",
  "language": "en",
  "parameters": [
    "Rajesh Kumar",
    "Saturday, 24 Oct at 10:30 AM",
    "Ms. Palak Paresh Gandhi",
    "Indiranagar Clinic (100 Feet Rd)"
  ],
  "buttonParams": [
    "APT-2026-89A1"
  ]
}
```

---

#### Clinical Example B: Pure Tone Audiometry (PTA) Test Report PDF Delivery
Attaches the diagnostic report directly in the template header via `headerMediaUrl` with interactive quick replies.

* **Template Name**: `vaani_diagnostic_report_v1`
* **Language**: `en`

```json
{
  "to": "+919822012345",
  "templateName": "vaani_diagnostic_report_v1",
  "language": "en",
  "headerMediaUrl": "https://vaaniclinic.com/secure-vault/reports/PTA_Aarav_9021.pdf",
  "parameters": [
    "Rajesh Kumar",
    "Aarav Kumar",
    "Pure Tone Audiometry (PTA)",
    "Ms. Palak Paresh Gandhi",
    "Moderate Bilateral Sensorineural Hearing Loss"
  ],
  "buttonParams": [
    "view_report_9021"
  ]
}
```

> [!TIP]
> **Media Requirements for PDF Headers**  
> 1. `headerMediaUrl` must be an HTTPS URL ending with `.pdf`.
> 2. The URL must be publicly reachable by Meta's Cloud CDN without basic auth credentials (use pre-signed S3 or Cloudflare R2 URLs with a 24-hour expiry).
> 3. Maximum file size: **16 MB**.

---

#### Clinical Example C: Automated Appointment Reminder (T-24 Hours)
* **Template Name**: `vaani_previsit_reminder`
* **Language**: `en`

```json
{
  "to": "+919822012345",
  "templateName": "vaani_previsit_reminder",
  "language": "en",
  "parameters": [
    "Rajesh Kumar",
    "Tomorrow at 10:30 AM",
    "Pure Tone Audiometry (PTA)",
    "Please ensure ears are free of wax. Arrive 10 minutes early."
  ]
}
```

#### Template Dispatch Response (`200 OK`):
```json
{
  "success": true,
  "messageId": "wamid.HBgLMzkxOTgyMjAxMjM0NRUCABIYFDNFMEQ1MDJBRDkzQzBFQzk0OTAzAA==",
  "conversationId": "65b8c32145e1a2f309918231",
  "status": "sent",
  "recipient": "919822012345",
  "template": "vaani_diagnostic_report_v1"
}
```

---

### 5.2 Two-Way Doctor-Patient Conversational Messaging

Allows clinicians to answer questions, explain prescriptions, or coordinate appointments in real time. **Enforces the Meta 24-hour customer service window.**

* **Endpoint**: `POST /api/v1/messages/text`
* **Permission Scope**: `messages:send`

#### Request Payload:
```json
{
  "to": "+919822012345",
  "text": "Hello Mr. Rajesh, Ms. Palak has reviewed Aarav's audiogram. The left ear shows good bone conduction thresholds. We recommend a 7-day hearing aid trial. Please let us know if Monday works for the fitting."
}
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "messageId": "wamid.HBgLMzkxOTgyMjAxMjM0NRUCABIYFDEyMzQ1Njc4OTA=",
  "conversationId": "65b8c32145e1a2f309918231",
  "status": "sent"
}
```

#### Error when 24-Hour Window has Expired (`400 Bad Request`):
```json
{
  "detail": "The 24-hour customer service window is closed. Send a Meta-approved template to initiate conversation."
}
```

---

### 5.3 Query Real-Time Message Delivery Status

Polls or verifies message delivery states (`sent` $\rightarrow$ `delivered` $\rightarrow$ `read` $\rightarrow$ `failed`).

* **Endpoint**: `GET /api/v1/messages/{message_id}/status`
* **Permission Scope**: `messages:read`

#### Response (`200 OK`):
```json
{
  "messageId": "wamid.HBgLMzkxOTgyMjAxMjM0NRUCABIYFDNFMEQ1MDJBRDkzQzBFQzk0OTAzAA==",
  "status": "read",
  "direction": "outbound",
  "type": "template",
  "timestamp": "2026-10-24T05:00:10Z",
  "deliveredAt": "2026-10-24T05:00:14Z",
  "readAt": "2026-10-24T05:01:02Z",
  "errorReason": null
}
```

---

## 6. Post-Visit Google Review Solicitation Loop

To systematically generate verified 5-star Google reviews across clinic locations (Indiranagar, Jayanagar, Whitefield), Vaani ERP calls `POST /api/v1/orders/sync` upon visit completion.

### 6.1 Visit Completion Trigger

* **Endpoint**: `POST /api/v1/orders/sync`
* **Permission Scope**: `orders:write`

```json
{
  "orderId": "VISIT-2026-9021",
  "storeCode": "VAANI-BLR-01",
  "customerName": "Rajesh Kumar",
  "customerPhone": "+919822012345",
  "status": "COMPLETED",
  "currency": "INR",
  "totalAmount": 1500.0,
  "itemsSummary": "Pure Tone Audiometry (PTA) & Hearing Aid Trial",
  "sendWhatsApp": true,
  "customReviewMessage": "Hi {name}, thank you for choosing {store}! Ms. Palak and our team hope Aarav had a comfortable hearing evaluation today. Could you take 30 seconds to share your feedback with other families on Google? Tap here: {url}",
  "metadata": {
    "uhid": "UHID-BLR-2026-0921",
    "doctor": "Ms. Palak Paresh Gandhi",
    "service": "AUD-PTA"
  }
}
```

### 6.2 Review Loop Mechanisms

1. **Store Location Resolution**: The gateway maps `storeCode: "VAANI-BLR-01"` to the clinic branch's verified Google Business Profile.
2. **Magic QR & Shortlink Funnel**: Generates a fast mobile link (`https://<domain>/r/vaani-indiranagar`) redirecting to the official Google write-review dialog (`https://search.google.com/local/writereview?placeid=...`).
3. **24-Hour Idempotency Cooldown**: If a review invitation was already sent to `+919822012345` within the last 24 hours, duplicate dispatches are skipped automatically to protect patient goodwill.

#### Response (`200 OK`):
```json
{
  "success": true,
  "orderId": "VISIT-2026-9021",
  "status": "COMPLETED",
  "customerPhone": "+919822012345",
  "storeCode": "VAANI-BLR-01",
  "locationName": "Vaani Hearing and Speech Clinic - Indiranagar",
  "googleReviewUri": "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  "whatsappSent": true,
  "whatsappMessageId": "wamid.HBgLMzkxOTgyMjAxMjM0NRUCABIYFDk4NzY1NDMyMTA=",
  "reviewPromptTriggered": true,
  "message": "Order VISIT-2026-9021 synchronized successfully."
}
```

---

## 7. Outbound Event Webhooks & StandardWebhooks HMAC Verification

When patients book appointments through the WhatsApp AI assistant, reschedule sessions, or send chat replies, the platform dispatches real-time HTTPS `POST` webhooks to your central listener.

### 7.1 StandardWebhooks Specification Headers

All outbound webhook requests comply with the industry-standard **Standard Webhooks** specification:

| Header | Description | Example |
| :--- | :--- | :--- |
| `webhook-id` | Unique identifier for the event. Used for deduplication. | `evt_6718d94e091b2c` |
| `webhook-timestamp` | Unix epoch timestamp (seconds) when signature was generated. | `1771452030` |
| `webhook-signature` | HMAC-SHA256 signature formatted as `v1,<base64_digest>`. | `v1,K2aX9yG+8zR3nQ...=` |
| `User-Agent` | Identifies platform webhook worker. | `WhatsAppPlatform-StandardWebhooks/1.0` |
| `Content-Type` | MIME type. | `application/json` |

---

### 7.2 Webhook Signature Verification Implementation

Your webhook listener must verify the HMAC-SHA256 signature before processing incoming payloads.

#### Verification Algorithm:
1. Extract `webhook-id`, `webhook-timestamp`, and `webhook-signature` headers.
2. Verify timestamp freshness: Reject requests where $|now - \text{timestamp}| > 300\text{ seconds}$ to defeat replay attacks.
3. Extract raw secret bytes: Strip `whsec_` prefix and Base64-decode the remainder.
4. Construct signing payload: `${webhook-id}.${webhook-timestamp}.${raw_request_body_bytes}`.
5. Compute HMAC-SHA256 digest and compare using a constant-time comparison function.

---

#### Implementation 1: Node.js / Express (Using StandardWebhooks)

```bash
npm install standardwebhooks express
```

```javascript
const express = require('express');
const { Webhook } = require('standardwebhooks');

const app = express();
// Capture raw bytes for cryptographic integrity
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

const WEBHOOK_SECRET = process.env.VAANI_WEBHOOK_SECRET; // e.g. "whsec_dGVzdF9zZWNyZXRfa2V5XzEyMzQ1Njc4OTA="
const wh = new Webhook(WEBHOOK_SECRET);

app.post('/api/webhooks/whatsapp', (req, res) => {
  const headers = {
    'webhook-id': req.headers['webhook-id'],
    'webhook-timestamp': req.headers['webhook-timestamp'],
    'webhook-signature': req.headers['webhook-signature'],
  };

  try {
    // Validates timestamp freshness (tolerance: 300s) and HMAC signature
    wh.verify(req.rawBody, headers);
  } catch (err) {
    console.error('⚠️ [Webhook Security Alert] Invalid signature:', err.message);
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body;
  console.log(`✅ [Webhook Verified] Received event: ${event.event || req.headers['x-platform-event']}`);

  // Route event to ERP handlers
  switch (event.event) {
    case 'appointment.created':
      handleAppointmentCreated(event);
      break;
    case 'appointment.rescheduled':
      handleAppointmentRescheduled(event);
      break;
    case 'appointment.cancelled':
      handleAppointmentCancelled(event);
      break;
    case 'message.received':
      handlePatientMessage(event);
      break;
    default:
      console.log(`Unhandled event type: ${event.event}`);
  }

  // Acknowledge receipt within 8 seconds
  return res.status(200).json({ received: true });
});

function handleAppointmentCreated(data) {
  console.log(`[ERP Sync] New booking ref: ${data.bookingRef} for patient: ${data.subjectName}`);
  // Ingest into Vaani Hospital Management System
}

app.listen(8080, () => console.log('Vaani Webhook Listener running on port 8080'));
```

---

#### Implementation 2: Python (FastAPI / Native standard library)

```python
import base64
import hashlib
import hmac
import time
from fastapi import FastAPI, Header, HTTPException, Request, Response, status

app = FastAPI()

WEBHOOK_SECRET = "whsec_dGVzdF9zZWNyZXRfa2V5XzEyMzQ1Njc4OTA="


def verify_standard_webhook(
    secret: str,
    webhook_id: str,
    timestamp: str,
    payload_bytes: bytes,
    signature_header: str,
    tolerance_seconds: int = 300
) -> bool:
    # 1. Verify Timestamp Freshness
    try:
        ts = int(timestamp)
    except ValueError:
        return False

    if abs(int(time.time()) - ts) > tolerance_seconds:
        return False

    # 2. Extract Key Bytes (Strip whsec_ prefix and base64 decode)
    if secret.startswith("whsec_"):
        key_bytes = base64.b64decode(secret[6:])
    else:
        key_bytes = secret.encode("utf-8")

    # 3. Construct Signing String
    to_sign = f"{webhook_id}.{timestamp}.".encode("utf-8") + payload_bytes

    # 4. Compute Expected Digest
    expected_digest = base64.b64encode(
        hmac.new(key_bytes, to_sign, hashlib.sha256).digest()
    ).decode("utf-8")
    expected_sig = f"v1,{expected_digest}"

    # 5. Constant-time comparison across signatures (handles space-separated rotation)
    for sig in signature_header.split():
        if hmac.compare_digest(sig, expected_sig):
            return True
    return False


@app.post("/api/webhooks/whatsapp")
async def receive_webhook(
    request: Request,
    webhook_id: str = Header(..., alias="webhook-id"),
    webhook_timestamp: str = Header(..., alias="webhook-timestamp"),
    webhook_signature: str = Header(..., alias="webhook-signature")
):
    raw_body = await request.body()

    is_valid = verify_standard_webhook(
        secret=WEBHOOK_SECRET,
        webhook_id=webhook_id,
        timestamp=webhook_timestamp,
        payload_bytes=raw_body,
        signature_header=webhook_signature
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid StandardWebhooks signature or expired timestamp."
        )

    payload = await request.json()
    event_type = payload.get("event")
    print(f"✅ Verified event: {event_type} (ID: {webhook_id})")

    # Dispatch to background task in your ERP
    return {"status": "accepted"}
```

---

#### Implementation 3: PHP (Laravel / Native)

```php
<?php
// receive_webhook.php

$secret = getenv('VAANI_WEBHOOK_SECRET'); // e.g. "whsec_dGVzdF9zZWNyZXRfa2V5XzEyMzQ1Njc4OTA="

$webhookId = $_SERVER['HTTP_WEBHOOK_ID'] ?? '';
$timestamp = $_SERVER['HTTP_WEBHOOK_TIMESTAMP'] ?? '';
$signature = $_SERVER['HTTP_WEBHOOK_SIGNATURE'] ?? '';

$rawPayload = file_get_contents('php://input');

// 1. Check timestamp tolerance (5 minutes)
if (abs(time() - (int)$timestamp) > 300) {
    http_response_code(401);
    die(json_encode(['error' => 'Timestamp expired']));
}

// 2. Decode Secret
if (strpos($secret, 'whsec_') === 0) {
    $keyBytes = base64_decode(substr($secret, 6));
} else {
    $keyBytes = $secret;
}

// 3. Construct signing payload
$toSign = "{$webhookId}.{$timestamp}." . $rawPayload;

// 4. Compute expected base64 HMAC
$expectedDigest = base64_encode(hash_hmac('sha256', $toSign, $keyBytes, true));
$expectedSignature = "v1,{$expectedDigest}";

// 5. Constant-time match
$signatures = explode(' ', $signature);
$matched = false;
foreach ($signatures as $sig) {
    if (hash_equals($expectedSignature, $sig)) {
        $matched = true;
        break;
    }
}

if (!$matched) {
    http_response_code(401);
    die(json_encode(['error' => 'Invalid signature']));
}

// Process Event
$event = json_decode($rawPayload, true);
http_response_code(200);
echo json_encode(['received' => true]);
?>
```

---

### 7.3 Webhook Event Schemas

#### Event 1: `appointment.created`
Dispatched when a patient books via the WhatsApp Bot or through the public portal.

```json
{
  "event": "appointment.created",
  "timestamp": "2026-10-24T05:00:15Z",
  "bookingRef": "APT-2026-89A1",
  "serviceCode": "AUD-PTA",
  "serviceName": "Pure Tone Audiometry (PTA)",
  "resourceName": "Ms. Palak Paresh Gandhi (Audiologist)",
  "subjectName": "Aarav Kumar",
  "contactPhone": "+919822012345",
  "startUtc": "2026-10-24T05:00:00Z",
  "localDate": "2026-10-24",
  "localTime": "10:30 AM",
  "status": "CONFIRMED"
}
```

---

#### Event 2: `appointment.rescheduled`
Dispatched when a patient reschedules an existing appointment.

```json
{
  "event": "appointment.rescheduled",
  "timestamp": "2026-10-24T06:12:00Z",
  "bookingRef": "APT-2026-89A1",
  "newStartUtc": "2026-10-25T06:00:00Z",
  "newLocalDate": "2026-10-25",
  "newLocalTime": "11:30 AM",
  "previousLocalDate": "2026-10-24",
  "previousLocalTime": "10:30 AM",
  "contactPhone": "+919822012345",
  "status": "CONFIRMED",
  "rescheduleCount": 1
}
```

---

#### Event 3: `appointment.cancelled`
Dispatched when an appointment is cancelled by a patient or bot trigger.

```json
{
  "event": "appointment.cancelled",
  "timestamp": "2026-10-24T07:30:00Z",
  "bookingRef": "APT-2026-89A1",
  "contactPhone": "+919822012345",
  "status": "CANCELLED",
  "reason": "Patient requested cancellation via WhatsApp Bot",
  "cancelledAt": "2026-10-24T07:30:00Z"
}
```

---

#### Event 4: `message.received`
Dispatched when a patient sends an inbound WhatsApp message (text reply or quick-reply click).

```json
{
  "event": "message.received",
  "timestamp": "2026-10-24T08:15:00Z",
  "messageId": "wamid.HBgLMzkxOTgyMjAxMjM0NRUCABIYFDE5Mjg3MzQ2NQ==",
  "from": "+919822012345",
  "text": "Hello, could we get Aarav's speech therapy scheduled on alternate days?",
  "type": "text",
  "conversationId": "65b8c32145e1a2f309918231"
}
```

---

#### Event 5: `lead.captured`
Dispatched when a new patient completes the interactive Hearing Assessment or Inquiry Form on WhatsApp.

```json
{
  "event": "lead.captured",
  "timestamp": "2026-10-24T09:00:00Z",
  "leadId": "66b3f8a9e1234567890abcde",
  "customer": {
    "name": "Sunita Patil",
    "phone": "+919845012345"
  },
  "inquiry": {
    "category": "Hearing Aid Consultation",
    "hearingLossType": "Senior Citizen Age-Related",
    "preferredBranch": "Jayanagar",
    "notes": "Looking for invisible rechargeable CIC hearing aids"
  },
  "status": "New"
}
```

---

## 8. Sandbox Testing, Diagnostics & Self-Healing Webhooks

The platform includes self-service diagnostic tools to test and certify your ERP endpoints before going live.

### 8.1 Sandbox Mode (`wa_test_...`)

When sending requests with a `wa_test_...` key:
- Meta Cloud API dispatches are mocked internally; no real WhatsApp messages are sent.
- Synthetic WhatsApp message IDs are returned (`mock_api_tpl_...`).
- Zero charges are incurred.
- All internal database models, slot holds, and outbox schedulers execute identically to production.

---

### 8.2 Test Webhook Dispatch via API

Verify that your webhook receiver is reachable and validating HMAC signatures without sending real WhatsApp messages.

* **Endpoint**: `POST /api/settings/developer/webhook/test`
* **Headers**: `Authorization: Bearer <JWT_USER_TOKEN>`

#### Request Payload:
```json
{
  "url": "https://erp.vaaniclinic.com/api/webhooks/whatsapp",
  "eventType": "appointment.created"
}
```

#### Response (`200 OK`):
```json
{
  "success": true,
  "statusCode": 200,
  "latencyMs": 142.5,
  "signatureHeader": "v1,dGhpcyBpcyBhIHZhbGlkIHNpZ25hdHVyZQ==",
  "legacySignatureHeader": "sha256=1e4d8a...",
  "responseSnippet": "{\"received\":true}"
}
```

---

### 8.3 Querying Webhook Delivery Audit Logs

Review delivery attempts, latency figures, and HTTP status codes returned by your ERP listener.

* **Endpoint**: `GET /api/settings/developer/webhook/deliveries?page=1&limit=10`

#### Response (`200 OK`):
```json
{
  "deliveries": [
    {
      "id": "6718da029012c4b",
      "eventId": "evt_20261024_01",
      "attemptNumber": 1,
      "timestamp": "2026-10-24T05:00:16Z",
      "status": 200,
      "latencyMs": 85.4,
      "responseHeaders": {
        "content-type": "application/json",
        "date": "Sat, 24 Oct 2026 05:00:16 GMT"
      },
      "snippet": "{\"received\":true}",
      "error": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 142,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 8.4 Self-Healing: Manual Replay of Failed Webhooks

If your ERP experiences downtime or network maintenance, missed events can be replayed individually. Replays preserve the original `webhook-id` to ensure idempotency.

* **Endpoint**: `POST /api/settings/developer/webhook/events/{event_id}/replay`

#### Response (`200 OK`):
```json
{
  "success": true,
  "message": "Event evt_20261024_01 queued for immediate replay redelivery."
}
```

> [!NOTE]
> Event payloads are retained for **72 hours** in full compliance with the Indian Digital Personal Data Protection (DPDP) Act. Replays must be triggered within this 72-hour retention window.

---

### 8.5 Zero-Downtime Secret Rotation

Rotate your webhook secret without dropping in-flight webhooks:
1. Call `POST /api/settings/developer/webhook/rotate-secret`.
2. The platform generates a new `whsec_...` secret and initiates a **48-hour grace window**.
3. During the grace window, the gateway computes dual signatures:
   ```http
   webhook-signature: v1,<new_digest> v1,<old_digest>
   ```
4. Update your ERP environment secret at your convenience within the 48-hour window.

---

## 9. Error Handling, HTTP Status Codes & Troubleshooting Matrix

The API uses standard HTTP status codes. Errors include a descriptive JSON response envelope.

```json
{
  "detail": "Descriptive error message explaining the failure."
}
```

### 9.1 Troubleshooting Matrix

| HTTP Status | Primary Cause | Clinical Context / Remediation |
| :--- | :--- | :--- |
| `200 OK` | Success | Request succeeded. |
| `201 Created` | Resource Created | Appointment booked, slot held, or customer synced. |
| `400 Bad Request` | Validation Error | - Invalid phone format (not E.164).<br>- Outside 24-hr customer service window (use template instead).<br>- Invalid `service_code` or unapproved template name. |
| `401 Unauthorized` | Authentication Failure | - Missing or malformed `Authorization: Bearer` header.<br>- API key revoked or non-existent. |
| `403 Forbidden` | Security Violation | - Calling IP not listed in enterprise CIDR whitelist.<br>- Tenant isolation violation (attempted IDOR access). |
| `404 Not Found` | Resource Missing | - `bookingRef` does not exist for this clinic.<br>- Message ID or customer not found. |
| `409 Conflict` | Slot Collision / Double-Booking | - Slot already held by another patient or reception desk.<br>- 5-minute hold token expired before book call. |
| `429 Too Many Requests` | Rate Limit / Brute Force | - ERP exceeded rate limit (e.g. >15 req/s). Inspect `Retry-After`.<br>- Too many failed auth attempts from source IP (throttled 5m). |
| `500 Internal Error` | Server Exception | - Upstream Meta Cloud API error or database connectivity fault. Check platform status page. |

---

## 10. Developer Go-Live Checklist

Complete this checklist prior to switching production traffic from legacy systems:

- [ ] **API Key Created**: Production API key (`wa_live_...`) generated and placed in ERP vault.
- [ ] **IP Allowlisting Enforced**: All Vaani ERP server outbound static IPs added to CIDR allowlist.
- [ ] **Templates Approved in Meta**:
  - `vaani_appointment_confirmation`
  - `vaani_diagnostic_report_v1`
  - `vaani_previsit_reminder`
- [ ] **Webhook Endpoint Configured**:
  - Registered HTTPS URL with valid TLS certificate (Let's Encrypt, Cloudflare, etc.).
  - `whsec_...` secret saved in ERP listener environment.
- [ ] **HMAC Signature Verification Tested**: Verified using `POST /api/settings/developer/webhook/test` with HTTP 200 response.
- [ ] **Timestamp Tolerance Enforced**: Listener verifies freshness ($|now - ts| \le 300s$).
- [ ] **24-Hour Review Solicitation Cooldown Tested**: Verified that duplicate review requests for the same patient are safely ignored.
- [ ] **Asynchronous Processing**: Webhook listener returns HTTP 200 within 2 seconds and processes heavy database operations asynchronously.

---

### Support & Escalation Channels

For urgent technical assistance or Meta Cloud API integration queries:
* **Developer Portal**: `https://<your-domain>/settings/developer`
* **API Status Dashboard**: `https://status.yourdomain.com`
* **Dedicated Integration Support**: `integrations@yourdomain.com`
