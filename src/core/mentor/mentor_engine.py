from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, Field

from src.core.ai.client import AIClient, AIClientError
from src.core.ai.prompt_loader import PromptLoader, PromptLoadError
from src.core.evaluation.dna_engine import ConsolidatedProfile, WeaknessEntry
from src.core.evaluation.evaluator import EvaluationResult
from src.core.knowledge.seed_data import SEED_MITRE_TECHNIQUES
from src.core.knowledge.taxonomy import MitreTechnique, ProficiencyLevel

logger = logging.getLogger(__name__)


class LearningStep(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    week: int
    topic: str
    description: str
    resource_type: str = "course"
    resource_hint: str = ""
    time_estimate_hours: float = 2.0
    priority: str = "medium"
    milestone_check: str = ""


class LearningMilestone(BaseModel):
    week: int
    description: str
    validation_criteria: str = ""


class LabRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    title: str
    platform: str = "self-hosted"
    difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    mitre_technique_ids: list[str] = Field(default_factory=list)
    description: str = ""
    skills_practiced: list[str] = Field(default_factory=list)
    estimated_duration_minutes: int = 60
    url: str = ""


class LearningRoadmap(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    candidate_label: str = "Anonymous"
    overall_score: float = 0.0
    proficiency_level: ProficiencyLevel = ProficiencyLevel.BEGINNER
    timeline_weeks: int = 8
    steps: list[LearningStep] = Field(default_factory=list)
    milestones: list[LearningMilestone] = Field(default_factory=list)
    labs: list[LabRecommendation] = Field(default_factory=list)
    focus_areas: list[str] = Field(default_factory=list)
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AIMentorError(Exception):
    """Raised when mentor engine operations fail."""


class AIMentorEngine:
    """Generates personalised learning roadmaps and lab recommendations."""

    def __init__(
        self,
        ai_client: AIClient,
        prompt_loader: PromptLoader,
    ) -> None:
        self._ai_client = ai_client
        self._prompt_loader = prompt_loader

    async def generate_roadmap(
        self,
        profile: ConsolidatedProfile,
        timeline_weeks: int = 8,
        candidate_label: str = "Anonymous",
    ) -> LearningRoadmap:
        weak_areas_text: str = "; ".join(
            f"{w.skill_name} (score={w.average_score})" for w in profile.weaknesses
        ) if profile.weaknesses else "None identified"

        missing_text: str = "; ".join(profile.missing_concepts) if profile.missing_concepts else "None identified"
        skills_text: str = "; ".join(profile.demonstrated_skills) if profile.demonstrated_skills else "None recorded"

        variables: dict[str, Any] = {
            "overall_score": str(round(profile.overall_average_score, 1)),
            "confidence": str(round(profile.overall_confidence, 2)),
            "proficiency_level": CapabilityEngine._score_to_level(profile.overall_average_score).value,
            "demonstrated_skills": skills_text,
            "missing_concepts": missing_text,
            "weakness_areas": weak_areas_text,
            "timeline_weeks": str(timeline_weeks),
        }

        raw: str = await self._render_and_generate("mentor_guidance", variables)
        parsed: dict[str, Any] = self._safe_json_parse(raw)

        steps: list[LearningStep] = self._parse_steps(parsed)
        milestones: list[LearningMilestone] = self._parse_milestones(parsed)
        labs: list[LabRecommendation] = self._generate_labs_from_template(profile)
        focus_areas: list[str] = [w.skill_name for w in profile.weaknesses] + profile.missing_concepts

        level: ProficiencyLevel = CapabilityEngine._score_to_level(profile.overall_average_score)

        return LearningRoadmap(
            candidate_label=candidate_label,
            overall_score=profile.overall_average_score,
            proficiency_level=level,
            timeline_weeks=timeline_weeks,
            steps=steps,
            milestones=milestones,
            labs=labs,
            focus_areas=focus_areas,
        )

    async def generate_lab_recommendations(
        self,
        profile: ConsolidatedProfile,
    ) -> list[LabRecommendation]:
        return self._generate_labs_from_template(profile)

    async def _render_and_generate(
        self,
        template_name: str,
        variables: dict[str, Any],
    ) -> str:
        try:
            rendered: str = self._prompt_loader.render(template_name, variables)
        except PromptLoadError as exc:
            raise AIMentorError(
                f"Failed to load template '{template_name}': {exc}"
            ) from exc
        try:
            raw: str = await self._ai_client.generate(
                prompt=rendered,
                schema=_MENTOR_SCHEMA,
            )
        except AIClientError as exc:
            raise AIMentorError(
                f"AI mentor generation failed: {exc}"
            ) from exc
        return raw

    @staticmethod
    def _safe_json_parse(raw: str) -> dict[str, Any]:
        cleaned: str = raw.strip()
        if cleaned.startswith("```"):
            lines: list[str] = cleaned.splitlines()
            start: int = 1 if lines[0].startswith("```") else 0
            end: int = -1 if lines[-1].strip() == "```" else len(lines)
            cleaned = "\n".join(lines[start:end]).strip()
        if cleaned.startswith("```"):
            first: int = cleaned.find("\n")
            if first != -1:
                cleaned = cleaned[first:].strip()
            last: int = cleaned.rfind("```")
            if last != -1:
                cleaned = cleaned[:last].strip()
        try:
            data: Any = json.loads(cleaned)
            if not isinstance(data, dict):
                raise AIMentorError(f"Expected a JSON object, got {type(data).__name__}")
            return data
        except json.JSONDecodeError as exc:
            raise AIMentorError(f"Failed to parse mentor JSON: {exc}") from exc

    @staticmethod
    def _parse_steps(parsed: dict[str, Any]) -> list[LearningStep]:
        raw_steps: Any = parsed.get("steps", parsed.get("learning_steps", []))
        if not isinstance(raw_steps, list):
            return []
        steps: list[LearningStep] = []
        for i, item in enumerate(raw_steps):
            if not isinstance(item, dict):
                continue
            try:
                steps.append(
                    LearningStep(
                        week=int(item.get("week", (i // 3) + 1)),
                        topic=str(item.get("topic", f"Step {i + 1}")),
                        description=str(item.get("description", "")),
                        resource_type=str(item.get("resource_type", "course")),
                        resource_hint=str(item.get("resource_hint", "")),
                        time_estimate_hours=float(item.get("time_estimate_hours", 2.0)),
                        priority=str(item.get("priority", "medium")),
                        milestone_check=str(item.get("milestone_check", "")),
                    )
                )
            except (ValueError, TypeError) as exc:
                logger.warning("Skipping malformed learning step %d: %s", i, exc)
                continue
        return steps

    @staticmethod
    def _parse_milestones(parsed: dict[str, Any]) -> list[LearningMilestone]:
        raw_milestones: Any = parsed.get("milestones", [])
        if not isinstance(raw_milestones, list):
            return []
        milestones: list[LearningMilestone] = []
        for item in raw_milestones:
            if not isinstance(item, dict):
                continue
            try:
                milestones.append(
                    LearningMilestone(
                        week=int(item.get("week", 1)),
                        description=str(item.get("description", "")),
                        validation_criteria=str(item.get("validation_criteria", "")),
                    )
                )
            except (ValueError, TypeError):
                continue
        return milestones

    @staticmethod
    def _generate_labs_from_template(
        profile: ConsolidatedProfile,
    ) -> list[LabRecommendation]:
        labs: list[LabRecommendation] = []

        for weakness in profile.weaknesses:
            skill_lower: str = weakness.skill_name.lower()
            lab: Optional[LabRecommendation] = None

            if "injection" in skill_lower or "sqli" in skill_lower or "xss" in skill_lower:
                lab = LabRecommendation(
                    title=f"Web Security: {weakness.skill_name} Lab",
                    platform="PortSwigger Web Security Academy",
                    difficulty=ProficiencyLevel.INTERMEDIATE,
                    mitre_technique_ids=["T1190"],
                    description=f"Practice {weakness.skill_name} through guided exercises on intentionally vulnerable web applications.",
                    skills_practiced=[weakness.skill_name, "Web vulnerability assessment"],
                    estimated_duration_minutes=90,
                    url="https://portswigger.net/web-security",
                )

            elif "phishing" in skill_lower or "social" in skill_lower:
                lab = LabRecommendation(
                    title=f"Social Engineering: {weakness.skill_name} Lab",
                    platform="TryHackMe",
                    difficulty=ProficiencyLevel.BEGINNER,
                    mitre_technique_ids=["T1566"],
                    description=f"Simulate a phishing investigation and learn to analyse email headers and malicious attachments.",
                    skills_practiced=[weakness.skill_name, "Email analysis", "Phishing detection"],
                    estimated_duration_minutes=60,
                    url="https://tryhackme.com",
                )

            elif "ransomware" in skill_lower or "malware" in skill_lower:
                lab = LabRecommendation(
                    title=f"Malware Analysis: {weakness.skill_name} Lab",
                    platform="HackTheBox / ANY.RUN",
                    difficulty=ProficiencyLevel.ADVANCED,
                    mitre_technique_ids=["T1486"],
                    description=f"Analyse a ransomware sample in a sandboxed environment and document the full infection chain.",
                    skills_practiced=[weakness.skill_name, "Malware analysis", "Threat hunting"],
                    estimated_duration_minutes=120,
                    url="https://www.hackthebox.com",
                )

            elif "packet" in skill_lower or "network" in skill_lower or "traffic" in skill_lower:
                lab = LabRecommendation(
                    title=f"Network Forensics: {weakness.skill_name} Lab",
                    platform="Blue Team Labs Online",
                    difficulty=ProficiencyLevel.INTERMEDIATE,
                    mitre_technique_ids=["T1046"],
                    description=f"Analyse packet capture files to identify scanning, exploitation, and C2 traffic.",
                    skills_practiced=[weakness.skill_name, "Wireshark analysis", "Traffic analysis"],
                    estimated_duration_minutes=75,
                    url="https://blueteamlabs.online",
                )

            elif "powershell" in skill_lower or "lolbas" in skill_lower:
                lab = LabRecommendation(
                    title=f"LOLBAS Detection: {weakness.skill_name} Lab",
                    platform="DetectionLab / Caldera",
                    difficulty=ProficiencyLevel.ADVANCED,
                    mitre_technique_ids=["T1059"],
                    description=f"Simulate PowerShell abuse scenarios and practise detecting malicious script execution.",
                    skills_practiced=[weakness.skill_name, "PowerShell analysis", "EDR detection"],
                    estimated_duration_minutes=90,
                    url="https://detectionlab.network",
                )

            elif "forensic" in skill_lower or "acquisition" in skill_lower or "memory" in skill_lower:
                lab = LabRecommendation(
                    title=f"Digital Forensics: {weakness.skill_name} Lab",
                    platform="DFIR Madness / MemLabs",
                    difficulty=ProficiencyLevel.ADVANCED,
                    mitre_technique_ids=["T1055"],
                    description=f"Acquire and analyse forensic images including memory dumps and disk images.",
                    skills_practiced=[weakness.skill_name, "Memory analysis", "Disk forensics"],
                    estimated_duration_minutes=120,
                    url="https://dfirmadness.com",
                )

            else:
                lab = LabRecommendation(
                    title=f"Guided Practice: {weakness.skill_name}",
                    platform="PWNDORA Labs",
                    difficulty=ProficiencyLevel.INTERMEDIATE,
                    description=f"Focused exercises to build proficiency in {weakness.skill_name}.",
                    skills_practiced=[weakness.skill_name],
                    estimated_duration_minutes=60,
                )

            if lab is not None:
                labs.append(lab)

        for mitre_id in profile.detected_mitre_techniques:
            technique: Optional[MitreTechnique] = SEED_MITRE_TECHNIQUES.get(mitre_id)
            if technique is not None and not any(
                mitre_id in lab.mitre_technique_ids for lab in labs
            ):
                labs.append(
                    LabRecommendation(
                        title=f"MITRE {technique.name} ({mitre_id}) Drill",
                        platform="Atomic Red Team",
                        difficulty=ProficiencyLevel.INTERMEDIATE,
                        mitre_technique_ids=[mitre_id],
                        description=f"Execute and detect {technique.name} using Atomic Red Team tests in a lab environment.",
                        skills_practiced=[f"{technique.name} detection"],
                        estimated_duration_minutes=45,
                        url="https://github.com/redcanaryco/atomic-red-team",
                    )
                )

        return labs


class CapabilityEngine:
    @staticmethod
    def _score_to_level(score: float) -> ProficiencyLevel:
        if score >= 80:
            return ProficiencyLevel.EXPERT
        if score >= 65:
            return ProficiencyLevel.ADVANCED
        if score >= 45:
            return ProficiencyLevel.INTERMEDIATE
        return ProficiencyLevel.BEGINNER


_MENTOR_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "steps": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "week": {"type": "integer"},
                    "topic": {"type": "string"},
                    "description": {"type": "string"},
                    "resource_type": {
                        "type": "string",
                        "enum": ["course", "lab", "ctf", "book", "article", "video", "exercise"],
                    },
                    "resource_hint": {"type": "string"},
                    "time_estimate_hours": {"type": "number"},
                    "priority": {
                        "type": "string",
                        "enum": ["high", "medium", "low"],
                    },
                    "milestone_check": {"type": "string"},
                },
                "required": ["week", "topic", "description"],
            },
        },
        "milestones": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "week": {"type": "integer"},
                    "description": {"type": "string"},
                    "validation_criteria": {"type": "string"},
                },
                "required": ["week", "description"],
            },
        },
    },
    "required": ["steps"],
}
