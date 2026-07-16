#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Project Setup Script
# Usage: ./setup.sh
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[SETUP]${NC} $1"; }
success() { echo -e "${GREEN}[DONE]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

cd "$PROJECT_ROOT"

log "Setting up AegisIQ development environment..."

# 1. Environment file
if [ ! -f .env ]; then
    log "Creating .env from .env.example..."
    cp .env.example .env
    success ".env created"
else
    warn ".env already exists, skipping"
fi

# 2. Python backend
log "Setting up Python backend..."
cd backend
if [ ! -d ".venv" ]; then
    python3 -m venv .venv 2>/dev/null || python -m venv .venv
fi

# Activate venv (works on both Linux/macOS and Windows Git Bash)
if [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
elif [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

pip install --upgrade pip -q
pip install -r requirements.txt -q
success "Backend dependencies installed"

cd ..

# 3. Frontend
log "Setting up frontend..."
cd frontend
if command -v pnpm >/dev/null 2>&1; then
    pnpm install
elif command -v npm >/dev/null 2>&1; then
    npm install
else
    warn "No package manager found. Install pnpm or npm."
fi
success "Frontend dependencies installed"

cd ..

# 4. Docker (optional)
if command -v docker >/dev/null 2>&1; then
    log "Building Docker images..."
    docker compose build 2>/dev/null || warn "Docker build skipped"
    success "Docker images built"
else
    warn "Docker not installed, skipping container build"
fi

# Done
echo ""
success "Setup complete!"
echo ""
echo "To start development:"
echo "  Docker:    docker compose up"
echo "  Local:     ./scripts/dev.sh"
echo ""
