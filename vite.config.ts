import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// plungin for analyse bundle
import { analyzer } from 'vite-bundle-analyzer'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    analyzer()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
