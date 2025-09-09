import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import Card, { CardBody, CardTitle } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function PatientSummary({ patient, onViewDetails }) {
  if (!patient) return null;

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'No especificada';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'No calculable';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi || bmi === 'No calculable') return { label: 'No determinado', variant: 'neutral' };
    const numBmi = parseFloat(bmi);
    
    if (numBmi < 16) return { label: 'Delgadez severa', variant: 'error' };
    if (numBmi < 17) return { label: 'Delgadez moderada', variant: 'warning' };
    if (numBmi < 18.5) return { label: 'Bajo peso', variant: 'warning' };
    if (numBmi < 25) return { label: 'Peso normal', variant: 'success' };
    if (numBmi < 30) return { label: 'Sobrepeso', variant: 'warning' };
    if (numBmi < 35) return { label: 'Obesidad grado I', variant: 'error' };
    if (numBmi < 40) return { label: 'Obesidad grado II', variant: 'error' };
    return { label: 'Obesidad grado III', variant: 'error' };
  };

  // Usar el IMC del backend si está disponible, si no calcularlo localmente
  const bmi = patient?.profile?.imc || calculateBMI(patient?.profile?.weight, patient?.profile?.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary-content">
                {patient.name?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-base-content truncate">
                {patient.name}
              </h3>
              <p className="text-sm text-base-content/70">
                {patient?.profile?.gender === 'male' ? 'Masculino' : patient?.profile?.gender === 'female' ? 'Femenino' : 'No especificado'} • 
                {calculateAge(patient?.profile?.birthDate)}
              </p>
              <p className="text-sm text-base-content/70">
                {patient.email}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(patient._id)}
          >
            Ver Detalles
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-base-200 rounded-lg">
            <ScaleIcon className="h-6 w-6 mx-auto mb-1 text-primary" />
            <div className="text-lg font-semibold text-base-content">
              {patient.profile.weight || '--'} kg
            </div>
            <div className="text-xs text-base-content/70">Peso</div>
          </div>

          <div className="text-center p-3 bg-base-200 rounded-lg">
            <div className="h-6 w-6 mx-auto mb-1 flex items-center justify-center text-primary">
              📏
            </div>
            <div className="text-lg font-semibold text-base-content">
              {patient.profile.height || '--'} cm
            </div>
            <div className="text-xs text-base-content/70">Altura</div>
          </div>

          <div className="text-center p-3 bg-base-200 rounded-lg">
            <HeartIcon className="h-6 w-6 mx-auto mb-1 text-secondary" />
            <div className="text-lg font-semibold text-base-content">
              {bmi && bmi !== 'No calculable' ? parseFloat(bmi).toFixed(2) : '--'}
            </div>
            <div className="text-xs text-base-content/70">IMC</div>
            <Badge variant={bmiCategory.variant} size="sm" className="mt-1">
              {bmiCategory.label}
            </Badge>
          </div>

          <div className="text-center p-3 bg-base-200 rounded-lg">
            <CalendarIcon className="h-6 w-6 mx-auto mb-1 text-accent" />
            <div className="text-lg font-semibold text-base-content">
              {patient.lastVisit 
                ? format(new Date(patient.lastVisit), 'dd/MM', { locale: es })
                : '--'
              }
            </div>
            <div className="text-xs text-base-content/70">Última visita</div>
          </div>
        </div>

        {/* Alertas importantes */}
        {patient.allergies?.length > 0 && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-warning text-sm">⚠️</span>
              <div>
                <p className="text-sm font-medium text-warning">Alergias registradas:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies.slice(0, 3).map((allergy, index) => (
                    <Badge key={index} variant="warning" size="sm">
                      {allergy}
                    </Badge>
                  ))}
                  {patient.allergies.length > 3 && (
                    <Badge variant="warning" size="sm">
                      +{patient.allergies.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
