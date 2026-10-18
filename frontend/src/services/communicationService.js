import apiClient from './apiClient';

/**
 * Service for real SMTP diagnostic verification and clinical document email dispatches.
 */
class CommunicationService {
  /**
   * Read stored clinic SMTP configuration from localStorage
   */
  getStoredSmtpConfig() {
    try {
      const raw = localStorage.getItem('vaani_clinic_settings_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.smtp) {
          return {
            ...parsed.smtp,
            // If password in smtp is blank, check if fallback is present
            password: parsed.smtp.password || '',
          };
        }
      }
    } catch (e) {
      console.warn('Failed to read stored SMTP config:', e);
    }
    return null;
  }

  /**
   * Helper to append a dispatch log entry to the audit trail
   */
  logDispatch({ recipient, subject, host, status, details, timestamp }) {
    try {
      const existing = JSON.parse(localStorage.getItem('vaani_clinic_mail_logs_v1') || '[]');
      const nowStr =
        timestamp ||
        new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

      const entry = {
        id: `mail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: nowStr,
        recipient,
        subject,
        host,
        status,
        details,
      };

      const updated = [entry, ...existing];
      localStorage.setItem('vaani_clinic_mail_logs_v1', JSON.stringify(updated));
      return entry;
    } catch (e) {
      console.error('Failed to update mail audit log:', e);
      return null;
    }
  }

  /**
   * Send a real diagnostic test email over SMTP
   */
  async testSmtp(smtpConfig, testEmail) {
    if (!testEmail || !testEmail.includes('@')) {
      throw new Error('Please enter a valid recipient test email address.');
    }

    if (!smtpConfig?.host || !smtpConfig?.password) {
      throw new Error('SMTP Host and App Password are required to run diagnostic test.');
    }

    const payload = {
      smtpConfig,
      testEmail: testEmail.trim(),
    };

    let response;
    try {
      // 1. Primary: Flask Backend (/api/v1/communications/test-smtp)
      response = await apiClient.post('/communications/test-smtp', payload);
    } catch (backendErr) {
      // 2. Secondary fallback: Vercel serverless function (/api/communications/test-smtp)
      console.warn('Primary backend SMTP test failed or unreachable, attempting serverless fallback:', backendErr);
      try {
        const res = await fetch('/api/communications/test-smtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || data?.error || `Serverless SMTP test failed (HTTP ${res.status})`);
        }
        response = data;
      } catch (serverlessErr) {
        const finalError = backendErr.message || serverlessErr.message || 'SMTP diagnostic test failed.';
        this.logDispatch({
          recipient: testEmail,
          subject: 'Vaani Clinic ERP - SMTP Diagnostic Verification Test Dispatch',
          host: `${smtpConfig.host}:${smtpConfig.port || 587}`,
          status: 'FAILED',
          details: finalError,
        });
        throw new Error(finalError);
      }
    }

    const hostStr = response?.data?.host || `${smtpConfig.host}:${smtpConfig.port || 587}`;
    const message = response?.message || `Test email dispatched successfully to ${testEmail}`;

    this.logDispatch({
      recipient: testEmail,
      subject: 'Vaani Clinic ERP - SMTP Diagnostic Verification Test Dispatch',
      host: hostStr,
      status: 'SENT',
      details: message,
      timestamp: response?.data?.timestamp,
    });

    return response;
  }

  /**
   * Dispatch real clinical document via SMTP
   */
  async sendEmail({
    toEmail,
    subject,
    body,
    documentTitle,
    attachedFile,
    patientName,
    uhid,
    smtpConfig = null,
    reportData = null,
  }) {
    const config = smtpConfig || this.getStoredSmtpConfig();

    if (!config || !config.host || !config.password) {
      throw new Error(
        'SMTP Gateway is not configured. Please enter your SMTP Host, Username and App Password in Settings > Email & SMTP Gateway before sending.'
      );
    }

    if (!toEmail || !toEmail.includes('@')) {
      throw new Error('Please provide a valid recipient email address.');
    }

    if (!subject) {
      throw new Error('Email subject is required.');
    }

    const payload = {
      smtpConfig: config,
      toEmail: toEmail.trim(),
      subject,
      body,
      documentTitle,
      attachedFile,
      patientName,
      uhid,
      reportData,
    };

    let response;
    try {
      // 1. Primary: Flask Backend (/api/v1/communications/send-email)
      response = await apiClient.post('/communications/send-email', payload);
    } catch (backendErr) {
      // If backend responded with 4xx client/validation/auth error, throw directly
      if (backendErr.status && backendErr.status >= 400 && backendErr.status < 500) {
        const errorDetail = backendErr.message || 'SMTP dispatch rejected by server.';
        this.logDispatch({
          recipient: toEmail,
          subject,
          host: `${config.host}:${config.port || 587}`,
          status: 'FAILED',
          details: errorDetail,
        });
        throw new Error(errorDetail);
      }

      // 2. Secondary fallback: Vercel serverless function (only when backend is completely offline/unreachable)
      console.warn('Primary backend unreachable, attempting serverless fallback:', backendErr);
      try {
        const res = await fetch('/api/communications/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || data?.error || `Email dispatch failed (HTTP ${res.status})`);
        }
        response = data;
      } catch (serverlessErr) {
        const finalError = backendErr.message || serverlessErr.message || 'Failed to dispatch email via SMTP.';
        this.logDispatch({
          recipient: toEmail,
          subject,
          host: `${config.host}:${config.port || 587}`,
          status: 'FAILED',
          details: finalError,
        });
        throw new Error(finalError);
      }
    }

    const hostStr = response?.data?.host || `${config.host}:${config.port || 587}`;
    const successMsg = response?.message || `Document successfully emailed to ${toEmail}`;

    this.logDispatch({
      recipient: toEmail,
      subject,
      host: hostStr,
      status: 'SENT',
      details: successMsg,
      timestamp: response?.data?.timestamp,
    });

    return response;
  }
}

export const communicationService = new CommunicationService();
export default communicationService;
