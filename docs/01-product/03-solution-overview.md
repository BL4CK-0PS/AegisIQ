# AegisIQ — Solution Overview

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Public |
| **Last Updated** | 2026-07-08 |
| **Owner** | Product Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

### Product Name

AegisIQ

### Product Category

Cybersecurity Competency Intelligence Platform

### Description

AegisIQ is an Explainable AI platform designed to evaluate cybersecurity competency through adaptive incident-driven assessments. Instead of measuring memorized answers, the platform measures technical reasoning, operational decision-making, incident response workflow, communication, and cybersecurity knowledge using structured AI pipelines and evidence-backed evaluation.

AegisIQ acts as a **decision-support platform** for recruiters while simultaneously providing candidates with personalized learning recommendations. It augments human hiring decisions — it does not replace them.

---

## 2. Solution Philosophy

Traditional interview platforms evaluate **what a candidate says**. AegisIQ evaluates **how a candidate thinks**.

Instead of asking isolated interview questions, AegisIQ creates realistic cybersecurity missions where every decision influences the next stage of the assessment. The objective is to measure operational readiness rather than theoretical recall.

| Traditional Approach | AegisIQ Approach |
|---|---|
| Question → Answer → Score | Mission → Decision → Reasoning → Evidence → Profile |
| Measures recall | Measures thinking |
| Static difficulty | Adaptive ±2 sigma |
| Single score | Multi-dimensional competency profile |
| Black box | Explainable with evidence citations |

---

## 3. Product Overview

AegisIQ combines multiple intelligent modules into one integrated platform. The system performs job description analysis, competency identification, assessment planning, mission generation, adaptive assessment, cyber reasoning evaluation, explainable AI analysis, and learning recommendation generation.

All assessments are grounded in cybersecurity concepts rather than generic language evaluation. The platform aligns with NICE NIST SP 800-181 and MITRE ATT&CK frameworks.

---

## 4. High-Level Solution

### 4.1 Architecture Overview

```
Role Blueprint (Primary Artifact)
      │
      ├── Job Description (one input source)
      ├── NICE Framework Mapping
      ├── MITRE ATT&CK Knowledge
      ├── Required Competencies
      └── Assessment Objectives
      │
      ▼
Assessment Blueprint
      │
      ▼
Adaptive Cyber Missions
      │
      ▼
Cyber Reasoning Engine
      │
      ▼
Explainable Evaluation
      │
      ▼
Competency Report & Learning Roadmap
```

### 4.2 Why the Role Blueprint?

A Job Description is just **one input** into a richer role model. By making the **Cybersecurity Role Blueprint** the primary artifact, AegisIQ can:

- Accept input from multiple sources (JD, framework, manual configuration)
- Support universities assessing against curriculum standards, not just job descriptions
- Enable certification bodies to map assessments to their own competency models
- Allow enterprise customers to define proprietary role templates

The JD Intelligence Engine parses job descriptions into the Role Blueprint format. Other input sources can do the same, making the system extensible beyond recruitment.

---

## 5. Core Principles

| Principle | Description |
|---|---|
| **Explainability** | Every assessment result must include supporting evidence in natural language |
| **Adaptability** | Assessments dynamically evolve based on candidate performance (±2 sigma) |
| **Cybersecurity Awareness** | Evaluation uses cybersecurity-specific knowledge models, not generic AI scoring |
| **Transparency** | Candidates understand why scores were assigned, with evidence citations |
| **Consistency** | Every candidate is evaluated using the same structured methodology and rubrics |
| **Continuous Learning** | Assessments end with actionable improvement plans and prioritized roadmaps |
| **Human Decision Support** | Platform supports hiring decisions but does not replace human interviewers |

---

## 6. Platform Workflow

```
Input Source (JD, framework, manual)
      │
      ▼
Role Blueprint Generation
      │
      ├── Parse and extract competencies
      ├── Map to NICE framework
      └── Determine assessment scope
      │
      ▼
Assessment Blueprint
      │
      ├── Mission count and topics
      ├── Difficulty range
      ├── Estimated duration
      └── Evaluation criteria
      │
      ▼
Cyber Mission Generation
      │
      ▼
Adaptive Assessment Execution
      │
      ▼
Cyber Reasoning Evaluation
      │
      ▼
Evidence Building
      │
      ▼
Explainable Report Generation
      │
      ▼
Learning Roadmap Generation
```

