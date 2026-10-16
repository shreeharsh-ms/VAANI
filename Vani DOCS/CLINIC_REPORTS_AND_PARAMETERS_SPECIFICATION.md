# VAANI Speech & Hearing Clinic — Clinical Reports & Parameters Specification

> **Document Reference**: `VAANI-DOC-SPEC-2026-001`  
> **Source Baseline**: Software Requirements Specification (`Vani DOCS/Software_Requirements_Specification/Software_Requirements_Specification.pdf`)  
> **Applicable Sections**: Section 4.5, Section 4.8, Section 4.9, Section 4.11 (Reports and Documents), Section 4.12 (Billing), Section 4.15 (Analytics), and Section 5.5 (Collection Specifications)  
> **Clinical Governance**: Rehabilitation Council of India (RCI Act 1992), RCI CRR No. A79214, Digital Personal Data Protection Act 2023 (DPDP Act), Indian Limitation Act 1963 (Section 6), Income Tax Act 1961 (Section 44AA)  
> **System Architecture**: Native PDF Rendering, Bilingual Output (English + Devanagari Marathi), SHA-256 Cryptographic Chaining, Field-Level AES-256 Encryption, QR Authenticity Verification  

---

## 1. Executive Summary & Document Control Framework

The VAANI Clinic ERP architecture mandates a unified, tamper-evident, and clinically rigorous document and report generation engine. Under **Section 4.11 (`FR-DOC-002`)**, the system natively generates:
1. **Master Clinical Reports Suite**: **10 specialized clinical diagnostic and rehabilitation assessment reports** covering newborn hearing screening, full-range audiological evaluations, voice disorders, fluency/stuttering, comprehensive pediatric and adult speech-language evaluations, psychological CBT interventions, dysphagia bedside examinations, hearing aid fitting certificates, therapy progress reviews, and clinical discharge summaries.
2. **Practice, Operational & Administrative Reports**: Daily cashier collections with cash-drawer reconciliation, statutory GST tax invoices and receipts, inventory stock valuations (FIFO / Weighted Average), recall return conversions, clinic operational capacity heatmaps, aggregate epidemiological clinical distributions, referral partner tracking, and cryptographic audit logs.

### 1.1 Statutory Document Lifecycle & Governance Rules
* **Strict Versioning State Machine**:
  $$\text{DRAFT} \xrightarrow{\text{Verification}} \text{FINAL (Cryptographically Locked)} \xrightarrow{\text{Documented Clinical Justification}} \text{AMENDED (v2, v3...)}$$
  * `DRAFT`: Carries a prominent semi-transparent diagonal `"DRAFT"` watermark across all pages. Editable by the authoring clinician.
  * `FINAL`: Locked against modification. Digitally stamped with the clinician's RCI CRR registration number (`A79214`), qualification (`BASLP, MASLP`), and timestamp. Automatically generates an immutable SHA-256 payload hash.
  * `AMENDED`: Modifying a finalized report requires explicit clinical justification, supervisor PIN/step-up re-authentication, and creates an append-only revision record while preserving the original historical document.
  * Reprints carry a subtle `"COPY"` header banner (`FR-DOC-011`).
* **Bilingual Delivery Engine (`FR-DOC-003`)**:
  * Generated in **English**, **Marathi**, or **Bilingual** (English technical parameters paired with patient-facing explanations in Marathi).
  * High-fidelity Unicode Devanagari typography with embedded fonts (Mukta / Noto Sans Devanagari) ensuring zero glyph corruption across all client devices.
* **Tamper-Evident QR Verification (`FR-DOC-005`)**:
  * Every published clinical report features a scannable **Authenticity QR Code** linking to a public verification endpoint (`https://vaaniclinic.com/verify-doc/:docId`).
  * The verification portal validates document authenticity (Document ID, Patient UHID, Issuing Date, Clinician CRR Number, Clinic Branch) **without leaking sensitive medical or diagnostic details** (DPDP Act privacy preservation).
* **Zero-Attachment Secure Patient Sharing (`FR-DOC-006`)**:
  * By clinical data protection mandate, raw diagnostic PDF files are **never** attached directly to unencrypted outbound marketing/transactional emails.
  * Patients and caregivers receive a secure, HTTPS short-link protected by a **7-day expiration horizon** and an **SMS/WhatsApp OTP/PIN challenge** (Date of Birth year or phone OTP).

---

## 2. Master Clinical Reports Suite (10 Specialized Clinical Diagnostic Reports)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MASTER CLINICAL REPORTS SUITE                                  │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│    RP-CLN-OAE    │    RP-CLN-AUD    │    RP-CLN-VOI    │    RP-CLN-FLU    │    RP-CLN-SLA    │
│  OAE Screening   │   Audiological   │  Voice Disorder  │     Fluency      │ Speech-Language  │
│      Report      │    Evaluation    │     Proforma     │    Assessment    │    Assessment    │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│    RP-CLN-CBT    │    RP-CLN-DYS    │    RP-CLN-HAF    │    RP-CLN-PRG    │    RP-CLN-DSC    │
│  Psychological   │    Swallowing    │   Hearing Aid    │ Periodic Therapy │Clinical Discharge│
│    CBT Report    │  Bedside Screen  │   Fitting Cert   │ Progress Summary │   Summary Plan   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

### Report 1: Otoacoustic Emission (OAE) Screening Report
* **Document Identification Code**: `RP-CLN-OAE`
* **SRS Requirement Reference**: `FR-DOC-002A`, `Section 5.5.22.4`, `Section 5.5.23`
* **Clinical Purpose**: Rapid newborn, infant, and occupational cochlear outer hair cell (OHC) function screening and confirmatory diagnostic emissions.

#### Detailed Parameters Recorded:
| Category | Parameter / Field Name | Data Type / Unit | Specification & Clinical Norms |
| :--- | :--- | :--- | :--- |
| **Document Metadata** | `oaeNumber` | Alphanumeric (String) | Sequential diagnostic index (e.g. `OAE-26-00042`) |
| | `testDate` & `testTime` | ISO Date/Time | Test acquisition timestamp |
| | `stage` | Enum | `SCREEN_1` (Birth to 48 hrs), `SCREEN_2` (Rescreen at 2-4 wks), `DIAGNOSTIC` |
| | `device` | Composite Object | `make`, `model`, `protocolName`, `stimulusDb` (e.g. Click 80 dB SPL / DPOAE $f_1/f_2$ 65/55 dB SPL) |
| **Newborn Context** | `gestationWeeks` | Number (Weeks) | Gestational age at delivery (e.g. `38.5` weeks) |
| | `birthWeightG` | Integer (Grams) | Birth weight (e.g. `2850` g) |
| | `nicuDays` | Integer (Days) | NICU admission stay (e.g. `4` days) |
| | `jcihRiskIndicators` | Array of Enums | JCIH risk factors: `HYPERBILIRUBINEMIA`, `CRANIOFACIAL_ANOMALY`, `OTOTOXIC_DRUGS`, `CONGENITAL_INFECTION`, `FAMILY_HISTORY`, `VENTILATION_GT_5D`, `LOW_APGAR` |
| | `motherName` & `birthPlace` | String | Maternal identification & delivery hospital registration number |
| **Test Measurements** | `technologyType` | Enum | `TEOAE` (Transient Evoked) vs `DPOAE` (Distortion Product) |
| *(Per Ear: Right & Left)* | `frequenciesTested` | Array of Integers (Hz) | `1000 Hz`, `1500 Hz`, `2000 Hz`, `3000 Hz`, `4000 Hz` |
| | `signalToNoiseRatio` | Array of Floats (dB) | Signal-to-Noise Ratio (SNR) recorded per frequency band |
| | `noiseFloor` | Array of Floats (dB SPL) | Ambient and physiological acoustic noise floor |
| | `reproducibility` | Array of Percentages (%) | Waveform correlation percentage per frequency band |
| | `dpGramPoints` | Array of Objects | $f_2$ Frequency (Hz), $2f_1 - f_2$ Amplitude (dB SPL), Background Noise ($dB SPL$) |
| | `probeFitQuality` | Percentage (%) | Acoustical seal stability (e.g. `96%` fit) |
| | `testDurationSec` | Integer (Seconds) | Elapsed testing duration per ear |
| **Computed Outcomes** | `earOutcome` (Right/Left) | Enum | `PASS`, `REFER`, `INCONCLUSIVE` (Artifact) |
| | `overallScreeningResult` | Enum | `BOTH_PASS`, `UNILATERAL_REFER`, `BILATERAL_REFER`, `INCONCLUSIVE` |
| | `nextStepAction` | Enum | `DISCHARGE`, `RESCREEN_DUE`, `DIAGNOSTIC_ABR`, `ENT_REFERRAL` |
| | `rescreenDueDate` | Date (YYYY-MM-DD) | Calculated date if rescreening is indicated |
| **Clinical Verdict** | `clinicalImpression` | Text (Bilingual) | Summary of cochlear outer hair cell integrity |
| | `recommendations` | Text (Bilingual) | Auditory milestone vigilance & pediatric instructions |
| | `rciSignatureBlock` | Digital Signature | RCI Number (`A79214`), Clinician Name, Digital Stamp |

