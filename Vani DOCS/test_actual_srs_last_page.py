import os
import fitz
import asyncio
from playwright.async_api import async_playwright

html_file = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_file, "r", encoding="utf-8") as f:
    orig_html = f.read()

async def test_block_style(name, style_outer, style_inner):
    # Replace the last page block with new style
    target = '<div style="page-break-before: always; break-before: page;">'
    replacement = f'<div style="page-break-before: always; break-before: page; {style_outer}">'
    
    html = orig_html.replace(target, replacement)
    html = html.replace('<div style="margin-top: 142mm;">', f'<div style="{style_inner}">')
    
    tmp_html = f"/tmp/test_last_{name}.html"
    tmp_pdf = f"/tmp/test_last_{name}.pdf"
    
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html)
        
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(f"file://{tmp_html}", wait_until="networkidle")
        await page.pdf(
            path=tmp_pdf,
            format="A4",
            print_background=True,
            margin={"top": "16mm", "bottom": "16mm", "left": "14mm", "right": "14mm"},
            display_header_footer=True,
            footer_template='<div style="font-size: 7.5pt; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;"><span>Footer</span><span>Page <span class="pageNumber"></span></span></div>'
        )
        await browser.close()
        
    doc = fitz.open(tmp_pdf)
    total = len(doc)
    last_p = doc[-1]
    blocks = last_p.get_text("blocks")
    footer_blocks = [b for b in blocks if "STAMPED BILATERAL RECORD" in b[4]]
    if footer_blocks:
        fb = footer_blocks[0]
        print(f"Style '{name:15s}' -> Pages: {total}, Footer line y0={fb[1]:.1f}, y1={fb[3]:.1f} (Target y1 ~ 785-800)")
    else:
        print(f"Style '{name:15s}' -> Pages: {total}, Footer line block missing or spilled to extra page!")

async def main():
    await test_block_style("margin_160mm", "", "margin-top: 160mm;")
    await test_block_style("margin_180mm", "", "margin-top: 180mm;")
    await test_block_style("margin_200mm", "", "margin-top: 200mm;")
    await test_block_style("flex_260mm", "height: 260mm; display: flex; flex-direction: column; justify-content: space-between;", "margin-top: auto;")
    await test_block_style("flex_262mm", "height: 262mm; display: flex; flex-direction: column; justify-content: space-between;", "margin-top: auto;")
    await test_block_style("flex_264mm", "height: 264mm; display: flex; flex-direction: column; justify-content: space-between;", "margin-top: auto;")

asyncio.run(main())
