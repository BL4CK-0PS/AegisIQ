# Practical Challenge Engine

## Table of Contents

1. Executive Summary
2. Purpose
3. Design Philosophy
4. Engine Overview
5. Inputs
6. Challenge Planning Pipeline
7. Challenge Templates
8. Adaptive Generation
9. Difficulty Scaling
10. Rubric Association
11. Validation
12. Output Model
13. Failure Recovery
14. AI Mentor Principle
15. Future Evolution
16. Conclusion

---

# 1. Executive Summary

## Engine Name

**Practical Challenge Engine (PCE)**

## Purpose

Generate realistic cybersecurity assessment challenges based on a Skill DNA Profile and Capability Blueprint.

Each challenge is designed to evaluate one or more capabilities using structured scenarios rather than isolated interview questions.

---

# 2. Design Philosophy

Challenge generation follows:

```
Skill DNA Profile
    ↓
Assessment Objectives
    ↓
Challenge Planning
    ↓
Scenario Generation
    ↓
Evaluation Rubric
    ↓
Challenge Package
```

Challenges evaluate reasoning, not memorization.

---

# 3. Engine Overview

```
Skill DNA Profile
    ↓
Capability Blueprint
    ↓
Challenge Planner
    ↓
Challenge Generator
    ↓
Validation
    ↓
Challenge Package
    ↓
Capability Intelligence Engine
```

---

# 4. Inputs

Required inputs:

- Skill DNA Profile
- Capability Blueprint
- Capability coverage targets
- Difficulty level
- Challenge template library

Optional inputs:

- Professional history
- Organization preferences
- Assessment duration
- Industry domain

---

# 5. Challenge Planning Pipeline

```
Capability Blueprint
    ↓
Capability Selection
    ↓
Challenge Template
    ↓
Scenario Generation
    ↓
Question Generation
    ↓
Expected Reasoning
    ↓
Rubric Mapping
    ↓
Challenge Package
```

Each challenge must satisfy at least one assessment objective.

---

# 6. Challenge Templates

Supported templates:

| Template          | Purpose                                    |
| ----------------- | ------------------------------------------ |
| SOC Investigation | Log analysis and triage                    |
| Incident Response | Detection, containment, recovery           |
| Threat Hunting    | IOC analysis and hypothesis testing        |
| Malware Analysis  | Static and behavioral reasoning            |
| Cloud Security    | IAM, CSPM, logging                         |
| Network Security  | Traffic analysis and firewall rules        |
| Identity Security | Authentication and authorization           |
| DFIR              | Evidence collection and forensic reasoning |

Templates define structure, not content.

---

# 7. Adaptive Generation

Challenge selection adapts using:

```
Previous Responses
    ↓
Capability Coverage
    ↓
Confidence
    ↓
Remaining Objectives
    ↓
Next Challenge
```

Adaptive rules:

- Cover uncovered capabilities.
- Increase difficulty after consistently strong performance.
- Explore weak reasoning areas.
- Avoid unnecessary repetition.

---

# 8. Difficulty Scaling

Difficulty dimensions:

- Scenario complexity
- Number of indicators
- Ambiguity
- Time pressure
- Required knowledge depth

Levels:

| Level        | Characteristics                                 |
| ------------ | ----------------------------------------------- |
| Beginner     | Guided scenarios                                |
| Intermediate | Moderate ambiguity                              |
| Advanced     | Multiple attack paths                           |
| Expert       | Incomplete information and competing priorities |

Difficulty should evolve without violating assessment fairness.

---

# 9. Rubric Association

Every challenge references one rubric version.

Example:

```
Challenge
    ↓
Assessment Objective
    ↓
Capabilities
    ↓
Evaluation Criteria
    ↓
Rubric Version
```

The challenge never embeds scoring logic directly.

---

# 10. Validation

Validation stages:

```
Schema Validation
    ↓
Capability Coverage
    ↓
Difficulty Check
    ↓
Template Validation
    ↓
Challenge Approval
```

Checks include:

- Required fields present
- Scenario consistency
- Objective alignment
- Rubric availability
- Duplicate detection

---

# 11. Output Model

Challenge Package:

```
Challenge ID
Title
Scenario
Objectives
Capabilities
Questions
Hints (optional)
Expected Reasoning
Rubric Reference
Estimated Duration
```

Challenge Packages are immutable once an assessment begins.

---

# 12. Failure Recovery

### Generation Failure

```
Retry
    ↓
Fallback Template
    ↓
Generate Challenge
```

### Invalid Output

```
Schema Validation
    ↓
Repair
    ↓
Retry
```

### Missing Capability Coverage

```
Coverage Analysis
    ↓
Generate Supplemental Challenge
```

---

# 13. AI Mentor Principle

The Practical Challenge Engine operates under the **AI Mentor** principle:

> **AI MUST NEVER answer assessments — only mentor and explain.**

The engine generates realistic cybersecurity scenarios and questions designed to evaluate professional reasoning, but never provides answers, hints that reveal solutions, or completes challenges on behalf of professionals. All generated challenges must maintain assessment integrity.

---

# 14. Future Evolution

Future capabilities:

- Multi-stage attack simulations
- Branching challenge trees
- Cyber range integration
- Threat intelligence enrichment
- Organization-specific challenge libraries
- Red Team / Blue Team exercises
- Live SOC replay scenarios

## Related Documents

- [Skill DNA Engine](26-skill-dna-engine.md)
- [Capability Assessment Engine](27-capability-assessment-engine.md)
- [Capability Reasoning Engine](29-capability-reasoning-engine.md)
- [Gamification Concept](../docs/concepts/gamification.md)
- [System Features](../docs/03-functional-design/12-system-features.md)

---

# 15. Conclusion

The Practical Challenge Engine converts assessment objectives into structured, competency-driven cybersecurity scenarios. By separating templates, scenario generation, and rubric association, challenges remain reusable, explainable, and aligned with business goals.
