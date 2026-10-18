import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, X, ShieldCheck, QrCode, Mail, MessageSquare } from 'lucide-react';
import OfficialClinicalDocument from '../../components/clinical/OfficialClinicalDocument';
import { EmailDispatchModal, WhatsAppDispatchModal } from '../../components/common/CommunicationModal';
import { CLINICAL_SERVICES } from '../../data/clinicalServicesData';
import { SEED_PATIENTS, PATIENT_DOSSIERS } from '../../data/patientClinicalProfiles';
import { getAllClinicalReports } from '../../data/clinicalReportsData';
import { getClinicSettings } from '../../context/ClinicSettingsContext';

export const ReportViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

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

          const settings = getClinicSettings();
          const leadPractitioner = settings?.credentials?.leadPractitioner || 'Ms. Palak Paresh Gandhi';
          const leadDegree = settings?.credentials?.leadDegree || 'MASLP, RCI';
          const defaultExaminer = `${leadPractitioner}${leadDegree ? `, ${leadDegree}` : ''}`;
          const defaultRci = settings?.credentials?.rciNumber || 'A79214';

          const resolvedExaminer = match.examiner && !match.examiner.includes('Shreeharsh')
            ? match.examiner
            : defaultExaminer;

          setReportData({
            reportNumber: match.report_number || match.id,
            reportDate: match.date || new Date().toISOString().split('T')[0],
            examinerName: resolvedExaminer,
            rciNumber: match.rci_number || defaultRci,
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
    const settings = getClinicSettings();
    const fallbackLead = settings?.credentials?.leadPractitioner || 'Ms. Palak Paresh Gandhi';
    const fallbackDegree = settings?.credentials?.leadDegree || 'MASLP, RCI';
    const fallbackExaminer = `${fallbackLead}${fallbackDegree ? `, ${fallbackDegree}` : ''}`;
    const fallbackRci = settings?.credentials?.rciNumber || 'A79214';

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
      if (e.key === 'vaani_clinical_reports_v1' || e.key === 'vaani_preview_report' || !e.key) {
        loadReport();
      }
    };
    const handleCustomUpdate = () => {
      loadReport();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('vaani_reports_updated', handleCustomUpdate);
    window.addEventListener('focus', loadReport);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('vaani_reports_updated', handleCustomUpdate);
      window.removeEventListener('focus', loadReport);
    };
  }, [id]);

  // Keyboard shortcut for print (Cmd/Ctrl + P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
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
          window.print();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [reportData]);

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
      <header className="print:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Official Report Preview
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-mono font-bold text-purple-900">
            {reportData.reportNumber}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-slate-700">
            {reportData.patient?.full_name} ({reportData.patient?.uhid})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded shadow-xs transition-colors cursor-pointer"
            title="Dispatch WhatsApp Notification"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded shadow-xs transition-colors cursor-pointer"
            title="Dispatch Email with Official Clinical PDF Attachment"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Email Report</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Document</span>
            <kbd className="ml-1 px-1.5 py-0.2 bg-purple-800 text-[10px] rounded font-mono">⌘P</kbd>
          </button>

          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
            title="Close this tab"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close Tab</span>
          </button>
        </div>
      </header>

      {/* ── A4 CLINICAL DOCUMENT PAPER CANVAS ── */}
      <main className="py-6 px-4 print:p-0 print:m-0 flex justify-center">
        <div className="w-full max-w-[210mm] bg-white border border-slate-300 rounded shadow-xl print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none">
          <OfficialClinicalDocument
            service={reportData.service}
            patient={reportData.patient}
            patientDossier={reportData.patientDossier}
            formData={reportData}
            computedPTA={reportData.computedPTA}
          />
        </div>
      </main>

      {/* Communication Modals */}
      {reportData && (
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
            defaultMessage={`*Vaani Speech & Hearing Rehabilitation Clinic*\n\nDear *${reportData.patient?.full_name || 'Patient'}*,\nYour official clinical record *${reportData.reportNumber}* (${reportData.service?.title || 'Audiological Evaluation'}) has been verified and registered.\n\nExaminer: Ms. Palak Paresh Gandhi, MASLP (RCI No. A79214)\nClinic Address: Shop No. 4, Ground Floor, Sadashiv Arcade, Opp. Zilla Parishad Gate, Sadashiv Peth, Satara - 415002\nHelpline: +91 98220 11223`}
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
            defaultSubject={`Clinical Report ${reportData.reportNumber} — ${reportData.patient?.full_name} [Vaani Clinic]`}
            defaultMessage={`Dear ${reportData.patient?.full_name || 'Patient'},\n\nPlease find attached the official summary of your clinical assessment recorded at Vaani Speech & Hearing Rehabilitation Clinic (Satara):\n\n• Report ID: ${reportData.reportNumber}\n• Assessment: ${reportData.service?.title || 'Audiological Evaluation (PTA)'}\n• Examination Date: ${reportData.date || new Date().toLocaleDateString('en-IN')}\n• Attending Clinician: Ms. Palak Paresh Gandhi, MASLP (RCI No. A79214)\n\nThis record is compliant with RCI Standards & the Digital Personal Data Protection (DPDP) Act 2023.\n\nWarm regards,\nVaani Speech & Hearing Clinic\nPhone: +91 98220 11223 | Satara, Maharashtra`}
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
      )}

    </div>
  );
};

export default ReportViewPage;
