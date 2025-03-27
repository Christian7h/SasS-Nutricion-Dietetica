import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import AppointmentList from '../../components/appointments/AppointmentList';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PopupWidget } from "react-calendly";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold ">Citas</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/80 focus:outline-none border-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nueva Cita
            </button>
          </div>

          <div className="mt-6">
            <AppointmentList />
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