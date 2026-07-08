# AegisIQ — Use Cases

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Published |
| **Classification** | Internal |
| **Last Updated** | 2026-07-08 |
| **Owner** | Product Team |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-07-08 | Team AegisIQ | Initial release |

---

## 1. Executive Summary

This document defines every use case for AegisIQ. Each use case describes a specific interaction between an actor and the system to achieve a concrete outcome. Use cases are organized by domain module and priority to guide implementation sequencing.

Every use case traces to a persona and to functional requirements.

---

## 2. Use Case Convention

```
UC-[Module]-[Number]: [Title]
  Actor:         [Primary stakeholder]
  Trigger:       [What starts this use case]
  Precondition:  [State required before execution]
  Postcondition: [State after successful execution]
  Priority:      [P0 / P1 / P2]
  Linked To:     [Personas, FR IDs]
  Main Flow:     [Numbered steps]
  Extensions:    [Alternative flows and edge cases]
```

---

## 3. Use Case Catalog

### 3.1 Module: Account and Identity

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-ACC-001 | Register as candidate | Candidate | P0 |
| UC-ACC-002 | Register as recruiter | Recruiter | P0 |
| UC-ACC-003 | Verify email address | All | P0 |
| UC-ACC-004 | Log in | All | P0 |
| UC-ACC-005 | Reset password | All | P0 |
| UC-ACC-006 | Manage profile | All | P1 |
| UC-ACC-007 | Delete account | All | P2 |

---

#### UC-ACC-001: Register as Candidate

| Field | Value |
|---|---|
| **ID** | UC-ACC-001 |
| **Actor** | Candidate |
| **Trigger** | Candidate visits sign-up page |
| **Precondition** | No existing account with same email |
| **Postcondition** | Unverified account created; verification email sent |
| **Priority** | P0 |
| **Linked To** | Personas 1-3; FR-ACC-001 through FR-ACC-005 |

**Main Flow**

1. Candidate navigates to /signup
2. System renders registration form (email, password, name)
3. Candidate submits credentials
4. System validates format and uniqueness
5. System creates unverified account
6. System sends verification email
7. System redirects to verification-pending screen

**Extensions**

- 4a. Email already registered: Show login prompt
- 4b. Weak password: Show strength requirements
- 6a. Email delivery fails: Show resend button

---

#### UC-ACC-002: Register as Recruiter

| Field | Value |
|---|---|
| **ID** | UC-ACC-002 |
| **Actor** | Recruiter |
| **Trigger** | Recruiter visits sign-up page |
| **Precondition** | Corporate email domain recognized or verifiable |
| **Postcondition** | Recruiter account created; pending verification |
| **Priority** | P0 |
| **Linked To** | Persona 4; FR-ACC-001 through FR-ACC-005 |

**Main Flow**

1. Recruiter navigates to /signup?type=recruiter
2. System renders registration form with company field
3. Recruiter enters work email, password, company name
4. System validates email domain
5. System creates recruiter account (unverified)
6. System sends verification email + admin notification
7. System redirects to onboarding

**Extensions**

- 4a. Domain unrecognized: Queue for manual verification

---

#### UC-ACC-003: Verify Email

| Field | Value |
|---|---|
| **ID** | UC-ACC-003 |
| **Actor** | All |
| **Trigger** | User clicks verification link |
| **Precondition** | Unverified account exists; token valid |
| **Postcondition** | Account verified; redirected to onboarding |
| **Priority** | P0 |

**Main Flow**

1. User clicks link in verification email
2. System validates token and expiration
3. System marks account as verified
4. System redirects to onboarding

**Extensions**

- 2a. Token expired: Show resend prompt
- 2b. Invalid token: Show error with request new link

---

### 3.2 Module: Onboarding

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-ONB-001 | Complete candidate onboarding | Candidate | P0 |
| UC-ONB-002 | Complete recruiter onboarding | Recruiter | P0 |
| UC-ONB-003 | Select target role | Candidate | P0 |
| UC-ONB-004 | Upload job description | Candidate, Recruiter | P1 |
| UC-ONB-005 | Configure company profile | Recruiter | P1 |

---

#### UC-ONB-001: Complete Candidate Onboarding

| Field | Value |
|---|---|
| **ID** | UC-ONB-001 |
| **Actor** | Candidate |
| **Trigger** | Email verified |
| **Precondition** | Account exists and verified |
| **Postcondition** | Profile configured; ready for role selection |
| **Priority** | P0 |

