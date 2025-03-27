import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

export default function PatientModal({ isOpen, onClose, patient = null }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: patient || {}
  });
  
  const queryClient = useQueryClient();

  const createPatient = useMutation({
    mutationFn: (data) => api.post('/patients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      reset();
      onClose();
    }
  });

  const onSubmit = (data) => {
    createPatient.mutate({
      ...data,
      role: 'patient'
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="modal-box w-full max-w-md">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Dialog.Title as="h3" className="text-lg font-medium">
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre completo</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez García"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className="input input-bordered w-full"
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Teléfono</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: +34 612 345 678"
                  {...register('phone', { required: 'El teléfono es requerido' })}
                  className="input input-bordered w-full"
                />
                {errors.phone && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.phone.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha de nacimiento</span>
                </label>
                <input
                  type="date"
                  placeholder="DD/MM/AAAA"
                  {...register('birthDate')}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notas médicas</span>
                </label>
                <textarea
                  placeholder="Ingrese aquí cualquier nota relevante sobre el paciente (alergias, condiciones médicas, etc.)"
                  {...register('medicalNotes')}
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createPatient.isPending}
                  className="btn btn-primary"
                >
                  {createPatient.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}