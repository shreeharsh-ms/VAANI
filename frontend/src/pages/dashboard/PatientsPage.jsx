import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Phone, Filter, Trash2, Plus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Card, { CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/feedback/EmptyState';
import PatientForm from '../../components/forms/PatientForm';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';

export const PatientsPage = () => {
  const { notify } = useNotification();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data || []);
    } catch {
      notify.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this patient record?')) {
      try {
        await patientService.deletePatient(id);
        notify.success('Patient record removed');
        fetchPatients();
      } catch {
        notify.error('Could not delete patient record');
      }
    }
  };

  const filtered = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search);

    const matchesService =
      selectedService === 'ALL' || p.service_line === selectedService;

    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Management & Intake"
        subtitle="Manage master clinical records, UHID profiles, and intake demographics."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#301444] hover:bg-[#200b30] text-white shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by UHID, patient name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={Search}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-purple-900/80 font-bold">Service Line:</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="text-xs font-semibold rounded-full border border-purple-200 bg-white px-3.5 py-2 text-[#301444] focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="SPEECH_LANGUAGE">Speech-Language</option>
              <option value="AUDIOLOGY">Audiology</option>
              <option value="VOICE">Voice Therapy</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patients Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf6fc] border-b border-purple-100/80 text-[11px] font-bold text-[#301444] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">UHID</th>
                  <th className="px-5 py-3.5">Patient Name</th>
                  <th className="px-5 py-3.5">Gender / DOB</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Discipline</th>
                  <th className="px-5 py-3.5">Chief Concern</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8">
                      <EmptyState
                        title="No patients found"
                        description="Try adjusting your search criteria or register a new patient."
                        actionLabel="Register New Patient"
                        onAction={() => setIsModalOpen(true)}
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-purple-50/40 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-xs font-bold text-purple-700">
                        {p.uhid}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-[#301444]">
                        {p.full_name}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {p.gender} • {formatDate(p.date_of_birth)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-purple-400" />
                          <span>{p.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            p.service_line === 'AUDIOLOGY' ? 'info' : 'primary'
                          }
                        >
                          {p.service_line?.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-xs truncate font-medium">
                        {p.primary_concern || 'None noted'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Register New Patient */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient (UHID Intake)"
        size="lg"
      >
        <PatientForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPatients();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PatientsPage;
