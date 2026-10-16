import os, re
import fitz # PyMuPDF
from playwright.async_api import async_playwright
import asyncio

html_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Enhance table CSS in HTML
old_table_css = """        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 7pt;
            background-color: #ffffff;
        }"""

new_table_css = """        table.data-table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse;
            margin-bottom: 7pt;
            background-color: #ffffff;
            word-wrap: break-word;
        }
        
        table.data-table th, table.data-table td {
            border: 1px solid #000000;
            padding: 3.5pt 5pt;
            font-size: 8pt;
            vertical-align: top;
            color: #000000;
            line-height: 1.28;
            word-break: break-word;
            overflow-wrap: break-word;
        }
        
        /* Specific column width distributions for common table structures */
        /* 4-column schema tables: FIELD (22%), TYPE (26%), REQ (7%), NOTES (45%) */
        table.data-table tr th:first-child:nth-last-child(4),
        table.data-table tr td:first-child:nth-last-child(4) { width: 22%; }
        table.data-table tr th:first-child:nth-last-child(4) ~ th:nth-child(2),
        table.data-table tr td:first-child:nth-last-child(4) ~ td:nth-child(2) { width: 26%; }
        table.data-table tr th:first-child:nth-last-child(4) ~ th:nth-child(3),
        table.data-table tr td:first-child:nth-last-child(4) ~ td:nth-child(3) { width: 7%; text-align: center; }
        table.data-table tr th:first-child:nth-last-child(4) ~ th:nth-child(4),
        table.data-table tr td:first-child:nth-last-child(4) ~ td:nth-child(4) { width: 45%; }

        /* 2-column tables: 28% and 72% */
        table.data-table tr th:first-child:nth-last-child(2),
        table.data-table tr td:first-child:nth-last-child(2) { width: 28%; }
        table.data-table tr th:first-child:nth-last-child(2) ~ th:nth-child(2),
        table.data-table tr td:first-child:nth-last-child(2) ~ td:nth-child(2) { width: 72%; }

        /* 3-column tables: 25%, 30%, 45% */
        table.data-table tr th:first-child:nth-last-child(3),
        table.data-table tr td:first-child:nth-last-child(3) { width: 25%; }
        table.data-table tr th:first-child:nth-last-child(3) ~ th:nth-child(2),
        table.data-table tr td:first-child:nth-last-child(3) ~ td:nth-child(2) { width: 30%; }
        table.data-table tr th:first-child:nth-last-child(3) ~ th:nth-child(3),
        table.data-table tr td:first-child:nth-last-child(3) ~ td:nth-child(3) { width: 45%; }
"""

html = html.replace(old_table_css, new_table_css)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated HTML CSS styling.")

# Re-render PDF
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
print("Re-rendered PDF.")

# Render page 21 to image
doc = fitz.open(pdf_path)
page = doc[20]
pix = page.get_pixmap(dpi=150)
img_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/page_21_fixed.png"
pix.save(img_path)
print(f"Saved fixed page 21 preview to {img_path}")

