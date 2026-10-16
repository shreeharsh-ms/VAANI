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
        font-family: "Calibri", "Segoe UI", Arial, sans-serif;
        color: #0F172A;
        font-size: 8pt;
        line-height: 1.32;
        -webkit-print-color-adjust: exact;
    }

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
        padding: 7pt 12mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.12);
    }
    .header-logo-group {
        display: flex;
        align-items: center;
        gap: 8pt;
    }
    .logo-badge {
        width: 36px;
        height: 36px;
        background: #FFFFFF;
        color: #0F172A;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16pt;
        font-weight: bold;
        font-family: Georgia, serif;
    }
    .clinic-title-text {
        font-family: Georgia, serif;
        font-size: 13pt;
        font-weight: bold;
        color: #FFFFFF;
        letter-spacing: 0.5px;
    }
    .clinic-sub-text {
        font-size: 6.8pt;
        color: #CCFBF1;
        text-transform: uppercase;
        letter-spacing: 0.4px;
    }
    .header-doc-title { text-align: right; }
    .header-doc-title h1 {
        font-size: 12.5pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #FFFFFF;
    }
    .header-doc-title p {
        font-size: 6.8pt;
        color: #99F6E4;
        text-transform: uppercase;
    }

    /* MAIN LAYOUT: BILINGUAL SIDEBAR (LEFT) + REPORT BODY (RIGHT) */
    .main-layout {
        display: flex;
        flex: 1;
        padding: 6pt 12mm 4pt 12mm;
        gap: 9pt;
    }

    /* BILINGUAL CLINIC SERVICES SIDEBAR */
    .sidebar-container {
        width: 20%;
        background-color: #F8FAFC;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 4pt 4pt;
        font-size: 6.5pt;
        line-height: 1.2;
    }
    .sidebar-header {
        background-color: #0F172A;
        color: #FFFFFF;
        text-align: center;
        padding: 2.5pt 2pt;
        font-weight: 700;
        font-size: 7.5pt;
        border-radius: 3px;
        margin-bottom: 3pt;
    }
    .dept-title {
        color: #0D9488;
        font-weight: 700;
        font-size: 6.8pt;
        border-bottom: 1px solid #CBD5E1;
        padding-bottom: 1pt;
        margin-top: 3pt;
        margin-bottom: 2pt;
        text-transform: uppercase;
    }
    .service-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .service-list li {
        margin-bottom: 2pt;
        color: #334155;
        border-bottom: 1px dashed #E2E8F0;
        padding-bottom: 1pt;
    }
    .service-list li strong { color: #0F172A; }

    /* RIGHT BODY AREA */
    .body-container {
        width: 80%;
    }

    /* PATIENT METADATA BOX */
    .patient-box {
        border: 1.5px solid #0F172A;
        border-radius: 4px;
        margin-bottom: 5pt;
        background: #F8FAFC;
        overflow: hidden;
    }
    .patient-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
    }
    .patient-table td {
        padding: 2.8pt 5pt;
        border: 1px solid #CBD5E1;
        font-size: 7.5pt;
        vertical-align: top;
        white-space: nowrap;
    }
    .patient-table .lbl {
        font-size: 6pt;
        color: #64748B;
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-bottom: 1pt;
    }
    .patient-table .val {
        font-weight: 600;
        color: #0F172A;
        font-size: 7.8pt;
    }

    .section-title {
        font-family: Georgia, serif;
        font-size: 8.2pt;
        font-weight: 700;
        color: #0F172A;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        border-bottom: 1.5px solid #0D9488;
        padding-bottom: 1pt;
        margin-top: 4pt;
        margin-bottom: 3pt;
    }

    /* TWO SEPARATE AUDIOGRAM GRAPHS SIDE-BY-SIDE (RIGHT EAR & LEFT EAR) */
    .dual-audiogram-container {
        display: flex;
        gap: 8pt;
        margin-bottom: 5pt;
    }
    .audiogram-box {
        flex: 1;
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 4pt;
        background: #FFFFFF;
        text-align: center;
    }
    .audiogram-box-title {
        font-weight: 700;
        font-size: 7.8pt;
        margin-bottom: 3pt;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    /* FULL-WIDTH CLINICAL TABLES WITH ZERO TEXT WRAPPING ON NUMBERS */
    .full-clinical-table {
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse;
        margin-bottom: 5pt;
        font-size: 7.5pt;
    }
    .full-clinical-table th, .full-clinical-table td {
        border: 1px solid #94A3B8;
        padding: 2.8pt 3.5pt;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .full-clinical-table th {
        background-color: #0F172A;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 6.8pt;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .full-clinical-table td.subhead {
        background-color: #F1F5F9;
        font-weight: 700;
        color: #334155;
        text-align: left;
        white-space: nowrap;
    }

    .ear-red { color: #DC2626; font-weight: 700; }
    .ear-blue { color: #2563EB; font-weight: 700; }

    /* SUMMARY BADGE PILLS */
    .summary-badge {
        font-size: 7pt;
        font-weight: 700;
        padding: 1.5pt 4pt;
        border-radius: 3px;
        display: inline-block;
    }
    .badge-red { background-color: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; }
    .badge-blue { background-color: #DBEAFE; color: #1D4ED8; border: 1px solid #93C5FD; }

    /* RESULTS & RECOMMENDATIONS */
    .info-block p {
        font-size: 7.5pt;
        color: #1E293B;
        line-height: 1.28;
        margin-bottom: 2pt;
    }
    .info-block ul {
        margin: 0 0 2pt 0;
        padding-left: 12pt;
    }
    .info-block li {
        font-size: 7.5pt;
        margin-bottom: 1.5pt;
        line-height: 1.28;
    }

    /* SIGNATURE FOOTER AREA */
    .sig-section {
        margin-top: 5pt;
        border-top: 1px solid #CBD5E1;
        padding-top: 3pt;
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
        padding: 4pt 12mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 6.8pt;
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
        
        <!-- BILINGUAL CLINIC SERVICES SIDEBAR -->
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

            <!-- TWO SEPARATE AUDIOGRAM GRAPHS SIDE-BY-SIDE (RIGHT EAR & LEFT EAR) -->
            <div class="section-title">Pure Tone Audiometry (Air & Bone Conduction)</div>
            <div class="dual-audiogram-container">
                
                <!-- 1. RIGHT EAR AUDIOGRAM GRAPH (RED) -->
                <div class="audiogram-box">
                    <div class="audiogram-box-title ear-red">Right Ear Audiogram (Red)</div>
                    <svg width="210" height="135" viewBox="0 0 270 175" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 3px;">
                        <line x1="35" y1="20" x2="35" y2="160" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="70" y1="20" x2="70" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="105" y1="20" x2="105" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="140" y1="20" x2="140" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="175" y1="20" x2="175" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="210" y1="20" x2="210" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="245" y1="20" x2="245" y2="160" stroke="#CBD5E1" stroke-width="1"/>

                        <line x1="30" y1="30" x2="250" y2="30" stroke="#0F172A" stroke-width="1.2"/> <!-- 0 dB -->
                        <line x1="30" y1="52" x2="250" y2="52" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="74" x2="250" y2="74" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="96" x2="250" y2="96" stroke="#E2E8F0" stroke-width="1"/> <!-- 40 dB -->
                        <line x1="30" y1="118" x2="250" y2="118" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="140" x2="250" y2="140" stroke="#E2E8F0" stroke-width="1"/>

                        <text x="35" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">125</text>
                        <text x="70" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">250</text>
                        <text x="105" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">500</text>
                        <text x="140" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">1K</text>
                        <text x="175" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">2K</text>
                        <text x="210" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">4K</text>
                        <text x="245" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">8K</text>

                        <text x="24" y="33" font-size="7" text-anchor="end" fill="#64748B">0</text>
                        <text x="24" y="55" font-size="7" text-anchor="end" fill="#64748B">20</text>
                        <text x="24" y="77" font-size="7" text-anchor="end" fill="#64748B">40</text>
                        <text x="24" y="99" font-size="7" text-anchor="end" fill="#64748B">60</text>
                        <text x="24" y="121" font-size="7" text-anchor="end" fill="#64748B">80</text>
                        <text x="24" y="143" font-size="7" text-anchor="end" fill="#64748B">100</text>

                        <!-- Right AC line (Red circles O) -->
                        <polyline points="70,57.5 105,68.5 140,79.5 175,90.5 210,107 245,112.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="70" cy="57.5" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="105" cy="68.5" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="140" cy="79.5" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="175" cy="90.5" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="210" cy="107" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>
                        <circle cx="245" cy="112.5" r="3.5" fill="none" stroke="#DC2626" stroke-width="2"/>

                        <!-- Right BC (<) -->
                        <path d="M 107 54 L 101 57.5 L 107 61" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                        <path d="M 142 71 L 136 74.5 L 142 78" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                        <path d="M 177 87 L 171 90.5 L 177 94" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                    </svg>
                    <div style="margin-top: 3pt;">
                        <span class="summary-badge badge-red">Right PTA1: 48.3 dB HL (Moderate SNHL)</span>
                    </div>
                </div>

                <!-- 2. LEFT EAR AUDIOGRAM GRAPH (BLUE) -->
                <div class="audiogram-box">
                    <div class="audiogram-box-title ear-blue">Left Ear Audiogram (Blue)</div>
                    <svg width="210" height="135" viewBox="0 0 270 175" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 3px;">
                        <line x1="35" y1="20" x2="35" y2="160" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="70" y1="20" x2="70" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="105" y1="20" x2="105" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="140" y1="20" x2="140" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="175" y1="20" x2="175" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="210" y1="20" x2="210" y2="160" stroke="#CBD5E1" stroke-width="1"/>
                        <line x1="245" y1="20" x2="245" y2="160" stroke="#CBD5E1" stroke-width="1"/>

                        <line x1="30" y1="30" x2="250" y2="30" stroke="#0F172A" stroke-width="1.2"/>
                        <line x1="30" y1="52" x2="250" y2="52" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="74" x2="250" y2="74" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="96" x2="250" y2="96" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="118" x2="250" y2="118" stroke="#E2E8F0" stroke-width="1"/>
                        <line x1="30" y1="140" x2="250" y2="140" stroke="#E2E8F0" stroke-width="1"/>

                        <text x="35" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">125</text>
                        <text x="70" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">250</text>
                        <text x="105" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">500</text>
                        <text x="140" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">1K</text>
                        <text x="175" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">2K</text>
                        <text x="210" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">4K</text>
                        <text x="245" y="14" font-size="7.5" text-anchor="middle" fill="#475569" font-weight="bold">8K</text>

                        <text x="24" y="33" font-size="7" text-anchor="end" fill="#64748B">0</text>
                        <text x="24" y="55" font-size="7" text-anchor="end" fill="#64748B">20</text>
                        <text x="24" y="77" font-size="7" text-anchor="end" fill="#64748B">40</text>
                        <text x="24" y="99" font-size="7" text-anchor="end" fill="#64748B">60</text>
                        <text x="24" y="121" font-size="7" text-anchor="end" fill="#64748B">80</text>
                        <text x="24" y="143" font-size="7" text-anchor="end" fill="#64748B">100</text>

                        <!-- Left AC line (Blue crosses X) -->
                        <polyline points="70,46.5 105,46.5 140,52 175,52 210,57.5 245,57.5" fill="none" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 66 42.5 L 74 50.5 M 74 42.5 L 66 50.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 101 42.5 L 109 50.5 M 109 42.5 L 101 50.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 136 48 L 144 56 M 144 48 L 136 56" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 171 48 L 179 56 M 179 48 L 171 56" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 206 53.5 L 214 61.5 M 214 53.5 L 206 61.5" stroke="#2563EB" stroke-width="2"/>
                        <path d="M 241 53.5 L 249 61.5 M 249 53.5 L 241 61.5" stroke="#2563EB" stroke-width="2"/>

                        <!-- Left BC (>) -->
                        <path d="M 103 42.5 L 109 46.5 L 103 50.5" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                        <path d="M 138 48 L 144 52 L 138 56" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                        <path d="M 173 48 L 179 52 L 173 56" fill="none" stroke="#2563EB" stroke-width="1.8"/>
                    </svg>
                    <div style="margin-top: 3pt;">
                        <span class="summary-badge badge-blue">Left PTA1: 18.3 dB HL (Normal Hearing)</span>
                    </div>
                </div>

            </div>

            <!-- FULL-WIDTH AUDIOMETRIC PARAMETERS & TUNING FORK TABLE (IMAGE 2 RECREATION) -->
            <div style="font-weight: 700; color: #0F172A; font-size: 7.8pt; margin-bottom: 2.5pt; text-transform: uppercase;">Audiometric Parameters & Tuning Fork Tests</div>
            <table class="full-clinical-table">
                <thead>
                    <tr>
                        <th style="width: 14%;">EAR</th>
                        <th style="width: 10%;">PTA1 (dB HL)</th>
                        <th style="width: 10%;">PTA2 (dB HL)</th>
                        <th style="width: 10%;">SDT (dB HL)</th>
                        <th style="width: 10%;">SRT (dB HL)</th>
                        <th style="width: 16%;">WRS % at dBHL</th>
                        <th style="width: 10%;">MCL (dB HL)</th>
                        <th style="width: 10%;">UCL (dB HL)</th>
                        <th style="width: 10%;">RINNE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="ear-red">Right Ear</td>
                        <td>48.3</td>
                        <td>52.5</td>
                        <td>45</td>
                        <td>50</td>
                        <td>76% at 80 dB</td>
                        <td>75</td>
                        <td>95</td>
                        <td>+ve (Positive)</td>
                    </tr>
                    <tr>
                        <td class="ear-blue">Left Ear</td>
                        <td>18.3</td>
                        <td>20.0</td>
                        <td>15</td>
                        <td>20</td>
                        <td>96% at 50 dB</td>
                        <td>50</td>
                        <td>100</td>
                        <td>+ve (Positive)</td>
                    </tr>
                    <tr>
                        <td class="subhead" colspan="7">Weber Tuning Fork Test (512 Hz)</td>
                        <td colspan="2" style="font-weight: bold; color: #0F172A;">Lateralizes to Left Ear ➔</td>
                    </tr>
                </tbody>
            </table>

            <!-- FULL-WIDTH TYMPANOGRAMS & IMMITTANCE TABLE (PROPER SPACING) -->
            <div style="font-weight: 700; color: #0F172A; font-size: 7.8pt; margin-bottom: 2.5pt; text-transform: uppercase;">Tympanograms & Middle Ear Immittance</div>
            <table class="full-clinical-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">PARAMETER</th>
                        <th style="width: 20%;">LEFT EAR</th>
                        <th style="width: 20%;">RIGHT EAR</th>
                        <th style="width: 25%;">CLINICAL NORM</th>
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

            <!-- FULL-WIDTH SPECIAL TESTS TABLE (OAE & TINNITUS) -->
            <table class="full-clinical-table" style="margin-bottom: 4pt;">
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
                            <strong style="color: #0F172A; font-size: 7.8pt; text-transform: uppercase;">Vani's Clinic Audiology Dept</strong><br>
                            <span style="font-size: 6.8pt; color: #475569;">Official Stamped Bilateral Clinical Record</span>
                        </td>
                        <td style="width: 55%; text-align: right;">
                            <div style="margin-bottom: 8pt; font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 13.5pt; color: #0F172A;">
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

print(f"Generated 2-graph spacious sidebar visual Audiology report: {aud_html_path}")

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
