import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a dynamic base URL: '/' in dev, GitHub Pages path in production
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isProduction
    ? '/docs/TheNestSrc/AnalyticsHub/Amazon/FileUploads/'
    : '/'
})
