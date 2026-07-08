# AegisIQ — Non-Functional Requirements

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | Engineering Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

### Purpose

This document defines the quality attributes and operational characteristics that AegisIQ must satisfy. Unlike Functional Requirements, which describe **what** the platform does, Non-Functional Requirements define **how well** it performs.

### Scope

Requirements are scoped for the hackathon MVP unless otherwise noted. Production targets are included for context but are not commitment targets for the current delivery.

### NFR Priority Definitions

| Priority | Meaning |
|---|---|
| **P0** | Must satisfy for MVP demo. Failure blocks core functionality. |
| **P1** | Important for production readiness. Can defer for hackathon. |
| **P2** | Valuable for polish and scale. Post-MVP target. |

---

## 2. Quality Attributes

### 2.1 Prioritized Quality Goals

The platform shall prioritize quality attributes in the following order:

```
Correctness — Scores must be accurate and reproducible.
      │
      ▼
Security — User data and API keys must be protected.
      │
      ▼
Reliability — Assessments must not lose data or crash mid-session.
      │
      ▼
Explainability — Every score must be traceable to evidence.
      │
      ▼
Performance — Latency must not break the conversational flow.
      │
      ▼
Maintainability — Code must be navigable and testable by the team.
      │
      ▼
Usability — The interface must not require external guidance.
```

### 2.2 Quality Attribute Trade-offs

| Trade-off | Decision | Rationale |
|---|---|---|
| Accuracy vs. Speed | Favor accuracy for evaluation; speed for UI | Scores must be defensible; UI can tolerate moderate latency |
| Security vs. Convenience | Favor security for auth and API keys | No plaintext secrets; bcrypt cost 12 |
| Explainability vs. Simplicity | Favor explainability | Every score includes evidence; no black boxes |
| Reliability vs. Features | Favor reliability for P0 features | Core assessment loop must be stable; defer non-critical features |

---

## 3. Performance

### 3.1 Page Load Performance

| Page / Operation | MVP Target | Measurement |
|---|---|---|
| Landing page (initial load) | < 2 seconds | Lighthouse FCP |
| Dashboard page | < 3 seconds | API response + render |
| Assessment chat UI | < 2 seconds initial; streaming thereafter | Time to first paint |
| Results page | < 3 seconds | Full load |

### 3.2 API Latency

| Endpoint Category | MVP Target (P95) | Notes |
|---|---|---|
| CRUD operations (users, sessions) | < 200ms | Database-only operations |
| JD parsing | < 10 seconds | Includes LLM call |
| Mission generation | < 15 seconds | Includes LLM call |
| Per-response evaluation | < 10 seconds (target 3s) | Includes LLM call |
| Report generation | < 5 seconds | Aggregation + LLM explainability |
| Learning roadmap | < 5 seconds | LLM recommendation |

### 3.3 AI-Specific Performance

| Operation | MVP Target | Conditions |
|---|---|---|
| Mission generation | < 15 seconds | GPT-4o, no cache |
| Per-turn evaluation | < 10 seconds | GPT-4o, structured output |
| Full assessment (5 turns) | < 5 minutes total | Includes all AI calls + network |
| Report + roadmap | < 8 seconds combined | GPT-4o, structured output |

### 3.4 Frontend Performance

| Metric | MVP Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5 seconds |
| Largest Contentful Paint (LCP) | < 2.5 seconds |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3 seconds |
| Bundle size (initial) | < 200KB JS |

---

## 4. Reliability

### 4.1 Fault Tolerance

| Requirement | MVP Approach |
|---|---|
| AI API failure | Retry with exponential backoff (3 attempts, 1s/2s/4s) |
| AI API persistent failure | Graceful degradation: return partial assessment with available scores |
| Database write failure | Transaction rollback; no partial state |
| Network interruption during assessment | Auto-save every message; resume on reconnection |
| Voice recognition failure | Manual text input always available as fallback |

### 4.2 Data Integrity

| Requirement | MVP Approach |
|---|---|
| Assessment state persistence | Write-ahead logging; commit after every turn |
| Crash recovery | Last committed state restored on session resume |
| Concurrent access | SQLite WAL mode for reads; serialized writes |
| Data corruption prevention | Foreign key constraints; required field validation |

### 4.3 Reliability Targets

| Metric | MVP Target |
|---|---|
| Assessment completion success rate | > 99% (sessions started vs. completed without error) |
| AI call success rate (after retries) | > 95% |
| Data loss incidents | Zero tolerance |

