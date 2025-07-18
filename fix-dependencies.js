const { execSync } = require('child_process');

console.log('🛠️ Installing missing dependencies...');

try {
  // Install the missing is-number dependency that's causing the critical error
  console.log('Installing is-number...');
  execSync('npm install is-number --save-dev', { stdio: 'inherit' });
  
  // Fix SWC dependencies
  console.log('Installing SWC dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Clean the Next.js cache
  console.log('Cleaning Next.js cache...');
  execSync('npx rimraf .next', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
} 

// Fix for webpack caching failures
console.log('🛠️ Fixing webpack caching failures...');

try {
  // Remove problematic cache files
  console.log('Removing problematic cache files...');
  execSync('npx rimraf node_modules/.cache', { stdio: 'inherit' });
  
  console.log('✅ Webpack caching failures fixed successfully!');
} catch (error) {
  console.error('❌ Error fixing webpack caching failures:', error.message);
  process.exit(1);
}

// Add any additional checks
console.log('🔍 Running additional dependency checks...');
try {
  // Check for tailwind dependencies
  const tailwindDeps = ['to-regex-range', 'fill-range', 'braces', 'micromatch'];
  for (const dep of tailwindDeps) {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep} is installed`);
    } catch (e) {
      console.log(`❌ ${dep} is not installed, installing...`);
      execSync(`npm install ${dep} --save-dev`, { stdio: 'inherit' });
    }
  }

  console.log('✅ All dependency checks completed!');
} catch (error) {
  console.error('❌ Error during additional checks:', error.message);
}