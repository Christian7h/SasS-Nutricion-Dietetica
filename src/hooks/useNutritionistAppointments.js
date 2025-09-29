import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from './useNotifications';
import api from '../api/axios';

// Hook para que nutricionistas gestionen solicitudes de citas
export const useNutritionistAppointments = () => {
  const { success, error } = useNotifications();
  const queryClient = useQueryClient();

  // Obtener todas las citas del nutricionista
  const {
    data: appointments = [],
    isLoading,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['nutritionist-appointments'],
    queryFn: async () => {
      console.log('🔍 Fetching nutritionist appointments...');
      const { data } = await api.get('/appointments');
      console.log('📋 Appointments API response:', data);
      console.log('📋 Appointments array:', data.appointments);
      console.log('📋 Appointments count:', data.appointments?.length || 0);
      
      // Log detallado de cada cita
      if (data.appointments?.length > 0) {
        data.appointments.forEach((apt, index) => {
          console.log(`📋 Appointment ${index + 1}:`, {
            id: apt._id,
            status: apt.status,
            patient: apt.patientId?.name,
            nutritionist: apt.nutritionistId?.name,
            date: apt.date,
            time: apt.time,
            createdAt: apt.createdAt
          });
        });
      }
      
      return data.appointments || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  // Obtener solicitudes pendientes
  const getPendingRequests = () => {
    console.log('🔍 Filtering pending requests from appointments:', appointments);
    console.log('📊 Total appointments:', appointments?.length || 0);
    
    const pending = appointments?.filter(apt => {
      console.log(`📋 Checking appointment ${apt._id}: status = "${apt.status}"`);
      return apt.status === 'pending';
    }) || [];
    
    console.log('⏳ Pending requests found:', pending.length);
    console.log('⏳ Pending requests details:', pending);
    
    return pending;
  };

  // Obtener citas confirmadas
  const getConfirmedAppointments = () => {
    return appointments.filter(apt => 
      apt.status === 'scheduled' || apt.status === 'confirmed'
    );
  };

  // Aprobar solicitud de cita
  const approveRequestMutation = useMutation({
    mutationFn: async (appointmentId) => {
      const { data } = await api.put(`/appointments/${appointmentId}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutritionist-appointments']);
      queryClient.invalidateQueries(['patient-appointments']); // Actualizar también vista del paciente
      success('Solicitud de cita aprobada exitosamente');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al aprobar la solicitud');
    }
  });

  // Rechazar solicitud de cita
  const rejectRequestMutation = useMutation({
    mutationFn: async ({ appointmentId, reason }) => {
      const { data } = await api.put(`/appointments/${appointmentId}/reject`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutritionist-appointments']);
      queryClient.invalidateQueries(['patient-appointments']);
      success('Solicitud rechazada');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al rechazar la solicitud');
    }
  });

  // Reagendar cita
  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async ({ appointmentId, newDate, newTime, reason }) => {
      const { data } = await api.patch(`/appointments/${appointmentId}/reschedule`, {
        date: newDate,
        time: newTime,
        rescheduleReason: reason
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['nutritionist-appointments']);
      queryClient.invalidateQueries(['patient-appointments']);
      success('Cita reagendada exitosamente');
    },
    onError: (err) => {
      error(err.response?.data?.message || 'Error al reagendar la cita');
    }
  });

  return {
    // Datos
    appointments,
    isLoading,
    error: fetchError,
    
    // Funciones de utilidad
    getPendingRequests,
    getConfirmedAppointments,
    refetch,
    
    // Mutaciones
    approveRequest: approveRequestMutation.mutate,
    rejectRequest: rejectRequestMutation.mutate,
    rescheduleAppointment: rescheduleAppointmentMutation.mutate,
    
    // Estados de mutaciones
    isApproving: approveRequestMutation.isLoading,
    isRejecting: rejectRequestMutation.isLoading,
    isRescheduling: rescheduleAppointmentMutation.isLoading,
  };
};
