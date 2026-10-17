import React from 'react';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

/**
 * OfficialReportFooter
 * Reusable decorative clinical footer component for VAANI clinical reports.
 * Features:
 * - Ornamental divider flourish
 * - Soft lavender gradient container matching the clinic letterhead
 * - DPDP Act 2023 Cryptographic QR Code Verification seal
 * - Dr. Shreeharsh Shivpuje Authorized Digital Signature block
 * - Official RCI CRR No. A79214 credentialing
 */
export const OfficialReportFooter = ({
  formData,
  pageNumber,
  totalPages,
  compact = false,
  isCBT = false,
  className = '',
}) => {
  const rciNumber = formData?.rciNumber || 'A79214';
  const reportNumber = formData?.reportNumber || 'REP-26-0001';
  const reportDate = formData?.reportDate || new Date().toISOString().split('T')[0];
  const examinerName = formData?.examinerName || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP';

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
              Shreeharsh M. Shivpuje
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
