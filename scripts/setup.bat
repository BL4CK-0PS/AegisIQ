@echo off
REM ============================================
REM AegisIQ Setup Script (Windows)
REM ============================================

echo [SETUP] Setting up AegisIQ...

REM Create .env if not exists
if not exist .env (
    copy .env.example .env
    echo [SETUP] Created .env from .env.example
) else (
    echo [SETUP] .env already exists
)

REM Setup Python backend
echo [SETUP] Setting up Python backend...
cd backend
if not exist .venv (
    python -m venv .venv
)
call .venv\Scripts\activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo [SETUP] Backend dependencies installed
cd ..

REM Setup frontend
echo [SETUP] Setting up frontend...
cd frontend
if exist pnpm-lock.yaml (
    pnpm install
) else (
    npm install
)
echo [SETUP] Frontend dependencies installed
cd ..

echo.
echo [SETUP] Setup complete!
echo.
echo To start development:
echo   Docker:    docker compose up
echo   Local:     scripts\dev.bat
echo.
