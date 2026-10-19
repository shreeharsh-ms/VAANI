import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, X, ShieldCheck, QrCode, Mail, MessageSquare } from 'lucide-react';
import OfficialClinicalDocument from '../../components/clinical/OfficialClinicalDocument';
import { EmailDispatchModal, WhatsAppDispatchModal } from '../../components/common/CommunicationModal';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { SEED_PATIENTS, PATIENT_DOSSIERS } from '../../data/patientClinicalProfiles';
import { getAllClinicalReports } from '../../data/clinicalReportsData';
import { useClinicSettings, formatClinicAddress, CLINIC_SETTINGS_EVENT } from '../../context/ClinicSettingsContext';

export const ReportViewPage = ({ isPublic = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const clinic = useClinicSettings();
  const settings = clinic.settings;
  const [reportData, setReportData] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const handleClose = () => {
    try {
      if (window.opener) {
        window.close();
        return;
      }
    } catch {}
    if (isPublic) {
      navigate(`/verify-report/${encodeURIComponent(reportData?.reportNumber || id || '')}`);
    } else {
      navigate(-1);
    }
  };

  const loadReport = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const isPreviewParam = searchParams.get('preview') === '1' || searchParams.get('preview') === 'true';

    // Helper: read preview payload from localStorage or sessionStorage
    const getPreviewPayload = () => {
      try {
        const local = localStorage.getItem('vaani_preview_report');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && (!id || id === 'preview' || parsed.reportNumber === id || parsed.id === id)) {
            return parsed;
          }
        }
      } catch (e) {}
      try {
        const session = sessionStorage.getItem('vaani_preview_report');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed && (!id || id === 'preview' || parsed.reportNumber === id || parsed.id === id)) {
            return parsed;
          }
        }
      } catch (e) {}
      return null;
    };

    // 1. If explicitly in preview mode or id === 'preview', check preview payload first
    if (isPreviewParam || id === 'preview') {
      const preview = getPreviewPayload();
      if (preview) {
        setReportData(preview);
        return;
      }
    }

    // 2. Persistent Registry: Check localStorage (getAllClinicalReports) FIRST for any real report id
    if (id && id !== 'preview') {
      try {
        const allReports = getAllClinicalReports();
        const match = allReports.find(
          (r) =>
            r.id === id ||
            r.report_number === id ||
            r.report_number?.toLowerCase() === id.toLowerCase() ||
            r.id?.toLowerCase() === id.toLowerCase()
        );

        if (match) {
          const srv = CLINICAL_SERVICES.find((s) => s.code === match.service_code) || {
            code: match.service_code || 'RP-CLN-AUD',
            title: match.title,
            discipline: match.discipline,
            description: match.diagnosis,
            defaultParameters: {},
          };

          const allPatients = (() => {
            try {
              const p = localStorage.getItem('vaani_patients_v1');
              if (p) {
                const parsedP = JSON.parse(p);
                if (Array.isArray(parsedP) && parsedP.length > 0) return [...parsedP, ...SEED_PATIENTS];
              }
            } catch {}
            return SEED_PATIENTS;
          })();

          const patientMatch = allPatients.find(
            (p) =>
              (p.uhid && match.uhid && p.uhid.toLowerCase() === match.uhid.toLowerCase()) ||
              (p.full_name && match.patient_name && p.full_name.toLowerCase() === match.patient_name.toLowerCase())
          );

          const patient = patientMatch || {
            full_name: match.patient_name,
            uhid: match.uhid,
            gender: match.patient_age_sex?.toLowerCase().includes('female') ? 'FEMALE' : 'MALE',
            date_of_birth: match.patient_age_sex?.split(',')[1]?.trim() || '—',
            phone: match.phone || '+91 98220 11223',
            guardian_name: match.guardian || 'Self',
            city: match.city || 'Satara, Maharashtra',
          };
          const dossier = (patient.uhid && PATIENT_DOSSIERS[patient.uhid]) || null;

          // Merge parameters deeply so nested frequency thresholds are preserved
          const defParams = srv.defaultParameters || {};
          const matchParams = match.parameters || {};

          const mergedParameters = {
            ...defParams,
            ...matchParams,
            rightEarAC: { ...(defParams.rightEarAC || {}), ...(matchParams.rightEarAC || {}) },
            rightEarBC: { ...(defParams.rightEarBC || {}), ...(matchParams.rightEarBC || {}) },
            leftEarAC: { ...(defParams.leftEarAC || {}), ...(matchParams.leftEarAC || {}) },
            leftEarBC: { ...(defParams.leftEarBC || {}), ...(matchParams.leftEarBC || {}) },
            provisionalDiagnosis: match.diagnosis || matchParams.provisionalDiagnosis || defParams.provisionalDiagnosis,
            recommendations: match.recommendations || matchParams.recommendations || defParams.recommendations,
          };

          // Recompute PTA if not stored
          let computed = match.computed;
          if (!computed && ['RP-CLN-AUD', 'RP-CLN-AAE'].includes(srv.code)) {
            const rAC = mergedParameters.rightEarAC || {};
            const lAC = mergedParameters.leftEarAC || {};
            const rAvg = Math.round(((Number(rAC['500'] || 0) + Number(rAC['1000'] || 0) + Number(rAC['2000'] || 0)) / 3) * 10) / 10;
            const lAvg = Math.round(((Number(lAC['500'] || 0) + Number(lAC['1000'] || 0) + Number(lAC['2000'] || 0)) / 3) * 10) / 10;
            const classify = (avg) => {
              if (avg <= 25) return 'Normal Hearing Sensitivity';
              if (avg <= 40) return 'Mild Hearing Loss';
              if (avg <= 55) return 'Moderate Hearing Loss';
              if (avg <= 70) return 'Moderately Severe Hearing Loss';
              if (avg <= 90) return 'Severe Hearing Loss';
              return 'Profound Hearing Loss';
            };
            computed = {
              rightAvg: rAvg,
              leftAvg: lAvg,
              rightDegree: classify(rAvg),
              leftDegree: classify(lAvg),
            };
          }

          const leadPractitioner = settings?.credentials?.leadPractitioner || clinic.leadPractitioner || 'Ms. Palak Paresh Gandhi';
          const leadDegree = settings?.credentials?.leadDegree || clinic.leadDegree || 'BASLP, RCI';
          const defaultExaminer = `${leadPractitioner}${leadDegree ? `, ${leadDegree}` : ''}`;
          const defaultRci = settings?.credentials?.rciNumber || clinic.rciNumber || 'A79214';

          const isStandardExaminer = !match.examiner || match.examiner.includes('Palak Paresh Gandhi') || match.examiner.includes('Shreeharsh');
          const resolvedExaminer = isStandardExaminer ? defaultExaminer : match.examiner;

          setReportData({
            reportNumber: match.report_number || match.id,
            reportDate: match.date || new Date().toISOString().split('T')[0],
            examinerName: resolvedExaminer,
            rciNumber: defaultRci,
            service: srv,
            patient: patient,
            patientDossier: dossier,
            parameters: mergedParameters,
            computedPTA: computed || null,
          });
          return;
        }
      } catch (e) {
        console.warn('Error reading reports in ReportViewPage', e);
      }
    }

    // 3. Fallback to preview payload if available
    const preview = getPreviewPayload();
    if (preview) {
      setReportData(preview);
      return;
    }

    // 4. Ultimate fallback: Default PTA proforma
    const srv = CLINICAL_SERVICES[0];
    const patient = SEED_PATIENTS[0];
    const fallbackLead = settings?.credentials?.leadPractitioner || clinic.leadPractitioner || 'Ms. Palak Paresh Gandhi';
    const fallbackDegree = settings?.credentials?.leadDegree || clinic.leadDegree || 'BASLP, RCI';
    const fallbackExaminer = `${fallbackLead}${fallbackDegree ? `, ${fallbackDegree}` : ''}`;
    const fallbackRci = settings?.credentials?.rciNumber || clinic.rciNumber || 'A79214';

    setReportData({
      reportNumber: id || 'REP-26-0001',
      reportDate: new Date().toISOString().split('T')[0],
      examinerName: fallbackExaminer,
      rciNumber: fallbackRci,
      service: srv,
      patient: patient,
      patientDossier: PATIENT_DOSSIERS[patient.uhid] || null,
      parameters: srv.defaultParameters,
      computedPTA: {
        rightAvg: 31.7,
        leftAvg: 25.0,
        rightDegree: 'Mild Hearing Loss',
        leftDegree: 'Normal Hearing Sensitivity',
      },
    });
  };

  useEffect(() => {
    loadReport();

    const handleStorageChange = (e) => {
      if (
        e.key === 'vaani_clinical_reports_v1' ||
        e.key === 'vaani_preview_report' ||
        e.key === 'vaani_clinic_settings_v1' ||
        !e.key
      ) {
        loadReport();
      }
    };
    const handleCustomUpdate = () => {
      loadReport();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('vaani_reports_updated', handleCustomUpdate);
    window.addEventListener(CLINIC_SETTINGS_EVENT, handleCustomUpdate);
    window.addEventListener('focus', loadReport);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('vaani_reports_updated', handleCustomUpdate);
      window.removeEventListener(CLINIC_SETTINGS_EVENT, handleCustomUpdate);
      window.removeEventListener('focus', loadReport);
    };
  }, [id, settings]);

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    // Give browser 80ms to remove any inline transform/scale from DOM before opening system print dialog
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 80);
  };

  // Keyboard shortcut for print (Cmd/Ctrl + P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-trigger print if requested via query parameter ?print=1
  useEffect(() => {
    if (reportData) {
      document.title = `${reportData.reportNumber} - ${reportData.patient?.full_name || 'Patient'} - Vaani Clinic Official Report`;
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('print') === '1') {
        const timer = setTimeout(() => {
          handlePrint();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [reportData]);

  const [fitToScreen, setFitToScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 794;
    }
    return false;
  });
  const [scaleRatio, setScaleRatio] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const availableWidth = window.innerWidth - 16;
      if (availableWidth < 794) {
        setScaleRatio(Math.max(0.35, availableWidth / 794));
      } else {
        setScaleRatio(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600 text-xs">
        Loading clinical proforma document...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans print:bg-white print:p-0">
      
      {/* ── TOP FLOATING CONTROL BAR (Hidden during Print) ── */}
      <header className="print:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 p-2.5 sm:px-4 sm:py-2.5 shadow-xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Top line on mobile / Left group on desktop */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-black text-slate-900 tracking-tight shrink-0 hidden sm:inline">
              Official Report Preview
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs font-mono font-bold text-purple-900 shrink-0">
              {reportData.reportNumber}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-700 truncate">
              {reportData.patient?.full_name} <span className="text-slate-400 font-mono text-[11px]">({reportData.patient?.uhid})</span>
            </span>
          </div>

          {/* Close button on mobile right */}
          <button
            type="button"
            onClick={handleClose}
            className="sm:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
            title="Close this tab"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons: on mobile 3 columns (WhatsApp, Email, Print PDF) */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded shadow-xs transition-colors cursor-pointer"
            title="Dispatch WhatsApp Notification"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMailModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded shadow-xs transition-colors cursor-pointer"
            title="Dispatch Email with Official Clinical PDF Attachment"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Email</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Print PDF</span>
            <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.2 bg-purple-800 text-[10px] rounded font-mono">⌘P</kbd>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
            title="Close this report view"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isPublic ? 'Back' : 'Close'}</span>
          </button>
        </div>
      </header>

      {/* ── A4 CLINICAL DOCUMENT PAPER CANVAS ── */}
      <main className="py-3 px-2 sm:py-6 sm:px-4 print:p-0 print:m-0 flex flex-col items-center">
        {/* Mobile View Toggle Bar */}
        <div className="sm:hidden w-full max-w-sm mb-2.5 bg-white border border-purple-200 rounded-lg p-2 flex items-center justify-between text-xs shadow-2xs print:hidden">
          <div className="flex items-center gap-1.5 text-purple-950 font-semibold text-[11px]">
            <span>📄 Official A4 Proforma</span>
          </div>
          <button
            type="button"
            onClick={() => setFitToScreen(!fitToScreen)}
            className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-950 font-bold text-[10px] shadow-2xs cursor-pointer active:scale-95 transition-all"
          >
            {fitToScreen ? '🔍 100% Size (Scroll)' : '📐 Fit Screen'}
          </button>
        </div>

        <div className="w-full overflow-x-auto pb-10 flex justify-start md:justify-center scrollbar-thin print:overflow-visible print:p-0 print:m-0 print:pb-0">
          <div
            style={
              fitToScreen && !isPrinting
                ? {
                    transform: `scale(${scaleRatio})`,
                    transformOrigin: 'top left',
                    width: '210mm',
                    minWidth: '210mm',
                    marginBottom: `-${(1 - scaleRatio) * 1120}px`,
                  }
                : {
                    width: '210mm',
                    minWidth: '210mm',
                  }
            }
            className="print-page-wrapper bg-white border border-slate-300 rounded shadow-xl print:border-none print:shadow-none print:max-w-none print:w-[210mm] print:min-w-[210mm] print:rounded-none shrink-0 transition-all duration-200 print:transform-none print:m-0 print:p-0"
          >
            <OfficialClinicalDocument
              service={reportData.service}
              patient={reportData.patient}
              patientDossier={reportData.patientDossier}
              formData={reportData}
              computedPTA={reportData.computedPTA}
            />
          </div>
        </div>
      </main>

      {/* Communication Modals */}
      {reportData && (() => {
        const clinicAddress = clinic.formattedAddress || formatClinicAddress(settings);
        const clinicHelpline = clinic.primaryPhone || settings?.contact?.primaryPhone || '+91 8857830151';
        const clinicTitle = settings?.identity?.letterheadTitle || settings?.identity?.legalName || 'Vaani Speech & Hearing Rehabilitation Clinic';
        const docDetails = clinic.doctorDetails || {};
        const doctorName = settings?.credentials?.leadPractitioner || clinic.leadPractitioner || docDetails.doctorName || 'Ms. Palak Paresh Gandhi';
        const doctorDegree = settings?.credentials?.leadDegree || clinic.leadDegree || docDetails.degree || 'BASLP, RCI';
        const doctorRci = settings?.credentials?.rciNumber || clinic.rciNumber || docDetails.rci || 'A79214';

        const examinerText = reportData.examinerName && !reportData.examinerName.includes('Shreeharsh')
          ? (reportData.examinerName.includes('RCI') ? reportData.examinerName : `${reportData.examinerName} (RCI No. ${doctorRci})`)
          : `${doctorName}${doctorDegree ? `, ${doctorDegree}` : ''} (RCI No. ${doctorRci})`;

        const defaultWhatsAppMsg = `*${clinicTitle}*\n\n` +
          `Dear *${reportData.patient?.full_name || 'Patient'}*,\n` +
          `Your official clinical record *${reportData.reportNumber}* (${reportData.service?.title || 'Audiological Evaluation'}) has been verified and registered.\n\n` +
          `Examiner: ${examinerText}\n` +
          `Clinic Address: ${clinicAddress}\n` +
          `Helpline: ${clinicHelpline}`;

        const defaultEmailMsg = `Dear ${reportData.patient?.full_name || 'Patient'},\n\n` +
          `Please find attached the official summary of your clinical assessment recorded at ${clinicTitle}:\n\n` +
          `• Report ID: ${reportData.reportNumber}\n` +
          `• Assessment: ${reportData.service?.title || 'Audiological Evaluation (PTA)'}\n` +
          `• Examination Date: ${reportData.reportDate || reportData.date || new Date().toLocaleDateString('en-IN')}\n` +
          `• Attending Clinician: ${examinerText}\n` +
          `• Clinic Address: ${clinicAddress}\n\n` +
          `This record is compliant with RCI Standards & the Digital Personal Data Protection (DPDP) Act 2023.\n\n` +
          `Warm regards,\n` +
          `${clinicTitle}\n` +
          `Helpline: ${clinicHelpline} | Satara, Maharashtra`;

        return (
          <>
            <WhatsAppDispatchModal
              isOpen={isWhatsAppModalOpen}
              onClose={() => setIsWhatsAppModalOpen(false)}
              recipientName={reportData.patient?.full_name || 'Patient'}
              recipientPhone={reportData.patient?.phone || ''}
              uhid={reportData.patient?.uhid}
              patientId={reportData.patient?.id}
              attachedFile={`${reportData.reportNumber || 'report'}.pdf`}
              documentTitle={`Clinical Report: ${reportData.service?.title || 'Audiological Evaluation'}`}
              defaultMessage={defaultWhatsAppMsg}
              onSuccess={({ phone }) => {
                if (phone) {
                  setReportData((prev) => ({
                    ...prev,
                    patient: { ...prev.patient, phone },
                  }));
                }
              }}
            />

            <EmailDispatchModal
              isOpen={isMailModalOpen}
              onClose={() => setIsMailModalOpen(false)}
              recipientName={reportData.patient?.full_name || 'Patient'}
              recipientEmail={reportData.patient?.email || ''}
              uhid={reportData.patient?.uhid}
              patientId={reportData.patient?.id}
              attachedFile={`${reportData.reportNumber || 'report'}.pdf`}
              documentTitle={`Clinical Report: ${reportData.service?.title || 'Audiological Evaluation'}`}
              reportData={reportData}
              defaultSubject={`Clinical Report ${reportData.reportNumber} — ${reportData.patient?.full_name} [${clinicTitle}]`}
              defaultMessage={defaultEmailMsg}
              onSuccess={({ email }) => {
                if (email) {
                  setReportData((prev) => ({
                    ...prev,
                    patient: { ...prev.patient, email },
                  }));
                }
              }}
            />
          </>
        );
      })()}

    </div>
  );
};

export default ReportViewPage;
