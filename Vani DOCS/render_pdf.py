import os
import asyncio
from playwright.async_api import async_playwright

async def generate_pdf():
    html_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.html"
    pdf_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification/Software_Requirements_Specification.pdf"
    root_pdf_path = "/Users/shreeharshmshivpuje/Desktop/DESKTOP/AI-Agents/Vani's Clinic/Software_Requirements_Specification.pdf"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Navigate to local file URL
        file_url = f"file://{html_path}"
        await page.goto(file_url, wait_until="networkidle")

        # Generate PDF with header/footer page numbers
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

    print(f"Generated PDF: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
    
    # Copy to root directory
    with open(pdf_path, "rb") as f_in:
        with open(root_pdf_path, "wb") as f_out:
            f_out.write(f_in.read())
    print(f"Copied PDF to root: {root_pdf_path}")

if __name__ == "__main__":
    asyncio.run(generate_pdf())
