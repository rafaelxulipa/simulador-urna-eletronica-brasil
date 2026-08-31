import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { devApiPlugin } from './devApiPlugin.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars to client code via import.meta.env.
  // devApiPlugin runs api/*.ts server-side in this same Node process (local dev
  // only — Vercel injects env vars into process.env itself in production), so
  // DATABASE_URL etc. need to land on process.env explicitly here, or api/_db.ts
  // never sees them and every /api/* call fails with "DATABASE_URL não configurada".
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith('VITE_')) process.env[key] = value
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      devApiPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: 'Treine Seu Voto',
          short_name: 'Treine Seu Voto',
          description: 'Simulador educativo independente da urna eletrônica brasileira.',
          lang: 'pt-BR',
          start_url: '/',
          display: 'standalone',
          background_color: '#0b1420',
          theme_color: '#0b1420',
          icons: [
            { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // /api/* candidate data must never be served stale-first — network wins, cache is only a fallback.
          runtimeCaching: [
            {
              urlPattern: /\/api\//,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-cache', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 } },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      exclude: ['node_modules', 'dist', 'e2e'],
    },
  }
})