---

## 7. Platform Modules

### Module 1: JD Intelligence Engine

| Input | Output |
|---|---|
| Job description text | Extracted role title, seniority, skills, certifications, responsibilities, domain |

Extracts structured competency requirements from unstructured job description text. Uses LLM-based parsing with schema-enforced extraction to ensure consistent output.

### Module 2: Competency Graph Builder

| Input | Output |
|---|---|
| Extracted role requirements | Hierarchical graph of skills, concepts, frameworks, and their relationships |

Builds relationships between skills, concepts, frameworks, responsibilities, and learning objectives. The graph informs mission generation and evaluation scope.

### Module 3: Assessment Planner

| Input | Output |
|---|---|
| Competency graph + role blueprint | Mission count, question difficulty, scenario complexity, assessment duration, NICE domains to evaluate |

Determines the optimal assessment structure based on role seniority, required competencies, and evaluation depth requirements.

### Module 4: Mission Generator

| Input | Output |
|---|---|
| Assessment blueprint | Realistic cybersecurity incident scenarios with operational context |

Creates adaptive cybersecurity scenarios — phishing investigations, PowerShell attacks, credential theft, ransomware response — each with sufficient context for informed decision-making.

### Module 5: Adaptive Assessment Engine

| Input | Output |
|---|---|
| Mission definitions + candidate responses | Turn-by-turn conversation management with difficulty adjustment |

Controls mission progression, difficulty adjustment (±2 sigma), and dynamic follow-up questions that probe reasoning depth.

### Module 6: Cyber Reasoning Engine

| Input | Output |
|---|---|
| Candidate responses | Evaluated concepts, workflow validation, decision quality, risk assessment, MITRE techniques |

The heart of the platform. Evaluates technical reasoning, incident workflow, decision quality, risk awareness, and cybersecurity concept coverage against structured rubrics.

### Module 7: Explainability Engine

| Input | Output |
|---|---|
| Cyber reasoning results | Supporting evidence, strengths, weaknesses, missing concepts, score justification |

Generates natural language explanations for every score dimension, citing specific candidate statements as evidence and identifying gaps in coverage.

### Module 8: Learning Engine

| Input | Output |
|---|---|
| Skill gaps from assessment | Prioritized learning topics with curated resources |

Creates personalized learning recommendations ranked by gap impact and prerequisite order, with associated labs, articles, and courses.

### Module 9: Report Generator

| Input | Output |
|---|---|
| All assessment data | Competency radar, assessment report, learning roadmap in recruiter-friendly and candidate-friendly formats |

Produces the final output artifacts consumed by candidates, recruiters, and trainers.

---

## 8. User Workflows

### 8.1 Candidate Workflow

```
Upload or select job description
      │
      ▼
Review identified competencies
      │
      ▼
Start adaptive assessment
      │
      ▼
Complete cyber missions (voice or text)
      │
      ▼
Receive explainable competency report
      │
      ▼
Review personalized learning roadmap
      │
      ▼
Practice on weak areas
      │
      ▼
Reassess to measure improvement
```

### 8.2 Recruiter Workflow

```
Upload job description or select role template
      │
      ▼
Assessment blueprint generated automatically
      │
      ▼
Invite candidate(s) via email link
      │
      ▼
Candidate completes assessment
      │
      ▼
Receive competency report with evidence
      │
      ▼
Review readiness profile and interview focus areas
      │
      ▼
Schedule final technical interview with targeted questions
```

### 8.3 Trainer/Educator Workflow

```
Define assessment based on curriculum
      │
      ▼
Assign to cohort of students
      │
      ▼
Monitor completion progress
      │
      ▼
Review cohort analytics and skill distribution
      │
      ▼
Identify curriculum gaps from aggregate data
      │
      ▼
Adjust teaching focus based on evidence
```

---

## 9. Candidate Journey (Detailed)

