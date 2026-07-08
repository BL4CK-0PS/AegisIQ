# DevOps Architecture

## Table of Contents

1. Executive Summary
2. DevOps Philosophy
3. Development Workflow
4. Branching Strategy
5. CI/CD Pipeline
6. Build Process
7. Container Architecture
8. Environment Management
9. Secrets Management
10. Infrastructure Layout
11. Release Strategy
12. Rollback Strategy
13. Quality Gates
14. Toolchain
15. Future Evolution
16. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines the DevOps architecture for PWNDORA SkillScan X.

It covers:

- Source control
- CI/CD
- Docker
- Environment configuration
- Secrets
- Deployment workflow
- Release management

---

# 2. DevOps Philosophy

Every change follows:

```mermaid
flowchart TD
    D[Develop] --> C[Commit] --> T[Test] --> B[Build] --> DEP[Deploy] --> M[Monitor]
```

Automation replaces manual deployment wherever possible.

---

# 3. Development Workflow

```mermaid
flowchart TD
    I[Issue] --> FB[Feature Branch] --> DEV[Development]
    DEV --> PR[Pull Request] --> R[Review] --> M[Merge] --> DEP[Deploy]
```

No direct commits to `main`.

---

# 4. Branching Strategy

Recommended Git branches:

```
main
develop
feature/*
fix/*
release/*
```

Rules:

| Branch    | Purpose               |
| --------- | --------------------- |
| main      | Production-ready code |
| develop   | Integration branch    |
| feature/* | New features          |
| fix/*     | Bug fixes             |
| release/* | Release stabilization |

---

# 5. CI/CD Pipeline

```mermaid
flowchart TD
    GP[Git Push] --> GA[GitHub Actions] --> L[Lint] --> TC[Type Check]
    TC --> UT[Unit Tests] --> IT[Integration Tests] --> DB[Docker Build] --> DEP[Deploy]
```

Every stage must succeed before deployment.

---

# 6. Build Process

Frontend:

```mermaid
flowchart TD
    I[Install] --> TC[Type Check] --> B[Build] --> BU[Bundle]
```

Backend:

```mermaid
flowchart TD
    I[Install] --> L[Lint] --> T[Tests] --> P[Package]
```

Artifacts:

- Frontend bundle
- Backend container
- Migration scripts

---

# 7. Container Architecture

```mermaid
graph TD
    subgraph DockerCompose[Docker Compose]
        FE[frontend]
        BE[backend]
        PG[postgres]
        NX[nginx]
    end
```

Future:

```mermaid
flowchart TD
    IN[Ingress] --> FE[Frontend] --> BE[Backend]
    BE --> AW[AI Worker] --> DB[Database]
```

One service per container.

---

# 8. Environment Management

Environments:

| Environment | Purpose                |
| ----------- | ---------------------- |
| local       | Developer workstation  |
| dev         | Shared integration     |
| staging     | Pre-release validation |
| production  | Live deployment        |

Configuration is environment-specific, never code-specific.

---

# 9. Secrets Management

Store securely:

- Database URL
- JWT secret
- API keys
- LLM credentials
- SMTP credentials (future)

Rules:

- Never commit secrets.
- Use environment variables.
- Rotate credentials regularly.
- Different secrets per environment.

---

# 10. Infrastructure Layout

```mermaid
flowchart TD
    DEV[Developer] --> GH[GitHub] --> GHA[GitHub Actions]
    GHA --> CR[Container Registry] --> DS[Deployment Server]
    DS --> D[Docker] --> SYS[PWNDORA SkillScan X]
```

For the MVP, a single deployment host is sufficient.

---

# 11. Release Strategy

Release flow:

```mermaid
flowchart TD
    FC[Feature Complete] --> RB[Release Branch] --> RT[Regression Tests]
    RT --> TR[Tag Release] --> DEP[Deploy]
```

Versioning:

```
v1.0.0
v1.1.0
v2.0.0
```

Follow Semantic Versioning.

---

# 12. Rollback Strategy

```mermaid
flowchart TD
    DEP[Deploy] --> HC[Health Check] --> F{Failure?}
    F -->|Yes| RPI[Rollback Previous Image] --> RS[Restore Service]
    F -->|No| OK[OK]
```

Keep the previous deployment artifact available until the new release is verified.

---

# 13. Quality Gates

Deployment is blocked if:

- Lint fails
- Tests fail
- Build fails
- Security scan fails
- Docker image fails to build
- Required approvals are missing

---

# 14. Toolchain

| Area            | Tool                                 |
| --------------- | ------------------------------------ |
| Version Control | Git                                  |
| Repository      | GitHub                               |
| CI/CD           | GitHub Actions                       |
| Containers      | Docker                               |
| Reverse Proxy   | Nginx                                |
| Database        | PostgreSQL                           |
| Backend         | FastAPI                              |
| Frontend        | React + Vite                         |
| Package Manager | pnpm (frontend), uv or pip (backend) |

---

# 15. Future Evolution

Potential additions:

- Kubernetes
- Argo CD
- Terraform
- Vault
- Redis
- Object storage
- Multi-region deployment
- Blue/Green deployments
- Canary releases

Only introduce these when they solve a real operational problem.

## Related Documents

- [Testing Strategy](31-testing-strategy.md)
- [Deployment Guide](33-deployment-guide.md)
- [Monitoring & Observability](34-monitoring-observability.md)
- [CI/CD Pipeline](../docs/07-engineering/34-ci-cd-pipeline.md)

---

# 16. Conclusion

The DevOps architecture emphasizes automation, reproducibility, and reliability while remaining appropriately simple for the PWNDORA SkillScan X Team. A modular deployment pipeline with automated testing and containerized services provides a strong foundation for both the hackathon MVP and future production growth.
