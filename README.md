# 🚀 Admin Panel - React + Vite + TypeScript

Panel de administración moderno, completo y altamente reutilizable construido con las últimas tecnologías.

## 🌐 URL de Desarrollo

La aplicación está corriendo en modo desarrollo y lista para conectar con tu backend.

## ✨ Características Principales

### 🎨 UI/UX Moderno
- **Tema Dark/Light**: Switch automático entre temas
- **Responsive Design**: Mobile-first, adaptable a todos los dispositivos
- **Animaciones Suaves**: Transiciones con Framer Motion
- **Componentes Reutilizables**: Biblioteca completa de componentes UI

### 🔌 Integración con Backend
- **Hooks Personalizados**: Sistema completo de hooks para API
- **React Query**: Caché automático, sincronización y revalidación
- **Interceptores Axios**: Manejo de tokens, refresh automático
- **TypeScript Strict**: Tipado completo para mayor seguridad

### 📊 Sistema CRUD Completo
- **CrudTable**: Tablas con ordenamiento, filtros y acciones
- **CrudPagination**: Paginación avanzada
- **CrudActions**: Menú de acciones (editar, eliminar, ver, duplicar)
- **CrudFilters**: Sistema de filtros personalizables
- **Bulk Actions**: Acciones masivas (eliminar múltiples)

### 🔧 Procesos Especiales
- **ProcessRunner**: Ejecutar procesos y APIs personalizadas
- **Process Monitoring**: Monitoreo en tiempo real
- **Process History**: Historial de ejecuciones

### 📈 Dashboard Interactivo
- **Widgets de Estadísticas**: Tarjetas con métricas
- **Gráficos**: Recharts para visualización de datos
- **Actividad Reciente**: Timeline de acciones

## 🛠️ Tech Stack

### Core
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool ultrarrápido

### Estado y Data Fetching
- **React Query** (TanStack Query) - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client con interceptores

### UI y Estilos
- **TailwindCSS 3** - Utility-first CSS
- **Headless UI** - Componentes accesibles
- **Heroicons** - Iconos
- **Framer Motion** - Animaciones

### Formularios y Validación
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Tablas
- **TanStack Table** - Tablas avanzadas

### Gráficos
- **Recharts** - Gráficos interactivos

### Routing
- **React Router DOM 7** - Navegación

## 📁 Estructura del Proyecto

```
Dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navbar.tsx
│   │   ├── crud/            # Componentes CRUD
│   │   │   ├── CrudTable.tsx
│   │   │   ├── CrudActions.tsx
│   │   │   └── CrudPagination.tsx
│   │   └── process/         # Componentes de procesos
│   │       └── ProcessRunner.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.ts        # Hook base para API
│   │   ├── useCrud.ts       # Hook genérico CRUD
│   │   ├── useAuth.ts       # Hook de autenticación
│   │   └── useProcess.ts    # Hook para procesos especiales
│   ├── services/            # Servicios
│   │   └── api.service.ts   # Servicio Axios configurado
│   ├── store/               # Zustand stores
│   │   ├── themeStore.ts
│   │   ├── notificationStore.ts
│   │   └── sidebarStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── config/              # Configuración
│   │   └── api.config.ts
│   ├── pages/               # Páginas
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   └── users/
│   │       └── UsersPage.tsx
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Entry point
├── public/                  # Archivos estáticos
├── .env.example             # Variables de entorno ejemplo
├── tailwind.config.js       # Configuración TailwindCSS
├── tsconfig.json            # Configuración TypeScript
├── vite.config.ts           # Configuración Vite
└── package.json
```

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` y configura la URL de tu backend:
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Iniciar Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Build para Producción
```bash
npm run build
```

## 🔌 Conectar con tu Backend

### Configuración de Endpoints

Edita `src/config/api.config.ts`:

```typescript
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  users: {
    list: '/users',
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    show: (id) => `/users/${id}`,
  },
  // Añade más endpoints según tu backend
}
```

### Usar Hooks Personalizados

#### Hook CRUD Genérico

```typescript
import { useCrud } from '@/hooks/useCrud'
import { User } from '@/types'

function UsersPage() {
  const userCrud = useCrud<User>({ 
    endpoint: '/users', 
    queryKey: 'users' 
  })
  
  // Listar usuarios
  const { data: users, isLoading } = userCrud.useList({ 
    page: 1, 
    perPage: 10,
    search: 'john'
  })
  
  // Crear usuario
  const createUser = userCrud.useCreate()
  createUser.mutate({ name: 'John', email: 'john@example.com' })
  
  // Actualizar usuario
  const updateUser = userCrud.useUpdate()
  updateUser.mutate({ id: 1, data: { name: 'John Updated' } })
  
  // Eliminar usuario
  const deleteUser = userCrud.useDelete()
  deleteUser.mutate(1)
  
  // Eliminar múltiples
  const bulkDelete = userCrud.useBulkDelete()
  bulkDelete.mutate([1, 2, 3])
}
```

#### Hook de Procesos Especiales

```typescript
import { useProcess } from '@/hooks/useProcess'

