@echo off
echo This script will copy the project to a directory without special characters.
echo.

set /p target_dir=Enter the target directory path (e.g., C:\Projects\nextjs-auth-app): 

if not exist "%target_dir%" (
  echo Creating directory %target_dir%...
  mkdir "%target_dir%"
)

echo.
echo Copying project files to %target_dir%...
xcopy /E /I /H /Y "." "%target_dir%"

echo.
echo Project copied successfully to %target_dir%
echo.
echo You can now navigate to the new directory and run the application:
echo cd "%target_dir%"
echo npm run dev
echo.
pause