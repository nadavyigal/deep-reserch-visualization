const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting clean rebuild process...');

// Function to execute commands and handle errors
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    console.error(error.message);
    return false;
  }
}

// 1. Stop any potentially running Next.js dev servers by finding and killing the process
console.log('🔍 Checking for running Next.js processes...');
try {
  if (process.platform === 'win32') {
    execSync('taskkill /f /im node.exe /fi "WINDOWTITLE eq next"', { stdio: 'ignore' });
  } else {
    execSync('pkill -f "next dev"', { stdio: 'ignore' });
  }
} catch (error) {
  // Ignore errors as there might not be any processes running
  console.log('No running Next.js processes found or unable to stop them.');
}

// 2. Delete the .next directory
console.log('🗑️ Removing .next directory...');
try {
  fs.rmSync(path.join(__dirname, '.next'), { recursive: true, force: true });
  console.log('.next directory removed successfully!');
} catch (error) {
  console.log('.next directory does not exist or could not be removed.');
}

// 3. Delete node_modules
console.log('🗑️ Removing node_modules directory...');
try {
  fs.rmSync(path.join(__dirname, 'node_modules'), { recursive: true, force: true });
  console.log('node_modules directory removed successfully!');
} catch (error) {
  console.log('node_modules directory does not exist or could not be removed.');
}

// 4. Remove package-lock.json
console.log('🗑️ Removing package-lock.json...');
try {
  fs.unlinkSync(path.join(__dirname, 'package-lock.json'));
  console.log('package-lock.json removed successfully!');
} catch (error) {
  console.log('package-lock.json does not exist or could not be removed.');
}

// 5. Clean npm cache
console.log('🧹 Cleaning npm cache...');
if (!runCommand('npm cache clean --force')) {
  console.log('Failed to clean npm cache, continuing anyway...');
}

// 6. Install dependencies
console.log('📦 Installing dependencies...');
if (!runCommand('npm install')) {
  console.error('❌ Failed to install dependencies. Aborting!');
  process.exit(1);
}

// 7. Start the development server
console.log('🚀 Starting Next.js development server...');
runCommand('npm run dev'); 