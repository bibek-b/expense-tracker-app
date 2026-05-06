@echo off
REM Quick Start Script for Expense Tracker (Windows)
REM Run this to set up both backend and frontend

echo.
echo =================================================
echo   ^^ Expense Tracker - Quick Start (Windows)
echo =================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ^^X Node.js not found. Please install Node.js 18+
    exit /b 1
)

echo ^^^ Node.js is installed
echo.

REM Backend Setup
echo Installing backend...
cd backend || exit /b 1
echo   Installing dependencies...
call npm install --quiet 2>nul

if not exist "node_modules" (
    echo ^^X Backend setup failed
    exit /b 1
)
echo ^^^ Backend ready
cd ..
echo.

REM Frontend Setup
echo Installing frontend...
cd expense-tracker || exit /b 1
echo   Installing dependencies...
call npm install --quiet 2>nul

if not exist "node_modules" (
    echo ^^X Frontend setup failed
    exit /b 1
)
echo ^^^ Frontend ready
cd ..
echo.

REM Configuration
echo Configuration:
echo   Backend URL in expense-tracker/src/config/backend.ts:
echo   - Android emulator: http://10.0.2.2:3001
echo   - Physical phone: http://YOUR_PC_IP:3001
echo.

REM Ready to start
echo.
echo ^^^ Setup complete!
echo.
echo Next steps:
echo   1. Terminal 1 - Start backend:
echo      cd backend ^&^& npm run dev
echo.
echo   2. Terminal 2 - Start frontend:
echo      cd expense-tracker ^&^& npm start
echo.
echo   3. In the app - Settings ^> Cloud sync
echo      Enter your backend URL and save
echo.
echo ^^ Auto-sync will start automatically when online!
echo.
pause
