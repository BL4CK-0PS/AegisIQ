# PWNDORA SkillScan X — Backend Architecture

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | Backend Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | PWNDORA SkillScan X Team | Initial release |

---

## 1. Executive Summary

This document defines the backend architecture of PWNDORA SkillScan X. The backend is responsible for business logic, AI orchestration, assessment lifecycle, security, data persistence, and report generation.

The architecture follows a **modular monolith** pattern aligned to the 7-layer stack, allowing future extraction into microservices without changing public APIs.

**Core message:** We do not assess resumes. We assess cybersecurity capability.

---

## 2. Backend Philosophy

The backend follows these principles:

```mermaid
flowchart TD
    C[Capability over Certification] --> E[Evidence over Resume]
    E --> L[Learning over Testing]
    L --> EX[Explainability over Black-Box AI]
```

```mermaid
flowchart TD
    AF[API First] --> DD[Domain Driven] --> M[Modular]
    M --> S[Stateless] --> SEC[Secure] --> O[Observable] --> AIO[AI Orchestrated]
```

Business rules never exist in the frontend.

---

## 3. High-Level Backend Architecture

```mermaid
flowchart TD
    RS[React SPA] --> FA[FastAPI Gateway]
    FA --> AIL[Adaptive Intelligence Layer] & IS[Intelligence Services] & ADE[AI Decision Engine] & LO[Learning Orchestration]
    AIL & IS & ADE & LO --> CIL[Community Intelligence Layer]
    CIL --> DP[Data Platform<br/>PostgreSQL]
```

---

## 4. Architectural Layers (7-Layer Context)

```mermaid
flowchart TD
    1[1. Presentation Layer] --> 2[2. API Gateway Layer]
    2 --> 3[3. Adaptive Intelligence Layer]
    3 --> 4[4. AI Decision Engine]
    4 --> 5[5. Learning Orchestration Layer]
    5 --> 6[6. Community Intelligence Layer]
    6 --> 7[7. Data Platform]
```

Responsibilities are strictly separated.

---

## 5. Module Architecture

```
backend/
modules/
├── auth/
├── users/
├── jd/
├── skill_dna_profile/
├── assessment/
├── missions/
├── reasoning/
├── evidence_intelligence/
├── learning/
├── community/
├── reports/
├── analytics/
└── common/
```

Each module is independently testable. Each module owns its router, service, repository, models, schemas, and tests.

---

## 6. Request Lifecycle

```mermaid
flowchart TD
    HR[HTTP Request] --> AR[API Router] --> V[Validation] --> AIL[Adaptive Intelligence Layer]
    AIL --> AS[Application Service] --> DS[Domain Service] --> R[Repository]
    R --> DB[Database] --> RD[Response DTO] --> FE[Frontend]
```

---

## 7. Service Layer

Each module contains its own services.

Example: `assessment/services/`

- `assessment_service.py`
- `mission_service.py`
- `session_service.py`
- `evaluation_service.py`

Service responsibilities: business rules, workflow orchestration, transactions, validation, AI coordination via AI Decision Engine.

---

## 8. Repository Layer

Repositories isolate persistence.

Example:

- `assessment_repository.py`
- `mission_repository.py`
- `report_repository.py`

Responsibilities: CRUD operations, query optimization, transaction boundaries, ORM abstraction.

Services never execute raw SQL.

---

## 9. AI Integration Layer

The backend isolates LLM interaction through the AI Decision Engine.

```mermaid
flowchart TD
    AIL[Adaptive Intelligence Layer] --> ADE[AI Decision Engine] --> PB[Prompt Builder]
    PB --> LC[LLM Client] --> SV[Schema Validator] --> SR[Structured Response]
    SR --> LOL[Learning Orchestration Layer]
```

Components: prompt templates, JSON validation, retry logic, rate limiting, model routing, AI Mentor orchestration.

---

## 10. Database Layer

Primary entities:

```mermaid
flowchart TD
    U[Users] --> JD[Job Descriptions] --> SDP[Skill DNA Profiles]
    SDP --> A[Assessments] --> M[Missions] --> R[Responses]
    R --> E[Evaluations] --> REP[Reports] --> CTP[Cyber Twin Profiles]
```