#### Visual Graphics & Layout Requirements:
* Prominent visual bilateral ear diagrams: **Right Ear rendered in Clinical Red**, **Left Ear rendered in Clinical Blue**.
* Clear, high-contrast binary status badges: `[✓] PASS` in Emerald Green, `[ ! ] REFER` in Crimson Red.
* Auto-validation rule: A frequency is evaluated as `PASS` if $\text{SNR} \ge 6\text{ dB}$ and $\text{Reproducibility} > 70\%$. Ear overall `PASS` requires $\ge 3$ frequency bands meeting criteria.

---

### Report 2: Comprehensive Audiological Evaluation Report
* **Document Identification Code**: `RP-CLN-AUD`
* **SRS Requirement Reference**: `FR-DOC-002B`, `Section 5.5.22.1 - 5.5.22.3`
* **Clinical Purpose**: Definitive bilateral behavioral hearing sensitivity profiling, speech discrimination, and middle ear immittance assessment.

#### Detailed Parameters Recorded:
| Module | Parameter / Field Name | Data Type / Unit | Specification & Clinical Range |
| :--- | :--- | :--- | :--- |
| **Audiometer & Setup** | `audiometerModel` | String | Make and calibrated equipment model |
| | `calibrationStandard` | Enum | `ANSI_S3_6`, `ISO_389` |
| | `transducerType` | Enum | `SUPRA_AURAL_TDH39`, `INSERT_EARPHONES_3A`, `BONE_B71`, `SOUND_FIELD` |
| | `patientReliability` | Enum | `CONSISTENT`, `FAIRLY_CONSISTENT`, `INCONSISTENT`, `QUESTIONABLE` |
| **Pure Tone Audiometry (PTA)** | `rightAirConduction` | Grid: Hz $\to$ dB HL | 125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000 Hz ($-10$ to $120$ dB HL) |
| *(Right Ear in Red 'O')* | `rightBoneConduction` | Grid: Hz $\to$ dB HL | 250, 500, 750, 1000, 1500, 2000, 3000, 4000 Hz ($-10$ to $70$ dB HL) |
| *(Left Ear in Blue 'X')* | `leftAirConduction` | Grid: Hz $\to$ dB HL | Same frequency spectrum as Right Air |
| | `leftBoneConduction` | Grid: Hz $\to$ dB HL | Same frequency spectrum as Right Bone |
| | `maskingApplied` | Boolean & Levels (dB) | Plateau masking levels used for Air and Bone |
| | `noResponseFlag` | Boolean per Frequency | Unresponsive threshold at equipment limits |
| **Auto-Computed Metrics** | `pta3FrequencyAverage` | Float (dB HL) | Pure Tone Average across 500 Hz, 1000 Hz, 2000 Hz: $\frac{T_{500} + T_{1000} + T_{2000}}{3}$ |
| | `pta4FrequencyAverage` | Float (dB HL) | Pure Tone Average across 500, 1000, 2000, 4000 Hz |
| | `highFrequencyAverage` | Float (dB HL) | High-Frequency Average (HFA) across 1000, 2000, 4000 Hz |
| | `airBoneGap` (ABG) | Float (dB) | $\text{ABG} = \text{Air Threshold} - \text{Bone Threshold}$ calculated at each octaval frequency |
| | `hearingLossDegree` | Enum (WHO/Clark) | `NORMAL` ($\le 25\text{ dB}$), `MILD` ($26-40\text{ dB}$), `MODERATE` ($41-55\text{ dB}$), `MODERATELY_SEVERE` ($56-70\text{ dB}$), `SEVERE` ($71-90\text{ dB}$), `PROFOUND` ($> 90\text{ dB}$) |
| | `hearingLossType` | Enum | `CONDUCTIVE` ($\text{ABG} \ge 15\text{ dB}$, Bone Normal), `SENSORINEURAL` ($\text{ABG} \le 10\text{ dB}$, Bone Abnormal), `MIXED` ($\text{ABG} \ge 15\text{ dB}$, Bone Abnormal) |
| | `audiogramConfiguration` | Enum | `FLAT`, `GENTLY_SLOPING`, `STEEPLY_SLOPING`, `RISING`, `COOKIE_BITE`, `NOTCHED_4KHZ`, `CORNER_AUDIOGRAM` |
| **Speech Audiometry** | `speechDetectionThreshold` (SDT) | Integer (dB HL) | Lowest hearing level at which speech presence is detected |
| | `speechRecognitionThreshold` (SRT)| Integer (dB HL) | 50% recognition of Marathi/English Spondee word list |
| | `wordRecognitionScore` (WRS / SDS)| Percentage (%) | Phonetically balanced (PB) monosyllables/disyllables at specified presentation level (dB HL / dB SL) |
| | `presentationLevelWRS` | Integer (dB HL) | Presentation sensation level (typically $\text{SRT} + 30\text{ to }40\text{ dB}$) |
| | `mostComfortableLevel` (MCL) | Integer (dB HL) | Preferred conversational listening level |
| | `uncomfortableLoudness` (UCL) | Integer (dB HL) | Acoustic discomfort threshold level |
| | `dynamicRange` | Integer (dB) | Computed: $\text{Dynamic Range} = \text{UCL} - \text{SRT}$ |
| | `speechMaterial` | Composite Object | `language` (`mr`, `en`, `hi`), `listName`, `mode` (`RECORDED` vs `LIVE_VOICE`) |
| **Tuning Fork & Immittance** | `rinneTest512Hz` | Enum (Bilateral) | `POSITIVE` ($AC > BC$, Normal/SNHL), `NEGATIVE` ($BC > AC$, Conductive) |
| | `weberTest512Hz` | Enum | `CENTRAL` (Normal/Symmetrical), `LATERALISED_RIGHT`, `LATERALISED_LEFT` |
| | `probeToneFrequency` | Enum | `226_HZ` (Standard Adult), `1000_HZ` (Infants $< 6$ months) |
| | `jergerTympanogramType` | Enum (Bilateral) | `TYPE_A` (Normal), `TYPE_AS` (Stiff/Otosclerosis), `TYPE_AD` (Disarticulation/Hypermobile), `TYPE_B` (Fluid/Otitis Media/Perforation), `TYPE_C` (Eustachian Tube Dysfunction) |
| | `peakPressure` | Float (daPa) | Normal range: $-100\text{ to }+50\text{ daPa}$ |
| | `staticCompliance` | Float (mL / mmho) | Normal range: $0.3\text{ to }1.6\text{ mL}$ |
| | `earCanalVolume` (ECV) | Float (mL) | Normal range: $0.6\text{ to }2.0\text{ mL}$ (Abnormal $> 2.5\text{ mL}$ indicates perforation) |
| | `gradientTympanogramWidth` | Float (daPa) | Tympanometric peak gradient width |
| | `acousticReflexes` | Grid: Frequency $\times$ Level | Ipsilateral and Contralateral thresholds at 500, 1000, 2000, 4000 Hz (`PRESENT` vs `ABSENT`) |
| | `acousticReflexDecay` | Enum & % Decay | 10-second reflex decay at 500 Hz and 1000 Hz at $\text{Threshold} + 10\text{ dB}$ |

#### Visual Graphics & Layout Requirements:
* Side-by-side audiogram charts:
  * **Right Ear**: Clinical Red, Circle `O` (Air Unmasked), Triangle `Δ` (Air Masked), Bracket `<` (Bone Unmasked), Square Bracket `[` (Bone Masked).
  * **Left Ear**: Clinical Blue, Cross `X` (Air Unmasked), Square `□` (Air Masked), Bracket `>` (Bone Unmasked), Square Bracket `]` (Bone Masked).
* Frequency grid: $125\text{ Hz}$ to $8000\text{ Hz}$ on logarithmic X-axis; Hearing Level: $-10\text{ dB}$ to $120\text{ dB}$ on inverted Y-axis ($20\text{ dB}$ per major division).

---

### Report 3: Clinical Voice Assessment Proforma & Diagnostic Report
* **Document Identification Code**: `RP-CLN-VOI`
* **SRS Requirement Reference**: `FR-DOC-002C`, `Section 5.5.21.5`
* **Clinical Purpose**: Multidimensional acoustic, perceptual, aerodynamic, and functional profiling of dysphonia, vocal fold nodules, muscle tension dysphonia, and professional voice demands.

