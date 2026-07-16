from __future__ import annotations

import json
import logging
import uuid
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from src.core.ai.client import AIClient, AIClientError
from src.core.ai.prompt_loader import PromptLoader, PromptLoadError
from src.core.knowledge.taxonomy import (
    CyberDomain,
    MitreTechnique,
    ProficiencyLevel,
    Skill,
)

logger = logging.getLogger(__name__)


class QuestionType(str, Enum):
    KNOWLEDGE = "knowledge"
    SCENARIO = "scenario"
    PRACTICAL = "practical"
    BEHAVIORAL = "behavioral"


class SkillAssessmentQuestion(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    type: QuestionType = QuestionType.SCENARIO
    question_text: str
    domain: str
    skill: str
    difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    expected_reasoning_points: list[str] = Field(default_factory=list)
    rubric_hints: list[str] = Field(default_factory=list)
    time_estimate_minutes: int = 10


class GeneratedQuestionSet(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    domain: str
    skill: str
    difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    questions: list[SkillAssessmentQuestion] = Field(default_factory=list)
    total_time_estimate_minutes: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)


class QuestionGeneratorError(Exception):
    """Raised when question generation fails."""


class QuestionGenerator:
    """Generates structured interview questions using the AI pipeline."""

    def __init__(
        self,
        ai_client: AIClient,
        prompt_loader: PromptLoader,
    ) -> None:
        self._ai_client = ai_client
        self._prompt_loader = prompt_loader

    async def generate_skill_assessment(
        self,
        domain: CyberDomain,
        skill: Skill,
        difficulty: ProficiencyLevel,
        question_count: int = 5,
    ) -> GeneratedQuestionSet:
        """Generate a set of skill assessment questions for a given domain and skill."""
        variables: dict[str, Any] = {
            "domain_name": domain.name,
            "domain_description": domain.description,
            "skill_name": skill.name,
            "skill_description": skill.description,
            "difficulty": difficulty.value,
            "question_count": str(question_count),
        }

        raw_response: str = await self._render_and_generate(
            template_name="skill_assessment",
            variables=variables,
            schema=_SKILL_ASSESSMENT_SCHEMA,
        )

        questions: list[SkillAssessmentQuestion] = self._parse_question_set(raw_response)
        total_time = sum(q.time_estimate_minutes for q in questions)

        return GeneratedQuestionSet(
            domain=domain.name,
            skill=skill.name,
            difficulty=difficulty,
            questions=questions,
            total_time_estimate_minutes=total_time or (question_count * 10),
            metadata={
                "domain_id": domain.id,
                "skill_id": skill.id,
                "template": "skill_assessment",
            },
        )

    async def generate_incident_scenario_question(
        self,
        technique: MitreTechnique,
        difficulty: ProficiencyLevel,
    ) -> SkillAssessmentQuestion:
        """Generate a single scenario question based on a MITRE technique."""
        tactic_name: str = technique.tactic.name if technique.tactic else "Unknown"

        variables: dict[str, Any] = {
            "technique_name": technique.name,
            "technique_id": technique.id,
            "tactic_name": tactic_name,
            "technique_description": technique.description,
            "difficulty": difficulty.value,
        }

        raw_response: str = await self._render_and_generate(
            template_name="incident_scenario",
            variables=variables,
            schema=_INCIDENT_SCENARIO_SCHEMA,
        )

        return self._parse_single_question(raw_response, technique.name, difficulty)

    async def _render_and_generate(
        self,
        template_name: str,
        variables: dict[str, Any],
        schema: dict[str, Any],
    ) -> str:
        """Render a prompt template and pass it through the AI client."""
        try:
            rendered: str = self._prompt_loader.render(template_name, variables)
        except PromptLoadError as exc:
            raise QuestionGeneratorError(
                f"Failed to load prompt template '{template_name}': {exc}"
            ) from exc

        try:
            raw: str = await self._ai_client.generate(
                prompt=rendered,
                schema=schema,
            )
        except AIClientError as exc:
            raise QuestionGeneratorError(
                f"AI generation failed for template '{template_name}': {exc}"
            ) from exc

        return raw

    def _parse_question_set(self, raw: str) -> list[SkillAssessmentQuestion]:
        """Parse the LLM JSON response into validated question models."""
        parsed: list[dict[str, Any]] = self._safe_json_parse(raw)

        if isinstance(parsed, dict):
            parsed = parsed.get("questions", parsed.get("question_set", [parsed]))

        if not isinstance(parsed, list):
            raise QuestionGeneratorError(
                f"Expected a list of questions, got {type(parsed).__name__}"
            )

        questions: list[SkillAssessmentQuestion] = []
        for item in parsed:
            try:
                questions.append(SkillAssessmentQuestion(**item))
            except Exception as exc:
                logger.warning("Skipping malformed question item: %s", exc)
                continue

        if not questions:
            raise QuestionGeneratorError(
                "No valid questions could be parsed from the LLM response"
            )

        return questions

    def _parse_single_question(
        self,
        raw: str,
        skill_fallback: str,
        difficulty_fallback: ProficiencyLevel,
    ) -> SkillAssessmentQuestion:
        """Parse a single question response from the LLM."""
        parsed: Any = self._safe_json_parse(raw)

        if isinstance(parsed, list):
            if parsed:
                parsed = parsed[0]
            else:
                parsed = {}

        assert isinstance(parsed, dict), f"Expected dict, got {type(parsed).__name__}"

        if "question_text" not in parsed:
            question_text = parsed.get("scenario", parsed.get("summary", raw[:200]))
            parsed["question_text"] = question_text

        parsed.setdefault("domain", "")
        parsed.setdefault("skill", skill_fallback)
        parsed.setdefault("difficulty", difficulty_fallback.value)

        try:
            return SkillAssessmentQuestion(**parsed)
        except Exception as exc:
            raise QuestionGeneratorError(
                f"Failed to parse question from LLM response: {exc}"
            ) from exc

    @staticmethod
    def _safe_json_parse(raw: str) -> Any:
        """Extract and parse JSON from an LLM response, handling markdown fences."""
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
            return json.loads(cleaned)
        except json.JSONDecodeError as exc:
            raise QuestionGeneratorError(
                f"Failed to parse LLM response as JSON: {exc}"
            ) from exc


_SKILL_ASSESSMENT_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["knowledge", "scenario", "practical", "behavioral"],
                    },
                    "question_text": {"type": "string"},
                    "domain": {"type": "string"},
                    "skill": {"type": "string"},
                    "difficulty": {
                        "type": "string",
                        "enum": ["beginner", "intermediate", "advanced", "expert"],
                    },
                    "expected_reasoning_points": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "rubric_hints": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "time_estimate_minutes": {"type": "integer"},
                },
                "required": ["question_text"],
            },
        }
    },
    "required": ["questions"],
}

_INCIDENT_SCENARIO_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "type": {
            "type": "string",
            "enum": ["knowledge", "scenario", "practical", "behavioral"],
        },
        "question_text": {"type": "string"},
        "domain": {"type": "string"},
        "skill": {"type": "string"},
        "difficulty": {
            "type": "string",
            "enum": ["beginner", "intermediate", "advanced", "expert"],
        },
        "expected_reasoning_points": {
            "type": "array",
            "items": {"type": "string"},
        },
        "rubric_hints": {
            "type": "array",
            "items": {"type": "string"},
        },
        "time_estimate_minutes": {"type": "integer"},
    },
    "required": ["question_text"],
}
