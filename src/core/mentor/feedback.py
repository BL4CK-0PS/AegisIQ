from __future__ import annotations

import json
import logging
import uuid
from typing import Any, Optional

from pydantic import BaseModel, Field

from src.core.ai.client import AIClient, AIClientError
from src.core.ai.prompt_loader import PromptLoader, PromptLoadError
from src.core.evaluation.evaluator import EvaluationResult
from src.core.knowledge.seed_data import SEED_MITRE_TECHNIQUES
from src.core.knowledge.taxonomy import MitreTechnique

logger = logging.getLogger(__name__)


class PrincipleEntry(BaseModel):
    principle: str
    explanation: str


class AnswerRepairGuide(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    question_text: str = ""
    domain: str = ""
    skill: str = ""
    mitre_technique: str = ""
    original_score: float = 0.0
    what_was_missing: list[str] = Field(default_factory=list)
    model_answer: str = ""
    model_answer_breakdown: list[str] = Field(default_factory=list)
    key_principles: list[PrincipleEntry] = Field(default_factory=list)
    practice_exercise: str = ""


class FeedbackError(Exception):
    """Raised when feedback generation fails."""


class FeedbackEngine:
    """Generates answer repair guides for weak responses."""

    def __init__(
        self,
        ai_client: AIClient,
        prompt_loader: PromptLoader,
    ) -> None:
        self._ai_client = ai_client
        self._prompt_loader = prompt_loader

    async def generate_answer_repair(
        self,
        question_text: str,
        candidate_answer: str,
        evaluation_result: EvaluationResult,
        domain: str = "",
        skill: str = "",
        mitre_technique_id: str = "",
    ) -> AnswerRepairGuide:
        technique_name: str = ""
        if mitre_technique_id:
            technique: Optional[MitreTechnique] = SEED_MITRE_TECHNIQUES.get(
                mitre_technique_id
            )
            if technique is not None:
                technique_name = f"{technique.name} ({technique.id})"

        missing_concepts_text: str = (
            "; ".join(evaluation_result.missing_concepts)
            if evaluation_result.missing_concepts
            else "None explicitly identified"
        )

        variables: dict[str, Any] = {
            "question_text": question_text,
            "domain": domain or evaluation_result.domain,
            "skill": skill or evaluation_result.skill,
            "mitre_technique": technique_name or "General cybersecurity",
            "difficulty": evaluation_result.proficiency_level.value,
            "score": str(round(evaluation_result.overall_score, 1)),
            "confidence": str(round(evaluation_result.confidence, 2)),
            "evaluation_summary": evaluation_result.overall_justification,
            "missing_concepts": missing_concepts_text,
            "candidate_answer": candidate_answer,
        }

        raw: str = await self._render_and_generate(variables)
        parsed: dict[str, Any] = self._safe_json_parse(raw)

        return self._build_guide(
            parsed, question_text, domain, skill, technique_name, evaluation_result
        )

    async def _render_and_generate(
        self,
        variables: dict[str, Any],
    ) -> str:
        try:
            rendered: str = self._prompt_loader.render("answer_repair", variables)
        except PromptLoadError as exc:
            raise FeedbackError(
                f"Failed to load answer repair template: {exc}"
            ) from exc
        try:
            raw: str = await self._ai_client.generate(
                prompt=rendered,
                schema=_ANSWER_REPAIR_SCHEMA,
            )
        except AIClientError as exc:
            raise FeedbackError(f"AI answer repair failed: {exc}") from exc
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
                raise FeedbackError(
                    f"Expected a JSON object, got {type(data).__name__}"
                )
            return data
        except json.JSONDecodeError as exc:
            raise FeedbackError(f"Failed to parse repair JSON: {exc}") from exc

    @staticmethod
    def _build_guide(
        parsed: dict[str, Any],
        question_text: str,
        domain: str,
        skill: str,
        mitre_technique: str,
        evaluation_result: EvaluationResult,
    ) -> AnswerRepairGuide:
        missing: list[str] = []
        raw_missing: Any = parsed.get(
            "what_was_missing", parsed.get("missing_elements", [])
        )
        if isinstance(raw_missing, list):
            missing = [str(m) for m in raw_missing]

        breakdown: list[str] = []
        raw_breakdown: Any = parsed.get(
            "model_answer_breakdown", parsed.get("answer_breakdown", [])
        )
        if isinstance(raw_breakdown, list):
            breakdown = [str(b) for b in raw_breakdown]

        principles: list[PrincipleEntry] = []
        raw_principles: Any = parsed.get("key_principles", [])
        if isinstance(raw_principles, list):
            for p in raw_principles:
                if isinstance(p, dict):
                    principles.append(
                        PrincipleEntry(
                            principle=str(p.get("principle", p.get("key", ""))),
                            explanation=str(p.get("explanation", p.get("detail", ""))),
                        )
                    )
                elif isinstance(p, str):
                    principles.append(PrincipleEntry(principle=p, explanation=""))

        model_answer: str = parsed.get(
            "model_answer",
            parsed.get("perfect_answer", parsed.get("ideal_response", "")),
        )
        practice: str = parsed.get("practice_exercise", parsed.get("exercise", ""))

        return AnswerRepairGuide(
            question_text=question_text,
            domain=domain or evaluation_result.domain,
            skill=skill or evaluation_result.skill,
            mitre_technique=mitre_technique,
            original_score=evaluation_result.overall_score,
            what_was_missing=missing,
            model_answer=model_answer,
            model_answer_breakdown=breakdown,
            key_principles=principles,
            practice_exercise=practice,
        )


_ANSWER_REPAIR_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "what_was_missing": {
            "type": "array",
            "items": {"type": "string"},
        },
        "model_answer": {"type": "string"},
        "model_answer_breakdown": {
            "type": "array",
            "items": {"type": "string"},
        },
        "key_principles": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "principle": {"type": "string"},
                    "explanation": {"type": "string"},
                },
                "required": ["principle"],
            },
        },
        "practice_exercise": {"type": "string"},
    },
    "required": ["what_was_missing", "model_answer"],
}
