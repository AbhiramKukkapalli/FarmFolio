// This script executes the build command directly using the local node_modules path
const { execSync } = require('child_process');

try {
  // Use the explicit path to the Vite executable
  execSync('./node_modules/.bin/vite build', { stdio: 'inherit' });
  console.log('Vite build successful!');
} catch (error) {
  console.error('Vite build failed!');
  process.exit(1);
}
