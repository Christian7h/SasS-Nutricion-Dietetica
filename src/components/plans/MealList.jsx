import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

export default function MealList({ planId, meals = [] }) {
  const [newMeal, setNewMeal] = useState({
    time: '',
    name: '',
    foods: []
  });

  const queryClient = useQueryClient();

  const addMeal = useMutation({
    mutationFn: (meal) => api.post(`/plans/${planId}/meals`, meal),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
      setNewMeal({ time: '', name: '', foods: [] });
    }
  });

  const deleteMeal = useMutation({
    mutationFn: (mealId) => api.delete(`/plans/${planId}/meals/${mealId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['plans']);
    }
  });

  const handleAddFood = (mealIndex) => {
    const newFood = {
      name: '',
      portion: '',
      calories: 0
    };
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].foods.push(newFood);
    // Aquí deberías hacer la llamada a la API para actualizar las comidas
  };

  return (
    <div className="space-y-6">
      {/* Lista de comidas existentes */}
      {meals.map((meal, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{meal.name}</h4>
              <p className="text-sm text-gray-500">{meal.time}</p>
            </div>
            <button
              onClick={() => deleteMeal.mutate(meal._id)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Lista de alimentos */}
          <div className="space-y-2">
            {meal.foods.map((food, foodIndex) => (
              <div key={foodIndex} className="flex items-center space-x-4 text-sm">
                <span className="flex-1">{food.name}</span>
                <span className="text-gray-500">{food.portion}</span>
                <span className="text-gray-500">{food.calories} kcal</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleAddFood(index)}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar alimento
          </button>
        </div>
      ))}

      {/* Formulario para nueva comida */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Agregar nueva comida</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              value={newMeal.time}
              onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              placeholder="Ej: Desayuno"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <button
          onClick={() => addMeal.mutate(newMeal)}
          disabled={!newMeal.time || !newMeal.name}
          className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Comida
        </button>
      </div>
    </div>
  );
}