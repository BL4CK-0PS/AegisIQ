# AegisIQ — AI Cognitive Architecture

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | AI Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

This document defines the AI Cognitive Architecture powering AegisIQ. Unlike traditional AI interview systems that directly ask an LLM to score candidates, AegisIQ separates generation, reasoning, validation, explainability, and recommendation into independent AI modules.

This architecture improves transparency, consistency, and maintainability.

---

## 2. AI Design Philosophy

The AI subsystem follows five principles.

```
AI Assists
    ↓
Rules Validate
    ↓
Evidence Explains
    ↓
Humans Decide
    ↓
Learning Improves
```

Large Language Models are **reasoning assistants**, not autonomous decision makers.

---

## 3. Cognitive Architecture

```
                Job Description
                        │
                        ▼
           Role Blueprint Intelligence
                        │
                        ▼
             Assessment Planner
                        │
                        ▼
              Mission Generator
                        │
                        ▼
             Assessment Session
                        │
                        ▼
          Transcript Processing
                        │
                        ▼
          Cyber Reasoning Engine
                        │
                        ▼
          Explainability Engine
                        │
                        ▼
             Learning Engine
                        │
                        ▼
                Report Generator
```

---

## 4. AI Layer

```
                AI Orchestrator
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
Role Intelligence   Mission AI    Evaluation AI
     │                 │                 │
     └─────────────────┼─────────────────┘
                       ▼
              Explainability AI
                       ▼
                Learning AI
```

The orchestrator coordinates specialized AI tasks rather than relying on a single prompt.

---

## 5. AI Components

| Component | Responsibility |
|---|---|
| Role Intelligence | Parse job descriptions |
| Assessment Planner | Build assessment blueprint |
| Mission Generator | Generate cyber scenarios |
| Transcript Analyzer | Normalize candidate responses |
| Concept Extractor | Identify cybersecurity concepts |
| Cyber Reasoning | Evaluate technical reasoning |
| Explainability | Generate evidence-backed explanations |
| Learning Engine | Produce improvement roadmap |

---

## 6. End-to-End AI Pipeline

```
Job Description
    ↓
Parser
    ↓
Role Blueprint
    ↓
Assessment Plan
    ↓
Mission Generation
    ↓
Candidate Response
    ↓
Transcript
    ↓
Concept Extraction
    ↓
Reasoning
    ↓
Evidence
    ↓
Learning
    ↓
Report
```

Each stage produces structured output consumed by the next stage.

---

## 7. Role Blueprint Intelligence

**Inputs:** Job Description, role title, responsibilities, required skills

**Processing — Extract:** Competencies, seniority, knowledge domains, assessment objectives

**Outputs:** Role Blueprint, Competency Graph, Assessment Objectives

---

## 8. Assessment Planning

The planner determines:

- Number of missions
- Difficulty progression
- Competency coverage
- Estimated duration
- Evaluation rubric selection

Example:

```
SOC Analyst
    ↓
4 Missions
    ↓
12 Questions
    ↓
45 Minutes
```

---

## 9. Mission Generation

Mission creation pipeline:

```
Role Blueprint
    ↓
Mission Template
    ↓
Scenario Context
    ↓
Adaptive Questions
    ↓
Expected Reasoning
    ↓
Evaluation Criteria
```

Mission categories: SOC Operations, Digital Forensics, Incident Response, Threat Hunting, Malware Analysis, Cloud Security, Identity and Access Management.

---

## 10. Cyber Reasoning Engine

This is the core intelligence of AegisIQ.

```
Transcript
    ↓
Normalize
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
    ↓
Evidence Generation
```

Unlike generic AI scoring, evaluation is constrained by cybersecurity workflows and structured rubrics.

The LLM should extract information, summarize, and generate explanations. The deterministic parts should calculate scores, validate workflows, enforce rubrics, and determine competency levels.

### Hybrid Evaluation Pipeline

```
Candidate Response
    ↓
LLM Extraction
    ↓
Structured Concepts
    ↓
Rule Engine
    ↓
Rubric Engine
    ↓
Competency Calculator
    ↓
Evidence Builder
    ↓
LLM Explainability
```

---

## 11. Explainability Engine

Purpose: Transform evaluation results into transparent explanations.

**Outputs:** Strengths, weaknesses, missing concepts, supporting evidence, confidence level, improvement recommendations.

Every score must be traceable to observed evidence.

---

## 12. Learning Engine

Pipeline:

```
Competency Scores
    ↓
Weak Skills
    ↓
Learning Objectives
    ↓
Recommended Topics
    ↓
Suggested Labs
    ↓
Reassessment Plan
```

Recommendations are linked to specific competency gaps.

---

## 13. Prompt Orchestration

Instead of one monolithic prompt, use specialized prompts:

| Prompt | Purpose |
|---|---|
| System Prompt | Global platform rules |
| Role Extraction Prompt | Build Role Blueprint |
| Assessment Planning Prompt | Generate assessment plan |
| Mission Prompt | Create scenarios |
| Evaluation Prompt | Analyze responses |
| Explainability Prompt | Produce evidence-backed feedback |
| Learning Prompt | Generate roadmap |

Each prompt returns structured JSON validated before downstream processing.

---

## 14. AI Safety

Controls include:

- Prompt isolation
- Structured output schemas
- Input sanitization
- Output validation
- Hallucination detection
- Confidence thresholds
- Graceful fallback messaging

The AI never directly determines hiring outcomes.

---

## 15. Failure Recovery

### LLM Timeout

```
Retry → Fallback Message → Preserve Session → Continue Assessment
```

### Invalid JSON

```
Validate → Repair Attempt → Retry → Abort with Error
```

### Low Confidence

```
Flag Result → Request Human Review → Continue
```

---

## 16. Model Strategy

### MVP

- Single high-quality LLM
- Structured JSON outputs
- Deterministic post-processing

### Future

- Router model
- Specialized reasoning models
- Evaluation ensemble
- Local inference for sensitive deployments
- Domain-specific fine-tuned models

---

## 17. Future Evolution

Future AI capabilities:

- Retrieval-Augmented Generation (RAG) over cybersecurity knowledge bases
- NICE Workforce Framework alignment
- Multi-agent orchestration
- Continuous rubric learning
- Assessment quality analytics
- Adaptive difficulty calibration
- Enterprise knowledge integration

---

## 18. Conclusion

The AegisIQ AI architecture is intentionally modular. Each stage has a single responsibility, produces structured outputs, and feeds validated information into the next stage. This approach increases transparency, reduces coupling, and makes the platform easier to test, maintain, and evolve.

---

## AI Pipeline Summary

```
Role Intelligence
    ↓
Assessment Planning
    ↓
Mission Generation
    ↓
Cyber Reasoning
    ↓
Explainability
    ↓
Learning
    ↓
Reporting
```

Each module can be tested independently while contributing to the overall assessment workflow.

---

## 19. References

| Reference | Document |
|---|---|
| System architecture | `../04-architecture/16-system-architecture.md` |
| Feature specification | `../03-experience/14-feature-specification.md` |
| Backend architecture | `../04-architecture/18-backend-architecture.md` |
| Data flow | `../04-architecture/20-data-flow.md` |
