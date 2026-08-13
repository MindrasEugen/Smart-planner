import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // injectManifest: il Service Worker e' src/sw.js (logica notifiche custom),
      // Workbox ci inietta solo la lista degli asset da precachare.
      // Con 'generateSW' il SW generato sovrascriveva quello custom nella build.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/apple-touch-icon.png'],
      // Il SW serve anche in dev, altrimenti le notifiche non sono testabili
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      },
      manifest: {
        id: '/',
        name: 'Agenda Intelligente',
        short_name: 'Agenda',
        description: 'Agenda personale con notifiche persistenti',
        lang: 'it',
        start_url: '/',
        scope: '/',
        // theme_color allineato al design system (--color-primary)
        theme_color: '#002045',
        background_color: '#f7fafc',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          // Icone opache con contenuto entro la safe zone: Android puo'
          // ritagliarle nella forma di sistema senza tagliare il glifo
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Nota: l'opzione `workbox.runtimeCaching` vale solo per la strategia
      // 'generateSW'. Le rotte di runtime sono ora dichiarate in src/sw.js.
    }),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
});
