@echo off
REM ============================================
REM AegisIQ Development Server (Windows)
REM Starts both backend and frontend
REM ============================================

echo [DEV] Starting AegisIQ development servers...

REM Start backend
echo [DEV] Starting backend on port 8000...
start "AegisIQ Backend" cmd /c "cd backend && .venv\Scripts\activate && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Start frontend
echo [DEV] Starting frontend on port 5173...
start "AegisIQ Frontend" cmd /c "cd frontend && pnpm dev"

echo.
echo [DEV] Development servers started!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop servers...
pause > nul

taskkill /FI "WINDOWTITLE eq AegisIQ Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq AegisIQ Frontend*" /F > nul 2>&1
echo [DEV] Servers stopped.
