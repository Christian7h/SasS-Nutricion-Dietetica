import React, { useContext } from 'react';
import NotificationContext from '../context/NotificationContext';

// Hook para usar el contexto de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  
  return context;
};

// Hook optimizado para casos específicos de API
export const useApiNotifications = () => {
  const { notifyApiError, notifySuccess, error, success } = useNotifications();

  return React.useMemo(() => ({
    notifyApiError,
    notifySuccess,
    error,
    success
  }), [notifyApiError, notifySuccess, error, success]);
};

// Hook para notificaciones de formularios
export const useFormNotifications = () => {
  const { success, error, warning } = useNotifications();

  return React.useMemo(() => ({
    notifyValidationError: (message) => error(message || 'Por favor, corrige los errores en el formulario'),
    notifySubmitSuccess: (entity = 'Datos') => success(`${entity} guardados exitosamente`),
    notifySubmitError: (message) => error(message || 'Error al guardar los datos'),
    notifyFieldWarning: (field, message) => warning(`${field}: ${message}`)
  }), [success, error, warning]);
};

// Hook para notificaciones de autenticación
export const useAuthNotifications = () => {
  const { success, error, info } = useNotifications();

  return React.useMemo(() => ({
    notifyLoginSuccess: () => success('¡Bienvenido! Has iniciado sesión exitosamente'),
    notifyLogoutSuccess: () => info('Has cerrado sesión exitosamente'),
    notifyLoginError: (message) => error(message || 'Error al iniciar sesión'),
    notifySessionExpired: () => error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente'),
    notifyPasswordChanged: () => success('Contraseña cambiada exitosamente'),
    notifyRegistrationSuccess: () => success('Cuenta creada exitosamente. ¡Bienvenido!')
  }), [success, error, info]);
};

// Hook para notificaciones de pacientes
export const usePatientNotifications = () => {
  const { notifySuccess, error, info } = useNotifications();

  return React.useMemo(() => ({
    notifyPatientCreated: () => notifySuccess('create', 'Paciente'),
    notifyPatientUpdated: () => notifySuccess('update', 'Paciente'),
    notifyPatientDeleted: () => notifySuccess('delete', 'Paciente'),
    notifyPatientNotFound: () => error('Paciente no encontrado'),
    notifyAppointmentScheduled: () => info('Cita agendada exitosamente'),
    notifyPlanAssigned: () => info('Plan nutricional asignado al paciente'),
    notifyProgressUpdated: () => notifySuccess('update', 'Progreso del paciente')
  }), [notifySuccess, error, info]);
};

// Hook para notificaciones de planes nutricionales
export const usePlanNotifications = () => {
  const { notifySuccess, warning, info } = useNotifications();

  return React.useMemo(() => ({
    notifyPlanCreated: () => notifySuccess('create', 'Plan nutricional'),
    notifyPlanUpdated: () => notifySuccess('update', 'Plan nutricional'),
    notifyPlanDeleted: () => notifySuccess('delete', 'Plan nutricional'),
    notifyPlanActivated: () => info('Plan nutricional activado'),
    notifyPlanPaused: () => warning('Plan nutricional pausado'),
    notifyPlanCompleted: () => notifySuccess('update', 'Plan completado exitosamente'),
    notifyMealAdded: () => info('Comida añadida al plan'),
    notifyNutritionalGoalSet: () => info('Objetivos nutricionales establecidos')
  }), [notifySuccess, warning, info]);
};

// Hook para notificaciones de citas
export const useAppointmentNotifications = () => {
  const { notifySuccess, error, warning, info } = useNotifications();

  return React.useMemo(() => ({
    notifyAppointmentScheduled: () => notifySuccess('create', 'Cita'),
    notifyAppointmentUpdated: () => notifySuccess('update', 'Cita'),
    notifyAppointmentCancelled: () => warning('Cita cancelada'),
    notifyAppointmentCompleted: () => notifySuccess('update', 'Cita completada'),
    notifyAppointmentReminder: (time) => info(`Recordatorio: Tienes una cita en ${time}`),
    notifyAppointmentConflict: () => error('Conflicto de horario detectado'),
    notifyNoShow: () => warning('Paciente no se presentó a la cita')
  }), [notifySuccess, error, warning, info]);
};

export default useNotifications;
