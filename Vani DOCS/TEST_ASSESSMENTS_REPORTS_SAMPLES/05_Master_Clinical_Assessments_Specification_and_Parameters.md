# Master Clinical Assessments & Reports Specification Manual
## Document ID: BA-SPEC-CLN-001 | Version: 1.0 (Final)
### Client: Vani's Speech & Hearing Clinic, Satara, Maharashtra
### Author: Black Angler Systems Architecture Team
### Standard Followed: ISO/IEC/IEEE 29148:2018 / Rehabilitation Council of India (RCI) Clinical Protocols

---

## Executive Sitemap of Assessments Covered

| Category | Assessment Name | Key Clinical Parameters & Output Fields | Severity / Normative Criteria |
|---|---|---|---|
| **Audiology** | **OAE (Otoacoustic Emissions)** | TEOAE/DPOAE 1k-4k Hz SNR (dB), Reproducibility %, Pass/Refer | SNR ≥ 6 dB & Reproducibility > 70% = PASS |
| **Audiology** | **PTA (Pure Tone Audiometry)** | 125-8000 Hz AC & BC thresholds (dB HL), Masking, PTA1, PTA2 | PTA1: (500+1k+2k)/3; PTA2: (500+1k+2k+4k)/4 |
| **Audiology** | **Speech Audiometry** | SRT (dB HL), SDT (dB HL), WRS / SDS (% at dB HL) | SRT agrees ±5 dB with PTA1; WRS %PB List |
| **Audiology** | **Tuning Fork Tests** | Rinne (256, 512, 1024 Hz), Weber (Lateralization) | Rinne +ve (AC>BC); Weber (Midline/Right/Left) |
| **Audiology** | **Tinnitus Evaluation** | THI (0-100), TFI (0-100), TRT Category (0 to 4) | THI Grade I (0-16) to Grade V (78-100) |
| **Speech & Language** | **ALD-MM** | Receptive Language Age (RLA), Expressive Language Age (ELA), DQ % | DQ = (Language Age / Chronological Age) * 100 |
| **Speech & Language** | **LPT** | Phonology, Semantics, Syntactic structures, Morphology, Pragmatics % | Mastery % per age level benchmark |
| **Speech & Language** | **CAPC-M** | Eye contact, turn-taking, topic maintenance, repair strategies | Observed behavioral ratings & cueing level |
| **Speech & Language** | **DALI** | Phonological awareness, RAN, decoding, comprehension | Indian norm cutoffs for dyslexia risk |
| **Speech & Language** | **PCC** | Total Consonants, Correct Consonants, PCC % Formula | PCC = (Correct Consonants / Total) * 100 |
| **Speech & Language** | **AAC Evaluation** | Motor access mode, symbol recognition, PECS phase, device selection | High-tech vs Low-tech communication board |
| **Speech & Language** | **AVT Tracking** | Erber's Hierarchy (Detect, Discrim, ID, Comprehend), Ling 6-Sound Test | Ling 6-Sounds (/m, ah, oo, ee, sh, s/) detection |
| **Voice / Dysphagia** | **CAPE-V & GRBAS** | CAPE-V VAS (0-100 mm); GRBAS Grades (0-3: G, R, B, A, S) | G0 (Normal) to G3 (Severe Dysphonia) |
| **Voice / Dysphagia** | **Phonatory / Acoustic** | MPT (sec), s/z Ratio, HNR (dB), VHI Score (0-120) | MPT Norm 15-20s; s/z Pathological > 1.4 |
| **Voice / Dysphagia** | **SSI-4 & %SS** | % Syllables Stuttered (%SS), Duration (sec), Physical Concomitants | SSI-4 Score: Very Mild (10-17) to Very Severe (37-56) |
| **Voice / Dysphagia** | **FOIS & IDDSI** | FOIS Levels 1 to 7; IDDSI Fluid Levels 0-4; IDDSI Food Levels 3-7 | FOIS Level 1 (Tube only) to Level 7 (Total oral) |
| **Psychological / CBT**| **PHQ-9** | 9-item scale (0-3 each), Total Score (0-27), Suicidal item #9 | Minimal (0-4), Mild (5-9), Moderate (10-14), Severe (20-27) |
| **Psychological / CBT**| **GAD-7** | 7-item scale (0-3 each), Total Score (0-21) | Minimal (0-4), Mild (5-9), Moderate (10-14), Severe (15-21) |
| **Psychological / CBT**| **PSS-10** | 10-item scale (0-4 each), Total Score (0-40) | Low (0-13), Moderate (14-26), High (27-40) |
| **Psychological / CBT**| **Risk & Safety Matrix**| Ideation, intent, means, protective factors, 5-Step Safety Plan | Low / Moderate / High Risk logic & Referral trigger |

---

# SECTION 1: AUDIOLOGY ASSESSMENTS SPECIFICATION

