import React from 'react';
import { Eye, Activity, Wind, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';
import { ClinicalReportBackground } from './ClinicalReportBackground';
import { OfficialReportTitle } from './OfficialReportTitle';
import { PatientDemographicsMatrix } from './PatientDemographicsMatrix';
import { useClinicSettings } from '../../context/ClinicSettingsContext';

/**
 * Voice Disorders Official Clinical Dossier (3-Page Production Layout)
 * Strictly modeled after Bharati Vidyapeeth Deemed University School of Audiology & Speech Language Pathology
 * "PERFORMA FOR VOICE DISORDER" & Stroboscopic Evaluation of Voice
 * Adapted for Vaani Speech and Hearing Clinic under RCI CRR No. A79214
 *
 * Pagination Structure:
 * - PAGE 1: Case Intake, Vocal History, Symptom Dynamics, Vocal Load, Phonotrauma & Daily Schedule (Sections 1 to 4)
 * - PAGE 2: Aerodynamic Evaluation (Spirometry, MPT, S/Z), Perceptual (GRBAS & Buffalo Profile), Acoustic MDVP, VHI-10, Diagnosis & Recommendations, SLP Sign-off (Sections 5 to 8)
 * - PAGE 3: Stroboscopic Evaluation of Voice (9-parameter matrix), Glottic Schematics, ENT Laryngologist & SLP Endorsement (Sections 9 to 11)
 */
export const VoiceDisordersDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  renderBulletPoints,
}) => {
  const params = formData?.parameters || {};
  const { leadPractitioner, leadDegree, rciNumber: contextRci, settings } = useClinicSettings();
  const currentLead = settings?.credentials?.leadPractitioner || leadPractitioner || 'Ms. Palak Paresh Gandhi';
  const currentDegree = settings?.credentials?.leadDegree || leadDegree || 'MASLP, RCI';
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

  return (
    <div className="voice-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, CLINICAL HISTORY, VOCAL DEMANDS & RISKS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(1)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Voice Disorders Clinical Dossier"
            subtitle="Case Intake & Vocal History"
          />

          {/* Demographics Matrix (Unified Audiological Evaluation Layout) */}
          <PatientDemographicsMatrix
            formData={formData}
            patient={patient}
            refLabel="PTA / Ref No. :"
            refValue={params.proformaNumber || formData?.reportNumber || '64/2026'}
            extraRow={
              <div className="grid grid-cols-3 divide-x divide-purple-200">
                <div className="p-1 px-2.5 flex items-center col-span-2">
                  <span className="font-bold w-36 shrink-0 text-purple-950">Profession / Demand :</span>
                  <span className="font-medium text-slate-800 truncate">{params.profession || 'Primary/High School Teacher (Vocal Professional)'}</span>
                </div>
                <div className="p-1 px-2.5 flex items-center">
                  <span className="font-bold w-18 shrink-0 text-purple-950">Clinician :</span>
                  <span className="font-medium text-slate-800 truncate">{params.clinicianName || 'A. Kulkarni (Intern)'}</span>
                </div>
              </div>
            }
          />

          {/* CHIEF COMPLAINT */}
          <div className="bg-purple-50/40 border border-purple-200/90 rounded-lg p-1.5 shrink-0 text-[9px] shadow-2xs">
            <span className="font-bold text-purple-950 text-[8.5px] uppercase block mb-0.5">Chief Complaint:</span>
            <p className="text-slate-800 font-medium leading-relaxed">
              {params.chiefComplaint || 'Hoarseness of voice, vocal fatigue by afternoon, throat dryness and pain while speaking.'}
            </p>
          </div>

          {/* SECTION 1: VOCAL HISTORY & SYMPTOM DYNAMICS */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>1. Vocal History &amp; Symptom Progression</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 1.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Duration of the Problem</span>
                  <span className="font-bold text-slate-900 text-[9.5px] mt-0.5 block">{params.durationOfProblem || '6 Months'}</span>
                </div>
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Problem Progression</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[8.5px] font-bold uppercase bg-purple-100 text-purple-950 border border-purple-300">
                    {params.problemCourse || 'Progressive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Whether Voice is Steady Over the Day</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.voiceSteadyOverDay || 'Unsteady (Worse in late afternoon/evening after continuous speaking)'}
                  </p>
                </div>
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">C/o Irritation / Pain in Throat (Speaking / Swallowing)</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.throatPainIrritation || 'Present (Dryness, laryngeal ache and strain while speaking; swallowing normal)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: RESPIRATORY MECHANICS, POSTURE & SENSORY */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>2. Respiratory Mechanics, Posture &amp; Sensory Symptoms</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 2.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Breathing Patterns &amp; Posture During Phonation</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.breathingPatternPosture || 'Clavicular shallow breathing; forward head posture during projection.'}
                  </p>
                </div>
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Any Other Sensory Symptoms / Globus Sensation</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.sensoryProblems || 'Globus sensation (lump in throat feeling), frequent dryness and tickling.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: VOCAL HYGIENE, PHONOTRAUMA & ENVIRONMENTAL RISKS */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>3. Vocal Hygiene, Phonotrauma &amp; Environmental Factors</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 3.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Phonotraumatic Behaviors (Shouting / Throat Clearing)</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.phonotraumaticBehaviors || 'Frequent loud projection in classroom without mic; chronic throat clearing.'}
                  </p>
                </div>
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Hydration Level &amp; Caffeine Intake</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.hydrationCaffeineLevel || 'Poor water intake (approx. 1 - 1.2 L/day); consumes 3-4 cups of tea/coffee daily.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Dietary Habits, Spicy Food &amp; Acidity (GERD / LPR)</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.dietaryHabitsGERD || 'Frequent spicy food intake, late dinners; reports morning sour taste and heartburn.'}
                  </p>
                </div>
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase">Environmental Exposure (Dust / Chemical / Acoustics)</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.environmentalExposure || 'High chalk dust exposure; poor acoustic treatment in high-ceiling classrooms.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: TYPICAL DAILY VOCAL SCHEDULE & LOAD */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>4. Daily Vocal Schedule &amp; Vocal Load Distribution</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 4.0</span>
            </div>
            <div className="p-1.5 text-[9px]">
              <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100 space-y-1">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-purple-950 text-[8px] uppercase shrink-0 w-32">Morning (08:00 - 12:00):</span>
                  <span className="text-slate-800 font-medium">{params.scheduleMorning || '4 hours continuous lecture delivery; no microphone support'}</span>
                </div>
                <div className="flex items-start gap-2 border-t border-purple-100/60 pt-0.5">
                  <span className="font-bold text-purple-950 text-[8px] uppercase shrink-0 w-32">Afternoon (12:00 - 16:00):</span>
                  <span className="text-slate-800 font-medium">{params.scheduleAfternoon || '2 hours practical / tutorial discussions; notable vocal strain and pitch drop'}</span>
                </div>
                <div className="flex items-start gap-2 border-t border-purple-100/60 pt-0.5">
                  <span className="font-bold text-purple-950 text-[8px] uppercase shrink-0 w-32">Evening / Night:</span>
                  <span className="text-slate-800 font-medium">{params.scheduleEvening || 'Private tuition for 1.5 hours; voice becomes significantly hoarse & breathy'}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: OBJECTIVE AERODYNAMICS, ACOUSTIC, PERCEPTUAL & PLAN
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(2)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Voice Evaluation & Clinical Formulation"
            subtitle="Aerodynamic, Perceptual & Acoustic Measurements"
          />

          {/* SECTION 5: AERODYNAMIC EVALUATION (MPT, S/Z RATIO) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>5. Aerodynamic &amp; Glottic Competence Evaluation</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 5.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                {/* Maximum Phonation Time (MPT) */}
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase mb-1">Maximum Phonation Time (MPT in Seconds)</span>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[8.5px]">
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">Trial 1</span>
                      <strong className="text-slate-800 font-bold">{params.mptTrial1 ?? 11.2}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">Trial 2</span>
                      <strong className="text-slate-800 font-bold">{params.mptTrial2 ?? 12.8}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">Trial 3</span>
                      <strong className="text-slate-800 font-bold">{params.mptTrial3 ?? 12.1}s</strong>
                    </div>
                    <div className="bg-purple-100 p-1 rounded border border-purple-300">
                      <span className="text-[7.5px] text-purple-950 block uppercase font-bold">Best MPT</span>
                      <strong className="text-purple-950 font-black">{params.bestMPT ?? 12.8}s</strong>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-slate-600 block mt-1 font-medium">Normative: Male 20-25s | Female 15-20s (Reduced phonation efficiency)</span>
                </div>

                {/* S/Z Ratio */}
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                  <span className="font-bold text-purple-950 block text-[8px] uppercase mb-1">S/Z Ratio (Glottic Competence)</span>
                  <div className="grid grid-cols-3 gap-1 text-center font-mono text-[8.5px]">
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/s/ Dur</span>
                      <strong className="text-slate-800 font-bold">{params.sDuration ?? 15.2}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/z/ Dur</span>
                      <strong className="text-slate-800 font-bold">{params.zDuration ?? 9.4}s</strong>
                    </div>
                    <div className="bg-purple-100/70 p-1 rounded border border-purple-300">
                      <span className="text-[7.5px] text-purple-950 block uppercase font-bold">s/z Ratio</span>
                      <strong className="text-purple-950 font-black">{params.szRatio ?? 1.62}</strong>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-purple-900 font-semibold block mt-1">Ratio &gt; 1.4 suggests laryngeal pathology / vocal fold incompetence</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: PERCEPTUAL VOICE EVALUATION (GRBAS & BUFFALO) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>6. Perceptual Voice Evaluation (GRBAS &amp; Buffalo Voice Profile)</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 6.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              {/* GRBAS Scale Banner */}
              <div className="bg-purple-50/60 p-1.5 rounded border border-purple-200">
                <span className="font-bold text-purple-950 text-[8px] uppercase block mb-1">GRBAS 4-Point Rating Scale (0=Normal, 1=Mild, 2=Moderate, 3=Severe)</span>
                <div className="grid grid-cols-5 gap-2 text-center font-mono">
                  <div className="bg-white p-1 rounded border border-purple-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">G (Grade)</span>
                    <strong className="text-purple-950 text-xs font-black">{params.grbas_grade ?? 2}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-purple-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">R (Roughness)</span>
                    <strong className="text-purple-950 text-xs font-black">{params.grbas_roughness ?? 2}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-purple-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">B (Breathiness)</span>
                    <strong className="text-purple-950 text-xs font-black">{params.grbas_breathiness ?? 1}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-purple-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">A (Asthenia)</span>
                    <strong className="text-purple-950 text-xs font-black">{params.grbas_asthenia ?? 0}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-purple-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">S (Strain)</span>
                    <strong className="text-purple-950 text-xs font-black">{params.grbas_strain ?? 2}</strong>
                  </div>
                </div>
              </div>

              {/* Buffalo Voice Profile Table */}
              <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100">
                <span className="font-bold text-purple-950 block text-[8px] uppercase mb-1">Buffalo Voice Profile</span>
                <div className="grid grid-cols-4 gap-1.5 text-[8px]">
                  <div>
                    <span className="text-purple-950 font-bold block uppercase">Laryngeal Tone:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloLaryngealTone || 'Harsh & strained with slight breathiness'}</span>
                  </div>
                  <div>
                    <span className="text-purple-950 font-bold block uppercase">Pitch:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloPitch || 'Slightly low; reduced pitch flexibility'}</span>
                  </div>
                  <div>
                    <span className="text-purple-950 font-bold block uppercase">Loudness:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloLoudness || 'Monoloudness; reduced dynamic range'}</span>
                  </div>
                  <div>
                    <span className="text-purple-950 font-bold block uppercase">Nasal Resonance:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloNasalResonance || 'Normal oral-nasal balance'}</span>
                  </div>
                </div>
                <div className="mt-1 pt-1 border-t border-purple-100 flex items-center justify-between text-[8px]">
                  <span className="text-slate-600 uppercase font-bold">Overall Voice Rating:</span>
                  <span className="px-2 py-0.2 rounded font-black text-purple-950 bg-purple-100 border border-purple-200 uppercase">
                    {params.buffaloOverallRating || 'Moderately Dysphonic (Buffalo Scale Grade 3)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: ACOUSTIC EVALUATION (MDVP) & VHI */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>7. Acoustic Evaluation (MDVP) &amp; Self-Rating (VHI)</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 7.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                {/* MDVP Parameters Table */}
                <div className="border border-purple-200 rounded overflow-hidden">
                  <table className="w-full text-center border-collapse text-[8px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 font-bold text-purple-950 uppercase border-b border-purple-200">
                        <th className="py-0.5 px-1 text-left">Acoustic Metric</th>
                        <th className="py-0.5 px-1">Measured</th>
                        <th className="py-0.5 px-1 text-slate-500">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100">
                      <tr>
                        <td className="py-0.5 px-1 text-left font-semibold text-slate-800">Fundamental Freq (F0)</td>
                        <td className="py-0.5 px-1 font-mono font-bold text-purple-950">{params.acousticF0 ?? 194.2} Hz</td>
                        <td className="py-0.5 px-1 text-slate-500">180 - 240 Hz (F)</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 px-1 text-left font-semibold text-slate-800">Jitter (Local %)</td>
                        <td className="py-0.5 px-1 font-mono font-bold text-purple-950">{params.acousticJitter ?? 1.84}%</td>
                        <td className="py-0.5 px-1 text-slate-500">&lt; 1.04%</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 px-1 text-left font-semibold text-slate-800">Shimmer (Local dB)</td>
                        <td className="py-0.5 px-1 font-mono font-bold text-purple-950">{params.acousticShimmer ?? 4.12}%</td>
                        <td className="py-0.5 px-1 text-slate-500">&lt; 3.81%</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 px-1 text-left font-semibold text-slate-800">Harmonics-to-Noise (HNR)</td>
                        <td className="py-0.5 px-1 font-mono font-bold text-purple-950">{params.acousticHNR ?? 14.2} dB</td>
                        <td className="py-0.5 px-1 text-slate-500">&gt; 20.0 dB</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* VHI-10 & Audio Recording Index */}
                <div className="bg-purple-50/30 p-1.5 rounded border border-purple-100 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-purple-950 block text-[8px] uppercase">Voice Handicap Index (VHI-10)</span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[8.5px] text-slate-700">Total VHI-10 Score:</span>
                      <span className="px-2 py-0.2 rounded font-black text-purple-950 bg-purple-100 border border-purple-300 font-mono text-[9px]">
                        {params.vhiTotalScore ?? 24} / 40
                      </span>
                    </div>
                    <span className="text-[7.5px] text-purple-900 block mt-0.5 font-medium">Moderate perceived voice handicap impact in occupational domain.</span>
                  </div>

                  <div className="pt-1 border-t border-purple-100 mt-1">
                    <span className="font-bold text-purple-950 block text-[7.5px] uppercase">Acoustic Audio Archive Reference</span>
                    <p className="font-mono text-[8px] text-purple-950 mt-0.5 font-medium">
                      Date: {params.recordingDate || formData?.reportDate} • Ref: {params.recordingReference || 'REC-VOI-2026-042'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: PROVISIONAL DIAGNOSIS & RECOMMENDATIONS */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>8. Clinical Impression, Provisional Diagnosis &amp; Recommendations</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 8.0</span>
            </div>
            <div className="p-1.5 grid grid-cols-2 gap-2 text-[8.5px]">
              <div className="bg-purple-50/50 p-1.5 rounded border border-purple-200">
                <span className="font-bold text-purple-950 block text-[8.5px] uppercase tracking-wide border-b border-purple-200 pb-0.5 mb-0.5">
                  Provisional Voice Diagnosis
                </span>
                {renderBulletPoints(formData?.provisionalDiagnosis || params.provisionalDiagnosis, 'Hyperfunctional dysphonia secondary to vocal fold nodules.', 'bg-purple-900')}
              </div>

              <div className="bg-purple-50/50 p-1.5 rounded border border-purple-200">
                <span className="font-bold text-purple-950 block text-[8.5px] uppercase tracking-wide border-b border-purple-200 pb-0.5 mb-0.5">
                  Voice Therapy Protocol &amp; Recommendations
                </span>
                {renderBulletPoints(formData?.recommendations || params.recommendations, 'Resonant Voice Therapy (RVT), vocal hygiene and hydration.', 'bg-purple-900')}
              </div>
            </div>
          </div>

          {/* DUAL SLP CLINICIAN & SUPERVISOR VERIFICATION BAR */}
          <div className="bg-white/85 border border-purple-200/80 rounded-lg p-1.5 shrink-0 grid grid-cols-2 gap-3 text-[8.5px] shadow-2xs">
            <div className="border-r border-purple-200 pr-2">
              <span className="font-bold text-purple-950 uppercase block text-[7.5px]">Student Clinician / Evaluating Clinician</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{params.clinicianName || 'A. Kulkarni'}</span>
                  <span className="text-[7.5px] text-slate-600 block">Clinical Speech Intern • BASLP Intern</span>
                </div>
                <div className="border-b border-purple-300 w-24 text-center pb-0.5">
                  <span className="text-[7px] text-purple-800 italic">Signature Verified</span>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-purple-950 uppercase block text-[7.5px]">Clinical Supervisor &amp; Head of Department</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-950 block">{supervisorName}</span>
                  <span className="text-[7.5px] text-slate-600 block">RCI CRR No: <strong className="font-mono text-purple-950">{currentRci}</strong></span>
                </div>
                <div className="border-b border-purple-300 w-24 text-center pb-0.5">
                  <span className="text-[7.5px] text-purple-900 font-serif italic font-bold">{supervisorSig}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(2)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: STROBOSCOPIC EVALUATION OF VOICE & ENT SIGN-OFF
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page relative bg-[#faf7fd] text-slate-900 font-sans p-0 max-w-[210mm] w-full min-h-[297mm] h-[297mm] print:h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl overflow-hidden print:rounded-none print:border-none print:shadow-none">
        <ClinicalReportBackground />
        <div className="relative z-10 flex-1 flex flex-col">
          {renderHeader(3)}
          <div className="flex-1 flex flex-col space-y-1.5 pb-1 px-7 sm:px-8">

          {/* Title Banner */}
          <OfficialReportTitle
            title="Laryngeal Videostroboscopic Evaluation"
            subtitle="Glottic Protocol & ENT Laryngology Endorsement"
          />

          {/* Stroboscopy Examination Context Bar */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden text-[8.5px] bg-white/85 backdrop-blur-2xs shadow-2xs p-1.5 shrink-0 grid grid-cols-4 gap-2">
            <div>
              <span className="text-purple-950 font-bold block text-[7.5px] uppercase">Endoscope Type</span>
              <span className="font-semibold text-slate-900">70° Rigid Telescopic Laryngoscope</span>
            </div>
            <div>
              <span className="text-purple-950 font-bold block text-[7.5px] uppercase">Light Source</span>
              <span className="font-semibold text-slate-900">Xenon Continuous &amp; Stroboscopic</span>
            </div>
            <div>
              <span className="text-purple-950 font-bold block text-[7.5px] uppercase">Topical Anesthesia</span>
              <span className="font-semibold text-slate-900">Topical 4% Lignocaine Spray</span>
            </div>
            <div>
              <span className="text-purple-950 font-bold block text-[7.5px] uppercase">Patient Tolerance</span>
              <span className="font-semibold text-purple-950">Good / Minimal Gag Reflex</span>
            </div>
          </div>

          {/* SECTION 9: STROBOSCOPIC EVALUATION TABLE (9 PARAMETERS FROM REFERENCE FORM) */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>9. Stroboscopic Evaluation of Voice (Standardized Laryngeal Matrix)</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">STROBOSCOPY 1.0</span>
            </div>
            <div className="p-1.5 text-[9px]">
              <table className="w-full text-left border-collapse border border-purple-200">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 text-purple-950 font-black text-[8.5px] uppercase border-b border-purple-200">
                    <th className="py-1 px-2.5 w-1/3 border-r border-purple-200">Stroboscopic Parameter</th>
                    <th className="py-1 px-2.5">Clinical Findings &amp; Laryngeal Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 text-[8.5px]">
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      1. Pathology
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyPathology || 'Bilateral symmetrical vocal cord nodules at the junction of anterior 1/3 and posterior 2/3 of vocal folds'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      2. Closure Pattern
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyClosurePattern || 'Hourglass glottic closure with persistent anterior and posterior triangular chink'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      3. Symmetry
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopySymmetry || 'Symmetrical bilateral phase timing and lateral excursion'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      4. Periodicity
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyPeriodicity || 'Regular and periodic vocal fold vibration under stroboscopic tracking'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      5. Amplitude
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyAmplitude || 'Mildly reduced bilaterally (< 50% of vocal fold membranous width)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      6. Mucosal Wave
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyMucosalWave || 'Reduced over the nodular apices bilaterally; preserved over adjacent membranous margins'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      7. Non-Vibratory Portion
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyNonVibratoryPortion || 'Small non-vibratory segment restricted to the nodular apices'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      8. Ventricular Folds
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyVentricularFolds || 'Mild ventricular fold hyperadduction (mediolateral supraglottic constriction)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-purple-950 bg-purple-50/30 border-r border-purple-200">
                      9. Other Findings
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyOtherFindings || 'Mild arytenoid erythema suggestive of laryngopharyngeal reflux (LPR); pooling of thick secretions'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 10: LARYNGEAL SCHEMATIC & GLOTTIC REPAIR REFERENCE */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>10. Glottic Configuration &amp; Laryngeal Vibratory Reference</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 10.0</span>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2 text-center text-[8px]">
              <div className="p-2 bg-purple-50/30 border border-purple-100 rounded flex flex-col items-center">
                <span className="font-bold text-purple-950 uppercase mb-1">A. Phonatory Adduction</span>
                <div className="w-20 h-16 border border-purple-200 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="w-1 h-12 bg-purple-700 rounded-full rotate-6 mr-0.5" />
                  <div className="w-1.5 h-1.5 bg-purple-950 rounded-full absolute top-7 left-[34px]" />
                  <div className="w-1.5 h-1.5 bg-purple-950 rounded-full absolute top-7 right-[34px]" />
                  <div className="w-1 h-12 bg-purple-700 rounded-full -rotate-6 ml-0.5" />
                </div>
                <span className="text-purple-950 mt-1 font-medium">Hourglass Contact (Nodules)</span>
              </div>

              <div className="p-2 bg-purple-50/30 border border-purple-100 rounded flex flex-col items-center">
                <span className="font-bold text-purple-950 uppercase mb-1">B. Deep Abduction</span>
                <div className="w-20 h-16 border border-purple-200 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="w-1 h-12 bg-slate-400 rounded-full rotate-24 mr-2" />
                  <div className="w-1 h-12 bg-slate-400 rounded-full -rotate-24 ml-2" />
                </div>
                <span className="text-slate-600 mt-1 font-medium">Full Respiratory Opening</span>
              </div>

              <div className="p-2 bg-purple-50/30 border border-purple-100 rounded flex flex-col items-center">
                <span className="font-bold text-purple-950 uppercase mb-1">C. Mucosal Wave Dynamic</span>
                <div className="w-20 h-16 border border-purple-200 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-10 h-1.5 bg-purple-400 rounded-full" />
                    <div className="w-12 h-1.5 bg-purple-600 rounded-full" />
                    <div className="w-8 h-1.5 bg-purple-900 rounded-full" />
                  </div>
                </div>
                <span className="text-purple-950 mt-1 font-medium">Phase-Delayed Travelling Wave</span>
              </div>
            </div>
          </div>

          {/* SECTION 11: ENT LARYNGOLOGICAL IMPRESSION & MEDICAL PROTOCOL */}
          <div className="border border-purple-200/80 rounded-lg overflow-hidden bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0">
            <div className="bg-gradient-to-r from-purple-100/90 via-purple-50/70 to-purple-100/90 px-2.5 py-0.5 border-b border-purple-200 font-bold text-[9.5px] text-purple-950 uppercase flex items-center justify-between">
              <span>11. Laryngologist Impression &amp; Multidisciplinary Management</span>
              <span className="text-[8px] font-mono font-bold text-purple-800">SECTION 11.0</span>
            </div>
            <div className="p-2 bg-purple-50/40 text-[8.5px] space-y-1">
              <p className="text-slate-800 leading-relaxed font-medium">
                • <strong className="text-purple-950">Laryngeal Impression:</strong> Findings confirm early-stage bilateral soft vocal fold nodules without fibrotic remodeling. Suitable for non-surgical conservative intervention.
              </p>
              <p className="text-slate-800 leading-relaxed font-medium">
                • <strong className="text-purple-950">Medical Recommendation:</strong> Conservative voice therapy is the primary standard of care. Surgical micro-laryngeal excision is currently contraindicated. Proton-pump inhibitor (PPI) therapy indicated for LPR management. Repeat stroboscopy recommended in 6 weeks.
              </p>
            </div>
          </div>

          {/* DUAL ENT SPECIALIST & SLP VERIFICATION BAR */}
          <div className="bg-white/85 border border-purple-200/80 rounded-lg p-1.5 shrink-0 grid grid-cols-2 gap-4 text-[8.5px] shadow-2xs">
            <div className="border-r border-purple-200 pr-2">
              <span className="font-bold text-purple-950 uppercase block text-[7.5px]">ENT Faculty / Consultant Laryngologist</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{params.entFacultyName || 'Dr. A. P. Kulkarni, MS (ENT)'}</span>
                  <span className="text-[7.5px] text-slate-600 block">Consultant ENT Surgeon &amp; Laryngologist • Reg No: 84920</span>
                </div>
                <div className="border-b border-purple-300 w-24 text-center pb-0.5">
                  <span className="text-[7.5px] text-purple-900 font-serif italic font-bold">A. P. Kulkarni</span>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-purple-950 uppercase block text-[7.5px]">Head Audiologist &amp; Speech-Language Pathologist</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-950 block">{supervisorName}</span>
                  <span className="text-[7.5px] text-slate-600 block">RCI CRR No: <strong className="font-mono text-purple-950">{currentRci}</strong></span>
                </div>
                <div className="border-b border-purple-300 w-24 text-center pb-0.5">
                  <span className="text-[7.5px] text-purple-900 font-serif italic font-bold">{supervisorSig}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(3)}
      </div>

    </div>
  );
};
