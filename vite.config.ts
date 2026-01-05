
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
    target: 'es2020'
  }
});
