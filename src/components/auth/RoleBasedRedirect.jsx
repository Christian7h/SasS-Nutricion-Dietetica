import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

export default function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol del usuario
  switch (user.role) {
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    case 'nutritionist':
    case 'admin':
      return <Navigate to="/nutritionist/dashboard" replace />;
    default:
      // Por defecto, enviar a pacientes
      return <Navigate to="/patient/dashboard" replace />;
  }
}
