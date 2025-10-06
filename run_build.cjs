const { execSync } = require('child_process');
const path = require('path');

// Dynamically determine the absolute path to the Vite executable
const vitePath = path.resolve(process.cwd(), 'node_modules', '.bin', 'vite');

try {
  console.log(`Attempting to run build using Node runtime: node ${vitePath} build`);
  
  // *** THE FIX: Explicitly run the executable using 'node' ***
  execSync(`node ${vitePath} build`, { stdio: 'inherit' });
  
  console.log('Vite build successful!');
} catch (error) {
  console.error('Vite build failed!');
  if (error.output) {
      console.error("--- Shell Output ---");
      // Log the actual error output from the shell
      console.error(error.output.toString());
  }
  process.exit(1);
}
