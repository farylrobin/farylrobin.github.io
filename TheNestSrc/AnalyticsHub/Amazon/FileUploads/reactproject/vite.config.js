import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/TheNestSrc/AnalyticsHub/Amazon/FileUploads/',
  plugins: [react()],
  build: {
    outDir: 'docs/TheNestSrc/AnalyticsHub/Amazon/FileUploads'
  },
});