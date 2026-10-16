import os
import markdown
import asyncio
from playwright.async_api import async_playwright
import fitz

target_dir = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/TEST_ASSESSMENTS_REPORTS_SAMPLES"
os.makedirs(target_dir, exist_ok=True)

css_styles = """
<style>
    @page {
        size: A4;
        margin: 14mm 12mm 14mm 12mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: "Calibri", "Segoe UI", Arial, sans-serif;
        color: #0F172A;
        line-height: 1.32;
        background-color: #FFFFFF;
        font-size: 8.2pt;
        -webkit-print-color-adjust: exact;
    }
    .report-container {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 0;
    }
    .letterhead-table {
        width: 100%;
        border-collapse: collapse;
        border-bottom: 2.5px solid #0F172A;
        padding-bottom: 4pt;
        margin-bottom: 6pt;
    }
    .letterhead-table td { vertical-align: top; }
    .clinic-title {
        font-family: Georgia, serif;
        font-size: 14pt;
        font-weight: bold;
        color: #0F172A;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .clinic-sub {
        font-size: 7.8pt;
        color: #334155;
    }
    .practitioner-meta {
        text-align: right;
        font-size: 7.8pt;
        color: #0F172A;
    }
    .practitioner-meta strong {
        font-size: 8.5pt;
        color: #0D9488;
    }
    
    .report-title-bar {
        background-color: #0F172A;
        color: #FFFFFF;
        text-align: center;
        padding: 3.5pt 6pt;
        font-size: 9.5pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 6pt;
    }
    
    table.patient-meta {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 6pt;
        border: 1px solid #CBD5E1;
        background-color: #F8FAFC;
    }
    table.patient-meta td {
        padding: 3pt 5pt;
        font-size: 7.8pt;
        border: 1px solid #E2E8F0;
    }
    table.patient-meta td.label {
        font-weight: bold;
        color: #334155;
        background-color: #F1F5F9;
        width: 16%;
    }
    table.patient-meta td.val {
        color: #0F172A;
        width: 34%;
    }
    
    h2.clinical-sec-heading {
        font-family: Georgia, serif;
        font-size: 9pt;
        text-transform: uppercase;
        color: #0F172A;
        border-bottom: 1.5px solid #0D9488;
        padding-bottom: 1pt;
        margin: 7pt 0 3pt 0;
        letter-spacing: 0.3px;
    }
    
    table.clinical-data {
        width: 100% !important;
        border-collapse: collapse;
        margin-bottom: 6pt;
        font-size: 7.8pt;
    }
    table.clinical-data th, table.clinical-data td {
        border: 1px solid #94A3B8;
        padding: 2.5pt 4.5pt;
        vertical-align: top;
        text-align: left;
    }
    table.clinical-data th {
        background-color: #1E293B;
        color: #FFFFFF;
        font-weight: bold;
        font-size: 7.2pt;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }
    table.clinical-data tr:nth-child(even) td {
        background-color: #F8FAFC;
    }

    .score-card-grid {
        display: flex;
        gap: 5pt;
        margin-bottom: 6pt;
    }
    .score-card {
        flex: 1;
        border: 1px solid #CBD5E1;
        background: #F8FAFC;
        padding: 4pt;
        border-radius: 3px;
        text-align: center;
    }
    .score-card .val {
        font-size: 11pt;
        font-weight: bold;
        color: #0D9488;
        margin: 1pt 0;
    }
    .score-card .lbl {
        font-size: 7pt;
        color: #475569;
        text-transform: uppercase;
        font-weight: bold;
    }

    .clinical-box {
        border: 1px solid #0D9488;
        border-left: 3.5px solid #0D9488;
        background-color: #F0FDFA;
        padding: 5pt 7pt;
        margin: 6pt 0;
        font-size: 8pt;
        line-height: 1.3;
    }
    .clinical-box strong {
        color: #0F766E;
        text-transform: uppercase;
        font-size: 7.8pt;
    }

    .sig-footer {
        margin-top: 10pt;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-top: 1px solid #CBD5E1;
        padding-top: 6pt;
        page-break-inside: avoid;
    }
    .sig-block {
        text-align: right;
        font-size: 7.8pt;
    }
</style>
"""

