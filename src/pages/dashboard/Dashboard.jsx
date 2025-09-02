import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import StatCard from '../../components/common/StatCard';
import Card, { CardBody, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
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
      color: "primary",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Citas Hoy",
      value: statsData?.todayAppointments || 0,
      icon: CalendarIcon,
      color: "secondary",
      change: "+5%",
      changeType: "increase"
    },
    {
      title: "Citas esta Semana",
      value: statsData?.weekAppointments || 0,
      icon: ChartBarIcon,
      color: "accent",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Citas Completadas",
      value: statsData?.completedAppointments || 0,
      icon: CheckCircleIcon,
      color: "success",
      change: "+15%",
      changeType: "increase"
    }
  ];

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Bienvenido de vuelta, aquí tienes un resumen de tu práctica
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Próximas Citas */}
          <Card>
            <CardBody>
              <CardTitle>Próximas Citas</CardTitle>
              <div className="space-y-4 mt-4">
                {statsData?.recentAppointments?.length > 0 ? (
                  statsData.recentAppointments.map((appointment) => (
                    <AppointmentItem key={appointment._id} appointment={appointment} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-base-content/40" />
                    <h3 className="mt-2 text-sm font-medium text-base-content">No hay citas próximas</h3>
                    <p className="mt-1 text-sm text-base-content/70">Programa tu primera cita</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Resumen de Estados */}
          <Card>
            <CardBody>
              <CardTitle>Resumen de Estados</CardTitle>
              <div className="space-y-4 mt-4">
                {statsData?.appointmentsByStatus?.length > 0 ? (
                  statsData.appointmentsByStatus.map((status) => (
                    <div key={status._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            status._id === 'scheduled' ? 'info' :
                            status._id === 'completed' ? 'success' : 'error'
                          }
                        >
                          {status._id === 'scheduled' ? 'Programadas' :
                           status._id === 'completed' ? 'Completadas' : 'Canceladas'}
                        </Badge>
                      </div>
                      <span className="text-2xl font-bold text-base-content">{status.count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-base-content/40" />
                    <h3 className="mt-2 text-sm font-medium text-base-content">No hay datos de citas</h3>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function AppointmentItem({ appointment }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return { variant: 'info', label: 'Programada' };
      case 'completed':
        return { variant: 'success', label: 'Completada' };
      case 'cancelled':
        return { variant: 'error', label: 'Cancelada' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-base-content truncate">
          {appointment.patientId?.name || 'Paciente sin nombre'}
        </p>
        <p className="text-sm text-base-content/70">
          {appointment.date ? format(new Date(appointment.date), 'PPP', { locale: es }) : 'Fecha no definida'} 
          {appointment.time && ` - ${appointment.time}`}
        </p>
      </div>
      <Badge variant={statusConfig.variant} size="sm">
        {statusConfig.label}
      </Badge>
    </div>
  );
}