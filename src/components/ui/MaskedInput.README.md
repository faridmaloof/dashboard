# MaskedInput Component

## 🎭 Descripción

`MaskedInput` es un componente avanzado de input que separa el **valor visual** (con formato) del **valor guardado** (datos puros), perfecto para teléfonos, fechas, tarjetas de crédito, monedas y cualquier dato que requiera formato específico.

## ✨ Características

- ✅ **15 máscaras predefinidas** listas para usar
- ✅ **Máscaras 100% personalizables** con formatter y unformatter
- ✅ **Validación regex integrada** con feedback visual
- ✅ **Separación de valores**: mostrado vs guardado
- ✅ **Formateo en tiempo real** mientras el usuario escribe
- ✅ **Validación visual**: iconos ✓ ✗ ⚠
- ✅ **Sin dependencias externas**
- ✅ **TypeScript completo**

## 📦 Uso Básico

```tsx
import { MaskedInput } from '@/components/ui'

function MyForm() {
  const [phone, setPhone] = useState('')
  
  return (
    <MaskedInput
      mask="phone-co"
      value={phone}
      onChange={(unmasked, formatted) => {
        setPhone(unmasked)  // Guarda: "3214567890"
        // formatted es: "+57 321 456 7890"
      }}
      label="Teléfono"
    />
  )
}
```

## 🎯 Máscaras Predefinidas

