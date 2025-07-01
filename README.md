# SaaS Nutrición - Frontend

## 📋 Descripción del Proyecto

Aplicación web SaaS (Software as a Service) para gestión nutricional desarrollada con tecnologías modernas de frontend. La plataforma permite a nutricionistas gestionar pacientes, citas médicas, planes nutricionales y perfiles de usuario de manera eficiente y profesional.

## 🚀 Tecnologías Principales

### **Frontend Framework & Herramientas**
- **React 19.0.0** - Biblioteca principal para la construcción de interfaces de usuario
- **Vite 6.2.0** - Herramienta de construcción y desarrollo ultra-rápida
- **React Router DOM 7.3.0** - Enrutamiento declarativo para aplicaciones React

### **Estilización & UI**
- **Tailwind CSS 3.4.17** - Framework CSS utilitario para diseño responsivo
- **DaisyUI 4.12.14** - Biblioteca de componentes para Tailwind CSS
- **HeadlessUI 2.2.0** - Componentes UI sin estilos completamente accesibles
- **Heroicons 2.2.0** - Iconos SVG hermosos y gratuitos

### **Gestión de Estado & Datos**
- **TanStack React Query 5.67.3** - Gestión de estado del servidor y caché
- **Zustand 5.0.3** - Gestión de estado global minimalista
- **Axios 1.8.2** - Cliente HTTP para llamadas a API

### **Formularios & Validación**
- **React Hook Form 7.54.2** - Formularios performantes con validación mínima de re-renders

### **Experiencia de Usuario**
- **React Hot Toast 2.5.2** - Notificaciones toast elegantes
- **Theme Change 2.5.0** - Alternador de temas dinámico
- **Date-fns 4.1.0** - Manipulación y formateo de fechas
- **React Calendly 4.3.1** - Integración con sistema de citas Calendly

### **Desarrollo & Calidad de Código**
- **ESLint 9.21.0** - Linter para identificar y reportar patrones en JavaScript
- **PostCSS 8.5.3** - Herramienta para transformar CSS con plugins
- **Autoprefixer 10.4.21** - Plugin PostCSS para añadir prefijos de vendors

## 🏗️ Arquitectura del Proyecto

```
src/
├── api/                    # Configuración de cliente HTTP y autenticación
│   ├── auth.js
│   └── axios.js
├── components/             # Componentes reutilizables
│   ├── appointments/       # Gestión de citas médicas
│   ├── auth/              # Autenticación y rutas privadas
│   ├── common/            # Componentes base (Button, Input, etc.)
│   ├── layout/            # Estructura de layout
│   ├── navigation/        # Navegación de la aplicación
│   ├── patients/          # Gestión de pacientes
│   ├── plans/             # Planes nutricionales
│   └── profile/           # Perfil de usuario
├── constants/             # Constantes de la aplicación
├── context/               # Contextos de React (Auth, etc.)
├── hooks/                 # Hooks personalizados
├── pages/                 # Páginas principales de la aplicación
│   ├── appointments/
│   ├── auth/
│   ├── dashboard/
│   ├── patients/
│   ├── plans/
│   └── profile/
└── assets/               # Recursos estáticos
```

## 🎯 Funcionalidades Principales

### **Gestión de Autenticación**
- Sistema de login/registro seguro
- Rutas protegidas con PrivateRoute
- Gestión de tokens de autenticación
- Contexto global de autenticación

### **Dashboard Principal**
- Vista general de métricas importantes
- Navegación intuitiva a diferentes módulos
- Interfaz responsiva y moderna

### **Gestión de Pacientes**
- CRUD completo de pacientes
- Lista paginada y filtrable
- Modales para edición rápida
- Información detallada de cada paciente

### **Sistema de Citas**
- Programación de citas médicas
- Estados de cita (Programada, Completada, Cancelada)
- Integración con Calendly
- Gestión de estados con dropdown interactivo

### **Planes Nutricionales**
- Creación y gestión de planes alimenticios
- Lista de comidas y meal management
- Estados de planes
- Seguimiento de progreso

### **Perfil de Usuario**
- Visualización y edición de perfil
- Configuración de cuenta
- Gestión de preferencias

## 🔧 Configuración Técnica

### **Build System**
- **Vite** como bundler principal para desarrollo y producción
- **Hot Module Replacement (HMR)** para desarrollo rápido
- **Tree shaking** automático para optimización de bundle

### **Gestión de Estado**
- **React Query** para estado del servidor, caché y sincronización
- **Zustand** para estado global del cliente
- **React Context** para autenticación y temas

### **Estilo y Diseño**
- **Mobile-first** approach con Tailwind CSS
- **Design System** consistente con DaisyUI
- **Tema dinámico** con soporte para modo claro/oscuro
- **Accesibilidad** garantizada con HeadlessUI

### **Performance & Optimización**
- **Lazy loading** de componentes
- **Code splitting** automático
- **Optimización de imágenes**
- **Caché inteligente** con React Query

## 💻 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🌐 Patrones de Desarrollo Implementados

### **Custom Hooks**
- `useAuth()` - Gestión de autenticación
- `useForm()` - Manejo de formularios
- `usePatients()` - Operaciones con pacientes
- `usePlanOperations()` - Gestión de planes nutricionales
- `useThemeStore()` - Gestión de temas

### **Componentes Atómicos**
- Componentes reutilizables en `components/common/`
- Props tipadas y documentadas
- Separación clara de responsabilidades

### **Error Handling**
- Gestión centralizada de errores con React Query
- Feedback visual con toast notifications
- Estados de loading y error en componentes

## 🔒 Seguridad

- **Autenticación basada en tokens**
- **Rutas protegidas** con validación de permisos
- **Sanitización** de inputs de usuario
- **Headers de seguridad** configurados

## 📱 Responsividad

- **Mobile-first design**
- **Breakpoints** optimizados con Tailwind CSS
- **Touch-friendly** interfaces
- **Performance** optimizada en dispositivos móviles

## 🚦 Estados de la Aplicación

La aplicación maneja diferentes estados de manera eficiente:
- **Loading states** para operaciones asíncronas
- **Error states** con recuperación automática
- **Empty states** con call-to-actions claros
- **Success states** con feedback visual

---

## 👨‍💻 Perfil del Desarrollador

Este proyecto demuestra competencias en:
- ⚛️ **React moderno** (Hooks, Context, Suspense)
- 🎨 **CSS avanzado** (Tailwind, diseño responsivo)
- 📡 **Gestión de estado** (React Query, Zustand)
- 🔧 **Herramientas modernas** (Vite, ESLint)
- 🏗️ **Arquitectura escalable** y mantenible
- 🧪 **Buenas prácticas** de desarrollo frontend
- 📱 **UX/UI moderno** y accesible

*Proyecto ideal para demostrar habilidades como Analista Programador en tecnologías frontend modernas.*
