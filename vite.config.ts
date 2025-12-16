import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://altitude-backend.uz", // or your local backend
                changeOrigin: true,
                secure: true, // keep true for valid https cert
            },
        },
    },
})
