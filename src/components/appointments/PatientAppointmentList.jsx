import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, ClockIcon, UserIcon, XMarkIcon, CheckIcon, PhoneIcon } from '@heroicons/react/24/outline';
import AppointmentStatus from './AppointmentStatus';
import Loading from '../common/Loading';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { usePatientAppointments } from '../../hooks/usePatientAppointments';

export default function PatientAppointmentList() {
  // Usar el hook personalizado para citas del paciente
  const {
    appointments,
    isLoading,
    error,
    cancelAppointment,
    confirmAppointment,
    getPendingRequests,
    isCancelling,
    isConfirming
  } = usePatientAppointments();

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      cancelAppointment(appointmentId);
    }
  };

  const handleConfirmAppointment = (appointmentId) => {
    confirmAppointment(appointmentId);
  };

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
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-base-content mb-2">No tienes citas programadas</h3>
        <p className="text-base-content/70 mb-4">
          Cuando tengas citas agendadas, aparecerán aquí.
        </p>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => {
            // Aquí puedes redirigir a la página de solicitud de cita
            // o abrir un modal de solicitud
            console.log('Navegar a solicitud de cita');
          }}
        >
          Solicitar Nueva Cita
        </Button>
      </Card>
    );
  }

  // Separar citas por estado
  const pendingRequests = getPendingRequests();
  const upcomingAppointments = appointments.filter(apt => 
    (apt.status === 'scheduled' || apt.status === 'confirmed') && new Date(apt.date) > new Date()
  );
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Solicitudes Pendientes */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-base-content mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-warning" />
            Solicitudes Pendientes ({pendingRequests.length})
          </h3>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-4 h-4 text-warning" />
              <p className="text-sm font-medium text-base-content">Solicitudes en Revisión</p>
            </div>
            <p className="text-sm text-base-content/70">
              Tu nutricionista revisará estas solicitudes y te confirmará la disponibilidad.
            </p>
          </div>
          <div className="grid gap-4">
            {pendingRequests.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                isPending={true}
                isCancelling={isCancelling}
              />
            ))}
          </div>
        </div>
      )}

      {/* Próximas Citas */}
      {upcomingAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-base-content mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Próximas Citas ({upcomingAppointments.length})
          </h3>
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                onConfirm={handleConfirmAppointment}
                isUpcoming={true}
                isCancelling={isCancelling}
                isConfirming={isConfirming}
              />
            ))}
          </div>
        </div>
      )}

      {/* Historial de Citas */}
      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-base-content mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-base-content/70" />
            Historial de Citas ({pastAppointments.length})
          </h3>
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                isUpcoming={false}
              />
            ))}
          </div>
        </div>
      )}


    </div>
  );
}

// Componente individual para cada cita
function AppointmentCard({ appointment, onCancel, onConfirm, isUpcoming, isPending, isCancelling, isConfirming }) {
  const appointmentDate = new Date(appointment.date);
  const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isPending ? 'border-l-4 border-l-warning bg-warning/5' : 
      isUpcoming ? 'border-l-4 border-l-primary' : ''
    } ${isToday ? 'bg-primary/5' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Indicador especial para solicitudes pendientes */}
          {isPending && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-warning/10 rounded-lg border border-warning/20">
              <ClockIcon className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                Solicitud pendiente de aprobación
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm font-medium text-base-content">
                {format(appointmentDate, 'EEEE, d \'de\' MMMM', { locale: es })}
                {isToday && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    Hoy
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm text-base-content/70">
                {format(appointmentDate, 'HH:mm')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-base-content/70" />
              <span className="text-sm text-base-content">
                Dr. {appointment.nutritionist?.name || 'Sin asignar'}
              </span>
            </div>
            <AppointmentStatus status={appointment.status} />
          </div>

          {appointment.reason && (
            <p className="text-sm text-base-content/70 mb-2">
              <strong>Motivo:</strong> {appointment.reason}
            </p>
          )}

          {appointment.type && (
            <div className="flex items-center gap-2">
              <Badge variant={appointment.type === 'virtual' ? 'info' : 'secondary'} size="sm" className="flex items-center gap-1">
                {appointment.type === 'virtual' ? (
                  <>
                    <PhoneIcon className="w-3 h-3" />
                    Virtual
                  </>
                ) : (
                  'Presencial'
                )}
              </Badge>
              {appointment.duration && (
                <Badge variant="outline" size="sm">
                  {appointment.duration} min
                </Badge>
              )}
            </div>
          )}

          {/* Información adicional para el paciente */}
          {appointment.notes && (
            <div className="mt-2 p-2 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content/70">
                <strong>Notas:</strong> {appointment.notes}
              </p>
            </div>
          )}

          {/* Información de contacto para citas virtuales */}
          {appointment.type === 'virtual' && appointment.meetingLink && isUpcoming && (
            <div className="mt-2 p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PhoneIcon className="w-4 h-4 text-info" />
                <p className="text-sm font-medium text-info">Enlace de la Videollamada</p>
              </div>
              <Button
                variant="info"
                size="sm"
                onClick={() => window.open(appointment.meetingLink, '_blank')}
                className="w-full"
              >
                Unirse a la Videollamada
              </Button>
            </div>
          )}

          {/* Recordatorio para citas próximas */}
          {isUpcoming && isToday && (
            <div className="mt-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-success" />
                <p className="text-sm font-medium text-success">
                  ¡Tu cita es hoy a las {format(appointmentDate, 'HH:mm')}!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">

          {/* Acciones específicas para solicitudes pendientes */}
          {isPending && (
            <div className="flex gap-2">
              <Button
                variant="error"
                size="sm"
                onClick={() => onCancel(appointment._id)}
                disabled={isCancelling}
                className="flex items-center gap-1"
              >
                <XMarkIcon className="w-3 h-3" />
                {isCancelling ? 'Cancelando...' : 'Cancelar Solicitud'}
              </Button>
            </div>
          )}

          {/* Acciones específicas para citas próximas */}
          {isUpcoming && (
            <div className="flex gap-2">
              {appointment.status === 'scheduled' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onConfirm(appointment._id)}
                  disabled={isConfirming}
                  className="flex items-center gap-1"
                >
                  <CheckIcon className="w-3 h-3" />
                  {isConfirming ? 'Confirmando...' : 'Confirmar'}
                </Button>
              )}
              
              {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                <Button
                  variant="error"
                  size="sm"
                  onClick={() => onCancel(appointment._id)}
                  disabled={isCancelling}
                  className="flex items-center gap-1"
                >
                  <XMarkIcon className="w-3 h-3" />
                  {isCancelling ? 'Cancelando...' : 'Cancelar'}
                </Button>
              )}
            </div>
          )}

          {isUpcoming && isToday && (
            <Badge variant="success" size="sm" className="animate-pulse">
              Cita de Hoy
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
