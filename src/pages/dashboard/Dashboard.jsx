import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import StatCard from '../../components/common/StatCard';
import Card, { CardBody, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AppointmentDetailModal from '../../components/appointments/AppointmentDetailModal';
import api from '../../api/axios';

export default function Dashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats/dashboard');
      console.log("dashboard data:", data);
      return data.stats;
    }
  });

  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsDetailModalOpen(false);
  };

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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Próximas Citas */}
          <Card>
            <CardBody>
              <CardTitle>Próximas Citas</CardTitle>
              <div className="space-y-4 mt-4">
                {statsData?.recentAppointments?.length > 0 ? (
                  statsData.recentAppointments.map((appointment) => (
                    <AppointmentItem 
                      key={appointment._id} 
                      appointment={appointment} 
                      onViewDetails={handleViewAppointmentDetails}
                    />
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

          {/* Enlaces de Google Meet */}
          <Card>
            <CardBody>
              <CardTitle>Enlaces de Google Meet</CardTitle>
              <div className="space-y-4 mt-4">
                {statsData?.googleMeetLinks?.length > 0 ? (
                  statsData.googleMeetLinks.map((meetLink, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <VideoCameraIcon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-base-content">
                          Reunión {index + 1}
                        </span>
                      </div>
                      <a
                        href={meetLink.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        <VideoCameraIcon className="h-4 w-4 mr-1" />
                        Unirse
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <VideoCameraIcon className="mx-auto h-12 w-12 text-base-content/40" />
                    <h3 className="mt-2 text-sm font-medium text-base-content">No hay enlaces de Meet</h3>
                    <p className="mt-1 text-sm text-base-content/70">Los enlaces aparecerán aquí</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sección adicional para nutricionistas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Alertas de pacientes */}
          <Card>
            <CardBody>
              <CardTitle>Alertas de Pacientes</CardTitle>
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-warning">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-warning">3 pacientes con alergias críticas</p>
                      <p className="text-xs text-warning/80">Revisar antes de prescribir planes</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-info">ℹ️</span>
                    <div>
                      <p className="text-sm font-medium text-info">5 pacientes requieren seguimiento</p>
                      <p className="text-xs text-info/80">Más de 30 días sin visita</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Métricas nutricionales */}
          <Card>
            <CardBody>
              <CardTitle>Métricas Nutricionales</CardTitle>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span className="text-sm font-medium">Planes activos</span>
                  <span className="text-2xl font-bold text-primary">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span className="text-sm font-medium">Promedio IMC pacientes</span>
                  <span className="text-2xl font-bold text-secondary">24.2</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <span className="text-sm font-medium">Pacientes en objetivo</span>
                  <span className="text-2xl font-bold text-success">8</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Modal de detalles de cita */}
        <AppointmentDetailModal
          appointment={selectedAppointment}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </Layout>
  );
}

function AppointmentItem({ appointment, onViewDetails }) {
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
        <div className="flex space-x-4 mt-2">
          <button 
            onClick={() => onViewDetails(appointment)}
            className="text-sm text-blue-500 hover:underline flex items-center space-x-1"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Ver detalles</span>
          </button>
          {appointment.googleMeetLink && (
            <a 
              href={appointment.googleMeetLink} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-500 hover:underline flex items-center"
            >
              <VideoCameraIcon className="h-4 w-4 mr-1" />
              Google Meet
            </a>
          )}
        </div>
      </div>
      <Badge variant={statusConfig.variant} size="sm">
        {statusConfig.label}
      </Badge>
    </div>
  );
}