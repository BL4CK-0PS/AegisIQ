# AegisIQ — User Stories

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

This document defines user stories for AegisIQ using Agile methodology. Each story represents a user need and includes measurable acceptance criteria. Stories connect the user to the engineering team and become backlog items in Jira, GitHub Projects, or Linear.

---

## 2. Story Framework

Each story follows the format:

> **As a** `<persona>`
>
> **I want** `<goal>`
>
> **So that** `<value>`

Stories are grouped into Epics.

---

## 3. Product Epics

```
EPIC-1   User Management
             ↓
EPIC-2   Role Intelligence
             ↓
EPIC-3   Assessment Engine
             ↓
EPIC-4   Cyber Reasoning
             ↓
EPIC-5   Reporting
             ↓
EPIC-6   Learning
             ↓
EPIC-7   Recruitment
             ↓
EPIC-8   Administration
```

---

## 4. Candidate Stories

### EPIC-1: User Management

---

#### US-001: Account Creation

**As a** candidate

**I want** to create an account

**So that** I can save my assessments and progress.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | User Management |

**Acceptance Criteria**

- Registration succeeds with valid input.
- Invalid data is rejected with meaningful errors.
- User is redirected to the dashboard after successful registration.

---

#### US-002: Upload Job Description

**As a** candidate

**I want** to upload a job description

**So that** my assessment is tailored to the role.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | Role Intelligence |

**Acceptance Criteria**

- PDF, DOCX, and TXT uploads are supported.
- Role Blueprint is generated successfully.
- Upload validation errors are displayed.

---

#### US-003: Review Role Blueprint

**As a** candidate

**I want** to review the generated Role Blueprint

**So that** I understand what competencies will be assessed.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | Role Intelligence |

---

### EPIC-3: Assessment Engine

---

#### US-004: Adaptive Missions

**As a** candidate

**I want** adaptive cyber missions

**So that** the assessment reflects my responses instead of asking static questions.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | Assessment Engine |

---

#### US-005: Voice or Text Input

**As a** candidate

**I want** to answer using voice or text

**So that** I can choose the interaction method that suits me.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | Assessment Engine |

---

#### US-006: Explainable Feedback

**As a** candidate

**I want** detailed explainable feedback

**So that** I understand my strengths and weaknesses.

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Epic** | Cyber Reasoning |

---

### EPIC-6: Learning

---

#### US-007: Learning Roadmap

**As a** candidate

**I want** a personalized learning roadmap

**So that** I know how to improve before my next assessment.

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Epic** | Learning |

---

#### US-008: Assessment Comparison

**As a** candidate

**I want** to compare my previous assessments

**So that** I can measure improvement over time.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Learning |

---

## 5. Recruiter Stories

### EPIC-7: Recruitment

---

#### US-101: Upload JD for Screening

**As a** recruiter

**I want** to upload a job description

**So that** role-specific assessments are generated.

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Epic** | Recruitment |

---

#### US-102: Invite Candidates

**As a** recruiter

**I want** to invite candidates

**So that** they can complete assessments remotely.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Recruitment |

---

#### US-103: Competency Reports

**As a** recruiter

**I want** competency reports

**So that** I can screen candidates consistently.

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Epic** | Reporting |

---

#### US-104: Interview Focus Recommendations

**As a** recruiter

**I want** interview focus recommendations

**So that** technical interviews become more efficient.

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Epic** | Reporting |

---

#### US-105: Export Reports

**As a** recruiter

**I want** to export reports

**So that** I can share them with hiring managers.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Reporting |

---

## 6. Hiring Manager Stories

---

#### US-201: Evidence-Backed Assessments

**As a** hiring manager

**I want** evidence-backed assessments

**So that** I can make informed hiring decisions.

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Epic** | Cyber Reasoning |

---

#### US-202: Competency Visualizations

**As a** hiring manager

**I want** competency visualizations

**So that** I quickly understand candidate strengths.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Reporting |

---

#### US-203: AI-Generated Discussion Points

**As a** hiring manager

**I want** AI-generated discussion points

**So that** I can explore weak areas during interviews.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Reporting |

---

## 7. Trainer Stories

---

#### US-301: Assign Assessments

**As a** trainer

**I want** to assign assessments

**So that** I can evaluate learners consistently.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Recruitment |

---

#### US-302: Cohort Analytics

**As a** trainer

**I want** cohort analytics

**So that** I understand common learning gaps.

