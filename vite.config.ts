import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: true,
                },
                injectRegister: 'auto',
                // add this to cache all the imports
                workbox: {
                    globPatterns: ["**/*"],
                },
                // add this to cache all the
                // static assets in the public folder
                includeAssets: [
                    "**/*",
                ],
                manifest: {
                    "theme_color": "#339af0",
                    "background_color": "#ffffff",
                    "display": "fullscreen",
                    "scope": "/",
                    "start_url": "/",
                    "short_name": "Stroodle.me",
                    "description": "project management app",
                    "name": "Stroodle.me",
                    icons: [
                        {
                            src: 'pwa-64x64.png',
                            sizes: '64x64',
                            type: 'image/png'
                        },
                        {
                            src: 'pwa-192x192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: 'pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any'
                        },
                        {
                            src: 'maskable-icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'maskable'
                        }
                    ],
                },
            }
        ),
    ],
})
