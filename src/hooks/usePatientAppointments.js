import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from './useNotifications';
import api from '../api/axios';

// Hook para manejar las citas del paciente
export const usePatientAppointments = () => {
  const { success, error } = useNotifications();
  const queryClient = useQueryClient();

  // Obtener todas las citas del paciente
  const {
    data: appointments = [],
    isLoading,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments');
      return data.appointments;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  // Obtener solicitudes pendientes
  const getPendingRequests = () => {
    return appointments.filter(apt => apt.status === 'pending');
  };

  // Obtener próxima cita
  const getNextAppointment = () => {
    const upcoming = appointments
      .filter(apt => new Date(apt.date) > new Date() && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };

  // Obtener citas de hoy
  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      new Date(apt.date).toDateString() === today
    );
  };

  // Obtener historial de citas
  const getPastAppointments = () => {
    return appointments
      .filter(apt => new Date(apt.date) < new Date())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Solicitar nueva cita (cancelar cita existente)
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId) => {
      const { data } = await api.patch(`/appointments/${appointmentId}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patient-appointments']);
      success('Cita cancelada exitosamente');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al cancelar la cita');
    }
  });

  // Confirmar asistencia a cita
  const confirmAppointmentMutation = useMutation({
    mutationFn: async (appointmentId) => {
      const { data } = await api.patch(`/appointments/${appointmentId}/confirm`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patient-appointments']);
      success('Asistencia confirmada exitosamente');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al confirmar la cita');
    }
  });

  // Solicitar nueva cita
  const requestAppointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      // Preparar datos para el backend
      const requestData = {
        nutritionistId: appointmentData.nutritionistId,
        date: appointmentData.preferredDate,
        time: appointmentData.preferredTime,
        reason: appointmentData.reason,
        type: appointmentData.type || 'consultation',
        notes: appointmentData.notes // Notas adicionales del paciente
      };
      
      console.log('Enviando solicitud de cita:', requestData);
      const { data } = await api.post('/appointments/request', requestData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patient-appointments']);
      success('Solicitud de cita enviada exitosamente. Tu nutricionista la revisará pronto.');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al solicitar la cita');
    }
  });

  return {
    // Datos
    appointments,
    isLoading,
    error: fetchError,
    
    // Funciones de utilidad
    getNextAppointment,
    getTodayAppointments,
    getPastAppointments,
    getPendingRequests,
    refetch,
    
    // Mutaciones
    cancelAppointment: cancelAppointmentMutation.mutate,
    confirmAppointment: confirmAppointmentMutation.mutate,
    requestAppointment: requestAppointmentMutation.mutate,
    
    // Estados de mutaciones
    isCancelling: cancelAppointmentMutation.isLoading,
    isConfirming: confirmAppointmentMutation.isLoading,
    isRequesting: requestAppointmentMutation.isLoading,
  };
};
