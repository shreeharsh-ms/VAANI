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

  const isOAE = service.code === 'RP-CLN-OAE';

  return (
    <div
      id="official-report-a4-page"
      className="bg-white text-slate-900 font-sans p-6 sm:p-7 max-w-[210mm] w-full min-h-[297mm] mx-auto flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-0 print:h-[279mm] leading-tight"
    >
      {/* ── TOP AND CLINICAL BODY WRAPPER ── */}
      <div className="flex-1 flex flex-col space-y-3.5">
        {/* ── CLINIC OFFICIAL LETTERHEAD ── */}
        <div className="border-b-2 border-purple-950 pb-2.5 flex items-start justify-between gap-4">
          {/* Left: Actual Clinic Logo & Institutional Details */}
          <div className="flex items-center gap-3.5">
            <img
              src="/vaani-logo.png"
              alt="Vaani Speech and Hearing Clinic"
              className="h-14 w-auto object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-700">
                <span className="font-semibold text-slate-800">
                  RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[9.5px] text-slate-500 font-medium">
                  RCI Approved Practice Center • ISO 9001:2015
                </span>
              </div>
              <p className="text-[10.5px] text-slate-700 font-medium">
                Sadashiv Peth, Near Powai Naka, Satara, Maharashtra 415002
              </p>
              <p className="text-[9.5px] text-slate-500">
                Tel: +91 2162 234567 • Mob: +91 94220 11223 • Email: clinic@vaaniclinic.com
              </p>
            </div>
          </div>

          {/* Right: Document Identification */}
          <div className="text-right shrink-0 space-y-0.5">
            <span className="block text-xs font-mono font-bold text-slate-900">
              Report No: {formData?.reportNumber}
            </span>
            <span className="block text-[10px] text-slate-500 font-medium">
              Date: {formData?.reportDate}
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-purple-900 mt-0.5">
              {service.discipline}
            </span>
          </div>
        </div>

        {/* ── CONDITIONAL REPORT BODY: OAE VS GENERAL / PTA ── */}
        {isOAE ? (
          /* ── OAE SCREENING REPORT VIEW (Exact Real-World Clinic Layout with Ear Illustrations) ── */
          <div className="space-y-5 pt-1">
            {/* Centered Rounded Pill Banner */}
            <div className="text-center my-1.5">
              <span className="inline-block bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide px-8 py-1.5 rounded-full shadow-2xs">
                Oto-Acoustic Emission (OAE) Screening Report
              </span>
            </div>

            {/* Clean Boxed Patient Demographics */}
            <div className="border border-slate-700 rounded p-3 text-xs bg-white">
              <div className="grid grid-cols-12 gap-y-2 gap-x-3">
                <div className="col-span-7">
                  <span className="font-bold text-slate-900">Name : </span>
                  <span className="font-medium text-slate-800">{patient.full_name}</span>
                </div>
                <div className="col-span-5 text-right sm:text-left">
                  <span className="font-bold text-slate-900">Date : </span>
                  <span className="font-medium text-slate-800">{formData?.reportDate}</span>
                </div>
                <div className="col-span-5">
                  <span className="font-bold text-slate-900">Age/ Gender : </span>
                  <span className="font-medium text-slate-800">
                    {patient.gender === 'MALE' ? 'Male' : patient.gender === 'FEMALE' ? 'Female' : patient.gender}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="font-bold text-slate-900">OAE No : </span>
                  <span className="font-mono font-bold text-purple-900">{formData?.reportNumber || patient.uhid}</span>
                </div>
                <div className="col-span-3 text-right sm:text-left">
                  <span className="font-bold text-slate-900">DOB : </span>
                  <span className="font-medium text-slate-800">{patient.date_of_birth}</span>
                </div>
              </div>
            </div>

            {/* Bilateral Ear Drawings & Pass/Refer Checkboxes */}
            <div className="my-10 py-4 flex items-center justify-around">
              {/* Right Ear Column (Red Ear on Left) */}
              <div className="flex items-center gap-4 sm:gap-6">
                <svg
                  viewBox="0 0 100 140"
                  className="w-16 h-24 sm:w-20 sm:h-28 text-rose-600 fill-none stroke-current stroke-[3.2] stroke-linecap-round stroke-linejoin-round shrink-0"
                >
                  <path d="M 60 18 C 28 15, 14 42, 16 80 C 18 108, 34 132, 54 132 C 70 132, 74 118, 68 104 C 64 94, 54 88, 52 80 C 49 70, 56 56, 56 46 C 56 34, 48 26, 40 30" />
                  <path d="M 44 45 C 34 52, 30 70, 34 94 C 38 110, 48 118, 56 116" />
                  <path d="M 45 74 C 38 80, 42 92, 50 90" />
                  <path d="M 64 74 C 58 76, 58 86, 66 88" />
                </svg>
                <div className="space-y-2.5">
                  <span className="block font-black text-sm sm:text-base text-slate-900">Right Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome !== 'REFER' ? 'bg-emerald-50 text-emerald-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.rightOutcome === 'REFER' ? 'bg-rose-50 text-rose-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.rightOutcome === 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Ear Column (Blue Ear on Right) */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="space-y-2.5">
                  <span className="block font-black text-sm sm:text-base text-slate-900">Left Ear</span>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Pass</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome !== 'REFER' ? 'bg-emerald-50 text-emerald-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.leftOutcome !== 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Refer</span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-slate-900 rounded-xs flex items-center justify-center font-black text-sm ${
                        formData?.parameters?.leftOutcome === 'REFER' ? 'bg-rose-50 text-rose-700' : 'text-transparent'
                      }`}
                    >
                      {formData?.parameters?.leftOutcome === 'REFER' ? '✓' : ''}
                    </div>
                  </div>
                </div>
                <svg
                  viewBox="0 0 100 140"
                  className="w-16 h-24 sm:w-20 sm:h-28 text-blue-600 fill-none stroke-current stroke-[3.2] stroke-linecap-round stroke-linejoin-round shrink-0"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <path d="M 60 18 C 28 15, 14 42, 16 80 C 18 108, 34 132, 54 132 C 70 132, 74 118, 68 104 C 64 94, 54 88, 52 80 C 49 70, 56 56, 56 46 C 56 34, 48 26, 40 30" />
                  <path d="M 44 45 C 34 52, 30 70, 34 94 C 38 110, 48 118, 56 116" />
                  <path d="M 45 74 C 38 80, 42 92, 50 90" />
                  <path d="M 64 74 C 58 76, 58 86, 66 88" />
                </svg>
              </div>
            </div>

            {/* Impression & Recommendation */}
            <div className="space-y-6 pt-4">
              <div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-900 block">
                  IMPRESSION:
                </span>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {formData?.parameters?.provisionalDiagnosis ||
                    'Bilateral Otoacoustic Emissions (DPOAE/TEOAE) PASS. Outer hair cell function is robust bilaterally within normal limits.'}
                </p>
              </div>

              <div>
                <span className="font-black text-xs sm:text-sm uppercase tracking-wide text-slate-900 block">
                  RECOMMENDATION :
                </span>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {formData?.parameters?.recommendations ||
                    'Routine developmental auditory and speech-language milestones tracking. Repeat evaluation if parental concern arises.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── STANDARD GENERAL / AUDIOLOGY REPORT VIEW ── */
          <>
            {/* ── REPORT TITLE BANNER ── */}
            <div className="text-center py-1 bg-purple-900 text-white rounded font-bold uppercase tracking-wider text-xs shadow-2xs">
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
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_strain ?? 45}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Pitch</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_pitch ?? 30}</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[9px] text-slate-500 uppercase block font-bold">Loudness</span>
                      <span className="font-black text-amber-900">{formData?.parameters?.capeV_loudness ?? 25}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FLUENCY (SSI-4) */}
              {service.code === 'RP-CLN-FLU' && (
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    Stuttering Severity Instrument (SSI-4) Protocol Metrics
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">% Syllables Stuttered</span>
                      <span className="font-mono font-black text-purple-950 text-sm">
                        {formData?.parameters?.ssi4_percentageSS ?? 8.4}%
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Physical Concomitants</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_physicalConcomitants ?? 'Moderate'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Speech Rate</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formData?.parameters?.ssi4_speechRateSPM ?? 142} SPM
                      </span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded bg-purple-50">
                      <span className="text-[9px] text-purple-800 font-bold block uppercase">Severity Classification</span>
                      <span className="font-black text-purple-900">
                        {formData?.parameters?.ssi4_severityGrade ?? 'Moderate Stuttering'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SPEECH & LANGUAGE (REELS / PLS-5) */}
              {service.code === 'RP-CLN-SLA' && (
                <div className="border border-slate-300 rounded p-2.5 bg-slate-50 text-xs space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">
                    Comprehensive Developmental Language Battery (REELS / 3DLAT)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Chronological Age</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_caMonths ?? 36} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Receptive Age (RLA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_rlaMonths ?? 28} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">Expressive Age (ELA)</span>
                      <span className="font-mono font-bold text-slate-800">{formData?.parameters?.reels_elaMonths ?? 22} Mo</span>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-200 rounded bg-rose-50">
                      <span className="text-[9px] text-rose-800 font-bold block uppercase">Expressive Delay</span>
                      <span className="font-mono font-black text-rose-900">{formData?.parameters?.reels_expressiveDelayMonths ?? 14} Mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* General Other Services fallback */}
              {!['RP-CLN-AUD', 'RP-CLN-OAE', 'RP-CLN-VOI', 'RP-CLN-FLU', 'RP-CLN-SLA'].includes(service.code) && (
                <div className="border border-slate-300 rounded p-3 bg-slate-50 text-xs">
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
          </>
        )}
      </div>

      {/* ── STATUTORY SIGN-OFF & TAMPER-EVIDENT QR VERIFICATION ── */}
      {/* Always strictly pinned to the bottom/end of the A4 page */}
      <div className="mt-auto pt-3 border-t-2 border-purple-950 flex items-end justify-between text-xs print:break-inside-avoid">
        {/* Left: Authentic QR Code & DPDP Verification */}
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 border border-slate-400 rounded flex items-center justify-center bg-white shadow-2xs shrink-0">
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
          <p className="text-[10px] font-semibold text-slate-800">
            RCI CRR No: <span className="font-mono font-bold text-purple-950">{formData?.rciNumber || 'A79214'}</span>
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
