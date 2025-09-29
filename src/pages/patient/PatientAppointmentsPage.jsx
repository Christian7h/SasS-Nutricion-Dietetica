import { useState } from 'react';
import PatientLayout from '../../components/layout/PatientLayout';
import PatientAppointmentList from '../../components/appointments/PatientAppointmentList';
import AppointmentRequestModal from '../../components/appointments/AppointmentRequestModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';
import { usePatientAppointments } from '../../hooks/usePatientAppointments';

export default function PatientAppointmentsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { requestAppointment, isRequesting } = usePatientAppointments();

  const handleRequestAppointment = () => {
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      await requestAppointment(formData);
      setIsRequestModalOpen(false);
    } catch (error) {
      // Error manejado por el hook
      console.error('Error al solicitar cita:', error);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Mis Citas
            </h1>
            <p className="mt-2 text-sm text-base-content/70">
              Gestiona y revisa tus citas médicas y nutricionales
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleRequestAppointment}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Solicitar Cita
          </Button>
        </div>

        {/* Información rápida */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base-content">Gestiona tus Citas</h3>
              <p className="text-sm text-base-content/70">
                Revisa tus próximas citas, historial y solicita nuevas citas con tu nutricionista.
              </p>
            </div>
          </div>
        </Card>

        {/* Lista de citas */}
        <PatientAppointmentList />

        {/* Modal para solicitar nueva cita */}
        <AppointmentRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={handleSubmitRequest}
          isSubmitting={isRequesting}
        />
      </div>
    </PatientLayout>
  );
}
