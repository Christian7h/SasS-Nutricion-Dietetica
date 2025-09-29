import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const usePendingAppointmentsCount = () => {
  return useQuery({
    queryKey: ['pending-appointments-count'],
    queryFn: async () => {
      const response = await api.get('/appointments', {
        params: { 
          status: 'pending',
          limit: 0 // Solo queremos el conteo
        }
      });
      
      // Si el backend retorna un array, contamos los elementos
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      
      // Si el backend retorna un objeto con count o total
      return response.data.count || response.data.total || 0;
    },
    refetchInterval: 30000, // Actualizar cada 30 segundos
    staleTime: 5000, // Los datos son frescos por 5 segundos
  });
};
