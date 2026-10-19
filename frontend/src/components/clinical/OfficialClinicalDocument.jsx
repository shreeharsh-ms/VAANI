import React from 'react';
import { DualAudiogramSection } from './AudiogramGraph';
import { EarlyDevelopmentalHistoryDocument } from './EarlyDevelopmentalHistoryDocument';
import { FluencyDisordersDocument } from './FluencyDisordersDocument';
import { VoiceDisordersDocument } from './VoiceDisordersDocument';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';
import { ClinicalReportBackground } from './ClinicalReportBackground';
import { OfficialReportTitle } from './OfficialReportTitle';
import { PatientDemographicsMatrix } from './PatientDemographicsMatrix';

/**
 * Official Clinical Document Template
 * Standardized single-page proforma with RCI CRR No. A79214 seal, official logo,
 * bilateral clinical metrics, and DPDP-compliant QR authenticity badge.
 */
/**
 * Renders clinical text as bullet points if multiple lines or bullet prefixes exist,
 * or as a formatted paragraph.
 */
const renderBulletPoints = (text, fallback = '', bulletClass = 'bg-slate-900') => {
  const content = (text || fallback || '').trim();
  if (!content) return null;

  const rawLines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const hasBullets = rawLines.some((l) => /^[•\-\*]|\d+[\.\)]/.test(l));

  if (rawLines.length > 1 || hasBullets) {
    return (
      <ul className="space-y-1.5 mt-1.5 pl-0.5">
        {rawLines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*]\s*|\d+[\.\)]\s*/, '').trim();
          if (!cleanLine) return null;
          return (
            <li key={idx} className="flex items-start gap-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${bulletClass} mt-1.5 shrink-0`} />
              <span className="leading-snug text-slate-800">{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <p className="mt-1 text-slate-800 leading-relaxed font-medium">
      {content.replace(/^[•\-\*]\s*/, '')}
    </p>
  );
};