function ProcessPage() {
  const { useExecuteProcess } = useProcess()
  const execute = useExecuteProcess()
  
  const handleExecute = () => {
    execute.mutate({
      endpoint: '/api/custom-process',
      method: 'POST',
      data: { param1: 'value1' }
    })
  }
}
```

## 🎨 Componentes Disponibles

### UI Components

#### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Guardar
</Button>
```

Variantes: `primary`, `secondary`, `danger`, `success`, `warning`, `ghost`
Tamaños: `sm`, `md`, `lg`

#### Card
```tsx
<Card 
  header={<CardHeader title="Título" subtitle="Subtítulo" />}
  footer={<div>Footer</div>}
>
  Contenido
</Card>
```

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
  error="Campo requerido"
  icon={<EnvelopeIcon />}
/>
```

#### Select
```tsx
<Select
  label="Rol"
  options={[
    { label: 'Admin', value: 'admin' },
    { label: 'Usuario', value: 'user' }
  ]}
/>
```

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del Modal"
  size="md"
>
  Contenido del modal
</Modal>
```

### CRUD Components

#### CrudTable
```tsx
<CrudTable
  data={users}
  columns={columns}
  isLoading={loading}
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
/>
```

#### CrudPagination
```tsx
<CrudPagination
  currentPage={page}
  totalPages={totalPages}
  perPage={perPage}
  total={total}
  onPageChange={setPage}
  onPerPageChange={setPerPage}
/>
```

## 🔐 Autenticación

El sistema incluye interceptores automáticos para:
- Añadir token Bearer a todas las peticiones
- Refresh automático del token cuando expira
- Redirección a login en caso de error 401

## 📊 Gestión de Estado

### Zustand Stores Disponibles

- **themeStore**: Tema dark/light
- **notificationStore**: Sistema de notificaciones toast
- **sidebarStore**: Estado del sidebar

### Notificaciones

```typescript
import { notify } from '@/store/notificationStore'

notify.success('Título', 'Mensaje')
notify.error('Error', 'Mensaje de error')
notify.warning('Advertencia', 'Mensaje')
notify.info('Información', 'Mensaje')
```

## 🎯 Próximos Pasos Recomendados

1. **Conectar con tu Backend Real**
   - Actualiza `VITE_API_URL` en `.env`
   - Ajusta endpoints en `api.config.ts`
   - Implementa la autenticación real

2. **Añadir Más Páginas CRUD**
   - Usa `UsersPage.tsx` como plantilla
   - Crea nuevos componentes en `pages/`

3. **Personalizar Tema**
   - Ajusta colores en `tailwind.config.js`
   - Modifica componentes UI según diseño

4. **Implementar Validación con Zod**
   - Crea esquemas en `types/`
   - Integra con React Hook Form

5. **Añadir Más Procesos Especiales**
   - Usa `ProcessRunner` component
   - Crea procesos personalizados

## 📝 URLs y Funcionalidades Actuales

### Páginas Disponibles
- `/dashboard` - Dashboard con gráficos y estadísticas
- `/users` - Gestión completa de usuarios (CRUD)
- `/processes` - Procesos especiales (en construcción)
- `/reports` - Reportes (en construcción)
- `/settings` - Configuración (en construcción)

### Funcionalidades Implementadas
✅ Sistema CRUD completo y reutilizable
✅ Hooks personalizados para API
✅ Caché automático con React Query
✅ Tema dark/light
✅ Notificaciones toast
✅ Sidebar responsive
✅ Tablas con ordenamiento y filtros
✅ Paginación avanzada
✅ Acciones masivas
✅ Componentes UI reutilizables

### Pendiente de Implementar
⏳ Autenticación real con backend
⏳ Formularios con validación Zod
⏳ Página de procesos especiales
⏳ Página de reportes
⏳ Página de configuración
⏳ Upload de archivos
⏳ Exportación de datos (CSV, Excel, PDF)

## 🤝 Contribuir

Este es un proyecto desarrollado por FaruTech. Para consultas sobre contribuciones o uso comercial, 
por favor contacta con el autor.

## 👨‍💻 Autor

**Farid Maloof Suarez**
- Empresa: FaruTech
- Año: 2025

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

Copyright (c) 2025 Farid Maloof Suarez - FaruTech

## 🏢 Acerca de FaruTech

Este panel de administración ha sido diseñado y desarrollado específicamente por y para **FaruTech**, 
utilizando las mejores prácticas y tecnologías modernas:

- **React 19** - Framework UI de última generación
- **TypeScript** - Seguridad de tipos completa
- **TailwindCSS 3** - Diseño moderno y responsive
- **React Query** - Gestión eficiente del estado del servidor
- **Vite 7** - Build ultrarrápido y optimizado

---

**© 2025 Farid Maloof Suarez. Todos los derechos reservados.**  
Elaborado por y para **FaruTech**
