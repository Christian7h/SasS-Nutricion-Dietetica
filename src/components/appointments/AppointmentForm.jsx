import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useState } from 'react';

export default function AppointmentForm({ appointment = null, onClose }) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: appointment || {
      patientId: '',
      date: '',
      time: '',
      type: 'consultation',
      notes: ''
    }
  });

  // Obtener lista de pacientes
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      return data.patients || [];
    },
    enabled: !!user && user.role === 'nutritionist'
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (appointment) {
        return api.put(`/appointments/${appointment.id}`, data);
      }
      return api.post('/appointments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      reset();
      onClose && onClose();
    },
    onError: (error) => {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al procesar la cita';
      setError(errorMessage);
    }
  });

  const onSubmit = (data) => {
    setError('');
    
    // Mapear los datos para que coincidan con lo que espera el backend
    const appointmentData = {
      patientId: data.patientId,
      date: data.date,
      time: data.time,
      notes: data.notes,
      nutritionistId: user.id || user._id, // Asegurar que se use el ID correcto del usuario
      // Solo incluir campos adicionales si el backend los soporta
      ...(data.type && { appointmentType: data.type })
    };
    
    console.log('Datos de la cita a enviar:', appointmentData);
    console.log('Usuario actual:', user);
    
    mutation.mutate(appointmentData);
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Consulta' },
    { value: 'follow-up', label: 'Seguimiento' },
    { value: 'evaluation', label: 'Evaluación' },
    { value: 'nutrition-plan', label: 'Plan nutricional' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Paciente</span>
          </label>
          <select
            {...register('patientId', { required: 'Selecciona un paciente' })}
            className="select select-bordered w-full"
          >
            <option value="">Seleccionar paciente</option>
            {patients?.map((patient) => (
              <option key={patient._id || patient.id} value={patient._id || patient.id}>
                {patient.name} - {patient.email}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.patientId.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Tipo de cita</span>
          </label>
          <select
            {...register('type', { required: 'Selecciona el tipo de cita' })}
            className="select select-bordered w-full"
          >
            {appointmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.type.message}</span>
            </label>
          )}
        </div>

        <Input
          label="Fecha"
          type="date"
          min={new Date().toISOString().split('T')[0]}
          {...register('date', { required: 'La fecha es requerida' })}
          error={errors.date?.message}
        />

        <Input
          label="Hora"
          type="time"
          {...register('time', { required: 'La hora es requerida' })}
          error={errors.time?.message}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">Notas</span>
        </label>
        <textarea
          {...register('notes')}
          className="textarea textarea-bordered h-24"
          placeholder="Notas adicionales sobre la cita..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onClose && (
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          loading={mutation.isPending}
          variant="primary"
        >
          {appointment ? 'Actualizar' : 'Crear'} Cita
        </Button>
      </div>
    </form>
  );
}