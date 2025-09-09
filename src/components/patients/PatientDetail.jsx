import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon,
  ScaleIcon,
  ChartBarIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Loading from '../common/Loading';
import Card, { CardBody, CardTitle } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { usePatientReport } from '../../hooks/usePatientReport';
import { usePatientDetail, usePatientAppointments, usePatientPlans } from '../../hooks/usePatientDetail';

export default function PatientDetail({ patientId, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const { generateReport, loading: reportLoading } = usePatientReport();

  const { data: patient, isLoading, error } = usePatientDetail(patientId);
  const { data: appointments } = usePatientAppointments(patientId);
  const { data: plans } = usePatientPlans(patientId);

  const handleDownloadReport = (format = 'txt') => {
    generateReport({ patientId, format });
  };

  if (!isOpen) return null;

  if (isLoading) return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    </Modal>
  );

  if (error) return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="text-center py-8">
        <div className="text-error text-lg mb-2">Error al cargar el paciente</div>
        <p className="text-base-content/70">{error.message}</p>
      </div>
    </Modal>
  );

  const tabs = [
    { id: 'general', label: 'Información General', icon: UserIcon },
    { id: 'health', label: 'Información de Salud', icon: HeartIcon },
    { id: 'metrics', label: 'Métricas y Progreso', icon: ChartBarIcon },
    { id: 'appointments', label: 'Citas', icon: CalendarIcon },
    { id: 'plans', label: 'Planes Nutricionales', icon: DocumentTextIcon }
  ];

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'No especificada';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'No calculable';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi || bmi === 'No calculable') return { label: 'No determinado', variant: 'neutral' };
    const numBmi = parseFloat(bmi);
    
    if (numBmi < 16) return { label: 'Delgadez severa', variant: 'error' };
    if (numBmi < 17) return { label: 'Delgadez moderada', variant: 'warning' };
    if (numBmi < 18.5) return { label: 'Bajo peso', variant: 'warning' };
    if (numBmi < 25) return { label: 'Peso normal', variant: 'success' };
    if (numBmi < 30) return { label: 'Sobrepeso', variant: 'warning' };
    if (numBmi < 35) return { label: 'Obesidad grado I', variant: 'error' };
    if (numBmi < 40) return { label: 'Obesidad grado II', variant: 'error' };
    return { label: 'Obesidad grado III', variant: 'error' };
  };

  // Usar el IMC del backend si está disponible, si no calcularlo localmente
  const bmi = patient?.profile?.imc || calculateBMI(patient?.profile?.weight, patient?.profile?.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" showCloseButton={false}>
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-content">
                {patient?.name?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">{patient?.name}</h2>
              <p className="text-base-content/70">
                {patient?.gender === 'male' ? 'Masculino' : patient?.gender === 'female' ? 'Femenino' : 'No especificado'} • 
                {calculateAge(patient?.birthDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownloadReport('txt')}
              disabled={reportLoading}
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Reporte
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-base-300">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <CardTitle>Información Personal</CardTitle>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">Email</span>
                        <p className="font-medium">{patient?.email || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">Teléfono</span>
                        <p className="font-medium">{patient?.profile.phone || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">Fecha de Nacimiento</span>
                        <p className="font-medium">
                          {patient?.profile.birthDate 
                            ? format(new Date(patient?.profile.birthDate), 'dd/MM/yyyy', { locale: es })
                            : 'No especificada'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle>Información Física</CardTitle>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center space-x-3">
                      <ScaleIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">Peso</span>
                        <p className="font-medium">{patient?.profile.weight ? `${patient.profile.weight} kg` : 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ChartBarIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">Altura</span>
                        <p className="font-medium">{patient?.profile.height ? `${patient.profile.height} cm` : 'No especificada'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <HeartIcon className="h-5 w-5 text-base-content/60" />
                      <div>
                        <span className="text-sm text-base-content/70">IMC</span>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{bmi}</p>
                          <Badge variant={bmiCategory.variant} size="sm">
                            {bmiCategory.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <CardTitle>Seguimiento de Peso</CardTitle>
                  <div className="space-y-4 mt-4">
                    <div className="text-center p-6 bg-base-200 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {patient?.profile?.weight || '--'} kg
                      </div>
                      <p className="text-sm text-base-content/70">Peso Actual</p>
                    </div>
                    <div className="text-center py-6">
                      <ChartBarIcon className="mx-auto h-12 w-12 text-base-content/40" />
                      <p className="mt-2 text-sm text-base-content/70">
                        Gráfico de progreso disponible próximamente
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle>Análisis Nutricional</CardTitle>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-base-200 rounded-lg">
                        <div className="text-xl font-bold text-secondary">
                          {bmi && bmi !== 'No calculable' ? parseFloat(bmi).toFixed(2) : '--'}
                        </div>
                        <p className="text-xs text-base-content/70">IMC</p>
                        <Badge variant={bmiCategory.variant} size="sm" className="mt-1">
                          {bmiCategory.label}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-base-200 rounded-lg">
                        <div className="text-xl font-bold text-accent">
                          {patient?.profile?.height || '--'} cm
                        </div>
                        <p className="text-xs text-base-content/70">Altura</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span className="text-sm font-medium">Calorías objetivo diarias</span>
                        <span className="text-sm text-base-content/70">2000 kcal</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span className="text-sm font-medium">Proteínas recomendadas</span>
                        <span className="text-sm text-base-content/70">120g</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                        <span className="text-sm font-medium">Agua recomendada</span>
                        <span className="text-sm text-base-content/70">2.5L</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardBody>
                  <CardTitle>Información Médica</CardTitle>
                  <div className="space-y-6 mt-4">
                    <div>
                      <h4 className="font-medium text-base-content mb-2">Alergias</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient?.allergies?.length > 0 ? (
                          patient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="warning" size="sm">
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-base-content/70 text-sm">No se han registrado alergias</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-base-content mb-2">Condiciones Médicas</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient?.medicalConditions?.length > 0 ? (
                          patient.medicalConditions.map((condition, index) => (
                            <Badge key={index} variant="info" size="sm">
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-base-content/70 text-sm">No se han registrado condiciones médicas</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-base-content mb-2">Medicamentos</h4>
                      <div className="space-y-2">
                        {patient?.medications?.length > 0 ? (
                          patient.medications.map((medication, index) => (
                            <div key={index} className="p-3 bg-base-200 rounded-lg">
                              <p className="font-medium">{medication.name}</p>
                              <p className="text-sm text-base-content/70">
                                {medication.dosage} - {medication.frequency}
                              </p>
                            </div>
                          ))
                        ) : (
                          <span className="text-base-content/70 text-sm">No se han registrado medicamentos</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-base-content mb-2">Notas Adicionales</h4>
                      <div className="p-3 bg-base-200 rounded-lg">
                        <p className="text-sm">
                          {patient?.notes || 'No hay notas adicionales registradas'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'appointments' && (
            <Card>
              <CardBody>
                <CardTitle>Historial de Citas</CardTitle>
                <div className="mt-4">
                  {appointments?.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment._id} className="p-4 bg-base-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-base-content">
                                {appointment.date ? format(new Date(appointment.date), 'PPP', { locale: es }) : 'Fecha no definida'}
                              </p>
                              <p className="text-sm text-base-content/70">
                                {appointment.time} • Tipo: {appointment.type || 'Consulta general'}
                              </p>
                              {appointment.notes && (
                                <p className="text-sm text-base-content/70 mt-2">{appointment.notes}</p>
                              )}
                            </div>
                            <Badge 
                              variant={
                                appointment.status === 'completed' ? 'success' :
                                appointment.status === 'scheduled' ? 'info' : 'error'
                              }
                              size="sm"
                            >
                              {appointment.status === 'completed' ? 'Completada' :
                               appointment.status === 'scheduled' ? 'Programada' : 'Cancelada'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 text-base-content/40" />
                      <h3 className="mt-2 text-sm font-medium text-base-content">No hay citas registradas</h3>
                      <p className="mt-1 text-sm text-base-content/70">
                        Las citas del paciente aparecerán aquí
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'plans' && (
            <Card>
              <CardBody>
                <CardTitle>Planes Nutricionales</CardTitle>
                <div className="mt-4">
                  {plans?.length > 0 ? (
                    <div className="space-y-4">
                      {plans.map((plan) => (
                        <div key={plan._id} className="p-4 bg-base-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-base-content">{plan.name}</p>
                              <p className="text-sm text-base-content/70">
                                Creado: {plan.createdAt ? format(new Date(plan.createdAt), 'PPP', { locale: es }) : 'Fecha no definida'}
                              </p>
                              {plan.description && (
                                <p className="text-sm text-base-content/70 mt-2">{plan.description}</p>
                              )}
                              {plan.meals && plan.meals.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-base-content/80 mb-2">Comidas incluidas:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {plan.meals.slice(0, 3).map((meal, index) => (
                                      <Badge key={index} variant="info" size="sm">
                                        {meal.name}
                                      </Badge>
                                    ))}
                                    {plan.meals.length > 3 && (
                                      <Badge variant="neutral" size="sm">
                                        +{plan.meals.length - 3} más
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Badge 
                              variant={plan.status === 'active' ? 'success' : 'neutral'}
                              size="sm"
                            >
                              {plan.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-base-content/40" />
                      <h3 className="mt-2 text-sm font-medium text-base-content">No hay planes nutricionales</h3>
                      <p className="mt-1 text-sm text-base-content/70">
                        Los planes del paciente aparecerán aquí
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
}
