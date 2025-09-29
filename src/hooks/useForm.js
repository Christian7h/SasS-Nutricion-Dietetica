import React from 'react';
import { useNotifications } from './useNotifications';

/**
 * Hook avanzado para manejo de formularios con validación, estado y optimizaciones
 */
export const useForm = (initialValues = {}, validationSchema = null, options = {}) => {
  const {
    onSubmit,
    resetOnSubmit = false,
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300,
    enableReinitialize = false
  } = options;

  const { addNotification } = useNotifications();

  // Estado del formulario
  const [state, setState] = React.useState(() => ({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    isValid: true
  }));

  // Ref para evitar validaciones obsoletas
  const validationTimeoutRef = React.useRef(null);
  const isUnmountedRef = React.useRef(false);

  // Limpiar timeouts al desmontar
  React.useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  // Reinicializar formulario si cambian los valores iniciales
  React.useEffect(() => {
    if (enableReinitialize && initialValues) {
      setState(prev => ({
        ...prev,
        values: initialValues,
        errors: {},
        touched: {},
        isValid: true
      }));
    }
  }, [initialValues, enableReinitialize]);

  // Función de validación optimizada
  const validateField = React.useCallback(async (name, value, allValues = state.values) => {
    if (!validationSchema || !validationSchema[name]) return null;

    try {
      const validator = validationSchema[name];
      if (typeof validator === 'function') {
        const result = await validator(value, allValues);
        return result || null;
      }
      return null;
    } catch (error) {
      return error.message || 'Error de validación';
    }
  }, [validationSchema, state.values]);

  // Validar todos los campos
  const validateForm = React.useCallback(async (values = state.values) => {
    if (!validationSchema) return {};

    const errors = {};
    const validationPromises = Object.keys(validationSchema).map(async (name) => {
      const error = await validateField(name, values[name], values);
      if (error) {
        errors[name] = error;
      }
    });

    await Promise.all(validationPromises);
    return errors;
  }, [validationSchema, validateField, state.values]);

  // Validación con debounce
  const debouncedValidation = React.useCallback((name, value, allValues) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(async () => {
      if (isUnmountedRef.current) return;

      setState(prev => ({ ...prev, isValidating: true }));
      
      const error = await validateField(name, value, allValues);
      
      if (!isUnmountedRef.current) {
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [name]: error
          },
          isValidating: false,
          isValid: !error && Object.keys(prev.errors).filter(key => key !== name).length === 0
        }));
      }
    }, debounceMs);
  }, [validateField, debounceMs]);

  // Manejar cambio de valor
  const handleChange = React.useCallback((name, value) => {
    setState(prev => {
      const newValues = {
        ...prev.values,
        [name]: value
      };

      // Validación inmediata si está habilitada
      if (validateOnChange && prev.touched[name]) {
        debouncedValidation(name, value, newValues);
      }

      return {
        ...prev,
        values: newValues
      };
    });
  }, [validateOnChange, debouncedValidation]);

  // Manejar blur (perder foco)
  const handleBlur = React.useCallback(async (name) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true
      }
    }));

    if (validateOnBlur) {
      const error = await validateField(name, state.values[name], state.values);
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: error
        },
        isValid: !error && Object.keys(prev.errors).filter(key => key !== name).length === 0
      }));
    }
  }, [validateOnBlur, validateField, state.values]);

  // Manejar envío del formulario
  const handleSubmit = React.useCallback(async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    setState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      submitCount: prev.submitCount + 1
    }));

    try {
      // Validar todo el formulario
      const errors = await validateForm(state.values);
      const hasErrors = Object.keys(errors).length > 0;

      setState(prev => ({
        ...prev,
        errors,
        isValid: !hasErrors,
        touched: Object.keys(prev.values).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {})
      }));

      if (hasErrors) {
        const errorCount = Object.keys(errors).length;
        addNotification({
          type: 'error',
          message: `Formulario inválido: ${errorCount} error${errorCount > 1 ? 'es' : ''} encontrado${errorCount > 1 ? 's' : ''}`
        });
        return { success: false, errors };
      }

      // Ejecutar función de envío si se proporciona
      let result = { success: true, data: state.values };
      if (onSubmit) {
        result = await onSubmit(state.values);
      }

      // Resetear si está configurado
      if (resetOnSubmit && result.success !== false) {
        reset();
      }

      return result;

    } catch (error) {
      console.error('Error en envío de formulario:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Error al enviar el formulario'
      });
      return { success: false, error };
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values, validateForm, onSubmit, resetOnSubmit, addNotification, reset]);

  // Establecer valor específico
  const setFieldValue = React.useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  // Resetear formulario
  const reset = React.useCallback((newValues = initialValues) => {
    setState({
      values: newValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      isValid: true
    });
  }, [initialValues]);

  // Helpers para campos individuales
  const getFieldProps = React.useCallback((name) => ({
    name,
    value: state.values[name] || '',
    onChange: (e) => {
      const value = e.target ? e.target.value : e;
      handleChange(name, value);
    },
    onBlur: () => handleBlur(name),
    error: state.touched[name] ? state.errors[name] : undefined,
    hasError: Boolean(state.touched[name] && state.errors[name])
  }), [state.values, state.touched, state.errors, handleChange, handleBlur]);

  return {
    // Estado
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValidating: state.isValidating,
    isValid: state.isValid,
    submitCount: state.submitCount,

    // Acciones
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
    validateForm,

    // Helpers
    getFieldProps
  };
};

/**
 * Hook simplificado para formularios básicos (compatibilidad con código existente)
 */
export function useSimpleForm(initialState = {}) {
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
  };

  const setFormErrors = (errorObj) => {
    setErrors(errorObj);
  };

  return {
    values,
    errors,
    isLoading,
    setIsLoading,
    handleChange,
    resetForm,
    setFormErrors
  };
}

export default useForm;