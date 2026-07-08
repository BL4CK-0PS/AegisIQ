# AegisIQ — Prompts

> AI prompt templates organized by engine and purpose.

---

## Purpose

This directory stores the system and user prompt templates used by the AegisIQ AI pipeline. Each prompt is versioned, tested, and tied to a specific AI engine.

Prompts are version-controlled alongside code so changes are traceable and reviewable.

---

## Prompt Catalog

| Prompt | Engine | Purpose |
|---|---|---|
| `system.md` | Global | Core platform rules and constraints |
| `role-extraction.md` | Role Blueprint | Extract competencies from JD |
| `assessment-planning.md` | Assessment | Generate assessment blueprint |
| `mission-soc.md` | Mission Gen | SOC investigation scenarios |
| `mission-ir.md` | Mission Gen | Incident response scenarios |
| `mission-threat-hunting.md` | Mission Gen | Threat hunting scenarios |
| `mission-malware.md` | Mission Gen | Malware analysis scenarios |
| `mission-cloud.md` | Mission Gen | Cloud security scenarios |
| `mission-network.md` | Mission Gen | Network security scenarios |
| `mission-dfir.md` | Mission Gen | Digital forensics scenarios |
| `mission-identity.md` | Mission Gen | Identity security scenarios |
| `evaluation.md` | Cyber Reasoning | Analyze and score responses |
| `explainability.md` | Explainability | Generate evidence-backed explanations |
| `learning.md` | Learning | Generate learning roadmaps |

---

## Prompt Format

```markdown
# Prompt Name
Version: 1.0
Engine: [engine name]
Last Updated: YYYY-MM-DD

## System Instructions
...

## Task Description
...

## Output Schema
```json
{
  "field": "description"
}
```

## Examples
...
```

Each prompt includes:
- Version number
- Target engine
- Structured output schema
- Example inputs and expected outputs

---

## Guidelines

- One file per prompt — no monolithic prompt files
- All prompts return structured JSON
- Prompts are validated against schemas before use
- Version bump when prompt logic changes meaningfully
- Test prompts with known inputs before committing
