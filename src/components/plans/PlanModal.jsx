import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

export default function PlanModal({ isOpen, onClose, plan = null }) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: plan || {
      title: '',
      description: '',
      patientId: '',
      startDate: '',
      endDate: '',
      dailyCalories: 2000,
      objectives: [''],
      macroDistribution: {
        proteins: 30,
        carbs: 40,
        fats: 30
      },
      meals: [{
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
      }],
      restrictions: [''],
      supplements: [{
        name: '',
        dosage: '',
        frequency: ''
      }]
    }
  });

  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({
    control,
    name: 'objectives'
  });

  const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
    control,
    name: 'meals'
  });

  const { fields: restrictionFields, append: appendRestriction, remove: removeRestriction } = useFieldArray({
    control,
    name: 'restrictions'
  });

  const { fields: supplementFields, append: appendSupplement, remove: removeSupplement } = useFieldArray({
    control,
    name: 'supplements'
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      return data.patients;
    }
  });

  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: (data) => api.post('/plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      reset();
      onClose();
    }
  });

  const onSubmit = (data) => {
    // Limpiamos arrays vacíos
    data.objectives = data.objectives.filter(obj => obj.trim());
    data.restrictions = data.restrictions.filter(res => res.trim());
    data.supplements = data.supplements.filter(sup => sup.name.trim());
    data.meals = data.meals.filter(meal => meal.name.trim() && meal.time);

    createPlan.mutate(data);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="modal-box w-full max-w-4xl h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-base-100 pb-4 mb-4 border-b border-base-300">
            <Dialog.Title as="h3" className="text-lg font-medium text-neutral-content">
              {plan ? 'Editar Plan Nutricional' : 'Nuevo Plan Nutricional'}
            </Dialog.Title>
            <button
              type="button"
              className="btn btn-ghost btn-circle absolute right-2 top-2"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Título del Plan</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'El título es requerido' })}
                  className="input input-bordered w-full"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Paciente</span>
                </label>
                <select
                  {...register('patientId', { required: 'Seleccione un paciente' })}
                  className="input input-bordered w-full"
                >
                  <option value="">Seleccionar paciente</option>
                  {patients?.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha de inicio</span>
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: 'La fecha de inicio es requerida' })}
                  className="input input-bordered w-full"
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha de fin</span>
                </label>
                <input
                  type="date"
                  {...register('endDate', { required: 'La fecha de fin es requerida' })}
                  className="input input-bordered w-full"
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Calorías diarias</span>
                </label>
                <input
                  type="number"
                  {...register('dailyCalories', { 
                    required: 'Las calorías son requeridas',
                    min: { value: 1, message: 'Debe ser mayor a 0' },
                    max: { value: 10000, message: 'Debe ser menor a 10000' }
                  })}
                  className="input input-bordered w-full"
                />
                {errors.dailyCalories && <p className="mt-1 text-sm text-red-600">{errors.dailyCalories.message}</p>}
              </div>
            </div>

            {/* Distribución de macros */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Distribución de Macronutrientes (%)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Proteínas</span>
                  </label>
                  <input
                    type="number"
                    {...register('macroDistribution.proteins')}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Carbohidratos</span>
                  </label>
                  <input
                    type="number"
                    {...register('macroDistribution.carbs')}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Grasas</span>
                  </label>
                  <input
                    type="number"
                    {...register('macroDistribution.fats')}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createPlan.isPending}
                className="btn btn-primary"
              >
                {createPlan.isPending ? 'Guardando...' : 'Guardar Plan'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}