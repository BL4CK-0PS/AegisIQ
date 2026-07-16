#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Rollback Script
# Usage: ./rollback.sh [image_tag]
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
LOG_FILE="$PROJECT_ROOT/deploy.log"

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

IMAGE_TAG="${1:-}"

if [ -z "$IMAGE_TAG" ]; then
    log "Available recent images:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | head -10
    echo ""
    read -rp "Enter image tag to rollback to: " IMAGE_TAG
fi

if [ -z "$IMAGE_TAG" ]; then
    error "No image tag provided."
fi

log "Rolling back to image tag: $IMAGE_TAG"

cd "$PROJECT_ROOT"

# Update docker-compose to use specific tag
export BACKEND_IMAGE_TAG="$IMAGE_TAG"
export FRONTEND_IMAGE_TAG="$IMAGE_TAG"

# Restart services with the specified tag
docker compose down
docker compose up -d

# Health check
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if curl -sf http://localhost:${BACKEND_PORT:-8000}/health > /dev/null 2>&1; then
        success "Rollback complete! Services are healthy with tag: $IMAGE_TAG"
        exit 0
    fi
    retry_count=$((retry_count + 1))
    log "Waiting for services... ($retry_count/$max_retries)"
    sleep 2
done

error "Rollback health check failed. Manual intervention may be required."