#### Detailed Parameters Recorded:
| Dimension | Parameter / Field Name | Scale / Unit | Clinical Rules & Specifications |
| :--- | :--- | :--- | :--- |
| **Vocal Demands & History** | `vocalLoadHoursPerDay` | Float (Hours) | Daily speaking demand (e.g. `6.5` hours for teachers) |
| | `singingDemands` | Enum | `CLASSICAL_VOCALIST`, `KIRTAN_BHAJAN`, `CASUAL`, `NON_SINGER` |
| | `phonotraumaFactors` | Array of Enums | `LOUD_SPEAKING`, `THROAT_CLEARING`, `CHEERING`, `COUGHING` |
| | `hydrationIntakeLiters` | Float (L/day) | Daily water intake (e.g. `1.5` L) |
| | `gastroesophagealReflux`| Boolean | Active symptoms of GERD / LPR (Laryngopharyngeal Reflux) |
| **Perceptual CAPE-V Rating** | `overallSeverity` | Visual Analogue: 0–100 | Consensus Auditory-Perceptual Evaluation of Voice score |
| | `roughness` | Visual Analogue: 0–100 | Perceived acoustic irregularity of vocal fold vibration |
| | `breathiness` | Visual Analogue: 0–100 | Audible air escape through incomplete glottic closure |
| | `strain` | Visual Analogue: 0–100 | Excessive phonatory effort and hyperfunction |
| | `pitch` & `loudness` | Visual Analogue: 0–100 | Deviations from age/sex biological norms |
| | `attributeConsistency` | Enum per Parameter | `CONSISTENT` (Always present) vs `INTERMITTENT` |
| **Perceptual GRBAS Scale** | `grade` ($G$) | Integer: 0, 1, 2, 3 | Overall degree of voice abnormality ($0=\text{Normal}, 3=\text{Severe}$) |
| | `roughness` ($R$) | Integer: 0, 1, 2, 3 | Irregular mucosal wave vibration |
| | `breathiness` ($B$) | Integer: 0, 1, 2, 3 | Turbulence noise from glottal incompetence |
| | `asthenia` ($A$) | Integer: 0, 1, 2, 3 | Weakness or lack of phonatory power |
| | `strain` ($S$) | Integer: 0, 1, 2, 3 | Hyperfunctional state and laryngeal constriction |
| | `grbasTotalScore` | Integer: 0–15 | Computed: $G + R + B + A + S$ |
| **Aerodynamic Efficiency** | `mptA` (3 Trials) | Array of Floats (Sec) | Maximum Phonation Time on vowel /a/ ($t_1, t_2, t_3$) |
| | `mptI` & `mptU` | Array of Floats (Sec) | Phonation duration on /i/ and /u/ |
| | `bestMptSeconds` | Float (Seconds) | Maximum value among recorded trials (Norm: $> 15\text{ s}$ adults) |
| | `mptS` & `mptZ` (3 Trials) | Array of Floats (Sec) | Maximum duration of unvoiced /s/ and voiced /z/ |
| | `szRatio` | Float (Ratio) | Computed: $\text{s/z Ratio} = \frac{\text{Best /s/ Duration}}{\text{Best /z/ Duration}}$. **Ratio $> 1.4$ triggers clinical pathology flag** |
| **Acoustic Spectrogram** | `fundamentalFrequency` ($F_0$) | Float (Hz) | Biological pitch (Male Norm: 100–150 Hz; Female: 180–240 Hz) |
| | `f0Range` | Float (Hz) | Pitch stability and semitone dynamic range |
| | `jitterLocal` | Percentage (%) | Cycle-to-cycle frequency variation (Pathology alert: $> 1.04\%$) |
| | `shimmerLocal` | Percentage (%) | Cycle-to-cycle amplitude variation (Pathology alert: $> 3.81\%$) |
| | `harmonicsToNoiseRatio` (HNR) | Float (dB) | Acoustic signal purity (Pathology alert: $< 20\text{ dB}$) |
| **Self-Reported Handicap** | `vhi30Score` / `vhi10Score` | Integer | Voice Handicap Index (0–120 for VHI-30; 0–40 for VHI-10) |
| | `vhiSubscales` | Integers | Functional, Physical, and Emotional subscale scores |
| | `handicapSeverity` | Enum | `MILD` (0–30), `MODERATE` (31–60), `SEVERE` (61–120) |
| **Laryngeal Examination** | `videostroboscopyFindings`| Composite Object | Vocal fold edge symmetry, glottic closure shape, mucosal wave |
| | `extrinsicMuscleTension` | Enum | `MCLT_GRADE_1` to `GRADE_4` thyrohyoid / suprahyoid tenderness |
| **Therapy Recommendations** | `vocalHygienePlan` | Array of Strings | Customized clinical hydration, pacing, and vocal rest directives |

---

### Report 4: Fluency Disorders Assessment Report
* **Document Identification Code**: `RP-CLN-FLU`
* **SRS Requirement Reference**: `FR-DOC-002D`, `Section 5.5.21.4`
* **Clinical Purpose**: Standardized clinical evaluation and severity staging of stuttering, cluttering, and secondary struggle behaviors using the SSI-4 and OASES instruments.

#### Detailed Parameters Recorded:
| Category | Parameter / Field Name | Data Type / Unit | Clinical Rules & Specifications |
| :--- | :--- | :--- | :--- |
| **Speech Sampling** | `speechSampleTasks` | Array of Enums | `CONVERSATION` ($\ge 300\text{ syllables}$), `ORAL_READING` ($\ge 200\text{ syllables}$), `MONOLOGUE`, `PHONE_CALL` |
| | `totalSyllablesRecorded`| Integer (Syllables) | Total speech corpus length evaluated |
| | `sampleDurationSeconds` | Float (Seconds) | Exact duration of recorded utterance |
| **Core Disfluency Counts** | `partWordRepetitions` | Integer | Sound/syllable repetitions (e.g. *ba-ba-ball*) |
| | `wholeWordRepetitions`| Integer | Monosyllabic word repetitions (e.g. *I-I-I*) |
| | `phraseRepetitions` | Integer | Multisyllabic phrase repetitions |
| | `dysrhythmicProlongations`| Integer | Abnormal audible sound stretching ($> 1\text{ s}$) |
| | `silentBlocks` | Integer | Inaudible articulatory fixations and postural blocks |
| | `interjections` | Integer | Extraneous vocalizations (*um*, *uh*, *er*) |
| | `revisions` | Integer | Abandoned or reformulated sentence structures |
| **Quantitative Rates** | `percentSyllablesStuttered` (%SS) | Percentage (%) | Auto-calculated: $\%SS = \left(\frac{\text{Total Disfluencies}}{\text{Total Syllables}}\right) \times 100$ |
| | `speechRateSPM` | Float (SPM) | Speech Rate in Syllables Per Minute |
| | `speechRateWPM` | Float (WPM) | Speech Rate in Words Per Minute |
| | `articulationRateSPM` | Float (SPM) | Rate excluding pauses $> 250\text{ ms}$ |
| **SSI-4 Battery Protocol** | `frequencyTaskScore` | Integer (2–18) | Mapped from %SS on conversation and reading tables |
| | `durationBlock1Sec` | Float (Seconds) | Longest stuttering block duration |
| | `durationBlock2Sec` | Float (Seconds) | Second longest stuttering block duration |
| | `durationBlock3Sec` | Float (Seconds) | Third longest stuttering block duration |
| | `averageBlockDuration` | Float (Seconds) | Mean of 3 longest blocks |
| | `durationTaskScore` | Integer (2–18) | Mapped duration score per SSI-4 table |
| | `physicalConcomitants` | Composite Rating (0–20)| Sum of 4 struggle categories ($0=\text{None}$ to $5=\text{Severe}$): |
| | • `distractingSounds` | Rating (0–5) | Noisy breathing, whistling, clicking |
| | • `facialGrimaces` | Rating (0–5) | Jaw tension, tongue protrusion, eye blinking |
| | • `headMovements` | Rating (0–5) | Head nodding, turning, chin elevation |
| | • `extremityMovements` | Rating (0–5) | Foot tapping, hand clenching, leg shifting |
| | `ssi4TotalScore` | Integer | Computed: $\text{Frequency Score} + \text{Duration Score} + \text{Physical Concomitants}$ |
| | `percentileRank` | Percentage (%) | Population percentile mapping |
| | `clinicalSeverityGrade`| Enum | `VERY_MILD`, `MILD`, `MODERATE`, `SEVERE`, `VERY_SEVERE` |
| **Covert & Emotional** | `situationalAvoidance` | Array of Objects | Situations avoided (e.g. asking directions, telephone, presentations) with Fear Rating ($0\text{ to }10$) |
| | `wordSubstitutions` | Array of Strings | Synonyms used to avoid trigger sounds |
| | `oasesImpactScore` | Float & Impact Level | Overall Assessment of the Speaker's Experience of Stuttering: `MILD`, `MILD_TO_MODERATE`, `MODERATE`, `MODERATE_TO_SEVERE`, `SEVERE` |

---

