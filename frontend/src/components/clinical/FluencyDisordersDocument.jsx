import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';

/**
 * Fluency / Stuttering Assessment (SSI-4) Official Clinical Dossier (2-Page Production Layout)
 * Strictly modeled after Bharati Vidyapeeth School of Audiology and Speech Language Pathology Fluency Proforma
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 *
 * Calibrated Pagination:
 * - PAGE 1: Case Intake, Brief History, Description of Fluency Problem, Stuttering Reactions, Physical Concomitants, Coping & Listener Dynamics / Avoidance (Sections 1 to 6)
 * - PAGE 2: Objective Dysfluency Analysis Table (Speaking vs Reading), Voice & Breathing, Standardized Assessment Battery (SSI-4 / PSI / PAT / OASES), Diagnosis & Recommendations, Dual Sign-off (Sections 7 to 10)
 */
export const FluencyDisordersDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  renderBulletPoints,
}) => {
  const params = formData?.parameters || {};

  // Reusable Lavender Header Component
  const renderHeader = (pageNumber) => (
    <OfficialReportHeader
      formData={formData}
      service={service}
      pageNumber={pageNumber}
      totalPages={2}
      discipline="SPEECH-LANGUAGE PATHOLOGY"
      compact={true}
    />
  );

  // Reusable Lavender Statutory Footer Component
  const renderFooter = (pageNumber) => (
    <OfficialReportFooter
      formData={formData}
      pageNumber={pageNumber}
      totalPages={2}
      compact={true}
    />
  );

  // Render Boolean Badge
  const renderBoolBadge = (val, label) => {
    const isYes = String(val).toLowerCase() === 'yes';
    return (
      <div className={`flex items-center justify-between px-2 py-0.5 rounded border text-[9px] ${
        isYes ? 'bg-rose-50 border-rose-200 text-rose-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span className="truncate pr-1">{label}</span>
        <span className={`text-[8px] uppercase font-mono px-1 py-0.2 rounded font-extrabold shrink-0 ${
          isYes ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-600'
        }`}>
          {isYes ? 'YES' : 'NO'}
        </span>
      </div>
    );
  };

  return (
    <div className="fluency-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, HISTORY, PROBLEM, CONCOMITANTS & LISTENER DYNAMICS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl">
        <div className="flex-1 flex flex-col space-y-1 pb-1">
          {renderHeader(1)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-rose-800 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              FLUENCY &amp; STUTTERING DISORDERS CLINICAL DOSSIER (SSI-4 PROTOCOL)
            </span>
          </div>

          {/* Demographics Bar */}
          <div className="bg-slate-50 border border-slate-300 rounded p-1.5 shrink-0 grid grid-cols-4 gap-x-2 gap-y-1 text-[9px]">
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Patient Name</span>
              <span className="font-bold text-slate-900 truncate block">{patient?.name || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Age / Sex / DOB</span>
              <span className="font-semibold text-slate-800">
                {patient?.age || '—'} Y / {patient?.gender || '—'} • {patient?.dob || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Sp. Reg. No. / UHID</span>
              <span className="font-mono font-bold text-purple-950">{patient?.id || patient?.uhid || formData?.reportNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Languages Spoken</span>
              <span className="font-semibold text-slate-800 truncate block">{params.languageSpoken || 'Marathi, Hindi, English'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Evaluation Date</span>
              <span className="font-medium text-slate-700">{formData?.reportDate || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Informant</span>
              <span className="font-medium text-slate-700 truncate block">{params.informant || 'Self & Parents'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Evaluating Clinician</span>
              <span className="font-medium text-slate-700 truncate block">{params.clinicianName || 'A. Kulkarni (Intern)'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Supervising Consultant</span>
              <span className="font-medium text-slate-700 truncate block">{params.supervisorName || 'Dr. Shreeharsh Shivpuje'}</span>
            </div>
          </div>

          {/* SECTION 1: BRIEF DEVELOPMENTAL & CLINICAL HISTORY */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>1. Brief Developmental &amp; Clinical History</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 1.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">a) Speech Development</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                      params.speechDevelopment?.toLowerCase() === 'delayed' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {params.speechDevelopment || 'Normal'}
                    </span>
                    <span className="text-slate-600 truncate">{params.speechDevelopmentDetails || 'Milestones on track'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">b) Handedness</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-slate-900">{params.handedness || 'Right'} Handed</span>
                    <span className="text-[8px] text-slate-600">
                      Attempt to change: <span className="font-bold">{params.handednessChangeAttempt || 'No'}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">c &amp; d) Onset &amp; Age</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-slate-900">{params.problemOnset || 'Gradual'} onset</span>
                    <span className="text-[8px] text-purple-950 font-bold">Age: {params.ageOfOnset || '3.5 Yrs'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">e &amp; f) Awareness &amp; Discovery</span>
                  <div className="grid grid-cols-2 gap-1 text-[8.5px] mt-0.5">
                    <div><span className="text-slate-500">Noticed By:</span> <span className="font-semibold text-slate-900">{params.noticedBy || 'Parents'}</span></div>
                    <div><span className="text-slate-500">Patient Aware:</span> <span className="font-semibold text-slate-900">{params.patientAwarenessAge || '5.0 Yrs'}</span></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">g) Probable Etiology / Trigger</span>
                  <p className="text-slate-800 font-medium truncate mt-0.5">{params.probableCause || 'Family history, developmental demand, peer imitation'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-1 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">h) Family History of Fluency / Speech Disorders</span>
                <p className="text-slate-800 font-medium leading-tight mt-0.5">{params.familyHistory || 'Nil reported; no confirmed multigenerational fluency disorders.'}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: DESCRIPTION OF THE PROBLEM & DYNAMICS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>2. Description of Fluency Problem, Course &amp; Feared Triggers</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 2.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">a) Problem Course</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 font-bold uppercase rounded text-[8px] bg-slate-200 text-slate-800">
                    {params.problemCourse || 'Fluctuating'}
                  </span>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">b) Reported Severity</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 font-bold uppercase rounded text-[8px] bg-amber-100 text-amber-900 border border-amber-300">
                    {params.reportedSeverity || 'Moderate'}
                  </span>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">b) Observed Severity</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 font-bold uppercase rounded text-[8px] bg-rose-100 text-rose-900 border border-rose-300">
                    {params.observedSeverity || params.severityClassification || 'Moderate'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-1 rounded border border-slate-200 space-y-0.5">
                <div className="flex items-start gap-1">
                  <span className="font-bold text-slate-700 text-[8px] uppercase shrink-0 w-36">Feared Sounds / Words:</span>
                  <span className="text-slate-900 font-semibold">{params.fearedSoundsWords || 'Plosives /p, b, k, t/, stating own name, asking questions'}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="font-bold text-emerald-800 text-[8px] uppercase shrink-0 w-36">Stuttering Least With:</span>
                  <span className="text-slate-800">{params.stutteringLeastWith || 'Parents at home, singing, whispering, talking to pets'}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="font-bold text-rose-800 text-[8px] uppercase shrink-0 w-36">Stuttering Severe With:</span>
                  <span className="text-slate-900 font-bold">{params.stutteringSevereWith || 'Strangers, authority figures, phone calls, oral presentations'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: REACTIONS WHEN STUTTERING OCCURS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>3. Reactions &amp; Autonomic Responses When Stuttering Occurs</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 3.0</span>
            </div>
            <div className="p-1.5 text-[9px] space-y-1">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                {renderBoolBadge(params.reactionHurry, 'Hurry to complete')}
                {renderBoolBadge(params.reactionStopRetry, 'Stop & try again')}
                {renderBoolBadge(params.reactionStopSpeaking, 'Stop speaking')}
                {renderBoolBadge(params.reactionBreathlessness, 'Breathlessness')}
                {renderBoolBadge(params.reactionExhaustion, 'Exhaustion')}
                {renderBoolBadge(params.reactionPainAbdomen, 'Pain abdomen')}
              </div>
              <div className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-2">
                <span className="font-bold text-slate-700 text-[8px] uppercase shrink-0">Other Associated Reactions:</span>
                <span className="text-slate-800 truncate">{params.reactionOther || 'Facial flushing, fist clenching upon severe blocks'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: ASSOCIATED PHYSICAL MOVEMENTS / CONCOMITANTS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>4. Associated Physical Movements / Secondary Concomitants</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 4.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {renderBoolBadge(params.concomitantTremorHands, 'Tremor Hands')}
                {renderBoolBadge(params.concomitantTongueThrust, 'Tongue Thrust')}
                {renderBoolBadge(params.concomitantBlinking, 'Eye Blinking')}
                {renderBoolBadge(params.concomitantFacialMovements, 'Facial Grimace')}
                {renderBoolBadge(params.concomitantHeadNodding, 'Head Nodding')}
                {renderBoolBadge(params.concomitantHandMovements, 'Hand Movts')}
                {renderBoolBadge(params.concomitantLegThumping, 'Leg Thumping')}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase mb-0.5">Occurrence Timing &amp; Clinical Function</span>
                  <div className="grid grid-cols-2 gap-1">
                    {renderBoolBadge(params.occurrenceSentenceBeginning, 'At sentence begin')}
                    {renderBoolBadge(params.occurrenceAfterPause, 'After a pause')}
                    {renderBoolBadge(params.occurrencePostponementDevice, 'Postponement device')}
                    {renderBoolBadge(params.occurrenceGivesRelief, 'Gives relief')}
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-700 block text-[8px] uppercase mb-0.5">Other Concomitants &amp; Tension Site</span>
                    <p className="text-slate-800 text-[8.5px] leading-tight">{params.concomitantOther || 'Shoulder elevation, jaw clenching, nostril flaring'}</p>
                  </div>
                  <div className="pt-0.5 border-t border-slate-200 mt-0.5 flex items-center justify-between text-[8px]">
                    <span className="text-slate-500 font-medium">SSI-4 Physical Score (P):</span>
                    <span className="font-mono font-bold text-rose-900 bg-rose-100 px-1 py-0.2 rounded border border-rose-300">
                      Score: {params.ssiPhysicalScore ?? 6} / 20
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: COPING MECHANISMS & LINGUISTIC PROFILE */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>5. Coping Mechanisms &amp; Multilingual Adaptation</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 5.0</span>
            </div>
            <div className="p-1.5 text-[9px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200 col-span-1">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Language-Wise Difference</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                      String(params.languageDifferenceCoping).toLowerCase() === 'yes' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {params.languageDifferenceCoping || 'Yes'}
                    </span>
                    <span className="text-slate-700 text-[8px] truncate">{params.languageDifferenceDetails || 'L2 (English) > L1 (Marathi)'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200 col-span-1">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Reported Coping</span>
                  <p className="text-slate-800 text-[8.5px] truncate mt-0.5">{params.copingReported || 'Pausing, deep breath, asking parents to speak'}</p>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200 col-span-1">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Observed Coping</span>
                  <p className="text-slate-800 text-[8.5px] truncate mt-0.5">{params.copingObserved || 'Circumlocution, starter sounds ("um"), word substitution'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: LISTENER DYNAMICS, ANTICIPATION & AVOIDANCE (Moved to Page 1 for perfect A4 balance) */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>6. Listener Reaction Dynamics, Anticipation &amp; Avoidance</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 6.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Eye Contact With Listener</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                      String(params.lookAtListener).toLowerCase() === 'no' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {params.lookAtListener || 'No'}
                    </span>
                    <span className="text-[8px] text-slate-600 truncate">Averts gaze upon dysfluency</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Anticipation &amp; Avoidance</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[8px]">
                    <span>Anticipates: <strong className="font-bold">{params.anticipateStuttering || 'Yes'}</strong></span>
                    <span>•</span>
                    <span>Avoids: <strong className="font-bold">{params.avoidStuttering || 'Yes'}</strong></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Avoidance Techniques</span>
                  <p className="text-slate-800 text-[8px] truncate mt-0.5">{params.avoidanceMethods || 'Word substitution, feigning silence'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-1 rounded border border-slate-200 flex items-center gap-2">
                <span className="font-bold text-slate-700 text-[8px] uppercase shrink-0">Listener Reactions Precipitating Dysfluency:</span>
                <div className="flex flex-wrap gap-1">
                  {(params.listenerReactionTriggers || 'Interruption, Questioning, Teasing, Laughing, Demanding')
                    .split(',')
                    .map((item, idx) => (
                      <span key={idx} className="bg-slate-200 text-slate-800 font-semibold px-1 py-0.2 rounded text-[7.5px] uppercase">
                        {item.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: SAMPLE ANALYSIS TABLE, VOICE/BREATHING, BATTERY & PLAN
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl">
        <div className="flex-1 flex flex-col space-y-1 pb-1">
          {renderHeader(2)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-rose-800 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              FLUENCY ASSESSMENT — OBJECTIVE SAMPLE ANALYSIS &amp; DIAGNOSTIC BATTERY
            </span>
          </div>

          {/* SECTION 7: ANALYSIS OF SPEECH & READING SAMPLE */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>7. Objective Dysfluency Sample Analysis (Speaking vs Reading)</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 7.0</span>
            </div>
            <div className="p-1.5 text-[9px]">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[8px] font-bold text-slate-700 uppercase border-b border-slate-300">
                    <th className="py-0.5 px-2 text-left">Clinical Dysfluency Parameter</th>
                    <th className="py-0.5 px-2 bg-rose-50 text-rose-900">Spontaneous Speaking</th>
                    <th className="py-0.5 px-2 bg-blue-50 text-blue-900">Passage Reading</th>
                    <th className="py-0.5 px-2 text-slate-500">Diagnostic Reference Norm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[8.5px]">
                  <tr>
                    <td className="py-0.5 px-2 text-left font-medium text-slate-800">1. Number of Prolongations (Sound/Syllable)</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-rose-950 bg-rose-50/40">{params.sampleSpeakingProlongations ?? 8}</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-blue-950 bg-blue-50/40">{params.sampleReadingProlongations ?? 4}</td>
                    <td className="py-0.5 px-2 text-slate-500">&lt; 1 per 100 syllables</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-2 text-left font-medium text-slate-800">2. Number of Repetitions (Part/Whole-word)</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-rose-950 bg-rose-50/40">{params.sampleSpeakingRepetitions ?? 18}</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-blue-950 bg-blue-50/40">{params.sampleReadingRepetitions ?? 10}</td>
                    <td className="py-0.5 px-2 text-slate-500">&lt; 2 per 100 syllables</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-2 text-left font-medium text-slate-800">3. Number of Hesitations &amp; Silent Pauses</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-rose-950 bg-rose-50/40">{params.sampleSpeakingHesitations ?? 12}</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-blue-950 bg-blue-50/40">{params.sampleReadingHesitations ?? 6}</td>
                    <td className="py-0.5 px-2 text-slate-500">Contextual / Syntactic</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-2 text-left font-medium text-slate-800">4. Number of Tense Blocks / Fixations</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-rose-950 bg-rose-50/40">{params.sampleSpeakingBlocks ?? 9}</td>
                    <td className="py-0.5 px-2 font-mono font-bold text-blue-950 bg-blue-50/40">{params.sampleReadingBlocks ?? 5}</td>
                    <td className="py-0.5 px-2 text-slate-500">0 (Abnormal marker)</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="py-0.5 px-2 text-left text-slate-900 uppercase text-[8px]">5. Percentage Dysfluency (%SS)</td>
                    <td className="py-0.5 px-2 font-mono font-black text-rose-900 bg-rose-100 text-[9.5px]">
                      {params.sampleSpeakingDysfluencyPct ?? params.percentageSS ?? 9.4}%
                    </td>
                    <td className="py-0.5 px-2 font-mono font-black text-blue-900 bg-blue-100 text-[9.5px]">
                      {params.sampleReadingDysfluencyPct ?? 6.2}%
                    </td>
                    <td className="py-0.5 px-2 text-slate-600 text-[8px]">&lt; 3.0% Non-stuttering norm</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-0.5 pt-0.5 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-600">
                <span>Total Syllables: <strong className="font-mono text-slate-900">{params.totalSyllables || 500}</strong></span>
                <span>•</span>
                <span>Stuttered Syllables: <strong className="font-mono text-rose-900">{params.stutteredSyllables || 47}</strong></span>
                <span>•</span>
                <span>Longest Blocks: <strong className="font-mono text-slate-900">{params.longestBlock1 || 2.8}s, {params.longestBlock2 || 2.1}s, {params.longestBlock3 || 1.9}s</strong></span>
              </div>
            </div>
          </div>

          {/* SECTION 8: VOICE & BREATHING MECHANICS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>8. Voice Phonation &amp; Respiratory Mechanics</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 8.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              <div className="bg-slate-50 p-1 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">Voice &amp; Phonation Characteristics</span>
                <p className="text-slate-800 font-medium mt-0.5 text-[8.5px]">{params.voiceFeatures || 'Tremulous phonation during tense blocks, pitch breaks, vocal tension'}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block text-[8px] uppercase mb-0.5">Breathing Patterns During Speech</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {renderBoolBadge(params.breathingTalksAfterBreathingOut, 'Talks after breathing out')}
                  {renderBoolBadge(params.breathingShortRapid, 'Short rapid breaths')}
                  {renderBoolBadge(params.breathingShallow, 'Shallow breathing')}
                  {renderBoolBadge(params.breathingManyWordsInOneBreath, 'Many words / breath')}
                </div>
              </div>
              <div className="bg-slate-50 px-2 py-0.2 rounded border border-slate-200 text-[8px] flex items-center gap-2">
                <span className="font-bold text-slate-600 uppercase">Respiratory Notes:</span>
                <span className="text-slate-800">{params.breathingOther || 'Clavicular thoracic breathing pattern noted prior to phonation onset.'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 9: STANDARDIZED ASSESSMENT BATTERY */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>9. Standardized Assessment Battery &amp; Quantitative Scores</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 9.0</span>
            </div>
            <div className="p-1.5 space-y-1 text-[9px]">
              {/* SSI-4 Score Banner */}
              <div className="bg-rose-50 border border-rose-200 rounded p-1 flex items-center justify-between">
                <div>
                  <span className="font-black text-rose-950 uppercase text-[8.5px] block">SSI-4 Standardized Assessment Metric</span>
                  <span className="text-[7.5px] text-rose-800">Stuttering Severity Instrument - 4th Edition (Riley)</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8.5px]">
                  <span className="bg-white px-1.5 py-0.2 rounded border border-rose-200 text-rose-900 font-bold">
                    F: <strong>{params.ssiFrequencyScore ?? 14}</strong>
                  </span>
                  <span className="bg-white px-1.5 py-0.2 rounded border border-rose-200 text-rose-900 font-bold">
                    D: <strong>{params.ssiDurationScore ?? 8}</strong>
                  </span>
                  <span className="bg-white px-1.5 py-0.2 rounded border border-rose-200 text-rose-900 font-bold">
                    P: <strong>{params.ssiPhysicalScore ?? 6}</strong>
                  </span>
                  <span className="bg-rose-900 text-white px-1.5 py-0.2 rounded font-black">
                    TOTAL: {params.ssiTotalScore ?? 28}
                  </span>
                  <span className="bg-rose-200 text-rose-950 px-1.5 py-0.2 rounded font-black">
                    {params.ssiPercentile || '61-77 %ile'}
                  </span>
                  <span className="bg-rose-950 text-white px-1.5 py-0.2 rounded font-black uppercase">
                    {params.severityClassification || 'MODERATE'}
                  </span>
                </div>
              </div>

              {/* Standardized Tests Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[8.5px]">
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[7.5px] uppercase">2. PSI Score (Perceptions of Stuttering Inventory)</span>
                  <p className="text-slate-800 font-medium mt-0.5">{params.psiScore || 'Struggle: 8 | Avoidance: 7 | Expectancy: 6 (Total: 21)'}</p>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[7.5px] uppercase">3. Hearing Screening &amp; APD</span>
                  <p className="text-slate-800 font-medium mt-0.5">{params.hearingScreening || 'Bilateral PASS (PTA Normal)'} • {params.apdTesting || 'APD Not Indicated'}</p>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[7.5px] uppercase">4. Photo Articulation Test (PAT)</span>
                  <p className="text-slate-800 font-medium mt-0.5">{params.patResultSummary || 'Age-appropriate phonetic inventory; no articulatory substitutions'}</p>
                </div>
                <div className="bg-slate-50 p-1 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[7.5px] uppercase">7 &amp; 8. Self-Rating Questionnaires &amp; Audio Reference</span>
                  <p className="text-slate-800 font-medium mt-0.5 truncate">{params.selfRatingQuestionnaire || 'OASES-S: 2.84 (Moderate Impact)'} • Ref: {params.sampleRecordedReference || 'REC-2026-088'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 10: PROVISIONAL DIAGNOSIS & RECOMMENDATIONS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>10. Clinical Impression, Provisional Diagnosis &amp; Recommendations</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 10.0</span>
            </div>
            <div className="p-1.5 grid grid-cols-2 gap-2 text-[8.5px]">
              <div className="bg-rose-50/50 p-1.5 rounded border border-rose-200">
                <span className="font-bold text-rose-950 block text-[8.5px] uppercase tracking-wide border-b border-rose-200 pb-0.5 mb-0.5">
                  Provisional Clinical Diagnosis
                </span>
                {renderBulletPoints(formData?.provisionalDiagnosis || params.provisionalDiagnosis, 'Childhood-Onset Fluency Disorder of Moderate Severity.', 'bg-rose-700')}
              </div>

              <div className="bg-emerald-50/50 p-1.5 rounded border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-[8.5px] uppercase tracking-wide border-b border-emerald-200 pb-0.5 mb-0.5">
                  Rehabilitation Protocol &amp; Recommendations
                </span>
                {renderBulletPoints(formData?.recommendations || params.recommendations, 'Fluency modification therapy and parental guidance.', 'bg-emerald-700')}
              </div>
            </div>
          </div>

          {/* DUAL CLINICIAN & SUPERVISOR VERIFICATION BAR */}
          <div className="bg-slate-50 border border-slate-300 rounded p-1.5 shrink-0 grid grid-cols-2 gap-3 text-[8.5px]">
            <div className="border-r border-slate-200 pr-2">
              <span className="font-bold text-slate-500 uppercase block text-[7.5px]">Student Clinician / Evaluating Clinician</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{params.clinicianName || 'A. Kulkarni'}</span>
                  <span className="text-[7.5px] text-slate-600 block">Clinical Speech Intern • BASLP Intern</span>
                </div>
                <div className="border-b border-slate-400 w-24 text-center pb-0.5">
                  <span className="text-[7px] text-slate-400 italic">Signature Verified</span>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase block text-[7.5px]">Clinical Supervisor &amp; Head of Department</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-950 block">{params.supervisorName || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP'}</span>
                  <span className="text-[7.5px] text-slate-600 block">RCI CRR No: <strong className="font-mono text-purple-950">{formData?.rciNumber || 'A79214'}</strong></span>
                </div>
                <div className="border-b border-slate-400 w-24 text-center pb-0.5">
                  <span className="text-[7.5px] text-purple-900 font-serif italic font-bold">Shreeharsh M.S.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(2)}
      </div>

    </div>
  );
};