| Máscara | Formato | Ejemplo | Uso |
|---------|---------|---------|-----|
| `phone-co` | +57 ### ### #### | +57 321 456 7890 | Teléfonos Colombia |
| `phone-us` | (###) ###-#### | (555) 123-4567 | Teléfonos USA |
| `phone-intl` | +## ### ### #### | +1 555 123 4567 | Teléfonos internacionales |
| `date-dmy` | DD/MM/YYYY | 31/12/2024 | Fechas (día/mes/año) |
| `date-mdy` | MM/DD/YYYY | 12/31/2024 | Fechas (mes/día/año) |
| `time-24` | HH:MM | 23:59 | Hora 24 horas |
| `time-12` | HH:MM AM/PM | 11:59 PM | Hora 12 horas |
| `credit-card` | #### #### #### #### | 1234 5678 9012 3456 | Tarjetas de crédito |
| `credit-card-exp` | MM/YY | 12/25 | Vencimiento tarjeta |
| `credit-card-cvv` | ### | 123 | CVV |
| `ssn` | ###-##-#### | 123-45-6789 | Social Security Number |
| `zip-code` | #####-#### | 12345-6789 | Código postal USA |
| `currency-cop` | $#,###,### | $1,234,567 | Pesos colombianos |
| `currency-usd` | $#,###.## | $1,234.56 | Dólares |
| `percentage` | ##.##% | 99.99% | Porcentajes |

## 🎨 Máscaras Personalizadas

### Opción 1: Formatter/Unformatter

```tsx
<MaskedInput
  customFormatter={(value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 9)
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }}
  customUnformatter={(formatted) => formatted.replace(/\D/g, '')}
  validation={/^\d{9}$/}
  value={code}
  onChange={(unmasked) => setCode(unmasked)}
  label="Código de Producto"
  placeholder="123-456-789"
/>
```

### Opción 2: Máscara Simple

```tsx
<MaskedInput
  customMask="###-###-###"
  validation={/^\d{9}$/}
  value={code}
  onChange={(unmasked) => setCode(unmasked)}
/>
```

## 📚 Props API

```typescript
interface MaskedInputProps {
  // Máscara (opcional si usas customFormatter)
  mask?: 'phone-co' | 'phone-us' | 'date-dmy' | 'credit-card' | ... | 'custom'
  
  // Valor sin formato (el que guardas en BD)
  value?: string
  
  // Callback con valor sin formato y formateado
  onChange?: (unmaskedValue: string, formattedValue: string) => void
  
  // Máscaras personalizadas
  customMask?: string
  customFormatter?: (value: string) => string
  customUnformatter?: (formatted: string) => string
  
  // Validación
  validation?: RegExp
  showValidation?: boolean
  validateOnChange?: boolean
  
  // UI
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  fullWidth?: boolean
  
  // Heredados de HTMLInputElement
  ...InputHTMLAttributes<HTMLInputElement>
}
```

## 💡 Ejemplos Avanzados

### Email Corporativo

```tsx
<MaskedInput
  customFormatter={(value) => {
    const cleaned = value.replace(/@.*/g, '').toLowerCase()
    return cleaned ? `${cleaned}@empresa.com` : ''
  }}
  customUnformatter={(formatted) => formatted.replace(/@empresa\.com$/i, '')}
  validation={/^[a-z0-9._-]+$/}
  value={email}
  onChange={(unmasked) => setEmail(unmasked)}
  label="Email Corporativo"
  placeholder="usuario@empresa.com"
/>
```

### NIT Colombia

```tsx
<MaskedInput
  customFormatter={(value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10)
    const parts = cleaned.match(/.{1,3}/g) || []
    return parts.join('.')
  }}
  customUnformatter={(formatted) => formatted.replace(/\D/g, '')}
  validation={/^\d{9,10}$/}
  value={nit}
  onChange={(unmasked) => setNit(unmasked)}
  label="NIT"
  placeholder="900.123.456-7"
/>
```

### Placa de Vehículo

```tsx
<MaskedInput
  customFormatter={(value) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    if (cleaned.length <= 3) return cleaned
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }}
  customUnformatter={(formatted) => formatted.replace(/-/g, '')}
  validation={/^[A-Z]{3}\d{3}$/}
  value={placa}
  onChange={(unmasked) => setPlaca(unmasked)}
  label="Placa"
  placeholder="ABC-123"
/>
```

## 🔧 Uso en Formularios

```tsx
import { MaskedInput } from '@/components/ui'

function UserForm() {
  const [formData, setFormData] = useState({
    phone: '',
    date: '',
    creditCard: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // formData ya contiene valores limpios sin formato
    api.createUser(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <MaskedInput
        mask="phone-co"
        value={formData.phone}
        onChange={(unmasked) => 
          setFormData(prev => ({ ...prev, phone: unmasked }))
        }
        label="Teléfono"
      />
      
      <MaskedInput
        mask="date-dmy"
        value={formData.date}
        onChange={(unmasked) => 
          setFormData(prev => ({ ...prev, date: unmasked }))
        }
        label="Fecha de Nacimiento"
      />
      
      <button type="submit">Enviar</button>
    </form>
  )
}
```

## 🎯 Ventajas vs Otras Soluciones

| Característica | MaskedInput | react-input-mask | react-text-mask |
|----------------|-------------|------------------|-----------------|
| Separación de valores | ✅ | ❌ | ❌ |
| Máscaras predefinidas | ✅ 15 tipos | ❌ | ❌ |
| Formatter personalizado | ✅ | ⚠️ Limitado | ⚠️ Limitado |
| Validación integrada | ✅ | ❌ | ❌ |
| Feedback visual | ✅ | ❌ | ❌ |
| Sin dependencias | ✅ | ❌ | ❌ |
| TypeScript nativo | ✅ | ⚠️ | ⚠️ |

## 🚀 Casos de Uso

1. **Formularios de registro**: teléfonos, fechas, direcciones
2. **Checkout de pagos**: tarjetas, CVV, expiración
3. **Documentos**: NIT, cédula, RUT, pasaporte
4. **Datos financieros**: monedas, porcentajes, tasas
5. **Códigos**: productos, referencias, serial numbers

## 📝 Notas Importantes

- **Valor guardado**: Siempre es el valor limpio sin formato
- **Valor mostrado**: Es solo visual, no se envía al backend
- **Validación**: Se aplica sobre el valor limpio
- **Performance**: Optimizado con useEffect y memoización interna

## 🔄 Migración desde Input Normal

**Antes:**
```tsx
<Input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="+57 321 456 7890"
/>
// Usuario debe escribir el formato manualmente
// Guardas: "+57 321 456 7890" (con formato)
```

**Después:**
```tsx
<MaskedInput
  mask="phone-co"
  value={phone}
  onChange={(unmasked) => setPhone(unmasked)}
/>
// Formato automático mientras escribe
// Guardas: "3214567890" (sin formato)
```

## 🐛 Troubleshooting

**Q: ¿Por qué el valor guardado incluye el formato?**
A: Asegúrate de usar el primer parámetro de `onChange`: `onChange={(unmasked) => setValue(unmasked)}`

**Q: ¿Cómo valido formatos complejos?**
A: Usa una regex en la prop `validation` que se aplica al valor sin formato.

**Q: ¿Puedo crear una máscara sin formatter?**
A: Sí, usa `customMask` con caracteres especiales: `#` para dígitos, `A` para letras, `*` para alfanuméricos.

**Q: ¿Funciona con formularios controlados?**
A: Sí, completamente compatible con React Hook Form, Formik, etc.

## 📄 License

MIT
