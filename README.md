# AegisIQ

> **Explainable AI for Cybersecurity Talent Intelligence**

[![Status](https://img.shields.io/badge/Status-Development-blue)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL-3b82f6)]()
[![AI](https://img.shields.io/badge/AI-Orchestrated%20LLM%20Pipeline-8b5cf6)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)]()

---

AegisIQ is an AI-powered cybersecurity assessment platform that transforms traditional technical interviews into structured, competency-driven assessments using explainable artificial intelligence.

Unlike conventional interview platforms that primarily evaluate final answers, AegisIQ analyzes **how** candidates reason through cybersecurity scenarios, generating transparent evaluations, evidence-backed reports, and personalized learning roadmaps.

---

## Table of Contents

- [Introduction](#introduction)
- [Problem & Solution](#problem--solution)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [AI Pipeline](#ai-pipeline)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Roles & Responsibilities](#roles--responsibilities)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## Introduction

### Vision

To build the world's most trusted explainable cybersecurity talent intelligence platform by combining AI, competency modeling, and deterministic engineering.

### Mission

Empower organizations to identify and develop cybersecurity talent through transparent, competency-driven assessments that respect candidate experience and produce actionable intelligence.

---

## Problem & Solution

### Problem

Cybersecurity hiring today suffers from:

| Challenge | Impact |
|---|---|
| Subjective interviews | Inconsistent hiring decisions |
| Resume-driven screening | Misses practical capability |
| Limited technical evidence | No defensible audit trail |
| Poor candidate feedback | Lost learning opportunity |
| No learning recommendations | Skills gaps persist |

Organizations struggle to determine whether a candidate truly understands cybersecurity or has simply memorized interview questions.

### Why AegisIQ?

- **Explainable by default** — every score traces to evidence
- **Competency-driven** — maps to real cybersecurity capabilities
- **Adaptive** — adjusts difficulty to candidate skill level
- **Actionable** — generates learning roadmaps from gaps

### Solution

```mermaid
flowchart TD
    JD["Job Description"] --> RBE["Role Blueprint Engine"]
    RBE --> AB["Assessment Blueprint"]
    AB --> MG["Mission Generation"]
    MG --> CA["Candidate Assessment"]
    CA --> CRE["Cyber Reasoning Engine"]
    CRE --> EE["Explainability Engine"]
    EE --> LE["Learning Engine"]
    LE --> AR["Assessment Report"]

    style JD fill:#1e3a5f,color:#fff
    style AR fill:#1e3a5f,color:#fff
    style RBE fill:#2d5a87,color:#fff
    style CRE fill:#2d5a87,color:#fff
    style EE fill:#2d5a87,color:#fff
    style LE fill:#2d5a87,color:#fff
```

Every decision produced by the platform is traceable and explainable.

---

## Core Features

### JD Intelligence Engine
Parse PDF / DOCX / TXT job descriptions and extract skills, responsibilities, competencies, and difficulty estimates.

### Role Blueprint Engine
Transform unstructured job descriptions into structured cybersecurity competency graphs with knowledge areas, assessment objectives, and rubric references.

### Assessment Engine
Coordinate the complete assessment lifecycle — planning, session management, adaptive difficulty, mission orchestration, progress tracking, and recovery.

### Mission Generation Engine
Generate realistic cybersecurity scenarios across multiple domains:

| Mission Type | Focus Area |
|---|---|
| SOC Investigation | Detection & triage |
| Incident Response | Containment & recovery |
| Threat Hunting | Proactive detection |
| Malware Analysis | Reverse engineering |
| Cloud Security | Cloud infrastructure defense |
| Network Security | Network defense |
| DFIR | Digital forensics |
| Identity Security | IAM & access control |

### Cyber Reasoning Engine
Evaluate candidate reasoning through technical workflow analysis, decision quality, risk awareness, competency coverage, and MITRE ATT&CK alignment.

### Explainability Engine
Produce evidence-backed score rationale, confidence estimates, and improvement recommendations — every score is supported by evidence.

### Learning Engine
Generate personalized learning roadmaps mapped directly to competency gaps identified during assessment.

### Voice Interview
Capture and process spoken responses with automatic transcription and concept extraction.

### Cyber Readiness Dashboard
Visualize competency coverage, strengths, weaknesses, and progress over time.

### Recruiter Dashboard
Compare candidates across competencies, review evidence, and export reports.

---

## System Architecture

### Complete System Flow

```mermaid
flowchart LR
    subgraph Frontend["Frontend"]
        React["React UI"]
    end
    subgraph Gateway["API Gateway"]
        FA["FastAPI"]
    end
    subgraph Services["Application Services"]
        AUTH["Auth"]
        JD["JD Intelligence"]
        RB["Role Blueprint"]
        AE["Assessment Engine"]
        RR["Reporting"]
    end
    subgraph AI["AI Layer"]
        ORCH["AI Orchestrator"]
        MGEN["Mission Generator"]
        CRE2["Cyber Reasoning"]
        EXPL["Explainability"]
        LEARN["Learning"]
    end
    subgraph Data["Data Layer"]
        PG[("PostgreSQL")]
    end

    React -->|"HTTPS/REST"| FA
    FA --> AUTH
    FA --> JD
    FA --> RB
    FA --> AE
    FA --> RR
    JD --> ORCH
    RB --> ORCH
    AE --> ORCH
    ORCH --> MGEN
    ORCH --> CRE2
    ORCH --> EXPL
    ORCH --> LEARN
    MGEN --> PG
    CRE2 --> PG
    EXPL --> PG
    LEARN --> PG
    AUTH --> PG
    RR --> PG
```

### High-Level Architecture

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        B["Browser"]
    end
    subgraph Presentation["Presentation Layer"]
        R["React SPA"]
    end
    subgraph API["API Layer"]
        NG["Nginx"]
        FAST["FastAPI"]
    end
    subgraph App["Application Layer"]
        MD["Auth Module"]
        MD2["JD Module"]
        MD3["Assessment Module"]
        MD4["Reports Module"]
    end
    subgraph AI["AI Orchestration Layer"]
        AIO["AI Orchestrator"]
        PM["Prompt Manager"]
        SC["Schema Validator"]
        PV["Provider Abstraction"]
    end
    subgraph Storage["Persistence Layer"]
        PG[("PostgreSQL")]
    end

    B --> R
    R -->|HTTPS| NG
    NG --> FAST
    FAST --> MD
    FAST --> MD2
    FAST --> MD3
    FAST --> MD4
    MD2 --> AIO
    MD3 --> AIO
    AIO --> PM
    PM --> SC
    SC --> PV
    PV -->|"LLM API"| EXT["External LLM"]
    MD --> PG
    MD2 --> PG
    MD3 --> PG
    MD4 --> PG
```

### Backend Architecture

```mermaid
flowchart TD
    subgraph API["API Layer"]
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
    subgraph Modules["Module Layer"]
        direction TB
        AUTH["auth/"]
        USR["users/"]
        JD["jd/"]
        RB["role_blueprint/"]
        ASM["assessment/"]
        MIS["missions/"]
        REA["reasoning/"]
        EXP["explainability/"]
        LRN["learning/"]
        REP["reports/"]
        ANL["analytics/"]
    end
    subgraph AI["AI Layer"]
        ORC["orchestrator/"]
        PRO["prompts/"]
        SCH["schemas/"]
        VAL["validators/"]
        PRV["providers/"]
    end
    subgraph DB["Database Layer"]
        MOD["models/"]
        MIG["migrations/"]
        SES["session.py"]
    end

    R --> Modules
    MW --> R
    Core --> Modules
    Modules --> AI
    ASM --> ORC
    JD --> ORC
    REA --> ORC
    Modules --> DB
```

### Frontend Architecture

```mermaid
flowchart TD
    subgraph Pages["Pages"]
        LP["Landing"]
        LG["Login"]
        RG["Register"]
        DB["Dashboard"]
        JD["Job Description"]
        RB["Role Blueprint"]
        AS["Assessment"]
        RP["Reports"]
        LN["Learning"]
        ST["Settings"]
    end
    subgraph Features["Feature Modules"]
        FA["auth/"]
        FD["dashboard/"]
        FJ["job-description/"]
        FR["role-blueprint/"]
        FAS["assessment/"]
        FM["missions/"]
        FRP["reports/"]
        FL["learning/"]
    end
    subgraph Shared["Shared Layer"]
        UI["ui/ (Button, Card, Modal...)"]
        CH["charts/ (RadarChart...)"]
        FM2["forms/"]
        FB["feedback/ (ErrorBoundary, Toast)"]
    end
    subgraph Services["Service Layer"]
        HO["hooks/"]
        API["services/ (Axios)"]
    end
    subgraph State["State Management"]
        TQ["TanStack Query"]
        ZH["Zustand"]
        RHF["React Hook Form"]
    end

    Pages --> Features
    Pages --> Shared
    Features --> Shared
    Features --> HO
    Features --> API
    HO --> TQ
    HO --> ZH
    API -->|HTTP| FAST["FastAPI Backend"]
```

### AI Architecture

```mermaid
flowchart TD
    subgraph Input["Input"]
        JD["Job Description"]
        CR["Candidate Response"]
    end
    subgraph Engines["AI Engines"]
        RBE["Role Blueprint Engine"]
        AP["Assessment Planner"]
        MG["Mission Generator"]
        CRE["Cyber Reasoning Engine"]
        EE["Explainability Engine"]
        LE["Learning Engine"]
    end
    subgraph Orchestrator["AI Orchestrator"]
        PM["Prompt Builder"]
        SC["Schema Validator"]
        CL["LLM Client"]
        RT["Retry Logic"]
    end
    subgraph Output["Output"]
        BP["Blueprint"]
        APO["Assessment Plan"]
        MSO["Mission Package"]
        EV["Evaluation"]
        EX["Explanation"]
        LR["Learning Roadmap"]
    end

    JD --> RBE
    RBE --> AP
    AP --> MG
    CR --> CRE
    CRE --> EE
    EE --> LE
    RBE --> Orchestrator
    AP --> Orchestrator
    MG --> Orchestrator
    CRE --> Orchestrator
    EE --> Orchestrator
    LE --> Orchestrator
    Orchestrator --> BP
    Orchestrator --> APO
    Orchestrator --> MSO
    Orchestrator --> EV
    Orchestrator --> EX
    Orchestrator --> LR
```

### Database Architecture

```mermaid
erDiagram
    User ||--o{ Assessment : "undergoes"
    User ||--o{ JobDescription : "uploads"
    JobDescription ||--|| RoleBlueprint : "generates"
    RoleBlueprint ||--o{ Assessment : "defines"
    Assessment ||--o{ Mission : "contains"
    Assessment ||--|| Report : "produces"
    Mission ||--o{ Response : "elicits"
    Response ||--|| Evaluation : "receives"
    Evaluation ||--|| Evidence : "produces"
    Evaluation ||--o{ LearningPath : "generates"

    User {
        uuid id PK
        string email
        string role "admin | recruiter | candidate"
        datetime created_at
    }

    JobDescription {
        uuid id PK
        text raw_content
        string source_type "pdf | docx | txt"
        datetime uploaded_at
    }

    RoleBlueprint {
        uuid id PK
        jsonb competencies
        jsonb knowledge_areas
        jsonb responsibilities
        string difficulty
        int version
    }

    Assessment {
        uuid id PK
        string status "planned | active | completed | failed"
        int duration_minutes
        jsonb blueprint
        datetime started_at
        datetime completed_at
    }

    Mission {
        uuid id PK
        string type "soc | ir | threat_hunting | ..."
        jsonb scenario
        jsonb rubric
        int order
    }

    Response {
        uuid id PK
        text transcript
        jsonb concepts
        datetime submitted_at
    }

    Evaluation {
        uuid id PK
        jsonb scores
        jsonb mitre_mapping
        float confidence
    }

    Evidence {
        uuid id PK
        string type "strength | weakness | gap"
        text description
        jsonb references
    }

    Report {
        uuid id PK
        jsonb content
        string format "json | pdf"
        datetime generated_at
    }

    LearningPath {
        uuid id PK
        jsonb recommendations
        jsonb resources
    }
```

### Deployment Architecture

```mermaid
flowchart TD
    subgraph Prod["Production Environment"]
        subgraph FE["Frontend"]
            VITE["Vite Build"]
            STATIC["Static Assets"]
        end
        subgraph Proxy["Reverse Proxy"]
            NG["Nginx"]
            SSL["SSL Termination"]
        end
        subgraph BE["Backend"]
            UVI["Uvicorn"]
            FAST["FastAPI App"]
        end
        subgraph AI["AI Layer"]
            LLM["LLM Provider"]
        end
        subgraph DB["Database"]
            PG[("PostgreSQL")]
        end
    end

    USER["User Browser"] -->|HTTPS :443| NG
    NG -->|"/"| VITE
    NG -->|"/api/*"| UVI
    UVI --> FAST
    FAST -->|"prompts"| LLM
    FAST --> PG
```

---

## AI Pipeline

```mermaid
flowchart LR
    JD["Job Description"] --> RBE["Role Blueprint\nEngine"]
    RBE --> AP["Assessment\nPlanner"]
    AP --> MG["Mission\nGenerator"]
    MG --> CR["Candidate\nResponse"]
    CR --> CRE["Cyber\nReasoning"]
    CRE --> EE["Explainability\nEngine"]
    EE --> LE["Learning\nEngine"]
    LE --> REPO["Report\nGenerator"]

    style JD fill:#1e3a5f,color:#fff
    style MG fill:#2d5a87,color:#fff
    style CRE fill:#2d5a87,color:#fff
    style EE fill:#2d5a87,color:#fff
    style LE fill:#2d5a87,color:#fff
    style REPO fill:#1e3a5f,color:#fff
```

### Adaptive Assessment Workflow

```mermaid
flowchart TD
    START(["Start Assessment"]) --> PLAN["Load Assessment Blueprint"]
    PLAN --> M1["Present Mission 1"]
    M1 --> R1["Candidate Responds"]
    R1 --> E1["Evaluate Response"]
    E1 --> ADJ{"Adjust Difficulty?"}
    ADJ -->|"Low Score"| EASY["Easier Mission"]
    ADJ -->|"High Score"| HARD["Harder Mission"]
    ADJ -->|"Adequate"| NORM["Same Difficulty"]
    EASY --> M2["Present Mission 2"]
    HARD --> M2
    NORM --> M2
    M2 --> R2["Next Response..."]
    R2 --> E2["Evaluate"]
    E2 --> DONE{"All Missions\nComplete?"}
    DONE -->|"Yes"| FINAL["Generate Final Report"]
    DONE -->|"No"| M2
    FINAL --> END(["Assessment Complete"])
```

### Explainability Model

```mermaid
flowchart TD
    EVAL["Evaluation Data\n(Scores, Concepts, Map)"] --> EB["Evidence Builder"]
    EB --> ID["Identify Strengths"]
    EB --> ID2["Identify Weaknesses"]
    EB --> ID3["Identify Gaps"]
    ID --> OBS["Observations"]
    ID2 --> OBS
    ID3 --> OBS
    OBS --> CONF["Confidence Estimator"]
    OBS --> REC["Recommendation Engine"]
    REC --> LR["Learning Recommendations"]
    CONF --> EXP["Final Explanation\n(Score + Evidence + Confidence)"]
    LR --> EXP
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| React Router | Routing |
| TanStack Query | Server state |
| React Hook Form | Form management |
| Recharts | Data visualization |
| Lucide React | Icons |
| Axios | HTTP client |
| Zustand | Minimal global state |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Web framework |
| Python 3.12+ | Runtime |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| Pydantic | Validation & schemas |
| Uvicorn | ASGI server |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL | Primary database |

### AI
| Technology | Purpose |
|---|---|
| LLM Provider Abstraction | Multi-provider support |
| Structured JSON Outputs | Deterministic parsing |
| Prompt Orchestration | Specialized prompt chains |
| Schema Validation | Output contract enforcement |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| Nginx | Reverse proxy |
| GitHub Actions | CI/CD |

### Security
| Technology | Purpose |
|---|---|
| JWT | Authentication |
| RBAC | Authorization |
| CORS | Cross-origin controls |
| Rate Limiting | Abuse prevention |
| Input Validation | Injection prevention |

### Monitoring
| Technology | Purpose |
|---|---|
| Structured Logging | Observability |
| Health Checks | Availability |
| Audit Logging | Compliance |

### Testing
| Type | Tool/Approach |
|---|---|
| Unit | Pytest (backend), Vitest (frontend) |
| Integration | Pytest + TestClient |
| API | FastAPI TestClient |
| E2E | Playwright |
| AI Contract | Schema validation |

### Development Tools
| Tool | Purpose |
|---|---|
| Ruff | Python linting |
| Pre-commit | Git hooks |
| EditorConfig | Editor consistency |

---

## Project Modules

### Frontend Modules

```
frontend/
├── app/              App entry, providers, router
├── routes/           Route definitions
├── layouts/          Shared layouts (Auth, Dashboard)
├── features/         Feature modules
│   ├── auth/         Login, register, password reset
│   ├── dashboard/    Main dashboard, stats
│   ├── job-description/  JD upload & analysis
│   ├── role-blueprint/   Blueprint review
│   ├── assessment/   Assessment session
│   ├── reports/      Report viewing & export
│   ├── learning/     Learning roadmap
│   └── settings/     User settings
├── components/       Shared UI library
│   ├── ui/           Primitives
│   ├── charts/       Visualization components
│   ├── forms/        Reusable form fields
│   └── feedback/     ErrorBoundary, Toast
├── services/         Axios API client
├── hooks/            Shared custom hooks
└── lib/              Utilities & helpers
```

### Backend Modules

```
backend/
├── api/              Router definitions, dependencies, middleware
├── core/             Config, logging, security, exceptions
├── modules/          Domain modules
│   ├── auth/         Authentication & authorization
│   ├── users/        User management
│   ├── jd/           Job description intelligence
│   ├── role_blueprint/  Competency blueprint generation
│   ├── assessment/   Assessment lifecycle
│   ├── missions/     Mission/scenario generation
│   ├── reasoning/    Cyber reasoning & evaluation
│   ├── explainability/  Evidence & explanation
│   ├── learning/     Learning recommendations
│   ├── reports/      Report generation
│   └── analytics/    Analytics aggregation
├── ai/               AI orchestration layer
│   ├── orchestrator/ Workflow coordination
│   ├── prompts/      Prompt templates
│   ├── schemas/      JSON output schemas
│   ├── validators/   Output validation
│   └── providers/    LLM provider abstraction
├── database/         Models, migrations, session
├── workers/          Background tasks
└── tests/            Test suite
```

---

## Team

### Final Team Structure

| Member | Primary Domain | Secondary Domain | Ownership |
|---|---|---|---|
| **Jos** | ⚙️ Backend Architecture | AI Platform | FastAPI, APIs, Database, AI Orchestrator, Session Management |
| **Mithra** | 🎨 Frontend & UI/UX | Frontend Architecture | Next.js, Tailwind, shadcn/ui, Dashboard, Reports, Charts |
| **KC** | 🧠 AI Engineering + Cybersecurity | Prompt Engineering | LLM Logic, Evaluation Engine, Rubrics, MITRE Mapping, Adaptive Questions |
| **AV** | 🔗 AI Integration & System Reliability | Testing & DevOps | AI Provider Layer, Voice, Integration, Deployment, Testing, Performance |

---

### Detailed Responsibilities

#### ⚙️ Jos — Backend Lead

Owns FastAPI, REST APIs, Database, Session Management, AI Orchestrator, Backend Architecture.

**Deliverables:** `/parse-jd`, `/generate-interview`, `/evaluate-answer`, `/generate-report`

**Learns:** FastAPI, Pydantic, Async Python, API Design, Database Design

#### 🎨 Mithra — Frontend Lead

Owns Next.js, Tailwind CSS, shadcn/ui, Dashboard, Landing Page, Interview Screen, Report Screen, Charts, Animations.

**Deliverables:** Beautiful UI, Responsive Layout, Mission Timeline, Skill Radar, Report Dashboard

**Learns:** Next.js, React, Tailwind, shadcn/ui, Recharts, UX Principles

#### 🧠 KC — AI + Cybersecurity Lead

Owns Prompt Engineering, Cybersecurity Knowledge, Evaluation Logic, Rubrics, MITRE Mapping, Question Generation, Follow-up Logic, Learning Roadmap.

**Deliverables:** Prompt Library, Rubric Engine, Explainable Scoring, Adaptive Interview Logic, Cyber Readiness Report

**Learns:** Prompt Engineering, LLM Evaluation, SOC Workflow, MITRE ATT&CK, Incident Response, Threat Hunting

#### 🔗 AV — AI Integration & Reliability Lead

Owns AI Provider Layer, Mistral Integration, Ollama Fallback, Web Speech API, Deployment, Integration Testing, Prompt Optimization, Monitoring.

**Deliverables:** AI Wrapper, Voice Module, Deployment Pipeline, End-to-End Testing, Failover Logic

**Learns:** AI Infrastructure, FastAPI Integration, Deployment, Performance Optimization, Testing

---

### Ownership Matrix

| Module | Owner | Reviewer |
|---|---|---|
| Backend APIs | Jos | AV |
| Database | Jos | AV |
| AI Orchestrator | Jos | KC |
| Frontend UI | Mithra | KC |
| Dashboard | Mithra | AV |
| Voice | AV | Mithra |
| AI Provider Layer | AV | Jos |
| Prompt Engineering | KC | AV |
| Cyber Rubrics | KC | Jos |
| Evaluation Engine | KC | Jos |
| Deployment | AV | Jos |
| Testing | Everyone | Everyone |

---

### Platform Roles (RBAC)

| Role | Permissions | Description |
|---|---|---|
| **Admin** | Full system access | Manage users, configure system, view all data |
| **Recruiter** | Create assessments, view reports | Design assessments, evaluate candidates |
| **Candidate** | Take assessments, view own reports | Complete missions, review feedback |
| **Reviewer** | View reports, add notes | Secondary evaluation, quality review |

---

### Daily Workflow

**Morning (15 min)**

- What did I complete?
- What am I building today?
- Any blockers?

**Night (20 min)**

- Merge code
- Test the integrated app
- Fix merge issues
- Plan tomorrow

No one should end the day without pulling the latest code.

### Development Timeline

| Days | Focus | Milestone |
|---|---|---|
| 1–3 | Project setup, frontend skeleton, backend skeleton, AI provider setup, voice prototype | Frontend successfully calls the backend |
| 4–6 | JD parser, question generator, interview UI, prompt library | One complete interview flow works |
| 7–10 | Evaluation engine, explainable scoring, MITRE mapping, voice integration, report generation | End-to-end demo is functional |
| 11–13 | Adaptive follow-up questions, learning roadmap, UI polish, performance improvements | — |
| 14–16 | Bug fixing only, prompt tuning, demo rehearsal, judge Q&A preparation | — |

### Team Rules (Non-Negotiable)

- No one works in isolation for more than one day. **Merge code daily.**
- **No new features after Day 13.**
- Every feature must have **one owner and one reviewer.**
- Everyone must understand the full architecture, not just their own module.
- Every night, the project must be runnable. **Never leave `main` broken.**

### Final Team Mission

> **Jos** builds the foundation.
> **Mithra** builds the experience.
> **KC** builds the intelligence.
> **AV** builds the reliability.

---

## Repository Structure

```
aegisiq/
├── frontend/          React SPA
├── backend/           FastAPI application
├── infrastructure/    Docker, Nginx, deployment
├── docs/              Architecture & design docs
├── scripts/           Automation & utility scripts
├── datasets/          Sample data & benchmarks
├── prompts/           AI prompt templates
├── assets/            Images, logos, static resources
├── presentation/      Slide decks & demo materials
├── .github/           CI/CD workflows & templates
├── docker-compose.yml
├── README.md
└── LICENSE
```

### Documentation Structure

```
docs/
├── 01-product/        Overview, problem, vision, requirements
├── 02-research/       Market analysis, personas, user journey
├── 03-functional-design/  Features, workflows, use cases, UI/UX
├── 04-architecture/   System, AI, backend, frontend, data flow
├── 05-data-api/       Database design, API spec, auth, models
├── 06-ai-engines/     Blueprint, assessment, missions, reasoning, explainability
├── 07-engineering/    Testing, devops, deployment, monitoring, security
└── 08-delivery/       Roadmap, project structure, risk, future vision
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Docker & Docker Compose (optional)
- pnpm (recommended) or npm

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/aegisiq
JWT_SECRET=your-secret-key
LLM_API_KEY=your-api-key
LLM_PROVIDER=openai  # or anthropic, etc.

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
pnpm install
pnpm dev
```

### Running Tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && pnpm test

# E2E
pnpm test:e2e
```

---

## Development

### Git Branch Strategy

```
main           Production-ready code
├── develop    Integration branch
├── feat/*     Feature branches
├── fix/*      Bug fix branches
└── docs/*     Documentation branches
```

### Commit Convention

```
type(scope): description

Types: feat | fix | docs | refactor | test | chore | ai
Scope: frontend | backend | infra | docs | ai
```

### Pull Request Rules

- All PRs target `develop`
- At least one reviewer
- All tests must pass
- No lint errors
- AI changes require schema validation tests

---

## Deployment

### CI/CD Pipeline

```mermaid
flowchart LR
    GIT["Git Push"] --> GH["GitHub Actions"]
    GH --> LINT["Lint & Typecheck"]
    GH --> TEST["Run Tests"]
    GH --> BUILD["Build Images"]
    BUILD --> REG["Container Registry"]
    REG --> DEPLOY["Deploy to Server"]
    DEPLOY --> SMOKE["Smoke Tests"]
    SMOKE --> DONE["Production"]
```

### Production Architecture

```
Browser → Nginx (SSL) → FastAPI (Uvicorn) → PostgreSQL
                           ↓
                      LLM Provider
```

---

## Roadmap

```mermaid
gantt
    title AegisIQ Development Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation
    Project Setup        :done, 2026-07-01, 7d
    Architecture Docs    :done, 2026-07-01, 7d
    section Core Platform
    Auth & Users         :active, 2026-07-08, 14d
    JD Intelligence      :2026-07-15, 14d
    Role Blueprint       :2026-07-22, 14d
    section AI Engines
    Mission Generator    :2026-08-01, 21d
    Cyber Reasoning      :2026-08-15, 21d
    Explainability       :2026-09-01, 14d
    section Assessment
    Assessment Engine    :2026-09-15, 21d
    Frontend UX          :2026-09-22, 21d
    section Reporting
    Report Generator     :2026-10-15, 14d
    Learning Engine      :2026-10-22, 14d
    section Production
    Testing & Polish     :2026-11-01, 21d
    Launch               :2026-11-22, 7d
```

### Phases

| Phase | Focus | Deliverables |
|---|---|---|
| **Phase 1** Foundation | Project setup, docs, CI/CD | Repository, Docker, Architecture |
| **Phase 2** Core Platform | Auth, users, JD intelligence | Auth system, JD parser, Role Blueprint |
| **Phase 3** AI Engines | Mission gen, reasoning, explainability | AI pipeline, evaluation, evidence |
| **Phase 4** Assessment | Assessment lifecycle, frontend | Assessment UX, adaptive flow |
| **Phase 5** Reporting | Reports, learning, dashboards | PDF reports, learning roadmaps |
| **Phase 6** Production | Testing, security, launch | Production deployment |

### Future Vision

- Enterprise multi-tenancy
- Cyber range integration
- Competency knowledge graphs
- Organization-specific assessment libraries
- Public APIs & SDK
- Workforce analytics
- AI agent collaboration
- NICE Workforce Framework alignment

---

## Security

| Control | Implementation |
|---|---|
| Authentication | JWT with refresh tokens |
| Authorization | RBAC (Admin, Recruiter, Candidate, Reviewer) |
| Prompt Injection | Input sanitization, output validation |
| SQL Injection | ORM parameterized queries |
| AI Validation | Structured JSON schemas, confidence thresholds |
| Audit Logging | All assessment actions logged |
| Rate Limiting | Per-endpoint rate limits |
| Secrets Management | Environment variables, never in code |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Commit with conventional commits
4. Open a pull request against `develop`
5. Ensure all tests pass

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is released under the MIT License.

---

## Acknowledgements

Built using modern software engineering principles, explainable artificial intelligence, and cybersecurity competency modeling.

---

## Philosophy

> Every assessment should be explainable.
>
> Every score should have evidence.
>
> Every recommendation should be actionable.
>
> Every architectural decision should favor correctness, maintainability, and transparency over unnecessary complexity.
