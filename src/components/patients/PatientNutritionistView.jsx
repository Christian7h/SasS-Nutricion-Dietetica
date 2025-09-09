import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ViewColumnsIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import api from '../../api/axios';
import Loading from '../common/Loading';
import Input from '../common/Input';
import Button from '../common/Button';
import PatientSummary from './PatientSummary';
import PatientDetail from './PatientDetail';

export default function PatientNutritionistView() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [filterBy, setFilterBy] = useState('all'); // 'all' | 'allergies' | 'recent'

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      return data.patients;
    }
  });

  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filterBy) {
      case 'allergies':
        return patient.allergies?.length > 0;
      case 'recent':
        return patient.lastVisit && new Date(patient.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  }) || [];

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-error text-lg mb-2">Error al cargar los pacientes</div>
        <p className="text-base-content/70">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Vista Nutricionista</h2>
          <p className="text-base-content/70">Gestiona y revisa tus pacientes de forma eficiente</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Squares2X2Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ViewColumnsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/40" />
            <Input
              type="text"
              placeholder="Buscar pacientes por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-base-content/60" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="all">Todos los pacientes</option>
            <option value="allergies">Con alergias</option>
            <option value="recent">Visitados recientemente</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title text-xs">Total Pacientes</div>
          <div className="stat-value text-lg">{patients?.length || 0}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title text-xs">Con Alergias</div>
          <div className="stat-value text-lg">
            {patients?.filter(p => p.allergies?.length > 0).length || 0}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title text-xs">Visitas Recientes</div>
          <div className="stat-value text-lg">
            {patients?.filter(p => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title text-xs">Filtrados</div>
          <div className="stat-value text-lg">{filteredPatients.length}</div>
        </div>
      </div>

      {/* Lista de pacientes */}
      {filteredPatients.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredPatients.map((patient) => (
            <PatientSummary
              key={patient._id}
              patient={patient}
              onViewDetails={setSelectedPatientId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-base-content/50" />
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">No se encontraron pacientes</h3>
          <p className="text-base-content/70">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay pacientes registrados aún'}
          </p>
        </div>
      )}

      {/* Modal de detalles */}
      <PatientDetail
        patientId={selectedPatientId}
        isOpen={!!selectedPatientId}
        onClose={() => setSelectedPatientId(null)}
      />
    </div>
  );
}