---

## 5. Availability

### 5.1 MVP Deployment

| Aspect | Specification |
|---|---|
| Deployment model | Single-instance Docker Compose |
| Uptime target | > 95% during demo periods |
| Planned downtime | None expected during judging |
| Recovery time | < 5 minutes (container restart) |

### 5.2 Production Target (Future)

| Aspect | Target |
|---|---|
| Architecture | Multi-instance with load balancer |
| Uptime | 99.9% |
| RTO | < 15 minutes |
| RPO | < 5 minutes |

---

## 6. Scalability

### 6.1 MVP Scope

| Dimension | MVP Target |
|---|---|
| Concurrent assessment sessions | 20 simultaneous |
| Concurrent users (total) | 50 |
| Assessments per day | 100 |
| Database size | < 100MB |

### 6.2 Architecture Constraints

| Constraint | Rationale | Migration Path |
|---|---|---|
| SQLite single-writer | WAL mode allows concurrent reads | PostgreSQL with connection pooling |
| In-process AI pipeline | Sequential agent calls | Async queue with worker pool |
| In-memory cache | Simple dict-based | Redis |
| Single-process backend | Uvicorn with workers | Horizontal instances behind load balancer |

---

## 7. Security

### 7.1 Authentication and Authorization

| Requirement | Specification |
|---|---|
| Password storage | bcrypt with cost factor 12 |
| Session tokens | JWT (HS256, 24-hour expiry) |
| Token storage | HTTP-only cookies (frontend), env variables (backend) |
| Rate limiting | 5 attempts/minute on auth endpoints |
| Role enforcement | Server-side role check on all protected endpoints |

### 7.2 API Security

| Requirement | Specification |
|---|---|
| API key protection | Server-side only; loaded from `.env`; never exposed to client |
| CORS | Whitelist specific origins; no wildcard in production |
| Request validation | Pydantic schema validation on all inputs |
| Response sanitization | Strip executable content before rendering |
| SQL injection prevention | ORM parameterized queries only; no raw SQL |

### 7.3 AI Security

| Requirement | Specification |
|---|---|
| Prompt injection mitigation | Input validation; prompt isolation per agent; output sanitization |
| Data leakage prevention | No PII in AI prompts; anonymize candidate responses |
| Hallucination containment | Rubric-first evaluation constrains LLM to evidence generation |

### 7.4 Infrastructure Security

| Requirement | Specification |
|---|---|
| HTTPS | TLS termination at reverse proxy |
| Secrets management | Environment variables; `.env` excluded from version control |
| Container security | Non-root user in Docker; minimal base image |

---

## 8. Privacy

### 8.1 Data Minimization

| Requirement | Approach |
|---|---|
| Store only required data | Assessment transcripts, scores, user profile |
| No unnecessary PII | Email and name stored; no address, phone, or ID numbers |
| Voice data | No voice recordings retained; transcription text only |

### 8.2 Data Control

| Requirement | Approach |
|---|---|
| Report deletion | Users can delete their assessment reports |
| Account deletion | Users can request account deletion |
| Demo data marking | All demo data clearly distinguished from production data |
| Data retention | MVP: indefinite (SQLite file); Production: configurable retention policy |

---

## 9. Usability

### 9.1 General Usability

| Requirement | Target |
|---|---|
| Time to understand interface | < 5 minutes without external guidance |
| Assessment completion without help | First-time users complete without assistance |
| Error message clarity | User-friendly, non-technical language |
| Loading states | Visible indicators for all async operations |
| Typing indicators | Show when AI is generating a response |

### 9.2 Navigation

| Requirement | Target |
|---|---|
| Click depth to key actions | Maximum 3 clicks from dashboard |
| Back navigation | Support browser back button |
| Session state persistence | Navigating away and back preserves state |

### 9.3 Assessment UI

| Requirement | Target |
|---|---|
| Response input | Both voice and text support; clear toggle between modes |
| Progress indication | Current mission (N of M), estimated time remaining, turn counter |
| Mission context | Brief displayed at start of each mission; accessible during response |
| Timeout warning | Warning at 25 minutes of 30-minute idle timeout |

---

## 10. Accessibility

### 10.1 Standards Target

| Standard | Target Level |
|---|---|
| WCAG 2.1 | AA (minimum) |

### 10.2 Specific Requirements

