# Database Design

## Table of Contents

1. Executive Summary
2. Database Philosophy
3. Design Principles
4. High-Level Schema
5. Core Entities
6. Entity Relationships
7. Normalization Strategy
8. Schema Overview
9. Table Definitions
10. Indexing Strategy
11. Versioning Strategy
12. Data Integrity
13. Audit Logging
14. Performance Considerations
15. Migration Strategy
16. Backup & Recovery
17. Future Expansion
18. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines the relational database architecture for AegisIQ.

The database stores:

- Users
- Job Descriptions
- Role Blueprints
- Assessments
- Missions
- Responses
- Evaluations
- Learning Plans
- Reports

The design emphasizes normalization, immutability, and auditability.

---

# 2. Database Philosophy

Every record follows the lifecycle:

```
Create
    ↓
Validate
    ↓
Persist
    ↓
Reference
    ↓
Archive
```

Completed assessments are immutable. Updates create new versions instead of overwriting historical data.

---

# 3. Design Principles

The schema follows these principles:

- Third Normal Form (3NF)
- Strong referential integrity
- UUID primary keys
- Soft deletion where appropriate
- Immutable assessment snapshots
- Explicit versioning
- Audit-friendly design

---

# 4. High-Level Schema

```
Users
    ↓
Job Descriptions
    ↓
Role Blueprints
    ↓
Assessment Blueprints
    ↓
Assessments
    ↓
Missions
    ↓
Responses
    ↓
Evaluations
    ↓
Learning Plans
    ↓
Reports
```

Role Blueprint is the canonical business entity.

---

# 5. Core Entities

| Entity                | Purpose                        |
| --------------------- | ------------------------------ |
| users                 | User accounts                  |
| job_descriptions      | Uploaded job descriptions      |
| role_blueprints       | Canonical role representation  |
| competencies          | Normalized competency catalog  |
| assessment_blueprints | Assessment plans               |
| assessments           | Candidate assessment sessions  |
| missions              | Individual assessment missions |
| responses             | Candidate responses            |
| evaluations           | Scoring and evidence           |
| learning_plans        | Personalized recommendations   |
| reports               | Generated assessment reports   |
| audit_logs            | System activity                |

---

# 6. Entity Relationships

```
User
    │
    ├── Job Descriptions
    │
    ├── Assessments
    │
    └── Reports

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

---

# 7. Normalization Strategy

Reference data is stored separately.

Examples:

```
competencies
roles
mission_types
mitre_techniques
rubric_versions
```

Avoid storing repeated strings across assessment records.

---

# 8. Schema Overview

```
users
job_descriptions
role_blueprints
assessment_blueprints
assessments
missions
responses
evaluations
learning_plans
reports
audit_logs
```

Supporting lookup tables:

```
competencies
skills
knowledge_areas
mission_templates
rubrics
```

---

# 9. Table Definitions

## users

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| email         | VARCHAR   |
| password_hash | TEXT      |
| full_name     | VARCHAR   |
| role          | VARCHAR   |
| created_at    | TIMESTAMP |
| updated_at    | TIMESTAMP |

---

## job_descriptions

| Column      | Type      |
| ----------- | --------- |
| id          | UUID      |
| user_id     | UUID      |
| filename    | TEXT      |
| raw_text    | TEXT      |
| uploaded_at | TIMESTAMP |

---

## role_blueprints

| Column             | Type      |
| ------------------ | --------- |
| id                 | UUID      |
| job_description_id | UUID      |
| version            | INTEGER   |
| title              | VARCHAR   |
| summary            | TEXT      |
| difficulty         | VARCHAR   |
| created_at         | TIMESTAMP |

---

## competencies

| Column      | Type    |
| ----------- | ------- |
| id          | UUID    |
| name        | VARCHAR |
| category    | VARCHAR |
| description | TEXT    |

---

## assessment_blueprints

| Column            | Type    |
| ----------------- | ------- |
| id                | UUID    |
| role_blueprint_id | UUID    |
| duration_minutes  | INTEGER |
| mission_count     | INTEGER |
| rubric_version    | UUID    |

---

## assessments

| Column       | Type      |
| ------------ | --------- |
| id           | UUID      |
| blueprint_id | UUID      |
| candidate_id | UUID      |
| status       | VARCHAR   |
| started_at   | TIMESTAMP |
| completed_at | TIMESTAMP |

---

## missions

| Column        | Type    |
| ------------- | ------- |
| id            | UUID    |
| assessment_id | UUID    |
| mission_type  | VARCHAR |
| scenario      | TEXT    |
| sequence      | INTEGER |

---

## responses

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| mission_id    | UUID      |
| transcript    | TEXT      |
| response_type | VARCHAR   |
| submitted_at  | TIMESTAMP |

---

## evaluations

| Column      | Type    |
| ----------- | ------- |
| id          | UUID    |
| response_id | UUID    |
| score       | DECIMAL |
| confidence  | DECIMAL |
| evidence    | JSONB   |

---

## learning_plans

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| assessment_id | UUID      |
| roadmap       | JSONB     |
| generated_at  | TIMESTAMP |

---

## reports

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| assessment_id | UUID      |
| report_json   | JSONB     |
| pdf_path      | TEXT      |
| created_at    | TIMESTAMP |

---

# 10. Indexing Strategy

Create indexes on:

- user_id
- assessment_id
- role_blueprint_id
- job_description_id
- created_at
- status

Composite indexes:

```
(candidate_id, status)
(assessment_id, sequence)
(role_blueprint_id, version)
```

---

# 11. Versioning Strategy

Version these entities:

- Role Blueprints
- Rubrics
- Assessment Blueprints
- Reports

Never overwrite historical records.

---

# 12. Data Integrity

Enforce:

- Foreign keys
- Unique constraints
- Check constraints
- Cascading rules where appropriate
- Transaction boundaries for assessment completion

---

# 13. Audit Logging

Track:

- User login
- JD upload
- Assessment start
- Assessment completion
- Report generation
- Administrative changes

Suggested fields:

```
id
user_id
action
entity
entity_id
metadata
timestamp
```

---

# 14. Performance Considerations

Guidelines:

- Use JSONB only for flexible AI outputs.
- Keep transactional data relational.
- Avoid large joins in report generation by precomputing summaries where needed.
- Paginate dashboard queries.

---

# 15. Migration Strategy

Use:

- Alembic
- Incremental migrations
- Reversible migrations
- Seed scripts for lookup tables

Never edit historical migrations after they have been applied.

---

# 16. Backup & Recovery

For MVP:

- Daily database backup
- Export assessment reports
- Backup migration scripts

Future:

- Point-in-time recovery
- Automated snapshot retention
- Cross-region replication

---

# 17. Future Expansion

Additional tables may include:

- organizations
- teams
- recruiter_invites
- assessment_templates
- certification_tracks
- cohort_results
- analytics_events
- ai_model_runs

These should extend the schema without breaking existing relationships.

---

# 18. Conclusion

The AegisIQ database is centered around immutable assessment history and the **Role Blueprint** as the canonical domain model. This structure supports reproducibility, explainability, and future enterprise capabilities while remaining practical for an MVP.
