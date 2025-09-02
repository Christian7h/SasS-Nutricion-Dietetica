import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { UserIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        profile: {
          specialties: [],
          education: data.education,
          experience: data.experience
        }
      };

      await registerUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

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
            Regístrate como nutricionista profesional
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Grid de 2 columnas para los campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Tu nombre completo"
              icon={<UserIcon className="h-5 w-5 text-base-content/70" />}
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                }
              })}
              error={errors.name?.message}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Correo electrónico inválido'
                }
              })}
              error={errors.email?.message}
            />

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Tipo de cuenta</span>
              </label>
              <select
                {...register('role', { required: 'Selecciona el tipo de cuenta' })}
                className="select select-bordered w-full"
              >
                <option value="">Seleccionar tipo</option>
                <option value="nutritionist">Nutricionista</option>
                <option value="patient">Paciente</option>
              </select>
              {errors.role && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.role.message}</span>
                </label>
              )}
            </div>

            <Input
              label="Años de experiencia"
              type="number"
              placeholder="5"
              icon={<BriefcaseIcon className="h-5 w-5 text-base-content/70" />}
              {...register('experience', { 
                required: 'Los años de experiencia son requeridos',
                min: {
                  value: 0,
                  message: 'La experiencia no puede ser negativa'
                }
              })}
              error={errors.experience?.message}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              error={errors.password?.message}
            />

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
          </div>

          {/* Campo de educación en ancho completo */}
          <div className="w-full">
            <Input
              label="Educación"
              type="text"
              placeholder="Licenciatura en Nutrición, Universidad XYZ"
              icon={<AcademicCapIcon className="h-5 w-5 text-base-content/70" />}
              {...register('education', { 
                required: 'La educación es requerida'
              })}
              error={errors.education?.message}
            />
          </div>

          <Button 
            type="submit" 
            loading={isLoading}
            variant="accent"
            className="w-full"
          >
            Crear cuenta
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