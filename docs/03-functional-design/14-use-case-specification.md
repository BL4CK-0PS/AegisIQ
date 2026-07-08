# AegisIQ — Feature Specification

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | Product Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

This document specifies every major product feature within AegisIQ. Each feature includes business purpose, functional behavior, UI expectations, backend responsibilities, AI workflow, database interactions, validation rules, API requirements, and success criteria.

This is where the project stops being a collection of ideas and becomes an engineering specification.

---

## 2. Feature Classification

| ID | Feature | Priority | MVP |
|---|---|---|---|
| F-001 | Authentication | P1 | No |
| F-002 | JD Intelligence | P0 | Yes |
| F-003 | Role Blueprint | P0 | Yes |
| F-004 | Assessment Engine | P0 | Yes |
| F-005 | Mission Generator | P0 | Yes |
| F-006 | Voice Assessment | P0 | Yes |
| F-007 | Cyber Reasoning | P0 | Yes |
| F-008 | Explainability | P0 | Yes |
| F-009 | Learning Roadmap | P1 | Yes |
| F-010 | Reports | P0 | Yes |
| F-011 | Recruiter Dashboard | P2 | No |

---

## 3. Platform Feature Map

```
Job Description
     ↓
JD Intelligence
     ↓
Role Blueprint
     ↓
Assessment Planner
     ↓
Mission Generator
     ↓
Assessment Engine
     ↓
Cyber Reasoning
     ↓
Explainability
     ↓
Learning
     ↓
Report
```

---

## 4. Feature F-001: User Authentication

### Objective

Allow users to securely access AegisIQ.

**Frontend**
- Login page
- Register page
- Forgot password
- Session handling

**Backend**
- Authentication service
- JWT generation
- Password hashing
- Session validation

**Database**

Tables: `users`, `sessions`

**API**

```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

---

## 5. Feature F-002: JD Intelligence

### Purpose

Transform an uploaded job description into structured assessment requirements.

**Input**
- PDF, DOCX, TXT

**AI Processing — Extract:**
- Role
- Experience
- Skills
- Responsibilities
- Certifications
- Seniority

**Output:** Role Blueprint

**Backend Flow:**
```
Parser → AI Extraction → Validation → Storage
```

**Database:** `job_descriptions`, `role_blueprints`

---

## 6. Feature F-003: Role Blueprint

### Purpose

Create a canonical representation of the target role.

**Contains:**
- Competencies
- Skills
- Knowledge Areas
- Responsibilities
- Learning Objectives
- Assessment Objectives

**UI:** Role summary, competency graph, assessment overview

**Backend:** Blueprint generation, validation, persistence

The Role Blueprint is the central domain model:

```
                    Role Blueprint
                   /      |       \
                  /       |        \
         Assessment   Learning   Reports
              |            |          |
         Missions     Recommendations Analytics
              |
      Cyber Reasoning
```

Assessments consume the Role Blueprint. Learning recommendations consume the same Role Blueprint. Reports reference it. Analytics aggregate across it. Future features can reuse it without redesigning the platform.

---

## 7. Feature F-004: Assessment Engine

### Purpose

Manage the complete assessment lifecycle.

**Workflow:**
```
Blueprint → Assessment Plan → Mission Flow → Evaluation → Completion
```

**Responsibilities:**
- Session state
- Timing
- Progress
- Adaptive flow
- Retry handling

---

## 8. Feature F-005: Mission Generator

### Purpose

Generate adaptive cybersecurity missions.

**Mission Structure:**
```
Scenario → Question → Response → Follow-up → Completion
```

**Mission Types:**
- SOC
- DFIR
- Threat Hunting
- Cloud
- Malware
- IAM

**AI — Generate:**
- Context
- Objectives
- Questions
- Expected reasoning
- Rubrics

---

## 9. Feature F-006: Voice Assessment

### Purpose

Capture spoken responses.

**Frontend:**
- Microphone
- Live transcript
- Retry
- Text fallback

**Backend:**
- Transcript cleanup
- Timestamping
- Session storage

**Failure Flow:**
```
Voice Error → Retry → Text Input → Continue
```

---

## 10. Feature F-007: Cyber Reasoning Engine

### Purpose

Evaluate cybersecurity thinking.

**Pipeline:**
```
Transcript
     ↓
Concept Extraction
     ↓
Workflow Validation
     ↓
Decision Analysis
     ↓
Risk Evaluation
     ↓
MITRE Mapping
     ↓
Competency Scoring
```

**Outputs:**
- Competencies
- Missing concepts
- Evidence
- Confidence
- Readiness

---

## 11. Feature F-008: Explainability Engine

### Purpose

Explain every assessment score.

**Outputs:**
- Why score was assigned
- Covered concepts
- Missing concepts
- Decision quality
- Improvement recommendations

**Report Example:**
```
Strengths
     ↓
Weaknesses
     ↓
Evidence
     ↓
Recommendations
```

---

## 12. Feature F-009: Learning Engine

### Purpose

Generate personalized improvement plans.

**Pipeline:**
```
Assessment → Weak Skills → Learning Topics → Labs → Roadmap → Reassessment
```

**Outputs:**
- Learning plan
- Practice roadmap
- Suggested reassessment date

---

## 13. Feature F-010: Reporting Engine

### Candidate Report

- Competency profile
- Skill radar
- Timeline
- Learning roadmap

### Recruiter Report

- Competency matrix
- Evidence summary
- Interview focus
- Role alignment

### Export Formats

- PDF
- JSON

---

## 14. Feature F-011: Recruiter Dashboard

### Capabilities

```
Upload JD → Create Assessment → Invite Candidates → Review Reports → Compare Results
```

### Future

- Analytics
- Hiring pipeline
- Organization dashboard

---

## 15. Feature Dependencies

```
Authentication
     ↓
JD Intelligence
     ↓
Role Blueprint
     ↓
Assessment Engine
     ↓
Mission Generator
     ↓
Cyber Reasoning
     ↓
Explainability
     ↓
Learning
     ↓
Reports
```

A downstream feature cannot function correctly if an upstream dependency fails.

---

## 16. MVP Scope

### Included in Hackathon

- JD upload
- Role Blueprint generation
- Adaptive mission generation
- Voice/text responses
- Cyber Reasoning Engine
- Explainability Engine
- Candidate report
- Learning roadmap

### Excluded

- Recruiter management
- Team analytics
- Enterprise administration
- ATS integration
- Multi-tenant support

---

## 17. Future Features

- NICE Workforce Framework alignment
- Hands-on cyber ranges
- SIEM replay assessments
- Threat intelligence integration
- Cloud security simulations
- Certification preparation
- Organization benchmarking
- AI model selection
- Multi-language assessments

---

## 18. Acceptance Criteria

A feature is complete when:

- Functional requirements are implemented.
- UI matches the design specification.
- API contracts are satisfied.
- Database schema supports the feature.
- AI outputs conform to the expected schema.
- Unit and integration tests pass.
- User acceptance criteria are met.
- Documentation is updated.

---

## Feature Relationship Diagram

```
Feature
   ↓
UI
   ↓
API
   ↓
Service
   ↓
Database
   ↓
AI
   ↓
Report
```

Every feature should be independently testable while integrating cleanly into the overall platform.

---

## 19. References

| Reference | Document |
|---|---|
| User stories | `../03-experience/13-user-stories.md` |
| Use cases | `../03-experience/12-use-cases.md` |
| Functional requirements | `../02-product/08-functional-requirements.md` |
| Product requirements | `../02-product/07-product-requirements.md` |