### Report 5: Comprehensive Speech & Language Assessment Report
* **Document Identification Code**: `RP-CLN-SLA`
* **SRS Requirement Reference**: `FR-DOC-002E`, `Section 5.5.21.1 - 5.5.21.3`
* **Clinical Purpose**: Exhaustive developmental and acquired pediatric/adult speech-language pathology battery covering oral motor structures, articulation inventories, receptive/expressive language quotients, pragmatics, and literacy.

#### Detailed Parameters Recorded:
| Assessment Sub-battery | Parameter / Field Name | Data Type / Measurement | Diagnostic Specifications & Standardized Tests |
| :--- | :--- | :--- | :--- |
| **Oral Peripheral Mechanism Exam (OPME)** | `lipsAnatomyFunction` | Enum & Notes | Symmetry, seal at rest, retraction, rounding, pucker |
| | `tongueAnatomyFunction` | Composite Object | Size, lateralization, elevation, fasciculations |
| | `lingualFrenulumRating` | Enum (Kotlow Scale) | `NORMAL`, `MILD_TIE`, `MODERATE_TIE`, `SEVERE_ANKYLOGLOSSIA` |
| | `palatalIntegrity` | Enum & Notes | Hard palate arch height, soft palate symmetry, uvula bifurcation |
| | `velopharyngealClosure` | Enum | Adequate, Inadequate, Marginal (Hypernasality flag) |
| | `dentitionBreathing` | Enum | Normal occlusion, Class II/III malocclusion, mouth breathing |
| | `ddkRatePa` | Float (Syllables/Sec) | Diadochokinetic rate for /pa/ (Norm: $> 4.5\text{ reps/sec}$) |
| | `ddkRateTa` | Float (Syllables/Sec) | Diadochokinetic rate for /ta/ |
| | `ddkRateKa` | Float (Syllables/Sec) | Diadochokinetic rate for /ka/ |
| | `ddkRatePataka` | Float (Syllables/Sec) | Trisyllabic sequencing rate for /pataka/ |
| **Articulation & Phonology** | `phoneticInventory` | Matrix: Sound $\times$ Position| Consonants assessed in Initial, Medial, Final positions in Marathi & English |
| | `errorClassification` | Enum per Phoneme | `CORRECT`, `SUBSTITUTION`, `OMISSION`, `DISTORTION`, `ADDITION` |
| | `phonologicalProcesses` | Array of Enums | `VELAR_FRONTING`, `STOPPING`, `CLUSTER_REDUCTION`, `FINAL_CONSONANT_DELETION`, `GLIDING` |
| | `percentageConsonantsCorrect`| Percentage (%) | Computed: $\text{PCC} = \left(\frac{\text{Correct Consonants}}{\text{Total Consonant Targets}}\right) \times 100$. (Severity: $>85\%$ Mild, 65–85% Mild-Mod, 50–65% Mod-Severe, $<50\%$ Severe) |
| | `stimulabilityLevel` | Enum per Error Sound | `INDEPENDENT`, `VERBAL_MODEL`, `VISUAL_TACTILE_PROMPT`, `NOT_STIMULABLE` |
| | `intelligibilityKnownContext`| Percentage (%) | Conversational intelligibility to primary caregiver |
| | `intelligibilityUnknownContext`| Percentage (%) | Conversational intelligibility to unfamiliar listeners |
| **Language Battery (ALD-MM & Standardized)** | `receptiveLanguageAge` (RLA)| Float (Months) | Age equivalent for auditory comprehension (ALD-MM / REELS) |
| | `expressiveLanguageAge` (ELA)| Float (Months) | Age equivalent for verbal expression |
| | `chronologicalAgeMonths` | Float (Months) | Exact age in months on test administration date |
| | `developmentalQuotient` (DQ) | Percentage (%) | Computed: $\text{DQ} = \left(\frac{\text{Language Age}}{\text{Chronological Age}}\right) \times 100$ |
| | `languageDelayMagnitude` | Float (Months) | Computed: $\text{Delay} = \text{Chronological Age} - \text{Language Age}$ |
| | `meanLengthUtterance` (MLU) | Float (Morphemes) | Average morphemes per utterance across 50 spoken sentences |
| | `syntacticMorphologicalProfile`| Array of Strings | Marathi postpositions (*madhye*, *var*, *khali*), tense markers, plurals |
| | `vocabularyReceptiveCount` | Integer (Words) | Estimated receptive lexical size |
| | `vocabularyExpressiveCount` | Integer (Words) | Estimated expressive lexical size |
| **Pragmatic Communication** | `capcmPragmaticsRatings` | Scale: 0 to 4 | Eye contact, turn-taking, topic maintenance, joint attention, communicative repair |
| **Literacy & Dyslexia** | `daliScoreRapidNaming` | Float (Sec) & Percentile | Dyslexia Assessment for Indian Children phonological awareness score |
| **Auditory-Verbal & AAC** | `avtErberHierarchyLevel` | Enum | `DETECTION`, `DISCRIMINATION`, `IDENTIFICATION`, `COMPREHENSION` |
| | `lingSixSoundDistances` | Distance in Meters (m) | Maximum detection/identification distance for /m/, /ah/, /oo/, /ee/, /sh/, /s/ |
| | `aacReadinessEvaluation` | Enum | `COMMUNICATION_BOOK`, `HIGH_TECH_DEDICATED`, `SWITCH_ACCESSIBLE` |

---

### Report 6: Psychological & Cognitive Behavioural Therapy (CBT) Clinical Formulation Report
* **Document Identification Code**: `RP-CLN-CBT`
* **SRS Requirement Reference**: `FR-DOC-002F`, `Section 5.5.29`
* **Clinical Purpose**: Confidential mental health formulation, structured suicide risk stratification, psychometric outcome monitoring, and cognitive thought reframing for tinnitus habituation and speech anxiety.
* **Security & Access Control**: Encrypted at rest using **AES-256-GCM**. Strictly restricted to practitioners with verified RCI psychologist/counsellor credentials (`cbtQualificationVerified = true`). Access triggers an immutable audit log entry.

#### Detailed Parameters Recorded:
| Dimension | Parameter / Field Name | Data Type / Unit | Specification & Legal Protocol |
| :--- | :--- | :--- | :--- |
| **Intake Assessment** | `presentingComplaints` | Array of Strings | Patient-reported primary psychological stressors |
| | `functionalImpactRating` | Scale: 0 to 10 | Impairment in occupational performance, sleep, social relationships |
| **Psychometric Scales** | `phq9ItemScores` | Array of Integers (0–3) | 9 items of Patient Health Questionnaire for depression |
| | `phq9TotalScore` | Integer: 0–27 | Severity: None (0–4), Mild (5–9), Moderate (10–14), Moderately Severe (15–19), Severe (20–27) |
| | `phq9Item9SafetyFlag` | Boolean | **Mandatory Safety Rule: Score $\ge 1$ on Item #9 ("Thoughts of being better off dead") triggers immediate statutory Clinical Risk Protocol** |
| | `gad7ItemScores` | Array of Integers (0–3) | 7 items of Generalized Anxiety Disorder scale |
| | `gad7TotalScore` | Integer: 0–21 | Severity: Minimal (0–4), Mild (5–9), Moderate (10–14), Severe (15–21) |
| | `pss10StressScore` | Integer: 0–40 | Perceived Stress Scale score |
| **Suicide Risk Stratification** | `suicideIdeationLevel` | Enum | `NONE`, `PASSIVE` ("Wish I were asleep"), `ACTIVE_WITHOUT_PLAN`, `ACTIVE_WITH_PLAN` |
| | `intentAndMeansStatus` | Enum & Notes | Access to lethal means, explicit intent |
| | `historySelfHarm` | Boolean & Timeline | Prior self-harm or suicidal attempts |
| | `protectiveFactors` | Array of Strings | Family connections, children, spiritual values, clinical rapport |
| | `clinicalRiskLevel` | Enum | `NONE`, `LOW`, `MODERATE`, `HIGH` |
| **Stanley-Brown Safety Plan** | `step1InternalWarningSigns`| Array of Strings | Personal triggers, physical sensations, negative thought loops |
| | `step2InternalCopingStrategies`| Array of Strings | Breathing exercises, mindfulness, grounding techniques |
| | `step3SocialDistractions` | Array of Strings | Healthy distracting social places and friends |
| | `step4EmergencyTrustedContacts`| Array of Objects | Names, phone numbers of family members |
| | `step5ProfessionalCrisisContacts`| Array of Objects | Tele-MANAS (14416), local emergency hospital, psychiatrist on call |
| | `lethalMeansSafetyStep` | Text | Explicit steps taken to restrict access to hazardous items |
| **Beck's Cognitive Model Formulation** | `activatingEvent` ($A$) | Text | Situation or trigger provoking distress |
| | `automaticThoughts` ($B$) | Text & Belief % | Exact cognitive statement and initial belief rating (0–100%) |
| | `cognitiveDistortionsTagged` | Array of Enums | `CATASTROPHIZING`, `MIND_READING`, `ALL_OR_NOTHING`, `EMOTIONAL_REASONING`, `MENTAL_FILTER`, `OVERGENERALIZATION` |
| | `emotionalConsequences` ($C$) | Emotion & Intensity % | E.g. Anxiety 85%, Helplessness 70% |
| | `evidenceForThought` | Text | Clinical factual support for the thought |
| | `evidenceAgainstThought` | Text | Clinical factual refutation of the thought |
| | `balancedRationalThought` | Text | Alternative, evidence-based cognitive appraisal |
| | `reRatedBeliefIntensity` | Percentage (%) | Re-evaluated thought belief and post-intervention emotion intensity |
| **Homework & Behavioral Actions** | `behavioralExperiments` | Array of Objects | Planned behavioral trial, predicted outcome, actual learning |

