import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        id: '/',
        name: 'Vinayagamoorthy Jothidam',
        short_name: 'Jothidam',
        description:
          'Vinayagamoorthy Jothidam — Vedic astrology software. Jathagam, panchangam, matching, transit predictions and more. / வேத ஜோதிட மென்பொருள்.',
        lang: 'ta',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        theme_color: '#241206',
        background_color: '#1a0d05',
        categories: ['lifestyle', 'reference', 'utilities'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the app shell + static assets. The audio file and other
        // large media are intentionally excluded (not needed offline).
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}', 'logo.png', 'apple-touch-icon.png', 'favicon-64.png'],
        globIgnores: ['**/*.mp3', '**/*.jpg', '**/*.jpeg', 'assets/couple*.png', 'assets/report-*.png'],
        // SPA routing offline — unknown paths serve index.html.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // NOTE: no runtimeCaching entry for the Render API — cross-origin
        // API calls (VITE_API_BASE_URL) pass straight through, never cached.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: { port: 5173 },
})
