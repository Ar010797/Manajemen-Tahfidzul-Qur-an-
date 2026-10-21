import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      {
        name: 'disable-hmr-ws-errors',
        enforce: 'pre',
        transform(code, id) {
          if (code.includes('WebSocket closed without opened.') || code.includes('[vite] failed to connect to websocket')) {
            return code.replaceAll(
              'reject(new Error("WebSocket closed without opened."));',
              'resolve();'
            ).replaceAll(
              'console.error("[vite]", err)',
              'console.debug("[vite]", err)'
            ).replaceAll(
              'console.error(`[vite] failed to connect to websocket',
              'console.debug(`[vite] failed to connect to websocket'
            ).replaceAll(
              'console.error(\n                  `[vite] failed to connect to websocket',
              'console.debug(\n                  `[vite] failed to connect to websocket'
            ).replaceAll(
              'throw e;',
              '/* suppressed */'
            );
          }
        }
      },
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,ttf}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/picsum\.photos\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'picsum-images',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: false // We already have it linked in index.html
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
