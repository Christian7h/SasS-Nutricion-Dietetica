import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePlanOperations } from '../../hooks/usePlanOperations';

export default function MealManager({ plan }) {
  const { addMeal, deleteMeal } = usePlanOperations();
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '',
    foods: [{
      name: '',
      portion: '',
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    }]
  });

  const handleAddFood = () => {
    setNewMeal(prev => ({
      ...prev,
      foods: [...prev.foods, {
        name: '',
        portion: '',
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMeal.mutate({
      planId: plan._id,
      mealData: newMeal
    }, {
      onSuccess: () => {
        setNewMeal({
          name: '',
          time: '',
          foods: [{
            name: '',
            portion: '',
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
          }]
        });
      }
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Comidas del Plan</h3>

      {/* Lista de comidas existentes */}
      <div className="mt-4 space-y-4">
        {plan.meals?.map((meal, index) => (
          <div key={meal._id || index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{meal.name}</h4>
                <p className="text-sm text-gray-500">{meal.time}</p>
              </div>
              <button
                onClick={() => deleteMeal.mutate({
                  planId: plan._id,
                  mealId: meal._id
                })}
                className="text-red-600 hover:text-red-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Alimento</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Porción</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Cal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">P</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">C</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">G</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {meal.foods.map((food, foodIndex) => (
                    <tr key={foodIndex}>
                      <td className="px-3 py-2 text-sm text-gray-900">{food.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{food.portion}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{food.calories}</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{food.proteins}g</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{food.carbs}g</td>
                      <td className="px-3 py-2 text-sm text-gray-500">{food.fats}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para nueva comida */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la comida
              </label>
              <input
                type="text"
                value={newMeal.name}
                onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora
              </label>
              <input
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Lista de alimentos */}
          {newMeal.foods.map((food, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <input
                  type="text"
                  placeholder="Nombre del alimento"
                  value={food.name}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].name = e.target.value;
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Porción"
                  value={food.portion}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].portion = e.target.value;
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Calorías"
                  value={food.calories}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].calories = Number(e.target.value);
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  placeholder="P"
                  value={food.proteins}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].proteins = Number(e.target.value);
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  placeholder="C"
                  value={food.carbs}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].carbs = Number(e.target.value);
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-1">
                <input
                  type="number"
                  placeholder="G"
                  value={food.fats}
                  onChange={(e) => {
                    const updatedFoods = [...newMeal.foods];
                    updatedFoods[index].fats = Number(e.target.value);
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    const updatedFoods = newMeal.foods.filter((_, i) => i !== index);
                    setNewMeal(prev => ({ ...prev, foods: updatedFoods }));
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddFood}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Alimento
          </button>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addMeal.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              {addMeal.isPending ? 'Guardando...' : 'Guardar Comida'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}