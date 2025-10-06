// goat-farm-app/vite.config.cjs

const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

// Removing the 'build' block allows Rollup to bundle 'react-is' correctly.
module.exports = defineConfig({
  plugins: [react()],
  base: '/', 
})
