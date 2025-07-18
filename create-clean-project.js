const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📦 Project Path Fixer');
console.log('This script will copy your project to a new location with an ASCII-only path');
console.log('Your current project path contains non-ASCII characters (Hebrew), which can cause file system errors');

// Get the current directory
const currentDir = process.cwd();
console.log(`\nCurrent project path: ${currentDir}`);

// Suggest a new project path (Documents folder with ASCII-only characters)
let defaultNewPath = '';
if (process.platform === 'win32') {
  // Windows - use Documents folder
  defaultNewPath = path.join(process.env.USERPROFILE, 'Documents', 'deep-research-viz');
} else {
  // Unix/Mac - use home directory
  defaultNewPath = path.join(process.env.HOME, 'deep-research-viz');
}

// Ask the user for the new project location
rl.question(`\nEnter new project path (or press Enter for default: ${defaultNewPath}): `, (newPath) => {
  const targetPath = newPath || defaultNewPath;

  // Check if the target directory already exists
  if (fs.existsSync(targetPath)) {
    console.log(`\n⚠️ Warning: Directory ${targetPath} already exists`);
    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        copyProject(targetPath);
      } else {
        console.log('❌ Operation cancelled');
        rl.close();
      }
    });
  } else {
    copyProject(targetPath);
  }
});

function copyProject(targetPath) {
  try {
    console.log(`\n🔄 Copying project to ${targetPath}...`);
    
    // Create the target directory
    fs.mkdirSync(targetPath, { recursive: true });
    
    // Use robocopy on Windows for better handling of long paths and special characters
    if (process.platform === 'win32') {
      // Exclude node_modules and .next directory to speed up the copy
      try {
        console.log('Using robocopy to copy files (this may take a moment)...');
        
        // We need to escape double quotes in paths for Windows command line
        const srcPath = currentDir.replace(/"/g, '\\"');
        const destPath = targetPath.replace(/"/g, '\\"');
        
        // Create a more robust command with error handling
        const excludeDirs = [
          `"${path.join(srcPath, 'node_modules')}"`,
          `"${path.join(srcPath, '.next')}"`,
          `"${path.join(srcPath, '.git')}"`
        ].join(' ');
        
        execSync(`robocopy "${srcPath}" "${destPath}" /E /XD ${excludeDirs}`, 
          { stdio: 'ignore' });
        
        // Robocopy returns non-zero exit codes even for successful operations
        console.log('✅ Files copied successfully with robocopy');
        
      } catch (robocopyError) {
        // If robocopy fails, try a more basic copy approach using PowerShell
        console.log('⚠️ Robocopy encountered an issue, trying alternative method...');
        
        try {
          // Use PowerShell Copy-Item for better Unicode path handling
          const command = `powershell -Command "Get-ChildItem -Path '${currentDir}' -Recurse -Exclude node_modules,.next,.git | Copy-Item -Destination {$_.FullName.Replace('${currentDir}', '${targetPath}')} -Force -Recurse"`;
          execSync(command, { stdio: 'ignore' });
          console.log('✅ Files copied successfully with PowerShell');
        } catch (pwshError) {
          // Last resort: manual copy of important files
          console.error('❌ PowerShell copy failed:', pwshError.message);
          throw new Error('Both robocopy and PowerShell methods failed');
        }
      }
    } else {
      // Use rsync on Unix/Mac
      try {
        console.log('Using rsync to copy files (this may take a moment)...');
        execSync(`rsync -a --exclude="node_modules" --exclude=".next" --exclude=".git" "${currentDir}/" "${targetPath}/"`);
        console.log('✅ Files copied successfully with rsync');
      } catch (rsyncError) {
        console.error('❌ rsync failed:', rsyncError.message);
        
        // Try cp as fallback
        try {
          console.log('Trying cp as fallback...');
          execSync(`cp -R "${currentDir}/"* "${targetPath}/"`);
          console.log('✅ Files copied with cp command');
        } catch (cpError) {
          throw new Error('Both rsync and cp failed');
        }
      }
    }

    // Specifically check and copy .env files which are often hidden and important
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
    console.log('Checking for environment files...');
    
    let foundEnvFiles = false;
    envFiles.forEach(envFile => {
      const envFilePath = path.join(currentDir, envFile);
      if (fs.existsSync(envFilePath)) {
        try {
          const targetEnvPath = path.join(targetPath, envFile);
          fs.copyFileSync(envFilePath, targetEnvPath);
          console.log(`✅ Copied ${envFile}`);
          foundEnvFiles = true;
        } catch (envCopyError) {
          console.error(`❌ Failed to copy ${envFile}:`, envCopyError.message);
        }
      }
    });
    
    if (!foundEnvFiles) {
      console.log('No .env files found');
    }

    // Create a .gitignore file if it doesn't exist
    const gitignorePath = path.join(targetPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, 
`# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`);
      console.log('✅ Created .gitignore file');
    }

    // Create a README.md with instructions
    const readmePath = path.join(targetPath, 'README.md');
    fs.writeFileSync(readmePath, 
`# Deep Research Visualization

This project has been relocated to an ASCII-only path to avoid file system errors.

## Setup

1. Open a terminal in this directory
2. Install dependencies:

\`\`\`
npm install
\`\`\`

3. Run the development server:

\`\`\`
npm run dev
\`\`\`

## Notes

The original project was at a path with non-ASCII characters, which can cause issues with Node.js and npm on Windows.
`);
    console.log('✅ Created README.md with instructions');

    console.log('\n✅ Project successfully copied!');
    console.log(`\nTo use the new project location:`);
    console.log(`1. cd "${targetPath}"`);
    console.log(`2. npm install`);
    console.log(`3. npm run dev`);
    
  } catch (error) {
    console.error(`\n❌ Error copying project: ${error.message}`);
    console.log('\nTroubleshooting suggestions:');
    console.log('- Try manually copying the project files (excluding node_modules and .next folders)');
    console.log('- Ensure you have permissions to write to the target directory');
    console.log('- Try a different target path without spaces or special characters');
  } finally {
    rl.close();
  }
} 