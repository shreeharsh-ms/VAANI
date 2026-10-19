import React from 'react';

/**
 * PatientDemographicsMatrix
 * Unified Patient Information Matrix for all VAANI Clinical Reports.
 * Standardized after the Audiological Evaluation official letterhead proforma:
 * - 3-column / multi-row responsive grid
 * - Royal Purple labels (`text-purple-950 font-bold`)
 * - Deep slate / black patient values (`text-slate-900 font-semibold`, `text-slate-950 font-black text-[11px]`)
 * - Clean purple border lines (`border-purple-300 divide-purple-200 border-purple-200`)
 * - Lavender/white frosted card backdrop (`bg-white/85 backdrop-blur-2xs shadow-2xs rounded-lg`)
 */
export const PatientDemographicsMatrix = ({
  formData,
  patient,
  refLabel = 'PTA No. :',
  refValue = '',
  extraRow = null,
  className = '',
}) => {
  const patientName = patient?.full_name || patient?.name || '—';
  const patientUhid = patient?.uhid || patient?.id || formData?.reportNumber || '—';
  
  // Format Age and Sex consistently
  const formatAgeSex = () => {
    const age = patient?.age ? `${patient.age} Y` : patient?.date_of_birth ? patient.date_of_birth : '—';
    const rawGender = patient?.gender || '';
    const gender = rawGender.toUpperCase() === 'MALE' ? 'Male' : rawGender.toUpperCase() === 'FEMALE' ? 'Female' : rawGender || '—';
    return `${age} / ${gender}`;
  };

  const reportDate = formData?.reportDate || new Date().toISOString().split('T')[0];

  return (
    <div className={`border border-purple-300 rounded-lg overflow-hidden text-[10px] bg-white/85 backdrop-blur-2xs shadow-2xs shrink-0 select-none ${className}`}>
      {/* Row 1: Date | Reg. No. | Proforma/PTA Reference */}
      <div className="grid grid-cols-3 divide-x divide-purple-200 border-b border-purple-200">
        <div className="p-1 px-2.5 flex items-center min-w-0">
          <span className="font-bold mr-1.5 shrink-0 whitespace-nowrap text-purple-950">Date :</span>
          <span className="font-semibold text-slate-900 truncate">{reportDate}</span>
        </div>
        <div className="p-1 px-2.5 flex items-center min-w-0">
          <span className="font-bold mr-1.5 shrink-0 whitespace-nowrap text-purple-950">Reg. No. :</span>
          <span className="font-mono font-bold text-slate-900 truncate">{patientUhid}</span>
        </div>
        <div className="p-1 px-2.5 flex items-center min-w-0">
          <span className="font-bold mr-1.5 shrink-0 whitespace-nowrap text-purple-950">{refLabel}</span>
          <span className="font-mono font-bold text-purple-900 truncate">
            {refValue || formData?.reportNumber || '—'}
          </span>
        </div>
      </div>

      {/* Row 2: Name of Patient (col-span-2) | Age/Sex */}
      <div className={`grid grid-cols-3 divide-x divide-purple-200 ${extraRow ? 'border-b border-purple-200' : ''}`}>
        <div className="p-1 px-2.5 flex items-center col-span-2 min-w-0">
          <span className="font-bold mr-2 shrink-0 whitespace-nowrap text-purple-950">Name of Patient :</span>
          <span className="font-black text-slate-950 text-[11px] truncate">{patientName}</span>
        </div>
        <div className="p-1 px-2.5 flex items-center min-w-0">
          <span className="font-bold mr-1.5 shrink-0 whitespace-nowrap text-purple-950">Age/Sex :</span>
          <span className="font-semibold text-slate-900 truncate">{formatAgeSex()}</span>
        </div>
      </div>

      {/* Row 3: Optional Clinical / Specialty Context Row */}
      {extraRow}
    </div>
  );
};

export default PatientDemographicsMatrix;