# HTML REPORT 1: AUDIOLOGY
html_aud = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Comprehensive Audiology Evaluation Report Sample</title>
{css_styles}
</head>
<body>
<div class="report-container">
    <table class="letterhead-table">
        <tr>
            <td>
                <div class="clinic-title">Vani's Speech & Hearing Clinic</div>
                <div class="clinic-sub">Center for Audiology, Speech-Language Pathology & Hearing Conservation<br>Satara, Maharashtra • Contact: +91-98220-XXXXX • Email: contact@vanisclinic.in</div>
            </td>
            <td class="practitioner-meta">
                <strong>Ms. Palak Paresh Gandhi</strong><br>
                BASLP, Rehabilitation Council of India (RCI) Reg.<br>
                Consultant Audiologist & Speech-Language Pathologist
            </td>
        </tr>
    </table>

    <div class="report-title-bar">COMPREHENSIVE AUDIOLOGICAL EVALUATION REPORT</div>

    <table class="patient-meta">
        <tr>
            <td class="label">Patient Name:</td>
            <td class="val">Mr. Rahul D. More</td>
            <td class="label">UHID:</td>
            <td class="val">PGC-26-000104</td>
        </tr>
        <tr>
            <td class="label">Age / Gender:</td>
            <td class="val">58 Yrs / Male</td>
            <td class="label">Date of Test:</td>
            <td class="val">October 09, 2026</td>
        </tr>
        <tr>
            <td class="label">Referred By:</td>
            <td class="val">Dr. S. K. Kulkarni, MS (ENT)</td>
            <td class="label">Test Audiometer:</td>
            <td class="val">Interacoustics AD629 (Calibrated: Aug 2026)</td>
        </tr>
    </table>

    <h2 class="clinical-sec-heading">1. Otoacoustic Emissions (OAE) Screening</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Ear</th>
                <th>Protocol</th>
                <th>1.0 kHz</th>
                <th>1.5 kHz</th>
                <th>2.0 kHz</th>
                <th>3.0 kHz</th>
                <th>4.0 kHz</th>
                <th>Overall Result</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Right Ear</strong></td>
                <td>DPOAE (L1=65, L2=55)</td>
                <td>Pass (8 dB)</td>
                <td>Pass (7 dB)</td>
                <td>Refer (3 dB)</td>
                <td>Refer (2 dB)</td>
                <td>Refer (1 dB)</td>
                <td><strong style="color: #C2410C;">REFER (High Freq Deficit)</strong></td>
            </tr>
            <tr>
                <td><strong>Left Ear</strong></td>
                <td>DPOAE (L1=65, L2=55)</td>
                <td>Pass (11 dB)</td>
                <td>Pass (10 dB)</td>
                <td>Pass (9 dB)</td>
                <td>Pass (8 dB)</td>
                <td>Pass (7 dB)</td>
                <td><strong style="color: #15803D;">PASS (Normal Cochlear Outer Hair Cell)</strong></td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">2. Pure Tone Audiometry (PTA) Threshold Grid (dB HL)</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Ear / Mode</th>
                <th>125 Hz</th>
                <th>250 Hz</th>
                <th>500 Hz</th>
                <th>1000 Hz</th>
                <th>2000 Hz</th>
                <th>4000 Hz</th>
                <th>8000 Hz</th>
                <th>PTA1 (500,1k,2k)</th>
                <th>PTA2 (500,1k,2k,4k)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Right Ear (AC)</strong></td>
                <td>25</td>
                <td>30</td>
                <td>40</td>
                <td>50</td>
                <td>55</td>
                <td>65</td>
                <td>70</td>
                <td><strong>48.3 dB HL</strong></td>
                <td><strong>52.5 dB HL</strong></td>
            </tr>
            <tr>
                <td><strong>Right Ear (BC)</strong></td>
                <td>-</td>
                <td>25</td>
                <td>40</td>
                <td>45</td>
                <td>55</td>
                <td>60</td>
                <td>-</td>
                <td colspan="2">Masked (No Air-Bone Gap > 10 dB)</td>
            </tr>
            <tr>
                <td><strong>Left Ear (AC)</strong></td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>20</td>
                <td>20</td>
                <td>25</td>
                <td>25</td>
                <td><strong>18.3 dB HL</strong></td>
                <td><strong>20.0 dB HL</strong></td>
            </tr>
            <tr>
                <td><strong>Left Ear (BC)</strong></td>
                <td>-</td>
                <td>15</td>
                <td>15</td>
                <td>20</td>
                <td>20</td>
                <td>20</td>
                <td>-</td>
                <td colspan="2">Unmasked (Normal Thresholds)</td>
            </tr>
        </tbody>
    </table>

    <div class="score-card-grid">
        <div class="score-card">
            <div class="lbl">Right Ear Degree</div>
            <div class="val" style="color: #C2410C;">Moderate SNHL</div>
        </div>
        <div class="score-card">
            <div class="lbl">Left Ear Degree</div>
            <div class="val" style="color: #15803D;">Normal Hearing</div>
        </div>
        <div class="score-card">
            <div class="lbl">Configuration</div>
            <div class="val">Sloping High Freq</div>
        </div>
    </div>

    <h2 class="clinical-sec-heading">3. Speech Audiometry & Tuning Fork Tests</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Test Parameter</th>
                <th>Right Ear</th>
                <th>Left Ear</th>
                <th>Clinical Norms / Diagnostic Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>SRT (Speech Reception Threshold)</strong></td>
                <td>50 dB HL</td>
                <td>20 dB HL</td>
                <td>Agrees within ±5 dB of PTA1 threshold</td>
            </tr>
            <tr>
                <td><strong>SDT (Speech Detection Threshold)</strong></td>
                <td>45 dB HL</td>
                <td>15 dB HL</td>
                <td>Lowest level speech signal detected</td>
            </tr>
            <tr>
                <td><strong>WRS / SDS (Word Recognition Score %)</strong></td>
                <td>76% at 80 dB HL</td>
                <td>96% at 50 dB HL</td>
                <td>PB Marathi Word List (Good in RE, Excellent in LE)</td>
            </tr>
            <tr>
                <td><strong>Rinne Tuning Fork Test (512 Hz)</strong></td>
                <td>Positive (AC > BC)</td>
                <td>Positive (AC > BC)</td>
                <td>Rules out conductive hearing loss component bilaterally</td>
            </tr>
            <tr>
                <td><strong>Weber Tuning Fork Test (512 Hz)</strong></td>
                <td colspan="2" style="text-align: center;"><strong>Lateralizes to Left Ear</strong></td>
                <td>Confirms sensorineural deficit in Right Ear</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">4. Tinnitus Evaluation & TRT Categorization</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Assessment Instrument</th>
                <th>Raw Score</th>
                <th>Severity Grade / Index</th>
                <th>Clinical Interpretation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>THI (Tinnitus Handicap Inventory)</strong></td>
                <td>46 / 100</td>
                <td>Grade III (Moderate Handicap)</td>
                <td>Tinnitus interferes with concentration, sleep and quiet listening</td>
            </tr>
            <tr>
                <td><strong>TFI (Tinnitus Functional Index)</strong></td>
                <td>52.4 / 100</td>
                <td>Moderate Functional Impact</td>
                <td>High subscale scores in Intrusiveness (65%) and Sleep (55%)</td>
            </tr>
            <tr>
                <td><strong>TRT Category (Jastreboff)</strong></td>
                <td colspan="2">Category 2 (Tinnitus + Hearing Loss)</td>
                <td>Indicates combination of sound therapy and hearing aid amplification</td>
            </tr>
        </tbody>
    </table>

    <div class="clinical-box">
        <strong>DIAGNOSTIC IMPRESSION & RECOMMENDATIONS:</strong><br>
        1. <strong>Right Ear</strong>: Moderate Sensorineural Hearing Loss with associated high-frequency DPOAE refer and Moderate Tinnitus Handicap (THI Grade III).<br>
        2. <strong>Left Ear</strong>: Normal hearing sensitivity across tested frequencies with robust DPOAE outer hair cell response.<br>
        3. <strong>Plan</strong>: Digital Receiver-in-Canal (RIC) Hearing Aid trial with built-in Tinnitus Sound Generator (TSG) for Right Ear. Tinnitus Retraining Therapy (TRT) counselling initiated.
    </div>

    <div class="sig-footer">
        <div>Date: October 09, 2026<br>Place: Satara</div>
        <div class="sig-block">
            <br><br>
            ________________________________________<br>
            <strong>Ms. Palak Paresh Gandhi</strong><br>
            BASLP | RCI Registered Audiologist
        </div>
    </div>
