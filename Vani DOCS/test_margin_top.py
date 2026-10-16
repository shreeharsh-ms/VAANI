import os
import fitz
import asyncio
from playwright.async_api import async_playwright

test_html_template = """<!DOCTYPE html>
<html>
<head>
<style>
@page {{
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: Calibri, sans-serif; font-size: 8.5pt; color: #000; }}

.last-page {{
    page-break-before: always;
    break-before: page;
}}

.sig-table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 4pt;
}}
.sig-table td {{
    width: 50%;
    padding: 6pt 8pt;
    border: 1px solid #000;
    font-size: 7.8pt;
}}

.footer-text {{
    font-size: 7.2pt;
    color: #000;
    text-align: center;
    border-top: 1.5pt solid #000;
    padding-top: 4pt;
    margin-top: 4pt;
    margin-bottom: 0;
    text-transform: uppercase;
    font-weight: bold;
}}
</style>
</head>
<body>
    <div style="height: 1000px; background: #eee;">Page 1 content</div>
    <div class="last-page">
        <div>
            <h2 style="border-bottom: 1.5px solid #000;">20. APPENDICES & EXECUTION SIGN-OFF</h2>
            <h3 style="margin-top: 4pt;">20.1 Appendix A: Standards Compliance</h3>
            <p>ISO/IEC/IEEE 29148:2018</p>
            <h3 style="margin-top: 4pt;">20.2 Appendix B: Revision Index</h3>
            <p>v1.0-SRS-FINAL</p>
        </div>
        <div style="margin-top: {MARGIN_TOP};">
            <h2 style="border-bottom: 1.5px solid #000;">20.7 BILATERAL EXECUTION & ACCEPTANCE SIGNATURE BLOCK</h2>
            <p>IN WITNESS WHEREOF...</p>
            <table class="sig-table">
                <tr>
                    <td><strong>FOR BLACK ANGLER PVT LTD:</strong><br><br><br>____________________<br>Signature</td>
                    <td><strong>FOR VANI'S CLINIC:</strong><br><br><br>____________________<br>Signature</td>
                </tr>
            </table>
            <div class="footer-text">
                BLACK ANGLER EXECUTIVE DOCUMENTATION • SOFTWARE REQUIREMENTS SPECIFICATION • STAMPED BILATERAL RECORD
            </div>
        </div>
    </div>
</body>
</html>
"""

async def test_margin(m):
    html_content = test_html_template.replace("{MARGIN_TOP}", m)
    html_path = f"/tmp/test_m_{m}.html"
    pdf_path = f"/tmp/test_m_{m}.pdf"
    with open(html_path, "w") as f:
        f.write(html_content)
    
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
            footer_template='<div style="font-size: 7.5pt; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;"><span>Footer</span><span>Page <span class="pageNumber"></span></span></div>'
        )
        await browser.close()

    doc = fitz.open(pdf_path)
    page_count = len(doc)
    last_p = doc[-1]
    blocks = last_p.get_text("blocks")
    last_block = blocks[-1] if blocks else None
    footer_block = [b for b in blocks if "STAMPED BILATERAL RECORD" in b[4]]
    if footer_block:
        fb = footer_block[0]
        print(f"Margin {m:8s} -> Total Pages: {page_count}, Footer line y0={fb[1]:.1f}, y1={fb[3]:.1f} (Target y1 ~ 795-810)")
    else:
        print(f"Margin {m:8s} -> Total Pages: {page_count}, Footer block split or pushed!")

async def main():
    for m in ["80mm", "100mm", "120mm", "130mm", "140mm", "145mm", "150mm"]:
        await test_margin(m)

asyncio.run(main())
