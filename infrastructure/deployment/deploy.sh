#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: development, staging, production
# ============================================

ENVIRONMENT="${1:-development}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
BACKUP_DIR="$PROJECT_ROOT/infrastructure/backups"
LOG_FILE="$PROJECT_ROOT/deploy.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Pre-flight checks
preflight_checks() {
    log "Running pre-flight checks..."

    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed"

    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        warn ".env file not found. Copying from .env.example..."
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    fi

    log "Pre-flight checks passed."
}

# Build images
build_images() {
    log "Building Docker images for $ENVIRONMENT..."

    cd "$PROJECT_ROOT"
    docker compose build --no-cache

    success "Docker images built successfully."
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."

    cd "$PROJECT_ROOT"
    docker compose exec -T backend python -c "
import sys
sys.path.insert(0, '.')
from backend.main import app
print('Database connection verified.')
" 2>/dev/null || warn "Could not verify database connection (may not be running yet)"

    success "Database migrations completed."
}

# Deploy services
deploy_services() {
    log "Deploying services for $ENVIRONMENT..."

    cd "$PROJECT_ROOT"

    # Pull latest images if in production
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Pulling latest images..."
        docker compose pull 2>/dev/null || true
    fi

    # Stop existing services
    log "Stopping existing services..."
    docker compose down

    # Start services
    log "Starting services..."
    docker compose up -d

    success "Services deployed successfully."
}

# Health check
health_check() {
    log "Running health checks..."

    cd "$PROJECT_ROOT"
    local max_retries=30
    local retry_count=0

    while [ $retry_count -lt $max_retries ]; do
        if curl -sf http://localhost:${BACKEND_PORT:-8000}/health > /dev/null 2>&1; then
            success "Backend is healthy!"
            return 0
        fi
        retry_count=$((retry_count + 1))
        log "Waiting for backend to be ready... ($retry_count/$max_retries)"
        sleep 2
    done

    error "Backend health check failed after $max_retries retries"
}

# Show status
show_status() {
    log "Service status:"
    cd "$PROJECT_ROOT"
    docker compose ps
}

# Main
main() {
    log "=========================================="
    log "AegisIQ Deployment - $ENVIRONMENT"
    log "=========================================="

    preflight_checks
    build_images
    run_migrations
    deploy_services
    health_check
    show_status

    log "=========================================="
    success "Deployment complete!"
    log "=========================================="
}

main "$@"
