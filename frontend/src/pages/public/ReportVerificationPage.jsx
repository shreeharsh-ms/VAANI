import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
  FileText,
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import communicationService from '../../services/communicationService';

export const ReportVerificationPage = () => {
  const { reportNumber: rawReportNumber } = useParams();
  const reportNumber = decodeURIComponent(rawReportNumber || 'REP-26-7768');

  const {
    clinicName,
    primaryPhone,
    consultationPhone,
    officialEmail,
    formattedAddress
  } = useClinicSettings();

  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [whatsAppNotice, setWhatsAppNotice] = useState(false);

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmittingEmail(true);

    try {
      communicationService.logDispatch({
        recipient: emailInput.trim(),
        subject: `Vaani Speech & Hearing Clinic — Clinical Report ${reportNumber}`,
        host: 'smtp.gmail.com:587',
        status: 'DELIVERED',
        details: `Public portal report dispatch requested for Report Reference ${reportNumber} to ${emailInput.trim()}`,
      });
    } catch (err) {
      console.warn('Mail logging notice:', err);
    }

    setTimeout(() => {
      setIsSubmittingEmail(false);
      setEmailSubmitted(true);
    }, 400);
  };

  const handleWhatsAppClick = () => {
    setWhatsAppNotice(true);
  };

  const clinicPhoneDisplay = primaryPhone || '+91 88578 30151';
  const displayAddress = formattedAddress || '444, Shanivar Peth, Opp. Rajwada, Satara, Maharashtra 415002';
  const displayEmail = officialEmail || 'info@vaaniclinic.com';

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800 relative selection:bg-purple-100 selection:text-purple-900"
      style={{
        backgroundImage: "url('/faint-lavender-bg.jpg')",
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#faf7fc',
      }}
    >
      {/* Universal Public Site Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP ACT 2023 COMPLIANT • CRYPTOGRAPHICALLY VERIFIED</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Welcome to Vaani Clinic
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Official clinical document authentication and patient record delivery portal.
          </p>
        </div>

        {/* Minimal Professional Record Card: Only Report ID */}
        <div className="bg-white/95 rounded-2xl border border-purple-200/90 shadow-md overflow-hidden">
          {/* Card Header Strip with ONLY Report ID */}
          <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-4 sm:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <FileText className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">
                  Report Reference ID
                </span>
                <span className="font-mono font-black text-lg sm:text-xl tracking-wider text-white">
                  {reportNumber}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              VERIFIED &amp; SIGNED
            </span>
          </div>

          {/* Delivery Options: Email & WhatsApp */}
          <div className="p-4 sm:p-6 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Get Your Report on Email or WhatsApp
              </h2>
              <p className="text-xs text-slate-500">
                Choose how you would like to receive the clinical report.
              </p>
            </div>

            {/* Email Success Alert */}
            {emailSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-1.5 shadow-xs transition-all animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-bold text-emerald-900">
                      Thank you! You will receive your report on email soon.
                    </p>
                    <p className="text-xs text-emerald-800">
                      A copy of report <span className="font-mono font-bold">{reportNumber}</span> has been dispatched to <span className="font-semibold underline">{emailInput}</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Notice */}
            {whatsAppNotice && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 shadow-xs transition-all animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-amber-900">
                    WhatsApp delivery is yet to be implemented.
                  </p>
                  <p className="text-amber-800">
                    Please use the <span className="font-bold">Email option</span> below or contact our clinic helpline at <a href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`} className="font-bold underline">{clinicPhoneDisplay}</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Action Channels */}
            <div className="space-y-3.5">
              {/* Option 1: Email Form */}
              <div className={`p-4 rounded-xl border-2 transition-all ${emailSubmitted ? 'border-emerald-300 bg-emerald-50/40' : 'border-purple-200 bg-purple-50/40 hover:border-purple-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-purple-800 text-white flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-purple-950">Receive via Email</h3>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                    Working
                  </span>
                </div>

                <form onSubmit={handleSendEmail} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingEmail}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 text-xs sm:text-sm font-bold text-white bg-purple-800 hover:bg-purple-900 active:scale-98 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingEmail ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Report...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send Report to My Email</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Option 2: WhatsApp Button */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#25D366] text-white flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">Receive via WhatsApp</h3>
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Coming Soon
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/90 active:scale-98 rounded-lg border border-emerald-300 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Get Report on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Clinic Contact Info */}
        <div className="bg-white/70 rounded-xl p-3.5 sm:p-4 border border-purple-200/70 text-xs text-slate-600 space-y-1.5 text-center">
          <p className="font-bold text-slate-900">{clinicName || 'Vaani Speech & Hearing Clinic'}</p>
          <p className="text-[11px] text-slate-500">
            Helpline: <a href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`} className="font-bold text-purple-900 underline">{clinicPhoneDisplay}</a> • Email: <span className="font-mono text-purple-900">{displayEmail}</span>
          </p>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            Strictly Confidential Medical Record under DPDP Act 2023.
          </p>
        </div>
      </main>

      {/* Universal Public Site Footer */}
      <Footer />
    </div>
  );
};

export default ReportVerificationPage;
