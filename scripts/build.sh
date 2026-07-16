#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Build Script
# Usage: ./build.sh [environment]
# ============================================

ENVIRONMENT="${1:-development}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

log() { echo -e "\033[0;34m[BUILD]\033[0m $1"; }
success() { echo -e "\033[0;32m[DONE]\033[0m $1"; }

cd "$PROJECT_ROOT"

log "Building for $ENVIRONMENT..."

# Build frontend
log "Building frontend..."
cd frontend
if command -v pnpm >/dev/null 2>&1; then
    pnpm build
elif command -v npm >/dev/null 2>&1; then
    npm run build
fi
cd ..
success "Frontend built"

# Build Docker images
if command -v docker >/dev/null 2>&1; then
    log "Building Docker images..."
    docker compose build
    success "Docker images built"
fi

success "Build complete for $ENVIRONMENT!"
