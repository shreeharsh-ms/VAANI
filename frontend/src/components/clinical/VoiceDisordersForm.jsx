import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  Wind,
  Volume2,
  Eye,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const VoiceDisordersForm = ({
  formData,
  handleParamChange,
  notify,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const params = formData.parameters || {};

  // Auto-calculate MPT Average
  const handleMPTChange = (field, val) => {
    const num = Number(val) || 0;
    handleParamChange(field, num);
    const a = field === 'mptA' ? num : Number(params.mptA || 0);
    const i = field === 'mptI' ? num : Number(params.mptI || 0);
    const u = field === 'mptU' ? num : Number(params.mptU || 0);
    const avg = Math.round(((a + i + u) / 3) * 10) / 10;
    handleParamChange('mptAverage', avg);
  };

  // Auto-calculate s/z ratio
  const handleSZChange = (field, val) => {
    const num = Number(val) || 0;
    handleParamChange(field, num);
    const s = field === 'sDuration' ? num : Number(params.sDuration || 0);
    const z = field === 'zDuration' ? num : Number(params.zDuration || 0);
    if (z > 0) {
      const ratio = Math.round((s / z) * 100) / 100;
      handleParamChange('szRatio', ratio);
    }
  };

  // Apply Clinical Presets
  const applyPreset = (presetKey) => {
    if (presetKey === 'nodules') {
      const nodulesPreset = {
        profession: 'High School Teacher (Vocal Professional)',
        chiefComplaint: 'Hoarseness of voice, throat pain, vocal fatigue worsening by evening, difficulty projecting voice in classroom',
        durationOfProblem: '6 Months',
        problemCourse: 'Progressive deterioration with increased teaching load',
        voiceSteadyOverDay: 'Unsteady (Worse in late afternoon/evening after 4-5 hours of teaching)',
        throatPainIrritation: 'Present (Dryness, burning sensation, and ache in larynx while speaking)',
        breathingPatternPosture: 'Clavicular shallow breathing; forward head posture during voice projection',
        sensoryProblems: 'Globus sensation (feeling of lump in throat), frequent throat clearing',
        coughColdHistory: 'Occasional upper respiratory tract infections; seasonal allergic rhinitis',
        vocalAbuseMisuse: 'Present (Speaking over ambient classroom noise, throat clearing, loud yelling during sports)',
        vocalLoadHours: '6 - 7 Hours/day of active continuous speaking',
        smokingDrinkingTobacco: 'Absent (Non-smoker, non-drinker)',
        pitchBreaksDiplophonia: 'Present (Frequent pitch breaks during sentence-final words, occasional diplophonia)',
        nasality: 'Normal oral-nasal resonance balance (No hyper/hyponasality)',
        priorSurgeryMedsTherapy: 'Prescribed proton-pump inhibitors (PPIs) for suspected LPR; no prior voice therapy or surgery',
        dailySchedule: '7:30 AM - 1:30 PM: Continuous classroom teaching (5 lectures); 2:30 PM - 5:00 PM: Private coaching; inadequate water intake (<1L/day)',
        spirometryInterpretation: 'FVC: 3.2 L (92% predicted), FEV1/FVC: 84% — Normal pulmonary respiratory mechanics',
        mptA: 9.2,
        mptI: 10.1,
        mptU: 9.5,
        mptAverage: 9.6,
        sDuration: 15.2,
        zDuration: 9.4,
        szRatio: 1.62,
        grbas_grade: 2,
        grbas_roughness: 2,
        grbas_breathiness: 1,
        grbas_asthenia: 0,
        grbas_strain: 2,
        buffaloLaryngealTone: 'Harsh, strained with mild breathiness',
        buffaloPitch: 'Slightly low pitch with reduced pitch flexibility',
        buffaloLoudness: 'Monoloudness; reduced dynamic vocal range',
        buffaloNasalResonance: 'Normal oral-nasal resonance balance',
        buffaloOverallRating: 'Moderately Dysphonic (Buffalo Voice Scale Grade 3)',
        capeV_overall: 48,
        capeV_roughness: 52,
        capeV_breathiness: 38,
        capeV_strain: 56,
        capeV_pitch: 20,
        capeV_loudness: 30,
        mdvpFindings: 'Mean F0: 208 Hz | Jitter (local): 2.14% (Elevated, norm <1.04%) | Shimmer (apq11): 5.42% (Elevated, norm <3.81%) | NHR: 0.218 (Elevated, norm <0.179)',
        vhiScore: 'VHI-10: 24/40 (Moderate Vocal Handicap; Physical: 10, Emotional: 8, Functional: 6)',
        recordingDate: '17/10/2026',
        recordingReference: 'KayPENTAX CSL 4500 / 44.1 kHz 24-bit WAV (REF: REC-VOI-2026-042)',
        stroboscopyPathology: 'Bilateral symmetrical vocal cord nodules located at the junction of anterior 1/3 and posterior 2/3 of true vocal folds',
        stroboscopyClosurePattern: 'Hourglass glottic closure pattern with persistent anterior and posterior triangular chink',
        stroboscopySymmetry: 'Symmetrical bilateral mucosal wave excursion in phase',
        stroboscopyPeriodicity: 'Periodic vocal fold vibration under stroboscopic tracking',
        stroboscopyAmplitude: 'Mildly reduced bilaterally (< 50% of vocal fold width)',
        stroboscopyMucosalWave: 'Reduced over the nodular apices bilaterally; normal over adjacent membranous margins',
        stroboscopyNonVibratoryPortion: 'Small non-vibratory segment restricted to nodular apices',
        stroboscopyVentricularFolds: 'Mild anteroposterior and ventricular fold hyperadduction (supraglottic hyperfunction)',
        stroboscopyOtherFindings: 'Mild posterior interarytenoid mucosal erythema consistent with laryngopharyngeal reflux (LPR)',
        entFacultyName: 'Dr. A. P. Kulkarni, MS (ENT), Consultant Laryngologist',
        clinicianName: 'A. Kulkarni (Clinical Speech Intern)',
        supervisorName: 'ASLP Palak Paresh Gandhi, BASLP, RCI',
      };
      Object.entries(nodulesPreset).forEach(([k, v]) => handleParamChange(k, v));
      notify?.('Loaded Vocal Fold Nodules Case Preset', 'success');
    } else if (presetKey === 'mtd') {
      const mtdPreset = {
        profession: 'Call Center Executive (Customer Support)',
        chiefComplaint: 'Vocal strain, neck tightness, voice cracking, loss of vocal power by mid-shift',
        durationOfProblem: '3 Months',
        problemCourse: 'Fluctuating with emotional stress and shift duration',
        voiceSteadyOverDay: 'Normal in morning, deteriorates rapidly after 2 hours on phone',
        throatPainIrritation: 'Severe muscular ache in anterior neck, tightness around hyoid bone',
        breathingPatternPosture: 'High thoracic breathing; elevated shoulders and jutting chin',
        sensoryProblems: 'Sore throat, choking sensation under conversational stress',
        coughColdHistory: 'Frequent clearing of throat; no recent infection',
        vocalAbuseMisuse: 'Speaking rapidly with glottal fry, prolonged headset usage (8 hrs/day)',
        vocalLoadHours: '7 - 8 Hours/day',
        smokingDrinkingTobacco: 'Absent',
        pitchBreaksDiplophonia: 'Frequent pitch breaks and vocal arrest',
        nasality: 'Slight hypernasality due to velopharyngeal tension',
        priorSurgeryMedsTherapy: 'None',
        dailySchedule: '9:00 AM - 6:00 PM: Inbound calls; high ambient noise; low water intake',
        spirometryInterpretation: 'Normal pulmonary mechanics (FVC 95%, FEV1/FVC 86%)',
        mptA: 11.4,
        mptI: 12.0,
        mptU: 11.2,
        mptAverage: 11.5,
        sDuration: 18.0,
        zDuration: 14.5,
        szRatio: 1.24,
        grbas_grade: 2,
        grbas_roughness: 1,
        grbas_breathiness: 1,
        grbas_asthenia: 0,
        grbas_strain: 3,
        buffaloLaryngealTone: 'Strained-strangled with hard glottal attacks',
        buffaloPitch: 'Elevated fundamental frequency under stress',
        buffaloLoudness: 'Uncontrolled vocal bursts with reduced softness range',
        buffaloNasalResonance: 'Mild pharyngeal resonance constriction',
        buffaloOverallRating: 'Moderately Dysphonic (Buffalo Grade 3 - Hyperfunctional)',
        capeV_overall: 54,
        capeV_roughness: 35,
        capeV_breathiness: 25,
        capeV_strain: 78,
        capeV_pitch: 45,
        capeV_loudness: 40,
        mdvpFindings: 'Mean F0: 245 Hz | Jitter: 1.45% | Shimmer: 3.90% | NHR: 0.162',
        vhiScore: 'VHI-10: 28/40 (Severe Functional Handicap)',
        recordingDate: '17/10/2026',
        recordingReference: 'REC-VOI-MTD-091',
        stroboscopyPathology: 'Normal true vocal fold margins; no organic mass lesions or nodules',
        stroboscopyClosurePattern: 'Complete glottic closure with marked supraglottic squeezing',
        stroboscopySymmetry: 'Symmetrical',
        stroboscopyPeriodicity: 'Regular',
        stroboscopyAmplitude: 'Normal',
        stroboscopyMucosalWave: 'Normal mucosal wave bilaterally',
        stroboscopyNonVibratoryPortion: 'None (100% vibratory margin)',
        stroboscopyVentricularFolds: 'Severe ventricular fold medial compression (False vocal cord approximation)',
        stroboscopyOtherFindings: 'Anteroposterior foreshortening of laryngeal inlet (Aryepiglottic constriction)',
        entFacultyName: 'Dr. A. P. Kulkarni, MS (ENT)',
        clinicianName: 'A. Kulkarni (Clinical Intern)',
        supervisorName: 'ASLP Palak Paresh Gandhi, BASLP, RCI',
      };
      Object.entries(mtdPreset).forEach(([k, v]) => handleParamChange(k, v));
      notify?.('Loaded Muscle Tension Dysphonia (MTD) Case Preset', 'success');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Sections' },
    { id: 'history', label: '1. History & Vocal Profile' },
    { id: 'aerodynamic', label: '2. Aerodynamics & GRBAS/Buffalo' },
    { id: 'acoustic', label: '3. Acoustic (MDVP) & VHI' },
    { id: 'stroboscopy', label: '4. Stroboscopic Evaluation (9 Matrix)' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Preset Toolbar */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-bold text-amber-950 text-xs uppercase tracking-wide">
            Voice Disorders Proforma (Bharati Vidyapeeth Protocol)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('nodules')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-900 border border-amber-300 rounded hover:bg-amber-100 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            Preset: Vocal Fold Nodules
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mtd')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-300 rounded hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
          >
            Preset: Muscle Tension Dysphonia (MTD)
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
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HISTORY & VOCAL PROFILE */}
      {(activeTab === 'all' || activeTab === 'history') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              1. Clinical Intake, Vocal History &amp; Occupational Schedule
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Page 1 Proforma</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Profession / Vocal Demand</label>
              <input
                type="text"
                value={params.profession || ''}
                onChange={(e) => handleParamChange('profession', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-semibold text-slate-900"
                placeholder="High School Teacher (Vocal Professional)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Duration of the Problem</label>
              <input
                type="text"
                value={params.durationOfProblem || ''}
                onChange={(e) => handleParamChange('durationOfProblem', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="6 Months"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">Chief Complaint</label>
            <textarea
              rows={2}
              value={params.chiefComplaint || ''}
              onChange={(e) => handleParamChange('chiefComplaint', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              placeholder="Hoarseness of voice, throat pain, vocal fatigue worsening by evening..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Problem Course</label>
              <select
                value={params.problemCourse || 'Progressive'}
                onChange={(e) => handleParamChange('problemCourse', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Static">Static</option>
                <option value="Progressive">Progressive</option>
                <option value="Fluctuating">Fluctuating</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Whether Voice is Steady Over the Day</label>
              <input
                type="text"
                value={params.voiceSteadyOverDay || ''}
                onChange={(e) => handleParamChange('voiceSteadyOverDay', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Unsteady (Worse in late afternoon/evening after teaching)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">C/o Irritation / Pain in Throat (Speaking / Swallowing)</label>
              <input
                type="text"
                value={params.throatPainIrritation || ''}
                onChange={(e) => handleParamChange('throatPainIrritation', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Present (Dryness, burning sensation, and ache in larynx while speaking)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Breathing Patterns &amp; Posture</label>
              <input
                type="text"
                value={params.breathingPatternPosture || ''}
                onChange={(e) => handleParamChange('breathingPatternPosture', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Clavicular shallow breathing; forward head posture during voice projection"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Any Other Sensory Problems (Globus Sensation, etc.)</label>
              <input
                type="text"
                value={params.sensoryProblems || ''}
                onChange={(e) => handleParamChange('sensoryProblems', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Globus sensation (feeling of lump in throat), frequent throat clearing"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">H/o Frequent Cough &amp; Cold or Voice Problem</label>
              <input
                type="text"
                value={params.coughColdHistory || ''}
                onChange={(e) => handleParamChange('coughColdHistory', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Occasional upper respiratory tract infections; seasonal allergic rhinitis"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">H/o Vocal Abuse / Misuse / Throat Clearing</label>
              <input
                type="text"
                value={params.vocalAbuseMisuse || ''}
                onChange={(e) => handleParamChange('vocalAbuseMisuse', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Present (Speaking over classroom noise, throat clearing)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Vocal Load (Voice Use) Per Day</label>
              <input
                type="text"
                value={params.vocalLoadHours || ''}
                onChange={(e) => handleParamChange('vocalLoadHours', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold text-purple-950"
                placeholder="6 - 7 Hours/day"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Smoking / Drinking / Tobacco</label>
              <select
                value={params.smokingDrinkingTobacco || 'Absent'}
                onChange={(e) => handleParamChange('smokingDrinkingTobacco', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Absent">Absent (Non-smoker, Non-drinker)</option>
                <option value="Present (Smoking)">Present (Smoking)</option>
                <option value="Present (Tobacco Chewing)">Present (Tobacco Chewing)</option>
                <option value="Present (Alcohol)">Present (Alcohol)</option>
                <option value="Present (Multiple)">Present (Multiple)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Pitch Breaks or Diplophonia</label>
              <input
                type="text"
                value={params.pitchBreaksDiplophonia || ''}
                onChange={(e) => handleParamChange('pitchBreaksDiplophonia', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Present (Pitch breaks during sentence-final syllables)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Nasality</label>
              <select
                value={params.nasality || 'Normal'}
                onChange={(e) => handleParamChange('nasality', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              >
                <option value="Normal">Normal</option>
                <option value="Hyper nasal">Hyper nasal</option>
                <option value="Hypo nasal">Hypo nasal</option>
                <option value="Mixed nasality">Mixed nasality</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">
              H/o Any Surgery / Medication / Therapy Earlier Taken for Voice Problem
            </label>
            <input
              type="text"
              value={params.priorSurgeryMedsTherapy || ''}
              onChange={(e) => handleParamChange('priorSurgeryMedsTherapy', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              placeholder="Prescribed proton-pump inhibitors (PPIs) for suspected LPR; no prior voice surgery"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">Daily Schedule &amp; Voice Demands</label>
            <input
              type="text"
              value={params.dailySchedule || ''}
              onChange={(e) => handleParamChange('dailySchedule', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              placeholder="7:30 AM - 1:30 PM: Classroom teaching; 2:30 PM - 5:00 PM: Private coaching"
            />
          </div>
        </div>
      )}

      {/* TAB 2: AERODYNAMICS & GRBAS/BUFFALO */}
      {(activeTab === 'all' || activeTab === 'aerodynamic') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              2. Aerodynamic Evaluation, Maximum Phonation Time &amp; Perceptual Scales
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Page 2 Proforma</span>
          </div>

          {/* Aerodynamics */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase block">Aerodynamic Evaluation</span>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Spirometry Interpretation</label>
              <input
                type="text"
                value={params.spirometryInterpretation || ''}
                onChange={(e) => handleParamChange('spirometryInterpretation', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                placeholder="FVC: 3.2 L (92% predicted), FEV1/FVC: 84% — Normal pulmonary respiratory mechanics"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">MPT /a/ (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.mptA ?? 9.2}
                  onChange={(e) => handleMPTChange('mptA', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">MPT /i/ (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.mptI ?? 10.1}
                  onChange={(e) => handleMPTChange('mptI', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">MPT /u/ (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.mptU ?? 9.5}
                  onChange={(e) => handleMPTChange('mptU', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-purple-950 block mb-1">Average MPT (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.mptAverage ?? 9.6}
                  readOnly
                  className="w-full px-2 py-1 text-center font-black text-purple-950 border border-purple-300 rounded bg-purple-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">/s/ Duration (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.sDuration ?? 15.2}
                  onChange={(e) => handleSZChange('sDuration', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">/z/ Duration (sec)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.zDuration ?? 9.4}
                  onChange={(e) => handleSZChange('zDuration', e.target.value)}
                  className="w-full px-2 py-1 text-center font-bold border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-rose-900 block mb-1">S/Z Ratio (Normal &le; 1.4)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.szRatio ?? 1.62}
                  readOnly
                  className="w-full px-2 py-1 text-center font-black text-rose-950 border border-rose-300 rounded bg-rose-50"
                />
              </div>
            </div>
          </div>

          {/* Perceptual Evaluation: GRBAS */}
          <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-2.5">
            <span className="text-xs font-bold text-amber-950 uppercase block">
              Perceptual Evaluation: GRBAS Scale (0 = Normal, 1 = Mild, 2 = Moderate, 3 = Severe)
            </span>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1 text-center">G (Grade)</label>
                <select
                  value={params.grbas_grade ?? 2}
                  onChange={(e) => handleParamChange('grbas_grade', Number(e.target.value))}
                  className="w-full px-2 py-1 text-center font-bold border border-amber-300 rounded bg-white"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1 (Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1 text-center">R (Roughness)</label>
                <select
                  value={params.grbas_roughness ?? 2}
                  onChange={(e) => handleParamChange('grbas_roughness', Number(e.target.value))}
                  className="w-full px-2 py-1 text-center font-bold border border-amber-300 rounded bg-white"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1 (Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1 text-center">B (Breathiness)</label>
                <select
                  value={params.grbas_breathiness ?? 1}
                  onChange={(e) => handleParamChange('grbas_breathiness', Number(e.target.value))}
                  className="w-full px-2 py-1 text-center font-bold border border-amber-300 rounded bg-white"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1 (Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1 text-center">A (Asthenia)</label>
                <select
                  value={params.grbas_asthenia ?? 0}
                  onChange={(e) => handleParamChange('grbas_asthenia', Number(e.target.value))}
                  className="w-full px-2 py-1 text-center font-bold border border-amber-300 rounded bg-white"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1 (Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1 text-center">S (Strain)</label>
                <select
                  value={params.grbas_strain ?? 2}
                  onChange={(e) => handleParamChange('grbas_strain', Number(e.target.value))}
                  className="w-full px-2 py-1 text-center font-bold border border-amber-300 rounded bg-white"
                >
                  <option value={0}>0 (Normal)</option>
                  <option value={1}>1 (Mild)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buffalo Voice Profile */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase block">Buffalo Voice Profile</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Laryngeal Tone</label>
                <input
                  type="text"
                  value={params.buffaloLaryngealTone || ''}
                  onChange={(e) => handleParamChange('buffaloLaryngealTone', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Harsh, strained with mild breathiness"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Pitch</label>
                <input
                  type="text"
                  value={params.buffaloPitch || ''}
                  onChange={(e) => handleParamChange('buffaloPitch', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Slightly low pitch with reduced pitch flexibility"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Loudness</label>
                <input
                  type="text"
                  value={params.buffaloLoudness || ''}
                  onChange={(e) => handleParamChange('buffaloLoudness', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Monoloudness; reduced dynamic vocal range"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Nasal Resonance</label>
                <input
                  type="text"
                  value={params.buffaloNasalResonance || ''}
                  onChange={(e) => handleParamChange('buffaloNasalResonance', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  placeholder="Normal oral-nasal resonance balance"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Overall Voice Rating</label>
              <input
                type="text"
                value={params.buffaloOverallRating || ''}
                onChange={(e) => handleParamChange('buffaloOverallRating', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold text-amber-950"
                placeholder="Moderately Dysphonic (Buffalo Voice Scale Grade 3)"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACOUSTIC (MDVP) & VHI */}
      {(activeTab === 'all' || activeTab === 'acoustic') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              3. Acoustic Analysis (MDVP), Self-Rating (VHI) &amp; Documentation
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Objective Laboratory</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">
              Acoustic Evaluation — MDVP Significant Findings
            </label>
            <input
              type="text"
              value={params.mdvpFindings || ''}
              onChange={(e) => handleParamChange('mdvpFindings', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono font-medium"
              placeholder="Mean F0: 208 Hz | Jitter (local): 2.14% | Shimmer (apq11): 5.42% | NHR: 0.218"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">Voice Handicap Index (VHI) Score</label>
            <input
              type="text"
              value={params.vhiScore || ''}
              onChange={(e) => handleParamChange('vhiScore', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-semibold text-slate-900"
              placeholder="VHI-10: 24/40 (Moderate Vocal Handicap; Physical: 10, Emotional: 8, Functional: 6)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Recording On (Date)</label>
              <input
                type="text"
                value={params.recordingDate || formData?.reportDate || '17/10/2026'}
                onChange={(e) => handleParamChange('recordingDate', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Recording Reference No.</label>
              <input
                type="text"
                value={params.recordingReference || ''}
                onChange={(e) => handleParamChange('recordingReference', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                placeholder="KayPENTAX CSL 4500 / 44.1 kHz 24-bit WAV (REF: REC-VOI-2026-042)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Student Clinician</label>
              <input
                type="text"
                value={params.clinicianName || ''}
                onChange={(e) => handleParamChange('clinicianName', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="A. Kulkarni (Clinical Intern)"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Supervising Staff</label>
              <input
                type="text"
                value={params.supervisorName || ''}
                onChange={(e) => handleParamChange('supervisorName', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-semibold text-purple-950"
                placeholder="ASLP Palak Paresh Gandhi, BASLP, RCI"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STROBOSCOPIC EVALUATION */}
      {(activeTab === 'all' || activeTab === 'stroboscopy') && (
        <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              4. Stroboscopic Evaluation of Voice (9 Laryngeal Parameters)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Page 3 Proforma</span>
          </div>

          <div className="space-y-2">
            {[
              { key: 'stroboscopyPathology', label: '1. Pathology', placeholder: 'Bilateral symmetrical vocal cord nodules at junction of anterior 1/3 and posterior 2/3' },
              { key: 'stroboscopyClosurePattern', label: '2. Closure Pattern', placeholder: 'Hourglass glottic closure pattern with persistent anterior and posterior triangular chink' },
              { key: 'stroboscopySymmetry', label: '3. Symmetry', placeholder: 'Symmetrical bilateral mucosal wave excursion in phase' },
              { key: 'stroboscopyPeriodicity', label: '4. Periodicity', placeholder: 'Periodic vocal fold vibration under stroboscopic tracking' },
              { key: 'stroboscopyAmplitude', label: '5. Amplitude', placeholder: 'Mildly reduced bilaterally (< 50% of vocal fold width)' },
              { key: 'stroboscopyMucosalWave', label: '6. Mucosal Wave', placeholder: 'Reduced over nodular apices bilaterally; normal over adjacent membranous margins' },
              { key: 'stroboscopyNonVibratoryPortion', label: '7. Non-Vibratory Portion', placeholder: 'Small non-vibratory segment restricted to nodular apices' },
              { key: 'stroboscopyVentricularFolds', label: '8. Ventricular Folds', placeholder: 'Mild anteroposterior and ventricular fold hyperadduction (supraglottic hyperfunction)' },
              { key: 'stroboscopyOtherFindings', label: '9. Other Findings', placeholder: 'Mild posterior interarytenoid mucosal erythema consistent with laryngopharyngeal reflux (LPR)' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-700 sm:col-span-1">{label}</span>
                <input
                  type="text"
                  value={params[key] || ''}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="sm:col-span-3 px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">ENT Faculty Signature / Name</label>
              <input
                type="text"
                value={params.entFacultyName || ''}
                onChange={(e) => handleParamChange('entFacultyName', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                placeholder="Dr. A. P. Kulkarni, MS (ENT), Consultant Laryngologist"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Evaluation Date</label>
              <input
                type="text"
                value={params.entEvaluationDate || formData?.reportDate || '17/10/2026'}
                onChange={(e) => handleParamChange('entEvaluationDate', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
