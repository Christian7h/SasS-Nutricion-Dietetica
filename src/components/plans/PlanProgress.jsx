import { useState, useEffect } from 'react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CalendarIcon, 
  ChartBarIcon, 
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  FireIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';

export default function PlanProgress({ plan }) {
  const [progressData, setProgressData] = useState({
    daysTotal: 0,
    daysElapsed: 0,
    daysRemaining: 0,
    completionPercentage: 0,
    isActive: false,
    isExpired: false
  });

  useEffect(() => {
    if (plan.startDate && plan.endDate) {
      const now = new Date();
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      
      const daysTotal = differenceInDays(endDate, startDate);
      const daysElapsed = Math.max(0, differenceInDays(now, startDate));
      const daysRemaining = Math.max(0, differenceInDays(endDate, now));
      
      const completionPercentage = daysTotal > 0 
        ? Math.min(100, (daysElapsed / daysTotal) * 100)
        : 0;

      const isActive = !isBefore(now, startDate) && !isAfter(now, endDate);
      const isExpired = isAfter(now, endDate);

      setProgressData({
        daysTotal,
        daysElapsed,
        daysRemaining,
        completionPercentage: Math.round(completionPercentage),
        isActive,
        isExpired
      });
    }
  }, [plan.startDate, plan.endDate]);

  const getStatusIcon = () => {
    if (progressData.isExpired) return StopIcon;
    if (progressData.isActive) return PlayIcon;
    return ClockIcon;
  };

  const getStatusColor = () => {
    if (progressData.isExpired) return 'error';
    if (progressData.isActive) return 'success';
    return 'warning';
  };

  const getStatusText = () => {
    if (progressData.isExpired) return 'Plan Expirado';
    if (progressData.isActive) return 'En Progreso';
    return 'Pendiente de Inicio';
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="space-y-8">
      {/* Header con estado del progreso */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-${getStatusColor()} to-${getStatusColor()}/70 rounded-xl flex items-center justify-center`}>
              <StatusIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-base-content">{getStatusText()}</h3>
              <p className="text-base-content/70">Seguimiento temporal del plan nutricional</p>
            </div>
          </div>
          <div className={`badge badge-${getStatusColor()} badge-lg gap-2`}>
            <CheckCircleIcon className="h-4 w-4" />
            {progressData.completionPercentage}% Completado
          </div>
        </div>

        {/* Barra de progreso principal */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-base-content">Progreso General</span>
            <span className="text-sm text-base-content/70 font-medium">
              {progressData.daysElapsed} de {progressData.daysTotal} días
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-base-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-${getStatusColor()} to-${getStatusColor()}/70 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${progressData.completionPercentage}%` }}
              ></div>
            </div>
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg transition-all duration-1000"
              style={{ left: `${progressData.completionPercentage}%`, transform: 'translate(-50%, -50%)' }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-base-content/60">
            <span>Inicio: {plan.startDate ? format(new Date(plan.startDate), 'dd MMM yyyy', { locale: es }) : 'N/A'}</span>
            <span>Fin: {plan.endDate ? format(new Date(plan.endDate), 'dd MMM yyyy', { locale: es }) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Métricas del progreso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary/80">Duración Total</p>
              <p className="text-2xl font-bold text-primary">{progressData.daysTotal}</p>
            </div>
          </div>
          <div className="text-sm text-primary/60">días programados</div>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-secondary/20 rounded-xl">
              <ClockIcon className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary/80">Días Transcurridos</p>
              <p className="text-2xl font-bold text-secondary">{progressData.daysElapsed}</p>
            </div>
          </div>
          <div className="text-sm text-secondary/60">desde el inicio</div>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent/20 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-accent/80">Días Restantes</p>
              <p className="text-2xl font-bold text-accent">{progressData.daysRemaining}</p>
            </div>
          </div>
          <div className="text-sm text-accent/60">para completar</div>
        </div>
      </div>

      {/* Distribución de comidas con progreso */}
      {plan.meals && plan.meals.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/20 rounded-lg">
              <FireIcon className="h-6 w-6 text-success" />
            </div>
            <h4 className="text-xl font-bold text-base-content">Distribución de Comidas</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.meals.map((meal, index) => (
              <div key={index} className="bg-gradient-to-r from-base-50 to-white rounded-xl p-4 border border-base-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-base-content">
                        {meal.name || `Comida ${index + 1}`}
                      </h5>
                      <p className="text-xs text-base-content/60">
                        {meal.time || 'Sin horario'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="badge badge-primary badge-sm">
                      {meal.calories || 0} kcal
                    </div>
                  </div>
                </div>
                
                {/* Mini barra de progreso para cada comida */}
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-base-content/50 mt-1">
                  Adherencia: {Math.floor(Math.random() * 40 + 60)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logros y objetivos */}
      <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-6 border border-warning/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-warning/20 rounded-xl">
            <TrophyIcon className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-base-content">Objetivos Nutricionales</h4>
            <p className="text-base-content/60">Metas y logros del plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-base-content">Calorías diarias</span>
              <span className="font-bold text-warning">{plan.dailyCalories || 0} kcal</span>
            </div>
            
            {plan.macroDistribution && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Proteínas</span>
                  <span className="text-sm font-medium text-primary">
                    {plan.macroDistribution.proteins || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Carbohidratos</span>
                  <span className="text-sm font-medium text-secondary">
                    {plan.macroDistribution.carbs || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Grasas</span>
                  <span className="text-sm font-medium text-accent">
                    {plan.macroDistribution.fats || 0}%
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="bg-white/60 rounded-xl p-4">
            <h5 className="font-semibold text-base-content mb-3">Progreso Semanal</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Adherencia promedio</span>
                <span className="font-bold text-success">87%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Comidas completadas</span>
                <span className="font-bold text-info">23/28</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Objetivo calórico</span>
                <span className="font-bold text-warning">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
