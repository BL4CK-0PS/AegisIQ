# PWNDORA SkillScan X — Todo

Every task should satisfy:
- Clear owner
- Clear output
- Can be reviewed
- Can be merged independently
- Doesn't block everyone else

---

# ⚙️ Jos (Backend Architecture Lead)

## Sprint 1 — Platform Foundation

### Backend

* [ ] Initialize FastAPI project
* [ ] Configure project structure
* [ ] Configure dependency injection
* [ ] Create configuration management
* [ ] Setup logging
* [ ] Global exception handlers
* [ ] Health check API

---

### Database

* [ ] Setup PostgreSQL
* [ ] SQLAlchemy models
* [ ] Alembic
* [ ] Migration system
* [ ] Repository pattern
* [ ] Seed scripts

---

### Authentication

* [ ] User entity
* [ ] JWT
* [ ] Login
* [ ] Register
* [ ] Refresh token
* [ ] RBAC

---

## Sprint 2 — Assessment Backend

* [ ] Assessment entity
* [ ] Question entity
* [ ] Session entity
* [ ] Answer entity
* [ ] Assessment APIs
* [ ] Session APIs
* [ ] Progress APIs

---

## Sprint 3 — AI Backend

* [ ] AI Orchestrator
* [ ] Prompt execution
* [ ] Provider abstraction
* [ ] JSON validation
* [ ] AI request pipeline

---

## Sprint 4 — Capability Backend

* [ ] Skill DNA API
* [ ] Cyber Twin API
* [ ] Dashboard API
* [ ] Report API
* [ ] Learning API

---

## Sprint 5 — Optimization

* [ ] API optimization
* [ ] Caching
* [ ] Query optimization
* [ ] Pagination
* [ ] Rate limiting

---

# 🎨 Mithra (Frontend Lead)

## Sprint 1

### UI Foundation

* [ ] Next.js setup
* [ ] Tailwind
* [ ] shadcn/ui
* [ ] Routing
* [ ] Theme
* [ ] Layout
* [ ] Sidebar
* [ ] Navbar

---

### Authentication

* [ ] Login page
* [ ] Register page
* [ ] Forgot password
* [ ] Session persistence

---

## Sprint 2

### Assessment UI

* [ ] Assessment dashboard
* [ ] Question screen
* [ ] Progress tracker
* [ ] Timer
* [ ] Voice controls
* [ ] Answer editor

---

## Sprint 3

### Dashboard

* [ ] Skill DNA
* [ ] Cyber Twin
* [ ] Career Compass
* [ ] Charts
* [ ] Reports

---

## Sprint 4

### Learning

* [ ] Learning dashboard
* [ ] Recommended labs
* [ ] Progress
* [ ] Mentor chat

---

## Sprint 5

### Polish

* [ ] Animations
* [ ] Responsive design
* [ ] Accessibility
* [ ] Error pages
* [ ] Empty states
* [ ] Loading skeletons

---

# 🧠 KC (AI & Cybersecurity Lead)

## Sprint 1

### Knowledge Base

* [ ] Cyber domains
* [ ] Skills taxonomy
* [ ] Competency mapping
* [ ] MITRE mapping
* [ ] Question taxonomy

---

### Rubrics

* [ ] Beginner rubric
* [ ] Intermediate rubric
* [ ] Advanced rubric
* [ ] Scoring criteria

---

## Sprint 2

### Question Engine

* [ ] Question templates
* [ ] Practical challenges
* [ ] Incident scenarios
* [ ] Adaptive branching

---

## Sprint 3

### Evaluation

* [ ] Prompt library
* [ ] Evaluation prompt
* [ ] Skill extraction
* [ ] Concept extraction
* [ ] Communication analysis
* [ ] Decision analysis

---

## Sprint 4

### Capability Engine

* [ ] Skill DNA logic
* [ ] Cyber Twin logic
* [ ] Confidence score
* [ ] Career Compass
* [ ] Weakness detection

---

## Sprint 5

### Learning

* [ ] AI Mentor prompts
* [ ] Learning roadmap
* [ ] Recommended labs
* [ ] Answer repair
* [ ] Feedback engine

---

# 🔗 AV (AI Integration & Reliability)

## Sprint 1

### Infrastructure

* [ ] Docker
* [ ] Docker Compose
* [ ] GitHub Actions
* [ ] Environment management
* [ ] Secrets

---

### AI

* [ ] Mistral integration
* [ ] Ollama integration
* [ ] AI wrapper
* [ ] Retry logic
* [ ] Timeout handling

---

## Sprint 2

### Voice

* [ ] Web Speech API
* [ ] Transcript
* [ ] Audio handling
* [ ] Manual fallback

---

### Integration

* [ ] Backend integration
* [ ] Frontend integration
* [ ] AI integration

---

## Sprint 3

### Testing

* [ ] Unit tests
* [ ] Integration tests
* [ ] AI tests
* [ ] API tests

---

## Sprint 4

### Performance

* [ ] Profiling
* [ ] Monitoring
* [ ] Logging
* [ ] Metrics
* [ ] Health checks

---

## Sprint 5

### Deployment

* [ ] Production deployment
* [ ] HTTPS
* [ ] Nginx
* [ ] Monitoring
* [ ] Backup
* [ ] Demo environment

---

# Shared Tasks

## Documentation

Everyone

* [ ] Update README
* [ ] API documentation
* [ ] Architecture docs
* [ ] User guide

---

## Code Review

Everyone

* [ ] Review PRs
* [ ] Architecture review
* [ ] Security review

---

## Testing

Everyone

* [ ] Manual testing
* [ ] Demo testing
* [ ] Bug fixing

---

# Final Deliverables Matrix

| Deliverable       | Owner  | Reviewer |
| ----------------- | ------ | -------- |
| Backend APIs      | Jos    | AV       |
| Database          | Jos    | AV       |
| Authentication    | Jos    | KC       |
| Assessment Engine | Jos    | KC       |
| AI Orchestrator   | Jos    | AV       |
| Frontend          | Mithra | KC       |
| Dashboard         | Mithra | AV       |
| Reports           | Mithra | Jos      |
| Question Bank     | KC     | Jos      |
| Rubrics           | KC     | AV       |
| Evaluation Engine | KC     | Jos      |
| Skill DNA Logic   | KC     | Mithra   |
| Learning Engine   | KC     | Mithra   |
| AI Provider Layer | AV     | Jos      |
| Voice System      | AV     | Mithra   |
| CI/CD             | AV     | Jos      |
| Deployment        | AV     | Jos      |
| Testing           | AV     | Everyone |

**Recommendation:** Move testing ownership to AV as Quality Gate owner. Nothing merges until AV verifies integration, AI schema, frontend-backend contract compatibility, performance, and demo flow. Hackathons are usually lost during integration, not implementation.
