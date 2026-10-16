import os, fitz, asyncio
from playwright.async_api import async_playwright

html_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace last page block content with executive sign-off terms
old_block = """        <!-- DEDICATED FINAL PAGE WITH PINNED BOTTOM SIGNATURE BLOCK -->
        <div class="last-page-block">
            <div class="last-page-content">
                <h2 class="section-heading">20.7 BILATERAL EXECUTION & ACCEPTANCE SIGNATURE BLOCK</h2>
                <p>IN WITNESS WHEREOF, the Parties hereto have caused this Software Requirements Specification (BA-SRS-WEB-ERP-001) to be executed by their duly authorized representatives as of the Effective Date written above.</p>
            </div>"""

new_block = """        <!-- DEDICATED FINAL PAGE WITH PINNED BOTTOM SIGNATURE BLOCK -->
        <div class="last-page-block">
            <div class="last-page-content">
                <h2 class="section-heading">20.7 BILATERAL EXECUTION & ACCEPTANCE SIGNATURE BLOCK</h2>
                <p>IN WITNESS WHEREOF, the Parties hereto have caused this Software Requirements Specification (Doc ID: <strong>BA-SRS-WEB-ERP-001</strong>) to be executed by their duly authorized representatives as of the Effective Date written above.</p>
                
                <h3 class="subsection-heading">20.7.1 Scope Baseline & Technical Acceptance</h3>
                <p>By signing below, both Black Angler Pvt Ltd and Vani's Speech & Hearing Clinic formally ratify and approve this SRS document as the authoritative specification governing the engineering, design, data architecture, security compliance, and testing criteria for the Public Website, Content Management System, and Clinic Practice Management System (ERP).</p>

                <h3 class="subsection-heading">20.7.2 Data Governance & Compliance Undertaking</h3>
                <p>Black Angler Pvt Ltd certifies that the technical architecture defined herein strictly adheres to the Digital Personal Data Protection (DPDP) Act, 2023 (India), incorporating AES-256 field-level encryption for sensitive CBT records, immutable audit logs for all patient record access, and continuous point-in-time database backups within the AWS Mumbai region.</p>

                <h3 class="subsection-heading">20.7.3 Governance & Amendment Procedure</h3>
                <p>Any future modifications, additions, or deviations from the functional and non-functional requirements specified herein shall be governed by formal written Change Orders executed bilaterally by both Parties in accordance with the Master Services & IP Agreement (BA-VC-MSIA-2026-V1.0).</p>
            </div>"""

html = html.replace(old_block, new_block)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

pdf_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.pdf"

async def render():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"file://{html_path}", wait_until="networkidle")
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "16mm", "bottom": "16mm", "left": "14mm", "right": "14mm"},
            display_header_footer=True,
            header_template='<div style="font-size: 7pt; font-family: Calibri, sans-serif; color: #555555; width: 100%; text-align: right; padding-right: 14mm;">BA-SRS-WEB-ERP-001 | STRICTLY CONFIDENTIAL</div>',
            footer_template='<div style="font-size: 7.5pt; font-family: Calibri, sans-serif; color: #333333; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;"><span style="font-weight: bold;">Black Angler Executive Documentation</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'
        )
        await browser.close()

asyncio.run(render())

doc = fitz.open(pdf_path)
total_p = len(doc)
print(f"Total pages: {total_p}")
page = doc[total_p - 1]
pix = page.get_pixmap(dpi=150)
img_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/sig_full_final_page.png"
pix.save(img_path)
print(f"Saved preview: {img_path}")
