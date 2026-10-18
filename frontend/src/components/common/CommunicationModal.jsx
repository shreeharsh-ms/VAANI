import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Check,
  ExternalLink,
  Settings,
  AlertCircle,
  Copy,
  Paperclip,
  User,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from './Modal';
import { useNotification } from '../../context/NotificationContext';
import { patientService } from '../../services/patientService';
import { communicationService } from '../../services/communicationService';

/**
 * Helper to inspect clinic SMTP configuration status from settings
 */
export const getClinicSmtpStatus = () => {
  try {
    const raw = localStorage.getItem('vaani_clinic_settings_v1');
    if (!raw) {
      return {
        isConfigured: false,
        reason: 'Clinic settings have not been customized yet.',
        smtp: null,
      };
    }
    const parsed = JSON.parse(raw);
    const smtp = parsed?.smtp;
    if (!smtp) {
      return {
        isConfigured: false,
        reason: 'SMTP configuration block is missing.',
        smtp: null,
      };
    }
    const hasHost = Boolean(smtp.host && smtp.host.trim());
    const hasSender = Boolean(smtp.senderEmail && smtp.senderEmail.trim());
    const hasAuth = Boolean(smtp.password || smtp.hasPasswordStored);

    if (!hasHost || !hasSender) {
      return {
        isConfigured: false,
        reason: 'SMTP Host or Sender Email is empty.',
        smtp,
      };
    }
    if (!hasAuth) {
      return {
        isConfigured: false,
        reason: 'SMTP authentication password or app password is not configured.',
        smtp,
      };
    }
    return {
      isConfigured: true,
      reason: 'SMTP gateway active and ready for dispatch.',
      smtp,
    };
  } catch (e) {
    return {
      isConfigured: false,
      reason: 'Failed to inspect SMTP settings.',
      smtp: null,
    };
  }
};

/**
 * Update patient profile phone / email in local storage & dispatch sync event
 */
