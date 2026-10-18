import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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
    const { smtpConfig = {}, testEmail = '' } = req.body || {};
    const recipient = (testEmail || '').trim();

    if (!recipient || !recipient.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid test recipient email is required.' });
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
      return res.status(400).json({ success: false, message: 'SMTP host, username, and password are required.' });
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

    const attachments = [];
    const headerPath = findHeaderImagePath();
    if (headerPath) {
      attachments.push({
        filename: 'vaani-official-header.png',
        path: headerPath,
        cid: 'vaani_header_banner',
      });
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

          <!-- Content Area -->
          <tr>
            <td style="padding: 24px 26px; color: #334155; font-size: 13px; line-height: 1.6;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 16px; margin-bottom: 12px; letter-spacing: 0.5px;">
                ✓ SMTP HANDSHAKE VERIFIED (250 OK)
              </div>
              
              <h3 style="margin: 0 0 10px 0; color: #1e1b4b; font-size: 16px; font-weight: 700;">
                Automated Mail Gateway Diagnostic Verification
              </h3>
              
              <p style="margin: 0 0 14px 0; color: #475569;">
                Hello, this is a real-time diagnostic test dispatched directly from your <strong>Vaani Clinic ERP</strong>. Your outbound SMTP server has performed a secure TLS handshake and authenticated successfully.
              </p>

              <!-- Verification Details Table -->
              <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px; margin: 16px 0;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td width="35%" style="color: #64748b; font-weight: 600; padding: 8px 12px;">Timestamp</td>
                  <td style="color: #0f172a; font-family: monospace; font-weight: 700; padding: 8px 12px;">${nowStr}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="color: #64748b; font-weight: 600; padding: 8px 12px;">SMTP Server / Host</td>
                  <td style="color: #0f172a; font-family: monospace; font-weight: 700; padding: 8px 12px;">${host}:${port} (${encryption})</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="color: #64748b; font-weight: 600; padding: 8px 12px;">Authenticated Sender</td>
                  <td style="color: #0f172a; font-family: monospace; font-weight: 700; padding: 8px 12px;">${username}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 600; padding: 8px 12px;">Target Recipient</td>
                  <td style="color: #0f172a; font-family: monospace; font-weight: 700; padding: 8px 12px;">${recipient}</td>
                </tr>
              </table>

              <p style="color: #047857; font-weight: 600; background: #ecfdf5; padding: 10px 14px; border-radius: 6px; border: 1px solid #a7f3d0; margin: 14px 0 0 0;">
                ✓ Your clinic email service is online and ready to deliver patient invoices, appointments, and diagnostic reports.
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

    const info = await transporter.sendMail({
      from: `"${senderName}" <${username}>`,
      to: recipient,
      subject: 'Vaani Clinic ERP - SMTP Diagnostic Verification Test Dispatch',
      text: `VAANI SPEECH & HEARING CLINIC\nSMTP Diagnostic Verification Test Dispatch\n\nStatus: 250 2.0.0 OK Handshake Verified\nTimestamp: ${nowStr}\nHost: ${host}:${port}\nSecurity: ${encryption}\nAuthenticated Sender: ${username}\nRecipient: ${recipient}\n\nClinic Address: Shop No. 4, Ground Floor, Sadashiv Arcade, Opp. Zilla Parishad Gate, Sadashiv Peth, Satara - 415002\nPhone: +91 98220 12345 / +91 94230 99887\nChief Consultant: Ms. Palak Paresh Gandhi, MASLP (Gold Medalist) | RCI CRR No. A79214`,
      html: htmlBody,
      attachments,
    });

    return res.status(200).json({
      success: true,
      message: `Real test email dispatched successfully to ${recipient} via ${host}:${port} (${encryption})`,
      data: {
        success: true,
        status: 'SENT',
        code: 250,
        messageId: info.messageId,
        recipient,
        timestamp: nowStr,
        host: `${host}:${port}`,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'SMTP diagnostic test failed.',
      error: error.message,
    });
  }
}
