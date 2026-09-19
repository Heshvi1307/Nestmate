@echo off
title Stop NestMate AI

echo ========================================================
echo   Stopping NestMate AI servers (port 8000 & 5173)...
echo ========================================================

:: Kill port 8000 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Stopping Backend process on PID %%a...
    taskkill /F /PID %%a 2>nul
)

:: Kill port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping Frontend process on PID %%a...
    taskkill /F /PID %%a 2>nul
)

echo.
echo Servers stopped cleanly.
timeout /t 2 >nul
