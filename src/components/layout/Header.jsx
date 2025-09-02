import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  BellIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from '../../hooks/useThemeStore';
import { THEMES } from '../../constants';

export default function Header({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-base-300 bg-base-100 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-base-content lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Abrir sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-base-300 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-xl font-semibold text-base-content">
            NutriPro SaaS
          </h1>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="btn btn-ghost btn-circle">
              <SunIcon className="h-5 w-5 dark:hidden" />
              <MoonIcon className="h-5 w-5 hidden dark:block" />
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-base-100 py-1 shadow-lg ring-1 ring-base-300 focus:outline-none max-h-60 overflow-y-auto">
                {THEMES.map((themeName) => (
                  <Menu.Item key={themeName}>
                    {({ active }) => (
                      <button
                        onClick={() => handleThemeChange(themeName)}
                        className={`${
                          active ? 'bg-base-200' : ''
                        } ${
                          theme === themeName ? 'bg-accent text-accent-content' : 'text-base-content'
                        } block w-full px-4 py-2 text-left text-sm capitalize`}
                      >
                        {themeName}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Notifications */}
          <button
            type="button"
            className="btn btn-ghost btn-circle"
          >
            <span className="sr-only">Ver notificaciones</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-base-300" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-2 rounded-full bg-base-100 p-1.5 text-sm leading-6 text-base-content hover:bg-base-200">
              <span className="sr-only">Abrir menú de usuario</span>
              <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-semibold" aria-hidden="true">
                  {user?.name || 'Usuario'}
                </span>
              </span>
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
                    <a
                      href="/profile"
                      className={`${
                        active ? 'bg-base-200' : ''
                      } flex items-center px-4 py-2 text-sm text-base-content`}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                      Tu perfil
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/settings"
                      className={`${
                        active ? 'bg-base-200' : ''
                      } flex items-center px-4 py-2 text-sm text-base-content`}
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                      Configuración
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-base-200' : ''
                      } flex w-full items-center px-4 py-2 text-left text-sm text-base-content`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                      Cerrar sesión
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}