import { VALIDATION_CONFIG } from '../config';

/**
 * Utilidades para validación de datos
 * Proporciona funciones reutilizables para validar diferentes tipos de datos
 */

// Función base para crear validadores
const createValidator = (validationFn, errorMessage) => (value) => {
  const isValid = validationFn(value);
  return {
    isValid,
    error: isValid ? null : errorMessage
  };
};

// Validadores básicos
export const validators = {
  // Validación de requerido
  required: createValidator(
    (value) => value !== null && value !== undefined && value !== '',
    'Este campo es requerido'
  ),

  // Validación de email
  email: createValidator(
    (value) => {
      if (!value) return true; // Opcional si no es requerido
      return VALIDATION_CONFIG.EMAIL.REGEX.test(value) && value.length <= VALIDATION_CONFIG.EMAIL.MAX_LENGTH;
    },
    'Ingresa un email válido'
  ),

  // Validación de contraseña
  password: createValidator(
    (value) => {
      if (!value) return true;
      const { PASSWORD } = VALIDATION_CONFIG;
      
      if (value.length < PASSWORD.MIN_LENGTH || value.length > PASSWORD.MAX_LENGTH) {
        return false;
      }
      
      if (PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) return false;
      if (PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(value)) return false;
      if (PASSWORD.REQUIRE_NUMBERS && !/\d/.test(value)) return false;
      if (PASSWORD.REQUIRE_SPECIAL_CHARS && !new RegExp(`[${PASSWORD.SPECIAL_CHARS}]`).test(value)) return false;
      
      return true;
    },
    `La contraseña debe tener entre ${VALIDATION_CONFIG.PASSWORD.MIN_LENGTH} y ${VALIDATION_CONFIG.PASSWORD.MAX_LENGTH} caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales`
  ),

  // Validación de nombre
  name: createValidator(
    (value) => {
      if (!value) return true;
      const { NAME } = VALIDATION_CONFIG;
      return NAME.REGEX.test(value) && value.length >= NAME.MIN_LENGTH && value.length <= NAME.MAX_LENGTH;
    },
    `El nombre debe tener entre ${VALIDATION_CONFIG.NAME.MIN_LENGTH} y ${VALIDATION_CONFIG.NAME.MAX_LENGTH} caracteres y solo contener letras`
  ),

  // Validación de teléfono
  phone: createValidator(
    (value) => {
      if (!value) return true;
      return VALIDATION_CONFIG.PHONE.REGEX.test(value);
    },
    'Ingresa un número de teléfono válido (ej: +56912345678 o 912345678)'
  ),

  // Validación de RUT chileno
  rut: createValidator(
    (value) => {
      if (!value) return true;
      
      // Validar formato
      if (!VALIDATION_CONFIG.RUT.REGEX.test(value)) return false;
      
      // Validar dígito verificador
      const [rut, dv] = value.split('-');
      let suma = 0;
      let multiplicador = 2;
      
      for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }
      
      const resto = suma % 11;
      const dvCalculado = 11 - resto;
      let dvEsperado;
      
      if (dvCalculado === 11) dvEsperado = '0';
      else if (dvCalculado === 10) dvEsperado = 'k';
      else dvEsperado = dvCalculado.toString();
      
      return dv.toLowerCase() === dvEsperado;
    },
    'Ingresa un RUT válido (ej: 12345678-9)'
  ),

  // Validación de longitud mínima
  minLength: (min) => createValidator(
    (value) => !value || value.length >= min,
    `Debe tener al menos ${min} caracteres`
  ),

  // Validación de longitud máxima
  maxLength: (max) => createValidator(
    (value) => !value || value.length <= max,
    `No puede tener más de ${max} caracteres`
  ),

  // Validación de número mínimo
  min: (min) => createValidator(
    (value) => value === null || value === undefined || value === '' || parseFloat(value) >= min,
    `El valor debe ser mayor o igual a ${min}`
  ),

  // Validación de número máximo
  max: (max) => createValidator(
    (value) => value === null || value === undefined || value === '' || parseFloat(value) <= max,
    `El valor debe ser menor o igual a ${max}`
  ),

  // Validación de número
  number: createValidator(
    (value) => !value || !isNaN(parseFloat(value)),
    'Ingresa un número válido'
  ),

  // Validación de número entero
  integer: createValidator(
    (value) => !value || Number.isInteger(parseFloat(value)),
    'Ingresa un número entero válido'
  ),

  // Validación de URL
  url: createValidator(
    (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    'Ingresa una URL válida'
  ),

  // Validación de fecha
  date: createValidator(
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    },
    'Ingresa una fecha válida'
  ),

  // Validación de fecha mínima
  minDate: (minDate) => createValidator(
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      const min = new Date(minDate);
      return date >= min;
    },
    `La fecha debe ser posterior a ${new Date(minDate).toLocaleDateString()}`
  ),

  // Validación de fecha máxima
  maxDate: (maxDate) => createValidator(
    (value) => {
      if (!value) return true;
      const date = new Date(value);
      const max = new Date(maxDate);
      return date <= max;
    },
    `La fecha debe ser anterior a ${new Date(maxDate).toLocaleDateString()}`
  ),

  // Validación de confirmación de contraseña
  confirmPassword: (password) => createValidator(
    (value) => value === password,
    'Las contraseñas no coinciden'
  ),

  // Validación de archivo
  file: (options = {}) => createValidator(
    (file) => {
      if (!file) return !options.required;
      
      // Validar tamaño
      if (options.maxSize && file.size > options.maxSize) return false;
      
      // Validar tipo
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) return false;
      
      return true;
    },
    `Archivo inválido. ${options.maxSize ? `Tamaño máximo: ${(options.maxSize / 1024 / 1024).toFixed(1)}MB.` : ''} ${options.allowedTypes ? `Tipos permitidos: ${options.allowedTypes.join(', ')}.` : ''}`
  )
};

