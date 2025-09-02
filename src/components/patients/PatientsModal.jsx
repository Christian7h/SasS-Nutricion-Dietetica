import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useState } from 'react';
import { usePatientReport } from '../../hooks/usePatientReport';

export default function PatientModal({ isOpen, onClose, patient = null }) {
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const { generateReport, loading: reportLoading } = usePatientReport();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: patient || {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      height: '',
      weight: '',
      medicalHistory: '',
      allergies: '',
      goals: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (patient) {
        return api.put(`/patients/${patient.id}`, data);
      }
      return api.post('/patients', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      reset();
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error al procesar el paciente');
    }
  });

  const onSubmit = (data) => {
    setError('');
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-base-content">
                    {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {error && <Alert type="error" message={error} />}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nombre completo"
                      {...register('name', { required: 'El nombre es requerido' })}
                      error={errors.name?.message}
                      placeholder="Nombre del paciente"
                    />

                    <Input
                      label="Correo electrónico"
                      type="email"
                      {...register('email', { 
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Correo electrónico inválido'
                        }
                      })}
                      error={errors.email?.message}
                      placeholder="ejemplo@correo.com"
                    />

                    <Input
                      label="Teléfono"
                      type="tel"
                      {...register('phone', { required: 'El teléfono es requerido' })}
                      error={errors.phone?.message}
                      placeholder="+1 234 567 8900"
                    />

                    <Input
                      label="Fecha de nacimiento"
                      type="date"
                      {...register('birthDate', { required: 'La fecha de nacimiento es requerida' })}
                      error={errors.birthDate?.message}
                    />

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Género</span>
                      </label>
                      <select
                        {...register('gender', { required: 'Selecciona el género' })}
                        className="select select-bordered w-full"
                      >
                        <option value="">Seleccionar género</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                      {errors.gender && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.gender.message}</span>
                        </label>
                      )}
                    </div>

                    <Input
                      label="Altura (cm)"
                      type="number"
                      {...register('height', { 
                        required: 'La altura es requerida',
                        min: { value: 50, message: 'Altura mínima 50cm' },
                        max: { value: 250, message: 'Altura máxima 250cm' }
                      })}
                      error={errors.height?.message}
                      placeholder="170"
                    />

                    <Input
                      label="Peso (kg)"
                      type="number"
                      step="0.1"
                      {...register('weight', { 
                        required: 'El peso es requerido',
                        min: { value: 20, message: 'Peso mínimo 20kg' },
                        max: { value: 300, message: 'Peso máximo 300kg' }
                      })}
                      error={errors.weight?.message}
                      placeholder="70.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Historial médico</span>
                      </label>
                      <textarea
                        {...register('medicalHistory')}
                        className="textarea textarea-bordered h-24"
                        placeholder="Enfermedades, cirugías, medicamentos actuales..."
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Alergias</span>
                      </label>
                      <textarea
                        {...register('allergies')}
                        className="textarea textarea-bordered h-20"
                        placeholder="Alergias alimentarias o de otro tipo..."
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Objetivos</span>
                      </label>
                      <textarea
                        {...register('goals')}
                        className="textarea textarea-bordered h-20"
                        placeholder="Perder peso, ganar masa muscular, mejorar salud..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {/* Botones de descarga solo si es un paciente existente */}
                    {patient && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => generateReport({ patientId: patient._id, format: 'txt' })}
                          loading={reportLoading}
                          type="button"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                          TXT
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => generateReport({ patientId: patient._id, format: 'html' })}
                          loading={reportLoading}
                          type="button"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                          HTML
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex space-x-3 ml-auto">
                      <Button variant="ghost" onClick={handleClose} type="button">
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        loading={mutation.isPending}
                        variant="primary"
                      >
                        {patient ? 'Actualizar' : 'Crear'} Paciente
                      </Button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}