# Frequently Asked Questions

> Common questions about the PWNDORA SkillScan X platform, organized by topic.

## Platform Overview

**Q: What is PWNDORA SkillScan X?**
A: A comprehensive capability intelligence platform that maps, assesses, and develops workforce capabilities using AI-powered Skill DNA analysis, evidence-based assessments, and personalized learning pathways.

**Q: How is this different from traditional assessment tools?**
A: Unlike traditional tools that use self-reporting or single-point testing, SkillScan X uses multi-source evidence triangulation, continuous assessment, and Bayesian confidence modeling to produce reliable, defensible capability measurements.

**Q: Who is the target audience?**
A: The platform serves multiple stakeholders: individual professionals seeking career growth, mentors guiding development, team leads building capability, and organizations managing workforce intelligence.

## Assessment

**Q: How are assessments scored?**
A: Scores are computed using Bayesian updating across all available evidence — knowledge assessments, practical challenges, scenario responses, and behavioral signals. Each score includes a confidence interval indicating measurement reliability.

**Q: How long does an assessment take?**
A: Assessment duration varies by scope. Focused skill assessments take 15-30 minutes, while comprehensive capability evaluations may take 1-2 hours. The platform supports pause-and-resume.

**Q: Can I retake assessments?**
A: Yes. Re-assessment is encouraged as skills develop. The system tracks score progression over time and detects meaningful improvement vs. natural variance.

## AI & Data

**Q: How does the AI work?**
A: The platform uses a pipeline of specialized AI engines — Skill DNA blueprinting, capability assessment, practical challenge generation, capability reasoning, and evidence intelligence — each optimized for its specific function.

**Q: Is my data private?**
A: Yes. See the [Privacy & Security Model](../docs/concepts/privacy-security-model.md) for detailed information about data handling, anonymization, and user controls.

**Q: Can I delete my data?**
A: Yes. Users can view, export, and delete their data. Organizational data retention policies may apply to aggregated analytics.

## Technical

**Q: What are the system requirements?**
A: The platform is web-based and works on modern browsers. No installation required. Offline support for assessments is planned for future releases.

**Q: Is there an API?**
A: Yes. The platform provides REST and WebSocket APIs for integration with existing systems. See the [API Specification](../docs/05-data-api/23-api-specification.md) for details.

**Q: How does the platform scale?**
A: The architecture supports horizontal scaling from individual users to enterprise deployments with thousands of concurrent sessions. See [Scalability](scalability.md) for details.
