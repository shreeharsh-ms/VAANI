import React from 'react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';
import { ClinicalReportBackground } from './ClinicalReportBackground';

/**
 * Early Developmental History (EDH) Official Clinical Dossier (3-Page Production Layout)
 * Strictly modeled after Bharati Vidyapeeth School of Audiology and Speech Language Pathology EDH Proforma
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 * 
 * Pagination Structure:
 * - PAGE 1: Case Intake, Detailed Birth History (Prenatal, Natal, Postnatal & Motor), General Health, Hearing Responses, Cognitive Pre-requisites & Early Foundations
 * - PAGE 2: Comprehensive Language Checklists (Comprehension & Expression), Speech Milestones & Linguistic Environment, Social & Behavioral Profile, Concept Matrix, Examination of Oral Structures
 * - PAGE 3: Oral Developmental Skills & Feeding Mechanism, Literacy & School Readiness, Formal Tests (REELS & Standardized Scales), Multidisciplinary Reports Summary, Speech-Language Summary, Provisional Diagnosis & Recommendations, Clinician/Supervisor Sign-off
 */
export const EarlyDevelopmentalHistoryDocument = ({
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
      totalPages={3}
      discipline="SPEECH-LANGUAGE PATHOLOGY"
      compact={true}
    />
  );

  // Reusable Lavender Statutory Footer Component
  const renderFooter = (pageNumber) => (
    <div className="relative z-10 shrink-0 mt-auto">
      <OfficialReportFooter
        formData={formData}
        pageNumber={pageNumber}
        totalPages={3}
        compact={true}
      />
    </div>
  );

  return (
    <div className="edh-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, BIRTH HISTORY & SENSORY/COGNITIVE FOUNDATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(1)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-[#0284c7] text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-2xs">
              EARLY DEVELOPMENTAL HISTORY (EDH) — CASE INTAKE &amp; BIRTH HISTORY
            </span>
          </div>

          {/* Demographics & Informant Context Box */}
          <div className="border border-slate-700 text-[9px] bg-white shrink-0">
            <div className="grid grid-cols-12 divide-x divide-slate-700 border-b border-slate-700">
              <div className="col-span-5 p-1 px-2.5 flex items-center">
                <span className="font-bold w-16 shrink-0 text-slate-800">Name:</span>
                <span className="font-bold text-slate-950">{patient.full_name}</span>
              </div>
              <div className="col-span-4 p-1 px-2.5 flex items-center">
                <span className="font-bold w-18 shrink-0 text-slate-800">Age / Sex:</span>
                <span className="font-medium text-slate-900">
                  {patient.date_of_birth} / {patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : patient.gender}
                </span>
              </div>
              <div className="col-span-3 p-1 px-2.5 flex items-center">
                <span className="font-bold w-16 shrink-0 text-slate-800">Informant:</span>
                <span className="font-medium text-slate-900">{params.informant || 'Mother'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-slate-700 border-b border-slate-700">
              <div className="col-span-5 p-1 px-2.5 flex items-center">
                <span className="font-bold w-16 shrink-0 text-slate-800">Reg. No:</span>
                <span className="font-mono font-bold text-slate-950">{patient.uhid}</span>
              </div>
              <div className="col-span-4 p-1 px-2.5 flex items-center">
                <span className="font-bold w-18 shrink-0 text-slate-800">DOA:</span>
                <span className="font-medium text-slate-900">{params.doa || formData?.reportDate}</span>
              </div>
              <div className="col-span-3 p-1 px-2.5 flex items-center">
                <span className="font-bold w-16 shrink-0 text-slate-800">Contact:</span>
                <span className="font-mono text-slate-900">{params.informantContact || patient.phone}</span>
              </div>
            </div>

            <div className="p-1 px-2.5 flex items-start bg-slate-50/70">
              <span className="font-bold w-28 shrink-0 text-slate-800">Chief Complaint:</span>
              <span className="font-medium text-slate-900 leading-snug">
                {params.chiefComplaint || 'Delayed speech and language onset, limited words, difficulty communicating needs.'}
              </span>
            </div>
          </div>

          {/* Detailed Birth History Table (3 Columns: Prenatal | Natal | Postnatal & Motor) */}
          <div className="border border-slate-400 bg-white">
            <h3 className="font-black text-[9.5px] uppercase tracking-wide text-slate-900 bg-slate-100 p-1 px-2 border-b border-slate-400">
              DETAILED BIRTH HISTORY
            </h3>
            <div className="grid grid-cols-3 text-[8.5px] divide-x divide-slate-400">
              {/* Prenatal */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  1. PRENATAL - Pregnancy
                </span>
                <p><span className="font-bold">Mother's health:</span> {params.motherHealthPrenatal || 'Good'}</p>
                <p><span className="font-bold">Any Illnesses:</span> {params.prenatalIllnesses || 'None'}</p>
                <p><span className="font-bold">Medication(s):</span> {params.prenatalMedications || 'Iron, Folic acid, multivitamins'}</p>
                <p><span className="font-bold">Trauma/Accidents:</span> {params.prenatalTrauma || 'None'}</p>
                <p><span className="font-bold">X-rays:</span> {params.prenatalXRays || 'None'}</p>
                <p><span className="font-bold">H/O Abortion/Stillbirth:</span> {params.prenatalAbortionMiscarriage || 'None'}</p>
                <p><span className="font-bold">Rh Incompatibility:</span> {params.rhIncompatibility || 'No'}</p>
                <p><span className="font-bold">Consanguinity:</span> {params.consanguinity || 'Non-consanguineous marriage'}</p>
                <p className="text-slate-600 italic text-[7.5px] pt-0.5">Note: {params.prenatalNotes || 'Full-term gestation, regular antenatal care.'}</p>
              </div>

              {/* Natal */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  2. NATAL - Delivery
                </span>
                <p><span className="font-bold">Place of delivery:</span> {params.placeOfDelivery || 'Hospital (Institutional)'}</p>
                <p><span className="font-bold">Term:</span> {params.deliveryTerm || 'Full term (39 weeks)'}</p>
                <p><span className="font-bold">Condition at birth:</span> {params.conditionAtBirth || 'Normal (No cyanosis/jaundice)'}</p>
                <p><span className="font-bold">Birth cry:</span> {params.birthCry || 'Immediate, vigorous cry'}</p>
                <p><span className="font-bold">Birth weight:</span> {params.birthWeight || '3.1 kg'}</p>
                <p><span className="font-bold">Complications in first 2 wks:</span> {params.complicationsFirstTwoWeeks || 'None reported; no NICU stay, no jaundice.'}</p>
                <p className="text-slate-600 italic text-[7.5px] pt-0.5">Neonatal Course: Normal adaptation without oxygen therapy.</p>
              </div>

              {/* Postnatal & Motor */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  3. POST NATAL &amp; Motor Milestones
                </span>
                <p><span className="font-bold">Feeding:</span> {params.feedingPostnatal || 'Breast fed up to 1.5 yrs'}</p>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8px] pt-0.5">
                  <p><span className="font-semibold">Holding head:</span> {params.motorHeadUp || '3 months'}</p>
                  <p><span className="font-semibold">Reaching:</span> {params.motorReaching || '5 months'}</p>
                  <p><span className="font-semibold">Sitting indep:</span> {params.motorSitting || '6-7 months'}</p>
                  <p><span className="font-semibold">Crawling:</span> {params.motorCrawling || '8-9 months'}</p>
                  <p><span className="font-semibold">Standing indep:</span> {params.motorStanding || '10-11 months'}</p>
                  <p><span className="font-semibold">Walking indep:</span> {params.motorWalking || '12-13 months'}</p>
                </div>
                <div className="border-t border-slate-200 pt-0.5 space-y-0.5 text-[8px]">
                  <p><span className="font-bold">Toilet Control:</span> Partial {params.toiletControlPartial || '2.5 Yrs'} | Complete {params.toiletControlComplete || '3.5 Yrs'}</p>
                  <p><span className="font-bold">Hand:</span> {params.handPreference || 'Right'} | <span className="font-bold">Dress:</span> {params.dressing || 'Dep'} | <span className="font-bold">Undress:</span> {params.undressing || 'Indep'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Health & Hearing Responses (2 Balanced Columns) */}
          <div className="grid grid-cols-2 border border-slate-400 text-[8.5px] divide-x divide-slate-400 bg-white">
            {/* General Health */}
            <div className="p-1.5 space-y-0.5">
              <span className="font-black text-slate-900 uppercase block border-b border-slate-300 pb-0.5 bg-slate-50 px-1 -mx-1.5 -mt-1.5">
                General Health Status
              </span>
              <p><span className="font-bold">Present status:</span> {params.presentHealthStatus || 'Good / Healthy'}</p>
              <p><span className="font-bold">Illnesses/Injuries:</span> {params.childhoodIllnesses || 'None (No measles, diphtheria, chickenpox, or whooping cough)'}</p>
              <p><span className="font-bold">Accident/Fall:</span> {params.accidentFallHistory || 'No history of severe head trauma'}</p>
              <p><span className="font-bold">Convulsions:</span> {params.convulsionsHistory || 'No'} {params.convulsionsHistory === 'Yes' ? `(${params.convulsionsAgeStarted}, ${params.convulsionsFrequency})` : ''}</p>
              <p><span className="font-bold">Medications:</span> {params.presentMedications || 'None currently'}</p>
              <p><span className="font-bold">Vision:</span> {params.visionStatus || 'Normal (Fixes and follows objects binocularly)'}</p>
              <p><span className="font-bold">Sleep Habits:</span> {params.sleepHabits || 'Good (8-9 hours continuous night sleep)'}</p>
              <p><span className="font-bold">Breathing Pattern:</span> {params.breathingPattern || 'Regular nasal breathing (no snoring)'}</p>
            </div>

            {/* Hearing */}
            <div className="p-1.5 space-y-0.5">
              <span className="font-black text-slate-900 uppercase block border-b border-slate-300 pb-0.5 bg-slate-50 px-1 -mx-1.5 -mt-1.5">
                Hearing &amp; Auditory Responses
              </span>
              <p><span className="font-bold">Sound response as baby:</span> {params.responseToSoundBaby || 'Looking at source of sound, startle reflex'}</p>
              <p><span className="font-bold">Feels child hears normally:</span> {params.feelsChildHearsNormally || 'Yes (attends to whispers & doorbells)'}</p>
              <p><span className="font-bold">Responds to clapping:</span> {params.responseClapping || 'Yes (turns toward sound)'}</p>
              <p><span className="font-bold">Responds to loud sounds:</span> {params.responseLoudSounds || 'Yes (present startle)'}</p>
              <p><span className="font-bold">Environmental sounds:</span> {params.responseEnvironmentalSounds || 'Yes (utensils, vehicles, TV)'}</p>
              <p><span className="font-bold">Ear infection/discharge:</span> {params.earInfectionHistory || 'No history of otitis media or discharge'}</p>
              <p><span className="font-bold">Prior hearing test:</span> {params.priorHearingTest || 'Yes'} {params.priorHearingTestDetails ? `(${params.priorHearingTestDetails})` : '(Newborn OAE Screen PASS bilaterally)'}</p>
              <p className="text-[7.5px] text-slate-600 italic pt-0.5">Auditory Attentiveness: Consistent auditory localization to environmental speech.</p>
            </div>
          </div>

          {/* Cognitive Pre-requisites (Levels of Attention, Intention & Play Development) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Cognitive Pre-requisites (Attention, Intention &amp; Play Development)
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-400 p-1.5">
              <div className="space-y-1 pr-1.5">
                <span className="font-black text-purple-950 block border-b border-slate-200 pb-0.5 uppercase text-[8px]">Levels of Attention</span>
                <p className="text-[8px]"><span className="font-bold">Assessed:</span> <span className="text-purple-950 font-bold">{params.attentionLevel || 'Level 3 (2-3 yrs): Adult choice'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-slate-50 p-1 rounded border border-slate-200">
                  <p>• L1 (0-1 yr): Fleeting attention</p>
                  <p>• L2 (1-2 yrs): Own choice of activity</p>
                  <p className="font-bold text-purple-950 bg-purple-100 px-0.5 rounded">• L3 (2-3 yrs): Adult choice (Current)</p>
                  <p>• L4 (3-4 yrs): Two-channel attention</p>
                  <p>• L5 (4-5 yrs): Integrated for short spells</p>
                  <p>• L6 (5-6 yrs): Sustained integrated attention</p>
                </div>
              </div>

              <div className="space-y-1 px-1.5">
                <span className="font-black text-purple-950 block border-b border-slate-200 pb-0.5 uppercase text-[8px]">Level of Intention</span>
                <p className="text-[8px]"><span className="font-bold">Status:</span> <span className="font-bold">{params.intentionLevel || 'Late intentional (12-18 mo)'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-slate-50 p-1 rounded border border-slate-200">
                  <p>• Pre-intentional (&lt;8 mo): Cries/reflexes</p>
                  <p>• Early intentional (8-12 mo): Reaches with gaze</p>
                  <p className="font-bold text-purple-950 bg-purple-100 px-0.5 rounded">• Late intentional (12-18 mo): Gestures/vocals (Current)</p>
                  <p>• Representational (18+ mo): Words</p>
                </div>
              </div>

              <div className="space-y-1 pl-1.5">
                <span className="font-black text-purple-950 block border-b border-slate-200 pb-0.5 uppercase text-[8px]">Play Development</span>
                <p className="text-[8px]"><span className="font-bold">Stages:</span> <span className="font-bold">{params.playDevelopment || 'Relational & Self Pretend'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-slate-50 p-1 rounded border border-slate-200">
                  <p>• Exploratory: Mouthing, banging</p>
                  <p className="font-bold text-purple-950 bg-purple-100 px-0.5 rounded">• Relational: Stacks blocks, rolls car (Present)</p>
                  <p className="font-bold text-purple-950 bg-purple-100 px-0.5 rounded">• Self-Pretend: Pretend feeds, sleeps (Present)</p>
                  <p>• De-centered: Feeds doll/teddy</p>
                  <p>• Sequence pretend: Multi-step play</p>
                </div>
              </div>
            </div>
          </div>

          {/* Early Language Foundations (Comprehension & Expression) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Language and Speech Development: Early Foundations
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-1.5">
              <div className="space-y-0.5 pr-2">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-200 pb-0.5">Early Comprehension Foundations:</span>
                <p>• Responded to adult (cooing/smiling): <span className="font-bold">{params.ageRespondingToAdult || '3 months (smiling & cooing)'}</span></p>
                <p>• Responds to tone of voice: <span className="font-bold">{params.respondToneOfVoice || 'Yes (soothed by gentle voice)'}</span></p>
                <p>• Looks where parents look (Joint attention): <span className="font-bold">{params.jointAttention || 'Yes (shares gaze and points)'}</span></p>
                <p>• Object permanence: <span className="font-bold">{params.objectPermanence || 'Yes (searches for hidden objects)'}</span></p>
              </div>

              <div className="space-y-0.5 pl-2">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-200 pb-0.5">Early Communication Expression:</span>
                <p>• Early vocalization: <span className="font-bold">Differentiated crying, syllabic vocal play</span></p>
                <p>• Modes used: <span className="font-bold">{params.communicationModes || 'Reaching, vocalizing, simple gestures, single words'}</span></p>
                <p>• Expressive Vocabulary: <span className="font-bold">{params.expressiveLexicalRepertoire || '15-20 functional words (mama, papa, paani, dada, ball, car)'}</span></p>
                <p>• Lexical items: Nouns (domestic objects), early action verbs, social markers.</p>
              </div>
            </div>
          </div>
        </div>

        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: LANGUAGE, SPEECH MILESTONES, BEHAVIOR, CONCEPTS & ORAL STRUCTURES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(2)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              EARLY DEVELOPMENTAL HISTORY — LANGUAGE, BEHAVIOR &amp; ORAL MECHANISM
            </span>
          </div>

          {/* Detailed Language Comprehension & Expression Checklist */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Language &amp; Speech Development Checklists
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-2">
              {/* Comprehension Checklist */}
              <div className="space-y-1 pr-2">
                <span className="font-black text-purple-950 block border-b border-slate-200 pb-0.5 uppercase">COMPREHENSION CHECKLIST (RECEPTIVE)</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <p>• Understands gestures: <span className="font-bold">{params.understandsGestures || 'Yes'}</span></p>
                  <p>• Family recognition: <span className="font-bold">{params.recognitionFamily || 'Yes'}</span></p>
                  <p>• Words in context: <span className="font-bold">{params.respondsSingleWordContext || 'Yes'}</span></p>
                  <p>• Points to pictures: <span className="font-bold">{params.pointsToPictures || 'Yes'}</span></p>
                  <p>• 1-stage commands: <span className="font-bold">{params.followsOneStageCommands || 'Yes (e.g. "Give ball")'}</span></p>
                  <p>• 2-stage commands: <span className="font-bold">{params.followsTwoStageCommands || 'Inconsistent'}</span></p>
                  <p>• Yes/No questions: <span className="font-bold">{params.answersYesNo || 'Emerging (nods head)'}</span></p>
                  <p>• Conversations: <span className="font-bold">{params.understandsConversations || 'Emerging'}</span></p>
                </div>
                <div className="pt-1 border-t border-slate-200 text-[7.5px] text-slate-700">
                  <span className="font-bold">Receptive Repertoire:</span> Domestic objects (cup, spoon, ball), food (milk, water), body parts, animals.
                </div>
              </div>

              {/* Expression Checklist */}
              <div className="space-y-1 pl-2">
                <span className="font-black text-purple-950 block border-b border-slate-200 pb-0.5 uppercase">EXPRESSION MODES &amp; PRESENT OUTPUT</span>
                <p>• <span className="font-bold">Communication Modes:</span> {params.communicationModes || 'Reaching/vocalizing, simple gestures (bye-bye/namaste), single words'}</p>
                <p>• <span className="font-bold">Expressive Vocabulary:</span> {params.expressiveLexicalRepertoire || '15-20 functional words (mama, papa, paani, dada, ball, car, doodh)'}</p>
                <p>• <span className="font-bold">Lexical Categories:</span> Nouns (majority), social words (bye, hi), early verbs (de, aaja).</p>
                <p>• <span className="font-bold">Utterance Length:</span> Single word stage; 2-word combinations not yet spontaneously observed.</p>
                <div className="pt-1 border-t border-slate-200 text-[7.5px] text-slate-700">
                  <span className="font-bold">Pre-verbal communication:</span> Reaches for desired objects, pulls adult's hand, vocalizes with eye gaze.
                </div>
              </div>
            </div>
          </div>

          {/* Speech Development History (Milestone Ages) & Environment */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Speech Milestones &amp; Linguistic Environment
            </div>
            <table className="w-full text-center border-collapse border-b border-slate-400">
              <thead className="bg-slate-50 font-bold text-[8px] text-slate-700">
                <tr className="divide-x divide-slate-400 border-b border-slate-400">
                  <th className="p-1">Vocal Play</th>
                  <th className="p-1">Babbling</th>
                  <th className="p-1">First Word</th>
                  <th className="p-1">First Sentence</th>
                </tr>
              </thead>
              <tbody className="divide-x divide-slate-400 font-mono font-bold text-purple-950">
                <tr>
                  <td className="p-1">{params.ageVocalPlay || '4-5 months'}</td>
                  <td className="p-1">{params.ageBabbling || '7-8 months'}</td>
                  <td className="p-1">{params.ageFirstWord || '14 months'}</td>
                  <td className="p-1">{params.ageFirstSentence || 'Not yet developed'}</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1.5 grid grid-cols-3 divide-x divide-slate-300 text-[8px]">
              <p className="px-1.5"><span className="font-bold">Family Speech History:</span> {params.familySpeechHistory || 'No known familial speech/hearing issues.'}</p>
              <p className="px-1.5"><span className="font-bold">Talking Environment:</span> {params.talkingEnvironment || 'Yes (Active verbal stimulation by family)'}</p>
              <p className="px-1.5"><span className="font-bold">Language(s) at Home:</span> {params.languageEnvironment || 'Bilingual'} ({params.preferredHomeLanguage || 'Marathi & Hindi'})</p>
            </div>
          </div>

          {/* Social Interaction & Behavioral Profile */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Social Interaction &amp; Behavioral Profile
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-1.5">
              <div className="space-y-0.5 pr-2">
                <p><span className="font-bold">Engages in interaction:</span> {params.socialEngages || 'Yes (actively seeks eye contact during play)'}</p>
                <p><span className="font-bold">Initiates interaction:</span> {params.socialInitiates || 'Yes (brings toys to parents to initiate)'}</p>
                <p><span className="font-bold">Preference for familiar:</span> {params.socialFamiliarPreference || 'Yes (shows strong attachment to mother)'}</p>
                <p><span className="font-bold">Toy play / Peer play:</span> {params.playsWithToys || 'Yes (functional toy play)'} / {params.playsWithChildren || 'Emerging (parallel play alongside peers)'}</p>
                <p className="text-[7.5px] text-slate-600 italic pt-0.5">Social Intent: Displays warm emotional reciprocity and responds promptly to praise and smiles.</p>
              </div>
              <div className="space-y-0.5 pl-2">
                <p><span className="font-bold">Screen-time:</span> {params.screenTime || '1 to 2 hours/day (Smart TV & mobile cartoons)'}</p>
                <p><span className="font-bold">Temper tantrums:</span> {params.temperTantrums || 'Mild (occasional protest when screen is turned off)'}</p>
                <p><span className="font-bold">Behavioral traits:</span> {params.behaviorRestlessStubborn || 'Mildly restless during non-preferred tabletop tasks'}</p>
                <p><span className="font-bold">Likes / Dislikes:</span> {params.strongLikesDislikes || 'Likes: Vehicle toys. Dislikes: loud blender/mixer.'}</p>
                <p className="text-[7.5px] text-slate-600 italic pt-0.5">Sensory Profile: No tactile or auditory hypersensitivity noted other than loud blender noises.</p>
              </div>
            </div>
          </div>

          {/* Concept Development (General, Colors, Objects) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Concept Development Matrix
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-400 p-1.5">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">GENERAL CONCEPTS</span>
                <p>• Money concept: {params.conceptMoney || 'No'}</p>
                <p>• Danger concept: {params.conceptDanger || 'Yes (avoids hot stove & edge of bed)'}</p>
                <p>• Order by size: {params.orderSize || 'Emerging (nests larger cup into smaller cup)'}</p>
              </div>
              <div className="space-y-0.5 px-1.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">COLOR CONCEPTS</span>
                <p>• Match colors: {params.colorMatching || 'Yes (matches primary color blocks)'}</p>
                <p>• Sort colors: {params.colorSorting || 'Emerging (sorts two contrasting colors)'}</p>
                <p>• Identify: {params.colorIdentification || 'Emerging'} | Name: {params.colorNaming || 'No'}</p>
              </div>
              <div className="space-y-0.5 pl-1.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">OBJECT CONCEPTS</span>
                <p>• Use by function: {params.objectUseFunction || 'Yes (comb for hair, cup for drinking)'}</p>
                <p>• Object matching: {params.objectObjectMatching || 'Yes'}</p>
                <p>• Picture matching: {params.objectPictureMatching || 'Yes (matches toy to picture)'}</p>
              </div>
            </div>
          </div>

          {/* Examination of Oral Structures (Appearance & Movement) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Examination of Oral Structures
            </div>
            <table className="w-full text-left border-collapse border-b border-slate-400">
              <thead className="bg-slate-50 font-bold text-[8px] text-slate-700">
                <tr className="divide-x divide-slate-400 border-b border-slate-400">
                  <th className="p-1 w-20">Structure</th>
                  <th className="p-1">Appearance</th>
                  <th className="p-1">Movement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-[8px]">
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">1. Lips</td>
                  <td className="p-1">{params.oralLips || 'Normal symmetry, intact vermilion border, adequate lip seal at rest'}</td>
                  <td className="p-1">Adequate closure, spreading &amp; retraction during smiling and speech</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">2. Tongue</td>
                  <td className="p-1">{params.oralTongue || 'Normal size & shape, no ankyloglossia, free movement'}</td>
                  <td className="p-1">Adequate elevation, protrusion &amp; lateralization across dental arches</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">3. Palate</td>
                  <td className="p-1">{params.oralPalate || 'Intact hard and soft palate, normal arch contour, symmetrical uvula'}</td>
                  <td className="p-1">Symmetrical velopharyngeal closure on phonation</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">4. Teeth</td>
                  <td className="p-1">{params.oralTeeth || 'Complete primary dentition, normal occlusion, intact dental arch'}</td>
                  <td className="p-1">Adequate jaw stability and alignment during speech and chewing</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1 text-[7.5px] text-slate-700 bg-slate-50">
              <span className="font-bold text-slate-900">Structural Evaluation Notes:</span> Oral structures are intact with adequate symmetrical tone, strength, and range of motion for developmental age.
            </div>
          </div>
        </div>

        {renderFooter(2)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: ORAL SKILLS & FEEDING, LITERACY, FORMAL TESTS & CLINICAL FORMULATION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(3)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-indigo-700 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              EARLY DEVELOPMENTAL HISTORY — FORMAL TESTS &amp; CLINICAL FORMULATION
            </span>
          </div>

          {/* Oral Developmental Skills & Feeding Mechanism */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Oral Developmental Skills &amp; Feeding Mechanism
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-2">
              <div className="space-y-0.5 pr-2">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-200 pb-0.5">
                  Oral Developmental Skills:
                </span>
                <p>• <span className="font-bold">Lip closure:</span> {params.oralLipClosure || 'Adequate closure at rest and during swallowing'}</p>
                <p>• <span className="font-bold">Tongue posture:</span> {params.oralTonguePosture || 'Normal intra-oral resting posture (no tongue thrust)'}</p>
                <p>• <span className="font-bold">Blowing:</span> {params.oralBlowing || 'Present (blows bubbles & whistles)'}</p>
                <p>• <span className="font-bold">Spitting:</span> {params.oralSpitting || 'Developing (can spit water during brushing)'}</p>
                <p>• <span className="font-bold">Sucking through straw:</span> {params.oralSuckingStraw || 'Present (effective suction from straw cup)'}</p>
                <p>• <span className="font-bold">Spoon feeding:</span> {params.oralSpoonFeeding || 'Independent with clean lip clearance'}</p>
              </div>

              <div className="space-y-0.5 pl-2">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-200 pb-0.5">
                  Feeding &amp; Masticatory Function:
                </span>
                <p>• <span className="font-bold">Sucking tongue movement:</span> {params.feedingTongueMovement || 'Front to back movement established'}</p>
                <p>• <span className="font-bold">Munching &amp; Jaw movement:</span> {params.feedingJawMovement || 'Up and down jaw movement progressing to rotary'}</p>
                <p>• <span className="font-bold">True Chewing:</span> {params.feedingChewing || 'True chewing present (handles solid rotis, fruits, rice)'}</p>
                <p>• <span className="font-bold">Tongue lateralization:</span> {params.feedingTongueLateralization || 'Adequate lateralization to transfer food bolus'}</p>
                <p>• <span className="font-bold">Rotary jaw movement:</span> {params.feedingRotaryJaw || 'Established rotary movement on both sides'}</p>
                <p>• <span className="font-bold">Controlled sustained bite:</span> {params.feedingSustainedBite || 'Controlled bite through solid foods (carrots/biscuits)'}</p>
              </div>
            </div>
          </div>

          {/* Literacy & School Details */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Literacy &amp; School Readiness
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-400 p-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">Reading Readiness:</span>
                <p>• Shapes: {params.readingShapes || 'Identifies circle and square'}</p>
                <p>• Numbers: {params.readingNumbers || 'Identifies 1 and 2'}</p>
                <p>• Letters: {params.readingLetters || 'Not yet introduced formally'}</p>
              </div>
              <div className="space-y-0.5 px-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">Writing Readiness:</span>
                <p>• Type of grip: <span className="font-bold text-purple-950">{params.writingGrip || 'Pincer grasp emerging (holds crayon with fingers)'}</span></p>
                <p>• Scribbling: {params.writingScribbling || 'Present (spontaneous vertical and circular strokes)'}</p>
              </div>
              <div className="space-y-0.5 pl-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">School Details:</span>
                <p>{params.schoolDetails || 'Attends morning playgroup (3 days/week); adapts well to classroom routines'}</p>
              </div>
            </div>
          </div>

          {/* Formal Test Findings (REELS & Standardized Scales) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Formal Test Findings: REELS &amp; Standardized Assessment
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-2">
              <div className="space-y-0.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">
                  REELS Result (Receptive-Expressive Emergent Language Scale):
                </span>
                <div className="grid grid-cols-2 gap-1 text-[8.5px]">
                  <p><span className="font-bold">Comprehension Level:</span></p>
                  <p className="font-mono font-bold text-slate-900">{params.reelsComprehension || '28 months'}</p>
                  <p><span className="font-bold">Expression Level:</span></p>
                  <p className="font-mono font-bold text-rose-700">{params.reelsExpression || '18 months'}</p>
                  <p><span className="font-bold">Chronological Age:</span></p>
                  <p className="font-mono font-bold text-purple-950">{params.reelsChronologicalAge || '30 months (2 yrs 6 mo)'}</p>
                </div>
                <p className="text-[7.5px] text-rose-700 font-bold pt-0.5">
                  * Clinical Formulation: 12-month expressive language delay with age-appropriate receptive competence.
                </p>
              </div>

              <div className="space-y-0.5 pl-2">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">
                  Other Test Findings &amp; Developmental Scales:
                </span>
                <p className="text-[8px] text-slate-700 leading-snug">
                  {params.otherFormalTests || 'Assessment of Language Development (ALD-MM): Expressive age equivalent 18 months; CommDeall Checklist: Level II emerging; 3D-LAT: Emerging phonology with intact vocal repertoire.'}
                </p>
              </div>
            </div>
          </div>

          {/* Multidisciplinary Reports Summary */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Summary of Findings of Multidisciplinary Reports
            </div>
            <div className="p-1.5 space-y-0.5 text-[8px]">
              <p><span className="font-bold text-slate-900">1. Hearing Evaluation:</span> {params.summaryHearing || 'Bilateral normal hearing sensitivity confirmed via OAE and screening tympanometry.'}</p>
              <p><span className="font-bold text-slate-900">2. ENT Evaluation:</span> {params.summaryENT || 'Bilateral external auditory canals clear; tympanic membranes intact with cone of light.'}</p>
              <p><span className="font-bold text-slate-900">3. Pediatric Review:</span> {params.summaryPediatric || 'Age-appropriate physical and somatic development. Vaccines completed per IAP schedule.'}</p>
              <p><span className="font-bold text-slate-900">4. Neurology Review:</span> {params.summaryNeurology || 'No neurological deficits or epileptic phenomena reported.'}</p>
              <p><span className="font-bold text-slate-900">5. Psychological / Psycho-educational:</span> {params.summaryPsychological || 'Non-verbal cognitive potential within normal limits; good social intent.'}</p>
            </div>
          </div>

          {/* Summary of Speech & Language Evaluation */}
          <div className="border border-slate-400 bg-slate-50 p-1.5 text-[8.5px] space-y-0.5">
            <span className="font-black uppercase tracking-wide text-slate-900 block border-b border-slate-300 pb-0.5">
              Summary of Findings of Speech and Language Evaluation
            </span>
            <p className="text-slate-800 leading-snug font-medium">
              {params.speechLanguageSummary ||
                'Child demonstrates significant expressive language delay (18 months age equivalent) with age-adequate receptive language (28 months) at chronological age of 30 months (12-month expressive delay). Oral-peripheral mechanisms and hearing are within normal limits.'}
            </p>
          </div>

          {/* Provisional Diagnosis & Recommendations */}
          <div className="grid grid-cols-2 gap-2 text-[8.5px]">
            <div className="border border-purple-300 bg-purple-50/40 p-1.5 rounded">
              <span className="font-black uppercase tracking-wide text-purple-950 block border-b border-purple-200 pb-0.5 mb-1">
                Provisional Diagnosis:
              </span>
              <div className="text-[8px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.provisionalDiagnosis,
                  '• Expressive Language Delay (ELD) secondary to environmental under-stimulation, with intact hearing and age-appropriate receptive abilities.',
                  'bg-purple-950'
                )}
              </div>
            </div>

            <div className="border border-emerald-300 bg-emerald-50/40 p-1.5 rounded">
              <span className="font-black uppercase tracking-wide text-emerald-950 block border-b border-emerald-200 pb-0.5 mb-1">
                Clinical Recommendations:
              </span>
              <div className="text-[8px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.recommendations,
                  '• Direct Speech-Language Therapy (2-3 sessions/week) focusing on expressive vocabulary, functional communication, and phrase generation.\n• Parent-Implemented Language Intervention (PILI) at home: dialogic shared reading and parallel-talk.\n• Screen-time elimination (<30 mins/day with active adult co-viewing).\n• Audiological re-screening in 6 months.',
                  'bg-emerald-950'
                )}
              </div>
            </div>
          </div>

          {/* Formal Sign-off Section (Student Clinician & Supervisor) */}
          <div className="border border-slate-300 bg-slate-50/70 p-2 rounded grid grid-cols-2 gap-4 text-[8.5px] shrink-0">
            <div>
              <span className="font-bold text-slate-700 block mb-2">Clinician / Student Clinician:</span>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-900">Clinical Intern / Resident SLP</p>
                <p className="text-[7.5px] text-slate-500">Department of Speech-Language Pathology</p>
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-2">Clinical Supervisor / Consultant:</span>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-purple-950">Dr. Shreeharsh Shivpuje, BASLP, MASLP</p>
                <p className="text-[7.5px] text-slate-600 font-semibold">RCI CRR No: <span className="font-mono text-purple-950">A79214</span> • Consultant SLP &amp; Audiologist</p>
              </div>
            </div>
          </div>
        </div>

        {renderFooter(3)}
      </div>

    </div>
  );
};

export default EarlyDevelopmentalHistoryDocument;
