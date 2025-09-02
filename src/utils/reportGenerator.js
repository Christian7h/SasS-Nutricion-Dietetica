import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para generar reporte de paciente en formato texto/HTML para descargar
export const generatePatientReport = async (patientData, appointments, plans) => {
  try {
    // Obtener datos completos del paciente
    const patient = patientData;
    
    // Crear el contenido del reporte
    const reportContent = `
# REPORTE MÉDICO NUTRICIONAL

## DATOS DEL PACIENTE

**Nombre:** ${patient.name}
**Email:** ${patient.email}
**Teléfono:** ${patient.phone || 'No especificado'}
**Fecha de Nacimiento:** ${patient.birthDate ? format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: es }) : 'No especificada'}
**Género:** ${patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Femenino' : patient.gender || 'No especificado'}
**Altura:** ${patient.height ? `${patient.height} cm` : 'No especificada'}
**Peso:** ${patient.weight ? `${patient.weight} kg` : 'No especificado'}
**IMC:** ${patient.height && patient.weight ? calculateBMI(patient.weight, patient.height) : 'No calculable'}

## HISTORIAL MÉDICO

**Historial Médico:** ${patient.medicalHistory || 'Sin historial registrado'}

**Alergias:** ${patient.allergies || 'Sin alergias registradas'}

**Objetivos:** ${patient.goals || 'Sin objetivos específicos registrados'}

---

## HISTORIAL DE CITAS

${appointments && appointments.length > 0 ? 
  appointments.map((appointment, index) => `
### Cita ${index + 1}
**Fecha:** ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: es })}
**Hora:** ${appointment.time}
**Tipo:** ${appointment.appointmentType || appointment.type || 'Consulta general'}
**Estado:** ${getAppointmentStatusText(appointment.status)}
**Notas:** ${appointment.notes || 'Sin notas registradas'}
`).join('\n') : 'No se han registrado citas para este paciente.'
}

---

## PLANES NUTRICIONALES

${plans && plans.length > 0 ? 
  plans.map((plan, index) => `
### Plan ${index + 1}: ${plan.title || `Plan Nutricional ${index + 1}`}

**Descripción:** ${plan.description || 'Sin descripción'}
**Fecha de Inicio:** ${plan.startDate ? format(new Date(plan.startDate), 'dd/MM/yyyy', { locale: es }) : 'No especificada'}
**Fecha de Fin:** ${plan.endDate ? format(new Date(plan.endDate), 'dd/MM/yyyy', { locale: es }) : 'No especificada'}
**Estado:** ${getPlanStatusText(plan.status)}
**Calorías Diarias:** ${plan.dailyCalories || 'No especificadas'} kcal

**Objetivos del Plan:**
${plan.objectives && plan.objectives.length > 0 ? 
  plan.objectives.map(obj => `- ${obj}`).join('\n') : 
  '- Sin objetivos específicos'
}

**Distribución de Macronutrientes:**
- Proteínas: ${plan.macroDistribution?.proteins || 'No especificado'}%
- Carbohidratos: ${plan.macroDistribution?.carbs || 'No especificado'}%
- Grasas: ${plan.macroDistribution?.fats || 'No especificado'}%

**Comidas del Plan:**
${plan.meals && plan.meals.length > 0 ? 
  plan.meals.map(meal => `
**${meal.name}** (${meal.time})
${meal.foods && meal.foods.length > 0 ? 
  meal.foods.map(food => 
    `- ${food.name}: ${food.portion} (${food.calories || 0} kcal, P: ${food.proteins || 0}g, C: ${food.carbs || 0}g, G: ${food.fats || 0}g)`
  ).join('\n') : 
  '- Sin alimentos especificados'
}
`).join('\n') : 
  'Sin comidas planificadas'
}

**Restricciones Alimentarias:**
${plan.restrictions && plan.restrictions.length > 0 ? 
  plan.restrictions.map(restriction => `- ${restriction}`).join('\n') : 
  '- Sin restricciones específicas'
}

**Suplementos:**
${plan.supplements && plan.supplements.length > 0 ? 
  plan.supplements.map(supplement => 
    `- ${supplement.name}: ${supplement.dosage} (${supplement.frequency})`
  ).join('\n') : 
  '- Sin suplementos recomendados'
}
`).join('\n---\n') : 'No se han creado planes nutricionales para este paciente.'
}

---

**Reporte generado el:** ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
**Sistema:** NutriPro SaaS
`;

    return reportContent;
  } catch (error) {
    console.error('Error generando reporte:', error);
    throw new Error('Error al generar el reporte del paciente');
  }
};

// Función para descargar el reporte como archivo de texto
export const downloadPatientReport = (content, patientName) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_${patientName.replace(/\s+/g, '_').toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Función para generar y descargar reporte en HTML
export const downloadPatientReportHTML = (content, patientName) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Nutricional - ${patientName}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            color: #333;
        }
        h1 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #5a6c7d; }
        .patient-data { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .appointment, .plan { border-left: 4px solid #3498db; padding-left: 15px; margin: 15px 0; }
        .plan { border-left-color: #27ae60; }
        strong { color: #2c3e50; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    ${content.replace(/\n/g, '<br>').replace(/# /g, '<h1>').replace(/## /g, '<h2>').replace(/### /g, '<h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
    <div class="footer">
        <p><em>Este reporte fue generado automáticamente por NutriPro SaaS</em></p>
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_${patientName.replace(/\s+/g, '_').toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Funciones auxiliares
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return `${bmi.toFixed(1)} kg/m² (${getBMICategory(bmi)})`;
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidad';
};

const getAppointmentStatusText = (status) => {
  const statusMap = {
    'scheduled': 'Programada',
    'completed': 'Completada',
    'cancelled': 'Cancelada'
  };
  return statusMap[status] || status || 'Sin estado';
};

const getPlanStatusText = (status) => {
  const statusMap = {
    'active': 'Activo',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'draft': 'Borrador'
  };
  return statusMap[status] || status || 'Sin estado';
};
