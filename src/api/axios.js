import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sass-nutricion-dietetica-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Config de petición:', config); // Para debug
  return config;
});

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