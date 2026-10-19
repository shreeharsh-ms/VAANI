import React, { useState } from 'react';
import {
  Baby,
  Activity,
  HeartPulse,
  Brain,
  MessageSquare,
  Users,
  Smile,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const EarlyDevelopmentalHistoryForm = ({
  formData,
  handleParamChange,
  handleNestedParamChange,
  notify,
}) => {
  const params = formData.parameters || {};

  // Presets
  const applyPreset = (presetKey) => {
    if (presetKey === 'sample') {
      const sampleCase = {
        informant: 'Mother (Mrs. Supriya Shinde)',
        informantContact: '+91 94220 44556',
        doa: '17/10/2026',
        chiefComplaint: 'Delayed speech and language onset, limited words, difficulty communicating needs.',
        motherHealthPrenatal: 'Good',
        prenatalIllnesses: 'None reported',
        prenatalMedications: 'Iron & Folic acid supplements',
        prenatalTrauma: 'No accidents, falls, or severe psychological trauma',
        prenatalXRays: 'None',
        prenatalAbortionMiscarriage: 'None',
        rhIncompatibility: 'No',
        consanguinity: 'Non-consanguineous marriage',
        prenatalNotes: 'Full-term uneventful pregnancy with regular checkups.',
        placeOfDelivery: 'Hospital',
        deliveryTerm: 'Full term (39 weeks)',
        conditionAtBirth: 'Normal',
        birthCry: 'Immediate',
        birthWeight: '3.1 kg',
        complicationsFirstTwoWeeks: 'None reported',
        feedingPostnatal: 'Breast fed',
        motorHeadUp: '3 months',
        motorReaching: '5 months',
        motorSitting: '6-7 months',
        motorCrawling: '8-9 months',
        motorStanding: '10-11 months',
        motorWalking: '12-13 months',
        toiletControlPartial: '2.5 Yrs',
        toiletControlComplete: '3.5 Yrs',
        handPreference: 'Right',
        undressing: 'Independent',
        dressing: 'Dependent',
        presentHealthStatus: 'Good',
        childhoodIllnesses: 'None (No measles, diphtheria, chickenpox, whooping cough)',
        accidentFallHistory: 'No',
        convulsionsHistory: 'No',
        convulsionsAgeStarted: '—',
        convulsionsFrequency: '—',
        presentMedications: 'None',
        visionStatus: 'Normal (fixes & follows binocularly)',
        sleepHabits: 'Good (8-9 hrs continuous night sleep)',
        breathingPattern: 'Regular nasal breathing',
        responseToSoundBaby: 'Looking at source of sound',
        feelsChildHearsNormally: 'Yes',
        hearingDoubtNotes: 'Good localization to voices and music',
        responseClapping: 'Yes',
        responseLoudSounds: 'Yes',
        responseEnvironmentalSounds: 'Yes',
        earInfectionHistory: 'No',
        earInfectionRecurrent: '—',
        priorHearingTest: 'Yes (Newborn OAE PASS bilaterally)',
        priorHearingTestDetails: 'OAE Screening completed at birth: Bilateral PASS.',
        attentionLevel: 'Level 3 (2-3 yrs): Attention to adult choice of activity',
        intentionLevel: 'Late intentional level (Between 12-18 months)',
        playDevelopment: 'Relational & Self Pretend (feeds doll, rolls car)',
        ageRespondingToAdult: '3 months (smiling & cooing)',
        respondToneOfVoice: 'Yes',
        jointAttention: 'Yes',
        objectPermanence: 'Yes',
        understandsGestures: 'Yes',
        recognitionFamily: 'Yes',
        respondsSingleWordContext: 'Yes',
        pointsToPictures: 'Yes',
        followsOneStageCommands: 'Yes (e.g. "Give ball", "Come here")',
        followsTwoStageCommands: 'Inconsistent (needs gestural cues)',
        answersYesNo: 'Emerging (nods/shakes head)',
        understandsConversations: 'Emerging (familiar routine phrases)',
        receptiveLexicalRepertoire: 'Common domestic items, food, animals, body parts',
        communicationModes: 'Reaching, vocalizing, Bye-Bye gestures, single words',
        expressiveLexicalRepertoire: '15-20 functional words (mama, papa, paani, dada, ball, car)',
        ageVocalPlay: '4-5 months',
        ageBabbling: '7-8 months',
        ageFirstWord: '14 months',
        ageFirstSentence: 'Not yet developed',
        familySpeechHistory: 'None reported',
        talkingEnvironment: 'Yes',
        languageEnvironment: 'Bilingual (Marathi & Hindi)',
        preferredHomeLanguage: 'Marathi',
        socialEngages: 'Yes',
        socialInitiates: 'Yes',
        socialFamiliarPreference: 'Yes',
        playsWithToys: 'Yes',
        playsAlone: 'Yes',
        playsWithChildren: 'Emerging (parallel play)',
        screenTime: '1.5 - 2 hrs/day (Smart TV cartoons)',
        temperTantrums: 'Mild (occasional when screen turned off)',
        behaviorRestlessStubborn: 'Mildly restless during non-preferred tabletop tasks',
        strongLikesDislikes: 'Likes: toy cars, rhythm rhymes. Dislikes: loud blender sounds.',
        behavioralIssuesNotes: 'Mild frustration when wants are misunderstood; no aggression.',
        conceptMoney: 'No',
        conceptDanger: 'Yes',
        orderSize: 'Emerging',
        colorMatching: 'Yes',
        colorSorting: 'Emerging',
        colorIdentification: 'Emerging',
        colorNaming: 'No',
        objectUseFunction: 'Yes (comb for hair, cup for drinking)',
        objectObjectMatching: 'Yes',
        objectRecognition: 'Yes',
        objectPictureMatching: 'Yes',
        oralLips: 'Normal symmetry, intact vermilion border, adequate lip seal',
        oralTongue: 'Normal size & shape, no ankyloglossia, free movement',
        oralPalate: 'Intact hard and soft palate, normal vault arch',
        oralTeeth: 'Complete primary dentition, normal bite',
        oralDefectNotes: 'Normal oral peripheral mechanism; no structural defects.',
        oralLipClosure: 'Adequate',
        oralTonguePosture: 'Normal intra-oral rest posture',
        oralBlowing: 'Present (blows bubbles & candles)',
        oralSpitting: 'Emerging',
        oralSuckingStraw: 'Present',
        oralSpoonFeeding: 'Independent',
        feedingTongueMovement: 'Normal front-to-back',
        feedingMunching: 'Present',
        feedingChewing: 'True chewing present (handles solid rotis, rice)',
        feedingLateralization: 'Present',
        feedingRotaryJaw: 'Established',
        feedingSustainedBite: 'Controlled',
        readingShapes: 'Identifies circle & square',
        readingNumbers: 'Identifies 1 and 2',
        readingLetters: 'Not introduced',
        writingGrip: 'Pincer grasp emerging',
        writingScribbling: 'Present (spontaneous strokes)',
        schoolDetails: 'Attends morning playgroup (3 days/week)',
        reelsComprehension: '28 months',
        reelsExpression: '18 months',
        reelsChronologicalAge: '30 months (2 yrs 6 mo)',
        otherFormalTests: 'ALD-MM Expressive Quotient: 60 (Moderate delay); 3D-LAT: Emerging phonology.',
        summaryHearing: 'Normal hearing sensitivity bilaterally confirmed via OAE and screening tympanometry.',
        summaryENT: 'Bilateral external auditory canals clear; tympanic membranes intact with cone of light.',
        summaryPediatric: 'Age-appropriate physical and somatic growth; milestones within 50th percentile.',
        summaryNeurology: 'No neurological deficits or epileptic phenomena reported.',
        summaryPsychological: 'Non-verbal cognitive potential within normal limits; good social intent.',
        speechLanguageSummary: 'Child demonstrates significant expressive language delay (18 months age equivalent) with age-adequate receptive language (28 months) at chronological age of 30 months (12-month expressive delay). Oral-peripheral mechanisms and hearing are within normal limits.',
        provisionalDiagnosis: '• Expressive Language Delay (ELD) secondary to environmental under-stimulation, with intact hearing and age-appropriate receptive abilities.',
        recommendations: '• Direct Speech-Language Therapy (2-3 sessions/week) focusing on expressive vocabulary, functional communication, and phrase generation.\n• Parent-Implemented Language Intervention (PILI) at home: dialogic shared reading and parallel-talk.\n• Screen-time elimination (<30 mins/day with active adult co-viewing).\n• Audiological re-screening in 6 months.',
      };
      Object.entries(sampleCase).forEach(([k, v]) => handleParamChange(k, v));
      notify?.success('Applied Clinic Reference Case: Expressive Language Delay');
    } else if (presetKey === 'typical') {
      const typical = {
        chiefComplaint: 'Routine developmental milestones review for school admission.',
        reelsComprehension: '30 months',
        reelsExpression: '30 months',
        reelsChronologicalAge: '30 months',
        ageFirstWord: '11-12 months',
        ageFirstSentence: '22-24 months',
        expressiveLexicalRepertoire: '150+ words with 2 to 3-word grammatically appropriate phrases',
        speechLanguageSummary: 'All developmental speech, language, motor, and cognitive milestones are age-appropriate.',
        provisionalDiagnosis: '• Normal Speech and Language Development within chronological age norms.',
        recommendations: '• Continue age-appropriate cognitive and linguistic enrichment.\n• Annual routine developmental checkup.',
      };
      Object.entries(typical).forEach(([k, v]) => handleParamChange(k, v));
      notify?.success('Applied Typical Development Preset');
    }
  };

  const EDH_SECTIONS = [
    { id: 'intake', label: '1. Informant & Chief Complaint', short: '1. Intake' },
    { id: 'birth', label: '2. Birth History & Motor', short: '2. Birth & Motor' },
    { id: 'health', label: '3. Medical Health & Hearing', short: '3. Health & Hearing' },
    { id: 'cognition', label: '4. Cognition & Play', short: '4. Cognition' },
    { id: 'language', label: '5. Speech & Language', short: '5. Speech & Lang' },
    { id: 'social', label: '6. Social & Behavior', short: '6. Social' },
    { id: 'oral', label: '7. Oral Motor & Feeding', short: '7. Oral Motor' },
    { id: 'tests', label: '8. Formal Tests (REELS)', short: '8. REELS' },
    { id: 'reports', label: '9. Multidisciplinary Summary', short: '9. Multi Reports' },
  ];

  const [activeTab, setActiveTab] = useState('intake');
  const [viewMode, setViewMode] = useState('steps'); // 'steps' | 'all'

  const currentSectionIdx = Math.max(0, EDH_SECTIONS.findIndex((s) => s.id === activeTab));
  const goToSection = (index) => {
    if (index >= 0 && index < EDH_SECTIONS.length) {
      setActiveTab(EDH_SECTIONS[index].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3 text-xs">
      {/* Top Presets & Step Navigation Bar */}
      <div className="p-2.5 sm:p-3 bg-teal-50/70 border border-teal-200 rounded-lg space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-200/60 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Baby className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="text-[11px] font-black text-teal-950 uppercase tracking-wide truncate">
              Early Developmental History (EDH) Form
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('sample')}
              className="px-2.5 py-1 text-[10.5px] font-bold text-teal-900 bg-white hover:bg-teal-100 border border-teal-300 rounded shadow-2xs transition-colors cursor-pointer"
            >
              ★ Clinic Reference Case (Expressive Delay)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('typical')}
              className="px-2.5 py-1 text-[10.5px] font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded shadow-2xs transition-colors cursor-pointer"
            >
              Typical Milestones
            </button>
          </div>
        </div>

        {/* Section Step Indicator & Toggle All */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wide bg-teal-100/90 px-1.5 py-0.5 rounded border border-teal-300 shrink-0">
              {viewMode === 'all' ? 'All Sections' : `Step ${currentSectionIdx + 1}/9`}
            </span>
            <span className="text-xs font-extrabold text-teal-950 truncate">
              {viewMode === 'all' ? 'Comprehensive Assessment View' : EDH_SECTIONS[currentSectionIdx]?.label}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'steps' ? 'all' : 'steps'))}
            className="text-[10px] font-bold px-2 py-0.5 rounded border border-teal-300 bg-white hover:bg-teal-100 text-teal-900 transition-colors cursor-pointer shrink-0"
          >
            {viewMode === 'steps' ? 'View All 9 Sections' : 'Switch to Step-by-Step'}
          </button>
        </div>

        {/* Section Tabs / Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {EDH_SECTIONS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTab(t.id);
                setViewMode('steps');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === t.id && viewMode === 'steps'
                  ? 'bg-teal-700 text-white shadow-2xs ring-1 ring-teal-800'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.short}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
              viewMode === 'all'
                ? 'bg-teal-700 text-white shadow-2xs ring-1 ring-teal-800'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* 0. INTAKE CONTEXT (Informant & Chief Complaint) */}
      {(viewMode === 'all' || activeTab === 'intake') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2.5 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
            1. Informant &amp; Chief Complaint
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 uppercase block mb-1">Informant</label>
              <input
                type="text"
                value={params.informant || ''}
                onChange={(e) => handleParamChange('informant', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[40px] sm:min-h-[36px] focus:ring-1 focus:ring-teal-500"
                placeholder="e.g. Mother (Mrs. Supriya Shinde)"
              />
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 uppercase block mb-1">Informant Contact</label>
              <input
                type="text"
                value={params.informantContact || ''}
                onChange={(e) => handleParamChange('informantContact', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-mono font-semibold border border-slate-300 rounded-md bg-white min-h-[40px] sm:min-h-[36px] focus:ring-1 focus:ring-teal-500"
                placeholder="e.g. +91 94220 44556"
              />
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 uppercase block mb-1">Date of Assessment (DOA)</label>
              <input
                type="text"
                value={params.doa || formData.reportDate}
                onChange={(e) => handleParamChange('doa', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[40px] sm:min-h-[36px] focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10.5px] font-bold text-slate-700 uppercase block mb-1">Chief Complaint *</label>
              <textarea
                rows={3}
                value={params.chiefComplaint || ''}
                onChange={(e) => handleParamChange('chiefComplaint', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs font-medium border border-slate-300 rounded-md bg-white min-h-[70px] focus:ring-1 focus:ring-teal-500 leading-relaxed"
                placeholder="Delayed speech and language onset, limited words, difficulty communicating needs..."
              />
            </div>
          </div>

          {/* Section 0 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-slate-400">Step 1 of 9</span>
              <button
                type="button"
                onClick={() => goToSection(1)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Birth History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 1. DETAILED BIRTH HISTORY (Prenatal, Natal, Postnatal & Motor) */}
      {(activeTab === 'all' || activeTab === 'birth') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <Baby className="w-3.5 h-3.5 text-teal-700" />
            1. Detailed Birth History &amp; Motor Development
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Prenatal */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Prenatal - Pregnancy
              </span>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Mother's health during pregnancy</label>
                <select
                  value={params.motherHealthPrenatal || 'Good'}
                  onChange={(e) => handleParamChange('motherHealthPrenatal', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Good">Good</option>
                  <option value="Normal">Normal</option>
                  <option value="Poor">Poor</option>
                  <option value="Complicated">Complicated</option>
                </select>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Any Illnesses</label>
                <input
                  type="text"
                  value={params.prenatalIllnesses || 'None reported'}
                  onChange={(e) => handleParamChange('prenatalIllnesses', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Medication(s)</label>
                <input
                  type="text"
                  value={params.prenatalMedications || 'Iron & Folic acid supplements'}
                  onChange={(e) => handleParamChange('prenatalMedications', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Trauma / Falls / Psychological</label>
                <input
                  type="text"
                  value={params.prenatalTrauma || 'No accidents or severe trauma'}
                  onChange={(e) => handleParamChange('prenatalTrauma', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Rh Incompat.</label>
                  <input
                    type="text"
                    value={params.rhIncompatibility || 'No'}
                    onChange={(e) => handleParamChange('rhIncompatibility', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Consanguinity</label>
                  <input
                    type="text"
                    value={params.consanguinity || 'Non-consanguineous'}
                    onChange={(e) => handleParamChange('consanguinity', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">H/O Abortion / Miscarriage</label>
                <input
                  type="text"
                  value={params.prenatalAbortionMiscarriage || 'None'}
                  onChange={(e) => handleParamChange('prenatalAbortionMiscarriage', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Natal */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Natal - Delivery
              </span>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Place of delivery</label>
                <select
                  value={params.placeOfDelivery || 'Hospital'}
                  onChange={(e) => handleParamChange('placeOfDelivery', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Hospital">Hospital</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Term / Gestation</label>
                  <input
                    type="text"
                    value={params.deliveryTerm || 'Full term (39 weeks)'}
                    onChange={(e) => handleParamChange('deliveryTerm', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Condition at birth</label>
                  <input
                    type="text"
                    value={params.conditionAtBirth || 'Normal'}
                    onChange={(e) => handleParamChange('conditionAtBirth', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                    placeholder="Normal / Jaundice / Blue baby"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Birth cry</label>
                  <select
                    value={params.birthCry || 'Immediate'}
                    onChange={(e) => handleParamChange('birthCry', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Birth weight</label>
                  <input
                    type="text"
                    value={params.birthWeight || '3.1 kg'}
                    onChange={(e) => handleParamChange('birthWeight', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Complications in first 2 weeks</label>
                <input
                  type="text"
                  value={params.complicationsFirstTwoWeeks || 'None reported'}
                  onChange={(e) => handleParamChange('complicationsFirstTwoWeeks', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Postnatal & Motor */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Postnatal &amp; Motor Milestones
              </span>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Feeding method</label>
                <input
                  type="text"
                  value={params.feedingPostnatal || 'Breast fed'}
                  onChange={(e) => handleParamChange('feedingPostnatal', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  placeholder="Breast fed / Bottle fed / Fed with spoon"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                <div>
                  <span className="text-slate-600 font-semibold block">Head up</span>
                  <input
                    type="text"
                    value={params.motorHeadUp || '3 mo'}
                    onChange={(e) => handleParamChange('motorHeadUp', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block">Reaching</span>
                  <input
                    type="text"
                    value={params.motorReaching || '5 mo'}
                    onChange={(e) => handleParamChange('motorReaching', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block">Sitting</span>
                  <input
                    type="text"
                    value={params.motorSitting || '6-7 mo'}
                    onChange={(e) => handleParamChange('motorSitting', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block">Crawling</span>
                  <input
                    type="text"
                    value={params.motorCrawling || '8-9 mo'}
                    onChange={(e) => handleParamChange('motorCrawling', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block">Standing</span>
                  <input
                    type="text"
                    value={params.motorStanding || '10-11 mo'}
                    onChange={(e) => handleParamChange('motorStanding', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-600 font-semibold block">Walking</span>
                  <input
                    type="text"
                    value={params.motorWalking || '12-13 mo'}
                    onChange={(e) => handleParamChange('motorWalking', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Toilet Control</label>
                  <input
                    type="text"
                    value={params.toiletControlPartial || '2.5 Yrs'}
                    onChange={(e) => handleParamChange('toiletControlPartial', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                    placeholder="Partial Yrs"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Hand Preference</label>
                  <select
                    value={params.handPreference || 'Right'}
                    onChange={(e) => handleParamChange('handPreference', e.target.value)}
                    className="w-full px-1.5 py-0.5 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Ambidextrous">Ambidextrous</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(0)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Intake</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(2)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Health & Hearing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. GENERAL HEALTH & HEARING */}
      {(activeTab === 'all' || activeTab === 'health') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
            2. General Health &amp; Auditory Responsiveness
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* General Health */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                General Health Status
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Present health status</label>
                  <select
                    value={params.presentHealthStatus || 'Good'}
                    onChange={(e) => handleParamChange('presentHealthStatus', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Good">Good</option>
                    <option value="Normal">Normal</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Accident / Fall</label>
                  <input
                    type="text"
                    value={params.accidentFallHistory || 'No'}
                    onChange={(e) => handleParamChange('accidentFallHistory', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Childhood Illnesses / Injuries</label>
                <input
                  type="text"
                  value={params.childhoodIllnesses || 'None (No measles, diphtheria, chickenpox)'}
                  onChange={(e) => handleParamChange('childhoodIllnesses', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Convulsions / Seizures</label>
                  <input
                    type="text"
                    value={params.convulsionsHistory || 'No'}
                    onChange={(e) => handleParamChange('convulsionsHistory', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                    placeholder="Yes / No (Age, freq)"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Vision</label>
                  <input
                    type="text"
                    value={params.visionStatus || 'Normal'}
                    onChange={(e) => handleParamChange('visionStatus', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Sleep Habits</label>
                  <input
                    type="text"
                    value={params.sleepHabits || 'Good'}
                    onChange={(e) => handleParamChange('sleepHabits', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Breathing</label>
                  <input
                    type="text"
                    value={params.breathingPattern || 'Regular'}
                    onChange={(e) => handleParamChange('breathingPattern', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                    placeholder="Regular / Noisy / Mouth"
                  />
                </div>
              </div>
            </div>

            {/* Hearing */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Auditory Function &amp; Responsiveness
              </span>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Sound response as baby</label>
                <input
                  type="text"
                  value={params.responseToSoundBaby || 'Looking at source of sound'}
                  onChange={(e) => handleParamChange('responseToSoundBaby', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  placeholder="Startle / Looking at source / Did not respond"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Hears normally</label>
                  <input
                    type="text"
                    value={params.feelsChildHearsNormally || 'Yes'}
                    onChange={(e) => handleParamChange('feelsChildHearsNormally', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Clapping resp.</label>
                  <input
                    type="text"
                    value={params.responseClapping || 'Yes'}
                    onChange={(e) => handleParamChange('responseClapping', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Loud sounds</label>
                  <input
                    type="text"
                    value={params.responseLoudSounds || 'Yes'}
                    onChange={(e) => handleParamChange('responseLoudSounds', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Ear discharge / infection</label>
                  <input
                    type="text"
                    value={params.earInfectionHistory || 'No'}
                    onChange={(e) => handleParamChange('earInfectionHistory', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Prior Hearing Test</label>
                  <input
                    type="text"
                    value={params.priorHearingTest || 'Yes (OAE Pass)'}
                    onChange={(e) => handleParamChange('priorHearingTest', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-600 block">Hearing Test Details</label>
                <input
                  type="text"
                  value={params.priorHearingTestDetails || 'OAE Screening completed at birth: Bilateral PASS.'}
                  onChange={(e) => handleParamChange('priorHearingTestDetails', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(1)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Birth History</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(3)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Cognition & Play</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. COGNITIVE PRE-REQUISITES & PLAY */}
      {(activeTab === 'all' || activeTab === 'cognition') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <Brain className="w-3.5 h-3.5 text-teal-700" />
            3. Cognitive Pre-requisites &amp; Play Development
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                Levels of Attention (Levels 1 - 6)
              </label>
              <select
                value={params.attentionLevel || 'Level 3 (2-3 yrs): Attention to adult choice of activity'}
                onChange={(e) => handleParamChange('attentionLevel', e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50 text-xs font-medium"
              >
                <option value="Level 1 (0-1 yr): Can pay only fleeting attention">Level 1 (0-1 yr): Fleeting attention</option>
                <option value="Level 2 (1-2 yrs): Attention to own choice of activity">Level 2 (1-2 yrs): Own choice of activity</option>
                <option value="Level 3 (2-3 yrs): Attention to adult choice of activity">Level 3 (2-3 yrs): Adult choice of activity</option>
                <option value="Level 4 (3-4 yrs): Can shift attention between task and adult">Level 4 (3-4 yrs): Shifts attention task/adult</option>
                <option value="Level 5 (4-5 yrs): Integrated attention for short spells">Level 5 (4-5 yrs): Integrated short spells</option>
                <option value="Level 6 (5-6 yrs): Integrated attention. Internalizes language">Level 6 (5-6 yrs): Full integrated attention</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                Level of Intention
              </label>
              <select
                value={params.intentionLevel || 'Late intentional level (Between 12-18 months)'}
                onChange={(e) => handleParamChange('intentionLevel', e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50 text-xs font-medium"
              >
                <option value="Pre intentional level (Up to 8 months)">Pre-intentional (Up to 8 mo)</option>
                <option value="Early intentional level (Between 8-12 months)">Early intentional (8-12 mo)</option>
                <option value="Late intentional level (Between 12-18 months)">Late intentional (12-18 mo)</option>
                <option value="Representational level (18 months and above)">Representational (18 mo+)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
                Play Development Stages
              </label>
              <input
                type="text"
                value={params.playDevelopment || 'Relational & Self Pretend (feeds doll, rolls car)'}
                onChange={(e) => handleParamChange('playDevelopment', e.target.value)}
                className="w-full px-2 py-1.5 border border-slate-300 rounded bg-slate-50 text-xs"
                placeholder="Exploratory / Relational / Self Pretend / De-centered / Sequence"
              />
            </div>
          </div>

          {/* Section 3 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(2)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Health & Hearing</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(4)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Speech & Language</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. LANGUAGE & SPEECH DEVELOPMENT */}
      {(activeTab === 'all' || activeTab === 'language') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
            4. Language &amp; Speech Development (Comprehension &amp; Expression)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Comprehension Checklist */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Comprehension Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Understands gestures</label>
                  <input
                    type="text"
                    value={params.understandsGestures || 'Yes'}
                    onChange={(e) => handleParamChange('understandsGestures', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Family recognition</label>
                  <input
                    type="text"
                    value={params.recognitionFamily || 'Yes'}
                    onChange={(e) => handleParamChange('recognitionFamily', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Single words in context</label>
                  <input
                    type="text"
                    value={params.respondsSingleWordContext || 'Yes'}
                    onChange={(e) => handleParamChange('respondsSingleWordContext', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Points to pictures</label>
                  <input
                    type="text"
                    value={params.pointsToPictures || 'Yes'}
                    onChange={(e) => handleParamChange('pointsToPictures', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">1-stage commands</label>
                  <input
                    type="text"
                    value={params.followsOneStageCommands || 'Yes'}
                    onChange={(e) => handleParamChange('followsOneStageCommands', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">2-stage commands</label>
                  <input
                    type="text"
                    value={params.followsTwoStageCommands || 'Inconsistent'}
                    onChange={(e) => handleParamChange('followsTwoStageCommands', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Yes/No questions</label>
                  <input
                    type="text"
                    value={params.answersYesNo || 'Emerging'}
                    onChange={(e) => handleParamChange('answersYesNo', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Conversations</label>
                  <input
                    type="text"
                    value={params.understandsConversations || 'Emerging'}
                    onChange={(e) => handleParamChange('understandsConversations', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Receptive Lexical Repertoire</label>
                <input
                  type="text"
                  value={params.receptiveLexicalRepertoire || 'Domestic objects, animals, food, body parts'}
                  onChange={(e) => handleParamChange('receptiveLexicalRepertoire', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Expression & Speech Milestones */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Expression &amp; Milestone Ages
              </span>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Present Modes of Communication</label>
                <input
                  type="text"
                  value={params.communicationModes || 'Reaching, vocalizing, Bye-bye gestures, single words'}
                  onChange={(e) => handleParamChange('communicationModes', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  placeholder="Crying / Gestures / Babbling / Words / Sentences"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Expressive Vocabulary &amp; Words</label>
                <input
                  type="text"
                  value={params.expressiveLexicalRepertoire || '15-20 functional words (mama, papa, paani, ball, car)'}
                  onChange={(e) => handleParamChange('expressiveLexicalRepertoire', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-200 text-center">
                <div>
                  <span className="text-[9px] font-bold text-slate-600 block">Vocal Play</span>
                  <input
                    type="text"
                    value={params.ageVocalPlay || '4-5 mo'}
                    onChange={(e) => handleParamChange('ageVocalPlay', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-600 block">Babbling</span>
                  <input
                    type="text"
                    value={params.ageBabbling || '7-8 mo'}
                    onChange={(e) => handleParamChange('ageBabbling', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-600 block">First Word</span>
                  <input
                    type="text"
                    value={params.ageFirstWord || '14 mo'}
                    onChange={(e) => handleParamChange('ageFirstWord', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-600 block">First Sentence</span>
                  <input
                    type="text"
                    value={params.ageFirstSentence || 'Not yet'}
                    onChange={(e) => handleParamChange('ageFirstSentence', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs font-mono text-rose-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">Language Environment</label>
                  <input
                    type="text"
                    value={params.languageEnvironment || 'Bilingual (Marathi & Hindi)'}
                    onChange={(e) => handleParamChange('languageEnvironment', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">Preferred Home Language</label>
                  <input
                    type="text"
                    value={params.preferredHomeLanguage || 'Marathi'}
                    onChange={(e) => handleParamChange('preferredHomeLanguage', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(3)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Cognition</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(5)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Social & Concepts</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. SOCIAL INTERACTION, BEHAVIOR & CONCEPTS */}
      {(activeTab === 'all' || activeTab === 'social') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <Users className="w-3.5 h-3.5 text-teal-700" />
            5. Social Interaction, Behavioral Profile &amp; Concept Development
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Social & Behavioral */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Social &amp; Behavioral Profile
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Engages / Initiates</label>
                  <input
                    type="text"
                    value={params.socialEngages || 'Yes'}
                    onChange={(e) => handleParamChange('socialEngages', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Plays with peers</label>
                  <input
                    type="text"
                    value={params.playsWithChildren || 'Emerging parallel play'}
                    onChange={(e) => handleParamChange('playsWithChildren', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">Screen-time (hrs/day)</label>
                  <input
                    type="text"
                    value={params.screenTime || '1.5 - 2 hrs/day'}
                    onChange={(e) => handleParamChange('screenTime', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500 font-mono text-purple-950 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">Temper tantrums</label>
                  <input
                    type="text"
                    value={params.temperTantrums || 'Occasional'}
                    onChange={(e) => handleParamChange('temperTantrums', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Behavioral Traits / Challenges</label>
                <input
                  type="text"
                  value={params.behaviorRestlessStubborn || 'Mildly restless during non-preferred tabletop tasks'}
                  onChange={(e) => handleParamChange('behaviorRestlessStubborn', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  placeholder="Restless / Cranky / Stubborn / Hyperactive / None"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Child's Strong Likes / Dislikes</label>
                <input
                  type="text"
                  value={params.strongLikesDislikes || 'Likes cars & block toys; dislikes loud blender'}
                  onChange={(e) => handleParamChange('strongLikesDislikes', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Concepts */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Cognitive Concepts (General, Colors, Objects)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Money Concept</label>
                  <input
                    type="text"
                    value={params.conceptMoney || 'No'}
                    onChange={(e) => handleParamChange('conceptMoney', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Danger Concept</label>
                  <input
                    type="text"
                    value={params.conceptDanger || 'Yes'}
                    onChange={(e) => handleParamChange('conceptDanger', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-semibold text-slate-700 block">Order by Size</label>
                  <input
                    type="text"
                    value={params.orderSize || 'Emerging'}
                    onChange={(e) => handleParamChange('orderSize', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-200 text-center">
                <div>
                  <span className="text-[8.5px] font-bold text-slate-600 block">Color Match</span>
                  <input
                    type="text"
                    value={params.colorMatching || 'Yes'}
                    onChange={(e) => handleParamChange('colorMatching', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-600 block">Color Sort</span>
                  <input
                    type="text"
                    value={params.colorSorting || 'Emerging'}
                    onChange={(e) => handleParamChange('colorSorting', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-600 block">Identify Color</span>
                  <input
                    type="text"
                    value={params.colorIdentification || 'Emerging'}
                    onChange={(e) => handleParamChange('colorIdentification', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <span className="text-[8.5px] font-bold text-slate-600 block">Name Color</span>
                  <input
                    type="text"
                    value={params.colorNaming || 'No'}
                    onChange={(e) => handleParamChange('colorNaming', e.target.value)}
                    className="w-full px-1 py-1 text-center border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">Object Concepts (Function, Match, Picture)</label>
                <input
                  type="text"
                  value={params.objectUseFunction || 'Uses cup for drinking, comb for hair; matches picture to object'}
                  onChange={(e) => handleParamChange('objectUseFunction', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(4)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Speech & Lang</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(6)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Oral Motor & Feeding</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. ORAL STRUCTURES, ORAL MOTOR & FEEDING */}
      {(activeTab === 'all' || activeTab === 'oral') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <Smile className="w-3.5 h-3.5 text-teal-700" />
            6. Examination of Oral Structures, Oral Motor Skills &amp; Feeding
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Oral Structures */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Oral Peripheral Structures
              </span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">1. Lips (Appearance &amp; Movement)</label>
                  <input
                    type="text"
                    value={params.oralLips || 'Normal symmetry, intact vermilion border, adequate lip seal'}
                    onChange={(e) => handleParamChange('oralLips', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">2. Tongue</label>
                  <input
                    type="text"
                    value={params.oralTongue || 'Normal size, no ankyloglossia, free movement in all planes'}
                    onChange={(e) => handleParamChange('oralTongue', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">3. Palate</label>
                  <input
                    type="text"
                    value={params.oralPalate || 'Intact hard and soft palate, symmetrical velar elevation'}
                    onChange={(e) => handleParamChange('oralPalate', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">4. Teeth</label>
                  <input
                    type="text"
                    value={params.oralTeeth || 'Complete primary dentition, normal bite'}
                    onChange={(e) => handleParamChange('oralTeeth', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Oral Motor Skills & Feeding */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Oral Developmental Skills &amp; Feeding
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Lip closure</label>
                  <input
                    type="text"
                    value={params.oralLipClosure || 'Adequate'}
                    onChange={(e) => handleParamChange('oralLipClosure', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Blowing / Bubbles</label>
                  <input
                    type="text"
                    value={params.oralBlowing || 'Present'}
                    onChange={(e) => handleParamChange('oralBlowing', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Straw sucking</label>
                  <input
                    type="text"
                    value={params.oralSuckingStraw || 'Present'}
                    onChange={(e) => handleParamChange('oralSuckingStraw', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Spoon feeding</label>
                  <input
                    type="text"
                    value={params.oralSpoonFeeding || 'Independent'}
                    onChange={(e) => handleParamChange('oralSpoonFeeding', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">True Chewing</label>
                  <input
                    type="text"
                    value={params.feedingChewing || 'Present (solid rotis, rice)'}
                    onChange={(e) => handleParamChange('feedingChewing', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Rotary jaw / Bite</label>
                  <input
                    type="text"
                    value={params.feedingRotaryJaw || 'Established'}
                    onChange={(e) => handleParamChange('feedingRotaryJaw', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(5)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Social</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(7)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Formal Tests (REELS)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. LITERACY & FORMAL TESTS (REELS) */}
      {(activeTab === 'all' || activeTab === 'tests') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            7. Literacy Readiness &amp; Standardized Formal Test Findings (REELS)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Literacy & School */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-[10.5px] uppercase block border-b border-slate-200 pb-0.5">
                Literacy &amp; School Details
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Reading Shapes</label>
                  <input
                    type="text"
                    value={params.readingShapes || 'Identifies circle & square'}
                    onChange={(e) => handleParamChange('readingShapes', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Reading Numbers</label>
                  <input
                    type="text"
                    value={params.readingNumbers || 'Identifies 1 and 2'}
                    onChange={(e) => handleParamChange('readingNumbers', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Writing Grip</label>
                  <select
                    value={params.writingGrip || 'Pincer'}
                    onChange={(e) => handleParamChange('writingGrip', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500 font-bold text-purple-950"
                  >
                    <option value="Pincer">Pincer Grip</option>
                    <option value="Palmer">Palmar Grip</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-600 block">Scribbling</label>
                  <input
                    type="text"
                    value={params.writingScribbling || 'Present'}
                    onChange={(e) => handleParamChange('writingScribbling', e.target.value)}
                    className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-slate-700 block">School / Playgroup Details</label>
                <input
                  type="text"
                  value={params.schoolDetails || 'Attends morning playgroup (3 days/week)'}
                  onChange={(e) => handleParamChange('schoolDetails', e.target.value)}
                  className="w-full px-3 py-2 sm:py-1.5 text-sm sm:text-xs font-semibold border border-slate-300 rounded-md bg-white min-h-[38px] sm:min-h-[34px] focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* REELS Scores */}
            <div className="p-2.5 bg-purple-50/50 border border-purple-200 rounded space-y-2">
              <span className="font-bold text-purple-950 text-[10.5px] uppercase block border-b border-purple-200 pb-0.5">
                REELS Results (Months)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-purple-900 block">Comprehension</label>
                  <input
                    type="text"
                    value={params.reelsComprehension || '28 months'}
                    onChange={(e) => handleParamChange('reelsComprehension', e.target.value)}
                    className="w-full px-2 py-1 text-center font-bold text-purple-950 border border-purple-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-rose-800 block">Expression</label>
                  <input
                    type="text"
                    value={params.reelsExpression || '18 months'}
                    onChange={(e) => handleParamChange('reelsExpression', e.target.value)}
                    className="w-full px-2 py-1 text-center font-bold text-rose-800 border border-rose-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-slate-700 block">Chronological Age</label>
                  <input
                    type="text"
                    value={params.reelsChronologicalAge || '30 months (2 yrs 6 mo)'}
                    onChange={(e) => handleParamChange('reelsChronologicalAge', e.target.value)}
                    className="w-full px-2 py-1 text-center font-bold text-slate-800 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-purple-950 block">Other Test Findings (CommDeall, ALD, 3D-LAT)</label>
                <input
                  type="text"
                  value={params.otherFormalTests || 'CommDeall Developmental Checklist: Level II; ALD-MM: Expressive Quotient 60.'}
                  onChange={(e) => handleParamChange('otherFormalTests', e.target.value)}
                  className="w-full px-2 py-1 border border-purple-200 rounded bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 7 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToSection(6)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Oral Motor</span>
              </button>
              <button
                type="button"
                onClick={() => goToSection(8)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all cursor-pointer shadow-2xs touch-manipulation active:scale-95 ml-auto"
              >
                <span>Next: Multidisciplinary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 8. MULTIDISCIPLINARY REPORTS & CLINICAL SUMMARY */}
      {(activeTab === 'all' || activeTab === 'reports') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3 shadow-2xs">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-1">
            <Activity className="w-3.5 h-3.5 text-teal-700" />
            8. Multidisciplinary Findings &amp; Speech-Language Evaluation Summary
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[9.5px] font-bold text-slate-700 block">1. Hearing Evaluation</label>
              <input
                type="text"
                value={params.summaryHearing || 'Bilateral normal hearing sensitivity confirmed via OAE & tympanometry.'}
                onChange={(e) => handleParamChange('summaryHearing', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[9.5px] font-bold text-slate-700 block">2. ENT Evaluation</label>
              <input
                type="text"
                value={params.summaryENT || 'EAC clear; bilateral tympanic membranes intact.'}
                onChange={(e) => handleParamChange('summaryENT', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[9.5px] font-bold text-slate-700 block">3. Pediatric Review</label>
              <input
                type="text"
                value={params.summaryPediatric || 'Age-appropriate physical and somatic growth (50th percentile).'}
                onChange={(e) => handleParamChange('summaryPediatric', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[9.5px] font-bold text-slate-700 block">4. Neurology Review</label>
              <input
                type="text"
                value={params.summaryNeurology || 'No neurological deficits or epileptic phenomena reported.'}
                onChange={(e) => handleParamChange('summaryNeurology', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[9.5px] font-bold text-slate-700 block">5. Psychological / Psycho-educational</label>
              <input
                type="text"
                value={params.summaryPsychological || 'Non-verbal cognitive potential within normal limits; good social intent.'}
                onChange={(e) => handleParamChange('summaryPsychological', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase block mb-1">
              Summary of Findings of Speech and Language Evaluation
            </label>
            <textarea
              rows={3}
              value={params.speechLanguageSummary || ''}
              onChange={(e) => handleParamChange('speechLanguageSummary', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-xs font-medium border border-slate-300 rounded-md bg-white min-h-[70px] focus:ring-1 focus:ring-teal-500 leading-relaxed font-sans"
              placeholder="Child demonstrates significant expressive language delay (18 months age equivalent) with age-adequate receptive language..."
            />
          </div>

          {/* Section 8 Stepper Footer */}
          {viewMode === 'steps' && (
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => goToSection(7)}
                className="inline-flex items-center gap-1 h-8.5 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer touch-manipulation active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev: Formal Tests</span>
              </button>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 9 Sections Complete!</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EarlyDevelopmentalHistoryForm;
