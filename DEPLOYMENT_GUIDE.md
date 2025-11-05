# 🚀 Guía de Despliegue en Hostinger (Hosting Compartido)

## Resumen del Problema y Solución

### Problema
Cuando accedes directamente a una URL como `https://dashboard.demo.farutech.com/settings/general` sin hacer login primero, el servidor muestra el 404 de Apache en lugar del 404 personalizado de tu aplicación React.

### Causa
Las aplicaciones React (SPA - Single Page Application) manejan el enrutamiento del lado del cliente. Cuando accedes directamente a una ruta:
1. El navegador hace una petición al servidor: `GET /settings/general`
2. Apache busca el archivo físico `/settings/general` en el servidor
3. Como no existe ese archivo, Apache devuelve su 404 por defecto
4. React Router nunca tiene la oportunidad de manejar la ruta

### Solución
Configurar Apache con `.htaccess` para que **todas las peticiones** sirvan `index.html`, permitiendo que React Router maneje el enrutamiento.

## 📋 Checklist de Despliegue

### 1. ✅ Preparar el Build

```bash
# En tu computadora local
npm run build
```

Esto genera la carpeta `dist/` con:
- ✅ `index.html` (entrada principal)
- ✅ `.htaccess` (configuración de Apache)
- ✅ `assets/` (JS, CSS, imágenes)
- ✅ `Logo.png` y `Logo_Full.png`

### 2. 📤 Subir Archivos a Hostinger

**Opciones:**

#### Opción A: File Manager de Hostinger (Recomendado para principiantes)
1. Inicia sesión en tu panel de Hostinger
2. Ve a **Files** → **File Manager**
3. Navega a `public_html` (o el directorio de tu dominio)
4. **IMPORTANTE**: Elimina el contenido anterior (si existe)
5. Sube TODO el contenido de la carpeta `dist/`:
   ```
   public_html/
   ├── .htaccess          ← ¡CRÍTICO! Asegúrate que esté aquí
   ├── index.html
   ├── assets/
   ├── Logo.png
   └── Logo_Full.png
   ```

**⚠️ ATENCIÓN**: Asegúrate de que `.htaccess` sea visible. En File Manager:
- Ve a **Settings** (engranaje arriba a la derecha)
- Activa **Show hidden files**

#### Opción B: FTP/SFTP (Recomendado para expertos)
```bash
# Usando FileZilla, WinSCP o similar
Host: ftp.dashboard.demo.farutech.com
Usuario: tu_usuario@dashboard.demo.farutech.com
Puerto: 21 (FTP) o 22 (SFTP)
```

Sube todo el contenido de `dist/` a `public_html/`

#### Opción C: Git + SSH (Si tienes acceso SSH)
```bash
# En Hostinger, si tienes acceso SSH
cd public_html
git clone https://github.com/faridmaloof/dashboard.git .
npm install
npm run build
# Mover contenido de dist/ a public_html/
```

### 3. ✅ Verificar el Archivo .htaccess

**Usando File Manager de Hostinger:**
1. Navega a `public_html/`
2. Busca el archivo `.htaccess`
3. Haz clic derecho → **Edit**
4. Verifica que contenga estas líneas CRÍTICAS:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Si no existe el archivo:**
1. Crea un nuevo archivo llamado `.htaccess` (con el punto al inicio)
2. Copia todo el contenido de `public/.htaccess` de este proyecto
3. Guarda el archivo

### 4. 🧪 Probar la Configuración

Prueba estas URLs directamente (sin hacer login primero):

✅ **Debe funcionar:**
- `https://dashboard.demo.farutech.com/` → Redirige a `/dashboard` o `/login`
- `https://dashboard.demo.farutech.com/login` → Muestra página de login
- `https://dashboard.demo.farutech.com/dashboard` → Pide login y funciona
- `https://dashboard.demo.farutech.com/settings/general` → Pide login y funciona
- `https://dashboard.demo.farutech.com/ruta-que-no-existe` → Muestra tu 404 personalizado

❌ **No debe pasar:**
- Ver el 404 por defecto de Apache
- Ver "Forbidden" o "403"
- Ver listado de archivos

## 🔧 Solución de Problemas Comunes

### Problema 1: Sigo viendo el 404 de Apache

**Causas posibles:**
1. `.htaccess` no está en el directorio correcto
2. `.htaccess` no se subió (archivo oculto)
3. `mod_rewrite` no está habilitado (raro en Hostinger, pero posible)

