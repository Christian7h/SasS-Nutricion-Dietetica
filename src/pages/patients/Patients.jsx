import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import PatientList from '../../components/patients/PatienstList';
import PatientNutritionistView from '../../components/patients/PatientNutritionistView';
import PatientModal from '../../components/patients/PatientsModal';
import { PlusIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export default function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('nutritionist'); // 'table' | 'nutritionist'

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-content">Pacientes</h1>
              <p className="text-base-content/70 mt-1">
                Gestiona la información de tus pacientes
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-base-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                  title="Vista de tabla"
                >
                  <ViewColumnsIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('nutritionist')}
                  className={`btn btn-sm ${viewMode === 'nutritionist' ? 'btn-primary' : 'btn-ghost'}`}
                  title="Vista nutricionista"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm inline-flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Nuevo Paciente
              </button>
            </div>
          </div>

          <div className="mt-8">
            {viewMode === 'table' ? (
              <PatientList />
            ) : (
              <PatientNutritionistView />
            )}
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