const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

// This adds the base path setting to fix asset loading on the server.
module.exports = defineConfig({
  plugins: [react()],
  base: './', // <--- THIS IS THE CRITICAL FIX
  build: {
    rollupOptions: {
      external: [
        'react-is' 
      ]
    }
  }
})
