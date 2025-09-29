// Re-exportar configuraciones desde el archivo central
export {
  API_CONFIG,
  AUTH_CONFIG,
  UI_CONFIG,
  VALIDATION_CONFIG,
  FILE_CONFIG,
  APP_CONFIG,
  DEV_CONFIG,
  SECURITY_CONFIG,
  CACHE_CONFIG,
  CONFIG,
  APP_STATES,
  USER_ROLES,
  APPOINTMENT_STATES,
  PLAN_STATES,
  NOTIFICATION_TYPES
} from '../config';

// Temas disponibles de DaisyUI
export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
];

// Constantes específicas del dominio de nutrición
export const NUTRITIONAL_DATA = {
  // Objetivos nutricionales
  GOALS: {
    WEIGHT_LOSS: 'weight_loss',
    WEIGHT_GAIN: 'weight_gain',
    MUSCLE_GAIN: 'muscle_gain',
    MAINTENANCE: 'maintenance',
    HEALTH_IMPROVEMENT: 'health_improvement'
  },
  
  // Niveles de actividad física
  ACTIVITY_LEVELS: {
    SEDENTARY: 'sedentary',
    LIGHT: 'light',
    MODERATE: 'moderate',
    ACTIVE: 'active',
    VERY_ACTIVE: 'very_active'
  },
  
  // Restricciones alimentarias
  DIETARY_RESTRICTIONS: {
    VEGETARIAN: 'vegetarian',
    VEGAN: 'vegan',
    GLUTEN_FREE: 'gluten_free',
    LACTOSE_FREE: 'lactose_free',
    DIABETIC: 'diabetic',
    HYPERTENSION: 'hypertension',
    LOW_SODIUM: 'low_sodium',
    LOW_FAT: 'low_fat'
  },
  
  // Grupos de alimentos
  FOOD_GROUPS: {
    PROTEINS: 'proteins',
    CARBOHYDRATES: 'carbohydrates',
    FATS: 'fats',
    VEGETABLES: 'vegetables',
    FRUITS: 'fruits',
    DAIRY: 'dairy',
    GRAINS: 'grains'
  },
  
  // Comidas del día
  MEAL_TYPES: {
    BREAKFAST: 'breakfast',
    MORNING_SNACK: 'morning_snack',
    LUNCH: 'lunch',
    AFTERNOON_SNACK: 'afternoon_snack',
    DINNER: 'dinner',
    EVENING_SNACK: 'evening_snack'
  },
  
  // Unidades de medida
  UNITS: {
    GRAMS: 'g',
    KILOGRAMS: 'kg',
    MILLILITERS: 'ml',
    LITERS: 'l',
    CUPS: 'cups',
    TABLESPOONS: 'tbsp',
    TEASPOONS: 'tsp',
    PIECES: 'pieces'
  }
};

// Constantes para métricas de salud
export const HEALTH_METRICS = {
  // Índices
  BMI: {
    UNDERWEIGHT: 18.5,
    NORMAL: 24.9,
    OVERWEIGHT: 29.9,
    OBESE: 30
  },
  
  // Presión arterial (mmHg)
  BLOOD_PRESSURE: {
    NORMAL_SYSTOLIC: 120,
    NORMAL_DIASTOLIC: 80,
    HIGH_SYSTOLIC: 140,
    HIGH_DIASTOLIC: 90
  },
  
  // Glucosa (mg/dL)
  GLUCOSE: {
    NORMAL_FASTING: 100,
    PREDIABETES_FASTING: 125,
    DIABETES_FASTING: 126
  },
  
  // Colesterol (mg/dL)
  CHOLESTEROL: {
    TOTAL_DESIRABLE: 200,
    LDL_OPTIMAL: 100,
    HDL_LOW_RISK_MEN: 40,
    HDL_LOW_RISK_WOMEN: 50
  }
};

// Constantes para reportes y análisis
export const REPORT_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
  CUSTOM: 'custom'
};

// Constantes para progreso del paciente
export const PROGRESS_INDICATORS = {
  WEIGHT: 'weight',
  BODY_FAT: 'body_fat',
  MUSCLE_MASS: 'muscle_mass',
  WAIST_CIRCUMFERENCE: 'waist_circumference',
  ENERGY_LEVEL: 'energy_level',
  MOOD: 'mood',
  SLEEP_QUALITY: 'sleep_quality',
  ADHERENCE: 'adherence'
};

// Constantes para tipos de consulta
export const CONSULTATION_TYPES = {
  INITIAL: 'initial',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  ONLINE: 'online',
  IN_PERSON: 'in_person'
};

// Constantes para métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  INSURANCE: 'insurance'
};

// Constantes para estados de facturación
export const BILLING_STATES = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Constantes para configuración de calendario
export const CALENDAR_CONFIG = {
  // Horarios de trabajo
  WORKING_HOURS: {
    START: '08:00',
    END: '18:00'
  },
  
  // Duración de citas (en minutos)
  APPOINTMENT_DURATIONS: {
    INITIAL: 60,
    FOLLOW_UP: 30,
    BRIEF: 15
  },
  
  // Días de la semana
  WEEKDAYS: {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0
  }
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  CONFLICT: 'Existe un conflicto con los datos actuales.',
  RATE_LIMIT: 'Demasiadas solicitudes. Intenta más tarde.'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Guardado exitosamente.',
  UPDATE_SUCCESS: 'Actualizado exitosamente.',
  DELETE_SUCCESS: 'Eliminado exitosamente.',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso.',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente.',
  REGISTER_SUCCESS: 'Registro exitoso.',
  PASSWORD_RESET: 'Contraseña restablecida exitosamente.',
  EMAIL_SENT: 'Email enviado exitosamente.',
  APPOINTMENT_SCHEDULED: 'Cita agendada exitosamente.',
  PLAN_CREATED: 'Plan nutricional creado exitosamente.'
};

// Configuración de formatos de fecha y hora
export const DATE_FORMATS = {
  SHORT_DATE: 'DD/MM/YYYY',
  LONG_DATE: 'DD [de] MMMM [de] YYYY',
  SHORT_TIME: 'HH:mm',
  LONG_TIME: 'HH:mm:ss',
  DATETIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// Configuración de localización
export const LOCALE_CONFIG = {
  DEFAULT_LOCALE: 'es-CL',
  SUPPORTED_LOCALES: ['es-CL', 'es-ES', 'en-US'],
  DATE_LOCALE: 'es',
  CURRENCY: 'CLP',
  TIMEZONE: 'America/Santiago'
};