export const updatePatientContactProfile = ({ uhid, patientId, patientName, phone, email }) => {
  try {
    const saved = JSON.parse(localStorage.getItem('vaani_patients_v1') || '[]');
    let updated = false;

    const next = saved.map((p) => {
      const matchUhid = uhid && p.uhid && p.uhid.toLowerCase() === String(uhid).toLowerCase();
      const matchId = patientId && p.id && p.id.toLowerCase() === String(patientId).toLowerCase();
      const matchName =
        patientName &&
        p.full_name &&
        p.full_name.trim().toLowerCase() === String(patientName).trim().toLowerCase();

      if (matchUhid || matchId || matchName) {
        updated = true;
        return {
          ...p,
          phone: phone !== undefined && phone.trim() !== '' ? phone.trim() : p.phone,
          email: email !== undefined && email.trim() !== '' ? email.trim() : p.email,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });

    if (updated) {
      localStorage.setItem('vaani_patients_v1', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('vaani-patients-updated'));
    }
    return updated;
  } catch (err) {
    console.warn('Failed to update patient profile contact:', err);
    return false;
  }
};

/**
 * ─────────────────────────────────────────────────────────
 * 1. REUSABLE WHATSAPP DISPATCH MODAL
 * ─────────────────────────────────────────────────────────
 */
export const WhatsAppDispatchModal = ({
  isOpen,
  onClose,
  recipientName = 'Patient',
  recipientPhone = '',
  uhid = '',
  patientId = '',
  attachedFile = null,
  documentTitle = 'Clinical Document',
  defaultMessage = '',
  onSuccess,
}) => {
  const { notify } = useNotification();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [updateProfile, setUpdateProfile] = useState(true);
  const [copied, setCopied] = useState(false);

  const isPhoneMissing = useMemo(() => {
    return !recipientPhone || !recipientPhone.trim() || recipientPhone.trim() === '+91';
  }, [recipientPhone]);

  useEffect(() => {
    if (isOpen) {
      setPhone(recipientPhone || '');
      setMessage(defaultMessage || '');
      setUpdateProfile(isPhoneMissing || Boolean(uhid));
      setCopied(false);
    }
  }, [isOpen, recipientPhone, defaultMessage, isPhoneMissing, uhid]);

  const handleCopyMessage = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notify.info('WhatsApp message text copied to clipboard.');
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();

    const cleanDigits = (phone || '').replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 8) {
      notify.error('Please enter a valid 10-digit mobile number for WhatsApp dispatch.');
      return;
    }

    const phoneWithCountry = cleanDigits.startsWith('91')
      ? cleanDigits
      : cleanDigits.length === 10
      ? `91${cleanDigits}`
      : cleanDigits;

    // Update in patient profile if checked
    let profileUpdated = false;
    if (updateProfile && (uhid || patientId || recipientName)) {
      profileUpdated = updatePatientContactProfile({
        uhid,
        patientId,
        patientName: recipientName,
        phone: phone.trim(),
      });
      if (profileUpdated) {
        notify.success(`Mobile number saved to ${recipientName}'s patient profile!`);
      }
    }

    // Copy draft to clipboard for convenience
    navigator?.clipboard?.writeText(message).catch(() => {});

    // Launch WhatsApp Web or mobile app
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    notify.success(`WhatsApp message draft opened for ${recipientName}`);

    if (onSuccess) {
      onSuccess({
        phone: phone.trim(),
        message,
        profileUpdated,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch WhatsApp Notification & Document"
      size="md"
    >
      <form onSubmit={handleSend} className="space-y-3.5 font-sans text-xs max-h-[calc(85vh-90px)] overflow-y-auto px-1 pr-2">
        {/* Missing Phone Warning Banner */}
        {isPhoneMissing && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900 text-xs">
                No Mobile / WhatsApp Number on File
              </p>
              <p className="text-[11px] text-amber-800 leading-snug">
                Patient record for <strong>{recipientName}</strong> does not have a contact number. Enter the WhatsApp number below to dispatch and save to profile.
              </p>
            </div>
          </div>
        )}

        {/* Recipient Details & Phone Editor */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-700" />
              <span className="font-bold text-slate-800 text-xs">{recipientName}</span>
              {uhid && (
                <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                  {uhid}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp Direct</span>
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Recipient WhatsApp Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-slate-400 font-mono text-xs font-semibold">
                +91
              </span>
              <input
                type="tel"
                required
                value={phone.replace(/^\+91\s*/, '')}
                onChange={(e) => setPhone(`+91 ${e.target.value.replace(/[^0-9\s]/g, '')}`)}
                placeholder="98220 12345"
                className={`h-8 w-full pl-11 pr-3 text-xs font-mono font-bold rounded border ${
                  isPhoneMissing && !phone
                    ? 'border-amber-400 bg-amber-50/30 text-amber-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
                } focus:outline-none`}
              />
            </div>
          </div>

          {/* Update Profile Checkbox */}
          {(uhid || recipientName) && (
            <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={updateProfile}
                onChange={(e) => setUpdateProfile(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-purple-700 border-slate-300 focus:ring-purple-600 cursor-pointer"
              />
              <span className="font-medium">
                Save &amp; update this mobile number in <strong>{recipientName}</strong>&apos;s patient dossier
              </span>
            </label>
          )}
        </div>

        {/* Document / Attachment Card */}
        {attachedFile && (
          <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-100 text-emerald-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">{documentTitle}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {typeof attachedFile === 'string' ? attachedFile : attachedFile.name || 'document.pdf'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>QR Verified PDF</span>
            </span>
          </div>
        )}

        {/* Message Body & Preview */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Message Text Preview &amp; Edit</label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[10px] text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono leading-relaxed"
            placeholder="Type your WhatsApp message..."
          />
          <p className="text-[10px] text-slate-400">
            Formatting tips: Wrap text in *bold* or _italic_ for WhatsApp rendering.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open WhatsApp &amp; Send</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

/**
 * ─────────────────────────────────────────────────────────
 * 2. REUSABLE EMAIL DISPATCH MODAL
 * ─────────────────────────────────────────────────────────
 */
export const EmailDispatchModal = ({
  isOpen,
  onClose,
  recipientName = 'Patient',
  recipientEmail = '',
  uhid = '',
  patientId = '',
  attachedFile = null,
  documentTitle = 'Clinical Document',
  defaultSubject = '',
  defaultMessage = '',
  reportData = null,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [updateProfile, setUpdateProfile] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const smtpStatus = useMemo(() => getClinicSmtpStatus(), [isOpen]);

  const isEmailMissing = useMemo(() => {
    return !recipientEmail || !recipientEmail.trim();
  }, [recipientEmail]);

  useEffect(() => {
    if (isOpen) {
      setEmail(recipientEmail || '');
      setSubject(defaultSubject || `Clinical Record from Vaani Speech & Hearing Clinic — ${recipientName}`);
      setMessage(defaultMessage || '');
      setUpdateProfile(isEmailMissing || Boolean(uhid));
      setIsSending(false);
    }
  }, [isOpen, recipientEmail, defaultSubject, defaultMessage, isEmailMissing, recipientName, uhid]);

  const handleSendViaClient = () => {
    if (!email || !email.includes('@')) {
      notify.error('Please enter a valid recipient email address.');
      return;
    }

    if (updateProfile && (uhid || patientId || recipientName)) {
      updatePatientContactProfile({
        uhid,
        patientId,
        patientName: recipientName,
        email: email.trim(),
      });
      notify.success(`Email address saved to ${recipientName}'s patient profile!`);
    }

    const mailtoUrl = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;

    notify.info(`System email client opened for ${recipientName}`);
    if (onSuccess) {
      onSuccess({
        email: email.trim(),
        subject,
        message,
        method: 'MAILTO',
      });
    }
    onClose();
  };

  const handleSendViaSmtp = async (e) => {
    e?.preventDefault();

    if (!email || !email.includes('@')) {
      notify.error('Please enter a valid email address.');
      return;
    }

    const clinicSmtp = smtpStatus.smtp;
    if (!smtpStatus.isConfigured || !clinicSmtp?.password) {
      notify.error(
        'SMTP Gateway is not fully configured or missing password. Please configure SMTP in Settings > Email & SMTP Gateway.'
      );
      return;
    }

    setIsSending(true);

    try {
      const response = await communicationService.sendEmail({
        toEmail: email.trim(),
        subject: subject.trim(),
        body: message,
        documentTitle,
        attachedFile: typeof attachedFile === 'string' ? attachedFile : attachedFile?.name,
        patientName: recipientName,
        uhid,
        smtpConfig: clinicSmtp,
        reportData: reportData || (attachedFile && typeof attachedFile === 'object' ? attachedFile.reportData : null),
      });

      // Update in patient profile if checked
      let profileUpdated = false;
      if (updateProfile && (uhid || patientId || recipientName)) {
        profileUpdated = updatePatientContactProfile({
          uhid,
          patientId,
          patientName: recipientName,
          email: email.trim(),
        });
      }

      notify.success(response?.message || `Email with PDF document successfully dispatched to ${email.trim()}!`);

      if (onSuccess) {
        onSuccess({
          email: email.trim(),
          subject,
          message,
          method: 'SMTP',
          profileUpdated,
        });
      }

      onClose();
    } catch (err) {
      notify.error(err.message || 'Failed to dispatch email via clinic SMTP gateway.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Official Clinical Email & Attachment"
      size="md"
    >
      <form onSubmit={handleSendViaSmtp} className="space-y-3.5 font-sans text-xs max-h-[calc(85vh-90px)] overflow-y-auto px-1 pr-2">
        {/* SMTP Gateway Status Warning / Banner */}
        {!smtpStatus.isConfigured ? (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-950 text-xs">
                  SMTP Mail Gateway Setup Missing or Incomplete
                </p>
                <p className="text-[11px] text-rose-800 leading-snug">
                  {smtpStatus.reason} Direct background email delivery requires active SMTP credentials in Settings. You can send via your system mail app (mailto:) or configure SMTP now.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-rose-200/80">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/dashboard/settings?tab=smtp');
                }}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Configure SMTP in Settings →</span>
              </button>
              <button
                type="button"
                onClick={handleSendViaClient}
                className="px-2.5 py-1 rounded bg-white hover:bg-rose-100/60 text-rose-900 border border-rose-300 font-semibold text-[10px] cursor-pointer transition-colors"
              >
                Use System Mail App
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-purple-50/70 border border-purple-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-purple-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active SMTP Host: <strong>{smtpStatus.smtp?.host}</strong> ({smtpStatus.smtp?.senderEmail})</span>
            </div>
            <span className="text-[10px] font-bold text-purple-700">TLS/SSL Secured</span>
          </div>
        )}

        {/* Missing Email Warning Banner */}
        {isEmailMissing && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-900 text-xs">
                No Email Address on File for this Patient
              </p>
              <p className="text-[11px] text-amber-800 leading-snug">
                Patient <strong>{recipientName}</strong> does not have an email address recorded. Enter the email address below to send and store to profile.
              </p>
            </div>
          </div>
        )}

        {/* Recipient Details & Email Input */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-700" />
              <span className="font-bold text-slate-800 text-xs">{recipientName}</span>
              {uhid && (
                <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                  {uhid}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
              <Mail className="w-3 h-3 text-purple-600" />
              <span>Official Clinic Dispatch</span>
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Recipient Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              className={`h-8 w-full px-2.5 text-xs font-mono font-medium rounded border ${
                isEmailMissing && !email
                  ? 'border-amber-400 bg-amber-50/30 text-amber-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600'
              } focus:outline-none`}
            />
          </div>

          {/* Update Profile Checkbox */}
          {(uhid || recipientName) && (
            <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={updateProfile}
                onChange={(e) => setUpdateProfile(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-purple-700 border-slate-300 focus:ring-purple-600 cursor-pointer"
              />
              <span className="font-medium">
                Save &amp; update this email address in <strong>{recipientName}</strong>&apos;s patient profile
              </span>
            </label>
          )}
        </div>

        {/* Email Subject Input */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Subject Line</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-8 w-full px-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium"
            placeholder="Email Subject..."
          />
        </div>

        {/* Attached Document Card */}
        {attachedFile && (
          <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-100 text-purple-700">
                <Paperclip className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">{documentTitle}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {typeof attachedFile === 'string' ? attachedFile : attachedFile.name || 'document.pdf'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-purple-800 border border-purple-200">
              Attached PDF
            </span>
          </div>
        )}

        {/* Message Body */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Email Body Message</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 font-sans leading-relaxed"
            placeholder="Type your email note or clinical summary..."
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          {!smtpStatus.isConfigured ? (
            <button
              type="button"
              onClick={handleSendViaClient}
              className="px-4 py-1.5 rounded text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Send via System Mail Client</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-1.5 rounded text-xs font-bold text-white bg-[#301444] hover:bg-[#200b30] shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending via SMTP...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Clinic SMTP</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
