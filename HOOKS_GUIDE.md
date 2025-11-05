# 📚 Guía de Hooks Personalizados

Esta guía explica cómo usar los hooks personalizados para conectar con tu backend.

## 📋 Índice

1. [useApi - Hook Base](#useapi---hook-base)
2. [useCrud - CRUD Genérico](#usecrud---crud-genérico)
3. [useAuth - Autenticación](#useauth---autenticación)
4. [useProcess - Procesos Especiales](#useprocess---procesos-especiales)

---

## 🔌 useApi - Hook Base

Hook fundamental para realizar peticiones a la API con caché automático.

### useApiQuery - Peticiones GET con caché

```typescript
import { useApiQuery } from '@/hooks/useApi'

function MyComponent() {
  const { data, isLoading, error, refetch } = useApiQuery<User[]>(
    'users', // Query key
    {
      url: '/users',
      params: { page: 1, limit: 10 },
      // Opciones de React Query
      staleTime: 1000 * 60 * 5, // 5 minutos
      enabled: true,
    }
  )

  if (isLoading) return <Loading />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### useApiMutation - Mutaciones (POST, PUT, DELETE)

```typescript
import { useApiMutation } from '@/hooks/useApi'

function CreateUser() {
  const createMutation = useApiMutation<User, { name: string; email: string }>({
    url: '/users',
    method: 'POST',
    invalidateQueries: ['users'], // Revalida la lista de usuarios
    onSuccess: (data) => {
      notify.success('Usuario creado', data.message)
    },
    onError: (error) => {
      notify.error('Error', error.message)
    }
  })

  const handleCreate = () => {
    createMutation.mutate({
      name: 'John Doe',
      email: 'john@example.com'
    })
  }

  return (
    <Button 
      onClick={handleCreate} 
      loading={createMutation.isPending}
    >
      Crear Usuario
    </Button>
  )
}
```

---

## 📊 useCrud - CRUD Genérico

Hook reutilizable para operaciones CRUD completas.

### Configuración Básica

```typescript
import { useCrud } from '@/hooks/useCrud'
import { User } from '@/types'

function UsersPage() {
  // Crear instancia del CRUD
  const userCrud = useCrud<User>({
    endpoint: '/users',  // Endpoint base
    queryKey: 'users',   // Key para caché
    enableList: true,    // Habilitar listado
    enableGet: true,     // Habilitar obtener uno
  })

  // ... usar los métodos
}
```

### 1. Listar con Paginación

```typescript
const { data, isLoading, error } = userCrud.useList({
  page: 1,
  perPage: 10,
  search: 'john',
  filters: {
    role: 'admin',
    active: true,
  },
  sort: 'createdAt',
  order: 'desc',
})

// data.data - Array de usuarios
// data.total - Total de registros
// data.page - Página actual
// data.totalPages - Total de páginas
```

### 2. Obtener uno por ID

```typescript
const { data: user, isLoading } = userCrud.useGet(userId, true)
```

### 3. Crear

```typescript
const createMutation = userCrud.useCreate()

const handleCreate = async () => {
  try {
    await createMutation.mutateAsync({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    })
    notify.success('Usuario creado')
  } catch (error) {
    notify.error('Error al crear usuario')
  }
}
```

### 4. Actualizar

```typescript
const updateMutation = userCrud.useUpdate()

const handleUpdate = async (id: number) => {
  await updateMutation.mutateAsync({
    id,
    data: {
      name: 'John Updated',
    }
  })
}
```

### 5. Eliminar

```typescript
const deleteMutation = userCrud.useDelete()

const handleDelete = (id: number) => {
  if (confirm('¿Estás seguro?')) {
    deleteMutation.mutate(id)
  }
}
```

### 6. Eliminar Múltiples

```typescript
const bulkDeleteMutation = userCrud.useBulkDelete()

const handleBulkDelete = (ids: number[]) => {
  if (confirm(`¿Eliminar ${ids.length} usuarios?`)) {
    bulkDeleteMutation.mutate(ids)
  }
}
```

### Ejemplo Completo

```typescript
function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  
  const userCrud = useCrud<User>({ 
    endpoint: '/users', 
    queryKey: 'users' 
  })
  
  const { data, isLoading } = userCrud.useList({ page, perPage: 10, search })
  const createUser = userCrud.useCreate()
  const updateUser = userCrud.useUpdate()
  const deleteUser = userCrud.useDelete()
  
  return (
    <div>
      <Input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        placeholder="Buscar..."
      />
      
      <CrudTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />
      
      <CrudPagination
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  )
}
```

---

## 🔐 useAuth - Autenticación

Hook para gestionar la autenticación del usuario.

### Login

```typescript
import { useAuth } from '@/hooks/useAuth'

function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth()

  const handleLogin = () => {
    login({
      email: 'user@example.com',
      password: 'password123'
    })
  }

  return (
    <Button onClick={handleLogin} loading={isLoggingIn}>
      Iniciar Sesión
    </Button>
  )
}
```

### Registro

```typescript
function RegisterPage() {
  const { register, isRegistering } = useAuth()

  const handleRegister = () => {
    register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  }

  return (
    <Button onClick={handleRegister} loading={isRegistering}>
      Registrarse
    </Button>
  )
}
```

### Obtener Usuario Actual

```typescript
function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div>
      <h1>Bienvenido, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.role}</p>
    </div>
  )
}
```

### Logout

```typescript
function Header() {
  const { logout, isLoggingOut } = useAuth()

  return (
    <Button 
      variant="danger" 
      onClick={() => logout()} 
      loading={isLoggingOut}
    >
      Cerrar Sesión
    </Button>
  )
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <Loading fullscreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}