| Field | Value |
|---|---|
| **Priority** | P3 |
| **Epic** | Administration |

---

#### US-303: Progress Tracking

**As a** trainer

**I want** progress tracking

**So that** I can measure long-term improvement.

| Field | Value |
|---|---|
| **Priority** | P3 |
| **Epic** | Administration |

---

## 8. Administrator Stories

---

#### US-401: Manage Role Blueprints

**As an** administrator

**I want** to manage Role Blueprints

**So that** assessment templates remain accurate.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Administration |

---

#### US-402: Version Assessment Rubrics

**As an** administrator

**I want** to version assessment rubrics

**So that** evaluations remain consistent across updates.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Administration |

---

#### US-403: System Monitoring

**As an** administrator

**I want** system monitoring

**So that** operational issues can be identified quickly.

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Epic** | Administration |

---

## 9. AI Stories

---

#### US-501: JD Competency Extraction

**As the** AI engine

**I must** extract competencies from a job description.

---

#### US-502: Adaptive Mission Generation

**As the** AI engine

**I must** generate adaptive cyber missions.

---

#### US-503: Reasoning Evaluation

**As the** AI engine

**I must** evaluate cybersecurity reasoning.

---

#### US-504: Score Explainability

**As the** AI engine

**I must** explain every assessment score.

---

#### US-505: Learning Recommendations

**As the** AI engine

**I must** generate learning recommendations.

---

## 10. Acceptance Criteria Standards

Every story must satisfy:

```
Functional

↓

Testable

↓

Observable

↓

Repeatable

↓

Independent
```

Stories are complete only when all acceptance criteria pass.

---

## 11. Story Prioritization

| Priority | Meaning |
|---|---|
| **P0** | Critical for MVP |
| **P1** | High value, should be included if possible |
| **P2** | Useful but can be deferred |
| **P3** | Post-MVP enhancement |

---

## 12. MVP Story Set

The MVP consists of these stories:

```
US-001   User Registration
             ↓
US-002   Upload Job Description
             ↓
US-003   Role Blueprint
             ↓
US-004   Adaptive Missions
             ↓
US-005   Voice/Text Assessment
             ↓
US-006   Explainable Report
             ↓
US-007   Learning Roadmap
```

These stories alone demonstrate the platform's core value.

---

## 13. Product Backlog

| Epic | Story Count | MVP Stories |
|---|---|---|
| User Management | 2 | 2 |
| Role Intelligence | 1 | 1 |
| Assessment Engine | 2 | 2 |
| Cyber Reasoning | 2 | 1 |
| Reporting | 2 | 1 |
| Learning | 2 | 1 |
| Recruitment | 5 | 0 |
| Administration | 3 | 0 |

---

## 14. Story Traceability

```
Vision
   ↓
Epic
   ↓
User Story
   ↓
Use Case
   ↓
Feature
   ↓
API
   ↓
Service
   ↓
Database
   ↓
Test Case
```

This ensures every implementation can be traced back to a user need.

---

## 15. Future Stories

Future releases may include:

- Enterprise team management
- ATS synchronization
- Cyber range integration
- Multi-language assessments
- Organization-wide competency benchmarking
- AI-assisted interview coaching
- Certification preparation tracks
- Workforce readiness analytics

---

## 16. Definition of Ready

A story is ready for development when:

- Business value is clear.
- Acceptance criteria are defined.
- Dependencies are identified.
- UI expectations are understood.
- API impact is documented.

---

## 17. Definition of Done

A story is complete when:

- Code is implemented.
- Unit tests pass.
- Integration tests pass.
- Documentation is updated.
- UX review is complete.
- Acceptance criteria are satisfied.
- Product owner approves the outcome.

---

## 18. Development Milestones

| Milestone | Stories |
|---|---|
| **Sprint 1** | Authentication, JD Upload, Role Blueprint |
| **Sprint 2** | Assessment Engine, Mission Generation |
| **Sprint 3** | Cyber Reasoning, Explainability |
| **Sprint 4** | Reports, Learning Roadmap |
| **Sprint 5** | Recruiter Dashboard, Polish, Demo |

---

## 19. References

| Reference | Document |
|---|---|
| User journeys | `../03-experience/11-user-journey.md` |
| Use cases | `../03-experience/12-use-cases.md` |
| Feature specification | `../03-experience/14-feature-specification.md` |
| Personas | `../02-product/10-user-personas.md` |