---

### Report 7: Swallowing & Dysphagia Evaluation Report
* **Document Identification Code**: `RP-CLN-DYS`
* **SRS Requirement Reference**: `FR-DOC-002G`, `Section 5.5.21`
* **Clinical Purpose**: Bedside clinical swallowing examination (CSE), cranial nerve motor profiling, aspiration risk mapping, and international dietary consistency prescription.

#### Detailed Parameters Recorded:
| Module | Parameter / Field Name | Data Type / Scale | Specifications & Medical Protocols |
| :--- | :--- | :--- | :--- |
| **Cranial Nerve Bedside Screen** | `cnVMotorSensory` | Enum | Trigeminal: Jaw closure strength, facial sensation |
| | `cnVIIMotor` | Enum | Facial: Lip seal strength, symmetry during smile |
| | `cnIX_XFunction` | Enum | Glossopharyngeal/Vagus: Palatal elevation, gag reflex, voice quality |
| | `cnXIIMotor` | Enum | Hypoglossal: Tongue protrusion, lateralization, lingual force |
| **Bolus Control & Swallowing** | `oralPreparatoryPhase` | Enum | Adequate chewing, pocketing in buccal sulcus, anterior spillage |
| | `oralTransitDuration` | Float (Seconds) | Time from bolus initiation to pharyngeal trigger |
| | `laryngealElevation` | Enum | Normal ($> 2\text{ cm}$ superior excursion), Reduced, Absent |
| | `cervicalAuscultation` | Enum | Clear breath sounds, Pre/Post-swallow gurgling, Stridor |
| **Water Swallow Challenge** | `trial3mlSip` | Enum & Signs | 3 mL spoon trial: Coughing, throat clearing, eye tearing |
| | `trial5mlCupSip` | Enum & Signs | 5 mL cup trial: Multi-swallow, wet-hoarse voice quality |
| | `trial90mlContinuousChallenge` | Enum & Duration | Continuous cup drinking: Interrupted, coughing within 1 minute |
| **Dietary Staging Frameworks** | `foisLevel` | Integer: Level 1 to 7 | Functional Oral Intake Scale: |
| | | | • *Level 1*: Nothing by mouth (NPO) |
| | | | • *Level 2*: Tube dependent with minimal consistent oral intake |
| | | | • *Level 3*: Tube dependent with consistent oral intake |
| | | | • *Level 4*: Total oral diet of single consistency |
| | | | • *Level 5*: Total oral diet with multiple consistencies requiring special preparation |
| | | | • *Level 6*: Total oral diet with multiple consistencies without special preparation, with specific food limitations |
| | | | • *Level 7*: Total oral diet with no restrictions |
| | `iddsiDrinkLevel` | Integer: Level 0 to 4 | International Dysphagia Diet: $0=\text{Thin}, 1=\text{Slightly Thick}, 2=\text{Mildly Thick}, 3=\text{Moderately Thick}, 4=\text{Extremely Thick}$ |
| | `iddsiFoodLevel` | Integer: Level 3 to 7 | $3=\text{Liquidised}, 4=\text{Pureed}, 5=\text{Minced \& Moist}, 6=\text{Soft \& Bite-sized}, 7=\text{Regular}$ |
| **Aspiration Prevention Protocol** | `posturalManeuvers` | Array of Enums | `CHIN_TUCK`, `HEAD_TURN_DAMAGED_SIDE`, `HEAD_TILT_INTACT_SIDE` |
| | `swallowManeuvers` | Array of Enums | `MENDELSOHN_MANEUVER`, `SUPRAGLOTTIC_SWALLOW`, `SUPER_SUPRAGLOTTIC`, `EFFORTFUL_SWALLOW`, `MASAKO` |
| | `mealtimeGuidelines` | Array of Strings | 90-degree upright posture during meals and 30 minutes post-prandial |

---

### Report 8: Hearing Aid Fitting, Trial & Verification Certificate
* **Document Identification Code**: `RP-CLN-HAF`
* **SRS Requirement Reference**: `FR-DOC-002H`, `Section 5.5.26`
* **Clinical Purpose**: Legal dispensing certificate, electroacoustic target verification, warranty contract, and patient orientation agreement for amplified hearing instruments.

#### Detailed Parameters Recorded:
| Category | Parameter / Field Name | Data Type / Unit | Specification & Warranty Rules |
| :--- | :--- | :--- | :--- |
| **Dispensing Metadata** | `certificateNumber` | Alphanumeric | Unique device certificate series (e.g. `HAF-26-00018`) |
| | `dispensingDate` | Date (YYYY-MM-DD) | Date of physical fitting |
| | `laterality` | Enum | `RIGHT`, `LEFT`, `BILATERAL_PAIR` |
| **Hardware Specifications** | `instrumentMake` | String | Manufacturer (e.g. Phonak, Oticon, Signia, Widex, ReSound) |
| *(Right & Left Units)* | `instrumentModel` | String | Product line & tier (e.g. `Audéo Lumity L90-R`) |
| | `formFactorStyle` | Enum | `BTE` (Behind-the-Ear), `RIC` (Receiver-in-Canal), `ITE`, `ITC`, `CIC`, `IIC` |
| | `technologyLevel` | String | Premium / Advanced / Standard / Essential |
| | `channelCount` | Integer (Channels) | Signal processing digital channels (e.g. 24 channels) |
| | `serialNumberRight` | Alphanumeric (String)| Unique hardware serial number stamped on right chassis |
| | `serialNumberLeft` | Alphanumeric (String)| Unique hardware serial number stamped on left chassis |
| | `batteryType` | Enum | `RECHARGEABLE_LITHIUM_ION`, `SIZE_10`, `SIZE_312`, `SIZE_13`, `SIZE_675` |
| | `earmouldConfiguration` | Composite Object | `style` (Canal, Skeleton, Full Shell), `material` (Silicone, Hard Acrylic), `ventSizeMm` (e.g. `1.5 mm`) |
| **Acoustic Target Verification** | `prescriptionFormula` | Enum | `NAL_NL2_ADULT_BINAURAL`, `DSL_V5_PEDIATRIC` |
| | `realEarMeasurement` (REM) | Array of Objects | Frequency (250 to 8000 Hz), Target Insertion Gain (dB), Achieved REAR (dB), Deviation within $\pm 2\text{ dB}$ |
| | `aidedSoundFieldThresholds`| Grid: Frequency $\to$ dB HL | 250, 500, 1000, 2000, 4000 Hz in sound-field calibrated booth |
| | `functionalGain` | Float (dB) per Freq | Computed: $\text{Aided Threshold} - \text{Unaided Threshold}$ |
| | `speechInNoiseImprovement` | Float (dB SNR) | QuickSIN / HINT aided vs unaided benefit |
| **Commercial & Warranty Terms**| `trialStartDate` & `trialEndDate` | Date Range | Mandatory clinical trial period |
| | `trialOutcomeStatus` | Enum | `SUCCESSFUL_DISPENSE`, `EXCHANGE_MODEL`, `RETURNED` |
| | `warrantyStartDate` & `warrantyExpiry`| Date Range | Manufacturer hardware warranty horizon |
| | `lossAndDamageExpiryDate` | Date (YYYY-MM-DD) | Extended insurance cover validity |
| | `invoiceReferenceNumber` | String | Linked tax invoice number (`INV/2026-27/...`) |
| **Patient Orientation** | `orientationChecklist` | Array of Booleans | Insertion/removal, charging dock use, wax filter replacement, dehumidifier storage |
| | `nextScheduledServiceDue` | Date (YYYY-MM-DD) | Mandatory 90-day cleaning and electroacoustic check |

---

### Report 9: Periodic Clinical Therapy Progress Summary
* **Document Identification Code**: `RP-CLN-PRG`
* **SRS Requirement Reference**: `FR-DOC-002I`, `Section 5.5.27`, `Section 5.5.28`
* **Clinical Purpose**: Periodic synthesis of ongoing rehabilitation trajectory comparing baseline intake measurements against current milestones across a designated block of SOAP sessions.

