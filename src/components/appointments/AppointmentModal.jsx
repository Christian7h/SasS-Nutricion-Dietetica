import Modal from '../common/Modal';
import AppointmentForm from './AppointmentForm';

export default function AppointmentModal({ isOpen, onClose, appointment = null }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Editar Cita' : 'Nueva Cita'}
      size="lg"
    >
      <AppointmentForm 
        appointment={appointment}
        onClose={onClose}
      />
    </Modal>
  );
}