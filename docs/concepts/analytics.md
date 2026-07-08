# Analytics

> Comprehensive data analysis and visualization platform for capability intelligence at individual, team, and organizational levels.

## Overview

Analytics provides real-time and historical views into capability data across the platform. It powers dashboards for users, mentors, team leads, and executives — each with role-appropriate granularity and privacy boundaries.

## Analytics Architecture

```mermaid
flowchart TB
    subgraph Sources[Data Sources]
        A1[Assessment Results]
        A2[Challenge Performance]
        A3[Learning Activity]
        A4[Skill DNA Snapshots]
    end

    subgraph Processing[Analytics Pipeline]
        B1[ETL Layer]
        B2[Data Warehouse]
        B3[OLAP Cubes]
        B4[Metric Definitions]
    end

    subgraph Outputs[Dashboards & Reports]
        C1[Individual Dashboard]
        C2[Team Dashboard]
        C3[Org Dashboard]
        C4[Custom Reports]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> C1
    B3 --> C2
    B3 --> C3
    B4 --> C3
    B4 --> C4
```

## Dashboard Types

| Dashboard | Audience | Key Metrics |
|---|---|---|
| **Individual** | Users | Skill scores, progress rate, strengths/gaps, rank, streak |
| **Mentor** | Mentors | Mentee progress, intervention needs, engagement trends |
| **Team** | Team Leads | Team capability heatmap, skill gaps, growth trajectory |
| **Organization** | HR/Exec | Workforce capability inventory, risk areas, benchmarking |

## Key Metrics

- **Capability Score**: Weighted composite of assessment and challenge performance
- **Growth Rate**: Skill score change over configurable time windows
- **Engagement Score**: Composite of frequency, depth, and consistency metrics
- **Confidence Score**: Statistical confidence in capability measurements

## Related Documents

- [Community Intelligence](community-intelligence.md)
- [Capability Heatmap](capability-heatmap.md)
- [Progress Engine](progress-engine.md)
- [Privacy & Security Model](privacy-security-model.md)
