# Data Flow

## Table of Contents

1. Executive Summary
2. Data Flow Philosophy
3. Core Data Objects
4. High-Level Data Flow
5. Job Description Flow
6. Role Blueprint Flow
7. Assessment Flow
8. Mission Flow
9. Response Processing
10. Cyber Reasoning Flow
11. Explainability Flow
12. Learning Flow
13. Reporting Flow
14. Database Flow
15. External Integrations
16. Error Flow
17. Data Lifecycle
18. Conclusion

---

# 1. Executive Summary

## Purpose

This document defines how information moves throughout AegisIQ.

It identifies:

- Data producers
- Data consumers
- Transformations
- Storage locations
- AI processing stages
- Validation checkpoints

---

# 2. Data Flow Philosophy

Every data object follows the same lifecycle.

```
Input
    ↓
Validation
    ↓
Transformation
    ↓
Business Logic
    ↓
Persistence
    ↓
Output
```

No data bypasses validation.

---

# 3. Core Data Objects

| Object               | Producer           | Consumer              |
| -------------------- | ------------------ | --------------------- |
| Job Description      | Candidate          | JD Intelligence       |
| Role Blueprint       | JD Intelligence    | Assessment Planner    |
| Assessment Blueprint | Assessment Planner | Mission Generator     |
| Mission              | Mission Generator  | Candidate             |
| Response             | Candidate          | Cyber Reasoning       |
| Evaluation           | Cyber Reasoning    | Explainability        |
| Learning Plan        | Learning Engine    | Candidate             |
| Report               | Reporting Engine   | Candidate / Recruiter |

---

# 4. High-Level Data Flow

```
Job Description
    ↓
Role Blueprint
    ↓
Assessment Blueprint
    ↓
Mission
    ↓
Candidate Response
    ↓
Cyber Reasoning
    ↓
Evidence
    ↓
Learning
    ↓
Report
```

Every downstream object is derived from a validated upstream object.

---

# 5. Job Description Flow

```
PDF / DOCX / TXT
    ↓
Upload API
    ↓
Validation
    ↓
Parser
    ↓
Structured Text
    ↓
AI Extraction
    ↓
Role Blueprint
```

Validation checks:

- Supported file type
- File size
- Readability
- Parsing success

---

# 6. Role Blueprint Flow

```
Structured JD
    ↓
Skill Extraction
    ↓
Competency Mapping
    ↓
Knowledge Areas
    ↓
Responsibilities
    ↓
Assessment Objectives
    ↓
Role Blueprint
```

The Role Blueprint is persisted and becomes the canonical input for later stages.

---

# 7. Assessment Flow

```
Role Blueprint
    ↓
Assessment Planner
    ↓
Difficulty Selection
    ↓
Mission Count
    ↓
Assessment Blueprint
```

Outputs include:

- Duration
- Competencies
- Mission order
- Rubric references

---

# 8. Mission Flow

```
Assessment Blueprint
    ↓
Mission Template
    ↓
Scenario Generator
    ↓
Adaptive Questions
    ↓
Mission Package
```

Mission Package contains:

- Scenario
- Objectives
- Questions
- Expected reasoning
- Evaluation rubric

---

# 9. Response Processing

```
Voice / Text
    ↓
Transcript
    ↓
Normalization
    ↓
Concept Extraction
    ↓
Structured Response
```

Normalization includes:

- Cleanup
- Formatting
- Language consistency
- Metadata attachment

---

# 10. Cyber Reasoning Flow

```
Structured Response
    ↓
Concept Detection
    ↓
Workflow Validation
    ↓
Decision Analysis
    ↓
Risk Analysis
    ↓
MITRE Mapping
    ↓
Competency Scores
    ↓
Evidence
```

Outputs:

- Scores
- Evidence
- Missing concepts
- Confidence values

---

# 11. Explainability Flow

```
Evaluation
    ↓
Evidence Builder
    ↓
Strengths
    ↓
Weaknesses
    ↓
Recommendations
    ↓
Explainable Assessment
```

Every explanation references specific observations from the evaluation stage.

---

# 12. Learning Flow

```
Competency Scores
    ↓
Weak Areas
    ↓
Learning Objectives
    ↓
Recommended Topics
    ↓
Suggested Labs
    ↓
Learning Roadmap
```

Recommendations remain traceable to competency gaps.

---

# 13. Reporting Flow

```
Assessment
    ↓
Evaluation
    ↓
Evidence
    ↓
Learning
    ↓
Report Builder
    ↓
Candidate Report
    ↓
Recruiter Report
```

Exports:

- JSON
- PDF

---

# 14. Database Flow

```
User
    ↓
Job Description
    ↓
Role Blueprint
    ↓
Assessment
    ↓
Mission
    ↓
Response
    ↓
Evaluation
    ↓
Report
```

Persistence rules:

- Store immutable assessment snapshots.
- Preserve evaluation history.
- Version Role Blueprints and rubrics.

---

# 15. External Integrations

Current:

```
Browser Speech API
    ↓
FastAPI
    ↓
LLM Provider
    ↓
PostgreSQL
```

Future:

- LMS integration
- ATS integration
- Enterprise SSO
- Cyber range platforms

---

# 16. Error Flow

### Invalid Upload

```
Upload
    ↓
Validation Error
    ↓
User Feedback
    ↓
Retry
```

### AI Failure

```
Prompt
    ↓
Timeout
    ↓
Retry
    ↓
Fallback
    ↓
Continue
```

### Database Failure

```
Write
    ↓
Retry
    ↓
Graceful Error
    ↓
Audit Log
```

---

# 17. Data Lifecycle

```
Create
    ↓
Validate
    ↓
Transform
    ↓
Store
    ↓
Use
    ↓
Archive
    ↓
Delete
```

Retention principles:

- Keep assessment history versioned.
- Allow users to delete personal reports where appropriate.
- Avoid storing unnecessary raw voice recordings.
- Archive historical Role Blueprints instead of overwriting them.

---

# 18. Conclusion

AegisIQ is built around a deterministic data pipeline where every transformation is explicit, validated, and traceable. The **Role Blueprint** acts as the canonical domain object, ensuring consistency across assessment generation, reasoning, reporting, and learning recommendations.