#### Detailed Parameters Recorded:
| Section | Parameter / Field Name | Data Type / Unit | Specification & Clinical Computation |
| :--- | :--- | :--- | :--- |
| **Treatment Block Context** | `progressReviewPeriod` | Date Range | Evaluation window (e.g. `01-Jan-2026` to `31-Mar-2026`) |
| | `therapyPlanId` | Reference ID | Parent rehabilitation plan identifier |
| | `assignedClinician` | String & RCI Number | Primary speech-language pathologist / audiologist |
| **Attendance & Adherence** | `sessionsScheduled` | Integer (Count) | Total appointments booked in period |
| | `sessionsAttended` | Integer (Count) | Physically or virtually completed sessions |
| | `attendanceRatePercentage` | Percentage (%) | Auto-calculated: $\left(\frac{\text{Attended}}{\text{Scheduled}}\right) \times 100$ |
| | `cancelledSessionsCount` | Integer (Count) | Documented advance cancellations |
| | `noShowSessionsCount` | Integer (Count) | Unnotified missed visits |
| | `homePracticeAdherenceRate`| Enum | `EXCELLENT` ($> 80\%$), `PARTIAL` (50–80%), `POOR` ($< 50\%$) |
| **SMART Goals Mastery Tracking**| `goalTrackingMatrix` | Array of Objects | For each long-term and short-term objective: |
| | • `goalId` & `goalText` | String | Specific measurable clinical target |
| | • `baselineScore` | Percentage / Ratio | Pre-therapy intake performance level |
| | • `targetBenchmark` | Percentage / Ratio | Prescribed mastery benchmark (e.g. `80% across 3 sessions`) |
| | • `currentAchievedScore` | Percentage / Ratio | Synthesized accuracy from last 3 SOAP session notes |
| | • `consecutiveMasterySessions`| Integer (Count) | Number of sessions sustaining target criteria |
| | • `goalStatus` | Enum | `ACHIEVED`, `IN_PROGRESS`, `MODIFIED`, `DISCONTINUED` |
| **Comparative Outcome Shifts** | `articulationPccDelta` | Percentage Delta ($\Delta\%$) | Articulation improvement ($\text{PCC}_{\text{Current}} - \text{PCC}_{\text{Baseline}}$) |
| | `fluencySsReductionDelta` | Percentage Delta ($\Delta\%$) | Stuttering reduction ($\%SS_{\text{Baseline}} - \%SS_{\text{Current}}$) |
| | `languageAgeAdvanceMonths` | Float (Months) | Receptive/Expressive language age acceleration |
| | `lingDetectionDistanceDelta`| Float (Meters) | Increased auditory detection span |
| **Caregiver Coaching** | `parentTrainingModules` | Array of Strings | Indirect parent stimulation techniques taught |
| | `parentConfidenceScore` | Scale: 0 to 10 | Caregiver confidence in executing home therapy |
| **Phase Revision** | `updatedTherapyObjectives` | Array of Objects | New SMART goals formulated for subsequent treatment phase |

---

### Report 10: Clinical Discharge Summary & Home Maintenance Plan
* **Document Identification Code**: `RP-CLN-DSC`
* **SRS Requirement Reference**: `FR-DOC-002J`, `Section 5.5.27`
* **Clinical Purpose**: Formal clinical conclusion certificate, discharge criteria audit, long-term environmental communication maintenance, and annual surveillance recall scheduling.

#### Detailed Parameters Recorded:
| Block | Parameter / Field Name | Data Type / Unit | Clinical Rules & Discharge Thresholds |
| :--- | :--- | :--- | :--- |
| **Discharge Context** | `dischargeDate` | Date (YYYY-MM-DD) | Date of formal clinical release |
| | `totalTreatmentDurationMonths`| Float (Months) | Elapsed time from intake to discharge |
| | `totalAttendedSessionsCount`| Integer (Sessions) | Cumulative clinical sessions completed |
| | `dischargeReason` | Enum | `GOALS_FULLY_ACHIEVED`, `MAXIMUM_MEDICAL_IMPROVEMENT_MMI`, `PATIENT_RELOCATION`, `FINANCIAL_DISCONTINUATION`, `SELF_DISCHARGE` |
| **Initial vs Discharge Audit** | `baselineVsDischargeMatrix` | Multi-column Table | Direct comparative side-by-side audit across: |
| | • `articulationIntelligibility`| Initial % vs Final % | E.g. Initial $45\%$ intelligibility $\to$ Final $92\%$ |
| | • `languageQuotient` | Initial DQ vs Final DQ | E.g. Initial $\text{DQ } 62\% \to$ Final $\text{DQ } 94\%$ |
| | • `stutteringSeverity` | Initial SSI-4 vs Final | E.g. Initial Severe ($34$) $\to$ Final Very Mild ($10$) |
| | • `voiceAcousticParameters` | Initial HNR vs Final | E.g. Initial HNR $14\text{ dB} \to$ Final $22.5\text{ dB}$ |
| **Therapeutic Techniques Summary**| `clinicalMethodologiesUtilized`| Array of Strings | E.g. PROMPT technique, Visual Phonics, Resonant Voice Therapy, CBT Thought Records, Desensitization |
| **Discharge Criteria Verification**| `criteriaMetVerification` | Array of Booleans | Documented verification of sustained mastery over 6 consecutive sessions |
| **Home Maintenance Plan** | `dailyMaintenanceExercises` | Array of Strings | Long-term vocal warm-ups, speech pacing drills, hearing aid hygiene |
| | `environmentalModifications`| Array of Strings | Acoustic room damping, FM system use in classroom, visual eye-level seating |
| **Long-Term Preventive Recall** | `annualRecallDueDate` | Date (YYYY-MM-DD) | Exactly 12 months post-discharge routine clinical reassessment date |
| | `emergencyContactGuidance` | Text | Clinical red-flag symptoms prompting immediate return |
| | `officialCertificationStamp`| Digital Signature Block | RCI Registered Clinician Seal & Practice Registration Number |

---

## 3. Practice, Operational, Financial & Administrative Reports

Beyond individual patient clinical diagnostic dossiers, the VAANI Clinic ERP architecture generates structured administrative, financial, inventory, and epidemiological intelligence reports:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        PRACTICE, FINANCIAL & ADMINISTRATIVE REPORTS                            │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│    RP-FIN-COL    │    RP-FIN-INV    │    RP-INV-STK    │    RP-REC-EFF    │    RP-DSH-OPS    │
│ Daily Collection │ GST Tax Invoice  │ Stock Valuation  │      Recall      │   Operational    │
│  & Cash Closing  │     Register     │    & Reorder     │  Effectiveness   │  Clinic Capacity │
├──────────────────┴──────────────────┼──────────────────┴──────────────────┼──────────────────┤
│             RP-DSH-CLN              │             RP-REF-DR               │    RP-SEC-AUD    │
│    Epidemiological Clinical Intel   │     Referral Doctor Dispatches      │  DPDP Audit Log  │
└─────────────────────────────────────┴─────────────────────────────────────┴──────────────────┘
```

---

### Report 11: Daily Collection & Day-End Cash Balancing Report
* **Document Identification Code**: `RP-FIN-COL`
* **SRS Requirement Reference**: `FR-BIL-014`, `Section 5.5.34`
* **Administrative Purpose**: Day-end cash drawer auditing, multi-modal payment reconciliation, cashier variance tracking, and bank deposit readiness.
* **Recorded Parameters**:
  * `cashierUserId` & `receptionistName`: Staff member responsible for shift drawer.
  * `collectionDate` & `branchId`: Shift date and physical clinic location.
  * `openingCashFloat`: Fixed beginning-of-day physical change float (e.g. ₹2,000.00).
  * `cashCollections`: Total physical currency collected through issued receipts.
  * `upiCollections`: Total digital payments verified via UPI QR / dynamic intent (with linked UPI Ref / UTR numbers).
  * `cardCollections`: POS terminal credit/debit collections (with POS terminal batch reference numbers).
  * `bankTransferCollections`: NEFT/RTGS direct clinic bank credit collections.
  * `grossRevenueCollected`: Total sum across all modalities ($\text{Gross} = \text{Cash} + \text{UPI} + \text{Card} + \text{Bank}$).
  * `physicalCashDenominationCount`: Itemized physical note count:
    $$\text{Cash Total} = (N_{500} \times 500) + (N_{200} \times 200) + (N_{100} \times 100) + (N_{50} \times 50) + (N_{20} \times 20) + (N_{10} \times 10)$$
  * `cashVariance`: Discrepancy calculated: $\text{Variance} = \text{Physical Count} - (\text{Opening Float} + \text{Cash Collections})$.
  * `varianceExplanation`: Mandatory documented clinical audit note if variance $\ne ₹0.00$.
  * `managerSignOff`: Digital supervisor sign-off locking the financial day.

---

### Report 12: Statutory GST Tax Invoice & Billing Register
* **Document Identification Code**: `RP-FIN-INV`
* **SRS Requirement Reference**: `FR-BIL-002`, `FR-BIL-003`, `Section 5.5.33`
* **Statutory Compliance**: Central Goods and Services Tax Act 2017 (CGST), Section 44AA Income Tax Act.
* **Recorded Parameters**:
  * `financialYearSeries`: Sequential, gap-free alphanumeric series per FY (e.g. `INV/2026-27/00042`).
  * `invoiceDate` & `supplyDate`: Invoice timestamp.
  * `patientUhid` & `patientFullName`: Billable party.
  * `hsnSacCode`:
    * **SAC 999312**: Clinical Healthcare & Rehabilitation Services by qualified clinical psychologists, speech pathologists, and audiologists (**0% GST Exempt under Notification No. 12/2017-Central Tax (Rate)**).
    * **HSN 902140**: Hearing aids and assistive listening components (**0% or specified concessional GST rate**).
  * `lineItemsBreakdown`: Service/product name, quantity, unit rate, concession/discount with documented authorization reason.
  * `taxBreakdown`: Taxable value, CGST (0%), SGST (0%), IGST (0%).
  * `headerDiscount` & `roundOffPaise`: Header adjustments and rounding.
  * `totalAmountPaise`: Total invoice amount in Indian Paise.
  * `paymentStatus`: `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `CREDIT_NOTED`, `CANCELLED`.
  * `receiptReferenceSeries`: Linked receipt vouchers (`RCT/2026-27/...`).
  * `creditNoteReferenceSeries`: Linked credit notes (`CN/2026-27/...`) for refunds or cancellations.

