// goat-farm-app/vite.config.cjs (Final content)

const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  plugins: [react()],
  base: '/', // <-- Reverting to absolute path is necessary for Node/Express static serving
  build: {
    rollupOptions: {
      external: [
        'react-is' 
      ]
    }
  }
})
