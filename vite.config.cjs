const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

// This fixes the Rollup dependency resolution issue with the 'recharts' library.
module.exports = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react-is' // <-- Instructs Rollup to leave this module outside the bundle
      ]
    }
  }
})
