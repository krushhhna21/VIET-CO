import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url'; // Import to handle ES modules
import { dirname } from 'path'; // Import to get the directory name

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: 'client',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
  },
  plugins: [react()],
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
