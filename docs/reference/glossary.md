# PWNDORA SkillScan X — Glossary

> Comprehensive terminology reference for the PWNDORA SkillScan X platform.

---

## A

**Adaptive Intelligence**
The platform's capability to adjust assessment difficulty in real-time based on professional performance, ranging within ±2 sigma of the estimated skill level.

**AI Mentor**
A guided learning companion that provides hints, explanations, and feedback without ever answering assessment questions. The AI Mentor is strictly a coach, not a test-answerer.

**Assessment Blueprint**
A structured plan generated from the Skill DNA Profile defining mission count, topic areas, difficulty range, estimated duration (20–45 min), and evaluation criteria mapped to the NICE framework.

---

## C

**Capability Analyst**
A platform user responsible for creating assessments, reviewing professional reports, and making evidence-informed hiring decisions. Capability analysts may not have deep cybersecurity expertise.

**Capability Heatmap**
A multi-dimensional radar chart visualization of verified strengths and gaps across cybersecurity domains. Provides an at-a-glance view of a professional's capability landscape.

**Capability Intelligence**
The core assessment lifecycle coordination module — planning, session management, adaptive difficulty, scenario orchestration, progress tracking, and recovery.

**Capability Reasoning Engine**
The AI module that evaluates professional responses across multiple dimensions: concept extraction, workflow validation, decision quality, risk awareness, communication clarity, and MITRE ATT&CK mapping.

**Career Compass**
AI-driven career progression pathways mapped from identified capability gaps. Recommends learning resources, labs, and reassessment timing to close gaps and advance toward target roles.

**Cyber Twin**
A persistent digital representation of a professional's verified cybersecurity capability profile, built from assessment evidence across multiple sessions and roles. The Cyber Twin evolves as the professional completes more assessments.

---

## E

**Evidence Intelligence Engine**
The AI module that transforms evaluation results into transparent, explainable score rationales with traceable evidence citations from the professional's own responses.

**Evidence-Based Assessment**
The methodological principle that every score must be supported by specific evidence from the professional's responses, with natural language rationale explaining what was evaluated and why.

**Explainability**
The property of an assessment score being traceable to specific evidence in the professional's responses, with natural language rationale. No black-box scoring.

---

## J

**JD Intelligence Engine**
The module that parses unstructured job descriptions (PDF, DOCX, TXT) and extracts structured requirements including role title, required skills, experience level, certifications, and responsibilities.

---

## L

**Learning Intelligence**
The coordinated system of learning path generation, resource recommendation, reassessment timing, and AI Mentor guidance that closes the capability development loop.

**Learning Path Engine**
The AI module that identifies skill gaps from assessment scores, ranks learning topics by gap impact and prerequisite order, associates curated learning resources, and generates the Career Compass.

---

## M

**MITRE ATT&CK**
A globally accessible knowledge base of adversary tactics and techniques based on real-world observations. The platform maps professional responses to relevant ATT&CK technique IDs and generates coverage matrices.

**Modular Monolith**
The architectural pattern used for the MVP — all modules in a single deployable unit with clear domain boundaries, allowing future extraction into microservices without changing public APIs.

---

## N

**NICE Workforce Framework**
(NIST SP 800-181 Rev 1) The National Initiative for Cybersecurity Education Workforce Framework. The platform aligns Skill DNA Profiles to NICE work roles, capabilities, and knowledge areas.

---

## P

**Practical Challenge Engine**
The AI module that generates realistic cybersecurity incident scenarios (missions) across multiple domains: SOC operations, incident response, threat hunting, malware analysis, cloud security, network security, DFIR, and identity security.

**Professional**
A platform user who completes capability assessments to validate skills, identify gaps, and receive a personalized Career Compass. Professionals may be students, graduates, SOC analysts, or experienced practitioners.

---

## S

**Skill DNA**
The unique capability fingerprint derived from assessment evidence. Each professional has a distinct Skill DNA representing their verified strengths, gaps, and growth trajectory across cybersecurity domains.

**Skill DNA Engine**
The AI module that transforms unstructured job descriptions or role selections into structured cybersecurity competency graphs — the Skill DNA Profile — with knowledge areas, assessment objectives, and rubric references.

**Skill DNA Profile**
The canonical representation of role requirements derived from job descriptions, framework mappings, or manual configuration. Includes skills, NICE roles, MITRE knowledge areas, capabilities, responsibilities, and assessment objectives.

---

## T

**Turn (Conversational)**
A single exchange in the adaptive assessment: system presents a mission context or follow-up question, professional responds, system evaluates. A full assessment consists of multiple turns across several missions.

---

## V

**Voice Assessment**
Browser-based speech recognition (Web Speech API) that captures spoken professional responses, transcribes them in real-time, and processes them identically to text input. Manual text fallback is always available.

---

## Related Documents

| Document | Location |
|---|---|
| System Architecture | `../04-architecture/16-system-architecture.md` |
| AI Cognitive Architecture | `../04-architecture/17-ai-cognitive-architecture.md` |
| Cyber Twin Concept | `../concepts/cyber-twin.md` |
| Capability Heatmap | `../concepts/capability-heatmap.md` |
| AI Mentor Concept | `../concepts/ai-mentor.md` |
| Career Compass | `../concepts/career-compass.md` |