// Uso en rutas
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

---

## ⚙️ useProcess - Procesos Especiales

Hook para ejecutar procesos personalizados y conectar con APIs externas.

### 1. Listar Procesos Disponibles

```typescript
import { useProcess } from '@/hooks/useProcess'

function ProcessList() {
  const { useProcessList } = useProcess()
  const { data: processes, isLoading } = useProcessList()

  return (
    <div>
      {processes?.map(process => (
        <div key={process.id}>
          <h3>{process.name}</h3>
          <p>{process.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 2. Ejecutar Proceso Simple

```typescript
function ExecuteProcess() {
  const { useExecuteProcess } = useProcess()
  const execute = useExecuteProcess()

  const handleExecute = () => {
    execute.mutate({
      endpoint: '/api/sync-data',
      method: 'POST',
      data: {
        source: 'external_api',
        force: true
      }
    })
  }

  return (
    <Button 
      onClick={handleExecute} 
      loading={execute.isPending}
    >
      Sincronizar Datos
    </Button>
  )
}
```

### 3. Ejecutar con Monitoreo en Tiempo Real

```typescript
function MonitoredProcess() {
  const { useExecuteAndMonitor } = useProcess()
  const { execute, status, isExecuting, isMonitoring, reset } = useExecuteAndMonitor()

  const handleExecute = async () => {
    await execute({
      endpoint: '/api/long-process',
      method: 'POST',
      data: { batchSize: 100 }
    })
  }

  return (
    <div>
      <Button onClick={handleExecute} loading={isExecuting}>
        Ejecutar Proceso
      </Button>

      {isMonitoring && (
        <div>
          <p>Estado: {status?.status}</p>
          <p>Progreso: {status?.progress}%</p>
          <Button onClick={reset}>Detener Monitoreo</Button>
        </div>
      )}

      {status?.status === 'success' && (
        <div>
          <h4>Resultado:</h4>
          <pre>{JSON.stringify(status.result, null, 2)}</pre>
        </div>
      )}

      {status?.error && (
        <div>Error: {status.error}</div>
      )}
    </div>
  )
}
```

### 4. Historial de Procesos

```typescript
function ProcessHistory() {
  const { useProcessHistory } = useProcess()
  const { data: history } = useProcessHistory({ limit: 10 })

  return (
    <table>
      <thead>
        <tr>
          <th>Proceso</th>
          <th>Estado</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {history?.map(item => (
          <tr key={item.id}>
            <td>{item.processId}</td>
            <td>{item.status}</td>
            <td>{formatDate(item.startedAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 5. Proceso con Upload de Archivos

```typescript
import { useUploadFile } from '@/hooks/useApi'

function UploadProcess() {
  const [progress, setProgress] = useState(0)
  
  const uploadMutation = useUploadFile('/api/upload', {
    onProgress: setProgress,
    onSuccess: (data) => {
      notify.success('Archivo subido', data.message)
    }
  })

  const handleUpload = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'document')
    
    uploadMutation.mutate(formData)
  }

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
      
      {uploadMutation.isPending && (
        <div>Subiendo... {progress}%</div>
      )}
    </div>
  )
}
```

---

## 🎯 Mejores Prácticas

### 1. Tipado TypeScript

```typescript
// Define tus tipos
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

// Úsalos en los hooks
const userCrud = useCrud<User>({ ... })
const { data } = useApiQuery<User[]>('users', { ... })
```

### 2. Manejo de Errores

```typescript
const mutation = useApiMutation({
  url: '/users',
  method: 'POST',
  onError: (error) => {
    // Error específico del endpoint
    if (error.statusCode === 409) {
      notify.error('El email ya existe')
    } else {
      notify.error('Error', error.message)
    }
  }
})
```

### 3. Invalidación de Caché

```typescript
const updateMutation = useApiMutation({
  url: (id) => `/users/${id}`,
  method: 'PUT',
  // Invalida múltiples queries relacionadas
  invalidateQueries: ['users', 'user-profile', 'dashboard-stats'],
})
```

### 4. Caché Optimista

```typescript
const { mutate } = useApiMutation({
  url: '/users',
  method: 'POST',
  onMutate: async (newUser) => {
    // Actualiza la UI inmediatamente
    queryClient.setQueryData(['users'], (old) => [...old, newUser])
  },
  onError: (error, variables, context) => {
    // Revierte si falla
    queryClient.setQueryData(['users'], context.previousData)
  }
})
```

### 5. Polling (Actualización Periódica)

```typescript
const { data } = useApiQuery('stats', {
  url: '/dashboard/stats',
  refetchInterval: 30000, // Cada 30 segundos
  refetchIntervalInBackground: false, // Solo si está visible
})
```

---

## 📝 Notas Importantes

1. **Configuración de API**: Actualiza `src/config/api.config.ts` con tus endpoints reales
2. **Interceptores**: Los tokens se manejan automáticamente en `api.service.ts`
3. **Caché**: React Query cachea automáticamente por 5 minutos (configurable)
4. **TypeScript**: Todos los hooks están tipados, aprovecha el autocompletado

---

## 🔗 Referencias

- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
