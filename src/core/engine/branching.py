from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from src.core.knowledge.taxonomy import ProficiencyLevel

logger = logging.getLogger(__name__)

_ROLLING_WINDOW: int = 5
_UPGRADE_THRESHOLD: float = 75.0
_DOWNGRADE_THRESHOLD: float = 35.0
_FOLLOW_UP_THRESHOLD: float = 30.0
_MASTERY_THRESHOLD: float = 80.0
_MASTERY_CONSECUTIVE: int = 3


class SessionState(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class QuestionRecord(BaseModel):
    question_id: str
    question_text: str
    domain: str
    skill: str
    difficulty: ProficiencyLevel
    score: float = Field(ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0)
    passed: bool
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    is_follow_up: bool = False

    model_config = {"frozen": True}


class SkillMasteryStatus(BaseModel):
    skill_name: str
    current_difficulty: ProficiencyLevel = ProficiencyLevel.BEGINNER
    questions_attempted: int = 0
    questions_passed: int = 0
    average_score: float = 0.0
    is_mastered: bool = False
    needs_remediation: bool = False

    model_config = {"frozen": True}


class AdaptiveSession(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    state: SessionState = SessionState.ACTIVE
    current_difficulty: ProficiencyLevel = ProficiencyLevel.BEGINNER
    questions: list[QuestionRecord] = Field(default_factory=list)
    skill_statuses: dict[str, SkillMasteryStatus] = Field(default_factory=dict)
    domain: str = ""
    started_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    completed_at: str = ""

    model_config = {"frozen": True}


class DifficultyAdjustment(BaseModel):
    new_difficulty: ProficiencyLevel
    adjustment_reason: str
    should_inject_follow_up: bool = False
    follow_up_skill: str = ""
    should_skip_skill: bool = False
    skipped_skill: str = ""

    model_config = {"frozen": True}


class AdaptiveSessionManagerError(Exception):
    """Raised when adaptive session operations fail."""


class AdaptiveSessionManager:
    """Manages a candidate's adaptive assessment session.

    Tracks question history and scores, dynamically adjusts difficulty,
    injects follow-up questions for weak answers, and skips questions
    when a candidate shows high proficiency in a skill.
    """

    def __init__(
        self,
        upgrade_threshold: float = _UPGRADE_THRESHOLD,
        downgrade_threshold: float = _DOWNGRADE_THRESHOLD,
        follow_up_threshold: float = _FOLLOW_UP_THRESHOLD,
        mastery_threshold: float = _MASTERY_THRESHOLD,
        mastery_consecutive: int = _MASTERY_CONSECUTIVE,
        rolling_window: int = _ROLLING_WINDOW,
    ) -> None:
        self._upgrade_threshold = upgrade_threshold
        self._downgrade_threshold = downgrade_threshold
        self._follow_up_threshold = follow_up_threshold
        self._mastery_threshold = mastery_threshold
        self._mastery_consecutive = mastery_consecutive
        self._rolling_window = rolling_window

    # ------------------------------------------------------------------
    # Session lifecycle
    # ------------------------------------------------------------------

    def start_session(
        self,
        domain: str,
        initial_difficulty: ProficiencyLevel = ProficiencyLevel.BEGINNER,
    ) -> AdaptiveSession:
        return AdaptiveSession(
            domain=domain,
            current_difficulty=initial_difficulty,
        )

    def complete_session(self, session: AdaptiveSession) -> AdaptiveSession:
        return AdaptiveSession(
            id=session.id,
            state=SessionState.COMPLETED,
            current_difficulty=session.current_difficulty,
            questions=session.questions,
            skill_statuses=session.skill_statuses,
            domain=session.domain,
            started_at=session.started_at,
            completed_at=datetime.now(timezone.utc).isoformat(),
        )

    # ------------------------------------------------------------------
    # Answer recording
    # ------------------------------------------------------------------

    def record_answer(
        self,
        session: AdaptiveSession,
        question_id: str,
        question_text: str,
        domain: str,
        skill: str,
        difficulty: ProficiencyLevel,
        score: float,
        confidence: float,
        passed: bool,
        is_follow_up: bool = False,
    ) -> AdaptiveSession:
        record = QuestionRecord(
            question_id=question_id,
            question_text=question_text,
            domain=domain,
            skill=skill,
            difficulty=difficulty,
            score=score,
            confidence=confidence,
            passed=passed,
            is_follow_up=is_follow_up,
        )

        updated_questions = list(session.questions) + [record]

        skill_statuses = dict(session.skill_statuses)
        self._update_skill_status(skill_statuses, skill, difficulty, score, passed)

        return AdaptiveSession(
            id=session.id,
            state=session.state,
            current_difficulty=session.current_difficulty,
            questions=updated_questions,
            skill_statuses=skill_statuses,
            domain=session.domain,
            started_at=session.started_at,
            completed_at=session.completed_at,
        )

    @staticmethod
    def _update_skill_status(
        skill_statuses: dict[str, SkillMasteryStatus],
        skill: str,
        difficulty: ProficiencyLevel,
        score: float,
        passed: bool,
    ) -> None:
        current = skill_statuses.get(skill)
        if current is None:
            total_score = score
            count = 1
            mastered = False
            remediation = False
        else:
            total_score = current.average_score * current.questions_attempted + score
            count = current.questions_attempted + 1
            mastered = current.is_mastered
            remediation = current.needs_remediation

        new_avg = round(total_score / count, 2) if count else 0.0
        new_passed = (
            current.questions_passed + (1 if passed else 0)
            if current
            else (1 if passed else 0)
        )

        skill_statuses[skill] = SkillMasteryStatus(
            skill_name=skill,
            current_difficulty=difficulty,
            questions_attempted=count,
            questions_passed=new_passed,
            average_score=new_avg,
            is_mastered=mastered,
            needs_remediation=remediation,
        )

    # ------------------------------------------------------------------
    # Difficulty adjustment
    # ------------------------------------------------------------------

    def compute_next_difficulty(
        self,
        session: AdaptiveSession,
        current_skill: str = "",
    ) -> DifficultyAdjustment:
        records = session.questions
        if not records:
            return DifficultyAdjustment(
                new_difficulty=session.current_difficulty,
                adjustment_reason="no_history",
            )

        recent = self._recent_records(records)
        avg_recent: float = (
            sum(r.score for r in recent) / len(recent) if recent else 0.0
        )

        inject_follow_up: bool = False
        follow_up_skill: str = ""
        for r in reversed(records):
            if r.score < self._follow_up_threshold and not r.is_follow_up:
                inject_follow_up = True
                follow_up_skill = r.skill
                break

        skip_skill: bool = False
        skipped: str = ""
        if current_skill:
            skill_records = [r for r in records if r.skill == current_skill]
            if len(skill_records) >= self._mastery_consecutive:
                recent_skill = skill_records[-self._mastery_consecutive :]
                if all(r.score >= self._mastery_threshold for r in recent_skill):
                    skip_skill = True
                    skipped = current_skill

        if skip_skill:
            return DifficultyAdjustment(
                new_difficulty=session.current_difficulty,
                adjustment_reason="skill_mastered",
                should_skip_skill=True,
                skipped_skill=skipped,
            )

        current = session.current_difficulty
        levels: list[ProficiencyLevel] = [
            ProficiencyLevel.BEGINNER,
            ProficiencyLevel.INTERMEDIATE,
            ProficiencyLevel.ADVANCED,
            ProficiencyLevel.EXPERT,
        ]
        current_idx: int = levels.index(current)

        new_difficulty = current
        reason = "maintained"

        if avg_recent >= self._upgrade_threshold and current_idx < len(levels) - 1:
            new_difficulty = levels[current_idx + 1]
            reason = "upgraded"
        elif avg_recent <= self._downgrade_threshold and current_idx > 0:
            new_difficulty = levels[current_idx - 1]
            reason = "downgraded"

        if inject_follow_up:
            if new_difficulty != ProficiencyLevel.BEGINNER:
                follow_up_diff = ProficiencyLevel(
                    levels[max(0, levels.index(new_difficulty) - 1)]
                )
            else:
                follow_up_diff = new_difficulty
            new_difficulty = follow_up_diff

        return DifficultyAdjustment(
            new_difficulty=new_difficulty,
            adjustment_reason=reason,
            should_inject_follow_up=inject_follow_up,
            follow_up_skill=follow_up_skill,
        )

    def _recent_records(self, records: list[QuestionRecord]) -> list[QuestionRecord]:
        if not records:
            return []
        return records[-self._rolling_window :]

    # ------------------------------------------------------------------
    # Summary helpers
    # ------------------------------------------------------------------

    def get_session_summary(self, session: AdaptiveSession) -> dict[str, Any]:
        total = len(session.questions)
        if total == 0:
            return {
                "session_id": session.id,
                "state": session.state.value,
                "domain": session.domain,
                "total_questions": 0,
                "average_score": 0.0,
                "skills_assessed": [],
                "mastered_skills": [],
                "remediation_skills": [],
                "difficulty_progression": [],
            }

        scores = [r.score for r in session.questions]
        difficulties = []
        for r in session.questions:
            if not difficulties or difficulties[-1] != r.difficulty:
                difficulties.append(r.difficulty)

        mastered = [
            s.skill_name for s in session.skill_statuses.values() if s.is_mastered
        ]
        remediation = [
            s.skill_name for s in session.skill_statuses.values() if s.needs_remediation
        ]

        return {
            "session_id": session.id,
            "state": session.state.value,
            "domain": session.domain,
            "total_questions": total,
            "average_score": round(sum(scores) / total, 2),
            "skills_assessed": list(session.skill_statuses.keys()),
            "mastered_skills": mastered,
            "remediation_skills": remediation,
            "difficulty_progression": [d.value for d in difficulties],
        }
