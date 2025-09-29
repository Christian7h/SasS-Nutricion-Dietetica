import { useState } from "react";
import Layout from "../../components/layout/Layout";
import PatientList from "../../components/patients/PatienstList";
import PatientNutritionistView from "../../components/patients/PatientNutritionistView";
import PatientModal from "../../components/patients/PatientsModal";
import {
  PlusIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("nutritionist"); // 'table' | 'nutritionist'

  return (
    <Layout>
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header - Layout responsivo */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-content truncate">
                Pacientes
              </h1>
              <p className="text-sm sm:text-base text-base-content/70 mt-1">
                Gestiona la información de tus pacientes
              </p>
            </div>

            {/* Controles - Stack vertical en móvil */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              {/* Selector de vista */}
              <div className="flex items-center justify-center space-x-1 bg-base-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`btn btn-xs sm:btn-sm ${
                    viewMode === "table" ? "btn-primary" : "btn-ghost"
                  } flex-1 sm:flex-none`}
                  title="Vista de tabla"
                >
                  <ViewColumnsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline ml-1 text-xs">Tabla</span>
                </button>
                <button
                  onClick={() => setViewMode("nutritionist")}
                  className={`btn btn-xs sm:btn-sm ${
                    viewMode === "nutritionist" ? "btn-primary" : "btn-ghost"
                  } flex-1 sm:flex-none`}
                  title="Vista nutricionista"
                >
                  <Squares2X2Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline ml-1 text-xs">Cards</span>
                </button>
              </div>

              {/* Botón nuevo paciente - Diseños adaptativos */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Nuevo Paciente</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="mt-6 sm:mt-8">
            {viewMode === "table" ? (
              <PatientList />
            ) : (
              <PatientNutritionistView />
            )}
          </div>
        </div>
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}