---

### Report 13: Inventory Stock Valuation & Reorder Report
* **Document Identification Code**: `RP-INV-STK`
* **SRS Requirement Reference**: `FR-INV-006`, `Section 5.5.35`
* **Operational Purpose**: Asset valuation of clinic hearing devices, spare parts, impression materials, and stock-out mitigation.
* **Recorded Parameters**:
  * `skuCode` & `productName`: Hardware identifier.
  * `category`: `HEARING_AID`, `BATTERY_PACK`, `EARMOULD_CONSUMABLE`, `ACCESSORY`, `THERAPY_STIMULUS_KIT`.
  * `valuationMethod`: `FIFO` (First-In, First-Out) vs `WEIGHTED_AVERAGE`.
  * `onHandQuantity`: Physical shelf inventory.
  * `allocatedQuantity`: Units currently assigned to active patient trials.
  * `availableQuantity`: $\text{Available} = \text{On-Hand} - \text{Allocated}$.
  * `reorderThreshold`: Minimum stock triggering low-stock dashboard alert (e.g. 10 packs).
  * `unitPurchaseCost`: Procurement cost excluding taxes.
  * `totalValuationAsset`: $\text{Total Value} = \text{On-Hand Quantity} \times \text{Unit Cost}$.
  * `slowMovingFlag`: Items with zero dispense transactions across $> 90\text{ days}$.

---

### Report 14: Recall Effectiveness & Patient Retention Conversion Report
* **Document Identification Code**: `RP-REC-EFF`
* **SRS Requirement Reference**: `FR-REC-008`, `Section 5.5.31`
* **Clinical Purpose**: Evaluating long-term audiological follow-up compliance, pediatric speech reassessment adherence, and hearing aid maintenance recall return rates.
* **Recorded Parameters**:
  * `recallCategory`: `SPEECH_REASSESSMENT`, `AUDIOLOGY_ANNUAL_CHECK`, `HEARING_AID_SERVICE`, `BATTERY_DISPENSE`.
  * `recallsDueVolume`: Total patients scheduled for follow-up in evaluation window.
  * `dispatchesByChannel`: Breakdown across WhatsApp messages, SMS alerts, Automated email reminders, and Direct telephone calls.
  * `contactSuccessRate`: Percentage of patients successfully receiving notification.
  * `appointmentBookedCount`: Recalled patients successfully booking follow-up appointment.
  * `returnConversionRate`: Auto-calculated: $\left(\frac{\text{Returned Patients}}{\text{Due Recalls}}\right) \times 100$.
  * `overdueUnresponsiveCount`: Patients remaining uncontactable after 3 reminder escalations.

---

### Report 15: Operational Clinic Capacity & Productivity Report
* **Document Identification Code**: `RP-DSH-OPS`
* **SRS Requirement Reference**: `FR-DSH-003`
* **Operational Purpose**: Practice efficiency profiling, provider time utilization, waiting room latency, and schedule optimization.
* **Recorded Parameters**:
  * `availableClinicalMinutes`: Total working capacity scheduled for provider workstations.
  * `bookedMinutes`: Cumulative minutes committed to confirmed patient appointments.
  * `capacityUtilizationPercentage`: Auto-calculated: $\left(\frac{\text{Booked Minutes}}{\text{Available Minutes}}\right) \times 100$.
  * `noShowRatePercentage`: Percentage of confirmed visits unfulfilled without notice.
  * `cancellationRatePercentage`: Percentage of visits cancelled prior to appointment time.
  * `averagePatientWaitTimeMinutes`: Average elapsed time between check-in arrival and entry into consultation room (target: $< 10\text{ min}$).
  * `patientRatioNewVsFollowUp`: Ratio of fresh intakes versus ongoing therapy sessions.
  * `hourlyDayOfWeekHeatmap`: Matrix of peak clinical demand across Monday–Saturday, 09:30 AM – 06:30 PM.

---

### Report 16: Epidemiological & Aggregate Clinical Analytics Report
* **Document Identification Code**: `RP-DSH-CLN`
* **SRS Requirement Reference**: `FR-DSH-004`
* **Statutory Privacy Constraint**: Strictly de-identified; zero personal demographic or identifiable health identifiers.
* **Recorded Parameters**:
  * `serviceLineDistribution`: Patients served across Audiology, Speech-Language Pathology, Voice Therapy, CBT Psychology, and Dysphagia Rehabilitation.
  * `ageBandDistribution`: Infants ($< 1$y), Toddlers ($1-3$y), Preschool ($3-5$y), School Age ($6-17$y), Adults ($18-60$y), Geriatrics ($> 60$y).
  * `hearingLossDegreePrevalence`: Epidemiological distribution of Normal, Mild, Moderate, Severe, and Profound hearing impairment in the Satara clinical catchment area.
  * `hearingLossEtiologyDistribution`: Prevalence of Conductive versus Sensorineural versus Mixed hearing loss.
  * `averageSessionsToDischarge`: Mean therapeutic contact sessions required to achieve discharge criteria per clinical service line.
  * `therapyGoalAttainmentRate`: Proportion of formulated SMART rehabilitation objectives successfully achieved.
  * `newbornOaeReferRate`: Percentage of newborn infants screened resulting in a bilateral or unilateral REFER outcome requiring diagnostic ABR.

---

### Report 17: Referral Partner Performance & Diagnostic Dispatch Report
* **Document Identification Code**: `RP-REF-DR`
* **SRS Requirement Reference**: `Section 4.8`, `Section 5.5.14`
* **Clinical Purpose**: Maintaining relationships with referring physicians, pediatricians, ENT surgeons, neurologists, and schools.
* **Recorded Parameters**:
  * `referringPhysicianName`: Name of medical partner (e.g. Dr. Nilesh Kulkarni, MD Paediatrics).
  * `hospitalOrClinicName`: Associated health institution (e.g. Satara Child Health Hospital & NICU).
  * `medicalDiscipline`: ENT, Paediatrics, Neurology, General Medicine, School Special Educator.
  * `totalPatientsReferred`: Gross volume of patient referrals received.
  * `caseConversionRate`: Percentage of referred patients completing diagnostic evaluation or enrolling in therapy.
  * `reverseDiagnosticDispatchRate`: Percentage of finalized clinical evaluation summaries dispatched back to the referring physician (target: $100\%$).
  * `preferredCommunicationChannel`: Email, WhatsApp, Courier, Hand-delivered by patient.

---

### Report 18: DPDP Cryptographic Audit Trail & Statutory Ledger Report
* **Document Identification Code**: `RP-SEC-AUD`
* **SRS Requirement Reference**: `FR-SEC-004`, `Section 5.5.4`
* **Legal Compliance**: India's Digital Personal Data Protection Act 2023 (DPDP Act).
* **Recorded Parameters**:
  * `monotonicSequenceNumber`: Incremental, tamper-evident transaction index.
  * `eventTimestampUtc`: High-precision microsecond server timestamp.
  * `actorIdentity`: User ID, operator role, verified practitioner name, login IP address, session ID.
  * `actionCode`: Exact action triggered (e.g. `patient.read`, `report.generate`, `consent.grant`, `clinical.amend`).
  * `entityReference`: Affected patient UHID, document ID, invoice ID.
  * `canonicalDataPayloadHash`: SHA-256 hash of canonical JSON entry.
  * `previousEntryHash`: Cryptographic pointer linking to preceding audit block ($H_{n-1}$).
  * `chainValidationStatus`: Nightly autonomous cryptographic verification audit status (`UNBROKEN_LEDGER` vs `MISMATCH_ALERT`).

