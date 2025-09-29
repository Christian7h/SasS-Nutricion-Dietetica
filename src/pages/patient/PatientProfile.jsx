import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useNotifications } from '../../hooks/useNotifications';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { 
  UserIcon, 
  ScaleIcon, 
  ChartBarIcon,
  HeartIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const PatientProfile = () => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = React.useState(true);
  const [imcHistory, setImcHistory] = React.useState([]);

  // Validaciones del formulario
  const validationSchema = {
    name: (value) => {
      if (!value) return 'El nombre es requerido';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return null;
    },
    email: (value) => {
      if (!value) return 'El email es requerido';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Email inválido';
      return null;
    },
    phone: (value) => {
      if (value && !/^\+?[\d\s\-()]{8,}$/.test(value)) {
        return 'Formato de teléfono inválido';
      }
      return null;
    },
    weight: (value) => {
      if (value) {
        const weight = parseFloat(value);
        if (isNaN(weight) || weight <= 0 || weight > 300) {
          return 'El peso debe ser un número válido entre 1 y 300 kg';
        }
      }
      return null;
    },
    height: (value) => {
      if (value) {
        const height = parseFloat(value);
        if (isNaN(height) || height <= 0 || height > 250) {
          return 'La altura debe ser un número válido entre 1 y 250 cm';
        }
      }
      return null;
    }
  };

  const { 
    values, 
    handleSubmit, 
    getFieldProps, 
    isSubmitting,
    setFieldValue 
  } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      weight: '',
      height: '',
      gender: '',
      medicalNotes: ''
    },
    validationSchema,
    {
      onSubmit: handleProfileUpdate,
      validateOnChange: true,
      validateOnBlur: true
    }
  );

  // Cargar datos del perfil
  const loadProfileData = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/profile');
      const userData = response.data.user;
      
      // Llenar el formulario con datos existentes
      setFieldValue('name', userData.name || '');
      setFieldValue('email', userData.email || '');
      setFieldValue('phone', userData.profile?.phone || '');
      setFieldValue('address', userData.profile?.address || '');
      setFieldValue('birthDate', userData.profile?.birthDate ? 
        new Date(userData.profile.birthDate).toISOString().split('T')[0] : '');
      setFieldValue('weight', userData.profile?.weight || '');
      setFieldValue('height', userData.profile?.height || '');
      setFieldValue('gender', userData.profile?.gender || '');
      setFieldValue('medicalNotes', userData.profile?.medicalNotes || '');

      // Cargar historial de IMC (simulado por ahora)
      generateIMCHistory(userData);

    } catch (error) {
      console.error('Error cargando perfil:', error);
      addNotification({
        type: 'error',
        message: 'Error al cargar los datos del perfil'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification, setFieldValue, generateIMCHistory]);

  React.useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Generar historial de IMC (simulado)
  const generateIMCHistory = React.useCallback((userData) => {
    if (!userData.profile?.weight || !userData.profile?.height) return;
    
    // Simulamos un historial de los últimos 6 meses
    const history = [];
    const currentIMC = calculateIMC(userData.profile.weight, userData.profile.height);
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // Variación aleatoria pequeña para simular progreso
      const variation = (Math.random() - 0.5) * 2;
      const imc = Math.max(15, Math.min(40, currentIMC + variation));
      
      history.push({
        date: date.toISOString().split('T')[0],
        imc: Math.round(imc * 100) / 100,
        weight: Math.round((imc * Math.pow(userData.profile.height / 100, 2)) * 10) / 10
      });
    }
    
    setImcHistory(history);
  }, []);

  // Actualizar perfil
  async function handleProfileUpdate(formData) {
    try {
      // Preparar datos para envío
      const updateData = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          gender: formData.gender,
          medicalNotes: formData.medicalNotes
        }
      };

      // Filtrar campos vacíos
      Object.keys(updateData.profile).forEach(key => {
        if (updateData.profile[key] === '' || updateData.profile[key] === undefined) {
          delete updateData.profile[key];
        }
      });

      await api.put('/auth/profile', updateData);
      
      addNotification({
        type: 'success',
        message: 'Perfil actualizado exitosamente'
      });

      // Recargar datos para actualizar IMC
      await loadProfileData();

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Error al actualizar el perfil'
      });
    }
  }

  // Calcular IMC
  const calculateIMC = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  // Obtener categoría del IMC
  const getIMCCategory = (imc) => {
    if (!imc) return { category: 'No calculado', color: 'text-base-content/50' };
    
    if (imc < 18.5) {
      return { category: 'Bajo peso', color: 'text-info' };
    } else if (imc >= 18.5 && imc < 25) {
      return { category: 'Peso normal', color: 'text-success' };
    } else if (imc >= 25 && imc < 30) {
      return { category: 'Sobrepeso', color: 'text-warning' };
    } else if (imc >= 30 && imc < 35) {
      return { category: 'Obesidad I', color: 'text-error' };
    } else if (imc >= 35 && imc < 40) {
      return { category: 'Obesidad II', color: 'text-error' };
    } else {
      return { category: 'Obesidad III', color: 'text-error' };
    }
  };

  // Calcular edad
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const currentIMC = calculateIMC(values.weight, values.height);
  const imcInfo = getIMCCategory(currentIMC);
  const age = calculateAge(values.birthDate);

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
            Mi Perfil
          </h1>
          <p className="text-base-content/70 text-lg">
            Mantén actualizada tu información personal y datos de salud
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <UserIcon className="h-5 w-5 text-primary" />
                Información Personal
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo"
                    icon={UserIcon}
                    required
                    {...getFieldProps('name')}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    icon={EnvelopeIcon}
                    required
                    disabled
                    {...getFieldProps('email')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    icon={PhoneIcon}
                    placeholder="+56 9 1234 5678"
                    {...getFieldProps('phone')}
                  />
                  
                  <Input
                    label="Fecha de Nacimiento"
                    type="date"
                    icon={CalendarDaysIcon}
                    {...getFieldProps('birthDate')}
                  />
                </div>

                <Input
                  label="Dirección"
                  icon={MapPinIcon}
                  placeholder="Calle, ciudad, región"
                  {...getFieldProps('address')}
                />

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Género</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    {...getFieldProps('gender')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Datos Antropométricos */}
                <div className="divider">
                  <span className="text-base font-medium">Datos de Salud</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Peso (kg)"
                    type="number"
                    step="0.1"
                    min="1"
                    max="300"
                    icon={ScaleIcon}
                    placeholder="70.5"
                    {...getFieldProps('weight')}
                  />
                  
                  <Input
                    label="Altura (cm)"
                    type="number"
                    step="0.1"
                    min="1"
                    max="250"
                    icon={ChartBarIcon}
                    placeholder="175"
                    {...getFieldProps('height')}
                  />
                </div>

                {/* Mostrar IMC calculado */}
                {currentIMC && (
                  <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-base-content/70">IMC Calculado</p>
                        <p className="text-2xl font-bold">{Math.round(currentIMC * 100) / 100}</p>
                        <p className={`text-sm font-medium ${imcInfo.color}`}>
                          {imcInfo.category}
                        </p>
                      </div>
                      <HeartIcon className={`h-8 w-8 ${imcInfo.color}`} />
                    </div>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Notas Médicas</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Alergias, condiciones médicas, medicamentos..."
                    {...getFieldProps('medicalNotes')}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    Actualizar Perfil
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            
            {/* Resumen de Datos */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen</h3>
              
              <div className="space-y-3">
                {age && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Edad:</span>
                    <span className="font-medium">{age} años</span>
                  </div>
                )}
                
                {values.weight && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Peso:</span>
                    <span className="font-medium">{values.weight} kg</span>
                  </div>
                )}
                
                {values.height && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Altura:</span>
                    <span className="font-medium">{values.height} cm</span>
                  </div>
                )}
                
                {currentIMC && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">IMC:</span>
                    <span className={`font-medium ${imcInfo.color}`}>
                      {Math.round(currentIMC * 100) / 100}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Historial de IMC */}
            {imcHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Progreso IMC</h3>
                
                <div className="space-y-2">
                  {imcHistory.slice(-3).map((record, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-base-content/70">
                        {new Date(record.date).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="font-medium">{record.imc}</span>
                    </div>
                  ))}
                </div>
                
                <Button size="sm" variant="outline" className="w-full mt-4">
                  Ver Historial Completo
                </Button>
              </Card>
            )}

            {/* Tips de Salud */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Consejos</h3>
              
              <div className="space-y-3 text-sm">
                <p className="text-base-content/70">
                  • Actualiza tu peso regularmente para un mejor seguimiento
                </p>
                <p className="text-base-content/70">
                  • Comparte cualquier cambio médico con tu nutricionista
                </p>
                <p className="text-base-content/70">
                  • Mantén tus datos de contacto actualizados
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