**Main Flow**

1. System redirects to onboarding wizard
2. Candidate selects experience tier (Student / Graduate / Analyst)
3. Candidate lists certifications (optional)
4. Candidate sets availability (optional)
5. System saves profile; transitions to role selection

**Extensions**

- 2a. Unsure of tier: Show descriptions; allow skip
- 4a. Availability not set: Default to no limit

---

#### UC-ONB-003: Select Target Role

| Field | Value |
|---|---|
| **ID** | UC-ONB-003 |
| **Actor** | Candidate |
| **Trigger** | Onboarding complete |
| **Precondition** | Candidate profile exists |
| **Postcondition** | Target role selected; Blueprint generation available |
| **Priority** | P0 |

**Main Flow**

1. System displays role catalog filtered by experience tier
2. System shows per-role details (domains, difficulty, typical titles)
3. Candidate browses and selects a role
4. System records selection

**Extensions**

- 3a. No suitable role: Show custom role builder

---

### 3.3 Module: Role Blueprint

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-RBP-001 | Generate Blueprint from role | Candidate, Recruiter | P0 |
| UC-RBP-002 | Generate Blueprint from JD | Candidate, Recruiter | P1 |
| UC-RBP-003 | Review and customize Blueprint | Candidate, Recruiter | P1 |
| UC-RBP-004 | Save Blueprint as template | Recruiter | P2 |
| UC-RBP-005 | Compare Blueprints | Recruiter | P2 |

---

#### UC-RBP-001: Generate Blueprint from Role

| Field | Value |
|---|---|
| **ID** | UC-RBP-001 |
| **Actor** | Candidate |
| **Trigger** | Role selected from catalog |
| **Precondition** | Onboarding complete |
| **Postcondition** | Blueprint generated; ready for review |
| **Priority** | P0 |
| **Linked To** | FR-RBP-001 through FR-RBP-008 |

**Main Flow**

1. System loads role definition from repository
2. System maps role to NICE framework competencies with targets
3. System generates Blueprint (competencies, weights, targets)
4. System renders Blueprint for review
5. Candidate confirms or customizes

**Extensions**

- 2a. Role not found: Fall back to manual builder
- 5a. Customize: Transition to UC-RBP-003

---

#### UC-RBP-002: Generate Blueprint from JD

| Field | Value |
|---|---|
| **ID** | UC-RBP-002 |
| **Actor** | Candidate, Recruiter |
| **Trigger** | User uploads a job description |
| **Precondition** | JD text or document available |
| **Postcondition** | Blueprint generated from parsed JD |
| **Priority** | P1 |

**Main Flow**

1. User uploads JD (paste or PDF/DOCX/TXT)
2. System parses JD for skills, certifications, responsibilities
3. System maps requirements to NICE competencies
4. System generates Blueprint with confidence scores
5. System flags unmappable requirements
6. User resolves conflicts and confirms

---

### 3.4 Module: Assessment

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-ASM-001 | Start assessment | Candidate | P0 |
| UC-ASM-002 | Complete mission | Candidate | P0 |
| UC-ASM-003 | Respond to probe | Candidate | P0 |
| UC-ASM-004 | Pause and resume | Candidate | P0 |
| UC-ASM-005 | Submit assessment | Candidate | P0 |
| UC-ASM-006 | Adaptive difficulty | Candidate | P1 |
| UC-ASM-007 | Handle timeout | Candidate | P1 |
| UC-ASM-008 | Save and exit | Candidate | P1 |

---

#### UC-ASM-001: Start Assessment

| Field | Value |
|---|---|
| **ID** | UC-ASM-001 |
| **Actor** | Candidate |
| **Trigger** | Candidate selects Start Assessment |
| **Precondition** | Blueprint confirmed; assessment configured |
| **Postcondition** | Session initialized; first mission loaded |
| **Priority** | P0 |

**Main Flow**

1. Candidate reviews overview (missions, time, domains)
2. Candidate confirms start
3. System initializes session, starts timer, loads first mission
4. System renders mission prompt

**Extensions**

- 2a. Incomplete session exists: Offer resume

---

#### UC-ASM-002: Complete Mission

| Field | Value |
|---|---|
| **ID** | UC-ASM-002 |
| **Actor** | Candidate |
| **Trigger** | Candidate provides final response |
| **Precondition** | Mission active |
| **Postcondition** | Responses recorded; next mission loaded or assessment ends |
| **Priority** | P0 |

