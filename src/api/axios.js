import axios from 'axios';
import { API_CONFIG } from '../config';

// Store para manejo de tokens y estado de autenticación
let authState = {
  token: null,
  refreshToken: null,
  isRefreshing: false,
  failedQueue: []
};

// Utilidades para manejo de tokens
export const tokenUtils = {
  setTokens: (token, refreshToken = null) => {
    authState.token = token;
    authState.refreshToken = refreshToken;
    
    if (token) {
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  },

  getToken: () => {
    if (!authState.token) {
      authState.token = localStorage.getItem('token');
    }
    return authState.token;
  },

  getRefreshToken: () => {
    if (!authState.refreshToken) {
      authState.refreshToken = localStorage.getItem('refreshToken');
    }
    return authState.refreshToken;
  },

  clearTokens: () => {
    authState.token = null;
    authState.refreshToken = null;
    authState.isRefreshing = false;
    authState.failedQueue = [];
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
};

// Configuración base optimizada
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'https://sass-nutricion-dietetica-backend.onrender.com/api', 
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false
});

// Queue para manejar requests durante refresh de token
const processQueue = (error, token = null) => {
  authState.failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  authState.failedQueue = [];
};

// Interceptor de Request optimizado
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = tokenUtils.getToken();
    if (token && !tokenUtils.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Configurar timeout específico por request
    if (config.url?.includes('/upload')) {
      config.timeout = 300000; // 5 minutos para uploads
    }

    // Agregar ID único para tracking
    config.metadata = {
      startTime: Date.now(),
      requestId: Math.random().toString(36).substr(2, 9)
    };

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 Request [${config.metadata.requestId}]:`, {
        method: config.method?.toUpperCase(),
        url: config.url
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response optimizado
api.interceptors.response.use(
  (response) => {
    // Log de performance en desarrollo
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`✅ Response [${response.config.metadata.requestId}]:`, {
        status: response.status,
        duration: `${duration}ms`
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log de error en desarrollo
    if (import.meta.env.DEV && originalRequest?.metadata) {
      const duration = Date.now() - originalRequest.metadata.startTime;
      console.error(`❌ Error [${originalRequest.metadata.requestId}]:`, {
        status: error.response?.status,
        duration: `${duration}ms`,
        message: error.message
      });
    }

    // Manejo de error 401 (Token expirado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (authState.isRefreshing) {
        return new Promise((resolve, reject) => {
          authState.failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      authState.isRefreshing = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intentar refresh del token
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        tokenUtils.setTokens(newToken, newRefreshToken);
        processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenUtils.clearTokens();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        authState.isRefreshing = false;
      }
    }

    // Agregar mensajes de error amigables
    const status = error.response?.status;
    const errorMessages = {
      400: 'Solicitud inválida. Verifica los datos enviados.',
      403: 'No tienes permisos para realizar esta acción.',
      404: 'El recurso solicitado no fue encontrado.',
      409: 'Conflicto con el estado actual del recurso.',
      422: 'Los datos enviados no son válidos.',
      429: 'Demasiadas solicitudes. Inténtalo más tarde.',
      500: 'Error interno del servidor. Inténtalo más tarde.',
      502: 'Error de conexión con el servidor.',
      503: 'Servicio no disponible temporalmente.',
      504: 'Timeout del servidor.'
    };

    if (status && errorMessages[status]) {
      error.userMessage = errorMessages[status];
    }

    // Manejo de errores de red
    if (!error.response) {
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        error.isNetworkError = true;
        error.userMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error.code === 'ECONNABORTED') {
        error.isTimeoutError = true;
        error.userMessage = 'La solicitud tardó demasiado tiempo. Inténtalo de nuevo.';
      }
    }

    return Promise.reject(error);
  }
);

// Cliente especializado para uploads
export const uploadClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Aplicar interceptors al cliente de upload
uploadClient.interceptors.request.use(
  api.interceptors.request.handlers[0].fulfilled,
  api.interceptors.request.handlers[0].rejected
);

uploadClient.interceptors.response.use(
  api.interceptors.response.handlers[0].fulfilled,
  api.interceptors.response.handlers[0].rejected
);

// Cliente para requests públicos
export const publicClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Utilidades para requests
export const requestUtils = {
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl, API_CONFIG.BASE_URL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  },

  createFormData: (data, files = {}) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    return formData;
  },

  withRetry: async (requestFn, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // No reintentar en errores 4xx (excepto 429)
        if (error.response?.status >= 400 && 
            error.response?.status < 500 && 
            error.response?.status !== 429) {
          break;
        }

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * 2 ** attempt, 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
};

export default api;