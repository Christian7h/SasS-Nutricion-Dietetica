import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const statusConfig = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  scheduled: {
    label: 'Programada',
    className: 'bg-blue-100 text-blue-800',
    icon: ClockIcon
  },
  confirmed: {
    label: 'Confirmada',
    className: 'bg-blue-100 text-blue-800',
    icon: CheckIcon
  },
  completed: {
    label: 'Completada',
    className: 'bg-green-100 text-green-800',
    icon: CheckIcon
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-red-100 text-red-800',
    icon: XMarkIcon
  },
  rejected: {
    label: 'Rechazada',
    className: 'bg-red-100 text-red-800',
    icon: XMarkIcon
  }
};

export default function AppointmentStatus({ appointment }) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => 
      api.put(`/appointments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
    }
  });

  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({
      id: appointment._id,
      status: newStatus
    });
  };

  // Validar que appointment existe y tiene status
  if (!appointment || !appointment.status) {
    console.warn('AppointmentStatus: appointment or status is missing', appointment);
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <ClockIcon className="h-4 w-4 mr-1" />
        Sin estado
      </span>
    );
  }

  // Validar que el status existe en la configuración
  const statusInfo = statusConfig[appointment.status];
  if (!statusInfo) {
    console.warn('AppointmentStatus: unknown status', appointment.status);
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <ClockIcon className="h-4 w-4 mr-1" />
        {appointment.status || 'Desconocido'}
      </span>
    );
  }

  const CurrentIcon = statusInfo.icon;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${statusInfo.className}
      `}>
        <CurrentIcon className="h-4 w-4 mr-1" />
        {statusInfo.label}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {Object.entries(statusConfig).map(([status, config]) => (
              <Menu.Item key={status}>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusChange(status)}
                    disabled={appointment.status === status}
                    className={`
                      ${active ? 'bg-gray-100' : ''}
                      ${appointment.status === status ? 'bg-gray-50 cursor-default' : ''}
                      flex w-full items-center px-4 py-2 text-sm text-gray-700
                    `}
                  >
                    <config.icon className="h-4 w-4 mr-2" />
                    {config.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}