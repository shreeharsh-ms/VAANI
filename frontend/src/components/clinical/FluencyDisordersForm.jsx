import React, { useState } from 'react';
import {
  Activity,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Volume2,
  Wind,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const FluencyDisordersForm = ({
  formData,
  handleParamChange,
  notify,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const params = formData.parameters || {};

  // Preset loaders
  const applyPreset = (presetKey) => {
    if (presetKey === 'sample') {
      const sampleCase = {
        readerType: 'Conversational & Text Reader',
        speakingTask: 'Spontaneous Conversational Speech & Standardized Passage Reading',
        informant: 'Self & Parents',
        languageSpoken: 'Marathi, Hindi, English',
        speechDevelopment: 'Normal',
        speechDevelopmentDetails: 'Normal speech and language milestones until age 3.5 years',
        handedness: 'Right',
        handednessChangeAttempt: 'No',
        problemOnset: 'Gradual',
        ageOfOnset: '3.5 Years',
        noticedBy: 'Parents & Class Teacher',
        patientAwarenessAge: '5.0 Years',
        probableCause: 'Family history & imitation of peer in pre-school',
        familyHistory: 'Paternal uncle had childhood stuttering which resolved in late adolescence',
        problemCourse: 'Fluctuating with progressive increase in social settings',
        reportedSeverity: 'Moderate',
        observedSeverity: 'Moderate',
        fearedSoundsWords: 'Initial plosives /p, b, k, t/, stating own name, answering attendance, asking questions',
        stutteringLeastWith: 'Parents at home, singing, whispering, talking alone, talking to family pet',
        stutteringSevereWith: 'Strangers, authority figures, phone calls, oral presentations, classroom reading',
        reactionHurry: 'Yes',
        reactionStopRetry: 'Yes',
        reactionStopSpeaking: 'Yes',
        reactionBreathlessness: 'Yes',
        reactionExhaustion: 'Yes',
        reactionPainAbdomen: 'No',
        reactionOther: 'Facial blushing, clenching fists',
        concomitantTremorHands: 'No',
        concomitantTongueThrust: 'Yes',
        concomitantBlinking: 'Yes',
        concomitantFacialMovements: 'Yes',
        concomitantHeadNodding: 'Yes',
        concomitantHandMovements: 'Yes',
        concomitantLegThumping: 'No',
        concomitantOther: 'Shoulder elevation, jaw tightness',
        occurrenceSentenceBeginning: 'Yes',
        occurrenceAfterPause: 'Yes',
        occurrencePostponementDevice: 'Yes',
        occurrenceGivesRelief: 'Yes',
        languageDifferenceCoping: 'Yes',
        languageDifferenceDetails: 'Higher dysfluencies observed in English (L2) compared to Marathi (L1)',
        copingReported: 'Pausing, deep inhalation, asking parents to speak on behalf',
        copingObserved: 'Circumlocution, starter phrases ("um", "actually"), word substitution',
        lookAtListener: 'No',
        listenerReactionTriggers: 'Interruption, Questioning, Teasing, Impatience',
        anticipateStuttering: 'Yes',
        avoidStuttering: 'Yes',
        avoidanceMethods: 'Word substitution, pretending not to know answer, avoiding phone calls',
        sampleSpeakingProlongations: 8,
        sampleReadingProlongations: 4,
        sampleSpeakingRepetitions: 18,
        sampleReadingRepetitions: 10,
        sampleSpeakingHesitations: 12,
        sampleReadingHesitations: 6,
        sampleSpeakingBlocks: 9,
        sampleReadingBlocks: 5,
        sampleSpeakingDysfluencyPct: 9.4,
        sampleReadingDysfluencyPct: 6.2,
        totalSyllables: 500,
        stutteredSyllables: 47,
        percentageSS: 9.4,
        longestBlock1: 2.8,
        longestBlock2: 2.1,
        longestBlock3: 1.9,
        voiceFeatures: 'Tremulous phonation during tense blocks, pitch breaks, vocal tension',
        breathingTalksAfterBreathingOut: 'Yes',
        breathingShortRapid: 'Yes',
        breathingShallow: 'Yes',
        breathingManyWordsInOneBreath: 'Yes',
        breathingOther: 'Clavicular thoracic breathing pattern prior to phonation onset',
        psiScore: 'Struggle: 8 | Avoidance: 7 | Expectancy: 6 (Total: 21 - Moderate)',
        hearingScreening: 'Bilateral PASS (Pure Tone Audiometry within normal limits bilaterally)',
        apdTesting: 'Not indicated; auditory processing within normal limits',
        articulationProblem: 'No',
        patResultSummary: 'Photo Articulation Test (PAT): Age-appropriate phonetic repertoire, no articulatory errors',
        ssiFrequencyScore: 14,
        ssiDurationScore: 8,
        ssiPhysicalScore: 6,
        ssiTotalScore: 28,
        ssiPercentile: '61st - 77th Percentile',
        severityClassification: 'MODERATE',
        selfRatingQuestionnaire: 'OASES-S: Overall Impact Score 2.84 (Moderate Impact); Erickson S-24: Score 14',
        sampleRecordedDate: '17/10/2026',
        sampleRecordedReference: 'Sony Digital Voice Recorder ICD-UX570 / WAV 24-bit (REF: FLU-REC-2026-088)',
        clinicianName: 'A. Kulkarni (Clinical Intern)',
        supervisorName: 'ASLP Palak Paresh Gandhi, BASLP, RCI',
      };
      Object.entries(sampleCase).forEach(([key, val]) => handleParamChange(key, val));
      notify?.('Loaded Moderate Stuttering Assessment Case Preset', 'success');
    } else if (presetKey === 'mild') {
      const mildCase = {
        readerType: 'Conversational & Text Reader',
        speakingTask: 'Conversational Speech & Story Retell',
        informant: 'Self',
        languageSpoken: 'Marathi, Hindi',
        speechDevelopment: 'Normal',
        speechDevelopmentDetails: 'All developmental milestones age-appropriate',
        handedness: 'Right',
        handednessChangeAttempt: 'No',
        problemOnset: 'Gradual',
        ageOfOnset: '4.0 Years',
        noticedBy: 'Self & Parents',
        patientAwarenessAge: '6.0 Years',
        probableCause: 'Academic performance anxiety',
        familyHistory: 'Nil reported',
        problemCourse: 'Fluctuating (worse during exams)',
        reportedSeverity: 'Mild',
        observedSeverity: 'Mild',
        fearedSoundsWords: 'Vowel-initial phrases, speaking before strangers',
        stutteringLeastWith: 'Close friends, family at home, reading silently',
        stutteringSevereWith: 'Viva examinations, group presentations',
        reactionHurry: 'Yes',
        reactionStopRetry: 'Yes',
        reactionStopSpeaking: 'No',
        reactionBreathlessness: 'No',
        reactionExhaustion: 'No',
        reactionPainAbdomen: 'No',
        reactionOther: 'Mild throat clearing',
        concomitantTremorHands: 'No',
        concomitantTongueThrust: 'No',
        concomitantBlinking: 'Yes',
        concomitantFacialMovements: 'No',
        concomitantHeadNodding: 'No',
        concomitantHandMovements: 'No',
        concomitantLegThumping: 'No',
        concomitantOther: 'Minimal eyebrow furrowing',
        occurrenceSentenceBeginning: 'Yes',
        occurrenceAfterPause: 'No',
        occurrencePostponementDevice: 'Yes',
        occurrenceGivesRelief: 'Yes',
        languageDifferenceCoping: 'No',
        languageDifferenceDetails: 'Comparable dysfluencies across Marathi and Hindi',
        copingReported: 'Slow speech rate, pauses',
        copingObserved: 'Interjections ("um", "matlab")',
        lookAtListener: 'Yes',
        listenerReactionTriggers: 'Impatience, Interruption',
        anticipateStuttering: 'Yes',
        avoidStuttering: 'No',
        avoidanceMethods: 'Minimal; tries to push through dysfluencies',
        sampleSpeakingProlongations: 3,
        sampleReadingProlongations: 1,
        sampleSpeakingRepetitions: 8,
        sampleReadingRepetitions: 4,
        sampleSpeakingHesitations: 5,
        sampleReadingHesitations: 2,
        sampleSpeakingBlocks: 2,
        sampleReadingBlocks: 1,
        sampleSpeakingDysfluencyPct: 4.2,
        sampleReadingDysfluencyPct: 2.8,
        totalSyllables: 450,
        stutteredSyllables: 19,
        percentageSS: 4.2,
        longestBlock1: 1.2,
        longestBlock2: 0.9,
        longestBlock3: 0.8,
        voiceFeatures: 'Normal pitch and loudness, mild vocal tension at phrase onset',
        breathingTalksAfterBreathingOut: 'No',
        breathingShortRapid: 'No',
        breathingShallow: 'No',
        breathingManyWordsInOneBreath: 'Yes',
        breathingOther: 'Adequate diaphragmatic support during conversational speech',
        psiScore: 'Struggle: 3 | Avoidance: 3 | Expectancy: 4 (Total: 10 - Mild)',
        hearingScreening: 'Bilateral PASS (Normal hearing thresholds bilaterally)',
        apdTesting: 'Not indicated',
        articulationProblem: 'No',
        patResultSummary: 'Photo Articulation Test: 100% accurate',
        ssiFrequencyScore: 8,
        ssiDurationScore: 4,
        ssiPhysicalScore: 2,
        ssiTotalScore: 14,
        ssiPercentile: '12th - 23rd Percentile',
        severityClassification: 'MILD',
        selfRatingQuestionnaire: 'OASES-A: Overall Impact Score 1.72 (Mild Impact)',
        sampleRecordedDate: '17/10/2026',
        sampleRecordedReference: 'Audio Ref: FLU-2026-MILD-014',
        clinicianName: 'A. Kulkarni (Clinical Intern)',
        supervisorName: 'ASLP Palak Paresh Gandhi, BASLP, RCI',
      };
      Object.entries(mildCase).forEach(([key, val]) => handleParamChange(key, val));
      notify?.('Loaded Mild Fluency Case Preset', 'success');
    }
  };

  // Recalculate SSI total automatically
  const handleSSIScoreChange = (field, val) => {
    const numVal = Number(val) || 0;
    handleParamChange(field, numVal);

    const f = field === 'ssiFrequencyScore' ? numVal : Number(params.ssiFrequencyScore || 0);
    const d = field === 'ssiDurationScore' ? numVal : Number(params.ssiDurationScore || 0);
    const p = field === 'ssiPhysicalScore' ? numVal : Number(params.ssiPhysicalScore || 0);
    const total = f + d + p;
    handleParamChange('ssiTotalScore', total);

    let sev = 'VERY MILD';
    let pctl = '1st - 4th %ile';
    if (total >= 32) {
      sev = 'VERY SEVERE';
      pctl = '96th - 99th %ile';
    } else if (total >= 28) {
      sev = 'SEVERE';
      pctl = '78th - 95th %ile';
    } else if (total >= 21) {
      sev = 'MODERATE';
      pctl = '41st - 77th %ile';
    } else if (total >= 11) {
      sev = 'MILD';
      pctl = '12th - 40th %ile';
    }
    handleParamChange('severityClassification', sev);
    handleParamChange('ssiPercentile', pctl);
  };

  // Recalculate %SS
  const handleSyllablesChange = (field, val) => {
    const numVal = Number(val) || 0;
    handleParamChange(field, numVal);
    const total = field === 'totalSyllables' ? numVal : Number(params.totalSyllables || 500);
    const stuttered = field === 'stutteredSyllables' ? numVal : Number(params.stutteredSyllables || 0);
    if (total > 0) {
      const pct = Math.round((stuttered / total) * 1000) / 10;
      handleParamChange('percentageSS', pct);
      handleParamChange('sampleSpeakingDysfluencyPct', pct);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Sections' },
    { id: 'history', label: '1. History & Onset' },
    { id: 'problem', label: '2. Problem & Feared' },
    { id: 'reactions', label: '3. Reactions & Concomitants' },
    { id: 'sample', label: '4. Speech/Reading Sample' },
    { id: 'battery', label: '5. Battery & Scores (SSI-4)' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Preset Toolbar */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-700 shrink-0" />
          <span className="font-bold text-rose-950 text-xs uppercase tracking-wide">
            Fluency / Stuttering Assessment Proforma (Bharati Vidyapeeth Protocol)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('sample')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-rose-800 border border-rose-300 rounded hover:bg-rose-100 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-rose-600" />
            Preset: Moderate Stuttering
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mild')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-300 rounded hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          >
            Preset: Mild Fluency
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-t font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BRIEF HISTORY */}
      {(activeTab === 'all' || activeTab === 'history') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              1. Brief Developmental &amp; Clinical History
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Page 1 Proforma</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Informant</label>
              <input
                type="text"
                value={params.informant || ''}
                onChange={(e) => handleParamChange('informant', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Self & Parents"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Languages Spoken</label>
              <input
                type="text"
                value={params.languageSpoken || ''}
                onChange={(e) => handleParamChange('languageSpoken', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Marathi, Hindi, English"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Speech Development</label>
              <select
                value={params.speechDevelopment || 'Normal'}
                onChange={(e) => handleParamChange('speechDevelopment', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Normal">Normal</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">Speech Development Details (if delayed)</label>
            <input
              type="text"
              value={params.speechDevelopmentDetails || ''}
              onChange={(e) => handleParamChange('speechDevelopmentDetails', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              placeholder="e.g. Normal speech and language milestones until age 3.5 years"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Handedness</label>
              <select
                value={params.handedness || 'Right'}
                onChange={(e) => handleParamChange('handedness', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Ambidextrous">Ambidextrous</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Attempt to Change Hand?</label>
              <select
                value={params.handednessChangeAttempt || 'No'}
                onChange={(e) => handleParamChange('handednessChangeAttempt', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Onset of Problem</label>
              <select
                value={params.problemOnset || 'Gradual'}
                onChange={(e) => handleParamChange('problemOnset', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Gradual">Gradual</option>
                <option value="Sudden">Sudden</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Age of Onset</label>
              <input
                type="text"
                value={params.ageOfOnset || '3.5 Years'}
                onChange={(e) => handleParamChange('ageOfOnset', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-semibold text-purple-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Noticed By</label>
              <input
                type="text"
                value={params.noticedBy || ''}
                onChange={(e) => handleParamChange('noticedBy', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Parents & Class Teacher"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Patient Became Aware At Age</label>
              <input
                type="text"
                value={params.patientAwarenessAge || ''}
                onChange={(e) => handleParamChange('patientAwarenessAge', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="5.0 Years"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Probable Cause (Illness, imitation, injury, etc.)</label>
              <input
                type="text"
                value={params.probableCause || ''}
                onChange={(e) => handleParamChange('probableCause', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Family history & peer imitation in nursery"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Family History of Fluency / Speech Disorders</label>
              <input
                type="text"
                value={params.familyHistory || ''}
                onChange={(e) => handleParamChange('familyHistory', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Paternal uncle had childhood stuttering..."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEM & FEARED SITUATIONS */}
      {(activeTab === 'all' || activeTab === 'problem') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              2. Description of Fluency Problem &amp; Feared Triggers
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Dynamics &amp; Situations</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Problem Course</label>
              <select
                value={params.problemCourse || 'Fluctuating'}
                onChange={(e) => handleParamChange('problemCourse', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Static">Static</option>
                <option value="Increasing">Increasing</option>
                <option value="Decreasing">Decreasing</option>
                <option value="Fluctuating">Fluctuating</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Reported Severity</label>
              <select
                value={params.reportedSeverity || 'Moderate'}
                onChange={(e) => handleParamChange('reportedSeverity', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Observed Severity</label>
              <select
                value={params.observedSeverity || 'Moderate'}
                onChange={(e) => handleParamChange('observedSeverity', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold text-rose-800"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">Feared Sounds / Words / Phrases</label>
            <input
              type="text"
              value={params.fearedSoundsWords || ''}
              onChange={(e) => handleParamChange('fearedSoundsWords', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              placeholder="Initial plosives /p, b, k, t/, stating own name, asking questions"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-emerald-800 block mb-1">Stuttering Is Least With</label>
              <input
                type="text"
                value={params.stutteringLeastWith || ''}
                onChange={(e) => handleParamChange('stutteringLeastWith', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Parents at home, singing, whispering, talking to pets"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-rose-800 block mb-1">Stuttering Is Severe With</label>
              <input
                type="text"
                value={params.stutteringSevereWith || ''}
                onChange={(e) => handleParamChange('stutteringSevereWith', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Strangers, authority figures, phone calls, oral presentations"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REACTIONS & CONCOMITANTS */}
      {(activeTab === 'all' || activeTab === 'reactions') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              3. Reactions When Stuttering Occurred &amp; Physical Concomitants
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Behaviors &amp; Secondary Movements</span>
          </div>

          {/* Reactions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Reactions When Stuttering Occurred</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'reactionHurry', label: 'Hurry to complete sentence' },
                { key: 'reactionStopRetry', label: 'Stop and try again' },
                { key: 'reactionStopSpeaking', label: 'Stop speaking' },
                { key: 'reactionBreathlessness', label: 'Breathlessness' },
                { key: 'reactionExhaustion', label: 'Exhaustion' },
                { key: 'reactionPainAbdomen', label: 'Pain abdomen' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="text-[11px] font-medium text-slate-700">{label}</span>
                  <select
                    value={params[key] || 'No'}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="px-1.5 py-0.5 text-[11px] font-bold border border-slate-300 rounded bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Other Associated Reactions</label>
              <input
                type="text"
                value={params.reactionOther || ''}
                onChange={(e) => handleParamChange('reactionOther', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Facial blushing, clenching fists"
              />
            </div>
          </div>

          {/* Associated Physical Movements */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 block">Associated Physical Movements (Concomitants)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'concomitantTremorHands', label: 'Tremor of hands' },
                { key: 'concomitantTongueThrust', label: 'Tongue thrust' },
                { key: 'concomitantBlinking', label: 'Blinking' },
                { key: 'concomitantFacialMovements', label: 'Facial movements' },
                { key: 'concomitantHeadNodding', label: 'Head nodding' },
                { key: 'concomitantHandMovements', label: 'Hand movements' },
                { key: 'concomitantLegThumping', label: 'Leg thumping' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="text-[11px] font-medium text-slate-700">{label}</span>
                  <select
                    value={params[key] || 'No'}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="px-1.5 py-0.5 text-[11px] font-bold border border-slate-300 rounded bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Any Other Physical Movements / Sites of Tension</label>
              <input
                type="text"
                value={params.concomitantOther || ''}
                onChange={(e) => handleParamChange('concomitantOther', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Shoulder elevation, jaw clenching"
              />
            </div>
          </div>

          {/* Occurrence of Physical Movements */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 block">Occurrence of the Physical Movements</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'occurrenceSentenceBeginning', label: 'At sentence beginning' },
                { key: 'occurrenceAfterPause', label: 'After pause in sentence' },
                { key: 'occurrencePostponementDevice', label: 'Postponement device' },
                { key: 'occurrenceGivesRelief', label: 'They give relief' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
                  <span className="text-[11px] font-medium text-slate-700">{label}</span>
                  <select
                    value={params[key] || 'No'}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="px-1.5 py-0.5 text-[11px] font-bold border border-slate-300 rounded bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Coping Mechanisms & Listener Dynamics */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 block">Coping Mechanisms &amp; Listener Dynamics</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Language-wise Difference?</label>
                <select
                  value={params.languageDifferenceCoping || 'Yes'}
                  onChange={(e) => handleParamChange('languageDifferenceCoping', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Language Difference Details</label>
                <input
                  type="text"
                  value={params.languageDifferenceDetails || ''}
                  onChange={(e) => handleParamChange('languageDifferenceDetails', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  placeholder="Higher dysfluencies in English (L2) compared to Marathi (L1)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Reported Coping Mechanisms</label>
                <input
                  type="text"
                  value={params.copingReported || ''}
                  onChange={(e) => handleParamChange('copingReported', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  placeholder="Pausing, deep inhalation, asking parents to speak"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Observed Coping Mechanisms</label>
                <input
                  type="text"
                  value={params.copingObserved || ''}
                  onChange={(e) => handleParamChange('copingObserved', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  placeholder="Circumlocution, starter phrases, word substitution"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Look at Listener While Talking?</label>
                <select
                  value={params.lookAtListener || 'No'}
                  onChange={(e) => handleParamChange('lookAtListener', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Anticipate Stuttering?</label>
                <select
                  value={params.anticipateStuttering || 'Yes'}
                  onChange={(e) => handleParamChange('anticipateStuttering', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Avoid Stuttering?</label>
                <select
                  value={params.avoidStuttering || 'Yes'}
                  onChange={(e) => handleParamChange('avoidStuttering', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Listener Reactions Precipitating Stuttering</label>
                <input
                  type="text"
                  value={params.listenerReactionTriggers || ''}
                  onChange={(e) => handleParamChange('listenerReactionTriggers', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  placeholder="Interruption, Questioning, Teasing, Impatience"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">If Avoided, How?</label>
                <input
                  type="text"
                  value={params.avoidanceMethods || ''}
                  onChange={(e) => handleParamChange('avoidanceMethods', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  placeholder="Word substitution, circumlocution, silence"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SAMPLE ANALYSIS TABLE */}
      {(activeTab === 'all' || activeTab === 'sample') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              4. Analysis of Speech &amp; Reading Sample
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Page 2 Proforma Table</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="p-2">Dysfluency Parameter</th>
                  <th className="p-2 bg-rose-50 text-rose-900 text-center">Speaking Sample</th>
                  <th className="p-2 bg-blue-50 text-blue-900 text-center">Reading Sample</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-2 font-medium text-slate-800">No. of Prolongations</td>
                  <td className="p-2 text-center bg-rose-50/30">
                    <input
                      type="number"
                      value={params.sampleSpeakingProlongations ?? 8}
                      onChange={(e) => handleParamChange('sampleSpeakingProlongations', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                  <td className="p-2 text-center bg-blue-50/30">
                    <input
                      type="number"
                      value={params.sampleReadingProlongations ?? 4}
                      onChange={(e) => handleParamChange('sampleReadingProlongations', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">No. of Repetitions</td>
                  <td className="p-2 text-center bg-rose-50/30">
                    <input
                      type="number"
                      value={params.sampleSpeakingRepetitions ?? 18}
                      onChange={(e) => handleParamChange('sampleSpeakingRepetitions', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                  <td className="p-2 text-center bg-blue-50/30">
                    <input
                      type="number"
                      value={params.sampleReadingRepetitions ?? 10}
                      onChange={(e) => handleParamChange('sampleReadingRepetitions', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">No. of Hesitations</td>
                  <td className="p-2 text-center bg-rose-50/30">
                    <input
                      type="number"
                      value={params.sampleSpeakingHesitations ?? 12}
                      onChange={(e) => handleParamChange('sampleSpeakingHesitations', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                  <td className="p-2 text-center bg-blue-50/30">
                    <input
                      type="number"
                      value={params.sampleReadingHesitations ?? 6}
                      onChange={(e) => handleParamChange('sampleReadingHesitations', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium text-slate-800">No. of Blocks</td>
                  <td className="p-2 text-center bg-rose-50/30">
                    <input
                      type="number"
                      value={params.sampleSpeakingBlocks ?? 9}
                      onChange={(e) => handleParamChange('sampleSpeakingBlocks', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                  <td className="p-2 text-center bg-blue-50/30">
                    <input
                      type="number"
                      value={params.sampleReadingBlocks ?? 5}
                      onChange={(e) => handleParamChange('sampleReadingBlocks', Number(e.target.value))}
                      className="w-20 text-center py-1 font-bold border border-slate-300 rounded bg-white"
                    />
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td className="p-2 text-slate-900 uppercase">No. of Dysfluencies % (%SS)</td>
                  <td className="p-2 text-center bg-rose-100">
                    <input
                      type="number"
                      step="0.1"
                      value={params.sampleSpeakingDysfluencyPct ?? 9.4}
                      onChange={(e) => handleParamChange('sampleSpeakingDysfluencyPct', Number(e.target.value))}
                      className="w-20 text-center py-1 font-black text-rose-900 border border-rose-300 rounded bg-white"
                    />
                  </td>
                  <td className="p-2 text-center bg-blue-100">
                    <input
                      type="number"
                      step="0.1"
                      value={params.sampleReadingDysfluencyPct ?? 6.2}
                      onChange={(e) => handleParamChange('sampleReadingDysfluencyPct', Number(e.target.value))}
                      className="w-20 text-center py-1 font-black text-blue-900 border border-blue-300 rounded bg-white"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Voice & Breathing */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                k) Voice: Tremulous while stuttering or any other feature
              </label>
              <input
                type="text"
                value={params.voiceFeatures || ''}
                onChange={(e) => handleParamChange('voiceFeatures', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Tremulous while stuttering, vocal tension, pitch breaks"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-700 block uppercase">l) Breathing Mechanics</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'breathingTalksAfterBreathingOut', label: 'Talks after breathing out' },
                  { key: 'breathingShortRapid', label: 'Occasional short rapid breaths' },
                  { key: 'breathingShallow', label: 'Shallow breathing' },
                  { key: 'breathingManyWordsInOneBreath', label: 'Says many words in one breath' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 rounded text-xs">
                    <span className="text-[10px] font-medium text-slate-700 truncate pr-1">{label}</span>
                    <select
                      value={params[key] || 'No'}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                      className="px-1.5 py-0.5 text-[10px] font-bold border border-slate-300 rounded bg-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={params.breathingOther || ''}
                onChange={(e) => handleParamChange('breathingOther', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Other respiratory notes (e.g. clavicular thoracic pattern prior to phonation)"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STANDARDIZED BATTERY & SCORES */}
      {(activeTab === 'all' || activeTab === 'battery') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              5. Standardized Tests &amp; Diagnostic Protocol (SSI-4 / PSI / PAT)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Formal Battery</span>
          </div>

          {/* SSI-4 Battery Inputs */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950 text-xs uppercase">
                5. SSI-4 Score Breakdown (Stuttering Severity Instrument - 4th Ed.)
              </span>
              <span className="text-[10px] font-mono text-rose-800">Riley Protocol</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Frequency (F)</label>
                <input
                  type="number"
                  value={params.ssiFrequencyScore ?? 14}
                  onChange={(e) => handleSSIScoreChange('ssiFrequencyScore', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold text-rose-900 border border-rose-300 rounded bg-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Duration (D)</label>
                <input
                  type="number"
                  value={params.ssiDurationScore ?? 8}
                  onChange={(e) => handleSSIScoreChange('ssiDurationScore', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold text-rose-900 border border-rose-300 rounded bg-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Physical (P)</label>
                <input
                  type="number"
                  value={params.ssiPhysicalScore ?? 6}
                  onChange={(e) => handleSSIScoreChange('ssiPhysicalScore', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold text-rose-900 border border-rose-300 rounded bg-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Total SSI Score</label>
                <input
                  type="number"
                  value={params.ssiTotalScore ?? 28}
                  readOnly
                  className="w-full px-2 py-1 text-center font-black text-rose-950 border border-rose-400 rounded bg-rose-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Percentile Rank</label>
                <input
                  type="text"
                  value={params.ssiPercentile || '61st - 77th Percentile'}
                  onChange={(e) => handleParamChange('ssiPercentile', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold text-rose-900 border border-rose-300 rounded bg-white text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Severity / Grade</label>
                <select
                  value={params.severityClassification || 'MODERATE'}
                  onChange={(e) => handleParamChange('severityClassification', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-black text-rose-950 border border-rose-400 rounded bg-rose-100"
                >
                  <option value="VERY MILD">VERY MILD</option>
                  <option value="MILD">MILD</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="SEVERE">SEVERE</option>
                  <option value="VERY SEVERE">VERY SEVERE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-rose-200 text-xs">
              <div>
                <label className="text-[9px] font-bold text-slate-600 block">Total Syllables Spoken</label>
                <input
                  type="number"
                  value={params.totalSyllables ?? 500}
                  onChange={(e) => handleSyllablesChange('totalSyllables', e.target.value)}
                  className="w-full px-2 py-0.5 border border-slate-300 rounded text-center bg-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-600 block">Stuttered Syllables</label>
                <input
                  type="number"
                  value={params.stutteredSyllables ?? 47}
                  onChange={(e) => handleSyllablesChange('stutteredSyllables', e.target.value)}
                  className="w-full px-2 py-0.5 border border-slate-300 rounded text-center font-bold text-rose-800 bg-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-600 block">%SS (% Dysfluency)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.percentageSS ?? 9.4}
                  onChange={(e) => handleParamChange('percentageSS', Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-300 rounded text-center font-black text-rose-900 bg-rose-100"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-600 block">Longest Block 1 (s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.longestBlock1 ?? 2.8}
                  onChange={(e) => handleParamChange('longestBlock1', Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-300 rounded text-center bg-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-600 block">Longest Block 2 &amp; 3 (s)</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={params.longestBlock2 ?? 2.1}
                    onChange={(e) => handleParamChange('longestBlock2', Number(e.target.value))}
                    className="w-1/2 px-1 py-0.5 border border-slate-300 rounded text-center bg-white"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={params.longestBlock3 ?? 1.9}
                    onChange={(e) => handleParamChange('longestBlock3', Number(e.target.value))}
                    className="w-1/2 px-1 py-0.5 border border-slate-300 rounded text-center bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standardized Tests Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                2. PSI Score (Perceptions of Stuttering Inventory)
              </label>
              <input
                type="text"
                value={params.psiScore || ''}
                onChange={(e) => handleParamChange('psiScore', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Struggle: 8 | Avoidance: 7 | Expectancy: 6 (Total: 21)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                3. Hearing Screening &amp; APD testing
              </label>
              <input
                type="text"
                value={params.hearingScreening || ''}
                onChange={(e) => handleParamChange('hearingScreening', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Bilateral PASS (PTA Normal) • APD Not Indicated"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                4. Articulation Problem / PAT Result Summary
              </label>
              <input
                type="text"
                value={params.patResultSummary || ''}
                onChange={(e) => handleParamChange('patResultSummary', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Photo Articulation Test (PAT): Age-appropriate phonetic repertoire"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">
                7. Self-Rating Questionnaire Scores (OASES / S-24)
              </label>
              <input
                type="text"
                value={params.selfRatingQuestionnaire || ''}
                onChange={(e) => handleParamChange('selfRatingQuestionnaire', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="OASES-S: Overall Impact Score 2.84 (Moderate Impact)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">8. Sample Recorded On (Date)</label>
              <input
                type="text"
                value={params.sampleRecordedDate || '17/10/2026'}
                onChange={(e) => handleParamChange('sampleRecordedDate', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-700 block mb-1">8. Sample Recording Reference &amp; Equipment</label>
              <input
                type="text"
                value={params.sampleRecordedReference || ''}
                onChange={(e) => handleParamChange('sampleRecordedReference', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Sony Digital Voice Recorder ICD-UX570 / WAV 24-bit (REF: FLU-REC-2026-088)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Evaluating Clinician Name &amp; Title</label>
              <input
                type="text"
                value={params.clinicianName || ''}
                onChange={(e) => handleParamChange('clinicianName', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="A. Kulkarni (Clinical Intern)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Supervising Consultant Name &amp; Title</label>
              <input
                type="text"
                value={params.supervisorName || ''}
                onChange={(e) => handleParamChange('supervisorName', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="ASLP Palak Paresh Gandhi, BASLP, RCI"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
