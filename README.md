# PWNDORA SkillScan X

> **Adaptive Cybersecurity Capability Intelligence Platform**

[![Status](https://img.shields.io/badge/Status-Development-blue)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL-3b82f6)]()
[![AI](https://img.shields.io/badge/AI-Orchestrated%20LLM%20Pipeline-8b5cf6)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)]()

---

PWNDORA SkillScan X is an AI-powered cybersecurity capability intelligence platform that transforms how organizations evaluate, develop, and deploy cybersecurity talent using adaptive artificial intelligence.

We do not assess resumes. We assess cybersecurity capability.

Unlike traditional screening tools that evaluate credentials and final answers, SkillScan X analyzes **how** professionals reason through cybersecurity challenges, generating transparent evaluations, evidence-backed reports, and personalized capability development roadmaps.

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

To build the world's most trusted adaptive cybersecurity capability intelligence platform by combining AI, competency modeling, and deterministic engineering.

### Mission

Empower organizations to identify and develop cybersecurity professionals through transparent, competency-driven capability intelligence that respects professional experience and produces actionable insights.

---

## Problem & Solution

### Problem

Cybersecurity hiring today suffers from:

| Challenge | Impact |
|---|---|
| Subjective evaluations | Inconsistent hiring decisions |
| Resume-driven screening | Misses practical capability |
| Limited technical evidence | No defensible audit trail |
| Poor professional feedback | Lost development opportunity |
| No learning recommendations | Skills gaps persist |

Organizations struggle to determine whether a professional truly understands cybersecurity or has simply memorized interview questions.

### Why PWNDORA SkillScan X?

- **Explainable by default** — every score traces to evidence
- **Competency-driven** — maps to real cybersecurity capabilities
- **Adaptive** — adjusts difficulty to professional skill level
- **Actionable** — generates learning roadmaps from gaps

### Solution

```mermaid
flowchart TD
    JD["Job Description"] --> SDE["Skill DNA Engine"]
    SDE --> AB["Assessment Blueprint"]
    AB --> PCE["Practical Challenge Engine"]
    PCE --> PA["Professional Assessment"]
    PA --> CRE["Capability Reasoning Engine"]
    CRE --> EIE["Evidence Intelligence Engine"]
    EIE --> LPE["Learning Path Engine"]
    LPE --> AR["Capability Report"]

    style JD fill:#1e3a5f,color:#fff
    style AR fill:#1e3a5f,color:#fff
    style SDE fill:#2d5a87,color:#fff
    style CRE fill:#2d5a87,color:#fff
    style EIE fill:#2d5a87,color:#fff
    style LPE fill:#2d5a87,color:#fff
```

Every decision produced by the platform is traceable and explainable.

---

## Core Features

### JD Intelligence Engine
Parse PDF / DOCX / TXT job descriptions and extract skills, responsibilities, competencies, and difficulty estimates.

### Skill DNA Engine
Transform unstructured job descriptions into structured cybersecurity competency graphs — the professional's unique Skill DNA — with knowledge areas, assessment objectives, and rubric references.

### Capability Intelligence Engine
Coordinate the complete assessment lifecycle — planning, session management, adaptive difficulty, scenario orchestration, progress tracking, and recovery.

### Practical Challenge Engine
Generate realistic cybersecurity scenarios across multiple domains:

| Challenge Type | Focus Area |
|---|---|
| SOC Investigation | Detection & triage |
| Incident Response | Containment & recovery |
| Threat Hunting | Proactive detection |
| Malware Analysis | Reverse engineering |
| Cloud Security | Cloud infrastructure defense |
| Network Security | Network defense |
| DFIR | Digital forensics |
| Identity Security | IAM & access control |

### Capability Reasoning Engine
Evaluate professional reasoning through technical workflow analysis, decision quality, risk awareness, competency coverage, and MITRE ATT&CK alignment.

### Evidence Intelligence Engine
Produce evidence-backed score rationale, confidence estimates, and improvement recommendations — every score is supported by evidence.

### Learning Path Engine
Generate personalized learning roadmaps mapped directly to competency gaps identified during assessment, powered by the **AI Mentor**.

### Career Compass
AI-driven career progression modeling that maps current capabilities to target roles and shows the shortest development path.

### Capability Heatmap
Visualize competency coverage, strengths, weaknesses, and progress over time across your entire team.

### Cyber Twin
A digital representation of each professional's verified capabilities — continuously updated as skills are demonstrated and assessed.

### AI Mentor
Intelligent guidance engine that provides real-time hints, learning recommendations, and career advice based on individual Skill DNA.

### Capability Analyst Dashboard
Compare professionals across competencies, review evidence, and export reports.

---

## System Architecture

### Complete System Flow

```mermaid
flowchart LR
    subgraph Presentation["1. Presentation Layer"]
        React["React SPA"]
    end
    subgraph Gateway["2. API Gateway Layer"]
        FA["FastAPI"]
    end
    subgraph Adaptive["3. Adaptive Intelligence Layer"]
        AUTH["Auth"]
        SDE["Skill DNA Engine"]
        CIE["Capability Intelligence"]
        RR["Reporting"]
    end
    subgraph AI["4. AI Decision Engine"]
        ORCH["AI Orchestrator"]
        PCE["Practical Challenge Engine"]
        CRE2["Capability Reasoning"]
        EIE["Evidence Intelligence"]
    end
    subgraph Learning["5. Learning Orchestration Layer"]
        LPE["Learning Path Engine"]
        AM["AI Mentor"]
    end
    subgraph Community["6. Community Intelligence Layer"]
        CT["Cyber Twin"]
        CC["Career Compass"]
        CH["Capability Heatmap"]
    end
    subgraph Data["7. Data Platform"]
        PG[("PostgreSQL")]
    end

    React --> FA
    FA --> AUTH
    FA --> SDE
    FA --> CIE
    FA --> RR
    SDE --> ORCH
    CIE --> ORCH
    ORCH --> PCE
    ORCH --> CRE2
    ORCH --> EIE
    ORCH --> LPE
    LPE --> AM
    AM --> CT
    CT --> CC
    CT --> CH
    AUTH --> PG
    SDE --> PG
    CIE --> PG
    PCE --> PG
    CRE2 --> PG
    EIE --> PG
    LPE --> PG
    CT --> PG
    CC --> PG
    CH --> PG
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
    subgraph API["API Gateway Layer"]
        NG["Nginx"]
        FAST["FastAPI"]
    end
    subgraph Adaptive["Adaptive Intelligence Layer"]
        MD["Auth Module"]
        MD2["Skill DNA Module"]
        MD3["Capability Assessment Module"]
        MD4["Reports Module"]
    end
    subgraph AI["AI Decision Engine"]
        AIO["AI Orchestrator"]
        PM["Prompt Manager"]
        SC["Schema Validator"]
        PV["Provider Abstraction"]
    end
    subgraph Learning["Learning Orchestration Layer"]
        LPE["Learning Path Engine"]
        AM["AI Mentor"]
    end
    subgraph Community["Community Intelligence Layer"]
        CT["Cyber Twin Registry"]
        CC["Career Compass"]
        CH["Capability Heatmap"]
    end
    subgraph Storage["Data Platform"]
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
    AIO --> LPE
    LPE --> AM
    AM --> CT
    CT --> CC
    CT --> CH
    CT --> PG
    CC --> PG
    CH --> PG
```

### Backend Architecture

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
    subgraph Modules["Module Layer"]
        direction TB
        AUTH["auth/"]
        USR["users/"]
        JD["jd/"]
        SDE["skill_dna/"]
        CIE["capability_assessment/"]
        PCE["practical_challenges/"]
        CRE["capability_reasoning/"]
        EIE["evidence_intelligence/"]
        LPE["learning_path/"]
        REP["reports/"]
        ANL["analytics/"]
        CT["cyber_twin/"]
        CC["career_compass/"]
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
    end

    R --> Modules
    MW --> R
    Core --> Modules
    Modules --> AI
    CIE --> ORC
    SDE --> ORC
    CRE --> ORC
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
        SD["Skill DNA"]
        AS["Capability Assessment"]
        RP["Reports"]
        LN["Learning"]
        CT["Cyber Twin"]
        CC["Career Compass"]
        ST["Settings"]
    end
    subgraph Features["Feature Modules"]
        FA["auth/"]
        FD["dashboard/"]
        FJ["job-description/"]
        FS["skill-dna/"]
        FAS["assessment/"]
        FM["practical-challenges/"]
        FRP["reports/"]
        FL["learning/"]
        FC["cyber-twin/"]
        FCP["career-compass/"]
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
        PR["Professional Response"]
    end
    subgraph Engines["AI Engines"]
        SDE["Skill DNA Engine"]
        AP["Assessment Planner"]
        PCE["Practical Challenge Generator"]
        CRE["Capability Reasoning Engine"]
        EIE["Evidence Intelligence Engine"]
        LPE["Learning Path Engine"]
    end
    subgraph Orchestrator["AI Orchestrator"]
        PM["Prompt Builder"]
        SC["Schema Validator"]
        CL["LLM Client"]
        RT["Retry Logic"]
    end
    subgraph Output["Output"]
        SD["Skill DNA"]
        APO["Assessment Plan"]
        MSO["Challenge Package"]
        EV["Evaluation"]
        EX["Evidence Report"]
        LR["Learning Roadmap"]
    end

    JD --> SDE
    SDE --> AP
    AP --> PCE
    PR --> CRE
    CRE --> EIE
    EIE --> LPE
    SDE --> Orchestrator
    AP --> Orchestrator
    PCE --> Orchestrator
    CRE --> Orchestrator
    EIE --> Orchestrator
    LPE --> Orchestrator
    Orchestrator --> SD
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
    User ||--|| CyberTwin : "has"
    JobDescription ||--|| SkillDNA : "generates"
    SkillDNA ||--o{ Assessment : "defines"
    Assessment ||--o{ PracticalChallenge : "contains"
    Assessment ||--|| Report : "produces"
    PracticalChallenge ||--o{ Response : "elicits"
    Response ||--|| Evaluation : "receives"
    Evaluation ||--|| Evidence : "produces"
    Evaluation ||--o{ LearningPath : "generates"
    CyberTwin ||--|| CareerCompass : "feeds"
    CyberTwin ||--|| CapabilityHeatmap : "feeds"
    User ||--o{ CapabilityHeatmap : "visualizes"

    User {
        uuid id PK
        string email
        string role "admin | capability_analyst | professional | reviewer"
        datetime created_at
    }

    JobDescription {
        uuid id PK
        text raw_content
        string source_type "pdf | docx | txt"
        datetime uploaded_at
    }

    SkillDNA {
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

    PracticalChallenge {
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

    CyberTwin {
        uuid id PK
        jsonb capability_profile
        jsonb verified_skills
        jsonb experience_graph
        datetime last_updated
    }

    CapabilityHeatmap {
        uuid id PK
        jsonb coverage_data
        jsonb strength_areas
        jsonb gap_areas
    }

    CareerCompass {
        uuid id PK
        jsonb target_roles
        jsonb progression_paths
        jsonb recommended_milestones
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
    JD["Job Description"] --> SDE["Skill DNA\nEngine"]
    SDE --> AP["Assessment\nPlanner"]
    AP --> PCE["Practical\nChallenge Engine"]
    PCE --> PR["Professional\nResponse"]
    PR --> CRE["Capability\nReasoning"]
    CRE --> EIE["Evidence\nIntelligence"]
    EIE --> LPE["Learning Path\nEngine"]
    LPE --> REPO["Report\nGenerator"]

    style JD fill:#1e3a5f,color:#fff
    style PCE fill:#2d5a87,color:#fff
    style CRE fill:#2d5a87,color:#fff
    style EIE fill:#2d5a87,color:#fff
    style LPE fill:#2d5a87,color:#fff
    style REPO fill:#1e3a5f,color:#fff
```

### Adaptive Assessment Workflow

```mermaid
flowchart TD
    START(["Start Assessment"]) --> PLAN["Load Assessment Blueprint"]
    PLAN --> M1["Present Challenge 1"]
    M1 --> R1["Professional Responds"]
    R1 --> E1["Evaluate Response"]
    E1 --> ADJ{"Adjust Difficulty?"}
    ADJ -->|"Low Score"| EASY["Easier Challenge"]
    ADJ -->|"High Score"| HARD["Harder Challenge"]
    ADJ -->|"Adequate"| NORM["Same Difficulty"]
    EASY --> M2["Present Challenge 2"]
    HARD --> M2
    NORM --> M2
    M2 --> R2["Next Response..."]
    R2 --> E2["Evaluate"]
    E2 --> DONE{"All Challenges\nComplete?"}
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

## Project Structure

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
│   ├── skill-dna/    Skill DNA profile view
│   ├── assessment/   Capability assessment session
│   ├── reports/      Report viewing & export
│   ├── learning/     Learning roadmap
│   ├── cyber-twin/   Cyber Twin visualization
│   ├── career-compass/  Career progression paths
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
│   ├── skill_dna/    Skill DNA profile generation
│   ├── capability_assessment/  Assessment lifecycle
│   ├── practical_challenges/   Scenario generation
│   ├── capability_reasoning/   Reasoning & evaluation
│   ├── evidence_intelligence/  Evidence & explanation
│   ├── learning_path/          Learning recommendations
│   ├── cyber_twin/   Cyber Twin management
│   ├── career_compass/  Career progression engine
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
| **Mithra** | 🎨 Frontend & UI/UX | Frontend Architecture | React, Tailwind, shadcn/ui, Dashboard, Reports, Charts |
| **KC** | 🧠 AI Engineering + Cybersecurity | Prompt Engineering | LLM Logic, Evaluation Engine, Rubrics, MITRE Mapping, Adaptive Challenges |
| **AV** | 🔗 AI Integration & System Reliability | Testing & DevOps | AI Provider Layer, Voice, Integration, Deployment, Testing, Performance |

---

### Detailed Responsibilities

#### ⚙️ Jos — Backend Lead

Owns FastAPI, REST APIs, Database, Session Management, AI Orchestrator, Backend Architecture.

**Deliverables:** `/parse-jd`, `/generate-assessment`, `/evaluate-response`, `/generate-report`

**Learns:** FastAPI, Pydantic, Async Python, API Design, Database Design

#### 🎨 Mithra — Frontend Lead

Owns React, Tailwind CSS, shadcn/ui, Dashboard, Landing Page, Assessment Screen, Report Screen, Charts, Animations.

**Deliverables:** Beautiful UI, Responsive Layout, Challenge Timeline, Skill Radar, Report Dashboard

**Learns:** React, Tailwind, shadcn/ui, Recharts, UX Principles

#### 🧠 KC — AI + Cybersecurity Lead

Owns Prompt Engineering, Cybersecurity Knowledge, Evaluation Logic, Rubrics, MITRE Mapping, Challenge Generation, Follow-up Logic, Learning Path.

**Deliverables:** Prompt Library, Rubric Engine, Explainable Scoring, Adaptive Assessment Logic, Capability Readiness Report

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
| Learning Path Engine | KC | Jos |
| Cyber Twin | KC | Jos |
| Career Compass | KC | Mithra |
| Deployment | AV | Jos |
| Testing | Everyone | Everyone |

---

### Platform Roles (RBAC)

| Role | Permissions | Description |
|---|---|---|
| **Admin** | Full system access | Manage users, configure system, view all data |
| **Capability Analyst** | Create assessments, view reports | Design assessments, evaluate professionals |
| **Professional** | Take assessments, view own reports | Complete challenges, review feedback |
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
| 4–6 | JD parser, challenge generator, assessment UI, prompt library | One complete assessment flow works |
| 7–10 | Evaluation engine, explainable scoring, MITRE mapping, voice integration, report generation | End-to-end demo is functional |
| 11–13 | Adaptive follow-up challenges, learning roadmap, UI polish, performance improvements | — |
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
skillscanx/
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
├── 01-product/            Overview, problem, vision, requirements
├── 02-research/           Market analysis, personas, user journey
├── 03-functional-design/  Features, workflows, use cases, UI/UX
├── 04-architecture/       System, AI, backend, frontend, data flow
├── 05-data-api/           Database design, API spec, auth, models
├── 06-ai-engines/         Skill DNA, assessment, challenges, reasoning, evidence
├── 07-engineering/        Testing, devops, deployment, monitoring, security
├── 08-delivery/           Roadmap, project structure, risk, future vision
├── concepts/              Deep-dive docs: Cyber Twin, AI Mentor, Gamification +20
└── reference/             Glossary, FAQ, Scalability, Observability, Monitoring
```

Full documentation index → [`docs/README.md`](docs/README.md)

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
DATABASE_URL=postgresql://user:pass@localhost:5432/skillscanx
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
    title PWNDORA SkillScan X Development Roadmap
    dateFormat  YYYY-MM-DD
    section Foundation
    Project Setup        :done, 2026-07-01, 7d
    Architecture Docs    :done, 2026-07-01, 7d
    section Core Platform
    Auth & Users         :active, 2026-07-08, 14d
    JD Intelligence      :2026-07-15, 14d
    Skill DNA            :2026-07-22, 14d
    section AI Engines
    Practical Challenges   :2026-08-01, 21d
    Capability Reasoning   :2026-08-15, 21d
    Evidence Intelligence  :2026-09-01, 14d
    section Assessment
    Capability Assessment  :2026-09-15, 21d
    Frontend UX            :2026-09-22, 21d
    section Intelligence
    Report Generator     :2026-10-15, 14d
    Learning Path Engine :2026-10-22, 14d
    Cyber Twin           :2026-10-29, 14d
    Career Compass       :2026-11-05, 14d
    section Production
    Testing & Polish     :2026-11-01, 21d
    Launch               :2026-11-22, 7d
```

### Phases

| Phase | Focus | Deliverables |
|---|---|---|
| **Phase 1** Foundation | Project setup, docs, CI/CD | Repository, Docker, Architecture |
| **Phase 2** Core Platform | Auth, users, JD intelligence | Auth system, JD parser, Skill DNA |
| **Phase 3** AI Engines | Challenge gen, reasoning, evidence | AI pipeline, evaluation, evidence |
| **Phase 4** Assessment | Assessment lifecycle, frontend | Assessment UX, adaptive flow |
| **Phase 5** Intelligence | Reports, learning, Cyber Twin, Career Compass | PDF reports, learning roadmaps, Cyber Twin profiles |
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
- Cyber Twin marketplace
- Cross-organization capability benchmarking

---

## Security

| Control | Implementation |
|---|---|
| Authentication | JWT with refresh tokens |
| Authorization | RBAC (Admin, Capability Analyst, Professional, Reviewer) |
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

Built using modern software engineering principles, adaptive artificial intelligence, and cybersecurity competency modeling.

---

## Philosophy

> Every assessment should be explainable.
>
> Every score should have evidence.
>
> Every recommendation should be actionable.
>
> Every architectural decision should favor correctness, maintainability, and transparency over unnecessary complexity.