**Main Flow**

1. Candidate reads incident scenario with artifacts
2. Candidate submits response
3. System records response, evaluates in real-time
4. System generates follow-up probe
5. Candidate responds to probe
6. System repeats for configured rounds
7. System marks mission complete; transitions to next

---

#### UC-ASM-004: Pause and Resume

| Field | Value |
|---|---|
| **ID** | UC-ASM-004 |
| **Actor** | Candidate |
| **Trigger** | Candidate pauses assessment |
| **Precondition** | Assessment in progress |
| **Postcondition** | Session persisted; timer paused |
| **Priority** | P0 |

**Main Flow**

1. Candidate selects Pause
2. System persists session state
3. System stops timer
4. System redirects to dashboard with Resume banner

---

#### UC-ASM-005: Submit Assessment

| Field | Value |
|---|---|
| **ID** | UC-ASM-005 |
| **Actor** | Candidate |
| **Trigger** | All missions complete or manual submit |
| **Precondition** | At least one mission completed |
| **Postcondition** | Assessment locked; async report generation triggered |
| **Priority** | P0 |

**Main Flow**

1. System displays completion summary
2. Candidate confirms submission
3. System locks assessment
4. System triggers async report generation
5. System redirects to Report Pending screen

**Extensions**

- 1a. No missions completed: Allow submit but warn

---

### 3.5 Module: Cyber Reasoning

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-REA-001 | Evaluate response reasoning | System | P0 |
| UC-REA-002 | Generate evidence trace | System | P0 |
| UC-REA-003 | Assess decision quality | System | P1 |
| UC-REA-004 | Compute confidence score | System | P1 |
| UC-REA-005 | Detect cheating | System | P1 |

---

#### UC-REA-001: Evaluate Response Reasoning

| Field | Value |
|---|---|
| **ID** | UC-REA-001 |
| **Actor** | AI Engine |
| **Trigger** | Candidate submits mission response |
| **Precondition** | Response text captured |
| **Postcondition** | Evaluation produced (accuracy, completeness, justification) |
| **Priority** | P0 |

**Main Flow**

1. System receives response text
2. System evaluates factual accuracy against ground truth
3. System evaluates completeness (missing steps)
4. System evaluates justification quality (evidence, logic)
5. System assigns dimension scores
6. System stores evaluation results

---

#### UC-REA-002: Generate Evidence Trace

| Field | Value |
|---|---|
| **ID** | UC-REA-002 |
| **Actor** | AI Engine |
| **Trigger** | Reasoning evaluation complete |
| **Precondition** | UC-REA-001 produced scores |
| **Postcondition** | Evidence trace linking scores to specific statements |
| **Priority** | P0 |

**Main Flow**

1. System loads response and evaluation
2. System identifies statements supporting or reducing each score
3. System generates trace document
4. System stores trace for report inclusion

---

### 3.6 Module: Reporting

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-RPT-001 | Generate candidate report | System | P0 |
| UC-RPT-002 | View candidate report | Candidate | P0 |
| UC-RPT-003 | View recruiter report | Recruiter | P0 |
| UC-RPT-004 | Compare candidates | Recruiter | P1 |
| UC-RPT-005 | Download report as PDF | All | P1 |
| UC-RPT-006 | Share report with employer | Candidate | P1 |

---

#### UC-RPT-001: Generate Candidate Report

| Field | Value |
|---|---|
| **ID** | UC-RPT-001 |
| **Actor** | System |
| **Trigger** | Assessment submitted (UC-ASM-005) |
| **Precondition** | All mission evaluations complete |
| **Postcondition** | Report generated and available |
| **Priority** | P0 |

**Main Flow**

1. System aggregates all mission evaluations
2. System computes domain-level scores
3. System generates competency profile vs. Blueprint targets
4. System identifies strengths and gaps
5. System produces learning recommendations
6. System generates recruiter summary section
7. System stores report; notifies user

---

#### UC-RPT-002: View Candidate Report

| Field | Value |
|---|---|
| **ID** | UC-RPT-002 |
| **Actor** | Candidate |
| **Trigger** | Candidate opens report |
| **Precondition** | Report generated (UC-RPT-001) |
| **Postcondition** | Report displayed with all sections |
| **Priority** | P0 |

