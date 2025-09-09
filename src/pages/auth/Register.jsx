import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  HeartIcon,
  ScaleIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, registerPatient, getAvailableNutritionists } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionists, setNutritionists] = useState([]);
  const [loadingNutritionists, setLoadingNutritionists] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');
  const userRole = watch('role');

  // Cargar nutricionistas cuando se selecciona el rol de paciente
  useEffect(() => {
    const loadNutritionists = async () => {
      setLoadingNutritionists(true);
      try {
        const data = await getAvailableNutritionists();
        setNutritionists(data.nutritionists || []);
      } catch (err) {
        console.error('Error al cargar nutricionistas:', err);
        setNutritionists([]);
      } finally {
        setLoadingNutritionists(false);
      }
    };

    if (userRole === 'patient') {
      loadNutritionists();
    }
  }, [userRole, getAvailableNutritionists]);

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      if (data.role === 'patient') {
        // Registro específico para pacientes
        const patientData = {
          name: data.name,
          email: data.email,
          password: data.password,
          nutritionistId: data.nutritionistId,
          profile: {
            weight: data.weight ? parseFloat(data.weight) : undefined,
            height: data.height ? parseFloat(data.height) : undefined,
            birthDate: data.birthDate || undefined,
            gender: data.gender || undefined,
            allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
            medicalConditions: data.medicalConditions ? data.medicalConditions.split(',').map(c => c.trim()).filter(c => c) : []
          }
        };

        await registerPatient(patientData);
      } else {
        // Registro para nutricionistas
        const userData = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          profile: {
            specialties: data.specialties ? data.specialties.split(',').map(s => s.trim()).filter(s => s) : [],
            education: data.education,
            experience: data.experience ? parseInt(data.experience) : 0,
            license: data.license
          }
        };

        await registerUser(userData);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientFields = () => (
    <>
      {/* Selector de nutricionista */}
      <div className="md:col-span-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Seleccionar Nutricionista *
            </span>
          </label>
          {loadingNutritionists ? (
            <div className="flex items-center justify-center p-4">
              <Loading />
            </div>
          ) : (
            <select
              {...register('nutritionistId', { 
                required: userRole === 'patient' ? 'Debe seleccionar un nutricionista' : false 
              })}
              className="select select-bordered w-full"
            >
              <option value="">Seleccionar nutricionista</option>
              {nutritionists.map((nutritionist) => (
                <option key={nutritionist.id} value={nutritionist.id}>
                  {nutritionist.name} - {nutritionist.specialties?.join(', ') || 'Sin especialidades'}
                </option>
              ))}
            </select>
          )}
          {errors.nutritionistId && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.nutritionistId.message}</span>
            </label>
          )}
        </div>
      </div>

      {/* Información física */}
      <Input
        label="Peso (kg)"
        type="number"
        step="0.1"
        placeholder="70.5"
        icon={<ScaleIcon className="h-5 w-5 text-base-content/70" />}
        {...register('weight', { 
          min: { value: 20, message: 'El peso debe ser mayor a 20 kg' },
          max: { value: 300, message: 'El peso debe ser menor a 300 kg' }
        })}
        error={errors.weight?.message}
      />

      <Input
        label="Altura (cm)"
        type="number"
        placeholder="170"
        icon={<ScaleIcon className="h-5 w-5 text-base-content/70" />}
        {...register('height', { 
          min: { value: 100, message: 'La altura debe ser mayor a 100 cm' },
          max: { value: 250, message: 'La altura debe ser menor a 250 cm' }
        })}
        error={errors.height?.message}
      />

      <Input
        label="Fecha de nacimiento"
        type="date"
        icon={<CalendarIcon className="h-5 w-5 text-base-content/70" />}
        {...register('birthDate')}
        error={errors.birthDate?.message}
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">Género</span>
        </label>
        <select
          {...register('gender')}
          className="select select-bordered w-full"
        >
          <option value="">Seleccionar género</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <Input
          label="Alergias (separadas por comas)"
          type="text"
          placeholder="Lactosa, Gluten, Mariscos"
          icon={<HeartIcon className="h-5 w-5 text-base-content/70" />}
          {...register('allergies')}
          error={errors.allergies?.message}
        />
      </div>

      <div className="md:col-span-2">
        <Input
          label="Condiciones médicas (separadas por comas)"
          type="text"
          placeholder="Diabetes, Hipertensión"
          icon={<HeartIcon className="h-5 w-5 text-base-content/70" />}
          {...register('medicalConditions')}
          error={errors.medicalConditions?.message}
        />
      </div>
    </>
  );

  const renderNutritionistFields = () => (
    <>
      <Input
        label="Años de experiencia"
        type="number"
        placeholder="5"
        icon={<BriefcaseIcon className="h-5 w-5 text-base-content/70" />}
        {...register('experience', { 
          required: userRole === 'nutritionist' ? 'Los años de experiencia son requeridos' : false,
          min: { value: 0, message: 'La experiencia no puede ser negativa' }
        })}
        error={errors.experience?.message}
      />

      <Input
        label="Número de licencia"
        type="text"
        placeholder="LIC123456"
        icon={<AcademicCapIcon className="h-5 w-5 text-base-content/70" />}
        {...register('license', { 
          required: userRole === 'nutritionist' ? 'El número de licencia es requerido' : false 
        })}
        error={errors.license?.message}
      />

      <div className="md:col-span-2">
        <Input
          label="Educación"
          type="text"
          placeholder="Licenciatura en Nutrición, Universidad XYZ"
          icon={<AcademicCapIcon className="h-5 w-5 text-base-content/70" />}
          {...register('education', { 
            required: userRole === 'nutritionist' ? 'La educación es requerida' : false 
          })}
          error={errors.education?.message}
        />
      </div>

      <div className="md:col-span-2">
        <Input
          label="Especialidades (separadas por comas)"
          type="text"
          placeholder="Nutrición deportiva, Pérdida de peso, Diabetes"
          icon={<HeartIcon className="h-5 w-5 text-base-content/70" />}
          {...register('specialties')}
          error={errors.specialties?.message}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-base-100 p-8 rounded-2xl shadow-xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-accent-content" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-base-content">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Regístrate como {userRole === 'patient' ? 'paciente' : userRole === 'nutritionist' ? 'nutricionista' : 'profesional'}
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Tu nombre completo"
              icon={<UserIcon className="h-5 w-5 text-base-content/70" />}
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
              })}
              error={errors.name?.message}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' }
              })}
              error={errors.email?.message}
            />

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Tipo de cuenta *</span>
              </label>
              <select
                {...register('role', { required: 'Selecciona el tipo de cuenta' })}
                className="select select-bordered w-full"
              >
                <option value="">Seleccionar tipo</option>
                <option value="nutritionist">🥗 Nutricionista</option>
                <option value="patient">👤 Paciente</option>
              </select>
              {errors.role && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.role.message}</span>
                </label>
              )}
            </div>

            {/* Campos de contraseña siempre visibles */}
            <div className="md:col-span-1">
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                {...register('password', { 
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                })}
                error={errors.password?.message}
              />
            </div>

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Confirma tu contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
              error={errors.confirmPassword?.message}
            />

            {/* Campos específicos según el rol */}
            {userRole === 'patient' && renderPatientFields()}
            {userRole === 'nutritionist' && renderNutritionistFields()}
          </div>

          <Button 
            type="submit" 
            loading={isLoading}
            variant="accent"
            className="w-full"
            disabled={!userRole}
          >
            {userRole === 'patient' ? 'Registrarme como Paciente' : 
             userRole === 'nutritionist' ? 'Registrarme como Nutricionista' : 
             'Crear cuenta'}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-accent hover:text-accent/80 font-medium"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}