import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleBasedRedirect from './components/auth/RoleBasedRedirect';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Appointments from './pages/appointments/Appointments';
import Patients from './pages/patients/Patients';
import Plans from './pages/plans/Plans';
import Profile from './pages/profile/Profile';
import Landing from './pages/landing/Landing';

// Páginas específicas para pacientes
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage';
import PatientPlanPage from './pages/patient/PatientPlanPage';
import PatientProgressPage from './pages/patient/PatientProgressPage';
import PatientHealthPage from './pages/patient/PatientHealthPage';

import { useThemeStore } from "./hooks/useThemeStore";
import NotificationContainer from './components/common/NotificationContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { theme } = useThemeStore();
  return (
    <div data-theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Redirección basada en rol */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <RoleBasedRedirect />
                  </PrivateRoute>
                } />

                {/* Rutas para nutricionistas */}
                <Route path="/nutritionist/dashboard" element={
                  <PrivateRoute allowedRoles={['nutritionist', 'admin']}>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/appointments" element={
                  <PrivateRoute allowedRoles={['nutritionist', 'admin']}>
                    <Appointments />
                  </PrivateRoute>
                } />
                <Route path="/patients" element={
                  <PrivateRoute allowedRoles={['nutritionist', 'admin']}>
                    <Patients />
                  </PrivateRoute>
                } />
                <Route path="/plans" element={
                  <PrivateRoute allowedRoles={['nutritionist', 'admin']}>
                    <Plans />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute allowedRoles={['nutritionist', 'admin']}>
                    <Profile />
                  </PrivateRoute>
                } />

                {/* Rutas para pacientes */}
                <Route path="/patient/dashboard" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientDashboardPage />
                  </PrivateRoute>
                } />
                <Route path="/patient/profile" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientProfilePage />
                  </PrivateRoute>
                } />
                <Route path="/patient/appointments" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientAppointmentsPage />
                  </PrivateRoute>
                } />
                <Route path="/patient/plan" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientPlanPage />
                  </PrivateRoute>
                } />
                <Route path="/patient/progress" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientProgressPage />
                  </PrivateRoute>
                } />
                <Route path="/patient/health" element={
                  <PrivateRoute allowedRoles={['patient']}>
                    <PatientHealthPage />
                  </PrivateRoute>
                } />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <NotificationContainer />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;