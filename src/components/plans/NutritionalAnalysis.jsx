import { useState, useMemo } from 'react';
import { 
  ChartBarIcon, 
  BeakerIcon,
  HeartIcon,
  ScaleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Card, { CardBody, CardTitle } from '../common/Card';

export default function NutritionalAnalysis({ plan }) {
  const [activeTab, setActiveTab] = useState('macros');

  // Calcular análisis nutricional
  const analysis = useMemo(() => {
    if (!plan.meals || plan.meals.length === 0) {
      return {
        totalCalories: 0,
        macros: { proteins: 0, carbs: 0, fats: 0 },
        micronutrients: {},
        recommendations: []
      };
    }

    // Sumar calorías de todas las comidas
    const totalCalories = plan.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    
    // Calcular distribución de macros basada en el plan
    const macros = plan.macroDistribution || { proteins: 20, carbs: 50, fats: 30 };
    
    // Calcular gramos de cada macro
    const proteinCalories = (totalCalories * macros.proteins) / 100;
    const carbCalories = (totalCalories * macros.carbs) / 100;
    const fatCalories = (totalCalories * macros.fats) / 100;

    const proteinGrams = proteinCalories / 4; // 4 kcal por gramo
    const carbGrams = carbCalories / 4; // 4 kcal por gramo
    const fatGrams = fatCalories / 9; // 9 kcal por gramo

    return {
      totalCalories,
      macros: {
        proteins: { percentage: macros.proteins, grams: Math.round(proteinGrams) },
        carbs: { percentage: macros.carbs, grams: Math.round(carbGrams) },
        fats: { percentage: macros.fats, grams: Math.round(fatGrams) }
      },
      recommendations: generateRecommendations(totalCalories, macros)
    };
  }, [plan]);

  const generateRecommendations = (calories, macros) => {
    const recommendations = [];
    
    if (calories < 1200) {
      recommendations.push({
        type: 'warning',
        title: 'Calorías bajas',
        message: 'El plan puede tener muy pocas calorías. Considera aumentar las porciones.'
      });
    }
    
    if (macros.proteins < 15) {
      recommendations.push({
        type: 'info',
        title: 'Proteína insuficiente',
        message: 'Se recomienda al menos 15% de proteínas para mantener masa muscular.'
      });
    }
    
    if (macros.fats > 35) {
      recommendations.push({
        type: 'warning',
        title: 'Alto en grasas',
        message: 'Considera reducir las grasas a menos del 35% del total calórico.'
      });
    }

    return recommendations;
  };

  const tabs = [
    { id: 'macros', label: 'Macronutrientes', icon: ChartBarIcon },
    { id: 'analysis', label: 'Análisis', icon: BeakerIcon },
    { id: 'recommendations', label: 'Recomendaciones', icon: HeartIcon }
  ];

  return (
    <div className="space-y-4">
      {/* Tabs de navegación */}
      <div className="tabs tabs-bordered">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div className="min-h-[300px]">
        {activeTab === 'macros' && (
          <div className="space-y-6">
            {/* Resumen calórico */}
            <div className="stat bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <div className="stat-figure text-primary">
                <ScaleIcon className="w-8 h-8" />
              </div>
              <div className="stat-title">Calorías Totales</div>
              <div className="stat-value text-primary">{analysis.totalCalories}</div>
              <div className="stat-desc">kcal por día</div>
            </div>

            {/* Distribución de macronutrientes */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-primary">Proteínas</span>
                  <span className="text-sm">{analysis.macros.proteins.percentage}%</span>
                </div>
                <div className="progress progress-primary w-full mb-2">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${analysis.macros.proteins.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-base-content/70">
                  {analysis.macros.proteins.grams}g por día
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-secondary">Carbohidratos</span>
                  <span className="text-sm">{analysis.macros.carbs.percentage}%</span>
                </div>
                <div className="progress progress-secondary w-full mb-2">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${analysis.macros.carbs.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-base-content/70">
                  {analysis.macros.carbs.grams}g por día
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-accent">Grasas</span>
                  <span className="text-sm">{analysis.macros.fats.percentage}%</span>
                </div>
                <div className="progress progress-accent w-full mb-2">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${analysis.macros.fats.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-base-content/70">
                  {analysis.macros.fats.grams}g por día
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Densidad Calórica</div>
                <div className="stat-value text-sm">
                  {plan.meals?.length > 0 ? Math.round(analysis.totalCalories / plan.meals.length) : 0}
                </div>
                <div className="stat-desc">kcal por comida</div>
              </div>
              
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Balance</div>
                <div className="stat-value text-sm text-success">Equilibrado</div>
                <div className="stat-desc">distribución macro</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Análisis Detallado</h4>
              
              <div className="bg-base-100 border rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm">
                    <strong>Proteínas:</strong> {analysis.macros.proteins.grams}g 
                    ({(analysis.macros.proteins.grams * 4).toFixed(0)} kcal)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm">
                    <strong>Carbohidratos:</strong> {analysis.macros.carbs.grams}g 
                    ({(analysis.macros.carbs.grams * 4).toFixed(0)} kcal)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-sm">
                    <strong>Grasas:</strong> {analysis.macros.fats.grams}g 
                    ({(analysis.macros.fats.grams * 9).toFixed(0)} kcal)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`alert ${rec.type === 'warning' ? 'alert-warning' : 'alert-info'}`}
                >
                  <InformationCircleIcon className="w-5 h-5" />
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm mt-1">{rec.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-success mx-auto mb-4" />
                <h4 className="font-medium text-success">Plan Bien Balanceado</h4>
                <p className="text-sm text-base-content/70 mt-2">
                  El plan nutricional cumple con las recomendaciones básicas.
                </p>
              </div>
            )}

            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Consejos Generales</h4>
              <ul className="text-sm space-y-1 text-base-content/70">
                <li>• Mantén una hidratación adecuada (8-10 vasos de agua al día)</li>
                <li>• Incluye variedad de colores en frutas y verduras</li>
                <li>• Prefiere alimentos integrales sobre procesados</li>
                <li>• Realiza actividad física regular</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
