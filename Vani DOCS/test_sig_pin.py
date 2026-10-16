import os, fitz, asyncio
from playwright.async_api import async_playwright

html_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace .last-page-block CSS
old_css = """        .last-page-block {
            page-break-before: always;
            break-before: page;
            min-height: 250mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }"""

new_css = """        .last-page-block {
            page-break-before: always;
            break-before: page;
            min-height: 263mm;
            height: 263mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
        }"""

html = html.replace(old_css, new_css)

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
img_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/sig_pin_263mm.png"
pix.save(img_path)
print(f"Saved preview: {img_path}")
