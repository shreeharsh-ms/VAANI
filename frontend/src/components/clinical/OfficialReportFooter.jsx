import React from 'react';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

/**
 * OfficialReportFooter
 * Reusable decorative clinical footer component for VAANI clinical reports.
 * Dynamically binds lead practitioner credentials from clinic settings database.
 */
export const OfficialReportFooter = ({
  formData,
  pageNumber,
  totalPages,
  compact = false,
  isCBT = false,
  useImage = true,
  className = '',
}) => {
  const { leadPractitioner, leadDegree, rciNumber: contextRci, settings } = useClinicSettings();

  const creds = settings?.credentials || {};
  const currentLeadPractitioner = creds.leadPractitioner || leadPractitioner || 'Ms. Palak Paresh Gandhi';
  const currentLeadDegree = creds.leadDegree || leadDegree || 'MASLP, RCI';
  const currentRciNumber = creds.rciNumber || contextRci || 'A79214';

  const rciNumber = currentRciNumber || formData?.rciNumber || 'A79214';
  const reportNumber = formData?.reportNumber || 'REP-26-0001';
  const reportDate = formData?.reportDate || new Date().toISOString().split('T')[0];

  // Resolve examiner name dynamically (ignore stale hardcoded placeholders)
  let examinerRaw = formData?.examinerName;
  if (!examinerRaw || examinerRaw.includes('Shreeharsh')) {
    examinerRaw = currentLeadPractitioner;
  }

  // Ensure degrees are included cleanly
  const examinerName = examinerRaw.includes('MASLP') || examinerRaw.includes('BASLP')
    ? examinerRaw
    : currentLeadDegree
      ? `${examinerRaw}, ${currentLeadDegree}`
      : examinerRaw;

  // Cursive signature display (e.g. "Palak Paresh Gandhi")
  const signatureName = examinerRaw.replace(/^(Dr\.|Ms\.|Mr\.)\s*/i, '').split(',')[0].trim();

  const isLastPage = !totalPages || totalPages <= 1 || (pageNumber && pageNumber === totalPages);

  // For intermediate pages (Page 1 of 2, Page 1 of 3, etc.):
  // Render clean clinical footer with address, contact number, email, and page number / total number
  if (!isLastPage) {
    return (
      <div className={`official-report-intermediate-footer mt-auto pt-2 pb-3 px-7 sm:px-8 shrink-0 select-none print:break-inside-avoid ${className}`}>
        {/* Subtle decorative divider flourish */}
        <div className="flex items-center justify-center gap-2 mb-1.5 text-purple-400">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          <span className="text-[8px] text-purple-800">✦ ❖ ✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        </div>

        <div className="flex items-end justify-between gap-3 text-[8.5px] print:text-[8px] text-slate-700 px-1 py-0.5">
          {/* Clinic Address & Contact Info */}
          <div className="text-left space-y-0.5">
            <p className="font-bold text-purple-950 text-[9px] print:text-[8.5px] leading-tight">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
            </p>
            <p className="text-[8px] print:text-[7.5px] text-slate-600 leading-tight">
              Tel: <span className="font-bold text-purple-900">+91 2162 234567</span> • Mob: <span className="font-bold text-purple-900">+91 94220 11223</span> • Email: <span className="font-bold text-purple-900">clinic@vaaniclinic.com</span>
            </p>
          </div>

          {/* Page Number & Document Reference */}
          <div className="text-right shrink-0 flex items-center gap-2">
            <span className="font-mono text-[8px] print:text-[7.5px] font-bold text-slate-600 bg-purple-50/90 px-2 py-0.5 rounded border border-purple-200">
              {reportNumber}
            </span>
            <span className="font-mono font-bold text-[9px] print:text-[8.5px] text-purple-950 bg-white px-2.5 py-0.5 rounded border border-purple-300 shadow-2xs">
              Page {pageNumber} / {totalPages}
            </span>
          </div>
        </div>

        <p className="text-[6.5px] print:text-[6px] text-center text-slate-400 mt-1 leading-tight">
          Strictly Confidential Medical Record under DPDP Act 2023 • Vaani Speech &amp; Hearing Clinic
        </p>
      </div>
    );
  }

  // Use the official decorative footer banner for the LAST page (or single-page reports)
  if (useImage) {
    return (
      <div className={`official-report-footer shrink-0 w-full m-0 p-0 select-none mt-auto ${className}`}>
        <div className="relative w-full overflow-hidden">
          {/* User's custom official footer banner - uncropped, full width, zero border-radius */}
          <img
            src="/vaani-footer-banner.png"
            alt="Vaani Speech and Hearing Clinic Official Footer"
            className="w-full h-auto block rounded-none"
          />


          {/* Clinician Digital Authentication & Signature Block in the open right area */}
          <div className="absolute right-[5%] top-[10%] bottom-[10%] flex flex-col justify-center text-right">
            <div className="inline-block border-b border-purple-900/60 pb-0.5 mb-0.5 text-right">
              <span className="font-serif italic font-bold text-purple-950 text-[11px] sm:text-xs print:text-[11px] block leading-none">
                {signatureName}
              </span>
              <span className="text-[6.5px] print:text-[6px] text-purple-800 uppercase tracking-widest font-bold flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-2 h-2 text-emerald-600 inline" />
                Digitally Authenticated
              </span>
            </div>
            <p className="font-black text-slate-950 text-[9px] print:text-[8px] leading-tight">
              {examinerName}
            </p>
            <p className="text-[7.5px] print:text-[7px] font-semibold text-slate-800">
              RCI CRR No: <span className="font-mono font-bold text-purple-950 bg-white/80 px-1 py-0.2 rounded border border-purple-200">{rciNumber}</span>
            </p>
            <p className="text-[7px] print:text-[6.5px] text-slate-600 font-medium">
              {isCBT ? 'RCI Registered Practitioner & Psychological Counselor' : 'Consultant Audiologist & Speech-Language Pathologist'}
            </p>
          </div>
        </div>

        {/* Subtle legal disclaimer below banner */}
        <p className="text-[6.5px] print:text-[6px] text-center text-slate-500 py-0.5 leading-tight">
          Strictly Confidential Medical Record under DPDP Act 2023 • Valid without physical ink signature
        </p>
      </div>
    );
  }

  if (isCBT) {
    return (
      <div className={`official-report-footer mt-auto pt-2 shrink-0 print:break-inside-avoid ${className}`}>
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-2 mb-1.5 text-purple-400">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-200 via-purple-800 to-purple-200" />
          <span className="text-[9px] text-purple-900 tracking-widest font-serif">✦ ❖ ✦</span>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-200 via-purple-800 to-purple-200" />
        </div>

        <div className="bg-gradient-to-r from-purple-100/70 via-white to-purple-50/70 border border-purple-200 rounded-xl p-2 px-3 flex items-end justify-between text-xs">
          <div className="text-[9.5px] space-y-0.5 text-slate-800">
            <p>
              Date: <span className="font-semibold">{reportDate}</span>
            </p>
            <p>
              Place: <span className="font-semibold">Satara</span>
            </p>
            <p className="text-[8px] font-mono text-purple-900">
              Ref: {reportNumber}
            </p>
          </div>

          <div className="text-center space-y-0.5">
            <div className="w-48 border-b-2 border-purple-900 pb-0.5 mb-1 text-center">
              <span className="font-serif italic font-bold text-purple-950 text-xs block">
                Palak Paresh Gandhi
              </span>
              <span className="text-[7.5px] text-purple-800 uppercase tracking-widest block font-bold">
                Digitally Authenticated
              </span>
            </div>
            <p className="font-bold text-slate-900 text-[10px]">CBT Lead &amp; Psychological Counselor</p>
            <p className="text-[8.5px] text-slate-600">Vani's Speech, Hearing &amp; Counselling Clinic</p>
          </div>
        </div>

        <p className="text-[7.5px] text-center text-slate-500 mt-1">
          Strictly Confidential Medical Record • DPDP Act 2023 Compliant • Valid without physical ink signature
        </p>
      </div>
    );
  }

  return (
    <div className={`official-report-footer mt-auto pt-1.5 print:pt-1 shrink-0 print:break-inside-avoid ${compact ? 'pt-0.5' : ''} ${className}`}>
      {/* Ornamental dual flourish divider */}
      <div className="flex items-center justify-center gap-2 mb-1 print:mb-0.5 text-purple-400">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-200 via-purple-800 to-purple-200" />
        <span className="text-[8px] text-purple-900 tracking-widest font-serif">✦ ❖ ✦</span>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-200 via-purple-800 to-purple-200" />
      </div>

      {/* Decorative Lavender Footer Container */}
      <div className={`bg-gradient-to-r from-purple-100/80 via-[#faf7ff] to-purple-100/75 border border-purple-200/90 rounded-xl ${compact ? 'p-1.5 px-2' : 'p-1.5 px-2.5'} flex items-end justify-between text-xs shadow-2xs`}>
        {/* Left: Tamper-Evident DPDP QR Code Authenticity Badge */}
        <div className="flex items-center gap-2">
          <div className={`${compact ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'} border border-purple-300 rounded-lg flex items-center justify-center bg-white shadow-2xs shrink-0 p-0.5`}>
            <QrCode className="w-full h-full text-purple-950" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono font-black text-purple-950 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
              QR VERIFIED • DPDP ACT COMPLIANT
            </span>
            <span className="text-[7px] text-slate-600 block">
              Scan to verify document cryptographic authenticity
            </span>
            <span className="text-[7px] font-mono text-purple-900 font-semibold block">
              https://vaaniclinic.com/verify-doc/{reportNumber}
              {totalPages && totalPages > 1 ? ` • Pg ${pageNumber}/${totalPages}` : ''}
            </span>
          </div>
        </div>

        {/* Center: ISO & Clinical Trust Clause (visible on wider screens) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center px-2">
          <span className="text-[7.5px] uppercase font-bold tracking-widest text-purple-900/90">
            VAANI CLINICAL INTELLIGENCE
          </span>
          <span className="text-[7px] text-slate-500 font-medium">
            Certified ISO 9001:2015 Center
          </span>
        </div>

        {/* Right: Clinician Digital Authentication Block */}
        <div className="text-right space-y-0.5">
          <div className="inline-block border-b border-purple-900 pb-0.5 mb-0.5 px-2.5 text-center">
            <span className="font-serif italic font-bold text-purple-950 text-xs sm:text-sm block tracking-wide leading-none">
              {signatureName}
            </span>
            <span className="text-[7px] text-purple-800 uppercase tracking-widest font-bold flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline" />
              Digitally Authenticated
            </span>
          </div>
          <p className="font-black text-slate-950 text-[10px] leading-tight">
            {examinerName}
          </p>
          <p className="text-[8.5px] font-semibold text-slate-800">
            RCI CRR No: <span className="font-mono font-bold text-purple-950 bg-purple-100/90 px-1 py-0.2 rounded">{rciNumber}</span>
          </p>
          <p className="text-[7.5px] text-slate-600 font-medium">
            Consultant Audiologist &amp; Speech-Language Pathologist
          </p>
        </div>
      </div>

      {/* Statutory Legal Disclaimer */}
      <p className="text-[7px] text-center text-slate-500 mt-0.5 leading-tight">
        This electronic medical record is strictly confidential under the Digital Personal Data Protection Act (DPDP) 2023. Valid without physical ink signature.
      </p>
    </div>
  );
};

export default OfficialReportFooter;
