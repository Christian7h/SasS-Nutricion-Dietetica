import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store para el tema global con Zustand
const useThemeStore = create(
  persist(
    (set, get) => ({
      // Estado del tema
      theme: 'light',
      systemTheme: null,
      followSystem: false,
      
      // Acciones
      setTheme: (theme) => {
        set({ theme, followSystem: false });
        document.documentElement.setAttribute('data-theme', theme);
      },
      
      setFollowSystem: (follow) => {
        if (follow) {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          set({ 
            followSystem: true, 
            systemTheme,
            theme: systemTheme 
          });
          document.documentElement.setAttribute('data-theme', systemTheme);
        } else {
          set({ followSystem: false });
        }
      },
      
      updateSystemTheme: (systemTheme) => {
        const state = get();
        set({ systemTheme });
        if (state.followSystem) {
          set({ theme: systemTheme });
          document.documentElement.setAttribute('data-theme', systemTheme);
        }
      },
      
      // Getters computados
      get currentTheme() {
        const state = get();
        return state.followSystem ? state.systemTheme || state.theme : state.theme;
      },
      
      get isDark() {
        return get().currentTheme === 'dark';
      },
      
      get isLight() {
        return get().currentTheme === 'light';
      },
      
      // Acción para toggle
      toggleTheme: () => {
        const state = get();
        const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        state.setTheme(newTheme);
      }
    }),
    {
      name: 'theme-settings',
      partialize: (state) => ({
        theme: state.theme,
        followSystem: state.followSystem
      })
    }
  )
);

// Hook para detectar preferencias del sistema
export const useSystemTheme = () => {
  const { updateSystemTheme } = useThemeStore();
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      updateSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Establecer tema inicial del sistema
    updateSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Escuchar cambios
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [updateSystemTheme]);
};

// Hook principal para usar en componentes
export const useTheme = () => {
  const store = useThemeStore();
  useSystemTheme();
  
  return {
    theme: store.currentTheme,
    isDark: store.isDark,
    isLight: store.isLight,
    followSystem: store.followSystem,
    setTheme: store.setTheme,
    setFollowSystem: store.setFollowSystem,
    toggleTheme: store.toggleTheme
  };
};

// Hook para aplicar tema al inicializar la app
export const useThemeInitializer = () => {
  const { followSystem, setFollowSystem, theme } = useThemeStore();
  
  React.useEffect(() => {
    // Aplicar tema inicial
    if (followSystem) {
      setFollowSystem(true); // Esto actualizará el tema del sistema
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [followSystem, setFollowSystem, theme]);
};

// Selector para usar solo el tema actual (optimizado para re-renders)
export const useCurrentTheme = () => useThemeStore(state => state.currentTheme);

// Selector para usar solo el estado dark/light
export const useIsDark = () => useThemeStore(state => state.isDark);

export default useThemeStore;
