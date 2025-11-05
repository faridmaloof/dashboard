# Sistema de Configuración de Marca (SaaS)

## Descripción General

Este dashboard incluye un sistema completo de configuración de marca que permite personalizar la apariencia del dashboard para cada cliente en un entorno SaaS. El sistema está optimizado para rendimiento sin causar lentitud en la carga ni re-renders innecesarios.

## Características

### 1. **Configuración Personalizable**
- ✅ Título del tab del navegador (document.title)
- ✅ Logo corto (usado en sidebar, favicon)
- ✅ Logo completo (usado en login, navbar)
- ✅ Nombre de la marca (reemplaza "FaruTech" en toda la aplicación)
- ✅ Descripción de la plataforma
- ✅ Versión (solo lectura)
- ✅ Copyright (solo lectura)

### 2. **Optimizaciones de Rendimiento**

#### Cache con localStorage
- Configuración guardada en localStorage
- Duración del cache: 1 hora
- Validación automática de timestamp

#### Context API Optimizado
- `useMemo` para evitar re-renders innecesarios
- Actualizaciones batch
- Carga lazy de imágenes con fallback

#### Carga Eficiente
1. Intenta cargar desde cache (localStorage)
2. Si no hay cache válido, carga desde API
3. Fallback a configuración por defecto

### 3. **Componentes Actualizados**

#### `LoginPage`
- Logo dinámico con fallback
- Nombre de marca dinámico
- Descripción personalizable
- Copyright dinámico

#### `Sidebar`
- Logo corto dinámico
- Nombre de marca en header
- Versión y copyright en footer

#### `Navbar`
- Título de documento dinámico (actualizado automáticamente)
- Favicon dinámico

## Uso

### Acceder a la Página de Configuración

Navega a: **Configuración → General** (`/settings/general`)

### Campos Editables

1. **Nombre de la marca**: Aparece en toda la aplicación
2. **Título del navegador**: Texto que aparece en la pestaña
3. **Descripción**: Texto descriptivo de la plataforma
4. **URL del logo corto**: Ruta relativa o absoluta al logo cuadrado
5. **URL del logo completo**: Ruta relativa o absoluta al logo horizontal

### Campos de Solo Lectura

- **Versión**: Gestionado por el sistema
- **Copyright**: Gestionado por el sistema

### Preview en Tiempo Real

La página incluye una vista previa en tiempo real que muestra:
- Logo corto
- Logo completo
- Nombre de marca
- Título del tab

## Arquitectura Técnica

### Archivos Creados

```
src/
├── contexts/
│   └── ConfigContext.tsx          # Context para configuración global
├── pages/
│   └── settings/
│       └── GeneralSettingsPage.tsx # Página de configuración
└── types/
    └── index.ts                   # BrandConfig y AppConfig interfaces
```

### Archivos Modificados

```
src/
├── App.tsx                        # ConfigProvider wrapper
├── components/
│   └── layout/
│       ├── Sidebar.tsx            # Logo y nombre dinámicos
│       └── LoginPage.tsx          # Branding dinámico
```

### Flujo de Datos

```
ConfigProvider (App.tsx)
    ↓
useConfig() hook
    ↓
Components (Sidebar, LoginPage, etc.)
```

## Tipos TypeScript

```typescript
interface BrandConfig {
  brandName: string           // Nombre de la marca
  pageTitle: string          // Título del tab
  logoUrl: string            // URL logo corto
  logoFullUrl: string        // URL logo completo
  version?: string           // Versión (solo lectura)
  copyright?: string         // Copyright (solo lectura)
  primaryColor?: string      // Color primario
  description?: string       // Descripción breve
}
```

## Integración con Backend

### Endpoint Esperado (TODO)

```typescript
// GET /api/config/brand
// Response:
{
  "brandName": "MiEmpresa",
  "pageTitle": "MiEmpresa - Admin Panel",
  "logoUrl": "/uploads/logo.png",
  "logoFullUrl": "/uploads/logo_full.png",
  "version": "v1.2.0",
  "copyright": "© 2025 MiEmpresa"
}

// PUT /api/config/brand
// Request body: Partial<BrandConfig>
```

### Implementación Actual

Por ahora, el sistema usa:
1. **localStorage** como cache principal
2. **Configuración por defecto** como fallback

Para integrar con un backend real:
1. Descomentar las llamadas a `fetch()` en `ConfigContext.tsx`
2. Actualizar las rutas de API según tu backend
3. Implementar autenticación si es necesario

## Manejo de Logos

### Ubicación Actual
Los logos deben estar en `/public/`:
- `/public/Logo.png` (logo corto)
- `/public/Logo_Full.png` (logo completo)

### Próximas Mejoras
- Upload de archivos desde la interfaz
- Almacenamiento en cloud (S3, CloudFlare R2, etc.)
- Redimensionamiento automático

## Mejores Prácticas

### 1. Optimización de Imágenes
```html
<!-- Siempre incluir onError para fallback -->
<img 
  src={config.logoUrl}
  alt={`${config.brandName} Logo`}
  onError={(e) => e.currentTarget.src = '/Logo.png'}
/>
```

### 2. Uso del Hook
```typescript
// Dentro de un componente
import { useConfig } from '@/contexts/ConfigContext'

function MyComponent() {
  const { config, updateConfig, isLoading } = useConfig()
  
  if (isLoading) return <Spinner />
  
  return <h1>{config.brandName}</h1>
}
```

### 3. Actualización de Configuración
```typescript
await updateConfig({
  brandName: 'Nueva Empresa',
  pageTitle: 'Nueva Empresa - Dashboard'
})
```

## Seguridad

### Consideraciones
- ✅ Solo usuarios autenticados pueden acceder a `/settings/general`
- ✅ Las URLs de logos se validan (próximamente)
- ⚠️ Implementar validación de permisos en el backend
- ⚠️ Sanitizar inputs antes de guardar

### Recomendaciones
1. **Roles y permisos**: Solo admin/super-admin debe poder editar
2. **Validación de URLs**: Whitelist de dominios permitidos
3. **Rate limiting**: Limitar actualizaciones por tiempo
4. **Audit log**: Registrar todos los cambios de configuración

## Testing

### Pruebas Manuales
1. Navegar a `/settings/general`
2. Cambiar nombre de marca → verificar en sidebar
3. Cambiar logo corto → verificar en sidebar y favicon
4. Cambiar logo completo → verificar en login
5. Cambiar título → verificar en tab del navegador
6. Cerrar sesión → verificar en login
7. Recargar página → verificar que persiste (cache)

## Troubleshooting

### La configuración no se guarda
- Verificar localStorage en DevTools
- Verificar que no haya errores en consola
- Verificar que `updateConfig` se está llamando correctamente

### Las imágenes no cargan
- Verificar que las URLs sean correctas
- Verificar que los archivos existen en `/public`
- Verificar el fallback con onError

### El título no se actualiza
- El `document.title` se actualiza automáticamente vía useEffect
- Verificar que ConfigProvider esté wrapping la app correctamente

## Roadmap

### Próximas Funcionalidades
- [ ] Upload de archivos desde la interfaz
- [ ] Selector de color primario con preview
- [ ] Múltiples temas de color
- [ ] Configuración por sub-dominio (multi-tenant)
- [ ] Exportar/importar configuración
- [ ] Historial de cambios
- [ ] Preview en diferentes dispositivos

## Soporte

Para preguntas o problemas:
1. Revisar la documentación completa
2. Verificar los logs en consola
3. Revisar el código en `src/contexts/ConfigContext.tsx`

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0
