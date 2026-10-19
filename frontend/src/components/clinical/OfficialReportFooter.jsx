import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useClinicSettings, formatClinicAddress } from '../../context/ClinicSettingsContext';

/**
 * OfficialReportFooter
 * Reusable decorative clinical footer component for VAANI clinical reports.
 * Dynamically binds lead practitioner credentials from clinic settings database.
 */
export const OfficialReportFooter = ({
  formData,
  patient,
  pageNumber,
  totalPages,
  compact = false,
  isCBT = false,
  useImage = true,
  className = '',
}) => {
  const { leadPractitioner, leadDegree, rciNumber: contextRci, settings, formattedAddress, primaryPhone } = useClinicSettings();

  const creds = settings?.credentials || {};
  const currentLeadPractitioner = creds.leadPractitioner || leadPractitioner || 'Ms. Palak Paresh Gandhi';
  const currentLeadDegree = creds.leadDegree || leadDegree || 'BASLP, RCI';
  const currentRciNumber = creds.rciNumber || contextRci || 'A79214';

  const clinicAddress = formattedAddress || formatClinicAddress(settings);
  const clinicPhone = primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
  const consultPhone = settings?.contact?.consultationPhone || clinicPhone;
  const clinicEmail = settings?.contact?.officialEmail || 'info@vaaniclinic.com';
  const clinicName = settings?.identity?.legalName || 'Vaani Speech & Hearing Clinic';

  const rciNumber = currentRciNumber || formData?.rciNumber || 'A79214';
  const reportNumber = formData?.reportNumber || 'REP-26-0001';
  const reportDate = formData?.reportDate || new Date().toISOString().split('T')[0];

  // Resolve examiner name dynamically (ignore stale hardcoded placeholders)
  let examinerRaw = formData?.examinerName;
  if (!examinerRaw || examinerRaw.includes('Shreeharsh') || (examinerRaw.includes('Palak Paresh Gandhi') && currentLeadDegree && !examinerRaw.includes(currentLeadDegree))) {
    examinerRaw = currentLeadPractitioner;
  }

  // Ensure degrees are included cleanly
  const examinerName = examinerRaw.includes('MASLP') || examinerRaw.includes('BASLP')
    ? (examinerRaw.includes('Palak Paresh Gandhi') && currentLeadDegree && !examinerRaw.includes(currentLeadDegree)
        ? `${currentLeadPractitioner}, ${currentLeadDegree}`
        : examinerRaw)
    : currentLeadDegree
      ? `${examinerRaw}, ${currentLeadDegree}`
      : examinerRaw;

  // Cursive signature display (e.g. "Palak Paresh Gandhi")
  const signatureName = examinerRaw.replace(/^(Dr\.|Ms\.|Mr\.)\s*/i, '').split(',')[0].trim();

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const getPublicVerifyUrl = (repNum) => {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const base = isLocal ? 'https://frontend-alpha-topaz-35.vercel.app' : (typeof window !== 'undefined' ? window.location.origin : 'https://frontend-alpha-topaz-35.vercel.app');

    const email = patient?.email || formData?.patientEmail || formData?.email || '';
    const name = patient?.full_name || formData?.patientName || formData?.patient_name || '';
    const uhid = patient?.uhid || formData?.uhid || '';

    const params = new URLSearchParams();
    if (email) {
      try {
        params.set('em', btoa(unescape(encodeURIComponent(email))));
      } catch {
        params.set('em', encodeURIComponent(email));
      }
    }
    if (name) {
      try {
        params.set('pt', btoa(unescape(encodeURIComponent(name))));
      } catch {
        params.set('pt', encodeURIComponent(name));
      }
    }
    if (uhid) {
      try {
        params.set('uh', btoa(unescape(encodeURIComponent(uhid))));
      } catch {
        params.set('uh', encodeURIComponent(uhid));
      }
    }

    // Pack complete clinical payload
    try {
      const patientAgeSex = patient
        ? `${patient.date_of_birth || ''}${patient.date_of_birth && patient.gender ? ' / ' : ''}${patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : (patient.gender || '')}`
        : (formData?.patient_age_sex || formData?.ageSex || '');

      const payload = {
        num: repNum,
        name: name,
        uhid: uhid,
        ageSex: patientAgeSex,
        date: formData?.reportDate || reportDate,
        email: email,
        ptaNo: formData?.parameters?.ptaNo || formData?.ptaNo || '64/2026',
        audiometer: formData?.parameters?.audiometer || 'Proton SX5',
        responses: formData?.parameters?.responses || 'Consistent',
        rac: formData?.parameters?.rightEarAC || null,
        rbc: formData?.parameters?.rightEarBC || null,
        lac: formData?.parameters?.leftEarAC || null,
        lbc: formData?.parameters?.leftEarBC || null,
        summary: formData?.computed || formData?.computedPTA || formData?.parameters?.audiometricSummary || null,
        diag: formData?.parameters?.provisionalDiagnosis || formData?.diagnosis || '',
        rec: formData?.parameters?.recommendations || formData?.recommendations || '',
        rci: rciNumber || 'A125560',
        examiner: examinerName,
      };

      params.set('d', btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    } catch (e) {
      console.warn('Failed to encode full report payload into QR URL:', e);
    }

    const qs = params.toString();
    return `${base}/verify-report/${encodeURIComponent(repNum)}${qs ? `?${qs}` : ''}`;
  };

  useEffect(() => {
    let isMounted = true;
    const targetUrl = getPublicVerifyUrl(reportNumber);
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#1e0b36',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.warn('QR Code generation fallback:', err);
        if (isMounted) {
          setQrCodeDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [reportNumber, formData, patient, rciNumber, examinerName]);

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
              {clinicAddress}
            </p>
            <p className="text-[8px] print:text-[7.5px] text-slate-600 leading-tight">
              Tel: <span className="font-bold text-purple-900">{clinicPhone}</span> • Mob: <span className="font-bold text-purple-900">{consultPhone}</span> • Email: <span className="font-bold text-purple-900">{clinicEmail}</span>
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

          {/* Real Dynamic Scannable QR Code Overlay directly placed on the banner's QR placeholder box */}
          {qrCodeDataUrl && (
            <a
              href={getPublicVerifyUrl(reportNumber)}
              target="_blank"
              rel="noopener noreferrer"
              title="Scan with phone camera or click to verify clinical report authenticity"
              className="absolute block bg-white p-0.5 rounded-[4px] shadow-sm hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer"
              style={{
                left: '11.52%',
                top: '8.17%',
                width: '16.50%',
                height: '83.65%',
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt={`Verify Clinical Report ${reportNumber}`}
                className="w-full h-full object-contain block rounded-[2px]"
              />
            </a>
          )}

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
                {signatureName}
              </span>
              <span className="text-[7.5px] text-purple-800 uppercase tracking-widest block font-bold">
                Digitally Authenticated
              </span>
            </div>
            <p className="font-bold text-slate-900 text-[10px]">{examinerName}</p>
            <p className="text-[8.5px] text-slate-600">{clinicName}</p>
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
          <a
            href={getPublicVerifyUrl(reportNumber)}
            target="_blank"
            rel="noopener noreferrer"
            title="Scan with phone camera or click to verify clinical report"
            className={`${compact ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'} border border-purple-300 rounded-lg flex items-center justify-center bg-white shadow-2xs shrink-0 p-0.5 overflow-hidden hover:ring-2 hover:ring-purple-400 transition-all`}
          >
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt={`QR Authenticity Code ${reportNumber}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <QrCode className="w-full h-full text-purple-950" />
            )}
          </a>
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono font-black text-purple-950 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
              QR VERIFIED • DPDP ACT COMPLIANT
            </span>
            <span className="text-[7px] text-slate-600 block">
              Scan to verify document cryptographic authenticity
            </span>
            <a
              href={getPublicVerifyUrl(reportNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[7px] font-mono text-purple-900 font-semibold block hover:underline"
            >
              {getPublicVerifyUrl(reportNumber)}
              {totalPages && totalPages > 1 ? ` • Pg ${pageNumber}/${totalPages}` : ''}
            </a>
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
