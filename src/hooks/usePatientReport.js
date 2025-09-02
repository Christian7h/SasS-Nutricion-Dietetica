import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import { generatePatientReport, downloadPatientReport, downloadPatientReportHTML } from '../utils/reportGenerator';

export function usePatientReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useMutation({
    mutationFn: async ({ patientId, format = 'txt' }) => {
      setLoading(true);
      setError(null);

      try {
        // Obtener datos del paciente
        const { data: patientResponse } = await api.get(`/patients/${patientId}`);
        const patient = patientResponse.patient;

        // Obtener citas del paciente
        const { data: appointmentsResponse } = await api.get(`/appointments?patientId=${patientId}`);
        const appointments = appointmentsResponse.appointments || [];

        // Obtener planes del paciente
        const { data: plansResponse } = await api.get(`/plans?patientId=${patientId}`);
        const plans = plansResponse.plans || [];

        // Generar contenido del reporte
        const reportContent = await generatePatientReport(patient, appointments, plans);

        // Descargar según el formato solicitado
        if (format === 'html') {
          downloadPatientReportHTML(reportContent, patient.name);
        } else {
          downloadPatientReport(reportContent, patient.name);
        }

        return { success: true, patient: patient.name };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error al generar el reporte';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      console.log(`Reporte generado exitosamente para ${data.patient}`);
    },
    onError: (error) => {
      console.error('Error al generar reporte:', error);
      setError(error.message);
    }
  });

  return {
    generateReport: generateReport.mutate,
    loading: loading || generateReport.isPending,
    error: error || generateReport.error?.message,
    isSuccess: generateReport.isSuccess
  };
}
