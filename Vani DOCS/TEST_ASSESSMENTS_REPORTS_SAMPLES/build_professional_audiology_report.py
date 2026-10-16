import os
import asyncio
from playwright.async_api import async_playwright
import fitz

target_dir = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/TEST_ASSESSMENTS_REPORTS_SAMPLES"
os.makedirs(target_dir, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Hearing Loss & Audiology Assessment Report - Vani's Clinic</title>
<style>
    @page {
        size: A4;
        margin: 12mm 14mm 12mm 14mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html, body {
        height: 100%;
    }

    body {
        font-family: "Calibri", "Segoe UI", Arial, sans-serif;
        color: #0F172A;
        background-color: #FFFFFF;
        font-size: 8.5pt;
        line-height: 1.38;
        -webkit-print-color-adjust: exact;
    }

    /* FULL PAGE FLEXBOX TO PIN SIGNATURE FOOTER TO VERY BOTTOM */
    .page-container {
        min-height: 268mm;
        height: 268mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 0;
        box-sizing: border-box;
    }

    .main-body-content {
        flex: 1;
    }

    /* ELEGANT FORMAL HEADER BLOCK */
    .header-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
        margin-bottom: 8pt;
        border-bottom: 2px solid #0F172A;
        padding-bottom: 4pt;
    }
    .header-table td { vertical-align: middle; }
    
    .logo-badge {
        width: 46px;
        height: 46px;
        background: #0F172A;
        color: #FFFFFF;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20pt;
        font-weight: bold;
        font-family: Georgia, serif;
    }
    
    .doc-main-heading {
        text-align: center;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 15pt;
        font-weight: bold;
        color: #0F172A;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    .doc-sub-heading {
        text-align: center;
        font-size: 7.8pt;
        color: #0D9488;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin-top: 1pt;
    }

    .clinic-contact-block {
        text-align: right;
        font-size: 7.5pt;
        color: #334155;
        line-height: 1.25;
    }
    .clinic-contact-block strong {
        font-size: 8.5pt;
        color: #0F172A;
    }

    /* PATIENT CASE HISTORY & DEMOGRAPHICS GRID */
    .patient-box {
        border: 1.5px solid #0F172A;
        border-radius: 4px;
        margin-bottom: 10pt;
        background: #F8FAFC;
        overflow: hidden;
    }
    .patient-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
    }
    .patient-table td {
        padding: 4pt 7pt;
        border: 1px solid #CBD5E1;
        font-size: 8.2pt;
        vertical-align: top;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .patient-table .lbl {
        font-size: 6.8pt;
        color: #64748B;
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-bottom: 1.5pt;
        letter-spacing: 0.3px;
        white-space: nowrap;
    }
    .patient-table .val {
        font-weight: 600;
        color: #0F172A;
        font-size: 8.5pt;
        white-space: nowrap;
    }

    .section-title {
        font-family: Georgia, serif;
        font-size: 9pt;
        font-weight: 700;
        color: #0F172A;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1.5px solid #0F172A;
        padding-bottom: 1.5pt;
        margin-top: 8pt;
        margin-bottom: 5pt;
    }

    /* TWO-COLUMN AUDIOMETRY & IMMITTANCE GRID */
    .diagnostic-grid {
        display: flex;
        gap: 12pt;
        margin-bottom: 10pt;
    }
    .col-left {
        flex: 1;
    }
    .col-right {
        flex: 1.1;
    }

    /* AUDIOGRAM CARD */
    .audiogram-card {
        border: 1px solid #94A3B8;
        border-radius: 4px;
        padding: 6pt;
        background: #FFFFFF;
        text-align: center;
    }
    .audiogram-title {
        font-weight: 700;
        color: #0F172A;
        font-size: 8.2pt;
        margin-bottom: 5pt;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
    }

    /* FORMAL CLINICAL TABLES WITH NO WRAPPING ON HEADERS */
    .clinical-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
        margin-bottom: 8pt;
        font-size: 8pt;
    }
    .clinical-table th, .clinical-table td {
        border: 1px solid #94A3B8;
        padding: 3.5pt 5pt;
        text-align: center;
        vertical-align: middle;
    }
    .clinical-table th {
        background-color: #0F172A;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 7.2pt;
        text-transform: uppercase;
        white-space: nowrap;
        letter-spacing: 0.3px;
    }
    .clinical-table td.subhead {
        background-color: #F1F5F9;
        font-weight: 700;
        color: #334155;
        text-align: left;
        white-space: nowrap;
    }

    /* PTA PILL BADGES */
    .pill-grid {
        display: flex;
        gap: 4pt;
        margin-top: 5pt;
    }
    .pill-item {
        flex: 1;
        background: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 3px;
        padding: 3pt 2pt;
        text-align: center;
    }
    .pill-item .p-lbl { font-size: 6.2pt; color: #475569; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .pill-item .p-val { font-size: 8.2pt; color: #0F172A; font-weight: 700; margin-top: 1pt; white-space: nowrap; }

    .ear-red { color: #DC2626; font-weight: 700; }
    .ear-blue { color: #2563EB; font-weight: 700; }

    /* RESULTS & RECOMMENDATIONS */
    .info-block {
        margin-bottom: 6pt;
    }
    .info-block p {
        font-size: 8.2pt;
        color: #1E293B;
        line-height: 1.38;
        margin-bottom: 3pt;
    }
    .info-block ul {
        margin: 0 0 3pt 0;
        padding-left: 14pt;
    }
    .info-block li {
        font-size: 8.2pt;
        margin-bottom: 2.5pt;
        line-height: 1.38;
    }

    /* FORMAL PINNED FOOTER SIGNATURE BLOCK AT VERY BOTTOM */
    .pinned-bottom-footer {
        margin-top: auto;
        padding-top: 6pt;
        border-top: 1.5px solid #0F172A;
        width: 100%;
    }
    .footer-sig-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
    }
    .footer-sig-table td {
        vertical-align: bottom;
        font-size: 8pt;
    }
</style>
</head>
<body>

<div class="page-container">
    
    <div class="main-body-content">
        
        <!-- TOP FORMAL HEADER -->
        <table class="header-table">
            <tr>
                <td style="width: 8%;">
                    <div class="logo-badge">V</div>
                </td>
                <td style="width: 62%; text-align: center;">
                    <div class="doc-main-heading">Hearing Loss Assessment</div>
                    <div class="doc-sub-heading">Comprehensive Audiology & Hearing Conservation Record</div>
                </td>
                <td style="width: 30%; text-align: right;">
                    <div class="clinic-contact-block">
                        <strong>Vani's Speech & Hearing Clinic</strong><br>
                        7373 Radhika Road, Satara, MH 415001<br>
                        Tel: (02162) 289-889 • WhatsApp: +91 98220-XXXXX<br>
                        Email: contact@vanisclinic.in
                    </div>
                </td>
            </tr>
        </table>

        <!-- PATIENT CASE HISTORY & DEMOGRAPHICS TABLE -->
        <div class="patient-box">
            <table class="patient-table">
                <tr>
                    <td style="width: 25%;">
                        <span class="lbl">Patient (Last Name)</span>
                        <span class="val">More</span>
                    </td>
                    <td style="width: 25%;">
                        <span class="lbl">(First Name)</span>
                        <span class="val">Rahul</span>
                    </td>
                    <td style="width: 25%;">
                        <span class="lbl">UHID / Patient ID</span>
                        <span class="val">PGC-26-000104</span>
                    </td>
                    <td style="width: 25%;">
                        <span class="lbl">Date of Birth</span>
                        <span class="val">07/23/1968 (58 Yrs)</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="lbl">Address / Street</span>
                        <span class="val">125 Sadar Bazar, Powai Naka</span>
                    </td>
                    <td>
                        <span class="lbl">City / State</span>
                        <span class="val">Satara, Maharashtra</span>
                    </td>
                    <td>
                        <span class="lbl">Date of Service</span>
                        <span class="val">10/09/2026</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="lbl">Telephone / Mobile</span>
                        <span class="val">+91 98220-79870</span>
                    </td>
                    <td colspan="2">
                        <span class="lbl">Referred By</span>
                        <span class="val">Dr. S. K. Kulkarni, MS (ENT)</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- MAIN DIAGNOSTIC GRID: AUDIOGRAM + SPEECH & TYMPANOGRAMS -->
        <div class="diagnostic-grid">
            
            <!-- LEFT COLUMN: AUDIOGRAM GRAPH & PTA SUMMARY -->
            <div class="col-left">
                <div class="audiogram-card">
                    <div class="audiogram-title">Pure Tone Audiometry (Air & Bone Conduction)</div>
                    
                    <!-- SVG AUDIOGRAM GRAPH -->
                    <svg width="250" height="190" viewBox="0 0 270 215" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 3px;">
                        <!-- Vertical Frequency Lines -->
                        <line x1="35" y1="20" x2="35" y2="200" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="70" y1="20" x2="70" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="105" y1="20" x2="105" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="140" y1="20" x2="140" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="175" y1="20" x2="175" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="210" y1="20" x2="210" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="245" y1="20" x2="245" y2="200" stroke="#CBD5E1" stroke-width="1"/>

                        <!-- Horizontal dB Lines -->
                        <line x1="30" y1="35" x2="250" y2="35" stroke="#0F172A" stroke-width="1.2"/> <!-- 0 dB -->
                        <line x1="30" y1="50" x2="250" y2="50" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="65" x2="250" y2="65" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="80" x2="250" y2="80" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="95" x2="250" y2="95" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="110" x2="250" y2="110" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="125" x2="250" y2="125" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="140" x2="250" y2="140" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="155" x2="250" y2="155" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="170" x2="250" y2="170" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="185" x2="250" y2="185" stroke="#E2E8F0" stroke-width="1"/>

                        <!-- Frequency Labels -->
                        <text x="35" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">125</text>
                        <text x="70" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">250</text>
                        <text x="105" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">500</text>
                        <text x="140" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">1K</text>
                        <text x="175" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">2K</text>
                        <text x="210" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">4K</text>
                        <text x="245" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">8K</text>

                        <!-- dB Labels -->
                        <text x="24" y="38" font-size="7" text-anchor="end" fill="#64748B">0</text>
                        <text x="24" y="68" font-size="7" text-anchor="end" fill="#64748B">20</text>
                        <text x="24" y="98" font-size="7" text-anchor="end" fill="#64748B">40</text>
                        <text x="24" y="128" font-size="7" text-anchor="end" fill="#64748B">60</text>
                        <text x="24" y="158" font-size="7" text-anchor="end" fill="#64748B">80</text>
                        <text x="24" y="188" font-size="7" text-anchor="end" fill="#64748B">100</text>

                        <!-- RIGHT EAR (RED CIRCLES - O) -->
                        <polyline points="70,68 105,80 140,95 175,110 210,132.5 245,140" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="70" cy="68" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="105" cy="80" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="140" cy="95" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="175" cy="110" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="210" cy="132.5" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="245" cy="140" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>

                        <!-- LEFT EAR (BLUE CROSSES - X) -->
                        <polyline points="70,57.5 105,57.5 140,65 175,65 210,72.5 245,72.5" fill="none" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 66 53.5 L 74 61.5 M 74 53.5 L 66 61.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 101 53.5 L 109 61.5 M 109 53.5 L 101 61.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 136 61 L 144 69 M 144 61 L 136 69" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 171 61 L 179 69 M 179 61 L 171 69" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 206 68.5 L 214 76.5 M 214 68.5 L 206 76.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 241 68.5 L 249 76.5 M 249 68.5 L 241 76.5" stroke="#2563EB" stroke-width="2"/>

                        <!-- BONE CONDUCTION SYMBOLS -->
                        <path d="M 107 64 L 101 68 L 107 72" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                        <path d="M 142 83.5 L 136 87.5 L 142 91.5" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                        <path d="M 177 106 L 171 110 L 177 114" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                        
                        <path d="M 103 53.5 L 109 57.5 L 103 61.5" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                        <path d="M 138 61 L 144 65 L 138 69" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                        <path d="M 173 61 L 179 65 L 173 69" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                    </svg>

                    <div class="pill-grid">
                        <div class="pill-item">
                            <div class="p-lbl">Right PTA1</div>
                            <div class="p-val ear-red">48.3 dB</div>
                        </div>
                        <div class="pill-item">
                            <div class="p-lbl">Left PTA1</div>
                            <div class="p-val ear-blue">18.3 dB</div>
                        </div>
                        <div class="pill-item">
                            <div class="p-lbl">Right Degree</div>
                            <div class="p-val" style="color: #C2410C; font-size: 7.5pt;">Mod. SNHL</div>
                        </div>
                        <div class="pill-item">
                            <div class="p-lbl">Left Degree</div>
                            <div class="p-val" style="color: #15803D; font-size: 7.5pt;">Normal</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: SPEECH & TYMPANOGRAM TABLES -->
            <div class="col-right">
                
                <!-- SPEECH AUDIOMETRY & DISCRIMINATION TABLE -->
                <div style="font-weight: 700; color: #0F172A; font-size: 8pt; margin-bottom: 3pt; text-transform: uppercase;">Speech Audiometry & Discrimination</div>
                <table class="clinical-table">
                    <thead>
                        <tr>
                            <th style="width: 12%;">EAR</th>
                            <th style="width: 11%;">SAT</th>
                            <th style="width: 11%;">SRT</th>
                            <th style="width: 11%;">MASK</th>
                            <th style="width: 11%;">MCL</th>
                            <th style="width: 11%;">UCL</th>
                            <th style="width: 11%;">WR %</th>
                            <th style="width: 11%;">WR LVL</th>
                            <th style="width: 11%;">WR MSK</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="ear-red">Right</td>
                            <td>45</td>
                            <td>50</td>
                            <td>30</td>
                            <td>75</td>
                            <td>95</td>
                            <td>76%</td>
                            <td>80 dB</td>
                            <td>35 dB</td>
                        </tr>
                        <tr>
                            <td class="ear-blue">Left</td>
                            <td>15</td>
                            <td>20</td>
                            <td>-</td>
                            <td>50</td>
                            <td>100</td>
                            <td>96%</td>
                            <td>50 dB</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td class="subhead">Binaural</td>
                            <td>15</td>
                            <td>20</td>
                            <td>-</td>
                            <td>60</td>
                            <td>100</td>
                            <td>96%</td>
                            <td>50 dB</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>

                <!-- TYMPANOGRAMS & MIDDLE EAR IMMITTANCE TABLE -->
                <div style="font-weight: 700; color: #0F172A; font-size: 8pt; margin-bottom: 3pt; text-transform: uppercase;">Tympanograms & Middle Ear Immittance</div>
                <table class="clinical-table">
                    <thead>
                        <tr>
                            <th style="width: 32%;">PARAMETER</th>
                            <th style="width: 18%;">LEFT EAR</th>
                            <th style="width: 18%;">RIGHT EAR</th>
                            <th style="width: 32%;">CLINICAL NORM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="subhead">Tympanogram Type</td>
                            <td><strong style="color: #15803D;">Type A</strong></td>
                            <td><strong style="color: #15803D;">Type A</strong></td>
                            <td>Normal Peak</td>
                        </tr>
                        <tr>
                            <td class="subhead">Peak Pressure (daPa)</td>
                            <td>-11 daPa</td>
                            <td>-24 daPa</td>
                            <td>-100 to +50 daPa</td>
                        </tr>
                        <tr>
                            <td class="subhead">Static Compliance (ml)</td>
                            <td>0.87 ml</td>
                            <td>0.69 ml</td>
                            <td>0.3 to 1.6 ml</td>
                        </tr>
                        <tr>
                            <td class="subhead">Ear Canal Volume (ml)</td>
                            <td>1.1 ml</td>
                            <td>1.7 ml</td>
                            <td>0.6 to 2.0 ml</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <!-- SPECIAL DIAGNOSTIC TESTS TABLE (OAE, TUNING FORK, TINNITUS) -->
        <div style="font-weight: 700; color: #0F172A; font-size: 8pt; margin-bottom: 3pt; text-transform: uppercase;">OAE Screening, Tuning Fork & Tinnitus Evaluation</div>
        <table class="clinical-table" style="margin-bottom: 10pt;">
            <thead>
                <tr>
                    <th style="width: 33%;">OAE SCREENING (TEOAE / DPOAE)</th>
                    <th style="width: 33%;">TUNING FORK TESTS (512 Hz)</th>
                    <th style="width: 34%;">TINNITUS EVALUATION (THI / TRT)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align: left; padding: 4pt 8pt;">
                        • Right Ear: <strong style="color: #B91C1C;">REFER (High Freq Deficit)</strong><br>
                        • Left Ear: <strong style="color: #15803D;">PASS (Robust Outer Hair Cell)</strong>
                    </td>
                    <td style="text-align: left; padding: 4pt 8pt;">
                        • Rinne Test: <strong>Positive (+ve) Bilaterally</strong><br>
                        • Weber Test: <strong>Lateralizes to Left Ear</strong>
                    </td>
                    <td style="text-align: left; padding: 4pt 8pt;">
                        • THI Score: <strong>46 / 100 (Grade III Moderate)</strong><br>
                        • TFI Score: <strong>52.4 / 100</strong> | TRT: <strong>Category 2</strong>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- RESULTS SECTION -->
        <div class="info-block">
            <div class="section-title">Diagnostic Results & Clinical Impression</div>
            <p>• Patient presents with a <strong>unilateral moderate sensorineural hearing loss in the Right Ear</strong> (PTA1: 48.3 dB HL, sloping high-frequency configuration) and <strong>normal hearing sensitivity in the Left Ear</strong> (PTA1: 18.3 dB HL).</p>
            <p>• Immittance testing revealed <strong>Type A tympanograms in both ears</strong>, which are consistent with normal middle ear pressure, normal tympanic membrane mobility, and intact eustachian tube function.</p>
            <p>• Word Recognition Score (WRS) is <strong>76% in the Right Ear</strong> at 80 dB HL presentation level and <strong>96% in the Left Ear</strong> at 50 dB HL. Otoacoustic Emissions (DPOAE) confirmed high-frequency outer hair cell dysfunction in the Right Ear.</p>
        </div>

        <!-- RECOMMENDATIONS SECTION -->
        <div class="info-block">
            <div class="section-title">Clinical Recommendations</div>
            <ul>
                <li><strong>Hearing Aid Trial</strong>: Pursue a trial with digital amplification (Receiver-in-Canal RIC Hearing Aid with built-in Tinnitus Sound Generator TSG) for the Right Ear for improved hearing clarity, speech understanding, and prevention of auditory deprivation.</li>
                <li><strong>Communication Strategies</strong>: Utilize communication strategies for improving speech understanding (i.e. face the speaker, engage in face-to-face communication, reduce background environmental noise, enhance room lighting).</li>
                <li><strong>Tinnitus Retraining Therapy (TRT)</strong>: Initiate sound therapy counseling and habituation protocols for Right Ear tinnitus management.</li>
                <li><strong>Follow-up</strong>: Schedule an annual audiological re-evaluation in 12 months or sooner if any sudden change in hearing is experienced.</li>
            </ul>
        </div>

    </div>

    <!-- PINNED FORMAL FOOTER SIGNATURE BLOCK FLUSH AT VERY BOTTOM MARGIN -->
    <div class="pinned-bottom-footer">
        <table class="footer-sig-table">
            <tr>
                <td style="width: 45%;">
                    <strong style="color: #0F172A; font-size: 8.5pt; text-transform: uppercase;">Vani's Clinic Audiology Dept</strong><br>
                    <span style="font-size: 7.5pt; color: #475569;">Official Stamped Bilateral Clinical Record</span>
                </td>
                <td style="width: 55%; text-align: right;">
                    <div style="margin-bottom: 12pt; font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 15pt; color: #0F172A;">
                        Palak P. Gandhi
                    </div>
                    <div>
                        <strong>Signature:</strong> ____________________________________________<br>
                        <strong>Print Name:</strong> Ms. Palak Paresh Gandhi, BASLP<br>
                        <strong>Lic. No:</strong> RCI Reg. No. AXXXXX &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Date:</strong> 10/09/2026
                    </div>
                </td>
            </tr>
        </table>
    </div>

</div>

</body>
</html>
"""

aud_html_path = os.path.join(target_dir, "01_Audiology_Evaluation_Report_Sample.html")
with open(aud_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated professional single-page visual Audiology report: {aud_html_path}")

async def render_pdf():
    pdf_path = os.path.join(target_dir, "01_Audiology_Evaluation_Report_Sample.pdf")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"file://{aud_html_path}", wait_until="networkidle")
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "14mm", "right": "14mm"}
        )
        await browser.close()

    doc = fitz.open(pdf_path)
    print(f"Generated PDF: {pdf_path} (Total Pages: {len(doc)})")

asyncio.run(render_pdf())
