import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';
import * as authAPI from '../api/auth';

const AuthContext = createContext(null);

// Configuración de seguridad
const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const MAX_RETRY_ATTEMPTS = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Función para limpiar tokens de manera segura
  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setUser(null);
  }, []);

  // Función para verificar si el token ha expirado
  const isTokenExpired = useCallback(() => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }, []);

  // Función para establecer token con expiración
  const setTokenWithExpiry = useCallback((token, expiresIn = 24 * 60 * 60 * 1000) => {
    const expiryTime = Date.now() + expiresIn;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }, []);

  // Verificación de autenticación mejorada
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!token || isTokenExpired()) {
        clearTokens();
        return;
      }

      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      
      // Si es error 401/403, limpiar tokens
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearTokens();
      } else if (retryCount < MAX_RETRY_ATTEMPTS) {
        // Retry para errores de red
        setRetryCount(prev => prev + 1);
        setTimeout(() => checkAuth(), 1000 * (retryCount + 1));
        return;
      } else {
        clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  }, [isTokenExpired, clearTokens, retryCount]);

  // Verificar autenticación al montar y en intervalo
  useEffect(() => {
    checkAuth();
    
    // Verificar token cada 5 minutos
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        clearTokens();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuth, isTokenExpired, clearTokens]);

  // Login con manejo de errores mejorado
  const login = useCallback(async (credentials) => {
    try {
      // Validación básica
      if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      const data = await authAPI.login(credentials);
      
      if (!data.token || !data.user) {
        throw new Error('Respuesta de login inválida');
      }

      setTokenWithExpiry(data.token);
      setUser(data.user);
      setRetryCount(0);
      
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      clearTokens();
      throw error;
    }
  }, [setTokenWithExpiry, clearTokens]);

  // Register con validación mejorada
  const register = useCallback(async (userData) => {
    try {
      // Validación básica
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Todos los campos son requeridos');
      }

      const data = await authAPI.register(userData);
      
      if (!data.token || !data.user) {
        throw new Error('Respuesta de registro inválida');
      }

      setTokenWithExpiry(data.token);
      setUser(data.user);
      setRetryCount(0);
      
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }, [setTokenWithExpiry]);

  // Register patient con validación
  const registerPatient = useCallback(async (patientData) => {
    try {
      if (!patientData.email || !patientData.password || !patientData.name) {
        throw new Error('Datos del paciente incompletos');
      }

      const data = await authAPI.registerPatient(patientData);
      
      if (!data.token || !data.patient) {
        throw new Error('Respuesta de registro de paciente inválida');
      }

      setTokenWithExpiry(data.token);
      setUser(data.patient);
      setRetryCount(0);
      
      return data;
    } catch (error) {
      console.error('Error en registro de paciente:', error);
      throw error;
    }
  }, [setTokenWithExpiry]);

  // Get nutritionists con cache
  const getAvailableNutritionists = useCallback(async () => {
    try {
      return await authAPI.getAvailableNutritionists();
    } catch (error) {
      console.error('Error obteniendo nutricionistas:', error);
      throw error;
    }
  }, []);

  // Logout seguro
  const logout = useCallback(async () => {
    try {
      // Intentar notificar al servidor sobre el logout
      await api.post('/auth/logout').catch(() => {
        // Ignorar errores del servidor en logout
      });
    } finally {
      clearTokens();
    }
  }, [clearTokens]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    login,
    register,
    registerPatient,
    getAvailableNutritionists,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isTokenExpired: isTokenExpired()
  }), [
    user, 
    isLoading, 
    login, 
    register, 
    registerPatient, 
    getAvailableNutritionists, 
    logout, 
    checkAuth,
    isTokenExpired
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};