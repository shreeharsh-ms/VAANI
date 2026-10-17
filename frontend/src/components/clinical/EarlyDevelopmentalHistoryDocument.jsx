import React from 'react';
import { QrCode } from 'lucide-react';

/**
 * Early Developmental History (EDH) Official Clinical Dossier (3-Page Production Layout)
 * Strictly modeled after Bharati Vidyapeeth School of Audiology and Speech Language Pathology EDH Proforma
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 */
export const EarlyDevelopmentalHistoryDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  renderBulletPoints,
}) => {
  const params = formData?.parameters || {};

  // Common Header Component
  const renderHeader = (pageNumber) => (
    <div className="border-b-2 border-purple-950 pb-2 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <img
          src="/vaani-logo.png"
          alt="Vaani Speech and Hearing Clinic"
          className="h-12 w-auto object-contain shrink-0"
        />
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-700">
            <span className="font-semibold text-slate-800">
              RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[9px] text-slate-500 font-medium">
              RCI Approved Practice Center • ISO 9001:2015
            </span>
          </div>
          <p className="text-[10px] text-slate-700 font-medium">
            Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
          </p>
          <p className="text-[9px] text-slate-500">
            Tel: +91 2162 234567 • Mob: +91 94220 11223 • Email: clinic@vaaniclinic.com
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 space-y-0.5 text-slate-900">
        <span className="block text-xs font-mono font-bold text-slate-900">
          Report No: {formData?.reportNumber}
        </span>
        <span className="block text-[10px] text-slate-500 font-medium">
          Date: {formData?.reportDate}
        </span>
        <span className="inline-block px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 rounded border border-purple-200">
          Page {pageNumber} of 3
        </span>
      </div>
    </div>
  );

  // Common Statutory Footer Component
  const renderFooter = (pageNumber) => (
    <div className="mt-auto pt-2 border-t-2 border-purple-950 flex items-end justify-between text-xs print:break-inside-avoid">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border border-slate-400 rounded flex items-center justify-center bg-white shadow-2xs shrink-0">
          <QrCode className="w-8 h-8 text-purple-950" />
        </div>
        <div>
          <span className="text-[8.5px] font-mono font-black text-purple-950 block uppercase">
            QR VERIFIED • DPDP ACT COMPLIANT
          </span>
          <span className="text-[7.5px] text-slate-600 block">
            Scan to verify document cryptographic authenticity
          </span>
          <span className="text-[7.5px] font-mono text-slate-500">
            https://vaaniclinic.com/verify-doc/{formData?.reportNumber} • Pg {pageNumber}/3
          </span>
        </div>
      </div>

      <div className="text-right space-y-0.5">
        <div className="inline-block border-b border-purple-900 pb-0.5 mb-0.5 px-3 text-center">
          <span className="font-serif italic font-bold text-purple-950 text-xs block">
            Shreeharsh M. Shivpuje
          </span>
          <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block">
            Digitally Authenticated
          </span>
        </div>
        <p className="font-black text-slate-950 text-[11px] leading-tight">
          {formData?.examinerName || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP'}
        </p>
        <p className="text-[9.5px] font-semibold text-slate-800">
          RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
        </p>
        <p className="text-[8.5px] text-slate-600 font-medium">
          Consultant Audiologist &amp; Speech-Language Pathologist
        </p>
      </div>
    </div>
  );

  return (
    <div className="edh-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, BIRTH HISTORY & SENSORY/COGNITIVE FOUNDATIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-white text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0 print:h-[279mm] leading-tight">
        <div className="flex-1 flex flex-col space-y-2.5">
          {renderHeader(1)}

          {/* Title Banner */}
          <div className="text-center my-0.5">
            <span className="inline-block bg-[#0284c7] text-white font-black text-xs tracking-wider px-6 py-1 rounded-full uppercase shadow-2xs">
              EARLY DEVELOPMENTAL HISTORY (EDH) — CASE INTAKE &amp; BIRTH HISTORY
            </span>
          </div>

          {/* Demographics & Informant Context Box */}
          <div className="border border-slate-700 text-[9.5px] bg-white">
            <div className="grid grid-cols-12 divide-x divide-slate-700 border-b border-slate-700">
              <div className="col-span-5 p-1 px-2 flex">
                <span className="font-bold w-16 shrink-0 text-slate-800">Name:</span>
                <span className="font-bold text-slate-950">{patient.full_name}</span>
              </div>
              <div className="col-span-4 p-1 px-2 flex">
                <span className="font-bold w-18 shrink-0 text-slate-800">Age / Sex:</span>
                <span className="font-medium text-slate-900">
                  {patient.date_of_birth} / {patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : patient.gender}
                </span>
              </div>
              <div className="col-span-3 p-1 px-2 flex">
                <span className="font-bold w-16 shrink-0 text-slate-800">Informant:</span>
                <span className="font-medium text-slate-900">{params.informant || 'Mother'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 divide-x divide-slate-700 border-b border-slate-700">
              <div className="col-span-5 p-1 px-2 flex">
                <span className="font-bold w-16 shrink-0 text-slate-800">Reg. No:</span>
                <span className="font-mono font-bold text-slate-950">{patient.uhid}</span>
              </div>
              <div className="col-span-4 p-1 px-2 flex">
                <span className="font-bold w-18 shrink-0 text-slate-800">DOA:</span>
                <span className="font-medium text-slate-900">{params.doa || formData?.reportDate}</span>
              </div>
              <div className="col-span-3 p-1 px-2 flex">
                <span className="font-bold w-16 shrink-0 text-slate-800">Contact:</span>
                <span className="font-mono text-slate-900">{params.informantContact || patient.phone}</span>
              </div>
            </div>

            <div className="p-1 px-2 flex bg-slate-50/50">
              <span className="font-bold w-28 shrink-0 text-slate-800">Chief Complaint:</span>
              <span className="font-medium text-slate-900 leading-tight">
                {params.chiefComplaint || 'Delayed speech and language onset, limited words, difficulty communicating needs.'}
              </span>
            </div>
          </div>

          {/* Detailed Birth History Table (3 Columns: Prenatal | Natal | Postnatal & Motor) */}
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-wide text-slate-900 mb-0.5 bg-slate-100 p-0.5 px-1.5 border border-slate-400">
              DETAILED BIRTH HISTORY
            </h3>
            <div className="grid grid-cols-3 border border-slate-400 text-[8.5px] divide-x divide-slate-400 bg-white">
              {/* Prenatal */}
              <div className="p-1.5 space-y-1">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  1. PRENATAL - Pregnancy
                </span>
                <p><span className="font-bold">Mother's health:</span> {params.motherHealthPrenatal || 'Good'}</p>
                <p><span className="font-bold">Any Illnesses:</span> {params.prenatalIllnesses || 'None'}</p>
                <p><span className="font-bold">Medication(s):</span> {params.prenatalMedications || 'Iron & Folic acid'}</p>
                <p><span className="font-bold">Trauma/Accidents:</span> {params.prenatalTrauma || 'None'}</p>
                <p><span className="font-bold">X-rays:</span> {params.prenatalXRays || 'None'}</p>
                <p><span className="font-bold">H/O Abortion/Stillbirth:</span> {params.prenatalAbortionMiscarriage || 'None'}</p>
                <p><span className="font-bold">Rh Incompatibility:</span> {params.rhIncompatibility || 'No'}</p>
                <p><span className="font-bold">Consanguinity:</span> {params.consanguinity || 'Non-consanguineous'}</p>
                {params.prenatalNotes && <p className="text-slate-600 italic">Note: {params.prenatalNotes}</p>}
              </div>

              {/* Natal */}
              <div className="p-1.5 space-y-1">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  2. NATAL - Delivery
                </span>
                <p><span className="font-bold">Place of delivery:</span> {params.placeOfDelivery || 'Hospital'}</p>
                <p><span className="font-bold">Term:</span> {params.deliveryTerm || 'Full term (39 wks)'}</p>
                <p><span className="font-bold">Condition at birth:</span> {params.conditionAtBirth || 'Normal'}</p>
                <p><span className="font-bold">Birth cry:</span> {params.birthCry || 'Immediate'}</p>
                <p><span className="font-bold">Birth weight:</span> {params.birthWeight || '3.1 kg'}</p>
                <p><span className="font-bold">Complications in first 2 wks:</span> {params.complicationsFirstTwoWeeks || 'None'}</p>
              </div>

              {/* Postnatal & Motor */}
              <div className="p-1.5 space-y-0.5">
                <span className="font-black text-purple-950 uppercase block border-b border-slate-300 pb-0.5">
                  3. POST NATAL &amp; Motor
                </span>
                <p><span className="font-bold">Feeding:</span> {params.feedingPostnatal || 'Breast fed'}</p>
                <div className="grid grid-cols-2 gap-x-1 text-[8px] pt-0.5">
                  <p><span className="font-semibold">Holding head:</span> {params.motorHeadUp || '3 mo'}</p>
                  <p><span className="font-semibold">Reaching:</span> {params.motorReaching || '5 mo'}</p>
                  <p><span className="font-semibold">Sitting:</span> {params.motorSitting || '6-7 mo'}</p>
                  <p><span className="font-semibold">Crawling:</span> {params.motorCrawling || '8-9 mo'}</p>
                  <p><span className="font-semibold">Standing:</span> {params.motorStanding || '10-11 mo'}</p>
                  <p><span className="font-semibold">Walking:</span> {params.motorWalking || '12-13 mo'}</p>
                </div>
                <div className="border-t border-slate-200 pt-0.5 space-y-0.5 text-[8px]">
                  <p><span className="font-bold">Toilet Control:</span> Partial {params.toiletControlPartial || '2.5 Yrs'} | Complete {params.toiletControlComplete || '3.5 Yrs'}</p>
                  <p><span className="font-bold">Hand Pref:</span> {params.handPreference || 'Right'} | <span className="font-bold">Undressing:</span> {params.undressing || 'Indep'} | <span className="font-bold">Dressing:</span> {params.dressing || 'Dep'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Health, Hearing & Cognitive Pre-requisites (3 Columns) */}
          <div className="grid grid-cols-3 border border-slate-400 text-[8.5px] divide-x divide-slate-400 bg-white">
            {/* General Health */}
            <div className="p-1.5 space-y-1">
              <span className="font-black text-slate-900 uppercase block border-b border-slate-300 pb-0.5 bg-slate-50 px-1 -mx-1.5 -mt-1.5">
                General Health
              </span>
              <p><span className="font-bold">Present status:</span> {params.presentHealthStatus || 'Good'}</p>
              <p><span className="font-bold">Illnesses/Injuries:</span> {params.childhoodIllnesses || 'None'}</p>
              <p><span className="font-bold">Accident/Fall:</span> {params.accidentFallHistory || 'No'}</p>
              <p><span className="font-bold">Convulsions:</span> {params.convulsionsHistory || 'No'} {params.convulsionsHistory === 'Yes' ? `(${params.convulsionsAgeStarted}, ${params.convulsionsFrequency})` : ''}</p>
              <p><span className="font-bold">Medications:</span> {params.presentMedications || 'None'}</p>
              <p><span className="font-bold">Vision:</span> {params.visionStatus || 'Normal'}</p>
              <p><span className="font-bold">Sleep / Breathing:</span> {params.sleepHabits || 'Good'} / {params.breathingPattern || 'Regular'}</p>
            </div>

            {/* Hearing */}
            <div className="p-1.5 space-y-1">
              <span className="font-black text-slate-900 uppercase block border-b border-slate-300 pb-0.5 bg-slate-50 px-1 -mx-1.5 -mt-1.5">
                Hearing
              </span>
              <p><span className="font-bold">Sound response as baby:</span> {params.responseToSoundBaby || 'Looking at source'}</p>
              <p><span className="font-bold">Feels child hears normally:</span> {params.feelsChildHearsNormally || 'Yes'}</p>
              <p><span className="font-bold">Responds to clapping:</span> {params.responseClapping || 'Yes'}</p>
              <p><span className="font-bold">Responds to loud sounds:</span> {params.responseLoudSounds || 'Yes'}</p>
              <p><span className="font-bold">Environmental sounds:</span> {params.responseEnvironmentalSounds || 'Yes'}</p>
              <p><span className="font-bold">Ear infection/discharge:</span> {params.earInfectionHistory || 'No'}</p>
              <p><span className="font-bold">Prior hearing test:</span> {params.priorHearingTest || 'Yes'} {params.priorHearingTestDetails ? `(${params.priorHearingTestDetails})` : ''}</p>
            </div>

            {/* Cognitive Pre-requisites */}
            <div className="p-1.5 space-y-1">
              <span className="font-black text-slate-900 uppercase block border-b border-slate-300 pb-0.5 bg-slate-50 px-1 -mx-1.5 -mt-1.5">
                Cognitive Pre-requisites
              </span>
              <p><span className="font-bold">Level of Attention:</span> {params.attentionLevel || 'Level 3 (2-3 yrs): Adult choice of activity'}</p>
              <p><span className="font-bold">Level of Intention:</span> {params.intentionLevel || 'Late intentional (12-18 mo)'}</p>
              <p><span className="font-bold">Play Development:</span> {params.playDevelopment || 'Relational & Self Pretend'}</p>
              <div className="border-t border-slate-200 pt-1 mt-1 text-[8px] text-slate-600">
                Play stages observed: Functional block stacking, pushing vehicles, feeding pretend toys.
              </div>
            </div>
          </div>

          {/* Early Language Foundations (Comprehension & Expression) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Language and Speech Development: Early Foundations
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-1.5">
              <div className="space-y-1 pr-2">
                <span className="font-black text-purple-950 uppercase block">Comprehension Foundations:</span>
                <p>• Responded to adult (cooing/smiling): <span className="font-bold">{params.ageRespondingToAdult || '3 months'}</span></p>
                <p>• Responds to tone of voice: <span className="font-bold">{params.respondToneOfVoice || 'Yes'}</span></p>
                <p>• Looks where parents look (Joint attention): <span className="font-bold">{params.jointAttention || 'Yes'}</span></p>
                <p>• Object permanence: <span className="font-bold">{params.objectPermanence || 'Yes'}</span></p>
              </div>

              <div className="space-y-1 pl-2">
                <span className="font-black text-purple-950 uppercase block">Present Communication Expression:</span>
                <p>• Modes used: <span className="font-bold">{params.communicationModes || 'Reaching, vocalizing, gestures, single words'}</span></p>
                <p>• Expressive Vocabulary: <span className="font-bold">{params.expressiveLexicalRepertoire || '15-20 functional words'}</span></p>
              </div>
            </div>
          </div>
        </div>

        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: LANGUAGE, SPEECH MILESTONES, BEHAVIOR, CONCEPTS & ORAL MECHANISM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-white text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0 print:h-[279mm] leading-tight">
        <div className="flex-1 flex flex-col space-y-2.5">
          {renderHeader(2)}

          {/* Title Banner */}
          <div className="text-center my-0.5">
            <span className="inline-block bg-[#0284c7] text-white font-black text-xs tracking-wider px-6 py-1 rounded-full uppercase shadow-2xs">
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
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">COMPREHENSION CHECKLIST</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <p>Understands gestures: <span className="font-bold">{params.understandsGestures || 'Yes'}</span></p>
                  <p>Family recognition: <span className="font-bold">{params.recognitionFamily || 'Yes'}</span></p>
                  <p>Words in context: <span className="font-bold">{params.respondsSingleWordContext || 'Yes'}</span></p>
                  <p>Points to pictures: <span className="font-bold">{params.pointsToPictures || 'Yes'}</span></p>
                  <p>1-stage commands: <span className="font-bold">{params.followsOneStageCommands || 'Yes'}</span></p>
                  <p>2-stage commands: <span className="font-bold">{params.followsTwoStageCommands || 'Inconsistent'}</span></p>
                  <p>Yes/No questions: <span className="font-bold">{params.answersYesNo || 'Emerging'}</span></p>
                  <p>Conversations: <span className="font-bold">{params.understandsConversations || 'Emerging'}</span></p>
                </div>
                <p className="pt-0.5 text-[8px] text-slate-600">Receptive Repertoire: {params.receptiveLexicalRepertoire || 'Household items, food, animals'}</p>
              </div>

              {/* Expression Checklist */}
              <div className="space-y-1 pl-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">EXPRESSION MODES &amp; OUTPUT</span>
                <p>• Communication Modes: <span className="font-semibold">{params.communicationModes || 'Reaching, vocalizing, Bye-bye gestures, single words'}</span></p>
                <p>• Expressive Vocabulary: <span className="font-semibold">{params.expressiveLexicalRepertoire || '15-20 single words (mama, papa, paani, ball, car)'}</span></p>
                <p>• Lexical Categories: Nouns (majority), social words (bye, hi), early verbs (de, aaja).</p>
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
                  <td className="p-1">{params.ageFirstSentence || 'Not yet attained'}</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1.5 grid grid-cols-3 divide-x divide-slate-300 text-[8px]">
              <p className="px-1"><span className="font-bold">Family Speech History:</span> {params.familySpeechHistory || 'None reported'}</p>
              <p className="px-1"><span className="font-bold">Talking Environment:</span> {params.talkingEnvironment || 'Yes'}</p>
              <p className="px-1"><span className="font-bold">Language(s):</span> {params.languageEnvironment || 'Bilingual'} ({params.preferredHomeLanguage || 'Marathi'})</p>
            </div>
          </div>

          {/* Social Interaction & Behavioral Profile */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Social Interaction &amp; Behavioral Profile
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-1.5">
              <div className="space-y-0.5 pr-2">
                <p><span className="font-bold">Engages in interaction:</span> {params.socialEngages || 'Yes'}</p>
                <p><span className="font-bold">Initiates interaction:</span> {params.socialInitiates || 'Yes'}</p>
                <p><span className="font-bold">Preference for familiar:</span> {params.socialFamiliarPreference || 'Yes'}</p>
                <p><span className="font-bold">Toy play / Peer play:</span> {params.playsWithToys || 'Yes'} / {params.playsWithChildren || 'Emerging parallel play'}</p>
              </div>
              <div className="space-y-0.5 pl-2">
                <p><span className="font-bold">Screen-time:</span> {params.screenTime || '1.5 - 2 hrs/day'}</p>
                <p><span className="font-bold">Temper tantrums:</span> {params.temperTantrums || 'Occasional'}</p>
                <p><span className="font-bold">Behavioral traits:</span> {params.behaviorRestlessStubborn || 'Mildly restless'}</p>
                <p><span className="font-bold">Likes / Dislikes:</span> {params.strongLikesDislikes || 'Likes cars; dislikes loud sounds'}</p>
              </div>
            </div>
          </div>

          {/* Concept Development (General, Colors, Objects) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Concept Development Matrix
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-400 p-1.5">
              <div>
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">GENERAL CONCEPTS</span>
                <p>• Money concept: {params.conceptMoney || 'No'}</p>
                <p>• Danger concept: {params.conceptDanger || 'Yes'}</p>
                <p>• Order by size: {params.orderSize || 'Emerging'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">COLOR CONCEPTS</span>
                <p>• Match colors: {params.colorMatching || 'Yes'}</p>
                <p>• Sort colors: {params.colorSorting || 'Emerging'}</p>
                <p>• Identify: {params.colorIdentification || 'Emerging'} | Name: {params.colorNaming || 'No'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-0.5">OBJECT CONCEPTS</span>
                <p>• Use by function: {params.objectUseFunction || 'Yes'}</p>
                <p>• Object matching: {params.objectObjectMatching || 'Yes'}</p>
                <p>• Picture matching: {params.objectPictureMatching || 'Yes'}</p>
              </div>
            </div>
          </div>

          {/* Examination of Oral Structures & Feeding */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Examination of Oral Structures &amp; Feeding Skills
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
                  <td className="p-1">{params.oralLips || 'Normal symmetry, intact vermilion border'}</td>
                  <td className="p-1">Adequate closure &amp; retraction</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">2. Tongue</td>
                  <td className="p-1">{params.oralTongue || 'Normal size, no ankyloglossia/tongue-tie'}</td>
                  <td className="p-1">Adequate elevation, protrusion &amp; lateralization</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">3. Palate</td>
                  <td className="p-1">{params.oralPalate || 'Intact hard and soft palate, normal arch'}</td>
                  <td className="p-1">Symmetrical velopharyngeal closure</td>
                </tr>
                <tr className="divide-x divide-slate-300">
                  <td className="p-1 font-bold">4. Teeth</td>
                  <td className="p-1">{params.oralTeeth || 'Primary dentition present, normal bite'}</td>
                  <td className="p-1">Adequate jaw stability</td>
                </tr>
              </tbody>
            </table>
            <div className="p-1.5 grid grid-cols-2 divide-x divide-slate-400 text-[8px]">
              <div>
                <span className="font-bold text-slate-900 block">Oral Skills:</span>
                Lip closure: {params.oralLipClosure || 'Adequate'} • Tongue posture: {params.oralTonguePosture || 'Normal'} • Blowing: {params.oralBlowing || 'Present'} • Sucking: {params.oralSuckingStraw || 'Present'}
              </div>
              <div className="pl-1.5">
                <span className="font-bold text-slate-900 block">Feeding:</span>
                Chewing: {params.feedingChewing || 'True chewing present'} • Rotary jaw: {params.feedingRotaryJaw || 'Established'} • Sustained bite: {params.feedingSustainedBite || 'Controlled'}
              </div>
            </div>
          </div>
        </div>

        {renderFooter(2)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: LITERACY, FORMAL TESTS, MULTIDISCIPLINARY REPORTS, DIAGNOSIS & PLAN
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-white text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0 print:h-[279mm] leading-tight">
        <div className="flex-1 flex flex-col space-y-2.5">
          {renderHeader(3)}

          {/* Title Banner */}
          <div className="text-center my-0.5">
            <span className="inline-block bg-[#0284c7] text-white font-black text-xs tracking-wider px-6 py-1 rounded-full uppercase shadow-2xs">
              EARLY DEVELOPMENTAL HISTORY — FORMAL TESTS &amp; CLINICAL FORMULATION
            </span>
          </div>

          {/* Literacy & School Details */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Literacy &amp; School Readiness
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-400 p-1.5">
              <div>
                <span className="font-bold text-slate-900 block">Reading:</span>
                <p>• Shapes: {params.readingShapes || 'Identifies circle & square'}</p>
                <p>• Numbers: {params.readingNumbers || 'Identifies 1 and 2'}</p>
                <p>• Letters: {params.readingLetters || 'Not introduced'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Writing:</span>
                <p>• Type of grip: <span className="font-bold text-purple-950">{params.writingGrip || 'Pincer'}</span></p>
                <p>• Scribbling: {params.writingScribbling || 'Present (spontaneous strokes)'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">School Details:</span>
                <p>{params.schoolDetails || 'Attends morning playgroup (3 days/week)'}</p>
              </div>
            </div>
          </div>

          {/* Formal Test Findings (REELS & Standardized Scales) */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Formal Test Findings: REELS &amp; Standardized Assessment
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-400 p-2">
              <div className="space-y-1">
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
                  * Clinical Language Delay: 12-month expressive delay with intact receptive competence.
                </p>
              </div>

              <div className="space-y-1 pl-2">
                <span className="font-bold text-purple-950 block border-b border-purple-200 pb-0.5">
                  Other Test Findings:
                </span>
                <p className="text-[8px] text-slate-700 leading-snug">
                  {params.otherFormalTests || 'CommDeall Developmental Checklist: Level II emerging; 3D LAT: Emerging phonology; Assessment of Language Development (ALD-MM): Age equivalent 18 months.'}
                </p>
              </div>
            </div>
          </div>

          {/* Multidisciplinary Reports Summary */}
          <div className="border border-slate-400 text-[8.5px] bg-white">
            <div className="bg-slate-100 p-1 px-2 border-b border-slate-400 font-bold uppercase text-slate-900">
              Summary of Findings of Multidisciplinary Reports
            </div>
            <div className="p-1.5 space-y-1">
              <p><span className="font-bold text-slate-900">1. Hearing Evaluation:</span> {params.summaryHearing || 'Bilateral normal hearing sensitivity confirmed via OAE and screening tympanometry.'}</p>
              <p><span className="font-bold text-slate-900">2. ENT Evaluation:</span> {params.summaryENT || 'External auditory canals clear; bilateral tympanic membranes intact with cone of light.'}</p>
              <p><span className="font-bold text-slate-900">3. Pediatric Review:</span> {params.summaryPediatric || 'Age-appropriate physical and somatic growth; milestones within 50th percentile.'}</p>
              <p><span className="font-bold text-slate-900">4. Neurology Review:</span> {params.summaryNeurology || 'No neurological deficits or epileptic phenomena reported.'}</p>
              <p><span className="font-bold text-slate-900">5. Psychological / Psycho-educational:</span> {params.summaryPsychological || 'Non-verbal cognitive potential within normal limits; good social intent.'}</p>
            </div>
          </div>

          {/* Summary of Speech & Language Evaluation */}
          <div className="border border-slate-400 bg-slate-50 p-2 text-[9px] space-y-1">
            <span className="font-black uppercase tracking-wide text-slate-900 block border-b border-slate-300 pb-0.5">
              Summary of Findings of Speech and Language Evaluation
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {params.speechLanguageSummary ||
                'Child demonstrates significant expressive language delay (18 months age equivalent) with age-adequate receptive language (28 months) at chronological age of 30 months (12-month expressive delay). Oral-peripheral mechanisms and hearing are within normal limits.'}
            </p>
          </div>

          {/* Provisional Diagnosis & Recommendations */}
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div className="border border-purple-300 bg-purple-50/40 p-2 rounded">
              <span className="font-black uppercase tracking-wide text-purple-950 block border-b border-purple-200 pb-0.5 mb-1">
                Provisional Diagnosis:
              </span>
              <div className="text-[8.5px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.provisionalDiagnosis,
                  '• Expressive Language Delay (ELD) secondary to environmental under-stimulation, with intact hearing and age-appropriate receptive abilities.',
                  'bg-purple-950'
                )}
              </div>
            </div>

            <div className="border border-emerald-300 bg-emerald-50/40 p-2 rounded">
              <span className="font-black uppercase tracking-wide text-emerald-950 block border-b border-emerald-200 pb-0.5 mb-1">
                Clinical Recommendations:
              </span>
              <div className="text-[8.5px] text-slate-900 font-medium">
                {renderBulletPoints(
                  params.recommendations,
                  '• Direct Speech-Language Therapy focusing on expressive vocabulary and phrase expansion.\n• Parent-Implemented Language Intervention (PILI) at home.\n• Screen-time elimination (<30 mins/day).\n• Audiological re-screening in 6 months.',
                  'bg-emerald-950'
                )}
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
