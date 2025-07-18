const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running comprehensive Next.js + Tailwind diagnostic check...');

// Function to check if a module can be required
function canRequire(moduleName) {
  try {
    require.resolve(moduleName);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to execute a command with proper error handling
function safeExec(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Check Node.js and npm versions
console.log('\n🔍 Checking environment...');
safeExec('node --version', 'Node.js version');
safeExec('npm --version', 'npm version');

// Check for critical Next.js dependencies
console.log('\n🔍 Checking critical Next.js dependencies...');
const criticalNextDeps = [
  'next', 'react', 'react-dom', 'postcss',
  'tailwindcss', 'autoprefixer'
];

criticalNextDeps.forEach(dep => {
  console.log(`${canRequire(dep) ? '✅' : '❌'} ${dep}`);
  if (!canRequire(dep)) {
    console.log(`  Installing ${dep}...`);
    safeExec(`npm install ${dep}`, `Installing ${dep}`);
  }
});

// Check for critical Tailwind CSS dependencies
console.log('\n🔍 Checking Tailwind CSS dependencies...');
const tailwindDeps = [
  'is-number', 'to-regex-range', 'fill-range',
  'braces', 'micromatch'
];

tailwindDeps.forEach(dep => {
  console.log(`${canRequire(dep) ? '✅' : '❌'} ${dep}`);
  if (!canRequire(dep)) {
    console.log(`  Installing ${dep}...`);
    safeExec(`npm install ${dep} --save-dev`, `Installing ${dep}`);
  }
});

// Check for configuration files
console.log('\n🔍 Checking configuration files...');
const configFiles = [
  { name: 'next.config.js', required: true },
  { name: 'tailwind.config.js', required: true },
  { name: 'postcss.config.js', required: true },
  { name: 'tsconfig.json', required: true }
];

configFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file.name));
  console.log(`${exists ? '✅' : '❌'} ${file.name}`);
  if (!exists && file.required) {
    console.error(`  Missing required config file: ${file.name}`);
  }
});

// Check for common issues in Next.js config
try {
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = require(nextConfigPath);
    console.log('\n🔍 Analyzing next.config.js...');
    
    if (nextConfig.webpack) {
      console.log('✅ webpack configuration found');
    }
    
    if (nextConfig.transpilePackages) {
      console.log('✅ transpilePackages configuration found');
    }
  }
} catch (err) {
  console.error('❌ Error analyzing next.config.js:', err.message);
}

// Check for module resolutions in tsconfig
try {
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('\n🔍 Analyzing tsconfig.json...');
    
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      console.log('✅ Path aliases found in tsconfig.json');
    }
    
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.jsx === 'preserve') {
      console.log('✅ JSX preserve mode is correctly set');
    } else {
      console.warn('⚠️ JSX mode should be set to "preserve" for Next.js');
    }
  }
} catch (err) {
  console.error('❌ Error analyzing tsconfig.json:', err.message);
}

// Recommend fixes for common issues
console.log('\n💡 Recommended fixes for common issues:');
console.log('1. Clear the cache: npm cache clean --force');
console.log('2. Remove node_modules: rm -rf node_modules');
console.log('3. Remove .next: rm -rf .next');
console.log('4. Reinstall dependencies: npm install');
console.log('5. Update dependencies: npm update');
console.log('6. Restart the development server: npm run dev');

console.log('\n✅ Diagnostic check completed');

// Run a quick fix if critical dependencies are missing
const shouldFixDeps = criticalNextDeps.some(dep => !canRequire(dep)) || 
                     tailwindDeps.some(dep => !canRequire(dep));

if (shouldFixDeps) {
  console.log('\n🔧 Running automatic fixes for missing dependencies...');
  safeExec('npm install', 'Reinstalling dependencies');
  safeExec('npx rimraf .next', 'Clearing Next.js cache');
}

console.log('\n✅ All done! If issues persist, try accessing the test page at: http://localhost:3000/test-page'); 