## 1.1 Otoacoustic Emissions (OAE) Screening
- **Supported Modes**: TEOAE (Transient Evoked OAE) and DPOAE (Distortion Product OAE).
- **Tested Frequencies**: 1000 Hz, 1500 Hz, 2000 Hz, 3000 Hz, 4000 Hz.
- **Key Fields**:
  - `ear`: Enum (`RIGHT`, `LEFT`)
  - `snr_db`: Number (Signal-to-Noise Ratio in dB for each frequency)
  - `reproducibility_pct`: Number (Percentage 0-100%)
  - `frequency_result`: Enum (`PASS`, `REFER`) per frequency
  - `overall_result`: Enum (`PASS`, `REFER`) per ear
- **Clinical Rule**: Frequency PASS requires `SNR ≥ 6 dB` and `Reproducibility > 70%`. Ear PASS requires at least 3 out of 5 frequencies to PASS.

## 1.2 Pure Tone Audiometry (PTA)
- **Frequencies**: 125 Hz, 250 Hz, 500 Hz, 1000 Hz, 2000 Hz, 4000 Hz, 8000 Hz.
- **Modes**: Air Conduction (AC) & Bone Conduction (BC) for Right and Left ears.
- **Masking Levels**: Recorded in dB HL whenever AC-BC gap > 10 dB or interaural attenuation threshold is reached (40 dB for headphones, 70 dB for insert earphones).
- **Computed Indicators**:
  - `PTA1` = `(Threshold_500 + Threshold_1000 + Threshold_2000) / 3`
  - `PTA2` = `(Threshold_500 + Threshold_1000 + Threshold_2000 + Threshold_4000) / 4`
- **Severity Classification (WHO Standard)**:
  - `≤ 20 dB HL`: Normal Hearing
  - `21 - 35 dB HL`: Mild Hearing Loss
  - `36 - 50 dB HL`: Moderate Hearing Loss
  - `51 - 65 dB HL`: Moderately-Severe Hearing Loss
  - `66 - 80 dB HL`: Severe Hearing Loss
  - `81 - 95 dB HL`: Profound Hearing Loss
  - `≥ 96 dB HL`: Complete / Total Hearing Loss

## 1.3 Speech Audiometry
- **Fields**:
  - `SRT_dB`: Speech Reception Threshold (dB HL) using spondee word lists.
  - `SDT_dB`: Speech Detection Threshold (dB HL).
  - `WRS_pct`: Word Recognition Score percentage (%) evaluated using Phonetically Balanced (PB) word lists at presentation level (`SRT + 30/40 dB`).
- **Validation Rule**: `SRT` must align within `±5 dB` of `PTA1`.

## 1.4 Tuning Fork Tests
- **Frequencies**: 256 Hz, 512 Hz, 1024 Hz.
- **Rinne Test**: Enum (`POSITIVE` [AC > BC], `NEGATIVE` [BC > AC], `FALSE_NEGATIVE`).
- **Weber Test**: Enum (`MIDLINE`, `LATERALIZED_RIGHT`, `LATERALIZED_LEFT`).

## 1.5 Tinnitus Evaluations (THI, TFI, TRT)
- **THI (Tinnitus Handicap Inventory)**: 25 items (Yes=4, Sometimes=2, No=0). Score: 0-100.
  - Grade I (0-16): Slight; Grade II (18-36): Mild; Grade III (38-56): Moderate; Grade IV (58-76): Severe; Grade V (78-100): Catastrophic.
- **TFI (Tinnitus Functional Index)**: 25 items across 8 subscales. Score: 0-100.
- **TRT Category**: Jastreboff Category 0 (Noise minimal), 1 (Tinnitus prominent), 2 (Tinnitus + Hearing Loss), 3 (Hyperacusis primary), 4 (Hyperacusis + Tinnitus).

---

# SECTION 2: SPEECH & LANGUAGE ASSESSMENTS SPECIFICATION

## 2.1 ALD-MM (Assessment of Language Development)
- **Fields**: `receptive_language_age_months`, `expressive_language_age_months`, `chronological_age_months`.
- **Formulas**:
  - `Receptive_DQ` = `(receptive_language_age_months / chronological_age_months) * 100`
  - `Expressive_DQ` = `(expressive_language_age_months / chronological_age_months) * 100`

## 2.2 LPT (Linguistic Profile Test)
- **Domains**: Phonology, Semantics, Syntactic Structures, Morphology, Pragmatics.
- **Scoring**: Percentage mastery per domain compared against age-matched Indian norms.

## 2.3 CAPC-M (Pragmatics & Communication)
- **Parameters**: Eye contact, turn-taking, topic initiation, topic maintenance, conversational repair, non-verbal gesture usage.

## 2.4 DALI (Dyslexia Assessment for Indian Children)
- **Parameters**: Phonological awareness, Rapid Automized Naming (RAN), decoding, reading comprehension, writing & spelling.

