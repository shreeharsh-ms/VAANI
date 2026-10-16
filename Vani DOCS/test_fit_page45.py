import os, re, fitz, asyncio
from playwright.async_api import async_playwright

html_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

compact_css = """
        /* COMPACT SECTION SPACING FOR TAIL SECTIONS */
        table.data-table th, table.data-table td {
            border: 1px solid #000000;
            padding: 2.8pt 4.5pt;
            font-size: 7.8pt;
            vertical-align: top;
            color: #000000;
            line-height: 1.25;
            word-break: break-word;
            overflow-wrap: break-word;
        }
        
        h2.section-heading {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 9.5pt;
            text-transform: uppercase;
            font-weight: bold;
            color: #000000;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 1pt;
            margin: 8pt 0 3pt 0;
            page-break-after: avoid;
            break-after: avoid;
            letter-spacing: 0.4px;
        }

        h3.subsection-heading {
            font-family: "Calibri", Arial, sans-serif;
            color: #000000;
            font-size: 8.5pt;
            text-transform: uppercase;
            font-weight: bold;
            margin: 5pt 0 2pt 0;
            page-break-after: avoid;
            break-after: avoid;
        }
"""

html = re.sub(r'h2\.section-heading\s*\{.*?\}', '', html, flags=re.DOTALL)
html = re.sub(r'h3\.subsection-heading\s*\{.*?\}', '', html, flags=re.DOTALL)
html = html.replace('</style>', compact_css + '\n</style>')

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
print(f"Total pages after compacting: {total_p}")

for p in [total_p - 1, total_p]:
    page = doc[p - 1]
    pix = page.get_pixmap(dpi=150)
    img_path = f"/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/compact_p{p}.png"
    pix.save(img_path)
    print(f"Saved page {p} to {img_path}")

