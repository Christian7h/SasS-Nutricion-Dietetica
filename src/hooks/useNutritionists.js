import { useQuery } from '@tanstack/react-query';
import { getAvailableNutritionists } from '../api/auth';

export const useNutritionists = () => {
  const {
    data: nutritionistsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['nutritionists'],
    queryFn: getAvailableNutritionists,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false
  });

  return {
    nutritionists: nutritionistsData?.nutritionists || nutritionistsData?.users || nutritionistsData?.data || [],
    isLoading,
    error,
    refetch,
    // Para debug en desarrollo
    rawData: nutritionistsData
  };
};