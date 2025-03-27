import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/patients/PatienstList';
import PatientModal from '../../components/patients/PatientsModal';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-neutral-content">Pacientes</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-sm inline-flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo Paciente
            </button>
          </div>

          <div className="mt-8">
            <PatientList />
          </div>
        </div>
      </div>

      <PatientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}