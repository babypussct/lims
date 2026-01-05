import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      jit: true,
      tsconfig: './tsconfig.json'
    }),
  ],
  resolve: {
    mainFields: ['module'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production to reduce build size
    chunkSizeWarningLimit: 1000
  }
});