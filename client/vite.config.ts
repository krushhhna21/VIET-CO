import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'assets/index.[hash].css';
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});