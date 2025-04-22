import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/TheNestSrc/AnalyticsHub/Amazon/FileUploads/',
  plugins: [react()],
  build: {
    outDir: '/Users/gabebiolos/Library/CloudStorage/Box-Box/FR_BOX/FR_General/z_Infrastructure/farylrobin.github.io/docs'
  },
});