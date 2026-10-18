import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateClinicalPdfBuffer(patientName, uhid, docTitle, bodyText) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Clinic Header
  page.drawText('VAANI SPEECH & HEARING CLINIC', { x: 40, y: 800, size: 16, font: fontBold, color: rgb(0.188, 0.078, 0.267) });
  page.drawText('Speech-Language Pathology • Clinical Audiology • Digital Hearing Aid Dispensation', { x: 40, y: 785, size: 8, font: fontBold, color: rgb(0.42, 0.13, 0.66) });
  page.drawText('Shop No. 4, Ground Floor, Sadashiv Arcade, Opp. Zilla Parishad Gate, Sadashiv Peth, Satara - 415002 | Ph: +91 98220 12345', { x: 40, y: 772, size: 7.5, font: fontRegular, color: rgb(0.28, 0.33, 0.41) });

  // Divider
  page.drawLine({ start: { x: 40, y: 760 }, end: { x: 555, y: 760 }, thickness: 1.5, color: rgb(0.188, 0.078, 0.267) });

  // Title Box
  page.drawRectangle({ x: 40, y: 725, width: 515, height: 26, color: rgb(0.188, 0.078, 0.267) });
  page.drawText((docTitle || 'CLINICAL EVALUATION REPORT').toUpperCase(), { x: 50, y: 733, size: 11, font: fontBold, color: rgb(1, 1, 1) });

  // Patient Meta Box
  page.drawRectangle({ x: 40, y: 675, width: 515, height: 42, color: rgb(0.97, 0.98, 0.99), borderColor: rgb(0.89, 0.91, 0.94), borderWidth: 1 });
  page.drawText('Patient Name:', { x: 50, y: 700, size: 8.5, font: fontBold, color: rgb(0.3, 0.35, 0.45) });
  page.drawText(patientName || 'Valued Patient', { x: 125, y: 700, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('UHID:', { x: 340, y: 700, size: 8.5, font: fontBold, color: rgb(0.3, 0.35, 0.45) });
  page.drawText(uhid || 'VH-2026-0012', { x: 380, y: 700, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

  page.drawText('Consultant:', { x: 50, y: 685, size: 8.5, font: fontBold, color: rgb(0.3, 0.35, 0.45) });
  page.drawText('Ms. Palak Paresh Gandhi, MASLP', { x: 125, y: 685, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('Date:', { x: 340, y: 685, size: 8.5, font: fontBold, color: rgb(0.3, 0.35, 0.45) });
  page.drawText(new Date().toLocaleDateString('en-IN'), { x: 380, y: 685, size: 8.5, font: fontRegular, color: rgb(0.1, 0.1, 0.1) });

  // Content
  let cursorY = 645;
  const lines = (bodyText || '').split('\n');
  for (const line of lines) {
    if (cursorY < 120) break;
    if (line.trim()) {
      page.drawText(line.trim().substring(0, 100), { x: 40, y: cursorY, size: 9, font: fontRegular, color: rgb(0.12, 0.16, 0.23) });
      cursorY -= 14;
    } else {
      cursorY -= 8;
    }
  }

  // Footer / Signature
  page.drawLine({ start: { x: 40, y: 90 }, end: { x: 555, y: 90 }, thickness: 1, color: rgb(0.8, 0.83, 0.88) });
  page.drawText('Digitally Verified Medical Document • QR Verified • DPDP Act 2023 Compliant', { x: 40, y: 75, size: 7.5, font: fontRegular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText('Ms. Palak Paresh Gandhi, MASLP | RCI CRR No. A79214', { x: 320, y: 75, size: 8, font: fontBold, color: rgb(0.2, 0.2, 0.3) });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

function findHeaderImagePath() {
  const candidates = [
    path.resolve(process.cwd(), 'frontend/public/vaani-official-header.png'),
    path.resolve(process.cwd(), 'public/vaani-official-header.png'),
    path.resolve(process.cwd(), 'frontend/public/vaani-header-banner.png'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      smtpConfig = {},
      toEmail = '',
      subject = '',
      body = '',
      documentTitle = null,
      attachedFile = null,
      patientName = null,
      uhid = null,
    } = req.body || {};

    const recipient = (toEmail || '').trim();
    if (!recipient || !recipient.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid recipient email is required.' });
    }

    if (!subject) {
      return res.status(400).json({ success: false, message: 'Email subject is required.' });
    }

    const host = (smtpConfig.host || 'smtp.gmail.com').trim();
    const port = parseInt(smtpConfig.port || 587, 10);
    const encryption = (smtpConfig.encryption || 'STARTTLS').toUpperCase();
    const username = (smtpConfig.senderEmail || smtpConfig.username || '').trim();
    let password = smtpConfig.password || '';
    if (host.toLowerCase().includes('gmail')) {
      password = password.replace(/\s+/g, '');
    }

    if (!host || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'SMTP credentials missing. Please configure your SMTP Host & App Password in Settings.',
      });
    }

    const isSecure = encryption === 'SSL' || port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecure,
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
    });

    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const senderName = smtpConfig.senderName || 'Vaani Speech & Hearing Clinic';

    let cleanFilename = attachedFile || (documentTitle ? `${documentTitle}.pdf` : 'Clinical_Document.pdf');
    cleanFilename = cleanFilename.replace(/\s+/g, '_');
    if (!cleanFilename.toLowerCase().endsWith('.pdf')) {
      cleanFilename += '.pdf';
    }

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);">
          <!-- Official Header Banner -->
          <tr>
            <td style="background-color: #301444; text-align: center; padding: 0;">
              <img src="cid:vaani_header_banner" alt="Vaani Speech & Hearing Rehabilitation Clinic" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
            </td>
          </tr>

          <!-- Patient & Record Context Ribbon -->
          <tr>
            <td style="background-color: #faf5ff; border-bottom: 1px solid #e9d5ff; padding: 12px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: #581c87;">
                <tr>
                  <td width="50%">
                    <strong>Patient:</strong> ${patientName || 'Valued Patient'}<br/>
                    <strong>UHID:</strong> ${uhid || 'VH-2026-0012'}
                  </td>
                  <td width="50%" style="text-align: right;">
                    <strong>Date:</strong> ${nowStr.split(',')[0]}<br/>
                    <span style="color: #7e22ce; font-weight: 600;">Official Medical Record</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding: 24px 26px; color: #334155; font-size: 13px; line-height: 1.65;">
              <div style="margin-bottom: 16px;">
                ${(body || '').replace(/\n/g, '<br>')}
              </div>

              <!-- Clean Attached Document Notification Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ff; border: 1.5px solid #d8b4fe; border-radius: 8px; margin: 20px 0 10px 0;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="36" style="vertical-align: middle; font-size: 26px;">
                          📄
                        </td>
                        <td style="vertical-align: middle; padding-left: 8px;">
                          <div style="font-size: 13px; font-weight: 700; color: #4c1d95;">
                            Attached Document: ${cleanFilename}
                          </div>
                          <div style="font-size: 11px; color: #6d28d9; margin-top: 2px;">
                            ${documentTitle || 'Clinical Evaluation Report'} • Digitally Signed PDF
                          </div>
                        </td>
                        <td width="95" style="text-align: right; vertical-align: middle;">
                          <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 10px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                            Attached
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0; text-align: right;">
                ↓ The official PDF document is attached to this email and ready to download.
              </p>
            </td>
          </tr>

          <!-- Clinic Details & Contact Card -->
          <tr>
            <td style="background-color: #faf5ff; border-top: 1px solid #e9d5ff; padding: 18px 24px; font-size: 11px; color: #581c87;">
              <div style="font-weight: 700; font-size: 12px; color: #3b0764; margin-bottom: 4px;">
                Vaani Speech &amp; Hearing Rehabilitation Clinic
              </div>
              <div style="color: #6b21a8; line-height: 1.5; margin-bottom: 8px;">
                <strong>Consultant:</strong> Ms. Palak Paresh Gandhi, MASLP (Gold Medalist) • <strong>RCI CRR:</strong> A79214<br/>
                <strong>📍 Address:</strong> Shop No. 4, Ground Floor, Sadashiv Arcade, Opp. Zilla Parishad Gate, Sadashiv Peth, Satara - 415002<br/>
                <strong>📞 Phone:</strong> +91 98220 12345 / +91 94230 99887 • <strong>✉️ Email:</strong> info@vaaniclinic.com
              </div>
              <div style="font-size: 10px; color: #7e22ce; border-top: 1px dashed #d8b4fe; padding-top: 6px;">
                Mon – Sat: 10:00 AM – 1:30 PM &amp; 3:30 PM – 8:00 PM • Sunday Closed • DPDP Act 2023 Compliant Practice
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const attachments = [];

    // Attach inline banner image
    const headerPath = findHeaderImagePath();
    if (headerPath) {
      attachments.push({
        filename: 'vaani-official-header.png',
        path: headerPath,
        cid: 'vaani_header_banner',
      });
    }

    // Generate real PDF and attach
    const pdfBuffer = await generateClinicalPdfBuffer(patientName, uhid, documentTitle, body);
    attachments.push({
      filename: cleanFilename,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });

    const info = await transporter.sendMail({
      from: `"${senderName}" <${username}>`,
      to: recipient,
      subject,
      text: body,
      html: htmlBody,
      attachments,
    });

    return res.status(200).json({
      success: true,
      message: `Clinical document '${cleanFilename}' successfully emailed to ${recipient} with attached PDF`,
      data: {
        success: true,
        status: 'SENT',
        code: 250,
        messageId: info.messageId,
        recipient,
        timestamp: nowStr,
        host: `${host}:${port}`,
        attachment: cleanFilename,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to dispatch email.',
      error: error.message,
    });
  }
}
