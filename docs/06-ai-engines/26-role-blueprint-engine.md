# Role Blueprint Engine

## Table of Contents

1. Executive Summary
2. Purpose
3. Design Philosophy
4. Engine Overview
5. Inputs
6. Processing Pipeline
7. Knowledge Graph Construction
8. Competency Mapping
9. Skill Taxonomy
10. Assessment Objective Generation
11. Difficulty Estimation
12. Output Model
13. Validation
14. Error Handling
15. Versioning
16. Future Evolution
17. Conclusion

---

# 1. Executive Summary

## Engine Name

**Role Blueprint Engine (RBE)**

## Purpose

Transform an unstructured cybersecurity job description into a structured, versioned **Role Blueprint** that becomes the canonical representation of the target role.

Every downstream module depends on this output.

---

# 2. Design Philosophy

The engine follows one principle:

> **Job Descriptions are unstructured documents. Role Blueprints are structured domain models.**

The engine exists to bridge that gap.

---

# 3. Engine Overview

```
Job Description
    ↓
Parser
    ↓
Text Normalization
    ↓
Role Extraction
    ↓
Competency Mapping
    ↓
Knowledge Graph
    ↓
Assessment Objectives
    ↓
Difficulty Estimation
    ↓
Role Blueprint
```

---

# 4. Inputs

Supported formats:

- PDF
- DOCX
- TXT

Input fields:

- Job title
- Responsibilities
- Required skills
- Preferred skills
- Certifications
- Experience
- Technologies
- Domain

---

# 5. Processing Pipeline

```
Upload
    ↓
OCR / Parsing
    ↓
Normalization
    ↓
Entity Extraction
    ↓
Role Classification
    ↓
Competency Mapping
    ↓
Objective Generation
    ↓
Blueprint Validation
    ↓
Persistence
```

---

# 6. Knowledge Graph Construction

Extract relationships between:

```
Role
    ↓
Skill
    ↓
Knowledge Area
    ↓
Responsibility
    ↓
Competency
    ↓
Learning Objective
```

Example:

```
SOC Analyst
    ↓
Log Analysis
    ↓
SIEM
    ↓
Threat Detection
    ↓
Incident Investigation
```

---

# 7. Competency Mapping

Competencies are normalized using a controlled catalog.

Example categories:

| Category          | Examples                                |
| ----------------- | --------------------------------------- |
| Network Security  | Packet analysis, IDS, Firewalls         |
| Incident Response | Triage, Containment, Recovery           |
| Threat Hunting    | IOC analysis, Hypothesis-driven hunting |
| Cloud Security    | IAM, CSPM, Logging                      |
| Malware           | Static and dynamic analysis             |
| Identity          | Authentication, Authorization, MFA      |

Future mappings may include the NICE Workforce Framework.

---

# 8. Skill Taxonomy

Hierarchy:

```
Domain
    ↓
Competency
    ↓
Skill
    ↓
Knowledge Area
    ↓
Learning Objective
```

Example:

```
Cloud Security
    ↓
IAM
    ↓
Privilege Management
    ↓
Least Privilege
    ↓
Implement secure access controls
```

---

# 9. Assessment Objective Generation

Generate measurable objectives such as:

- Investigate security incidents
- Prioritize response actions
- Analyze logs
- Identify attack techniques
- Explain mitigation strategies
- Communicate findings

Objectives should be observable and assessable.

---

# 10. Difficulty Estimation

Inputs:

- Years of experience
- Breadth of skills
- Seniority indicators
- Responsibilities

Output levels:

| Level        | Description               |
| ------------ | ------------------------- |
| Beginner     | Entry-level / internship  |
| Intermediate | SOC L1/L2                 |
| Advanced     | Senior analyst / engineer |
| Expert       | Architect / Lead          |

Difficulty influences mission complexity and rubric selection.

---

# 11. Output Model

The Role Blueprint contains:

```
Role Title
Version
Competencies
Skills
Knowledge Areas
Responsibilities
Assessment Objectives
Difficulty
Estimated Duration
Recommended Rubric
```

Stored as an immutable, versioned domain object.

---

# 12. Validation

Validation stages:

```
Schema Validation
    ↓
Business Rules
    ↓
Competency Coverage
    ↓
Consistency Checks
    ↓
Version Assignment
```

Checks include:

- Required competencies exist.
- Objectives align with extracted skills.
- Difficulty is internally consistent.
- Duplicate competencies are merged.

---

# 13. Error Handling

### Invalid Document

```
Upload
    ↓
Parse Failure
    ↓
User Feedback
    ↓
Retry
```

### Low Confidence Extraction

```
Extraction
    ↓
Confidence Check
    ↓
Manual Review Flag
    ↓
Continue
```

### Missing Information

```
Infer Safely
    ↓
Flag Assumptions
    ↓
Generate Blueprint
```

Assumptions should be explicitly marked rather than hidden.

---

# 14. Versioning

Version:

- Role Blueprint
- Competency mappings
- Assessment objectives

Rules:

- Never overwrite an existing blueprint.
- Every regeneration creates a new version.
- Downstream assessments reference the exact blueprint version used.

---

# 15. Future Evolution

Potential enhancements:

- NICE Workforce Framework mapping
- Organization-specific competency libraries
- Industry-specific role templates
- Multi-language parsing
- RAG over internal competency repositories
- Automatic rubric generation
- Historical role comparison

---

# 16. Conclusion

The Role Blueprint Engine transforms inconsistent, free-form job descriptions into structured, reusable, and versioned role definitions. By making the **Role Blueprint** the canonical domain object, AegisIQ creates a stable foundation for assessment generation, reasoning, reporting, and learning.
