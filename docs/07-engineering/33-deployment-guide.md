# Deployment Guide

## Table of Contents

1. Executive Summary
2. Deployment Philosophy
3. Deployment Environments
4. Infrastructure Requirements
5. Deployment Architecture
6. Container Deployment
7. Environment Configuration
8. Database Deployment
9. Reverse Proxy Configuration
10. Deployment Workflow
11. Health Checks
12. Rollback Procedure
13. Disaster Recovery
14. Production Checklist
15. Future Deployment
16. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines how AegisIQ is deployed across development, staging, and production environments.

It covers:

- Infrastructure
- Containers
- Configuration
- Networking
- Deployment workflow
- Recovery procedures

---

# 2. Deployment Philosophy

Deployments should be:

```
Repeatable
    ↓
Automated
    ↓
Recoverable
    ↓
Observable
    ↓
Secure
```

Every deployment should produce identical results from identical source code.

---

# 3. Deployment Environments

| Environment | Purpose                   |
| ----------- | ------------------------- |
| Local       | Developer machine         |
| Development | Team integration          |
| Staging     | Pre-production validation |
| Production  | Live application          |

Each environment has its own configuration and secrets.

---

# 4. Infrastructure Requirements

### MVP Server

| Component  | Recommended      |
| ---------- | ---------------- |
| OS         | Ubuntu 24.04 LTS |
| CPU        | 4 vCPU           |
| Memory     | 8 GB RAM         |
| Storage    | 100 GB SSD       |
| Docker     | Latest stable    |
| PostgreSQL | 16+              |
| Nginx      | Latest stable    |

---

# 5. Deployment Architecture

```
Internet
    ↓
Nginx
├──────── React Frontend
└──────── FastAPI Backend
    ↓
PostgreSQL
```

Future architecture:

```
Load Balancer
    ↓
Frontend
    ↓
Backend Cluster
    ↓
AI Workers
    ↓
Database Cluster
```

---

# 6. Container Deployment

Docker Compose:

```
frontend
backend
postgres
nginx
```

Deployment order:

```
PostgreSQL
    ↓
Backend
    ↓
Frontend
    ↓
Nginx
```

Shutdown order is reversed.

---

# 7. Environment Configuration

Environment variables:

Frontend:

```
VITE_API_URL
VITE_APP_NAME
```

Backend:

```
DATABASE_URL
JWT_SECRET
OPENAI_API_KEY
LOG_LEVEL
ENVIRONMENT
```

Rules:

- Never hardcode secrets.
- One `.env` file per environment.
- Validate configuration at startup.

---

# 8. Database Deployment

Deployment sequence:

```
Start PostgreSQL
    ↓
Run Alembic Migrations
    ↓
Seed Reference Data
    ↓
Verify Schema
    ↓
Start Backend
```

Reference data includes:

- Competencies
- Mission types
- Rubric definitions
- Default roles

---

# 9. Reverse Proxy Configuration

Nginx responsibilities:

- HTTPS termination
- Static asset serving
- API proxying
- Compression
- Security headers
- Request size limits

Routing:

```
/
    ↓
React

/api
    ↓
FastAPI
```

---

# 10. Deployment Workflow

```
Merge to Main
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build Docker Images
    ↓
Push Images
    ↓
Deploy
    ↓
Health Check
    ↓
Deployment Complete
```

No manual file copying to servers.

---

# 11. Health Checks

Backend:

```
GET /health
```

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

Checks:

- Database connectivity
- AI provider availability
- Disk space
- Memory
- Application startup

---

# 12. Rollback Procedure

```
Deploy
    ↓
Health Check
    ↓
Failure Detected
    ↓
Restore Previous Image
    ↓
Restart Services
    ↓
Verify Health
```

Rollback target:

- Previous Docker image
- Previous frontend bundle
- Previous migration (if reversible)

---

# 13. Disaster Recovery

Failure scenarios:

### Server Failure

```
Provision Server
    ↓
Restore Backup
    ↓
Deploy Containers
    ↓
Restore Database
    ↓
Validate
```

### Database Corruption

```
Stop Writes
    ↓
Restore Backup
    ↓
Replay Migrations
    ↓
Verify Integrity
```

Recovery objectives:

| Metric                         | Target       |
| ------------------------------ | ------------ |
| RTO (Recovery Time Objective)  | < 30 min     |
| RPO (Recovery Point Objective) | < 24 h (MVP) |

---

# 14. Production Checklist

Before deployment:

- All tests passing
- Migrations reviewed
- Environment variables configured
- Secrets verified
- Docker images built
- Health checks implemented
- Backups completed
- Release tagged

After deployment:

- Verify health endpoint
- Verify login
- Verify JD upload
- Verify assessment creation
- Verify report generation

---

# 15. Future Deployment

Future improvements:

- Kubernetes
- Horizontal autoscaling
- CDN for frontend
- Redis cache
- Object storage for reports
- Multi-region deployments
- Blue/Green deployments
- Canary releases

Introduce these only when operational requirements justify the added complexity.

---

# 16. Conclusion

The deployment architecture prioritizes reliability, repeatability, and simplicity. A Docker-based deployment on Ubuntu with GitHub Actions automation provides a practical production path while remaining manageable for a four-person team.
