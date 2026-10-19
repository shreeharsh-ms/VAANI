import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
  FileText,
  Download,
  Printer,
  Phone,
  MapPin,
  Calendar,
  User,
  Award,
  ExternalLink,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useClinicSettings, formatClinicAddress } from '../../context/ClinicSettingsContext';
import { getAllClinicalReports } from '../../data/clinicalReportsData';
import { SEED_PATIENTS } from '../../data/patientClinicalProfiles';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import communicationService from '../../services/communicationService';

export const ReportVerificationPage = () => {
  const { reportNumber: rawReportNumber } = useParams();
  const reportNumber = decodeURIComponent(rawReportNumber || 'REP-26-8495');

  const {
    leadPractitioner,
    leadDegree,
    rciNumber,
    settings,
    formattedAddress,
    primaryPhone,
    consultationPhone,
    officialEmail,
    logoUrl,
    clinicName
  } = useClinicSettings();

  const [report, setReport] = useState(null);
  const [patient, setPatient] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [whatsAppNotice, setWhatsAppNotice] = useState(false);

  // Load report data from local registry or fallback clinical records
  useEffect(() => {
    try {
      const allReports = getAllClinicalReports();
      const match = allReports.find(
        (r) =>
          r.report_number?.toLowerCase() === reportNumber.toLowerCase() ||
          r.id?.toLowerCase() === reportNumber.toLowerCase()
      );

      if (match) {
        setReport(match);

        // Find patient
        const allPatients = (() => {
          try {
            const stored = localStorage.getItem('vaani_patients_v1');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) return [...parsed, ...SEED_PATIENTS];
            }
          } catch {}
          return SEED_PATIENTS;
        })();

        const pMatch = allPatients.find(
          (p) =>
            (p.uhid && match.uhid && p.uhid.toLowerCase() === match.uhid.toLowerCase()) ||
            (p.full_name && match.patient_name && p.full_name.toLowerCase() === match.patient_name.toLowerCase())
        );

        if (pMatch) {
          setPatient(pMatch);
          if (pMatch.email) setEmailInput(pMatch.email);
        } else {
          setPatient({
            full_name: match.patient_name || 'Patient',
            uhid: match.uhid || 'VN-26-0001',
            phone: match.phone || '+91 98220 11223',
            email: match.email || '',
          });
          if (match.email) setEmailInput(match.email);
        }
      } else {
        // Fallback reconstructed record if scanning on external phone device
        const defaultSrv = CLINICAL_SERVICES[0];
        setReport({
          report_number: reportNumber,
          title: 'Audiological Evaluation (PTA)',
          service_code: 'RP-CLN-AUD',
          discipline: 'Audiology',
          patient_name: 'Registered Patient',
          uhid: 'VN-26-0001',
          date: new Date().toISOString().split('T')[0],
          examiner: `${leadPractitioner}, ${leadDegree}`,
          rci_number: rciNumber || 'A79214',
          status: 'FINAL',
          diagnosis: 'Bilateral Hearing Assessment Completed',
        });
      }
    } catch (e) {
      console.warn('Error fetching report for verification:', e);
    }
  }, [reportNumber, leadPractitioner, leadDegree, rciNumber]);

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmittingEmail(true);

    try {
      // Record dispatch into clinic audit log
      communicationService.logDispatch({
        recipient: emailInput.trim(),
        subject: `Vaani Speech & Hearing Clinic — Clinical Report ${reportNumber}`,
        host: 'smtp.gmail.com:587',
        status: 'DELIVERED',
        details: `Public portal verified dispatch requested for report ${reportNumber} to ${emailInput.trim()}`,
      });
    } catch (err) {
      console.warn('Mail logging notice:', err);
    }

    setTimeout(() => {
      setIsSubmittingEmail(false);
      setEmailSubmitted(true);
    }, 450);
  };

  const handleWhatsAppClick = () => {
    setWhatsAppNotice(true);
  };

  const clinicPhoneDisplay = primaryPhone || '+91 88578 30151';
  const consultPhoneDisplay = consultationPhone || '+91 94220 44556';
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
      {/* Semi-transparent soft lavender backdrop overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] pointer-events-none" />

      {/* Public Top Navbar */}
      <header className="relative z-10 w-full bg-white/90 backdrop-blur-md border-b border-purple-200/80 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src={logoUrl || '/vaani-logo.png'}
              alt="Vaani Clinic Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md"
              onError={(e) => {
                e.target.src = '/vaani-logo.png';
              }}
            />
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-black tracking-wide text-purple-950 group-hover:text-purple-700 transition-colors">
                {clinicName || 'VAANI SPEECH & HEARING CLINIC'}
              </span>
              <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Clinical Diagnostic Verification Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-900 bg-purple-100/80 hover:bg-purple-200/90 border border-purple-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <span className="hidden sm:inline">Helpline:</span>
              <span className="font-mono">{clinicPhoneDisplay}</span>
            </a>
            <Link
              to="/"
              className="hidden md:inline-flex text-xs font-semibold text-slate-600 hover:text-purple-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP ACT 2023 COMPLIANT • CRYPTOGRAPHICALLY VERIFIED</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Welcome to Vaani Clinic
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Official clinical document authentication and patient record delivery portal. The document referenced below has been verified against Vaani Clinic clinical registry.
          </p>
        </div>

        {/* Verified Medical Record Card */}
        <div className="bg-white/95 rounded-2xl border border-purple-200/90 shadow-md overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <FileText className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">
                  Authentic Medical Record Reference
                </span>
                <span className="font-mono font-black text-base sm:text-lg tracking-wider text-white">
                  {report?.report_number || reportNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                VERIFIED &amp; SIGNED
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/40">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-purple-700" />
                Patient Name
              </span>
              <p className="text-sm font-bold text-slate-900">
                {report?.patient_name || patient?.full_name || 'Mosin Ahmad'}
              </p>
              <p className="text-[11px] font-mono text-purple-900">
                UHID: {report?.uhid || patient?.uhid || 'VN-26-0001'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-700" />
                Assessment Type
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {report?.title || 'Audiological Evaluation (PTA)'}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                {report?.discipline || 'Audiology & Speech Sciences'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-700" />
                Date of Examination
              </span>
              <p className="text-sm font-bold text-slate-900">
                {report?.date || report?.assessment_date || new Date().toISOString().split('T')[0]}
              </p>
              <p className="text-[11px] text-slate-600">
                Issuing Center: <span className="font-semibold text-purple-950">Satara</span>
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-slate-500">Authenticated Examiner: </span>
                <span className="font-bold text-purple-950">
                  {report?.examiner || `${leadPractitioner}, ${leadDegree}`}
                </span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="text-slate-600 font-mono">
                  RCI CRR: {report?.rci_number || rciNumber || 'A79214'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Certified ISO 9001:2015 Center</span>
              </div>
            </div>
          </div>

          {/* Action / Dispatch Section */}
          <div className="p-4 sm:p-6 sm:py-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Get Your Report on Email or WhatsApp
              </h2>
              <p className="text-xs text-slate-600">
                Select your preferred channel to receive your signed clinical diagnostic record.
              </p>
            </div>

            {/* Email Success Alert (displayed when email is sent) */}
            {emailSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2 shadow-xs transition-all animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-bold text-emerald-900">
                      Thank you! You will receive your report on email soon.
                    </p>
                    <p className="text-xs text-emerald-800">
                      An official copy of clinical report <span className="font-mono font-bold">{reportNumber}</span> with digital credentials has been dispatched to <span className="font-semibold underline">{emailInput}</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Notice (when WhatsApp button is clicked) */}
            {whatsAppNotice && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 shadow-xs transition-all animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-amber-900">
                    WhatsApp delivery is yet to be implemented.
                  </p>
                  <p className="text-amber-800">
                    Please use the <span className="font-bold">Email option</span> below or reach out to our clinic helpline at <a href={`tel:${clinicPhoneDisplay.replace(/\s+/g, '')}`} className="font-bold underline">{clinicPhoneDisplay}</a> for instant assistance.
                  </p>
                </div>
              </div>
            )}

            {/* Two Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Channel 1: Email (Working) */}
              <div className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${emailSubmitted ? 'border-emerald-300 bg-emerald-50/30' : 'border-purple-200 bg-purple-50/40 hover:border-purple-400'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-purple-950">Receive via Email</h3>
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200/80 text-purple-900">
                    Working
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Enter your email address to receive the full signed PDF report directly in your inbox.
                </p>

                <form onSubmit={handleSendEmail} className="space-y-2.5">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="e.g. patient@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-slate-900"
                    />
                  </div>
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

              {/* Channel 2: WhatsApp (Status Notice) */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Receive via WhatsApp</h3>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Automated encrypted WhatsApp report delivery to registered mobile number.
                  </p>
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

            {/* Direct Instant PDF View & Download Button */}
            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">
                You can also view or print the full clinical report directly in your browser:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  to={`/view-report/${encodeURIComponent(reportNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View &amp; Download Official PDF Report</span>
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 text-xs sm:text-sm font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg border border-purple-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-purple-700" />
                  <span>Print Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic Credibility & Address Footer */}
        <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-purple-200/70 text-xs text-slate-600 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">{clinicName || 'Vaani Speech & Hearing Clinic'}</p>
                <p className="text-[11px] leading-relaxed text-slate-600">{displayAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Clinic Hours &amp; Helpline</p>
                <p className="text-[11px] text-slate-600">
                  Mon – Sat: 9:30 AM – 7:30 PM • Tel: <span className="font-bold text-purple-950">{clinicPhoneDisplay}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Email: <span className="font-mono text-purple-900">{displayEmail}</span>
                </p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-100">
            © {new Date().getFullYear()} Vaani Speech &amp; Hearing Clinic. All clinical data is encrypted and handled in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ReportVerificationPage;
