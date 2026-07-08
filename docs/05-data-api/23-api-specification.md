# API Specification

## Table of Contents

1. Executive Summary
2. API Design Principles
3. API Architecture
4. Authentication APIs
5. User APIs
6. Job Description APIs
7. Role Blueprint APIs
8. Assessment APIs
9. Mission APIs
10. Evaluation APIs
11. Learning APIs
12. Report APIs
13. Error Responses
14. Versioning
15. Rate Limiting
16. OpenAPI Standards
17. Future APIs
18. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines the REST API contract for AegisIQ.

Goals:

- Stable API contracts
- Consistent request/response models
- Predictable error handling
- Versioned endpoints
- OpenAPI compatibility

---

# 2. API Design Principles

Every endpoint follows:

```
RESTful
    ↓
Versioned
    ↓
Stateless
    ↓
JSON
    ↓
Consistent
    ↓
Secure
    ↓
Documented
```

---

# 3. API Architecture

```
React
    ↓
Axios
    ↓
FastAPI
    ↓
Application Service
    ↓
Domain Service
    ↓
Repository
    ↓
Database
```

Every API should expose business operations, not CRUD for every table.

---

# 4. Authentication APIs

## Register

```
POST /api/v1/auth/register
```

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "********"
}
```

Response:
```json
{
  "user_id": "...",
  "message": "Registration successful"
}
```

## Login

```
POST /api/v1/auth/login
```

Response:
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600
}
```

## Current User

```
GET /api/v1/auth/me
```

## Logout

```
POST /api/v1/auth/logout
```

---

# 5. User APIs

```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/history
```

---

# 6. Job Description APIs

## Upload JD

```
POST /api/v1/job-descriptions
```

Multipart upload

Response:
```json
{
  "job_description_id": "..."
}
```

## Parse JD

```
POST /api/v1/job-descriptions/{id}/parse
```

## Get JD

```
GET /api/v1/job-descriptions/{id}
```

---

# 7. Role Blueprint APIs

## Generate

```
POST /api/v1/role-blueprints
```

Body:
```json
{
  "job_description_id": "..."
}
```

## Retrieve

```
GET /api/v1/role-blueprints/{id}
```

## List Versions

```
GET /api/v1/role-blueprints/{id}/versions
```

---

# 8. Assessment APIs

## Generate Assessment

```
POST /api/v1/assessments
```

## Start

```
POST /api/v1/assessments/{id}/start
```

## Get Status

```
GET /api/v1/assessments/{id}
```

## Resume

```
POST /api/v1/assessments/{id}/resume
```

## Complete

```
POST /api/v1/assessments/{id}/complete
```

---

# 9. Mission APIs

## Get Next Mission

```
GET /api/v1/assessments/{id}/missions/next
```

## Submit Response

```
POST /api/v1/missions/{id}/responses
```

Request:
```json
{
  "response_type": "voice",
  "transcript": "..."
}
```

## Retrieve Mission

```
GET /api/v1/missions/{id}
```

---

# 10. Evaluation APIs

## Evaluate

```
POST /api/v1/evaluations
```

## Retrieve Evaluation

```
GET /api/v1/evaluations/{id}
```

## Competency Breakdown

```
GET /api/v1/evaluations/{id}/competencies
```

---

# 11. Learning APIs

## Generate Roadmap

```
POST /api/v1/learning-plans
```

## Retrieve

```
GET /api/v1/learning-plans/{id}
```

---

# 12. Report APIs

## Generate Report

```
POST /api/v1/reports
```

## Get Report

```
GET /api/v1/reports/{id}
```

## Export PDF

```
GET /api/v1/reports/{id}/pdf
```

## Export JSON

```
GET /api/v1/reports/{id}/json
```

---

# 13. Error Responses

Standard format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "request_id": "uuid",
    "details": []
  }
}
```

Common codes:

| Code                | Meaning                    |
| ------------------- | -------------------------- |
| VALIDATION_ERROR    | Invalid input              |
| UNAUTHORIZED        | Authentication required    |
| FORBIDDEN           | Insufficient permissions   |
| NOT_FOUND           | Resource missing           |
| CONFLICT            | Duplicate or invalid state |
| AI_PROCESSING_ERROR | AI request failed          |
| INTERNAL_ERROR      | Unexpected server error    |

---

# 14. Versioning

API prefix:

```
/api/v1
```

Future versions:

```
/api/v2
/api/v3
```

Rules:

- Never introduce breaking changes within the same version.
- Deprecate endpoints before removal.
- Maintain backward compatibility where practical.

---

# 15. Rate Limiting

Suggested limits (MVP):

| Endpoint Type      |              Limit |
| ------------------ | -----------------: |
| Authentication     | 10 requests/minute |
| JD Upload          |   20 requests/hour |
| Assessment Actions |  120 requests/hour |
| Report Download    |   60 requests/hour |

Protect AI-heavy endpoints from abuse.

---

# 16. OpenAPI Standards

Requirements:

- OpenAPI 3.1
- Pydantic request/response models
- Automatic Swagger UI
- Automatic ReDoc
- Example payloads
- Response schemas
- Authentication documentation

---

# 17. Future APIs

Future endpoints:

```
/organizations
/teams
/recruiters
/templates
/analytics
/certifications
/model-runs
/integrations
```

These should follow the same versioning and response conventions.

---

# 18. Conclusion

The AegisIQ API is organized around business capabilities rather than database tables. Stable contracts, consistent schemas, and explicit versioning allow the frontend and backend to evolve independently while maintaining compatibility.
