@echo off
title HiddenCheats Local Server
cd /d "%~dp0"
echo ===================================================
echo   HiddenCheats Local Server
echo   URL: http://localhost:3000
echo ===================================================
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3001"
where python >nul 2>nul
if %errorlevel% equ 0 (
    python -m http.server 3001
    goto end
)
where py >nul 2>nul
if %errorlevel% equ 0 (
    py -m http.server 3001
    goto end
)
where npx >nul 2>nul
if %errorlevel% equ 0 (
    npx -y serve -l 3001 .
    goto end
)
where php >nul 2>nul
if %errorlevel% equ 0 (
    php -S localhost:3001
    goto end
)
echo Neither Python, Node (npx), nor PHP was found in your PATH.
:end
pause
