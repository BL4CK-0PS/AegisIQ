# Capability Reasoning Engine

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
10. Capability Scoring
11. Evidence Generation
12. Confidence Estimation
13. Validation
14. Failure Recovery
15. AI Mentor Principle
16. Future Evolution
17. Conclusion

---

# 1. Executive Summary

## Engine Name

**Capability Reasoning Engine (CRE)**

## Purpose

The Capability Reasoning Engine evaluates a professional's cybersecurity reasoning process rather than simply checking for correct answers.

It transforms structured professional responses into capability scores, evidence, confidence estimates, and explainable assessments.

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

Professionals are assessed on reasoning quality, not keyword matching.

---

# 3. Engine Overview

```
Professional Response
    ↓
Transcript Processing
    ↓
Concept Extraction
    ↓
Workflow Validation
    ↓
Decision Analysis
    ↓
Capability Scoring
    ↓
Evidence Builder
    ↓
Evidence Intelligence Engine
```

Each stage produces structured outputs for the next stage.

---

# 4. Inputs

Required inputs:

- Professional transcript
- Challenge Package
- Skill DNA Profile
- Capability Blueprint
- Rubric Version

Optional inputs:

- Previous challenge evaluations
- Historical capability profile
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
Capability Mapping
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

Concepts are mapped to a normalized capability catalog.

---

# 7. Workflow Validation

Evaluate whether the professional follows a valid cybersecurity process.

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

# 9. Capability Scoring

Capabilities are scored independently.

Example:

| Capability         | Weight | Score |
| ------------------ | -----: | ----: |
| Incident Response  |    30% |    86 |
| Threat Hunting     |    20% |    74 |
| Network Security   |    20% |    91 |
| Communication      |    15% |    82 |
| Risk Analysis      |    15% |    79 |

Final assessment combines weighted capability scores.

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
Capability
```

Evidence is immutable once generated.

---

# 11. Confidence Estimation

Confidence depends on:

- Transcript quality
- Capability coverage
- Evaluation completeness
- Ambiguity level

Levels:

| Confidence | Meaning                                      |
| ---------- | -------------------------------------------- |
| High       | Strong evidence across capabilities          |
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
Capability Coverage
    ↓
Evidence Consistency
    ↓
Final Evaluation
```

Rules:

- Every capability score requires evidence.
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

# 14. AI Mentor Principle

The Capability Reasoning Engine operates under the **AI Mentor** principle:

> **AI MUST NEVER answer assessments — only mentor and explain.**

The engine evaluates professional reasoning processes but never generates answers or completes challenges. Scoring is based solely on the professional's own responses. The engine provides structured feedback on reasoning quality to support the mentoring process.

---

# 15. Future Evolution

Potential enhancements:

- Graph-based reasoning validation
- Skill DNA Graph traversal
- Multi-agent evaluation
- Temporal reasoning analysis
- Cross-challenge capability tracking
- Behavioral pattern analysis
- Organization-specific rubrics

## Related Documents

- [Capability Assessment Engine](27-capability-assessment-engine.md)
- [Evidence Intelligence Engine](30-evidence-intelligence-engine.md)
- [Skill DNA Engine](26-skill-dna-engine.md)
- [Explainable AI Concept](../docs/concepts/explainable-ai.md)
- [AI Cognitive Architecture](../docs/04-architecture/17-ai-cognitive-architecture.md)

---

# 16. Conclusion

The Capability Reasoning Engine is the analytical core of PWNDORA SkillScan X. By evaluating reasoning processes instead of isolated answers, it provides fairer, more explainable, and more actionable assessments than traditional scoring systems.