</div>
</body>
</html>
"""

# Save Audiology HTML
aud_html_path = os.path.join(target_dir, "01_Audiology_Evaluation_Report_Sample.html")
with open(aud_html_path, "w", encoding="utf-8") as f:
    f.write(html_aud)

print(f"Generated {aud_html_path}")

# HTML REPORT 2: SPEECH AND LANGUAGE ASSESSMENT
html_sl = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Speech & Language Comprehensive Assessment Report Sample</title>
{css_styles}
</head>
<body>
<div class="report-container">
    <table class="letterhead-table">
        <tr>
            <td>
                <div class="clinic-title">Vani's Speech & Hearing Clinic</div>
                <div class="clinic-sub">Center for Audiology, Speech-Language Pathology & Hearing Conservation<br>Satara, Maharashtra • Contact: +91-98220-XXXXX • Email: contact@vanisclinic.in</div>
            </td>
            <td class="practitioner-meta">
                <strong>Ms. Palak Paresh Gandhi</strong><br>
                BASLP, Rehabilitation Council of India (RCI) Reg.<br>
                Consultant Audiologist & Speech-Language Pathologist
            </td>
        </tr>
    </table>

    <div class="report-title-bar">SPEECH & LANGUAGE COMPREHENSIVE ASSESSMENT REPORT</div>

    <table class="patient-meta">
        <tr>
            <td class="label">Patient Name:</td>
            <td class="val">Master Aarav S. Patil</td>
            <td class="label">UHID:</td>
            <td class="val">PGC-26-000215</td>
        </tr>
        <tr>
            <td class="label">Age / Gender:</td>
            <td class="val">4 Yrs 6 Mos / Male</td>
            <td class="label">Date of Test:</td>
            <td class="val">October 09, 2026</td>
        </tr>
        <tr>
            <td class="label">Informant:</td>
            <td class="val">Mrs. Sangeeta Patil (Mother)</td>
            <td class="label">Primary Language:</td>
            <td class="val">Marathi (Home) / English (Preschool)</td>
        </tr>
    </table>

    <h2 class="clinical-sec-heading">1. ALD-MM & LPT Language Battery Scores</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Test Battery</th>
                <th>Domain / Subtest</th>
                <th>Equivalent Age / Raw Score</th>
                <th>Development Quotient (DQ) / Severity</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="3"><strong>ALD-MM</strong><br>(Assessment of Language Development)</td>
                <td>Receptive Language Age (RLA)</td>
                <td>3 Years 0 Months</td>
                <td><strong>Receptive DQ: 66.7%</strong> (Moderate Delay)</td>
            </tr>
            <tr>
                <td>Expressive Language Age (ELA)</td>
                <td>2 Years 6 Months</td>
                <td><strong>Expressive DQ: 55.5%</strong> (Significant Delay)</td>
            </tr>
            <tr>
                <td>Overall Language Age</td>
                <td>2 Years 9 Months</td>
                <td>Chronological Age: 4 Yrs 6 Mos (19 Mo Gap)</td>
            </tr>
            <tr>
                <td rowspan="4"><strong>LPT</strong><br>(Linguistic Profile Test)</td>
                <td>Phonology & Articulation</td>
                <td>75% Mastery</td>
                <td>Mild substitution errors (Dentalization)</td>
            </tr>
            <tr>
                <td>Semantics & Vocabulary</td>
                <td>60% Mastery</td>
                <td>Limited expressive vocabulary (&lt; 150 words)</td>
            </tr>
            <tr>
                <td>Syntactic Structures</td>
                <td>45% Mastery</td>
                <td>2-3 word utterances (Subject + Verb)</td>
            </tr>
            <tr>
                <td>Pragmatics & Social Use</td>
                <td>65% Mastery</td>
                <td>Maintains eye contact; intent expression impaired</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">2. CAPC-M Pragmatic Analysis & DALI Screening</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Assessment Battery</th>
                <th>Observed Behavioral Parameter</th>
                <th>Clinical Rating / Score</th>
                <th>Clinical Recommendation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="3"><strong>CAPC-M</strong><br>(Pragmatics & Communication)</td>
                <td>Non-Verbal Communication</td>
                <td>Adequate (Gestures, pointing)</td>
                <td>Leverage visual aids during therapy</td>
            </tr>
            <tr>
                <td>Turn-Taking & Topic Maintenance</td>
                <td>Deficit (Needs clinician prompt)</td>
                <td>Structured social turn-taking activities</td>
            </tr>
            <tr>
                <td>Conversational Repair & Intent</td>
                <td>Impaired (Becomes frustrated)</td>
                <td>Introduce repair strategies and cue cards</td>
            </tr>
            <tr>
                <td rowspan="2"><strong>DALI Screening</strong><br>(Pre-Literacy Screening)</td>
                <td>Phonological Awareness</td>
                <td>Below Age Expectations</td>
                <td>Rhyming and syllable segmentation training</td>
            </tr>
            <tr>
                <td>Rapid Automized Naming (RAN)</td>
                <td>Delayed (&gt; 3.5 sec per item)</td>
                <td>Visual-auditory association drills</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">3. PCC Phonological Analysis & AAC / AVT Tracking</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Clinical Domain</th>
                <th>Evaluation Parameter</th>
                <th>Observed Data / Formula</th>
                <th>Severity / Clinical Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>PCC Analysis</strong></td>
                <td>Percentage of Consonants Correct</td>
                <td>Formula: (78 Correct / 120 Total) * 100</td>
                <td><strong style="color: #C2410C;">PCC = 65.0% (Moderate Phonological Disorder)</strong></td>
            </tr>
            <tr>
                <td><strong>AAC Evaluation</strong></td>
                <td>Augmentative Communication Readiness</td>
                <td>Direct touch access, PECS Phase II candidate</td>
                <td>Recommended Low-Tech Communication Board (2x2 Grid)</td>
            </tr>
            <tr>
                <td rowspan="2"><strong>AVT Tracking</strong><br>(Auditory Verbal Therapy)</td>
                <td>Erber's Auditory Hierarchy</td>
                <td>Detection: 100%, Discrimination: 80%, ID: 60%</td>
                <td>Targeting Auditory Comprehension of multi-step commands</td>
            </tr>
            <tr>
                <td>Ling 6-Sound Test (/m,ah,oo,ee,sh,s/)</td>
                <td>Consistent detection at 3 meters</td>
                <td>Good auditory awareness across speech spectrum</td>
            </tr>
        </tbody>
    </table>

    <div class="clinical-box">
        <strong>DIAGNOSTIC IMPRESSION & TREATMENT PLAN:</strong><br>
        1. <strong>Diagnosis</strong>: Moderate Receptive-Expressive Language Delay secondary to Developmental Language Disorder (DLD), with co-occurring Phonological Disorder (PCC 65%).<br>
        2. <strong>Short-Term Goals (3 Months)</strong>: Expand expressive vocabulary to 300 words; increase MLU to 3-4 word combinations; improve retroflex consonant production.<br>
        3. <strong>Plan</strong>: Individual Speech-Language Therapy 3 sessions/week (45 mins each) focusing on auditory verbal expansion, vocabulary enrichment, and parent child-guided home stimulation.
    </div>

    <div class="sig-footer">
        <div>Date: October 09, 2026<br>Place: Satara</div>
        <div class="sig-block">
            <br><br>
            ________________________________________<br>
            <strong>Ms. Palak Paresh Gandhi</strong><br>
            BASLP | RCI Registered Speech Pathologist
        </div>
    </div>
</div>
</body>
</html>
"""

