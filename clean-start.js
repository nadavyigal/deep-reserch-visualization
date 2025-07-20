const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to delete a directory recursively
function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log(`Removing ${folderPath}...`);
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`Successfully removed ${folderPath}`);
    } catch (err) {
      console.error(`Error removing ${folderPath}:`, err);
    }
  } else {
    console.log(`${folderPath} does not exist, skipping...`);
  }
}

// Clean up Next.js cache and build directories
console.log('Cleaning up Next.js cache and build directories...');
deleteFolderRecursive(path.join(__dirname, '.next'));
deleteFolderRecursive(path.join(__dirname, 'node_modules', '.cache'));

// Start the development server
console.log('Starting Next.js development server...');
try {
  execSync('npx next dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting Next.js development server:', error);
}