import React from 'react';
import { Baby, Activity, Heart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';
import { ClinicalReportBackground } from './ClinicalReportBackground';
import { OfficialReportTitle } from './OfficialReportTitle';
import { PatientDemographicsMatrix } from './PatientDemographicsMatrix';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

/**
 * Early Developmental History (EDH) Official Clinical Dossier (3-Page Production Layout)
 * Strictly modeled after School of Audiology and Speech Language Pathology Clinical Case Proforma
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 *
 * Pagination Structure:
 * - PAGE 1: Case Intake, Prenatal, Natal, Postnatal, Motor Milestones, General Health, Auditory Responses, Cognitive Pre-requisites & Early Foundations (Sections 1 to 5)
 * - PAGE 2: Language & Speech Development Checklists, Milestones, Social & Behavioral Profile, Concept Development, Oral Peripheral Examination (Sections 6 to 10)
 * - PAGE 3: Oral Developmental Skills & Feeding Mechanism, Literacy & School Readiness, Formal Tests (REELS), Multidisciplinary Reports, Speech Summary & Final Recommendations (Sections 11 to 15)
 */
export const EarlyDevelopmentalHistoryDocument = ({
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

  return (
    <div className="edh-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, BIRTH HISTORY & SENSORY/COGNITIVE FOUNDATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(1)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Early Developmental History (EDH)"
            subtitle="Case Intake & Birth History Foundations"
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
                  <span className="font-bold w-18 shrink-0 text-purple-950">Informant :</span>
                  <span className="font-medium text-slate-800 truncate">{params.informant || 'Mother'}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-purple-950">Contact :</span>
                  <span className="font-mono text-slate-800 truncate">{params.informantContact || patient?.phone || '—'}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-purple-950">DOA :</span>
                  <span className="font-medium text-slate-800 truncate">{params.doa || formData?.reportDate || '—'}</span>
                </div>
              </div>
            }
          />

          {/* Chief Complaint Box */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs p-1.5 px-2.5 flex items-start bg-purple-50/30 text-[9px]">
            <span className="font-bold w-28 shrink-0 text-purple-950">Chief Complaint :</span>
            <span className="font-medium text-slate-900 leading-snug">
              {params.chiefComplaint || 'Delayed speech and language onset, limited words, difficulty communicating needs.'}
            </span>
          </div>

          {/* Detailed Birth History Table (3 Columns: Prenatal | Natal | Postnatal & Motor) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs">
            <h3 className="font-black text-[9.5px] uppercase tracking-wide text-purple-950 bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200">
              DETAILED BIRTH HISTORY
            </h3>
            <div className="grid grid-cols-3 text-[8.5px] divide-x divide-purple-100">
              {/* Prenatal */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">
                  1. PRENATAL - Pregnancy
                </span>
                <p><span className="font-bold text-purple-950">Mother's health:</span> {params.motherHealthPrenatal || 'Good'}</p>
                <p><span className="font-bold text-purple-950">Any Illnesses:</span> {params.prenatalIllnesses || 'None'}</p>
                <p><span className="font-bold text-purple-950">Medication(s):</span> {params.prenatalMedications || 'Iron, Folic acid, multivitamins'}</p>
                <p><span className="font-bold text-purple-950">Trauma/Accidents:</span> {params.prenatalTrauma || 'None'}</p>
                <p><span className="font-bold text-purple-950">X-rays:</span> {params.prenatalXRays || 'None'}</p>
                <p><span className="font-bold text-purple-950">H/O Abortion/Stillbirth:</span> {params.prenatalAbortionMiscarriage || 'None'}</p>
                <p><span className="font-bold text-purple-950">Rh Incompatibility:</span> {params.rhIncompatibility || 'No'}</p>
                <p><span className="font-bold text-purple-950">Consanguinity:</span> {params.consanguinity || 'Non-consanguineous marriage'}</p>
                <p className="text-slate-600 italic text-[7.5px] pt-0.5">Note: {params.prenatalNotes || 'Full-term gestation, regular antenatal care.'}</p>
              </div>

              {/* Natal */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">
                  2. NATAL - Delivery
                </span>
                <p><span className="font-bold text-purple-950">Place of delivery:</span> {params.placeOfDelivery || 'Hospital (Institutional)'}</p>
                <p><span className="font-bold text-purple-950">Term:</span> {params.deliveryTerm || 'Full term (39 weeks)'}</p>
                <p><span className="font-bold text-purple-950">Condition at birth:</span> {params.conditionAtBirth || 'Normal (No cyanosis/jaundice)'}</p>
                <p><span className="font-bold text-purple-950">Birth cry:</span> {params.birthCry || 'Immediate, vigorous cry'}</p>
                <p><span className="font-bold text-purple-950">Birth weight:</span> {params.birthWeight || '3.1 kg'}</p>
                <p><span className="font-bold text-purple-950">Complications in first 2 wks:</span> {params.complicationsFirstTwoWeeks || 'None reported; no NICU stay, no jaundice.'}</p>
                <p className="text-slate-600 italic text-[7.5px] pt-0.5">Neonatal Course: Normal adaptation without oxygen therapy.</p>
              </div>

              {/* Postnatal & Motor */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">
                  3. POST NATAL &amp; Motor Milestones
                </span>
                <p><span className="font-bold text-purple-950">Feeding:</span> {params.feedingPostnatal || 'Breast fed up to 1.5 yrs'}</p>
                <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8px] pt-0.5">
                  <p><span className="font-semibold text-purple-950">Holding head:</span> {params.motorHeadUp || '3 months'}</p>
                  <p><span className="font-semibold text-purple-950">Reaching:</span> {params.motorReaching || '5 months'}</p>
                  <p><span className="font-semibold text-purple-950">Sitting indep:</span> {params.motorSitting || '6-7 months'}</p>
                  <p><span className="font-semibold text-purple-950">Crawling:</span> {params.motorCrawling || '8-9 months'}</p>
                  <p><span className="font-semibold text-purple-950">Standing indep:</span> {params.motorStanding || '10-11 months'}</p>
                  <p><span className="font-semibold text-purple-950">Walking indep:</span> {params.motorWalking || '12-13 months'}</p>
                </div>
                <div className="border-t border-purple-100 pt-0.5 space-y-0.5 text-[8px]">
                  <p><span className="font-bold text-purple-950">Toilet Control:</span> Partial {params.toiletControlPartial || '2.5 Yrs'} | Complete {params.toiletControlComplete || '3.5 Yrs'}</p>
                  <p><span className="font-bold text-purple-950">Hand:</span> {params.handPreference || 'Right'} | <span className="font-bold text-purple-950">Dress:</span> {params.dressing || 'Dep'} | <span className="font-bold text-purple-950">Undress:</span> {params.undressing || 'Indep'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Health & Hearing Responses (2 Balanced Columns) */}
          <div className="grid grid-cols-2 border border-purple-200/80 rounded-lg overflow-hidden text-[8.5px] divide-x divide-purple-100 bg-white/85 backdrop-blur-2xs shadow-2xs">
            {/* General Health */}
            <div className="p-1.5 space-y-0.5">
              <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5 bg-purple-50/50 px-1 -mx-1.5 -mt-1.5">
                General Health Status
              </span>
              <p><span className="font-bold text-purple-950">Present status:</span> {params.presentHealthStatus || 'Good / Healthy'}</p>
              <p><span className="font-bold text-purple-950">Illnesses/Injuries:</span> {params.childhoodIllnesses || 'None (No measles, diphtheria, chickenpox, or whooping cough)'}</p>
              <p><span className="font-bold text-purple-950">Accident/Fall:</span> {params.accidentFallHistory || 'No history of severe head trauma'}</p>
              <p><span className="font-bold text-purple-950">Convulsions:</span> {params.convulsionsHistory || 'No'} {params.convulsionsHistory === 'Yes' ? `(${params.convulsionsAgeStarted}, ${params.convulsionsFrequency})` : ''}</p>
              <p><span className="font-bold text-purple-950">Medications:</span> {params.presentMedications || 'None currently'}</p>
              <p><span className="font-bold text-purple-950">Vision:</span> {params.visionStatus || 'Normal (Fixes and follows objects binocularly)'}</p>
              <p><span className="font-bold text-purple-950">Sleep Habits:</span> {params.sleepHabits || 'Good (8-9 hours continuous night sleep)'}</p>
              <p><span className="font-bold text-purple-950">Breathing Pattern:</span> {params.breathingPattern || 'Regular nasal breathing (no snoring)'}</p>
            </div>

            {/* Hearing */}
            <div className="p-1.5 space-y-0.5">
              <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5 bg-purple-50/50 px-1 -mx-1.5 -mt-1.5">
                Hearing &amp; Auditory Responses
              </span>
              <p><span className="font-bold text-purple-950">Sound response as baby:</span> {params.responseToSoundBaby || 'Looking at source of sound, startle reflex'}</p>
              <p><span className="font-bold text-purple-950">Feels child hears normally:</span> {params.feelsChildHearsNormally || 'Yes (attends to whispers & doorbells)'}</p>
              <p><span className="font-bold text-purple-950">Responds to clapping:</span> {params.responseClapping || 'Yes (turns toward sound)'}</p>
              <p><span className="font-bold text-purple-950">Responds to loud sounds:</span> {params.responseLoudSounds || 'Yes (present startle)'}</p>
              <p><span className="font-bold text-purple-950">Environmental sounds:</span> {params.responseEnvironmentalSounds || 'Yes (utensils, vehicles, TV)'}</p>
              <p><span className="font-bold text-purple-950">Ear infection/discharge:</span> {params.earInfectionHistory || 'No history of otitis media or discharge'}</p>
              <p><span className="font-bold text-purple-950">Prior hearing test:</span> {params.priorHearingTest || 'Yes'} {params.priorHearingTestDetails ? `(${params.priorHearingTestDetails})` : '(Newborn OAE Screen PASS bilaterally)'}</p>
              <p className="text-[7.5px] text-slate-600 italic pt-0.5">Auditory Attentiveness: Consistent auditory localization to environmental speech.</p>
            </div>
          </div>

          {/* Cognitive Pre-requisites (Levels of Attention, Intention & Play Development) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Cognitive Pre-requisites (Attention, Intention &amp; Play Development)
            </div>
            <div className="grid grid-cols-3 divide-x divide-purple-100 p-1.5">
              <div className="space-y-1 pr-1.5">
                <span className="font-black text-purple-950 block border-b border-purple-200 pb-0.5 uppercase text-[8px]">Levels of Attention</span>
                <p className="text-[8px]"><span className="font-bold text-purple-950">Assessed:</span> <span className="text-purple-950 font-bold">{params.attentionLevel || 'Level 3 (2-3 yrs): Adult choice'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-purple-50/30 p-1 rounded border border-purple-100">
                  <p>• L1 (0-1 yr): Fleeting attention</p>
                  <p>• L2 (1-2 yrs): Own choice of activity</p>
                  <p className="font-bold text-purple-950 bg-purple-100/90 px-1 py-0.2 rounded border border-purple-200">• L3 (2-3 yrs): Adult choice (Current)</p>
                  <p>• L4 (3-4 yrs): Two-channel attention</p>
                  <p>• L5 (4-5 yrs): Integrated for short spells</p>
                  <p>• L6 (5-6 yrs): Sustained integrated attention</p>
                </div>
              </div>

              <div className="space-y-1 px-1.5">
                <span className="font-black text-purple-950 block border-b border-purple-200 pb-0.5 uppercase text-[8px]">Level of Intention</span>
                <p className="text-[8px]"><span className="font-bold text-purple-950">Status:</span> <span className="font-bold">{params.intentionLevel || 'Late intentional (12-18 mo)'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-purple-50/30 p-1 rounded border border-purple-100">
                  <p>• Pre-intentional (&lt;8 mo): Cries/reflexes</p>
                  <p>• Early intentional (8-12 mo): Reaches with gaze</p>
                  <p className="font-bold text-purple-950 bg-purple-100/90 px-1 py-0.2 rounded border border-purple-200">• Late intentional (12-18 mo): Gestures/vocals (Current)</p>
                  <p>• Representational (18+ mo): Words</p>
                </div>
              </div>

              <div className="space-y-1 pl-1.5">
                <span className="font-black text-purple-950 block border-b border-purple-200 pb-0.5 uppercase text-[8px]">Play Development</span>
                <p className="text-[8px]"><span className="font-bold text-purple-950">Stages:</span> <span className="font-bold">{params.playDevelopment || 'Relational & Self Pretend'}</span></p>
                <div className="text-[7.5px] text-slate-700 space-y-0.5 bg-purple-50/30 p-1 rounded border border-purple-100">
                  <p>• Exploratory: Mouthing, banging</p>
                  <p className="font-bold text-purple-950 bg-purple-100/90 px-1 py-0.2 rounded border border-purple-200">• Relational: Stacks blocks, rolls car (Present)</p>
                  <p className="font-bold text-purple-950 bg-purple-100/90 px-1 py-0.2 rounded border border-purple-200">• Self-Pretend: Pretend feeds, sleeps (Present)</p>
                  <p>• De-centered: Feeds doll/teddy</p>
                  <p>• Sequence pretend: Multi-step play</p>
                </div>
              </div>
            </div>
          </div>

          {/* Early Language Foundations (Comprehension & Expression) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Language and Speech Development: Early Foundations
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-100 p-1.5">
              <div className="space-y-0.5 pr-2">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">Early Comprehension Foundations:</span>
                <p>• Responded to adult (cooing/smiling): <span className="font-bold text-slate-900">{params.ageRespondingToAdult || '3 months (smiling & cooing)'}</span></p>
                <p>• Responds to tone of voice: <span className="font-bold text-slate-900">{params.respondToneOfVoice || 'Yes (soothed by gentle voice)'}</span></p>
                <p>• Looks where parents look (Joint attention): <span className="font-bold text-slate-900">{params.jointAttention || 'Yes (shares gaze and points)'}</span></p>
                <p>• Object permanence: <span className="font-bold text-slate-900">{params.objectPermanence || 'Yes (searches for hidden objects)'}</span></p>
              </div>

              <div className="space-y-0.5 pl-2">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">Early Communication Expression:</span>
                <p>• Early vocalization: <span className="font-bold text-slate-900">Differentiated crying, syllabic vocal play</span></p>
                <p>• Modes used: <span className="font-bold text-slate-900">{params.communicationModes || 'Reaching, vocalizing, simple gestures, single words'}</span></p>
                <p>• Expressive Vocabulary: <span className="font-bold text-purple-950">{params.expressiveLexicalRepertoire || '15-20 functional words (mama, papa, paani, dada, ball, car)'}</span></p>
                <p>• Lexical items: Nouns (domestic objects), early action verbs, social markers.</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: LANGUAGE, SPEECH MILESTONES, BEHAVIOR, CONCEPTS & ORAL STRUCTURES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(2)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Developmental Milestones"
            subtitle="Language, Behavioral Profile & Oral Mechanism"
          />

          {/* Detailed Language Comprehension & Expression Checklist */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Language &amp; Speech Development Checklists
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-100 p-2">
              {/* Comprehension Checklist */}
              <div className="space-y-1 pr-2">
                <span className="font-black text-purple-950 block border-b border-purple-200 pb-0.5 uppercase">COMPREHENSION CHECKLIST (RECEPTIVE)</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <p>• Understands gestures: <span className="font-bold text-slate-900">{params.understandsGestures || 'Yes'}</span></p>
                  <p>• Family recognition: <span className="font-bold text-slate-900">{params.recognitionFamily || 'Yes'}</span></p>
                  <p>• Words in context: <span className="font-bold text-slate-900">{params.respondsSingleWordContext || 'Yes'}</span></p>
                  <p>• Points to pictures: <span className="font-bold text-slate-900">{params.pointsToPictures || 'Yes'}</span></p>
                  <p>• 1-stage commands: <span className="font-bold text-slate-900">{params.followsOneStageCommands || 'Yes (e.g. "Give ball")'}</span></p>
                  <p>• 2-stage commands: <span className="font-bold text-slate-900">{params.followsTwoStageCommands || 'Inconsistent'}</span></p>
                  <p>• Yes/No questions: <span className="font-bold text-slate-900">{params.answersYesNo || 'Emerging (nods head)'}</span></p>
                  <p>• Conversations: <span className="font-bold text-slate-900">{params.understandsConversations || 'Emerging'}</span></p>
                </div>
                <div className="pt-1 border-t border-purple-100 text-[7.5px] text-slate-700">
                  <span className="font-bold text-purple-950">Receptive Repertoire:</span> Domestic objects (cup, spoon, ball), food (milk, water), body parts, animals.
                </div>
              </div>

              {/* Expression Checklist */}
              <div className="space-y-1 pl-2">
                <span className="font-black text-purple-950 block border-b border-purple-200 pb-0.5 uppercase">EXPRESSION MODES &amp; PRESENT OUTPUT</span>
                <p>• <span className="font-bold text-purple-950">Communication Modes:</span> {params.communicationModes || 'Reaching/vocalizing, simple gestures (bye-bye/namaste), single words'}</p>
                <p>• <span className="font-bold text-purple-950">Expressive Vocabulary:</span> {params.expressiveLexicalRepertoire || '15-20 functional words (mama, papa, paani, dada, ball, car, doodh)'}</p>
                <p>• <span className="font-bold text-purple-950">Lexical Categories:</span> Nouns (majority), social words (bye, hi), early verbs (de, aaja).</p>
                <p>• <span className="font-bold text-purple-950">Utterance Length:</span> Single word stage; 2-word combinations not yet spontaneously observed.</p>
                <div className="pt-1 border-t border-purple-100 text-[7.5px] text-slate-700">
                  <span className="font-bold text-purple-950">Pre-verbal communication:</span> Reaches for desired objects, pulls adult's hand, vocalizes with eye gaze.
                </div>
              </div>
            </div>
          </div>

          {/* Speech Development History (Milestone Ages) & Environment */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Speech Milestones &amp; Linguistic Environment
            </div>
            <table className="w-full text-center border-collapse border-b border-purple-200">
              <thead className="bg-purple-50/50 font-bold text-[8px] text-purple-950">
                <tr className="divide-x divide-purple-200 border-b border-purple-200">
                  <th className="p-1">Vocal Play</th>
                  <th className="p-1">Babbling</th>
                  <th className="p-1">First Word</th>
                  <th className="p-1">First Sentence</th>
                </tr>
              </thead>
              <tbody className="divide-x divide-purple-200 font-mono font-bold text-purple-950">
                <tr>
                  <td className="p-1">{params.ageVocalPlay || '4-5 months'}</td>
                  <td className="p-1">{params.ageBabbling || '7-8 months'}</td>
                  <td className="p-1">{params.ageFirstWord || '14 months'}</td>
                  <td className="p-1">{params.ageFirstSentence || 'Not yet developed'}</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1.5 grid grid-cols-3 divide-x divide-purple-100 text-[8px]">
              <p className="px-1.5"><span className="font-bold text-purple-950">Family Speech History:</span> {params.familySpeechHistory || 'No known familial speech/hearing issues.'}</p>
              <p className="px-1.5"><span className="font-bold text-purple-950">Talking Environment:</span> {params.talkingEnvironment || 'Yes (Active verbal stimulation by family)'}</p>
              <p className="px-1.5"><span className="font-bold text-purple-950">Language(s) at Home:</span> {params.languageEnvironment || 'Bilingual'} ({params.preferredHomeLanguage || 'Marathi & Hindi'})</p>
            </div>
          </div>

          {/* Social Interaction & Behavioral Profile */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Social Interaction &amp; Behavioral Profile
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-100 p-1.5">
              <div className="space-y-0.5 pr-2">
                <p><span className="font-bold text-purple-950">Engages in interaction:</span> {params.socialEngages || 'Yes (actively seeks eye contact during play)'}</p>
                <p><span className="font-bold text-purple-950">Initiates interaction:</span> {params.socialInitiates || 'Yes (brings toys to parents to initiate)'}</p>
                <p><span className="font-bold text-purple-950">Preference for familiar:</span> {params.socialFamiliarPreference || 'Yes (shows strong attachment to mother)'}</p>
                <p><span className="font-bold text-purple-950">Toy play / Peer play:</span> {params.playsWithToys || 'Yes (functional toy play)'} / {params.playsWithChildren || 'Emerging (parallel play alongside peers)'}</p>
                <p className="text-[7.5px] text-slate-600 italic pt-0.5">Social Intent: Displays warm emotional reciprocity and responds promptly to praise and smiles.</p>
              </div>
              <div className="space-y-0.5 pl-2">
                <p><span className="font-bold text-purple-950">Screen-time:</span> {params.screenTime || '1 to 2 hours/day (Smart TV & mobile cartoons)'}</p>
                <p><span className="font-bold text-purple-950">Temper tantrums:</span> {params.temperTantrums || 'Mild (occasional protest when screen is turned off)'}</p>
                <p><span className="font-bold text-purple-950">Behavioral traits:</span> {params.behaviorRestlessStubborn || 'Mildly restless during non-preferred tabletop tasks'}</p>
                <p><span className="font-bold text-purple-950">Likes / Dislikes:</span> {params.strongLikesDislikes || 'Likes: Vehicle toys. Dislikes: loud blender/mixer.'}</p>
                <p className="text-[7.5px] text-slate-600 italic pt-0.5">Sensory Profile: No tactile or auditory hypersensitivity noted other than loud blender noises.</p>
              </div>
            </div>
          </div>

          {/* Concept Development (General, Colors, Objects) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Concept Development Matrix
            </div>
            <div className="grid grid-cols-3 divide-x divide-purple-100 p-1.5">
              <div className="space-y-0.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">GENERAL CONCEPTS</span>
                <p>• Money concept: {params.conceptMoney || 'No'}</p>
                <p>• Danger concept: {params.conceptDanger || 'Yes (avoids hot stove & edge of bed)'}</p>
                <p>• Order by size: {params.orderSize || 'Emerging (nests larger cup into smaller cup)'}</p>
              </div>
              <div className="space-y-0.5 px-1.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">COLOR CONCEPTS</span>
                <p>• Match colors: {params.colorMatching || 'Yes (matches primary color blocks)'}</p>
                <p>• Sort colors: {params.colorSorting || 'Emerging (sorts two contrasting colors)'}</p>
                <p>• Identify: {params.colorIdentification || 'Emerging'} | Name: {params.colorNaming || 'No'}</p>
              </div>
              <div className="space-y-0.5 pl-1.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">OBJECT CONCEPTS</span>
                <p>• Use by function: {params.objectUseFunction || 'Yes (comb for hair, cup for drinking)'}</p>
                <p>• Object matching: {params.objectObjectMatching || 'Yes'}</p>
                <p>• Picture matching: {params.objectPictureMatching || 'Yes (matches toy to picture)'}</p>
              </div>
            </div>
          </div>

          {/* Examination of Oral Structures (Appearance & Movement) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Examination of Oral Structures
            </div>
            <table className="w-full text-left border-collapse border-b border-purple-200">
              <thead className="bg-purple-50/50 font-bold text-[8px] text-purple-950">
                <tr className="divide-x divide-purple-200 border-b border-purple-200">
                  <th className="p-1 w-20">Structure</th>
                  <th className="p-1">Appearance</th>
                  <th className="p-1">Movement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-[8px]">
                <tr className="divide-x divide-purple-100">
                  <td className="p-1 font-bold text-purple-950">1. Lips</td>
                  <td className="p-1">{params.oralLips || 'Normal symmetry, intact vermilion border, adequate lip seal at rest'}</td>
                  <td className="p-1">Adequate closure, spreading &amp; retraction during smiling and speech</td>
                </tr>
                <tr className="divide-x divide-purple-100">
                  <td className="p-1 font-bold text-purple-950">2. Tongue</td>
                  <td className="p-1">{params.oralTongue || 'Normal size & shape, no ankyloglossia, free movement'}</td>
                  <td className="p-1">Adequate elevation, protrusion &amp; lateralization across dental arches</td>
                </tr>
                <tr className="divide-x divide-purple-100">
                  <td className="p-1 font-bold text-purple-950">3. Palate</td>
                  <td className="p-1">{params.oralPalate || 'Intact hard and soft palate, normal arch contour, symmetrical uvula'}</td>
                  <td className="p-1">Symmetrical velopharyngeal closure on phonation</td>
                </tr>
                <tr className="divide-x divide-purple-100">
                  <td className="p-1 font-bold text-purple-950">4. Teeth</td>
                  <td className="p-1">{params.oralTeeth || 'Complete primary dentition, normal occlusion, intact dental arch'}</td>
                  <td className="p-1">Adequate jaw stability and alignment during speech and chewing</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1 text-[7.5px] text-slate-700 bg-purple-50/30">
              <span className="font-bold text-purple-950">Structural Evaluation Notes:</span> Oral structures are intact with adequate symmetrical tone, strength, and range of motion for developmental age.
            </div>
          </div>
          </div>
        </div>

        {renderFooter(2)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: ORAL SKILLS & FEEDING, LITERACY, FORMAL TESTS & CLINICAL FORMULATION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(3)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Clinical Formulation & Battery"
            subtitle="Formal Tests (REELS), Multidisciplinary Summary & Recommendations"
          />

          {/* Oral Developmental Skills & Feeding Mechanism */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Oral Developmental Skills &amp; Feeding Mechanism
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-100 p-2">
              <div className="space-y-0.5 pr-2">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">
                  Oral Developmental Skills:
                </span>
                <p>• <span className="font-bold text-purple-950">Lip closure:</span> {params.oralLipClosure || 'Adequate closure at rest and during swallowing'}</p>
                <p>• <span className="font-bold text-purple-950">Tongue posture:</span> {params.oralTonguePosture || 'Normal intra-oral resting posture (no tongue thrust)'}</p>
                <p>• <span className="font-bold text-purple-950">Blowing:</span> {params.oralBlowing || 'Present (blows bubbles & whistles)'}</p>
                <p>• <span className="font-bold text-purple-950">Spitting:</span> {params.oralSpitting || 'Developing (can spit water during brushing)'}</p>
                <p>• <span className="font-bold text-purple-950">Sucking through straw:</span> {params.oralSuckingStraw || 'Present (effective suction from straw cup)'}</p>
                <p>• <span className="font-bold text-purple-950">Spoon feeding:</span> {params.oralSpoonFeeding || 'Independent with clean lip clearance'}</p>
              </div>

              <div className="space-y-0.5 pl-2">
                <span className="font-black text-purple-950 uppercase block border-b border-purple-200 pb-0.5">
                  Feeding &amp; Masticatory Function:
                </span>
                <p>• <span className="font-bold text-purple-950">Sucking tongue movement:</span> {params.feedingTongueMovement || 'Front to back movement established'}</p>
                <p>• <span className="font-bold text-purple-950">Munching &amp; Jaw movement:</span> {params.feedingJawMovement || 'Up and down jaw movement progressing to rotary'}</p>
                <p>• <span className="font-bold text-purple-950">True Chewing:</span> {params.feedingChewing || 'True chewing present (handles solid rotis, fruits, rice)'}</p>
                <p>• <span className="font-bold text-purple-950">Tongue lateralization:</span> {params.feedingTongueLateralization || 'Adequate lateralization to transfer food bolus'}</p>
                <p>• <span className="font-bold text-purple-950">Rotary jaw movement:</span> {params.feedingRotaryJaw || 'Established rotary movement on both sides'}</p>
                <p>• <span className="font-bold text-purple-950">Controlled sustained bite:</span> {params.feedingSustainedBite || 'Controlled bite through solid foods (carrots/biscuits)'}</p>
              </div>
            </div>
          </div>

          {/* Literacy & School Details */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Literacy &amp; School Readiness
            </div>
            <div className="grid grid-cols-3 divide-x divide-purple-100 p-2">
              <div className="space-y-0.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">Reading Readiness:</span>
                <p>• Shapes: {params.readingShapes || 'Identifies circle and square'}</p>
                <p>• Numbers: {params.readingNumbers || 'Identifies 1 and 2'}</p>
                <p>• Letters: {params.readingLetters || 'Not yet introduced formally'}</p>
              </div>
              <div className="space-y-0.5 px-2">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">Writing Readiness:</span>
                <p>• Type of grip: <span className="font-bold text-purple-950">{params.writingGrip || 'Pincer grasp emerging (holds crayon with fingers)'}</span></p>
                <p>• Scribbling: {params.writingScribbling || 'Present (spontaneous vertical and circular strokes)'}</p>
              </div>
              <div className="space-y-0.5 pl-2">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">School Details:</span>
                <p>{params.schoolDetails || 'Attends playgroup (3 days/week); adapts well to classroom routines'}</p>
              </div>
            </div>
          </div>

          {/* Formal Test Findings (REELS & Standardized Scales) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Formal Test Findings: REELS &amp; Standardized Assessment
            </div>
            <div className="grid grid-cols-2 divide-x divide-purple-100 p-2">
              <div className="space-y-0.5">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">
                  REELS Result (Receptive-Expressive Emergent Language Scale):
                </span>
                <div className="grid grid-cols-2 gap-1 text-[8.5px]">
                  <p><span className="font-bold text-purple-950">Comprehension Level:</span></p>
                  <p className="font-mono font-bold text-slate-900">{params.reelsComprehension || '28 months'}</p>
                  <p><span className="font-bold text-purple-950">Expression Level:</span></p>
                  <p className="font-mono font-bold text-purple-950">{params.reelsExpression || '18 months'}</p>
                  <p><span className="font-bold text-purple-950">Chronological Age:</span></p>
                  <p className="font-mono font-bold text-purple-950">{params.reelsChronologicalAge || '30 months (2 yrs 6 mo)'}</p>
                </div>
                <p className="text-[7.5px] text-purple-900 font-bold pt-0.5">
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
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs text-[8.5px]">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 p-1 px-2.5 border-b border-purple-200 font-bold uppercase text-purple-950">
              Summary of Findings of Multidisciplinary Reports
            </div>
            <div className="p-1.5 space-y-0.5 text-[8px]">
              <p><span className="font-bold text-purple-950">1. Hearing Evaluation:</span> {params.summaryHearing || 'Bilateral normal hearing sensitivity confirmed via OAE and screening tympanometry.'}</p>
              <p><span className="font-bold text-purple-950">2. ENT Evaluation:</span> {params.summaryENT || 'Bilateral external auditory canals clear; tympanic membranes intact with cone of light.'}</p>
              <p><span className="font-bold text-purple-950">3. Pediatric Review:</span> {params.summaryPediatric || 'Age-appropriate physical and somatic development. Vaccines completed per IAP schedule.'}</p>
              <p><span className="font-bold text-purple-950">4. Neurology Review:</span> {params.summaryNeurology || 'No neurological deficits or epileptic phenomena reported.'}</p>
              <p><span className="font-bold text-purple-950">5. Psychological / Psycho-educational:</span> {params.summaryPsychological || 'Non-verbal cognitive potential within normal limits; good social intent.'}</p>
            </div>
          </div>

          {/* Summary of Speech & Language Evaluation */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-purple-50/40 p-1.5 text-[8.5px] space-y-0.5 shadow-2xs">
            <span className="font-black uppercase tracking-wide text-purple-950 block border-b border-purple-200 pb-0.5">
              Summary of Findings of Speech and Language Evaluation
            </span>
            <p className="text-slate-800 leading-snug font-medium">
              {params.speechLanguageSummary ||
                'Child demonstrates significant expressive language delay (18 months age equivalent) with age-adequate receptive language (28 months) at chronological age of 30 months (12-month expressive delay). Oral-peripheral mechanisms and hearing are within normal limits.'}
            </p>
          </div>

          {/* Provisional Diagnosis & Recommendations */}
          <div className="grid grid-cols-2 gap-2 text-[8.5px]">
            <div className="border border-purple-200 bg-purple-50/50 p-1.5 rounded-lg shadow-2xs">
              <span className="font-black uppercase tracking-wide text-purple-950 block border-b border-purple-200 pb-0.5 mb-1">
                Provisional Diagnosis:
              </span>
              <div className="text-[8px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.provisionalDiagnosis,
                  '• Expressive Language Delay (ELD) secondary to environmental under-stimulation, with intact hearing and age-appropriate receptive abilities.',
                  'bg-purple-900'
                )}
              </div>
            </div>

            <div className="border border-purple-200 bg-purple-50/50 p-1.5 rounded-lg shadow-2xs">
              <span className="font-black uppercase tracking-wide text-purple-950 block border-b border-purple-200 pb-0.5 mb-1">
                Clinical Recommendations:
              </span>
              <div className="text-[8px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.recommendations,
                  '• Direct Speech-Language Therapy (2-3 sessions/week) focusing on expressive vocabulary, functional communication, and phrase generation.\n• Parent-Implemented Language Intervention (PILI) at home: dialogic shared reading and parallel-talk.\n• Screen-time elimination (<30 mins/day with active adult co-viewing).\n• Audiological re-screening in 6 months.',
                  'bg-purple-900'
                )}
              </div>
            </div>
          </div>

          {/* Formal Sign-off Section (Student Clinician & Supervisor) */}
          <div className="bg-white/85 border border-purple-200/80 p-2 rounded-lg grid grid-cols-2 gap-4 text-[8.5px] shrink-0 shadow-2xs">
            <div>
              <span className="font-bold text-purple-950 block mb-1">Clinician / Student Clinician:</span>
              <div className="border-t border-purple-200 pt-1">
                <p className="font-bold text-slate-900">Clinical Intern / Resident SLP</p>
                <p className="text-[7.5px] text-slate-500">Department of Speech-Language Pathology</p>
              </div>
            </div>
            <div>
              <span className="font-bold text-purple-950 block mb-1">Clinical Supervisor / Consultant:</span>
              <div className="border-t border-purple-200 pt-1">
                <p className="font-bold text-purple-950">{supervisorName}</p>
                <p className="text-[7.5px] text-slate-600 font-semibold">RCI CRR No: <span className="font-mono text-purple-950">{currentRci}</span> • Consultant SLP &amp; Audiologist</p>
              </div>
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
