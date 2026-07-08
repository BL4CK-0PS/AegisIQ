# AegisIQ — System Architecture

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | Architecture Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

This document defines the complete system architecture of AegisIQ, including all major services, communication patterns, deployment boundaries, security considerations, and architectural principles.

The architecture is designed around modularity, explainability, scalability, and maintainability.

---

## 2. Architecture Goals

The architecture must achieve the following objectives:

- Modular design
- Clear separation of concerns
- AI-first workflow orchestration
- Explainable assessment pipeline
- Independent component evolution
- Easy deployment
- Secure processing
- Future scalability

---

## 3. Design Principles

AegisIQ follows these principles:

```
Modularity
    ↓
Loose Coupling
    ↓
High Cohesion
    ↓
AI-Oriented
    ↓
Event Driven
    ↓
Explainability First
    ↓
API First
    ↓
Domain Driven
```

---

## 4. High-Level Architecture

```
                    +----------------------+
                    |      React UI        |
                    +----------+-----------+
                               |
                         HTTPS / REST
                               |
                               ▼
                    +----------------------+
                    |     FastAPI API      |
                    |  (Gateway Layer)     |
                    +----------+-----------+
                               |
        -------------------------------------------------
        |        |         |         |         |         |
        ▼        ▼         ▼         ▼         ▼         ▼
 +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
 |   Auth    | |    JD     | |Assessment | | Cyber     | | Learning  | | Reporting |
 |  Service  | | Intelligence| Engine    | | Reasoning | |  Engine    | |  Engine   |
 +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
                      |              |             |
                      ▼              ▼             ▼
                +--------------------------------------+
                |          AI Orchestrator             |
                +----------------+---------------------+
                                 |
                                 ▼
                     +-------------------------+
                     |       LLM Provider      |
                     +-------------------------+
                                 |
                                 ▼
                      +-----------------------+
                      |     PostgreSQL        |
                      +-----------------------+
```

---

## 5. Architectural Layers

```
Presentation Layer
    ↓
API Gateway Layer
    ↓
Application Services
    ↓
AI Orchestration
    ↓
Business Logic
    ↓
Persistence
    ↓
Infrastructure
```

Each layer has one responsibility.

---

## 6. Core Components

| Component | Responsibility |
|---|---|
| Frontend | User interaction |
| API Gateway | Request routing |
| Authentication | Identity and sessions |
| JD Intelligence | Parse and analyze job descriptions |
| Role Blueprint | Canonical role model |
| Assessment Engine | Assessment lifecycle |
| Mission Generator | Scenario generation |
| Cyber Reasoning | Evaluation |
| Explainability | Evidence generation |
| Learning Engine | Recommendations |
| Reporting | Reports and exports |
| Database | Persistent storage |

---

## 7. Component Responsibilities

### Frontend

Responsible for: UI, forms, voice recording, visualization, reports.

### Backend

Responsible for: APIs, business logic, authentication, orchestration.

### AI Layer

Responsible for: prompt orchestration, mission generation, reasoning evaluation, recommendations.

### Persistence

Responsible for: user data, assessments, reports, logs.

---

## 8. End-to-End Workflow

```
User
    ↓
Upload Job Description
    ↓
JD Intelligence
    ↓
Role Blueprint
    ↓
Assessment Planner
    ↓
Mission Generator
    ↓
Assessment Session
    ↓
Cyber Reasoning
    ↓
Explainability
    ↓
Learning Engine
    ↓
Report Generator
    ↓
Dashboard
```

---

## 9. Component Interaction

```
Frontend
    ↓
API Gateway
    ↓
Assessment Engine
    ↓
Mission Generator
    ↓
AI
    ↓
Cyber Reasoning
    ↓
Explainability
    ↓
Database
    ↓
Frontend
```

Every request passes through the API layer. Business logic never exists inside the UI.

---

## 10. External Dependencies

| Dependency | Purpose |
|---|---|
| LLM Provider | Mission generation and evaluation |
| Browser Speech API | Voice transcription |
| PostgreSQL | Data persistence |
| Docker | Deployment |
| GitHub | Version control |

---

## 11. Deployment Architecture

### MVP

```
Browser
    ↓
React Frontend
    ↓
Nginx
    ↓
FastAPI
    ↓
AI Services
    ↓
PostgreSQL
```

### Future

```
Cloud Load Balancer
    ↓
API Instances
    ↓
Redis
    ↓
AI Workers
    ↓
Database Cluster
```

---

## 12. Scalability Strategy

### MVP

```
Single Frontend
    ↓
Single Backend
    ↓
Single Database
```

### Future

```
Frontend CDN
    ↓
API Cluster
    ↓
Message Queue
    ↓
AI Workers
    ↓
Database Replicas
```

---

## 13. Security Architecture

Security controls include:

- HTTPS
- JWT authentication
- Input validation
- Prompt isolation
- Output validation
- Rate limiting
- Secure secrets management
- Audit logging

Security is enforced at every layer.

---

## 14. Failure Handling

### AI Failure

```
LLM Timeout
    ↓
Retry
    ↓
Fallback Response
    ↓
Persist Session
    ↓
Continue Assessment
```

### Database Failure

```
Retry
    ↓
Read-only Mode
    ↓
Graceful Error
```

---

## 15. Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- TanStack Query
- React Router

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic

### Database

- PostgreSQL

### AI

- LLM
- Structured JSON
- Prompt orchestration

### Infrastructure

- Docker
- Nginx
- GitHub Actions

---

## 16. Architecture Decision Records (ADRs)

| ADR | Decision | Reason |
|---|---|---|
| ADR-001 | API-first architecture | Clear separation between frontend and backend |
| ADR-002 | Role Blueprint as canonical model | Reusable across modules |
| ADR-003 | Modular monolith (MVP) | Faster iteration for small team; extract later |
| ADR-004 | Explainability pipeline | Transparent assessments |
| ADR-005 | Structured AI outputs | Reliable downstream processing |

---

## 17. Future Evolution

Future architectural enhancements:

- Microservices (extracted from monolith modules)
- Event bus
- Message queue
- Vector database for knowledge retrieval
- Multi-model AI routing
- Enterprise multi-tenancy
- Kubernetes deployment
- Observability stack
- Distributed caching

---

## 18. Conclusion

The AegisIQ architecture is designed to balance rapid MVP development with long-term extensibility. By centering the system around the **Role Blueprint** and separating AI orchestration from business logic, the platform can evolve from a hackathon prototype into a production-ready cybersecurity competency platform without fundamental architectural redesign.

---

## Architecture Principles Summary

```
Users
    ↓
Presentation
    ↓
API Gateway
    ↓
Business Services
    ↓
AI Orchestrator
    ↓
Persistence
    ↓
Infrastructure
```

---

## 19. References

| Reference | Document |
|---|---|
| Feature specification | `../03-experience/14-feature-specification.md` |
| AI architecture | `../04-architecture/17-ai-cognitive-architecture.md` |
| Backend architecture | `../04-architecture/18-backend-architecture.md` |
| Frontend architecture | `../04-architecture/19-frontend-architecture.md` |
| Data flow | `../04-architecture/20-data-flow.md` |
