import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function usePatientDetail(patientId) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const { data } = await api.get(`/patients/${patientId}`);
      return data.patient;
    },
    enabled: !!patientId
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, data }) => {
      const response = await api.put(`/patients/${patientId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Actualizar la caché del paciente específico
      queryClient.setQueryData(['patient', variables.patientId], data.patient);
      // Invalidar la lista de pacientes para refrescarla
      queryClient.invalidateQueries(['patients']);
    }
  });
}

export function usePatientAppointments(patientId) {
  return useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: async () => {
      const { data } = await api.get(`/patients/${patientId}/appointments`);
      return data.appointments;
    },
    enabled: !!patientId
  });
}

export function usePatientPlans(patientId) {
  return useQuery({
    queryKey: ['patient-plans', patientId],
    queryFn: async () => {
      const { data } = await api.get(`/patients/${patientId}/plans`);
      return data.plans;
    },
    enabled: !!patientId
  });
}