---

## 4. Master Parameter Cross-Reference Matrix

The following matrix provides a single-view mapping across all 18 clinical and practice reports generated by VAANI Clinic ERP:

| Report Code | Report Title | Primary Clinical / Business Domain | Key Input Parameters Recorded | Primary Computed / Output Metrics | Statutory Governing Mandate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RP-CLN-OAE** | OAE Screening Report | Newborn & Pediatric Audiology | TEOAE/DPOAE, $1-4\text{ kHz}$ SNRs, Noise floor, Probe fit, JCIH risk factors | Binary Pass/Refer per ear, Rescreen due date | RCI Act 1992, NBS Guidelines |
| **RP-CLN-AUD** | Audiological Evaluation Report | Diagnostic Pure Tone & Speech Audiometry | Bilateral AC/BC thresholds ($125-8000\text{ Hz}$), Tuning forks, Tympanogram, Reflexes, Speech lists | PTA1, PTA2, HFA, ABG, Hearing Loss Degree & Type, Dynamic Range | RCI CRR No. A79214, WHO Classification |
| **RP-CLN-VOI** | Voice Assessment Proforma | Voice Pathology & Professional Voice | CAPE-V (0–100), GRBAS (0–3), MPT (3 trials), Acoustic $F_0$, Jitter, Shimmer, HNR, VHI | s/z Ratio, GRBAS Total, Vocal pathology flag | Clinical Practice Standard |
| **RP-CLN-FLU** | Fluency Disorders Report | Stuttering & Cluttering Pathology | Multi-task samples, Syllable disfluency counts, Physical struggle behaviours (0–20) | %SS, Speech Rate (SPM/WPM), SSI-4 Total, Severity grade | SSI-4 Protocol, OASES |
| **RP-CLN-SLA** | Speech-Language Assessment | Pediatric & Adult Speech Pathology | OPME structures, DDK syllable reps, Phoneme error grid, Standardized tests (ALD-MM, LPT, CAPC-M) | PCC %, Receptive/Expressive Language Age (RLA/ELA), DQ %, MLU | Standardized Battery Norms |
| **RP-CLN-CBT** | CBT Clinical Formulation Report | Mental Health & Tinnitus Habituation | Presenting problems, PHQ-9 (9 items), GAD-7 (7 items), PSS-10, Thought records | PHQ-9 Item #9 Alert, Risk Level, Stanley-Brown Safety Plan | AES-256 Encrypted, DPDP Act |
| **RP-CLN-DYS** | Dysphagia Bedside Report | Swallowing & Feeding Rehabilitation | Cranial nerves (V, VII, IX, X, XII), 3/5/90 mL water swallow challenges, Cough reflex | FOIS Diet Level (1–7), IDDSI Level (Drinks 0–4, Foods 3–7) | Clinical Bedside Protocol |
| **RP-CLN-HAF** | Hearing Aid Fitting Certificate | Amplification & Device Dispensing | Make, model, style, bilateral serial numbers, battery chemistry, Earmould specifications | NAL-NL2 / DSLv5 REM curve match, Sound field functional gain | Legal Dispensing Guarantee |
| **RP-CLN-PRG** | Periodic Progress Summary | Ongoing Rehabilitation Tracking | SOAP session synthesis, Attended vs scheduled visits, Home compliance | Goal Mastery %, PCC $\Delta\%$, %SS reduction $\Delta\%$, Attendance rate % | Clinical Governance Review |
| **RP-CLN-DSC** | Clinical Discharge Summary | Therapy Completion & Maintenance | Total sessions, Baseline vs Final performance benchmarks, Met criteria | Initial vs Discharge delta, Home maintenance plan, Annual recall | RCI Release Protocol |
| **RP-FIN-COL** | Daily Cashier Collection Report | Clinic Financial Administration | Opening float, Cash note denominations, UPI UTR numbers, Card POS references | Gross collections, Cash drawer variance, Cashier sign-off | Financial Closing Policy |
| **RP-FIN-INV** | Statutory GST Tax Invoice | Accounting, Billing & Taxation | Patient UHID, SAC/HSN codes (999312 / 902140), Concessions, Line item rates | Taxable value, CGST/SGST/IGST, Net total in paise | CGST Act 2017, Sec 44AA |
| **RP-INV-STK** | Stock Valuation & Reorder | Inventory Management | Hardware SKU, Product category, Procurement cost, On-hand stock | FIFO / Weighted Value, Reorder alerts, Slow-moving flags | Accounting Standard 2 |
| **RP-REC-EFF** | Recall Effectiveness Report | Patient Retention & Continuity | Recalls due, Communication dispatches (WhatsApp, Call, SMS, Email) | Return conversion rate %, Contact rate %, Overdue volume | Clinical Follow-up Governance |
| **RP-DSH-OPS** | Clinic Capacity & Utilization | Practice Productivity & Operations | Clinic operating hours, Booked appointment minutes, Arrival timestamps | Capacity utilization %, No-show rate %, Waiting room latency | Operational SLA Protocol |
| **RP-DSH-CLN** | Epidemiological Analytics | Population Health Intelligence | Anonymized diagnostic categorizations, Service line encounters | Regional hearing loss prevalence, Average sessions to discharge | De-identified Epidemiological Intel |
| **RP-REF-DR** | Referral Partner Report | Clinical Networking & Dispatches | Referring physician name, Hospital, Discipline, Referral reasons | Referral conversion rate %, Reverse diagnostic dispatch rate % | Professional Medical Relations |
| **RP-SEC-AUD** | DPDP Cryptographic Audit Trail | Information Security & Governance | Monotonic seq, Actor ID, Session ID, IP address, Action, Target UHID | Cryptographic hash chaining ($H_n$), Chain integrity verification | DPDP Act 2023, BR-061 |

---

## 5. Report Archival, Statutory Retention & Delivery Architecture

### 5.1 Statutory Record Retention Horizons (`Section 4.5 & BR-061`)
All generated reports and linked diagnostic source data are governed by legally binding retention periods:
1. **Pediatric Clinical Diagnostic Reports (`RP-CLN-*`)**:
   * **Mandate**: Section 6 of the Indian Limitation Act 1963 and pediatric clinical governance guidelines.
   * **Rule**: Pediatric health records must be preserved **until the patient attains the age of majority (18 years) plus the 3-year statutory limitation period**, equating to **until the patient reaches Age 21**.
   * *Example*: For an infant tested at age 6 months in 2026, the report and raw audiological data are permanently preserved until **year 2047**.
2. **Adult Clinical Diagnostic Reports**:
   * **Mandate**: Medical Council of India / National Medical Commission regulations and clinical practice standards.
   * **Rule**: Preserved for a **minimum horizon of 7 years** from the date of final encounter or discharge.
3. **Statutory Tax Invoices & Financial Registers (`RP-FIN-*`)**:
   * **Mandate**: Section 44AA of the Income Tax Act 1961 and Rule 56 of the Central Goods and Services Tax Rules 2017.
   * **Rule**: Maintained for **8 Financial Years (FYs)** from the end of the relevant assessment year.

### 5.2 Cryptographic Tamper-Evidence & Integrity
* Every generated PDF document has its canonical binary stream hashed using **SHA-256**.
* The computed SHA-256 digest is registered in the append-only `documents` collection and stamped into the cryptographic audit trail ledger.
* Any unauthorized modification of archived report PDFs or retroactive tampering with clinical evaluation values causes an immediate hash mismatch alert during automated nightly validation sweeps.

### 5.3 PDF Generation Engine & Technical Stack
* **Rendering Engine**: Server-side headless HTML-to-PDF compilation via Chrome/Puppeteer with custom print CSS stylesheets optimized for standard **A4 portrait print** ($210\text{ mm} \times 297\text{ mm}$) with $10\text{ mm}$ safety print margins.
* **Header & Footer Stamping**:
  * Formal clinic letterhead displaying practitioner credentials:
    > **VAANI - Audiology & Speech-Language Pathology Clinic**  
    > **Ms. Palak Paresh Gandhi** — *BASLP, MASLP (Gold Medalist)*  
    > **RCI Registration No.**: `CRR No. A79214`  
    > Sadashiv Peth, Satara, Maharashtra 415002 • contact@vaaniclinic.com • +91 98765 43210  
  * Bottom running footer on every page displaying:
    * Page numbering: `Page X of Y`
    * Patient Unique Health ID (`uhid`)
    * Document Verification Code and Tamper-evident SHA-256 truncated hash
    * Authenticity Verification QR Code
