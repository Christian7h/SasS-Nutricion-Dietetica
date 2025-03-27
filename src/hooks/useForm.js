import { useState } from 'react';

export function useForm(initialState = {}) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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