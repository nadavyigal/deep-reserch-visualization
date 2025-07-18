const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🛠️ Starting comprehensive fix for project issues...');

// Step 1: Check for Hebrew characters in path
const currentDir = process.cwd();
const hasNonAsciiChars = /[^\x00-\x7F]/.test(currentDir);
if (hasNonAsciiChars) {
  console.log('⚠️ WARNING: Your project path contains non-ASCII characters:');
  console.log(currentDir);
  console.log('This is likely causing many of the file system errors you are experiencing.');
  console.log('');
  console.log('🔴 CRITICAL: You should run "node create-clean-project.js" FIRST to copy this project to a path without special characters.');
  console.log('Running other fixes in a path with Hebrew characters might not work correctly.');
  
  // Ask the user if they want to continue despite the warning
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nDo you want to continue with fixes anyway? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Exiting. Please run "node create-clean-project.js" first.');
      rl.close();
      process.exit(0);
    } else {
      rl.close();
      runFixes();
    }
  });
} else {
  runFixes();
}

// Run all the fixes
function runFixes() {
  // Fix 1: Check client components that need 'use client' directive
  fixClientDirective('src/app/not-found.tsx');
  
  // Fix 2: Install missing dependencies
  installDependencies();
  
  // Fix 3: Clean build artifacts
  cleanBuildArtifacts();
  
  // Fix 4: Fix TypeScript configuration
  fixTypeScriptConfig();
  
  // Fix 5: Print final instructions
  printFinalInstructions();
}

// Fix client directive in files
function fixClientDirective(relativePath) {
  console.log(`\n🔧 Checking and fixing '${relativePath}'...`);
  const filePath = path.join(currentDir, relativePath);
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim().startsWith("'use client'")) {
        content = "'use client';\n\n" + content;
        fs.writeFileSync(filePath, content);
        console.log(`✅ Added "use client" directive to ${relativePath}`);
      } else {
        console.log(`✅ ${relativePath} already has "use client" directive`);
      }
    } else {
      console.log(`⚠️ ${relativePath} file not found`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${relativePath}:`, error.message);
  }
}

// Install missing dependencies
function installDependencies() {
  console.log('\n🔧 Installing missing dependencies...');
  
  try {
    // Install is-number (required by tailwindcss)
    console.log('Installing is-number package...');
    execSync('npm install is-number --save-dev', { stdio: 'inherit' });
    
    // Run npm install to fix SWC dependencies
    console.log('Running npm install to fix SWC dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    console.log('Please try running these commands manually:');
    console.log('  npm install is-number --save-dev');
    console.log('  npm install');
  }
}

// Clean build artifacts
function cleanBuildArtifacts() {
  console.log('\n🔧 Cleaning build artifacts...');
  
  try {
    // Remove .next directory
    const nextDir = path.join(currentDir, '.next');
    if (fs.existsSync(nextDir)) {
      try {
        console.log('Removing .next directory...');
        fs.rmSync(nextDir, { recursive: true, force: true });
        console.log('✅ .next directory removed');
      } catch (error) {
        console.error('Error removing .next directory:', error.message);
        console.log('Trying alternative method...');
        
        // On Windows with special characters, sometimes rmSync fails
        // Try using the rimraf command if available
        try {
          execSync('npx rimraf .next', { stdio: 'inherit' });
          console.log('✅ .next directory removed using rimraf');
        } catch (rimrafError) {
          console.error('Failed to remove .next directory:', rimrafError.message);
        }
      }
    } else {
      console.log('✅ .next directory does not exist (already clean)');
    }
  } catch (error) {
    console.error('❌ Error cleaning build artifacts:', error.message);
  }
}

// Fix TypeScript configuration
function fixTypeScriptConfig() {
  console.log('\n🔧 Checking TypeScript configuration...');
  const tsConfigPath = path.join(currentDir, 'tsconfig.json');
  
  try {
    if (fs.existsSync(tsConfigPath)) {
      let tsConfig;
      try {
        tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      } catch (parseError) {
        console.error('❌ Error parsing tsconfig.json:', parseError.message);
        return;
      }
      
      let modified = false;
      
      // Ensure compilerOptions exists
      if (!tsConfig.compilerOptions) {
        tsConfig.compilerOptions = {};
        modified = true;
      }
      
      // Ensure jsx is set to "preserve"
      if (!tsConfig.compilerOptions.jsx || tsConfig.compilerOptions.jsx !== 'preserve') {
        tsConfig.compilerOptions.jsx = 'preserve';
        modified = true;
      }
      
      // Ensure strict mode is enabled
      if (tsConfig.compilerOptions.strict !== true) {
        tsConfig.compilerOptions.strict = true;
        modified = true;
      }
      
      // Ensure esModuleInterop is enabled for better compatibility
      if (tsConfig.compilerOptions.esModuleInterop !== true) {
        tsConfig.compilerOptions.esModuleInterop = true;
        modified = true;
      }
      
      if (modified) {
        try {
          fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
          console.log('✅ Updated tsconfig.json');
        } catch (writeError) {
          console.error('❌ Error writing tsconfig.json:', writeError.message);
        }
      } else {
        console.log('✅ tsconfig.json appears to be configured correctly');
      }
    } else {
      console.log('⚠️ tsconfig.json not found');
    }
  } catch (error) {
    console.error('❌ Error checking TypeScript configuration:', error.message);
  }
}

// Print final instructions
function printFinalInstructions() {
  console.log('\n✅ Fix script completed');
  
  if (hasNonAsciiChars) {
    console.log('\n🔴 IMPORTANT: Your project path still contains non-ASCII characters.');
    console.log('This will likely continue to cause file system errors.');
    console.log('It is STRONGLY recommended to run "node create-clean-project.js" to move your project to a path without special characters.');
  }
  
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" to start the development server');
  console.log('2. If you still experience errors with Hebrew characters in the path, run "node create-clean-project.js"');
  console.log('3. Remember to copy your .env.local file to the new location if you move the project');
} 