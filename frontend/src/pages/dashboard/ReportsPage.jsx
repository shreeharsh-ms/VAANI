import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, CheckCircle, Search, Eye } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { clinicService } from '../../services/clinicService';
import { useNotification } from '../../context/NotificationContext';

export const ReportsPage = () => {
  const { notify } = useNotification();
  const [assessments, setAssessments] = useState([]);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    clinicService.getClinicalAssessments().then(setAssessments).catch(() => {});
  }, []);

  const templates = [
    { name: 'Pure Tone & Speech Audiogram (PTA)', code: 'FR-REP-001', discipline: 'Audiology' },
    { name: 'Otoacoustic Emissions (OAE) Screening', code: 'FR-REP-002', discipline: 'Audiology' },
    { name: 'Comprehensive Speech-Language Battery', code: 'FR-REP-003', discipline: 'Speech Therapy' },
    { name: 'Stuttering Severity Instrument (SSI-4)', code: 'FR-REP-004', discipline: 'Fluency' },
    { name: 'Voice Assessment Proforma (GRBAS / MPT)', code: 'FR-REP-005', discipline: 'Voice' },
    { name: 'Hearing Aid Trial & Fitting Slip', code: 'FR-REP-006', discipline: 'Audiology' },
    { name: 'Dysphagia Diet Assessment (IDDSI)', code: 'FR-REP-007', discipline: 'Speech Therapy' },
    { name: 'Therapy Progress Note & SOAP', code: 'FR-REP-008', discipline: 'Clinical' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical Assessment Reports"
        subtitle="Standardized single-page clinical proformas with RCI practitioner stamps and bilateral metrics."
      />

      {/* Available templates banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.slice(0, 4).map((tpl) => (
          <Card key={tpl.code} className="p-4 bg-white/95 border-purple-200/90 shadow-2xs hover:border-purple-300 transition-all">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
              {tpl.discipline} • {tpl.code}
            </span>
            <p className="text-xs font-bold text-[#301444] truncate">
              {tpl.name}
            </p>
          </Card>
        ))}
      </div>

      {/* Existing Clinical Assessments Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50/40 border-b border-purple-100/80 px-6 py-4">
          <CardTitle className="text-lg font-bold text-[#301444]">
            Recent Patient Clinical Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf6fc] border-b border-purple-100/80 text-[11px] font-bold text-[#301444] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Report Title</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Discipline</th>
                  <th className="px-5 py-3.5">Diagnosis Summary</th>
                  <th className="px-5 py-3.5">Examiner</th>
                  <th className="px-5 py-3.5 text-right">View / Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50/80">
                {assessments.map((asmt) => (
                  <tr
                    key={asmt.id}
                    className="hover:bg-purple-50/40 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#301444] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>{asmt.title}</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">Date: {asmt.date}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#301444]">
                      {asmt.patient_name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge variant="primary">{asmt.type}</Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 font-medium max-w-xs">
                      {asmt.diagnosis}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-purple-800 font-semibold">
                      {asmt.examiner}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setActiveReport(asmt)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#301444] bg-white hover:bg-purple-50 border border-purple-200/90 shadow-2xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inspect Assessment Modal */}
      {activeReport && (
        <Modal
          isOpen={!!activeReport}
          onClose={() => setActiveReport(null)}
          title={`Clinical Proforma: ${activeReport.title}`}
          size="lg"
        >
          <div className="space-y-4 p-5 border border-purple-100 rounded-2xl bg-white text-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <h4 className="font-extrabold text-[#301444] text-base">VAANI CLINIC</h4>
                <p className="text-xs text-purple-700 font-semibold">Speech &amp; Hearing Rehabilitation Center, Satara</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p>UHID: {activeReport.uhid}</p>
                <p>Date: {activeReport.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="text-[#301444]">
                <strong className="text-purple-900">Patient:</strong> {activeReport.patient_name}
              </p>
              <p className="text-[#301444]">
                <strong className="text-purple-900">Examiner:</strong> {activeReport.examiner}
              </p>
            </div>

            <div>
              <strong className="text-xs text-purple-900 font-bold block mb-1">Clinical Impression / Diagnosis:</strong>
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs leading-relaxed text-[#301444]">
                {activeReport.diagnosis}
              </div>
            </div>

            <div>
              <strong className="text-xs text-purple-900 font-bold block mb-1">Clinical Recommendations:</strong>
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs leading-relaxed text-[#301444]">
                {activeReport.recommendations}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-100">
              <button
                onClick={() => {
                  window.print();
                  notify.success('Printing Clinical Report...');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#301444] text-white hover:bg-[#200b30] shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportsPage;
