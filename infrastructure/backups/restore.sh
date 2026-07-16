#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Database Restore Script
# Usage: ./restore.sh <backup_file>
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Load environment
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

POSTGRES_USER="${POSTGRES_USER:-aegisiq}"
POSTGRES_DB="${POSTGRES_DB:-aegisiq}"

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh "$PROJECT_ROOT/infrastructure/backups"/aegisiq_*.sql.gz 2>/dev/null || echo "No backups found."
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will overwrite the current database!"
read -rp "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo "Restoring from: $BACKUP_FILE"

# Decompress if gzipped
RESTORE_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    RESTORE_FILE="${BACKUP_FILE%.gz}"
    gunzip -k "$BACKUP_FILE"
fi

# Restore
if docker compose ps postgres --format '{{.Status}}' 2>/dev/null | grep -q "Up"; then
    docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$RESTORE_FILE"
elif command -v psql >/dev/null 2>&1; then
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$RESTORE_FILE"
else
    echo "ERROR: No restore method available."
    exit 1
fi

# Clean up decompressed file if we created it
if [[ "$BACKUP_FILE" == *.gz ]] && [ -f "$RESTORE_FILE" ]; then
    rm "$RESTORE_FILE"
fi

echo "Database restored successfully from: $BACKUP_FILE"
