@echo off
title RentFair AI (Nestmate) - Technofora '26 CodeCraft Launcher

echo ========================================================
echo        RENTFAIR AI & NESTMATE - PROPTECH PLATFORM
echo     Technofora '26 CodeCraft @ Nirma University
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Check Python
where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python was not found in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

:: 2. Check Node
where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm was not found in PATH. Please install Node.js.
    pause
    exit /b 1
)

:: 3. Setup Backend Environment
echo [1/4] Checking backend dependencies...
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv venv
)
echo Verifying backend requirements...
call venv\Scripts\python.exe -m pip install -r requirements.txt --quiet

:: 4. Setup Frontend Environment
echo [2/4] Checking frontend dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing frontend packages, please wait...
    call npm install
)

:: 5. Launch Backend in dedicated window
echo [3/4] Starting FastAPI backend on http://127.0.0.1:8000 ...
start "RentFair AI - Backend API" cmd /k "cd /d %~dp0backend && set PYTHONPATH=. && venv\Scripts\python.exe main.py"

:: 6. Launch Frontend in dedicated window
echo [4/4] Starting Vite frontend on http://localhost:5173 ...
start "RentFair AI - Frontend Web" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   RentFair AI (Nestmate) is launching!
echo   - Backend API:  http://127.0.0.1:8000
echo   - Swagger Docs: http://127.0.0.1:8000/docs
echo   - Frontend App: http://localhost:5173
echo ========================================================
echo.
echo Waiting 3 seconds for servers to initialize, then opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173
