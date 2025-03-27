import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AppointmentModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();

  // Obtener lista de pacientes
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      console.log(data);
      return data.patients;
    }
  });

  const createAppointment = useMutation({
    mutationFn: (data) => {
      const appointmentData = {
        ...data,
        nutritionistId: user._id,
        status: 'scheduled'
      };
      return api.post('/appointments', appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error('Error al crear la cita:', error.response?.data || error);
      // Aquí puedes agregar una notificación de error
    }
  });

  const onSubmit = (data) => {
    // Combinar fecha y hora
    const dateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    createAppointment.mutate({
      ...data,
      date: dateTime,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl rounded-xl p-6 bg-gray-800 text-gray-200">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="text-gray-100 hover:text-gray-200"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Dialog.Title className="text-lg font-medium leading-6">
            Nueva Cita
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4 text-gray-300">
              <div>
                <label className="block text-sm font-medium">
                  Paciente
                </label>
                <select
                  {...register('patientId', { required: 'Debe seleccionar un paciente' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Seleccionar paciente</option>
                  {patients?.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Tipo de Cita
                </label>
                <select
                  {...register('appointmentType', { required: 'Debe seleccionar un tipo de cita' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Seleccionar tipo de cita</option>
                  <option value="consulta">Consulta</option>
                  <option value="seguimiento">Seguimiento</option>
                </select>
                {errors.appointmentType && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Fecha
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'La fecha es requerida' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium ">
                    Hora
                  </label>
                  <input
                    type="time"
                    {...register('time', { required: 'La hora es requerida' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Notas adicionales para la cita..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createAppointment.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary/90 disabled:opacity-50"
                >
                  {createAppointment.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}