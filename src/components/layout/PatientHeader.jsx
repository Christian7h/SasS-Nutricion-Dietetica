import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import ThemeToggle from '../common/ThemeToggle';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PatientHeader({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      addNotification({
        type: 'success',
        message: 'Sesión cerrada exitosamente'
      });
    } catch {
      addNotification({
        type: 'error',
        message: 'Error al cerrar sesión'
      });
    }
  };

  const userMenuItems = [
    { 
      name: 'Mi Perfil', 
      href: '/patient/profile', 
      icon: UserCircleIcon 
    },
    { 
      name: 'Configuración', 
      href: '/patient/settings', 
      icon: Cog6ToothIcon 
    },
  ];

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-base-300 bg-base-100 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-base-content lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separador */}
      <div className="h-6 w-px bg-base-300 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-lg font-semibold text-base-content">
              ¡Hola, {user?.name?.split(' ')[0] || 'Paciente'}! 👋
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Notificaciones */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-base-content hover:text-base-content/80 transition-colors"
            title="Notificaciones"
          >
            <span className="sr-only">Ver notificaciones</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separador */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-base-300"
            aria-hidden="true"
          />

          {/* Menú de usuario */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-base-200 rounded-lg transition-colors">
              <span className="sr-only">Abrir menú de usuario</span>
              <div className="flex items-center gap-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-content font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-2 text-sm font-semibold leading-6 text-base-content" aria-hidden="true">
                    {user?.name || 'Paciente'}
                  </span>
                </span>
              </div>
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
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-base-100 py-2 shadow-lg ring-1 ring-base-300 focus:outline-none">
                <div className="px-3 py-2 border-b border-base-300">
                  <p className="text-sm text-base-content/70">Conectado como</p>
                  <p className="text-sm font-medium text-base-content truncate">
                    {user?.email}
                  </p>
                </div>
                
                {userMenuItems.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-base-200' : '',
                          'flex items-center gap-x-3 px-3 py-2 text-sm leading-6 text-base-content hover:bg-base-200 transition-colors'
                        )}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
                
                <div className="border-t border-base-300 mt-1 pt-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-base-200' : '',
                          'flex w-full items-center gap-x-3 px-3 py-2 text-sm leading-6 text-base-content hover:bg-base-200 transition-colors'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
