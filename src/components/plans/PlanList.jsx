import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';
import Loading from '../common/Loading';
// Añade prop types checking


export default function PlanList({ onPlanSelect = () => {} }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
    // Obtener la lista de pacientes
    const { data: patients } = useQuery({
      queryKey: ['patients'],
      queryFn: async () => {
        const { data } = await api.get('/patients');
        return data.patients;
      }
    });

const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', selectedPatientId],
    queryFn: async () => {
      const url = selectedPatientId 
        ? `/plans?patientId=${selectedPatientId}`
        : '/plans';
      const { data } = await api.get(url);
      return data.plans;
    }
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Filtro de pacientes */}
      <div className="mb-12 p-5">
        <label className="label">
          <span className="label-text">Filtrar por paciente</span>
        </label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Todos los pacientes</option>
          {patients?.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de planes */}
      <div className="bg-base-200 divide-y divide-base-300">
        {plans?.length === 0 ? (
          <div className="text-center py-6 text-base-content/70">
            No hay planes nutricionales {selectedPatientId && 'para este paciente'}
          </div>
        ) : (
          plans?.map((plan) => (
            <div 
              key={plan._id} 
              className="p-6 hover:bg-base-300 cursor-pointer transition-colors"
              onClick={() => onPlanSelect(plan)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-neutral-content">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-base-content/80">
                    Paciente: {plan.patientId.name}
                  </p>
                </div>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanSelect(plan);
                  }}
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-content">Período</h4>
                  <p className="mt-1 text-sm text-base-content">
                    {format(new Date(plan.startDate), 'PP', { locale: es })} - 
                    {format(new Date(plan.endDate), 'PP', { locale: es })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-content">Calorías</h4>
                  <p className="mt-1 text-sm text-base-content">
                    {plan.dailyCalories} kcal
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <span className={`badge ${
                  plan.status === 'active' ? 'badge-success' :
                  plan.status === 'completed' ? 'badge-info' :
                  'badge-error'
                }`}>
                  {plan.status === 'active' ? 'Activo' :
                   plan.status === 'completed' ? 'Completado' : 'Cancelado'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}