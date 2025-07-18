@echo off
setlocal enabledelayedexpansion
echo Checking if the Next.js server is running...

set PORT=3000
for /l %%i in (0, 1, 10) do (
  set /a CURRENT_PORT=PORT+%%i
  curl -s http://localhost:!CURRENT_PORT!/test.html > nul
  if !errorlevel! equ 0 (
    echo Server found running on port !CURRENT_PORT!
    start http://localhost:!CURRENT_PORT!/test.html
    goto :found
  )
)

echo Server not found on ports 3000-3010.
echo Please make sure the server is running with 'npm run dev'.
goto :end

:found
echo Opening test page in your browser...

:end
endlocal
pause 