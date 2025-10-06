const { execSync } = require('child_process');
const path = require('path');

// THE FINAL FIX: Construct the absolute path directly to the Vite executable source file
// The typical location for the main Vite binary script is node_modules/vite/bin/vite.js
const viteSourcePath = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

try {
  console.log(`Attempting to run build using Vite's source script: node ${viteSourcePath} build`);
  
  // Execute the source script directly using the Node runtime
  execSync(`node ${viteSourcePath} build`, { stdio: 'inherit' });
  
  console.log('Vite build successful!');
} catch (error) {
  console.error('Vite build failed!');
  if (error.output) {
      console.error("--- Shell Output ---");
      console.error(error.output.toString());
  }
  process.exit(1);
}
