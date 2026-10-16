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
        margin: 10mm 12mm 10mm 12mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
        color: #1E293B;
        background-color: #FFFFFF;
        font-size: 8pt;
        line-height: 1.3;
        -webkit-print-color-adjust: exact;
    }
    .page-container {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 0;
    }

    /* TOP HEADER BLOCK MATCHING REFERENCE IMAGE */
    .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 6pt;
    }
    .header-table td { vertical-align: middle; }
    
    .logo-badge {
        width: 52px;
        height: 52px;
        background: linear-gradient(135deg, #0F172A 0%, #0D9488 100%);
        color: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22pt;
        font-weight: bold;
        font-family: Georgia, serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .doc-main-heading {
        text-align: center;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 16pt;
        font-weight: bold;
        color: #0F172A;
        letter-spacing: 0.5px;
    }
    .doc-sub-heading {
        text-align: center;
        font-size: 8pt;
        color: #0D9488;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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

    /* PATIENT METADATA BOX - GRID LAYOUT LIKE REFERENCE IMAGE */
    .patient-box {
        border: 1.5px solid #0F172A;
        border-radius: 4px;
        margin-bottom: 8pt;
        background: #FFFFFF;
        overflow: hidden;
    }
    .patient-table {
        width: 100%;
        border-collapse: collapse;
    }
    .patient-table td {
        padding: 3pt 6pt;
        border: 1px solid #CBD5E1;
        font-size: 8pt;
    }
    .patient-table .lbl {
        font-size: 6.8pt;
        color: #64748B;
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-bottom: 1pt;
    }
    .patient-table .val {
        font-weight: 600;
        color: #0F172A;
        font-size: 8.5pt;
    }

    .section-title {
        font-size: 9pt;
        font-weight: 700;
        color: #0F172A;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        border-bottom: 1.5px solid #0F172A;
        padding-bottom: 1pt;
        margin-bottom: 6pt;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* TWO COLUMN DIAGNOSTIC LAYOUT */
    .diagnostic-grid {
        display: flex;
        gap: 10pt;
        margin-bottom: 8pt;
    }
    .col-left {
        flex: 1.1;
    }
    .col-right {
        flex: 1.1;
    }

    /* AUDIOGRAM CHART SVG CARD */
    .audiogram-card {
        border: 1px solid #CBD5E1;
        border-radius: 4px;
        padding: 6pt;
        background: #FAFAFA;
        text-align: center;
    }
    .audiogram-title {
        font-weight: 700;
        color: #0F172A;
        font-size: 8.5pt;
        margin-bottom: 4pt;
        text-transform: uppercase;
    }

    /* SPEECH & TYMPANOMETRY TABLES */
    .mini-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 6pt;
        font-size: 7.5pt;
    }
    .mini-table th, .mini-table td {
        border: 1px solid #94A3B8;
        padding: 2.5pt 4pt;
        text-align: center;
    }
    .mini-table th {
        background-color: #1E293B;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 7pt;
        text-transform: uppercase;
    }
    .mini-table td.subhead {
        background-color: #F1F5F9;
        font-weight: 700;
        color: #334155;
        text-align: left;
    }

    /* CUTE BADGES & TAGS */
    .badge-pass {
        background-color: #DCFCE7;
        color: #15803D;
        border: 1px solid #86EFAC;
        padding: 1pt 4pt;
        border-radius: 3px;
        font-weight: 700;
        font-size: 7pt;
    }
    .badge-refer {
        background-color: #FEE2E2;
        color: #B91C1C;
        border: 1px solid #FCA5A5;
        padding: 1pt 4pt;
        border-radius: 3px;
        font-weight: 700;
        font-size: 7pt;
    }
    .ear-red { color: #DC2626; font-weight: 700; }
    .ear-blue { color: #2563EB; font-weight: 700; }

    /* SUMMARY CARDS GRID */
    .pill-grid {
        display: flex;
        gap: 4pt;
        margin-top: 4pt;
        margin-bottom: 6pt;
    }
    .pill-item {
        flex: 1;
        background: #F0FDFA;
        border: 1px solid #99F6E4;
        border-radius: 3px;
        padding: 3pt 4pt;
        text-align: center;
    }
    .pill-item .p-lbl { font-size: 6.5pt; color: #0F766E; font-weight: 700; text-transform: uppercase; }
    .pill-item .p-val { font-size: 8.5pt; color: #0F172A; font-weight: 700; }

    /* RESULTS & RECOMMENDATIONS BOX */
    .info-block {
        margin-bottom: 6pt;
    }
    .info-block p {
        font-size: 8pt;
        color: #1E293B;
        line-height: 1.35;
        margin-bottom: 3pt;
    }

    /* FOOTER SIGNATURE SECTION */
    .footer-sig-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10pt;
        border-top: 1.5px solid #0F172A;
        padding-top: 6pt;
    }
    .footer-sig-table td {
        vertical-align: bottom;
        font-size: 7.8pt;
    }
</style>
</head>
<body>

<div class="page-container">
    
    <!-- TOP HEADER WITH CLINIC LOGO & TITLE -->
    <table class="header-table">
        <tr>
            <td style="width: 12%;">
                <div class="logo-badge">V</div>
            </td>
            <td style="width: 58%; text-align: center;">
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

    <!-- PATIENT CASE HISTORY & METADATA GRID -->
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
                <div class="audiogram-title">Puretone Audiometry (Air & Bone Conduction)</div>
                
                <!-- HIGH PRECISION SVG AUDIOGRAM CHART -->
                <svg width="270" height="230" viewBox="0 0 270 230" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 3px;">
                    <!-- Grid Lines Frequencies: 125, 250, 500, 1K, 2K, 4K, 8K -->
                    <!-- X Coordinates: 125=35, 250=70, 500=105, 1k=140, 2k=175, 4k=210, 8k=245 -->
                    <!-- Y Coordinates (-10 to 120 dB): -10=20, 0=35, 10=50, 20=65, 30=80, 40=95, 50=110, 60=125, 70=140, 80=155, 90=170, 100=185, 110=200, 120=215 -->
                    
                    <!-- Vertical Frequency Grid Lines -->
                    <line x1="35" y1="20" x2="35" y2="215" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="70" y1="20" x2="70" y2="215" stroke="#CBD5E1" stroke-width="1"/>
                    <line x1="105" y1="20" x2="105" y2="215" stroke="#CBD5E1" stroke-width="1"/>
                    <line x1="140" y1="20" x2="140" y2="215" stroke="#CBD5E1" stroke-width="1"/>
                    <line x1="175" y1="20" x2="175" y2="215" stroke="#CBD5E1" stroke-width="1"/>
                    <line x1="210" y1="20" x2="210" y2="215" stroke="#CBD5E1" stroke-width="1"/>
                    <line x1="245" y1="20" x2="245" y2="215" stroke="#CBD5E1" stroke-width="1"/>

                    <!-- Horizontal dB Grid Lines -->
                    <line x1="30" y1="35" x2="250" y2="35" stroke="#94A3B8" stroke-width="1.5"/> <!-- 0 dB -->
                    <line x1="30" y1="50" x2="250" y2="50" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="65" x2="250" y2="65" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="80" x2="250" y2="80" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="95" x2="250" y2="95" stroke="#E2E8F0" stroke-width="1"/> <!-- 40 dB -->
                    <line x1="30" y1="110" x2="250" y2="110" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="125" x2="250" y2="125" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="140" x2="250" y2="140" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="155" x2="250" y2="155" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="170" x2="250" y2="170" stroke="#E2E8F0" stroke-width="1"/>
                    <line x1="30" y1="185" x2="250" y2="185" stroke="#E2E8F0" stroke-width="1"/>

                    <!-- Frequency Labels -->
                    <text x="35" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">125</text>
                    <text x="70" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">250</text>
                    <text x="105" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">500</text>
                    <text x="140" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">1K</text>
                    <text x="175" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">2K</text>
                    <text x="210" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">4K</text>
                    <text x="245" y="14" font-size="7" text-anchor="middle" fill="#64748B" font-weight="bold">8K</text>

                    <!-- dB Labels -->
                    <text x="24" y="38" font-size="7" text-anchor="end" fill="#64748B">0</text>
                    <text x="24" y="68" font-size="7" text-anchor="end" fill="#64748B">20</text>
                    <text x="24" y="98" font-size="7" text-anchor="end" fill="#64748B">40</text>
                    <text x="24" y="128" font-size="7" text-anchor="end" fill="#64748B">60</text>
                    <text x="24" y="158" font-size="7" text-anchor="end" fill="#64748B">80</text>
                    <text x="24" y="188" font-size="7" text-anchor="end" fill="#64748B">100</text>

                    <!-- RIGHT EAR (RED CIRCLES - O) -->
                    <!-- 250=25dB(68), 500=30dB(80), 1k=40dB(95), 2k=50dB(110), 4k=65dB(132.5), 8k=70dB(140) -->
                    <polyline points="70,68 105,80 140,95 175,110 210,132.5 245,140" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="70" cy="68" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="105" cy="80" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="140" cy="95" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="175" cy="110" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="210" cy="132.5" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>
                    <circle cx="245" cy="140" r="4" fill="none" stroke="#DC2626" stroke-width="2"/>

                    <!-- LEFT EAR (BLUE CROSSES - X) -->
                    <!-- 250=15dB(57.5), 500=15dB(57.5), 1k=20dB(65), 2k=20dB(65), 4k=25dB(72.5), 8k=25dB(72.5) -->
                    <polyline points="70,57.5 105,57.5 140,65 175,65 210,72.5 245,72.5" fill="none" stroke="#2563EB" stroke-width="2"/>
                    <!-- X Symbols for Left Ear -->
                    <path d="M 66 53.5 L 74 61.5 M 74 53.5 L 66 61.5" stroke="#2563EB" stroke-width="2"/>
                    <path d="M 101 53.5 L 109 61.5 M 109 53.5 L 101 61.5" stroke="#2563EB" stroke-width="2"/>
                    <path d="M 136 61 L 144 69 M 144 61 L 136 69" stroke="#2563EB" stroke-width="2"/>
                    <path d="M 171 61 L 179 69 M 179 61 L 171 69" stroke="#2563EB" stroke-width="2"/>
                    <path d="M 206 68.5 L 214 76.5 M 214 68.5 L 206 76.5" stroke="#2563EB" stroke-width="2"/>
                    <path d="M 241 68.5 L 249 76.5 M 249 68.5 L 241 76.5" stroke="#2563EB" stroke-width="2"/>

                    <!-- BONE CONDUCTION SYMBOLS (< for Right, > for Left) -->
                    <!-- Right BC (<) red: 500=25(68), 1k=35(87.5), 2k=50(110), 4k=60(125) -->
                    <path d="M 107 64 L 101 68 L 107 72" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                    <path d="M 142 83.5 L 136 87.5 L 142 91.5" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                    <path d="M 177 106 L 171 110 L 177 114" fill="none" stroke="#DC2626" stroke-width="1.8"/>
                    
                    <!-- Left BC (>) blue: 500=15(57.5), 1k=20(65), 2k=20(65), 4k=20(65) -->
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

        <!-- RIGHT COLUMN: SPEECH, TYMPANOGRAMS, OAE & TINNITUS -->
        <div class="col-right">
            
            <!-- SPEECH AUDIOMETRY TABLE -->
            <div style="font-weight: 700; color: #0F172A; font-size: 8pt; margin-bottom: 2pt; text-transform: uppercase;">Speech Audiometry & Discrimination</div>
            <table class="mini-table">
                <thead>
                    <tr>
                        <th>Ear</th>
                        <th>SAT</th>
                        <th>SRT</th>
                        <th>Mask</th>
                        <th>MCL</th>
                        <th>UCL</th>
                        <th>WR %</th>
                        <th>WR Level</th>
                        <th>WR Mask</th>
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
                        <td class="subhead" colspan="2">Binaural</td>
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

            <!-- TYMPANOGRAMS TABLE MATCHING SAMPLE REFERENCE -->
            <div style="font-weight: 700; color: #0F172A; font-size: 8pt; margin-bottom: 2pt; text-transform: uppercase;">Tympanograms & Middle Ear Immittance</div>
            <table class="mini-table">
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Left Ear</th>
                        <th>Right Ear</th>
                        <th>Clinical Norm</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="subhead">Tympanogram Type</td>
                        <td><strong style="color: #15803D;">Type A</strong></td>
                        <td><strong style="color: #15803D;">Type A</strong></td>
                        <td>Normal Middle Ear Peak</td>
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

            <!-- OAE, TUNING FORK & TINNITUS QUICK SUMMARY -->
            <table class="mini-table" style="margin-bottom: 0;">
                <thead>
                    <tr>
                        <th>OAE Screening</th>
                        <th>Tuning Fork (512 Hz)</th>
                        <th>Tinnitus THI / TRT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            RE: <span class="badge-refer">REFER</span><br>
                            LE: <span class="badge-pass">PASS</span>
                        </td>
                        <td>
                            Rinne: <strong>Positive (+ve)</strong><br>
                            Weber: <strong>Lateralizes Left</strong>
                        </td>
                        <td>
                            THI: <strong>46 (Mod Grade III)</strong><br>
                            TRT: <strong>Category 2</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

    <!-- RESULTS SECTION MATCHING REFERENCE IMAGE -->
    <div class="info-block">
        <div class="section-title">Results</div>
        <p>• Patient presents with a <strong>unilateral moderate sensorineural hearing loss in the Right Ear</strong> (PTA1: 48.3 dB HL, sloping high-frequency configuration) and <strong>normal hearing sensitivity in the Left Ear</strong> (PTA1: 18.3 dB HL).</p>
        <p>• Immittance testing revealed <strong>Type A tympanograms in both ears</strong>, which are consistent with normal middle ear pressure, normal tympanic membrane mobility, and intact eustachian tube function.</p>
        <p>• Word Recognition Score (WRS) is <strong>76% in the Right Ear</strong> at 80 dB HL presentation level and <strong>96% in the Left Ear</strong> at 50 dB HL. Otoacoustic Emissions (DPOAE) showed high-frequency outer hair cell dysfunction in the Right Ear.</p>
    </div>

    <!-- RECOMMENDATIONS SECTION MATCHING REFERENCE IMAGE -->
    <div class="info-block">
        <div class="section-title">Recommendations</div>
        <p>1. <strong>Hearing Aid Trial</strong>: Pursue a trial with digital amplification (Receiver-in-Canal RIC Hearing Aid with Tinnitus Sound Generator TSG) for the Right Ear for improved hearing clarity, speech understanding, and prevention of auditory deprivation.</p>
        <p>2. <strong>Communication Strategies</strong>: Utilize communication strategies for improving speech understanding (i.e. face the speaker, engage in face-to-face communication, reduce background environmental noise, enhance room lighting).</p>
        <p>3. <strong>Tinnitus Retraining Therapy (TRT)</strong>: Initiate sound therapy counseling and habituation protocols for Right Ear tinnitus management.</p>
        <p>4. <strong>Follow-up</strong>: Schedule an annual audiological re-evaluation in 12 months or sooner if any sudden change in hearing is experienced.</p>
    </div>

    <!-- SIGNATURE BLOCK MATCHING REFERENCE IMAGE LAYOUT -->
    <table class="footer-sig-table">
        <tr>
            <td style="width: 50%;">
                <div style="font-size: 8pt; color: #475569;">
                    <strong>VANI'S CLINIC AUDIOLOGY DEPT</strong><br>
                    Official Stamped Bilateral Clinical Record
                </div>
            </td>
            <td style="width: 50%; text-align: right;">
                <div style="margin-bottom: 20pt; font-family: 'Brush Script MT', cursive, Georgia, serif; font-size: 16pt; color: #0F172A;">
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

</body>
</html>
"""

# Write HTML file
aud_html_path = os.path.join(target_dir, "01_Audiology_Evaluation_Report_Sample.html")
with open(aud_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated single-page visual Audiology report: {aud_html_path}")

# Render to PDF using Playwright
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
            margin={"top": "10mm", "bottom": "10mm", "left": "12mm", "right": "12mm"}
        )
        await browser.close()

    doc = fitz.open(pdf_path)
    print(f"Generated PDF: {pdf_path} (Total Pages: {len(doc)})")

asyncio.run(render_pdf())
