import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      return data.patients;
    },
  });
}