# Save Speech & Language HTML
sl_html_path = os.path.join(target_dir, "02_Speech_and_Language_Assessment_Report_Sample.html")
with open(sl_html_path, "w", encoding="utf-8") as f:
    f.write(html_sl)

print(f"Generated {sl_html_path}")

# HTML REPORT 3: VOICE, STUTTERING AND DYSPHAGIA ASSESSMENT
html_vsd = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Voice, Stuttering & Dysphagia Clinical Evaluation Report Sample</title>
{css_styles}
</head>
<body>
<div class="report-container">
    <table class="letterhead-table">
        <tr>
            <td>
                <div class="clinic-title">Vani's Speech & Hearing Clinic</div>
                <div class="clinic-sub">Center for Audiology, Speech-Language Pathology & Hearing Conservation<br>Satara, Maharashtra • Contact: +91-98220-XXXXX • Email: contact@vanisclinic.in</div>
            </td>
            <td class="practitioner-meta">
                <strong>Ms. Palak Paresh Gandhi</strong><br>
                BASLP, Rehabilitation Council of India (RCI) Reg.<br>
                Consultant Audiologist & Speech-Language Pathologist
            </td>
        </tr>
    </table>

    <div class="report-title-bar">VOICE, STUTTERING & DYSPHAGIA EVALUATION REPORT</div>

    <table class="patient-meta">
        <tr>
            <td class="label">Patient Name:</td>
            <td class="val">Mrs. Sunita M. Deshmukh</td>
            <td class="label">UHID:</td>
            <td class="val">PGC-26-000340</td>
        </tr>
        <tr>
            <td class="label">Age / Gender:</td>
            <td class="val">42 Yrs / Female</td>
            <td class="label">Date of Test:</td>
            <td class="val">October 09, 2026</td>
        </tr>
        <tr>
            <td class="label">Occupation:</td>
            <td class="val">School Teacher (Professional Voice User)</td>
            <td class="label">Referred By:</td>
            <td class="val">Dr. A. V. Joshi, MS (ENT)</td>
        </tr>
    </table>

    <h2 class="clinical-sec-heading">1. Perceptual Voice Evaluation (CAPE-V & GRBAS)</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Assessment Scale</th>
                <th>Parameter Evaluated</th>
                <th>Visual Analog Score / Grade (0-100 mm / 0-3)</th>
                <th>Clinical Interpretation</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="6"><strong>CAPE-V</strong><br>(Consensus Auditory-Perceptual Evaluation of Voice)</td>
                <td>Overall Severity</td>
                <td>55 / 100 mm (Moderate)</td>
                <td>Moderate dysphonia during continuous speech</td>
            </tr>
            <tr>
                <td>Roughness</td>
                <td>48 / 100 mm (Moderate)</td>
                <td>Audible vocal fold irregularity / raspy tone</td>
            </tr>
            <tr>
                <td>Breathiness</td>
                <td>35 / 100 mm (Mild-Moderate)</td>
                <td>Audible air escape during sustained vowels</td>
            </tr>
            <tr>
                <td>Strain</td>
                <td>60 / 100 mm (Moderate)</td>
                <td>Hyperfunctional muscle tension during phonation</td>
            </tr>
            <tr>
                <td>Pitch & Loudness</td>
                <td>Pitch: 40 (Slightly Low) | Loudness: 30 (Mild)</td>
                <td>Pitch breaks noted during vocal load</td>
            </tr>
            <tr>
                <td>Resonance</td>
                <td>Normal (Oral-Nasal Balance)</td>
                <td>No hyper/hyponasality detected</td>
            </tr>
            <tr>
                <td><strong>GRBAS Scale</strong></td>
                <td colspan="2">G2 (Grade) | R2 (Roughness) | B1 (Breathiness) | A0 (Asthenia) | S2 (Strain)</td>
                <td>Moderate voice impairment driven by roughness & strain</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">2. Phonatory, Acoustic Measures & Voice Handicap Index (VHI)</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Parameter / Measure</th>
                <th>Observed Value</th>
                <th>Normative Range</th>
                <th>Diagnostic Significance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>MPT (Maximum Phonation Time)</strong></td>
                <td>/a/ = 7.2 sec | /i/ = 8.0 sec | /u/ = 7.5 sec</td>
                <td>15.0 – 20.0 seconds</td>
                <td>Significantly reduced phonatory breath support</td>
            </tr>
            <tr>
                <td><strong>s/z Ratio</strong></td>
                <td>/s/ = 14.5 sec | /z/ = 7.2 sec (Ratio = <strong>2.01</strong>)</td>
                <td>Ratio &lt; 1.4</td>
                <td>Pathological (Indicates glottal insufficiency / lesion)</td>
            </tr>
            <tr>
                <td><strong>HNR (Harmonics-to-Noise Ratio)</strong></td>
                <td>11.4 dB</td>
                <td>&gt; 20.0 dB</td>
                <td>Elevated noise component in voice signal</td>
            </tr>
            <tr>
                <td><strong>VHI (Voice Handicap Index)</strong></td>
                <td>Functional: 18 | Physical: 26 | Emotional: 14<br><strong>Total VHI Score = 58 / 120</strong></td>
                <td>0 – 30: Mild<br>31 – 60: Moderate<br>61 – 120: Severe</td>
                <td><strong style="color: #C2410C;">Moderate Voice Handicap</strong> (High physical handicap in teaching)</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">3. Stuttering Evaluation (SSI-4 & %SS Analysis)</h2>
    <p><em>(Evaluated for Pediatric Fluency Profile Patient: Master Rohan K. Shinde, Age 11 Yrs)</em></p>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>SSI-4 Subscale</th>
                <th>Raw Test Data</th>
                <th>Converted Task Score</th>
                <th>Severity Classification</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Frequency (% Syllables Stuttered)</strong></td>
                <td>9.4% SS (Reading + Speaking tasks)</td>
                <td>16 Points</td>
                <td rowspan="4" style="vertical-align: middle;"><strong style="color: #C2410C;">SSI-4 Total Score: 28<br>Severity: MODERATE-SEVERE STUTTERING</strong></td>
            </tr>
            <tr>
                <td><strong>Duration</strong></td>
                <td>Mean of 3 longest blocks: 2.8 seconds</td>
                <td>5 Points</td>
            </tr>
            <tr>
                <td><strong>Physical Concomitants</strong></td>
                <td>Facial grimace (3), Eye blink (2), Head nod (2)</td>
                <td>7 Points</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">4. Dysphagia (Swallowing) Evaluation (FOIS & IDDSI Levels)</h2>
    <p><em>(Evaluated for Adult Dysphagia Profile Patient: Mr. Vitthal R. Jadhav, Age 71 Yrs, Post-Stroke)</em></p>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Dysphagia Tool</th>
                <th>Assessed Level / Status</th>
                <th>Diet & Fluid Guidelines</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>FOIS (Functional Oral Intake)</strong></td>
                <td><strong style="color: #C2410C;">Level 3: Total oral intake of single consistency</strong></td>
                <td>Requires special preparation and tube compensation backup</td>
            </tr>
            <tr>
                <td><strong>IDDSI Fluid Consistency</strong></td>
                <td><strong>IDDSI Level 2: Mildly Thick Liquid</strong></td>
                <td>Nectar-thick consistency; avoids thin water aspiration risk</td>
            </tr>
            <tr>
                <td><strong>IDDSI Food Texture</strong></td>
                <td><strong>IDDSI Level 4: Pureed Diet</strong></td>
                <td>Smooth, cohesive, no lumps, no chewing required</td>
            </tr>
        </tbody>
    </table>

    <div class="clinical-box">
        <strong>DIAGNOSTIC IMPRESSION & RECOMMENDATIONS:</strong><br>
        1. <strong>Voice Impression</strong>: Moderate Vocal Hyperfunction with Glottal Insufficiency (s/z ratio 2.01, VHI 58). ENT indirect laryngoscopy recommended to rule out vocal vocal nodules.<br>
        2. <strong>Stuttering Impression</strong>: Moderate-Severe Fluency Disorder (SSI-4 Score 28, 9.4% SS) with secondary physical concomitants.<br>
        3. <strong>Dysphagia Impression</strong>: Oropharyngeal Dysphagia post-stroke (FOIS Level 3) requiring IDDSI Level 2 (Mildly Thick) fluids and Level 4 (Pureed) diet with chin-tuck swallowing maneuver.
    </div>

    <div class="sig-footer">
        <div>Date: October 09, 2026<br>Place: Satara</div>
        <div class="sig-block">
            <br><br>
            ________________________________________<br>
            <strong>Ms. Palak Paresh Gandhi</strong><br>
            BASLP | RCI Registered Consultant
        </div>
    </div>
