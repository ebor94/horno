import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// Publicado en http://192.9.17.11/incol/ (AppServ). VITE_BASE permite otro subdirectorio.
export default defineConfig({
  base: process.env.VITE_BASE || '/incol/',
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5174,
    proxy: { '/api': { target: process.env.VITE_PROXY_TARGET || 'http://localhost:3020', changeOrigin: true } },
  },
  test: { environment: 'jsdom' },
});
