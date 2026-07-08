# Capability Intelligence Engine

## Table of Contents

1. Executive Summary
2. Purpose
3. Design Principles
4. Engine Overview
5. Assessment Lifecycle
6. Assessment Planning
7. Challenge Orchestration
8. Session Management
9. Adaptive Capability Assessment
10. State Machine
11. Evaluation Pipeline
12. Persistence
13. Error Recovery
14. Performance
15. AI Mentor Principle
16. Future Evolution
17. Conclusion

---

# 1. Executive Summary

## Engine Name

**Capability Intelligence Engine (CIE)**

## Purpose

The Capability Intelligence Engine is responsible for planning, executing, monitoring, and completing cybersecurity capability assessments.

It coordinates every assessment stage while remaining independent of AI implementation details.

---

# 2. Design Principles

The engine follows these principles:

```
Deterministic
    ↓
State Driven
    ↓
Modular
    ↓
Recoverable
    ↓
Adaptive
    ↓
Explainable
```

The Capability Intelligence Engine controls workflow, not scoring.

---

# 3. Engine Overview

```
Skill DNA Profile
    ↓
Assessment Planner
    ↓
Challenge Queue
    ↓
Assessment Session
    ↓
Response Collection
    ↓
Evaluation Pipeline
    ↓
Learning Path Engine
    ↓
Report
```

The engine orchestrates the complete assessment lifecycle.

---

# 4. Assessment Lifecycle

```
Create
    ↓
Initialize
    ↓
Execute
    ↓
Evaluate
    ↓
Complete
    ↓
Generate Report
    ↓
Archive
```

Each stage is atomic and recoverable.

---

# 5. Assessment Planning

Input:

- Skill DNA Profile
- Professional Profile (optional)
- Assessment Template
- Difficulty Level

Planner outputs:

```
Capability Blueprint
    ↓
Challenge Sequence
    ↓
Timing
    ↓
Rubrics
    ↓
Evaluation Plan
```

---

# 6. Challenge Orchestration

Challenge queue example:

```
Challenge 1
    ↓
Challenge 2
    ↓
Challenge 3
    ↓
Challenge 4
```

Each challenge contains:

- Scenario
- Objectives
- Questions
- Difficulty
- Evaluation rubric
- Time estimate

---

# 7. Session Management

Session states:

```
Created
    ↓
Ready
    ↓
Running
    ↓
Paused
    ↓
Completed
    ↓
Archived
```

Capabilities:

- Resume interrupted sessions
- Auto-save progress
- Timeout detection
- Session recovery

---

# 8. Adaptive Capability Assessment

Adaptive logic adjusts the assessment based on professional performance.

```
Response
    ↓
Evaluation
    ↓
Capability Coverage
    ↓
Difficulty Adjustment
    ↓
Next Challenge Selection
```

Possible adaptations:

- Increase complexity
- Introduce follow-up questions
- Skip redundant topics
- Explore weak capability areas

Adaptive behavior must remain bounded by the assessment objectives.

---

# 9. Assessment State Machine

```
Created
   │
   ▼
Initialized
   │
   ▼
Running
   │
 ┌─┴─────────┐
 ▼           ▼
Paused    Completed
 │           │
 ▼           ▼
Running   Report Generated
              │
              ▼
           Archived
```

Invalid state transitions must be rejected.

---

# 10. Evaluation Pipeline

```
Challenge Completed
    ↓
Response Submitted
    ↓
Transcript Processing
    ↓
Capability Reasoning
    ↓
Evidence Generation
    ↓
Capability Update
    ↓
Progress Update
```

Evaluation occurs after every completed challenge.

---

# 11. Persistence

Persist:

- Assessment metadata
- Challenge progress
- Professional responses
- Evaluation snapshots
- Session state
- Timing information

Use transactional commits after each challenge to minimize data loss.

---

# 12. Error Recovery

### Network Failure

```
Connection Lost
    ↓
Retry
    ↓
Resume Session
    ↓
Continue
```

### AI Timeout

```
Retry
    ↓
Fallback Queue
    ↓
Continue Assessment
```

### Browser Refresh

```
Session Restore
    ↓
Reload Progress
    ↓
Continue
```

---

# 13. Performance

Target metrics:

| Metric                    | Target        |
| ------------------------- | ------------- |
| Assessment initialization | < 3 s         |
| Challenge load            | < 1 s         |
| Progress save             | < 500 ms      |
| Resume session            | < 2 s         |
| Assessment completion     | ≥ 99% success |

---

# 14. AI Mentor Principle

The Capability Intelligence Engine operates under the **AI Mentor** principle:

> **AI MUST NEVER answer assessments — only mentor and explain.**

The engine orchestrates assessment flow and adapts challenge difficulty, but never provides answers to challenges or completes assessments on behalf of professionals. Adaptation is limited to structural adjustments (difficulty, coverage) — never answer generation.

---

# 15. Future Evolution

Potential enhancements:

- Parallel assessment branches
- Collaborative assessments
- Real-time analyst participation
- Adaptive time allocation
- Multi-stage enterprise assessments
- Simulation-based exercises

## Related Documents

- [Skill DNA Engine](26-skill-dna-engine.md)
- [Practical Challenge Engine](28-practical-challenge-engine.md)
- [Capability Reasoning Engine](29-capability-reasoning-engine.md)
- [Adaptive Assessment Concept](../docs/concepts/evidence-based-assessment.md)
- [User Workflows](../docs/03-functional-design/13-user-workflows.md)

---

# 16. Conclusion

The Capability Intelligence Engine is the orchestration layer that transforms a static Skill DNA Profile into a dynamic capability assessment experience. It coordinates planning, execution, adaptation, persistence, and recovery while delegating evaluation and explanation to specialized engines.
