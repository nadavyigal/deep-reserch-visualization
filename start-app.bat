@echo off
echo Starting application with clean environment...
cd /d "%~dp0"
call npm run clean
call npm run dev
pause