// Función para validar un objeto con múltiples campos
export const validateForm = (data, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = data[field];
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Solo mostrar el primer error por campo
      }
    }
  }

  return { isValid, errors };
};

// Función para sanitizar texto
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .replace(/[<>]/g, ''); // Remover caracteres potencialmente peligrosos
};

// Función para sanitizar email
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  return email.toLowerCase().trim();
};

// Función para sanitizar teléfono
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  return phone.replace(/[^\d+]/g, ''); // Solo números y el signo +
};

// Función para sanitizar RUT
export const sanitizeRUT = (rut) => {
  if (typeof rut !== 'string') return rut;
  
  // Remover puntos y espacios, mantener guión
  let cleaned = rut.replace(/[.\s]/g, '').toUpperCase();
  
  // Añadir guión si no lo tiene
  if (cleaned.length > 1 && !cleaned.includes('-')) {
    cleaned = cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
  }
  
  return cleaned;
};

// Función para formatear RUT para mostrar
export const formatRUT = (rut) => {
  if (typeof rut !== 'string') return rut;
  
  const cleaned = sanitizeRUT(rut);
  const [number, dv] = cleaned.split('-');
  
  if (!number || !dv) return rut;
  
  // Añadir puntos cada 3 dígitos
  const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};

// Función para formatear números
export const formatNumber = (number, decimals = 0) => {
  if (typeof number !== 'number') return number;
  
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Función para formatear moneda
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return amount;
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

// Función para validar y sanitizar en una sola operación
export const validateAndSanitize = (data, validationRules, sanitizationRules = {}) => {
  // Primero sanitizar
  const sanitizedData = {};
  for (const [field, value] of Object.entries(data)) {
    const sanitizer = sanitizationRules[field];
    sanitizedData[field] = sanitizer ? sanitizer(value) : value;
  }

  // Luego validar
  const validation = validateForm(sanitizedData, validationRules);

  return {
    ...validation,
    data: sanitizedData
  };
};

// Constantes para validaciones específicas del dominio
export const NUTRITION_VALIDATORS = {
  weight: [
    validators.required,
    validators.number,
    validators.min(20),
    validators.max(300)
  ],
  
  height: [
    validators.required,
    validators.number,
    validators.min(100),
    validators.max(250)
  ],
  
  age: [
    validators.required,
    validators.integer,
    validators.min(1),
    validators.max(120)
  ],
  
  bmi: [
    validators.number,
    validators.min(10),
    validators.max(50)
  ],
  
  calories: [
    validators.number,
    validators.min(800),
    validators.max(5000)
  ]
};

export default {
  validators,
  validateForm,
  validateAndSanitize,
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeRUT,
  formatRUT,
  formatNumber,
  formatCurrency,
  NUTRITION_VALIDATORS
};