Use SQLAlchemy models with Alembic migrations.

---

## 11. API Layer

Endpoint structure:

```
/api/v1
/auth
/users
/jd
/skill-dna-profiles
/assessments
/missions
/reasoning
/evidence
/reports
/learning
/community
/cyber-twin
```

Guidelines: RESTful design, versioned endpoints, consistent error responses, Pydantic request/response schemas.

---

## 12. Background Processing

Tasks suitable for async execution:

- Report PDF generation
- Email notifications (future)
- Analytics aggregation
- Audit log cleanup
- Long-running AI jobs
- Community Intelligence aggregation

For MVP, FastAPI background tasks are sufficient.

---

## 13. Error Handling

```mermaid
flowchart LR
    R[Request] --> V[Validation] --> S[Service] --> EH[Exception Handler] --> SER[Standard Error Response]
```

Error response format:

```json
{
  "error": {
    "code": "ASSESSMENT_NOT_FOUND",
    "message": "Assessment could not be located.",
    "request_id": "uuid"
  }
}
```

---

## 14. Security Architecture

Controls: JWT authentication, password hashing, input validation, output encoding, prompt injection protection, CORS configuration, rate limiting, audit logging, secret management through environment variables.

---

## 15. Recommended Folder Structure

```
backend/
app/
├── api/
│   ├── routers/
│   ├── dependencies/
│   └── middleware/
├── core/
│   ├── config.py
│   ├── logging.py
│   ├── security.py
│   └── exceptions.py
├── modules/
│   ├── auth/
│   ├── users/
│   ├── jd/
│   ├── skill_dna_profile/
│   ├── assessment/
│   ├── missions/
│   ├── reasoning/
│   ├── evidence_intelligence/
│   ├── learning/
│   ├── community/
│   ├── reports/
│   └── analytics/
├── layers/
│   ├── adaptive_intelligence/
│   ├── ai_decision_engine/
│   ├── learning_orchestration/
│   └── community_intelligence/
├── database/
│   ├── models/
│   ├── migrations/
│   └── session.py
├── ai/
│   ├── orchestrator/
│   ├── prompts/
│   ├── schemas/
│   ├── mentor/
│   └── providers/
├── tests/
└── main.py
```

---

## 16. Deployment

### MVP

```mermaid
flowchart LR
    RE[React] --> NG[Nginx] --> FA[FastAPI] --> PG[PostgreSQL]
```

### Future

```mermaid
flowchart LR
    LB[Load Balancer] --> AC[API Cluster] --> AW[AI Workers]
    AW --> R[Redis] --> PGC[PostgreSQL Cluster] --> CA[Community Analytics]
```

---

## 17. Future Evolution

Future enhancements: CQRS for analytics, event bus for module communication, worker queue (Celery or Dramatiq), distributed tracing, multi-region deployment, multi-tenant architecture, separate AI inference service, Community Intelligence data lake.

---

## 18. Conclusion

The backend architecture is designed to maximize correctness, maintainability, and future extensibility while remaining simple enough for a small team to build within a hackathon timeline. The 7-layer stack gives clean boundaries today and a practical migration path tomorrow.

---

## Backend Dependency Flow

```mermaid
flowchart TD
    R[Router] --> AIL[Adaptive Intelligence Layer] --> AS[Application Service]
    AS --> DS[Domain Service] --> CIL[Community Intelligence Layer]
    CIL --> REP[Repository] --> DP[Data Platform] --> RES[Response]
```

Every dependency points downward. Lower layers never depend on higher layers.

---

## Related Documents

- [System Architecture](16-system-architecture.md)
- [AI Cognitive Architecture](17-ai-cognitive-architecture.md)
- [Frontend Architecture](19-frontend-architecture.md)
- [Data Flow](20-data-flow.md)
- [Database Design](../docs/05-data-api/21-database-design.md)

---

## 19. References

| Reference | Document |
|---|---|
| System architecture | `../04-architecture/16-system-architecture.md` |
| AI architecture | `../04-architecture/17-ai-cognitive-architecture.md` |
| Frontend architecture | `../04-architecture/19-frontend-architecture.md` |
| Data flow | `../04-architecture/20-data-flow.md` |