**Solución:**
```apache
# Verifica que .htaccess contenga:
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Si mod_rewrite no está disponible**, contacta a soporte de Hostinger.

### Problema 2: "403 Forbidden"

**Causa:** Permisos incorrectos

**Solución:**
1. En File Manager, selecciona `.htaccess`
2. Click derecho → **Permissions**
3. Establece: `644` (rw-r--r--)
4. Para `index.html`: `644`
5. Para carpetas: `755`

### Problema 3: "Internal Server Error (500)"

**Causa:** Error de sintaxis en `.htaccess`

**Solución:**
1. Renombra `.htaccess` a `.htaccess.bak`
2. Verifica si el sitio funciona sin él
3. Revisa los logs en Hostinger: **Advanced** → **Error Logs**
4. Corrige la sintaxis del archivo

### Problema 4: Caché del Navegador

**Solución:**
1. Abre las DevTools (F12)
2. Haz clic derecho en el botón de recarga
3. Selecciona "Empty Cache and Hard Reload"

O en Chrome: `Ctrl+Shift+Delete` → Limpiar caché

### Problema 5: Dominio en Subdirectorio

Si tu app está en `https://tudominio.com/dashboard/` en lugar de la raíz:

```apache
# En .htaccess, agrega:
RewriteBase /dashboard/

# Y cambia la regla a:
RewriteRule . /dashboard/index.html [L]
```

## 📊 Estructura de Archivos Final en Hostinger

```
public_html/                          ← Tu directorio raíz
├── .htaccess                         ← CRÍTICO: Configuración de Apache
├── index.html                        ← Entrada de React
├── Logo.png                          ← Logo de la aplicación
├── Logo_Full.png                     ← Logo completo
├── assets/                           ← Recursos estáticos
│   ├── index-[hash].css             ← Estilos compilados
│   ├── index-[hash].js              ← JavaScript principal
│   ├── react-vendor-[hash].js       ← React libraries
│   ├── ui-vendor-[hash].js          ← UI components
│   ├── chart-vendor-[hash].js       ← Chart libraries
│   └── ...                           ← Otros chunks
└── [otros archivos del hosting]
```

## 🔐 Configuración HTTPS (Recomendado)

Hostinger incluye SSL gratis. Para forzar HTTPS:

1. En tu panel de Hostinger:
   - Ve a **SSL** → Activa **Force HTTPS**

2. O agrega al `.htaccess` (al inicio del archivo):

```apache
# Forzar HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
</IfModule>
```

## 🚀 Despliegue Automático (Opcional)

### Usando GitHub Actions + FTP

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Hostinger via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ftp.dashboard.demo.farutech.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

**Configurar secrets en GitHub:**
1. Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**
2. Agrega `FTP_USERNAME` y `FTP_PASSWORD`

## 📝 Checklist Final

Antes de cerrar, verifica:

- [ ] `.htaccess` existe en `public_html/`
- [ ] `.htaccess` es visible (archivos ocultos activados)
- [ ] Permisos: `.htaccess` (644), `index.html` (644)
- [ ] Todas las rutas funcionan directamente (sin 404 de Apache)
- [ ] HTTPS está activado (candado verde)
- [ ] Caché del navegador limpiada
- [ ] 404 personalizado funciona para rutas inválidas
- [ ] Error Boundary funciona (prueba lanzando un error)

## 🆘 Soporte

**Si sigues teniendo problemas:**

1. **Verifica los logs de Apache:**
   - Panel de Hostinger → **Advanced** → **Error Logs**

2. **Contacta a Hostinger:**
   - Chat en vivo 24/7
   - Menciona: "mod_rewrite no funciona para SPA React"

3. **Verifica que mod_rewrite esté habilitado:**
   - Crea un archivo `phpinfo.php`:
     ```php
     <?php phpinfo(); ?>
     ```
   - Accede: `https://dashboard.demo.farutech.com/phpinfo.php`
   - Busca "mod_rewrite" → Debe decir "Loaded"
   - **ELIMINA** el archivo después

## 📚 Recursos Adicionales

- [Documentación de Hostinger](https://support.hostinger.com/)
- [Apache mod_rewrite](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [React Router](https://reactrouter.com/)

---

**✅ Todo configurado correctamente cuando:**
- Puedes acceder a cualquier ruta directamente sin 404 de Apache
- React Router maneja todas las rutas
- Tu 404 personalizado aparece para rutas inválidas
- El login funciona en cualquier ruta protegida