| Stage | Activity | System Action | Duration |
|---|---|---|---|
| 1 | Selects target role | Loads role blueprint from library | 1 min |
| 2 | Reviews assessment overview | Generates mission briefing | 1 min |
| 3 | Mission 1: Phishing Investigation | Presents email analysis scenario | 5-7 min |
| 4 | Mission 2: PowerShell Attack | Adapts based on Mission 1 performance | 5-7 min |
| 5 | Mission 3: Credential Theft | Adjusts difficulty ±2 sigma | 5-7 min |
| 6 | Mission 4: Ransomware | Concludes assessment | 5-7 min |
| 7 | Reviews results | Generates full report | Instant |
| 8 | Studies roadmap | Produces prioritized learning plan | On-demand |

---

## 10. Recruiter Journey (Detailed)

| Stage | Activity | System Action | Duration |
|---|---|---|---|
| 1 | Uploads JD | JD Intelligence parses requirements | 5 sec |
| 2 | Reviews blueprint | Assessment Planner proposes structure | 1 min |
| 3 | Invites candidate | System generates unique assessment link | 30 sec |
| 4 | Waits for completion | System monitors progress | Variable |
| 5 | Reviews report | Report Generator produces full assessment | Instant |
| 6 | Decides next steps | Report includes interview focus recommendations | 15 min |

---

## 11. AI Workflow

```
Role Input (JD / Framework / Manual)
      │
      ▼
Parse and Structure — Extract entities, relationships, and requirements
      │
      ▼
Competency Mapping — Map to NICE framework, build skill graph
      │
      ▼
Assessment Planning — Determine scope, difficulty, criteria
      │
      ▼
Mission Generation — Create scenarios with operational context
      │
      ▼
Adaptive Assessment — Conduct conversation, adjust in real-time
      │
      ▼
Cyber Reasoning — Evaluate against structured rubrics
      │
      ▼
Explainability — Generate evidence-backed rationale
      │
      ▼
Learning Plan — Rank gaps, recommend resources
      │
      ▼
Report Assembly — Format outputs for all stakeholders
```

---

## 12. Cyber Assessment Workflow

```
Mission Scenario Presented
      │
      ▼
Candidate Response (voice or text)
      │
      ▼
Concept Extraction — What cybersecurity concepts did the candidate address?
      │
      ▼
Workflow Validation — Did the response follow proper IR methodology?
      │
      ▼
Decision Analysis — Was the decision justified? Were alternatives considered?
      │
      ▼
Risk Evaluation — Did the candidate identify operational trade-offs?
      │
      ▼
MITRE ATT&CK Mapping — Which techniques does the response address?
      │
      ▼
Rubric Matching — Score against NICE framework criteria
      │
      ▼
Evidence Generation — Specific statements that support each score
      │
      ▼
Assessment Dimension Score
```

---

## 13. Explainability Workflow

```
Raw Assessment Scores
      │
      ▼
Identify Supporting Evidence — Find specific candidate statements that justify the score
      │
      ▼
Catalog Covered Concepts — List cybersecurity concepts the candidate addressed
      │
      ▼
Identify Missing Concepts — List relevant concepts the candidate did not address
      │
      ▼
Generate Reasoning Summary — Natural language explanation of the assessment
      │
      ▼
Produce Recommendations — Actionable guidance based on gaps
      │
      ▼
Explainable Report Section
```

### Example Explainability Output

```
Domain: Incident Response (IR-001)
Score: 72/100
Confidence: High

Covered:
  - IOC collection methodology
  - SIEM log analysis
  - Host containment procedures

Missing:
  - Memory acquisition (volatility)
  - Chain of custody documentation
  - Root cause analysis depth

Impact: Candidate demonstrates solid triage capability but
would benefit from forensic procedure training. Evidence
preservation gaps could compromise incident investigation.

Evidence: "I would isolate the host from the network"
indicates containment awareness (IR-001-03). However,
no mention of forensic imaging before isolation suggests
gap in evidence preservation workflow.
```

---

## 14. Learning Workflow

```
Assessment Results
      │
      ▼
Skill Classification — Map scores to NICE framework categories
      │
      ▼
Weak Area Identification — Domains below defined threshold
      │
      ▼
Gap Prioritization — Rank by impact on overall competency
      │
      ▼
Resource Association — Curated labs, articles, courses per topic
      │
      ▼
Prerequisite Ordering — Ensure foundational topics precede advanced
      │
      ▼
Personalized Roadmap — Prioritized list with time estimates
      │
      ▼
Practice Assessment — Targeted mini-assessment on weak areas
      │
      ▼
Full Reassessment — Measure improvement across all domains
```

