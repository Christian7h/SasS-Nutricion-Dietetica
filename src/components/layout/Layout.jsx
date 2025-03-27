import { Fragment, useState } from 'react';
import { Dialog, Menu, MenuButton, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  HomeIcon,
  Bars2Icon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useThemeStore } from "../../hooks/useThemeStore";
import {THEMES} from "../../constants/index"
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Citas', href: '/appointments', icon: CalendarIcon },
  { name: 'Pacientes', href: '/patients', icon: UsersIcon },
  {name: 'Planes', href: '/plans', icon:ClipboardDocumentListIcon },
  {name: 'Profile', href: '/profile', icon: UserIcon},
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar para móvil */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          {/* ... Contenido del sidebar móvil ... */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          > 
            <Dialog.Panel focus="true" className="fixed inset-0 bg-base-200 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-base-200">
              <div className="absolute top-0 right-0 -mr-14 p-1">
                <button

                  type="button"
                  className="h-12 w-12 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" onClick={() => setSidebarOpen(false)}
                >      
                  <Bars2Icon className="h-6 w-6 text-base-content" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center h-16 flex-shrink-0 px-4 bg-base-200">
                  <h1 className="text-xl font-bold text-base-500">Nutrición SaaS</h1>
                </div>
                <nav className="flex-1 px-2 py-4 bg-base-200 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-base-content hover:bg-base-300"
                    >
                      <item.icon
                        className="mr-3 h-6 w-6 text-base-content group-hover:text-base-content"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      
      {/* Sidebar estático para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-base-200">
              <h1 className="text-xl font-bold text-base-500 ">Nutrición SaaS</h1>
            </div>
         
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-base-200 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-base-content hover:bg-base-300"
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 text-base-content group-hover:text-base-content"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-primary shadow">
          <button
            type="button"
            className="px-4 border-r border-base-300 text-base-content focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between bg-base-200">
            <div className="flex-1 flex">
              {/* Puedes agregar una barra de búsqueda aquí */}
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Menú de usuario */}
              <Menu as="div" className="ml-3 relative">
                <div>
                
                  <Menu.Button className="max-w-xs bg-base-200 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="h-8 w-8 rounded-full bg-neutral flex items-center justify-center text-neutral-content">
                      {user?.name?.charAt(0)}
                    </div>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-72 rounded-lg shadow-lg py-2 bg-base-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* Información del usuario */}
                    <div>
                    <a href="/profile" className="px-4 py-2 border-b border-base-300 block">
                      <p className="text-sm font-medium text-base-content">{user?.name}</p>
                      <p className="text-xs text-base-content/70">{user?.email}</p>
                    </a>
                    </div>
                    {/* Selector de temas */}
                    <div className="px-2 py-2 border-b border-base-300">
                      <p className="text-xs font-medium text-base-content/70 px-2 mb-2">Temas</p>
                      <div className="grid grid-cols-3 gap-1">
                        {THEMES.map((t) => (
                          <button
                            key={t}
                            className={`
                              group flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                              ${theme === t ? "bg-base-300" : "hover:bg-base-300/50"}
                            `}
                            onClick={() => setTheme(t)}
                          >
                            <div className="relative h-6 w-full rounded-md overflow-hidden" data-theme={t}>
                              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                <div className="rounded bg-primary"></div>
                                <div className="rounded bg-secondary"></div>
                                <div className="rounded bg-accent"></div>
                                <div className="rounded bg-neutral"></div>
                              </div>
                            </div>
                            <span className="text-[10px] font-medium truncate w-full text-center text-base-content">
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botón de cerrar sesión */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`
                            ${active ? 'bg-base-300' : ''}
                            group flex items-center w-full px-4 py-2 text-sm text-base-content hover:bg-base-300
                          `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z" clipRule="evenodd" />
                          </svg>
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

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
          
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}