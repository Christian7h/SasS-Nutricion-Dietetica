import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import AppointmentList from '../../components/appointments/AppointmentList';
import PendingAppointmentRequests from '../../components/appointments/PendingAppointmentRequests';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import { PlusIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { PopupWidget } from "react-calendly";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' o 'pending'

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Gestión de Citas</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/80 focus:outline-none border-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nueva Cita
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-base-300 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Citas Programadas
                </div>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-warning text-warning'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Solicitudes Pendientes
                </div>
              </button>
            </nav>
          </div>

          {/* Contenido según tab activo */}
          <div className="mt-6">
            {activeTab === 'appointments' ? (
              <AppointmentList />
            ) : (
              <PendingAppointmentRequests />
            )}
          </div>
        </div>
      </div>
          <PopupWidget
        url="https://calendly.com/cristianvillalobos666/30min"
        /*
         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
         * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
         */
        rootElement={document.getElementById("root")}
        text="Click here to schedule!"
        textColor="#ffffff"
        color="#00a2ff"
      />
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}