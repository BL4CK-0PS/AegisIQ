# AegisIQ — Datasets

> Sample data, test fixtures, and benchmark datasets for the AegisIQ platform.

---

## Purpose

This directory stores datasets used for:

- **Seed data** — Realistic sample records for development
- **Test fixtures** — Deterministic inputs for unit and integration tests
- **Benchmarks** — Standard datasets for evaluating AI reasoning accuracy
- **Rubrics** — Competency rubrics and evaluation criteria

---

## Planned Contents

```
datasets/
├── jd/                  Sample job descriptions (PDF, DOCX, TXT)
│   ├── soc-analyst/
│   ├── incident-responder/
│   ├── threat-hunter/
│   └── cloud-security-engineer/
├── blueprints/          Example role blueprints (JSON)
├── missions/            Sample mission scenarios
├── responses/           Sample candidate responses for testing
├── rubrics/             Evaluation rubrics by role
└── benchmarks/          Benchmark datasets for evaluation accuracy
```

Each dataset includes a metadata file describing source, format, and intended use.

---

## Format

| Data Type | Format | Description |
|---|---|---|
| Job descriptions | PDF, DOCX, TXT | Raw input files |
| Blueprints | JSON | Structured competency models |
| Missions | JSON | Scenarios with objectives and rubrics |
| Responses | JSON | Candidate transcripts and extracted concepts |
| Rubrics | JSON (or TOML) | Evaluation criteria and scoring rules |

---

## Adding Datasets

- Place files in the appropriate subdirectory
- Include a `README.md` or `metadata.json` describing the dataset
- Document the source and any licensing
- Use realistic but anonymized data
- Avoid including any real candidate information
