import { useState } from "react";
import Layout from "../../components/layout/Layout";
import PlanList from "../../components/plans/PlanList";
import PlanModal from "../../components/plans/PlanModal";
import MealManager from "../../components/plans/MealManager";
import PlanStatus from "../../components/plans/PlanStatus";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Plans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showMealManager, setShowMealManager] = useState(false);

  // Función para manejar la selección de un plan
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowMealManager(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setShowMealManager(false);
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-neutral-content">
              Planes Nutricionales
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo Plan
            </button>
          </div>

          {/* Panel de detalles */}
          {selectedPlan && (
            <div className="mb-8">
              <div className="bg-base-200 border border-base-300 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedPlan.title}
                  </h2>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <PlanStatus plan={selectedPlan} />

                {showMealManager && (
                  <MealManager
                    plan={selectedPlan}
                    onClose={() => setShowMealManager(false)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Lista de planes */}
          <div className="bg-base-200 border border-base-300 shadow-lg rounded-lg">
            <PlanList onPlanSelect={handlePlanSelect} />
          </div>
        </div>
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={selectedPlan}
      />
    </Layout>
  );
}