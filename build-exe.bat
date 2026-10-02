@echo off
setlocal enabledelayedexpansion
title Building Desktop Application (EXE)
color 0b

echo =========================================================
echo    School Management System - Windows EXE Builder
echo    (100%% Offline Desktop Version - No Internet Required)
echo =========================================================
echo.

echo [Step 1/5] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Node.js is not found on your system!
    echo Please download and install Node.js from: https://nodejs.org
    echo After installing Node.js, run this file again.
    echo.
    pause
    exit /b 1
)
echo Node.js is installed.

echo.
echo [Step 2/5] Installing project dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Retrying install with legacy peer deps...
    call npm install --legacy-peer-deps
)

echo.
echo [Step 3/5] Checking Electron packaging tools...
call npm install --save-dev electron electron-builder --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Dependency warning, proceeding with build...
)

echo.
echo [Step 4/5] Building offline application assets...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Application build failed! Please check the output above.
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 5/5] Generating Windows Desktop Executable (EXE)...
call npx electron-builder --win --dir --publish never
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to package desktop application!
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================================
echo   SUCCESS: Desktop application built successfully!
echo   
echo   Executable file location:
echo   dist-electron\win-unpacked\school-management-system.exe
echo   
echo   You can run this application completely OFFLINE without
echo   any internet connection or cloud storage.
echo =========================================================
echo.
pause