export const OfficialClinicalDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  computedPTA,
}) => {
  if (!service || !patient) return null;

  const isAAE = service.code === 'RP-CLN-AAE' || service.code === 'RP-CLN-AUD';
  const isOAE = service.code === 'RP-CLN-OAE';
  const isCBT = service.code === 'RP-CLN-CBT';
  const isEDH = service.code === 'RP-CLN-EDH';
  const isFLU = service.code === 'RP-CLN-FLU';
  const isVOI = service.code === 'RP-CLN-VOI';

  if (isEDH) {
    return (
      <div id="official-report-a4-page" className="multi-page-doc">
        <EarlyDevelopmentalHistoryDocument
          service={service}
          patient={patient}
          patientDossier={patientDossier}
          formData={formData}
          renderBulletPoints={renderBulletPoints}
        />
      </div>
    );
  }

  if (isFLU) {
    return (
      <div id="official-report-a4-page" className="multi-page-doc">
        <FluencyDisordersDocument
          service={service}
          patient={patient}
          patientDossier={patientDossier}
          formData={formData}
          renderBulletPoints={renderBulletPoints}
        />
      </div>
    );
  }

  if (isVOI) {
    return (
      <div id="official-report-a4-page" className="multi-page-doc">
        <VoiceDisordersDocument
          service={service}
          patient={patient}
          patientDossier={patientDossier}
          formData={formData}
          renderBulletPoints={renderBulletPoints}
        />
      </div>
    );
  }

  return (
    <div
      id="official-report-a4-page"
      className="relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full h-[294mm] max-h-[294mm] print:h-[294mm] print:max-h-[294mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none print:break-inside-avoid print:page-break-after-avoid"
    >
      {/* ── BACKGROUND LAYER: BOTANICAL LAVENDER WATERCOLOR FLOWER (From Overview Page) ── */}
      <ClinicalReportBackground />

      {/* ── TOP AND CLINICAL BODY WRAPPER ── */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* ── REUSABLE DECORATIVE CLINICAL LETTERHEAD ── */}
        <OfficialReportHeader
          formData={formData}
          service={service}
          isCBT={isCBT}
        />

        {/* ── CLINICAL BODY PADDED WRAPPER (Uniform Left & Right Margins) ── */}
        <div className="flex-1 flex flex-col space-y-1.5 print:space-y-1 px-7 sm:px-8 pb-1">
          {/* ── CONDITIONAL REPORT BODY: CBT VS OAE VS GENERAL / PTA ── */}
          {isCBT ? (
            /* ── CBT REPORT VIEW (Exact Layout matching official Psychological & CBT Document) ── */
            <div className="space-y-2 print:space-y-1 text-slate-900">
              {/* Title Banner */}
              <OfficialReportTitle title="Psychological &amp; Cognitive Behavioural Therapy (CBT) Report" />

              {/* Demographics Matrix (Unified Audiological Evaluation Layout) */}
              <PatientDemographicsMatrix
                formData={formData}
                patient={patient}
                refLabel="Report No. :"
                refValue={formData?.reportNumber || 'REP-26-0001'}
                extraRow={
                  <div className="grid grid-cols-2 divide-x divide-purple-200">
                    <div className="p-1 px-2.5 flex items-center">
                      <span className="font-bold w-36 shrink-0 text-purple-950">Assessment Session :</span>
                      <span className="font-medium text-slate-800">{formData?.parameters?.assessmentSession || 'Intake & Diagnostic Formulation'}</span>
                    </div>
                    <div className="p-1 px-2.5 flex items-center">
                      <span className="font-bold w-32 shrink-0 text-purple-950">Consent Status :</span>
                      <span className="font-medium text-slate-800">{formData?.parameters?.consentStatus || 'Signed CBT Consent Form Verified'}</span>
                    </div>
                  </div>
                }
              />

            {/* 1. STANDARDIZED PSYCHOMETRIC SCALES */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
                <span>1. Standardized Psychometric Scales (PHQ-9, GAD-7, PSS-10)</span>
                <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 1.0</span>
              </div>
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-purple-100/70 text-purple-950 text-left font-bold border-b border-purple-200">
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-2/6">INSTRUMENT</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-1/6">RAW SCORE</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-2/6">SCORE RANGE &amp; CUTOFF</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 text-purple-950 w-2/6">CLINICAL SEVERITY LEVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950">
                      PHQ-9<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Patient Health Questionnaire - Depression)</span>
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-mono font-bold text-slate-900">
                      {formData?.parameters?.phq9Score ?? 14} / 27
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-[8.5px] text-slate-700 leading-tight">
                      0-4: Minimal | 5-9: Mild<br />
                      10-14: Moderate | 15-19: Mod. Severe | 20-27: Severe
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1">
                      <span className="font-bold text-purple-950 block uppercase">
                        {formData?.parameters?.phq9Severity || 'MODERATE DEPRESSION'}
                      </span>
                      {formData?.parameters?.phq9Item9Note && (
                        <span className="text-[8.5px] text-slate-600 block">
                          ({formData.parameters.phq9Item9Note})
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950">
                      GAD-7<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Generalised Anxiety Disorder Scale)</span>
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-mono font-bold text-slate-900">
                      {formData?.parameters?.gad7Score ?? 12} / 21
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-[8.5px] text-slate-700 leading-tight">
                      0-4: Minimal | 5-9: Mild<br />
                      10-14: Moderate | 15-21: Severe
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1">
                      <span className="font-bold text-purple-950 block uppercase">
                        {formData?.parameters?.gad7Severity || 'MODERATE ANXIETY'}
                      </span>
                      {formData?.parameters?.gad7Note && (
                        <span className="text-[8.5px] text-slate-600 block">
                          ({formData.parameters.gad7Note})
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950">
                      PSS-10<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Perceived Stress Scale)</span>
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-mono font-bold text-slate-900">
                      {formData?.parameters?.pss10Score ?? 24} / 40
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-[8.5px] text-slate-700 leading-tight">
                      0-13: Low Stress | 14-26: Moderate Stress<br />
                      27-40: High Stress
                    </td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1">
                      <span className="font-bold text-purple-950 block uppercase">
                        {formData?.parameters?.pss10Severity || 'MODERATE-HIGH PERCEIVED STRESS'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. CLINICAL RISK ASSESSMENT & MANDATORY REFERRAL MATRIX */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
                <span>2. Clinical Risk Assessment &amp; Mandatory Referral Matrix</span>
                <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 2.0</span>
              </div>
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-purple-100/70 text-purple-950 text-left font-bold border-b border-purple-200">
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-1/4">RISK PARAMETER</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-1/2">CLINICAL ASSESSMENT FINDING</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 text-purple-950 w-1/4">SYSTEM ACTION / SAFETY TRIGGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950 align-top">Suicidal Ideation / Intent</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-slate-800 align-top">
                      {formData?.parameters?.suicidalIdeation || 'Passive thoughts ("wish I didn\'t wake up"), NO active plan, NO specific intent.'}
                    </td>
                    <td rowSpan={4} className="py-1 px-1.5 print:py-0.5 print:px-1 bg-purple-50/60 align-top">
                      <span className="font-black text-purple-950 uppercase block mb-1 text-[9.5px]">
                        OVERALL RISK LEVEL: {formData?.parameters?.overallRiskLevel || 'MODERATE RISK'}
                      </span>
                      <ul className="text-[8.5px] text-slate-700 space-y-0.5">
                        {(Array.isArray(formData?.parameters?.safetyTriggers)
                          ? formData.parameters.safetyTriggers
                          : [
                              'Mandatory Safety Plan Matrix Activated',
                              'System displays clinician warning banner',
                              'Psychiatric Consultation Prompt Enabled',
                            ]
                        ).map((trigger, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-purple-700 font-bold">•</span>
                            <span className="leading-tight">{trigger.replace(/^[•\-\*]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950 align-top">Self-Harm History</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-slate-800 align-top">
                      {formData?.parameters?.selfHarmHistory || 'No prior suicide attempt; intermittent non-suicidal self-harm urges under high stress.'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950 align-top">Means Access &amp; Control</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-slate-800 align-top">
                      {formData?.parameters?.meansAccess || 'No firearms; medication access managed by family.'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-purple-950 align-top">Protective Factors</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 text-slate-800 align-top">
                      {formData?.parameters?.protectiveFactors || 'Strong supportive sister, highly motivated for CBT, employed, no substance abuse.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. PATIENT 5-STEP SAFETY PLAN MATRIX */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
                <span>3. Patient 5-Step Safety Plan Matrix</span>
                <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 3.0</span>
              </div>
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-purple-100/70 text-purple-950 text-left font-bold border-b border-purple-200">
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-20 text-center">STEP</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-200 w-1/4">SAFETY PLAN DOMAIN</th>
                    <th className="py-1 px-1.5 print:py-0.5 print:px-1 text-purple-950">PATIENT-SPECIFIC AGREED INTERVENTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-center text-purple-950">Step 1</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-semibold text-purple-950">Recognizing Warning Signs</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 text-slate-800">
                      {formData?.parameters?.safetyStep1 || 'Racing thoughts, isolating in bedroom, skipping meals, feeling heavy pressure in chest.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-center text-purple-950">Step 2</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-semibold text-purple-950">Internal Coping Strategies</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 text-slate-800">
                      {formData?.parameters?.safetyStep2 || 'Box breathing (4-4-4-4), 5-4-3-2-1 sensory grounding, listening to calming classical music.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-center text-purple-950">Step 3</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-semibold text-purple-950">Social Distractions &amp; Support</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 text-slate-800">
                      {formData?.parameters?.safetyStep3 || 'Calling sister (Pooja: +91-98220-XXXXX), sitting in clinic garden, walking pet dog.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-center text-purple-950">Step 4</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-semibold text-purple-950">Family / Crisis Contacts</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 text-slate-800">
                      {formData?.parameters?.safetyStep4 || 'Primary Contact: Sister (Pooja Kulkarni); Secondary Contact: Vani\'s Clinic Support.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-purple-50/30">
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-bold text-center text-purple-950">Step 5</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 border-r border-purple-100 font-semibold text-purple-950">Professional &amp; Emergency Care</td>
                    <td className="py-1 px-1.5 print:py-0.5 print:px-1 text-slate-800">
                      {formData?.parameters?.safetyStep5 || 'Vani\'s Clinic Crisis Line (+91-98220-XXXXX) | Satara District Hospital Helpline (02162-XXXXXX).'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FORMULATION & CBT TREATMENT PLAN */}
            <div className="border border-purple-200/80 rounded-lg p-2.5 bg-purple-50/40 text-[9.5px] space-y-1.5 shadow-2xs">
              <span className="font-black text-purple-950 block uppercase tracking-wide">
                Formulation &amp; CBT Treatment Plan:
              </span>
              <p className="text-slate-800 leading-snug">
                <span className="font-bold text-purple-950">1. COGNITIVE FORMULATION:</span>{' '}
                {formData?.parameters?.cognitiveFormulation ||
                  'Automatic thoughts ("I am a failure if I am not perfect"), cognitive distortions (Catastrophising, All-or-Nothing thinking).'}
              </p>
              <p className="text-slate-800 leading-snug">
                <span className="font-bold text-purple-950">2. CBT PLAN:</span>{' '}
                {formData?.parameters?.cbtPlan ||
                  '12 weekly sessions targeting Cognitive Restructuring, Behavioural Activation (activity scheduling), and Mindfulness-Based Stress Reduction (MBSR).'}
              </p>
              <p className="text-slate-700 leading-snug">
                <span className="font-bold text-purple-950">3. CONFIDENTIALITY NOTE:</span>{' '}
                {formData?.parameters?.confidentialityNote ||
                  'Record encrypted under AES-256 field encryption. Access restricted to authorized CBT clinician.'}
              </p>
            </div>
          </div>
        ) : isAAE ? (
          /* ── AUDIOLOGICAL EVALUATION VIEW (Exact Real-World Layout with Dual Audiogram Graphs & Legend) ── */
          <div className="space-y-1.5 text-slate-900">
            {/* Simple & Professional Clinical Title */}
            <OfficialReportTitle title="Audiological Evaluation" />

            {/* Demographics & Test Context Matrix */}
            <PatientDemographicsMatrix
              formData={formData}
              patient={patient}
              refLabel="PTA No. :"
              refValue={formData?.parameters?.ptaNo || '64/2026'}
              extraRow={
                <div className="grid grid-cols-3 divide-x divide-purple-200">
                  <div className="p-1 px-2.5 flex items-center min-w-0">
                    <span className="font-bold mr-1.5 shrink-0 whitespace-nowrap text-purple-950">Audiometer :</span>
                    <span className="font-bold text-slate-900 truncate">{formData?.parameters?.audiometer || 'Proton SX5'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center col-span-2 min-w-0">
                    <span className="font-bold mr-2 shrink-0 whitespace-nowrap text-purple-950">Responses :</span>
                    <div className="flex items-center gap-2 sm:gap-3 text-[9.5px] overflow-hidden flex-wrap">
                      <span className={`inline-flex items-center gap-1 whitespace-nowrap ${formData?.parameters?.responses === 'Consistent' || !formData?.parameters?.responses ? 'font-black text-purple-950' : 'text-slate-600'}`}>
                        <span className="w-3.5 h-3.5 border border-purple-400 bg-purple-50 rounded-xs inline-flex items-center justify-center text-[10px] font-bold text-purple-950">
                          {formData?.parameters?.responses === 'Consistent' || !formData?.parameters?.responses ? '✓' : ''}
                        </span>
                        Consistent
                      </span>
                      <span className={`inline-flex items-center gap-1 whitespace-nowrap ${formData?.parameters?.responses === 'Fairly Consistent' ? 'font-black text-purple-950' : 'text-slate-600'}`}>
                        <span className="w-3.5 h-3.5 border border-purple-400 bg-purple-50 rounded-xs inline-flex items-center justify-center text-[10px] font-bold text-purple-950">
                          {formData?.parameters?.responses === 'Fairly Consistent' ? '✓' : ''}
                        </span>
                        Fairly Consistent
                      </span>
                      <span className={`inline-flex items-center gap-1 whitespace-nowrap ${formData?.parameters?.responses === 'Inconsistent' ? 'font-black text-purple-950' : 'text-slate-600'}`}>
                        <span className="w-3.5 h-3.5 border border-purple-400 bg-purple-50 rounded-xs inline-flex items-center justify-center text-[10px] font-bold text-purple-950">
                          {formData?.parameters?.responses === 'Inconsistent' ? '✓' : ''}
                        </span>
                        Inconsistent
                      </span>
                    </div>
                  </div>
                </div>
              }
            />

            {/* DUAL AUDIOGRAM GRAPHS SECTION */}
            <DualAudiogramSection
              rightAC={formData?.parameters?.rightEarAC}
              rightBC={formData?.parameters?.rightEarBC}
              leftAC={formData?.parameters?.leftEarAC}
              leftBC={formData?.parameters?.leftEarBC}
            />

            {/* AUDIOMETRIC SUMMARY TABLE */}
            <div className="border border-purple-300 rounded-lg overflow-hidden text-[9px] bg-white/85 backdrop-blur-2xs shadow-2xs">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 text-purple-950 font-bold border-b border-purple-200">
                    <th className="p-1 border-r border-purple-200 w-20"></th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      PTA<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      PTA 2<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      SDT<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      SRT<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      WRS %<br /><span className="text-[7.5px] font-normal text-purple-800">at _ dBHL</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      MCL<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 leading-tight">
                      UCL<br /><span className="text-[7.5px] font-normal text-purple-800">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-purple-200 font-bold">Rinne</th>
                    <th className="p-1 font-bold">Weber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr>
                    <td className="p-1 font-bold text-rose-700 border-r border-purple-200">Right Ear</td>
                    <td className="p-1 font-mono font-bold text-rose-900 border-r border-purple-200">
                      {computedPTA?.rightAvg ? `${computedPTA.rightAvg} dB` : formData?.parameters?.rightPTA || '05 dB'}
                    </td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightPTA2 || '—'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightSDT || '10 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightSRT || '15 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightWRS || '96% at 50 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightMCL || '55 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.rightUCL || '90 dB'}</td>
                    <td className="p-1 font-bold border-r border-purple-200 text-slate-800">{formData?.parameters?.rightRinne || '+ve'}</td>
                    <td rowSpan={2} className="p-1 font-bold align-middle text-purple-950 bg-purple-50/40">
                      {formData?.parameters?.weber || 'Central'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold text-blue-700 border-r border-purple-200">Left Ear</td>
                    <td className="p-1 font-mono font-bold text-blue-900 border-r border-purple-200">
                      {computedPTA?.leftAvg ? `${computedPTA.leftAvg} dB` : formData?.parameters?.leftPTA || '06.66 dB'}
                    </td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftPTA2 || '—'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftSDT || '10 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftSRT || '15 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftWRS || '96% at 50 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftMCL || '55 dB'}</td>
                    <td className="p-1 font-mono border-r border-purple-200">{formData?.parameters?.leftUCL || '90 dB'}</td>
                    <td className="p-1 font-bold border-r border-purple-200 text-slate-800">{formData?.parameters?.leftRinne || '+ve'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* INTERPRETATION & RECOMMENDATIONS */}
            <div className="space-y-1.5 pt-0.5 text-xs bg-white/85 backdrop-blur-2xs border border-purple-200 rounded-lg p-2.5 shadow-2xs">
              <div>
                <span className="font-black uppercase tracking-wide text-purple-950 block text-[10.5px]">
                  Interpretation :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.provisionalDiagnosis,
                    '• Bilateral hearing sensitivity within normal limits.\n• Symmetrical bilateral air conduction thresholds.',
                    'bg-purple-900'
                  )}
                </div>
              </div>

              <div>
                <span className="font-black uppercase tracking-wide text-purple-950 block text-[10.5px]">
                  Recommendations :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.recommendations,
                    '• Speech evaluation.\n• Care of ears.\n• Follow up after 6 months or if parental concern arises.',
                    'bg-purple-900'
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : isOAE ? (
          /* ── OAE SCREENING REPORT VIEW (Exact Real-World Clinic Layout with Ear Illustrations) ── */
          <div className="space-y-3 pt-1">
            {/* Simple & Professional Title matching Audiological Evaluation */}
            <OfficialReportTitle title="Oto-Acoustic Emission (OAE) Screening Report" />

            {/* Standardized Demographics Matrix (Unified Audiological Evaluation Layout) */}
            <PatientDemographicsMatrix
              formData={formData}
              patient={patient}
              refLabel="OAE No. :"
              refValue={formData?.reportNumber || patient.uhid || 'REP-26-3872'}
              extraRow={
                <div className="grid grid-cols-2 divide-x divide-purple-200">
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-20 shrink-0 text-purple-950">DOB :</span>
                    <span className="font-medium text-slate-800">{patient.date_of_birth || '—'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-28 shrink-0 text-purple-950">Screening Protocol :</span>
                    <span className="font-medium text-slate-800">{formData?.parameters?.protocol || 'DPOAE / TEOAE Screening'}</span>
                  </div>
                </div>
              }
            />

            {/* Bilateral Ear Drawings & Pass/Refer Checkboxes */}
            <div className="my-3 p-4 rounded-xl border border-purple-200/80 bg-white/85 backdrop-blur-2xs shadow-2xs flex items-center justify-around">
              {/* Right Ear Column (Red Ear on Left - Audiometric Standard) */}
              <div className="flex items-center gap-4 sm:gap-6 p-2.5 rounded-lg bg-rose-50/20 border border-rose-200/60">
                <svg
                  viewBox="0 0 100 140"
                  className="w-16 h-24 sm:w-20 sm:h-28 text-rose-600 fill-none stroke-current stroke-[3.2] stroke-linecap-round stroke-linejoin-round shrink-0"
                >
                  <path d="M 60 18 C 28 15, 14 42, 16 80 C 18 108, 34 132, 54 132 C 70 132, 74 118, 68 104 C 64 94, 54 88, 52 80 C 49 70, 56 56, 56 46 C 56 34, 48 26, 40 30" />
                  <path d="M 44 45 C 34 52, 30 70, 34 94 C 38 110, 48 118, 56 116" />
                  <path d="M 45 74 C 38 80, 42 92, 50 90" />
                  <path d="M 64 74 C 58 76, 58 86, 66 88" />
                </svg>
                <div className="space-y-2.5">
                  <span className="block font-black text-sm sm:text-base text-rose-700 uppercase tracking-wide">Right Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-400 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome !== 'REFER' ? 'bg-purple-100 text-purple-950 border-purple-700' : 'text-transparent bg-white'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-400 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome === 'REFER' ? 'bg-purple-100 text-purple-950 border-purple-700' : 'text-transparent bg-white'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome === 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Ear Column (Blue Ear on Right - Audiometric Standard) */}
              <div className="flex items-center gap-4 sm:gap-6 p-2.5 rounded-lg bg-blue-50/20 border border-blue-200/60">
                <div className="space-y-2.5">
                  <span className="block font-black text-sm sm:text-base text-blue-700 uppercase tracking-wide">Left Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-400 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome !== 'REFER' ? 'bg-purple-100 text-purple-950 border-purple-700' : 'text-transparent bg-white'
                      }`}
                    >
                      {formData?.parameters?.leftOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-purple-400 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome === 'REFER' ? 'bg-purple-100 text-purple-950 border-purple-700' : 'text-transparent bg-white'
                      }`}
                    >
                      {formData?.parameters?.leftOutcome === 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                </div>
                <svg
                  viewBox="0 0 100 140"
                  className="w-16 h-24 sm:w-20 sm:h-28 text-blue-600 fill-none stroke-current stroke-[3.2] stroke-linecap-round stroke-linejoin-round shrink-0"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <path d="M 60 18 C 28 15, 14 42, 16 80 C 18 108, 34 132, 54 132 C 70 132, 74 118, 68 104 C 64 94, 54 88, 52 80 C 49 70, 56 56, 56 46 C 56 34, 48 26, 40 30" />
                  <path d="M 44 45 C 34 52, 30 70, 34 94 C 38 110, 48 118, 56 116" />
                  <path d="M 45 74 C 38 80, 42 92, 50 90" />
                  <path d="M 64 74 C 58 76, 58 86, 66 88" />
                </svg>
              </div>
            </div>

            {/* Impression & Recommendation */}
            <div className="space-y-2 pt-1">
              <div className="border border-purple-200/80 rounded-lg p-2.5 bg-purple-50/40 text-[10px] space-y-1">
                <span className="font-black uppercase tracking-wider text-purple-950 block text-[10.5px]">
                  IMPRESSION :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.provisionalDiagnosis,
                    '• Bilateral Otoacoustic Emissions (OAE) PASS.\n• Outer hair cell function is robust bilaterally within normal limits.',
                    'bg-purple-900'
                  )}
                </div>
              </div>

              <div className="border border-purple-200/70 rounded-lg p-2.5 bg-white/70 text-[10px] space-y-1">
                <span className="font-black uppercase tracking-wider text-purple-950 block text-[10.5px]">
                  RECOMMENDATION :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.recommendations,
                    '• Routine developmental auditory and speech-language milestones tracking.\n• Repeat evaluation if parental concern arises.',
                    'bg-purple-900'
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── STANDARD GENERAL / AUDIOLOGY REPORT VIEW ── */
          <>
            {/* ── REPORT TITLE BANNER ── */}
            <OfficialReportTitle title={service.title} />

            {/* ── PATIENT DEMOGRAPHIC MATRIX (Unified Audiological Evaluation Layout) ── */}
            <PatientDemographicsMatrix
              formData={formData}
              patient={patient}
              refLabel="Ref. No. :"
              refValue={formData?.reportNumber || 'REP-26-0001'}
              extraRow={
                <div className="grid grid-cols-3 divide-x divide-purple-200">
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-18 shrink-0 text-purple-950">Contact :</span>
                    <span className="font-mono text-slate-800 truncate">{patient.phone || '—'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-18 shrink-0 text-purple-950">Locality :</span>
                    <span className="font-medium text-slate-800 truncate">{patient.city || 'Satara, Maharashtra'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-18 shrink-0 text-purple-950">Referral :</span>
                    <span className="font-medium text-slate-800 truncate">{patientDossier?.demographics?.referringDoctor || 'Civil Hospital Satara'}</span>
                  </div>
                </div>
              }
            />

            {/* ── CLINICAL FINDINGS & PARAMETER TABLES ── */}
            <div className="space-y-3">
              {/* 1. AUDIOLOGY EVALUATION (PTA) */}
              {service.code === 'RP-CLN-AUD' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                      Bilateral Behavioral Audiometric Thresholds (dB HL)
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Transducer: {formData?.parameters?.transducer || 'TDH-39 Supra-aural Earphones'}
                    </span>
                  </div>

                  <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 text-[10px] font-bold text-purple-950 uppercase border-b border-purple-200">
                        <tr>
                          <th className="px-3 py-1.5 text-left border-r border-purple-200">Ear &amp; Conduction</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">250 Hz</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">500 Hz</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">1000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">2000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">4000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-purple-200">8000 Hz</th>
                          <th className="px-2 py-1.5 bg-purple-100 text-purple-950 font-black border-r border-purple-200">PTA Avg (dB)</th>
                          <th className="px-2 py-1.5 bg-purple-100 text-purple-950 font-black">WHO Degree of Loss</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {/* Right Ear AC (Red) */}
                        <tr className="text-rose-700 font-bold bg-rose-50/20">
                          <td className="px-3 py-1.5 text-left border-r border-purple-100">Right Ear (AC - O)</td>
                          {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                            <td key={f} className="px-2 py-1.5 border-r border-purple-100 font-mono">
                              {formData?.parameters?.rightEarAC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1.5 bg-rose-50 font-mono font-black border-r border-purple-100">
                            {computedPTA?.rightAvg ?? '31.7'} dB
                          </td>
                          <td className="px-2 py-1.5 bg-rose-50 text-[10px] font-black">
                            {computedPTA?.rightDegree ?? 'Mild Hearing Loss'}
                          </td>
                        </tr>

                        {/* Right Ear BC (Red) */}
                        <tr className="text-rose-600 bg-rose-50/5">
                          <td className="px-3 py-1 text-left border-r border-purple-100 font-semibold">Right Ear (BC - &lt;)</td>
                          {['250', '500', '1000', '2000', '4000'].map((f) => (
                            <td key={f} className="px-2 py-1 border-r border-purple-100 font-mono">
                              {formData?.parameters?.rightEarBC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1 border-r border-purple-100 text-slate-300">—</td>
                          <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                            Bone conduction thresholds
                          </td>
                        </tr>

                        {/* Left Ear AC (Blue) */}
                        <tr className="text-blue-700 font-bold bg-blue-50/20">
                          <td className="px-3 py-1.5 text-left border-r border-purple-100">Left Ear (AC - X)</td>
                          {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                            <td key={f} className="px-2 py-1.5 border-r border-purple-100 font-mono">
                              {formData?.parameters?.leftEarAC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1.5 bg-blue-50 font-mono font-black border-r border-purple-100">
                            {computedPTA?.leftAvg ?? '25'} dB
                          </td>
                          <td className="px-2 py-1.5 bg-blue-50 text-[10px] font-black">
                            {computedPTA?.leftDegree ?? 'Normal Hearing Sensitivity'}
                          </td>
                        </tr>

                        {/* Left Ear BC (Blue) */}
                        <tr className="text-blue-600 bg-blue-50/5">
                          <td className="px-3 py-1 text-left border-r border-purple-100 font-semibold">Left Ear (BC - &gt;)</td>
                          {['250', '500', '1000', '2000', '4000'].map((f) => (
                            <td key={f} className="px-2 py-1 border-r border-purple-100 font-mono">
                              {formData?.parameters?.leftEarBC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1 border-r border-purple-100 text-slate-300">—</td>
                          <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                            Bone conduction thresholds
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Speech & Immittance Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 border border-purple-200/80 rounded-lg bg-white/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-purple-950 uppercase block">Speech Reception (SRT)</span>
                      <p className="mt-1 font-bold">
                        <span className="text-rose-700">R: {formData?.parameters?.rightSRT ?? 35} dB</span> |{' '}
                        <span className="text-blue-700">L: {formData?.parameters?.leftSRT ?? 25} dB</span>
                      </p>
                    </div>

                    <div className="p-2 border border-purple-200/80 rounded-lg bg-white/80 shadow-2xs">
                      <span className="text-[10px] font-bold text-purple-950 uppercase block">Word Recognition (WRS)</span>
                      <p className="mt-1 font-bold">
                        <span className="text-rose-700">R: {formData?.parameters?.rightWRS ?? 84}%</span> |{' '}
                        <span className="text-blue-700">L: {formData?.parameters?.leftWRS ?? 96}%</span>
                      </p>
                    </div>

                    <div className="p-2 border border-purple-200/80 rounded-lg bg-white/80 shadow-2xs col-span-2">
                      <span className="text-[10px] font-bold text-purple-950 uppercase block">Immittance &amp; Tympanometry (Jerger)</span>
                      <p className="mt-1 text-[11px] text-slate-800">
                        <strong className="text-rose-700">Right:</strong> {formData?.parameters?.tympanometryRight || 'Type A'} |{' '}
                        <strong className="text-blue-700">Left:</strong> {formData?.parameters?.tympanometryLeft || 'Type A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. VOICE (CAPE-V / GRBAS) */}
              {service.code === 'RP-CLN-VOI' && (
                <div className="space-y-2 border border-purple-200/80 rounded-lg p-2.5 bg-purple-50/20 text-xs">
                  <span className="text-[10px] font-black uppercase text-purple-950 block">
                    CAPE-V Visual Analog Ratings (0-100 mm) &amp; Perceptual Voice Battery
                  </span>
                  <div className="grid grid-cols-6 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Overall</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_overall ?? 48}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Roughness</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_roughness ?? 52}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Breathiness</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_breathiness ?? 38}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Strain</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_strain ?? 45}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Pitch</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_pitch ?? 30}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Loudness</span>
                      <span className="font-black text-purple-950">{formData?.parameters?.capeV_loudness ?? 25}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FLUENCY (SSI-4) */}
              {service.code === 'RP-CLN-FLU' && (
                <div className="border border-purple-200/80 rounded-lg p-2.5 bg-purple-50/20 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-950 block">
                    Stuttering Severity Instrument (SSI-4) Protocol Metrics
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">% Syllables Stuttered</span>
                      <span className="font-mono font-black text-purple-950 text-sm">
                        {formData?.parameters?.ssi4_percentageSS ?? 8.4}%
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Physical Concomitants</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_physicalConcomitants ?? 'Moderate'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Speech Rate</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_speechRateSPM ?? 142} SPM
                      </span>
                    </div>
                    <div className="p-1.5 bg-purple-100/80 border border-purple-300 rounded">
                      <span className="text-[9px] text-purple-950 font-bold block uppercase">Severity Classification</span>
                      <span className="font-black text-purple-950">
                        {formData?.parameters?.ssi4_severityGrade ?? 'Moderate Stuttering'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SPEECH & LANGUAGE (REELS / PLS-5) */}
              {service.code === 'RP-CLN-SLA' && (
                <div className="border border-purple-200/80 rounded-lg p-2.5 bg-purple-50/20 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-950 block">
                    Comprehensive Developmental Language Battery (REELS / 3DLAT)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Chronological Age</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_caMonths ?? 36} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Receptive Age (RLA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_rlaMonths ?? 28} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-purple-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Expressive Age (ELA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_elaMonths ?? 22} Mo</span>
                    </div>
                    <div className="p-1.5 bg-purple-100/80 border border-purple-300 rounded shadow-2xs">
                      <span className="text-[9px] text-purple-950 font-bold block uppercase">Expressive Delay</span>
                      <span className="font-mono font-black text-purple-950">{formData?.parameters?.reels_expressiveDelayMonths ?? 14} Mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Other Services fallback */}
              {!['RP-CLN-AUD', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA'].includes(service.code) && (
                <div className="border border-purple-200/80 rounded-lg p-3 bg-purple-50/30 text-xs">
                  <span className="text-[10px] font-black uppercase text-purple-950 block mb-1">
                    Assessment Battery Details
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              )}
            </div>

            {/* ── CLINICAL IMPRESSION / DIAGNOSIS ── */}
            <div className="border border-purple-200/80 rounded-lg p-3 bg-purple-50/40 text-xs space-y-1 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 block">
                Clinical Impression &amp; Findings:
              </span>
              <div className="font-semibold text-slate-900">
                {renderBulletPoints(
                  formData?.parameters?.provisionalDiagnosis,
                  service.description,
                  'bg-purple-950'
                )}
              </div>
            </div>

            {/* ── CLINICAL RECOMMENDATIONS & MANAGEMENT PLAN ── */}
            <div className="border border-purple-200/70 rounded-lg p-3 bg-white/70 text-xs space-y-1 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 block">
                Clinical Recommendations &amp; Rehabilitation Protocol:
              </span>
              <div className="font-medium text-slate-800">
                {renderBulletPoints(
                  formData?.parameters?.recommendations,
                  'Follow up as clinically indicated.',
                  'bg-purple-900'
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </div>

      {/* ── STATUTORY SIGN-OFF & TAMPER-EVIDENT QR VERIFICATION ── */}
      <div className="relative z-10 mt-auto shrink-0 w-full">
        <OfficialReportFooter
          formData={formData}
          patient={patient}
          service={service}
          isCBT={isCBT}
        />
      </div>

    </div>
  );
};

export default OfficialClinicalDocument;
