import { useQuery } from '@tanstack/react-query';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';

export default function PatientList() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await api.get('/patients');
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    },
    enabled: !!user && user.role === 'nutritionist'
  });

  if (isLoading) return <Loading />;

  if (error) {
    console.error('Error al cargar pacientes:', error);
    return (
      <div className="text-center py-4 text-red-600">
        Error al cargar los pacientes: {error.message}
      </div>
    );
  }

  const patients = data?.patients || [];

  if (patients.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay pacientes registrados
      </div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="text-left">Nombre</th>
                <th className="text-left">Email</th>
                <th className="text-left">Teléfono</th>
                <th className="text-left">Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td className="font-medium">{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <span className="badge badge-success">Activo</span>
                  </td>
                  <td className="text-right">
                    <button className="btn btn-ghost btn-sm">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-error">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}