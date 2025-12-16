import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://altitude-backend.uz/api", // or your local backend
                changeOrigin: true,
            },
        },
    },
})
