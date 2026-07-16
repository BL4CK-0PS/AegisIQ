#!/bin/bash
set -euo pipefail

# ============================================
# AegisIQ Health Check Script
# Usage: ./healthcheck.sh [url]
# ============================================

BACKEND_URL="${1:-http://localhost:8000}"
FRONTEND_URL="${2:-http://localhost}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    local name="$1"
    local url="$2"

    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name is healthy ($url)"
        return 0
    else
        echo -e "${RED}✗${NC} $name is DOWN ($url)"
        return 1
    fi
}

echo "==========================================="
echo "  AegisIQ Health Check"
echo "==========================================="
echo ""

failed=0

check_service "Backend API" "$BACKEND_URL/health" || failed=$((failed + 1))
check_service "Frontend" "$FRONTEND_URL" || failed=$((failed + 1))

# Check database via backend
if curl -sf "$BACKEND_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Database connection OK (via backend)"
else
    echo -e "${YELLOW}?${NC} Cannot verify database (backend down)"
fi

echo ""
echo "==========================================="

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}All services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}$failed service(s) are down!${NC}"
    exit 1
fi