**Main Flow**

1. System loads report data
2. System renders sections (scores, reasoning, evidence, gaps, roadmap)
3. Candidate navigates between sections
4. Candidate expands detail views

---

#### UC-RPT-003: View Recruiter Report

| Field | Value |
|---|---|
| **ID** | UC-RPT-003 |
| **Actor** | Recruiter |
| **Trigger** | Recruiter opens candidate report |
| **Precondition** | Candidate completed assessment; recruiter has access |
| **Postcondition** | Recruiter-friendly report displayed |
| **Priority** | P0 |

**Main Flow**

1. System loads report for candidate
2. System renders recruiter view (readiness, pass/fail, interview focus)
3. Recruiter reviews readiness level
4. Recruiter expands domain details as needed

---

### 3.7 Module: Learning

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-LRN-001 | Generate learning roadmap | System | P0 |
| UC-LRN-002 | View learning roadmap | Candidate | P1 |
| UC-LRN-003 | Update roadmap progress | Candidate | P2 |
| UC-LRN-004 | Schedule reassessment | Candidate | P1 |

---

#### UC-LRN-001: Generate Learning Roadmap

| Field | Value |
|---|---|
| **ID** | UC-LRN-001 |
| **Actor** | System |
| **Trigger** | Report generation complete (UC-RPT-001) |
| **Precondition** | Gap analysis available |
| **Postcondition** | Prioritized learning roadmap generated |
| **Priority** | P0 |

**Main Flow**

1. System identifies gaps sorted by severity
2. System maps gaps to learning resources
3. System orders by dependency (foundational first)
4. System adds effort estimates
5. System stores roadmap linked to candidate

---

### 3.8 Module: Recruiter Pipeline

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-PPL-001 | Create assessment invite | Recruiter | P0 |
| UC-PPL-002 | View candidate pipeline | Recruiter | P1 |
| UC-PPL-003 | Update candidate status | Recruiter | P1 |
| UC-PPL-004 | Compare candidates | Recruiter | P1 |
| UC-PPL-005 | Export pipeline report | Recruiter | P2 |

---

#### UC-PPL-001: Create Assessment Invite

| Field | Value |
|---|---|
| **ID** | UC-PPL-001 |
| **Actor** | Recruiter |
| **Trigger** | Recruiter selects Invite Candidate |
| **Precondition** | Assessment template configured |
| **Postcondition** | Unique invite link generated and sent |
| **Priority** | P0 |

**Main Flow**

1. Recruiter selects assessment template
2. Recruiter enters candidate email
3. System generates unique invite link with expiration
4. System sends invite email
5. System adds candidate to pipeline

**Extensions**

- 2a. Bulk candidates: Support CSV upload

---

### 3.9 Module: Trainer Cohort

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-TRN-001 | Create cohort | Trainer | P1 |
| UC-TRN-002 | Add students | Trainer | P1 |
| UC-TRN-003 | Assign assessment | Trainer | P1 |
| UC-TRN-004 | Monitor progress | Trainer | P1 |
| UC-TRN-005 | View analytics | Trainer | P1 |
| UC-TRN-006 | Export cohort report | Trainer | P2 |

---

#### UC-TRN-001: Create Cohort

| Field | Value |
|---|---|
| **ID** | UC-TRN-001 |
| **Actor** | Trainer |
| **Trigger** | Trainer selects Create Cohort |
| **Precondition** | Trainer account exists |
| **Postcondition** | Cohort created; ready for student addition |
| **Priority** | P1 |

**Main Flow**

1. Trainer enters cohort name, description, date range
2. Trainer configures assessment schedule
3. System validates parameters
4. System creates cohort
5. System redirects to student management

---

#### UC-TRN-004: Monitor Cohort Progress

| Field | Value |
|---|---|
| **ID** | UC-TRN-004 |
| **Actor** | Trainer |
| **Trigger** | Trainer opens cohort dashboard |
| **Precondition** | Cohort has students with assessments |
| **Postcondition** | Progress dashboard displayed |
| **Priority** | P1 |

**Main Flow**

1. System loads cohort data (completion, scores, time)
2. System renders aggregate view
3. Trainer identifies students below threshold
4. Trainer drills into individual report

---

### 3.10 Module: Administration

| ID | Use Case | Actor | Priority |
|---|---|---|---|
| UC-ADM-001 | Manage users | Admin | P2 |
| UC-ADM-002 | Configure Blueprint library | Admin | P2 |
| UC-ADM-003 | View system health | Admin | P2 |