| Requirement | Implementation |
|---|---|
| Keyboard navigation | All interactive elements reachable and operable via keyboard |
| Screen reader support | Semantic HTML, ARIA labels on interactive elements |
| Color contrast | 4.5:1 minimum for normal text; 3:1 for large text |
| Focus indicators | Visible focus ring on all interactive elements |
| Text scaling | Interface functional at 200% browser zoom |
| Non-text content | Alt text on all images and icons |
| Error identification | Error messages associated with their input fields programmatically |

---

## 11. Maintainability

### 11.1 Code Quality

| Requirement | Standard |
|---|---|
| TypeScript strictness | Strict mode enabled; no implicit any |
| Python type hints | All function signatures typed; mypy strict mode |
| Linting | ESLint (frontend) + Ruff (backend) |
| Formatting | Prettier (frontend) + Ruff format (backend) |
| Duplication | No duplicated logic; extract to shared utilities |

### 11.2 Architecture

| Requirement | Standard |
|---|---|
| Module boundaries | Clear separation: presentation → API → service → data |
| Dependency direction | Inward only; outer layers depend on inner, not vice versa |
| Agent isolation | Each AI agent is independently testable and replaceable |
| API consistency | Uniform error schema; consistent naming conventions |

### 11.3 Documentation

| Requirement | Standard |
|---|---|
| README | Setup instructions, architecture overview, deployment guide |
| API docs | Auto-generated OpenAPI (Swagger) |
| Code comments | Purpose-level comments only; avoid obvious comments |

---

## 12. Extensibility

### 12.1 Extension Points

Future additions shall not require rewriting existing modules:

| Extension | Integration Point | Effort Target |
|---|---|---|
| New AI model (e.g., Anthropic Claude) | Agent abstraction layer | < 1 day |
| New cyber role (e.g., Cloud Security Engineer) | Role Blueplate template | < 2 hours |
| New mission type (e.g., SIEM log replay) | Mission Generator plugin | < 2 days |
| New report format (e.g., PDF) | Report Generator adapter | < 1 day |
| New scoring rubric | Rubric configuration | < 2 hours |

### 12.2 Design Patterns

| Pattern | Application |
|---|---|
| Strategy pattern | Interchangeable AI agents |
| Adapter pattern | Pluggable LLM providers |
| Template method | Consistent agent execution lifecycle |
| Repository pattern | Abstracted data access |

---

## 13. Portability

### 13.1 Browser Support

| Browser | Support Level |
|---|---|
| Google Chrome (latest 2 versions) | Full |
| Mozilla Firefox (latest 2 versions) | Full |
| Apple Safari (latest 2 versions) | Full |
| Microsoft Edge (latest 2 versions) | Full |

### 13.2 Deployment Targets

| Environment | MVP Support | Notes |
|---|---|---|
| Local Docker Compose | Yes | Primary deployment for hackathon |
| Railway | Yes | Backup deployment option |
| Render | Yes | Backup deployment option |
| Manual (no Docker) | Partial | Requires Python 3.12 + Node 18+ |

### 13.3 Containerization

| Requirement | Specification |
|---|---|
| Container runtime | Docker with Compose |
| Base images | python:3.12-slim, node:20-alpine |
| Image size target | < 500MB per service |
| Startup time | < 10 seconds per service |

---

## 14. Compatibility

### 14.1 Input Formats

| Format | Support | MVP Priority |
|---|---|---|
| Plain text (TXT) | Full | P0 |
| PDF | Full | P1 |
| DOCX | Full | P1 |
| URL (job posting link) | Not supported | P3 |

### 14.2 Output Formats

| Format | Support | MVP Priority |
|---|---|---|
| JSON (API responses) | Full | P0 |
| HTML (web reports) | Full | P0 |
| PDF (downloadable reports) | Not supported | P2 |
| CSV (data export) | Not supported | P3 |

### 14.3 API Compatibility

| Requirement | Standard |
|---|---|
| API protocol | REST over HTTPS |
| Content type | application/json |
| Versioning | URL prefix (/v1/) |
| Error format | Consistent JSON error schema |
| Pagination | Cursor-based for list endpoints |

---

## 15. Observability

### 15.1 Logging Requirements

| Event Type | Data Captured | MVP Priority |
|---|---|---|
| API requests | Method, path, status code, duration, correlation ID | P1 |
| AI agent calls | Agent name, session ID, prompt tokens, completion tokens, latency, success/failure | P0 |
| Assessment lifecycle | Created, started, turn_completed, paused, resumed, completed, timed_out | P0 |
| Errors | Exception type, message, stack trace, context, correlation ID | P0 |
| Authentication | Login attempts (success/failure), registration | P1 |

