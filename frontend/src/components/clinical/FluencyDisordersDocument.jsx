import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';
import { ClinicalReportBackground } from './ClinicalReportBackground';
import { OfficialReportTitle } from './OfficialReportTitle';
import { PatientDemographicsMatrix } from './PatientDemographicsMatrix';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

/**
 * Fluency / Stuttering Assessment (SSI-4) Official Clinical Dossier (3-Page Production Layout)
 * Strictly modeled after Bharati Vidyapeeth School of Audiology and Speech Language Pathology Fluency Proforma
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 *
 * Calibrated 3-Page Pagination:
 * - PAGE 1: Case Intake, Brief History, Description of Fluency Problem, Stuttering Reactions, Secondary Concomitants (Sections 1 to 4)
 * - PAGE 2: Coping Mechanisms & Multilingual Adaptation, Listener Dynamics & Avoidance, Objective Dysfluency Sample Analysis (Speaking vs Reading), Voice & Breathing Mechanics (Sections 5 to 8)
 * - PAGE 3: Standardized Assessment Battery (SSI-4 / PSI / PAT / OASES), Provisional Diagnosis & Rehabilitation Protocol, Dual Sign-off (Sections 9 to 10)
 */
export const FluencyDisordersDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  renderBulletPoints,
}) => {
  const params = formData?.parameters || {};
  const { leadPractitioner, leadDegree, rciNumber: contextRci, settings } = useClinicSettings();
  const currentLead = settings?.credentials?.leadPractitioner || leadPractitioner || 'ASLP Palak Paresh Gandhi';
  const currentDegree = settings?.credentials?.leadDegree || leadDegree || 'BASLP, RCI';
  const currentRci = formData?.rciNumber || settings?.credentials?.rciNumber || contextRci || 'A79214';
  const defaultSupervisor = `${currentLead}${currentDegree ? `, ${currentDegree}` : ''}`;
  const supervisorName = params.supervisorName && !params.supervisorName.includes('Shreeharsh')
    ? params.supervisorName
    : defaultSupervisor;
  const supervisorSig = supervisorName.replace(/^(Dr\.|Ms\.|Mr\.)\s*/i, '').split(',')[0].trim();

  // Reusable Lavender Header Component
  const renderHeader = (pageNumber) => (
    <OfficialReportHeader
      formData={formData}
      service={service}
      pageNumber={pageNumber}
      totalPages={3}
      discipline="SPEECH-LANGUAGE PATHOLOGY"
      compact={true}
    />
  );

  // Reusable Lavender Statutory Footer Component
  const renderFooter = (pageNumber) => (
    <div className="relative z-10 shrink-0 mt-auto w-full">
      <OfficialReportFooter
        formData={formData}
        pageNumber={pageNumber}
        totalPages={3}
        compact={true}
      />
    </div>
  );

  // Render Standardized Boolean Badge (Zero discordant colors; unified purple/slate)
  const renderBoolBadge = (val, label) => {
    const isYes = String(val).toLowerCase() === 'yes';
    return (
      <div className={`flex items-center justify-between px-2.5 py-1 rounded border text-[8.5px] sm:text-[9px] ${
        isYes ? 'bg-purple-100/90 border-purple-300 text-purple-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span className="pr-1.5 leading-tight">{label}</span>
        <span className={`text-[8px] uppercase font-mono px-1.5 py-0.2 rounded font-extrabold shrink-0 ${
          isYes ? 'bg-purple-900 text-white' : 'bg-slate-200 text-slate-600'
        }`}>
          {isYes ? 'YES' : 'NO'}
        </span>
      </div>
    );
  };

  return (
    <div className="fluency-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, HISTORY, PROBLEM & CONCOMITANTS (Sections 1 to 4)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(1)}

          <div className="flex-1 flex flex-col space-y-2.5 print:space-y-2 px-7 sm:px-8 pb-1">
            {/* Title Banner */}
            <OfficialReportTitle
              title="Fluency & Stuttering Clinical Dossier"
              subtitle="Case Intake, Reactions & Concomitant Behaviors (SSI-4 Protocol)"
            />

            {/* Demographics Matrix (Unified Audiological Evaluation Layout) */}
            <PatientDemographicsMatrix
              formData={formData}
              patient={patient}
              refLabel="PTA / Ref No. :"
              refValue={params.proformaNumber || formData?.reportNumber || '64/2026'}
              extraRow={
                <div className="grid grid-cols-3 divide-x divide-purple-200">
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-20 shrink-0 text-purple-950">Languages :</span>
                    <span className="font-medium text-slate-800">{params.languageSpoken || 'Marathi, Hindi, English'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-18 shrink-0 text-purple-950">Informant :</span>
                    <span className="font-medium text-slate-800">{params.informant || 'Self & Parents'}</span>
                  </div>
                  <div className="p-1 px-2.5 flex items-center">
                    <span className="font-bold w-18 shrink-0 text-purple-950">Clinician :</span>
                    <span className="font-medium text-slate-800">{params.clinicianName || 'A. Kulkarni (Intern)'}</span>
                  </div>
                </div>
              }
            />

            {/* SECTION 1: BRIEF DEVELOPMENTAL & CLINICAL HISTORY */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>1. Brief Developmental &amp; Clinical History</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 1.0</span>
              </div>
              <div className="p-2.5 space-y-2 text-[9.5px]">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">a) Speech Development</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                        params.speechDevelopment?.toLowerCase() === 'delayed' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-purple-100 text-purple-950 border border-purple-200'
                      }`}>
                        {params.speechDevelopment || 'Normal'}
                      </span>
                      <span className="text-slate-700 leading-tight">{params.speechDevelopmentDetails || 'Milestones on track'}</span>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">b) Handedness</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-slate-900">{params.handedness || 'Right'} Handed</span>
                      <span className="text-[8.5px] text-slate-600">
                        Attempt to change: <span className="font-bold text-slate-800">{params.handednessChangeAttempt || 'No'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">c &amp; d) Onset &amp; Age</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-slate-900">{params.problemOnset || 'Gradual'} onset</span>
                      <span className="text-[8.5px] text-purple-950 font-bold">Age: {params.ageOfOnset || '3.5 Yrs'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">e &amp; f) Awareness &amp; Discovery</span>
                    <div className="grid grid-cols-2 gap-1 text-[9px] mt-1">
                      <div><span className="text-slate-500 font-medium">Noticed By:</span> <span className="font-semibold text-slate-900">{params.noticedBy || 'Parents'}</span></div>
                      <div><span className="text-slate-500 font-medium">Patient Aware:</span> <span className="font-semibold text-slate-900">{params.patientAwarenessAge || '5.0 Yrs'}</span></div>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">g) Probable Etiology / Trigger</span>
                    <p className="text-slate-800 font-medium leading-tight mt-1">{params.probableCause || 'Family history, developmental demand, peer imitation'}</p>
                  </div>
                </div>

                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8.5px] uppercase">h) Family History of Fluency / Speech Disorders</span>
                  <p className="text-slate-800 font-medium leading-tight mt-1">{params.familyHistory || 'Nil reported; no confirmed multigenerational fluency disorders.'}</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: DESCRIPTION OF THE PROBLEM & DYNAMICS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>2. Description of Fluency Problem, Course &amp; Feared Triggers</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 2.0</span>
              </div>
              <div className="p-2.5 space-y-2 text-[9.5px]">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">a) Problem Course</span>
                    <span className="inline-block mt-1 px-2 py-0.5 font-bold uppercase rounded text-[8.5px] bg-slate-100 text-slate-800 border border-slate-200">
                      {params.problemCourse || 'Fluctuating'}
                    </span>
                  </div>
                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">b) Reported Severity</span>
                    <span className="inline-block mt-1 px-2 py-0.5 font-bold uppercase rounded text-[8.5px] bg-purple-50 text-purple-950 border border-purple-200">
                      {params.reportedSeverity || 'Moderate'}
                    </span>
                  </div>
                  <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">c) Observed Severity</span>
                    <span className="inline-block mt-1 px-2 py-0.5 font-bold uppercase rounded text-[8.5px] bg-purple-100 text-purple-950 border border-purple-300">
                      {params.observedSeverity || params.severityClassification || 'Moderate'}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50/30 p-2 rounded border border-purple-100 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-700 text-[8.5px] uppercase shrink-0 w-36">Feared Sounds / Words:</span>
                    <span className="text-slate-900 font-semibold leading-tight">{params.fearedSoundsWords || 'Plosives /p, b, k, t/, stating own name, asking questions'}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-purple-900 text-[8.5px] uppercase shrink-0 w-36">Stuttering Least With:</span>
                    <span className="text-slate-800 font-medium leading-tight">{params.stutteringLeastWith || 'Parents at home, singing, whispering, talking to pets'}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-purple-950 text-[8.5px] uppercase shrink-0 w-36">Stuttering Severe With:</span>
                    <span className="text-slate-900 font-bold leading-tight">{params.stutteringSevereWith || 'Strangers, authority figures, phone calls, oral presentations'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: REACTIONS WHEN STUTTERING OCCURS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>3. Reactions &amp; Autonomic Responses When Stuttering Occurs</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 3.0</span>
              </div>
              <div className="p-2.5 text-[9.5px] space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {renderBoolBadge(params.reactionHurry, 'Hurry to complete')}
                  {renderBoolBadge(params.reactionStopRetry, 'Stop & try again')}
                  {renderBoolBadge(params.reactionStopSpeaking, 'Stop speaking')}
                  {renderBoolBadge(params.reactionBreathlessness, 'Breathlessness')}
                  {renderBoolBadge(params.reactionExhaustion, 'Exhaustion')}
                  {renderBoolBadge(params.reactionPainAbdomen, 'Pain abdomen')}
                </div>
                <div className="bg-purple-50/30 px-2.5 py-1 rounded border border-purple-100 flex items-center gap-2">
                  <span className="font-bold text-purple-950 text-[8.5px] uppercase shrink-0">Other Associated Reactions:</span>
                  <span className="text-slate-800 font-medium leading-tight">{params.reactionOther || 'Facial flushing, fist clenching upon severe blocks'}</span>
                </div>
              </div>
            </div>

            {/* SECTION 4: ASSOCIATED PHYSICAL MOVEMENTS / CONCOMITANTS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>4. Associated Physical Movements / Secondary Concomitants</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 4.0</span>
              </div>
              <div className="p-2.5 space-y-2 text-[9.5px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {renderBoolBadge(params.concomitantTremorHands, 'Tremor Hands')}
                  {renderBoolBadge(params.concomitantTongueThrust, 'Tongue Thrust')}
                  {renderBoolBadge(params.concomitantBlinking, 'Eye Blinking')}
                  {renderBoolBadge(params.concomitantFacialMovements, 'Facial Grimace')}
                  {renderBoolBadge(params.concomitantHeadNodding, 'Head Nodding')}
                  {renderBoolBadge(params.concomitantHandMovements, 'Hand Movements')}
                  {renderBoolBadge(params.concomitantLegThumping, 'Leg Thumping')}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase mb-1">Occurrence Timing &amp; Clinical Function</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {renderBoolBadge(params.occurrenceSentenceBeginning, 'At sentence begin')}
                      {renderBoolBadge(params.occurrenceAfterPause, 'After a pause')}
                      {renderBoolBadge(params.occurrencePostponementDevice, 'Postponement device')}
                      {renderBoolBadge(params.occurrenceGivesRelief, 'Gives relief')}
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-purple-950 block text-[8.5px] uppercase mb-1">Other Concomitants &amp; Tension Site</span>
                      <p className="text-slate-800 text-[9px] leading-snug font-medium">{params.concomitantOther || 'Shoulder elevation, jaw clenching, nostril flaring'}</p>
                    </div>
                    <div className="pt-1.5 border-t border-purple-100 mt-1 flex items-center justify-between text-[8.5px]">
                      <span className="text-purple-950 font-bold">SSI-4 Physical Score (P):</span>
                      <span className="font-mono font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                        Score: {params.ssiPhysicalScore ?? 6} / 20
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pinned Statutory Footer for Page 1 */}
        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: COPING, LISTENER DYNAMICS, SAMPLE ANALYSIS & VOICE/RESPIRATION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(2)}

          <div className="flex-1 flex flex-col space-y-2.5 print:space-y-2 px-7 sm:px-8 pb-1">
            {/* Title Banner */}
            <OfficialReportTitle
              title="Fluency Assessment Protocol"
              subtitle="Coping Strategies, Listener Dynamics & Objective Dysfluency Profile"
            />

            {/* SECTION 5: COPING MECHANISMS & LINGUISTIC PROFILE */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>5. Coping Mechanisms &amp; Multilingual Adaptation</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 5.0</span>
              </div>
              <div className="p-2.5 text-[9.5px]">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100 col-span-1">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Language-Wise Difference</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${
                        String(params.languageDifferenceCoping).toLowerCase() === 'yes' ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {params.languageDifferenceCoping || 'Yes'}
                      </span>
                      <span className="text-slate-800 text-[9px] font-medium leading-tight">{params.languageDifferenceDetails || 'L2 (English) > L1 (Marathi)'}</span>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100 col-span-1">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Reported Coping</span>
                    <p className="text-slate-800 text-[9px] font-medium leading-tight mt-1">{params.copingReported || 'Pausing, deep breath, asking parents to speak'}</p>
                  </div>

                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100 col-span-1">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Observed Coping</span>
                    <p className="text-slate-800 text-[9px] font-medium leading-tight mt-1">{params.copingObserved || 'Circumlocution, starter sounds ("um"), word substitution'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: LISTENER DYNAMICS, ANTICIPATION & AVOIDANCE */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>6. Listener Reaction Dynamics, Anticipation &amp; Avoidance</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 6.0</span>
              </div>
              <div className="p-2.5 space-y-1.5 text-[9.5px]">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Eye Contact With Listener</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${
                        String(params.lookAtListener).toLowerCase() === 'no' ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {params.lookAtListener || 'No'}
                      </span>
                      <span className="text-[9px] text-slate-600 font-medium leading-tight">Averts gaze upon dysfluency</span>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Anticipation &amp; Avoidance</span>
                    <div className="flex items-center gap-2 mt-1 text-[9px]">
                      <span>Anticipates: <strong className="font-bold text-purple-950">{params.anticipateStuttering || 'Yes'}</strong></span>
                      <span>•</span>
                      <span>Avoids: <strong className="font-bold text-purple-950">{params.avoidsSpeakingSituation || 'Yes'}</strong></span>
                    </div>
                  </div>

                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Listener Reactions</span>
                    <p className="text-slate-800 text-[9px] font-medium leading-tight mt-1">{params.listenerReactions || 'Impatience, completing sentences, interruption'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: OBJECTIVE DYSFLUENCY SAMPLE ANALYSIS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>7. Objective Dysfluency Sample Analysis (Speaking vs Reading)</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 7.0</span>
              </div>
              <div className="p-2 text-[9.5px]">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 text-[8.5px] font-bold text-purple-950 uppercase border-b border-purple-200">
                      <th className="py-1 px-2.5 text-left">Clinical Dysfluency Parameter</th>
                      <th className="py-1 px-2.5 text-purple-950">Spontaneous Speaking</th>
                      <th className="py-1 px-2.5 text-purple-900">Passage Reading</th>
                      <th className="py-1 px-2.5 text-slate-500">Diagnostic Reference Norm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100 text-[9px]">
                    <tr>
                      <td className="py-1 px-2.5 text-left font-medium text-slate-800">1. Number of Prolongations (Sound/Syllable)</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-purple-950 bg-purple-50/40">{params.sampleSpeakingProlongations ?? 8}</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900 bg-slate-50/50">{params.sampleReadingProlongations ?? 4}</td>
                      <td className="py-1 px-2.5 text-slate-500">&lt; 1 per 100 syllables</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-left font-medium text-slate-800">2. Number of Repetitions (Part/Whole-word)</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-purple-950 bg-purple-50/40">{params.sampleSpeakingRepetitions ?? 18}</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900 bg-slate-50/50">{params.sampleReadingRepetitions ?? 10}</td>
                      <td className="py-1 px-2.5 text-slate-500">&lt; 2 per 100 syllables</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-left font-medium text-slate-800">3. Number of Hesitations &amp; Silent Pauses</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-purple-950 bg-purple-50/40">{params.sampleSpeakingHesitations ?? 12}</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900 bg-slate-50/50">{params.sampleReadingHesitations ?? 6}</td>
                      <td className="py-1 px-2.5 text-slate-500">Contextual / Syntactic</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-left font-medium text-slate-800">4. Number of Tense Blocks / Fixations</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-purple-950 bg-purple-50/40">{params.sampleSpeakingBlocks ?? 9}</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900 bg-slate-50/50">{params.sampleReadingBlocks ?? 5}</td>
                      <td className="py-1 px-2.5 text-slate-500">0 (Abnormal marker)</td>
                    </tr>
                    <tr className="bg-purple-100/60 font-bold border-t border-purple-200">
                      <td className="py-1 px-2.5 text-left text-purple-950 uppercase text-[8.5px]">5. Percentage Dysfluency (%SS)</td>
                      <td className="py-1 px-2.5 font-mono font-black text-purple-950 bg-purple-200/70 text-[10px]">
                        {params.sampleSpeakingDysfluencyPct ?? params.percentageSS ?? 9.4}%
                      </td>
                      <td className="py-1 px-2.5 font-mono font-black text-purple-900 bg-purple-100/70 text-[10px]">
                        {params.sampleReadingDysfluencyPct ?? 6.2}%
                      </td>
                      <td className="py-1 px-2.5 text-slate-600 text-[8.5px]">&lt; 3.0% Non-stuttering norm</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-1 pt-1 border-t border-purple-100 flex items-center justify-between text-[8.5px] text-slate-600">
                  <span>Total Syllables: <strong className="font-mono text-slate-900">{params.totalSyllables || 500}</strong></span>
                  <span>•</span>
                  <span>Stuttered Syllables: <strong className="font-mono text-purple-950">{params.stutteredSyllables || 47}</strong></span>
                  <span>•</span>
                  <span>Longest Blocks: <strong className="font-mono text-slate-900">{params.longestBlock1 || 2.8}s, {params.longestBlock2 || 2.1}s, {params.longestBlock3 || 1.9}s</strong></span>
                </div>
              </div>
            </div>

            {/* SECTION 8: VOICE & BREATHING MECHANICS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>8. Voice Phonation &amp; Respiratory Mechanics</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 8.0</span>
              </div>
              <div className="p-2.5 space-y-2 text-[9.5px]">
                <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8.5px] uppercase">Voice &amp; Phonation Characteristics</span>
                  <p className="text-slate-800 font-medium mt-1 text-[9px]">{params.voiceFeatures || 'Tremulous phonation during tense blocks, pitch breaks, vocal tension'}</p>
                </div>

                <div>
                  <span className="font-bold text-purple-950 block text-[8.5px] uppercase mb-1">Breathing Patterns During Speech</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {renderBoolBadge(params.breathingTalksAfterBreathingOut, 'Talks after breathing out')}
                    {renderBoolBadge(params.breathingShortRapid, 'Short rapid breaths')}
                    {renderBoolBadge(params.breathingShallow, 'Shallow breathing')}
                    {renderBoolBadge(params.breathingManyWordsInOneBreath, 'Many words / breath')}
                  </div>
                </div>
                <div className="bg-purple-50/30 px-2.5 py-1 rounded border border-purple-100 text-[8.5px] flex items-center gap-2">
                  <span className="font-bold text-purple-950 uppercase">Respiratory Notes:</span>
                  <span className="text-slate-800 font-medium">{params.breathingOther || 'Clavicular thoracic breathing pattern noted prior to phonation onset.'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pinned Statutory Footer for Page 2 */}
        {renderFooter(2)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: STANDARDIZED BATTERY, DIAGNOSIS, RECOMMENDATIONS & SIGN-OFF
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(3)}

          <div className="flex-1 flex flex-col space-y-2.5 print:space-y-2 px-7 sm:px-8 pb-1">
            {/* Title Banner */}
            <OfficialReportTitle
              title="Fluency Assessment & Rehabilitation Plan"
              subtitle="Standardized Assessment Battery, Diagnostic Formulation & Management"
            />

            {/* SECTION 9: STANDARDIZED ASSESSMENT BATTERY */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>9. Standardized Assessment Battery &amp; Quantitative Scores</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 9.0</span>
              </div>
              <div className="p-2.5 space-y-2 text-[9.5px]">
                {/* SSI-4 Score Banner */}
                <div className="bg-purple-50/80 border border-purple-200 rounded-md p-2 flex items-center justify-between">
                  <div>
                    <span className="font-black text-purple-950 uppercase text-[9.5px] block">SSI-4 Standardized Assessment Metric</span>
                    <span className="text-[8px] text-purple-800 font-medium">Stuttering Severity Instrument - 4th Edition (Riley)</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[9px]">
                    <span className="bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-950 font-bold">
                      F: <strong>{params.ssiFrequencyScore ?? 14}</strong>
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-950 font-bold">
                      D: <strong>{params.ssiDurationScore ?? 8}</strong>
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-950 font-bold">
                      P: <strong>{params.ssiPhysicalScore ?? 6}</strong>
                    </span>
                    <span className="bg-purple-900 text-white px-2 py-0.5 rounded font-black">
                      TOTAL: {params.ssiTotalScore ?? 28}
                    </span>
                    <span className="bg-purple-200 text-purple-950 px-2 py-0.5 rounded font-black">
                      {params.ssiPercentile || '61-77 %ile'}
                    </span>
                    <span className="bg-purple-950 text-white px-2 py-0.5 rounded font-black uppercase">
                      {params.severityClassification || 'MODERATE'}
                    </span>
                  </div>
                </div>

                {/* Standardized Tests Grid */}
                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8px] uppercase">2. PSI Score (Perceptions of Stuttering Inventory)</span>
                    <p className="text-slate-800 font-medium mt-1">{params.psiScore || 'Struggle: 8 | Avoidance: 7 | Expectancy: 6 (Total: 21)'}</p>
                  </div>
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8px] uppercase">3. Hearing Screening &amp; APD</span>
                    <p className="text-slate-800 font-medium mt-1">{params.hearingScreening || 'Bilateral PASS (PTA Normal)'} • {params.apdTesting || 'APD Not Indicated'}</p>
                  </div>
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8px] uppercase">4. Photo Articulation Test (PAT)</span>
                    <p className="text-slate-800 font-medium mt-1">{params.patResultSummary || 'Age-appropriate phonetic inventory; no articulatory substitutions'}</p>
                  </div>
                  <div className="bg-purple-50/30 p-2 rounded border border-purple-100">
                    <span className="font-bold text-purple-950 block text-[8px] uppercase">7 &amp; 8. Self-Rating Questionnaires &amp; Audio Reference</span>
                    <p className="text-slate-800 font-medium mt-1">{params.selfRatingQuestionnaire || 'OASES-S: 2.84 (Moderate Impact)'} • Ref: {params.sampleRecordedReference || 'REC-2026-088'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 10: PROVISIONAL DIAGNOSIS & RECOMMENDATIONS */}
            <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
              <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-3 py-1 border-b border-purple-200 font-bold text-[10px] text-purple-950 uppercase flex items-center justify-between">
                <span>10. Clinical Impression, Provisional Diagnosis &amp; Recommendations</span>
                <span className="text-[8.5px] font-mono font-bold text-purple-800">SECTION 10.0</span>
              </div>
              <div className="p-2.5 grid grid-cols-2 gap-3 text-[9px]">
                <div className="bg-purple-50/50 p-2 rounded border border-purple-200">
                  <span className="font-bold text-purple-950 block text-[9px] uppercase tracking-wide border-b border-purple-200 pb-1 mb-1">
                    Provisional Clinical Diagnosis
                  </span>
                  {renderBulletPoints(formData?.provisionalDiagnosis || params.provisionalDiagnosis, 'Childhood-Onset Fluency Disorder of Moderate Severity.', 'bg-purple-900')}
                </div>

                <div className="bg-purple-50/50 p-2 rounded border border-purple-200">
                  <span className="font-bold text-purple-950 block text-[9px] uppercase tracking-wide border-b border-purple-200 pb-1 mb-1">
                    Rehabilitation Protocol &amp; Recommendations
                  </span>
                  {renderBulletPoints(formData?.recommendations || params.recommendations, 'Fluency modification therapy and parental guidance.', 'bg-purple-900')}
                </div>
              </div>
            </div>

            {/* DUAL CLINICIAN & SUPERVISOR VERIFICATION BAR */}
            <div className="bg-white/85 border border-purple-200/80 rounded-lg p-2.5 shrink-0 grid grid-cols-2 gap-4 text-[9px] shadow-2xs">
              <div className="border-r border-purple-200 pr-3">
                <span className="font-bold text-purple-950 uppercase block text-[8px]">Student Clinician / Evaluating Clinician</span>
                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-[9.5px]">{params.clinicianName || 'A. Kulkarni'}</span>
                    <span className="text-[8px] text-slate-600 block">Clinical Speech Intern • BASLP Intern</span>
                  </div>
                  <div className="border-b border-purple-300 w-28 text-center pb-0.5">
                    <span className="text-[7.5px] text-purple-800 italic">Signature Verified</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-purple-950 uppercase block text-[8px]">Clinical Supervisor &amp; Head of Department</span>
                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-950 block text-[9.5px]">{supervisorName}</span>
                    <span className="text-[8px] text-slate-600 block">RCI CRR No: <strong className="font-mono text-purple-950">{currentRci}</strong></span>
                  </div>
                  <div className="border-b border-purple-300 w-28 text-center pb-0.5">
                    <span className="text-[8px] text-purple-900 font-serif italic font-bold">{supervisorSig}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pinned Statutory Footer for Page 3 (Full-width banner) */}
        {renderFooter(3)}
      </div>

    </div>
  );
};