</div>
</body>
</html>
"""

# Save Voice/Stuttering/Dysphagia HTML
vsd_html_path = os.path.join(target_dir, "03_Voice_Stuttering_and_Dysphagia_Report_Sample.html")
with open(vsd_html_path, "w", encoding="utf-8") as f:
    f.write(html_vsd)

print(f"Generated {vsd_html_path}")


# HTML REPORT 4: PSYCHOLOGICAL AND CBT ASSESSMENT
html_cbt = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Psychological & CBT Clinical Assessment Report Sample</title>
{css_styles}
</head>
<body>
<div class="report-container">
    <table class="letterhead-table">
        <tr>
            <td>
                <div class="clinic-title">Vani's Speech & Hearing Clinic</div>
                <div class="clinic-sub">Center for Audiology, Speech-Language Pathology & Counselling<br>Satara, Maharashtra • Contact: +91-98220-XXXXX • Email: contact@vanisclinic.in</div>
            </td>
            <td class="practitioner-meta">
                <strong>Ms. Palak Paresh Gandhi & CBT Team</strong><br>
                RCI Registered Practitioner & Psychological Counselor<br>
                <em>Strictly Confidential Medical Record (DPDP Act 2023 Compliant)</em>
            </td>
        </tr>
    </table>

    <div class="report-title-bar">PSYCHOLOGICAL & COGNITIVE BEHAVIOURAL THERAPY (CBT) REPORT</div>

    <table class="patient-meta">
        <tr>
            <td class="label">Patient Name:</td>
            <td class="val">Ms. Ananya K. Kulkarni</td>
            <td class="label">UHID:</td>
            <td class="val">PGC-26-000412</td>
        </tr>
        <tr>
            <td class="label">Age / Gender:</td>
            <td class="val">29 Yrs / Female</td>
            <td class="label">Date of Assessment:</td>
            <td class="val">October 09, 2026</td>
        </tr>
        <tr>
            <td class="label">Assessment Session:</td>
            <td class="val">Intake & Diagnostic Formulation</td>
            <td class="label">Consent Status:</td>
            <td class="val">Signed CBT Consent Form Verified</td>
        </tr>
    </table>

    <h2 class="clinical-sec-heading">1. Standardized Psychometric Scales (PHQ-9, GAD-7, PSS-10)</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Instrument</th>
                <th>Raw Score</th>
                <th>Score Range & Cutoff</th>
                <th>Clinical Severity Level</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>PHQ-9</strong><br>(Patient Health Questionnaire - Depression)</td>
                <td><strong>14 / 27</strong></td>
                <td>0-4: Minimal | 5-9: Mild<br>10-14: Moderate | 15-19: Mod. Severe | 20-27: Severe</td>
                <td><strong style="color: #C2410C;">MODERATE DEPRESSION</strong><br>(Item 9 Score = 1: Passive death thoughts)</td>
            </tr>
            <tr>
                <td><strong>GAD-7</strong><br>(Generalised Anxiety Disorder Scale)</td>
                <td><strong>12 / 21</strong></td>
                <td>0-4: Minimal | 5-9: Mild<br>10-14: Moderate | 15-21: Severe</td>
                <td><strong style="color: #C2410C;">MODERATE ANXIETY</strong><br>(Restlessness, excessive worry)</td>
            </tr>
            <tr>
                <td><strong>PSS-10</strong><br>(Perceived Stress Scale)</td>
                <td><strong>24 / 40</strong></td>
                <td>0-13: Low Stress | 14-26: Moderate Stress<br>27-40: High Stress</td>
                <td><strong>MODERATE-HIGH PERCEIVED STRESS</strong></td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">2. Clinical Risk Assessment & Mandatory Referral Matrix</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Risk Parameter</th>
                <th>Clinical Assessment Finding</th>
                <th>System Action / Safety Trigger</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Suicidal Ideation / Intent</strong></td>
                <td>Passive thoughts ("wish I didn't wake up"), NO active plan, NO specific intent.</td>
                <td rowspan="4" style="vertical-align: middle; background-color: #FEF2F2;"><strong style="color: #991B1B;">OVERALL RISK LEVEL: MODERATE RISK</strong><br><br>• Mandatory Safety Plan Matrix Activated<br>• System displays clinician warning banner<br>• Psychiatric Consultation Prompt Enabled</td>
            </tr>
            <tr>
                <td><strong>Self-Harm History</strong></td>
                <td>No prior suicide attempt; intermittent non-suicidal self-harm urges under high stress.</td>
            </tr>
            <tr>
                <td><strong>Means Access & Control</strong></td>
                <td>No firearms; medication access managed by family.</td>
            </tr>
            <tr>
                <td><strong>Protective Factors</strong></td>
                <td>Strong supportive sister, highly motivated for CBT, employed, no substance abuse.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="clinical-sec-heading">3. Patient 5-Step Safety Plan Matrix</h2>
    <table class="clinical-data">
        <thead>
            <tr>
                <th>Step Number</th>
                <th>Safety Plan Domain</th>
                <th>Patient-Specific Agreed Intervention</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Step 1</strong></td>
                <td>Recognizing Warning Signs</td>
                <td>Racing thoughts, isolating in bedroom, skipping meals, feeling heavy pressure in chest.</td>
            </tr>
            <tr>
                <td><strong>Step 2</strong></td>
                <td>Internal Coping Strategies</td>
                <td>Box breathing (4-4-4-4), 5-4-3-2-1 sensory grounding, listening to calming classical music.</td>
            </tr>
            <tr>
                <td><strong>Step 3</strong></td>
                <td>Social Distractions & Support</td>
                <td>Calling sister (Pooja: +91-98220-XXXXX), sitting in clinic garden, walking pet dog.</td>
            </tr>
            <tr>
                <td><strong>Step 4</strong></td>
                <td>Family / Crisis Contacts</td>
                <td>Primary Contact: Sister (Pooja Kulkarni); Secondary Contact: Vani's Clinic Support.</td>
            </tr>
            <tr>
                <td><strong>Step 5</strong></td>
                <td>Professional & Emergency Care</td>
                <td>Vani's Clinic Crisis Line (+91-98220-XXXXX) | Satara District Hospital Helpline (02162-XXXXXX).</td>
            </tr>
        </tbody>
    </table>

    <div class="clinical-box">
        <strong>FORMULATION & CBT TREATMENT PLAN:</strong><br>
        1. <strong>Cognitive Formulation</strong>: Automatic thoughts ("I am a failure if I am not perfect"), cognitive distortions (Catastrophising, All-or-Nothing thinking).<br>
        2. <strong>CBT Plan</strong>: 12 weekly sessions targeting Cognitive Restructuring, Behavioural Activation (activity scheduling), and Mindfulness-Based Stress Reduction (MBSR).<br>
        3. <strong>Confidentiality Note</strong>: Record encrypted under AES-256 field encryption. Access restricted to authorized CBT clinician.
    </div>

    <div class="sig-footer">
        <div>Date: October 09, 2026<br>Place: Satara</div>
        <div class="sig-block">
            <br><br>
            ________________________________________<br>
            <strong>CBT Lead & Psychological Counselor</strong><br>
            Vani's Speech, Hearing & Counselling Clinic
        </div>
    </div>
</div>
</body>
</html>
"""

