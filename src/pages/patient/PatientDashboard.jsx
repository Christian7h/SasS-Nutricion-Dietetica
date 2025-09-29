import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { 
  UserIcon, 
  ScaleIcon, 
  ChartBarIcon,
  CalendarDaysIcon,
  HeartIcon,
  TrophyIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';

const PatientDashboard = () => {
  const { addNotification } = useNotifications();
  const [profileData, setProfileData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [nextAppointment, setNextAppointment] = React.useState(null);
  const [activePlan, setActivePlan] = React.useState(null);

  const loadPatientData = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar datos del perfil del paciente
      const profileResponse = await api.get('/auth/profile');
      setProfileData(profileResponse.data.user);

      // Cargar próxima cita
      const appointmentsResponse = await api.get('/appointments/my-appointments');
      const upcomingAppointments = appointmentsResponse.data.appointments
        .filter(apt => new Date(apt.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (upcomingAppointments.length > 0) {
        setNextAppointment(upcomingAppointments[0]);
      }

      // Cargar plan activo
      const plansResponse = await api.get('/plans/my-plans');
      const activePlans = plansResponse.data.plans.filter(plan => plan.status === 'active');
      if (activePlans.length > 0) {
        setActivePlan(activePlans[0]);
      }

    } catch (error) {
      console.error('Error cargando datos del paciente:', error);
      addNotification({
        type: 'error',
        message: 'Error al cargar los datos del perfil'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  React.useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  const calculateIMC = () => {
    if (!profileData?.profile?.weight || !profileData?.profile?.height) return null;
    
    const weight = parseFloat(profileData.profile.weight);
    const height = parseFloat(profileData.profile.height) / 100; // cm a metros
    const imc = weight / (height * height);
    
    return Math.round(imc * 100) / 100;
  };

  const getIMCCategory = (imc) => {
    if (!imc) return { category: 'No calculado', color: 'text-base-content/50', bgColor: 'bg-base-300' };
    
    if (imc < 18.5) {
      return { category: 'Bajo peso', color: 'text-info', bgColor: 'bg-info/10', descripcion: 'El bajo peso puede indicar desnutrición o problemas de salud. Es importante consultar con un profesional para evaluar tu estado nutricional y recibir recomendaciones adecuadas.' };
    } else if (imc >= 18.5 && imc < 25) {
      return { category: 'Peso normal', color: 'text-success', bgColor: 'bg-success/10', descripcion: 'Un IMC en el rango normal indica un peso saludable. Mantener una dieta equilibrada y un estilo de vida activo es fundamental para conservar este estado.' };
    } else if (imc >= 25 && imc < 30) {
      return { category: 'Sobrepeso', color: 'text-warning', bgColor: 'bg-warning/10', descripcion: 'El sobrepeso puede aumentar el riesgo de problemas de salud. Se recomienda consultar con un profesional para evaluar tu situación y recibir orientación.' };
    } else if (imc >= 30 && imc < 35) {
      return { category: 'Obesidad I', color: 'text-error', bgColor: 'bg-error/10', descripcion: 'La obesidad I puede conllevar riesgos para la salud. Es importante buscar orientación profesional para abordar esta situación.' };
    } else if (imc >= 35 && imc < 40) {
      return { category: 'Obesidad II', color: 'text-error', bgColor: 'bg-error/15', descripcion: 'La obesidad II implica un mayor riesgo de complicaciones de salud. Se recomienda encarecidamente consultar a un profesional.' };
    } else {
      return { category: 'Obesidad III', color: 'text-error', bgColor: 'bg-error/20', descripcion: 'La obesidad III es la forma más severa de obesidad y conlleva un alto riesgo de problemas de salud graves. Es crucial buscar atención médica y apoyo profesional.' };
    }
  };

  
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const imc = calculateIMC();
  const imcInfo = getIMCCategory(imc);
  const age = calculateAge(profileData?.profile?.birthDate);

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header de Bienvenida */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
            ¡Hola, {profileData?.name}! 👋
          </h1>
          <p className="text-base-content/70 text-lg">
            Tu panel de seguimiento nutricional
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="IMC Actual"
            value={imc || '--'}
            subtitle={imcInfo.category}
            icon={ScaleIcon}
            trend={imc ? (imc >= 18.5 && imc < 25 ? 'up' : 'neutral') : 'neutral'}
            color="primary"
            className={imcInfo.bgColor}
          />
          
          <StatCard
            title="Peso Actual"
            value={profileData?.profile?.weight ? `${profileData.profile.weight} kg` : '--'}
            subtitle="Última medición"
            icon={ScaleIcon}
            color="success"
          />
          
          <StatCard
            title="Altura"
            value={profileData?.profile?.height ? `${profileData.profile.height} cm` : '--'}
            subtitle="Registrada"
            icon={ChartBarIcon}
            color="info"
          />
          
          <StatCard
            title="Edad"
            value={age ? `${age} años` : '--'}
            subtitle="Años cumplidos"
            icon={UserIcon}
            color="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información del IMC */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-primary" />
                  Estado Nutricional
                </h2>
                <Button size="sm" variant="outline" onClick={() => window.location.href = '/profile'}>
                  Actualizar Datos
                </Button>
              </div>
              
              {imc ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${imcInfo.bgColor}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{imc}</p>
                        <p className={`text-sm font-medium ${imcInfo.color}`}>
                          {imcInfo.category}
                        </p>
                        <p>
                          {imcInfo.descripcion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-base-content/70">
                           <a href="https://www.who.int/es/news-room/fact-sheets/detail/obesity-and-overweight"><span className="text-primary">Clasificación según OMS</span></a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Escala visual del IMC */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-base-content/70">Escala de IMC:</p>
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div className="bg-info flex-1"></div>
                      <div className="bg-success flex-1"></div>
                      <div className="bg-warning flex-1"></div>
                      <div className="bg-error flex-1"></div>
                    </div>
                    <div className="flex justify-between text-xs text-base-content/60">
                      <span>&lt; 18.5</span>
                      <span>18.5-24.9</span>
                      <span>25-29.9</span>
                      <span>≥ 30</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-12 w-12 text-warning mx-auto mb-3" />
                  <p className="text-base-content/70 mb-4">
                    Para calcular tu IMC, necesitamos tu peso y altura actuales
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/profile'}
                  >
                    Completar Perfil
                  </Button>
                </div>
              )}
            </Card>

            {/* Plan Nutricional Activo */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <DocumentTextIcon className="h-5 w-5 text-success" />
                Plan Nutricional
              </h2>
              
              {activePlan ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{activePlan.name}</h3>
                      <p className="text-sm text-base-content/70">
                        Iniciado el {formatDate(activePlan.startDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="badge badge-success">Activo</div>
                    </div>
                  </div>
                  
                  <div className="bg-base-200 rounded-lg p-4">
                    <p className="text-sm text-base-content/70 mb-2">Objetivo:</p>
                    <p className="font-medium">{activePlan.goal || 'Mejorar hábitos alimentarios'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" className="flex-1">
                      Ver Plan Completo
                    </Button>
                    <Button size="sm" variant="outline">
                      Registrar Comida
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="h-12 w-12 text-base-content/30 mx-auto mb-3" />
                  <p className="text-base-content/70 mb-4">
                    Aún no tienes un plan nutricional asignado
                  </p>
                  <p className="text-sm text-base-content/50">
                    Tu nutricionista te asignará un plan personalizado próximamente
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            
            {/* Próxima Cita */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <CalendarDaysIcon className="h-5 w-5 text-primary" />
                Próxima Cita
              </h2>
              
              {nextAppointment ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {formatDate(nextAppointment.date)}
                      </span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatTime(nextAppointment.time)}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {nextAppointment.type || 'Consulta nutricional'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="sm" variant="primary" className="w-full">
                      Unirse a la Cita
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      Reprogramar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDaysIcon className="h-12 w-12 text-base-content/30 mx-auto mb-3" />
                  <p className="text-base-content/70 mb-3">
                    No tienes citas programadas
                  </p>
                  <Button size="sm" variant="primary">
                    Agendar Cita
                  </Button>
                </div>
              )}
            </Card>

            {/* Recordatorios y Tips */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <HeartIcon className="h-5 w-5 text-success" />
                Tips del Día
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Hidratación</p>
                    <p className="text-xs text-base-content/70">
                      Recuerda beber al menos 8 vasos de agua al día
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-info/10 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-info mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Actividad Física</p>
                    <p className="text-xs text-base-content/70">
                      30 minutos de caminata diaria pueden hacer la diferencia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Descanso</p>
                    <p className="text-xs text-base-content/70">
                      Dormir 7-8 horas es crucial para tu metabolismo
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
