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

This document defines how PWNDORA SkillScan X is deployed across development, staging, and production environments.

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

```mermaid
flowchart TD
    R[Repeatable] --> A[Automated] --> REC[Recoverable]
    REC --> O[Observable] --> S[Secure]
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

```mermaid
flowchart TD
    IN[Internet] --> N[Nginx]
    N --> RE[React Frontend]
    N --> FA[FastAPI Backend]
    FA --> PG[PostgreSQL]
```

Future architecture:

```mermaid
flowchart TD
    LB[Load Balancer] --> FE[Frontend] --> BC[Backend Cluster]
    BC --> AW[AI Workers] --> DC[Database Cluster]
```

---

# 6. Container Deployment

Docker Compose:

```
- frontend
- backend
- postgres
- nginx
```

Deployment order:

```mermaid
flowchart TD
    PG[PostgreSQL] --> BE[Backend] --> FE[Frontend] --> N[Nginx]
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

Database URL format:

```
postgresql://user:password@host:5432/skillscanx
```

Rules:

- Never hardcode secrets.
- One `.env` file per environment.
- Validate configuration at startup.

---

# 8. Database Deployment

Deployment sequence:

```mermaid
flowchart TD
    SP[Start PostgreSQL] --> RA[Run Alembic Migrations] --> SR[Seed Reference Data]
    SR --> VS[Verify Schema] --> SB[Start Backend]
```

Reference data includes:

- Capabilities
- Challenge types
- Rubric definitions
- Default roles

The default database name is `skillscanx`.

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

```mermaid
flowchart TD
    R[/] --> RE[React]
    API[/api] --> FA[FastAPI]
```

---

# 10. Deployment Workflow

```mermaid
flowchart TD
    MM[Merge to Main] --> GA[GitHub Actions] --> RT[Run Tests]
    RT --> BD[Build Docker Images] --> PI[Push Images]
    PI --> DEP[Deploy] --> HC[Health Check] --> DC[Deployment Complete]
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

```mermaid
flowchart TD
    DEP[Deploy] --> HC[Health Check] --> FD[Failure Detected]
    FD --> RPI[Restore Previous Image] --> RS[Restart Services] --> VH[Verify Health]
```

Rollback target:

- Previous Docker image
- Previous frontend bundle
- Previous migration (if reversible)

---

# 13. Disaster Recovery

Failure scenarios:

### Server Failure

```mermaid
flowchart TD
    PS[Provision Server] --> RB[Restore Backup] --> DC[Deploy Containers]
    DC --> RDB[Restore Database] --> V[Validate]
```

### Database Corruption

```mermaid
flowchart TD
    SW[Stop Writes] --> RB[Restore Backup] --> RM[Replay Migrations] --> VI[Verify Integrity]
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
- Verify Role Definition upload
- Verify capability assessment creation
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

## Related Documents

- [DevOps Architecture](32-devops-architecture.md)
- [Testing Strategy](31-testing-strategy.md)
- [Monitoring & Observability](34-monitoring-observability.md)
- [Security Architecture Deep Dive](35-security-architecture-deep-dive.md)

---

# 16. Conclusion

The deployment architecture prioritizes reliability, repeatability, and simplicity. A Docker-based deployment on Ubuntu with GitHub Actions automation provides a practical production path while remaining manageable for the PWNDORA SkillScan X Team.