# Save Psychological/CBT HTML
cbt_html_path = os.path.join(target_dir, "04_Psychological_and_CBT_Assessment_Report_Sample.html")
with open(cbt_html_path, "w", encoding="utf-8") as f:
    f.write(html_cbt)

print(f"Generated {cbt_html_path}")

# 5. MASTER CLINICAL PARAMETERS SPECIFICATION MARKDOWN
md_spec = """# Master Clinical Assessments & Reports Specification Manual
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
"""

# Save Markdown Spec
md_spec_path = os.path.join(target_dir, "05_Master_Clinical_Assessments_Specification_and_Parameters.md")
with open(md_spec_path, "w", encoding="utf-8") as f:
    f.write(md_spec)

print(f"Generated {md_spec_path}")

# PLAYWRIGHT PDF GENERATION FOR ALL 4 REPORTS
async def generate_pdfs():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        files_to_render = [
            ("01_Audiology_Evaluation_Report_Sample.html", "01_Audiology_Evaluation_Report_Sample.pdf"),
            ("02_Speech_and_Language_Assessment_Report_Sample.html", "02_Speech_and_Language_Assessment_Report_Sample.pdf"),
            ("03_Voice_Stuttering_and_Dysphagia_Report_Sample.html", "03_Voice_Stuttering_and_Dysphagia_Report_Sample.pdf"),
            ("04_Psychological_and_CBT_Assessment_Report_Sample.html", "04_Psychological_and_CBT_Assessment_Report_Sample.pdf")
        ]
        
        for html_name, pdf_name in files_to_render:
            h_path = os.path.join(target_dir, html_name)
            p_path = os.path.join(target_dir, pdf_name)
            page = await browser.new_page()
            await page.goto(f"file://{h_path}", wait_until="networkidle")
            await page.pdf(
                path=p_path,
                format="A4",
                print_background=True,
                margin={"top": "14mm", "bottom": "14mm", "left": "12mm", "right": "12mm"}
            )
            print(f"Generated PDF: {p_path}")
            await page.close()
            
        await browser.close()

asyncio.run(generate_pdfs())
print("All assessment report samples generated successfully!")
