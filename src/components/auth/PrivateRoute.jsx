import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirigir al dashboard apropiado según el rol del usuario
    const userDashboard = user.role === 'patient' ? '/patient/dashboard' : '/dashboard';
    return <Navigate to={userDashboard} replace />;
  }

  return children;
}