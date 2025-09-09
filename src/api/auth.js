import api from './axios';

// Registro de usuario (nutricionista o paciente)
export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// Registro específico de paciente
export const registerPatient = async (patientData) => {
  const { data } = await api.post('/auth/register/patient', patientData);
  return data;
};

// Login
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// Obtener nutricionistas disponibles
export const getAvailableNutritionists = async () => {
  const { data } = await api.get('/auth/nutritionists');
  return data;
};

// Validar token
export const validateToken = async () => {
  const { data } = await api.get('/auth/validate');
  return data;
};