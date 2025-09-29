import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Loading from '../common/Loading';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNutritionists } from '../../hooks/useNutritionists';

export default function AppointmentRequestModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    nutritionistId: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    type: 'consultation',
    notes: ''
  });

  // Hook para obtener nutricionistas usando la función de auth.js
  const { nutritionists, isLoading: loadingNutritionists, error: nutritionistsError, rawData } = useNutritionists();

  // Debug para desarrollo
  useEffect(() => {
    if (isOpen && rawData) {
      console.log('=== Debug Nutricionistas ===');
      console.log('Raw data:', rawData);
      console.log('Nutritionists array:', nutritionists);
      console.log('Loading:', loadingNutritionists);
      console.log('Error:', nutritionistsError);
    }
  }, [isOpen, rawData, nutritionists, loadingNutritionists, nutritionistsError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nutritionistId: '',
      preferredDate: '',
      preferredTime: '',
      reason: '',
      type: 'consultation',
      notes: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Fecha mínima: mañana
  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Solicitar Nueva Cita"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-base-content">Información de la Solicitud</h3>
          </div>
          <p className="text-sm text-base-content/70">
            Tu solicitud será revisada por el equipo médico y recibirás una confirmación por email.
          </p>
        </div>

        {/* Selector de nutricionista */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            <UserIcon className="w-4 h-4 inline mr-1" />
            Nutricionista
          </label>
          {loadingNutritionists ? (
            <div className="flex items-center justify-center py-4">
              <Loading />
              <span className="ml-2 text-sm">Cargando nutricionistas...</span>
            </div>
          ) : nutritionistsError ? (
            <div className="alert alert-warning">
              <span>Error al cargar nutricionistas. Intenta recargar la página.</span>
            </div>
          ) : nutritionists?.length === 0 ? (
            <div className="alert alert-info">
              <span>No hay nutricionistas disponibles en este momento.</span>
            </div>
          ) : (
            <select
              name="nutritionistId"
              value={formData.nutritionistId}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="">Selecciona un nutricionista</option>
              {nutritionists?.map((nutritionist) => (
                <option key={nutritionist.id || nutritionist._id} value={nutritionist.id || nutritionist._id}>
                  {nutritionist.name}
                  {nutritionist.specialties?.length > 0 && 
                    ` - ${nutritionist.specialties.join(', ')}`}
                  {nutritionist.license && ` (Lic: ${nutritionist.license})`}
                  {!nutritionist.hasAvailability && ' - Sin disponibilidad'}
                </option>
              ))}
            </select>
          )}
          {nutritionists?.length > 0 && (
            <p className="text-xs text-base-content/60 mt-1">
              {nutritionists.length} nutricionista{nutritionists.length !== 1 ? 's' : ''} encontrado{nutritionists.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha Preferida"
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            min={minDate}
            required
            icon={CalendarIcon}
          />

          <Input
            label="Hora Preferida"
            type="time"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            icon={ClockIcon}
          />
        </div>

        <Input
          label="Motivo de la Consulta"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          placeholder="Ej: Control nutricional, seguimiento de plan..."
          icon={UserIcon}
        />

        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Tipo de Consulta
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="consultation">Consulta General</option>
            <option value="follow-up">Seguimiento</option>
            <option value="initial">Primera Consulta</option>
            <option value="control">Control</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Información adicional que consideres relevante..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
