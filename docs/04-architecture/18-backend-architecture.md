# AegisIQ — Backend Architecture

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
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

This document defines the backend architecture of AegisIQ. The backend is responsible for business logic, AI orchestration, assessment lifecycle, security, data persistence, and report generation.

The architecture follows a **modular monolith** pattern, allowing future extraction into microservices without changing public APIs.

---

## 2. Backend Philosophy

The backend follows these principles:

```
API First
    ↓
Domain Driven
    ↓
Modular
    ↓
Stateless
    ↓
Secure
    ↓
Observable
    ↓
AI Orchestrated
```

Business rules never exist in the frontend.

---

## 3. High-Level Backend Architecture

```
                React Frontend
                      │
                HTTPS / REST
                      │
                      ▼
              FastAPI Gateway
                      │
──────────────────────────────────────────────
      │        │        │        │
      ▼        ▼        ▼        ▼
  Auth     Assessment   AI     Reports
  Module     Module    Module   Module
      │        │        │        │
──────────────────────────────────────────────
      │
      ▼
 Repository Layer
      │
      ▼
 PostgreSQL
```

---

## 4. Architectural Layers

```
Presentation Layer
    ↓
API Routers
    ↓
Application Services
    ↓
Domain Services
    ↓
Repositories
    ↓
Database
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
├── role_blueprint/
├── assessment/
├── missions/
├── reasoning/
├── explainability/
├── learning/
├── reports/
├── analytics/
└── common/
```

Each module is independently testable. Each module owns its router, service, repository, models, schemas, and tests.

---

## 6. Request Lifecycle

```
HTTP Request
    ↓
API Router
    ↓
Validation
    ↓
Application Service
    ↓
Domain Service
    ↓
Repository
    ↓
Database
    ↓
Response DTO
    ↓
Frontend
```

---

## 7. Service Layer

Each module contains its own services.

Example: `assessment/services/`

- `assessment_service.py`
- `mission_service.py`
- `session_service.py`
- `evaluation_service.py`

Service responsibilities: business rules, workflow orchestration, transactions, validation, AI coordination.

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

The backend isolates LLM interaction.

```
Application
    ↓
AI Orchestrator
    ↓
Prompt Builder
    ↓
LLM Client
    ↓
Schema Validator
    ↓
Structured Response
```

Components: prompt templates, JSON validation, retry logic, rate limiting, model routing.

---

## 10. Database Layer

Primary entities:

```
Users
    ↓
Job Descriptions
    ↓
Role Blueprints
    ↓
Assessments
    ↓
Missions
    ↓
Responses
    ↓
Evaluations
    ↓
Reports
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
/role-blueprints
/assessments
/missions
/reasoning
/reports
/learning
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

For MVP, FastAPI background tasks are sufficient.

---

## 13. Error Handling

```
Request → Validation → Service → Exception Handler → Standard Error Response
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
│   ├── role_blueprint/
│   ├── assessment/
│   ├── missions/
│   ├── reasoning/
│   ├── explainability/
│   ├── learning/
│   ├── reports/
│   └── analytics/
├── database/
│   ├── models/
│   ├── migrations/
│   └── session.py
├── ai/
│   ├── orchestrator/
│   ├── prompts/
│   ├── schemas/
│   └── providers/
├── tests/
└── main.py
```

---

## 16. Deployment

### MVP

```
React → Nginx → FastAPI → PostgreSQL
```

### Future

```
Load Balancer → API Cluster → AI Workers → Redis → PostgreSQL Cluster
```

---

## 17. Future Evolution

Future enhancements: CQRS for analytics, event bus for module communication, worker queue (Celery or Dramatiq), distributed tracing, multi-region deployment, multi-tenant architecture, separate AI inference service.

---

## 18. Conclusion

The backend architecture is designed to maximize correctness, maintainability, and future extensibility while remaining simple enough for a four-person team to build within a hackathon timeline. A modular monolith gives clean boundaries today and a practical migration path tomorrow.

---

## Backend Dependency Flow

```
Router
    ↓
Application Service
    ↓
Domain Service
    ↓
Repository
    ↓
Database
    ↓
Response
```

Every dependency points downward. Lower layers never depend on higher layers.

---

## 19. References

| Reference | Document |
|---|---|
| System architecture | `../04-architecture/16-system-architecture.md` |
| AI architecture | `../04-architecture/17-ai-cognitive-architecture.md` |
| Frontend architecture | `../04-architecture/19-frontend-architecture.md` |
| Data flow | `../04-architecture/20-data-flow.md` |
