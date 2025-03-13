@echo off
echo Starting Next.js server and checking if it's running...

start cmd /k "npm run dev"

echo Waiting for server to start...
timeout /t 10 /nobreak

call check-server.bat