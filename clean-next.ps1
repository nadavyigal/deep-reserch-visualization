# PowerShell script to clean Next.js cache and restart server
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -ErrorAction SilentlyContinue

Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
# Remove .next directory if it exists
if (Test-Path -Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Remove node_modules/.cache if it exists
if (Test-Path -Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
}

Write-Host "Starting Next.js development server..." -ForegroundColor Green
npm run dev 