## 2.5 PCC (Percentage of Consonants Correct)
- **Formula**: `PCC = (Number of Correct Consonants / Total Number of Consonants Produced) * 100`
- **Severity Cutoffs**:
  - `> 85%`: Mild Phonological Disorder
  - `65 - 85%`: Mild-Moderate Phonological Disorder
  - `50 - 65%`: Moderate-Severe Phonological Disorder
  - `< 50%`: Severe Phonological Disorder

## 2.6 AAC & AVT Tracking
- **AAC**: Access mode (Touch/Eye gaze), symbol set (PECS/PCS), device recommendation (Low-tech board vs High-tech app).
- **AVT**: Erber's Auditory Hierarchy (Detection, Discrimination, Identification, Comprehension), Ling 6-Sound Test (/m, ah, oo, ee, sh, s/) detection distance in meters.

---

# SECTION 3: VOICE, STUTTERING & DYSPHAGIA SPECIFICATION

## 3.1 Perceptual Voice (CAPE-V & GRBAS)
- **CAPE-V**: Visual Analog Scale (0 to 100 mm) for Overall Severity, Roughness, Breathiness, Strain, Pitch, Loudness.
- **GRBAS**: 4-point rating (0=Normal, 1=Mild, 2=Moderate, 3=Severe) for Grade, Roughness, Breathiness, Asthenia, Strain.

## 3.2 Phonatory & Acoustic Measures
- **MPT**: Maximum Phonation Time in seconds for sustained /a/, /i/, /u/. (Norm: Adult Males 20-25s, Adult Females 15-20s, Children 10-15s).
- **s/z Ratio**: Ratio of /s/ duration to /z/ duration. `s/z > 1.4` indicates vocal fold lesion / glottal incompetence.
- **HNR**: Harmonics-to-Noise Ratio in dB. (Norm > 20 dB).
- **VHI (Voice Handicap Index)**: 30 items (Functional, Physical, Emotional). Score: 0-120. (0-30: Mild, 31-60: Moderate, 61-120: Severe).

## 3.3 Stuttering (SSI-4 & %SS)
- **%SS**: `(Stuttered Syllables / Total Syllables) * 100`.
- **SSI-4 Score**: Sum of Frequency task score + Duration task score + Physical Concomitants score (0-20). Total Score: 10-56 (Very Mild to Very Severe).

## 3.4 Dysphagia (FOIS & IDDSI)
- **FOIS (Functional Oral Intake Scale)**:
  - Level 1: No oral intake (Tube dependent).
  - Level 2: Tube dependent with minimal oral attempts.
  - Level 3: Tube dependent with consistent oral intake of single consistency.
  - Level 4: Total oral intake of single consistency.
  - Level 5: Total oral intake of multiple consistencies requiring special prep.
  - Level 6: Total oral intake of multiple consistencies without special prep, but with food restrictions.
  - Level 7: Total oral intake without restrictions.
- **IDDSI Levels**:
  - Fluids: Level 0 (Thin), Level 1 (Slightly Thick), Level 2 (Mildly Thick), Level 3 (Moderately Thick), Level 4 (Extremely Thick).
  - Foods: Level 3 (Liquidised), Level 4 (Pureed), Level 5 (Minced & Moist), Level 6 (Soft & Bite-Sized), Level 7 (Regular).

---

# SECTION 4: PSYCHOLOGICAL & CBT SPECIFICATION

## 4.1 PHQ-9 (Depression Screening)
- **Scoring**: 9 items scored 0 (Not at all) to 3 (Nearly every day). Total 0-27.
- **Severity**: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe.
- **Item 9 Safety Trigger**: Score ≥ 1 on Item 9 (thoughts of death/self-harm) automatically triggers mandatory risk assessment prompt.

## 4.2 GAD-7 (Anxiety Screening)
- **Scoring**: 7 items scored 0 to 3. Total 0-21.
- **Severity**: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe.

## 4.3 PSS-10 (Perceived Stress Scale)
- **Scoring**: 10 items scored 0 to 4. Total 0-40.
- **Severity**: 0-13 Low Stress, 14-26 Moderate Stress, 27-40 High Stress.

## 4.4 Risk Assessment & 5-Step Safety Plan Matrix
- **Risk Evaluation**: Ideation, Intent, Plan, Means, Prior Attempts, Protective Factors -> Overall Risk Level (`NONE`, `LOW`, `MODERATE`, `HIGH`).
- **5-Step Safety Plan Matrix**:
  1. Internal Warning Signs
  2. Internal Coping Strategies
  3. Social Distractions & Support Contacts
  4. Family / Crisis Contacts
  5. Professional Emergency Services & Hotlines
- **Mandatory Logic**: Moderate/High risk blocks unassisted session closure without entering safety plan and prompt for psychiatric referral.

---
