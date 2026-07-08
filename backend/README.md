# PWNDORA SkillScan X — Backend

> FastAPI-powered modular monolith for adaptive cybersecurity capability intelligence.

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql)](https://postgresql.org)

---

## Architecture

```mermaid
flowchart TD
    subgraph API["API Gateway Layer"]
        R["/api/v1/routers"]
        MW["Middleware"]
        DEP["Dependencies"]
    end
    subgraph Core["Core Layer"]
        CFG["Config"]
        LOG["Logging"]
        SEC["Security"]
        EXC["Exceptions"]
    end
    subgraph Modules["Domain Modules"]
        AUTH["auth/"]
        USR["users/"]
        JD["jd/"]
        SD["skill_dna/"]
        CA["capability_assessment/"]
        PC["practical_challenges/"]
        CR["capability_reasoning/"]
        EI["evidence_intelligence/"]
        LP["learning_path/"]
        REP["reports/"]
        ANL["analytics/"]
        CT["cyber_twin/"]
        CCP["career_compass/"]
    end
    subgraph AI["AI Decision Engine"]
        ORC["orchestrator/"]
        PRO["prompts/"]
        SCH["schemas/"]
        VAL["validators/"]
        PRV["providers/"]
    end
    subgraph DB["Data Platform"]
        MOD["models/"]
        MIG["migrations/"]
        SES["session.py"]
        PG[("PostgreSQL")]
    end

    R --> Modules
    MW --> R
    Core --> Modules
    Modules --> AI
    Modules --> DB
    DB --> PG
```

### Layered Architecture

```
Presentation Layer  →  API Routers
    ↓
Application Layer  →  Service Layer
    ↓
Domain Layer       →  Business Logic, Entities
    ↓
Repository Layer   →  Data Access
    ↓
Database Layer     →  PostgreSQL
```

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | FastAPI |
| Language | Python 3.12+ |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Server | Uvicorn |
| Auth | JWT (python-jose) |
| Testing | Pytest, httpx |

---

## Module Structure

```
backend/
├── app/
│   ├── api/              Router definitions, dependencies, middleware
│   │   ├── routers/      Module routers
│   │   ├── dependencies/ Auth, DB session, permissions
│   │   └── middleware/   CORS, rate limiting, logging
│   ├── core/             Cross-cutting concerns
│   │   ├── config.py     App configuration
│   │   ├── logging.py    Structured logging
│   │   ├── security.py   Password hashing, JWT
│   │   └── exceptions.py Custom exception hierarchy
│   ├── modules/          Domain modules (one per bounded context)
│   │   ├── auth/         Authentication & authorization
│   │   ├── users/        User management
│   │   ├── jd/           Job description intelligence
│   │   ├── skill_dna/    Skill DNA profile generation
│   │   ├── capability_assessment/  Assessment lifecycle
│   │   ├── practical_challenges/   Challenge/scenario generation
│   │   ├── capability_reasoning/   Capability reasoning evaluation
│   │   ├── evidence_intelligence/  Evidence generation
│   │   ├── learning_path/          Learning recommendations
│   │   ├── cyber_twin/   Cyber Twin management
│   │   ├── career_compass/  Career progression engine
│   │   ├── reports/      Report generation
│   │   └── analytics/    Analytics aggregation
│   ├── ai/               AI orchestration layer
│   │   ├── orchestrator/ Prompt orchestration, workflow
│   │   ├── prompts/      Prompt templates
│   │   ├── schemas/      Structured JSON schemas
│   │   ├── validators/   Output validation
│   │   └── providers/    LLM provider abstraction
│   ├── database/         Data access
│   │   ├── models/       SQLAlchemy models
│   │   ├── migrations/   Alembic migrations
│   │   └── session.py    Database sessions
│   ├── workers/          Background tasks
│   └── main.py           Application entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── api/
│   ├── ai/
│   └── fixtures/
└── requirements.txt
```

Each module owns its own:
- **Router** — API endpoints
- **Service** — Business logic
- **Repository** — Data access
- **Models** — SQLAlchemy entities
- **Schemas** — Pydantic DTOs
- **Tests** — Module-level tests

---

## API Endpoints

| Prefix | Module | Description |
|---|---|---|
| `/api/v1/auth` | auth | Login, register, refresh, logout |
| `/api/v1/users` | users | Profile, CRUD, roles |
| `/api/v1/jd` | jd | Upload, parse, analyze |
| `/api/v1/skill-dna` | skill_dna | CRUD, versioning, profile |
| `/api/v1/assessments` | capability_assessment | Lifecycle, sessions |
| `/api/v1/challenges` | practical_challenges | Generate, serve scenarios |
| `/api/v1/reasoning` | capability_reasoning | Evaluate responses |
| `/api/v1/reports` | reports | Generate, export |
| `/api/v1/learning` | learning_path | Roadmaps, AI Mentor |
| `/api/v1/cyber-twin` | cyber_twin | Profile, updates, queries |
| `/api/v1/career-compass` | career_compass | Career paths, heatmap |
| `/api/v1/analytics` | analytics | Aggregated data |

---

## Data Flow

```mermaid
flowchart LR
    FE["Frontend"] -->|"HTTP Request"| R["API Router"]
    R -->|"Validate"| S["Service Layer"]
    S -->|"Business Logic"| REPO["Repository"]
    S -->|"AI Task"| AIO["AI Orchestrator"]
    AIO -->|"Prompt"| LLM["LLM Provider"]
    AIO -->|"Validate"| SCH["Schema Validator"]
    REPO -->|"Query"| DB[("PostgreSQL")]
    S -->|"Response"| R
    R -->|"JSON"| FE
```

---

## Getting Started

```bash
# Clone and enter backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

### Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/skillscanx
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
LLM_API_KEY=your-api-key
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=INFO
```

### Testing

```bash
# Run all tests
pytest

# With coverage
pytest --cov=app --cov-report=term-missing

# Specific module
pytest tests/unit/test_capability_assessment.py
```

---

## Design Principles

- **Domain-Driven Design** — Modules mirror business capabilities
- **Modular Monolith** — Clear boundaries, future microservice extraction
- **API-First** — Every feature starts with its API contract
- **Immutable History** — Assessments are versioned, never overwritten
- **Explainable AI** — All AI outputs are validated and traceable
- **Defense in Depth** — Security at every layer

---

## Module Dependency Rules

```
Router → Service → Repository → Database
                      ↓
                 AI Orchestrator
```

- Dependencies point downward only
- Modules communicate through services, never directly
- AI layer is isolated behind the orchestrator
- No circular dependencies between modules
