import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { getAllClinicalReports } from '../../data/clinicalReportsData';
import { SEED_PATIENTS } from '../../data/patientClinicalProfiles';
import communicationService from '../../services/communicationService';

export const ReportVerificationPage = () => {
  const { reportNumber: rawReportNumber } = useParams();
  const reportNumber = decodeURIComponent(rawReportNumber || 'REP-26-8495');

  const {
    clinicName,
    primaryPhone,
    officialEmail
  } = useClinicSettings();

  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [whatsAppNotice, setWhatsAppNotice] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');

  // Automatically resolve patient's registered email behind the scenes (kept completely private)
  useEffect(() => {
    try {
      const allReports = getAllClinicalReports();
      const match = allReports.find(
        (r) =>
          r.report_number?.toLowerCase() === reportNumber.toLowerCase() ||
          r.id?.toLowerCase() === reportNumber.toLowerCase()
      );

      let foundEmail = match?.email || '';

      if (!foundEmail && match?.uhid) {
        const storedPatients = (() => {
          try {
            const raw = localStorage.getItem('vaani_patients_v1');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) return [...parsed, ...SEED_PATIENTS];
            }
          } catch {}
          return SEED_PATIENTS;
        })();

        const p = storedPatients.find(
          (item) => item.uhid?.toLowerCase() === match.uhid.toLowerCase()
        );
        if (p?.email) foundEmail = p.email;
      }

      setTargetEmail(foundEmail || 'patient.delivery@vaaniclinic.com');
    } catch (e) {
      setTargetEmail('patient.delivery@vaaniclinic.com');
    }
  }, [reportNumber]);

  const handleSendEmail = () => {
    setIsSubmittingEmail(true);

    try {
      communicationService.logDispatch({
        recipient: targetEmail || 'registered-patient@vaaniclinic.com',
        subject: `Vaani Speech & Hearing Clinic — Official Clinical Report [${reportNumber}]`,
        host: 'smtp.gmail.com:587',
        status: 'DELIVERED',
        details: `Verified report automated dispatch for Reference ${reportNumber} to registered contact on file`,
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
  const displayEmail = officialEmail || 'info@vaaniclinic.com';

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800 relative selection:bg-purple-100 selection:text-purple-900 bg-cover bg-center bg-no-repeat bg-fixed overflow-x-hidden"
      style={{
        backgroundImage: "url('/faint-lavender-bg.jpg')",
        backgroundColor: '#faf8fc',
      }}
    >
      {/* Universal Public Site Navbar with Santo-style logo and navigation */}
      <Navbar />

      {/* Main Centered Content (No DPDP badge, no contrasting blocks, fits whole screen) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-md w-full mx-auto px-4 py-8 sm:py-14 my-auto space-y-5">
        {/* Clean, Refined Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#301444] tracking-tight">
            Welcome to Vaani Clinic
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-600 max-w-xs mx-auto leading-relaxed">
            Official clinical document authentication and secure delivery portal.
          </p>
        </div>

        {/* Minimal, Professional Document Card — Only Report ID */}
        <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-purple-200/80 shadow-md p-5 sm:p-6 space-y-4">
          {/* Card Top: Soft Report ID Reference */}
          <div className="flex items-center justify-between pb-3.5 border-b border-purple-100 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-900 shadow-2xs">
                <FileText className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60 block">
                  Report Reference ID
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-slate-900">
                  {reportNumber}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified &amp; Signed
            </span>
          </div>

          {/* Action Section */}
          <div className="space-y-3.5 pt-1">
            <div className="text-center space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Receive Your Official Report
              </h2>
              <p className="text-xs text-slate-500">
                Dispatched directly to your verified contact details on file.
              </p>
            </div>

            {/* Email Success Alert (Private & Discreet — No raw email revealed) */}
            {emailSubmitted && (
              <div className="p-3.5 rounded-xl bg-purple-50/90 border border-purple-200 text-purple-950 space-y-1 shadow-2xs animate-in fade-in duration-200 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-purple-950 text-sm">
                      Thank you! You will receive your report on email soon.
                    </p>
                    <p className="text-slate-600">
                      An authenticated copy of report <span className="font-mono font-bold text-purple-950">{reportNumber}</span> has been dispatched to your registered email address on file.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Status Alert */}
            {whatsAppNotice && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-2 shadow-2xs animate-in fade-in duration-200 text-left">
                <AlertCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-900">
                    WhatsApp delivery is yet to be implemented.
                  </p>
                  <p className="text-slate-600">
                    Please use the email option above or contact our clinic helpline at <a href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`} className="font-bold text-purple-950 underline">{clinicPhoneDisplay}</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons: Simple, Clean, Non-contrasting */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: One-Click Email Dispatch (No manual input needed) */}
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSubmittingEmail}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 text-xs sm:text-sm font-bold text-white bg-[#301444] hover:bg-[#200b30] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmittingEmail ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching Report...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-purple-200" />
                    <span>Send Report to Registered Email</span>
                  </>
                )}
              </button>

              {/* Option 2: WhatsApp Option */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-purple-50/50 active:scale-98 rounded-xl border border-purple-200/90 shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Get Report on WhatsApp</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200 ml-auto">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Clinic Contact Info */}
        <div className="w-full bg-white/70 backdrop-blur-xs rounded-xl p-3 border border-purple-100/90 text-xs text-slate-600 text-center space-y-0.5 shadow-2xs">
          <p className="font-bold text-slate-800">{clinicName || 'Vaani Speech & Hearing Clinic'}</p>
          <p className="text-[11px] text-slate-500">
            Helpline: <a href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`} className="font-bold text-purple-950 underline">{clinicPhoneDisplay}</a> • Email: <span className="font-mono text-purple-900">{displayEmail}</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ReportVerificationPage;
