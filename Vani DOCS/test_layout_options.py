import os, fitz, re, asyncio
from playwright.async_api import async_playwright
import markdown

raw_file = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/SRS_raw_prompt.md"

with open(raw_file, 'r', encoding='utf-8') as f:
    raw_md = f.read()

raw_md = re.sub(r'^\s*<USER_REQUEST>\s*', '', raw_md)
raw_md = re.sub(r'\|\s*Telemedicine video platform.*?\n', '', raw_md, flags=re.IGNORECASE)

intro_pos = raw_md.find('# 1. Introduction')
body_md = raw_md[intro_pos:] if intro_pos != -1 else raw_md

# Simple compact natural signature block without forced 263mm flex gaps
natural_sig_block = """
<div class="sig-block-container" style="margin-top: 20pt; page-break-inside: avoid; break-inside: avoid;">
    <h2 class="section-heading">20.7 BILATERAL EXECUTION & ACCEPTANCE SIGNATURE BLOCK</h2>
    <p>IN WITNESS WHEREOF, the Parties hereto have caused this Software Requirements Specification (Doc ID: <strong>BA-SRS-WEB-ERP-001</strong>) to be executed by their duly authorized representatives as of the Effective Date written above.</p>
    
    <p>By signing below, both Black Angler Pvt Ltd and Vani's Speech & Hearing Clinic formally ratify and approve this SRS document as the authoritative specification governing the engineering, design, data architecture, security compliance, and testing criteria for the Public Website, Content Management System, and Clinic Practice Management System (ERP).</p>

    <table class="sig-table" style="width: 100% !important; table-layout: fixed !important; border-collapse: collapse; margin-top: 12pt; margin-bottom: 10pt;">
        <tr>
            <td style="width: 50%; padding: 8pt 10pt; vertical-align: top; border: 1px solid #000000; background-color: #ffffff; font-size: 8pt; line-height: 1.35;">
                <strong style="text-transform: uppercase;">FOR BLACK ANGLER PVT LTD:</strong><br><br><br>
                ____________________________________________<br>
                <strong>Signature</strong><br><br>
                <strong>Name:</strong> Shreeharsh M. Shivpuje<br>
                <strong>Title:</strong> Founder / Lead Solutions Architect<br>
                <strong>Date:</strong> October 07, 2026<br><br>
                <em>(Authorized Signatory & Technical Representative)</em>
            </td>
            <td style="width: 50%; padding: 8pt 10pt; vertical-align: top; border: 1px solid #000000; background-color: #ffffff; font-size: 8pt; line-height: 1.35;">
                <strong style="text-transform: uppercase;">FOR VANI'S CLINIC (CLIENT):</strong><br><br><br>
                ____________________________________________<br>
                <strong>Signature</strong><br><br>
                <strong>Name:</strong> Ms. Palak Paresh Gandhi<br>
                <strong>Title:</strong> Product Owner & Principal Practitioner<br>
                <strong>Date:</strong> October 07, 2026<br><br>
                <em>(Client Representative & Business Owner)</em>
            </td>
        </tr>
    </table>

    <div class="footer-text" style="font-size: 7.2pt; color: #000000; text-align: center; border-top: 1.5pt solid #000000; padding-top: 4pt; margin-top: 8pt; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold;">
        BLACK ANGLER EXECUTIVE DOCUMENTATION • SOFTWARE REQUIREMENTS SPECIFICATION • STAMPED BILATERAL RECORD
    </div>
</div>
"""

# Test script to build option A (natural flow)
with open("/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/build_srs_suite.py", 'r', encoding='utf-8') as f:
    builder_code = f.read()

# Replace the last-page-block part with natural_sig_block
old_sig_part = re.search(r'<!-- DEDICATED FINAL PAGE WITH PINNED BOTTOM SIGNATURE BLOCK -->.*?</html>', builder_code, re.DOTALL).group(0)
new_sig_part = natural_sig_block + "\n\n    </div>\n</body>\n</html>"

builder_code_option_a = builder_code.replace(old_sig_part, new_sig_part)

with open("/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/build_option_a.py", "w", encoding="utf-8") as f:
    f.write(builder_code_option_a)

print("Created build_option_a.py")
