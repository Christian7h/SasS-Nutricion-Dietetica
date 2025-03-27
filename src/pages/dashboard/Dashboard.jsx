import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import api from '../../api/axios';

export default function Dashboard() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats/dashboard');
      return data.stats;
    }
  });

  if (isLoading) return <Loading />;

  const stats = [
    {
      title: "Pacientes Totales",
      value: statsData?.totalPatients || 0,
      icon: UserGroupIcon,
      color: "bg-primary text-primary-content"
    },
    {
      title: "Citas Hoy",
      value: statsData?.todayAppointments || 0,
      icon: CalendarIcon,
      color: "bg-secondary text-secondary-content"
    },
    {
      title: "Citas esta Semana",
      value: statsData?.weekAppointments || 0,
      icon: ChartBarIcon,
      color: "bg-accent text-accent-content"
    },
    {
      title: "Citas Completadas",
      value: statsData?.completedAppointments || 0,
      icon: CheckCircleIcon,
      color: "bg-neutral text-neutral-content"
    }
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-neutral-content">Dashboard</h1>

          {/* Estadísticas */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Próximas Citas */}
            <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-neutral-content border-b border-base-300 pb-2">Próximas Citas</h3>
                <div className="mt-4 flow-root">
                  <ul className=''>
                    {statsData?.recentAppointments?.map((appointment) => (
                      <AppointmentItem key={appointment._id} appointment={appointment} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Resumen de Estados */}
            <div className="bg-base-200 border border-base-300 rounded-lg shadow-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-neutral-content border-b border-base-300 pb-2">Resumen de Estados</h3>
                <div className="mt-4">
                  {statsData?.appointmentsByStatus?.map((status) => (
                    <div key={status._id} className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${status._id === 'scheduled' ? 'bg-info text-info-content' :
                            status._id === 'completed' ? 'bg-success text-success-content' :
                            'bg-error text-error-content'}`}>
                          {status._id === 'scheduled' ? 'Programadas' :
                           status._id === 'completed' ? 'Completadas' : 'Canceladas'}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-neutral-content">{status.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-base-200 border border-base-300 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color} rounded p-1`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-content/80 truncate">{title}</dt>
              <dd className="text-lg font-semibold text-neutral-content">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentItem({ appointment }) {
  return (
    <li className="py-4 hover:bg-base-300/50 rounded-lg px-2 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-content truncate">
            {appointment.patientId.name}
          </p>
          <p className="text-sm text-neutral-content/80">
            {format(new Date(appointment.date), 'PPP', { locale: es })} - {appointment.time}
          </p>
        </div>
        <div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${appointment.status === 'scheduled' ? 'bg-info text-info-content' :
              appointment.status === 'completed' ? 'bg-success text-success-content' :
              'bg-error text-error-content'}`}>
            {appointment.status === 'scheduled' ? 'Programada' :
             appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
          </span>
        </div>
      </div>
    </li>
  );
}