### 15.2 Log Format

| Requirement | Specification |
|---|---|
| Format | Structured JSON with consistent schema |
| Timestamp | ISO 8601 with timezone |
| Correlation ID | Attached to request at ingress; propagated to all downstream logs |
| Sensitive data | No passwords, tokens, or PII in logs |

### 15.3 Monitoring (MVP)

| Requirement | Approach |
|---|---|
| Health check endpoint | GET /health returns database connectivity and LLM API status |
| Demo monitoring | Console logs + periodic manual check |

---

## 16. AI Requirements

### 16.1 Output Quality

| Requirement | Specification |
|---|---|
| Output format | Structured JSON validated against Pydantic schemas |
| Hallucination prevention | Rubric-first evaluation constrains LLM to evidence generation; structured outputs enforce schema adherence |
| Score consistency | Same input produces same score (deterministic post-processing) |
| Temperature setting | 0.1 for evaluation tasks; 0.7 for generation tasks |

### 16.2 Error Handling

| Requirement | Approach |
|---|---|
| Malformed output detection | Schema validation on all LLM responses |
| Retry strategy | Transient failures: exponential backoff (3 attempts) |
| Persistent failure | Graceful degradation with partial results |
| Timeout handling | 30-second timeout per LLM call |

### 16.3 Explainability

| Requirement | Specification |
|---|---|
| Score rationale | Natural language explanation for every score dimension |
| Evidence citation | Specific candidate statements quoted per score |
| Confidence indication | High/medium/low confidence per assessment dimension |

---

## 17. Compliance

### 17.1 Framework Alignment

| Framework | Alignment | MVP Status |
|---|---|---|
| OWASP Top 10 | Web security best practices | Designed for alignment |
| MITRE ATT&CK | Assessment mapping context | Implemented for scoring |
| NICE NIST SP 800-181 | Role and competency framework | Implemented for assessment |
| WCAG 2.1 AA | Accessibility | Designed as target |

### 17.2 Compliance Notes

| Statement | Detail |
|---|---|
| The MVP does not claim formal certification | Compliance alignment is architectural, not certified |
| Accessibility is a design target | WCAG 2.1 AA is the design standard; full audit deferred |
| No regulated data processed | The platform does not handle PHI, PII beyond email/name, or financial data |

---

## 18. Risk Management

### 18.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| LLM API downtime during demo | High — assessment cannot proceed | Low | Retry with backoff; local fallback mode with canned responses |
| LLM hallucination in scoring | High — incorrect scores undermine trust | Medium | Rubric-first architecture constrains LLM to evidence; confidence scores flag uncertainty |
| Voice recognition failure | Medium — candidate must switch to text | Medium | Manual text fallback always available; no loss of functionality |
| Session data loss | High — candidate must restart | Low | Auto-save after every turn; write-ahead logging |
| Browser incompatibility | Medium — specific browser fails | Low | Test on Chrome, Firefox, Safari, Edge before demo |
| API cost overrun | Medium — budget exceeded during extended demo | Medium | Token budgeting; prompt caching; local fallback |

### 18.2 Project Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Time overruns | Missed demo deadline | Strict P0 scope freeze; cut all P1+ features if behind |
| Team member unavailable | Reduced capacity | Cross-train on critical paths; document key decisions |
| Integration complexity | Delayed end-to-end flow | Continuous integration from day 1; early API contracts |

---

## 19. Acceptance Criteria

### 19.1 MVP Acceptance Gates

The MVP is considered acceptable for demo when all of the following are true:

| Gate | Criteria |
|---|---|
| G-01 | User can register and log in |
| G-02 | User can upload or select a job description |
| G-03 | System generates an assessment blueprint within 15 seconds |
| G-04 | Candidate can complete a 5+ turn conversational assessment |
| G-05 | Every response generates a reasoned evaluation within 10 seconds |
| G-06 | Scores include natural language explanation with evidence citations |
| G-07 | MITRE ATT&CK mapping is displayed in the report |
| G-08 | Learning roadmap with 3+ topics is generated |
| G-09 | Full session transcript is viewable with annotations |
| G-10 | Recruiter report view displays readiness level and competency profile |
| G-11 | All API responses conform to documented schemas |
| G-12 | No unhandled errors during the complete assessment flow |
| G-13 | Assessment can be completed without external guidance |

