# Cyber Reasoning Engine

## Table of Contents

1. Executive Summary
2. Purpose
3. Design Philosophy
4. Engine Overview
5. Inputs
6. Processing Pipeline
7. Concept Extraction
8. Workflow Validation
9. Decision Analysis
10. Competency Scoring
11. Evidence Generation
12. Confidence Estimation
13. Validation
14. Failure Recovery
15. Future Evolution
16. Conclusion

---

# 1. Executive Summary

## Engine Name

**Cyber Reasoning Engine (CRE)**

## Purpose

The Cyber Reasoning Engine evaluates a candidate's cybersecurity reasoning process rather than simply checking for correct answers.

It transforms structured candidate responses into competency scores, evidence, confidence estimates, and explainable assessments.

---

# 2. Design Philosophy

The engine follows this philosophy:

```
Observe
    ↓
Understand
    ↓
Validate
    ↓
Evaluate
    ↓
Explain
```

Candidates are assessed on reasoning quality, not keyword matching.

---

# 3. Engine Overview

```
Candidate Response
    ↓
Transcript Processing
    ↓
Concept Extraction
    ↓
Workflow Validation
    ↓
Decision Analysis
    ↓
Competency Scoring
    ↓
Evidence Builder
    ↓
Explainability Engine
```

Each stage produces structured outputs for the next stage.

---

# 4. Inputs

Required inputs:

- Candidate transcript
- Mission Package
- Role Blueprint
- Assessment Blueprint
- Rubric Version

Optional inputs:

- Previous mission evaluations
- Historical competency profile
- Adaptive assessment context

---

# 5. Processing Pipeline

```
Transcript
    ↓
Normalization
    ↓
Concept Extraction
    ↓
Workflow Validation
    ↓
Decision Analysis
    ↓
Risk Assessment
    ↓
Competency Mapping
    ↓
Evidence Generation
    ↓
Evaluation
```

The pipeline is deterministic after transcript interpretation.

---

# 6. Concept Extraction

Identify:

- Technical concepts
- Security controls
- Tools
- Attack techniques
- Defensive strategies
- Terminology

Example:

```
Response
    ↓
"Investigate logs"
    ↓
Log Analysis
    ↓
SIEM Investigation
    ↓
Threat Detection
```

Concepts are mapped to a normalized competency catalog.

---

# 7. Workflow Validation

Evaluate whether the candidate follows a valid cybersecurity process.

Example Incident Response workflow:

```
Detection
    ↓
Triage
    ↓
Containment
    ↓
Eradication
    ↓
Recovery
    ↓
Lessons Learned
```

Checks:

- Missing steps
- Incorrect order
- Unsafe actions
- Unsupported assumptions

---

# 8. Decision Analysis

Evaluate:

- Technical correctness
- Prioritization
- Risk awareness
- Trade-off reasoning
- Communication quality

Example:

```
Observed Action
    ↓
Intent
    ↓
Expected Outcome
    ↓
Risk
    ↓
Decision Quality
```

---

# 9. Competency Scoring

Competencies are scored independently.

Example:

| Competency        | Weight | Score |
| ----------------- | -----: | ----: |
| Incident Response |    30% |    86 |
| Threat Hunting    |    20% |    74 |
| Network Security  |    20% |    91 |
| Communication     |    15% |    82 |
| Risk Analysis     |    15% |    79 |

Final assessment combines weighted competency scores.

---

# 10. Evidence Generation

Every score must be supported.

Evidence includes:

- Referenced concepts
- Correct workflow steps
- Missing reasoning
- Strong decisions
- Weak decisions
- Observed behaviors

Example:

```
Score
    ↓
Supporting Evidence
    ↓
Observed Transcript
    ↓
Competency
```

Evidence is immutable once generated.

---

# 11. Confidence Estimation

Confidence depends on:

- Transcript quality
- Competency coverage
- Evaluation completeness
- Ambiguity level

Levels:

| Confidence | Meaning                                      |
| ---------- | -------------------------------------------- |
| High       | Strong evidence across competencies          |
| Medium     | Minor ambiguity                              |
| Low        | Insufficient evidence or conflicting signals |

Low-confidence evaluations should be flagged for review.

---

# 12. Validation

Validation pipeline:

```
Schema Validation
    ↓
Rubric Validation
    ↓
Competency Coverage
    ↓
Evidence Consistency
    ↓
Final Evaluation
```

Rules:

- Every competency score requires evidence.
- Every recommendation references an observed gap.
- No score is generated without rubric alignment.

---

# 13. Failure Recovery

### Transcript Parsing Failure

```
Retry
    ↓
Fallback Parsing
    ↓
Continue
```

### Low Confidence

```
Flag Evaluation
    ↓
Generate Review Notice
    ↓
Continue Pipeline
```

### Invalid Evaluation

```
Validation Failure
    ↓
Repair Attempt
    ↓
Retry
    ↓
Reject
```

---

# 14. Future Evolution

Potential enhancements:

- Graph-based reasoning validation
- Knowledge graph traversal
- Multi-agent evaluation
- Temporal reasoning analysis
- Cross-mission competency tracking
- Behavioral pattern analysis
- Organization-specific rubrics

---

# 15. Conclusion

The Cyber Reasoning Engine is the analytical core of AegisIQ. By evaluating reasoning processes instead of isolated answers, it provides fairer, more explainable, and more actionable assessments than traditional interview scoring systems.
