# PWNDORA SkillScan X — Cyber Twin

> Persistent digital representation of verified cybersecurity capability.

---

## Purpose

The Cyber Twin is a persistent digital identity that represents a professional's verified cybersecurity capability profile. Unlike traditional resumes or certifications that capture static credentials, the Cyber Twin is a living artifact that evolves with every assessment the professional completes.

---

## Overview

```mermaid
graph TB
    A1["Assessment 1"] --> CT["Cyber Twin"]
    A2["Assessment 2"] --> CT
    A3["Assessment N"] --> CT
    CT --> CH["Capability Heatmap"]
    CT --> CC["Career Compass"]
    CT --> PG["Progress Timeline"]
    CT --> BM["Benchmarking"]
    
    subgraph Inputs
        A1
        A2
        A3
    end
    
    subgraph Outputs
        CH
        CC
        PG
        BM
    end
    
    style CT fill:#2d5a87,color:#fff
```

---

## Core Concepts

### Capability Profile

The Cyber Twin's central data structure contains:

- Verified skill scores across cybersecurity domains
- Demonstrated knowledge areas mapped to NICE framework
- MITRE ATT&CK technique coverage history
- Assessment metadata (dates, roles, difficulty levels)
- Growth trajectory and trend data

### Evidence Graph

Every score in the Cyber Twin traces back to specific assessment evidence:

```mermaid
flowchart LR
    EV["Evidence Item"] --> AB["Assessment Blueprint"]
    EV --> MI["Mission Context"]
    EV --> RE["Professional Response"]
    EV --> SC["Score Dimension"]
    
    style EV fill:#2d5a87,color:#fff
```

---

## Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Initializing : First assessment completed
    Initializing --> Active : Profile populated
    Active --> Updating : New assessment submitted
    Updating --> Active : Evidence merged
    Active --> Archived : Account inactive > 12 months
    Archived --> Active : New assessment completed
```

### Stages

| Stage | Description |
|---|---|
| **Initializing** | First assessment completed, baseline profile created |
| **Active** | Profile available for queries, heatmap, compass |
| **Updating** | New assessment evidence being merged into profile |
| **Archived** | Profile stored but not actively updated |

---

## Data Model

```mermaid
erDiagram
    CyberTwin {
        uuid id PK
        uuid user_id FK
        jsonb capability_profile
        jsonb verified_skills
        jsonb experience_graph
        jsonb growth_trajectory
        datetime last_updated
        int assessment_count
    }
    
    CyberTwin ||--o{ AssessmentSnapshot : aggregates
    AssessmentSnapshot {
        uuid id PK
        uuid cyber_twin_id FK
        uuid assessment_id FK
        jsonb domain_scores
        jsonb evidence_refs
        datetime completed_at
    }
```

---

## Capability Score Aggregation

Scores are aggregated across assessments using a weighted model:

| Factor | Weight | Rationale |
|---|---|---|
| Recency | Higher weight for recent assessments | Capability changes over time |
| Difficulty | Higher weight for harder assessments | Stronger signal of capability |
| Consistency | Bonus for consistent scores across assessments | Reduces variance from single outliers |

---

## Key Features

### Cross-Assessment Tracking

The Cyber Twin aggregates evidence from every assessment, building a comprehensive capability picture that no single assessment can provide.

### Growth Visualization

Professionals can view their capability development over time, seeing which domains improved and where gaps persist.

### Benchmarking

The Cyber Twin enables anonymized comparison against peers, role standards, and industry benchmarks.

---

## Related Documents

| Document | Location |
|---|---|
| System Architecture | `../04-architecture/16-system-architecture.md` |
| Skill DNA Engine | `../06-ai-engines/26-skill-dna-engine.md` |
| Capability Heatmap | `./capability-heatmap.md` |
| Career Compass | `./career-compass.md` |
| Glossary | `../reference/glossary.md` |
