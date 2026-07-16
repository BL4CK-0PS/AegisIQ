#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Database Backup Script
# Usage: ./backup.sh [backup_name]
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
BACKUP_DIR="$PROJECT_ROOT/infrastructure/backups"

# Load environment
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

POSTGRES_USER="${POSTGRES_USER:-aegisiq}"
POSTGRES_DB="${POSTGRES_DB:-aegisiq}"
BACKUP_NAME="${1:-aegisiq_$(date +'%Y-%m-%d_%H%M%S')}"
BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_NAME"

# Method 1: Docker exec (if running)
if docker compose ps postgres --format '{{.Status}}' 2>/dev/null | grep -q "Up"; then
    docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$BACKUP_FILE"
    echo "Backup created via Docker: $BACKUP_FILE"
elif command -v pg_dump >/dev/null 2>&1; then
    # Method 2: Local pg_dump
    pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$BACKUP_FILE"
    echo "Backup created via pg_dump: $BACKUP_FILE"
else
    echo "ERROR: No backup method available. Install pg_dump or ensure Docker container is running."
    exit 1
fi

# Compress
gzip "$BACKUP_FILE"
echo "Compressed: ${BACKUP_FILE}.gz"

# Keep only last 10 backups
ls -t "$BACKUP_DIR"/aegisiq_*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm --

echo "Backup complete!"
echo "Available backups:"
ls -lh "$BACKUP_DIR"/aegisiq_*.sql.gz 2>/dev/null
