import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from '@heroicons/react/24/outline';
import AppointmentStatus from './AppointmentStatus';
import Loading from '../common/Loading';
import api from '../../api/axios';

export default function AppointmentList() {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments');
      return data.appointments;
    }
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-error text-lg mb-2">Error al cargar las citas</div>
        <p className="text-base-content/70">{error.message}</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-base-content/50" />
        </div>
        <h3 className="text-lg font-medium text-base-content mb-2">No hay citas programadas</h3>
        <p className="text-base-content/70">Las citas aparecerán aquí una vez que las programes</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-200">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-base-content">
              Paciente
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Fecha
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Hora
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-300 bg-base-100">
          {appointments.map((appointment) => (
            <tr key={appointment._id} className="hover:bg-base-200">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-content">
                        {appointment.patientId?.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-base-content">
                      {appointment.patientId?.name || 'Paciente no asignado'}
                    </div>
                    {appointment.patientId?.email && (
                      <div className="text-sm text-base-content/70">
                        {appointment.patientId.email}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">
                {appointment.date ? format(new Date(appointment.date), 'PPP', { locale: es }) : 'Fecha no definida'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">
                {appointment.time || 'Hora no definida'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <AppointmentStatus appointment={appointment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}