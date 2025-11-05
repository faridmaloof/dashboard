# Sistema de Configuración de Marca

## Descripción General

Este documento describe el sistema de configuración de marca (Brand Configuration System) implementado en el dashboard. Permite personalizar la identidad visual y características de la aplicación de manera dinámica y persistente.

## Características

### 1. Configuración Dinámica
- **Logos**: Logo corto (cuadrado) y logo completo (horizontal)
- **Marca**: Nombre de la marca y título de página
- **Colores**: Color primario personalizable
- **Metadata**: Versión, copyright y descripción

### 2. Carga de Imágenes
- **Drag & Drop**: Arrastra y suelta imágenes directamente
- **Validación**: Validación de tipo (solo imágenes) y tamaño (máx 2MB)
- **Preview**: Vista previa en tiempo real con opciones de cambio/eliminación
- **Formatos**: Soporte para base64 (inmediato) y URLs

### 3. Sistema de Valores por Defecto

#### 3.1 Persistencia de Defaults
El sistema mantiene dos niveles de configuración:
- **Configuración Actual**: Los valores actuales en uso
- **Configuración por Defecto**: Los valores que se restauran al hacer "Reset"

#### 3.2 Operaciones Disponibles

##### Desde la UI (Frontend)
En la página de Configuración General (`/settings/general`):

1. **Guardar Cambios**: Actualiza la configuración actual
2. **Restablecer**: Vuelve a los valores por defecto guardados
3. **Establecer como Predeterminado**: Guarda la configuración actual como nueva configuración por defecto
4. **Restaurar a Originales**: Vuelve a los valores originales del sistema

##### Desde la Consola del Navegador
Para administradores avanzados, hay una API disponible en `window.brandConfig`:

```javascript
// Ver configuración actual
window.brandConfig.getCurrent()

// Ver configuración por defecto
window.brandConfig.getDefault()

// Restablecer a defaults guardados
window.brandConfig.reset()

// Establecer actual como predeterminado
window.brandConfig.setAsDefault()

// Restaurar a valores originales del sistema
window.brandConfig.resetToDefault()
```

#### Ejemplos de Uso

```javascript
// Ejemplo 1: Ver la configuración actual
const config = window.brandConfig.getCurrent()
console.log('Brand:', config.brandName)
console.log('Logo:', config.logoUrl)

// Ejemplo 2: Guardar la configuración actual como predeterminado
// Útil después de hacer cambios que quieres que sean permanentes
window.brandConfig.setAsDefault()

// Ejemplo 3: Volver a los valores originales de fábrica
// Útil si quieres eliminar todas las personalizaciones
window.brandConfig.resetToDefault()

// Ejemplo 4: Verificar diferencias
const current = window.brandConfig.getCurrent()
const defaults = window.brandConfig.getDefault()
console.log('¿Son iguales?', JSON.stringify(current) === JSON.stringify(defaults))
```

## Almacenamiento

El sistema utiliza `localStorage` con tres claves:

- `app_brand_config`: Configuración actual
- `app_brand_config_default`: Configuración por defecto guardada
- `app_brand_config_timestamp`: Timestamp para caché (1 hora)

## Flujo de Carga

1. **Defaults Guardados**: Verifica si hay defaults personalizados en localStorage
2. **Cache**: Verifica si hay configuración en caché (válida por 1 hora)
3. **API**: (TODO) Carga desde el backend
4. **Fallback**: Usa valores por defecto del sistema

## Optimización de Bundle

### Resultados Actuales

Después de implementar lazy loading y code splitting:

#### Antes de la optimización:
- **index.js**: 606.88 kB (177.67 kB gzip) ⚠️
- **chart-vendor**: 327.72 kB (98.29 kB gzip)
- **ui-vendor**: 177.33 kB (56.42 kB gzip)

#### Después de la optimización:
- **index.js**: 316.47 kB (88.66 kB gzip) ✅ (-48% reducción)
- **ChartsPage**: 210.70 kB (71.80 kB gzip) - Cargado solo cuando se necesita
- **ComponentsPage**: 55.95 kB (13.10 kB gzip) - Cargado solo cuando se necesita
- **GeneralSettingsPage**: 12.84 kB (3.99 kB gzip) - Cargado solo cuando se necesita
- **ProcessesPage**: 9.09 kB (3.29 kB gzip) - Cargado solo cuando se necesita

### Técnicas Aplicadas

1. **Lazy Loading**: Páginas pesadas se cargan bajo demanda
2. **Code Splitting**: Separación de vendors (React, UI, Charts, Data, Utils)
3. **Suspense**: Loading states durante la carga de componentes

### Páginas con Lazy Loading
- `ChartsPage`: Contiene gráficos pesados (Recharts)
- `ComponentsPage`: Biblioteca de componentes UI
- `ProcessesPage`: Ejecutor de procesos
- `GeneralSettingsPage`: Configuración de marca

## Configuración por Defecto del Sistema

```typescript
{
  brandName: 'FaruTech',
  pageTitle: 'FaruTech - Admin Panel',
  logoUrl: '/Logo.png',
  logoFullUrl: '/Logo_Full.png',
  version: 'v1.0.0',
  copyright: '© 2025 FaruTech',
  primaryColor: '#ffffff',
  description: 'Gestiona tu negocio de manera eficiente...'
}
```

## Archivos Principales

- `src/contexts/ConfigContext.tsx`: Context provider con lógica de persistencia
- `src/pages/settings/GeneralSettingsPage.tsx`: UI para configuración
- `src/components/ui/ImageUpload.tsx`: Componente de carga de imágenes
- `src/App.tsx`: Lazy loading y Suspense
- `vite.config.ts`: Configuración de chunking y optimización

## Próximos Pasos

1. **Backend Integration**: Implementar API real para guardar/cargar configuración
2. **Roles y Permisos**: Restringir cambios a administradores
3. **Validación**: Validación de colores y formatos más robusta
4. **Temas**: Integración con sistema de temas (dark/light mode)
5. **Multi-tenancy**: Soporte para múltiples marcas/tenants

## Notas Técnicas

- **Performance**: Cache de 1 hora para evitar llamadas frecuentes
- **Sincronización**: Los cambios se aplican inmediatamente en toda la app
- **Fallback**: Siempre hay valores por defecto como respaldo
- **SEO**: Actualiza `document.title` y favicon automáticamente
