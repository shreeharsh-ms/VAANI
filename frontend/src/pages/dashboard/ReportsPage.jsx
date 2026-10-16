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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {templates.slice(0, 4).map((tpl) => (
          <Card key={tpl.code} className="p-4 bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mb-1">
              {tpl.discipline} • {tpl.code}
            </span>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {tpl.name}
            </p>
          </Card>
        ))}
      </div>

      {/* Existing Clinical Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patient Clinical Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Report Title</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Discipline</th>
                  <th className="px-5 py-3.5">Diagnosis Summary</th>
                  <th className="px-5 py-3.5">Examiner</th>
                  <th className="px-5 py-3.5 text-right">View / Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {assessments.map((asmt) => (
                  <tr
                    key={asmt.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span>{asmt.title}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">Date: {asmt.date}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">
                      {asmt.patient_name}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge variant="primary">{asmt.type}</Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300 max-w-xs">
                      {asmt.diagnosis}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                      {asmt.examiner}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        startIcon={Eye}
                        onClick={() => setActiveReport(asmt)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for report preview */}
      {activeReport && (
        <Modal
          isOpen={Boolean(activeReport)}
          onClose={() => setActiveReport(null)}
          title={`Clinical Proforma: ${activeReport.title}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setActiveReport(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                startIcon={Printer}
                onClick={() => {
                  window.print();
                  notify.success('Printing report proforma...');
                }}
              >
                Print Official PDF
              </Button>
            </>
          }
        >
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 text-sm">
            <div className="flex justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">VAANI CLINIC</h4>
                <p className="text-xs text-gray-500">Sadashiv Peth, Satara, Maharashtra</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-teal-600 font-bold">{activeReport.id}</span>
                <p className="text-xs text-gray-400">Date: {activeReport.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-gray-700 dark:text-gray-300">Patient:</strong> {activeReport.patient_name}
              </div>
              <div>
                <strong className="text-gray-700 dark:text-gray-300">Examiner:</strong> {activeReport.examiner}
              </div>
            </div>

            <div className="pt-2">
              <strong className="text-gray-700 dark:text-gray-300 block mb-1">Clinical Impression / Diagnosis:</strong>
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-xs leading-relaxed">
                {activeReport.diagnosis}
              </div>
            </div>

            <div className="pt-2">
              <strong className="text-gray-700 dark:text-gray-300 block mb-1">Clinical Recommendations:</strong>
              <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-xs leading-relaxed">
                {activeReport.recommendations}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportsPage;
