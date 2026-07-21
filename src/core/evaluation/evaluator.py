from __future__ import annotations

import json
import logging
import uuid
from typing import Any, Optional

from pydantic import BaseModel, Field

from src.core.ai.client import AIClient, AIClientError
from src.core.ai.prompt_loader import PromptLoader, PromptLoadError
from src.core.knowledge.rubrics import ScoringRubric
from src.core.knowledge.taxonomy import ProficiencyLevel

logger = logging.getLogger(__name__)


class CriterionScore(BaseModel):
    criterion_name: str
    score: int
    max_score: int
    justification: str
    passed: bool


class EvaluationResult(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    question_id: str = ""
    question_text: str = ""
    domain: str = ""
    skill: str = ""
    overall_score: float = 0.0
    criteria_scores: list[CriterionScore] = Field(default_factory=list)
    confidence: float = 0.0
    overall_justification: str = ""
    missing_concepts: list[str] = Field(default_factory=list)
    demonstrated_skills: list[str] = Field(default_factory=list)
    mitre_technique_ids: list[str] = Field(default_factory=list)
    proficiency_level: ProficiencyLevel = ProficiencyLevel.BEGINNER
    passed: bool = False


class AnswerEvaluatorError(Exception):
    """Raised when evaluation fails."""


class AnswerEvaluator:
    """Evaluates candidate answers against a scoring rubric using the AI pipeline."""

    def __init__(
        self,
        ai_client: AIClient,
        prompt_loader: PromptLoader,
    ) -> None:
        self._ai_client = ai_client
        self._prompt_loader = prompt_loader

    async def evaluate(
        self,
        question_text: str,
        candidate_answer: str,
        rubric: ScoringRubric,
        domain: str = "",
        skill: str = "",
    ) -> EvaluationResult:
        criteria_text: str = self._format_criteria(rubric)
        max_score: int = max((c.max_score for c in rubric.criteria), default=5)
        difficulty: str = rubric.difficulty

        variables: dict[str, Any] = {
            "question_text": question_text,
            "domain": domain,
            "skill": skill,
            "difficulty": difficulty,
            "criteria_text": criteria_text,
            "max_score": str(max_score),
            "candidate_answer": candidate_answer,
        }

        raw_response: str = await self._render_and_generate(variables)

        parsed: dict[str, Any] = self._safe_json_parse(raw_response)
        result: EvaluationResult = self._build_result(
            parsed, rubric, question_text, domain, skill, difficulty
        )
        return result

    async def _render_and_generate(
        self,
        variables: dict[str, Any],
    ) -> str:
        try:
            rendered: str = self._prompt_loader.render("evaluation_engine", variables)
        except PromptLoadError as exc:
            raise AnswerEvaluatorError(
                f"Failed to load evaluation template: {exc}"
            ) from exc

        try:
            raw: str = await self._ai_client.generate(
                prompt=rendered,
                schema=_EVALUATION_SCHEMA,
            )
        except AIClientError as exc:
            raise AnswerEvaluatorError(f"AI evaluation failed: {exc}") from exc

        return raw

    @staticmethod
    def _format_criteria(rubric: ScoringRubric) -> str:
        lines: list[str] = []
        for i, c in enumerate(rubric.criteria, 1):
            passing_pct: int = int(c.passing_threshold * 100)
            weight_pct: int = int(c.weight * 100)
            lines.append(
                f"{i}. {c.name} (weight={weight_pct}%, max_score={c.max_score}, "
                f"pass_at>={passing_pct}%): {c.description}"
            )
        return "\n".join(lines)

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
                raise AnswerEvaluatorError(
                    f"Expected a JSON object, got {type(data).__name__}"
                )
            return data
        except json.JSONDecodeError as exc:
            raise AnswerEvaluatorError(
                f"Failed to parse evaluation JSON: {exc}"
            ) from exc

    @staticmethod
    def _build_result(
        parsed: dict[str, Any],
        rubric: ScoringRubric,
        question_text: str,
        domain: str,
        skill: str,
        difficulty: str,
    ) -> EvaluationResult:
        raw_criteria: list[Any] = parsed.get("criteria_scores", [])
        criteria_scores: list[CriterionScore] = []
        for rc in rubric.criteria:
            match: Optional[dict[str, Any]] = None
            for raw_c in raw_criteria:
                if (
                    isinstance(raw_c, dict)
                    and raw_c.get("criterion_name", "").lower() == rc.name.lower()
                ):
                    match = raw_c
                    break
            if match is not None:
                score: int = int(match.get("score", 0))
                just: str = match.get("justification", "")
            else:
                score = 0
                just = "No explicit evaluation provided for this criterion."
            passed: bool = (
                (score / rc.max_score) >= rc.passing_threshold
                if rc.max_score > 0
                else False
            )
            criteria_scores.append(
                CriterionScore(
                    criterion_name=rc.name,
                    score=min(score, rc.max_score),
                    max_score=rc.max_score,
                    justification=just,
                    passed=passed,
                )
            )

        overall_score: float = max(
            0.0, min(100.0, float(parsed.get("overall_score", 0.0)))
        )
        confidence: float = max(0.0, min(1.0, float(parsed.get("confidence", 0.0))))

        level_str: str = parsed.get("proficiency_level", difficulty)
        try:
            proficiency_level: ProficiencyLevel = ProficiencyLevel(level_str.lower())
        except ValueError:
            proficiency_level = (
                ProficiencyLevel(difficulty)
                if difficulty in ("beginner", "intermediate", "advanced", "expert")
                else ProficiencyLevel.BEGINNER
            )

        passing_percentage: float = rubric.passing_percentage
        passed: bool = (
            (overall_score / rubric.total_score_possible) >= passing_percentage
            if rubric.total_score_possible > 0
            else False
        )

        missing: list[str] = []
        raw_missing: Any = parsed.get("missing_concepts")
        if isinstance(raw_missing, list):
            missing = [str(m) for m in raw_missing]

        skills: list[str] = []
        raw_skills: Any = parsed.get("demonstrated_skills")
        if isinstance(raw_skills, list):
            skills = [str(s) for s in raw_skills]

        mitre_ids: list[str] = []
        raw_mitre: Any = parsed.get("mitre_technique_ids")
        if isinstance(raw_mitre, list):
            mitre_ids = [str(m) for m in raw_mitre]

        return EvaluationResult(
            question_id="",
            question_text=question_text,
            domain=domain,
            skill=skill,
            overall_score=overall_score,
            criteria_scores=criteria_scores,
            confidence=confidence,
            overall_justification=parsed.get("overall_justification", ""),
            missing_concepts=missing,
            demonstrated_skills=skills,
            mitre_technique_ids=mitre_ids,
            proficiency_level=proficiency_level,
            passed=passed,
        )


_EVALUATION_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "overall_score": {"type": "number", "minimum": 0, "maximum": 100},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "overall_justification": {"type": "string"},
        "proficiency_level": {
            "type": "string",
            "enum": ["beginner", "intermediate", "advanced", "expert"],
        },
        "criteria_scores": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "criterion_name": {"type": "string"},
                    "score": {"type": "integer", "minimum": 0},
                    "justification": {"type": "string"},
                },
                "required": ["criterion_name", "score", "justification"],
            },
        },
        "missing_concepts": {
            "type": "array",
            "items": {"type": "string"},
        },
        "demonstrated_skills": {
            "type": "array",
            "items": {"type": "string"},
        },
        "mitre_technique_ids": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": [
        "overall_score",
        "confidence",
        "overall_justification",
        "proficiency_level",
        "criteria_scores",
    ],
}
