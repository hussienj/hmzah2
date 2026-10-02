import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || "AIzaSyDsiZmigwNxdmb-6Yqpvi0ZHUv3gGYz12s"),
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || "AIzaSyDsiZmigwNxdmb-6Yqpvi0ZHUv3gGYz12s")
  },
  resolve: {
    alias: {
      '@': path.resolve('./'),
    }
  }
});
