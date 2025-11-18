# 🔍 Auditoría de Reutilización de Componentes

## 📋 Componentes que NO Reutilizan Correctamente

### 🚨 PRIORIDAD ALTA

#### 1. **Scheduler.tsx** - PROBLEMA CRÍTICO ❌
**Ubicación:** `src/components/ui/Scheduler.tsx`

**Problemas Encontrados:**
- ❌ Usa `<input type="date">` nativo en lugar de `DatePicker`
- ❌ Usa `<input type="time">` nativo en lugar de `TimePicker` 
- ❌ Usa `<select>` nativo para campos personalizados en lugar de `Select`
- ❌ Arrays hardcodeados: `MONTHS`, `DAYS_SHORT`, `DAYS_FULL` no parametrizables
- ❌ Funciones `formatDate()` y `formatTime()` no usan `localeStore`

**Líneas Afectadas:**
- L433-443: Input date/time para fecha inicio
- L470-486: Input date/time para fecha fin  
- L568-584: Select nativo para custom fields
- L106-110: Arrays MONTHS, DAYS_SHORT, DAYS_FULL hardcodeados

**Solución Requerida:**
```tsx
// MAL ❌
<input type="date" value={...} onChange={...} />
<input type="time" value={...} onChange={...} />

// BIEN ✅
import { DateTimePicker } from './DateControls'
<DateTimePicker value={start} onChange={(date) => handleChange('start', date)} />
```

**Componentes a Reutilizar:**
- ✅ `DateTimePicker` (de DateControls)
- ✅ `Select` (existente)
- ✅ `useLocaleStore` (para meses/días)
- ✅ `formatDateWithLocale()` (de localeStore)

---

#### 2. **DataTable.tsx** - SELECT Y COLOR PICKER ⚠️
**Ubicación:** `src/components/ui/DataTable.tsx`

**Problemas Encontrados:**
- ⚠️ L435-453: Usa `<select multiple>` nativo para multiselect
- ⚠️ L614-625: Usa `<input type="color">` nativo para color picker
- ⚠️ L680-696: Usa `<input type="checkbox">` nativo

**Solución:**
- El multiselect nativo es aceptable para simplicidad
- El color picker nativo tiene funcionalidad única del navegador
- Los checkboxes internos están OK (no se exportan)

**Decisión:** ✅ MANTENER (casos válidos de uso de elementos nativos)

---

### 📝 PRIORIDAD MEDIA

#### 3. **DateControls.tsx** - PARAMETRIZACIÓN ⚠️
**Ubicación:** `src/components/ui/DateControls.tsx`

**Estado Actual:**
- ✅ Usa `localeStore` para obtener meses/días
- ✅ Los arrays vienen del store configurado
- ⚠️ Pero no permite override por props

**Mejora Sugerida:**
```tsx
interface BaseDatePickerProps {
  // Existentes...
  dateFormat?: DateFormat
  timeFormat?: TimeFormat
  
  // NUEVOS
  customMonths?: string[]      // Override meses
  customMonthsShort?: string[] // Override meses cortos
  customDays?: string[]        // Override días
  customDaysShort?: string[]   // Override días cortos
}

// En el componente
const localeConfig = useLocaleStore((state) => state.getLocaleConfig())
const MONTHS = props.customMonths || localeConfig.months
const DAYS = props.customDays || localeConfig.days
```

**Beneficio:**
- Permite casos especiales sin romper el default
- Si pasan solo 10 meses de 12, los últimos 2 vienen del locale

---

#### 4. **Modal, Drawer, Otros** - BOTONES NATIVOS
**Estado:**
- ✅ La mayoría YA usa componente `Button`
- ⚠️ Algunos usan `<button>` nativo para casos especiales (ej: close button con ícono)

**Casos Válidos de `<button>` Nativo:**
- Botones de cerrar (X) con solo ícono
- Botones internos no exportados
- Botones con funcionalidad muy específica

**Ejemplo Aceptable:**
```tsx
<button
  onClick={onClose}
  className="text-gray-400 hover:text-gray-500"
>
  <XMarkIcon className="h-6 w-6" />
</button>
```

**Decisión:** ✅ MANTENER (uso correcto de elemento nativo)

---

## ✅ Componentes que Reutilizan BIEN

### 1. **Form.tsx**
- ✅ Usa `Input`, `Select`, `Textarea`, `Button`
- ✅ No crea elementos nativos

