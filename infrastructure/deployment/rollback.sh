#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Rollback Script
# Usage: ./rollback.sh [git_commit_tag]
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

COMMIT_TAG="${1:-}"

if [ -z "$COMMIT_TAG" ]; then
    log "Available recent git commits:"
    cd "$PROJECT_ROOT" && git log --oneline -10
    echo ""
    read -rp "Enter git commit hash/tag to rollback to: " COMMIT_TAG
fi

if [ -z "$COMMIT_TAG" ]; then
    error "No commit tag provided."
fi

cd "$PROJECT_ROOT"

log "Rolling back to commit: $COMMIT_TAG"

# Verify the commit exists
if ! git cat-file -e "$COMMIT_TAG" 2>/dev/null; then
    error "Git commit/tag '$COMMIT_TAG' not found."
fi

# Stash any uncommitted changes
STASHED=false
if ! git diff --quiet HEAD 2>/dev/null; then
    git stash push -m "rollback-stash-$(date +%s)" 2>/dev/null || true
    STASHED=true
fi

# Checkout the target commit
log "Checking out $COMMIT_TAG..."
git checkout "$COMMIT_TAG"

# Rebuild and restart
log "Rebuilding and restarting services..."
docker compose down
docker compose up -d --build

# Health check
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if curl -sf "http://localhost:${BACKEND_PORT:-8000}/health" > /dev/null 2>&1; then
        success "Rollback complete! Services are healthy at commit: $COMMIT_TAG"
        # Return to main branch
        git checkout main 2>/dev/null || true
        if [ "$STASHED" = true ]; then
            git stash pop 2>/dev/null || true
        fi
        exit 0
    fi
    retry_count=$((retry_count + 1))
    log "Waiting for services... ($retry_count/$max_retries)"
    sleep 2
done

# Return to main on failure too
git checkout main 2>/dev/null || true
if [ "$STASHED" = true ]; then
    git stash pop 2>/dev/null || true
fi
error "Rollback health check failed. Manual intervention may be required."
