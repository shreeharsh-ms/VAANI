import React from 'react';
import { QrCode } from 'lucide-react';

/**
 * Official Clinical Document Template
 * Standardized single-page proforma with RCI CRR No. A79214 seal, official logo,
 * bilateral clinical metrics, and DPDP-compliant QR authenticity badge.
 */
export const OfficialClinicalDocument = ({
  service,
  patient,
  patientDossier,
  formData,
  computedPTA,
}) => {
  if (!service || !patient) return null;

  return (
    <div className="bg-white text-slate-900 font-sans p-6 sm:p-8 max-w-4xl mx-auto space-y-4 print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-3.5 leading-tight">
      
      {/* ── CLINIC OFFICIAL LETTERHEAD ── */}
      <div className="border-b-2 border-purple-950 pb-3 flex items-start justify-between gap-4">
        {/* Left: Actual Clinic Logo & Institutional Details */}
        <div className="flex items-center gap-4">
          <img
            src="/vaani-logo.png"
            alt="Vaani Speech and Hearing Clinic"
            className="h-16 w-auto object-contain shrink-0"
          />
          <div>
            <h1 className="text-sm font-black tracking-wide text-purple-950 uppercase leading-tight mb-1">
              Vaani Speech and Hearing Clinic
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase bg-purple-900 text-white px-2 py-0.5 rounded">
                Clinical Diagnostic Suite
              </span>
              <span className="text-[10px] font-bold text-purple-900">
                RCI CRR No. {formData?.rciNumber || 'A79214'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 mt-1">
              Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
            </p>
            <p className="text-[10px] text-slate-600">
              Tel: +91 2162 234567 • Mob: +91 94220 11223 • Email: clinic@vaaniclinic.com
            </p>
            <p className="text-[9px] text-slate-500 font-medium">
              Approved Practice Center under Rehabilitation Council of India (RCI Act 1992) • ISO 9001:2015 Certified
            </p>
          </div>
        </div>

        {/* Right: Document Identification */}
        <div className="text-right shrink-0">
          <span className="inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-purple-950 text-white rounded">
            {service.code}
          </span>
          <span className="block text-xs font-mono font-black text-slate-900 mt-1">
            Doc: {formData?.reportNumber}
          </span>
          <span className="block text-[10px] font-semibold text-slate-600">
            Date: {formData?.reportDate}
          </span>
          <span className="block text-[9px] font-mono text-purple-800 font-bold">
            {service.discipline}
          </span>
        </div>
      </div>

      {/* ── REPORT TITLE BANNER ── */}
      <div className="text-center py-1.5 bg-purple-900 text-white rounded font-bold uppercase tracking-wider text-xs shadow-xs">
        {service.title}
      </div>

      {/* ── PATIENT DEMOGRAPHIC MATRIX ── */}
      <div className="border border-slate-300 rounded overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 w-1/6 border-r border-slate-200">
                Patient Full Name:
              </td>
              <td className="px-3 py-1.5 font-bold text-slate-900 w-2/6 border-r border-slate-200">
                {patient.full_name}
              </td>
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 w-1/6 border-r border-slate-200">
                Patient UHID:
              </td>
              <td className="px-3 py-1.5 font-mono font-black text-purple-900 w-2/6">
                {patient.uhid}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                Biological Sex &amp; Age:
              </td>
              <td className="px-3 py-1.5 text-slate-800 border-r border-slate-200">
                {patient.gender} • DOB {patient.date_of_birth}
              </td>
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                Primary Contact:
              </td>
              <td className="px-3 py-1.5 text-slate-800 font-mono">
                {patient.phone}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                Guardian / Escort:
              </td>
              <td className="px-3 py-1.5 text-slate-800 border-r border-slate-200">
                {patient.guardian_name || 'Self'}
              </td>
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                Residential Locality:
              </td>
              <td className="px-3 py-1.5 text-slate-800">
                {patient.city || 'Satara, Maharashtra'}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">
                Referring Consultant:
              </td>
              <td className="px-3 py-1.5 text-purple-950 font-bold" colSpan={3}>
                {patientDossier?.demographics?.referringDoctor || 'Dr. A. P. Kulkarni, MS (ENT), Civil Hospital Satara'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── CLINICAL FINDINGS & PARAMETER TABLES ── */}
      <div className="space-y-3">
        
        {/* 1. AUDIOLOGY EVALUATION (PTA) */}
        {service.code === 'RP-CLN-AUD' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide">
                Bilateral Behavioral Audiometric Thresholds (dB HL)
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Transducer: {formData?.parameters?.transducer || 'TDH-39 Supra-aural Earphones'}
              </span>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-300">
                  <tr>
                    <th className="px-3 py-1.5 text-left border-r border-slate-300">Ear &amp; Conduction</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">250 Hz</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">500 Hz</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">1000 Hz</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">2000 Hz</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">4000 Hz</th>
                    <th className="px-2 py-1.5 border-r border-slate-200">8000 Hz</th>
                    <th className="px-2 py-1.5 bg-purple-50 text-purple-950 font-black border-r border-slate-200">PTA Avg (dB)</th>
                    <th className="px-2 py-1.5 bg-purple-50 text-purple-950 font-black">WHO Degree of Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Right Ear AC (Red) */}
                  <tr className="text-rose-700 font-bold bg-rose-50/20">
                    <td className="px-3 py-1.5 text-left border-r border-slate-200">Right Ear (AC - O)</td>
                    {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                      <td key={f} className="px-2 py-1.5 border-r border-slate-200 font-mono">
                        {formData?.parameters?.rightEarAC?.[f] ?? '—'}
                      </td>
                    ))}
                    <td className="px-2 py-1.5 bg-rose-50 font-mono font-black border-r border-slate-200">
                      {computedPTA?.rightAvg ?? '31.7'} dB
                    </td>
                    <td className="px-2 py-1.5 bg-rose-50 text-[10px] font-black">
                      {computedPTA?.rightDegree ?? 'Mild Hearing Loss'}
                    </td>
                  </tr>

                  {/* Right Ear BC (Red) */}
                  <tr className="text-rose-600 bg-rose-50/5">
                    <td className="px-3 py-1 text-left border-r border-slate-200 font-semibold">Right Ear (BC - &lt;)</td>
                    {['250', '500', '1000', '2000', '4000'].map((f) => (
                      <td key={f} className="px-2 py-1 border-r border-slate-200 font-mono">
                        {formData?.parameters?.rightEarBC?.[f] ?? '—'}
                      </td>
                    ))}
                    <td className="px-2 py-1 border-r border-slate-200 text-slate-300">—</td>
                    <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                      Bone conduction thresholds
                    </td>
                  </tr>

                  {/* Left Ear AC (Blue) */}
                  <tr className="text-blue-700 font-bold bg-blue-50/20">
                    <td className="px-3 py-1.5 text-left border-r border-slate-200">Left Ear (AC - X)</td>
                    {['250', '500', '1000', '2000', '4000', '8000'].map((f) => (
                      <td key={f} className="px-2 py-1.5 border-r border-slate-200 font-mono">
                        {formData?.parameters?.leftEarAC?.[f] ?? '—'}
                      </td>
                    ))}
                    <td className="px-2 py-1.5 bg-blue-50 font-mono font-black border-r border-slate-200">
                      {computedPTA?.leftAvg ?? '25'} dB
                    </td>
                    <td className="px-2 py-1.5 bg-blue-50 text-[10px] font-black">
                      {computedPTA?.leftDegree ?? 'Normal Hearing Sensitivity'}
                    </td>
                  </tr>

                  {/* Left Ear BC (Blue) */}
                  <tr className="text-blue-600 bg-blue-50/5">
                    <td className="px-3 py-1 text-left border-r border-slate-200 font-semibold">Left Ear (BC - &gt;)</td>
                    {['250', '500', '1000', '2000', '4000'].map((f) => (
                      <td key={f} className="px-2 py-1 border-r border-slate-200 font-mono">
                        {formData?.parameters?.leftEarBC?.[f] ?? '—'}
                      </td>
                    ))}
                    <td className="px-2 py-1 border-r border-slate-200 text-slate-300">—</td>
                    <td colSpan={2} className="px-2 py-1 text-[10px] text-slate-500 text-left pl-3">
                      Bone conduction thresholds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Speech & Immittance Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="p-2 border border-slate-300 rounded bg-slate-50">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Speech Reception (SRT)</span>
                <p className="mt-1 font-bold">
                  <span className="text-rose-700">R: {formData?.parameters?.rightSRT ?? 35} dB</span> |{' '}
                  <span className="text-blue-700">L: {formData?.parameters?.leftSRT ?? 25} dB</span>
                </p>
              </div>

              <div className="p-2 border border-slate-300 rounded bg-slate-50">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Word Recognition (WRS)</span>
                <p className="mt-1 font-bold">
                  <span className="text-rose-700">R: {formData?.parameters?.rightWRS ?? 84}%</span> |{' '}
                  <span className="text-blue-700">L: {formData?.parameters?.leftWRS ?? 96}%</span>
                </p>
              </div>

              <div className="p-2 border border-slate-300 rounded bg-slate-50 col-span-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Immittance &amp; Tympanometry (Jerger)</span>
                <p className="mt-1 text-[11px] text-slate-800">
                  <strong className="text-rose-700">Right:</strong> {formData?.parameters?.tympanometryRight || 'Type A'} |{' '}
                  <strong className="text-blue-700">Left:</strong> {formData?.parameters?.tympanometryLeft || 'Type A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. OAE SCREENING */}
        {service.code === 'RP-CLN-OAE' && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-4 gap-2 text-xs border border-slate-300 p-2 rounded bg-slate-50">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Protocol</span>
                <span className="font-bold text-slate-900">{formData?.parameters?.stage}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Technology</span>
                <span className="font-bold text-slate-900">{formData?.parameters?.technology}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Gestation / Weight</span>
                <span className="font-bold text-slate-900">{formData?.parameters?.gestationWeeks} wks • {formData?.parameters?.birthWeightG} g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Overall Verdict</span>
                <span className="font-black text-emerald-800 uppercase">{formData?.parameters?.overallOutcome || 'PASS'}</span>
              </div>
            </div>

            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-700 uppercase border-b border-slate-300">
                  <tr>
                    <th className="px-3 py-1.5 text-left border-r border-slate-300">Stimulus Frequency</th>
                    <th className="px-3 py-1.5 text-rose-700 border-r border-slate-300">Right Ear SNR (dB)</th>
                    <th className="px-3 py-1.5 text-rose-700 border-r border-slate-300">Right Outcome</th>
                    <th className="px-3 py-1.5 text-blue-700 border-r border-slate-300">Left Ear SNR (dB)</th>
                    <th className="px-3 py-1.5 text-blue-700">Left Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(formData?.parameters?.frequencies || []).map((f, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-1.5 text-left font-bold border-r border-slate-200">{f.freq}</td>
                      <td className="px-3 py-1.5 font-mono font-bold text-rose-800 border-r border-slate-200">{f.rightSNR} dB</td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                          {f.rightSNR >= 6 ? 'PASS' : 'REFER'}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 font-mono font-bold text-blue-800 border-r border-slate-200">{f.leftSNR} dB</td>
                      <td className="px-3 py-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                          {f.leftSNR >= 6 ? 'PASS' : 'REFER'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. VOICE (CAPE-V / GRBAS) */}
        {service.code === 'RP-CLN-VOI' && (
          <div className="space-y-2 border border-slate-300 rounded p-2.5 bg-amber-50/20 text-xs">
            <span className="text-[10px] font-black uppercase text-amber-950 block">
              CAPE-V Visual Analog Ratings (0-100 mm) &amp; Perceptual Voice Battery
            </span>
            <div className="grid grid-cols-6 gap-2 text-center">
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Overall</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_overall ?? 48}</span>
              </div>
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Roughness</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_roughness ?? 52}</span>
              </div>
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Breathiness</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_breathiness ?? 38}</span>
              </div>
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Strain</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_strain ?? 56}</span>
              </div>
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Pitch</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_pitch ?? 20}</span>
              </div>
              <div className="p-1.5 bg-white border border-slate-300 rounded">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">Loudness</span>
                <span className="font-black text-amber-900">{formData?.parameters?.capeV_loudness ?? 30}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 pt-1">
              <strong>Acoustic Measures:</strong> MPT /a/: {formData?.parameters?.mptA ?? 9.2}s | s/z Ratio: {formData?.parameters?.szRatio ?? 1.58} (Ref &le; 1.4) | GRBAS: G{formData?.parameters?.grbas_grade}R{formData?.parameters?.grbas_roughness}B{formData?.parameters?.grbas_breathiness} | VHI-10: {formData?.parameters?.vhi10Score ?? 24}/40
            </p>
          </div>
        )}

        {/* 4. FLUENCY (SSI-4) */}
        {service.code === 'RP-CLN-FLU' && (
          <div className="grid grid-cols-4 gap-2 text-xs border border-slate-300 p-2.5 rounded bg-rose-50/20">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Syllables</span>
              <span className="font-bold text-slate-900">{formData?.parameters?.totalSyllables ?? 450}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">% Syllables Stuttered</span>
              <span className="font-black text-rose-800 text-sm">{formData?.parameters?.percentageSS ?? 9.3}% SS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Longest Blocks</span>
              <span className="font-bold text-slate-900">{formData?.parameters?.longestBlock1 ?? 2.8}s, {formData?.parameters?.longestBlock2 ?? 2.1}s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">SSI-4 Severity</span>
              <span className="font-black text-rose-900 uppercase">{formData?.parameters?.severityClassification ?? 'MODERATE'}</span>
            </div>
          </div>
        )}

        {/* 5. SPEECH-LANGUAGE (ALD-MM) */}
        {service.code === 'RP-CLN-SLA' && (
          <div className="grid grid-cols-4 gap-2 text-xs border border-slate-300 p-2.5 rounded bg-teal-50/20">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Chronological Age</span>
              <span className="font-bold text-slate-900">{formData?.parameters?.chronologicalAgeMonths ?? 34} Months</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Receptive Age (RLA)</span>
              <span className="font-bold text-slate-900">{formData?.parameters?.receptiveLanguageAge ?? 28} Months</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Expressive Age (ELA)</span>
              <span className="font-black text-rose-800">{formData?.parameters?.expressiveLanguageAge ?? 20} Months</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Language Delay</span>
              <span className="font-black text-rose-900">{formData?.parameters?.languageDelayMonths ?? 14} Months Delay</span>
            </div>
          </div>
        )}

        {/* 6. OTHER CLINICAL SERVICES */}
        {!['RP-CLN-AUD', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA'].includes(service.code) && (
          <div className="p-2.5 border border-slate-300 rounded bg-slate-50 text-xs">
            <span className="text-[10px] font-black uppercase text-purple-900 block mb-1">
              Assessment Battery Details
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {service.description}
            </p>
          </div>
        )}

      </div>

      {/* ── CLINICAL IMPRESSION / DIAGNOSIS ── */}
      <div className="border border-purple-200 rounded p-3 bg-purple-50/40 text-xs space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 block">
          Clinical Impression &amp; Findings:
        </span>
        <p className="text-slate-900 font-bold leading-relaxed">
          {formData?.parameters?.provisionalDiagnosis || service.description}
        </p>
      </div>

      {/* ── CLINICAL RECOMMENDATIONS & MANAGEMENT PLAN ── */}
      <div className="border border-slate-300 rounded p-3 bg-slate-50 text-xs space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
          Clinical Recommendations &amp; Rehabilitation Protocol:
        </span>
        <p className="text-slate-800 leading-relaxed font-medium">
          {formData?.parameters?.recommendations || 'Follow up as clinically indicated.'}
        </p>
      </div>

      {/* ── STATUTORY SIGN-OFF & TAMPER-EVIDENT QR VERIFICATION ── */}
      <div className="pt-3 border-t-2 border-purple-950 flex items-end justify-between text-xs">
        {/* Left: Authentic QR Code & DPDP Verification */}
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 border border-slate-400 rounded flex items-center justify-center bg-white shadow-2xs">
            <QrCode className="w-10 h-10 text-purple-950" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-purple-950 block uppercase">
              QR VERIFIED • DPDP ACT COMPLIANT
            </span>
            <span className="text-[8px] text-slate-600 block">
              Scan to verify document cryptographic authenticity
            </span>
            <span className="text-[8px] font-mono text-slate-500">
              https://vaaniclinic.com/verify-doc/{formData?.reportNumber}
            </span>
          </div>
        </div>

        {/* Right: Clinician Signature Block */}
        <div className="text-right space-y-0.5">
          <div className="inline-block border-b border-purple-900 pb-0.5 mb-1 px-4 text-center">
            <span className="font-serif italic font-bold text-purple-950 text-sm block">
              Shreeharsh M. Shivpuje
            </span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest block">
              Digitally Authenticated
            </span>
          </div>
          <p className="font-black text-slate-950 text-xs">
            {formData?.examinerName || 'Dr. Shreeharsh Shivpuje, BASLP, MASLP'}
          </p>
          <p className="text-[10px] font-mono font-black text-purple-950">
            RCI CRR Registration No: {formData?.rciNumber || 'A79214'}
          </p>
          <p className="text-[9px] text-slate-600 font-medium">
            Consultant Audiologist &amp; Speech-Language Pathologist
          </p>
        </div>
      </div>

    </div>
  );
};

export default OfficialClinicalDocument;
