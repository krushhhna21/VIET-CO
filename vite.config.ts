import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url'; // Import to handle ES modules
import { dirname } from 'path'; // Import to get the directory name

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),  // Resolves to 'client/src' from project root
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'client', 'dist', 'public'),  // Output to 'client/dist/public'
    emptyOutDir: true,  // Clear out directory before building
  },
  plugins: [react()],
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],  // Deny hidden files in file system access
    },
  },
});
