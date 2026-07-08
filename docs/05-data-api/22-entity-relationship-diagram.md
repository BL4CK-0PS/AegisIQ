# Entity Relationship Diagram

## Table of Contents

1. Executive Summary
2. Purpose
3. Domain Model
4. Entity Overview
5. Core Relationships
6. Cardinality
7. Primary Keys
8. Foreign Keys
9. Entity Definitions
10. Complete ER Diagram
11. Aggregate Boundaries
12. Versioning Strategy
13. Data Ownership
14. Future Expansion
15. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines the Entity Relationship Model (ERM) for AegisIQ.

It explains:

- Business entities
- Relationships
- Cardinality
- Ownership
- Aggregate boundaries
- Versioning

This serves as the reference for database implementation.

---

# 2. Purpose

The ERD represents the business domain rather than simply database tables.

Goals:

- Model cybersecurity assessment workflows
- Preserve historical assessments
- Maintain auditability
- Support future expansion

---

# 3. Domain Model

```
User
    ↓
Job Description
    ↓
Role Blueprint
    ↓
Assessment Blueprint
    ↓
Assessment
    ↓
Mission
    ↓
Response
    ↓
Evaluation
    ↓
Learning Plan
    ↓
Report
```

The **Role Blueprint** is the central domain aggregate.

---

# 4. Entity Overview

| Entity               | Description                   |
| -------------------- | ----------------------------- |
| User                 | Platform account              |
| Job Description      | Uploaded role specification   |
| Role Blueprint       | Canonical role representation |
| Competency           | Reusable competency catalog   |
| Assessment Blueprint | Generated assessment plan     |
| Assessment           | Candidate assessment session  |
| Mission              | Assessment task               |
| Response             | Candidate answer              |
| Evaluation           | Scoring and evidence          |
| Learning Plan        | Personalized roadmap          |
| Report               | Final assessment output       |
| Audit Log            | System history                |

---

# 5. Core Relationships

```
User
1
    │
    N
    ↓
Job Description
1
    ↓
1..N
Role Blueprint
1
    ↓
1..N
Assessment Blueprint
1
    ↓
1..N
Assessment
1
    ↓
1..N
Mission
1
    ↓
1
Response
1
    ↓
1
Evaluation
1
    ↓
1
Report
```

Learning Plans are generated from Evaluations and linked back to Assessments.

---

# 6. Cardinality

| Relationship                          | Cardinality     |
| ------------------------------------- | --------------- |
| User → Job Description                | 1:N             |
| Job Description → Role Blueprint      | 1:N (versioned) |
| Role Blueprint → Assessment Blueprint | 1:N             |
| Assessment Blueprint → Assessment     | 1:N             |
| Assessment → Mission                  | 1:N             |
| Mission → Response                    | 1:1 (MVP)       |
| Response → Evaluation                 | 1:1             |
| Assessment → Learning Plan            | 1:1             |
| Assessment → Report                   | 1:N (versioned) |

---

# 7. Primary Keys

Every entity uses UUID.

| Entity                | Primary Key |
| --------------------- | ----------- |
| users                 | id          |
| job_descriptions      | id          |
| role_blueprints       | id          |
| competencies          | id          |
| assessment_blueprints | id          |
| assessments           | id          |
| missions              | id          |
| responses             | id          |
| evaluations           | id          |
| learning_plans        | id          |
| reports               | id          |
| audit_logs            | id          |

---

# 8. Foreign Keys

| Child Table           | Foreign Key             |
| --------------------- | ----------------------- |
| job_descriptions      | user_id                 |
| role_blueprints       | job_description_id      |
| assessment_blueprints | role_blueprint_id       |
| assessments           | assessment_blueprint_id |
| assessments           | candidate_id            |
| missions              | assessment_id           |
| responses             | mission_id              |
| evaluations           | response_id             |
| learning_plans        | assessment_id           |
| reports               | assessment_id           |

---

# 9. Entity Definitions

## User

Owns:

- Job Descriptions
- Assessments
- Reports

## Job Description

Produces:

- Role Blueprint(s)

## Role Blueprint

Owns:

- Competencies
- Assessment Blueprints

Acts as the canonical role definition.

## Assessment Blueprint

Defines:

- Mission count
- Rubric version
- Duration
- Difficulty

## Assessment

Contains:

- Missions
- Status
- Candidate
- Progress

## Mission

Contains:

- Scenario
- Questions
- Evaluation criteria

## Response

Contains:

- Transcript
- Metadata
- Submission time

## Evaluation

Contains:

- Competency scores
- Evidence
- Confidence
- MITRE mapping

## Report

Contains:

- Assessment summary
- Learning roadmap
- Export data

---

# 10. Complete ER Diagram

```
+---------+
|  Users  |
+---------+
     |
     | 1:N
     |
     ▼
+-------------------+
| JobDescriptions   |
+-------------------+
     |
     | 1:N
     ▼
+-------------------+
| RoleBlueprints    |
+-------------------+
     |
     | 1:N
     ▼
+------------------------+
| AssessmentBlueprints   |
+------------------------+
     |
     | 1:N
     ▼
+-------------------+
| Assessments       |
+-------------------+
     |
     | 1:N
     ▼
+-------------------+
| Missions          |
+-------------------+
     |
     | 1:1
     ▼
+-------------------+
| Responses         |
+-------------------+
     |
     | 1:1
     ▼
+-------------------+
| Evaluations       |
+-------------------+
   |             |
   |1:1          |1:N
   ▼             ▼
+-------------------+   +-------------------+
| LearningPlans     |   | Reports           |
+-------------------+   +-------------------+
```

---

# 11. Aggregate Boundaries

Define aggregates using Domain-Driven Design.

```
User Aggregate
├── User
├── Job Descriptions
└── Reports

Role Aggregate
├── Role Blueprint
├── Competencies
└── Assessment Blueprint

Assessment Aggregate
├── Assessment
├── Missions
├── Responses
├── Evaluations
├── Learning Plan
└── Report
```

Each aggregate has one root responsible for consistency.

---

# 12. Versioning Strategy

Version these entities:

```
Role Blueprint
Assessment Blueprint
Rubric
Report
```

Never update completed assessments in place.
Create a new version instead.

---

# 13. Data Ownership

| Entity          | Owner                  |
| --------------- | ---------------------- |
| User            | Auth Module            |
| Job Description | JD Module              |
| Role Blueprint  | Role Blueprint Module  |
| Assessment      | Assessment Module      |
| Mission         | Mission Module         |
| Response        | Assessment Module      |
| Evaluation      | Cyber Reasoning Module |
| Learning Plan   | Learning Module        |
| Report          | Reporting Module       |

Ownership is by backend module, not by frontend screen.

---

# 14. Future Expansion

Additional entities:

```
Organizations
Teams
Recruiters
Assessment Templates
Question Banks
Cyber Labs
Certificates
Analytics Events
Model Runs
```

These should extend existing aggregates rather than introduce duplicate concepts.

---

# 15. Conclusion

The AegisIQ entity model is intentionally centered on immutable assessment history and the **Role Blueprint** as the canonical representation of a cybersecurity role. This provides a stable foundation for assessment generation, reasoning, reporting, and future enterprise capabilities.