### 2. **DataTable.tsx** (mayoría)
- ✅ Usa `Input` para búsqueda
- ✅ Usa `Button` para acciones
- ✅ Usa `Select` para selects simples
- ✅ Usa `DatePicker` y `DateRangePicker` para filtros de fecha

### 3. **Drawer.tsx**
- ✅ Usa `Button` para footer actions

### 4. **Alert.tsx**
- ✅ Usa solo iconos y estructura, botón nativo OK para dismiss

---

## 📊 Resumen de Prioridades

| Componente | Problema | Prioridad | Líneas Afectadas |
|------------|----------|-----------|------------------|
| **Scheduler.tsx** | Inputs nativos fecha/hora | 🔴 ALTA | ~60 líneas |
| **Scheduler.tsx** | Arrays no parametrizables | 🔴 ALTA | ~10 líneas |
| **DateControls.tsx** | Falta parametrización | 🟡 MEDIA | ~20 líneas |

---

## 🔧 Plan de Refactorización

### Paso 1: Scheduler.tsx ✅ HACER
1. Importar `DateTimePicker` de DateControls
2. Reemplazar inputs nativos por DateTimePicker
3. Importar `Select` y reemplazar selects nativos
4. Usar `formatDateWithLocale()` en lugar de `formatDate()`
5. Parametrizar arrays de meses/días

**Estimado:** ~80 líneas modificadas

### Paso 2: DateControls.tsx ✅ HACER  
1. Agregar props opcionales para override de arrays
2. Implementar lógica de fallback con merge
3. Documentar uso

**Estimado:** ~30 líneas agregadas

### Paso 3: Documentación ✅ HACER
1. Crear guía de reutilización
2. Listar componentes base disponibles
3. Especificar cuándo usar nativos vs componentes

---

## 📚 Guía de Reutilización

### Componentes Base Disponibles

#### Inputs
- ✅ `Input` - Text, number, email, password, etc.
- ✅ `Textarea` - Text multilínea
- ✅ `Select` - Dropdown simple
- ✅ `PhoneInput` - Teléfono con formato
- ✅ `MaskedInput` - Input con máscaras
- ✅ `TagInput` - Tags/chips

#### Fecha/Hora
- ✅ `DatePicker` - Selector de fecha
- ✅ `DateTimePicker` - Fecha + hora
- ✅ `DateRangePicker` - Rango de fechas
- ✅ `TimeRangePicker` - Rango de horas

#### Acciones
- ✅ `Button` - Botón estándar
- ✅ `ButtonGroup` - Grupo de botones

#### Selección
- ✅ `Checkbox` - Checkbox individual
- ✅ `CheckboxGroup` - Grupo de checkboxes
- ✅ `RadioGroup` - Radio buttons
- ✅ `Switch` - Toggle switch

### Cuándo Usar Elementos Nativos

#### ✅ Casos Válidos:
1. **Botones de UI interna** (close, dismiss) con solo ícono
2. **Checkboxes/radios dentro de componentes** que no se exponen
3. **Casos especiales** donde el componente base no cubre la funcionalidad
4. **Inputs de tipo especial** del navegador (color, range) cuando se necesita funcionalidad nativa

#### ❌ Casos Inválidos:
1. **Inputs de formulario** → Usar `Input`
2. **Selects de formulario** → Usar `Select`
3. **Fechas/horas** → Usar `DatePicker`, `TimePicker`, etc.
4. **Botones de acción** → Usar `Button`
5. **Textareas** → Usar `Textarea`

### Regla de Oro 🏆

> **"Si existe un componente base que hace el 80% de lo que necesitas, úsalo y extiéndelo con props. Solo usa elementos nativos si la funcionalidad es muy específica y no justifica extender el componente."**

---

## 🎯 Beneficios de la Reutilización

1. **Consistencia Visual** 
   - Todos los inputs tienen el mismo estilo
   - Mismo comportamiento de error/validación
   - Dark mode automático

2. **Mantenibilidad**
   - Cambio en un lugar afecta a todos
   - Menos código duplicado
   - TypeScript ayuda con type-safety

3. **Experiencia de Usuario**
   - Comportamiento predecible
   - Accesibilidad garantizada
   - Responsive por defecto

4. **Productividad**
   - No reinventar la rueda
   - Props documentadas
   - Ejemplos en ComponentsPage

---

**🎊 Conclusión:**

- **1 componente crítico** necesita refactorización (Scheduler)
- **1 mejora** de parametrización (DateControls)
- **Resto de componentes** están bien diseñados

**Esfuerzo Total:** ~110 líneas de código modificadas
**Tiempo Estimado:** 30-45 minutos
