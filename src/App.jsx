import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Appointments from './pages/appointments/Appointments';
import Patients from './pages/patients/Patients';
import Plans from './pages/plans/Plans';
import Profile from './pages/profile/Profile';
import Landing from './pages/landing/Landing';
import { useThemeStore } from "./hooks/useThemeStore";

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
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/appointments" element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            } />
            <Route path="/patients" element={
              <PrivateRoute>
                <Patients />
              </PrivateRoute>
            } />
            <Route path="/plans" element={
              <PrivateRoute>
                <Plans />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
    </div>
  );
}

export default App;