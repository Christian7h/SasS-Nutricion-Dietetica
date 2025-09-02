import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useLocation, Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Citas', href: '/appointments', icon: CalendarIcon },
  { name: 'Pacientes', href: '/patients', icon: UsersIcon },
  { name: 'Planes', href: '/plans', icon: ClipboardDocumentListIcon },
  { name: 'Perfil', href: '/profile', icon: UserIcon },
  { name: 'Reportes', href: '/reports', icon: ChartBarIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-base-300/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Cerrar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-base-content" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-base-100 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center gap-x-3">
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <span className="text-accent-content font-bold text-lg">N</span>
                      </div>
                      <span className="text-xl font-bold text-base-content">NutriPro</span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  location.pathname === item.href
                                    ? 'bg-accent text-accent-content'
                                    : 'text-base-content hover:bg-base-200',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={classNames(
                                    location.pathname === item.href
                                      ? 'text-accent-content'
                                      : 'text-base-content/70 group-hover:text-base-content',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-base-100 border-r border-base-300 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-x-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <span className="text-accent-content font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold text-base-content">NutriPro</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-accent text-accent-content'
                            : 'text-base-content hover:bg-base-200',
                          'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location.pathname === item.href
                              ? 'text-accent-content'
                              : 'text-base-content/70 group-hover:text-base-content',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}