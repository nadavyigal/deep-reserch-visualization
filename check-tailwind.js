const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking Tailwind CSS installation...');

try {
  // Check if Tailwind config exists
  const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
  if (fs.existsSync(tailwindConfigPath)) {
    console.log('✅ tailwind.config.js found');
  } else {
    console.error('❌ tailwind.config.js not found');
  }

  // Check if PostCSS config exists
  const postcssConfigPath = path.join(__dirname, 'postcss.config.js');
  if (fs.existsSync(postcssConfigPath)) {
    console.log('✅ postcss.config.js found');
  } else {
    console.error('❌ postcss.config.js not found');
  }

  // Verify Tailwind dependencies
  const requiredDeps = [
    'tailwindcss',
    'postcss',
    'autoprefixer',
    'is-number',
    'to-regex-range',
    'fill-range',
    'braces',
    'micromatch'
  ];

  console.log('\n📦 Checking for required dependencies...');
  
  for (const dep of requiredDeps) {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep} is installed`);
    } catch (e) {
      console.error(`❌ ${dep} is not installed, installing...`);
      execSync(`npm install ${dep} --save-dev`, { stdio: 'inherit' });
    }
  }

  // Check package.json for correct dependencies
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    console.log('\n📋 Dependencies check in package.json:');
    for (const dep of requiredDeps) {
      if (dependencies[dep]) {
        console.log(`✅ ${dep}: ${dependencies[dep]}`);
      } else {
        console.error(`❌ ${dep} is missing from package.json`);
      }
    }
  } else {
    console.error('❌ package.json not found');
  }

  // Suggest reinstalling node_modules if issues persist
  console.log('\n💡 If issues persist, try reinstalling node_modules:');
  console.log('  1. npm cache clean --force');
  console.log('  2. rm -rf node_modules');
  console.log('  3. npm install');

  console.log('\n✅ Tailwind CSS check completed');
} catch (error) {
  console.error('❌ Error during Tailwind CSS check:', error);
} 