---

## 4. Use Case Dependency Graph

```
UC-ACC-001 / UC-ACC-002
        ↓
UC-ACC-003
        ↓
UC-ONB-001 / UC-ONB-002
        ↓
UC-ONB-003
        ↓
UC-RBP-001 / UC-RBP-002
        ↓
UC-RBP-003 (optional)
        ↓
UC-ASM-001
        ↓
UC-ASM-002 (repeated per mission)
        ↓
UC-ASM-005
        ↓
    ┌───┴───┐
    ↓       ↓
UC-REA-001 UC-RPT-001
    ↓       ↓
UC-REA-002 UC-RPT-002 / UC-RPT-003
                ↓
           UC-LRN-001
```

---

## 5. Use Case to Persona Mapping

| Module | Candidate | Recruiter | Manager | Trainer | University |
|---|---|---|---|---|---|
| Account | UC-ACC-001 | UC-ACC-002 | — | — | — |
| Onboarding | UC-ONB-001,003 | UC-ONB-002 | — | — | — |
| Blueprint | UC-RBP-001-003 | UC-RBP-001-005 | — | — | — |
| Assessment | UC-ASM-001-008 | — | — | — | — |
| Reasoning | — | — | — | — | — |
| Report | UC-RPT-002 | UC-RPT-003-005 | UC-RPT-003 | — | — |
| Learning | UC-LRN-001-004 | — | — | — | — |
| Pipeline | — | UC-PPL-001-005 | — | — | — |
| Cohort | — | — | — | UC-TRN-001-006 | UC-TRN-001-006 |
| Admin | — | — | — | — | UC-ADM-001-003 |

---

## 6. Use Case to Requirement Traceability

| Use Case | Functional Requirements |
|---|---|
| UC-ACC-001 | FR-ACC-001 through FR-ACC-003 |
| UC-ACC-002 | FR-ACC-001, FR-ACC-004 |
| UC-ACC-003 | FR-ACC-005 |
| UC-RBP-001 | FR-RBP-001 through FR-RBP-008 |
| UC-RBP-002 | FR-RBP-009 through FR-RBP-015 |
| UC-ASM-001 | FR-ASM-001 through FR-ASM-010 |
| UC-ASM-002 | FR-ASM-011 through FR-ASM-020 |
| UC-ASM-004 | FR-ASM-021, FR-ASM-022 |
| UC-ASM-005 | FR-ASM-023 through FR-ASM-025 |
| UC-REA-001 | FR-REA-001, FR-REA-002 |
| UC-REA-002 | FR-REA-003 |
| UC-RPT-001 | FR-RPT-001 through FR-RPT-005 |
| UC-RPT-002 | FR-RPT-006, FR-RPT-007 |
| UC-RPT-003 | FR-RPT-008, FR-RPT-009 |
| UC-LRN-001 | FR-LRN-001, FR-LRN-002 |
| UC-PPL-001 | FR-PPL-001 through FR-PPL-004 |
| UC-TRN-001 | FR-TRN-001, FR-TRN-002 |

---

## 7. Implementation Priority

| Priority | Use Cases | Scope |
|---|---|---|
| P0 | UC-ACC-001-005, UC-ONB-001-003, UC-RBP-001, UC-ASM-001-005, UC-REA-001-002, UC-RPT-001-003, UC-LRN-001 | Core platform |
| P1 | UC-ONB-004, UC-RBP-002-003, UC-ASM-006-008, UC-REA-003-005, UC-PPL-001-004, UC-TRN-001-005 | Extended workflows |
| P2 | UC-ACC-006-007, UC-RBP-004-005, UC-PPL-005, UC-TRN-006, UC-ADM-001-003 | Advanced |

---

## 8. Success Criteria

| Criterion | Target |
|---|---|
| P0 use cases covered | 100 percent |
| Each persona has matching use cases | All primary goals covered |
| Each main flow has at least one extension | All P0 use cases |
| No circular dependencies | Graph cycle check |

---

## 9. References

| Reference | Document |
|---|---|
| Personas | `../02-product/10-user-personas.md` |
| User journeys | `../03-experience/11-user-journey.md` |
| Functional requirements | `../02-product/08-functional-requirements.md` |
| Product requirements | `../02-product/07-product-requirements.md` |
