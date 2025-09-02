import { useQuery } from '@tanstack/react-query';
import { PencilIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api from '../../api/axios';
import Loading from '../common/Loading';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { usePatientReport } from '../../hooks/usePatientReport';

export default function PatientList() {
  const { generateReport, loading: reportLoading } = usePatientReport();

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data } = await api.get('/patients');
      return data.patients;
    }
  });

  const handleDownloadReport = (patientId, format = 'txt') => {
    generateReport({ patientId, format });
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-error text-lg mb-2">Error al cargar los pacientes</div>
        <p className="text-base-content/70">{error.message}</p>
      </div>
    );
  }

  if (!patients?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-base-content mb-2">No hay pacientes registrados</h3>
        <p className="text-base-content/70">Comienza agregando tu primer paciente</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-200">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-base-content">
              Paciente
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Contacto
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Información Física
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-base-content">
              Estado
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-300 bg-base-100">
          {patients.map((patient) => (
            <tr key={patient._id} className="hover:bg-base-200">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-sm font-medium text-accent-content">
                        {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-base-content">{patient.name}</div>
                    <div className="text-base-content/70">{patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Femenino' : 'No especificado'}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">
                <div>{patient.email}</div>
                <div className="text-base-content/70">{patient.phone || 'Sin teléfono'}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-base-content">
                <div>Altura: {patient.height ? `${patient.height} cm` : 'No especificada'}</div>
                <div className="text-base-content/70">Peso: {patient.weight ? `${patient.weight} kg` : 'No especificado'}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <Badge variant="success" size="sm">
                  Activo
                </Badge>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" className="btn-circle">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  
                  {/* Menú de descarga de reportes */}
                  <Menu as="div" className="relative">
                    <Menu.Button as={Button} variant="ghost" size="sm" className="btn-circle" disabled={reportLoading}>
                      <DocumentArrowDownIcon className="h-4 w-4" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-base-100 py-1 shadow-lg ring-1 ring-base-300 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDownloadReport(patient._id, 'txt')}
                              className={`${
                                active ? 'bg-base-200' : ''
                              } flex w-full items-center px-4 py-2 text-sm text-base-content`}
                            >
                              <DocumentArrowDownIcon className="mr-3 h-4 w-4" />
                              Descargar como TXT
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDownloadReport(patient._id, 'html')}
                              className={`${
                                active ? 'bg-base-200' : ''
                              } flex w-full items-center px-4 py-2 text-sm text-base-content`}
                            >
                              <DocumentArrowDownIcon className="mr-3 h-4 w-4" />
                              Descargar como HTML
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  <Button variant="ghost" size="sm" className="btn-circle text-error hover:bg-error hover:text-error-content">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}