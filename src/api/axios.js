import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Config de petición:', config); // Para debug
  return config;
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta:', response.data); // Para debug
    return response;
  },
  (error) => {
    console.error('Error en petición:', error.response?.data || error);
    return Promise.reject(error);
  }
);

export default api;