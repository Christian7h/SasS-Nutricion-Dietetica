import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  VideoCameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function AppointmentDetailModal({ appointment, isOpen, onClose }) {
  const [notes, setNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const queryClient = useQueryClient();

  // Obtener detalles completos de la cita si es necesario
  const { data: fullAppointment, isLoading } = useQuery({
    queryKey: ['appointment', appointment?._id],
    queryFn: async () => {
      if (appointment?._id) {
        const { data } = await api.get(`/appointments/${appointment._id}`);
        return data.appointment;
      }
      return appointment;
    },
    enabled: !!appointment && isOpen,
    initialData: appointment
  });

  // Mutación para actualizar el estado de la cita
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }) => {
      const { data } = await api.put(`/appointments/${fullAppointment._id}`, {
        status,
        notes: notes || fullAppointment.notes
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      queryClient.invalidateQueries(['dashboard-stats']);
      toast.success('Estado de la cita actualizado correctamente');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar la cita');
    }
  });

  const handleStatusUpdate = async (newStatus) => {
    if (isUpdatingStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      await updateStatusMutation.mutateAsync({ 
        status: newStatus, 
        notes: notes || fullAppointment?.notes 
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return { 
          variant: 'info', 
          label: 'Programada',
          icon: CalendarIcon,
          bgColor: 'bg-info/10'
        };
      case 'completed':
        return { 
          variant: 'success', 
          label: 'Completada',
          icon: CheckCircleIcon,
          bgColor: 'bg-success/10'
        };
      case 'cancelled':
        return { 
          variant: 'error', 
          label: 'Cancelada',
          icon: XCircleIcon,
          bgColor: 'bg-error/10'
        };
      case 'pending':
        return { 
          variant: 'warning',
          label: 'Pendiente',
          icon: ClockIcon,
          bgColor: 'bg-warning/10'
        };
      default:
        return { 
          variant: 'neutral', 
          label: status,
          icon: CalendarIcon,
          bgColor: 'bg-base-200'
        };
    }
  };

  if (!isOpen || !appointment) return null;

  const statusConfig = getStatusConfig(fullAppointment?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-primary" />
          Detalles de la Cita
        </h2>
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost btn-circle"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          {/* Estado actual */}
          <div className={`p-4 rounded-lg ${statusConfig.bgColor} border border-opacity-20`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-6 h-6 text-${statusConfig.variant}`} />
                <div>
                  <h3 className="font-semibold text-base-content">Estado Actual</h3>
                  <Badge variant={statusConfig.variant} size="sm">
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-base-content/70">
                ID: {fullAppointment?._id?.slice(-6)}
              </div>
            </div>
          </div>

          {/* Información del paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-base-content flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-primary" />
                Información del Paciente
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-content font-semibold">
                      {fullAppointment?.patientId?.name?.charAt(0)?.toUpperCase() || 'P'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-base-content">
                      {fullAppointment?.patientId?.name || 'Nombre no disponible'}
                    </p>
                    <p className="text-sm text-base-content/70">Paciente</p>
                  </div>
                </div>

                {fullAppointment?.patientId?.email && (
                  <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                    <EnvelopeIcon className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content">
                        {fullAppointment.patientId.email}
                      </p>
                      <p className="text-xs text-base-content/70">Email</p>
                    </div>
                  </div>
                )}

                {fullAppointment?.patientId?.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                    <PhoneIcon className="w-5 h-5 text-base-content/50" />
                    <div>
                      <p className="text-sm text-base-content">
                        {fullAppointment.patientId.phone}
                      </p>
                      <p className="text-xs text-base-content/70">Teléfono</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información de la cita */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-base-content flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Detalles de la Cita
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-base-content/50" />
                  <div>
                    <p className="text-sm text-base-content">
                      {fullAppointment?.date ? 
                        format(new Date(fullAppointment.date), 'PPPP', { locale: es }) : 
                        'Fecha no definida'
                      }
                    </p>
                    <p className="text-xs text-base-content/70">Fecha</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-base-content/50" />
                  <div>
                    <p className="text-sm text-base-content">
                      {fullAppointment?.time || 'Hora no definida'}
                    </p>
                    <p className="text-xs text-base-content/70">Hora</p>
                  </div>
                </div>

                {fullAppointment?.googleMeetLink && (
                  <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                    <VideoCameraIcon className="w-5 h-5 text-base-content/50" />
                    <div className="flex-1">
                      <a
                        href={fullAppointment.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Enlace de Google Meet
                      </a>
                      <p className="text-xs text-base-content/70">Videollamada</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-base-content flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
              Notas de la Cita
            </h3>
            
            <div className="space-y-3">
              {fullAppointment?.notes && (
                <div className="p-3 bg-base-200 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">Notas existentes:</p>
                  <p className="text-sm text-base-content">{fullAppointment.notes}</p>
                </div>
              )}
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar notas adicionales..."
                className="textarea textarea-bordered w-full h-24 text-sm"
                disabled={isUpdatingStatus}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-base-300">
            {fullAppointment?.status === 'scheduled' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusUpdate('completed')}
                  loading={isUpdatingStatus}
                  className="flex items-center space-x-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Marcar como Completada</span>
                </Button>
                
                <Button
                  variant="error"
                  size="sm"
                  onClick={() => handleStatusUpdate('cancelled')}
                  loading={isUpdatingStatus}
                  className="flex items-center space-x-2"
                >
                  <XCircleIcon className="w-4 h-4" />
                  <span>Cancelar Cita</span>
                </Button>
              </>
            )}
            {fullAppointment?.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusUpdate('approved')}
                  loading={isUpdatingStatus}
                  className="flex items-center space-x-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Aprobar Cita</span>
                </Button>

                <Button
                  variant="error"
                  size="sm"
                  onClick={() => handleStatusUpdate('rejected')}
                  loading={isUpdatingStatus}
                  className="flex items-center space-x-2"
                >
                  <XCircleIcon className="w-4 h-4" />
                  <span>Rechazar Cita</span>
                </Button>
              </>
            )}

            {fullAppointment?.status === 'cancelled' && (
              <Button
                variant="info"
                size="sm"
                onClick={() => handleStatusUpdate('scheduled')}
                loading={isUpdatingStatus}
                className="flex items-center space-x-2"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Reprogramar</span>
              </Button>
            )}

            {fullAppointment?.googleMeetLink && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fullAppointment.googleMeetLink, '_blank')}
                className="flex items-center space-x-2"
              >
                <VideoCameraIcon className="w-4 h-4" />
                <span>Abrir Google Meet</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
