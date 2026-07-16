#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Development Server
# Starts both backend and frontend concurrently
# Usage: ./dev.sh
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[DEV]${NC} $1"; }

cleanup() {
    log "Shutting down development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}[DEV]${NC} Development servers stopped."
}

trap cleanup EXIT INT TERM

cd "$PROJECT_ROOT"

# Start backend
log "Starting backend server..."
cd backend

# Activate venv if it exists
if [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
elif [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Start frontend
log "Starting frontend server..."
cd frontend

if command -v pnpm >/dev/null 2>&1; then
    pnpm dev &
elif command -v npm >/dev/null 2>&1; then
    npm run dev &
else
    echo -e "${RED}[ERROR]${NC} No package manager found."
    exit 1
fi
FRONTEND_PID=$!

cd ..

echo ""
log "Development servers started!"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  API Docs: http://localhost:8000/docs"
echo ""
log "Press Ctrl+C to stop all servers."

wait