---

## 15. Platform Outputs

### Candidate-Facing Outputs

| Output | Format | Purpose |
|---|---|---|
| Competency Profile | Overall readiness level + domain scores | Know where you stand |
| Cyber Readiness Dashboard | Radar chart, trend lines, gap indicators | Visual strength/weakness map |
| Skill Radar | 6-8 dimension radar chart | At-a-glance competency view |
| Assessment Timeline | Per-mission scores and progression | Granular performance breakdown |
| Learning Roadmap | Prioritized topics with resources and time estimates | Know what to study next |

### Recruiter-Facing Outputs

| Output | Format | Purpose |
|---|---|---|
| Assessment Summary | One-page overview with key metrics | Quick decision support |
| Competency Matrix | Detailed domain and sub-domain scores | Deep technical evaluation |
| Technical Strengths | Top 3-5 areas of demonstrated competency | Hiring justification |
| Improvement Areas | Specific gaps with evidence citations | Interview focus guidance |
| Interview Focus Recommendations | Topics to probe in follow-up human interview | Human-AI collaboration |

### Trainer/Educator Outputs

| Output | Format | Purpose |
|---|---|---|
| Cohort Performance | Aggregate scores across students | Class-level competency view |
| Skill Distribution | Per-domain distribution charts | Curriculum gap identification |
| Progress Tracking | Score changes across multiple assessments | Individual improvement measurement |

---

## 16. Product Benefits

### For Candidates

| Benefit | Detail |
|---|---|
| Realistic preparation | Practice with scenarios that mirror actual job challenges |
| Transparent evaluation | Understand exactly why you scored what you scored |
| Personalized improvement | Learning roadmap from current skill to target competency |

### For Recruiters

| Benefit | Detail |
|---|---|
| Consistent technical screening | Same rubric and methodology for every candidate |
| Reduced interview workload | AI conducts deep technical assessment at scale |
| Structured assessment reports | Evidence-backed candidate profiles for hiring decisions |

### For Organizations

| Benefit | Detail |
|---|---|
| Standardized hiring | Same evaluation framework across all candidates and roles |
| Better competency visibility | Granular view of candidate capabilities beyond a single score |
| Improved recruitment quality | Data-driven hiring decisions with explainable rationale |

---

## 17. Technical Advantages

| Advantage | AegisIQ | Conventional Tools |
|---|---|---|
| Assessment type | Adaptive incident missions | Static Q&A or multiple choice |
| AI approach | Domain-specific reasoning pipeline | Generic language model scoring |
| Explainability | Evidence citations + natural language | Black-box score |
| Framework alignment | NICE + MITRE ATT&CK integrated | Manual or absent |
| Evaluation target | Reasoning quality and workflow | Answer correctness |
| Architecture | Modular, replaceable agents | Monolithic or opaque pipeline |
| Output dimensionality | Multi-dimensional profile | Single score or pass/fail |
| Learning integration | Built-in roadmap generation | Separate or absent |

---

## 18. Future Vision

| Capability | Description | Phase |
|---|---|---|
| Enterprise recruiter portal | Batch invites, cohort management, comparison views | 2 |
| ATS integration | Direct submission to Greenhouse, Lever, Workday | 2 |
| Hands-on cyber labs | Browser-based terminal for live environment tasks | 2 |
| SIEM log replay missions | Real log data for investigation scenarios | 3 |
| Cloud security assessments | AWS/Azure/GCP incident response scenarios | 3 |
| Purple team assessments | Combined offensive/defensive evaluation | 3 |
| Workforce competency analytics | Aggregate team readiness benchmarking | 3 |
| Organization-wide readiness | Cross-team skill gap analysis | 3 |

---

## 19. Conclusion

AegisIQ is not an interview chatbot. It is a **Cybersecurity Competency Intelligence Platform** that combines adaptive assessments, explainable AI, and structured cybersecurity reasoning to provide organizations with reliable decision support and candidates with meaningful, actionable feedback.

By centering on the **Cybersecurity Role Blueprint** as its primary artifact rather than a single job description, the platform is extensible across recruitment, training, certification, and workforce planning use cases — today and as the product evolves.
