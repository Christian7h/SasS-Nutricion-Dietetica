import PatientLayout from '../../components/layout/PatientLayout';
import Card from '../../components/common/Card';

export default function PatientProgressPage() {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-base-content">Mi Progreso</h1>
          <p className="mt-2 text-sm text-base-content/70">
            Visualiza tu progreso y evolución nutricional
          </p>
        </div>

        <Card>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-base-content mb-2">
              Próximamente
            </h3>
            <p className="text-base-content/70">
              Aquí podrás ver gráficos y estadísticas de tu progreso nutricional.
            </p>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
}
