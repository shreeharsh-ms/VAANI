import os
import fitz
import asyncio
from playwright.async_api import async_playwright

html_file = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"

with open(html_file, "r", encoding="utf-8") as f:
    orig_html = f.read()

async def test_block_style(m_str):
    target = '<div style="margin-top: 142mm;">'
    replacement = f'<div style="margin-top: {m_str};">'
    
    html = orig_html.replace(target, replacement)
    
    tmp_html = f"/tmp/test_m_{m_str}.html"
    tmp_pdf = f"/tmp/test_m_{m_str}.pdf"
    
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
        print(f"Margin '{m_str:10s}' -> Pages: {total}, Footer line y0={fb[1]:.1f}, y1={fb[3]:.1f} (Target y1 ~ 785-798)")
    else:
        print(f"Margin '{m_str:10s}' -> Pages: {total}, Footer line block missing or pushed to page {total+1}!")

async def main():
    for m in ["240mm", "250mm", "260mm", "270mm", "275mm", "280mm"]:
        await test_block_style(m)

asyncio.run(main())
