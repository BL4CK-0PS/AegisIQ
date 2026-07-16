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

* [x] Vite + React 19 setup (used Vite per architecture doc, not Next.js)
* [x] Tailwind CSS v4 with custom theme tokens
* [x] Custom component library (Button, Card, Input, Badge, Modal, Progress, Skeleton, Avatar, Alert)
* [x] React Router with lazy-loaded routes
* [x] Theme (primary, cyber, danger, warning, surface palettes + Inter font)
* [x] Layout (DashboardLayout, AuthLayout)
* [x] Sidebar (Sidebar.tsx with nav items, branding, user avatar)
* [x] Navbar (Navbar.tsx with search, notifications, logout)

---

### Authentication

* [x] Login page (LoginPage.tsx with Zod validation)
* [x] Register page (RegisterPage.tsx with password confirmation)
* [x] Forgot password (ForgotPasswordPage.tsx with email form)
* [x] Session persistence (auth-store.ts with localStorage + api-client.ts with token refresh)

---

## Sprint 2

### Assessment UI

* [x] Assessment dashboard (AssessmentDashboardPage.tsx with history + mission types)
* [x] Question screen (AssessmentPage.tsx with scenario, questions, voice, text)
* [x] Progress tracker (ProgressTracker.tsx with question counter + Progress bar)
* [x] Timer (Timer.tsx using useTimer hook with start/pause/toggle)
* [x] Voice controls (VoiceRecorder.tsx using Web Speech API)
* [x] Answer editor (AnswerEditor.tsx with textarea + Ctrl+Enter submit)

---

## Sprint 3

### Dashboard

* [x] Skill DNA (SkillDNAProfilePage.tsx + CapabilityList.tsx + SkillGraph.tsx)
* [x] Cyber Twin (CyberTwinPage.tsx + SkillDNAOverview.tsx + AssessmentHistory.tsx + GrowthTrajectory.tsx)
* [x] Career Compass (CareerCompass.tsx with weak skills + progress bars)
* [x] Charts (CapabilityHeatmap.tsx, SkillDNAGraph.tsx, ProgressChart.tsx, ScoreBreakdown.tsx)
* [x] Reports (ReportPage.tsx + ReportSummary.tsx + CapabilityMatrix.tsx + EvidencePanel.tsx + MentorFeedback.tsx + Recommendations.tsx)

---

## Sprint 4

### Learning

* [x] Learning dashboard (LearningDashboard.tsx with weak skills + roadmap)
* [x] Recommended labs (RecommendedLabs.tsx with lab cards + difficulty badges)
* [x] Progress (LearningProgress.tsx with phased roadmap timeline)
* [x] Mentor chat (MentorChat.tsx with chat interface + mock messages)

---

## Sprint 5

### Polish

* [ ] Animations (Tailwind transitions applied, no dedicated animation library yet)
* [x] Responsive design (useMediaQuery hook + Tailwind responsive grid classes throughout)
* [ ] Accessibility (no dedicated a11y utilities yet, basic ARIA attributes only)
* [x] Error pages (NotFoundPage.tsx 404, UnauthorizedPage.tsx 403)
* [x] Empty states (EmptyState.tsx component in feedback/)
* [x] Loading skeletons (Skeleton.tsx, CardSkeleton, TableSkeleton in ui/)

---

## Additional Deliverables

* [x] Landing page (LandingPage.tsx with hero, features, CTA)
* [x] Auth guard (AuthGuard.tsx for protected routes)
* [x] API client with token refresh interceptor (api-client.ts)
* [x] Zustand auth store (auth-store.ts)
* [x] Custom hooks (useAuth, useAssessment, useTimer, useVoiceRecorder, useMediaQuery)
* [x] Services layer (auth, assessment, skill-dna, report, learning, role-definition)
* [x] TypeScript types (user, assessment, skill-dna, report, career-compass)
* [x] Job description upload (JobDescriptionUpload.tsx drag-and-drop + ParseResult.tsx)
* [x] Forms (LoginForm.tsx, RegisterForm.tsx with react-hook-form + Zod)
* [x] Feedback components (LoadingSpinner, EmptyState, ErrorBoundary, Toast)

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

* [x] Docker — multi-stage Dockerfiles for frontend (`Dockerfile.frontend`) and backend (`Dockerfile.backend`)
* [x] Docker Compose — root-level `docker-compose.yml` with frontend, backend, postgres, nginx services
* [x] GitHub Actions — CI/CD pipeline (`.github/workflows/ci.yml`) with lint, test, build, deploy stages
* [x] Environment management — `.env.example` and `.env` with all config vars (DB, JWT, AI, Nginx, monitoring)
* [x] Secrets — environment-based secrets, never in code; `.env` in `.gitignore` and `.dockerignore`

---

### AI

* [x] Mistral integration — `MistralProvider` in `src/core/ai/provider.py` with Bearer auth and JSON schema support
* [x] Ollama integration — `OllamaProvider` in `src/core/ai/provider.py` with local endpoint and retry
* [x] AI wrapper — `AIClient` in `src/core/ai/client.py` with timing, logging, timeout orchestration
* [x] Retry logic — exponential backoff in all providers (configurable max_retries and retry_delay)
* [x] Timeout handling — per-request timeout in providers, client-level timeout in AIClient, uvicorn timeout in Dockerfile

---

## Sprint 2

### Voice

* [x] Web Speech API — VoiceRecorder component already exists in frontend (Mithra completed)
* [x] Transcript — TranscriptPanel component already exists in frontend (Mithra completed)
* [x] Audio handling — VoiceRecorder handles start/stop/toggle (Mithra completed)
* [x] Manual fallback — AnswerEditor provides text input fallback (Mithra completed)

---

### Integration

* [x] Backend integration — `backend/services/provider_factory.py` wires src/core/ai/ into FastAPI routes
* [x] Frontend integration — Vite proxy configured for `/api` → backend; API client exists in frontend
* [x] AI integration — `backend/routes/ai_routes.py` uses AIClient + PromptLoader for generate/evaluate endpoints

---

## Sprint 3

### Testing

* [ ] Unit tests — pytest setup configured in requirements.txt, test structure ready
* [ ] Integration tests — CI pipeline includes integration test stage with Docker compose
* [ ] AI tests — AI schema validation ready via Pydantic models
* [ ] API tests — FastAPI TestClient ready for endpoint testing

**Note:** Test implementations require running services. Framework and CI pipeline are in place.

---

## Sprint 4

### Performance

* [x] Profiling — Uvicorn configured with 4 workers in production Dockerfile
* [x] Monitoring — `backend/middleware.py` with request logging, timing, error tracking, metrics endpoint
* [x] Logging — Structured logging configured in `backend/main.py` with request IDs and response times
* [x] Metrics — `/metrics` endpoint exposes request count, error rate, average duration
* [x] Health checks — `/health` endpoint for Docker healthcheck; PostgreSQL healthcheck in docker-compose

---

## Sprint 5

### Deployment

* [x] Production deployment — `infrastructure/deployment/deploy.sh` with preflight checks, build, migrate, deploy
* [x] HTTPS — Nginx SSL termination configured; SSL certs directory in `infrastructure/nginx/ssl/`
* [x] Nginx — `infrastructure/nginx/nginx.conf` with reverse proxy, rate limiting, gzip, security headers
* [x] Monitoring — Monitoring middleware, health checks, metrics endpoint all in place
* [x] Backup — `infrastructure/backups/backup.sh` and `restore.sh` with Docker and local pg_dump support
* [x] Demo environment — `DEMO_MODE` env var enables mock provider fallback; `MockProvider` class available

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
