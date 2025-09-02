import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CalendarIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';
import Button from '../../components/common/Button';

export default function Landing() {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Gestión de Pacientes',
      description: 'Administra el historial médico, objetivos y progreso de tus pacientes de manera eficiente.'
    },
    {
      icon: CalendarIcon,
      title: 'Sistema de Citas',
      description: 'Programa y gestiona citas con calendario integrado y recordatorios automáticos.'
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Planes Nutricionales',
      description: 'Crea planes de alimentación personalizados con seguimiento detallado de macronutrientes.'
    },
    {
      icon: ChartBarIcon,
      title: 'Reportes y Análisis',
      description: 'Genera reportes detallados sobre el progreso de tus pacientes y tu práctica profesional.'
    }
  ];

  const benefits = [
    'Interfaz intuitiva y fácil de usar',
    'Acceso desde cualquier dispositivo',
    'Datos seguros y respaldados',
    'Soporte técnico 24/7',
    'Actualizaciones automáticas',
    'Integración con calendarios'
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-primary">N</span>
              </div>
              <h1 className="text-5xl font-bold">NutriPro</h1>
              <p className="text-xl opacity-90 mt-2">SaaS de Nutrición</p>
            </div>
            <p className="py-6 text-lg opacity-90">
              La plataforma integral para nutricionistas profesionales. 
              Gestiona pacientes, citas y planes nutricionales en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Todo lo que necesitas para tu práctica
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              NutriPro te ayuda a optimizar tu tiempo y mejorar la atención a tus pacientes 
              con herramientas profesionales diseñadas específicamente para nutricionistas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary-content" />
                    </div>
                  </div>
                  <h3 className="card-title text-lg justify-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-base-content mb-4">
                ¿Por qué elegir NutriPro?
              </h2>
              <p className="text-xl text-base-content/70">
                Únete a cientos de nutricionistas que ya confían en nuestra plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <CheckIcon className="w-6 h-6 text-success" />
                    </div>
                    <span className="text-base-content text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <div className="mockup-browser border bg-base-300">
                  <div className="mockup-browser-toolbar">
                    <div className="input border bg-base-200">https://nutripro.app</div>
                  </div>
                  <div className="flex justify-center px-4 py-16 bg-base-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <ChartBarIcon className="w-8 h-8 text-primary-content" />
                      </div>
                      <h3 className="text-lg font-semibold text-base-content">Dashboard Profesional</h3>
                      <p className="text-base-content/70 mt-2">Visualiza toda tu práctica en tiempo real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-content mb-6">
            ¿Listo para revolucionar tu práctica?
          </h2>
          <p className="text-xl text-primary-content/90 mb-8 max-w-2xl mx-auto">
            Comienza hoy mismo con una prueba gratuita de 14 días. 
            No necesitas tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Probar Gratis por 14 días
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-content font-bold">N</span>
            </div>
            <span className="text-xl font-bold">NutriPro</span>
          </div>
          <p className="font-bold">
            NutriPro SaaS - Plataforma profesional para nutricionistas
          </p>
          <p>© 2025 NutriPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
