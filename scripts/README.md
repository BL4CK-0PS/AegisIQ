# AegisIQ — Scripts

> Automation and utility scripts for development, deployment, and maintenance.

---

## Available Scripts

```
scripts/
├── setup.sh        Project initialization (clone, install deps, create DB)
├── dev.sh          Start all services locally (backend + frontend)
├── build.sh        Build production artifacts
├── deploy.sh       Deploy to target environment
├── backup.sh       Database backup with timestamp
├── restore.sh      Database restore from backup
├── seed.py         Seed database with sample data
└── reset_db.py     Reset database (drop + create + migrate + seed)
```

---

## Usage

### Setup

```bash
./scripts/setup.sh
```

Runs: install Python deps → install Node deps → create DB → run migrations → seed sample data.

### Development

```bash
./scripts/dev.sh
```

Starts backend (uvicorn --reload) and frontend (vite dev) concurrently. Kills both on Ctrl+C.

### Build

```bash
./scripts/build.sh [environment]
```

Builds Docker images for backend and frontend. Default: `development`. Options: `staging`, `production`.

### Deploy

```bash
./scripts/deploy.sh [environment]
```

Pushes images → connects via SSH → pulls images → runs docker-compose up. Target server configured via `DEPLOY_HOST` env var.

### Database

```bash
# Backup
./scripts/backup.sh

# Restore
./scripts/restore.sh backups/aegisiq_2026-07-08_120000.sql

# Seed sample data
python scripts/seed.py

# Full reset
python scripts/reset_db.py
```

---

## Adding Scripts

- Use `.sh` for shell scripts, `.py` for Python scripts
- All scripts should be idempotent where possible
- Include `set -euo pipefail` in shell scripts
- Print clear error messages on failure
- Accept `--help` flag
