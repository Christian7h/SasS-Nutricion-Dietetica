import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl shadow-xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-base-content">
            Iniciar sesión
          </h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Correo electrónico</span>
              </label>
              <input
                {...register('email', { required: true })}
                type="email"
                className="input input-bordered bg-base-200 w-full focus:border-accent"
                placeholder="ejemplo@correo.com"
              />
              {errors.email && <span className="text-error text-sm mt-1">Este campo es requerido</span>}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Contraseña</span>
              </label>
              <input
                {...register('password', { required: true })}
                type="password"
                className="input input-bordered bg-base-200 w-full focus:border-accent"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-error text-sm mt-1">Este campo es requerido</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-accent w-full hover:btn-accent-focus"
          >
            Iniciar sesión
          </button>

          <div className="text-center">
            <p className="text-sm text-base-content">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="link link-accent">
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