### 19.2 Quality Gates

| Gate | Criteria |
|---|---|
| Q-01 | All P0 functional requirements implemented and tested |
| Q-02 | AI agent outputs validated against expected schemas |
| Q-03 | Security review: no secrets in code, no missing auth checks |
| Q-04 | Demo walkthrough completed without errors |
| Q-05 | Load test: 5 concurrent sessions succeed |

---

## 20. NFR Traceability Matrix

| ID | Category | Requirement | MVP Target | Priority |
|---|---|---|---|---|
| NFR-PERF-01 | Performance | Landing page load < 2s | < 2s FCP | P0 |
| NFR-PERF-02 | Performance | JD parsing < 10s | < 10s | P0 |
| NFR-PERF-03 | Performance | Mission generation < 15s | < 15s | P0 |
| NFR-PERF-04 | Performance | Per-turn evaluation < 10s | < 10s (target 3s) | P0 |
| NFR-PERF-05 | Performance | Report generation < 5s | < 5s | P0 |
| NFR-REL-01 | Reliability | AI failure retry with backoff | 3 attempts | P0 |
| NFR-REL-02 | Reliability | Session persistence per turn | Every turn | P0 |
| NFR-REL-03 | Reliability | Graceful degradation on AI failure | Partial results | P0 |
| NFR-AVAIL-01 | Availability | Uptime during demo periods | > 95% | P0 |
| NFR-SCALE-01 | Scalability | Concurrent assessment sessions | 20 | P1 |
| NFR-SEC-01 | Security | Password hashing (bcrypt cost 12) | Implemented | P0 |
| NFR-SEC-02 | Security | JWT authentication | 24h expiry | P0 |
| NFR-SEC-03 | Security | API key protection | Server-side only | P0 |
| NFR-SEC-04 | Security | Input validation on all endpoints | Pydantic schemas | P0 |
| NFR-SEC-05 | Security | Rate limiting on auth | 5/min | P0 |
| NFR-PRIV-01 | Privacy | No PII in AI prompts | Implemented | P0 |
| NFR-PRIV-02 | Privacy | No voice recording retention | Transcription only | P1 |
| NFR-USAB-01 | Usability | < 5 min to understand interface | Verified | P1 |
| NFR-USAB-02 | Usability | Clear progress indicators | Implemented | P1 |
| NFR-ACCESS-01 | Accessibility | WCAG 2.1 AA target | Designed for | P2 |
| NFR-MAINT-01 | Maintainability | TypeScript strict mode | Enabled | P1 |
| NFR-MAINT-02 | Maintainability | Python type hints | All functions | P1 |
| NFR-MAINT-03 | Maintainability | Modular architecture | Layer separation | P0 |
| NFR-EXT-01 | Extensibility | New role template < 2 hours | Implemented | P1 |
| NFR-PORT-01 | Portability | Browser support (4 major) | Latest 2 versions | P1 |
| NFR-COMPAT-01 | Compatibility | Input: TXT, PDF, DOCX | TXT (P0), PDF/DOCX (P1) | P1 |
| NFR-OBS-01 | Observability | AI agent logging (timing, tokens) | Implemented | P0 |
| NFR-OBS-02 | Observability | Error logging with correlation IDs | Implemented | P0 |
| NFR-AI-01 | AI Quality | Structured JSON outputs | Schema validated | P0 |
| NFR-AI-02 | AI Quality | Score rationale with evidence | Implemented | P0 |
| NFR-AI-03 | AI Quality | Hallucination mitigation | Rubric-first | P0 |
| NFR-COMP-01 | Compliance | OWASP alignment | Designed for | P1 |
| NFR-COMP-02 | Compliance | WCAG 2.1 AA target | Designed for | P2 |

### Priority Summary

| Priority | Count | Categories |
|---|---|---|
| P0 | 19 | Performance (critical paths), reliability, security (core), privacy, maintainability (modularity), observability, AI quality |
| P1 | 11 | Scalability (adequate), usability, accessibility (partial), maintainability (typing), extensibility, portability, compatibility, compliance (design) |
| P2 | 3 | Accessibility (full), compliance (audit) |
| **Total** | **33** | |

### Commitment Statement

All P0 non-functional requirements are considered part of the MVP definition. The team commits to satisfying these requirements before considering the demo complete. P1 and P2 requirements are aspirational targets that will be addressed as time permits after ensuring P0 stability.
