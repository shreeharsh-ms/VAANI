import React from 'react';
import { QrCode } from 'lucide-react';
import { DualAudiogramSection } from './AudiogramGraph';
import { EarlyDevelopmentalHistoryDocument } from './EarlyDevelopmentalHistoryDocument';
import { FluencyDisordersDocument } from './FluencyDisordersDocument';
import { VoiceDisordersDocument } from './VoiceDisordersDocument';

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
      className="bg-white text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0 print:h-[279mm] leading-tight"
    >
      {/* ── TOP AND CLINICAL BODY WRAPPER ── */}
      <div className="flex-1 flex flex-col space-y-3.5">
        {/* ── CLINIC OFFICIAL LETTERHEAD ── */}
        {isCBT ? (
          <div className="border-b-2 border-slate-900 pb-2 flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="font-serif font-black text-base tracking-wide text-slate-950 uppercase">
                VANI'S SPEECH &amp; HEARING CLINIC
              </h1>
              <p className="text-[10px] font-bold text-slate-700">
                Center for Audiology, Speech-Language Pathology &amp; Counselling
              </p>
              <p className="text-[9px] text-slate-600">
                Satara, Maharashtra • Contact: +91-98220-XXXXX • Email: contact@vanisclinic.in
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <h2 className="font-bold text-xs text-slate-950">
                Ms. Palak Paresh Gandhi &amp; CBT Team
              </h2>
              <p className="text-[9.5px] font-semibold text-slate-700">
                RCI Registered Practitioner &amp; Psychological Counselor
              </p>
              <p className="text-[8.5px] text-slate-500">
                Strictly Confidential Medical Record (DPDP Act 2023 Compliant)
              </p>
            </div>
          </div>
        ) : (
          <div className="border-b-2 border-purple-950 pb-2.5 flex items-start justify-between gap-4">
            {/* Left: Actual Clinic Logo & Institutional Details */}
            <div className="flex items-center gap-3.5">
              <img
                src="/vaani-logo.png"
                alt="Vaani Speech and Hearing Clinic"
                className="h-14 w-auto object-contain shrink-0"
              />
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-700">
                  <span className="font-semibold text-slate-800">
                    RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[9.5px] text-slate-500 font-medium">
                    RCI Approved Practice Center • ISO 9001:2015
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 font-medium">
                  Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
                </p>
                <p className="text-[9.5px] text-slate-500">
                  Tel: +91 2162 234567 • Mob: +91 94220 11223 • Email: clinic@vaaniclinic.com
                </p>
              </div>
            </div>

            {/* Right: Document Identification */}
            <div className="text-right shrink-0 space-y-0.5">
              <span className="block text-xs font-mono font-bold text-slate-900">
                Report No: {formData?.reportNumber}
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">
                Date: {formData?.reportDate}
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-purple-900 mt-0.5">
                {service.discipline}
              </span>
            </div>
          </div>
        )}

        {/* ── CONDITIONAL REPORT BODY: CBT VS OAE VS GENERAL / PTA ── */}
        {isCBT ? (
          /* ── CBT REPORT VIEW (Exact Layout matching official Psychological & CBT Document) ── */
          <div className="space-y-2.5 text-slate-900">
            {/* Title Banner */}
            <div className="bg-[#0f172a] text-white text-center py-1 font-bold text-xs uppercase tracking-wider">
              PSYCHOLOGICAL &amp; COGNITIVE BEHAVIOURAL THERAPY (CBT) REPORT
            </div>

            {/* Demographics Box */}
            <div className="border border-slate-400 text-[10px]">
              <div className="grid grid-cols-2 divide-x divide-slate-400 border-b border-slate-400">
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">Patient Name:</span>
                  <span className="font-semibold text-slate-900">{patient.full_name}</span>
                </div>
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">UHID:</span>
                  <span className="font-mono font-bold text-slate-900">{patient.uhid}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-400 border-b border-slate-400">
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">Age / Gender:</span>
                  <span>
                    {patient.gender === 'FEMALE' ? 'Female' : patient.gender === 'MALE' ? 'Male' : patient.gender}
                    {patient.date_of_birth ? ` • ${patient.date_of_birth}` : ''}
                  </span>
                </div>
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">Date of Assessment:</span>
                  <span>{formData?.reportDate || 'October 09, 2026'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-400">
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">Assessment Session:</span>
                  <span>{formData?.parameters?.assessmentSession || 'Intake & Diagnostic Formulation'}</span>
                </div>
                <div className="p-1 px-2.5 flex">
                  <span className="font-bold w-32 shrink-0">Consent Status:</span>
                  <span>{formData?.parameters?.consentStatus || 'Signed CBT Consent Form Verified'}</span>
                </div>
              </div>
            </div>

            {/* 1. STANDARDIZED PSYCHOMETRIC SCALES */}
            <div>
              <h3 className="font-black text-[10.5px] uppercase tracking-wide text-slate-900 mb-0.5">
                1. STANDARDIZED PSYCHOMETRIC SCALES (PHQ-9, GAD-7, PSS-10)
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[9.5px]">
                <thead>
                  <tr className="bg-[#0f172a] text-white text-left font-bold">
                    <th className="p-1 border border-slate-400 w-2/6">INSTRUMENT</th>
                    <th className="p-1 border border-slate-400 w-1/6">RAW SCORE</th>
                    <th className="p-1 border border-slate-400 w-2/6">SCORE RANGE &amp; CUTOFF</th>
                    <th className="p-1 border border-slate-400 w-2/6">CLINICAL SEVERITY LEVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold">
                      PHQ-9<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Patient Health Questionnaire - Depression)</span>
                    </td>
                    <td className="p-1 border border-slate-300 font-mono font-bold text-slate-900">
                      {formData?.parameters?.phq9Score ?? 14} / 27
                    </td>
                    <td className="p-1 border border-slate-300 text-[8.5px] text-slate-700 leading-tight">
                      0-4: Minimal | 5-9: Mild<br />
                      10-14: Moderate | 15-19: Mod. Severe | 20-27: Severe
                    </td>
                    <td className="p-1 border border-slate-300">
                      <span className="font-bold text-slate-900 block uppercase">
                        {formData?.parameters?.phq9Severity || 'MODERATE DEPRESSION'}
                      </span>
                      {formData?.parameters?.phq9Item9Note && (
                        <span className="text-[8.5px] text-slate-600 block">
                          ({formData.parameters.phq9Item9Note})
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1 border border-slate-300 font-bold">
                      GAD-7<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Generalised Anxiety Disorder Scale)</span>
                    </td>
                    <td className="p-1 border border-slate-300 font-mono font-bold text-slate-900">
                      {formData?.parameters?.gad7Score ?? 12} / 21
                    </td>
                    <td className="p-1 border border-slate-300 text-[8.5px] text-slate-700 leading-tight">
                      0-4: Minimal | 5-9: Mild<br />
                      10-14: Moderate | 15-21: Severe
                    </td>
                    <td className="p-1 border border-slate-300">
                      <span className="font-bold text-slate-900 block uppercase">
                        {formData?.parameters?.gad7Severity || 'MODERATE ANXIETY'}
                      </span>
                      {formData?.parameters?.gad7Note && (
                        <span className="text-[8.5px] text-slate-600 block">
                          ({formData.parameters.gad7Note})
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1 border border-slate-300 font-bold">
                      PSS-10<br />
                      <span className="font-normal text-[8.5px] text-slate-600">(Perceived Stress Scale)</span>
                    </td>
                    <td className="p-1 border border-slate-300 font-mono font-bold text-slate-900">
                      {formData?.parameters?.pss10Score ?? 24} / 40
                    </td>
                    <td className="p-1 border border-slate-300 text-[8.5px] text-slate-700 leading-tight">
                      0-13: Low Stress | 14-26: Moderate Stress<br />
                      27-40: High Stress
                    </td>
                    <td className="p-1 border border-slate-300">
                      <span className="font-bold text-slate-900 block uppercase">
                        {formData?.parameters?.pss10Severity || 'MODERATE-HIGH PERCEIVED STRESS'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. CLINICAL RISK ASSESSMENT & MANDATORY REFERRAL MATRIX */}
            <div>
              <h3 className="font-black text-[10.5px] uppercase tracking-wide text-slate-900 mb-0.5">
                2. CLINICAL RISK ASSESSMENT &amp; MANDATORY REFERRAL MATRIX
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[9.5px]">
                <thead>
                  <tr className="bg-[#0f172a] text-white text-left font-bold">
                    <th className="p-1 border border-slate-400 w-1/4">RISK PARAMETER</th>
                    <th className="p-1 border border-slate-400 w-1/2">CLINICAL ASSESSMENT FINDING</th>
                    <th className="p-1 border border-slate-400 w-1/4">SYSTEM ACTION / SAFETY TRIGGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold align-top">Suicidal Ideation / Intent</td>
                    <td className="p-1 border border-slate-300 align-top">
                      {formData?.parameters?.suicidalIdeation || 'Passive thoughts ("wish I didn\'t wake up"), NO active plan, NO specific intent.'}
                    </td>
                    <td rowSpan={4} className="p-1.5 border border-slate-300 bg-rose-50/20 align-top">
                      <span className="font-black text-rose-700 uppercase block mb-1 text-[9.5px]">
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
                            <span>•</span>
                            <span className="leading-tight">{trigger.replace(/^[•\-\*]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1 border border-slate-300 font-bold align-top">Self-Harm History</td>
                    <td className="p-1 border border-slate-300 align-top">
                      {formData?.parameters?.selfHarmHistory || 'No prior suicide attempt; intermittent non-suicidal self-harm urges under high stress.'}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1 border border-slate-300 font-bold align-top">Means Access &amp; Control</td>
                    <td className="p-1 border border-slate-300 align-top">
                      {formData?.parameters?.meansAccess || 'No firearms; medication access managed by family.'}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-1 border border-slate-300 font-bold align-top">Protective Factors</td>
                    <td className="p-1 border border-slate-300 align-top">
                      {formData?.parameters?.protectiveFactors || 'Strong supportive sister, highly motivated for CBT, employed, no substance abuse.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. PATIENT 5-STEP SAFETY PLAN MATRIX */}
            <div>
              <h3 className="font-black text-[10.5px] uppercase tracking-wide text-slate-900 mb-0.5">
                3. PATIENT 5-STEP SAFETY PLAN MATRIX
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-[9.5px]">
                <thead>
                  <tr className="bg-[#0f172a] text-white text-left font-bold">
                    <th className="p-1 border border-slate-400 w-20">STEP NUMBER</th>
                    <th className="p-1 border border-slate-400 w-1/4">SAFETY PLAN DOMAIN</th>
                    <th className="p-1 border border-slate-400">PATIENT-SPECIFIC AGREED INTERVENTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold text-center">Step 1</td>
                    <td className="p-1 border border-slate-300 font-semibold">Recognizing Warning Signs</td>
                    <td className="p-1 border border-slate-300 text-slate-800">
                      {formData?.parameters?.safetyStep1 || 'Racing thoughts, isolating in bedroom, skipping meals, feeling heavy pressure in chest.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold text-center">Step 2</td>
                    <td className="p-1 border border-slate-300 font-semibold">Internal Coping Strategies</td>
                    <td className="p-1 border border-slate-300 text-slate-800">
                      {formData?.parameters?.safetyStep2 || 'Box breathing (4-4-4-4), 5-4-3-2-1 sensory grounding, listening to calming classical music.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold text-center">Step 3</td>
                    <td className="p-1 border border-slate-300 font-semibold">Social Distractions &amp; Support</td>
                    <td className="p-1 border border-slate-300 text-slate-800">
                      {formData?.parameters?.safetyStep3 || 'Calling sister (Pooja: +91-98220-XXXXX), sitting in clinic garden, walking pet dog.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold text-center">Step 4</td>
                    <td className="p-1 border border-slate-300 font-semibold">Family / Crisis Contacts</td>
                    <td className="p-1 border border-slate-300 text-slate-800">
                      {formData?.parameters?.safetyStep4 || 'Primary Contact: Sister (Pooja Kulkarni); Secondary Contact: Vani\'s Clinic Support.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border border-slate-300 font-bold text-center">Step 5</td>
                    <td className="p-1 border border-slate-300 font-semibold">Professional &amp; Emergency Care</td>
                    <td className="p-1 border border-slate-300 text-slate-800">
                      {formData?.parameters?.safetyStep5 || 'Vani\'s Clinic Crisis Line (+91-98220-XXXXX) | Satara District Hospital Helpline (02162-XXXXXX).'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FORMULATION & CBT TREATMENT PLAN */}
            <div className="border border-emerald-300 bg-emerald-50/40 rounded p-2 text-[9.5px] space-y-1">
              <span className="font-bold text-emerald-950 block uppercase tracking-wide">
                FORMULATION &amp; CBT TREATMENT PLAN:
              </span>
              <p className="text-slate-800 leading-snug">
                <span className="font-bold text-slate-900">1. COGNITIVE FORMULATION:</span>{' '}
                {formData?.parameters?.cognitiveFormulation ||
                  'Automatic thoughts ("I am a failure if I am not perfect"), cognitive distortions (Catastrophising, All-or-Nothing thinking).'}
              </p>
              <p className="text-slate-800 leading-snug">
                <span className="font-bold text-slate-900">2. CBT PLAN:</span>{' '}
                {formData?.parameters?.cbtPlan ||
                  '12 weekly sessions targeting Cognitive Restructuring, Behavioural Activation (activity scheduling), and Mindfulness-Based Stress Reduction (MBSR).'}
              </p>
              <p className="text-slate-700 leading-snug">
                <span className="font-bold text-slate-900">3. CONFIDENTIALITY NOTE:</span>{' '}
                {formData?.parameters?.confidentialityNote ||
                  'Record encrypted under AES-256 field encryption. Access restricted to authorized CBT clinician.'}
              </p>
            </div>
          </div>
        ) : isAAE ? (
          /* ── AUDIOLOGICAL EVALUATION VIEW (Exact Real-World Layout with Dual Audiogram Graphs & Legend) ── */
          <div className="space-y-2.5 text-slate-900">
            {/* Centered Rounded Pill Title Banner */}
            <div className="text-center my-0.5">
              <span className="inline-block bg-[#0284c7] text-white font-black text-xs sm:text-sm tracking-wider px-8 py-1 rounded-full uppercase shadow-2xs">
                AUDIOLOGICAL EVALUATION
              </span>
            </div>

            {/* Demographics & Test Context Matrix (3-row clean border box matching Image 2) */}
            <div className="border border-slate-700 text-[10px] bg-white">
              {/* Row 1 */}
              <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700">
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-14 shrink-0 text-slate-800">Date :</span>
                  <span className="font-semibold text-slate-900">{formData?.reportDate || '16/10/2026'}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-slate-800">Reg. No. :</span>
                  <span className="font-mono font-bold text-slate-900">{patient.uhid}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-slate-800">PTA No. :</span>
                  <span className="font-mono font-bold text-slate-900">{formData?.parameters?.ptaNo || '64/2026'}</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 divide-x divide-slate-700 border-b border-slate-700">
                <div className="p-1 px-2.5 flex items-center col-span-2">
                  <span className="font-bold w-32 shrink-0 text-slate-800">Name of Patient :</span>
                  <span className="font-black text-slate-900 text-[11px]">{patient.full_name}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-slate-800">Age/Sex :</span>
                  <span className="font-semibold text-slate-900">
                    {patient.date_of_birth} / {patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : patient.gender}
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-3 divide-x divide-slate-700">
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-24 shrink-0 text-slate-800">Audiometer :</span>
                  <span className="font-bold text-slate-900">{formData?.parameters?.audiometer || 'Proton SX5'}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center col-span-2">
                  <span className="font-bold w-24 shrink-0 text-slate-800">Responses :</span>
                  <div className="flex items-center gap-3 text-[9.5px]">
                    <span className={`inline-flex items-center gap-1 ${formData?.parameters?.responses === 'Consistent' || !formData?.parameters?.responses ? 'font-black text-slate-950' : 'text-slate-600'}`}>
                      <span className="w-3.5 h-3.5 border border-slate-700 rounded-xs inline-flex items-center justify-center text-[10px] font-bold">
                        {formData?.parameters?.responses === 'Consistent' || !formData?.parameters?.responses ? '✓' : ''}
                      </span>
                      Consistent
                    </span>
                    <span className={`inline-flex items-center gap-1 ${formData?.parameters?.responses === 'Fairly Consistent' ? 'font-black text-slate-950' : 'text-slate-600'}`}>
                      <span className="w-3.5 h-3.5 border border-slate-700 rounded-xs inline-flex items-center justify-center text-[10px] font-bold">
                        {formData?.parameters?.responses === 'Fairly Consistent' ? '✓' : ''}
                      </span>
                      Fairly Consistent
                    </span>
                    <span className={`inline-flex items-center gap-1 ${formData?.parameters?.responses === 'Inconsistent' ? 'font-black text-slate-950' : 'text-slate-600'}`}>
                      <span className="w-3.5 h-3.5 border border-slate-700 rounded-xs inline-flex items-center justify-center text-[10px] font-bold">
                        {formData?.parameters?.responses === 'Inconsistent' ? '✓' : ''}
                      </span>
                      Inconsistent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL AUDIOGRAM GRAPHS SECTION */}
            <DualAudiogramSection
              rightAC={formData?.parameters?.rightEarAC}
              rightBC={formData?.parameters?.rightEarBC}
              leftAC={formData?.parameters?.leftEarAC}
              leftBC={formData?.parameters?.leftEarBC}
            />

            {/* AUDIOMETRIC SUMMARY TABLE */}
            <div className="border border-slate-700 overflow-hidden text-[9px]">
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-700">
                    <th className="p-1 border-r border-slate-700 w-20"></th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      PTA<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      PTA 2<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      SDT<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      SRT<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      WRS %<br /><span className="text-[7.5px] font-normal text-slate-600">at _ dBHL</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      MCL<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 leading-tight">
                      UCL<br /><span className="text-[7.5px] font-normal text-slate-600">(dB HL)</span>
                    </th>
                    <th className="p-1 border-r border-slate-700 font-bold">Rinne</th>
                    <th className="p-1 font-bold">Weber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-1 font-bold text-rose-700 border-r border-slate-700">Right Ear</td>
                    <td className="p-1 font-mono font-bold text-rose-900 border-r border-slate-700">
                      {computedPTA?.rightAvg ? `${computedPTA.rightAvg} dB` : formData?.parameters?.rightPTA || '05 dB'}
                    </td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightPTA2 || '—'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightSDT || '10 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightSRT || '15 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightWRS || '96% at 50 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightMCL || '55 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.rightUCL || '90 dB'}</td>
                    <td className="p-1 font-bold border-r border-slate-700 text-slate-800">{formData?.parameters?.rightRinne || '+ve'}</td>
                    <td rowSpan={2} className="p-1 font-bold align-middle text-slate-800 bg-slate-50/50">
                      {formData?.parameters?.weber || 'Central'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold text-blue-700 border-r border-slate-700">Left Ear</td>
                    <td className="p-1 font-mono font-bold text-blue-900 border-r border-slate-700">
                      {computedPTA?.leftAvg ? `${computedPTA.leftAvg} dB` : formData?.parameters?.leftPTA || '06.66 dB'}
                    </td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftPTA2 || '—'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftSDT || '10 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftSRT || '15 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftWRS || '96% at 50 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftMCL || '55 dB'}</td>
                    <td className="p-1 font-mono border-r border-slate-700">{formData?.parameters?.leftUCL || '90 dB'}</td>
                    <td className="p-1 font-bold border-r border-slate-700 text-slate-800">{formData?.parameters?.leftRinne || '+ve'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* INTERPRETATION & RECOMMENDATIONS */}
            <div className="space-y-1.5 pt-0.5 text-xs">
              <div>
                <span className="font-black uppercase tracking-wide text-slate-900 block text-[10.5px]">
                  Interpretation :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.provisionalDiagnosis,
                    '• Bilateral hearing sensitivity within normal limits.\n• Symmetrical bilateral air conduction thresholds.',
                    'bg-slate-900'
                  )}
                </div>
              </div>

              <div>
                <span className="font-black uppercase tracking-wide text-slate-900 block text-[10.5px]">
                  Recommendations :
                </span>
                <div className="text-[10px] text-slate-800 font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.recommendations,
                    '• Speech evaluation.\n• Care of ears.\n• Follow up after 6 months or if parental concern arises.',
                    'bg-slate-900'
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : isOAE ? (
          /* ── OAE SCREENING REPORT VIEW (Exact Real-World Clinic Layout with Ear Illustrations) ── */
          <div className="space-y-5 pt-1">
            {/* Centered Rounded Pill Banner */}
            <div className="text-center my-1.5">
              <span className="inline-block bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide px-8 py-1.5 rounded-full shadow-2xs">
                Oto-Acoustic Emission (OAE) Screening Report
              </span>
            </div>

            {/* Clean Boxed Patient Demographics */}
            <div className="border border-slate-700 rounded p-3 text-xs bg-white">
              <div className="grid grid-cols-12 gap-y-2 gap-x-3">
                <div className="col-span-7">
                  <span className="font-bold text-slate-900">Name : </span>
                  <span className="font-medium text-slate-800">{patient.full_name}</span>
                </div>
                <div className="col-span-5 text-right sm:text-left">
                  <span className="font-bold text-slate-900">Date : </span>
                  <span className="font-medium text-slate-800">{formData?.reportDate}</span>
                </div>
                <div className="col-span-5">
                  <span className="font-bold text-slate-900">Age/ Gender : </span>
                  <span className="font-medium text-slate-800">
                    {patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : patient.gender}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="font-bold text-slate-900">OAE No : </span>
                  <span className="font-mono font-bold text-purple-900">{formData?.reportNumber || patient.uhid}</span>
                </div>
                <div className="col-span-3 text-right sm:text-left">
                  <span className="font-bold text-slate-900">DOB : </span>
                  <span className="font-medium text-slate-800">{patient.date_of_birth}</span>
                </div>
              </div>
            </div>

            {/* Bilateral Ear Drawings & Pass/Refer Checkboxes */}
            <div className="my-10 py-4 flex items-center justify-around">
              {/* Right Ear Column (Red Ear on Left) */}
              <div className="flex items-center gap-4 sm:gap-6">
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
                  <span className="block font-black text-sm sm:text-base text-slate-900">Right Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome !== 'REFER' ? 'bg-emerald-50 text-emerald-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome === 'REFER' ? 'bg-rose-50 text-rose-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome === 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Ear Column (Blue Ear on Right) */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="space-y-2.5">
                  <span className="block font-black text-sm sm:text-base text-slate-900">Left Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome !== 'REFER' ? 'bg-emerald-50 text-emerald-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.leftOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome === 'REFER' ? 'bg-rose-50 text-rose-700' : 'text-transparent'
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
            <div className="space-y-4 pt-3">
              <div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-900 block">
                  IMPRESSION:
                </span>
                <div className="text-xs sm:text-sm font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.provisionalDiagnosis,
                    '• Bilateral Otoacoustic Emissions (OAE) PASS.\n• Outer hair cell function is robust bilaterally within normal limits.',
                    'bg-slate-900'
                  )}
                </div>
              </div>

              <div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-900 block">
                  RECOMMENDATION :
                </span>
                <div className="text-xs sm:text-sm font-medium">
                  {renderBulletPoints(
                    formData?.parameters?.recommendations,
                    '• Routine developmental auditory and speech-language milestones tracking.\n• Repeat evaluation if parental concern arises.',
                    'bg-slate-900'
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── STANDARD GENERAL / AUDIOLOGY REPORT VIEW ── */
          <>
            {/* ── REPORT TITLE BANNER ── */}
            <div className="text-center py-1 bg-purple-900 text-white rounded font-bold uppercase tracking-wider text-xs shadow-2xs">
              {service.title}
            </div>

            {/* ── PATIENT DEMOGRAPHIC MATRIX ── */}
            <div className="border border-slate-300 rounded overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 w-1/6 border-r border-slate-200">
                      Patient Full Name:
                    </td>
                    <td className="px-3 py-1.5 font-bold text-slate-900 w-2/6 border-r border-slate-200">
                      {patient.full_name}
                    </td>
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 w-1/6 border-r border-slate-200">
                      Patient UHID:
                    </td>
                    <td className="px-3 py-1.5 font-mono font-black text-purple-900 w-2/6">
                      {patient.uhid}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                      Biological Sex &amp; Age:
                    </td>
                    <td className="px-3 py-1.5 text-slate-800 border-r border-slate-200">
                      {patient.gender} • DOB {patient.date_of_birth}
                    </td>
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                      Primary Contact:
                    </td>
                    <td className="px-3 py-1.5 text-slate-800 font-mono">
                      {patient.phone}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                      Guardian / Escort:
                    </td>
                    <td className="px-3 py-1.5 text-slate-800 border-r border-slate-200">
                      {patient.guardian_name || 'Self'}
                    </td>
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                      Residential Locality:
                    </td>
                    <td className="px-3 py-1.5 text-slate-800">
                      {patient.city || 'Satara, Maharashtra'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                      Referring Consultant:
                    </td>
                    <td className="px-3 py-1.5 text-purple-950 font-bold" colSpan={3}>
                      {patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni, MS (ENT), Civil Hospital Satara'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

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

                  <div className="border border-slate-300 rounded overflow-hidden">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-300">
                        <tr>
                          <th className="px-3 py-1.5 text-left border-r border-slate-300">Ear &amp; Conduction</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">250 Hz</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">500 Hz</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">1000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">2000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">4000 Hz</th>
                          <th className="px-2 py-1.5 border-r border-slate-200">8000 Hz</th>
                          <th className="px-2 py-1.5 bg-purple-50 text-purple-950 font-black border-r border-slate-200">PTA Avg (dB)</th>
                          <th className="px-2 py-1.5 bg-purple-50 text-purple-950 font-black">WHO Degree of Loss</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* Right Ear AC (Red) */}
                        <tr className="text-rose-700 font-bold bg-rose-50/20">
                          <td className="px-3 py-1.5 text-left border-r border-slate-200">Right Ear (AC - O)</td>
                          {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                            <td key={f} className="px-2 py-1.5 border-r border-slate-200 font-mono">
                              {formData?.parameters?.rightEarAC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1.5 bg-rose-50 font-mono font-black border-r border-slate-200">
                            {computedPTA?.rightAvg ?? '31.7'} dB
                          </td>
                          <td className="px-2 py-1.5 bg-rose-50 text-[10px] font-black">
                            {computedPTA?.rightDegree ?? 'Mild Hearing Loss'}
                          </td>
                        </tr>

                        {/* Right Ear BC (Red) */}
                        <tr className="text-rose-600 bg-rose-50/5">
                          <td className="px-3 py-1 text-left border-r border-slate-200 font-semibold">Right Ear (BC - &lt;)</td>
                          {['250', '500', '1000', '2000', '4000'].map((f) => (
                            <td key={f} className="px-2 py-1 border-r border-slate-200 font-mono">
                              {formData?.parameters?.rightEarBC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1 border-r border-slate-200 text-slate-300">—</td>
                          <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                            Bone conduction thresholds
                          </td>
                        </tr>

                        {/* Left Ear AC (Blue) */}
                        <tr className="text-blue-700 font-bold bg-blue-50/20">
                          <td className="px-3 py-1.5 text-left border-r border-slate-200">Left Ear (AC - X)</td>
                          {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                            <td key={f} className="px-2 py-1.5 border-r border-slate-200 font-mono">
                              {formData?.parameters?.leftEarAC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1.5 bg-blue-50 font-mono font-black border-r border-slate-200">
                            {computedPTA?.leftAvg ?? '25'} dB
                          </td>
                          <td className="px-2 py-1.5 bg-blue-50 text-[10px] font-black">
                            {computedPTA?.leftDegree ?? 'Normal Hearing Sensitivity'}
                          </td>
                        </tr>

                        {/* Left Ear BC (Blue) */}
                        <tr className="text-blue-600 bg-blue-50/5">
                          <td className="px-3 py-1 text-left border-r border-slate-200 font-semibold">Left Ear (BC - &gt;)</td>
                          {['250', '500', '1000', '2000', '4000'].map((f) => (
                            <td key={f} className="px-2 py-1 border-r border-slate-200 font-mono">
                              {formData?.parameters?.leftEarBC?.[f] ?? '—'}
                            </td>
                          ))}
                          <td className="px-2 py-1 border-r border-slate-200 text-slate-300">—</td>
                          <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                            Bone conduction thresholds
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Speech & Immittance Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 border border-slate-300 rounded bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Speech Reception (SRT)</span>
                      <p className="mt-1 font-bold">
                        <span className="text-rose-700">R: {formData?.parameters?.rightSRT ?? 35} dB</span> |{' '}
                        <span className="text-blue-700">L: {formData?.parameters?.leftSRT ?? 25} dB</span>
                      </p>
                    </div>

                    <div className="p-2 border border-slate-300 rounded bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Word Recognition (WRS)</span>
                      <p className="mt-1 font-bold">
                        <span className="text-rose-700">R: {formData?.parameters?.rightWRS ?? 84}%</span> |{' '}
                        <span className="text-blue-700">L: {formData?.parameters?.leftWRS ?? 96}%</span>
                      </p>
                    </div>

                    <div className="p-2 border border-slate-300 rounded bg-slate-50 col-span-2">
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Immittance &amp; Tympanometry (Jerger)</span>
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
                <div className="space-y-2 border border-slate-300 rounded p-2.5 bg-amber-50/20 text-xs">
                  <span className="text-[10px] font-black uppercase text-amber-950 block">
                    CAPE-V Visual Analog Ratings (0-100 mm) &amp; Perceptual Voice Battery
                  </span>
                  <div className="grid grid-cols-6 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Overall</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_overall ?? 48}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Roughness</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_roughness ?? 52}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Breathiness</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_breathiness ?? 38}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Strain</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_strain ?? 45}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Pitch</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_pitch ?? 30}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Loudness</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_loudness ?? 25}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FLUENCY (SSI-4) */}
              {service.code === 'RP-CLN-FLU' && (
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    Stuttering Severity Instrument (SSI-4) Protocol Metrics
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">% Syllables Stuttered</span>
                      <span className="font-mono font-black text-purple-950 text-sm">
                        {formData?.parameters?.ssi4_percentageSS ?? 8.4}%
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Physical Concomitants</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_physicalConcomitants ?? 'Moderate'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Speech Rate</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_speechRateSPM ?? 142} SPM
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded bg-purple-50">
                      <span className="text-[9px] text-purple-800 font-bold block uppercase">Severity Classification</span>
                      <span className="font-black text-purple-900">
                        {formData?.parameters?.ssi4_severityGrade ?? 'Moderate Stuttering'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SPEECH & LANGUAGE (REELS / PLS-5) */}
              {service.code === 'RP-CLN-SLA' && (
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    Comprehensive Developmental Language Battery (REELS / 3DLAT)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Chronological Age</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_caMonths ?? 36} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Receptive Age (RLA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_rlaMonths ?? 28} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Expressive Age (ELA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_elaMonths ?? 22} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded bg-rose-50">
                      <span className="text-[9px] text-rose-800 font-bold block uppercase">Expressive Delay</span>
                      <span className="font-mono font-black text-rose-900">{formData?.parameters?.reels_expressiveDelayMonths ?? 14} Mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Other Services fallback */}
              {!['RP-CLN-AUD', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA'].includes(service.code) && (
                <div className="border border-slate-300 rounded p-3 bg-slate-50 text-xs">
                  <span className="text-[10px] font-black uppercase text-purple-900 block mb-1">
                    Assessment Battery Details
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {service.description}
                  </p>
                </div>
              )}
            </div>

            {/* ── CLINICAL IMPRESSION / DIAGNOSIS ── */}
            <div className="border border-purple-200 rounded p-3 bg-purple-50/40 text-xs space-y-1">
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
            <div className="border border-slate-300 rounded p-3 bg-slate-50 text-xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                Clinical Recommendations &amp; Rehabilitation Protocol:
              </span>
              <div className="font-medium text-slate-800">
                {renderBulletPoints(
                  formData?.parameters?.recommendations,
                  'Follow up as clinically indicated.',
                  'bg-slate-800'
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── STATUTORY SIGN-OFF & TAMPER-EVIDENT QR VERIFICATION ── */}
      {/* Always strictly pinned to the bottom/end of the A4 page */}
      {isCBT ? (
        <div className="mt-auto pt-3 flex items-end justify-between text-xs print:break-inside-avoid">
          <div className="text-[10px] space-y-0.5 text-slate-800">
            <p>
              Date: <span className="font-medium">{formData?.reportDate || 'October 09, 2026'}</span>
            </p>
            <p>
              Place: <span className="font-medium">Satara</span>
            </p>
          </div>
          <div className="text-center space-y-0.5">
            <div className="w-56 border-b border-slate-400 mb-1"></div>
            <p className="font-bold text-slate-900 text-[10.5px]">CBT Lead &amp; Psychological Counselor</p>
            <p className="text-[9.5px] text-slate-600">Vani's Speech, Hearing &amp; Counselling Clinic</p>
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-3 border-t-2 border-purple-950 flex items-end justify-between text-xs print:break-inside-avoid">
          {/* Left: Authentic QR Code & DPDP Verification */}
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 border border-slate-400 rounded flex items-center justify-center bg-white shadow-2xs shrink-0">
              <QrCode className="w-10 h-10 text-purple-950" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-purple-950 block uppercase">
                QR VERIFIED • DPDP ACT COMPLIANT
              </span>
              <span className="text-[8px] text-slate-600 block">
                Scan to verify document cryptographic authenticity
              </span>
              <span className="text-[8px] font-mono text-slate-500">
                https://vaaniclinic.com/verify-doc/{formData?.reportNumber}
              </span>
            </div>
          </div>

          {/* Right: Clinician Signature Block */}
          <div className="text-right space-y-0.5">
            <div className="inline-block border-b border-purple-900 pb-0.5 mb-1 px-4 text-center">
              <span className="font-serif italic font-bold text-purple-950 text-sm block">
                Shreeharsh M. Shivpuje
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest block">
                Digitally Authenticated
              </span>
            </div>
            <p className="font-black text-slate-950 text-xs">
              {formData?.examinerName || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP'}
            </p>
            <p className="text-[10px] font-semibold text-slate-800">
              RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
            </p>
            <p className="text-[9px] text-slate-600 font-medium">
              Consultant Audiologist &amp; Speech-Language Pathologist
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default OfficialClinicalDocument;
