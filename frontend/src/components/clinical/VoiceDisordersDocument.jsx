import React from 'react';
import { Eye, Activity, Wind, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OfficialReportHeader } from './OfficialReportHeader';
import { OfficialReportFooter } from './OfficialReportFooter';

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
    <OfficialReportFooter
      formData={formData}
      pageNumber={pageNumber}
      totalPages={3}
      compact={true}
    />
  );

  return (
    <div className="voice-dossier-wrapper space-y-8 print:space-y-0 text-slate-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          PAGE 1: CASE INTAKE, CLINICAL HISTORY, VOCAL DEMANDS & RISKS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl">
        <div className="flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(1)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-amber-800 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              VOICE DISORDERS CLINICAL DOSSIER — CASE INTAKE &amp; VOCAL HISTORY
            </span>
          </div>

          {/* Demographics Bar */}
          <div className="bg-slate-50 border border-slate-300 rounded p-1.5 shrink-0 grid grid-cols-4 gap-x-2 gap-y-1 text-[9px]">
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Case Name</span>
              <span className="font-bold text-slate-900 truncate block">{patient?.name || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Age / Sex / DOB</span>
              <span className="font-semibold text-slate-800">
                {patient?.age || '—'} Y / {patient?.gender || '—'} • {patient?.dob || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Reg. No. / UHID</span>
              <span className="font-mono font-bold text-purple-950">{patient?.id || patient?.uhid || formData?.reportNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Evaluation Date</span>
              <span className="font-medium text-slate-700">{formData?.reportDate || '—'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Profession / Vocal Demand</span>
              <span className="font-semibold text-slate-900 truncate block">{params.profession || 'Primary/High School Teacher (Vocal Professional)'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Clinician</span>
              <span className="font-medium text-slate-700 truncate block">{params.clinicianName || 'A. Kulkarni (Intern)'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[8px] uppercase">Supervising Staff</span>
              <span className="font-medium text-slate-700 truncate block">{params.supervisorName || 'Dr. Shreeharsh Shivpuje'}</span>
            </div>
          </div>

          {/* CHIEF COMPLAINT */}
          <div className="bg-amber-50/40 border border-amber-200 rounded p-1.5 shrink-0 text-[9px]">
            <span className="font-bold text-amber-950 text-[8.5px] uppercase block mb-0.5">Chief Complaint:</span>
            <p className="text-slate-800 font-medium leading-relaxed">
              {params.chiefComplaint || 'Hoarseness of voice, vocal fatigue by afternoon, throat dryness and pain while speaking.'}
            </p>
          </div>

          {/* SECTION 1: VOCAL HISTORY & SYMPTOM DYNAMICS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>1. Vocal History &amp; Symptom Progression</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 1.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Duration of the Problem</span>
                  <span className="font-bold text-slate-900 text-[9.5px] mt-0.5 block">{params.durationOfProblem || '6 Months'}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Problem Progression</span>
                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[8.5px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                    {params.problemCourse || 'Progressive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Whether Voice is Steady Over the Day</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.voiceSteadyOverDay || 'Unsteady (Worse in late afternoon/evening after continuous speaking)'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">C/o Irritation / Pain in Throat (Speaking / Swallowing)</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.throatPainIrritation || 'Present (Dryness, laryngeal ache and strain while speaking; swallowing normal)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: RESPIRATORY MECHANICS, POSTURE & SENSORY */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>2. Respiratory Mechanics, Posture &amp; Sensory Symptoms</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 2.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Breathing Patterns &amp; Posture During Phonation</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.breathingPatternPosture || 'Clavicular shallow breathing; forward head posture during projection.'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Any Other Sensory Symptoms / Globus Sensation</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.sensoryProblems || 'Globus sensation (lump in throat feeling), frequent dryness and tickling.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: VOCAL HYGIENE, PHONOTRAUMA & ENVIRONMENTAL RISKS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>3. Vocal Hygiene, Phonotrauma &amp; Environmental Factors</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 3.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">H/o Vocal Abuse / Misuse / Throat Clearing</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.vocalAbuseMisuse || 'Present (Frequent habitual throat clearing, speaking loudly over classroom background noise).'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">What is the Vocal Load (Voice Use) Per Day</span>
                  <p className="text-slate-800 font-bold mt-0.5 text-[8.5px] text-purple-950">
                    {params.vocalLoadHours || '6 - 7 Hours per day of active vocal projection'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">H/o Frequent Cough and Cold or Voice Problem</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.coughColdHistory || 'Occasional upper respiratory tract infections; seasonal allergic rhinitis.'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Smoking / Drinking / Tobacco</span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded text-[8px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {params.smokingDrinkingTobacco || 'Absent'}
                    </span>
                    <span className="text-slate-600 text-[8.5px]">No history of smoking, alcohol, or tobacco</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PHONATION QUALITY, RESONANCE & DAILY SCHEDULE */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>4. Phonation Quality, Resonance &amp; Occupational Schedule</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 4.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Pitch Breaks or Diplophonia</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.pitchBreaksDiplophonia || 'Present (Pitch breaks during sentence-final syllables; occasional diplophonic pitch)'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Nasality</span>
                  <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                    {params.nasality || 'Normal oral-nasal resonance balance (No hypernasality or hyponasality)'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">H/o Any Surgery / Medication / Therapy Earlier Taken for Voice Problem</span>
                <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                  {params.priorSurgeryMedsTherapy || 'Prescribed proton-pump inhibitors (PPIs) for suspected LPR; no prior vocal fold surgery or structured voice therapy.'}
                </p>
              </div>

              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">Daily Schedule &amp; Vocal Distribution</span>
                <p className="text-slate-800 font-medium mt-0.5 text-[8.5px] leading-tight">
                  {params.dailySchedule || '7:30 AM - 1:30 PM: Continuous classroom teaching (5 lectures); 2:30 PM - 5:00 PM: Private coaching; inadequate water intake (<1L/day).'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Statutory Footer */}
        {renderFooter(1)}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 2: AERODYNAMIC, PERCEPTUAL (GRBAS/BUFFALO), ACOUSTIC & PLAN
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl">
        <div className="flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(2)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-amber-800 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              VOICE ASSESSMENT — AERODYNAMIC, PERCEPTUAL (GRBAS) &amp; ACOUSTIC BATTERY
            </span>
          </div>

          {/* SECTION 5: AERODYNAMIC EVALUATION & PULMONARY SUPPORT */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>5. Aerodynamic Evaluation &amp; Glottic Efficiency</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 5.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">Spirometry Interpretation</span>
                <p className="text-slate-800 font-medium mt-0.5 text-[8.5px]">
                  {params.spirometryInterpretation || 'FVC: 3.2 L (92% predicted), FEV1/FVC: 84% — Normal pulmonary respiratory mechanics'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase mb-1">Maximum Phonation Time (MPT)</span>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[8.5px]">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/a/</span>
                      <strong className="text-purple-950 font-bold">{params.mptA ?? 9.2}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/i/</span>
                      <strong className="text-purple-950 font-bold">{params.mptI ?? 10.1}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/u/</span>
                      <strong className="text-purple-950 font-bold">{params.mptU ?? 9.5}s</strong>
                    </div>
                    <div className="bg-purple-50 p-1 rounded border border-purple-200">
                      <span className="text-[7.5px] text-purple-900 block uppercase font-bold">Avg MPT</span>
                      <strong className="text-purple-950 font-black">{params.mptAverage ?? 9.6}s</strong>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-slate-500 block mt-1">Norm: 15.0 - 25.0 seconds (Reduced phonation efficiency)</span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase mb-1">S/Z Ratio (Glottic Competence)</span>
                  <div className="grid grid-cols-3 gap-1 text-center font-mono text-[8.5px]">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/s/ Dur</span>
                      <strong className="text-slate-800 font-bold">{params.sDuration ?? 15.2}s</strong>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[7.5px] text-slate-500 block uppercase">/z/ Dur</span>
                      <strong className="text-slate-800 font-bold">{params.zDuration ?? 9.4}s</strong>
                    </div>
                    <div className="bg-rose-50 p-1 rounded border border-rose-200">
                      <span className="text-[7.5px] text-rose-900 block uppercase font-bold">s/z Ratio</span>
                      <strong className="text-rose-950 font-black">{params.szRatio ?? 1.62}</strong>
                    </div>
                  </div>
                  <span className="text-[7.5px] text-rose-800 font-semibold block mt-1">Ratio &gt; 1.4 suggests laryngeal pathology / vocal fold incompetence</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: PERCEPTUAL VOICE EVALUATION (GRBAS & BUFFALO) */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>6. Perceptual Voice Evaluation (GRBAS &amp; Buffalo Voice Profile)</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 6.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              {/* GRBAS Scale Banner */}
              <div className="bg-amber-50/60 p-1.5 rounded border border-amber-200">
                <span className="font-bold text-amber-950 text-[8px] uppercase block mb-1">GRBAS 4-Point Rating Scale (0=Normal, 1=Mild, 2=Moderate, 3=Severe)</span>
                <div className="grid grid-cols-5 gap-2 text-center font-mono">
                  <div className="bg-white p-1 rounded border border-amber-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">G (Grade)</span>
                    <strong className="text-amber-950 text-xs font-black">{params.grbas_grade ?? 2}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-amber-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">R (Roughness)</span>
                    <strong className="text-amber-950 text-xs font-black">{params.grbas_roughness ?? 2}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-amber-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">B (Breathiness)</span>
                    <strong className="text-amber-950 text-xs font-black">{params.grbas_breathiness ?? 1}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-amber-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">A (Asthenia)</span>
                    <strong className="text-amber-950 text-xs font-black">{params.grbas_asthenia ?? 0}</strong>
                  </div>
                  <div className="bg-white p-1 rounded border border-amber-200">
                    <span className="text-[7.5px] text-slate-600 block uppercase">S (Strain)</span>
                    <strong className="text-amber-950 text-xs font-black">{params.grbas_strain ?? 2}</strong>
                  </div>
                </div>
              </div>

              {/* Buffalo Voice Profile Table */}
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase mb-1">Buffalo Voice Profile</span>
                <div className="grid grid-cols-4 gap-1.5 text-[8px]">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase">Laryngeal Tone:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloLaryngealTone || 'Harsh & strained with slight breathiness'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase">Pitch:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloPitch || 'Slightly low; reduced pitch flexibility'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase">Loudness:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloLoudness || 'Monoloudness; reduced dynamic range'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block uppercase">Nasal Resonance:</span>
                    <span className="text-slate-900 font-semibold">{params.buffaloNasalResonance || 'Normal oral-nasal balance'}</span>
                  </div>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[8px]">
                  <span className="text-slate-600 uppercase font-bold">Overall Voice Rating:</span>
                  <span className="px-2 py-0.2 rounded font-black text-amber-950 bg-amber-200 uppercase">
                    {params.buffaloOverallRating || 'Moderately Dysphonic (Buffalo Scale Grade 3)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: ACOUSTIC EVALUATION (MDVP) & VHI */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>7. Acoustic Evaluation (MDVP) &amp; Self-Rating (VHI)</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 7.0</span>
            </div>
            <div className="p-1.5 space-y-1.5 text-[9px]">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block text-[8px] uppercase">MDVP Significant Findings (KayPENTAX Multi-Dimensional Voice Program)</span>
                <p className="text-slate-900 font-mono font-medium mt-0.5 text-[8.5px]">
                  {params.mdvpFindings || 'Mean F0: 208 Hz | Jitter (local): 2.14% (Elevated, norm <1.04%) | Shimmer (apq11): 5.42% (Elevated, norm <3.81%) | NHR: 0.218 (Elevated, norm <0.179)'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[8.5px]">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Voice Handicap Index (VHI) Score</span>
                  <p className="text-slate-900 font-semibold mt-0.5">
                    {params.vhiScore || 'VHI-10: 24/40 (Moderate Vocal Handicap; Physical: 10, Emotional: 8, Functional: 6)'}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[8px] uppercase">Recording Date &amp; Audio Reference No.</span>
                  <p className="text-slate-900 font-mono mt-0.5 truncate">
                    Date: {params.recordingDate || formData?.reportDate} • Ref: {params.recordingReference || 'REC-VOI-2026-042'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: PROVISIONAL DIAGNOSIS & RECOMMENDATIONS */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>8. Clinical Impression, Provisional Diagnosis &amp; Recommendations</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 8.0</span>
            </div>
            <div className="p-1.5 grid grid-cols-2 gap-2 text-[8.5px]">
              <div className="bg-amber-50/50 p-1.5 rounded border border-amber-200">
                <span className="font-bold text-amber-950 block text-[8.5px] uppercase tracking-wide border-b border-amber-200 pb-0.5 mb-0.5">
                  Provisional Voice Diagnosis
                </span>
                {renderBulletPoints(formData?.provisionalDiagnosis || params.provisionalDiagnosis, 'Hyperfunctional dysphonia secondary to vocal fold nodules.', 'bg-amber-700')}
              </div>

              <div className="bg-emerald-50/50 p-1.5 rounded border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-[8.5px] uppercase tracking-wide border-b border-emerald-200 pb-0.5 mb-0.5">
                  Voice Therapy Protocol &amp; Recommendations
                </span>
                {renderBulletPoints(formData?.recommendations || params.recommendations, 'Resonant Voice Therapy (RVT), vocal hygiene and hydration.', 'bg-emerald-700')}
              </div>
            </div>
          </div>

          {/* DUAL SLP CLINICIAN & SUPERVISOR VERIFICATION BAR */}
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

      {/* ═══════════════════════════════════════════════════════════════
          PAGE 3: STROBOSCOPIC EVALUATION OF VOICE & ENT SIGN-OFF
          ═══════════════════════════════════════════════════════════════ */}
      <div className="a4-print-page bg-[#faf7fd] text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full leading-tight border border-purple-200/60 shadow-xs rounded-xl">
        <div className="flex-1 flex flex-col space-y-1.5 pb-1">
          {renderHeader(3)}

          {/* Title Banner */}
          <div className="text-center my-0.5 shrink-0">
            <span className="inline-block bg-gradient-to-r from-purple-900 via-amber-800 to-purple-900 text-white font-black text-[11px] tracking-wider px-5 py-0.5 rounded-full uppercase shadow-xs border border-purple-400/40">
              LARYNGEAL VIDEOSTROBOSCOPIC EVALUATION OF VOICE (PAGE 3 PROTOCOL)
            </span>
          </div>

          {/* Stroboscopy Examination Context Bar */}
          <div className="bg-slate-50 border border-slate-300 rounded p-1.5 shrink-0 grid grid-cols-4 gap-2 text-[8.5px]">
            <div>
              <span className="text-slate-500 font-bold block text-[7.5px] uppercase">Endoscope Type</span>
              <span className="font-semibold text-slate-900">70° Rigid Telescopic Laryngoscope</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[7.5px] uppercase">Light Source</span>
              <span className="font-semibold text-slate-900">Xenon Continuous &amp; Stroboscopic</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[7.5px] uppercase">Topical Anesthesia</span>
              <span className="font-semibold text-slate-900">Topical 4% Lignocaine Spray</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[7.5px] uppercase">Patient Tolerance</span>
              <span className="font-semibold text-emerald-800">Good / Minimal Gag Reflex</span>
            </div>
          </div>

          {/* SECTION 9: STROBOSCOPIC EVALUATION TABLE (9 PARAMETERS FROM REFERENCE FORM) */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>9. Stroboscopic Evaluation of Voice (Standardized Laryngeal Matrix)</span>
              <span className="text-[8px] font-mono text-slate-500">STROBOSCOPY 1.0</span>
            </div>
            <div className="p-1.5 text-[9px]">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-amber-100/70 text-amber-950 font-black text-[8.5px] uppercase border-b border-slate-300">
                    <th className="py-1 px-2.5 w-1/3 border-r border-slate-300">Stroboscopic Parameter</th>
                    <th className="py-1 px-2.5">Clinical Findings &amp; Laryngeal Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[8.5px]">
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      1. Pathology
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyPathology || 'Bilateral symmetrical vocal cord nodules at the junction of anterior 1/3 and posterior 2/3 of vocal folds'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      2. Closure Pattern
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyClosurePattern || 'Hourglass glottic closure with persistent anterior and posterior triangular chink'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      3. Symmetry
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopySymmetry || 'Symmetrical bilateral phase timing and lateral excursion'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      4. Periodicity
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyPeriodicity || 'Regular and periodic vocal fold vibration under stroboscopic tracking'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      5. Amplitude
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyAmplitude || 'Mildly reduced bilaterally (< 50% of vocal fold membranous width)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      6. Mucosal Wave
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyMucosalWave || 'Reduced over the nodular apices bilaterally; preserved over adjacent membranous margins'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      7. Non-Vibratory Portion
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyNonVibratoryPortion || 'Small non-vibratory segment restricted to the nodular apices'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
                      8. Ventricular Folds
                    </td>
                    <td className="py-1 px-2.5 font-medium text-slate-900">
                      {params.stroboscopyVentricularFolds || 'Mild ventricular fold hyperadduction (mediolateral supraglottic constriction)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 font-bold text-slate-900 bg-slate-50 border-r border-slate-300">
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
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>10. Glottic Configuration &amp; Laryngeal Vibratory Reference</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 10.0</span>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2 text-center text-[8px]">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex flex-col items-center">
                <span className="font-bold text-slate-700 uppercase mb-1">A. Phonatory Adduction</span>
                <div className="w-20 h-16 border border-slate-300 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="w-1 h-12 bg-amber-600 rounded-full rotate-6 mr-0.5" />
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full absolute top-7 left-[34px]" />
                  <div className="w-1.5 h-1.5 bg-amber-900 rounded-full absolute top-7 right-[34px]" />
                  <div className="w-1 h-12 bg-amber-600 rounded-full -rotate-6 ml-0.5" />
                </div>
                <span className="text-slate-600 mt-1 font-medium">Hourglass Contact (Nodules)</span>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex flex-col items-center">
                <span className="font-bold text-slate-700 uppercase mb-1">B. Deep Abduction</span>
                <div className="w-20 h-16 border border-slate-300 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="w-1 h-12 bg-slate-400 rounded-full rotate-24 mr-2" />
                  <div className="w-1 h-12 bg-slate-400 rounded-full -rotate-24 ml-2" />
                </div>
                <span className="text-slate-600 mt-1 font-medium">Full Respiratory Opening</span>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded flex flex-col items-center">
                <span className="font-bold text-slate-700 uppercase mb-1">C. Mucosal Wave Dynamic</span>
                <div className="w-20 h-16 border border-slate-300 rounded bg-white flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-10 h-1.5 bg-amber-400 rounded-full" />
                    <div className="w-12 h-1.5 bg-amber-600 rounded-full" />
                    <div className="w-8 h-1.5 bg-amber-800 rounded-full" />
                  </div>
                </div>
                <span className="text-slate-600 mt-1 font-medium">Phase-Delayed Travelling Wave</span>
              </div>
            </div>
          </div>

          {/* SECTION 11: ENT LARYNGOLOGICAL IMPRESSION & MEDICAL PROTOCOL */}
          <div className="border border-slate-300 rounded overflow-hidden shrink-0">
            <div className="bg-slate-100 px-2.5 py-0.5 border-b border-slate-300 font-bold text-[9.5px] text-slate-900 uppercase flex items-center justify-between">
              <span>11. Laryngologist Impression &amp; Multidisciplinary Management</span>
              <span className="text-[8px] font-mono text-slate-500">SECTION 11.0</span>
            </div>
            <div className="p-2 bg-amber-50/30 text-[8.5px] space-y-1">
              <p className="text-slate-800 leading-relaxed font-medium">
                • <strong>Laryngeal Impression:</strong> Findings confirm early-stage bilateral soft vocal fold nodules without fibrotic remodeling. Suitable for non-surgical conservative intervention.
              </p>
              <p className="text-slate-800 leading-relaxed font-medium">
                • <strong>Medical Recommendation:</strong> Conservative voice therapy is the primary standard of care. Surgical micro-laryngeal excision is currently contraindicated. Proton-pump inhibitor (PPI) therapy indicated for LPR management. Repeat stroboscopy recommended in 6 weeks.
              </p>
            </div>
          </div>

          {/* DUAL ENT SPECIALIST & SLP VERIFICATION BAR */}
          <div className="bg-slate-50 border border-slate-300 rounded p-1.5 shrink-0 grid grid-cols-2 gap-4 text-[8.5px]">
            <div className="border-r border-slate-200 pr-2">
              <span className="font-bold text-slate-500 uppercase block text-[7.5px]">ENT Faculty / Consultant Laryngologist</span>
              <div className="mt-0.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{params.entFacultyName || 'Dr. A. P. Kulkarni, MS (ENT)'}</span>
                  <span className="text-[7.5px] text-slate-600 block">Consultant ENT Surgeon &amp; Laryngologist • Reg No: 84920</span>
                </div>
                <div className="border-b border-slate-400 w-24 text-center pb-0.5">
                  <span className="text-[7.5px] text-slate-800 font-serif italic font-bold">A. P. Kulkarni</span>
                </div>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase block text-[7.5px]">Head Audiologist &amp; Speech-Language Pathologist</span>
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
        {renderFooter(3)}
      </div>

    </div>
  );
};
