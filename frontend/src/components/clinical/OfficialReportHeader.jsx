import React from 'react';
import { ShieldCheck, Award, FileText } from 'lucide-react';

/**
 * OfficialReportHeader
 * Reusable decorative clinical letterhead component for VAANI clinical reports.
 * Features:
 * - Rich lavender / royal purple clinical theme
 * - Clinic branding with official Vaani logo
 * - RCI CRR No. A79214 official seal & ISO 9001:2015 certification badges
 * - Structured metadata pill (Report No, Date, Discipline, Page count)
 * - Ornamental divider flourish
 */
export const OfficialReportHeader = ({
  formData,
  service,
  pageNumber,
  totalPages,
  discipline,
  compact = false,
  isCBT = false,
  useImage = true,
  className = '',
}) => {
  const rciNumber = formData?.rciNumber || 'A79214';
  const reportNumber = formData?.reportNumber || 'REP-26-4829';
  const reportDate = formData?.reportDate || new Date().toISOString().split('T')[0];
  const disciplineName = discipline || service?.discipline || 'AUDIOLOGY';

  // Official header banner using the user's custom high-resolution letterhead
  if (useImage) {
    return (
      <div className={`official-report-header shrink-0 w-full m-0 p-0 mb-3 select-none ${className}`}>
        <div className="relative w-full overflow-hidden">
          {/* User's custom official banner - uncropped, 100% full width edge-to-edge, zero border-radius */}
          <img
            src="/vaani-header-banner.png"
            alt="Vaani Speech and Hearing Clinic"
            className="w-full h-auto block rounded-none"
          />

          {/* Clinic Address, Contact Number & Email directly below SPEAK • HEAR • CONNECT */}
          <div className="absolute left-[40.2%] top-[72%] right-[4%] bottom-[4%] flex flex-col justify-center">
            <p className="text-[9px] sm:text-[10px] print:text-[8px] font-semibold text-purple-950 tracking-wide leading-tight">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
            </p>
            <p className="text-[8px] sm:text-[9px] print:text-[7.5px] font-medium text-slate-700 tracking-tight leading-tight mt-0.5">
              Tel: <span className="font-bold text-purple-900">+91 2162 234567</span> • Mob: <span className="font-bold text-purple-900">+91 94220 11223</span> • Email: <span className="font-bold text-purple-900">clinic@vaaniclinic.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCBT) {
    return (
      <div className={`official-report-header mb-2.5 shrink-0 ${className}`}>
        {/* Top decorative gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-900 via-indigo-600 to-purple-800 rounded-full mb-2 print:mb-1.5" />

        <div className="bg-gradient-to-r from-purple-100/80 via-white to-purple-50/70 border border-purple-200 rounded-xl p-2.5 px-3.5 flex items-start justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <h1 className="font-serif font-black text-sm tracking-wide text-purple-950 uppercase">
              VANI'S SPEECH &amp; HEARING CLINIC
            </h1>
            <p className="text-[10px] font-bold text-slate-700">
              Center for Audiology, Speech-Language Pathology &amp; Psychological Counselling
            </p>
            <p className="text-[9px] text-slate-600">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002 • Tel: +91 2162 234567 • clinic@vaaniclinic.com
            </p>
          </div>

          <div className="text-right shrink-0 space-y-0.5">
            <h2 className="font-bold text-xs text-purple-950">
              Ms. Palak Paresh Gandhi &amp; CBT Team
            </h2>
            <p className="text-[9.5px] font-semibold text-slate-700">
              RCI Registered Practitioner &amp; Psychological Counselor
            </p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="font-mono text-[9px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                {reportNumber}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                {reportDate}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 my-1.5 text-purple-400">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          <span className="text-[9px] text-purple-800">✦ ❖ ✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        </div>
      </div>
    );
  }


  return (
    <div className={`official-report-header mb-1.5 shrink-0 ${compact ? 'mb-1' : ''} ${className}`}>
      {/* Top ornamental lavender/purple dual bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-900 via-indigo-600 to-purple-800 rounded-full mb-1.5 print:mb-1" />

      {/* Decorative Lavender Header Container */}
      <div className={`bg-gradient-to-r from-purple-100/85 via-[#faf7ff] to-purple-100/75 border border-purple-200/90 rounded-xl ${compact ? 'p-1.5 px-2.5' : 'p-2 px-3'} flex items-start justify-between gap-3 shadow-2xs`}>
        {/* Left: Clinic Logo & Institutional Accreditations */}
        <div className="flex items-center gap-3">
          <img
            src="/vaani-logo.png"
            alt="Vaani Speech and Hearing Clinic"
            className={`${compact ? 'h-10' : 'h-11 sm:h-12'} w-auto object-contain shrink-0 drop-shadow-2xs`}
          />
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5 text-[9.5px]">
              <span className="inline-flex items-center gap-1 bg-purple-900 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded-sm shadow-2xs">
                <ShieldCheck className="w-2.5 h-2.5 text-purple-200" />
                RCI CRR No: {rciNumber}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/95 text-purple-900 border border-purple-200 font-semibold text-[8.5px] px-1.5 py-0.5 rounded-sm">
                <Award className="w-2.5 h-2.5 text-amber-600" />
                ISO 9001:2015
              </span>
              <span className="text-[8.5px] text-slate-600 font-medium hidden sm:inline">
                RCI Approved Practice Center
              </span>
            </div>

            <p className="text-[9.5px] text-slate-800 font-medium">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
            </p>
            <p className="text-[8.5px] text-slate-500 font-normal">
              Tel: +91 2162 234567 • Mob: +91 94220 11223 • Email: clinic@vaaniclinic.com
            </p>
          </div>
        </div>

        {/* Right: Structured Document Identification Card */}
        <div className="text-right shrink-0 space-y-0.5">
          <div className="bg-white/95 border border-purple-200 rounded-lg p-1.5 px-2.5 text-right shadow-2xs space-y-0.5">
            <div className="flex items-center justify-end gap-1.5">
              <FileText className="w-3 h-3 text-purple-700" />
              <span className="text-[10px] font-mono font-black text-purple-950">
                {reportNumber}
              </span>
            </div>
            <div className="text-[8.5px] text-slate-600 font-medium">
              Date: <span className="font-semibold text-slate-800">{reportDate}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-0.5">
              <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-purple-900 text-white rounded">
                {disciplineName}
              </span>
              {totalPages && totalPages > 1 && (
                <span className="inline-block px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider bg-purple-100 text-purple-950 rounded border border-purple-300">
                  Pg {pageNumber}/{totalPages}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative divider flourish */}
      <div className="flex items-center justify-center gap-2 my-1 print:my-0.5 text-purple-400">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        <span className="text-[8px] text-purple-800 tracking-widest font-serif">✦ ❖ ✦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
      </div>
    </div>
  );
};

export default OfficialReportHeader;
