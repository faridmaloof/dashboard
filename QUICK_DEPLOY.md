# 🚀 Despliegue Rápido en Hostinger

## 📦 Paso 1: Generar el Build

```bash
npm run build
```

Esto crea la carpeta `dist/` con todo lo necesario.

## 📤 Paso 2: Subir a Hostinger

### Usando File Manager (Más Fácil)

1. **Accede al File Manager**
   - Panel de Hostinger → Files → File Manager

2. **Activa archivos ocultos**
   - Settings (⚙️) → Show hidden files ✅

3. **Limpia el directorio**
   - Navega a `public_html`
   - Elimina todo el contenido anterior

4. **Sube los archivos**
   - Arrastra TODO el contenido de `dist/` a `public_html/`
   - **VERIFICA** que `.htaccess` esté presente

## ✅ Paso 3: Verificar

Prueba estas URLs directamente (sin login):

```
✅ https://dashboard.demo.farutech.com/login
✅ https://dashboard.demo.farutech.com/settings/general
✅ https://dashboard.demo.farutech.com/dashboard
✅ https://dashboard.demo.farutech.com/ruta-invalida (debe mostrar tu 404)
```

## 🔧 ¿Sigue mostrando el 404 de Apache?

### Solución Rápida

1. **Verifica que `.htaccess` exista:**
   ```
   public_html/
   ├── .htaccess  ← ¿Está aquí?
   ├── index.html
   └── assets/
   ```

2. **Si no existe, créalo manualmente:**
   - En File Manager, crea archivo `.htaccess`
   - Copia este contenido:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

3. **Verifica permisos:**
   - `.htaccess` → 644
   - `index.html` → 644
   - Carpetas → 755

4. **Limpia caché:**
   - F12 → Network → Disable cache
   - Ctrl+Shift+R (hard reload)

## 📚 Más Ayuda

Ver `DEPLOYMENT_GUIDE.md` para:
- Solución de problemas detallada
- Configuración de HTTPS
- Despliegue automático con GitHub Actions
- Y más...

## 🎯 Estructura Final

```
public_html/
├── .htaccess          ← Crítico para rutas SPA
├── index.html         ← Tu app React
├── Logo.png
├── Logo_Full.png
└── assets/
    ├── index-[hash].css
    ├── index-[hash].js
    └── [otros archivos]
```

---

**✨ ¡Listo!** Tu aplicación ahora funciona correctamente con todas las rutas.
