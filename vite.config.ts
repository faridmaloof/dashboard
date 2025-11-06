import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar node_modules en chunks específicos
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            
            // React Router
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            
            // Chart.js y react-chartjs-2 (muy grandes)
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chart-vendor'
            }
            
            // Recharts (alternativa a Chart.js)
            if (id.includes('recharts')) {
              return 'recharts-vendor'
            }
            
            // TanStack Query y Table
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor'
            }
            if (id.includes('@tanstack/react-table')) {
              return 'table-vendor'
            }
            
            // Headless UI y Heroicons
            if (id.includes('@headlessui')) {
              return 'headlessui-vendor'
            }
            if (id.includes('@heroicons')) {
              return 'heroicons-vendor'
            }
            
            // Framer Motion (animaciones)
            if (id.includes('framer-motion')) {
              return 'motion-vendor'
            }
            
            // Axios
            if (id.includes('axios')) {
              return 'axios-vendor'
            }
            
            // Zustand (state management)
            if (id.includes('zustand')) {
              return 'zustand-vendor'
            }
            
            // Date-fns
            if (id.includes('date-fns')) {
              return 'date-vendor'
            }
            
            // Zod (validación)
            if (id.includes('zod')) {
              return 'zod-vendor'
            }
            
            // clsx y otras utilidades pequeñas
            if (id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'utils-vendor'
            }
            
            // El resto de node_modules en un chunk genérico
            return 'vendor'
          }
        },
        // Mejorar nombres de chunks para debugging y cache
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Configuración de optimización
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    // Aumentar límite a 1000KB para evitar warnings innecesarios
    // Los chunks lazy-loaded se cargarán bajo demanda
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'axios',
      'zustand',
    ],
  },
})
