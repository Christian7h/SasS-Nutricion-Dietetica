import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function usePlanOperations() {
  const queryClient = useQueryClient();

  const updatePlan = useMutation({
    mutationFn: ({ id, data }) => api.put(`/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
    }
  });

  const addMeal = useMutation({
    mutationFn: ({ planId, mealData }) => api.post(`/plans/${planId}/meals`, mealData),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
    }
  });

  const deleteMeal = useMutation({
    mutationFn: ({ planId, mealId }) => api.delete(`/plans/${planId}/meals/${mealId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
    }
  });

  const updateStatus = useMutation({
    mutationFn: ({ planId, status }) => api.patch(`/plans/${planId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
    }
  });

  return {
    updatePlan,
    addMeal,
    deleteMeal,
    updateStatus
  };
}