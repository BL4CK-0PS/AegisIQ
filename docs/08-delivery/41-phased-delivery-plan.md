# PWNDORA Development Phases

For a project like PWNDORA, phases should be **architecture-driven**, where every phase ends with a working product. That way, you always have something demoable, even if you run out of time.

---

```text
Phase 0
Project Foundation

↓

Phase 1
Platform Core

↓

Phase 2
Knowledge & Assessment

↓

Phase 3
Adaptive Intelligence

↓

Phase 4
Capability Intelligence

↓

Phase 5
AI Mentor & Learning

↓

Phase 6
Frontend Experience

↓

Phase 7
Quality Engineering

↓

Phase 8
Deployment & Demo
```

---

# Phase 0 — Project Foundation

## Goal

Create a production-ready engineering environment.

### Tasks

- Initialize GitHub repository
- Configure branching strategy
- Configure CI/CD
- Docker Compose
- Environment variables
- Project structure
- Documentation setup
- Coding standards
- Issue templates
- Pull request templates

### Deliverables

```text
Repository

CI/CD

Docker

Documentation

Development Environment
```

### Owner

AV + Jos

---

# Phase 1 — Platform Core

## Goal

Build the platform skeleton.

### Backend

- FastAPI
- Authentication
- JWT
- User Management
- Session Management
- PostgreSQL
- SQLAlchemy
- Alembic

### Frontend

- Next.js
- Authentication
- Dashboard Layout
- Routing
- Theme

### AI

- Provider abstraction
- AI client
- Prompt loader

### Deliverables

```text
Login

Dashboard

Database

Authentication

Health API
```

### Owners

Jos
Mithra
AV

---

# Phase 2 — Knowledge & Assessment

## Goal

Create cybersecurity knowledge.

### KC

- Cyber Question Bank
- Difficulty taxonomy
- Domains
- Skills
- Competencies
- MITRE mapping

### Jos

- Question APIs
- Assessment APIs

### Mithra

- Assessment UI

### AV

- Provider integration

### Deliverables

```text
Question Graph

Question Bank

Assessment Engine

Assessment UI
```

---

# Phase 3 — Adaptive Intelligence

## Goal

Interview becomes dynamic.

### KC

- Adaptive Logic (branching, difficulty adjustment, follow-up questions)

### Jos

- Assessment Session
- Question State
- Progress

### Mithra

- Adaptive UI
- Timeline
- Progress

### AV

- Voice
- Transcript
- Streaming

### Deliverables

```text
Adaptive Assessment

Voice

Live Transcript

Branching
```

---

# Phase 4 — Capability Intelligence

## Goal

Generate Skill DNA.

### Build

- Skill DNA
- Cyber Twin
- Capability Graph
- Progress
- Confidence
- Career Compass

### Backend

- Capability Engine

### AI

- Evaluation Engine
- Rubrics
- MITRE

### Frontend

- Skill Dashboard
- DNA Visualization
- Cyber Twin

### Deliverables

```text
Skill DNA

Cyber Twin

Capability Engine
```

---

# Phase 5 — AI Mentor

## Goal

Transform evaluation into learning.

### KC

- Learning Logic
- Mentor
- Feedback
- Labs
- Recommendations

### Jos

- Learning APIs
- Recommendation Engine

### Mithra

- Learning Dashboard
- Roadmaps
- Progress

### AV

- Caching
- Optimization

### Deliverables

```text
AI Mentor

Learning Path

Recommendations
```

---

# Phase 6 — Product Experience

## Goal

Everything feels like one product.

### Frontend

- Landing Page
- Portfolio
- Animations
- Dark Mode
- Dashboard
- Reports
- Charts
- Accessibility

### Backend

- Optimization
- Caching

### Deliverables

```text
Professional Product

Responsive UI

Reports

Analytics
```

---

# Phase 7 — Quality Engineering

## Goal

Make the system reliable.

### Testing

- Unit
- Integration
- API
- AI
- Voice
- Performance
- Security
- Accessibility

### Deliverables

```text
90%+ Stable MVP

Bug Fixes

Performance

Documentation
```

---

# Phase 8 — Deployment & Demo

## Goal

Ship.

### Deployment

- Docker
- GitHub Actions
- HTTPS
- Monitoring
- Logging

### Demo

- Judge Flow
- Pitch
- Screenshots
- Video
- Presentation

### Deliverables

```text
Production Build

Demo

Presentation

Pitch

Deployment
```

---

# Team Responsibility by Phase

| Phase         | Jos                | Mithra         | KC                   | AV             |
| ------------- | ------------------ | -------------- | -------------------- | -------------- |
| Foundation    | Backend setup      | Frontend setup | AI research          | DevOps         |
| Platform Core | APIs               | UI             | Prompt system        | AI providers   |
| Assessment    | Backend engine     | Assessment UI  | Questions & rubrics  | Integration    |
| Adaptive      | Sessions           | Adaptive UI    | Branching logic      | Voice          |
| Capability    | Capability APIs    | Skill DNA UI   | Scoring & Cyber Twin | Performance    |
| AI Mentor     | Learning APIs      | Learning UI    | Mentor logic         | Optimization   |
| Product       | Backend polish     | UX polish      | AI polish            | Infrastructure |
| Quality       | Bug fixes          | UI fixes       | AI validation        | Testing        |
| Deployment    | Production backend | Final UI       | AI tuning            | Deployment     |

---

# Milestones

## M1 — Platform Running

```text
Authentication
        ↓
Dashboard
        ↓
Database
```

## M2 — Assessment Working

```text
Question Bank
        ↓
Assessment
        ↓
Results
```

## M3 — Adaptive Interview

```text
Voice
        ↓
Adaptive Questions
        ↓
Transcript
```

## M4 — Capability Intelligence

```text
Assessment
        ↓
Skill DNA
        ↓
Cyber Twin
```

## M5 — Learning Platform

```text
Evaluation
        ↓
AI Mentor
        ↓
Learning Path
```

## M6 — Hackathon MVP

```text
Landing Page
        ↓
JD Selection (or Assessment Selection)
        ↓
Adaptive Assessment
        ↓
Skill DNA
        ↓
Cyber Twin
        ↓
Learning Roadmap
        ↓
Explainable Report
```

---

# Recommended Build Order

```text
Repository
      ↓
Authentication
      ↓
Database
      ↓
Question Bank
      ↓
Assessment Engine
      ↓
Assessment UI
      ↓
Adaptive Logic
      ↓
Voice
      ↓
Evaluation Engine
      ↓
Skill DNA
      ↓
Cyber Twin
      ↓
Learning Engine
      ↓
Reports
      ↓
UI Polish
      ↓
Testing
      ↓
Deployment
```

**Important:** Delay the AI Mentor until after Skill DNA is complete. Without a reliable capability model, the mentor has nothing meaningful to teach. Build the evidence first (assessment → scoring → Skill DNA → Cyber Twin), then generate guidance from that evidence.
