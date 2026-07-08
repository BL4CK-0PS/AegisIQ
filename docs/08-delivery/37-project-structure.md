# Project Structure

## Table of Contents

1. Executive Summary
2. Repository Philosophy
3. Monorepo Overview
4. Root Structure
5. Frontend Structure
6. Backend Structure
7. AI Structure
8. Infrastructure Structure
9. Documentation Structure
10. Testing Structure
11. Scripts
12. Configuration
13. Naming Conventions
14. Repository Standards
15. Future Expansion
16. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines the official repository structure of AegisIQ.

Goals:

- High maintainability
- Clear ownership
- Modular development
- Predictable organization
- Easy onboarding

---

# 2. Repository Philosophy

Every directory should answer one question:

> **What business capability does this contain?**

Repository principles:

```
Simple
    ↓
Modular
    ↓
Predictable
    ↓
Discoverable
    ↓
Scalable
```

---

# 3. Monorepo Overview

AegisIQ uses a monorepo.

```
aegisiq/
├── frontend/
├── backend/
├── infrastructure/
├── docs/
├── scripts/
└── .github/
```

One repository. Multiple independently deployable components.

---

# 4. Root Structure

```
aegisiq/
├── backend/
├── frontend/
├── infrastructure/
├── docs/
├── scripts/
├── assets/
├── .github/
├── docker-compose.yml
├── README.md
├── LICENSE
└── .gitignore
```

Root should remain minimal.

---

# 5. Frontend Structure

```
frontend/
src/
├── app/
├── routes/
├── layouts/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── job-description/
│   ├── role-blueprint/
│   ├── assessment/
│   ├── reports/
│   ├── learning/
│   └── settings/
├── components/
│   ├── ui/
│   ├── charts/
│   ├── forms/
│   └── feedback/
├── services/
├── hooks/
├── lib/
├── assets/
├── styles/
└── types/
```

Every feature owns its UI.

---

# 6. Backend Structure

```
backend/
app/
├── api/
├── core/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── jd/
│   ├── role_blueprint/
│   ├── assessment/
│   ├── missions/
│   ├── reasoning/
│   ├── explainability/
│   ├── learning/
│   ├── reports/
│   └── analytics/
├── ai/
├── database/
├── middleware/
├── workers/
├── tests/
└── main.py
```

Each module owns:

- entities
- services
- repositories
- DTOs
- routes
- tests

---

# 7. AI Structure

```
backend/app/ai/
├── orchestrator/
├── prompts/
├── schemas/
├── validators/
├── providers/
├── pipelines/
├── evaluators/
├── embeddings/
└── utils/
```

Responsibilities:

| Directory    | Purpose                  |
| ------------ | ------------------------ |
| orchestrator | AI workflow coordination |
| prompts      | Prompt templates         |
| schemas      | Structured JSON schemas  |
| validators   | AI output validation     |
| providers    | LLM provider abstraction |
| pipelines    | AI processing pipelines  |
| evaluators   | Evaluation logic         |
| embeddings   | Embedding utilities      |

---

# 8. Infrastructure Structure

```
infrastructure/
├── docker/
├── nginx/
├── postgres/
├── monitoring/
├── deployment/
└── backups/
```

Contents:

- Dockerfiles
- Nginx configuration
- SQL initialization
- Deployment scripts
- Monitoring configuration

---

# 9. Documentation Structure

```
docs/
├── architecture/
├── api/
├── database/
├── deployment/
├── security/
├── ai/
├── testing/
├── diagrams/
└── assets/
```

Store all architecture documents here.

---

# 10. Testing Structure

Backend:

```
tests/
├── unit/
├── integration/
├── api/
├── ai/
└── fixtures/
```

Frontend:

```
tests/
├── components/
├── features/
├── e2e/
└── fixtures/
```

Test code should mirror production code structure.

---

# 11. Scripts

```
scripts/
├── setup.sh
├── dev.sh
├── build.sh
├── deploy.sh
├── backup.sh
├── restore.sh
├── seed.py
└── reset_db.py
```

Scripts should automate repetitive development tasks.

---

# 12. Configuration

Configuration files:

```
.env.example
.editorconfig
.pre-commit-config.yaml
ruff.toml
pyproject.toml
package.json
pnpm-workspace.yaml
docker-compose.yml
```

Keep configuration version-controlled, excluding secrets.

---

# 13. Naming Conventions

Guidelines:

| Item                  | Convention       |
| --------------------- | ---------------- |
| Python modules        | snake_case       |
| React components      | PascalCase       |
| API routes            | kebab-case       |
| Database tables       | snake_case       |
| Environment variables | UPPER_SNAKE_CASE |
| Docker images         | lowercase        |

Consistency is more valuable than personal preference.

---

# 14. Repository Standards

Rules:

- One responsibility per module.
- No circular dependencies.
- Feature-first organization.
- Keep README files up to date.
- Document public interfaces.
- Every new feature includes tests.
- Every module has an owner.

---

# 15. Future Expansion

Potential additions:

```
mobile/
sdk/
terraform/
benchmarks/
plugins/
datasets/
examples/
cli/
```

These should integrate without restructuring existing modules.

---

# 16. Conclusion

The AegisIQ repository is organized around business capabilities rather than technologies. This structure minimizes coupling, improves discoverability, and enables multiple developers to work concurrently with clear ownership boundaries.
