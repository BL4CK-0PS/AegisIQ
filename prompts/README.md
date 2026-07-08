# PWNDORA SkillScan X — Prompts

> AI prompt templates organized by engine and purpose.

---

## Purpose

This directory stores the system and user prompt templates used by the PWNDORA SkillScan X AI pipeline. Each prompt is versioned, tested, and tied to a specific AI engine.

Prompts are version-controlled alongside code so changes are traceable and reviewable.

---

## Prompt Catalog

| Prompt | Engine | Purpose |
|---|---|---|
| `system.md` | Global | Core platform rules and constraints |
| `skill-dna-extraction.md` | Skill DNA | Extract competencies from JD |
| `assessment-planning.md` | Capability Intelligence | Generate assessment blueprint |
| `challenge-soc.md` | Practical Challenge | SOC investigation scenarios |
| `challenge-ir.md` | Practical Challenge | Incident response scenarios |
| `challenge-threat-hunting.md` | Practical Challenge | Threat hunting scenarios |
| `challenge-malware.md` | Practical Challenge | Malware analysis scenarios |
| `challenge-cloud.md` | Practical Challenge | Cloud security scenarios |
| `challenge-network.md` | Practical Challenge | Network security scenarios |
| `challenge-dfir.md` | Practical Challenge | Digital forensics scenarios |
| `challenge-identity.md` | Practical Challenge | Identity security scenarios |
| `evaluation.md` | Capability Reasoning | Analyze and score responses |
| `evidence-intelligence.md` | Evidence Intelligence | Generate evidence-backed explanations |
| `learning-path.md` | Learning Path | Generate learning roadmaps |
| `ai-mentor.md` | AI Mentor | Provide guidance and recommendations |
| `cyber-twin.md` | Cyber Twin | Profile capability modeling |
| `career-compass.md` | Career Compass | Career progression pathing |

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
