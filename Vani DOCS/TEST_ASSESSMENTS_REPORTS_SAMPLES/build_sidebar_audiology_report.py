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
        margin: 0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html, body {
        height: 100%;
        background-color: #FFFFFF;
        font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
        color: #0F172A;
        font-size: 7.8pt;
        line-height: 1.32;
        -webkit-print-color-adjust: exact;
    }

    /* MASTER A4 PAGE LAYOUT WITH COLORED HEADER & BOTTOM BARS */
    .page-wrapper {
        width: 210mm;
        min-height: 297mm;
        height: 297mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 auto;
        background: #FFFFFF;
        position: relative;
        overflow: hidden;
    }

    /* COLORED TOP HEADER BAR */
    .colored-header-bar {
        background: linear-gradient(135deg, #0F172A 0%, #0D9488 100%);
        color: #FFFFFF;
        padding: 8pt 14mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    .header-logo-group {
        display: flex;
        align-items: center;
        gap: 8pt;
    }
    .logo-badge {
        width: 38px;
        height: 38px;
        background: #FFFFFF;
        color: #0F172A;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18pt;
        font-weight: bold;
        font-family: Georgia, serif;
    }
    .clinic-title-text {
        font-family: Georgia, serif;
        font-size: 13.5pt;
        font-weight: bold;
        color: #FFFFFF;
        letter-spacing: 0.5px;
    }
    .clinic-sub-text {
        font-size: 7pt;
        color: #CCFBF1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .header-doc-title {
        text-align: right;
    }
    .header-doc-title h1 {
        font-size: 13pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #FFFFFF;
    }
    .header-doc-title p {
        font-size: 7pt;
        color: #99F6E4;
        text-transform: uppercase;
    }

    /* MAIN CONTAINER: SIDEBAR (LEFT) + REPORT BODY (RIGHT) */
    .main-layout {
        display: flex;
        flex: 1;
        padding: 8pt 14mm 6pt 14mm;
        gap: 10pt;
    }

    /* BILINGUAL SIDEBAR (IMAGE 3 MATCH) */
    .sidebar-container {
        width: 21%;
        background-color: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 5px;
        padding: 5pt 4pt;
        font-size: 6.8pt;
        line-height: 1.22;
    }
    .sidebar-header {
        background-color: #0F172A;
        color: #FFFFFF;
        text-align: center;
        padding: 3pt 2pt;
        font-weight: 700;
        font-size: 7.8pt;
        border-radius: 3px;
        margin-bottom: 4pt;
    }
    .dept-title {
        color: #0D9488;
        font-weight: 700;
        font-size: 7pt;
        border-bottom: 1px solid #CBD5E1;
        padding-bottom: 1pt;
        margin-top: 4pt;
        margin-bottom: 2pt;
        text-transform: uppercase;
    }
    .service-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .service-list li {
        margin-bottom: 2.5pt;
        color: #334155;
        border-bottom: 1px dashed #E2E8F0;
        padding-bottom: 1.5pt;
    }
    .service-list li strong {
        color: #0F172A;
    }

    /* RIGHT BODY AREA */
    .body-container {
        width: 79%;
    }

    /* PATIENT METADATA BOX */
    .patient-box {
        border: 1.5px solid #0F172A;
        border-radius: 4px;
        margin-bottom: 6pt;
        background: #F8FAFC;
        overflow: hidden;
    }
    .patient-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
    }
    .patient-table td {
        padding: 3pt 5pt;
        border: 1px solid #CBD5E1;
        font-size: 7.5pt;
        vertical-align: top;
        white-space: nowrap;
    }
    .patient-table .lbl {
        font-size: 6.2pt;
        color: #64748B;
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-bottom: 1pt;
    }
    .patient-table .val {
        font-weight: 600;
        color: #0F172A;
        font-size: 8pt;
    }

    .section-title {
        font-family: Georgia, serif;
        font-size: 8.5pt;
        font-weight: 700;
        color: #0F172A;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        border-bottom: 1.5px solid #0D9488;
        padding-bottom: 1pt;
        margin-top: 5pt;
        margin-bottom: 4pt;
    }

    /* DIAGNOSTIC GRID */
    .diagnostic-grid {
        display: flex;
        gap: 8pt;
        margin-bottom: 6pt;
    }
    .col-left { flex: 1; }
    .col-right { flex: 1.05; }

    /* AUDIOGRAM CARD WITH SUMMARY PILLS (IMAGE 1 MATCH) */
    .audiogram-card {
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 4pt;
        background: #FFFFFF;
        text-align: center;
    }
    .audiogram-title {
        font-weight: 700;
        color: #0F172A;
        font-size: 7.8pt;
        margin-bottom: 3pt;
        text-transform: uppercase;
    }
    .pill-grid {
        display: flex;
        gap: 3pt;
        margin-top: 4pt;
    }
    .pill-item {
        flex: 1;
        background: #F0FDFA;
        border: 1px solid #99F6E4;
        border-radius: 3px;
        padding: 2.5pt 1pt;
        text-align: center;
    }
    .pill-item .p-lbl { font-size: 5.8pt; color: #0F766E; font-weight: 700; text-transform: uppercase; }
    .pill-item .p-val { font-size: 7.8pt; color: #0F172A; font-weight: 700; margin-top: 1pt; }

    .ear-red { color: #DC2626; font-weight: 700; }
    .ear-blue { color: #2563EB; font-weight: 700; }

    /* CLINICAL TABLES (IMAGE 2 MATCH) */
    .clinical-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
        margin-bottom: 5pt;
        font-size: 7.5pt;
    }
    .clinical-table th, .clinical-table td {
        border: 1px solid #94A3B8;
        padding: 2.8pt 3.5pt;
        text-align: center;
        vertical-align: middle;
        word-break: break-word;
    }
    .clinical-table th {
        background-color: #0F172A;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 6.8pt;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .clinical-table td.subhead {
        background-color: #F1F5F9;
        font-weight: 700;
        color: #334155;
        text-align: left;
        white-space: nowrap;
    }

    /* RESULTS & RECOMMENDATIONS */
    .info-block p {
        font-size: 7.6pt;
        color: #1E293B;
        line-height: 1.3;
        margin-bottom: 2.5pt;
    }
    .info-block ul {
        margin: 0 0 2.5pt 0;
        padding-left: 12pt;
    }
    .info-block li {
        font-size: 7.6pt;
        margin-bottom: 2pt;
        line-height: 1.3;
    }

    /* FOOTER SIGNATURE BLOCK */
    .sig-section {
        margin-top: 6pt;
        border-top: 1px solid #CBD5E1;
        padding-top: 4pt;
    }
    .footer-sig-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
    }
    .footer-sig-table td {
        vertical-align: bottom;
        font-size: 7.5pt;
    }

    /* COLORED BOTTOM FOOTER BAR */
    .colored-footer-bar {
        background: linear-gradient(135deg, #0F172A 0%, #0D9488 100%);
        color: #FFFFFF;
        padding: 5pt 14mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 7pt;
        letter-spacing: 0.5px;
        font-weight: 600;
    }
</style>
</head>
<body>

<div class="page-wrapper">
    
    <!-- COLORED TOP HEADER BAR -->
    <div class="colored-header-bar">
        <div class="header-logo-group">
            <div class="logo-badge">V</div>
            <div>
                <div class="clinic-title-text">Vani's Speech & Hearing Clinic</div>
                <div class="clinic-sub-text">Satara • Tel: (02162) 289-889 • WhatsApp: +91 98220-XXXXX</div>
            </div>
        </div>
        <div class="header-doc-title">
            <h1>Hearing Loss Assessment</h1>
            <p>Comprehensive Audiology Record</p>
        </div>
    </div>

    <!-- MAIN LAYOUT: SIDEBAR (LEFT) + BODY (RIGHT) -->
    <div class="main-layout">
        
        <!-- BILINGUAL CLINIC SERVICES SIDEBAR (MATCHING IMAGE 3) -->
        <div class="sidebar-container">
            <div class="sidebar-header">उपलब्ध सुविधा</div>
            
            <div class="dept-title">श्रवण विभाग (Audiology)</div>
            <ul class="service-list">
                <li>• <strong>ऑडिओमेट्री</strong> (Audiometry)</li>
                <li>• <strong>टायाम्पॅनोमेट्री</strong> (Tympanometry)</li>
                <li>• <strong>OAE</strong> (Otoacoustic Emissions)</li>
                <li>• <strong>BERA</strong> (Brainstem Audiometry)</li>
                <li>• <strong>Hearing Aid Selection</strong> & Fitting</li>
                <li>• <strong>Cochlear Implant</strong> Mapping</li>
                <li>• <strong>Auditory Verbal Therapy</strong></li>
                <li>• <strong>Ear Mould</strong> & Protection</li>
            </ul>

            <div class="dept-title">वाचा विभाग (Speech/Lang)</div>
            <ul class="service-list">
                <li>• <strong>वाचा विलंब</strong> (Speech Delay)</li>
                <li>• <strong>तोतरेपणा</strong> (Stuttering)</li>
                <li>• <strong>ऑटिझम & ADHD</strong> Therapy</li>
                <li>• <strong>न्यूरोजेनिक अडचणी</strong> (Stroke)</li>
                <li>• <strong>आवाज विकार</strong> (Voice)</li>
                <li>• <strong>गिळण्याच्या अडचणी</strong> (Dysphagia)</li>
            </ul>

            <div class="dept-title">संतुलन विभाग (Vestibular)</div>
            <ul class="service-list">
                <li>• <strong>चक्कर & संतुलन</strong> (Vertigo)</li>
                <li>• <strong>व्हस्टिब्युलर थेरपी</strong> (VRT)</li>
                <li>• <strong>पडणे प्रतिबंधक व्यायाम</strong></li>
            </ul>
        </div>

        <!-- RIGHT REPORT BODY CONTENT -->
        <div class="body-container">
            
            <!-- PATIENT METADATA BOX -->
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

            <!-- DIAGNOSTIC GRID: AUDIOGRAM (LEFT) + SPEECH/TYMP (RIGHT) -->
            <div class="diagnostic-grid">
                
                <!-- AUDIOGRAM GRAPH & SUMMARY PILLS (IMAGE 1 MATCH) -->
                <div class="col-left">
                    <div class="audiogram-card">
                        <div class="audiogram-title">Puretone Audiometry (Air & Bone)</div>
                        
                        <svg width="220" height="165" viewBox="0 0 270 215" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 3px;">
                            <!-- Grid lines -->
                            <line x1="35" y1="20" x2="35" y2="200" stroke="#E2E8F0" stroke-width="1"/>
                            <line x1="70" y1="20" x2="70" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                            <line x1="105" y1="20" x2="105" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                            <line x1="140" y1="20" x2="140" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                            <line x1="175" y1="20" x2="175" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                            <line x1="210" y1="20" x2="210" y2="200" stroke="#CBD5E1" stroke-width="1"/>
                            <line x1="245" y1="20" x2="245" y2="200" stroke="#CBD5E1" stroke-width="1"/>

                            <line x1="30" y1="35" x2="250" y2="35" stroke="#0F172A" stroke-width="1.2"/>
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

                            <!-- Frequency labels -->
                            <text x="35" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">125</text>
                            <text x="70" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">250</text>
                            <text x="105" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">500</text>
                            <text x="140" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">1K</text>
                            <text x="175" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">2K</text>
                            <text x="210" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">4K</text>
                            <text x="245" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">8K</text>

                            <!-- Right Ear (Red Circles O) -->
                            <polyline points="70,68 105,80 140,95 175,110 210,132.5 245,140" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="70" cy="68" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="105" cy="80" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="140" cy="95" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="175" cy="110" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="210" cy="132.5" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>
                            <circle cx="245" cy="140" r="3.8" fill="none" stroke="#DC2626" stroke-width="2"/>

                            <!-- Left Ear (Blue Crosses X) -->
                            <polyline points="70,57.5 105,57.5 140,65 175,65 210,72.5 245,72.5" fill="none" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 66 53.5 L 74 61.5 M 74 53.5 L 66 61.5" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 101 53.5 L 109 61.5 M 109 53.5 L 101 61.5" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 136 61 L 144 69 M 144 61 L 136 69" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 171 61 L 179 69 M 179 61 L 171 69" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 206 68.5 L 214 76.5 M 214 68.5 L 206 76.5" stroke="#2563EB" stroke-width="2"/>
                            <path d="M 241 68.5 L 249 76.5 M 249 68.5 L 241 76.5" stroke="#2563EB" stroke-width="2"/>

                            <!-- Bone Conduction (< and >) -->
                            <path d="M 107 64 L 101 68 L 107 72" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                            <path d="M 142 83.5 L 136 87.5 L 142 91.5" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                            <path d="M 177 106 L 171 110 L 177 114" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                            
                            <path d="M 103 53.5 L 109 57.5 L 103 61.5" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                            <path d="M 138 61 L 144 65 L 138 69" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                            <path d="M 173 61 L 179 65 L 173 69" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                        </svg>

                        <!-- SUMMARY PILLS BELOW GRAPH (IMAGE 1 MATCH) -->
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
                                <div class="p-val" style="color: #C2410C; font-size: 7.2pt;">Mod. SNHL</div>
                            </div>
                            <div class="pill-item">
                                <div class="p-lbl">Left Degree</div>
                                <div class="p-val" style="color: #15803D; font-size: 7.2pt;">Normal</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: HORIZONTAL CLINICAL PARAMETERS TABLE (IMAGE 2 MATCH) -->
                <div class="col-right">
                    
                    <div style="font-weight: 700; color: #0F172A; font-size: 7.8pt; margin-bottom: 2pt; text-transform: uppercase;">Audiometric Parameters & Tuning Fork</div>
                    <table class="clinical-table">
                        <thead>
                            <tr>
                                <th style="width: 18%;">EAR</th>
                                <th style="width: 10%;">PTA1</th>
                                <th style="width: 10%;">PTA2</th>
                                <th style="width: 10%;">SDT</th>
                                <th style="width: 10%;">SRT</th>
                                <th style="width: 14%;">WRS %</th>
                                <th style="width: 10%;">MCL</th>
                                <th style="width: 10%;">UCL</th>
                                <th style="width: 9%;">RINNE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="ear-red">Right Ear</td>
                                <td>48.3</td>
                                <td>52.5</td>
                                <td>45</td>
                                <td>50</td>
                                <td>76%</td>
                                <td>75</td>
                                <td>95</td>
                                <td>+ve</td>
                            </tr>
                            <tr>
                                <td class="ear-blue">Left Ear</td>
                                <td>18.3</td>
                                <td>20.0</td>
                                <td>15</td>
                                <td>20</td>
                                <td>96%</td>
                                <td>50</td>
                                <td>100</td>
                                <td>+ve</td>
                            </tr>
                            <tr>
                                <td class="subhead" colspan="8">Weber Tuning Fork Test (512 Hz)</td>
                                <td style="font-weight: bold; color: #0F172A;">Left ➔</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- TYMPANOGRAMS & MIDDLE EAR IMPEDANCE TABLE -->
                    <div style="font-weight: 700; color: #0F172A; font-size: 7.8pt; margin-bottom: 2pt; text-transform: uppercase;">Tympanograms & Immittance</div>
                    <table class="clinical-table">
                        <thead>
                            <tr>
                                <th style="width: 34%;">PARAMETER</th>
                                <th style="width: 18%;">LEFT EAR</th>
                                <th style="width: 18%;">RIGHT EAR</th>
                                <th style="width: 30%;">NORM</th>
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
                                <td>-100 to +50</td>
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

            <!-- SPECIAL TESTS TABLE (OAE & TINNITUS) -->
            <table class="clinical-table" style="margin-bottom: 5pt;">
                <thead>
                    <tr>
                        <th style="width: 50%;">OAE SCREENING (TEOAE / DPOAE)</th>
                        <th style="width: 50%;">TINNITUS EVALUATION (THI / TRT)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: left; padding: 3pt 6pt;">
                            • Right Ear: <strong style="color: #B91C1C;">REFER (High Freq Deficit)</strong><br>
                            • Left Ear: <strong style="color: #15803D;">PASS (Robust Outer Hair Cell)</strong>
                        </td>
                        <td style="text-align: left; padding: 3pt 6pt;">
                            • THI Score: <strong>46 / 100 (Grade III Moderate)</strong><br>
                            • TFI: <strong>52.4 / 100</strong> | TRT Category: <strong>Category 2</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- DIAGNOSTIC RESULTS -->
            <div class="info-block">
                <div class="section-title">Diagnostic Results & Clinical Impression</div>
                <p>• Patient presents with a <strong>unilateral moderate sensorineural hearing loss in the Right Ear</strong> (PTA1: 48.3 dB HL, sloping high-frequency configuration) and <strong>normal hearing sensitivity in the Left Ear</strong> (PTA1: 18.3 dB HL).</p>
                <p>• Immittance testing revealed <strong>Type A tympanograms in both ears</strong>, consistent with normal middle ear pressure, normal tympanic membrane mobility, and intact eustachian tube function.</p>
                <p>• Word Recognition Score (WRS) is <strong>76% in the Right Ear</strong> at 80 dB HL presentation level and <strong>96% in the Left Ear</strong> at 50 dB HL. DPOAE confirmed high-frequency outer hair cell dysfunction in the Right Ear.</p>
            </div>

            <!-- RECOMMENDATIONS -->
            <div class="info-block">
                <div class="section-title">Clinical Recommendations</div>
                <ul>
                    <li><strong>Hearing Aid Trial</strong>: Pursue a trial with digital amplification (Receiver-in-Canal RIC Hearing Aid with Tinnitus Sound Generator TSG) for the Right Ear for improved hearing clarity and speech understanding.</li>
                    <li><strong>Communication Strategies</strong>: Face the speaker, engage in face-to-face communication, reduce background noise.</li>
                    <li><strong>Tinnitus Retraining Therapy (TRT)</strong>: Initiate sound therapy counseling and habituation protocols for Right Ear tinnitus.</li>
                    <li><strong>Follow-up</strong>: Schedule an annual audiological re-evaluation in 12 months.</li>
                </ul>
            </div>

            <!-- SIGNATURE SECTION -->
            <div class="sig-section">
                <table class="footer-sig-table">
                    <tr>
                        <td style="width: 45%;">
                            <strong style="color: #0F172A; font-size: 8pt; text-transform: uppercase;">Vani's Clinic Audiology Dept</strong><br>
                            <span style="font-size: 7pt; color: #475569;">Official Stamped Bilateral Clinical Record</span>
                        </td>
                        <td style="width: 55%; text-align: right;">
                            <div style="margin-bottom: 10pt; font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 14pt; color: #0F172A;">
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

    </div>

    <!-- COLORED BOTTOM FOOTER BAR -->
    <div class="colored-footer-bar">
        <span>VANI'S SPEECH & HEARING CLINIC • OFFICIAL BILATERAL AUDIOLOGY RECORD</span>
        <span>STRICTLY CONFIDENTIAL • RCI REG. PRACTICE</span>
    </div>

</div>

</body>
</html>
"""

aud_html_path = os.path.join(target_dir, "01_Audiology_Evaluation_Report_Sample.html")
with open(aud_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated single-page sidebar visual Audiology report: {aud_html_path}")

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
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        await browser.close()

    doc = fitz.open(pdf_path)
    print(f"Generated PDF: {pdf_path} (Total Pages: {len(doc)})")

asyncio.run(render_pdf())
