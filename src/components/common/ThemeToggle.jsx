import React from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../hooks/useTheme';
import Button from './Button';

const ThemeToggle = React.memo(({ size = 'md', className = '' }) => {
  const { theme, followSystem, setTheme, setFollowSystem } = useTheme();

  const handleThemeChange = React.useCallback((newTheme) => {
    if (newTheme === 'system') {
      setFollowSystem(true);
    } else {
      setTheme(newTheme);
    }
  }, [setTheme, setFollowSystem]);

  // Iconos y configuraciones para cada tema
  const themeOptions = React.useMemo(() => [
    {
      id: 'light',
      label: 'Claro',
      icon: SunIcon,
      active: theme === 'light' && !followSystem
    },
    {
      id: 'dark',
      label: 'Oscuro',
      icon: MoonIcon,
      active: theme === 'dark' && !followSystem
    },
    {
      id: 'system',
      label: 'Sistema',
      icon: ComputerDesktopIcon,
      active: followSystem
    }
  ], [theme, followSystem]);

  return (
    <div className={`theme-toggle ${className}`}>
      <div className="flex items-center gap-1 p-1 bg-base-200 rounded-lg">
        {themeOptions.map(({ id, label, icon: Icon, active }) => (
          <Button
            key={id}
            onClick={() => handleThemeChange(id)}
            variant={active ? 'primary' : 'ghost'}
            size={size}
            className={`
              flex items-center gap-2 min-w-0 transition-all duration-200
              ${active ? 'shadow-sm' : 'hover:bg-base-300'}
            `}
            aria-label={`Cambiar a tema ${label.toLowerCase()}`}
            data-active={active}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium hidden sm:inline">
              {label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

// Componente simple solo con iconos para espacios reducidos
export const ThemeToggleIcon = React.memo(({ size = 'md', className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size={size}
      className={`theme-toggle-icon ${className}`}
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
});

ThemeToggleIcon.displayName = 'ThemeToggleIcon';

// Componente de configuración avanzada de tema
export const ThemeSettings = React.memo(() => {
  const { 
    theme, 
    isDark, 
    followSystem, 
    setTheme, 
    setFollowSystem 
  } = useTheme();

  return (
    <div className="theme-settings space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configuración de Tema</h3>
        
        {/* Opción de seguir sistema */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={followSystem}
              onChange={(e) => setFollowSystem(e.target.checked)}
            />
            <div>
              <span className="label-text font-medium">Seguir configuración del sistema</span>
              <p className="text-sm text-base-content/70 mt-1">
                El tema cambiará automáticamente según las preferencias de tu dispositivo
              </p>
            </div>
          </label>
        </div>

        {/* Selector manual de tema */}
        {!followSystem && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Tema manual:</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${theme === 'light' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-base-300 hover:border-primary/50'
                  }
                `}
                onClick={() => setTheme('light')}
              >
                <div className="flex items-center gap-3">
                  <SunIcon className="h-6 w-6 text-warning" />
                  <div>
                    <p className="font-medium">Tema Claro</p>
                    <p className="text-sm text-base-content/70">Fondo blanco, texto oscuro</p>
                  </div>
                </div>
              </div>

              <div
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${theme === 'dark' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-base-300 hover:border-primary/50'
                  }
                `}
                onClick={() => setTheme('dark')}
              >
                <div className="flex items-center gap-3">
                  <MoonIcon className="h-6 w-6 text-info" />
                  <div>
                    <p className="font-medium">Tema Oscuro</p>
                    <p className="text-sm text-base-content/70">Fondo oscuro, texto claro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista previa del tema actual */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <p className="text-sm font-medium mb-2">Vista previa actual:</p>
          <div className="flex items-center gap-2 text-sm">
            {isDark ? (
              <MoonIcon className="h-4 w-4 text-info" />
            ) : (
              <SunIcon className="h-4 w-4 text-warning" />
            )}
            <span>
              {followSystem 
                ? `Tema ${isDark ? 'oscuro' : 'claro'} (sistema)` 
                : `Tema ${theme}`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ThemeSettings.displayName = 'ThemeSettings';

export default ThemeToggle;
