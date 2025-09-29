/**
 * Configuración central de la aplicación
 * Centraliza todas las constantes y configuraciones importantes
 */

// URLs y endpoints de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://sass-nutricion-dietetica-backend.onrender.com/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Endpoints específicos
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    PATIENTS: {
      LIST: '/patients',
      CREATE: '/patients',
      UPDATE: '/patients/{id}',
      DELETE: '/patients/{id}',
      DETAIL: '/patients/{id}'
    },
    PLANS: {
      LIST: '/plans',
      CREATE: '/plans',
      UPDATE: '/plans/{id}',
      DELETE: '/plans/{id}',
      DETAIL: '/plans/{id}'
    },
    APPOINTMENTS: {
      LIST: '/appointments',
      CREATE: '/appointments',
      REQUEST: '/appointments/request',
      UPDATE: '/appointments/{id}',
      DELETE: '/appointments/{id}',
      DETAIL: '/appointments/{id}'
    }
  }
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  TOKEN_KEY: 'nutricionia_token',
  TOKEN_EXPIRY_KEY: 'nutricionia_token_expiry',
  REFRESH_TOKEN_KEY: 'nutricionia_refresh_token',
  USER_KEY: 'nutricionia_user',
  
  // Tiempos en milisegundos
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos antes de expirar
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutos de inactividad
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  
  // Configuración de sesión
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 días
  DEFAULT_SESSION_DURATION: 8 * 60 * 60 * 1000 // 8 horas
};

// Configuración de UI/UX
export const UI_CONFIG = {
  // Tamaños de componentes
  SIZES: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl'
  },
  
  // Variantes de botones
  BUTTON_VARIANTS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    GHOST: 'ghost',
    OUTLINE: 'outline'
  },
  
  // Configuración de tablas
  TABLE: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
    MAX_ROWS_PER_PAGE: 100
  },
  
  // Configuración de modales
  MODAL: {
    DEFAULT_SIZE: 'md',
    ANIMATION_DURATION: 300,
    BACKDROP_OPACITY: 0.25
  },
  
  // Configuración de notificaciones
  NOTIFICATIONS: {
    DEFAULT_DURATION: 5000, // 5 segundos
    ERROR_DURATION: 10000, // 10 segundos
    SUCCESS_DURATION: 3000, // 3 segundos
    MAX_NOTIFICATIONS: 5
  }
};

// Configuración de validaciones
export const VALIDATION_CONFIG = {
  // Passwords
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '!@#$%^&*(),.?":{}|<>'
  },
  
  // Email
  EMAIL: {
    MAX_LENGTH: 255,
    REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  
  // Nombres
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  
  // Teléfonos
  PHONE: {
    REGEX: /^(\+56)?[0-9]{8,9}$/
  },
  
  // RUT chileno
  RUT: {
    REGEX: /^[0-9]+-[0-9kK]{1}$/
  }
};

// Configuración de archivos
export const FILE_CONFIG = {
  // Imágenes
  IMAGES: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_WIDTH: 2048,
    MAX_HEIGHT: 2048
  },
  
  // Documentos
  DOCUMENTS: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};

// Configuración de aplicación
export const APP_CONFIG = {
  NAME: 'NutricionIA',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de gestión nutricional con IA',
  
  // URLs
  WEBSITE_URL: import.meta.env.VITE_WEBSITE_URL || 'https://nutricionia.cl',
  SUPPORT_EMAIL: 'soporte@nutricionia.cl',
  
  // Características
  FEATURES: {
    DARK_MODE: true,
    OFFLINE_SUPPORT: false,
    PWA: false,
    ANALYTICS: import.meta.env.PROD
  },
  
  // Límites
  LIMITS: {
    MAX_PATIENTS_PER_NUTRITIONIST: 100,
    MAX_PLANS_PER_PATIENT: 10,
    MAX_APPOINTMENTS_PER_DAY: 20
  }
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Logs
  ENABLE_CONSOLE_LOGS: import.meta.env.DEV,
  ENABLE_API_LOGS: import.meta.env.DEV,
  ENABLE_PERFORMANCE_LOGS: import.meta.env.DEV,
  
  // Debug
  ENABLE_REACT_DEVTOOLS: import.meta.env.DEV,
  ENABLE_REDUX_DEVTOOLS: import.meta.env.DEV,
  
  // Testing
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
  MOCK_DELAY: 1000
};

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  NUTRITIONIST: 'nutritionist',
  PATIENT: 'patient'
};

// Estados de citas
export const APPOINTMENT_STATES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

// Estados de planes nutricionales
export const PLAN_STATES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  // CSP (Content Security Policy)
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    FONT_SRC: ["'self'", "https://fonts.gstatic.com"],
    IMG_SRC: ["'self'", "data:", "https:"],
    CONNECT_SRC: ["'self'"]
  },
  
  // Rate limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    API_CALLS_PER_MINUTE: 60,
    FILE_UPLOADS_PER_HOUR: 10
  },
  
  // Headers de seguridad
  SECURITY_HEADERS: {
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin'
  }
};

// Configuración de caché
export const CACHE_CONFIG = {
  // Cache del navegador
  BROWSER_CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
    LONG_TTL: 24 * 60 * 60 * 1000, // 24 horas
    SHORT_TTL: 30 * 1000 // 30 segundos
  },
  
  // Claves de cache
  CACHE_KEYS: {
    USER_PROFILE: 'user_profile',
    PATIENTS_LIST: 'patients_list',
    PLANS_LIST: 'plans_list',
    APPOINTMENTS_LIST: 'appointments_list'
  }
};

// Exportar configuración combinada para fácil acceso
export const CONFIG = {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  UI: UI_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  FILE: FILE_CONFIG,
  APP: APP_CONFIG,
  DEV: DEV_CONFIG,
  SECURITY: SECURITY_CONFIG,
  CACHE: CACHE_CONFIG
};

export default CONFIG;
